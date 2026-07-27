import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Studio",
  description: "Content management for Muhammad Zaky Mubarok's portfolio.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
