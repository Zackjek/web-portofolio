import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zackjek | Portofolio & Jurnal",
  description: "Jurnal harian dan portofolio proyek",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased`}>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 pt-24 pb-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}