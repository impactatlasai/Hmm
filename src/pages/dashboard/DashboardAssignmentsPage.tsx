import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  FileUp,
  Loader2,
  Lock,
} from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { apiRequest } from '../../services/api';

interface AssignmentRow {
  id: string;
  course_code: string;
  course_title: string;
  title: string;
  instructions: string;
  due_at: string | null;
  max_points: number;
  allow_file_upload: number;
  submission_id: string | null;
  submission_text: string | null;
  file_name: string | null;
  submission_status: 'Pending' | 'Submitted' | 'Under Review' | 'Reviewed' | 'Revision Required' | null;
  score: number | null;
  feedback: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
}

interface QuizAttemptRow {
  id: string;
  quiz_id: string;
  quiz_title: string;
  course_code: string;
  course_title: string;
  passing_score: number;
  score_percent: number;
  passed: number;
  submitted_at: string;
}

export function DashboardAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizAttemptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [textMap, setTextMap] = useState<Record<string, string>>({});
  const [fileMap, setFileMap] = useState<
    Record<string, { fileName: string; mimeType: string; dataBase64: string } | null>
  >({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{
        assignments: AssignmentRow[];
        quizHistory: QuizAttemptRow[];
      }>('/api/dashboard/assignments');
      setAssignments(res.assignments);
      setQuizHistory(res.quizHistory);
      const initialTexts: Record<string, string> = {};
      for (const a of res.assignments) {
        if (a.submission_text) initialTexts[a.id] = a.submission_text;
      }
      setTextMap(initialTexts);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFileSelect = (assignmentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubmitErr(null);

    if (file.size > 5 * 1024 * 1024) {
      setSubmitErr('Assignment file must be smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileMap((prev) => ({
        ...prev,
        [assignmentId]: {
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          dataBase64: String(reader.result || ''),
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (assignmentId: string) => {
    setSubmittingId(assignmentId);
    setSubmitErr(null);
    setSubmitMsg(null);
    try {
      await apiRequest(`/api/dashboard/assignments/${encodeURIComponent(assignmentId)}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          submissionText: textMap[assignmentId] || '',
          file: fileMap[assignmentId] || undefined,
        }),
      });
      setSubmitMsg('Submission saved successfully.');
      setActiveId(null);
      await loadData();
    } catch (err) {
      setSubmitErr((err as Error).message || 'Could not submit assignment.');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <DashboardLayout
      title="Assignments & Assessments"
      subtitle="Submit course projects, track instructor feedback, and review quiz results."
    >
      {loading ? (
        <div className="flex items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-white p-12 font-en text-sm text-[var(--color-body)]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--color-primary)]" aria-hidden="true" />
          Loading assignments and assessments...
        </div>
      ) : error ? (
        <div className="rounded-[12px] border border-red-200 bg-red-50 p-6 font-en text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="space-y-8">
          {submitMsg && (
            <div className="flex items-center gap-2 rounded-[8px] border border-emerald-200 bg-emerald-50 p-3.5 font-en text-sm font-medium text-[#1E8E3E]">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{submitMsg}</span>
            </div>
          )}
          {submitErr && (
            <div className="flex items-center gap-2 rounded-[8px] border border-red-200 bg-red-50 p-3.5 font-en text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{submitErr}</span>
            </div>
          )}

          {/* Assignments List */}
          <section className="space-y-4">
            <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
              Course Assignments
            </h2>

            {assignments.length === 0 ? (
              <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-8 text-center font-en">
                <ClipboardCheck className="mx-auto h-9 w-9 text-[var(--color-primary)]" aria-hidden="true" />
                <p className="mt-3 text-base font-bold text-[var(--color-heading)]">
                  No assignments published yet
                </p>
                <p className="mt-1 text-xs text-[var(--color-body)]">
                  Published assignments for your confirmed courses will appear here with submission deadlines.
                </p>
              </div>
            ) : (
              assignments.map((a) => {
                const status = a.submission_status || 'Pending';
                const isReviewed = status === 'Reviewed';
                const isExpanded = activeId === a.id;

                return (
                  <div
                    key={a.id}
                    className="rounded-[12px] border border-[var(--color-border)] bg-white p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-en text-xs font-bold text-[var(--color-primary)]">
                          {a.course_code} · {a.course_title}
                        </p>
                        <h3 className="mt-1 font-en text-lg font-bold text-[var(--color-heading)]">
                          {a.title}
                        </h3>
                        <p className="mt-1 flex flex-wrap items-center gap-2 font-en text-xs text-[var(--color-body)]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {a.due_at
                              ? `Due ${new Date(a.due_at).toLocaleDateString('en-GB')}`
                              : 'No fixed deadline'}
                          </span>
                          <span>·</span>
                          <span>Max Points: {a.max_points}</span>
                        </p>
                      </div>

                      <span
                        className={`rounded-[6px] border px-2.5 py-1 font-en text-xs font-bold ${
                          isReviewed
                            ? 'border-[var(--color-free)] bg-[#EAF7EE] text-[var(--color-free)]'
                            : status === 'Revision Required'
                            ? 'border-red-300 bg-red-50 text-red-700'
                            : status === 'Submitted' || status === 'Under Review'
                            ? 'border-blue-300 bg-[var(--color-tint)] text-[var(--color-primary)]'
                            : 'border-amber-300 bg-amber-50 text-amber-800'
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap font-en text-sm leading-relaxed text-[var(--color-body)]">
                      {a.instructions}
                    </p>

                    {/* Existing Submission & Feedback */}
                    {a.submission_id && (
                      <div className="mt-4 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4 font-en text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-[var(--color-heading)]">
                            Your Submission ({new Date(a.submitted_at!).toLocaleString('en-GB')})
                          </span>
                          {a.score !== null && (
                            <span className="font-mono-tabular font-bold text-[var(--color-primary)]">
                              Score: {a.score}/{a.max_points}
                            </span>
                          )}
                        </div>
                        {a.submission_text && (
                          <p className="mt-2 whitespace-pre-wrap text-[var(--color-heading)]">
                            {a.submission_text}
                          </p>
                        )}
                        {a.file_name && (
                          <a
                            href={`/api/files/submissions/${a.submission_id}`}
                            className="mt-2 inline-flex items-center gap-1.5 font-semibold text-[var(--color-primary)] hover:underline"
                          >
                            <Download className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{a.file_name}</span>
                          </a>
                        )}
                        {a.feedback && (
                          <div className="mt-3 border-t border-[var(--color-border)] pt-3">
                            <p className="font-bold text-[var(--color-heading)]">Instructor Feedback:</p>
                            <p className="mt-1 text-[var(--color-body)]">{a.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submission Actions */}
                    <div className="mt-4">
                      {isReviewed ? (
                        <p className="inline-flex items-center gap-1.5 font-en text-xs font-medium text-[var(--color-body)]">
                          <Lock className="h-3.5 w-3.5 text-[var(--color-free)]" aria-hidden="true" />
                          <span>Submission reviewed and locked by instructor.</span>
                        </p>
                      ) : isExpanded ? (
                        <div className="space-y-4 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4">
                          <div>
                            <label className="block font-en text-xs font-semibold text-[var(--color-heading)]">
                              Written Response / Notes
                            </label>
                            <textarea
                              rows={4}
                              value={textMap[a.id] || ''}
                              onChange={(e) =>
                                setTextMap((prev) => ({ ...prev, [a.id]: e.target.value }))
                              }
                              placeholder="Write your project summary, repository/document link, or answer..."
                              className="mt-1.5 w-full rounded-[8px] border border-[var(--color-border)] bg-white px-3 py-2 font-en text-sm focus:border-[var(--color-primary)] focus:outline-none"
                            />
                          </div>

                          {a.allow_file_upload === 1 && (
                            <div>
                              <label className="block font-en text-xs font-semibold text-[var(--color-heading)]">
                                Attach File (PDF, DOC, DOCX, TXT, PNG, JPG, ZIP — max 5 MB)
                              </label>
                              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                                <label className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-[8px] border border-[var(--color-border)] bg-white px-3 py-1.5 font-en text-xs font-semibold text-[var(--color-heading)] hover:border-[var(--color-primary)]">
                                  <FileUp className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                                  <span>Choose File</span>
                                  <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.zip"
                                    onChange={(e) => handleFileSelect(a.id, e)}
                                    className="sr-only"
                                  />
                                </label>
                                {fileMap[a.id] && (
                                  <span className="font-en text-xs text-[var(--color-primary)]">
                                    Selected: {fileMap[a.id]!.fileName}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={submittingId === a.id}
                              onClick={() => handleSubmit(a.id)}
                              className="inline-flex min-h-[40px] items-center rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60 cursor-pointer"
                            >
                              {submittingId === a.id ? 'Submitting...' : 'Submit Assignment'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveId(null)}
                              className="inline-flex min-h-[40px] items-center rounded-[8px] border border-[var(--color-border)] bg-white px-4 py-2 font-en text-xs font-semibold text-[var(--color-heading)] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveId(a.id)}
                          className="inline-flex min-h-[40px] items-center rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white hover:bg-[var(--color-primary-hover)] cursor-pointer"
                        >
                          {a.submission_id ? 'Update Submission' : 'Submit Assignment'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </section>

          {/* Quiz Assessment History */}
          <section className="rounded-[12px] border border-[var(--color-border)] bg-white p-6">
            <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
              Quiz &amp; Assessment History
            </h2>
            {quizHistory.length === 0 ? (
              <p className="mt-2 font-en text-xs text-[var(--color-body)]">
                No quiz attempts recorded yet. Published quizzes can be taken inside each course&apos;s Learning Centre.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-left font-en text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[var(--color-body)]">
                      <th className="py-2.5 pr-4 font-semibold">Course</th>
                      <th className="py-2.5 pr-4 font-semibold">Assessment</th>
                      <th className="py-2.5 pr-4 font-semibold">Score</th>
                      <th className="py-2.5 pr-4 font-semibold">Status</th>
                      <th className="py-2.5 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {quizHistory.map((q) => (
                      <tr key={q.id}>
                        <td className="py-3 pr-4 font-bold text-[var(--color-primary)]">
                          {q.course_code}
                        </td>
                        <td className="py-3 pr-4 font-medium text-[var(--color-heading)]">
                          {q.quiz_title}
                        </td>
                        <td className="py-3 pr-4 font-mono-tabular font-bold">
                          {q.score_percent}%
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`font-semibold ${
                              q.passed === 1 ? 'text-[var(--color-free)]' : 'text-red-700'
                            }`}
                          >
                            {q.passed === 1 ? 'Passed' : `Below ${q.passing_score}%`}
                          </span>
                        </td>
                        <td className="py-3 text-[var(--color-body)]">
                          {new Date(q.submitted_at).toLocaleDateString('en-GB')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}
