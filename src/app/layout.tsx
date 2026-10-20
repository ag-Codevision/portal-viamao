import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { CityProvider } from "@/lib/context/city-context";
import { CityNoticeBanner } from "@/components/layout/city-notice-banner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hub TV • Viamão & Região Metropolitana",
    template: "%s | Hub TV",
  },
  description:
    "Hub TV: streaming local, canais ao vivo, filmes de domínio público e oportunidades para a comunidade.",
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para conteúdo
        </a>
        <CityProvider>
          <SiteHeader />
          <CityNoticeBanner />
          <main id="conteudo">{children}</main>
          <SiteFooter />
          <MobileBottomNav />
        </CityProvider>
      </body>
    </html>
  );
}
