"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function ProfilePage() {
  const router = useRouter();
  const { authReady, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!authReady) {
      return;
    }
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [authReady, isAuthenticated, router]);

  if (!authReady || !isAuthenticated || !user) {
    return null;
  }

  const completion = [
    { label: "Medical", complete: Boolean(user.medicalInfo?.trim()), href: "/onboarding?section=medical" },
    { label: "Hair", complete: Boolean(user.hairPreferences?.trim()), href: "/onboarding?section=hair" },
    { label: "Nails", complete: Boolean(user.nailPreferences?.trim()), href: "/onboarding?section=nails" },
    { label: "Food", complete: Boolean(user.foodPreferences?.trim()), href: "/onboarding?section=food" }
  ];

  return (
    <Section>
      <Container className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-semibold text-[var(--fg)]">Profile center</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Update profile data contextually instead of filling everything in one form.
          </p>
        </div>
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-[var(--fg)]">Context progress</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {completion.map((item) => (
              <Link key={item.label} href={item.href} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm font-semibold text-[var(--fg)]">
                {item.label}: {item.complete ? "Complete" : "Pending"}
              </Link>
            ))}
          </div>
          <Link href="/onboarding" className="mt-5 inline-block text-sm font-semibold text-[var(--fg)]">
            Open full contextual onboarding
          </Link>
        </Card>
      </Container>
    </Section>
  );
}
