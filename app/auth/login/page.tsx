"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await login(email, password);
      router.push(user.onboardingCompleted ? "/dashboard" : "/onboarding");
    } catch (err) {
      const loginError = err as Error & { code?: string };
      if (loginError.code === "PASSWORD_RESET_REQUIRED") {
        setError("This account needs a password reset before sign in.");
      } else {
        setError(loginError.message || "Unable to sign in.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in securely"}
            </Button>
          </form>

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
