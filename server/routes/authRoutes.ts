import crypto from 'crypto';
import { Request, Response, Router } from 'express';
import {
  AuthedRequest,
  buildUserDto,
  clearSessionCookie,
  createSessionCookie,
  getSavedItemsForUser,
  isSmtpConfigured,
  requireAuth,
} from '../auth';
import {
  createNotification,
  db,
  hashPassword,
  hashToken,
  verifyPassword,
} from '../db';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createAuthRouter(): Router {
  const router = Router();

  // Register new learner account
  router.post('/register', (req: Request, res: Response) => {
    const body = req.body || {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const country =
      typeof body.country === 'string' && body.country.trim().length > 0
        ? body.country.trim()
        : 'Bangladesh';
    const identity = typeof body.identity === 'string' ? body.identity.trim() : '';

    if (name.length < 2 || name.length > 120) {
      res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (password.length < 8 || password.length > 128) {
      res.status(400).json({ error: 'Password must be between 8 and 128 characters.' });
      return;
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as
      | { id: string }
      | undefined;
    if (existing) {
      res.status(409).json({
        error: 'An account with this email address already exists. Please log in instead.',
      });
      return;
    }

    const now = new Date().toISOString();
    const userId = `usr_${crypto.randomBytes(8).toString('hex')}`;
    const verifyRawToken = crypto.randomBytes(24).toString('hex');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    db.exec('BEGIN IMMEDIATE');
    try {
      db.prepare(`
        INSERT INTO users (
          id, email, password_hash, role, status, email_verified,
          email_verify_token_hash, email_verify_expires_at, created_at, updated_at
        ) VALUES (?, ?, ?, 'learner', 'active', 0, ?, ?, ?, ?)
      `).run(
        userId,
        email,
        hashPassword(password),
        hashToken(verifyRawToken),
        verifyExpires,
        now,
        now
      );

      db.prepare(`
        INSERT INTO user_profiles (
          user_id, full_name, phone, country, identity_role, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run(userId, name, phone, country, identity, now);

      createNotification({
        userId,
        type: 'account',
        title: 'Welcome to Atlas AI Education',
        message:
          'Your learner account has been created. Complete your profile and verify your email address to keep your learning record secure.',
        link: '/dashboard/profile',
      });

      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }

    createSessionCookie(req, res, userId);
    const user = buildUserDto(userId);
    const saved = getSavedItemsForUser(userId);
    const smtpConfigured = isSmtpConfigured();

    res.status(201).json({
      user,
      ...saved,
      unreadNotificationsCount: 1,
      emailDeliveryStatus: smtpConfigured ? 'sent' : 'pending_provider_configuration',
      verificationPreviewPath: smtpConfigured
        ? undefined
        : `/verify-email?token=${verifyRawToken}`,
      message: smtpConfigured
        ? 'Account created. Please check your email inbox for your verification link.'
        : 'Account created. Email delivery awaits SMTP configuration — use the verification link in your dashboard or confirmation prompt.',
    });
  });

  // Login
  router.post('/login', (req: Request, res: Response) => {
    const body = req.body || {};
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!EMAIL_REGEX.test(email) || password.length < 1) {
      res.status(400).json({ error: 'Please provide your registered email and password.' });
      return;
    }

    const row = db
      .prepare('SELECT id, password_hash, status FROM users WHERE email = ?')
      .get(email) as { id: string; password_hash: string; status: string } | undefined;

    if (!row || !verifyPassword(password, row.password_hash)) {
      res.status(401).json({ error: 'Invalid email address or password.' });
      return;
    }

    if (row.status === 'suspended') {
      res.status(403).json({
        error: 'This account has been suspended by an administrator. Please contact support.',
      });
      return;
    }

    createSessionCookie(req, res, row.id);
    const user = buildUserDto(row.id);
    const saved = getSavedItemsForUser(row.id);
    const unread = db
      .prepare('SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND is_read = 0')
      .get(row.id) as { c: number };

    res.json({
      user,
      ...saved,
      unreadNotificationsCount: unread.c,
    });
  });

  // Logout current session
  router.post('/logout', (req: AuthedRequest, res: Response) => {
    if (req.authSessionId) {
      db.prepare('UPDATE sessions SET revoked_at = ? WHERE id = ?').run(
        new Date().toISOString(),
        req.authSessionId
      );
    }
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  // Current user session state
  router.get('/me', (req: AuthedRequest, res: Response) => {
    if (!req.authUser) {
      res.json({
        isAuthenticated: false,
        user: null,
        savedProgrammes: [],
        savedResources: [],
        unreadNotificationsCount: 0,
      });
      return;
    }

    const saved = getSavedItemsForUser(req.authUser.id);
    const unread = db
      .prepare('SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND is_read = 0')
      .get(req.authUser.id) as { c: number };

    res.json({
      isAuthenticated: true,
      user: req.authUser,
      ...saved,
      unreadNotificationsCount: unread.c,
    });
  });

  // Verify email token
  router.post('/verify-email', (req: Request, res: Response) => {
    const token = typeof req.body?.token === 'string' ? req.body.token.trim() : '';
    if (!token) {
      res.status(400).json({ error: 'Verification token is required.' });
      return;
    }

    const tokenHash = hashToken(token);
    const userRow = db
      .prepare(`
        SELECT id, email, email_verified, email_verify_expires_at
        FROM users
        WHERE email_verify_token_hash = ?
      `)
      .get(tokenHash) as
      | {
          id: string;
          email: string;
          email_verified: number;
          email_verify_expires_at: string | null;
        }
      | undefined;

    if (!userRow) {
      res.status(400).json({ error: 'Invalid or already-used email verification token.' });
      return;
    }

    if (
      userRow.email_verify_expires_at &&
      new Date(userRow.email_verify_expires_at).getTime() < Date.now()
    ) {
      res.status(400).json({
        error: 'This verification token has expired. Please request a new verification link.',
      });
      return;
    }

    const now = new Date().toISOString();
    db.exec('BEGIN IMMEDIATE');
    try {
      db.prepare(`
        UPDATE users
        SET email_verified = 1, email_verify_token_hash = NULL, email_verify_expires_at = NULL, updated_at = ?
        WHERE id = ?
      `).run(now, userRow.id);

      // Claim any prior unowned enrolments/payments/scholarships submitted under the verified email
      db.prepare(`
        UPDATE enrolments SET user_id = ? WHERE user_id IS NULL AND LOWER(applicant_email) = LOWER(?)
      `).run(userRow.id, userRow.email);
      db.prepare(`
        UPDATE payments SET user_id = ?
        WHERE user_id IS NULL AND enrolment_id IN (
          SELECT id FROM enrolments WHERE user_id = ?
        )
      `).run(userRow.id, userRow.id);
      db.prepare(`
        UPDATE scholarship_applications SET user_id = ? WHERE user_id IS NULL AND LOWER(email) = LOWER(?)
      `).run(userRow.id, userRow.email);

      createNotification({
        userId: userRow.id,
        type: 'account',
        title: 'Email Verified',
        message: 'Your email address has been successfully verified.',
        link: '/dashboard/profile',
      });
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }

    res.json({
      verified: true,
      email: userRow.email,
      message: 'Your email address has been verified.',
    });
  });

  // Resend verification link (authenticated)
  router.post('/resend-verification', requireAuth, (req: AuthedRequest, res: Response) => {
    const authUser = req.authUser!;
    if (authUser.emailVerified) {
      res.json({ alreadyVerified: true, message: 'Your email address is already verified.' });
      return;
    }

    const rawToken = crypto.randomBytes(24).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    db.prepare(`
      UPDATE users
      SET email_verify_token_hash = ?, email_verify_expires_at = ?, updated_at = ?
      WHERE id = ?
    `).run(hashToken(rawToken), expires, new Date().toISOString(), authUser.id);

    const smtpConfigured = isSmtpConfigured();
    res.json({
      emailDeliveryStatus: smtpConfigured ? 'sent' : 'pending_provider_configuration',
      verificationPreviewPath: smtpConfigured ? undefined : `/verify-email?token=${rawToken}`,
      message: smtpConfigured
        ? 'A fresh verification email has been sent.'
        : 'Email delivery awaits SMTP configuration. Use the generated verification link directly below.',
    });
  });

  // Forgot password
  router.post('/forgot-password', (req: Request, res: Response) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const userRow = db
      .prepare('SELECT id, status FROM users WHERE email = ?')
      .get(email) as { id: string; status: string } | undefined;

    const smtpConfigured = isSmtpConfigured();
    let resetPreviewPath: string | undefined;

    if (userRow && userRow.status !== 'suspended') {
      const rawToken = crypto.randomBytes(24).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      db.prepare(`
        UPDATE users
        SET reset_token_hash = ?, reset_token_expires_at = ?, updated_at = ?
        WHERE id = ?
      `).run(hashToken(rawToken), expiresAt, new Date().toISOString(), userRow.id);

      if (!smtpConfigured) {
        resetPreviewPath = `/reset-password?token=${rawToken}`;
      }
    }

    res.json({
      emailDeliveryStatus: smtpConfigured ? 'sent' : 'pending_provider_configuration',
      resetPreviewPath,
      message: smtpConfigured
        ? 'If an account matches that email address, password reset instructions have been sent.'
        : 'If an account matches that email address, a time-limited reset link was generated (SMTP email provider integration pending).',
    });
  });

  // Reset password with token
  router.post('/reset-password', (req: Request, res: Response) => {
    const token = typeof req.body?.token === 'string' ? req.body.token.trim() : '';
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';

    if (!token) {
      res.status(400).json({ error: 'Password reset token is required.' });
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 128) {
      res.status(400).json({ error: 'New password must be between 8 and 128 characters.' });
      return;
    }

    const row = db
      .prepare('SELECT id, reset_token_expires_at FROM users WHERE reset_token_hash = ?')
      .get(hashToken(token)) as { id: string; reset_token_expires_at: string | null } | undefined;

    if (!row) {
      res.status(400).json({ error: 'Invalid or already-used password reset token.' });
      return;
    }
    if (
      !row.reset_token_expires_at ||
      new Date(row.reset_token_expires_at).getTime() < Date.now()
    ) {
      res.status(400).json({
        error: 'This password reset token has expired. Please request a new one.',
      });
      return;
    }

    const now = new Date().toISOString();
    db.exec('BEGIN IMMEDIATE');
    try {
      db.prepare(`
        UPDATE users
        SET password_hash = ?, reset_token_hash = NULL, reset_token_expires_at = NULL, updated_at = ?
        WHERE id = ?
      `).run(hashPassword(newPassword), now, row.id);

      // Revoke all existing sessions for safety after password reset
      db.prepare('UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL').run(
        now,
        row.id
      );

      createNotification({
        userId: row.id,
        type: 'security',
        title: 'Password Reset Completed',
        message: 'Your password was reset and previous active sessions were signed out.',
        link: '/dashboard/settings',
      });
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }

    res.json({
      ok: true,
      message: 'Your password has been updated. You can now log in with your new password.',
    });
  });

  // Change password (authenticated)
  router.post('/change-password', requireAuth, (req: AuthedRequest, res: Response) => {
    const authUser = req.authUser!;
    const currentPassword =
      typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';

    if (newPassword.length < 8 || newPassword.length > 128) {
      res.status(400).json({ error: 'New password must be between 8 and 128 characters.' });
      return;
    }

    const row = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(authUser.id) as {
      password_hash: string;
    };
    if (!verifyPassword(currentPassword, row.password_hash)) {
      res.status(400).json({ error: 'Current password is incorrect.' });
      return;
    }

    const now = new Date().toISOString();
    db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(
      hashPassword(newPassword),
      now,
      authUser.id
    );

    createNotification({
      userId: authUser.id,
      type: 'security',
      title: 'Password Changed',
      message: 'Your account password was changed successfully.',
      link: '/dashboard/settings',
    });

    res.json({ ok: true, message: 'Password updated successfully.' });
  });

  // Update email address (authenticated)
  router.post('/update-email', requireAuth, (req: AuthedRequest, res: Response) => {
    const authUser = req.authUser!;
    const newEmail =
      typeof req.body?.newEmail === 'string' ? req.body.newEmail.trim().toLowerCase() : '';
    const currentPassword =
      typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';

    if (!EMAIL_REGEX.test(newEmail)) {
      res.status(400).json({ error: 'Please provide a valid new email address.' });
      return;
    }

    const userRow = db
      .prepare('SELECT password_hash FROM users WHERE id = ?')
      .get(authUser.id) as { password_hash: string };

    if (!verifyPassword(currentPassword, userRow.password_hash)) {
      res.status(400).json({ error: 'Password confirmation failed.' });
      return;
    }

    const duplicate = db
      .prepare('SELECT id FROM users WHERE email = ? AND id != ?')
      .get(newEmail, authUser.id) as { id: string } | undefined;
    if (duplicate) {
      res.status(409).json({ error: 'This email address is already registered to another account.' });
      return;
    }

    const verifyRawToken = crypto.randomBytes(24).toString('hex');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE users
      SET email = ?, email_verified = 0, email_verify_token_hash = ?, email_verify_expires_at = ?, updated_at = ?
      WHERE id = ?
    `).run(newEmail, hashToken(verifyRawToken), verifyExpires, now, authUser.id);

    const smtpConfigured = isSmtpConfigured();
    res.json({
      user: buildUserDto(authUser.id),
      verificationPreviewPath: smtpConfigured ? undefined : `/verify-email?token=${verifyRawToken}`,
      message: smtpConfigured
        ? 'Email updated. Please verify your new email address using the link sent to your inbox.'
        : 'Email updated. Please verify your new email address (email provider awaiting SMTP configuration).',
    });
  });

  // List active sessions
  router.get('/sessions', requireAuth, (req: AuthedRequest, res: Response) => {
    const rows = db
      .prepare(`
        SELECT id, user_agent, ip, created_at, last_seen_at, expires_at
        FROM sessions
        WHERE user_id = ? AND revoked_at IS NULL AND expires_at > ?
        ORDER BY last_seen_at DESC
      `)
      .all(req.authUser!.id, new Date().toISOString()) as Array<{
      id: string;
      user_agent: string;
      ip: string;
      created_at: string;
      last_seen_at: string;
      expires_at: string;
    }>;

    res.json({
      sessions: rows.map((s) => ({
        id: s.id,
        userAgent: s.user_agent || 'Unknown browser',
        ip: s.ip || 'Unknown',
        createdAt: s.created_at,
        lastSeenAt: s.last_seen_at,
        expiresAt: s.expires_at,
        isCurrent: s.id === req.authSessionId,
      })),
    });
  });

  // Revoke single session or all other sessions
  router.delete('/sessions/:id', requireAuth, (req: AuthedRequest, res: Response) => {
    const targetId = req.params.id;
    const now = new Date().toISOString();

    if (targetId === 'others') {
      db.prepare(`
        UPDATE sessions SET revoked_at = ?
        WHERE user_id = ? AND id != ? AND revoked_at IS NULL
      `).run(now, req.authUser!.id, req.authSessionId || '');
      res.json({ ok: true, message: 'All other active sessions have been signed out.' });
      return;
    }

    const result = db
      .prepare('UPDATE sessions SET revoked_at = ? WHERE id = ? AND user_id = ?')
      .run(now, targetId, req.authUser!.id);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Session not found.' });
      return;
    }

    if (targetId === req.authSessionId) {
      clearSessionCookie(res);
    }

    res.json({ ok: true });
  });

  // Account deletion request
  router.post('/account-deletion-request', requireAuth, (req: AuthedRequest, res: Response) => {
    const authUser = req.authUser!;
    const currentPassword =
      typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim().slice(0, 1000) : '';

    const row = db
      .prepare('SELECT password_hash FROM users WHERE id = ?')
      .get(authUser.id) as { password_hash: string };

    if (!verifyPassword(currentPassword, row.password_hash)) {
      res.status(400).json({ error: 'Password verification failed.' });
      return;
    }

    const reqId = `del_${crypto.randomBytes(6).toString('hex')}`;
    const now = new Date().toISOString();

    db.exec('BEGIN IMMEDIATE');
    try {
      db.prepare(`
        INSERT INTO account_deletion_requests (id, user_id, reason, status, requested_at)
        VALUES (?, ?, ?, 'Pending Review', ?)
      `).run(reqId, authUser.id, reason, now);

      db.prepare(`UPDATE users SET status = 'deletion_requested', updated_at = ? WHERE id = ?`).run(
        now,
        authUser.id
      );

      createNotification({
        userId: authUser.id,
        type: 'security',
        title: 'Account Deletion Request Logged',
        message:
          'Your account deletion request has been logged for administrative review. Financial payment records and issued certificate verification logs follow mandatory audit retention policies.',
        link: '/dashboard/settings',
      });
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }

    res.json({
      ok: true,
      requestId: reqId,
      message:
        'Your account deletion request has been recorded. Our compliance team will process personal profile removal in accordance with our Privacy Policy.',
    });
  });

  return router;
}
