export default function Portofolio() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Portofolio</h1>
        <p className="text-zinc-400">Beberapa proyek yang sedang dan sudah saya kembangkan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Proyek 1: Mangkat */}
        <div className="flex flex-col border border-zinc-800 bg-zinc-900/30 p-6 rounded-xl hover:border-zinc-600 transition-all">
          <h2 className="text-xl font-semibold text-white mb-2">Mangkat</h2>
          <p className="text-zinc-400 text-sm mb-6 flex-grow">
            Aplikasi full-stack Gym & Calorie Tracker. Membantu mencatat progres latihan beban, pola diet, dan kalori harian.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-zinc-300 font-medium">
            <span className="bg-zinc-800/80 px-2.5 py-1 rounded-md">Next.js</span>
            <span className="bg-zinc-800/80 px-2.5 py-1 rounded-md">Go</span>
            <span className="bg-zinc-800/80 px-2.5 py-1 rounded-md">Supabase</span>
          </div>
        </div>

        {/* Proyek 2: Sparrow Bot */}
        <div className="flex flex-col border border-zinc-800 bg-zinc-900/30 p-6 rounded-xl hover:border-zinc-600 transition-all">
          <h2 className="text-xl font-semibold text-white mb-2">Sparrow Premium Bot</h2>
          <p className="text-zinc-400 text-sm mb-6 flex-grow">
            Toko otomatis di Telegram (@Sparrow_Premium_bot) untuk manajemen layanan akun, terintegrasi langsung dengan payment gateway.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-zinc-300 font-medium">
            <span className="bg-zinc-800/80 px-2.5 py-1 rounded-md">Telegram API</span>
            <span className="bg-zinc-800/80 px-2.5 py-1 rounded-md">Xoftware</span>
          </div>
        </div>

      </div>
    </div>
  );
}