import crypto from 'crypto';
import { Response, Router } from 'express';
import { AuthedRequest, requireRole } from '../auth';
import { createNotification, db } from '../db';

export function createAdminRouter(): Router {
  const router = Router();
  router.use(requireRole('admin', 'instructor'));

  // Operational overview metrics
  router.get('/overview', (_req: AuthedRequest, res: Response) => {
    const learners = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'learner'").get() as {
      c: number;
    };
    const confirmedEnrolments = db
      .prepare("SELECT COUNT(*) as c FROM enrolments WHERE status = 'Confirmed'")
      .get() as { c: number };
    const pendingPayments = db
      .prepare("SELECT COUNT(*) as c FROM payments WHERE status = 'Pending'")
      .get() as { c: number };
    const pendingSubmissions = db
      .prepare("SELECT COUNT(*) as c FROM submissions WHERE status IN ('Submitted', 'Under Review')")
      .get() as { c: number };
    const issuedCertificates = db
      .prepare("SELECT COUNT(*) as c FROM certificates WHERE status = 'Issued'")
      .get() as { c: number };
    const pendingScholarships = db
      .prepare("SELECT COUNT(*) as c FROM scholarship_applications WHERE status IN ('Submitted', 'Under Review')")
      .get() as { c: number };

    res.json({
      learnersCount: learners.c,
      confirmedEnrolmentsCount: confirmedEnrolments.c,
      pendingPaymentsCount: pendingPayments.c,
      pendingSubmissionsCount: pendingSubmissions.c,
      issuedCertificatesCount: issuedCertificates.c,
      pendingScholarshipsCount: pendingScholarships.c,
    });
  });

  // List & filter learners (admin only for user management, instructors can read roster)
  router.get('/learners', (req: AuthedRequest, res: Response) => {
    const search = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const statusFilter = typeof req.query.status === 'string' ? req.query.status.trim() : '';

    let sql = `
      SELECT u.id, u.email, u.role, u.status, u.email_verified, u.created_at,
             p.full_name, p.phone, p.country, p.city, p.profession,
             (SELECT COUNT(*) FROM enrolments e WHERE e.user_id = u.id AND e.status = 'Confirmed') as confirmed_courses_count,
             (SELECT COUNT(*) FROM certificates cert WHERE cert.user_id = u.id AND cert.status = 'Issued') as certificates_count
      FROM users u
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE u.role = 'learner'
    `;
    const params: string[] = [];

    if (search) {
      sql += ` AND (LOWER(u.email) LIKE LOWER(?) OR LOWER(p.full_name) LIKE LOWER(?))`;
      params.push(`%${search}%`, `%${search}%`);
    }
    if (statusFilter && ['active', 'suspended', 'deletion_requested'].includes(statusFilter)) {
      sql += ` AND u.status = ?`;
      params.push(statusFilter);
    }

    sql += ` ORDER BY u.created_at DESC LIMIT 200`;
    const learners = db.prepare(sql).all(...params);
    res.json({ learners });
  });

  // Suspend or activate learner account (admin only)
  router.patch('/learners/:id/status', requireRole('admin'), (req: AuthedRequest, res: Response) => {
    const targetId = req.params.id;
    const status = req.body?.status;
    if (status !== 'active' && status !== 'suspended') {
      res.status(400).json({ error: 'Status must be "active" or "suspended".' });
      return;
    }

    const row = db.prepare('SELECT id, role FROM users WHERE id = ?').get(targetId) as
      | { id: string; role: string }
      | undefined;
    if (!row || row.role !== 'learner') {
      res.status(404).json({ error: 'Learner account not found.' });
      return;
    }

    db.prepare('UPDATE users SET status = ?, updated_at = ? WHERE id = ?').run(
      status,
      new Date().toISOString(),
      targetId
    );
    if (status === 'suspended') {
      db.prepare('UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL').run(
        new Date().toISOString(),
        targetId
      );
    }

    res.json({ ok: true, status });
  });

  // List enrolments & payments (admin only)
  router.get('/enrolments', requireRole('admin'), (req: AuthedRequest, res: Response) => {
    const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';
    let sql = `
      SELECT e.id, e.reference_id, e.user_id, e.applicant_name, e.applicant_email,
             e.applicant_phone, e.course_code, c.title as course_title, c.max_seats,
             e.status as enrolment_status, e.enrolled_at, e.confirmed_at,
             p.id as payment_id, p.amount_display, p.payment_method, p.sender_phone,
             p.transaction_id, p.status as payment_status, p.verified_at
      FROM enrolments e
      JOIN courses c ON c.code = e.course_code
      LEFT JOIN payments p ON p.enrolment_id = e.id
    `;
    const params: string[] = [];
    if (status && ['Pending', 'Confirmed', 'Rejected', 'Cancelled'].includes(status)) {
      sql += ' WHERE e.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY e.created_at DESC LIMIT 300';
    const enrolments = db.prepare(sql).all(...params);
    res.json({ enrolments });
  });

  // Verify/approve or reject/refund an enrolment & payment (admin only, atomic seat cap check)
  router.post('/enrolments/:id/verify', requireRole('admin'), (req: AuthedRequest, res: Response) => {
    const enrolmentId = req.params.id;
    const action = req.body?.action as 'approve' | 'reject' | 'refund';
    if (!['approve', 'reject', 'refund'].includes(action)) {
      res.status(400).json({ error: 'Action must be "approve", "reject", or "refund".' });
      return;
    }

    const now = new Date().toISOString();
    db.exec('BEGIN IMMEDIATE');
    try {
      const enr = db
        .prepare(`
          SELECT e.id, e.user_id, e.course_code, e.status, e.reference_id,
                 c.title as course_title, c.max_seats, c.is_free
          FROM enrolments e
          JOIN courses c ON c.code = e.course_code
          WHERE e.id = ?
        `)
        .get(enrolmentId) as
        | {
            id: string;
            user_id: string | null;
            course_code: string;
            status: string;
            reference_id: string;
            course_title: string;
            max_seats: number | null;
            is_free: number;
          }
        | undefined;

      if (!enr) {
        db.exec('ROLLBACK');
        res.status(404).json({ error: 'Enrolment record not found.' });
        return;
      }

      if (action === 'approve') {
        if (enr.status !== 'Confirmed' && enr.max_seats !== null) {
          const confirmed = db
            .prepare("SELECT COUNT(*) as c FROM enrolments WHERE course_code = ? AND status = 'Confirmed'")
            .get(enr.course_code) as { c: number };
          if (confirmed.c >= enr.max_seats) {
            db.exec('ROLLBACK');
            res.status(409).json({
              error: `Seat capacity reached (${enr.max_seats}/${enr.max_seats}) for ${enr.course_code}. Increase capacity before confirming another learner.`,
            });
            return;
          }
        }

        db.prepare("UPDATE enrolments SET status = 'Confirmed', confirmed_at = ? WHERE id = ?").run(
          now,
          enr.id
        );
        db.prepare("UPDATE payments SET status = 'Paid', verified_by = ?, verified_at = ? WHERE enrolment_id = ?").run(
          req.authUser!.id,
          now,
          enr.id
        );

        if (enr.user_id) {
          createNotification({
            userId: enr.user_id,
            type: 'payment',
            title: `Enrolment Confirmed: ${enr.course_title}`,
            message: `Your payment (${enr.reference_id}) has been verified and access to the Learning Centre is now unlocked.`,
            link: `/dashboard/learning/${enr.course_code}`,
          });
        }
      } else if (action === 'reject') {
        db.prepare("UPDATE enrolments SET status = 'Rejected' WHERE id = ?").run(enr.id);
        db.prepare("UPDATE payments SET status = 'Failed', verified_by = ?, verified_at = ? WHERE enrolment_id = ?").run(
          req.authUser!.id,
          now,
          enr.id
        );

        if (enr.user_id) {
          createNotification({
            userId: enr.user_id,
            type: 'payment',
            title: `Payment Verification Failed: ${enr.course_title}`,
            message: `We could not verify Transaction ID for reference ${enr.reference_id}. Please check Payments History or contact support.`,
            link: '/dashboard/payments',
          });
        }
      } else if (action === 'refund') {
        db.prepare("UPDATE enrolments SET status = 'Cancelled' WHERE id = ?").run(enr.id);
        db.prepare("UPDATE payments SET status = 'Refunded', verified_by = ?, verified_at = ? WHERE enrolment_id = ?").run(
          req.authUser!.id,
          now,
          enr.id
        );

        if (enr.user_id) {
          createNotification({
            userId: enr.user_id,
            type: 'payment',
            title: `Payment Refunded: ${enr.course_title}`,
            message: `Reference ${enr.reference_id} has been marked as Refunded and enrolment access has been closed.`,
            link: '/dashboard/payments',
          });
        }
      }

      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }

    res.json({ ok: true, action });
  });

  // Courses capacity & certificate criteria
  router.get('/courses', (_req: AuthedRequest, res: Response) => {
    const courses = db
      .prepare(`
        SELECT c.*,
               (SELECT COUNT(*) FROM enrolments e WHERE e.course_code = c.code AND e.status = 'Confirmed') as confirmed_count,
               (SELECT COUNT(*) FROM course_modules m WHERE m.course_code = c.code AND m.is_published = 1) as published_modules_count,
               (SELECT COUNT(*) FROM lessons l WHERE l.course_code = c.code AND l.is_published = 1) as published_lessons_count
        FROM courses c
        ORDER BY c.category_slug, c.code
      `)
      .all();
    res.json({ courses });
  });

  router.patch('/courses/:code', requireRole('admin'), (req: AuthedRequest, res: Response) => {
    const code = req.params.code;
    const body = req.body || {};

    const existing = db.prepare('SELECT code, max_seats FROM courses WHERE code = ?').get(code) as
      | { code: string; max_seats: number | null }
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Course not found.' });
      return;
    }

    const maxSeats =
      body.maxSeats === null
        ? null
        : typeof body.maxSeats === 'number' && Number.isInteger(body.maxSeats) && body.maxSeats >= 0
        ? body.maxSeats
        : existing.max_seats;

    const isPublished =
      typeof body.isPublished === 'boolean' ? (body.isPublished ? 1 : 0) : null;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE courses
      SET max_seats = ?,
          require_lessons_complete = COALESCE(?, require_lessons_complete),
          require_assignments_complete = COALESCE(?, require_assignments_complete),
          require_quiz_pass = COALESCE(?, require_quiz_pass),
          min_quiz_score = COALESCE(?, min_quiz_score),
          is_published = COALESCE(?, is_published),
          updated_at = ?
      WHERE code = ?
    `).run(
      maxSeats,
      typeof body.requireLessonsComplete === 'boolean' ? (body.requireLessonsComplete ? 1 : 0) : null,
      typeof body.requireAssignmentsComplete === 'boolean'
        ? body.requireAssignmentsComplete
          ? 1
          : 0
        : null,
      typeof body.requireQuizPass === 'boolean' ? (body.requireQuizPass ? 1 : 0) : null,
      typeof body.minQuizScore === 'number' ? Math.max(0, Math.min(100, Math.round(body.minQuizScore))) : null,
      isPublished,
      now,
      code
    );

    if (isPublished !== null || typeof body.indexStatus === 'string') {
      const requestedIndex =
        isPublished === 0
          ? 'noindex'
          : body.indexStatus === 'noindex'
          ? 'noindex'
          : body.indexStatus === 'indexed'
          ? 'indexed'
          : null;

      db.prepare(`
        UPDATE course_seo_metadata
        SET is_published = COALESCE(?, is_published),
            index_status = COALESCE(?, index_status),
            last_optimized_at = ?
        WHERE course_code = ?
      `).run(isPublished, requestedIndex, now, code);
    }

    res.json({ ok: true });
  });

  // Course Content Builder (Modules, Lessons, Resources, Assignments, Quizzes)
  router.get('/courses/:code/content', (req: AuthedRequest, res: Response) => {
    const code = req.params.code;
    const modules = db
      .prepare('SELECT * FROM course_modules WHERE course_code = ? ORDER BY sort_order ASC, created_at ASC')
      .all(code);
    const lessons = db
      .prepare('SELECT * FROM lessons WHERE course_code = ? ORDER BY sort_order ASC, created_at ASC')
      .all(code);
    const resources = db
      .prepare('SELECT * FROM learning_resources WHERE course_code = ? ORDER BY created_at ASC')
      .all(code);
    const assignments = db
      .prepare('SELECT * FROM assignments WHERE course_code = ? ORDER BY created_at ASC')
      .all(code);
    const quizzes = db
      .prepare('SELECT * FROM quizzes WHERE course_code = ? ORDER BY created_at ASC')
      .all(code);

    res.json({ modules, lessons, resources, assignments, quizzes });
  });

  router.post('/courses/:code/modules', (req: AuthedRequest, res: Response) => {
    const code = req.params.code;
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const description = typeof req.body?.description === 'string' ? req.body.description.trim() : '';
    const sortOrder = Number(req.body?.sortOrder || 1);
    const isPublished = req.body?.isPublished !== false ? 1 : 0;

    if (title.length < 2) {
      res.status(400).json({ error: 'Module title is required.' });
      return;
    }

    const id = `mod_${crypto.randomBytes(6).toString('hex')}`;
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO course_modules (id, course_code, title, description, sort_order, is_published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, code, title, description, sortOrder, isPublished, now);

    res.status(201).json({ id, courseCode: code, title, isPublished: isPublished === 1 });
  });

  router.patch('/modules/:id', (req: AuthedRequest, res: Response) => {
    const { title, description, sortOrder, isPublished } = req.body || {};
    db.prepare(`
      UPDATE course_modules
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          sort_order = COALESCE(?, sort_order),
          is_published = COALESCE(?, is_published)
      WHERE id = ?
    `).run(
      typeof title === 'string' ? title.trim() : null,
      typeof description === 'string' ? description.trim() : null,
      typeof sortOrder === 'number' ? sortOrder : null,
      typeof isPublished === 'boolean' ? (isPublished ? 1 : 0) : null,
      req.params.id
    );
    res.json({ ok: true });
  });

  router.delete('/modules/:id', (req: AuthedRequest, res: Response) => {
    db.prepare('DELETE FROM course_modules WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  });

  router.post('/modules/:moduleId/lessons', (req: AuthedRequest, res: Response) => {
    const moduleRow = db
      .prepare('SELECT id, course_code FROM course_modules WHERE id = ?')
      .get(req.params.moduleId) as { id: string; course_code: string } | undefined;

    if (!moduleRow) {
      res.status(404).json({ error: 'Module not found.' });
      return;
    }

    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const summary = typeof req.body?.summary === 'string' ? req.body.summary.trim() : '';
    const contentMarkdown =
      typeof req.body?.contentMarkdown === 'string' ? req.body.contentMarkdown.trim() : '';
    const videoUrl = typeof req.body?.videoUrl === 'string' ? req.body.videoUrl.trim() : '';
    const durationMinutes =
      typeof req.body?.durationMinutes === 'number' ? req.body.durationMinutes : null;
    const sortOrder = Number(req.body?.sortOrder || 1);
    const isPublished = req.body?.isPublished !== false ? 1 : 0;

    if (title.length < 2) {
      res.status(400).json({ error: 'Lesson title is required.' });
      return;
    }

    const id = `les_${crypto.randomBytes(6).toString('hex')}`;
    db.prepare(`
      INSERT INTO lessons (
        id, module_id, course_code, title, summary, content_markdown,
        video_url, duration_minutes, sort_order, is_published, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      moduleRow.id,
      moduleRow.course_code,
      title,
      summary,
      contentMarkdown,
      videoUrl,
      durationMinutes,
      sortOrder,
      isPublished,
      new Date().toISOString()
    );

    if (isPublished === 1) {
      const enrolledLearners = db
        .prepare("SELECT DISTINCT user_id FROM enrolments WHERE course_code = ? AND status = 'Confirmed' AND user_id IS NOT NULL")
        .all(moduleRow.course_code) as Array<{ user_id: string }>;
      for (const l of enrolledLearners) {
        createNotification({
          userId: l.user_id,
          type: 'material',
          title: `New Lesson Published (${moduleRow.course_code})`,
          message: `"${title}" is now available in your Learning Centre.`,
          link: `/dashboard/learning/${moduleRow.course_code}`,
        });
      }
    }

    res.status(201).json({ id, title, courseCode: moduleRow.course_code });
  });

  router.patch('/lessons/:id', (req: AuthedRequest, res: Response) => {
    const { title, summary, contentMarkdown, videoUrl, durationMinutes, isPublished } = req.body || {};
    db.prepare(`
      UPDATE lessons
      SET title = COALESCE(?, title),
          summary = COALESCE(?, summary),
          content_markdown = COALESCE(?, content_markdown),
          video_url = COALESCE(?, video_url),
          duration_minutes = COALESCE(?, duration_minutes),
          is_published = COALESCE(?, is_published)
      WHERE id = ?
    `).run(
      typeof title === 'string' ? title.trim() : null,
      typeof summary === 'string' ? summary.trim() : null,
      typeof contentMarkdown === 'string' ? contentMarkdown.trim() : null,
      typeof videoUrl === 'string' ? videoUrl.trim() : null,
      typeof durationMinutes === 'number' ? durationMinutes : null,
      typeof isPublished === 'boolean' ? (isPublished ? 1 : 0) : null,
      req.params.id
    );
    res.json({ ok: true });
  });

  router.delete('/lessons/:id', (req: AuthedRequest, res: Response) => {
    db.prepare('DELETE FROM lessons WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  });

  router.post('/courses/:code/resources', (req: AuthedRequest, res: Response) => {
    const code = req.params.code;
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const resourceType = ['pdf', 'link', 'exercise', 'note'].includes(req.body?.resourceType)
      ? req.body.resourceType
      : 'link';
    const fileUrl = typeof req.body?.fileUrl === 'string' ? req.body.fileUrl.trim() : '';
    const fileName = typeof req.body?.fileName === 'string' ? req.body.fileName.trim() : '';

    if (title.length < 2 || !fileUrl) {
      res.status(400).json({ error: 'Resource title and URL are required.' });
      return;
    }

    const id = `res_${crypto.randomBytes(6).toString('hex')}`;
    db.prepare(`
      INSERT INTO learning_resources (id, course_code, title, resource_type, file_url, file_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, code, title, resourceType, fileUrl, fileName, new Date().toISOString());

    res.status(201).json({ id, title });
  });

  router.delete('/resources/:id', (req: AuthedRequest, res: Response) => {
    db.prepare('DELETE FROM learning_resources WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  });

  // Assignments CRUD & Submission Review
  router.post('/courses/:code/assignments', (req: AuthedRequest, res: Response) => {
    const code = req.params.code;
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const instructions = typeof req.body?.instructions === 'string' ? req.body.instructions.trim() : '';
    const dueAt = typeof req.body?.dueAt === 'string' && req.body.dueAt ? req.body.dueAt : null;
    const maxPoints = Number(req.body?.maxPoints || 100);
    const allowFileUpload = req.body?.allowFileUpload !== false ? 1 : 0;
    const isPublished = req.body?.isPublished !== false ? 1 : 0;

    if (title.length < 2 || instructions.length < 5) {
      res.status(400).json({ error: 'Assignment title and instructions are required.' });
      return;
    }

    const id = `asg_${crypto.randomBytes(6).toString('hex')}`;
    db.prepare(`
      INSERT INTO assignments (
        id, course_code, title, instructions, due_at, max_points, allow_file_upload, is_published, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      code,
      title,
      instructions,
      dueAt,
      maxPoints,
      allowFileUpload,
      isPublished,
      new Date().toISOString()
    );

    if (isPublished === 1) {
      const enrolledLearners = db
        .prepare("SELECT DISTINCT user_id FROM enrolments WHERE course_code = ? AND status = 'Confirmed' AND user_id IS NOT NULL")
        .all(code) as Array<{ user_id: string }>;
      for (const l of enrolledLearners) {
        createNotification({
          userId: l.user_id,
          type: 'assignment',
          title: `New Assignment (${code})`,
          message: `"${title}" has been posted in your Assignments tab.`,
          link: '/dashboard/assignments',
        });
      }
    }

    res.status(201).json({ id, title });
  });

  router.delete('/assignments/:id', (req: AuthedRequest, res: Response) => {
    db.prepare('DELETE FROM assignments WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  });

  router.post('/courses/:code/quizzes', (req: AuthedRequest, res: Response) => {
    const code = req.params.code;
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const instructions = typeof req.body?.instructions === 'string' ? req.body.instructions.trim() : '';
    const passingScore = Math.max(1, Math.min(100, Number(req.body?.passingScore || 60)));
    const questions = Array.isArray(req.body?.questions) ? req.body.questions : [];
    const isPublished = req.body?.isPublished !== false ? 1 : 0;

    if (title.length < 2 || questions.length === 0) {
      res.status(400).json({ error: 'Quiz title and at least one question are required.' });
      return;
    }

    const id = `qiz_${crypto.randomBytes(6).toString('hex')}`;
    db.prepare(`
      INSERT INTO quizzes (id, course_code, title, instructions, passing_score, questions_json, is_published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      code,
      title,
      instructions,
      passingScore,
      JSON.stringify(questions),
      isPublished,
      new Date().toISOString()
    );

    res.status(201).json({ id, title });
  });

  router.delete('/quizzes/:id', (req: AuthedRequest, res: Response) => {
    db.prepare('DELETE FROM quizzes WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  });

  // View & Grade Submissions
  router.get('/submissions', (req: AuthedRequest, res: Response) => {
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    let sql = `
      SELECT s.id, s.assignment_id, a.title as assignment_title, a.course_code, a.max_points,
             s.user_id, p.full_name as learner_name, u.email as learner_email,
             s.submission_text, s.file_name, s.file_size, s.status, s.score, s.feedback,
             s.submitted_at, s.reviewed_at
      FROM submissions s
      JOIN assignments a ON a.id = s.assignment_id
      JOIN users u ON u.id = s.user_id
      LEFT JOIN user_profiles p ON p.user_id = u.id
    `;
    const params: string[] = [];
    if (status) {
      sql += ' WHERE s.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY s.submitted_at DESC LIMIT 200';
    res.json({ submissions: db.prepare(sql).all(...params) });
  });

  router.patch('/submissions/:id/review', (req: AuthedRequest, res: Response) => {
    const subId = req.params.id;
    const status = req.body?.status;
    const score = typeof req.body?.score === 'number' ? Math.round(req.body.score) : null;
    const feedback = typeof req.body?.feedback === 'string' ? req.body.feedback.trim() : '';

    if (!['Under Review', 'Reviewed', 'Revision Required'].includes(status)) {
      res.status(400).json({ error: 'Invalid review status.' });
      return;
    }

    const sub = db
      .prepare(`
        SELECT s.id, s.user_id, a.title as assignment_title
        FROM submissions s
        JOIN assignments a ON a.id = s.assignment_id
        WHERE s.id = ?
      `)
      .get(subId) as { id: string; user_id: string; assignment_title: string } | undefined;

    if (!sub) {
      res.status(404).json({ error: 'Submission not found.' });
      return;
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE submissions
      SET status = ?, score = ?, feedback = ?, reviewed_by = ?, reviewed_at = ?
      WHERE id = ?
    `).run(status, score, feedback, req.authUser!.id, now, subId);

    createNotification({
      userId: sub.user_id,
      type: 'assignment',
      title: `Submission ${status}: ${sub.assignment_title}`,
      message: feedback || `Your submission status has been updated to ${status}.`,
      link: '/dashboard/assignments',
    });

    res.json({ ok: true, status, reviewedAt: now });
  });

  // Certificates management (admin only)
  router.get('/certificates', requireRole('admin'), (_req: AuthedRequest, res: Response) => {
    const certificates = db
      .prepare(`
        SELECT cert.*, u.email as learner_email, c.title as course_title
        FROM certificates cert
        JOIN users u ON u.id = cert.user_id
        JOIN courses c ON c.code = cert.course_code
        ORDER BY cert.issued_at DESC
      `)
      .all();
    res.json({ certificates });
  });

  router.post('/certificates/issue', requireRole('admin'), (req: AuthedRequest, res: Response) => {
    const { userId, courseCode } = req.body || {};
    if (!userId || !courseCode) {
      res.status(400).json({ error: 'userId and courseCode are required.' });
      return;
    }

    const learner = db
      .prepare('SELECT u.id, p.full_name FROM users u LEFT JOIN user_profiles p ON p.user_id = u.id WHERE u.id = ?')
      .get(userId) as { id: string; full_name: string } | undefined;
    const course = db
      .prepare('SELECT code, title, category_name, certificate_label FROM courses WHERE code = ?')
      .get(courseCode) as
      | { code: string; title: string; category_name: string; certificate_label: string }
      | undefined;

    if (!learner || !course) {
      res.status(404).json({ error: 'Learner or course not found.' });
      return;
    }

    const confirmedEnr = db
      .prepare("SELECT id FROM enrolments WHERE user_id = ? AND course_code = ? AND status = 'Confirmed'")
      .get(userId, courseCode);
    if (!confirmedEnr) {
      res.status(400).json({ error: 'Learner does not have a confirmed enrolment for this course.' });
      return;
    }

    const existing = db
      .prepare('SELECT id, certificate_code FROM certificates WHERE user_id = ? AND course_code = ?')
      .get(userId, courseCode) as { id: string; certificate_code: string } | undefined;
    if (existing) {
      db.prepare("UPDATE certificates SET status = 'Issued', issued_by = ?, issued_at = ? WHERE id = ?").run(
        req.authUser!.id,
        new Date().toISOString(),
        existing.id
      );
      res.json({ id: existing.id, certificateCode: existing.certificate_code, reissued: true });
      return;
    }

    const certCode = `AAE-CERT-${new Date().getUTCFullYear()}-${crypto
      .randomBytes(3)
      .toString('hex')
      .toUpperCase()}`;
    const certId = `crt_${crypto.randomBytes(6).toString('hex')}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO certificates (
        id, certificate_code, user_id, course_code, certificate_title,
        holder_name, category_name, status, issued_by, issued_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Issued', ?, ?)
    `).run(
      certId,
      certCode,
      userId,
      course.code,
      course.certificate_label,
      learner.full_name,
      course.category_name,
      req.authUser!.id,
      now
    );

    createNotification({
      userId,
      type: 'certificate',
      title: `Certificate Issued: ${course.title}`,
      message: `Your ${course.certificate_label} (${certCode}) has been issued by Atlas AI Education.`,
      link: '/dashboard/certificates',
    });

    res.status(201).json({ id: certId, certificateCode: certCode });
  });

  router.patch('/certificates/:id/status', requireRole('admin'), (req: AuthedRequest, res: Response) => {
    const status = req.body?.status;
    if (status !== 'Issued' && status !== 'Revoked') {
      res.status(400).json({ error: 'Certificate status must be "Issued" or "Revoked".' });
      return;
    }
    db.prepare('UPDATE certificates SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ ok: true, status });
  });

  // Broadcast or targeted notifications (admin only)
  router.post('/notifications/broadcast', requireRole('admin'), (req: AuthedRequest, res: Response) => {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    const targetUserId = typeof req.body?.targetUserId === 'string' ? req.body.targetUserId.trim() : '';
    const targetCourseCode =
      typeof req.body?.targetCourseCode === 'string' ? req.body.targetCourseCode.trim() : '';
    const link = typeof req.body?.link === 'string' ? req.body.link.trim() : '/dashboard';

    if (title.length < 3 || message.length < 5) {
      res.status(400).json({ error: 'Announcement title and message are required.' });
      return;
    }

    let recipients: Array<{ id: string }> = [];
    if (targetUserId) {
      recipients = db.prepare("SELECT id FROM users WHERE id = ? AND status = 'active'").all(targetUserId) as Array<{
        id: string;
      }>;
    } else if (targetCourseCode) {
      recipients = db
        .prepare("SELECT DISTINCT user_id as id FROM enrolments WHERE course_code = ? AND status = 'Confirmed' AND user_id IS NOT NULL")
        .all(targetCourseCode) as Array<{ id: string }>;
    } else {
      recipients = db.prepare("SELECT id FROM users WHERE role = 'learner' AND status = 'active'").all() as Array<{
        id: string;
      }>;
    }

    for (const r of recipients) {
      createNotification({
        userId: r.id,
        type: 'announcement',
        title,
        message,
        link,
      });
    }

    res.status(201).json({ ok: true, recipientCount: recipients.length });
  });

  // Scholarships Management (List & Review)
  router.get('/scholarships', (req: AuthedRequest, res: Response) => {
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const courseCode = typeof req.query.courseCode === 'string' ? req.query.courseCode : '';
    let sql = `
      SELECT s.id, s.reference_id, s.user_id, s.course_code, s.course_title,
             s.applicant_name, s.email, s.phone, s.education_or_profession,
             s.learning_motivation, s.financial_need_reason, s.commitment_statement,
             s.requested_waiver_pct, s.approved_waiver_pct, s.status, s.admin_notes,
             s.reviewed_by, s.reviewed_at, s.created_at,
             (SELECT COUNT(*) FROM scholarship_applications sa WHERE sa.course_code = s.course_code AND sa.status = 'Approved') as course_approved_scholarships_count
      FROM scholarship_applications s
    `;
    const params: string[] = [];
    const whereClauses: string[] = [];
    if (status) {
      whereClauses.push('s.status = ?');
      params.push(status);
    }
    if (courseCode) {
      whereClauses.push('s.course_code = ?');
      params.push(courseCode);
    }
    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }
    sql += ' ORDER BY s.created_at DESC LIMIT 200';

    const applications = db.prepare(sql).all(...params);
    res.json({ applications });
  });

  router.patch('/scholarships/:id', requireRole('admin'), (req: AuthedRequest, res: Response) => {
    const id = req.params.id;
    const body = req.body || {};
    const status = body.status;
    const adminNotes = typeof body.adminNotes === 'string' ? body.adminNotes.trim() : '';
    const approvedWaiverPct =
      typeof body.approvedWaiverPct === 'number'
        ? Math.max(10, Math.min(50, Math.round(body.approvedWaiverPct)))
        : null;

    if (!['Submitted', 'Under Review', 'Approved', 'Rejected', 'Waitlisted'].includes(status)) {
      res.status(400).json({ error: 'Invalid scholarship status.' });
      return;
    }

    const app = db
      .prepare('SELECT id, user_id, course_code, course_title, reference_id FROM scholarship_applications WHERE id = ?')
      .get(id) as { id: string; user_id: string | null; course_code: string; course_title: string; reference_id: string } | undefined;

    if (!app) {
      res.status(404).json({ error: 'Scholarship application not found.' });
      return;
    }

    if (status === 'Approved') {
      const approvedCount = db
        .prepare("SELECT COUNT(*) as c FROM scholarship_applications WHERE course_code = ? AND status = 'Approved' AND id != ?")
        .get(app.course_code, id) as { c: number };
      if (approvedCount.c >= 5) {
        res.status(409).json({
          error: `Scholarship limit reached (5/5 approved) for ${app.course_code}. You cannot approve more than 5 scholarships per course.`,
        });
        return;
      }
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE scholarship_applications
      SET status = ?, approved_waiver_pct = ?, admin_notes = ?, reviewed_by = ?, reviewed_at = ?
      WHERE id = ?
    `).run(status, status === 'Approved' ? (approvedWaiverPct || 50) : null, adminNotes, req.authUser!.id, now, id);

    if (app.user_id) {
      const msg =
        status === 'Approved'
          ? `Congratulations! Your scholarship application for ${app.course_title} (${app.reference_id}) has been Approved with a ${approvedWaiverPct || 50}% Course Fee Waiver.`
          : status === 'Waitlisted'
          ? `Your scholarship application for ${app.course_title} (${app.reference_id}) has been placed on the Waitlist.`
          : status === 'Rejected'
          ? `Your scholarship application for ${app.course_title} (${app.reference_id}) has been reviewed. Unfortunately, we could not allocate a waiver for this batch.`
          : `Your scholarship application for ${app.course_title} (${app.reference_id}) status is now ${status}.`;

      createNotification({
        userId: app.user_id,
        type: 'scholarship',
        title: `Scholarship Application Update: ${status}`,
        message: msg,
        link: '/scholarships',
      });
    }

    res.json({ ok: true, status, approvedWaiverPct: status === 'Approved' ? (approvedWaiverPct || 50) : null });
  });

  return router;
}
