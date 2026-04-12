import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
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
      <body className={`${geistSans.variable} font-sans antialiased bg-cosmic-bg text-white`}>
        {children}
      </body>
    </html>
  );
}
