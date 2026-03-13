import { supabase } from '@/lib/supabase';
import ShareButton from '@/components/ShareButton';
import Link from 'next/link';

export const revalidate = 0;

// Fungsi untuk membersihkan kode HTML biar gak bocor di tampilan preview
const stripHtml = (html: string) => {
  if (!html) return "Tidak ada konten.";
  return html.replace(/<[^>]*>?/gm, '');
};

export default async function Jurnal() {
  const { data: jurnalList } = await supabase
    .from('jurnal')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out py-10 px-4 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Blog Jurnal Mingguan</h1>
        <p className="text-zinc-400">Catatan dan laporan mingguan yang ditulis secara langsung.</p>
      </div>

      <div className="space-y-4">
        {!jurnalList || jurnalList.length === 0 ? (
          <div className="p-6 border border-dashed border-zinc-800 rounded-xl text-center">
            <p className="text-zinc-500">Belum ada tulisan jurnal yang diterbitkan.</p>
          </div>
        ) : (
          jurnalList.map((jurnal) => (
            <div key={jurnal.id} id={`item-${jurnal.id}`} className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-zinc-800 bg-zinc-900/30 rounded-xl hover:border-zinc-600 transition-all group relative scroll-mt-24 gap-4">
              
              <Link href={`/jurnal/${jurnal.id}`} className="absolute inset-0 z-10"></Link>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold text-zinc-200 group-hover:text-white transition-colors mb-1">{jurnal.judul}</h2>
                <p className="text-sm text-zinc-500 mb-3">Diterbitkan pada: {new Date(jurnal.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                
                {/* Menampilkan cuplikan isi blog yang sudah bersih dari tag HTML tabel */}
                <p className="text-zinc-400 text-sm line-clamp-2">
                  {stripHtml(jurnal.konten)}
                </p>
              </div>

              <div className="relative z-20 shrink-0 self-start md:self-center">
                <ShareButton path={`/jurnal/${jurnal.id}`} title={jurnal.judul} />
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}