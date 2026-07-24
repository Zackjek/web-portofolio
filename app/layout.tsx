import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InteractiveBackground from "@/components/InteractiveBackground";

export const metadata: Metadata = {
  metadataBase: new URL("https://muhammadzakymubarok-portofolio.vercel.app"),
  title: {
    default: "Muhammad Zaky Mubarok — Developer Portfolio",
    template: "%s — Muhammad Zaky Mubarok",
  },
  description:
    "Portofolio Muhammad Zaky Mubarok, mahasiswa Informatika dan web developer yang membangun produk digital modern.",
  keywords: [
    "Muhammad Zaky Mubarok",
    "web developer",
    "Next.js",
    "portfolio",
    "mahasiswa informatika",
  ],
  openGraph: {
    title: "Muhammad Zaky Mubarok — Developer Portfolio",
    description:
      "Proyek, sertifikat, dan catatan perjalanan Muhammad Zaky Mubarok di dunia teknologi.",
    type: "website",
    locale: "id_ID",
    images: ["/fotokuy.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>
        <InteractiveBackground />
        <Navbar />
        <main className="relative z-10 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
