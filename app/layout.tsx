import "@/styles/globals.css";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getSiteConfig } from "@/lib/content";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap"
});

export function generateMetadata() {
  const site = getSiteConfig();

  return {
    title: site.brand.name,
    description: site.brand.tagline
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSiteConfig();

  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${sora.variable}`}>
        <AuthProvider>
          <CartProvider>
            <SiteHeader config={site} />
            <main>{children}</main>
            <SiteFooter config={site} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
