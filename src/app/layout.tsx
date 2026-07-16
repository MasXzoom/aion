import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexa API — Metered keys to every AI model",
  description: "Satu endpoint, budget dalam kendali penuh. QRIS, API key instan, akses ke 20+ model AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}