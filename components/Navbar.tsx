import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md fixed top-0 w-full z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white hover:text-zinc-300 transition-colors">
          Zackjek.
        </Link>
        <div className="flex gap-6 text-sm font-medium text-zinc-400">
          <Link href="/portofolio" className="hover:text-white transition-colors">
            Portofolio
          </Link>
          <Link href="/jurnal" className="hover:text-white transition-colors">
            Jurnal
          </Link>
          <a 
            href="https://github.com/Zackjek" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}