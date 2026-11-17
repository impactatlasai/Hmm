import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { computeProfileCompletion, db, hashToken } from './db';

export type UserRole = 'learner' | 'instructor' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'deletion_requested';
  emailVerified: boolean;
  createdAt: string;
  name: string;
  avatarUrl: string;
  phone: string;
  country: string;
  city: string;
  profession: string;
  organisation: string;
  educationalBackground: string;
  linkedinUrl: string;
  identity: string;
  bio: string;
  interests: string[];
  emailUpdates: boolean;
  prefs: Record<string, unknown>;
  profileCompletion: number;
}

export interface AuthedRequest extends Request {
  authUser?: AuthUser;
  authSessionId?: string;
}

export const SESSION_COOKIE_NAME = 'atlas_sid';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) {
      try {
        out[key] = decodeURIComponent(val);
      } catch {
        out[key] = val;
      }
    }
  }
  return out;
}

export function buildUserDto(userId: string): AuthUser | null {
  const row = db
    .prepare(`
      SELECT
        u.id, u.email, u.role, u.status, u.email_verified, u.created_at,
        p.full_name, p.avatar_url, p.phone, p.country, p.city, p.profession,
        p.organisation, p.educational_background, p.linkedin_url, p.identity_role,
        p.bio, p.interests_json, p.email_updates, p.prefs_json
      FROM users u
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE u.id = ?
    `)
    .get(userId) as
    | {
        id: string;
        email: string;
        role: UserRole;
        status: 'active' | 'suspended' | 'deletion_requested';
        email_verified: number;
        created_at: string;
        full_name: string | null;
        avatar_url: string | null;
        phone: string | null;
        country: string | null;
        city: string | null;
        profession: string | null;
        organisation: string | null;
        educational_background: string | null;
        linkedin_url: string | null;
        identity_role: string | null;
        bio: string | null;
        interests_json: string | null;
        email_updates: number | null;
        prefs_json: string | null;
      }
    | undefined;

  if (!row) return null;

  let interests: string[] = [];
  try {
    const parsed = JSON.parse(row.interests_json || '[]');
    if (Array.isArray(parsed)) interests = parsed.filter((x) => typeof x === 'string');
  } catch {
    interests = [];
  }

  let prefs: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(row.prefs_json || '{}');
    if (parsed && typeof parsed === 'object') prefs = parsed;
  } catch {
    prefs = {};
  }

  const profileCompletion = computeProfileCompletion({
    full_name: row.full_name || '',
    avatar_url: row.avatar_url || '',
    phone: row.phone || '',
    country: row.country || '',
    city: row.city || '',
    profession: row.profession || '',
    educational_background: row.educational_background || '',
    bio: row.bio || '',
    interests_json: row.interests_json || '[]',
  });

  return {
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,
    emailVerified: row.email_verified === 1,
    createdAt: row.created_at,
    name: row.full_name || row.email.split('@')[0],
    avatarUrl: row.avatar_url || '',
    phone: row.phone || '',
    country: row.country || 'Bangladesh',
    city: row.city || '',
    profession: row.profession || '',
    organisation: row.organisation || '',
    educationalBackground: row.educational_background || '',
    linkedinUrl: row.linkedin_url || '',
    identity: row.identity_role || '',
    bio: row.bio || '',
    interests,
    emailUpdates: row.email_updates === 1,
    prefs,
    profileCompletion,
  };
}

export function createSessionCookie(req: Request, res: Response, userId: string): string {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const sessionId = `ses_${crypto.randomBytes(8).toString('hex')}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);
  const userAgent = String(req.headers['user-agent'] || '').slice(0, 220);
  const ip = String(req.ip || 'unknown').slice(0, 80);

  db.prepare(`
    INSERT INTO sessions (id, user_id, token_hash, user_agent, ip, expires_at, created_at, last_seen_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    sessionId,
    userId,
    tokenHash,
    userAgent,
    ip,
    expiresAt.toISOString(),
    now.toISOString(),
    now.toISOString()
  );

  const isHttps =
    req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production';

  res.cookie(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: Boolean(isHttps),
    path: '/',
    maxAge: SESSION_TTL_MS,
  });

  return sessionId;
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
}

export function attachAuth(req: AuthedRequest, _res: Response, next: NextFunction): void {
  const cookies = parseCookies(req.headers.cookie);
  const rawToken = cookies[SESSION_COOKIE_NAME];
  if (!rawToken) {
    next();
    return;
  }

  const tokenHash = hashToken(rawToken);
  const ses = db
    .prepare(`
      SELECT id, user_id, expires_at, revoked_at
      FROM sessions
      WHERE token_hash = ?
    `)
    .get(tokenHash) as
    | { id: string; user_id: string; expires_at: string; revoked_at: string | null }
    | undefined;

  if (!ses || ses.revoked_at || new Date(ses.expires_at).getTime() <= Date.now()) {
    next();
    return;
  }

  const user = buildUserDto(ses.user_id);
  if (!user || user.status === 'suspended') {
    next();
    return;
  }

  db.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?').run(new Date().toISOString(), ses.id);
  req.authUser = user;
  req.authSessionId = ses.id;
  next();
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  if (!req.authUser) {
    res.status(401).json({ error: 'Authentication required. Please log in to continue.' });
    return;
  }
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      res.status(401).json({ error: 'Authentication required. Please log in to continue.' });
      return;
    }
    if (!roles.includes(req.authUser.role)) {
      res.status(403).json({
        error: 'Access denied. You do not have permission to perform this action.',
      });
      return;
    }
    next();
  };
}

export function getSavedItemsForUser(userId: string): {
  savedProgrammes: string[];
  savedResources: string[];
} {
  const rows = db
    .prepare('SELECT item_type, item_key FROM saved_items WHERE user_id = ?')
    .all(userId) as Array<{ item_type: string; item_key: string }>;
  return {
    savedProgrammes: rows.filter((r) => r.item_type === 'programme').map((r) => r.item_key),
    savedResources: rows.filter((r) => r.item_type === 'resource').map((r) => r.item_key),
  };
}

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}
