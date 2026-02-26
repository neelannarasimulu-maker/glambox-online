import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { backgrounds, backgroundOverlays, type BackgroundKey } from "@/lib/theme/backgrounds";

type SectionProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  title?: string;
  subtitle?: string;
  background?: BackgroundKey;
  as?: "section" | "div";
  tone?: "default" | "stone";
  children?: ReactNode;
};

export function Section({
  title,
  subtitle,
  background,
  as = "section",
  tone = "default",
  className,
  children,
  ...props
}: SectionProps) {
  const Component = as as ElementType;
  const recipe = background ? backgrounds[background] : null;
  const overlay = background ? backgroundOverlays[background] : null;

  return (
    <Component
      className={cn(
        "relative py-16",
        background && "overflow-hidden rounded-[var(--radius)] border border-[var(--border)]",
        tone === "stone" ? "bg-[var(--surface-strong)]" : "bg-transparent",
        className
      )}
      {...props}
    >
      {recipe ? <div className={cn("absolute inset-0", recipe.className)} style={recipe.style} /> : null}
      {overlay ? <div className={cn("absolute inset-0", overlay)} /> : null}
      {recipe ? <div className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.06]" /> : null}
      <div className={cn("relative z-10", background && "px-6")}>
        {(title || subtitle) && (
          <div className="mx-auto mb-8 w-full max-w-4xl text-center">
            {title ? <h2 className="text-4xl font-semibold text-[var(--fg)] md:text-5xl">{title}</h2> : null}
            {subtitle ? <p className="mt-3 text-base text-[var(--muted-foreground)] md:text-lg">{subtitle}</p> : null}
          </div>
        )}
        {background ? <div className="mx-auto w-full max-w-6xl">{children}</div> : children}
      </div>
    </Component>
  );
}
