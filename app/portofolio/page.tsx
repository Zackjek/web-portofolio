import { supabase } from '@/lib/supabase';
import ShareButton from '@/components/ShareButton';

export const revalidate = 0;

export default async function Portofolio() {
  const { data: proyekList } = await supabase
    .from('portofolio')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out py-10 px-4 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Portofolio & Pencapaian</h1>
        <p className="text-zinc-400">Kumpulan proyek aplikasi, sertifikat, dan pencapaian lainnya.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!proyekList || proyekList.length === 0 ? (
          <div className="col-span-1 md:col-span-2 p-6 border border-dashed border-zinc-800 rounded-xl text-center">
            <p className="text-zinc-500">Belum ada data yang diunggah.</p>
          </div>
        ) : (
          proyekList.map((proyek) => {
            const isPdf = proyek.gambar_url?.toLowerCase().includes('.pdf');

            return (
              <div key={proyek.id} id={`item-${proyek.id}`} className="flex flex-col border border-zinc-800 bg-zinc-900/30 rounded-xl overflow-hidden hover:border-zinc-600 transition-all group relative scroll-mt-24">
                
                <div className="h-48 w-full bg-zinc-800 relative overflow-hidden flex items-center justify-center">
                  {isPdf ? (
                    <div className="flex flex-col items-center justify-center text-zinc-400 group-hover:text-emerald-400 transition-colors">
                      <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-sm">Dokumen Sertifikat (PDF)</span>
                      <a href={proyek.gambar_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10"></a>
                    </div>
                  ) : (
                    <img 
                      src={proyek.gambar_url} 
                      alt={proyek.judul} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow relative">
                  
                  {/* Panggil Tombol Share di pojok kanan atas teks */}
                  <div className="absolute top-4 right-4 z-20">
                    <ShareButton section="portofolio" id={proyek.id} title={proyek.judul} />
                  </div>

                  {/* Kasih jarak pr-20 supaya judul tidak nabrak tombol share */}
                  <h2 className="text-xl font-semibold text-white mb-2 pr-20">{proyek.judul}</h2>
                  
                  <p className="text-zinc-400 text-sm mb-6 flex-grow whitespace-pre-wrap">{proyek.deskripsi}</p>
                  
                  {proyek.teknologi && (
                    <div className="flex flex-wrap gap-2 text-xs text-zinc-300 font-medium mb-4">
                      {proyek.teknologi.split(',').map((tech: string, i: number) => (
                        <span key={i} className="bg-zinc-800/80 px-2.5 py-1 rounded-md">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {proyek.link_proyek && (
                    <a href={proyek.link_proyek} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 z-20 relative w-max">
                      Kunjungi Tautan &rarr;
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}