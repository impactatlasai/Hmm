import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageBanner } from '../components/PageBanner';
import { apiRequest } from '../services/api';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const initialToken = params.get('token') || '';

  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError('A valid password reset token is required.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token: token.trim(), newPassword }),
      });
      setDone(true);
    } catch (err) {
      setError((err as Error).message || 'Could not reset password.');
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
          { label: 'Reset Password' },
        ]}
        title="Reset Password"
        subtitle="Set a new password for your Atlas AI Education account."
      />

      <section className="bg-[var(--color-soft-bg)]">
        <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
          <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:p-8">
            {done ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2.5 rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 font-en text-sm text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-free)]" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">Password Updated</p>
                    <p className="mt-1 text-xs text-[var(--color-body)]">
                      Your password has been updated and previous sessions were signed out for your security.
                    </p>
                  </div>
                </div>
                <Link
                  to="/login"
                  className="inline-flex min-h-[44px] items-center rounded-[8px] bg-[var(--color-primary)] px-5 py-2.5 font-en text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
                >
                  Proceed to Login →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--color-tint)] text-[var(--color-primary)]">
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                      Choose a New Password
                    </h2>
                    <p className="font-en text-xs text-[var(--color-body)]">
                      Single-use reset verification
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

                {!initialToken && (
                  <div>
                    <label
                      htmlFor="reset-token"
                      className="block font-en text-sm font-semibold text-[var(--color-heading)]"
                    >
                      Reset Token *
                    </label>
                    <input
                      id="reset-token"
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-mono-tabular text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="reset-password"
                    className="block font-en text-sm font-semibold text-[var(--color-heading)]"
                  >
                    New Password (min 8 characters) *
                  </label>
                  <input
                    id="reset-password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reset-confirm"
                    className="block font-en text-sm font-semibold text-[var(--color-heading)]"
                  >
                    Confirm New Password *
                  </label>
                  <input
                    id="reset-confirm"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-6 py-2.5 font-en text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
