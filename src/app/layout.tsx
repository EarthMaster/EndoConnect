import type React from "react";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"], // Added 800 for Extra Bold
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>EndoConnect - Suporte e Educação para Endometriose</title>
        <meta name="description" content="Plataforma de apoio e educação para mulheres com endometriose" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
    <AuthProvider>
          {children}
    </AuthProvider>
      </body>
    </html>
  );
}
