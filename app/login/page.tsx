"use client";

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login(email || "guest@glambox.com");
    router.push("/dashboard");
  };

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-semibold text-[var(--fg)]">Welcome back</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Sign in to access your personal dashboard.
          </p>
        </div>
        <Card className="max-w-xl p-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              required
            />
            <Button type="submit">Sign in</Button>
            <p className="text-xs text-[var(--muted-foreground)]">
              Authentication wiring comes later. This is a protected UI scaffold.
            </p>
          </form>
        </Card>
      </Container>
    </Section>
  );
}
