import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Circle,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  HelpCircle,
  Info,
  Loader2,
  PlayCircle,
} from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { apiRequest } from '../../services/api';

interface LessonItem {
  id: string;
  module_id: string;
  title: string;
  summary: string;
  content_markdown: string;
  video_url: string;
  duration_minutes: number | null;
  sort_order: number;
}

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  lessons: LessonItem[];
}

interface LearningPayload {
  course: {
    code: string;
    title: string;
    category_name: string;
    duration: string;
    certificate_label: string;
    overview: string;
    imageUrl: string;
    syllabusOutline: Array<{ code: string; title: string; topics: string[] }>;
  };
  modules: ModuleItem[];
  materialsComingSoon: boolean;
  resources: Array<{
    id: string;
    lesson_id: string | null;
    title: string;
    resource_type: string;
    file_url: string;
    file_name: string;
  }>;
  quizzes: Array<{
    id: string;
    title: string;
    instructions: string;
    passingScore: number;
    questions: Array<{ id: string; prompt: string; options: string[] }>;
    attempts: Array<{ id: string; score_percent: number; passed: number; submitted_at: string }>;
  }>;
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  progress: {
    totalPublishedLessons: number;
    completedLessonsCount: number;
    progressPercent: number;
    lastCompletedLessonId: string | null;
    nextLessonId: string | null;
    statusLabel: string;
  };
}

