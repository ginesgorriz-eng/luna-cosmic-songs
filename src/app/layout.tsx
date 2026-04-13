import type { Metadata } from "next";
import "./globals.css";
import { SpotifyProvider } from "@/contexts/SpotifyContext";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Luna Ki Kosmik Songs — Portal de Makinas",
  description:
    "Las canciones de Luna se han perdido en el espacio. ¿Nos ayudas a recomponerlas, Makina?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-futura antialiased bg-cosmic-bg text-white">
        <SpotifyProvider>
          {children}
          <Footer />
          <CookieBanner />
        </SpotifyProvider>
      </body>
    </html>
  );
}
