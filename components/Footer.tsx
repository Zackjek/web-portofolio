import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.08]">
      <div className="page-shell flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-lime-300/30 bg-lime-300/10 font-mono text-xs font-black text-lime-300">
              ZM
            </span>
            <span className="font-semibold tracking-tight text-white">Muhammad Zaky Mubarok</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">
            Merancang pengalaman digital yang cepat, berguna, dan punya karakter.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-500">
          <Link href="/portofolio" className="transition-colors hover:text-white">Karya</Link>
          <Link href="/sertifikat" className="transition-colors hover:text-white">Sertifikat</Link>
          <Link href="/jurnal" className="transition-colors hover:text-white">Jurnal</Link>
          <a href="https://github.com/Zackjek" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
            GitHub ↗
          </a>
          <span className="w-full font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-700 md:w-auto">
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
