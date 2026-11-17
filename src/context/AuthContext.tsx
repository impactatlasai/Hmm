import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CategorySlug } from '../data/coursesData';
import { apiRequest } from '../services/api';
import {
  getDemoState,
  IdentityRole,
  markFreeMasterclassRegistered,
  toggleSavedProgramme,
  toggleSavedResource,
} from '../services/demoAuth';

export type UserRole = 'learner' | 'instructor' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'deletion_requested';
  emailVerified: boolean;
  createdAt: string;
  memberSince: string; // Alias for createdAt so existing UI components remain compatible
  name: string;
  avatarUrl: string;
  phone: string;
  country: string;
  city: string;
  profession: string;
  organisation: string;
  educationalBackground: string;
  linkedinUrl: string;
  identity: IdentityRole | string;
  bio: string;
  interests: CategorySlug[];
  emailUpdates: boolean;
  prefs: Record<string, unknown>;
  profileCompletion: number;
}

export interface AuthResult {
  user: AuthUser;
  verificationPreviewPath?: string;
  message?: string;
}

interface MeResponse {
  isAuthenticated: boolean;
  user: Omit<AuthUser, 'memberSince'> | null;
  savedProgrammes: string[];
  savedResources: string[];
  unreadNotificationsCount: number;
}

interface AuthContextValue {
  authLoading: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  savedProgrammes: string[];
  savedResources: string[];
  freeMasterclassRegistered: boolean;
  unreadNotificationsCount: number;
  lastVerificationPreviewPath: string | null;
  refreshSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (input: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    country?: string;
    identity?: string;
  }) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (updates: {
    name?: string;
    phone?: string;
    country?: string;
    city?: string;
    profession?: string;
    organisation?: string;
    educationalBackground?: string;
    linkedinUrl?: string;
    identity?: string;
    bio?: string;
    interests?: CategorySlug[];
    emailUpdates?: boolean;
    prefs?: Record<string, unknown>;
  }) => Promise<AuthUser | null>;
  toggleProgrammeBookmark: (code: string) => void;
  toggleResourceBookmark: (id: string) => void;
  recordFreeMasterclassRegistration: () => void;
  setUnreadNotificationsCount: (count: number) => void;
  clearVerificationPreview: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapUser(raw: Omit<AuthUser, 'memberSince'> | null): AuthUser | null {
  if (!raw) return null;
  return {
    ...raw,
    memberSince: raw.createdAt,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [savedProgrammes, setSavedProgrammes] = useState<string[]>(() => getDemoState().savedProgrammes);
  const [savedResources, setSavedResources] = useState<string[]>(() => getDemoState().savedResources);
  const [freeMasterclassRegistered, setFreeMasterclassRegistered] = useState<boolean>(
    () => getDemoState().freeMasterclassRegistered
  );
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [lastVerificationPreviewPath, setLastVerificationPreviewPath] = useState<string | null>(
    null
  );

  const refreshSession = useCallback(async () => {
    try {
      const data = await apiRequest<MeResponse>('/api/auth/me', { method: 'GET' });
      if (data.isAuthenticated && data.user) {
        setIsAuthenticated(true);
        setUser(mapUser(data.user));
        setSavedProgrammes(data.savedProgrammes || []);
        setSavedResources(data.savedResources || []);
        setUnreadNotificationsCount(data.unreadNotificationsCount || 0);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUnreadNotificationsCount(0);
        const local = getDemoState();
        setSavedProgrammes(local.savedProgrammes);
        setSavedResources(local.savedResources);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiRequest<{
      user: Omit<AuthUser, 'memberSince'>;
      savedProgrammes: string[];
      savedResources: string[];
      unreadNotificationsCount: number;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const mapped = mapUser(res.user)!;
    setIsAuthenticated(true);
    setUser(mapped);
    setSavedProgrammes(res.savedProgrammes || []);
    setSavedResources(res.savedResources || []);
    setUnreadNotificationsCount(res.unreadNotificationsCount || 0);
    return mapped;
  }, []);

  const signup = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      country?: string;
      identity?: string;
    }) => {
      const res = await apiRequest<{
        user: Omit<AuthUser, 'memberSince'>;
        savedProgrammes: string[];
        savedResources: string[];
        unreadNotificationsCount: number;
        verificationPreviewPath?: string;
        message?: string;
      }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      const mapped = mapUser(res.user)!;
      setIsAuthenticated(true);
      setUser(mapped);
      setSavedProgrammes(res.savedProgrammes || []);
      setSavedResources(res.savedResources || []);
      setUnreadNotificationsCount(res.unreadNotificationsCount || 0);
      if (res.verificationPreviewPath) {
        setLastVerificationPreviewPath(res.verificationPreviewPath);
      }
      return {
        user: mapped,
        verificationPreviewPath: res.verificationPreviewPath,
        message: res.message,
      };
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch {
      // Clear local session state regardless
    }
    setIsAuthenticated(false);
    setUser(null);
    setUnreadNotificationsCount(0);
    setLastVerificationPreviewPath(null);
  }, []);

  const updateProfile = useCallback(
    async (updates: {
      name?: string;
      phone?: string;
      country?: string;
      city?: string;
      profession?: string;
      organisation?: string;
      educationalBackground?: string;
      linkedinUrl?: string;
      identity?: string;
      bio?: string;
      interests?: CategorySlug[];
      emailUpdates?: boolean;
      prefs?: Record<string, unknown>;
    }) => {
      if (!isAuthenticated) return null;
      const res = await apiRequest<{ user: Omit<AuthUser, 'memberSince'> }>('/api/dashboard/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      const mapped = mapUser(res.user);
      setUser(mapped);
      return mapped;
    },
    [isAuthenticated]
  );

  const toggleProgrammeBookmark = useCallback(
    (code: string) => {
      if (isAuthenticated) {
        apiRequest<{ savedProgrammes: string[] }>(`/api/dashboard/saved/programme/${encodeURIComponent(code)}`, {
          method: 'POST',
        })
          .then((res) => setSavedProgrammes(res.savedProgrammes || []))
          .catch(() => {});
      } else {
        setSavedProgrammes(toggleSavedProgramme(code));
      }
    },
    [isAuthenticated]
  );

  const toggleResourceBookmark = useCallback(
    (id: string) => {
      if (isAuthenticated) {
        apiRequest<{ savedResources: string[] }>(`/api/dashboard/saved/resource/${encodeURIComponent(id)}`, {
          method: 'POST',
        })
          .then((res) => setSavedResources(res.savedResources || []))
          .catch(() => {});
      } else {
        setSavedResources(toggleSavedResource(id));
      }
    },
    [isAuthenticated]
  );

  const recordFreeMasterclassRegistration = useCallback(() => {
    markFreeMasterclassRegistered();
    setFreeMasterclassRegistered(true);
  }, []);

  const clearVerificationPreview = useCallback(() => {
    setLastVerificationPreviewPath(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authLoading,
        isAuthenticated,
        user,
        savedProgrammes,
        savedResources,
        freeMasterclassRegistered,
        unreadNotificationsCount,
        lastVerificationPreviewPath,
        refreshSession,
        login,
        signup,
        logout,
        updateProfile,
        toggleProgrammeBookmark,
        toggleResourceBookmark,
        recordFreeMasterclassRegistration,
        setUnreadNotificationsCount,
        clearVerificationPreview,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
