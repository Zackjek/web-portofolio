import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Admin Password",
  description: "A secure page for creating or updating the Admin Studio password.",
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
