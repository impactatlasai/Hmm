import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Response, Router } from 'express';
import { getCourseByCodeOrSlug } from '../../src/data/coursesData';
import { AuthedRequest, buildUserDto, getSavedItemsForUser, requireAuth } from '../auth';
import { AVATARS_DIR, SUBMISSIONS_DIR, createNotification, db } from '../db';

interface CourseProgressSummary {
  courseCode: string;
  totalPublishedLessons: number;
  completedLessonsCount: number;
  progressPercent: number;
  totalPublishedAssignments: number;
  reviewedAssignmentsCount: number;
  submittedAssignmentsCount: number;
  totalPublishedQuizzes: number;
  passedQuizzesCount: number;
  bestQuizScore: number | null;
  lastCompletedLessonId: string | null;
  nextLessonId: string | null;
  statusLabel: 'Not Started' | 'In Progress' | 'Completed';
}

function getCourseProgressForUser(userId: string, courseCode: string): CourseProgressSummary {
  const publishedLessons = db
    .prepare(`
      SELECT l.id
      FROM lessons l
      JOIN course_modules m ON m.id = l.module_id
      WHERE l.course_code = ? AND l.is_published = 1 AND m.is_published = 1
      ORDER BY m.sort_order ASC, l.sort_order ASC
    `)
    .all(courseCode) as Array<{ id: string }>;

  const completedRows = db
    .prepare(`
      SELECT lesson_id, completed_at
      FROM lesson_progress
      WHERE user_id = ? AND course_code = ?
      ORDER BY completed_at DESC
    `)
    .all(userId, courseCode) as Array<{ lesson_id: string; completed_at: string }>;

  const completedSet = new Set(completedRows.map((r) => r.lesson_id));
  const publishedLessonIds = publishedLessons.map((l) => l.id);
  const completedPublished = publishedLessonIds.filter((id) => completedSet.has(id));
  const totalPublishedLessons = publishedLessonIds.length;
  const completedLessonsCount = completedPublished.length;
  const progressPercent =
    totalPublishedLessons > 0 ? Math.round((completedLessonsCount / totalPublishedLessons) * 100) : 0;

  const assignmentsStats = db
    .prepare(`
      SELECT
        COUNT(a.id) as total_a,
        SUM(CASE WHEN s.status IN ('Submitted', 'Under Review', 'Reviewed', 'Revision Required') THEN 1 ELSE 0 END) as submitted_a,
        SUM(CASE WHEN s.status = 'Reviewed' THEN 1 ELSE 0 END) as reviewed_a
      FROM assignments a
      LEFT JOIN submissions s ON s.assignment_id = a.id AND s.user_id = ?
      WHERE a.course_code = ? AND a.is_published = 1
    `)
    .get(userId, courseCode) as {
    total_a: number;
    submitted_a: number | null;
    reviewed_a: number | null;
  };

  const quizStats = db
    .prepare(`
      SELECT
        COUNT(DISTINCT q.id) as total_q,
        COUNT(DISTINCT CASE WHEN qa.passed = 1 THEN q.id END) as passed_q,
        MAX(qa.score_percent) as best_score
      FROM quizzes q
      LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id AND qa.user_id = ?
      WHERE q.course_code = ? AND q.is_published = 1
    `)
    .get(userId, courseCode) as {
    total_q: number;
    passed_q: number | null;
    best_score: number | null;
  };

  const nextLesson = publishedLessons.find((l) => !completedSet.has(l.id)) || publishedLessons[0] || null;

  let statusLabel: 'Not Started' | 'In Progress' | 'Completed' = 'Not Started';
  if (totalPublishedLessons > 0 && completedLessonsCount >= totalPublishedLessons) {
    statusLabel = 'Completed';
  } else if (completedLessonsCount > 0 || (assignmentsStats.submitted_a || 0) > 0) {
    statusLabel = 'In Progress';
  }

  return {
    courseCode,
    totalPublishedLessons,
    completedLessonsCount,
    progressPercent,
    totalPublishedAssignments: assignmentsStats.total_a || 0,
    reviewedAssignmentsCount: assignmentsStats.reviewed_a || 0,
    submittedAssignmentsCount: assignmentsStats.submitted_a || 0,
    totalPublishedQuizzes: quizStats.total_q || 0,
    passedQuizzesCount: quizStats.passed_q || 0,
    bestQuizScore: quizStats.best_score ?? null,
    lastCompletedLessonId: completedRows[0]?.lesson_id || null,
    nextLessonId: nextLesson ? nextLesson.id : null,
    statusLabel,
  };
}

