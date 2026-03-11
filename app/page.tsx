import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 overflow-hidden">
      
      {/* Efek Latar Belakang (Grid Pattern & Cahaya Blur) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute w-[600px] h-[600px] bg-zinc-600/10 rounded-full blur-[120px] -top-32"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Badge Status (Pill Kaca + Animasi Ping Hijau) */}
        <div className="mb-10 inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-zinc-900/60 border border-zinc-700/50 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:bg-zinc-800/80 hover:border-zinc-500 transition-all cursor-default">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium text-zinc-300">Tersedia untuk Kolaborasi</span>
        </div>

        {/* Avatar dengan Efek Cincin Menyala (Glow) */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 mb-10 group">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-500 to-zinc-800 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>
          <div className="relative w-full h-full rounded-full p-1.5 bg-gradient-to-br from-zinc-700 via-zinc-900 to-black">
            <Image 
              src="/fotokuy.png" 
              alt="Muhammad Zaky Mubarok" 
              fill
              className="object-cover rounded-full border border-zinc-800"
              priority
            />
          </div>
        </div>

        {/* Teks Perkenalan (Teks Gradasi Metalik) */}
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 pb-2">
            Muhammad Zaky Mubarok
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-zinc-400 flex items-center justify-center gap-3">
            Mahasiswa Informatika <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 hidden md:block"></span> <span className="hidden md:block">Pengembang Web</span>
          </h2>
          <p className="text-base md:text-lg text-zinc-500 leading-relaxed max-w-2xl mx-auto">
            Membangun pengalaman web digital yang cepat, responsif, dan elegan. Saat ini berfokus pada ekosistem <span className="text-zinc-300 font-medium">Next.js</span>, backend <span className="text-zinc-300 font-medium">Go</span>, dan arsitektur database modern.
          </p>
        </div>

        {/* Tombol Aksi & Sosmed (Hover Effect Keren) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5 w-full">
          
          {/* Tombol Utama */}
          <Link 
            href="/portofolio" 
            className="group relative px-8 py-4 rounded-full bg-white text-zinc-950 font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Jelajahi Portofolio
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </Link>

          {/* Icon Sosmed Bulat */}
          <div className="flex gap-4">
            <a href="https://github.com/Zackjek" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 transition-all hover:-translate-y-1 shadow-lg backdrop-blur-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
            </a>
            <a href="https://www.instagram.com/mzakkyy_?igsh=cWxkb3lxMmcwbHd3" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-pink-400 hover:border-pink-500/50 hover:bg-zinc-800 transition-all hover:-translate-y-1 shadow-lg backdrop-blur-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" stroke="none" fill="currentColor"/></svg>
            </a>
            <a href="https://wa.me/6282138057177" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800 transition-all hover:-translate-y-1 shadow-lg backdrop-blur-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </a>
          </div>
        </div>

        {/* Section Tech Stack (Logo Abu-abu yang berwarna kalau disorot mouse) */}
        <div className="mt-24 pt-10 border-t border-zinc-800/50 w-full max-w-3xl">
          <p className="text-xs font-semibold text-zinc-600 mb-8 uppercase tracking-widest">Tech Stack Utama</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-14 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             {/* Logo Next.js */}
             <svg width="35" height="35" viewBox="0 0 128 128" fill="white"><path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h9.6l50.5 60.4c16.4-10.4 26.3-28.2 26.3-48.2 0-35.3-28.7-64-64-64zm22.3 41.8l-7.4 9.6 15.3 19.3-15.3 19.3 7.4 9.6 22.9-28.9-22.9-28.9z"/></svg>
             {/* Logo Go */}
             <svg width="35" height="35" viewBox="0 0 128 128" fill="#00ADD8"><path d="M41.1 53.7c-5.2 0-9.6 1.7-13.1 5.2-3.5 3.5-5.2 7.8-5.2 13.1 0 5.2 1.7 9.6 5.2 13.1 3.5 3.5 7.8 5.2 13.1 5.2 5.2 0 9.6-1.7 13.1-5.2 3.5-3.5 5.2-7.8 5.2-13.1h-18v-8.4h26.6c.1 1.4.2 2.9.2 4.4 0 7.4-2.4 13.7-7.2 18.8-4.8 5.1-11.4 7.7-19.8 7.7-7.4 0-13.7-2.6-18.9-7.8C6.9 81.3 4.3 75.1 4.3 67.7c0-7.4 2.6-13.7 7.8-18.9 5.2-5.2 11.5-7.8 18.9-7.8 6.4 0 12.1 2.1 16.9 6.2l-6.2 6.8c-3.2-2.8-7-4.1-11.4-4.1h.8zM99.3 41c-7.4 0-13.7 2.6-18.9 7.8-5.2 5.2-7.8 11.5-7.8 18.9 0 7.4 2.6 13.7 7.8 18.9 5.2 5.2 11.5 7.8 18.9 7.8 7.4 0 13.7-2.6 18.9-7.8 5.2-5.2 7.8-11.5 7.8-18.9 0-7.4-2.6-13.7-7.8-18.9-5.1-5.2-11.4-7.8-18.9-7.8zm0 8.4c4.8 0 8.8 1.7 12.1 5 3.3 3.3 5 7.3 5 12 0 4.8-1.7 8.8-5 12.1-3.3 3.3-7.3 5-12.1 5-4.8 0-8.8-1.7-12.1-5-3.3-3.3-5-7.3-5-12.1 0-4.8 1.7-8.8 5-12.1 3.4-3.2 7.4-4.9 12.1-4.9z"/></svg>
             {/* Logo Supabase */}
             <svg width="35" height="35" viewBox="0 0 128 128" fill="#3ECF8E"><path d="M66.4 6.7c-3.1-1.8-6.9.4-6.9 4v46H27.1c-4.1 0-6.6 4.5-4.5 8l40.1 66.6c3.1 5.2 11.1 2.5 11.1-3.5V81.2h32.1c4.2 0 6.6-4.7 4.3-8.1L66.4 6.7z"/></svg>
             {/* Logo Tailwind */}
             <svg width="35" height="35" viewBox="0 0 128 128" fill="#38B2AC"><path d="M64 25.6c-17.1 0-25.6 8.5-25.6 25.6 0 12.8 8.5 17.1 12.8 25.6-8.5-4.3-12.8-12.8-12.8-25.6 0-17.1 17.1-25.6 25.6-25.6zM98.1 51.2c-17.1 0-25.6 8.5-25.6 25.6 0 12.8 8.5 17.1 12.8 25.6-8.5-4.3-12.8-12.8-12.8-25.6 0-17.1 17.1-25.6 25.6-25.6z"/></svg>
          </div>
        </div>

      </div>
    </div>
  );
}