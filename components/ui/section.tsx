import * as React from "react";
import { cn } from "@/lib/cn";

type SectionProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "stone";
};

export function Section({ className, tone = "default", ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "py-16",
        tone === "stone" ? "bg-[var(--surface-strong)]" : "bg-transparent",
        className
      )}
      {...props}
    />
  );
}
