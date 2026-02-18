"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";
import { Container } from "@/components/ui/container";

type BuilderConfig = {
  headline: string;
  body: string;
  notesLabel: string;
  submitLabel: string;
  confirmationTitle: string;
  confirmationBody: string;
  currencySymbol?: string;
  categories: Array<{
    id: string;
    label: string;
    items: Array<{ name: string; price: number; image: string }>;
  }>;
  presets: Array<{ name: string; description: string; price?: number }>;
};

export function FoodBuilder({ builder }: { builder: BuilderConfig }) {
  const [selections, setSelections] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    builder.categories.forEach((category) => {
      if (category.id === "bread" && category.items[0]) {
        initial[category.id] = [category.items[0].name];
      } else {
        initial[category.id] = [];
      }
    });
    return initial;
  });
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const currencySymbol = builder.currencySymbol ?? "£";

  const total = useMemo(() => {
    return builder.categories.reduce((sum, category) => {
      const selected = new Set(selections[category.id] ?? []);
      const categoryTotal = category.items.reduce((itemSum, item) => {
        if (selected.has(item.name)) {
          return itemSum + item.price;
        }
        return itemSum;
      }, 0);
      return sum + categoryTotal;
    }, 0);
  }, [builder.categories, selections]);

  const summary = useMemo(() => {
    const parts = builder.categories
      .map((category) => {
        const selected = selections[category.id] ?? [];
        return selected.length ? `${category.label}: ${selected.join(", ")}` : null;
      })
      .filter(Boolean);
    return parts.join(" - ");
  }, [builder.categories, selections]);

  const formatPrice = (value: number) => `${currencySymbol}${value.toFixed(2)}`;

  const toggleItem = (categoryId: string, itemName: string) => {
    setSelections((prev) => {
      const current = new Set(prev[categoryId] ?? []);
      if (current.has(itemName)) {
        current.delete(itemName);
      } else {
        current.add(itemName);
      }
      return { ...prev, [categoryId]: Array.from(current) };
    });
  };

  return (
    <Section background="linen">
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-[var(--heading)]">{builder.headline}</h2>
          <p className="max-w-2xl text-base text-[var(--muted-foreground)]">{builder.body}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6">
            <div className="grid gap-5 md:grid-cols-2">
              {builder.categories.map((category) => (
                <div key={category.id} className="flex flex-col gap-3">
                  <div className="text-sm font-semibold text-[var(--fg)]">{category.label}</div>
                  <div className="flex flex-col gap-3">
                    {category.items.map((item) => {
                      const checked = (selections[category.id] ?? []).includes(item.name);
                      return (
                        <label
                          key={item.name}
                          className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--muted-foreground)]"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleItem(category.id, item.name)}
                            className="h-4 w-4 rounded border-[var(--border)] text-[var(--accent-strong)]"
                          />
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                          <div className="flex flex-1 flex-col">
                            <span className="text-[var(--fg)]">{item.name}</span>
                            <span>{formatPrice(item.price)}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <label className="mt-4 flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              {builder.notesLabel}
              <input
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
                placeholder="e.g. no dairy, extra herbs"
              />
            </label>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Total
                </div>
                <div className="text-xl font-semibold text-[var(--fg)]">
                  {formatPrice(total)}
                </div>
              </div>
              <Button onClick={() => setConfirmed(true)}>{builder.submitLabel}</Button>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[var(--fg)]">Chef presets</h3>
            <div className="mt-3 flex flex-col gap-3 text-sm text-[var(--muted-foreground)]">
              {builder.presets.map((preset) => (
                <div key={preset.name}>
                  <div className="flex items-center justify-between text-[var(--fg)]">
                    <span>{preset.name}</span>
                    {preset.price ? (
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {formatPrice(preset.price)}
                      </span>
                    ) : null}
                  </div>
                  <div>{preset.description}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted-foreground)]">
              {summary ? `Your selection: ${summary}` : "Your selection: none yet."}
              {notes ? ` - Notes: ${notes}` : ""}
            </div>
            {confirmed ? (
              <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4">
                <h4 className="text-sm font-semibold text-[var(--fg)]">
                  {builder.confirmationTitle}
                </h4>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {builder.confirmationBody}
                </p>
              </div>
            ) : null}
          </Card>
        </div>
      </Container>
    </Section>
  );
}
