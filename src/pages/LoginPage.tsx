import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Lock } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageBanner } from '../components/PageBanner';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { authLoading, isAuthenticated, user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const requestedFrom = (location.state as { from?: string } | null)?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authLoading && isAuthenticated && user) {
    const defaultDest =
      requestedFrom || (user.role === 'admin' || user.role === 'instructor' ? '/admin' : '/dashboard');
    return <Navigate to={defaultDest} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 1) {
      setError('Please enter your password.');
      return;
    }

    setSubmitting(true);
    try {
      const signedIn = await login(email.trim(), password);
      const dest =
        requestedFrom ||
        (signedIn.role === 'admin' || signedIn.role === 'instructor' ? '/admin' : '/dashboard');
      navigate(dest, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Login' }]}
        title="Learner Login"
        subtitle="Sign in to access your enrolled courses, assignments, certificates, and payment history."
      />

      <section className="bg-[var(--color-soft-bg)]">
        <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:p-8"
          >
            <div className="mb-6 flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--color-tint)] text-[var(--color-primary)]">
                <Lock className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                  Sign in to Atlas AI Education
                </h2>
                <p className="font-en text-xs text-[var(--color-body)]">
                  Protected session authentication
                </p>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2 rounded-[8px] border border-red-200 bg-red-50 p-3.5 font-en text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="login-email"
                  className="block font-en text-sm font-semibold text-[var(--color-heading)]"
                >
                  Email Address *
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="login-password"
                    className="block font-en text-sm font-semibold text-[var(--color-heading)]"
                  >
                    Password *
                  </label>
                  <Link
                    to="/forgot-password"
                    className="font-en text-xs font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-6 py-2.5 font-en text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-60 cursor-pointer"
            >
              <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <p className="mt-5 border-t border-[var(--color-border)] pt-5 text-center font-en text-sm text-[var(--color-body)]">
              New to Atlas AI Education?{' '}
              <Link
                to="/signup"
                state={{ from: requestedFrom }}
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                Create an account →
              </Link>
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
}
