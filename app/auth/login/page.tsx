"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Mail, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { useAuth } from "@/components/auth/AuthProvider";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme: "outline" | "filled_blue" | "filled_black";
              size: "large" | "medium" | "small";
              width?: number;
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
            }
          ) => void;
        };
      };
    };
  }
}

export default function NewLoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requiresGoogle, setRequiresGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [googleConfigLoaded, setGoogleConfigLoaded] = useState(false);
  const [googleScriptReady, setGoogleScriptReady] = useState(false);

  const isGoogleAvailable = Boolean(googleClientId);

  const handleGoogleCredential = async (credential: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const user = await loginWithGoogle(credential);
      router.push(user.onboardingCompleted ? "/dashboard" : "/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderGoogleButton = () => {
    if (!googleClientId || !window.google?.accounts?.id || !googleButtonRef.current) {
      return;
    }

    googleButtonRef.current.innerHTML = "";
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: ({ credential }) => {
        void handleGoogleCredential(credential);
      }
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "pill",
      width: 360
    });
  };

  useEffect(() => {
    const loadGoogleConfig = async () => {
      try {
        const response = await fetch("/api/auth/google/config");
        const result = (await response.json()) as { enabled: boolean; clientId?: string };
        if (result.enabled && result.clientId) {
          setGoogleClientId(result.clientId);
        } else {
          setGoogleClientId(null);
        }
      } catch {
        setGoogleClientId(null);
      } finally {
        setGoogleConfigLoaded(true);
      }
    };

    void loadGoogleConfig();
  }, []);

  useEffect(() => {
    if (!googleScriptReady) {
      return;
    }
    renderGoogleButton();
  }, [googleClientId, googleScriptReady]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setRequiresGoogle(false);
    setIsLoading(true);

    try {
      const user = await login(email, password);
      router.push(user.onboardingCompleted ? "/dashboard" : "/onboarding");
    } catch (err) {
      const loginError = err as Error & { code?: string; provider?: string };
      if (loginError.code === "ACCOUNT_PROVIDER_REQUIRED" && loginError.provider === "google") {
        setRequiresGoogle(true);
        if (isGoogleAvailable) {
          setError("This email is linked to Google. Continue securely with Google below.");
        } else {
          setError(
            "This email is linked to Google, but Google sign-in is currently unavailable. Contact support or configure GOOGLE_CLIENT_ID."
          );
        }
      } else {
        setError(loginError.message || "Unable to sign in.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section className="bg-[radial-gradient(circle_at_top_left,var(--muted)_0%,transparent_45%),linear-gradient(to_bottom,var(--muted)_0%,transparent_35%)]">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGoogleScriptReady(true)}
      />
      <Container className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-none bg-gradient-to-br from-[var(--primary)] via-[var(--primary)] to-[#431f54] p-8 text-[var(--on-primary)] shadow-[0_24px_70px_rgba(30,10,40,0.45)]">
          <p className="text-xs uppercase tracking-[0.22em] opacity-80">Glambox Secure Access</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">Sign in with confidence.</h1>
          <p className="mt-4 max-w-xl text-sm opacity-90">
            We support secure email/password authentication and verified Google OAuth with server-side token checks.
          </p>

          <div className="mt-8 grid gap-3">
            <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5" />
              <p className="text-sm">Server-issued sessions with HttpOnly cookies and revocable tokens.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
              <Sparkles className="mt-0.5 h-5 w-5" />
              <p className="text-sm">Google identity tokens are validated before login is accepted.</p>
            </div>
          </div>
        </Card>

        <Card className="border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_14px_45px_rgba(0,0,0,0.08)]">
          <h2 className="text-2xl font-semibold text-[var(--fg)]">Welcome back</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Sign in with your email and password or continue with Google.</p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
            <label className="relative">
              <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[var(--muted-foreground)]" />
              <input
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setRequiresGoogle(false);
                }}
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-10 text-sm"
                required
              />
            </label>
            <label className="relative">
              <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[var(--muted-foreground)]" />
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-10 text-sm"
                required
              />
            </label>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in securely"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
            <span className="h-px flex-1 bg-[var(--border)]" />
            <span>OR CONTINUE WITH</span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <div className="min-h-11" ref={googleButtonRef} />
          {googleConfigLoaded && !isGoogleAvailable && !requiresGoogle ? (
            <p className="mt-2 text-xs text-amber-600">
              Google sign-in is unavailable. Set GOOGLE_CLIENT_ID (or NEXT_PUBLIC_GOOGLE_CLIENT_ID) in your .env file.
            </p>
          ) : null}
          {requiresGoogle && isGoogleAvailable ? (
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              For security, this account is restricted to Google OAuth sign-in.
            </p>
          ) : null}

          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
          <p className="mt-5 text-sm text-[var(--muted-foreground)]">
            New here?{" "}
            <Link href="/auth/register" className="font-semibold text-[var(--fg)]">
              Create an account
            </Link>
          </p>
        </Card>
      </Container>
    </Section>
  );
}
