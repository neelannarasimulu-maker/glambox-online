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
    password: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    country: "",
    bio: ""
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
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-semibold text-[var(--fg)]">Create your account</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">Your details are stored in the new Glambox user database.</p>
        </div>
        <Card className="max-w-3xl p-6">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input type="text" placeholder="Full name" value={form.fullName} onChange={(event) => handleChange("fullName", event.target.value)} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" required />
            <input type="email" placeholder="Email" value={form.email} onChange={(event) => handleChange("email", event.target.value)} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" required />
            <input type="password" placeholder="Password" value={form.password} onChange={(event) => handleChange("password", event.target.value)} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" required />
            <input type="tel" placeholder="Phone" value={form.phone} onChange={(event) => handleChange("phone", event.target.value)} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
            <input type="date" value={form.dateOfBirth} onChange={(event) => handleChange("dateOfBirth", event.target.value)} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
            <input type="text" placeholder="Address" value={form.address} onChange={(event) => handleChange("address", event.target.value)} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
            <input type="text" placeholder="City" value={form.city} onChange={(event) => handleChange("city", event.target.value)} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
            <input type="text" placeholder="Country" value={form.country} onChange={(event) => handleChange("country", event.target.value)} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
            <textarea placeholder="Short bio" value={form.bio} onChange={(event) => handleChange("bio", event.target.value)} className="min-h-24 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm md:col-span-2" />
            <Button type="submit" className="md:col-span-2" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </form>
          {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
          <p className="mt-3 text-xs text-[var(--muted-foreground)]">
            Already registered? <Link href="/auth/login" className="font-semibold text-[var(--fg)]">Sign in</Link>
          </p>
        </Card>
      </Container>
    </Section>
  );
}
