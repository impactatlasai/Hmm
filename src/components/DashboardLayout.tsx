import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Award,
  Bell,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  MailCheck,
  Menu,
  Settings,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../services/demoAuth';
import { apiRequest } from '../services/api';
import { SeoHead } from './SeoHead';
import { AtlasLogoIcon } from './AtlasLogoIcon';

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function DashboardLayout({ title, subtitle, children }: DashboardLayoutProps) {
  const {
    authLoading,
    isAuthenticated,
    user,
    unreadNotificationsCount,
    lastVerificationPreviewPath,
    logout,
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const [previewPath, setPreviewPath] = useState<string | null>(lastVerificationPreviewPath);
  const [resendMsg, setResendMsg] = useState<string | null>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (lastVerificationPreviewPath) {
      setPreviewPath(lastVerificationPreviewPath);
    }
  }, [lastVerificationPreviewPath]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-soft-bg)] font-en text-sm text-[var(--color-body)]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--color-primary)]" aria-hidden="true" />
        Loading Learner Dashboard...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, exact: true },
    { label: 'My Courses', to: '/dashboard/courses', icon: BookOpen },
    { label: 'Learning Centre', to: '/dashboard/learning', icon: GraduationCap },
    { label: 'Assignments & Quizzes', to: '/dashboard/assignments', icon: ClipboardCheck },
    { label: 'Certificates', to: '/dashboard/certificates', icon: Award },
    { label: 'Payments History', to: '/dashboard/payments', icon: CreditCard },
    {
      label: 'Notifications',
      to: '/dashboard/notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { label: 'My Profile', to: '/dashboard/profile', icon: User },
    { label: 'Account Settings', to: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const handleResendVerification = async () => {
    setResending(true);
    setResendMsg(null);
    try {
      const res = await apiRequest<{ message: string; verificationPreviewPath?: string }>(
        '/api/auth/resend-verification',
        { method: 'POST' }
      );
      if (res.verificationPreviewPath) {
        setPreviewPath(res.verificationPreviewPath);
      }
      setResendMsg(res.message);
    } catch (err) {
      setResendMsg((err as Error).message);
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white border-r border-[var(--color-border)]">
      <div>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-[var(--color-border)] px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <AtlasLogoIcon size={34} variant="primary" />
            <div className="min-w-0">
              <span className="block font-en text-sm font-bold text-[var(--color-heading)]">
                Atlas AI Education
              </span>
              <span className="block font-en text-[11px] font-medium text-[var(--color-body)]">
                Learner Dashboard
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-[var(--color-body)] hover:bg-[var(--color-soft-bg)] lg:hidden cursor-pointer"
            aria-label="Close navigation drawer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Dashboard navigation" className="space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex min-h-[42px] items-center justify-between rounded-[8px] px-3 py-2 font-en text-sm transition-colors ${
                  active
                    ? 'bg-[var(--color-tint)] font-semibold text-[var(--color-primary)]'
                    : 'font-medium text-[var(--color-body)] hover:bg-[var(--color-soft-bg)] hover:text-[var(--color-heading)]'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span className="ml-2 inline-flex min-w-[20px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 py-0.5 font-mono-tabular text-[11px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Links */}
      <div className="space-y-1 border-t border-[var(--color-border)] p-3">
        {(user.role === 'admin' || user.role === 'instructor') && (
          <Link
            to="/admin"
            className="flex min-h-[40px] items-center gap-2.5 rounded-[8px] bg-[var(--color-navy)] px-3 py-2 font-en text-xs font-semibold text-white transition-colors hover:bg-[#132f6b]"
          >
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Admin &amp; Instructor Console</span>
          </Link>
        )}
        <Link
          to="/programmes"
          className="flex min-h-[40px] items-center justify-between rounded-[8px] px-3 py-2 font-en text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-soft-bg)]"
        >
          <span>Explore Programmes</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-[40px] w-full items-center gap-2.5 rounded-[8px] px-3 py-2 font-en text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-soft-bg)] text-[var(--color-heading)]">
      <SeoHead
        pathname={location.pathname}
        customTitle={`${title} – Learner Dashboard – Atlas AI Education`}
      />

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-[264px] shrink-0 lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto">{sidebarContent}</div>
        </aside>

        {/* Mobile Drawer Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 flex lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
          >
            <div
              className="fixed inset-0 bg-slate-950/50"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-10 h-full w-72 max-w-[85vw]">{sidebarContent}</div>
          </div>
        )}

        {/* Main Workspace */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[var(--color-border)] bg-white px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[var(--color-border)] text-[var(--color-heading)] hover:bg-[var(--color-soft-bg)] lg:hidden cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate font-en text-base font-bold text-[var(--color-heading)] sm:text-lg">
                  {title}
                </h1>
                {subtitle && (
                  <p className="hidden truncate font-en text-xs text-[var(--color-body)] sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/dashboard/notifications"
                aria-label="Notifications"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[var(--color-border)] text-[var(--color-heading)] hover:bg-[var(--color-soft-bg)]"
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 font-mono-tabular text-[10px] font-bold text-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </Link>

              <Link
                to="/dashboard/profile"
                className="flex items-center gap-2.5 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] py-1 pl-1.5 pr-3 hover:border-[var(--color-primary)]"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] font-en text-xs font-bold text-white">
                    {getInitials(user.name)}
                  </span>
                )}
                <span className="hidden max-w-[120px] truncate font-en text-xs font-semibold text-[var(--color-heading)] sm:inline">
                  {user.name}
                </span>
              </Link>
            </div>
          </header>

          {/* Email Verification Notice */}
          {!user.emailVerified && (
            <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 sm:px-6 lg:px-8">
              <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 font-en text-xs text-amber-950">
                <div className="flex items-center gap-2">
                  <MailCheck className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                  <span>
                    Your email (<strong>{user.email}</strong>) is unverified. Verify it to secure account recovery and enrolment linking.
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {previewPath && (
                    <Link
                      to={previewPath}
                      className="rounded-[6px] bg-amber-700 px-3 py-1.5 font-semibold text-white hover:bg-amber-800"
                    >
                      Verify Email Now →
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="rounded-[6px] border border-amber-400 bg-white px-3 py-1.5 font-semibold text-amber-900 hover:bg-amber-100 cursor-pointer"
                  >
                    {resending ? 'Generating...' : 'Generate Verification Link'}
                  </button>
                </div>
              </div>
              {resendMsg && (
                <p className="mx-auto mt-1 max-w-6xl font-en text-[11px] text-amber-900">
                  {resendMsg}
                </p>
              )}
            </div>
          )}

          {/* Main Content */}
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
