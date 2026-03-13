import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import ShareButton from '@/components/ShareButton';

export default async function DetailJurnal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: jurnal } = await supabase.from('jurnal').select('*').eq('id', id).single();

  if (!jurnal) return <div className="p-20 text-center text-zinc-400">Tulisan tidak ditemukan.</div>;

  return (
    <div className="max-w-3xl mx-auto py-16 px-6 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center mb-10">
        <Link href="/jurnal" className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-2">
          &larr; Kembali
        </Link>
        <ShareButton path={`/jurnal/${jurnal.id}`} title={jurnal.judul} />
      </div>

      <article className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
        <header className="mb-10 border-b border-zinc-800 pb-8">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{jurnal.judul}</h1>
          <p className="text-zinc-500 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {new Date(jurnal.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </header>
        
        {/* INI BAGIAN UTAMA BLOGNYA */}
        <div className="prose prose-invert prose-emerald max-w-none text-zinc-300 leading-loose text-lg whitespace-pre-wrap">
          {jurnal.konten ? jurnal.konten : <span className="italic text-zinc-600">Jurnal ini tidak memiliki konten teks.</span>}
        </div>
      </article>

    </div>
  );
}