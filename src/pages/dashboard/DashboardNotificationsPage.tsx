import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

interface NotificationRow {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  is_read: number;
  created_at: string;
}

export function DashboardNotificationsPage() {
  const { setUnreadNotificationsCount } = useAuth();
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{
        notifications: NotificationRow[];
        unreadCount: number;
      }>('/api/dashboard/notifications');
      setNotifications(res.notifications);
      setUnreadNotificationsCount(res.unreadCount);
    } finally {
      setLoading(false);
    }
  }, [setUnreadNotificationsCount]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkRead = async (id: string) => {
    await apiRequest(`/api/dashboard/notifications/${encodeURIComponent(id)}/read`, {
      method: 'POST',
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
    );
    const remaining = notifications.filter((n) => n.id !== id && n.is_read === 0).length;
    setUnreadNotificationsCount(remaining);
  };

  const handleMarkAllRead = async () => {
    await apiRequest('/api/dashboard/notifications/read-all', { method: 'POST' });
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    setUnreadNotificationsCount(0);
  };

  const visible = filter === 'unread' ? notifications.filter((n) => n.is_read === 0) : notifications;

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Real-time alerts from your enrolments, assignments, payments, certificates, and announcements."
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`min-h-[38px] rounded-[8px] border px-3.5 py-1.5 font-en text-xs font-semibold cursor-pointer ${
                filter === 'all'
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-border)] bg-white text-[var(--color-heading)]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`min-h-[38px] rounded-[8px] border px-3.5 py-1.5 font-en text-xs font-semibold cursor-pointer ${
                filter === 'unread'
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-border)] bg-white text-[var(--color-heading)]'
              }`}
            >
              Unread ({notifications.filter((n) => n.is_read === 0).length})
            </button>
          </div>

          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-[8px] border border-[var(--color-border)] bg-white px-3.5 py-1.5 font-en text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-tint)] cursor-pointer"
          >
            <CheckCheck className="h-4 w-4" aria-hidden="true" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-white p-12 font-en text-sm text-[var(--color-body)]">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--color-primary)]" aria-hidden="true" />
            Loading notifications...
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-10 text-center font-en">
            <Bell className="mx-auto h-9 w-9 text-[var(--color-primary)]" aria-hidden="true" />
            <p className="mt-3 text-base font-bold text-[var(--color-heading)]">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
            <p className="mt-1 text-xs text-[var(--color-body)]">
              Notifications are created only when real actions occur on your enrolments, payments, coursework, or certificates.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-border)] overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-white">
            {visible.map((n) => (
              <li
                key={n.id}
                className={`p-5 transition-colors ${
                  n.is_read === 0 ? 'bg-[var(--color-tint)]/35' : 'bg-white'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {n.is_read === 0 && (
                        <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                      )}
                      <h3 className="font-en text-sm font-bold text-[var(--color-heading)]">
                        {n.title}
                      </h3>
                      <span className="font-en text-[11px] uppercase text-[var(--color-body)]">
                        · {n.type}
                      </span>
                    </div>
                    <p className="mt-1.5 font-en text-xs leading-relaxed text-[var(--color-body)]">
                      {n.message}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 font-en text-[11px] text-[var(--color-body)]">
                      <span>{new Date(n.created_at).toLocaleString('en-GB')}</span>
                      {n.link && (
                        <Link
                          to={n.link}
                          onClick={() => {
                            if (n.is_read === 0) handleMarkRead(n.id);
                          }}
                          className="font-semibold text-[var(--color-primary)] hover:underline"
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>

                  {n.is_read === 0 && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(n.id)}
                      className="rounded-[6px] border border-[var(--color-border)] bg-white px-2.5 py-1 font-en text-[11px] font-semibold text-[var(--color-heading)] hover:bg-[var(--color-soft-bg)] cursor-pointer"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}
