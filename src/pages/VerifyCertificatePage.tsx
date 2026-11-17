import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Award, CheckCircle2, Info, Search, ShieldAlert } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageBanner } from '../components/PageBanner';
import { apiRequest } from '../services/api';

interface VerifiedCertData {
  certificateCode: string;
  holderName: string;
  courseCode: string;
  courseTitle: string;
  certificateTitle: string;
  categoryName: string;
  status: 'Issued' | 'Revoked';
  issuedAt: string;
  issuer: string;
  disclosure: string;
}

export function VerifyCertificatePage() {
  const { code = '' } = useParams<{ code?: string }>();
  const navigate = useNavigate();

  const [inputCode, setInputCode] = useState(code);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; certificate: VerifiedCertData } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performVerify = useCallback(async (targetCode: string) => {
    const clean = targetCode.trim().toUpperCase();
    if (!clean) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiRequest<{ valid: boolean; certificate: VerifiedCertData }>(
        `/api/certificates/verify/${encodeURIComponent(clean)}`
      );
      setResult(data);
    } catch (err) {
      setError((err as Error).message || 'Certificate record not found.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (code) {
      setInputCode(code);
      performVerify(code);
    }
  }, [code, performVerify]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCode.trim().toUpperCase();
    if (!clean) return;
    navigate(`/verify-certificate/${encodeURIComponent(clean)}`);
  };

  return (
    <Layout>
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Verify Certificate' }]}
        title="Verify Certificate"
        subtitle="Confirm the authenticity and status of Atlas AI Education completion and participation certificates."
      />

      <section className="bg-[var(--color-soft-bg)]">
        <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
          <form
            onSubmit={handleSubmit}
            className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:p-8"
          >
            <label
              htmlFor="cert-code-input"
              className="block font-en text-sm font-semibold text-[var(--color-heading)]"
            >
              Certificate Verification ID
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id="cert-code-input"
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="e.g. AAE-CERT-2026-XXXXXX"
                className="min-h-[44px] flex-1 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-mono-tabular text-sm uppercase text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-5 py-2.5 font-en text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60 cursor-pointer"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>{loading ? 'Checking...' : 'Verify'}</span>
              </button>
            </div>
          </form>

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2.5 rounded-[12px] border border-red-200 bg-red-50 p-5 font-en text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-bold">Certificate Not Found</p>
                <p className="mt-1 text-xs">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6 rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
                <div className="flex items-center gap-2.5">
                  {result.valid ? (
                    <CheckCircle2 className="h-6 w-6 text-[var(--color-free)]" aria-hidden="true" />
                  ) : (
                    <ShieldAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
                  )}
                  <div>
                    <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                      {result.valid ? 'Verified Authentic Certificate' : 'Certificate Revoked'}
                    </h2>
                    <p className="font-en text-xs text-[var(--color-body)]">
                      {result.certificate.issuer}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-[6px] border px-3 py-1 font-en text-xs font-bold ${
                    result.valid
                      ? 'border-[var(--color-free)] bg-[#EAF7EE] text-[var(--color-free)]'
                      : 'border-red-300 bg-red-50 text-red-700'
                  }`}
                >
                  {result.certificate.status}
                </span>
              </div>

              <dl className="mt-5 divide-y divide-[var(--color-border)] font-en text-sm">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[var(--color-body)]">Certificate ID</dt>
                  <dd className="font-mono-tabular font-bold text-[var(--color-primary)]">
                    {result.certificate.certificateCode}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[var(--color-body)]">Awarded To</dt>
                  <dd className="font-bold text-[var(--color-heading)]">
                    {result.certificate.holderName}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[var(--color-body)]">Certificate Designation</dt>
                  <dd className="flex items-center gap-1.5 font-semibold text-[var(--color-heading)]">
                    <Award className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                    <span>{result.certificate.certificateTitle}</span>
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[var(--color-body)]">Programme</dt>
                  <dd className="text-right font-semibold text-[var(--color-heading)]">
                    {result.certificate.courseCode} — {result.certificate.courseTitle}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[var(--color-body)]">Category</dt>
                  <dd className="text-[var(--color-heading)]">{result.certificate.categoryName}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[var(--color-body)]">Issue Date</dt>
                  <dd className="text-[var(--color-heading)]">
                    {new Date(result.certificate.issuedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex items-start gap-2 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-3.5 font-en text-xs text-[var(--color-body)]">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                <span>{result.certificate.disclosure}</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
