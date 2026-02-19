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
};

type ProfilePayload = {
  id: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user?: SessionUser;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  loginWithGoogle: (email: string, fullName?: string) => Promise<void>;
  updateProfile: (payload: ProfilePayload) => Promise<void>;
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

  const result = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(result.error || "Authentication request failed.");
  }

  return result;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | undefined>();

  useEffect(() => {
    const stored = window.localStorage.getItem(AUTH_KEY);
    if (stored) {
      setUser(JSON.parse(stored) as SessionUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const result = await requestAuth<{ user: SessionUser }>("/api/auth/login", { email, password });
    setUser(result.user);
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
  };

  const register = async (payload: RegisterPayload) => {
    const result = await requestAuth<{ user: SessionUser }>("/api/auth/register", payload);
    setUser(result.user);
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
  };

  const loginWithGoogle = async (email: string, fullName?: string) => {
    const result = await requestAuth<{ user: SessionUser }>("/api/auth/google", { email, fullName });
    setUser(result.user);
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
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
  };

  const logout = () => {
    setUser(undefined);
    window.localStorage.removeItem(AUTH_KEY);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login,
      register,
      loginWithGoogle,
      updateProfile,
      logout
    }),
    [user]
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