function evaluateCertificateEligibility(userId: string, courseCode: string) {
  const courseRow = db
    .prepare(`
      SELECT
        code, title, category_name, certificate_label,
        require_lessons_complete, require_assignments_complete,
        require_quiz_pass, min_quiz_score
      FROM courses WHERE code = ?
    `)
    .get(courseCode) as
    | {
        code: string;
        title: string;
        category_name: string;
        certificate_label: string;
        require_lessons_complete: number;
        require_assignments_complete: number;
        require_quiz_pass: number;
        min_quiz_score: number;
      }
    | undefined;

  if (!courseRow) return null;

  const progress = getCourseProgressForUser(userId, courseCode);
  const existingCert = db
    .prepare('SELECT id, certificate_code, status, issued_at FROM certificates WHERE user_id = ? AND course_code = ?')
    .get(userId, courseCode) as
    | { id: string; certificate_code: string; status: string; issued_at: string }
    | undefined;

  const hasPublishedLearningContent =
    progress.totalPublishedLessons > 0 ||
    progress.totalPublishedAssignments > 0 ||
    progress.totalPublishedQuizzes > 0;

  const reasons: string[] = [];
  if (!hasPublishedLearningContent) {
    reasons.push('Course learning & assessment materials are not yet published for automated completion.');
  }
  if (courseRow.require_lessons_complete === 1 && progress.totalPublishedLessons > 0 && progress.progressPercent < 100) {
    reasons.push(
      `Complete all published lessons (${progress.completedLessonsCount}/${progress.totalPublishedLessons}).`
    );
  }
  if (
    courseRow.require_assignments_complete === 1 &&
    progress.totalPublishedAssignments > 0 &&
    progress.reviewedAssignmentsCount < progress.totalPublishedAssignments
  ) {
    reasons.push(
      `Have all required assignments reviewed (${progress.reviewedAssignmentsCount}/${progress.totalPublishedAssignments}).`
    );
  }
  if (courseRow.require_quiz_pass === 1 && progress.totalPublishedQuizzes > 0) {
    const scoreOk = (progress.bestQuizScore ?? 0) >= courseRow.min_quiz_score;
    if (progress.passedQuizzesCount < progress.totalPublishedQuizzes || !scoreOk) {
      reasons.push(`Pass required quizzes with at least ${courseRow.min_quiz_score}%.`);
    }
  }

  return {
    courseCode: courseRow.code,
    courseTitle: courseRow.title,
    categoryName: courseRow.category_name,
    certificateLabel: courseRow.certificate_label,
    hasPublishedLearningContent,
    eligible: hasPublishedLearningContent && reasons.length === 0,
    unmetReasons: reasons,
    existingCertificate: existingCert || null,
    progress,
  };
}

