import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

interface OverviewResponse {
  kpis: {
    enrolledCount: number;
    inProgressCount: number;
    completedCount: number;
    certificatesCount: number;
    pendingAssignmentsCount: number;
    unreadNotificationsCount: number;
  };
  continueLearning: Array<{
    id: string;
    course_code: string;
    title: string;
    category_name: string;
    enrolled_at: string;
    imageUrl: string;
    imageAlt: string;
    totalPublishedLessons: number;
    completedLessonsCount: number;
    progressPercent: number;
    statusLabel: 'Not Started' | 'In Progress' | 'Completed';
  }>;
  pendingEnrolments: Array<{
    id: string;
    reference_id: string;
    course_code: string;
    title: string;
    fee_display: string;
    payment_status: string;
    transaction_id: string;
  }>;
  recentNotifications: Array<{
    id: string;
    title: string;
    message: string;
    link: string;
    is_read: number;
    created_at: string;
  }>;
  profileCompletion: number;
}

export function DashboardOverviewPage() {
  const { user, setUnreadNotificationsCount } = useAuth();
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest<OverviewResponse>('/api/dashboard/overview');
        if (!cancelled) {
          setData(res);
          setUnreadNotificationsCount(res.kpis.unreadNotificationsCount);
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
  }, [setUnreadNotificationsCount]);

  const firstName = user?.name.trim().split(/\s+/)[0] || 'Learner';

  return (
    <DashboardLayout
      title="Dashboard Overview"
      subtitle="Welcome back to your Atlas AI Education learning workspace."
    >
      {loading ? (
        <div className="flex items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-white p-12 font-en text-sm text-[var(--color-body)]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--color-primary)]" aria-hidden="true" />
          Loading your learning overview...
        </div>
      ) : error ? (
        <div className="rounded-[12px] border border-red-200 bg-red-50 p-6 font-en text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Welcome Banner + Profile Completion */}
          <section className="flex flex-col justify-between gap-5 rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-en text-2xl font-bold text-[var(--color-heading)]">
                Welcome back, {firstName}
              </h2>
              <p className="mt-1 font-en text-sm text-[var(--color-body)]">
                Track your confirmed enrolments, assignments, completion progress, and certificates from one place.
              </p>
            </div>
            <div className="min-w-[220px] rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4">
              <div className="flex items-center justify-between font-en text-xs font-semibold text-[var(--color-heading)]">
                <span>Profile Completion</span>
                <span className="font-mono-tabular text-[var(--color-primary)]">
                  {data?.profileCompletion ?? 0}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                  style={{ width: `${data?.profileCompletion ?? 0}%` }}
                />
              </div>
              <Link
                to="/dashboard/profile"
                className="mt-2 inline-block font-en text-xs font-semibold text-[var(--color-primary)] hover:underline"
              >
                Update Profile →
              </Link>
            </div>
          </section>

          {/* KPI Cards */}
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4">
              <div className="flex items-center justify-between text-[var(--color-body)]">
                <span className="font-en text-xs font-medium">Enrolled Courses</span>
                <BookOpen className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
              </div>
              <p className="mt-2 font-mono-tabular text-2xl font-bold text-[var(--color-heading)]">
                {data?.kpis.enrolledCount ?? 0}
              </p>
            </div>

            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4">
              <div className="flex items-center justify-between text-[var(--color-body)]">
                <span className="font-en text-xs font-medium">In Progress</span>
                <GraduationCap className="h-4 w-4 text-[#4B3FD6]" aria-hidden="true" />
              </div>
              <p className="mt-2 font-mono-tabular text-2xl font-bold text-[var(--color-heading)]">
                {data?.kpis.inProgressCount ?? 0}
              </p>
            </div>

            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4">
              <div className="flex items-center justify-between text-[var(--color-body)]">
                <span className="font-en text-xs font-medium">Completed</span>
                <CheckCircle2 className="h-4 w-4 text-[var(--color-free)]" aria-hidden="true" />
              </div>
              <p className="mt-2 font-mono-tabular text-2xl font-bold text-[var(--color-heading)]">
                {data?.kpis.completedCount ?? 0}
              </p>
            </div>

            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4">
              <div className="flex items-center justify-between text-[var(--color-body)]">
                <span className="font-en text-xs font-medium">Certificates</span>
                <Award className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
              </div>
              <p className="mt-2 font-mono-tabular text-2xl font-bold text-[var(--color-heading)]">
                {data?.kpis.certificatesCount ?? 0}
              </p>
            </div>

            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4">
              <div className="flex items-center justify-between text-[var(--color-body)]">
                <span className="font-en text-xs font-medium">Pending Tasks</span>
                <ClipboardCheck className="h-4 w-4 text-amber-600" aria-hidden="true" />
              </div>
              <p className="mt-2 font-mono-tabular text-2xl font-bold text-[var(--color-heading)]">
                {data?.kpis.pendingAssignmentsCount ?? 0}
              </p>
            </div>

            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4">
              <div className="flex items-center justify-between text-[var(--color-body)]">
                <span className="font-en text-xs font-medium">Unread Alerts</span>
                <Bell className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
              </div>
              <p className="mt-2 font-mono-tabular text-2xl font-bold text-[var(--color-heading)]">
                {data?.kpis.unreadNotificationsCount ?? 0}
              </p>
            </div>
          </section>

          {/* Pending Payment Verification Notice (if any) */}
          {data && data.pendingEnrolments.length > 0 && (
            <section className="rounded-[12px] border border-amber-200 bg-amber-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-en text-sm font-bold text-amber-950">
                  <Clock className="h-4 w-4 text-amber-700" aria-hidden="true" />
                  <span>Pending Payment Verification ({data.pendingEnrolments.length})</span>
                </div>
                <Link
                  to="/dashboard/payments"
                  className="font-en text-xs font-semibold text-amber-900 underline"
                >
                  View Payment Status →
                </Link>
              </div>
              <p className="mt-1 font-en text-xs text-amber-900">
                Paid courses appear in Continue Learning automatically once our team verifies your Send Money TrxID.
              </p>
            </section>
          )}

          {/* Main Grid: Continue Learning + Recent Notifications */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Continue Learning */}
            <section className="lg:col-span-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                  Continue Learning
                </h2>
                <Link
                  to="/dashboard/courses"
                  className="font-en text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  View All Courses →
                </Link>
              </div>

              {!data || data.continueLearning.length === 0 ? (
                <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-8 text-center">
                  <GraduationCap
                    className="mx-auto h-10 w-10 text-[var(--color-primary)]"
                    aria-hidden="true"
                  />
                  <h3 className="mt-3 font-en text-lg font-bold text-[var(--color-heading)]">
                    Your learning journey starts here.
                  </h3>
                  <p className="mx-auto mt-1.5 max-w-md font-en text-sm text-[var(--color-body)]">
                    You have no confirmed course enrolments yet. Explore our 18 structured programmes across AI Literacy, Applied AI, Professional Development, and Specialised Programmes.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <Link
                      to="/programmes"
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-5 py-2.5 font-en text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
                    >
                      <span>Explore Programmes</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link
                      to="/scholarships"
                      className="inline-flex min-h-[44px] items-center rounded-[8px] border border-[var(--color-border)] bg-white px-4 py-2.5 font-en text-xs font-semibold text-[var(--color-heading)] hover:bg-slate-50"
                    >
                      Scholarships &amp; Financial Assistance →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.continueLearning.map((course) => {
                    const remaining = Math.max(
                      0,
                      course.totalPublishedLessons - course.completedLessonsCount
                    );
                    return (
                      <div
                        key={course.id}
                        className="flex flex-col gap-4 rounded-[12px] border border-[var(--color-border)] bg-white p-4 sm:flex-row sm:items-center"
                      >
                        {course.imageUrl && (
                          <img
                            src={course.imageUrl}
                            alt={course.imageAlt}
                            referrerPolicy="no-referrer"
                            className="h-24 w-full rounded-[8px] object-cover sm:w-36 shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 font-en text-xs text-[var(--color-body)]">
                            <span className="font-bold text-[var(--color-primary)]">
                              {course.course_code}
                            </span>
                            <span>·</span>
                            <span>{course.category_name}</span>
                            <span>·</span>
                            <span>{course.statusLabel}</span>
                          </div>
                          <h3 className="mt-1 font-en text-base font-bold text-[var(--color-heading)]">
                            {course.title}
                          </h3>

                          <div className="mt-2.5 flex items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-[var(--color-primary)]"
                                style={{ width: `${course.progressPercent}%` }}
                              />
                            </div>
                            <span className="font-mono-tabular text-xs font-bold text-[var(--color-heading)]">
                              {course.progressPercent}%
                            </span>
                          </div>

                          <p className="mt-1.5 font-en text-xs text-[var(--color-body)]">
                            {course.totalPublishedLessons === 0
                              ? 'Learning materials coming soon · Enrolment confirmed'
                              : `${course.completedLessonsCount} of ${course.totalPublishedLessons} lessons completed · ${remaining} remaining`}
                          </p>
                        </div>

                        <Link
                          to={`/dashboard/learning/${course.course_code}`}
                          className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-1.5 rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white hover:bg-[var(--color-primary-hover)]"
                        >
                          <span>Continue Learning</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Recent Notifications */}
            <section className="lg:col-span-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                  Recent Notifications
                </h2>
                <Link
                  to="/dashboard/notifications"
                  className="font-en text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  All Alerts →
                </Link>
              </div>

              <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4">
                {!data || data.recentNotifications.length === 0 ? (
                  <p className="py-6 text-center font-en text-xs text-[var(--color-body)]">
                    No notifications yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-[var(--color-border)]">
                    {data.recentNotifications.map((ntf) => (
                      <li key={ntf.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-en text-xs font-bold text-[var(--color-heading)]">
                            {ntf.title}
                          </p>
                          {ntf.is_read === 0 && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
                          )}
                        </div>
                        <p className="mt-1 font-en text-xs leading-relaxed text-[var(--color-body)]">
                          {ntf.message}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between font-en text-[11px] text-[var(--color-body)]">
                          <span>{new Date(ntf.created_at).toLocaleDateString('en-GB')}</span>
                          {ntf.link && (
                            <Link
                              to={ntf.link}
                              className="font-semibold text-[var(--color-primary)] hover:underline"
                            >
                              Open →
                            </Link>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
