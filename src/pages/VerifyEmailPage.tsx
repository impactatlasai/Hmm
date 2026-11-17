import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageBanner } from '../components/PageBanner';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const { refreshSession, clearVerificationPreview, isAuthenticated } = useAuth();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing email verification token.');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest<{ message: string }>('/api/auth/verify-email', {
          method: 'POST',
          body: JSON.stringify({ token }),
        });
        if (!cancelled) {
          setStatus('success');
          setMessage(res.message);
          clearVerificationPreview();
          await refreshSession();
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setMessage((err as Error).message || 'Verification failed.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, refreshSession, clearVerificationPreview]);

  return (
    <Layout>
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Verify Email' }]}
        title="Email Verification"
        subtitle="Confirming your Atlas AI Education learner email address."
      />

      <section className="bg-[var(--color-soft-bg)]">
        <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
          <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:p-8">
            {status === 'loading' && (
              <div className="flex items-center gap-3 font-en text-sm text-[var(--color-heading)]">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--color-primary)]" aria-hidden="true" />
                <span>Verifying your email address...</span>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <div className="flex items-start gap-2.5 rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 font-en text-sm text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-free)]" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">Email Address Verified</p>
                    <p className="mt-1 text-xs text-[var(--color-body)]">{message}</p>
                  </div>
                </div>
                <Link
                  to={isAuthenticated ? '/dashboard' : '/login'}
                  className="inline-flex min-h-[44px] items-center rounded-[8px] bg-[var(--color-primary)] px-5 py-2.5 font-en text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
                >
                  {isAuthenticated ? 'Go to Learner Dashboard →' : 'Sign In →'}
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="flex items-start gap-2.5 rounded-[8px] border border-red-200 bg-red-50 p-4 font-en text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">Verification Failed</p>
                    <p className="mt-1 text-xs">{message}</p>
                  </div>
                </div>
                <Link
                  to={isAuthenticated ? '/dashboard/settings' : '/login'}
                  className="inline-block font-en text-sm font-semibold text-[var(--color-primary)] hover:underline"
                >
                  {isAuthenticated ? '← Back to Account Settings' : '← Back to Login'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