export function createDashboardRouter(): Router {
  const router = Router();
  router.use(requireAuth);

  // Dashboard Overview
  router.get('/overview', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;

    const confirmedEnrolments = db
      .prepare(`
        SELECT e.id, e.reference_id, e.course_code, e.enrolled_at, e.confirmed_at, e.completed_at,
               c.title, c.category_slug, c.category_name, c.duration, c.fee_display, c.is_free, c.certificate_label
        FROM enrolments e
        JOIN courses c ON c.code = e.course_code
        WHERE e.user_id = ? AND e.status = 'Confirmed'
        ORDER BY COALESCE(e.confirmed_at, e.enrolled_at) DESC
      `)
      .all(userId) as Array<{
      id: string;
      reference_id: string;
      course_code: string;
      enrolled_at: string;
      confirmed_at: string | null;
      completed_at: string | null;
      title: string;
      category_slug: string;
      category_name: string;
      duration: string;
      fee_display: string;
      is_free: number;
      certificate_label: string;
    }>;

    const pendingEnrolments = db
      .prepare(`
        SELECT e.id, e.reference_id, e.course_code, e.status as enrolment_status, e.enrolled_at,
               c.title, c.category_name, c.fee_display, p.status as payment_status, p.transaction_id
        FROM enrolments e
        JOIN courses c ON c.code = e.course_code
        LEFT JOIN payments p ON p.enrolment_id = e.id
        WHERE e.user_id = ? AND e.status = 'Pending'
        ORDER BY e.enrolled_at DESC
      `)
      .all(userId);

    const coursesWithProgress = confirmedEnrolments.map((enr) => {
      const progress = getCourseProgressForUser(userId, enr.course_code);
      const catalogCourse = getCourseByCodeOrSlug(enr.course_code);
      return {
        ...enr,
        imageUrl: catalogCourse?.imageUrl || '',
        imageAlt: catalogCourse?.imageAlt || enr.title,
        ...progress,
      };
    });

    const certsCount = db
      .prepare("SELECT COUNT(*) as c FROM certificates WHERE user_id = ? AND status = 'Issued'")
      .get(userId) as { c: number };

    const pendingAssignments = db
      .prepare(`
        SELECT COUNT(a.id) as c
        FROM assignments a
        JOIN enrolments e ON e.course_code = a.course_code AND e.user_id = ? AND e.status = 'Confirmed'
        LEFT JOIN submissions s ON s.assignment_id = a.id AND s.user_id = ?
        WHERE a.is_published = 1 AND (s.id IS NULL OR s.status IN ('Pending', 'Revision Required'))
      `)
      .get(userId, userId) as { c: number };

    const recentNotifications = db
      .prepare(`
        SELECT id, type, title, message, link, is_read, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 5
      `)
      .all(userId);

    const unreadCount = db
      .prepare('SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND is_read = 0')
      .get(userId) as { c: number };

    const inProgressCount = coursesWithProgress.filter((c) => c.statusLabel === 'In Progress').length;
    const completedCount = coursesWithProgress.filter((c) => c.statusLabel === 'Completed').length;

    res.json({
      kpis: {
        enrolledCount: coursesWithProgress.length,
        inProgressCount,
        completedCount,
        certificatesCount: certsCount.c,
        pendingAssignmentsCount: pendingAssignments.c,
        unreadNotificationsCount: unreadCount.c,
      },
      continueLearning: coursesWithProgress,
      pendingEnrolments,
      recentNotifications,
      profileCompletion: req.authUser!.profileCompletion,
    });
  });

  // Profile get & update
  router.get('/profile', (req: AuthedRequest, res: Response) => {
    res.json({ user: buildUserDto(req.authUser!.id) });
  });

  router.put('/profile', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const body = req.body || {};

    const name = typeof body.name === 'string' ? body.name.trim() : req.authUser!.name;
    const phone = typeof body.phone === 'string' ? body.phone.trim() : req.authUser!.phone;
    const country = typeof body.country === 'string' ? body.country.trim() : req.authUser!.country;
    const city = typeof body.city === 'string' ? body.city.trim() : req.authUser!.city;
    const profession =
      typeof body.profession === 'string' ? body.profession.trim() : req.authUser!.profession;
    const organisation =
      typeof body.organisation === 'string' ? body.organisation.trim() : req.authUser!.organisation;
    const educationalBackground =
      typeof body.educationalBackground === 'string'
        ? body.educationalBackground.trim()
        : req.authUser!.educationalBackground;
    const linkedinUrl =
      typeof body.linkedinUrl === 'string' ? body.linkedinUrl.trim() : req.authUser!.linkedinUrl;
    const identity =
      typeof body.identity === 'string' ? body.identity.trim() : req.authUser!.identity;
    const bio =
      typeof body.bio === 'string' ? body.bio.trim().slice(0, 300) : req.authUser!.bio;
    const interests = Array.isArray(body.interests)
      ? body.interests.filter((x: unknown) => typeof x === 'string')
      : req.authUser!.interests;
    const emailUpdates =
      typeof body.emailUpdates === 'boolean' ? body.emailUpdates : req.authUser!.emailUpdates;
    const prefs =
      body.prefs && typeof body.prefs === 'object' ? body.prefs : req.authUser!.prefs;

    if (name.length < 2 || name.length > 120) {
      res.status(400).json({ error: 'Full name must be between 2 and 120 characters.' });
      return;
    }

    if (linkedinUrl && !/^https?:\/\/.+/i.test(linkedinUrl)) {
      res.status(400).json({ error: 'LinkedIn URL must start with http:// or https://.' });
      return;
    }

    db.prepare(`
      UPDATE user_profiles
      SET full_name = ?, phone = ?, country = ?, city = ?, profession = ?,
          organisation = ?, educational_background = ?, linkedin_url = ?,
          identity_role = ?, bio = ?, interests_json = ?, email_updates = ?,
          prefs_json = ?, updated_at = ?
      WHERE user_id = ?
    `).run(
      name,
      phone,
      country || 'Bangladesh',
      city,
      profession,
      organisation,
      educationalBackground,
      linkedinUrl,
      identity,
      bio,
      JSON.stringify(interests),
      emailUpdates ? 1 : 0,
      JSON.stringify(prefs),
      new Date().toISOString(),
      userId
    );

    res.json({
      user: buildUserDto(userId),
      message: 'Profile updated successfully.',
    });
  });

  // Avatar Upload (Validated base64 PNG/JPG/WEBP <= 2MB)
  router.post('/profile/avatar', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const mimeType = typeof req.body?.mimeType === 'string' ? req.body.mimeType.trim() : '';
    const dataBase64 = typeof req.body?.dataBase64 === 'string' ? req.body.dataBase64.trim() : '';

    const allowed: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/webp': 'webp',
    };
    const ext = allowed[mimeType];
    if (!ext || !dataBase64) {
      res.status(400).json({ error: 'Only PNG, JPEG, or WEBP profile images are supported.' });
      return;
    }

    const cleanedBase64 = dataBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
    const buffer = Buffer.from(cleanedBase64, 'base64');
    if (buffer.length === 0 || buffer.length > 2 * 1024 * 1024) {
      res.status(400).json({ error: 'Profile photograph must be under 2 MB.' });
      return;
    }

    // Magic byte verification
    const isPng = buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isJpg = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isWebp = buffer.length >= 12 && buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP';

    if ((ext === 'png' && !isPng) || (ext === 'jpg' && !isJpg) || (ext === 'webp' && !isWebp)) {
      res.status(400).json({ error: 'Uploaded file does not match its declared image format.' });
      return;
    }

    const filename = `${userId}_${crypto.randomBytes(6).toString('hex')}.${ext}`;
    const targetPath = path.join(AVATARS_DIR, filename);

    // Clean previous avatar if stored locally
    const prevAvatar = req.authUser!.avatarUrl;
    if (prevAvatar && prevAvatar.startsWith('/api/files/avatars/')) {
      const oldName = path.basename(prevAvatar);
      const oldPath = path.join(AVATARS_DIR, oldName);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch {
          // ignore
        }
      }
    }

    fs.writeFileSync(targetPath, buffer);
    const avatarUrl = `/api/files/avatars/${filename}`;
    db.prepare('UPDATE user_profiles SET avatar_url = ?, updated_at = ? WHERE user_id = ?').run(
      avatarUrl,
      new Date().toISOString(),
      userId
    );

    res.json({
      avatarUrl,
      user: buildUserDto(userId),
      message: 'Profile photograph updated.',
    });
  });

  // Enrolled Courses
  router.get('/courses', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const filter = typeof req.query.status === 'string' ? req.query.status : 'all';

    const confirmedRows = db
      .prepare(`
        SELECT e.id, e.reference_id, e.course_code, e.enrolled_at, e.confirmed_at, e.completed_at,
               c.title, c.category_slug, c.category_name, c.duration, c.fee_display, c.is_free, c.certificate_label
        FROM enrolments e
        JOIN courses c ON c.code = e.course_code
        WHERE e.user_id = ? AND e.status = 'Confirmed'
        ORDER BY COALESCE(e.confirmed_at, e.enrolled_at) DESC
      `)
      .all(userId) as Array<{
      id: string;
      reference_id: string;
      course_code: string;
      enrolled_at: string;
      confirmed_at: string | null;
      completed_at: string | null;
      title: string;
      category_slug: string;
      category_name: string;
      duration: string;
      fee_display: string;
      is_free: number;
      certificate_label: string;
    }>;

    const mapped = confirmedRows.map((enr) => {
      const progress = getCourseProgressForUser(userId, enr.course_code);
      const eligibility = evaluateCertificateEligibility(userId, enr.course_code);
      const catalogCourse = getCourseByCodeOrSlug(enr.course_code);
      return {
        ...enr,
        imageUrl: catalogCourse?.imageUrl || '',
        imageAlt: catalogCourse?.imageAlt || enr.title,
        ...progress,
        certificateEligible: eligibility?.eligible ?? false,
        existingCertificate: eligibility?.existingCertificate || null,
      };
    });

    const filtered = mapped.filter((c) => {
      if (filter === 'not_started') return c.statusLabel === 'Not Started';
      if (filter === 'in_progress') return c.statusLabel === 'In Progress';
      if (filter === 'completed') return c.statusLabel === 'Completed';
      return true;
    });

    const pendingRows = db
      .prepare(`
        SELECT e.id, e.reference_id, e.course_code, e.status as enrolment_status, e.enrolled_at,
               c.title, c.category_name, c.fee_display, p.payment_method, p.transaction_id, p.status as payment_status
        FROM enrolments e
        JOIN courses c ON c.code = e.course_code
        LEFT JOIN payments p ON p.enrolment_id = e.id
        WHERE e.user_id = ? AND e.status != 'Confirmed'
        ORDER BY e.enrolled_at DESC
      `)
      .all(userId);

    res.json({
      courses: filtered,
      allConfirmedCount: mapped.length,
      pendingOrOtherEnrolments: pendingRows,
    });
  });

  // Learning Centre Course Workspace
  router.get('/learning/:courseCode', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const courseCode = req.params.courseCode;

    const enrolment = db
      .prepare(`
        SELECT id, status, enrolled_at, confirmed_at
        FROM enrolments
        WHERE user_id = ? AND course_code = ?
        ORDER BY created_at DESC
        LIMIT 1
      `)
      .get(userId, courseCode) as
      | { id: string; status: string; enrolled_at: string; confirmed_at: string | null }
      | undefined;

    if (!enrolment) {
      res.status(403).json({
        error: 'You are not enrolled in this course. Enrol first to access learning materials.',
      });
      return;
    }

    if (enrolment.status !== 'Confirmed') {
      res.status(403).json({
        error:
          enrolment.status === 'Pending'
            ? 'Your enrolment is pending payment verification. Access will be unlocked once payment is confirmed.'
            : `This enrolment is currently marked as ${enrolment.status}.`,
        enrolmentStatus: enrolment.status,
      });
      return;
    }

    const catalogCourse = getCourseByCodeOrSlug(courseCode);
    const dbCourse = db
      .prepare('SELECT code, title, category_name, duration, certificate_label FROM courses WHERE code = ?')
      .get(courseCode) as {
      code: string;
      title: string;
      category_name: string;
      duration: string;
      certificate_label: string;
    };

    const modules = db
      .prepare(`
        SELECT id, title, description, sort_order
        FROM course_modules
        WHERE course_code = ? AND is_published = 1
        ORDER BY sort_order ASC, created_at ASC
      `)
      .all(courseCode) as Array<{
      id: string;
      title: string;
      description: string;
      sort_order: number;
    }>;

    const lessons = db
      .prepare(`
        SELECT id, module_id, title, summary, content_markdown, video_url, duration_minutes, sort_order
        FROM lessons
        WHERE course_code = ? AND is_published = 1
        ORDER BY sort_order ASC, created_at ASC
      `)
      .all(courseCode) as Array<{
      id: string;
      module_id: string;
      title: string;
      summary: string;
      content_markdown: string;
      video_url: string;
      duration_minutes: number | null;
      sort_order: number;
    }>;

    const resources = db
      .prepare(`
        SELECT id, lesson_id, title, resource_type, file_url, file_name, created_at
        FROM learning_resources
        WHERE course_code = ?
        ORDER BY created_at ASC
      `)
      .all(courseCode);

    const completedRows = db
      .prepare('SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND course_code = ?')
      .all(userId, courseCode) as Array<{ lesson_id: string }>;
    const bookmarkRows = db
      .prepare('SELECT lesson_id FROM lesson_bookmarks WHERE user_id = ?')
      .all(userId) as Array<{ lesson_id: string }>;

    const quizzesRaw = db
      .prepare(`
        SELECT id, title, instructions, passing_score, questions_json
        FROM quizzes
        WHERE course_code = ? AND is_published = 1
        ORDER BY created_at ASC
      `)
      .all(courseCode) as Array<{
      id: string;
      title: string;
      instructions: string;
      passing_score: number;
      questions_json: string;
    }>;

    // Strip correctIndex from quiz payload before sending to learner
    const quizzes = quizzesRaw.map((q) => {
      let questions: Array<{ id: string; prompt: string; options: string[] }> = [];
      try {
        const parsed = JSON.parse(q.questions_json || '[]');
        if (Array.isArray(parsed)) {
          questions = parsed.map((item, idx) => ({
            id: String(item.id || idx),
            prompt: String(item.prompt || ''),
            options: Array.isArray(item.options) ? item.options.map(String) : [],
          }));
        }
      } catch {
        questions = [];
      }
      const attempts = db
        .prepare(
          'SELECT id, score_percent, passed, submitted_at FROM quiz_attempts WHERE quiz_id = ? AND user_id = ? ORDER BY submitted_at DESC LIMIT 5'
        )
        .all(q.id, userId);

      return {
        id: q.id,
        title: q.title,
        instructions: q.instructions,
        passingScore: q.passing_score,
        questions,
        attempts,
      };
    });

    const structuredModules = modules.map((m) => ({
      ...m,
      lessons: lessons.filter((l) => l.module_id === m.id),
    }));

    const progress = getCourseProgressForUser(userId, courseCode);

    res.json({
      course: {
        ...dbCourse,
        overview: catalogCourse?.overview || '',
        imageUrl: catalogCourse?.imageUrl || '',
        syllabusOutline: catalogCourse?.modules || [],
      },
      modules: structuredModules,
      materialsComingSoon: structuredModules.every((m) => m.lessons.length === 0),
      resources,
      quizzes,
      completedLessonIds: completedRows.map((r) => r.lesson_id),
      bookmarkedLessonIds: bookmarkRows.map((r) => r.lesson_id),
      progress,
    });
  });

  // Mark lesson complete / incomplete
  router.post('/learning/lessons/:lessonId/complete', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const lessonId = req.params.lessonId;
    const completed = req.body?.completed !== false;

    const lesson = db
      .prepare(`
        SELECT l.id, l.course_code, l.title
        FROM lessons l
        JOIN course_modules m ON m.id = l.module_id
        WHERE l.id = ? AND l.is_published = 1 AND m.is_published = 1
      `)
      .get(lessonId) as { id: string; course_code: string; title: string } | undefined;

    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found or not published.' });
      return;
    }

    const enrolment = db
      .prepare("SELECT id FROM enrolments WHERE user_id = ? AND course_code = ? AND status = 'Confirmed'")
      .get(userId, lesson.course_code) as { id: string } | undefined;

    if (!enrolment) {
      res.status(403).json({ error: 'Confirmed enrolment is required to record lesson progress.' });
      return;
    }

    const now = new Date().toISOString();
    if (completed) {
      db.prepare(`
        INSERT OR IGNORE INTO lesson_progress (user_id, lesson_id, course_code, completed_at)
        VALUES (?, ?, ?, ?)
      `).run(userId, lessonId, lesson.course_code, now);
    } else {
      db.prepare('DELETE FROM lesson_progress WHERE user_id = ? AND lesson_id = ?').run(userId, lessonId);
    }

    const progress = getCourseProgressForUser(userId, lesson.course_code);
    if (progress.totalPublishedLessons > 0 && progress.progressPercent === 100) {
      db.prepare('UPDATE enrolments SET completed_at = COALESCE(completed_at, ?) WHERE id = ?').run(
        now,
        enrolment.id
      );
    }

    res.json({ ok: true, progress });
  });

  // Bookmark lesson
  router.post('/learning/lessons/:lessonId/bookmark', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const lessonId = req.params.lessonId;

    const existing = db
      .prepare('SELECT lesson_id FROM lesson_bookmarks WHERE user_id = ? AND lesson_id = ?')
      .get(userId, lessonId);

    if (existing) {
      db.prepare('DELETE FROM lesson_bookmarks WHERE user_id = ? AND lesson_id = ?').run(userId, lessonId);
      res.json({ bookmarked: false });
    } else {
      db.prepare('INSERT INTO lesson_bookmarks (user_id, lesson_id, created_at) VALUES (?, ?, ?)').run(
        userId,
        lessonId,
        new Date().toISOString()
      );
      res.json({ bookmarked: true });
    }
  });

  // Assignments & Quiz Assessments
  router.get('/assignments', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;

    const assignments = db
      .prepare(`
        SELECT a.id, a.course_code, c.title as course_title, a.title, a.instructions,
               a.due_at, a.max_points, a.allow_file_upload, a.created_at,
               s.id as submission_id, s.submission_text, s.file_name, s.file_size,
               s.status as submission_status, s.score, s.feedback, s.submitted_at, s.reviewed_at
        FROM assignments a
        JOIN courses c ON c.code = a.course_code
        JOIN enrolments e ON e.course_code = a.course_code AND e.user_id = ? AND e.status = 'Confirmed'
        LEFT JOIN submissions s ON s.assignment_id = a.id AND s.user_id = ?
        WHERE a.is_published = 1
        ORDER BY COALESCE(a.due_at, a.created_at) ASC
      `)
      .all(userId, userId);

    const quizHistory = db
      .prepare(`
        SELECT qa.id, qa.quiz_id, q.title as quiz_title, q.course_code, c.title as course_title,
               q.passing_score, qa.score_percent, qa.passed, qa.submitted_at
        FROM quiz_attempts qa
        JOIN quizzes q ON q.id = qa.quiz_id
        JOIN courses c ON c.code = q.course_code
        WHERE qa.user_id = ?
        ORDER BY qa.submitted_at DESC
      `)
      .all(userId);

    res.json({ assignments, quizHistory });
  });

  // Submit assignment (text + optional validated file)
  router.post('/assignments/:id/submit', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const assignmentId = req.params.id;
    const submissionText =
      typeof req.body?.submissionText === 'string' ? req.body.submissionText.trim() : '';
    const filePayload = req.body?.file as
      | { fileName?: string; mimeType?: string; dataBase64?: string }
      | undefined;

    const assignment = db
      .prepare('SELECT id, course_code, title, allow_file_upload FROM assignments WHERE id = ? AND is_published = 1')
      .get(assignmentId) as
      | { id: string; course_code: string; title: string; allow_file_upload: number }
      | undefined;

    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found or not currently open.' });
      return;
    }

    const enrolment = db
      .prepare("SELECT id FROM enrolments WHERE user_id = ? AND course_code = ? AND status = 'Confirmed'")
      .get(userId, assignment.course_code);
    if (!enrolment) {
      res.status(403).json({ error: 'Confirmed enrolment in this course is required to submit.' });
      return;
    }

    const existingSub = db
      .prepare('SELECT id, status, file_path FROM submissions WHERE assignment_id = ? AND user_id = ?')
      .get(assignmentId, userId) as
      | { id: string; status: string; file_path: string }
      | undefined;

    if (existingSub && existingSub.status === 'Reviewed') {
      res.status(403).json({
        error: 'This submission has already been reviewed and locked by an instructor.',
      });
      return;
    }

    let storedFilePath = existingSub?.file_path || '';
    let storedFileName = '';
    let storedFileSize = 0;
    let storedMime = '';

    if (filePayload && filePayload.dataBase64) {
      if (!assignment.allow_file_upload) {
        res.status(400).json({ error: 'File upload is not enabled for this assignment.' });
        return;
      }

      const rawName = typeof filePayload.fileName === 'string' ? path.basename(filePayload.fileName) : 'submission';
      const ext = path.extname(rawName).toLowerCase();
      const allowedExts = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg', '.zip'];
      if (!allowedExts.includes(ext)) {
        res.status(400).json({
          error: 'Unsupported file format. Allowed formats: PDF, DOC, DOCX, TXT, PNG, JPG, ZIP.',
        });
        return;
      }

      const cleaned = filePayload.dataBase64.replace(/^data:[^;]+;base64,/, '');
      const buf = Buffer.from(cleaned, 'base64');
      if (buf.length === 0 || buf.length > 5 * 1024 * 1024) {
        res.status(400).json({ error: 'Uploaded assignment file must be between 1 byte and 5 MB.' });
        return;
      }

      const safeDiskName = `${assignmentId}_${userId}_${crypto.randomBytes(4).toString('hex')}${ext}`;
      const diskPath = path.join(SUBMISSIONS_DIR, safeDiskName);
      fs.writeFileSync(diskPath, buf);

      storedFilePath = safeDiskName;
      storedFileName = rawName.slice(0, 120);
      storedFileSize = buf.length;
      storedMime = typeof filePayload.mimeType === 'string' ? filePayload.mimeType.slice(0, 100) : 'application/octet-stream';
    }

    if (submissionText.length < 10 && !storedFilePath) {
      res.status(400).json({
        error: 'Please enter a written response (at least 10 characters) or upload a valid file.',
      });
      return;
    }

    const now = new Date().toISOString();
    const subId = existingSub?.id || `sub_${crypto.randomBytes(6).toString('hex')}`;

    if (existingSub) {
      db.prepare(`
        UPDATE submissions
        SET submission_text = ?,
            file_path = CASE WHEN ? != '' THEN ? ELSE file_path END,
            file_name = CASE WHEN ? != '' THEN ? ELSE file_name END,
            file_size = CASE WHEN ? > 0 THEN ? ELSE file_size END,
            mime_type = CASE WHEN ? != '' THEN ? ELSE mime_type END,
            status = 'Submitted',
            submitted_at = ?
        WHERE id = ?
      `).run(
        submissionText,
        storedFileName,
        storedFilePath,
        storedFileName,
        storedFileName,
        storedFileSize,
        storedFileSize,
        storedMime,
        storedMime,
        now,
        subId
      );
    } else {
      db.prepare(`
        INSERT INTO submissions (
          id, assignment_id, user_id, submission_text, file_path, file_name,
          file_size, mime_type, status, submitted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?)
      `).run(
        subId,
        assignmentId,
        userId,
        submissionText,
        storedFilePath,
        storedFileName,
        storedFileSize,
        storedMime,
        now
      );
    }

    createNotification({
      userId,
      type: 'assignment',
      title: 'Assignment Submitted',
      message: `Your submission for "${assignment.title}" has been recorded and awaits instructor review.`,
      link: '/dashboard/assignments',
    });

    res.status(201).json({
      id: subId,
      status: 'Submitted',
      submittedAt: now,
      message: 'Assignment submitted successfully.',
    });
  });

  // Attempt Quiz
  router.post('/quizzes/:id/attempt', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const quizId = req.params.id;
    const answers = req.body?.answers as Record<string, number> | number[] | undefined;

    const quiz = db
      .prepare('SELECT id, course_code, title, passing_score, questions_json FROM quizzes WHERE id = ? AND is_published = 1')
      .get(quizId) as
      | {
          id: string;
          course_code: string;
          title: string;
          passing_score: number;
          questions_json: string;
        }
      | undefined;

    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found or not published.' });
      return;
    }

    const enrolment = db
      .prepare("SELECT id FROM enrolments WHERE user_id = ? AND course_code = ? AND status = 'Confirmed'")
      .get(userId, quiz.course_code);
    if (!enrolment) {
      res.status(403).json({ error: 'Confirmed enrolment is required to take this assessment.' });
      return;
    }

    let questions: Array<{ id?: string; prompt: string; options: string[]; correctIndex: number }> = [];
    try {
      questions = JSON.parse(quiz.questions_json || '[]');
    } catch {
      questions = [];
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      res.status(400).json({ error: 'This quiz currently has no published questions.' });
      return;
    }

    let correctCount = 0;
    questions.forEach((q, idx) => {
      const key = String(q.id || idx);
      const selected = Array.isArray(answers) ? answers[idx] : answers?.[key];
      if (typeof selected === 'number' && selected === q.correctIndex) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercent >= quiz.passing_score ? 1 : 0;
    const attemptId = `qat_${crypto.randomBytes(6).toString('hex')}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO quiz_attempts (id, quiz_id, user_id, answers_json, score_percent, passed, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(attemptId, quizId, userId, JSON.stringify(answers || {}), scorePercent, passed, now);

    createNotification({
      userId,
      type: 'assessment',
      title: `Quiz Result: ${quiz.title}`,
      message: `You scored ${scorePercent}% (${passed ? 'Passed' : 'Did not meet passing score'}).`,
      link: `/dashboard/learning/${quiz.course_code}`,
    });

    res.status(201).json({
      id: attemptId,
      scorePercent,
      passed: passed === 1,
      passingScore: quiz.passing_score,
      correctCount,
      totalQuestions: questions.length,
      submittedAt: now,
    });
  });

  // Certificates & Eligibility
  router.get('/certificates', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;

    const certificates = db
      .prepare(`
        SELECT cert.id, cert.certificate_code, cert.course_code, cert.certificate_title,
               cert.holder_name, cert.category_name, cert.status, cert.issued_at,
               c.duration
        FROM certificates cert
        JOIN courses c ON c.code = cert.course_code
        WHERE cert.user_id = ?
        ORDER BY cert.issued_at DESC
      `)
      .all(userId);

    const confirmedCourses = db
      .prepare("SELECT course_code FROM enrolments WHERE user_id = ? AND status = 'Confirmed'")
      .all(userId) as Array<{ course_code: string }>;

    const eligibility = confirmedCourses
      .map((r) => evaluateCertificateEligibility(userId, r.course_code))
      .filter(Boolean);

    res.json({ certificates, eligibility });
  });

  router.post('/certificates/:courseCode/request', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const courseCode = req.params.courseCode;

    const enrolment = db
      .prepare("SELECT id FROM enrolments WHERE user_id = ? AND course_code = ? AND status = 'Confirmed'")
      .get(userId, courseCode);
    if (!enrolment) {
      res.status(403).json({ error: 'Confirmed course enrolment is required before certificate issuance.' });
      return;
    }

    const evaluation = evaluateCertificateEligibility(userId, courseCode);
    if (!evaluation) {
      res.status(404).json({ error: 'Course not found.' });
      return;
    }

    if (evaluation.existingCertificate) {
      res.json({ certificate: evaluation.existingCertificate, alreadyIssued: true });
      return;
    }

    if (!evaluation.eligible) {
      res.status(400).json({
        error: 'Certificate criteria have not yet been met.',
        reasons: evaluation.unmetReasons,
      });
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
        holder_name, category_name, status, issued_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Issued', ?)
    `).run(
      certId,
      certCode,
      userId,
      courseCode,
      evaluation.certificateLabel,
      req.authUser!.name,
      evaluation.categoryName,
      now
    );

    createNotification({
      userId,
      type: 'certificate',
      title: 'Certificate Issued',
      message: `Your ${evaluation.certificateLabel} for ${evaluation.courseTitle} (${certCode}) is now available.`,
      link: '/dashboard/certificates',
    });

    res.status(201).json({
      certificate: {
        id: certId,
        certificate_code: certCode,
        course_code: courseCode,
        certificate_title: evaluation.certificateLabel,
        holder_name: req.authUser!.name,
        category_name: evaluation.categoryName,
        status: 'Issued',
        issued_at: now,
      },
    });
  });

  // Payments & Receipts
  router.get('/payments', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const rows = db
      .prepare(`
        SELECT p.id, p.reference_id, p.course_code, c.title as course_title, c.category_name,
               p.amount_display, p.amount_bdt, p.payment_method, p.payment_number,
               p.sender_phone, p.transaction_id, p.status as payment_status,
               p.verified_at, p.created_at, e.status as enrolment_status
        FROM payments p
        JOIN courses c ON c.code = p.course_code
        JOIN enrolments e ON e.id = p.enrolment_id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
      `)
      .all(userId);

    res.json({ payments: rows });
  });

  router.get('/payments/:referenceId/receipt', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const referenceId = req.params.referenceId;

    const row = db
      .prepare(`
        SELECT p.reference_id, p.course_code, c.title as course_title, c.category_name,
               p.amount_display, p.amount_bdt, p.payment_method, p.payment_number,
               p.transaction_id, p.status as payment_status, p.verified_at, p.created_at,
               e.applicant_name, e.applicant_email, e.status as enrolment_status
        FROM payments p
        JOIN courses c ON c.code = p.course_code
        JOIN enrolments e ON e.id = p.enrolment_id
        WHERE p.reference_id = ? AND p.user_id = ?
      `)
      .get(referenceId, userId) as
      | {
          reference_id: string;
          course_code: string;
          course_title: string;
          category_name: string;
          amount_display: string;
          amount_bdt: number;
          payment_method: string;
          payment_number: string;
          transaction_id: string;
          payment_status: string;
          verified_at: string | null;
          created_at: string;
          applicant_name: string;
          applicant_email: string;
          enrolment_status: string;
        }
      | undefined;

    if (!row) {
      res.status(404).json({ error: 'Receipt not found.' });
      return;
    }

    if (row.payment_status !== 'Paid' && row.payment_method !== 'free') {
      res.status(403).json({
        error: 'Official receipt is only available after payment verification is confirmed.',
      });
      return;
    }

    res.json({
      receipt: {
        ...row,
        issuer: 'Atlas AI Education (Atlas AI Institute)',
        disclosure: 'Non-accredited educational programme fee receipt. Verified internal reference.',
      },
    });
  });

  // Notifications
  router.get('/notifications', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const notifications = db
      .prepare(`
        SELECT id, type, title, message, link, is_read, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 100
      `)
      .all(userId);

    const unreadCount = db
      .prepare('SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND is_read = 0')
      .get(userId) as { c: number };

    res.json({ notifications, unreadCount: unreadCount.c });
  });

  router.post('/notifications/:id/read', (req: AuthedRequest, res: Response) => {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(
      req.params.id,
      req.authUser!.id
    );
    res.json({ ok: true });
  });

  router.post('/notifications/read-all', (req: AuthedRequest, res: Response) => {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0').run(
      req.authUser!.id
    );
    res.json({ ok: true });
  });

  // Saved bookmarks synced with DB
  router.post('/saved/:type/:key', (req: AuthedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const type = req.params.type;
    const key = req.params.key;

    if (type !== 'programme' && type !== 'resource') {
      res.status(400).json({ error: 'Invalid bookmark type.' });
      return;
    }

    const exists = db
      .prepare('SELECT item_key FROM saved_items WHERE user_id = ? AND item_type = ? AND item_key = ?')
      .get(userId, type, key);

    if (exists) {
      db.prepare('DELETE FROM saved_items WHERE user_id = ? AND item_type = ? AND item_key = ?').run(
        userId,
        type,
        key
      );
    } else {
      db.prepare('INSERT INTO saved_items (user_id, item_type, item_key, created_at) VALUES (?, ?, ?, ?)').run(
        userId,
        type,
        key,
        new Date().toISOString()
      );
    }

    res.json(getSavedItemsForUser(userId));
  });

  return router;
}
