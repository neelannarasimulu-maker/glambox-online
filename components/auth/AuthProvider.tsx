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
  updateProfile: (payload: ProfilePayload) => Promise<SessionUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  const raw = await response.text();
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function requestAuth<T>(url: string, payload: Record<string, unknown>) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = await parseJsonResponse<
    T & {
      error?: string;
      code?: string;
      provider?: string;
    }
  >(response);

  if (!response.ok) {
    const error = new Error(result?.error || "Authentication request failed.") as Error & {
      code?: string;
      provider?: string;
    };
    error.code = result?.code;
    error.provider = result?.provider;
    throw error;
  }

  if (!result) {
    throw new Error("Authentication service returned an invalid response.");
  }

  return result;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | undefined>();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((response) => parseJsonResponse<{ user?: SessionUser | null }>(response))
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .finally(() => {
        setAuthReady(true);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const result = await requestAuth<{ user: SessionUser }>("/api/auth/login", { email, password });
    setUser(result.user);
    return result.user;
  };

  const register = async (payload: RegisterPayload) => {
    const result = await requestAuth<{ user: SessionUser }>("/api/auth/register", payload);
    setUser(result.user);
    return result.user;
  };
  const updateProfile = async (payload: ProfilePayload) => {
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await parseJsonResponse<{ user?: SessionUser; error?: string }>(response);
    if (!response.ok || !result?.user) {
      throw new Error(result?.error || "Could not update profile.");
    }

    setUser(result.user);
    return result.user;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(undefined);
  };

  const value = useMemo(
    () => ({
      authReady,
      isAuthenticated: Boolean(user),
      user,
      login,
      register,
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
