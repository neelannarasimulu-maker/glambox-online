"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { SessionUser } from "@/lib/auth";

type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  preferences?: string;
  dislikes?: string;
  medicalInfo?: string;
  hairPreferences?: string;
  nailPreferences?: string;
  foodPreferences?: string;
  onboardingCompleted?: boolean;
};

type ProfilePayload = {
  id: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  preferences?: string;
  dislikes?: string;
  medicalInfo?: string;
  hairPreferences?: string;
  nailPreferences?: string;
  foodPreferences?: string;
  onboardingCompleted?: boolean;
};

type AuthState = {
  authReady: boolean;
  isAuthenticated: boolean;
  user?: SessionUser;
  login: (email: string, password: string) => Promise<SessionUser>;
  register: (payload: RegisterPayload) => Promise<SessionUser>;
  loginWithGoogle: (idToken: string) => Promise<SessionUser>;
  updateProfile: (payload: ProfilePayload) => Promise<SessionUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);
const AUTH_KEY = "glambox_auth_v2";

async function requestAuth<T>(url: string, payload: Record<string, unknown>) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = (await response.json()) as T & {
    error?: string;
    code?: string;
    provider?: string;
  };
  if (!response.ok) {
    const error = new Error(result.error || "Authentication request failed.") as Error & {
      code?: string;
      provider?: string;
    };
    error.code = result.code;
    error.provider = result.provider;
    throw error;
  }

  return result;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | undefined>();
  const [authReady, setAuthReady] = useState(false);

  const normalizeStoredUser = (storedUser: SessionUser): SessionUser => ({
    ...storedUser,
    onboardingCompleted: Boolean(storedUser.onboardingCompleted)
  });

  useEffect(() => {
    const stored = window.localStorage.getItem(AUTH_KEY);
    if (!stored) {
      setAuthReady(true);
      return;
    }

    try {
      const parsed = normalizeStoredUser(JSON.parse(stored) as SessionUser);
      setUser(parsed);

      fetch(`/api/auth/profile?id=${encodeURIComponent(parsed.id)}`)
        .then((response) => response.json())
        .then((result: { user?: SessionUser }) => {
          if (!result.user) {
            return;
          }
          setUser(result.user);
          window.localStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
        })
        .catch(() => {
          // Keep local session fallback if profile refresh fails.
        })
        .finally(() => {
          setAuthReady(true);
        });
    } catch {
      window.localStorage.removeItem(AUTH_KEY);
      setAuthReady(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const result = await requestAuth<{ user: SessionUser }>("/api/auth/login", { email, password });
    setUser(result.user);
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
    return result.user;
  };

  const register = async (payload: RegisterPayload) => {
    const result = await requestAuth<{ user: SessionUser }>("/api/auth/register", payload);
    setUser(result.user);
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
    return result.user;
  };

  const loginWithGoogle = async (idToken: string) => {
    const result = await requestAuth<{ user: SessionUser }>("/api/auth/google", { idToken });
    setUser(result.user);
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
    return result.user;
  };

  const updateProfile = async (payload: ProfilePayload) => {
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = (await response.json()) as { user?: SessionUser; error?: string };
    if (!response.ok || !result.user) {
      throw new Error(result.error || "Could not update profile.");
    }

    setUser(result.user);
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
    return result.user;
  };

  const logout = () => {
    setUser(undefined);
    window.localStorage.removeItem(AUTH_KEY);
  };

  const value = useMemo(
    () => ({
      authReady,
      isAuthenticated: Boolean(user),
      user,
      login,
      register,
      loginWithGoogle,
      updateProfile,
      logout
    }),
    [authReady, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
