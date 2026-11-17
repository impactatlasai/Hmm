import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Clock, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { apiRequest } from '../../services/api';

type CourseFilter = 'all' | 'not_started' | 'in_progress' | 'completed';

interface EnrolledCourseItem {
  id: string;
  reference_id: string;
  course_code: string;
  title: string;
  category_name: string;
  duration: string;
  enrolled_at: string;
  certificate_label: string;
  imageUrl: string;
  imageAlt: string;
  totalPublishedLessons: number;
  completedLessonsCount: number;
  progressPercent: number;
  statusLabel: 'Not Started' | 'In Progress' | 'Completed';
  certificateEligible: boolean;
  existingCertificate: { certificate_code: string; status: string } | null;
}

interface PendingEnrolmentItem {
  id: string;
  reference_id: string;
  course_code: string;
  title: string;
  category_name: string;
  fee_display: string;
  enrolment_status: string;
  payment_status: string;
  transaction_id: string;
  enrolled_at: string;
}

export function DashboardCoursesPage() {
  const [filter, setFilter] = useState<CourseFilter>('all');
  const [courses, setCourses] = useState<EnrolledCourseItem[]>([]);
  const [pending, setPending] = useState<PendingEnrolmentItem[]>([]);
  const [allCount, setAllCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await apiRequest<{
          courses: EnrolledCourseItem[];
          allConfirmedCount: number;
          pendingOrOtherEnrolments: PendingEnrolmentItem[];
        }>(`/api/dashboard/courses?status=${filter}`);
        if (!cancelled) {
          setCourses(res.courses);
          setAllCount(res.allConfirmedCount);
          setPending(res.pendingOrOtherEnrolments || []);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const filterTabs: { id: CourseFilter; label: string }[] = [
    { id: 'all', label: `All Courses (${allCount})` },
    { id: 'not_started', label: 'Not Started' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <DashboardLayout
      title="My Courses"
      subtitle="Confirmed course enrolments and your learning progress."
    >
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`min-h-[40px] rounded-[8px] border px-4 py-2 font-en text-xs font-semibold transition-colors cursor-pointer ${
                  filter === tab.id
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-heading)] hover:bg-[var(--color-soft-bg)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link
            to="/programmes"
            className="font-en text-xs font-semibold text-[var(--color-primary)] hover:underline"
          >
            Browse All 18 Programmes →
          </Link>
        </div>

        {/* Courses List */}
        {loading ? (
          <div className="flex items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-white p-12 font-en text-sm text-[var(--color-body)]">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--color-primary)]" aria-hidden="true" />
            Loading your courses...
          </div>
        ) : error ? (
          <div className="rounded-[12px] border border-red-200 bg-red-50 p-6 font-en text-sm text-red-700">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-[var(--color-primary)]" aria-hidden="true" />
            <h2 className="mt-3 font-en text-lg font-bold text-[var(--color-heading)]">
              {allCount === 0 ? 'Your learning journey starts here.' : 'No courses match this filter.'}
            </h2>
            <p className="mx-auto mt-1.5 max-w-md font-en text-sm text-[var(--color-body)]">
              {allCount === 0
                ? 'Explore our structured AI courses and submit an enrolment application to begin.'
                : 'Try selecting All Courses to view your confirmed enrolments.'}
            </p>
            {allCount === 0 && (
              <Link
                to="/programmes"
                className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-5 py-2.5 font-en text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
              >
                <span>Explore Programmes</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((c) => (
              <article
                key={c.id}
                className="flex flex-col overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-white"
              >
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt={c.imageAlt}
                    referrerPolicy="no-referrer"
                    className="aspect-[16/9] w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-en text-xs text-[var(--color-body)]">
                    <span>
                      <strong className="text-[var(--color-primary)]">{c.course_code}</strong> ·{' '}
                      {c.category_name}
                    </span>
                    <span className="font-semibold text-[var(--color-heading)]">
                      {c.statusLabel}
                    </span>
                  </div>

                  <h3 className="mt-2 font-en text-lg font-bold text-[var(--color-heading)]">
                    {c.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-3 font-en text-xs text-[var(--color-body)]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                      {c.duration}
                    </span>
                    <span>·</span>
                    <span>
                      Enrolled {new Date(c.enrolled_at).toLocaleDateString('en-GB')}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between font-en text-xs">
                      <span className="text-[var(--color-body)]">
                        {c.totalPublishedLessons === 0
                          ? 'Learning materials coming soon'
                          : `${c.completedLessonsCount}/${c.totalPublishedLessons} lessons completed`}
                      </span>
                      <span className="font-mono-tabular font-bold text-[var(--color-heading)]">
                        {c.progressPercent}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[var(--color-primary)]"
                        style={{ width: `${c.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-[var(--color-border)] pt-4 font-en text-xs">
                    <Award className="h-4 w-4 text-[var(--color-primary)] shrink-0" aria-hidden="true" />
                    <span className="text-[var(--color-body)]">
                      {c.existingCertificate
                        ? `Certificate Issued (${c.existingCertificate.certificate_code})`
                        : c.certificateEligible
                        ? `Eligible for ${c.certificate_label}`
                        : `Target: ${c.certificate_label}`}
                    </span>
                  </div>

                  <div className="mt-4 pt-1">
                    <Link
                      to={`/dashboard/learning/${c.course_code}`}
                      className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pending / Rejected / Cancelled Applications */}
        {pending.length > 0 && (
          <section className="rounded-[12px] border border-[var(--color-border)] bg-white p-6">
            <h2 className="font-en text-base font-bold text-[var(--color-heading)]">
              Pending &amp; Other Applications
            </h2>
            <p className="mt-1 font-en text-xs text-[var(--color-body)]">
              Paid course enrolments unlock access once payment verification is confirmed by an administrator.
            </p>
            <div className="mt-4 divide-y divide-[var(--color-border)]">
              {pending.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 font-en text-sm"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-heading)]">
                      {item.course_code} — {item.title}
                    </p>
                    <p className="text-xs text-[var(--color-body)]">
                      Ref: <span className="font-mono-tabular">{item.reference_id}</span> · Fee:{' '}
                      {item.fee_display}
                      {item.transaction_id ? ` · TrxID: ${item.transaction_id}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="rounded-[6px] border border-amber-300 bg-amber-50 px-2.5 py-1 text-amber-800">
                      {item.enrolment_status} ({item.payment_status || 'Pending'})
                    </span>
                    <Link
                      to="/dashboard/payments"
                      className="text-[var(--color-primary)] hover:underline"
                    >
                      Payments →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
