"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

type ResetRequestResponse = {
  message: string;
  resetCode?: string;
  error?: string;
};

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const requestReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setIsRequesting(true);

    try {
      const response = await fetch("/api/auth/password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const result = (await response.json()) as ResetRequestResponse;
      if (!response.ok) {
        throw new Error(result.error || "Unable to request password reset.");
      }

      if (result.resetCode) {
        setResetCode(result.resetCode);
      }
      setInfo(result.message);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to request password reset.");
    } finally {
      setIsRequesting(false);
    }
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsResetting(true);
    try {
      const response = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetCode, password })
      });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Unable to reset password.");
      }

      setInfo(result.message || "Password reset successful.");
      setPassword("");
      setConfirmPassword("");
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Unable to reset password.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Section className="bg-gradient-to-b from-[var(--muted)]/30 to-transparent">
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Password Recovery
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--fg)]">Reset your password</h1>
          <p className="mt-3 max-w-lg text-sm text-[var(--muted-foreground)]">
            Request a reset code, then choose a new password. Password policy requires 12+
            characters with uppercase, lowercase, number, and symbol.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-[var(--muted-foreground)]">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              Step 1: request reset code using your email.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              Step 2: submit code and your new secure password.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-[var(--fg)]">Request reset code</h2>
          <form onSubmit={requestReset} className="mt-4 grid gap-3">
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
            <Button type="submit" disabled={isRequesting}>
              {isRequesting ? "Requesting..." : "Send reset code"}
            </Button>
          </form>

          <h3 className="mt-6 text-lg font-semibold text-[var(--fg)]">Set new password</h3>
          <form onSubmit={resetPassword} className="mt-3 grid gap-3">
            <input
              type="text"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Reset code"
              value={resetCode}
              onChange={(event) => setResetCode(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              required
            />
            <input
              type="password"
              autoComplete="new-password"
              placeholder="New password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              required
            />
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              required
            />
            <Button type="submit" disabled={isResetting}>
              {isResetting ? "Resetting..." : "Reset password"}
            </Button>
          </form>

          {info ? <p className="mt-4 text-sm text-emerald-700">{info}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

          <p className="mt-5 text-sm text-[var(--muted-foreground)]">
            Remembered it?{" "}
            <Link href="/auth/login" className="font-semibold text-[var(--fg)]">
              Back to sign in
            </Link>
          </p>
        </Card>
      </Container>
    </Section>
  );
}
