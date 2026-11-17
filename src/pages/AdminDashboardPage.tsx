import React, { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Award,
  Bell,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  Loader2,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { SeoHead } from '../components/SeoHead';

type AdminTab = 'enrolments' | 'scholarships' | 'content' | 'submissions' | 'certificates' | 'learners' | 'notifications';

interface AdminOverview {
  learnersCount: number;
  confirmedEnrolmentsCount: number;
  pendingPaymentsCount: number;
  pendingSubmissionsCount: number;
  issuedCertificatesCount: number;
  pendingScholarshipsCount?: number;
}

interface AdminCourseRow {
  code: string;
  title: string;
  category_name: string;
  max_seats: number | null;
  confirmed_count: number;
  published_modules_count: number;
  published_lessons_count: number;
  require_lessons_complete: number;
  require_assignments_complete: number;
  require_quiz_pass: number;
  min_quiz_score: number;
}

export function AdminDashboardPage() {
  const { authLoading, isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<AdminTab>('enrolments');
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [courses, setCourses] = useState<AdminCourseRow[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState('AL-101');
  const [courseContent, setCourseContent] = useState<{
    modules: Array<{ id: string; title: string; sort_order: number; is_published: number }>;
    lessons: Array<{ id: string; module_id: string; title: string; is_published: number }>;
    resources: Array<{ id: string; title: string; resource_type: string; file_url: string }>;
    assignments: Array<{ id: string; title: string; max_points: number; is_published: number }>;
    quizzes: Array<{ id: string; title: string; passing_score: number; is_published: number }>;
  } | null>(null);

  const [enrolments, setEnrolments] = useState<Array<Record<string, unknown>>>([]);
  const [scholarships, setScholarships] = useState<Array<Record<string, unknown>>>([]);
  const [schFilterStatus, setSchFilterStatus] = useState<string>('all');
  const [schFilterCourse, setSchFilterCourse] = useState<string>('all');
  const [selectedSch, setSelectedSch] = useState<Record<string, unknown> | null>(null);
  const [reviewWaiverPct, setReviewWaiverPct] = useState<number>(50);
  const [reviewStatus, setReviewStatus] = useState<'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Waitlisted'>('Under Review');
  const [reviewAdminNotes, setReviewAdminNotes] = useState<string>('');
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);

  const [learners, setLearners] = useState<Array<Record<string, unknown>>>([]);
  const [learnerSearch, setLearnerSearch] = useState('');
  const [submissions, setSubmissions] = useState<Array<Record<string, unknown>>>([]);
  const [certificates, setCertificates] = useState<Array<Record<string, unknown>>>([]);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states for Content Builder
  const [newModTitle, setNewModTitle] = useState('');
  const [newLessonModuleId, setNewLessonModuleId] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonMarkdown, setNewLessonMarkdown] = useState('');
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentInst, setNewAssignmentInst] = useState('');
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');

  // Broadcast form
  const [ntfTitle, setNtfTitle] = useState('');
  const [ntfMsg, setNtfMsg] = useState('');
  const [ntfCourse, setNtfCourse] = useState('');

  // Issue certificate form
  const [certUserId, setCertUserId] = useState('');
  const [certCourseCode, setCertCourseCode] = useState('AL-101');

  const isAdmin = user?.role === 'admin';

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ov, cr] = await Promise.all([
        apiRequest<AdminOverview>('/api/admin/overview'),
        apiRequest<{ courses: AdminCourseRow[] }>('/api/admin/courses'),
      ]);
      setOverview(ov);
      setCourses(cr.courses);

      if (isAdmin) {
        const [enr, lrn, crt, sch] = await Promise.all([
          apiRequest<{ enrolments: Array<Record<string, unknown>> }>('/api/admin/enrolments'),
          apiRequest<{ learners: Array<Record<string, unknown>> }>('/api/admin/learners'),
          apiRequest<{ certificates: Array<Record<string, unknown>> }>('/api/admin/certificates'),
          apiRequest<{ applications: Array<Record<string, unknown>> }>('/api/admin/scholarships'),
        ]);
        setEnrolments(enr.enrolments);
        setLearners(lrn.learners);
        setCertificates(crt.certificates);
        setScholarships(sch.applications);
      }

      const subs = await apiRequest<{ submissions: Array<Record<string, unknown>> }>(
        '/api/admin/submissions'
      );
      setSubmissions(subs.submissions);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const loadCourseContent = useCallback(async (code: string) => {
    try {
      const res = await apiRequest<{
        modules: Array<{ id: string; title: string; sort_order: number; is_published: number }>;
        lessons: Array<{ id: string; module_id: string; title: string; is_published: number }>;
        resources: Array<{ id: string; title: string; resource_type: string; file_url: string }>;
        assignments: Array<{ id: string; title: string; max_points: number; is_published: number }>;
        quizzes: Array<{ id: string; title: string; passing_score: number; is_published: number }>;
      }>(`/api/admin/courses/${encodeURIComponent(code)}/content`);
      setCourseContent(res);
      if (res.modules.length > 0 && !newLessonModuleId) {
        setNewLessonModuleId(res.modules[0].id);
      }
    } catch {
      // ignore
    }
  }, [newLessonModuleId]);

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'instructor')) {
      loadAll();
    }
  }, [isAuthenticated, user?.role, loadAll]);

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'instructor') && selectedCourseCode) {
      loadCourseContent(selectedCourseCode);
    }
  }, [isAuthenticated, user?.role, selectedCourseCode, loadCourseContent]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-soft-bg)] font-en text-sm">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--color-primary)]" aria-hidden="true" />
        Checking permissions...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  }

  if (user.role !== 'admin' && user.role !== 'instructor') {
    return <Navigate to="/dashboard" replace />;
  }

  const notifyAction = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleVerifyEnrolment = async (id: string, action: 'approve' | 'reject' | 'refund') => {
    setError(null);
    try {
      await apiRequest(`/api/admin/enrolments/${encodeURIComponent(id)}/verify`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      });
      notifyAction(`Enrolment action "${action}" applied.`);
      await loadAll();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleReviewScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSch) return;
    setReviewSubmitting(true);
    setError(null);
    try {
      await apiRequest(`/api/admin/scholarships/${encodeURIComponent(String(selectedSch.id))}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: reviewStatus,
          approvedWaiverPct: reviewStatus === 'Approved' ? reviewWaiverPct : null,
          adminNotes: reviewAdminNotes,
        }),
      });
      notifyAction(`Scholarship application updated to ${reviewStatus}.`);
      setSelectedSch(null);
      await loadAll();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModTitle.trim()) return;
    await apiRequest(`/api/admin/courses/${encodeURIComponent(selectedCourseCode)}/modules`, {
      method: 'POST',
      body: JSON.stringify({ title: newModTitle.trim(), isPublished: true }),
    });
    setNewModTitle('');
    notifyAction('Module published.');
    await loadCourseContent(selectedCourseCode);
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonModuleId || !newLessonTitle.trim()) return;
    await apiRequest(`/api/admin/modules/${encodeURIComponent(newLessonModuleId)}/lessons`, {
      method: 'POST',
      body: JSON.stringify({
        title: newLessonTitle.trim(),
        contentMarkdown: newLessonMarkdown.trim(),
        isPublished: true,
      }),
    });
    setNewLessonTitle('');
    setNewLessonMarkdown('');
    notifyAction('Lesson published & enrolled learners notified.');
    await loadCourseContent(selectedCourseCode);
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignmentTitle.trim() || !newAssignmentInst.trim()) return;
    await apiRequest(`/api/admin/courses/${encodeURIComponent(selectedCourseCode)}/assignments`, {
      method: 'POST',
      body: JSON.stringify({
        title: newAssignmentTitle.trim(),
        instructions: newAssignmentInst.trim(),
        isPublished: true,
      }),
    });
    setNewAssignmentTitle('');
    setNewAssignmentInst('');
    notifyAction('Assignment posted.');
    await loadCourseContent(selectedCourseCode);
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResourceTitle.trim() || !newResourceUrl.trim()) return;
    await apiRequest(`/api/admin/courses/${encodeURIComponent(selectedCourseCode)}/resources`, {
      method: 'POST',
      body: JSON.stringify({
        title: newResourceTitle.trim(),
        fileUrl: newResourceUrl.trim(),
        resourceType: 'link',
      }),
    });
    setNewResourceTitle('');
    setNewResourceUrl('');
    notifyAction('Resource added.');
    await loadCourseContent(selectedCourseCode);
  };

  const handleReviewSubmission = async (
    subId: string,
    status: 'Reviewed' | 'Revision Required',
    score: number,
    feedback: string
  ) => {
    await apiRequest(`/api/admin/submissions/${encodeURIComponent(subId)}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status, score, feedback }),
    });
    notifyAction(`Submission marked ${status}.`);
    await loadAll();
  };

  const handleIssueCert = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await apiRequest<{ certificateCode: string }>('/api/admin/certificates/issue', {
        method: 'POST',
        body: JSON.stringify({ userId: certUserId, courseCode: certCourseCode }),
      });
      notifyAction(`Certificate issued (${res.certificateCode}).`);
      await loadAll();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiRequest<{ recipientCount: number }>('/api/admin/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify({
        title: ntfTitle.trim(),
        message: ntfMsg.trim(),
        targetCourseCode: ntfCourse || undefined,
      }),
    });
    setNtfTitle('');
    setNtfMsg('');
    notifyAction(`Notification sent to ${res.recipientCount} learner(s).`);
  };

  const allTabs: Array<{ id: AdminTab; label: string; icon: React.ElementType; adminOnly?: boolean }> = [
    { id: 'enrolments', label: 'Enrolments & Payments', icon: CreditCard, adminOnly: true },
    { id: 'scholarships', label: 'Scholarships', icon: GraduationCap, adminOnly: true },
    { id: 'content', label: 'Course Content', icon: BookOpen },
    { id: 'submissions', label: 'Submissions Grading', icon: ClipboardCheck },
    { id: 'certificates', label: 'Certificates', icon: Award, adminOnly: true },
    { id: 'learners', label: 'Learners', icon: Users, adminOnly: true },
    { id: 'notifications', label: 'Announcements', icon: Bell, adminOnly: true },
  ];
  const availableTabs = allTabs.filter((t) => !t.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-[var(--color-soft-bg)] text-[var(--color-heading)]">
      <SeoHead pathname="/admin" customTitle="Admin & Instructor Console – Atlas AI Education" />

      <header className="border-b border-[var(--color-border)] bg-[var(--color-navy)] text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-blue-300" aria-hidden="true" />
            <div>
              <h1 className="font-en text-base font-bold text-white">
                Atlas AI Education — {isAdmin ? 'Admin Console' : 'Instructor Console'}
              </h1>
              <p className="font-en text-[11px] text-blue-200">
                Signed in as {user.name} ({user.role})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-en text-xs">
            <Link
              to="/dashboard"
              className="rounded-[8px] border border-white/30 px-3 py-1.5 font-semibold text-white hover:bg-white/10"
            >
              Learner View
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="inline-flex items-center gap-1 rounded-[8px] bg-white/10 px-3 py-1.5 font-semibold text-white hover:bg-white/20 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Metrics Bar */}
        {overview && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4 font-en">
              <p className="text-xs text-[var(--color-body)]">Learners</p>
              <p className="mt-1 font-mono-tabular text-2xl font-bold">{overview.learnersCount}</p>
            </div>
            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4 font-en">
              <p className="text-xs text-[var(--color-body)]">Confirmed Enrolments</p>
              <p className="mt-1 font-mono-tabular text-2xl font-bold text-[var(--color-free)]">
                {overview.confirmedEnrolmentsCount}
              </p>
            </div>
            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4 font-en">
              <p className="text-xs text-[var(--color-body)]">Pending Payments</p>
              <p className="mt-1 font-mono-tabular text-2xl font-bold text-amber-700">
                {overview.pendingPaymentsCount}
              </p>
            </div>
            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4 font-en">
              <p className="text-xs text-[var(--color-body)]">Pending Scholarships</p>
              <p className="mt-1 font-mono-tabular text-2xl font-bold text-blue-700">
                {overview.pendingScholarshipsCount ?? 0}
              </p>
            </div>
            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4 font-en">
              <p className="text-xs text-[var(--color-body)]">Submissions Pending</p>
              <p className="mt-1 font-mono-tabular text-2xl font-bold text-[var(--color-primary)]">
                {overview.pendingSubmissionsCount}
              </p>
            </div>
            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4 font-en">
              <p className="text-xs text-[var(--color-body)]">Certificates Issued</p>
              <p className="mt-1 font-mono-tabular text-2xl font-bold">{overview.issuedCertificatesCount}</p>
            </div>
          </div>
        )}

        {toast && (
          <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-3.5 font-en text-xs font-semibold text-[#1E8E3E]">
            {toast}
          </div>
        )}
        {error && (
          <div className="rounded-[8px] border border-red-200 bg-red-50 p-3.5 font-en text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-3">
          {availableTabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-[8px] border px-4 py-2 font-en text-xs font-semibold cursor-pointer ${
                  tab === t.id
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-heading)] hover:bg-[var(--color-soft-bg)]'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-white p-12 font-en text-sm">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--color-primary)]" aria-hidden="true" />
            Loading console data...
          </div>
        ) : (
          <>
            {/* Tab: Enrolments & Payments */}
            {tab === 'enrolments' && isAdmin && (
              <div className="overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left font-en text-xs">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] bg-[var(--color-soft-bg)] text-[var(--color-body)]">
                        <th className="px-4 py-3">Applicant</th>
                        <th className="px-4 py-3">Course</th>
                        <th className="px-4 py-3">Method &amp; TrxID</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {enrolments.map((e) => (
                        <tr key={String(e.id)}>
                          <td className="px-4 py-3">
                            <p className="font-bold">{String(e.applicant_name)}</p>
                            <p className="text-[11px] text-[var(--color-body)]">
                              {String(e.applicant_email)} · {String(e.applicant_phone)}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-[var(--color-primary)]">
                              {String(e.course_code)}
                            </p>
                            <p className="text-[11px] text-[var(--color-body)]">
                              Ref: {String(e.reference_id)}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold uppercase">
                              {String(e.payment_method || 'free')} · {String(e.amount_display || 'Free')}
                            </p>
                            {Boolean(e.transaction_id) && (
                              <p className="font-mono-tabular font-bold">{String(e.transaction_id)}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold">
                              {String(e.enrolment_status)} / {String(e.payment_status || 'Paid')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1.5">
                              {e.enrolment_status !== 'Confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => handleVerifyEnrolment(String(e.id), 'approve')}
                                  className="inline-flex items-center gap-1 rounded-[6px] bg-[var(--color-free)] px-2.5 py-1 text-[11px] font-semibold text-white cursor-pointer"
                                >
                                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                                  Confirm Paid
                                </button>
                              )}
                              {e.enrolment_status === 'Pending' && (
                                <button
                                  type="button"
                                  onClick={() => handleVerifyEnrolment(String(e.id), 'reject')}
                                  className="inline-flex items-center gap-1 rounded-[6px] border border-red-300 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 cursor-pointer"
                                >
                                  <XCircle className="h-3 w-3" aria-hidden="true" />
                                  Reject
                                </button>
                              )}
                              {e.enrolment_status === 'Confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => handleVerifyEnrolment(String(e.id), 'refund')}
                                  className="rounded-[6px] border border-[var(--color-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-body)] cursor-pointer"
                                >
                                  Refund / Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Scholarships */}
            {tab === 'scholarships' && isAdmin && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-[var(--color-border)] bg-white p-5 font-en text-xs">
                  <div>
                    <h2 className="text-base font-bold text-[var(--color-heading)]">
                      Course-Based Scholarship Applications
                    </h2>
                    <p className="mt-0.5 text-[var(--color-body)]">
                      Allocation: Maximum 5 students per course (up to 50% Course Fee Waiver).
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <label className="mr-1.5 font-semibold text-[var(--color-body)]">Status:</label>
                      <select
                        value={schFilterStatus}
                        onChange={(e) => setSchFilterStatus(e.target.value)}
                        className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-2.5 py-1.5 font-semibold"
                      >
                        <option value="all">All Statuses</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Waitlisted">Waitlisted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="mr-1.5 font-semibold text-[var(--color-body)]">Course:</label>
                      <select
                        value={schFilterCourse}
                        onChange={(e) => setSchFilterCourse(e.target.value)}
                        className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-2.5 py-1.5 font-semibold"
                      >
                        <option value="all">All Programmes</option>
                        {courses
                          .filter((c) => c.category_name !== 'Specialised Programmes' || c.code !== 'SP-WSAI')
                          .map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} — {c.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left font-en text-xs">
                      <thead>
                        <tr className="border-b border-[var(--color-border)] bg-[var(--color-soft-bg)] text-[var(--color-body)]">
                          <th className="px-4 py-3">Applicant</th>
                          <th className="px-4 py-3">Course &amp; Quota</th>
                          <th className="px-4 py-3">Statements Preview</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)]">
                        {scholarships
                          .filter((s) => schFilterStatus === 'all' || s.status === schFilterStatus)
                          .filter((s) => schFilterCourse === 'all' || s.course_code === schFilterCourse)
                          .map((s) => {
                            const approvedCount = Number(s.course_approved_scholarships_count || 0);
                            return (
                              <tr key={String(s.id)} className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-4 py-3">
                                  <p className="font-bold text-[var(--color-heading)]">{String(s.applicant_name)}</p>
                                  <p className="text-[11px] text-[var(--color-body)]">
                                    {String(s.email)} · {String(s.phone)}
                                  </p>
                                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{String(s.reference_id)}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <p className="font-bold text-[var(--color-primary)]">{String(s.course_code)}</p>
                                  <p className="text-[11px] text-[var(--color-body)]">{String(s.course_title)}</p>
                                  <p className="mt-1 text-[11px] font-semibold text-slate-600">
                                    Approved Quota: <span className={approvedCount >= 5 ? 'text-red-700 font-bold' : 'text-blue-700'}>{approvedCount}/5</span>
                                  </p>
                                </td>
                                <td className="px-4 py-3 max-w-xs">
                                  <p className="truncate text-slate-700 font-medium">
                                    <span className="text-[10px] uppercase font-bold text-slate-500">Motiv:</span> {String(s.learning_motivation)}
                                  </p>
                                  <p className="truncate text-slate-500 text-[11px] mt-0.5">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Need:</span> {String(s.financial_need_reason)}
                                  </p>
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                      s.status === 'Approved'
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                        : s.status === 'Waitlisted'
                                        ? 'bg-amber-50 text-amber-800 border border-amber-300'
                                        : s.status === 'Rejected'
                                        ? 'bg-red-50 text-red-800 border border-red-300'
                                        : 'bg-blue-50 text-blue-800 border border-blue-300'
                                    }`}
                                  >
                                    {s.status === 'Approved' ? `Approved (${s.approved_waiver_pct || 50}% Waiver)` : String(s.status)}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedSch(s);
                                      setReviewStatus((s.status as any) || 'Under Review');
                                      setReviewWaiverPct(Number(s.approved_waiver_pct || 50));
                                      setReviewAdminNotes(String(s.admin_notes || ''));
                                    }}
                                    className="inline-flex items-center rounded-[6px] border border-[var(--color-primary)] bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-tint)] cursor-pointer"
                                  >
                                    Review / Decision
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        {scholarships.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-xs text-[var(--color-body)]">
                              No scholarship applications received yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Review Modal */}
                {selectedSch && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[12px] bg-white p-6 font-en text-xs shadow-xl">
                      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                        <div>
                          <h3 className="text-base font-bold text-[var(--color-heading)]">
                            Scholarship Review — {String(selectedSch.reference_id)}
                          </h3>
                          <p className="text-[11px] text-[var(--color-body)]">
                            {String(selectedSch.applicant_name)} · {String(selectedSch.course_title)} ({String(selectedSch.course_code)})
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedSch(null)}
                          className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3">
                          <div>
                            <span className="text-slate-500 text-[11px]">Email &amp; Phone:</span>
                            <p className="font-semibold text-slate-900">{String(selectedSch.email)} · {String(selectedSch.phone)}</p>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[11px]">Background:</span>
                            <p className="font-semibold text-slate-900">{String(selectedSch.education_or_profession)}</p>
                          </div>
                        </div>

                        <div>
                          <span className="font-bold text-slate-900">1. Learning Motivation:</span>
                          <p className="mt-1 rounded-md border border-slate-200 bg-slate-50 p-2.5 text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {String(selectedSch.learning_motivation)}
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-slate-900">2. Financial Need Reason:</span>
                          <p className="mt-1 rounded-md border border-slate-200 bg-slate-50 p-2.5 text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {String(selectedSch.financial_need_reason)}
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-slate-900">3. Commitment to Complete:</span>
                          <p className="mt-1 rounded-md border border-slate-200 bg-slate-50 p-2.5 text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {String(selectedSch.commitment_statement)}
                          </p>
                        </div>

                        <form onSubmit={handleReviewScholarship} className="space-y-4 border-t border-[var(--color-border)] pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-bold text-slate-900 mb-1">Decision Status</label>
                              <select
                                value={reviewStatus}
                                onChange={(e) => setReviewStatus(e.target.value as any)}
                                className="w-full rounded-md border border-slate-300 p-2 text-xs font-semibold"
                              >
                                <option value="Under Review">Under Review</option>
                                <option value="Approved">Approved (Waiver)</option>
                                <option value="Waitlisted">Waitlisted</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-bold text-slate-900 mb-1">
                                Approved Waiver % (Max 50%)
                              </label>
                              <select
                                disabled={reviewStatus !== 'Approved'}
                                value={reviewWaiverPct}
                                onChange={(e) => setReviewWaiverPct(Number(e.target.value))}
                                className="w-full rounded-md border border-slate-300 p-2 text-xs font-semibold disabled:bg-slate-100"
                              >
                                <option value={50}>50% Waiver (Full Maximum)</option>
                                <option value={40}>40% Waiver</option>
                                <option value={30}>30% Waiver</option>
                                <option value={25}>25% Waiver</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-900 mb-1">
                              Internal / Learner Feedback Note
                            </label>
                            <textarea
                              rows={2}
                              value={reviewAdminNotes}
                              onChange={(e) => setReviewAdminNotes(e.target.value)}
                              placeholder="Add feedback or review remarks..."
                              className="w-full rounded-md border border-slate-300 p-2 text-xs"
                            />
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setSelectedSch(null)}
                              className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={reviewSubmitting}
                              className="rounded-md bg-[var(--color-primary)] px-5 py-2 text-xs font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-50 cursor-pointer"
                            >
                              {reviewSubmitting ? 'Saving...' : 'Save Decision'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Course Content & Seat Capacity */}
            {tab === 'content' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-[var(--color-border)] bg-white p-5">
                  <div>
                    <label className="block font-en text-xs font-bold text-[var(--color-body)]">
                      Select Programme to Manage
                    </label>
                    <select
                      value={selectedCourseCode}
                      onChange={(e) => setSelectedCourseCode(e.target.value)}
                      className="mt-1 min-h-[40px] rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 font-en text-sm font-semibold"
                    >
                      {courses.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} — {c.title} ({c.confirmed_count}
                          {c.max_seats !== null ? `/${c.max_seats} seats` : ' enrolled'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {courseContent && (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Add Module & Lesson */}
                    <div className="space-y-5 rounded-[12px] border border-[var(--color-border)] bg-white p-6">
                      <h2 className="font-en text-base font-bold">Modules &amp; Lessons</h2>

                      <form onSubmit={handleCreateModule} className="flex gap-2">
                        <input
                          type="text"
                          value={newModTitle}
                          onChange={(e) => setNewModTitle(e.target.value)}
                          placeholder="New module title"
                          className="min-h-[40px] flex-1 rounded-[8px] border border-[var(--color-border)] px-3 font-en text-xs"
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 rounded-[8px] bg-[var(--color-primary)] px-3.5 py-2 font-en text-xs font-semibold text-white cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          Module
                        </button>
                      </form>

                      <form
                        onSubmit={handleCreateLesson}
                        className="space-y-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4"
                      >
                        <p className="font-en text-xs font-bold">Publish Lesson</p>
                        <select
                          value={newLessonModuleId}
                          onChange={(e) => setNewLessonModuleId(e.target.value)}
                          className="min-h-[38px] w-full rounded-[8px] border border-[var(--color-border)] bg-white px-3 font-en text-xs"
                        >
                          <option value="">Select module</option>
                          {courseContent.modules.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.title}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={newLessonTitle}
                          onChange={(e) => setNewLessonTitle(e.target.value)}
                          placeholder="Lesson title"
                          className="min-h-[38px] w-full rounded-[8px] border border-[var(--color-border)] bg-white px-3 font-en text-xs"
                        />
                        <textarea
                          rows={3}
                          value={newLessonMarkdown}
                          onChange={(e) => setNewLessonMarkdown(e.target.value)}
                          placeholder="Lesson reading notes / exercises..."
                          className="w-full rounded-[8px] border border-[var(--color-border)] bg-white px-3 py-2 font-en text-xs"
                        />
                        <button
                          type="submit"
                          className="rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white cursor-pointer"
                        >
                          Publish Lesson
                        </button>
                      </form>

                      <ul className="divide-y divide-[var(--color-border)] font-en text-xs">
                        {courseContent.modules.map((m) => (
                          <li key={m.id} className="py-2.5">
                            <div className="flex items-center justify-between font-bold">
                              <span>{m.title}</span>
                              <button
                                type="button"
                                onClick={async () => {
                                  await apiRequest(`/api/admin/modules/${m.id}`, { method: 'DELETE' });
                                  loadCourseContent(selectedCourseCode);
                                }}
                                className="text-red-600 cursor-pointer"
                                aria-label="Delete module"
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            </div>
                            <ul className="mt-1 space-y-1 pl-4 text-[var(--color-body)]">
                              {courseContent.lessons
                                .filter((l) => l.module_id === m.id)
                                .map((l) => (
                                  <li key={l.id} className="flex items-center justify-between">
                                    <span>• {l.title}</span>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await apiRequest(`/api/admin/lessons/${l.id}`, { method: 'DELETE' });
                                        loadCourseContent(selectedCourseCode);
                                      }}
                                      className="text-red-500 cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  </li>
                                ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Assignments & Resources */}
                    <div className="space-y-5 rounded-[12px] border border-[var(--color-border)] bg-white p-6">
                      <h2 className="font-en text-base font-bold">Assignments &amp; Resources</h2>

                      <form
                        onSubmit={handleCreateAssignment}
                        className="space-y-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4"
                      >
                        <p className="font-en text-xs font-bold">Create Published Assignment</p>
                        <input
                          type="text"
                          value={newAssignmentTitle}
                          onChange={(e) => setNewAssignmentTitle(e.target.value)}
                          placeholder="Assignment title"
                          className="min-h-[38px] w-full rounded-[8px] border border-[var(--color-border)] bg-white px-3 font-en text-xs"
                        />
                        <textarea
                          rows={2}
                          value={newAssignmentInst}
                          onChange={(e) => setNewAssignmentInst(e.target.value)}
                          placeholder="Assignment instructions..."
                          className="w-full rounded-[8px] border border-[var(--color-border)] bg-white px-3 py-2 font-en text-xs"
                        />
                        <button
                          type="submit"
                          className="rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white cursor-pointer"
                        >
                          Publish Assignment
                        </button>
                      </form>

                      <form
                        onSubmit={handleCreateResource}
                        className="space-y-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4"
                      >
                        <p className="font-en text-xs font-bold">Attach Course Resource Link</p>
                        <input
                          type="text"
                          value={newResourceTitle}
                          onChange={(e) => setNewResourceTitle(e.target.value)}
                          placeholder="Resource title (e.g. Prompt Worksheet PDF)"
                          className="min-h-[38px] w-full rounded-[8px] border border-[var(--color-border)] bg-white px-3 font-en text-xs"
                        />
                        <input
                          type="url"
                          value={newResourceUrl}
                          onChange={(e) => setNewResourceUrl(e.target.value)}
                          placeholder="https://..."
                          className="min-h-[38px] w-full rounded-[8px] border border-[var(--color-border)] bg-white px-3 font-en text-xs"
                        />
                        <button
                          type="submit"
                          className="rounded-[8px] border border-[var(--color-primary)] bg-white px-4 py-2 font-en text-xs font-semibold text-[var(--color-primary)] cursor-pointer"
                        >
                          Add Resource
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Submissions Grading */}
            {tab === 'submissions' && (
              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-8 text-center font-en text-xs text-[var(--color-body)]">
                    No learner assignment submissions yet.
                  </div>
                ) : (
                  submissions.map((s) => (
                    <SubmissionReviewCard
                      key={String(s.id)}
                      sub={s}
                      onReview={handleReviewSubmission}
                    />
                  ))
                )}
              </div>
            )}

            {/* Tab: Certificates */}
            {tab === 'certificates' && isAdmin && (
              <div className="grid gap-6 lg:grid-cols-12">
                <form
                  onSubmit={handleIssueCert}
                  className="space-y-4 rounded-[12px] border border-[var(--color-border)] bg-white p-6 lg:col-span-4"
                >
                  <h2 className="font-en text-base font-bold">Issue Verified Certificate</h2>
                  <div>
                    <label className="block font-en text-xs font-semibold">Learner</label>
                    <select
                      required
                      value={certUserId}
                      onChange={(e) => setCertUserId(e.target.value)}
                      className="mt-1 min-h-[40px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 font-en text-xs"
                    >
                      <option value="">Select learner</option>
                      {learners.map((l) => (
                        <option key={String(l.id)} value={String(l.id)}>
                          {String(l.full_name || l.email)} ({String(l.email)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-en text-xs font-semibold">Programme</label>
                    <select
                      value={certCourseCode}
                      onChange={(e) => setCertCourseCode(e.target.value)}
                      className="mt-1 min-h-[40px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 font-en text-xs"
                    >
                      {courses.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} — {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full min-h-[40px] rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white cursor-pointer"
                  >
                    Issue Certificate
                  </button>
                </form>

                <div className="overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-white lg:col-span-8">
                  <table className="w-full border-collapse text-left font-en text-xs">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] bg-[var(--color-soft-bg)]">
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3">Holder</th>
                        <th className="px-4 py-3">Course</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {certificates.map((c) => (
                        <tr key={String(c.id)}>
                          <td className="px-4 py-3 font-mono-tabular font-bold text-[var(--color-primary)]">
                            {String(c.certificate_code)}
                          </td>
                          <td className="px-4 py-3">{String(c.holder_name)}</td>
                          <td className="px-4 py-3">{String(c.course_code)}</td>
                          <td className="px-4 py-3 font-semibold">{String(c.status)}</td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={async () => {
                                const next = c.status === 'Issued' ? 'Revoked' : 'Issued';
                                await apiRequest(`/api/admin/certificates/${c.id}/status`, {
                                  method: 'PATCH',
                                  body: JSON.stringify({ status: next }),
                                });
                                loadAll();
                              }}
                              className="font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
                            >
                              {c.status === 'Issued' ? 'Revoke' : 'Restore'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Learners */}
            {tab === 'learners' && isAdmin && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 rounded-[12px] border border-[var(--color-border)] bg-white px-4 py-2.5">
                  <Search className="h-4 w-4 text-[var(--color-body)]" aria-hidden="true" />
                  <input
                    type="search"
                    value={learnerSearch}
                    onChange={(e) => setLearnerSearch(e.target.value)}
                    placeholder="Filter learners by name or email..."
                    className="w-full font-en text-sm focus:outline-none"
                  />
                </div>
                <div className="overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-white">
                  <table className="w-full border-collapse text-left font-en text-xs">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] bg-[var(--color-soft-bg)]">
                        <th className="px-4 py-3">Learner</th>
                        <th className="px-4 py-3">Verified</th>
                        <th className="px-4 py-3">Confirmed Courses</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Access Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {learners
                        .filter((l) => {
                          const q = learnerSearch.toLowerCase();
                          return (
                            !q ||
                            String(l.email).toLowerCase().includes(q) ||
                            String(l.full_name || '').toLowerCase().includes(q)
                          );
                        })
                        .map((l) => (
                          <tr key={String(l.id)}>
                            <td className="px-4 py-3">
                              <p className="font-bold">{String(l.full_name || l.email)}</p>
                              <p className="text-[11px] text-[var(--color-body)]">{String(l.email)}</p>
                            </td>
                            <td className="px-4 py-3">{l.email_verified === 1 ? 'Yes' : 'No'}</td>
                            <td className="px-4 py-3 font-mono-tabular font-bold">
                              {String(l.confirmed_courses_count)}
                            </td>
                            <td className="px-4 py-3 font-semibold">{String(l.status)}</td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={async () => {
                                  const next = l.status === 'suspended' ? 'active' : 'suspended';
                                  await apiRequest(`/api/admin/learners/${l.id}/status`, {
                                    method: 'PATCH',
                                    body: JSON.stringify({ status: next }),
                                  });
                                  loadAll();
                                }}
                                className="font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
                              >
                                {l.status === 'suspended' ? 'Activate' : 'Suspend'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Broadcast Notifications */}
            {tab === 'notifications' && isAdmin && (
              <form
                onSubmit={handleBroadcast}
                className="max-w-xl space-y-4 rounded-[12px] border border-[var(--color-border)] bg-white p-6"
              >
                <h2 className="font-en text-base font-bold">Send Announcement Notification</h2>
                <div>
                  <label className="block font-en text-xs font-semibold">Audience</label>
                  <select
                    value={ntfCourse}
                    onChange={(e) => setNtfCourse(e.target.value)}
                    className="mt-1 min-h-[40px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 font-en text-xs"
                  >
                    <option value="">All Active Learners</option>
                    {courses.map((c) => (
                      <option key={c.code} value={c.code}>
                        Confirmed Learners in {c.code} — {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-en text-xs font-semibold">Title</label>
                  <input
                    type="text"
                    required
                    value={ntfTitle}
                    onChange={(e) => setNtfTitle(e.target.value)}
                    placeholder="Live cohort schedule update"
                    className="mt-1 min-h-[40px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 font-en text-sm"
                  />
                </div>
                <div>
                  <label className="block font-en text-xs font-semibold">Message</label>
                  <textarea
                    rows={3}
                    required
                    value={ntfMsg}
                    onChange={(e) => setNtfMsg(e.target.value)}
                    placeholder="Enter announcement details..."
                    className="mt-1 w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 py-2 font-en text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="min-h-[40px] rounded-[8px] bg-[var(--color-primary)] px-5 py-2 font-en text-xs font-semibold text-white cursor-pointer"
                >
                  Send Notification
                </button>
              </form>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function SubmissionReviewCard({
  sub,
  onReview,
}: {
  sub: Record<string, unknown>;
  onReview: (id: string, status: 'Reviewed' | 'Revision Required', score: number, feedback: string) => Promise<void>;
}) {
  const [score, setScore] = useState(Number(sub.score ?? sub.max_points ?? 100));
  const [feedback, setFeedback] = useState(String(sub.feedback || ''));

  return (
    <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-5 font-en text-xs">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-bold text-[var(--color-primary)]">
            {String(sub.course_code)} — {String(sub.assignment_title)}
          </p>
          <p className="mt-0.5 font-semibold text-[var(--color-heading)]">
            Learner: {String(sub.learner_name || sub.learner_email)} ({String(sub.learner_email)})
          </p>
        </div>
        <span className="rounded-[6px] border border-[var(--color-border)] px-2.5 py-0.5 font-bold">
          {String(sub.status)}
        </span>
      </div>

      {Boolean(sub.submission_text) && (
        <p className="mt-3 rounded-[8px] bg-[var(--color-soft-bg)] p-3 text-[var(--color-heading)]">
          {String(sub.submission_text)}
        </p>
      )}
      {Boolean(sub.file_name) && (
        <a
          href={`/api/files/submissions/${sub.id}`}
          className="mt-2 inline-block font-semibold text-[var(--color-primary)] hover:underline"
        >
          Download attachment: {String(sub.file_name)}
        </a>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--color-border)] pt-4">
        <input
          type="number"
          min={0}
          max={Number(sub.max_points || 100)}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-24 min-h-[36px] rounded-[8px] border border-[var(--color-border)] px-2.5 font-mono-tabular"
        />
        <input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Instructor feedback..."
          className="min-h-[36px] flex-1 rounded-[8px] border border-[var(--color-border)] px-3"
        />
        <button
          type="button"
          onClick={() => onReview(String(sub.id), 'Reviewed', score, feedback)}
          className="rounded-[8px] bg-[var(--color-free)] px-3 py-2 font-semibold text-white cursor-pointer"
        >
          Approve &amp; Lock
        </button>
        <button
          type="button"
          onClick={() => onReview(String(sub.id), 'Revision Required', score, feedback)}
          className="rounded-[8px] border border-red-300 bg-red-50 px-3 py-2 font-semibold text-red-700 cursor-pointer"
        >
          Request Revision
        </button>
      </div>
    </div>
  );
}
