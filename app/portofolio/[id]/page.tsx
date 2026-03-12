import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function DetailPortofolio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: proyek } = await supabase.from('portofolio').select('*').eq('id', id).single();

  if (!proyek) return <div className="p-20 text-center text-zinc-400">Data tidak ditemukan.</div>;
  const isPdf = proyek.gambar_url?.toLowerCase().includes('.pdf');

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 animate-in fade-in duration-500">
      <Link href="/portofolio" className="text-zinc-500 hover:text-white mb-8 inline-block font-medium">&larr; Kembali ke Portofolio</Link>
      
      <h1 className="text-4xl md:text-5xl font-black text-white mb-6">{proyek.judul}</h1>
      
      {proyek.teknologi && (
        <div className="flex flex-wrap gap-2 text-sm text-zinc-300 font-medium mb-10">
          {proyek.teknologi.split(',').map((tech: string, i: number) => (
            <span key={i} className="bg-zinc-800/80 border border-zinc-700 px-3 py-1.5 rounded-lg">{tech.trim()}</span>
          ))}
        </div>
      )}

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden mb-10 shadow-2xl">
        {isPdf ? (
          <div className="p-20 text-center flex flex-col items-center">
            <svg className="w-24 h-24 text-zinc-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            <a href={proyek.gambar_url} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white text-zinc-950 font-bold rounded-xl transition-all hover:scale-105 inline-block">Lihat Dokumen Sertifikat</a>
          </div>
        ) : (
          <img src={proyek.gambar_url} alt={proyek.judul} className="w-full h-auto object-cover" />
        )}
      </div>

      <div className="mb-12">
        <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-lg">{proyek.deskripsi}</p>
      </div>

      {proyek.link_proyek && (
        <a href={proyek.link_proyek} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors border border-zinc-700 hover:border-zinc-500">
          Kunjungi Tautan Proyek <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </a>
      )}
    </div>
  );
}