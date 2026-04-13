import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Luna Cosmic Songs — Portal de Makinas",
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
      <body className={`${inter.variable} font-sans antialiased bg-cosmic-bg text-white`}>
        {children}
      </body>
    </html>
  );
}
