"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { useState } from "react";
=======
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Mail, Lock, Sparkles } from "lucide-react";
>>>>>>> bee3f64297bbcd7cb4ab6cfc649c1d5729c78c34
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD
=======
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
>>>>>>> bee3f64297bbcd7cb4ab6cfc649c1d5729c78c34

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await login(email, password);
      router.push(user.onboardingCompleted ? "/dashboard" : "/onboarding");
    } catch (err) {
<<<<<<< HEAD
      const loginError = err as Error & { code?: string };
      if (loginError.code === "PASSWORD_RESET_REQUIRED") {
        setError("This account needs a password reset before sign in.");
=======
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
>>>>>>> bee3f64297bbcd7cb4ab6cfc649c1d5729c78c34
      } else {
        setError(loginError.message || "Unable to sign in.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <Section className="bg-gradient-to-b from-[var(--muted)]/40 via-transparent to-transparent">
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden border-none bg-[var(--surface)] p-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="bg-[var(--primary)] p-8 text-[var(--on-primary)]">
            <p className="text-xs uppercase tracking-[0.2em] opacity-80">Glambox Member Access</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight">Secure email sign in</h1>
            <p className="mt-3 max-w-xl text-sm opacity-90">
              Passwords are encrypted at rest and validated against strong policy requirements.
            </p>
          </div>
          <div className="grid gap-4 p-8 text-sm text-[var(--muted-foreground)] md:grid-cols-3">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
              Email is normalized and validated server-side.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
              Password verification uses secure hash comparison.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
              Login and reset endpoints include request rate limiting.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-[var(--fg)]">Email and password</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Use your registered account credentials.
          </p>
          <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              required
            />
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              required
            />
=======
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
>>>>>>> bee3f64297bbcd7cb4ab6cfc649c1d5729c78c34
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in securely"}
            </Button>
          </form>

<<<<<<< HEAD
=======
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

>>>>>>> bee3f64297bbcd7cb4ab6cfc649c1d5729c78c34
          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

          <div className="mt-5 flex items-center justify-between text-sm">
            <Link href="/auth/reset-password" className="font-semibold text-[var(--primary)] hover:underline">
              Reset password
            </Link>
            <Link href="/auth/register" className="font-semibold text-[var(--fg)]">
              Create account
            </Link>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
