import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function DetailJurnal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: jurnal } = await supabase.from('jurnal').select('*').eq('id', id).single();

  if (!jurnal) return <div className="p-20 text-center text-zinc-400">Jurnal tidak ditemukan.</div>;

  return (
    <div className="max-w-3xl mx-auto py-20 px-6 animate-in fade-in duration-500">
      <Link href="/jurnal" className="text-zinc-500 hover:text-white mb-8 inline-block font-medium">&larr; Kembali ke Daftar Jurnal</Link>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 md:p-12 text-center shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{jurnal.judul}</h1>
        <p className="text-zinc-500 mb-10">Diunggah pada: {new Date(jurnal.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        
        <svg className="w-24 h-24 text-zinc-700 mx-auto mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        
        <a href={jurnal.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-200 font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Buka File Dokumen
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </div>
    </div>
  );
}