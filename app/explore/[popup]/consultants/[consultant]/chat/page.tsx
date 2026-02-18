import { notFound } from "next/navigation";
import { PopupShell } from "@/components/popup/PopupShell";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { getPopupConfig, getPopupKeys } from "@/lib/content";
import { getChatStatus } from "@/lib/chatStatus";

const mockThreads: Record<string, Array<{ sender: "customer" | "consultant"; text: string }>> = {
  hair: [
    { sender: "customer", text: "Hi! I want a soft, low-maintenance glow. Any ideas?" },
    {
      sender: "consultant",
      text: "Absolutely. A dimensional gloss and face-framing layers would be perfect."
    },
    { sender: "customer", text: "Love that. Can we keep it subtle?" }
  ],
  nails: [
    { sender: "customer", text: "I want something modern but still clean." },
    { sender: "consultant", text: "Let’s do a glossy neutral with a micro accent line." },
    { sender: "customer", text: "Perfect. Short almond shape?" }
  ],
  wellness: [
    { sender: "customer", text: "My skin feels dull and a bit dehydrated." },
    { sender: "consultant", text: "A hydra facial plus LED glow will revive and soothe." },
    { sender: "customer", text: "Yes please. Any prep needed?" }
  ]
};

export default function ConsultantChatPage({
  params
}: {
  params: { popup: string; consultant: string };
}) {
  if (!getPopupKeys().includes(params.popup as "hair" | "nails" | "wellness" | "food")) {
    notFound();
  }

  const popup = getPopupConfig(params.popup);
  const consultant = popup.pages.consultants.consultants.find(
    (item) => item.id === params.consultant
  );

  if (!consultant) {
    notFound();
  }

  const chatStatus = getChatStatus(popup.popupKey, consultant.id);
  const thread = mockThreads[popup.popupKey] ?? [];

  return (
    <PopupShell popup={popup}>
      <Section>
        <Container className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--fg)]">
              Chat with {consultant.name}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {chatStatus.status === "available" ? "Available now" : "Unavailable"} ·{" "}
              {chatStatus.responseTime}
            </p>
          </div>
          <Card className="flex flex-col gap-4 p-6">
            <div className="flex h-[360px] flex-col gap-3 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              {thread.map((message, index) => (
                <div
                  key={`${message.sender}-${index}`}
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    message.sender === "customer"
                      ? "ml-auto bg-[var(--primary)] text-[var(--on-primary)]"
                      : "bg-white text-[var(--fg)]"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              This is a mock chat view. Live chat will connect when available.
            </div>
          </Card>
        </Container>
      </Section>
    </PopupShell>
  );
}
