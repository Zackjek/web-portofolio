import { supabase } from '@/lib/supabase';
import ShareButton from '@/components/ShareButton';

export const revalidate = 0;

export default async function Jurnal() {
  const { data: jurnalList } = await supabase
    .from('jurnal')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out py-10 px-4 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Jurnal Mingguan</h1>
        <p className="text-zinc-400">Arsip laporan dan catatan mingguan dalam format PDF / Word.</p>
      </div>

      <div className="space-y-4">
        {!jurnalList || jurnalList.length === 0 ? (
          <div className="p-6 border border-dashed border-zinc-800 rounded-xl text-center">
            <p className="text-zinc-500">Belum ada jurnal yang diunggah.</p>
          </div>
        ) : (
          jurnalList.map((jurnal) => (
            // scroll-mt-24 supaya pas diklik link-nya, posisinya tidak tertutup navbar atas
            <div key={jurnal.id} id={`item-${jurnal.id}`} className="flex items-center justify-between p-4 border border-zinc-800 bg-zinc-900/30 rounded-xl hover:border-zinc-600 transition-all group relative scroll-mt-24">
              
              {/* Link file asli */}
              <a href={jurnal.file_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10"></a>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-800/50 rounded-lg text-zinc-400 group-hover:text-emerald-400 group-hover:bg-zinc-800 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-200 group-hover:text-white transition-colors">{jurnal.judul}</h2>
                  <p className="text-sm text-zinc-500">Diunggah pada: {new Date(jurnal.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Panggil Tombol Share */}
              <div className="relative z-20">
                <ShareButton section="jurnal" id={jurnal.id} title={jurnal.judul} />
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}