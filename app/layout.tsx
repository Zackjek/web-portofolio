import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InteractiveBackground from "@/components/InteractiveBackground";

const passwordRecoveryRedirect = `
  (() => {
    if (window.location.pathname === "/reset-password") return;

    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    const type = hash.get("type") || query.get("type");
    const errorCode = hash.get("error_code") || query.get("error_code") || "";
    const errorDescription =
      hash.get("error_description") || query.get("error_description") || "";
    const isRecovery =
      type === "recovery" ||
      errorCode.startsWith("otp_") ||
      errorDescription.toLowerCase().includes("email link");

    if (isRecovery) {
      window.location.replace(
        "/reset-password" + window.location.search + window.location.hash,
      );
    }
  })();
`;

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
      <Script id="password-recovery-redirect" strategy="beforeInteractive">
        {passwordRecoveryRedirect}
      </Script>
      <body suppressHydrationWarning>
        <InteractiveBackground />
        <Navbar />
        <main className="relative z-10 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
