import type { Metadata } from "next";
import "./globals.css";
import { SpotifyProvider } from "@/contexts/SpotifyContext";

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
        </SpotifyProvider>
      </body>
    </html>
  );
}
