import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Satoru Admin",
  description: "Plataforma de Inversión Tokenizada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      {/* 1. suppressHydrationWarning: Evita el error de tu extensión "Smart Converter".
        2. bg-background: Pone el fondo negro de Satoru.
      */}
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} bg-background text-text-main antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
