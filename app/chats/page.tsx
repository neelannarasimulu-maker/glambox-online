"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { getPopupConfig } from "@/lib/content";
import { getChatStatus } from "@/lib/chatStatus";

export default function ChatsPage() {
  const hair = getPopupConfig("hair");
  const nails = getPopupConfig("nails");
  const wellness = getPopupConfig("wellness");
  const food = getPopupConfig("food");

  const chats = [hair, nails, wellness, food].flatMap((popup) =>
    popup.pages.consultants.consultants.map((consultant) => ({
      popup,
      consultant,
      status: getChatStatus(popup.popupKey, consultant.id)
    }))
  );

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
            My chats
          </div>
          <h1 className="mt-2 text-4xl font-semibold text-[var(--fg)]">All chats</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Browse every conversation across your Glambox popups.
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-lg font-semibold text-[var(--fg)]">Chat directory</div>
            <Link href="/dashboard" className="text-sm font-semibold text-[var(--fg)]">
              Back to dashboard
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {chats.map(({ popup, consultant, status }) => (
              <div
                key={`${popup.popupKey}-${consultant.id}`}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="pop">{consultant.name}</Badge>
                    <span className="text-[var(--muted-foreground)]">{popup.name}</span>
                  </div>
                  <div className="text-[var(--muted-foreground)]">
                    {status.status === "available" ? "Available now" : "Unavailable"} ·{" "}
                    {status.responseTime}
                  </div>
                </div>
                <Link
                  href={`/explore/${popup.popupKey}/consultants/${consultant.id}/chat`}
                  className="text-sm font-semibold text-[var(--fg)]"
                >
                  Open chat
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </Container>
    </Section>
  );
}
