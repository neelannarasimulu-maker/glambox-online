"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { useAuth } from "@/components/auth/AuthProvider";

export default function NewLoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await loginWithGoogle(googleEmail, googleName || undefined);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section>
      <Container className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <h1 className="text-3xl font-semibold text-[var(--fg)]">Sign in with email</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Use your Glambox credentials to access bookings, chats, and purchases.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              required
            />
            <input
              type="password"
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
        </Card>

        <Card className="p-6">
          <h2 className="text-3xl font-semibold text-[var(--fg)]">Continue with Google</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            This stores a Google-backed profile in the same database. Wire OAuth credentials next.
          </p>
          <form onSubmit={handleGoogle} className="mt-6 grid gap-4">
            <input
              type="email"
              placeholder="Google email"
              value={googleEmail}
              onChange={(event) => setGoogleEmail(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Full name (optional)"
              value={googleName}
              onChange={(event) => setGoogleName(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
            />
            <Button type="submit" variant="outline" disabled={isLoading}>
              {isLoading ? "Connecting..." : "Sign in with Google"}
            </Button>
          </form>
        </Card>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <p className="text-sm text-[var(--muted-foreground)] lg:col-span-2">
          New here? <Link href="/auth/register" className="font-semibold text-[var(--fg)]">Create an account</Link>
        </p>
      </Container>
    </Section>
  );
}
