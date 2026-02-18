import type { ElementType, ReactNode } from "react";
import { backgrounds, backgroundOverlays, type BackgroundKey } from "@/lib/theme/backgrounds";
import { cn } from "@/lib/cn";

type SectionProps = {
  title?: string;
  subtitle?: string;
  background?: BackgroundKey;
  as?: "section" | "div";
  className?: string;
  children?: ReactNode;
};

export function Section({
  title,
  subtitle,
  background = "linen",
  as = "section",
  className,
  children
}: SectionProps) {
  const Component = as as ElementType;
  const recipe = backgrounds[background];
  const overlay = backgroundOverlays[background];

  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-[var(--radius)] border border-[var(--border)]",
        className
      )}
    >
      <div className={cn("absolute inset-0", recipe.className)} style={recipe.style} />
      {overlay ? <div className={cn("absolute inset-0", overlay)} /> : null}
      <div className="grain-overlay absolute inset-0 pointer-events-none opacity-[0.06]" />
      <div className="relative z-10 px-6 py-16">
        {(title || subtitle) && (
          <div className="mx-auto mb-8 w-full max-w-4xl text-center">
            {title ? (
              <h2 className="text-4xl font-semibold text-[var(--fg)] md:text-5xl">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-3 text-base text-[var(--muted-foreground)] md:text-lg">
                {subtitle}
              </p>
            ) : null}
          </div>
        )}
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </div>
    </Component>
  );
}
