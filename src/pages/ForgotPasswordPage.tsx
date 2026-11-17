import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageBanner } from '../components/PageBanner';
import { apiRequest } from '../services/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    message: string;
    resetPreviewPath?: string;
    emailDeliveryStatus?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiRequest<{
        message: string;
        resetPreviewPath?: string;
        emailDeliveryStatus?: string;
      }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      });
      setResult(data);
    } catch (err) {
      setError((err as Error).message || 'Could not process password reset request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageBanner
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Login', to: '/login' },
          { label: 'Forgot Password' },
        ]}
        title="Forgot Password"
        subtitle="Request a time-limited password reset link for your Atlas AI Education account."
      />

      <section className="bg-[var(--color-soft-bg)]">
        <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
          <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:p-8">
            {result ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2.5 rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 font-en text-sm text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-free)]" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">Reset Request Processed</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--color-body)]">
                      {result.message}
                    </p>
                  </div>
                </div>

                {result.resetPreviewPath && (
                  <div className="rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4 font-en text-xs text-[var(--color-heading)]">
                    <p className="font-bold">Pending Email Provider Integration</p>
                    <p className="mt-1 text-[var(--color-body)]">
                      SMTP outbound mail is not configured in this environment. Use your generated single-use reset link directly:
                    </p>
                    <Link
                      to={result.resetPreviewPath}
                      className="mt-3 inline-flex min-h-[40px] items-center rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-semibold text-white hover:bg-[var(--color-primary-hover)]"
                    >
                      Open Password Reset Page →
                    </Link>
                  </div>
                )}

                <Link
                  to="/login"
                  className="inline-block font-en text-sm font-semibold text-[var(--color-primary)] hover:underline"
                >
                  ← Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--color-tint)] text-[var(--color-primary)]">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                      Reset Your Password
                    </h2>
                    <p className="font-en text-xs text-[var(--color-body)]">
                      Enter the email address linked to your account
                    </p>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-[8px] border border-red-200 bg-red-50 p-3.5 font-en text-sm text-red-700"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block font-en text-sm font-semibold text-[var(--color-heading)]"
                  >
                    Registered Email Address *
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-6 py-2.5 font-en text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? 'Generating Link...' : 'Send Reset Link'}
                </button>

                <p className="border-t border-[var(--color-border)] pt-4 text-center font-en text-sm text-[var(--color-body)]">
                  Remembered your password?{' '}
                  <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
                    Back to Login →
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
