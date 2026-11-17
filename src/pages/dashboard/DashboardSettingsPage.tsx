import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  LogOut,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

interface SessionRow {
  id: string;
  userAgent: string;
  ip: string;
  createdAt: string;
  lastSeenAt: string;
  isCurrent: boolean;
}

export function DashboardSettingsPage() {
  const { user, updateProfile, refreshSession } = useAuth();

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);

  // Email Change
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailMsg, setEmailMsg] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);

  // Preferences
  const [emailUpdates, setEmailUpdates] = useState(user?.emailUpdates || false);
  const [studyReminders, setStudyReminders] = useState(
    Boolean(user?.prefs?.studyReminders)
  );
  const [prefSaved, setPrefSaved] = useState(false);

  // Active Sessions
  const [sessions, setSessions] = useState<SessionRow[]>([]);

  // Deletion Request
  const [deleteReason, setDeleteReason] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      const res = await apiRequest<{ sessions: SessionRow[] }>('/api/auth/sessions');
      setSessions(res.sessions);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwErr(null);
    setPwMsg(null);
    if (newPassword.length < 8) {
      setPwErr('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwErr('Passwords do not match.');
      return;
    }
    try {
      const res = await apiRequest<{ message: string }>('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPwMsg(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwErr((err as Error).message);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailErr(null);
    setEmailMsg(null);
    try {
      const res = await apiRequest<{ message: string }>('/api/auth/update-email', {
        method: 'POST',
        body: JSON.stringify({ newEmail: newEmail.trim(), currentPassword: emailPassword }),
      });
      setEmailMsg(res.message);
      setEmailPassword('');
      await refreshSession();
    } catch (err) {
      setEmailErr((err as Error).message);
    }
  };

  const handleSavePreferences = async () => {
    setPrefSaved(false);
    await updateProfile({
      emailUpdates,
      prefs: {
        ...(user?.prefs || {}),
        studyReminders,
      },
    });
    setPrefSaved(true);
  };

  const handleRevokeSession = async (id: string) => {
    await apiRequest(`/api/auth/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' });
    await loadSessions();
  };

  const handleDeletionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteErr(null);
    setDeleteMsg(null);
    try {
      const res = await apiRequest<{ message: string }>('/api/auth/account-deletion-request', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: deletePassword, reason: deleteReason }),
      });
      setDeleteMsg(res.message);
      setDeletePassword('');
    } catch (err) {
      setDeleteErr((err as Error).message);
    }
  };

  return (
    <DashboardLayout
      title="Account Settings"
      subtitle="Manage password, email address, active sessions, privacy preferences, and account deletion."
    >
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Change Password */}
          <form
            onSubmit={handlePasswordChange}
            className="rounded-[12px] border border-[var(--color-border)] bg-white p-6"
          >
            <div className="flex items-center gap-2 font-en text-base font-bold text-[var(--color-heading)]">
              <KeyRound className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
              <h2>Change Password</h2>
            </div>

            {pwErr && (
              <div className="mt-3 flex items-center gap-2 rounded-[8px] border border-red-200 bg-red-50 p-3 font-en text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{pwErr}</span>
              </div>
            )}
            {pwMsg && (
              <div className="mt-3 flex items-center gap-2 rounded-[8px] border border-emerald-200 bg-emerald-50 p-3 font-en text-xs text-[#1E8E3E]">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{pwMsg}</span>
              </div>
            )}

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="block font-en text-xs font-semibold text-[var(--color-heading)]">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 min-h-[40px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 py-2 font-en text-sm"
                />
              </div>
              <div>
                <label className="block font-en text-xs font-semibold text-[var(--color-heading)]">
                  New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 min-h-[40px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 py-2 font-en text-sm"
                />
              </div>
              <div>
                <label className="block font-en text-xs font-semibold text-[var(--color-heading)]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 min-h-[40px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 py-2 font-en text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 inline-flex min-h-[40px] items-center rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white hover:bg-[var(--color-primary-hover)] cursor-pointer"
            >
              Update Password
            </button>
          </form>

          {/* Update Email */}
          <form
            onSubmit={handleEmailChange}
            className="rounded-[12px] border border-[var(--color-border)] bg-white p-6"
          >
            <div className="flex items-center gap-2 font-en text-base font-bold text-[var(--color-heading)]">
              <Mail className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
              <h2>Update Email Address</h2>
            </div>

            {emailErr && (
              <div className="mt-3 flex items-center gap-2 rounded-[8px] border border-red-200 bg-red-50 p-3 font-en text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{emailErr}</span>
              </div>
            )}
            {emailMsg && (
              <div className="mt-3 flex items-center gap-2 rounded-[8px] border border-emerald-200 bg-emerald-50 p-3 font-en text-xs text-[#1E8E3E]">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{emailMsg}</span>
              </div>
            )}

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="block font-en text-xs font-semibold text-[var(--color-heading)]">
                  New Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 min-h-[40px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 py-2 font-en text-sm"
                />
              </div>
              <div>
                <label className="block font-en text-xs font-semibold text-[var(--color-heading)]">
                  Confirm Current Password
                </label>
                <input
                  type="password"
                  required
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  className="mt-1 min-h-[40px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 py-2 font-en text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 inline-flex min-h-[40px] items-center rounded-[8px] border border-[var(--color-primary)] bg-white px-4 py-2 font-en text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-tint)] cursor-pointer"
            >
              Update Email
            </button>
          </form>
        </div>

        {/* Preferences */}
        <section className="rounded-[12px] border border-[var(--color-border)] bg-white p-6">
          <h2 className="font-en text-base font-bold text-[var(--color-heading)]">
            Notification &amp; Learning Preferences
          </h2>
          <div className="mt-4 space-y-3 font-en text-sm">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={emailUpdates}
                onChange={(e) => setEmailUpdates(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)]"
              />
              <span>Receive cohort schedule &amp; programme announcements by email</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={studyReminders}
                onChange={(e) => setStudyReminders(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)]"
              />
              <span>Enable assignment deadline reminders inside dashboard notifications</span>
            </label>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSavePreferences}
              className="inline-flex min-h-[40px] items-center rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white hover:bg-[var(--color-primary-hover)] cursor-pointer"
            >
              Save Preferences
            </button>
            {prefSaved && (
              <span className="font-en text-xs font-semibold text-[var(--color-free)]">
                Preferences saved
              </span>
            )}
          </div>
        </section>

        {/* Active Sessions */}
        <section className="rounded-[12px] border border-[var(--color-border)] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-en text-base font-bold text-[var(--color-heading)]">
                Active Sessions
              </h2>
              <p className="font-en text-xs text-[var(--color-body)]">
                Review signed-in browsers and revoke other active sessions anytime.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRevokeSession('others')}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-[8px] border border-[var(--color-border)] px-3.5 py-1.5 font-en text-xs font-semibold text-[var(--color-heading)] hover:bg-[var(--color-soft-bg)] cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sign Out All Other Sessions</span>
            </button>
          </div>

          <ul className="mt-4 divide-y divide-[var(--color-border)] font-en text-xs">
            {sessions.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--color-heading)]">
                    {s.userAgent}
                    {s.isCurrent && (
                      <span className="ml-2 text-[var(--color-free)]">(Current Session)</span>
                    )}
                  </p>
                  <p className="text-[var(--color-body)]">
                    IP: {s.ip} · Last active {new Date(s.lastSeenAt).toLocaleString('en-GB')}
                  </p>
                </div>
                {!s.isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleRevokeSession(s.id)}
                    className="font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Revoke
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Account Deletion Request */}
        <section className="rounded-[12px] border border-red-200 bg-white p-6">
          <div className="flex items-center gap-2 font-en text-base font-bold text-red-700">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            <h2>Request Account Deletion</h2>
          </div>
          <p className="mt-2 font-en text-xs leading-relaxed text-[var(--color-body)]">
            Submitting an account deletion request flags your personal profile for removal by our data compliance team. Please note that verified payment records and issued certificate verification logs are retained only where required by audit compliance and our{' '}
            <Link to="/privacy" className="font-semibold text-[var(--color-primary)] hover:underline">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link to="/terms" className="font-semibold text-[var(--color-primary)] hover:underline">
              Terms &amp; Conditions
            </Link>
            .
          </p>

          {deleteErr && (
            <p className="mt-3 font-en text-xs font-semibold text-red-700">{deleteErr}</p>
          )}
          {deleteMsg && (
            <p className="mt-3 font-en text-xs font-semibold text-[#1E8E3E]">{deleteMsg}</p>
          )}

          <form onSubmit={handleDeletionRequest} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Optional reason"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="min-h-[40px] rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 py-2 font-en text-xs"
            />
            <input
              type="password"
              required
              placeholder="Confirm current password *"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="min-h-[40px] rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 py-2 font-en text-xs"
            />
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="inline-flex min-h-[40px] items-center rounded-[8px] border border-red-300 bg-red-50 px-4 py-2 font-en text-xs font-semibold text-red-700 hover:bg-red-100 cursor-pointer"
              >
                Submit Deletion Request
              </button>
            </div>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}
