"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { useAuth } from "@/components/auth/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const handleChange = (key: string, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register(form);
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section className="bg-gradient-to-b from-[var(--muted)]/30 to-transparent">
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Faster Registration
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--fg)]">Create account in under a minute.</h1>
          <p className="mt-3 max-w-lg text-sm text-[var(--muted-foreground)]">
            We only ask for essentials now. Hair, nails, food, and medical preferences are captured later in context.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-[var(--muted-foreground)]">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              Register with name, email, and password only.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              Complete your profile in guided steps based on what you book.
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-[var(--fg)]">Create account</h2>
          <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
            <input
              type="text"
              autoComplete="name"
              placeholder="Full name"
              value={form.fullName}
              onChange={(event) => handleChange("fullName", event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              required
            />
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              required
            />
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              required
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Continue"}
            </Button>
          </form>
          {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
          <p className="mt-4 text-xs text-[var(--muted-foreground)]">
            Already registered?{" "}
            <Link href="/auth/login" className="font-semibold text-[var(--fg)]">
              Sign in
            </Link>
          </p>
        </Card>
      </Container>
    </Section>
  );
}
