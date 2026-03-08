import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-start justify-center min-h-[70vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Badge Status */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm mb-6">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Terbuka untuk kolaborasi proyek
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4">
        Halo, aku Zaky.
      </h1>
      
      {/* Deskripsi Singkat */}
      <p className="text-lg text-zinc-400 max-w-2xl mb-8 leading-relaxed">
        Mahasiswa Informatika. Aku sangat tertarik dengan pengembangan web full-stack dan rekayasa perangkat lunak. Saat ini sedang aktif membangun berbagai proyek berbasis Next.js dan Go, mulai dari aplikasi pelacak kebugaran hingga bot otomatisasi.
      </p>

      {/* Tombol Aksi */}
      <div className="flex flex-wrap gap-4">
        <Link 
          href="/portofolio" 
          className="px-6 py-3 rounded-lg bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors"
        >
          Lihat Portofolio
        </Link>
        <a 
          href="https://github.com/Zackjek" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-lg bg-zinc-900 text-white font-medium border border-zinc-800 hover:border-zinc-600 transition-colors"
        >
          Kunjungi GitHub
        </a>
      </div>

    </div>
  );
}