"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

type AuthState = {
  isAuthenticated: boolean;
  email?: string;
  login: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const AUTH_KEY = "glambox_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | undefined>();

  useEffect(() => {
    const stored = window.localStorage.getItem(AUTH_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as { email?: string };
      setIsAuthenticated(true);
      setEmail(parsed.email);
    }
  }, []);

  const login = (userEmail: string) => {
    setIsAuthenticated(true);
    setEmail(userEmail);
    window.localStorage.setItem(AUTH_KEY, JSON.stringify({ email: userEmail }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setEmail(undefined);
    window.localStorage.removeItem(AUTH_KEY);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      email,
      login,
      logout
    }),
    [isAuthenticated, email]
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
