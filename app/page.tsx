import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-between min-h-[70vh] gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-10 md:mt-20">
      
      {/* Bagian Teks (Kiri) */}
      <div className="flex-1 space-y-6 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Terbuka untuk kolaborasi proyek
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
          Halo, aku Zaky.
        </h1>
        
        <p className="text-lg text-zinc-400 max-w-xl leading-relaxed mx-auto md:mx-0">
          Mahasiswa Informatika. Aku sangat tertarik dengan pengembangan web full-stack dan rekayasa perangkat lunak. Saat ini sedang aktif membangun berbagai proyek berbasis Next.js dan Go, mulai dari aplikasi pelacak kebugaran hingga bot otomatisasi.
        </p>

        {/* Tombol Aksi - Sekarang Lengkap! */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
          <Link 
            href="/portofolio" 
            className="px-5 py-2.5 rounded-lg bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors"
          >
            Lihat Portofolio
          </Link>
          <a 
            href="https://github.com/Zackjek" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-medium border border-zinc-800 hover:border-zinc-500 transition-colors"
          >
            GitHub
          </a>
          <a 
            href="https://www.instagram.com/mzakkyy_?igsh=cWxkb3lxMmcwbHd3" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-medium border border-zinc-800 hover:border-pink-500/60 transition-colors"
          >
            Instagram
          </a>
          <a 
            href="https://wa.me/6282138057177" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-medium border border-zinc-800 hover:border-emerald-500/60 transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* Bagian Foto (Kanan) */}
      <div className="w-56 h-56 md:w-80 md:h-80 relative rounded-full overflow-hidden border-4 border-zinc-800 shrink-0 shadow-2xl">
        <Image 
          src="/foto-zaky.jpeg" 
          alt="Foto Profil Zaky" 
          fill
          className="object-cover"
          priority
        />
      </div>

    </div>
  );
}