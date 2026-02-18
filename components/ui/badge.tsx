import * as React from "react";
import { cn } from "@/lib/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "stone" | "pop";
};

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  stone: "bg-[var(--stone)] text-[var(--fg)]",
  pop: "bg-[var(--accent)] text-[var(--on-accent)]"
};

export function Badge({ className, variant = "stone", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
