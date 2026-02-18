"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { SiteConfig } from "@/lib/schemas";
import { cn } from "@/lib/cn";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";

type SiteHeaderProps = {
  config: SiteConfig;
};

export function SiteHeader({ config }: SiteHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const closeTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const exploreItem = config.nav.items.find((item) => item.type === "dropdown");
  const linkItems = config.nav.items.filter((item) => item.type === "link");
  const { itemCount } = useCart();
  const { isAuthenticated, logout } = useAuth();

  const clearCloseTimeout = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimeout();
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black bg-black backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src={config.brand.logo.src}
            alt={config.brand.logo.alt}
            className="h-12 w-auto"
          />
          <div className="flex flex-col">
            <span className="text-xs text-white/70">{config.brand.tagline}</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {exploreItem && exploreItem.type === "dropdown" ? (
            <div className="relative">
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger
                  className={cn(
                    "text-sm font-semibold text-white/80",
                    open && "text-white"
                  )}
                  onClick={() => setOpen((prev) => !prev)}
                  onPointerEnter={() => {
                    clearCloseTimeout();
                    setOpen(true);
                  }}
                  onPointerLeave={scheduleClose}
                >
                  {exploreItem.label}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  onPointerEnter={() => {
                    clearCloseTimeout();
                    setOpen(true);
                  }}
                  onPointerLeave={() => {
                    clearCloseTimeout();
                    setOpen(false);
                  }}
                >
                  {exploreItem.children.map((child) => (
                    <DropdownMenuItem key={child.id} asChild>
                      <Link href={child.href} className="w-full">
                        {child.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
          {linkItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-sm font-semibold text-white/80 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={isAuthenticated ? "/dashboard" : "/login"}
            className="text-sm font-semibold text-white/80 hover:text-white"
          >
            {isAuthenticated ? "My Dashboard" : "Login"}
          </Link>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={logout}
              className="text-sm font-semibold text-white/70 hover:text-white"
            >
              Log out
            </button>
          ) : null}
          <Link href="/cart" className="relative text-sm font-semibold text-white/80 hover:text-white">
            Cart
            <span className="ml-2 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-black">
              {itemCount}
            </span>
          </Link>
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" aria-label="Open menu" className="border-white/40 text-white hover:bg-white/10">
                <Menu size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[var(--muted-foreground)]">{config.brand.tagline}</span>
                </div>
                {exploreItem && exploreItem.type === "dropdown" ? (
                  <div className="flex flex-col gap-3">
                    <span className="text-sm font-semibold text-[var(--fg)]">{exploreItem.label}</span>
                    <div className="flex flex-col gap-2">
                      {exploreItem.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          className="text-sm text-[var(--muted-foreground)]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="flex flex-col gap-3">
                  {linkItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="text-sm font-semibold text-[var(--fg)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href={isAuthenticated ? "/dashboard" : "/login"}
                    className="text-sm font-semibold text-[var(--fg)]"
                  >
                    {isAuthenticated ? "My Dashboard" : "Login"}
                  </Link>
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={logout}
                      className="text-sm font-semibold text-[var(--fg)]"
                    >
                      Log out
                    </button>
                  ) : null}
                  <Link href="/cart" className="text-sm font-semibold text-[var(--fg)]">
                    Cart ({itemCount})
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