export function DashboardLearningPage() {
  const { courseCode } = useParams<{ courseCode?: string }>();

  const [enrolledCourses, setEnrolledCourses] = useState<
    Array<{ course_code: string; title: string; progressPercent: number }>
  >([]);
  const [selectedCode, setSelectedCode] = useState<string>(courseCode || '');
  const [payload, setPayload] = useState<LearningPayload | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{
    scorePercent: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState(false);

  // Load confirmed course list so /dashboard/learning selects first confirmed course if none specified
  useEffect(() => {
    if (courseCode) {
      setSelectedCode(courseCode);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest<{
          courses: Array<{ course_code: string; title: string; progressPercent: number }>;
        }>('/api/dashboard/courses?status=all');
        if (!cancelled) {
          setEnrolledCourses(res.courses);
          if (res.courses.length > 0) {
            setSelectedCode(res.courses[0].course_code);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseCode]);

  const loadCourseWorkspace = useCallback(async (code: string) => {
    if (!code) return;
    setLoading(true);
    setError(null);
    setPayload(null);
    setActiveQuizId(null);
    setQuizResult(null);

    try {
      const data = await apiRequest<LearningPayload>(`/api/dashboard/learning/${encodeURIComponent(code)}`);
      setPayload(data);
      const allLessons = data.modules.flatMap((m) => m.lessons);
      const preferred =
        allLessons.find((l) => l.id === data.progress.nextLessonId) || allLessons[0] || null;
      setActiveLessonId(preferred ? preferred.id : null);
    } catch (err) {
      setError((err as Error).message || 'Unable to load learning materials.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCode) {
      loadCourseWorkspace(selectedCode);
    }
  }, [selectedCode, loadCourseWorkspace]);

  const allLessons = payload ? payload.modules.flatMap((m) => m.lessons) : [];
  const activeLessonIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson = activeLessonIndex >= 0 ? allLessons[activeLessonIndex] : null;
  const activeQuiz = payload?.quizzes.find((q) => q.id === activeQuizId) || null;

  const handleToggleLessonComplete = async (lessonId: string, currentlyComplete: boolean) => {
    if (!payload) return;
    setBusyAction(true);
    try {
      const res = await apiRequest<{ progress: LearningPayload['progress'] }>(
        `/api/dashboard/learning/lessons/${encodeURIComponent(lessonId)}/complete`,
        {
          method: 'POST',
          body: JSON.stringify({ completed: !currentlyComplete }),
        }
      );
      setPayload((prev) => {
        if (!prev) return prev;
        const completedSet = new Set(prev.completedLessonIds);
        if (currentlyComplete) completedSet.delete(lessonId);
        else completedSet.add(lessonId);
        return {
          ...prev,
          completedLessonIds: Array.from(completedSet),
          progress: res.progress,
        };
      });
    } finally {
      setBusyAction(false);
    }
  };

  const handleToggleBookmark = async (lessonId: string) => {
    if (!payload) return;
    const res = await apiRequest<{ bookmarked: boolean }>(
      `/api/dashboard/learning/lessons/${encodeURIComponent(lessonId)}/bookmark`,
      { method: 'POST' }
    );
    setPayload((prev) => {
      if (!prev) return prev;
      const set = new Set(prev.bookmarkedLessonIds);
      if (res.bookmarked) set.add(lessonId);
      else set.delete(lessonId);
      return { ...prev, bookmarkedLessonIds: Array.from(set) };
    });
  };

  const handleQuizSubmit = async (quizId: string) => {
    setBusyAction(true);
    try {
      const res = await apiRequest<{
        scorePercent: number;
        passed: boolean;
        correctCount: number;
        totalQuestions: number;
      }>(`/api/dashboard/quizzes/${encodeURIComponent(quizId)}/attempt`, {
        method: 'POST',
        body: JSON.stringify({ answers: quizAnswers }),
      });
      setQuizResult(res);
      if (selectedCode) {
        loadCourseWorkspace(selectedCode);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyAction(false);
    }
  };

  return (
    <DashboardLayout
      title={payload ? `${payload.course.code} — ${payload.course.title}` : 'Learning Centre'}
      subtitle="Structured lessons, downloadable resources, quizzes, and progress tracking."
    >
      {loading ? (
        <div className="flex items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-white p-12 font-en text-sm text-[var(--color-body)]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--color-primary)]" aria-hidden="true" />
          Loading Learning Centre...
        </div>
      ) : !selectedCode ? (
        <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-10 text-center">
          <GraduationCap className="mx-auto h-10 w-10 text-[var(--color-primary)]" aria-hidden="true" />
          <h2 className="mt-3 font-en text-lg font-bold text-[var(--color-heading)]">
            No Confirmed Course Selected
          </h2>
          <p className="mx-auto mt-1.5 max-w-md font-en text-sm text-[var(--color-body)]">
            Enrol in a programme and confirm your seat to unlock structured lessons and materials in your Learning Centre.
          </p>
          <Link
            to="/programmes"
            className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-5 py-2.5 font-en text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
          >
            <span>Explore Programmes</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : error ? (
        <div className="rounded-[12px] border border-amber-200 bg-amber-50 p-6 font-en text-sm text-amber-950">
          <p className="font-bold">Access Restricted</p>
          <p className="mt-1">{error}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/dashboard/courses"
              className="inline-flex min-h-[40px] items-center rounded-[8px] border border-[var(--color-border)] bg-white px-4 py-2 text-xs font-semibold text-[var(--color-heading)]"
            >
              ← Back to My Courses
            </Link>
            <Link
              to="/dashboard/payments"
              className="inline-flex min-h-[40px] items-center rounded-[8px] bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white"
            >
              Check Payment Status
            </Link>
          </div>
        </div>
      ) : payload ? (
        <div className="space-y-6">
          {/* Course Switcher if coming from /dashboard/learning */}
          {!courseCode && enrolledCourses.length > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[var(--color-border)] bg-white px-4 py-3">
              <span className="font-en text-xs font-semibold text-[var(--color-body)]">
                Switch Enrolled Course:
              </span>
              <select
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                className="min-h-[38px] rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 font-en text-xs font-semibold text-[var(--color-heading)]"
              >
                {enrolledCourses.map((c) => (
                  <option key={c.course_code} value={c.course_code}>
                    {c.course_code} — {c.title} ({c.progressPercent}%)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Progress Top Summary */}
          <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-en text-xs font-semibold text-[var(--color-primary)]">
                  {payload.course.category_name} · {payload.course.duration}
                </p>
                <h2 className="mt-1 font-en text-xl font-bold text-[var(--color-heading)]">
                  {payload.course.title}
                </h2>
              </div>
              <div className="text-right font-en">
                <p className="font-mono-tabular text-lg font-bold text-[var(--color-primary)]">
                  {payload.progress.progressPercent}% Complete
                </p>
                <p className="text-xs text-[var(--color-body)]">
                  {payload.progress.totalPublishedLessons === 0
                    ? 'Materials awaiting publication'
                    : `${payload.progress.completedLessonsCount}/${payload.progress.totalPublishedLessons} lessons done`}
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                style={{ width: `${payload.progress.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Sidebar: Modules & Lessons + Quizzes */}
            <aside className="space-y-4 lg:col-span-4">
              <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4">
                <h3 className="font-en text-sm font-bold text-[var(--color-heading)]">
                  Modules &amp; Lessons
                </h3>

                {payload.materialsComingSoon ? (
                  <div className="mt-3 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-3.5 font-en text-xs text-[var(--color-body)]">
                    <p className="font-semibold text-[var(--color-heading)]">
                      Learning materials coming soon
                    </p>
                    <p className="mt-1">
                      Published instructor modules and lessons will appear here as your cohort begins.
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 space-y-4">
                    {payload.modules.map((mod, mIdx) => (
                      <div key={mod.id} className="space-y-1.5">
                        <p className="font-en text-xs font-bold uppercase tracking-wide text-[var(--color-body)]">
                          Module {mIdx + 1}: {mod.title}
                        </p>
                        <ul className="space-y-1">
                          {mod.lessons.map((les) => {
                            const done = payload.completedLessonIds.includes(les.id);
                            const selected = !activeQuizId && activeLessonId === les.id;
                            return (
                              <li key={les.id}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveQuizId(null);
                                    setActiveLessonId(les.id);
                                  }}
                                  className={`flex w-full items-start gap-2.5 rounded-[8px] px-3 py-2 text-left font-en text-xs transition-colors cursor-pointer ${
                                    selected
                                      ? 'bg-[var(--color-tint)] font-semibold text-[var(--color-primary)]'
                                      : 'text-[var(--color-heading)] hover:bg-[var(--color-soft-bg)]'
                                  }`}
                                >
                                  {done ? (
                                    <CheckCircle2
                                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-free)]"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <Circle
                                      className="mt-0.5 h-4 w-4 shrink-0 text-slate-300"
                                      aria-hidden="true"
                                    />
                                  )}
                                  <span className="flex-1">{les.title}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {payload.quizzes.length > 0 && (
                  <div className="mt-5 border-t border-[var(--color-border)] pt-4">
                    <h4 className="font-en text-xs font-bold uppercase tracking-wide text-[var(--color-body)]">
                      Quizzes &amp; Assessments
                    </h4>
                    <ul className="mt-2 space-y-1">
                      {payload.quizzes.map((q) => (
                        <li key={q.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveQuizId(q.id);
                              setQuizAnswers({});
                              setQuizResult(null);
                            }}
                            className={`flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left font-en text-xs transition-colors cursor-pointer ${
                              activeQuizId === q.id
                                ? 'bg-[var(--color-tint)] font-semibold text-[var(--color-primary)]'
                                : 'text-[var(--color-heading)] hover:bg-[var(--color-soft-bg)]'
                            }`}
                          >
                            <HelpCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <span>{q.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Downloadable Resources Panel */}
              <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4">
                <h3 className="font-en text-sm font-bold text-[var(--color-heading)]">
                  Course Resources
                </h3>
                {payload.resources.length === 0 ? (
                  <p className="mt-2 font-en text-xs text-[var(--color-body)]">
                    No downloadable files uploaded yet.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {payload.resources.map((r) => (
                      <li key={r.id}>
                        <a
                          href={r.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 py-2 font-en text-xs font-medium text-[var(--color-heading)] hover:border-[var(--color-primary)]"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <FileText className="h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                            <span className="truncate">{r.title}</span>
                          </span>
                          {r.resource_type === 'pdf' ? (
                            <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          ) : (
                            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>

            {/* Main Lesson / Syllabus / Quiz Content Area */}
            <div className="lg:col-span-8">
              {activeQuiz ? (
                <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-6">
                  <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                    <div>
                      <span className="font-en text-xs font-bold uppercase text-[var(--color-primary)]">
                        Course Quiz · Passing Score {activeQuiz.passingScore}%
                      </span>
                      <h3 className="mt-1 font-en text-xl font-bold text-[var(--color-heading)]">
                        {activeQuiz.title}
                      </h3>
                    </div>
                  </div>

                  {activeQuiz.instructions && (
                    <p className="mt-4 font-en text-sm text-[var(--color-body)]">
                      {activeQuiz.instructions}
                    </p>
                  )}

                  {quizResult ? (
                    <div className="mt-6 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-6">
                      <p className="font-en text-xs font-bold uppercase text-[var(--color-body)]">
                        Attempt Recorded
                      </p>
                      <p className="mt-1 font-mono-tabular text-3xl font-bold text-[var(--color-heading)]">
                        {quizResult.scorePercent}%
                      </p>
                      <p
                        className={`mt-1 font-en text-sm font-semibold ${
                          quizResult.passed ? 'text-[var(--color-free)]' : 'text-red-700'
                        }`}
                      >
                        {quizResult.passed
                          ? `Passed (${quizResult.correctCount}/${quizResult.totalQuestions} correct)`
                          : `Score below ${activeQuiz.passingScore}% (${quizResult.correctCount}/${quizResult.totalQuestions} correct)`}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setQuizResult(null);
                          setQuizAnswers({});
                        }}
                        className="mt-4 inline-flex min-h-[40px] items-center rounded-[8px] border border-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-tint)] cursor-pointer"
                      >
                        Retake Quiz
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-6">
                      {activeQuiz.questions.map((q, qIdx) => (
                        <div
                          key={q.id}
                          className="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4"
                        >
                          <p className="font-en text-sm font-semibold text-[var(--color-heading)]">
                            {qIdx + 1}. {q.prompt}
                          </p>
                          <div className="mt-3 space-y-2">
                            {q.options.map((opt, optIdx) => (
                              <label
                                key={optIdx}
                                className="flex cursor-pointer items-center gap-2.5 rounded-[8px] border border-[var(--color-border)] bg-white px-3 py-2 font-en text-sm text-[var(--color-heading)] hover:border-[var(--color-primary)]"
                              >
                                <input
                                  type="radio"
                                  name={`quiz-${activeQuiz.id}-${q.id}`}
                                  checked={quizAnswers[q.id] === optIdx}
                                  onChange={() =>
                                    setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                  }
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        disabled={busyAction}
                        onClick={() => handleQuizSubmit(activeQuiz.id)}
                        className="inline-flex min-h-[44px] items-center rounded-[8px] bg-[var(--color-primary)] px-6 py-2.5 font-en text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60 cursor-pointer"
                      >
                        {busyAction ? 'Submitting...' : 'Submit Quiz Answers'}
                      </button>
                    </div>
                  )}
                </div>
              ) : activeLesson ? (
                <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-border)] pb-4">
                    <div>
                      <h3 className="font-en text-xl font-bold text-[var(--color-heading)]">
                        {activeLesson.title}
                      </h3>
                      {activeLesson.duration_minutes && (
                        <p className="mt-1 font-en text-xs text-[var(--color-body)]">
                          Estimated reading/lesson time: {activeLesson.duration_minutes} minutes
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleBookmark(activeLesson.id)}
                        aria-label="Bookmark lesson"
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] border transition-colors cursor-pointer ${
                          payload.bookmarkedLessonIds.includes(activeLesson.id)
                            ? 'border-[var(--color-primary)] bg-[var(--color-tint)] text-[var(--color-primary)]'
                            : 'border-[var(--color-border)] text-[var(--color-body)] hover:bg-[var(--color-soft-bg)]'
                        }`}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${
                            payload.bookmarkedLessonIds.includes(activeLesson.id)
                              ? 'fill-current'
                              : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        type="button"
                        disabled={busyAction}
                        onClick={() =>
                          handleToggleLessonComplete(
                            activeLesson.id,
                            payload.completedLessonIds.includes(activeLesson.id)
                          )
                        }
                        className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-[8px] px-4 py-2 font-en text-xs font-semibold transition-colors cursor-pointer ${
                          payload.completedLessonIds.includes(activeLesson.id)
                            ? 'border border-[var(--color-free)] bg-[#EAF7EE] text-[var(--color-free)]'
                            : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        <span>
                          {payload.completedLessonIds.includes(activeLesson.id)
                            ? 'Completed'
                            : 'Mark Lesson Complete'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {activeLesson.video_url && (
                    <div className="mt-5 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 font-en text-sm font-semibold text-[var(--color-heading)]">
                          <PlayCircle className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
                          <span>Video Lesson Material</span>
                        </div>
                        <a
                          href={activeLesson.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-en text-xs font-semibold text-[var(--color-primary)] hover:underline"
                        >
                          <span>Open Video</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  )}

                  {activeLesson.summary && (
                    <p className="mt-5 font-en text-sm font-medium leading-relaxed text-[var(--color-heading)]">
                      {activeLesson.summary}
                    </p>
                  )}

                  <div className="prose-measure mt-4 whitespace-pre-wrap font-en text-sm leading-relaxed text-[var(--color-body)]">
                    {activeLesson.content_markdown ||
                      'Detailed lesson reading notes for this session will appear here.'}
                  </div>

                  {/* Prev / Next Navigation */}
                  <div className="mt-8 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                    <button
                      type="button"
                      disabled={activeLessonIndex <= 0}
                      onClick={() => setActiveLessonId(allLessons[activeLessonIndex - 1].id)}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[8px] border border-[var(--color-border)] px-3.5 py-2 font-en text-xs font-semibold text-[var(--color-heading)] disabled:opacity-40 cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Previous Lesson</span>
                    </button>

                    <button
                      type="button"
                      disabled={activeLessonIndex < 0 || activeLessonIndex >= allLessons.length - 1}
                      onClick={() => setActiveLessonId(allLessons[activeLessonIndex + 1].id)}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[8px] border border-[var(--color-border)] px-3.5 py-2 font-en text-xs font-semibold text-[var(--color-heading)] disabled:opacity-40 cursor-pointer"
                    >
                      <span>Next Lesson</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Honest Learning Materials Coming Soon + Official Course Syllabus Overview */
                <div className="space-y-6 rounded-[12px] border border-[var(--color-border)] bg-white p-6">
                  <div className="flex items-start gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-tint)] p-4">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                    <div className="font-en text-sm text-[var(--color-heading)]">
                      <p className="font-bold">Learning materials coming soon</p>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--color-body)]">
                        Your enrolment for <strong>{payload.course.title}</strong> is confirmed. No video recordings or lesson packets have been published yet — you will receive a notification as soon as the instructor publishes Module 1 materials. Below is your verified course syllabus outline.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-en text-base font-bold text-[var(--color-heading)]">
                      Course Overview
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
                      {payload.course.overview}
                    </p>
                  </div>

                  {payload.course.syllabusOutline.length > 0 && (
                    <div>
                      <h3 className="font-en text-base font-bold text-[var(--color-heading)]">
                        Official Curriculum Outline
                      </h3>
                      <div className="mt-3 space-y-3">
                        {payload.course.syllabusOutline.map((m) => (
                          <div
                            key={m.code}
                            className="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4"
                          >
                            <p className="font-en text-xs font-bold text-[var(--color-primary)]">
                              {m.code}
                            </p>
                            <p className="mt-0.5 font-en text-sm font-bold text-[var(--color-heading)]">
                              {m.title}
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-[var(--color-body)]">
                              {m.topics.map((t, i) => (
                                <li key={i}>{t}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
