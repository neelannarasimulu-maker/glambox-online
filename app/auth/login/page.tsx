"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

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
      shape: "rectangular",
      width: 320
    });
  };

  useEffect(() => {
    renderGoogleButton();
  }, [googleClientId]);

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
      if (
        loginError.code === "ACCOUNT_PROVIDER_REQUIRED" &&
        loginError.provider === "google"
      ) {
        setRequiresGoogle(true);
        setError("This email is linked to Google. Continue securely with Google below.");
      } else {
        setError(loginError.message || "Unable to sign in.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section className="bg-gradient-to-b from-[var(--muted)]/40 via-transparent to-transparent">
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={renderGoogleButton} />
      <Container className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-none bg-[var(--surface)] p-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="bg-[var(--primary)] p-8 text-[var(--on-primary)]">
            <p className="text-xs uppercase tracking-[0.2em] opacity-80">Glambox Member Access</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight">Sign in, then continue where you left off.</h1>
            <p className="mt-3 max-w-xl text-sm opacity-90">
              Faster login, safer profile prompts, and contextual onboarding when needed.
            </p>
          </div>
          <div className="grid gap-4 p-8 text-sm text-[var(--muted-foreground)] md:grid-cols-3">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
              1 minute sign-in with autofill-ready fields.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
              Profile prompts only when they unlock a service.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
              Medical and preference details remain editable anytime.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-[var(--fg)]">Email sign in</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Use the account you created at checkout or registration.
          </p>
          <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
            <span className="h-px flex-1 bg-[var(--border)]" />
            <span>or</span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <div className="min-h-11" ref={googleButtonRef} />
          {!googleClientId ? (
            <p className="mt-2 text-xs text-amber-600">
              Google sign-in is unavailable because NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.
            </p>
          ) : null}
          {requiresGoogle ? (
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              For your security, this account can only be accessed using Google verification.
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
