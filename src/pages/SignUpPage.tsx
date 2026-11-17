import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, UserPlus } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageBanner } from '../components/PageBanner';
import { useAuth } from '../context/AuthContext';
import { IDENTITY_OPTIONS } from '../services/demoAuth';

export function SignUpPage() {
  const { authLoading, isAuthenticated, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const requestedFrom = (location.state as { from?: string } | null)?.from || '/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authLoading && isAuthenticated) {
    return <Navigate to={requestedFrom} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        country: country.trim() || 'Bangladesh',
        identity,
      });
      navigate(requestedFrom, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Sign Up' }]}
        title="Create Learner Account"
        subtitle="Register for your Atlas AI Education Learner Dashboard to track courses, materials, assignments, and certificates."
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
                <UserPlus className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                  Learner Registration
                </h2>
                <p className="font-en text-xs text-[var(--color-body)]">
                  Secure account creation with email verification
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

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="block font-en text-sm font-semibold text-[var(--color-heading)]"
                >
                  Full Name *
                </label>
                <input
                  id="signup-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name (used on certificates)"
                  className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block font-en text-sm font-semibold text-[var(--color-heading)]"
                >
                  Email Address *
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="signup-phone"
                    className="block font-en text-sm font-semibold text-[var(--color-heading)]"
                  >
                    Mobile Number (Optional)
                  </label>
                  <input
                    id="signup-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1XXX-XXXXXX"
                    className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="signup-country"
                    className="block font-en text-sm font-semibold text-[var(--color-heading)]"
                  >
                    Country
                  </label>
                  <input
                    id="signup-country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-identity"
                  className="block font-en text-sm font-semibold text-[var(--color-heading)]"
                >
                  Role / Background (Optional)
                </label>
                <select
                  id="signup-identity"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                >
                  <option value="">Select background</option>
                  {IDENTITY_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block font-en text-sm font-semibold text-[var(--color-heading)]"
                >
                  Password (min 8 characters) *
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="block font-en text-sm font-semibold text-[var(--color-heading)]"
                >
                  Confirm Password *
                </label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <p className="mt-4 font-en text-xs leading-relaxed text-[var(--color-body)]">
              By creating an account you agree to our{' '}
              <Link to="/terms" className="font-semibold text-[var(--color-primary)] hover:underline">
                Terms &amp; Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-semibold text-[var(--color-primary)] hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-6 py-2.5 font-en text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-60 cursor-pointer"
            >
              <span>{submitting ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <p className="mt-5 border-t border-[var(--color-border)] pt-5 text-center font-en text-sm text-[var(--color-body)]">
              Already have an account?{' '}
              <Link
                to="/login"
                state={{ from: requestedFrom }}
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                Sign in →
              </Link>
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
}
