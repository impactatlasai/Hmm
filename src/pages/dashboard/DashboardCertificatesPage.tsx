import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Award,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Info,
  Loader2,
  Printer,
  X,
} from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { apiRequest } from '../../services/api';

interface CertificateRow {
  id: string;
  certificate_code: string;
  course_code: string;
  certificate_title: string;
  holder_name: string;
  category_name: string;
  status: 'Issued' | 'Revoked';
  issued_at: string;
  duration: string;
}

interface EligibilityItem {
  courseCode: string;
  courseTitle: string;
  categoryName: string;
  certificateLabel: string;
  hasPublishedLearningContent: boolean;
  eligible: boolean;
  unmetReasons: string[];
  existingCertificate: { certificate_code: string; status: string } | null;
}

export function DashboardCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);
  const [eligibility, setEligibility] = useState<EligibilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewCert, setPreviewCert] = useState<CertificateRow | null>(null);
  const [requestingCode, setRequestingCode] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadCertificates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{
        certificates: CertificateRow[];
        eligibility: EligibilityItem[];
      }>('/api/dashboard/certificates');
      setCertificates(res.certificates);
      setEligibility(res.eligibility);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const handleCopyVerifyLink = async (code: string) => {
    const url = `${window.location.origin}/verify-certificate/${code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(code);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  const handleRequestCertificate = async (courseCode: string) => {
    setRequestingCode(courseCode);
    setActionMsg(null);
    try {
      await apiRequest(`/api/dashboard/certificates/${encodeURIComponent(courseCode)}/request`, {
        method: 'POST',
      });
      setActionMsg('Your certificate has been generated and issued.');
      await loadCertificates();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRequestingCode(null);
    }
  };

  return (
    <DashboardLayout
      title="Certificates & Achievements"
      subtitle="Verified non-accredited completion and participation certificates."
    >
      {loading ? (
        <div className="flex items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-white p-12 font-en text-sm text-[var(--color-body)]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--color-primary)]" aria-hidden="true" />
          Loading certificates...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Transparency Notice */}
          <div className="flex items-start gap-2.5 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-tint)] p-4 font-en text-xs text-[var(--color-heading)]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
            <span>
              Atlas AI Education certificates are <strong>non-accredited educational certificates</strong> issued upon verified completion of course requirements. Category designations: <strong>Learning Basic Certificate</strong> (AI Literacy &amp; Foundation), <strong>Foundation Certificate</strong> (Applied AI), and <strong>Certificate Programme</strong> (Professional Development).
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-[8px] border border-red-200 bg-red-50 p-3.5 font-en text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {actionMsg && (
            <div className="flex items-center gap-2 rounded-[8px] border border-emerald-200 bg-emerald-50 p-3.5 font-en text-sm font-medium text-[#1E8E3E]">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{actionMsg}</span>
            </div>
          )}

          {/* Issued Certificates */}
          <section>
            <h2 className="mb-3 font-en text-lg font-bold text-[var(--color-heading)]">
              Earned Certificates ({certificates.length})
            </h2>

            {certificates.length === 0 ? (
              <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-8 text-center font-en">
                <Award className="mx-auto h-10 w-10 text-[var(--color-primary)]" aria-hidden="true" />
                <p className="mt-3 text-base font-bold text-[var(--color-heading)]">
                  No certificates issued yet
                </p>
                <p className="mx-auto mt-1 max-w-md text-xs text-[var(--color-body)]">
                  Certificates are issued strictly after completing required lessons, assessments, and course criteria.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-[12px] border border-[var(--color-border)] bg-white p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-en text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">
                          {cert.certificate_title}
                        </p>
                        <h3 className="mt-1 font-en text-lg font-bold text-[var(--color-heading)]">
                          {cert.course_code} — {cert.category_name}
                        </h3>
                      </div>
                      <span
                        className={`rounded-[6px] border px-2.5 py-0.5 font-en text-xs font-bold ${
                          cert.status === 'Issued'
                            ? 'border-[var(--color-free)] bg-[#EAF7EE] text-[var(--color-free)]'
                            : 'border-red-300 bg-red-50 text-red-700'
                        }`}
                      >
                        {cert.status === 'Issued' ? 'Verified' : 'Revoked'}
                      </span>
                    </div>

                    <dl className="mt-4 space-y-1.5 border-t border-[var(--color-border)] pt-4 font-en text-xs">
                      <div className="flex justify-between">
                        <dt className="text-[var(--color-body)]">Holder Name</dt>
                        <dd className="font-semibold text-[var(--color-heading)]">{cert.holder_name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-[var(--color-body)]">Certificate ID</dt>
                        <dd className="font-mono-tabular font-bold text-[var(--color-primary)]">
                          {cert.certificate_code}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-[var(--color-body)]">Issue Date</dt>
                        <dd className="text-[var(--color-heading)]">
                          {new Date(cert.issued_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewCert(cert)}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-[8px] bg-[var(--color-primary)] px-3.5 py-1.5 font-en text-xs font-semibold text-white hover:bg-[var(--color-primary-hover)] cursor-pointer"
                      >
                        <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>View / Print PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyVerifyLink(cert.certificate_code)}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-[8px] border border-[var(--color-border)] bg-white px-3 py-1.5 font-en text-xs font-semibold text-[var(--color-heading)] hover:bg-[var(--color-soft-bg)] cursor-pointer"
                      >
                        {copiedId === cert.certificate_code ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[var(--color-free)]" aria-hidden="true" />
                            <span>Link Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Copy Verification URL</span>
                          </>
                        )}
                      </button>

                      <Link
                        to={`/verify-certificate/${cert.certificate_code}`}
                        className="inline-flex min-h-[38px] items-center gap-1 rounded-[8px] border border-[var(--color-border)] px-3 py-1.5 font-en text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-tint)]"
                      >
                        <span>Verify Page</span>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Eligibility Progress for Enrolled Courses */}
          {eligibility.length > 0 && (
            <section className="rounded-[12px] border border-[var(--color-border)] bg-white p-6">
              <h2 className="font-en text-base font-bold text-[var(--color-heading)]">
                Course Certificate Eligibility Status
              </h2>
              <div className="mt-4 divide-y divide-[var(--color-border)]">
                {eligibility.map((item) => (
                  <div
                    key={item.courseCode}
                    className="flex flex-col justify-between gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="font-en text-sm font-bold text-[var(--color-heading)]">
                        {item.courseCode} — {item.courseTitle}
                      </p>
                      <p className="font-en text-xs text-[var(--color-primary)]">
                        Designation: {item.certificateLabel}
                      </p>
                      {item.existingCertificate ? (
                        <p className="mt-1 font-en text-xs text-[var(--color-free)]">
                          Issued ({item.existingCertificate.certificate_code})
                        </p>
                      ) : item.unmetReasons.length > 0 ? (
                        <ul className="mt-1.5 list-disc space-y-0.5 pl-4 font-en text-xs text-[var(--color-body)]">
                          {item.unmetReasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1 font-en text-xs font-semibold text-[var(--color-free)]">
                          All configured completion criteria met.
                        </p>
                      )}
                    </div>

                    {!item.existingCertificate && item.eligible && (
                      <button
                        type="button"
                        disabled={requestingCode === item.courseCode}
                        onClick={() => handleRequestCertificate(item.courseCode)}
                        className="inline-flex min-h-[40px] shrink-0 items-center rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60 cursor-pointer"
                      >
                        {requestingCode === item.courseCode ? 'Issuing...' : 'Claim Certificate'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Printable Certificate Preview Modal */}
      {previewCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 overflow-y-auto print:bg-white print:p-0"
          onClick={() => setPreviewCert(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-[12px] bg-white p-6 shadow-2xl sm:p-10 print:shadow-none print:max-w-none"
          >
            <div className="mb-4 flex items-center justify-between print:hidden">
              <span className="font-en text-xs font-semibold text-[var(--color-body)]">
                Print Preview (Use browser Print → Save as PDF)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-[8px] bg-[var(--color-primary)] px-3.5 py-2 font-en text-xs font-semibold text-white cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewCert(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--color-border)] text-[var(--color-body)] cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="rounded-[12px] border-2 border-[var(--color-navy)] bg-[var(--color-soft-bg)] p-8 text-center">
              <p className="font-en text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
                Atlas AI Education · Atlas AI Institute
              </p>
              <h2 className="mt-3 font-en text-2xl font-bold text-[var(--color-navy)] sm:text-3xl">
                {previewCert.certificate_title}
              </h2>
              <p className="mt-5 font-en text-sm text-[var(--color-body)]">This is to confirm that</p>
              <p className="mt-2 font-en text-2xl font-bold text-[var(--color-heading)]">
                {previewCert.holder_name}
              </p>
              <p className="mt-4 font-en text-sm text-[var(--color-body)]">
                has completed all programme requirements for
              </p>
              <p className="mt-1 font-en text-lg font-bold text-[var(--color-primary)]">
                {previewCert.course_code} — {previewCert.category_name}
              </p>

              <div className="mt-8 grid gap-4 border-t border-[var(--color-border)] pt-6 text-left font-en text-xs sm:grid-cols-3">
                <div>
                  <span className="text-[var(--color-body)]">Certificate ID</span>
                  <p className="font-mono-tabular font-bold text-[var(--color-heading)]">
                    {previewCert.certificate_code}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--color-body)]">Date of Issue</span>
                  <p className="font-semibold text-[var(--color-heading)]">
                    {new Date(previewCert.issued_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--color-body)]">Verification Status</span>
                  <p className="font-bold text-[var(--color-free)]">{previewCert.status}</p>
                </div>
              </div>

              <p className="mt-6 font-en text-[11px] text-[var(--color-body)]">
                Non-accredited completion certificate issued by Atlas AI Education. Verify at /verify-certificate/{previewCert.certificate_code}
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
