import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { DatabaseSync } from 'node:sqlite';
import { COURSES, getCategoryEnrolmentInfo } from '../src/data/coursesData';
import {
  buildFoundationCourseSeoRecord,
  discoverFoundationCourses,
} from '../src/shared/foundationSeo';
import {
  buildAppliedAiCourseSeoRecord,
  discoverAppliedAiCourses,
} from '../src/shared/appliedAiSeo';
import {
  buildProfessionalDevCourseSeoRecord,
  discoverProfessionalDevCourses,
} from '../src/shared/professionalDevSeo';
import {
  buildAllSitePageSeoRecords,
  buildWomensSafetyCourseSeoRecord,
  discoverSpecialisedCourse,
} from '../src/shared/siteWideSeo';

export const DATA_DIR = path.resolve(process.cwd(), 'data');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
export const AVATARS_DIR = path.join(UPLOADS_DIR, 'avatars');
export const SUBMISSIONS_DIR = path.join(UPLOADS_DIR, 'submissions');
export const DB_PATH = path.join(DATA_DIR, 'atlas-lms.sqlite');

fs.mkdirSync(AVATARS_DIR, { recursive: true });
fs.mkdirSync(SUBMISSIONS_DIR, { recursive: true });

export const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'instructor', 'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deletion_requested')),
    email_verified INTEGER NOT NULL DEFAULT 0,
    email_verify_token_hash TEXT,
    email_verify_expires_at TEXT,
    reset_token_hash TEXT,
    reset_token_expires_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT 'Bangladesh',
    city TEXT NOT NULL DEFAULT '',
    profession TEXT NOT NULL DEFAULT '',
    organisation TEXT NOT NULL DEFAULT '',
    educational_background TEXT NOT NULL DEFAULT '',
    linkedin_url TEXT NOT NULL DEFAULT '',
    identity_role TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    interests_json TEXT NOT NULL DEFAULT '[]',
    email_updates INTEGER NOT NULL DEFAULT 0,
    prefs_json TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    user_agent TEXT NOT NULL DEFAULT '',
    ip TEXT NOT NULL DEFAULT '',
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    revoked_at TEXT
  );

  CREATE TABLE IF NOT EXISTS courses (
    code TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    category_name TEXT NOT NULL,
    fee_display TEXT NOT NULL,
    fee_bdt INTEGER NOT NULL DEFAULT 0,
    is_free INTEGER NOT NULL DEFAULT 0,
    duration TEXT NOT NULL,
    max_seats INTEGER,
    certificate_label TEXT NOT NULL DEFAULT '',
    require_lessons_complete INTEGER NOT NULL DEFAULT 1,
    require_assignments_complete INTEGER NOT NULL DEFAULT 0,
    require_quiz_pass INTEGER NOT NULL DEFAULT 0,
    min_quiz_score INTEGER NOT NULL DEFAULT 60,
    is_published INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS course_seo_metadata (
    course_code TEXT PRIMARY KEY REFERENCES courses(code) ON DELETE CASCADE,
    seo_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    canonical_url TEXT NOT NULL,
    og_title TEXT NOT NULL,
    og_description TEXT NOT NULL,
    og_image TEXT NOT NULL DEFAULT '',
    og_image_alt TEXT NOT NULL DEFAULT '',
    primary_keyword TEXT NOT NULL DEFAULT '',
    secondary_keywords TEXT NOT NULL DEFAULT '[]',
    semantic_topics TEXT NOT NULL DEFAULT '[]',
    search_intent TEXT NOT NULL DEFAULT '',
    intended_audience TEXT NOT NULL DEFAULT '[]',
    learning_level TEXT NOT NULL DEFAULT '',
    course_schema TEXT NOT NULL DEFAULT '{}',
    index_status TEXT NOT NULL DEFAULT 'indexed' CHECK (index_status IN ('indexed', 'noindex')),
    is_published INTEGER NOT NULL DEFAULT 1,
    last_optimized_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS page_seo_metadata (
    route_path TEXT PRIMARY KEY,
    page_type TEXT NOT NULL,
    page_title TEXT NOT NULL,
    seo_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    canonical_url TEXT NOT NULL,
    og_title TEXT NOT NULL,
    og_description TEXT NOT NULL,
    og_image TEXT NOT NULL DEFAULT '',
    og_image_alt TEXT NOT NULL DEFAULT '',
    primary_keyword TEXT NOT NULL DEFAULT '',
    secondary_keywords TEXT NOT NULL DEFAULT '[]',
    semantic_topics TEXT NOT NULL DEFAULT '[]',
    search_intent TEXT NOT NULL DEFAULT '',
    schema_type TEXT NOT NULL DEFAULT 'WebPage',
    schema_json TEXT NOT NULL DEFAULT '{}',
    index_status TEXT NOT NULL DEFAULT 'indexed' CHECK (index_status IN ('indexed', 'noindex')),
    is_published INTEGER NOT NULL DEFAULT 1,
    last_optimized_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS course_modules (
    id TEXT PRIMARY KEY,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 1,
    is_published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    content_markdown TEXT NOT NULL DEFAULT '',
    video_url TEXT NOT NULL DEFAULT '',
    duration_minutes INTEGER,
    sort_order INTEGER NOT NULL DEFAULT 1,
    is_published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS learning_resources (
    id TEXT PRIMARY KEY,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES lessons(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    resource_type TEXT NOT NULL DEFAULT 'pdf' CHECK (resource_type IN ('pdf', 'link', 'exercise', 'note')),
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS lesson_bookmarks (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, lesson_id)
  );

  CREATE TABLE IF NOT EXISTS enrolments (
    id TEXT PRIMARY KEY,
    reference_id TEXT NOT NULL UNIQUE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL COLLATE NOCASE,
    applicant_phone TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT 'Bangladesh',
    educational_background TEXT NOT NULL DEFAULT '',
    motivation TEXT NOT NULL DEFAULT '',
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    mode TEXT NOT NULL DEFAULT 'course-application',
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Rejected', 'Cancelled')),
    enrolled_at TEXT NOT NULL,
    confirmed_at TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS lesson_progress (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    completed_at TEXT NOT NULL,
    PRIMARY KEY (user_id, lesson_id)
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    module_id TEXT REFERENCES course_modules(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    due_at TEXT,
    max_points INTEGER NOT NULL DEFAULT 100,
    allow_file_upload INTEGER NOT NULL DEFAULT 1,
    is_published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submission_text TEXT NOT NULL DEFAULT '',
    file_path TEXT NOT NULL DEFAULT '',
    file_name TEXT NOT NULL DEFAULT '',
    file_size INTEGER NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Pending', 'Submitted', 'Under Review', 'Reviewed', 'Revision Required')),
    score INTEGER,
    feedback TEXT NOT NULL DEFAULT '',
    reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    submitted_at TEXT NOT NULL,
    reviewed_at TEXT,
    UNIQUE (assignment_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL DEFAULT '',
    passing_score INTEGER NOT NULL DEFAULT 60,
    questions_json TEXT NOT NULL DEFAULT '[]',
    is_published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS quiz_attempts (
    id TEXT PRIMARY KEY,
    quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    answers_json TEXT NOT NULL DEFAULT '[]',
    score_percent INTEGER NOT NULL DEFAULT 0,
    passed INTEGER NOT NULL DEFAULT 0,
    submitted_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    certificate_code TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    certificate_title TEXT NOT NULL,
    holder_name TEXT NOT NULL,
    category_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Issued' CHECK (status IN ('Issued', 'Revoked')),
    issued_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    issued_at TEXT NOT NULL,
    UNIQUE (user_id, course_code)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    reference_id TEXT NOT NULL UNIQUE,
    enrolment_id TEXT NOT NULL REFERENCES enrolments(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    amount_display TEXT NOT NULL,
    amount_bdt INTEGER NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('free', 'bkash', 'nagad')),
    payment_number TEXT NOT NULL DEFAULT '',
    sender_phone TEXT NOT NULL DEFAULT '',
    transaction_id TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
    verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    verified_at TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'system',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT NOT NULL DEFAULT '',
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS saved_items (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('programme', 'resource')),
    item_key TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, item_type, item_key)
  );

  CREATE TABLE IF NOT EXISTS account_deletion_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Pending Review',
    requested_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    reference_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS institutional_inquiries (
    reference_id TEXT PRIMARY KEY,
    service_slug TEXT NOT NULL,
    service_title TEXT NOT NULL,
    organisation_name TEXT NOT NULL,
    organisation_type TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    pathway TEXT NOT NULL DEFAULT '',
    sector TEXT NOT NULL DEFAULT '',
    requirements TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS scholarship_applications (
    id TEXT PRIMARY KEY,
    reference_id TEXT NOT NULL UNIQUE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    course_title TEXT NOT NULL,
    applicant_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    education_or_profession TEXT NOT NULL,
    learning_motivation TEXT NOT NULL,
    financial_need_reason TEXT NOT NULL,
    commitment_statement TEXT NOT NULL,
    requested_waiver_pct INTEGER NOT NULL DEFAULT 50,
    approved_waiver_pct INTEGER,
    status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Under Review', 'Approved', 'Rejected', 'Waitlisted')),
    admin_notes TEXT NOT NULL DEFAULT '',
    reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TEXT,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_enrolments_user ON enrolments(user_id);
  CREATE INDEX IF NOT EXISTS idx_enrolments_course ON enrolments(course_code, status);
  CREATE INDEX IF NOT EXISTS idx_scholarships_course ON scholarship_applications(course_code, status);
  CREATE INDEX IF NOT EXISTS idx_scholarships_user ON scholarship_applications(user_id);
  CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at);
  CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_code, is_published);
  CREATE INDEX IF NOT EXISTS idx_course_seo_status ON course_seo_metadata(index_status, is_published);
`);

// Safe migration for existing SQLite databases lacking is_published on courses
{
  const courseCols = db.prepare('PRAGMA table_info(courses)').all() as Array<{ name: string }>;
  if (!courseCols.some((c) => c.name === 'is_published')) {
    db.exec('ALTER TABLE courses ADD COLUMN is_published INTEGER NOT NULL DEFAULT 1;');
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, expectedHex] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function parseFeeBdt(fee: string, isFree: boolean): number {
  if (isFree) return 0;
  const digits = fee.replace(/[^0-9]/g, '');
  return digits ? Number(digits) : 0;
}

export function syncCatalogAndSeedUsers(): void {
  const now = new Date().toISOString();

  const existingCourseStmt = db.prepare('SELECT code, max_seats FROM courses WHERE code = ?');
  const upsertCourseStmt = db.prepare(`
    INSERT INTO courses (
      code, slug, title, category_slug, category_name, fee_display, fee_bdt, is_free,
      duration, max_seats, certificate_label, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(code) DO UPDATE SET
      slug = excluded.slug,
      title = excluded.title,
      category_slug = excluded.category_slug,
      category_name = excluded.category_name,
      fee_display = excluded.fee_display,
      fee_bdt = excluded.fee_bdt,
      is_free = excluded.is_free,
      duration = excluded.duration,
      certificate_label = excluded.certificate_label,
      updated_at = excluded.updated_at
  `);

  for (const course of COURSES) {
    const info = getCategoryEnrolmentInfo(course.categorySlug);
    const defaultMaxSeats = info ? info.seatCapacity : null;
    const certLabel = info
      ? info.certificateLabel
      : course.code === 'SP-WSAI'
      ? 'Certificate of Participation'
      : 'Completion Certificate';
    const existing = existingCourseStmt.get(course.code) as
      | { code: string; max_seats: number | null }
      | undefined;

    upsertCourseStmt.run(
      course.code,
      course.slug,
      course.title,
      course.categorySlug,
      course.categoryName,
      course.fee,
      parseFeeBdt(course.fee, course.isFree),
      course.isFree ? 1 : 0,
      course.duration,
      existing ? existing.max_seats : defaultMaxSeats,
      certLabel,
      now
    );
  }

  // Sync Foundation (ai-literacy) SEO / AIO / GEO metadata records dynamically
  const upsertSeoStmt = db.prepare(`
    INSERT INTO course_seo_metadata (
      course_code, seo_title, meta_description, canonical_url,
      og_title, og_description, og_image, og_image_alt,
      primary_keyword, secondary_keywords, semantic_topics,
      search_intent, intended_audience, learning_level,
      course_schema, index_status, is_published, last_optimized_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(course_code) DO UPDATE SET
      seo_title = excluded.seo_title,
      meta_description = excluded.meta_description,
      canonical_url = excluded.canonical_url,
      og_title = excluded.og_title,
      og_description = excluded.og_description,
      og_image = excluded.og_image,
      og_image_alt = excluded.og_image_alt,
      primary_keyword = excluded.primary_keyword,
      secondary_keywords = excluded.secondary_keywords,
      semantic_topics = excluded.semantic_topics,
      search_intent = excluded.search_intent,
      intended_audience = excluded.intended_audience,
      learning_level = excluded.learning_level,
      course_schema = excluded.course_schema,
      index_status = excluded.index_status,
      is_published = excluded.is_published,
      last_optimized_at = excluded.last_optimized_at
  `);

  const courseStateStmt = db.prepare(`
    SELECT c.is_published,
           (SELECT COUNT(*) FROM enrolments e WHERE e.course_code = c.code AND e.status = 'Confirmed') as confirmed_count,
           c.max_seats
    FROM courses c
    WHERE c.code = ?
  `);

  const seoTargets = [
    ...discoverFoundationCourses().map((course) => ({
      course,
      builder: buildFoundationCourseSeoRecord,
    })),
    ...discoverAppliedAiCourses().map((course) => ({
      course,
      builder: buildAppliedAiCourseSeoRecord,
    })),
    ...discoverProfessionalDevCourses().map((course) => ({
      course,
      builder: buildProfessionalDevCourseSeoRecord,
    })),
    {
      course: discoverSpecialisedCourse(),
      builder: buildWomensSafetyCourseSeoRecord,
    },
  ];

  for (const { course, builder } of seoTargets) {
    const dbState = courseStateStmt.get(course.code) as
      | { is_published: number; confirmed_count: number; max_seats: number | null }
      | undefined;
    const isPublished = dbState ? dbState.is_published === 1 : true;
    const isFull =
      dbState && dbState.max_seats !== null
        ? dbState.confirmed_count >= dbState.max_seats
        : false;

    const seoRec = builder(course, '', {
      isPublished,
      indexStatus: isPublished ? 'indexed' : 'noindex',
      isFull,
      lastOptimizedAt: now,
    });

    upsertSeoStmt.run(
      seoRec.courseCode,
      seoRec.seoTitle,
      seoRec.metaDescription,
      seoRec.canonicalPath,
      seoRec.ogTitle,
      seoRec.ogDescription,
      seoRec.ogImage,
      seoRec.ogImageAlt,
      seoRec.primaryKeyword,
      JSON.stringify(seoRec.secondaryKeywords),
      JSON.stringify(seoRec.semanticTopics),
      seoRec.searchIntent,
      JSON.stringify(seoRec.intendedAudience),
      seoRec.learningLevel,
      JSON.stringify(seoRec.courseSchema),
      seoRec.indexStatus,
      isPublished ? 1 : 0,
      seoRec.lastOptimizedAt
    );
  }

  // Sync Website-Wide Page, Category & Institutional Service SEO / AIO / GEO metadata
  const upsertPageSeoStmt = db.prepare(`
    INSERT INTO page_seo_metadata (
      route_path, page_type, page_title, seo_title, meta_description,
      canonical_url, og_title, og_description, og_image, og_image_alt,
      primary_keyword, secondary_keywords, semantic_topics, search_intent,
      schema_type, schema_json, index_status, is_published, last_optimized_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(route_path) DO UPDATE SET
      page_type = excluded.page_type,
      page_title = excluded.page_title,
      seo_title = excluded.seo_title,
      meta_description = excluded.meta_description,
      canonical_url = excluded.canonical_url,
      og_title = excluded.og_title,
      og_description = excluded.og_description,
      og_image = excluded.og_image,
      og_image_alt = excluded.og_image_alt,
      primary_keyword = excluded.primary_keyword,
      secondary_keywords = excluded.secondary_keywords,
      semantic_topics = excluded.semantic_topics,
      search_intent = excluded.search_intent,
      schema_type = excluded.schema_type,
      schema_json = excluded.schema_json,
      index_status = excluded.index_status,
      is_published = excluded.is_published,
      last_optimized_at = excluded.last_optimized_at
  `);

  for (const pageSeo of buildAllSitePageSeoRecords('', now)) {
    upsertPageSeoStmt.run(
      pageSeo.routePath,
      pageSeo.pageType,
      pageSeo.pageTitle,
      pageSeo.seoTitle,
      pageSeo.metaDescription,
      pageSeo.canonicalPath,
      pageSeo.ogTitle,
      pageSeo.ogDescription,
      pageSeo.ogImage,
      pageSeo.ogImageAlt,
      pageSeo.primaryKeyword,
      JSON.stringify(pageSeo.secondaryKeywords),
      JSON.stringify(pageSeo.semanticTopics),
      pageSeo.searchIntent,
      pageSeo.schemaType,
      JSON.stringify(pageSeo.schemaJson),
      pageSeo.indexStatus,
      pageSeo.isPublished ? 1 : 0,
      pageSeo.lastOptimizedAt
    );
  }

  // Seed initial Administrator if none exists
  const adminCount = db
    .prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'")
    .get() as { count: number };

  if (adminCount.count === 0) {
    const adminEmail = (
      process.env.ADMIN_SEED_EMAIL || 'admin@atlasaieducation.org'
    )
      .trim()
      .toLowerCase();
    const adminPassword =
      process.env.ADMIN_SEED_PASSWORD &&
      process.env.ADMIN_SEED_PASSWORD !== 'REPLACE_WITH_STRONG_ADMIN_PASSWORD'
        ? process.env.ADMIN_SEED_PASSWORD
        : 'AtlasAdmin#2026';

    const adminId = `usr_admin_${crypto.randomBytes(6).toString('hex')}`;
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, status, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, 'admin', 'active', 1, ?, ?)
    `).run(adminId, adminEmail, hashPassword(adminPassword), now, now);

    db.prepare(`
      INSERT INTO user_profiles (
        user_id, full_name, country, profession, organisation, bio, updated_at
      ) VALUES (?, ?, 'Bangladesh', 'Platform Administrator', 'Atlas AI Education', ?, ?)
    `).run(
      adminId,
      'Atlas Administrator',
      'Official administrator account for Atlas AI Education LMS.',
      now
    );
  }

  // Seed initial Instructor if none exists
  const instructorCount = db
    .prepare("SELECT COUNT(*) as count FROM users WHERE role = 'instructor'")
    .get() as { count: number };

  if (instructorCount.count === 0) {
    const instEmail = (
      process.env.INSTRUCTOR_SEED_EMAIL || 'instructor@atlasaieducation.org'
    )
      .trim()
      .toLowerCase();
    const instPassword =
      process.env.INSTRUCTOR_SEED_PASSWORD &&
      process.env.INSTRUCTOR_SEED_PASSWORD !== 'REPLACE_WITH_STRONG_INSTRUCTOR_PASSWORD'
        ? process.env.INSTRUCTOR_SEED_PASSWORD
        : 'AtlasInst#2026';

    const instId = `usr_inst_${crypto.randomBytes(6).toString('hex')}`;
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, status, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, 'instructor', 'active', 1, ?, ?)
    `).run(instId, instEmail, hashPassword(instPassword), now, now);

    db.prepare(`
      INSERT INTO user_profiles (
        user_id, full_name, country, profession, organisation, bio, updated_at
      ) VALUES (?, ?, 'Bangladesh', 'Lead Instructor', 'Atlas AI Education', ?, ?)
    `).run(
      instId,
      'Atlas Instructor',
      'Faculty & assignment reviewer at Atlas AI Education.',
      now
    );
  }
}

export function createNotification(input: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}): void {
  const id = `ntf_${crypto.randomBytes(8).toString('hex')}`;
  db.prepare(`
    INSERT INTO notifications (id, user_id, type, title, message, link, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?)
  `).run(id, input.userId, input.type, input.title, input.message, input.link || '', new Date().toISOString());
}

export function computeProfileCompletion(profile: {
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  country?: string;
  city?: string;
  profession?: string;
  educational_background?: string;
  bio?: string;
  interests_json?: string;
}): number {
  let score = 0;
  const total = 8;
  if (profile.full_name && profile.full_name.trim().length >= 2) score += 1;
  if (profile.phone && profile.phone.trim().length >= 6) score += 1;
  if (profile.country && profile.country.trim().length >= 2) score += 1;
  if (profile.city && profile.city.trim().length >= 2) score += 1;
  if (profile.profession && profile.profession.trim().length >= 2) score += 1;
  if (profile.educational_background && profile.educational_background.trim().length >= 2) score += 1;
  if (profile.bio && profile.bio.trim().length >= 5) score += 1;
  try {
    const interests = JSON.parse(profile.interests_json || '[]');
    if (Array.isArray(interests) && interests.length > 0) score += 1;
  } catch {
    // ignore
  }
  return Math.round((score / total) * 100);
}
