import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Password Admin",
  description: "Halaman aman untuk membuat atau mengganti password Admin Studio.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ResetPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
