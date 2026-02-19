"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, updateProfile } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
    bio: user?.bio || ""
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (user) {
      setForm({
        fullName: user.fullName,
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
        bio: user.bio || ""
      });
    }
  }, [isAuthenticated, router, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!user) {
      return;
    }

    try {
      await updateProfile({ id: user.id, ...form });
      setMessage("Profile saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-semibold text-[var(--fg)]">My profile</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">Update your personal data stored in the database.</p>
        </div>
        <Card className="max-w-3xl p-6">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input type="text" placeholder="Full name" value={form.fullName} onChange={(event) => setForm((previous) => ({ ...previous, fullName: event.target.value }))} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" required />
            <input type="tel" placeholder="Phone" value={form.phone} onChange={(event) => setForm((previous) => ({ ...previous, phone: event.target.value }))} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
            <input type="date" value={form.dateOfBirth} onChange={(event) => setForm((previous) => ({ ...previous, dateOfBirth: event.target.value }))} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
            <input type="text" placeholder="Address" value={form.address} onChange={(event) => setForm((previous) => ({ ...previous, address: event.target.value }))} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
            <input type="text" placeholder="City" value={form.city} onChange={(event) => setForm((previous) => ({ ...previous, city: event.target.value }))} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
            <input type="text" placeholder="Country" value={form.country} onChange={(event) => setForm((previous) => ({ ...previous, country: event.target.value }))} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
            <textarea placeholder="Short bio" value={form.bio} onChange={(event) => setForm((previous) => ({ ...previous, bio: event.target.value }))} className="min-h-24 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm md:col-span-2" />
            <Button type="submit" className="md:col-span-2">Save profile</Button>
          </form>
          {message ? <p className="mt-3 text-sm text-green-600">{message}</p> : null}
          {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
        </Card>
      </Container>
    </Section>
  );
}
