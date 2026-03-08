import { supabase } from '@/lib/supabase';

// Instruksi agar Next.js selalu mengambil data terbaru (tidak di-cache selamanya)
export const revalidate = 0;

export default async function JurnalMingguan() {
  // Menarik data dari tabel 'jurnal' di Supabase, diurutkan dari yang terbaru
  const { data: jurnalList } = await supabase
    .from('jurnal')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Jurnal Mingguan</h1>
        <p className="text-zinc-400">Arsip laporan dan catatan mingguan dalam format PDF / Word.</p>
      </div>

      <div className="flex flex-col gap-4">
        {!jurnalList || jurnalList.length === 0 ? (
          <div className="p-6 border border-dashed border-zinc-800 rounded-xl text-center">
            <p className="text-zinc-500">Belum ada dokumen jurnal yang diunggah.</p>
          </div>
        ) : (
          jurnalList.map((jurnal) => (
            <a 
              key={jurnal.id} 
              href={jurnal.file_url} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 border border-zinc-800 bg-zinc-900/30 rounded-xl hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group"
            >
              {/* Ikon Dokumen */}
              <div className="bg-zinc-800 p-3 rounded-lg group-hover:bg-zinc-700 transition-colors">
                <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-white">{jurnal.judul}</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Diunggah pada: {new Date(jurnal.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}