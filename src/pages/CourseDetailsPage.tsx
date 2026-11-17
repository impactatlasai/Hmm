import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Award, Bookmark, Check, Clock, Info, Users } from 'lucide-react';
import { Layout } from '../components/Layout';
import { CourseCard } from '../components/CourseCard';
import { FrontendForm } from '../components/FrontendForm';
import { useAuth } from '../context/AuthContext';
import {
  COURSES,
  getCategoryEnrolmentInfo,
  getCourseByCodeOrSlug,
} from '../data/coursesData';
import { WomensSafetyProgrammePage } from './WomensSafetyProgrammePage';
import { NotFoundPage } from './NotFoundPage';

export function CourseDetailsPage() {
  const { code = '' } = useParams<{ code: string }>();
  if (
    code.toLowerCase() === 'sp-wsai' ||
    code.toLowerCase() === 'womens-safety-in-the-ai-era'
  ) {
    return <WomensSafetyProgrammePage />;
  }

  const { savedProgrammes, toggleProgrammeBookmark } = useAuth();
  const course = getCourseByCodeOrSlug(code);
  const [isCourseFull, setIsCourseFull] = useState(false);

  useEffect(() => {
    if (!course) return;
    let cancelled = false;
    fetch('/api/courses/availability')
      .then((r) => r.json())
      .then((data: { availability?: Record<string, { isFull?: boolean }> }) => {
        if (!cancelled && data?.availability?.[course.code]?.isFull) {
          setIsCourseFull(true);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [course]);

  if (!course) {
    return <NotFoundPage />;
  }

  if (course.slug === 'womens-safety-in-the-ai-era') {
    return <WomensSafetyProgrammePage />;
  }

  const isSaved = savedProgrammes.includes(course.code);
  const enrolmentInfo = getCategoryEnrolmentInfo(course.categorySlug);

  const relatedCourses = COURSES.filter(
    (c) => c.categorySlug === course.categorySlug && c.code !== course.code
  );

  return (
    <Layout
      customTitle={`${course.title} (${course.code}) – Atlas AI Education`}
      customDescription={course.hook}
    >
      {/* Hero Banner + Image */}
      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 sm:pt-28 sm:pb-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-blue-100">
            <Link to="/" className="hover:text-white hover:underline">
              Home
            </Link>
            <span aria-hidden="true">›</span>
            <Link to="/programmes" className="hover:text-white hover:underline">
              Programmes
            </Link>
            <span aria-hidden="true">›</span>
            <Link to={`/programmes#${course.categorySlug}`} className="hover:text-white hover:underline">
              {course.categoryName}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="font-semibold text-white">{course.code}</span>
          </nav>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-white px-3 py-0.5 font-en text-xs font-bold text-[var(--color-navy)]">
                  {course.code}
                </span>
                <span className="rounded-full bg-white/15 px-3 py-0.5 font-en text-xs font-semibold text-white">
                  {course.chipLabel}
                </span>
                {course.level && (
                  <span className="rounded-full bg-white/15 px-3 py-0.5 font-en text-xs font-semibold text-white">
                    {course.level}
                  </span>
                )}
              </div>

              <h1 className="mt-4 font-en text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {course.title}
              </h1>

              <p className="prose-measure mt-3 text-base leading-relaxed text-blue-100">
                {course.hook}
              </p>

              <div className="mt-6 flex flex-wrap gap-5 border-t border-white/20 pt-5 text-sm">
                <div className="flex items-center gap-2 text-blue-50">
                  <Clock className="h-4 w-4 text-[#60A5FA]" aria-hidden="true" />
                  <span>{course.duration}</span>
                </div>
                <div className="font-en font-semibold text-white">
                  {course.fee}{' '}
                  <span className="text-xs font-normal text-blue-100">
                    ({course.feeNote})
                  </span>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {course.code === 'FREE' ? (
                  <Link
                    to="/free-masterclass"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-[8px] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-blue-50"
                  >
                    <span>Free Session-এ Register করুন</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <a
                    href="#course-apply"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-[8px] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-blue-50"
                  >
                    <span>{course.isFree ? 'বিনামূল্যে নিবন্ধন করুন' : 'Enroll / Apply করুন'}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
                <a
                  href="#curriculum"
                  className="inline-flex min-h-[44px] items-center rounded-[8px] border border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Curriculum দেখুন
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] border border-white/20 bg-slate-900 shadow-lg">
                <img
                  src={course.imageUrl}
                  alt={course.imageAlt}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => toggleProgrammeBookmark(course.code)}
                  aria-label={isSaved ? `${course.title} bookmark সরান` : `${course.title} save করুন`}
                  aria-pressed={isSaved}
                  className={`absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition-colors cursor-pointer ${
                    isSaved
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-white/90 text-[var(--color-navy)] hover:bg-white'
                  }`}
                >
                  <Bookmark
                    className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Content */}
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8">
          {/* Left Content Column */}
          <div className="space-y-10 lg:col-span-8">
            {/* Overview */}
            <div>
              <h2 className="font-en text-2xl font-bold text-[var(--color-heading)]">Overview</h2>
              <p className="prose-measure mt-3 text-base leading-relaxed text-[var(--color-body)]">
                {course.overview}
              </p>
            </div>

            {/* Programme Information */}
            <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-5 sm:p-6">
              <h2 className="font-en text-xl font-bold text-[var(--color-heading)]">
                Programme Information
              </h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[10px] border border-[var(--color-border)] bg-white p-3.5">
                  <dt className="font-en text-xs font-semibold text-[var(--color-body)]">
                    Category
                  </dt>
                  <dd className="mt-1 font-en text-sm font-bold text-[var(--color-heading)]">
                    {course.categoryName}
                  </dd>
                </div>

                {enrolmentInfo && (
                  <div className="rounded-[10px] border border-[var(--color-border)] bg-white p-3.5">
                    <dt className="flex items-center gap-1.5 font-en text-xs font-semibold text-[var(--color-body)]">
                      <Users className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                      <span>Seat Capacity</span>
                    </dt>
                    <dd className="mt-1 font-en text-sm font-bold text-[var(--color-heading)]">
                      {enrolmentInfo.seatLabel}
                    </dd>
                    <p className="mt-0.5 font-en text-[11px] text-[var(--color-body)]">
                      {enrolmentInfo.seatDescription}
                    </p>
                  </div>
                )}

                {enrolmentInfo && (
                  <div className="rounded-[10px] border border-[var(--color-border)] bg-white p-3.5">
                    <dt className="flex items-center gap-1.5 font-en text-xs font-semibold text-[var(--color-body)]">
                      <Award className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                      <span>Certificate Type</span>
                    </dt>
                    <dd className="mt-1 font-en text-sm font-bold text-[var(--color-heading)]">
                      {enrolmentInfo.certificateLabel}
                    </dd>
                    <p className="mt-0.5 font-en text-[11px] text-[var(--color-body)]">
                      Non-accredited completion certificate issued by Atlas AI Education
                    </p>
                  </div>
                )}

                <div className="rounded-[10px] border border-[var(--color-border)] bg-white p-3.5">
                  <dt className="flex items-center gap-1.5 font-en text-xs font-semibold text-[var(--color-body)]">
                    <Clock className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                    <span>Course Duration</span>
                  </dt>
                  <dd className="mt-1 font-en text-sm font-bold text-[var(--color-heading)]">
                    {course.duration}
                  </dd>
                </div>

                <div className="rounded-[10px] border border-[var(--color-border)] bg-white p-3.5 sm:col-span-2">
                  <dt className="font-en text-xs font-semibold text-[var(--color-body)]">
                    Course Fee
                  </dt>
                  <dd className="mt-1 font-en text-sm font-bold text-[var(--color-heading)]">
                    {course.isFree ? `FREE (${course.fee})` : course.fee}{' '}
                    <span className="text-xs font-normal text-[var(--color-body)]">
                      ({course.feeNote})
                    </span>
                  </dd>
                  {!course.isFree && (
                    <div className="mt-2.5 rounded-[6px] border border-blue-200 bg-blue-50/80 p-2.5 text-xs text-blue-950 flex flex-wrap items-center justify-between gap-2">
                      <span>
                        <strong>Course-Based Scholarship:</strong> সর্বোচ্চ ৫০% পর্যন্ত Fee Waiver সুবিধা (প্রতি কোর্সে সর্বোচ্চ ৫ জন)।
                      </span>
                      <Link
                        to={`/scholarships?course=${course.code}`}
                        className="font-semibold text-[var(--color-primary)] hover:underline shrink-0"
                      >
                        আবেদন করুন →
                      </Link>
                    </div>
                  )}
                </div>
              </dl>
            </div>

            {/* Who This Course Is For */}
            {course.whoThisCourseIsFor && course.whoThisCourseIsFor.length > 0 && (
              <div>
                <h2 className="font-en text-2xl font-bold text-[var(--color-heading)]">
                  Who This Course Is For
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {course.whoThisCourseIsFor.map((audience) => (
                    <li
                      key={audience}
                      className="flex items-start gap-2.5 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-3.5 text-sm text-[var(--color-heading)]"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]"
                        aria-hidden="true"
                      />
                      <span>{audience}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Learning Areas */}
            <div>
              <h2 className="font-en text-2xl font-bold text-[var(--color-heading)]">
                Key Learning Areas
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {course.keyAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-start gap-2.5 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                    <span className="font-en text-sm font-semibold text-[var(--color-heading)]">
                      {area}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            <div>
              <h2 className="font-en text-2xl font-bold text-[var(--color-heading)]">
                Learning Outcomes
              </h2>
              <ul className="mt-4 list-disc space-y-2.5 pl-5 text-base text-[var(--color-body)]">
                {course.learningOutcomes.map((out, idx) => (
                  <li key={idx}>{out}</li>
                ))}
              </ul>
            </div>

            {/* Curriculum / Module Breakdown */}
            <div id="curriculum" className="scroll-mt-24">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-en text-2xl font-bold text-[var(--color-heading)]">
                  Curriculum &amp; Module Breakdown
                </h2>
              </div>

              {course.isDraftOutline && (
                <div className="mt-3 flex items-start gap-2.5 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-tint)] p-4 text-sm text-[var(--color-heading)]">
                  <Info
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]"
                    aria-hidden="true"
                  />
                  <span>
                    Draft outline — Curriculum চূড়ান্ত হওয়ার পর আনুষ্ঠানিকভাবে প্রকাশ করা হবে।
                  </span>
                </div>
              )}

              <div className="mt-5 space-y-4">
                {course.modules.map((mod) => (
                  <div
                    key={mod.code}
                    className="rounded-[12px] border border-[var(--color-border)] bg-white p-5"
                  >
                    <p className="font-en text-xs font-bold text-[var(--color-primary)]">
                      {mod.code}
                    </p>
                    <h3 className="mt-1 font-en text-lg font-bold text-[var(--color-heading)]">
                      {mod.title}
                    </h3>
                    <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm text-[var(--color-body)]">
                      {mod.topics.map((topic, tIdx) => (
                        <li key={tIdx}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Skills */}
            {course.practicalSkills && course.practicalSkills.length > 0 && (
              <div>
                <h2 className="font-en text-2xl font-bold text-[var(--color-heading)]">
                  Practical Skills
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.practicalSkills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-start gap-2.5 rounded-[10px] border border-[var(--color-border)] bg-white p-3.5"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#1E8E3E]"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-[var(--color-heading)]">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practical Project */}
            {course.practicalProject && (
              <div className="rounded-[12px] border border-[var(--color-primary)]/25 bg-[var(--color-soft-bg)] p-6">
                <span className="inline-flex items-center rounded-full bg-[var(--color-tint)] px-3 py-0.5 font-en text-xs font-bold text-[var(--color-primary)]">
                  {course.practicalProject.projectLabel || 'Practical Project'}
                </span>
                <h2 className="mt-3 font-en text-xl font-bold text-[var(--color-heading)]">
                  {course.practicalProject.title}
                </h2>
                <p className="prose-measure mt-2 text-sm leading-relaxed text-[var(--color-body)]">
                  {course.practicalProject.prompt}
                </p>
                <div className="mt-4">
                  <p className="font-en text-xs font-bold uppercase tracking-wide text-[var(--color-heading)]">
                    Project Deliverables
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {course.practicalProject.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 rounded-[8px] border border-[var(--color-border)] bg-white p-3 text-sm text-[var(--color-heading)]"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {course.practicalProject.note && (
                  <p className="mt-4 rounded-[8px] border border-[var(--color-border)] bg-white/80 p-3 text-xs leading-relaxed text-[var(--color-body)]">
                    {course.practicalProject.note}
                  </p>
                )}
              </div>
            )}

            {/* Outside the Scope of This Course */}
            {course.outsideScope && course.outsideScope.length > 0 && (
              <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-tint)]/45 p-5 sm:p-6">
                <div className="flex items-start gap-2.5">
                  <Info
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]"
                    aria-hidden="true"
                  />
                  <div>
                    <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                      Outside the Scope of This Course
                    </h2>
                    <p className="mt-1 text-xs text-[var(--color-body)]">
                      স্বচ্ছতার জন্য নিচের বিষয়গুলো এই কোর্সের অন্তর্ভুক্ত নয়:
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {course.outsideScope.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1 font-en text-xs font-medium text-[var(--color-heading)]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Programme Transparency Notes */}
            {course.programmeNotes && course.programmeNotes.length > 0 && (
              <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-5 sm:p-6">
                <div className="flex items-start gap-2.5">
                  <Info
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]"
                    aria-hidden="true"
                  />
                  <div>
                    <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                      Programme Notes &amp; Transparency
                    </h2>
                    <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--color-body)]">
                      {course.programmeNotes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Prerequisites, Assessment, Certificate */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-5">
                <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                  Prerequisites
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
                  {course.prerequisites}
                </p>
              </div>

              <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-5">
                <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                  Assessment
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
                  {course.assessment}
                </p>
              </div>

              <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-5 sm:col-span-2">
                <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                  Certificate Information
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
                  {course.certificate}
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Duration, Fee, Registration Info */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-6">
              <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                Programme Summary
              </h2>

              <dl className="divide-y divide-[var(--color-border)] text-sm">
                <div className="py-3">
                  <dt className="font-en text-xs font-semibold text-[var(--color-body)]">Status</dt>
                  <dd className="mt-1">
                    {isCourseFull ? (
                      <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 font-en text-xs font-bold text-amber-800">
                        Full · Capacity Reached
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-[var(--color-free)] bg-[#EAF7EE] px-2.5 py-0.5 font-en text-xs font-bold text-[var(--color-free)]">
                        Active · Open for Registration
                      </span>
                    )}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="font-en text-xs font-semibold text-[var(--color-body)]">Code</dt>
                  <dd className="mt-1 font-en font-bold text-[var(--color-heading)]">
                    {course.code}
                  </dd>
                </div>
                {course.level && (
                  <div className="py-3">
                    <dt className="font-en text-xs font-semibold text-[var(--color-body)]">Level</dt>
                    <dd className="mt-1 font-en font-semibold text-[var(--color-heading)]">
                      {course.level}
                    </dd>
                  </div>
                )}
                <div className="py-3">
                  <dt className="font-en text-xs font-semibold text-[var(--color-body)]">Duration</dt>
                  <dd className="mt-1 font-medium text-[var(--color-heading)]">
                    {course.duration}
                  </dd>
                </div>
                {enrolmentInfo && (
                  <>
                    <div className="py-3">
                      <dt className="font-en text-xs font-semibold text-[var(--color-body)]">
                        Seat Capacity
                      </dt>
                      <dd className="mt-1 font-en font-semibold text-[var(--color-heading)]">
                        {enrolmentInfo.seatLabel}
                      </dd>
                    </div>
                    <div className="py-3">
                      <dt className="font-en text-xs font-semibold text-[var(--color-body)]">
                        Certificate Type
                      </dt>
                      <dd className="mt-1 font-en font-semibold text-[var(--color-heading)]">
                        {enrolmentInfo.certificateLabel}
                      </dd>
                    </div>
                  </>
                )}
                <div className="py-3">
                  <dt className="font-en text-xs font-semibold text-[var(--color-body)]">Fee</dt>
                  <dd className="mt-1 font-en font-bold text-[var(--color-heading)]">
                    {course.fee}{' '}
                    <span className="text-xs font-normal text-[var(--color-body)]">
                      ({course.feeNote})
                    </span>
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="font-en text-xs font-semibold text-[var(--color-body)]">
                    Registration &amp; Schedule
                  </dt>
                  <dd className="mt-1 text-xs leading-relaxed text-[var(--color-body)]">
                    {course.registrationNote}
                  </dd>
                </div>
              </dl>

              {course.code === 'FREE' ? (
                <Link
                  to="/free-masterclass"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                >
                  Free Session-এ Register করুন →
                </Link>
              ) : (
                <a
                  href="#course-apply"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                >
                  {course.isFree ? 'বিনামূল্যে নিবন্ধন করুন →' : 'Enroll / Apply করুন →'}
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Registration / Application Form */}
      <section id="course-apply" className="border-b border-[var(--color-border)] bg-[var(--color-soft-bg)] scroll-mt-20">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-heading)]">
            {course.isFree ? 'Free Session Registration' : 'Registration / Application'}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-body)]">
            {course.registrationNote}
          </p>
          <div className="mt-6">
            <FrontendForm
              mode={course.isFree ? 'free-masterclass' : 'course-application'}
              courseCode={course.code}
              courseTitle={course.title}
              courseFee={course.fee}
              courseFeeNote={course.feeNote}
              isFree={course.isFree}
              isCourseFull={isCourseFull}
            />
          </div>
        </div>
      </section>

      {/* Other Programmes in Same Category */}
      {relatedCourses.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-heading)]">
                  অন্য Programme
                </h2>
                <p className="mt-1 text-sm text-[var(--color-body)]">
                  {course.categoryName} বিভাগের অন্যান্য কোর্স
                </p>
              </div>
              <Link
                to={`/programmes#${course.categorySlug}`}
                className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
              >
                {course.categoryName} দেখুন →
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCourses.map((rel) => (
                <CourseCard key={rel.code} course={rel} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
