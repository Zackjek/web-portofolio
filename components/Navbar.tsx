"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/portofolio", label: "Karya" },
  { href: "/sertifikat", label: "Sertifikat" },
  { href: "/jurnal", label: "Jurnal" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "site-header-scrolled border-b border-white/[0.08] backdrop-blur-2xl" : "bg-transparent"}`}>
      <nav className="page-shell flex h-20 items-center justify-between" aria-label="Navigasi utama">
        <Link href="/" className="group inline-flex items-center gap-3" aria-label="Kembali ke beranda">
          <span className="brand-mark grid h-10 w-10 place-items-center rounded-full border border-white/15 font-mono text-xs font-black transition-all group-hover:rotate-6 group-hover:border-lime-300/50">
            ZM
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-bold tracking-tight text-white">Muhammad Zaky</span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.19em] text-zinc-600">Developer / Student</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.035] p-1.5 md:flex">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  active ? "nav-active" : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="https://wa.me/6282138057177"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full border border-lime-300/25 bg-lime-300/[0.08] px-4 py-2.5 text-xs font-bold text-lime-200 transition-all hover:border-lime-300/60 hover:bg-lime-300/15 sm:inline-flex"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-lime-300 pulse-dot" />
            Mari kolaborasi
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            <span className="relative h-4 w-5">
              <span className={`absolute left-0 top-1 h-px w-5 bg-current transition-transform ${open ? "translate-y-1 rotate-45" : ""}`} />
              <span className={`absolute bottom-1 left-0 h-px w-5 bg-current transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`absolute left-4 right-4 top-[4.75rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0a1015]/95 shadow-2xl backdrop-blur-2xl transition-all duration-300 md:hidden ${
            open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
          }`}
        >
          <div className="p-2">
            {links.map((link, index) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold ${
                    active ? "nav-active" : "text-zinc-300 hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-[10px] opacity-60">0{index + 1}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
