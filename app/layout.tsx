import "@/styles/globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getSiteConfig } from "@/lib/content";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";

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
      <body>
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
