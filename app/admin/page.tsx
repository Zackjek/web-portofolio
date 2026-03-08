"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPanel() {
  const [tab, setTab] = useState<"jurnal" | "portofolio">("jurnal");
  
  // State Jurnal
  const [judulJurnal, setJudulJurnal] = useState("");
  const [fileJurnal, setFileJurnal] = useState<File | null>(null);

  // State Portofolio (Bisa Proyek / Sertifikat)
  const [judulPorto, setJudulPorto] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [teknologi, setTeknologi] = useState(""); // Sekarang opsional
  const [linkProyek, setLinkProyek] = useState(""); // Opsional
  const [fileMedia, setFileMedia] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  const handleUploadJurnal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulJurnal || !fileJurnal) return setPesan("⚠️ Judul dan file wajib diisi!");
    setLoading(true); setPesan("⏳ Mengunggah jurnal...");
    try {
      const namaBersih = fileJurnal.name.replace(/[^a-zA-Z0-9.\-]/g, '-');
      const namaFileUnik = `${Date.now()}-${namaBersih}`;
      const { error: uploadErr } = await supabase.storage.from("dokumen-jurnal").upload(namaFileUnik, fileJurnal);
      if (uploadErr) throw uploadErr;
      const { data: publicUrl } = supabase.storage.from("dokumen-jurnal").getPublicUrl(namaFileUnik);
      const { error: dbErr } = await supabase.from("jurnal").insert([{ judul: judulJurnal, file_url: publicUrl.publicUrl }]);
      if (dbErr) throw dbErr;
      setPesan("✅ Jurnal berhasil diunggah!");
      setJudulJurnal(""); setFileJurnal(null);
    } catch (err: any) {
      setPesan(`❌ Gagal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPorto = async (e: React.FormEvent) => {
    e.preventDefault();
    // Yang wajib sekarang cuma Judul, Deskripsi, dan File-nya
    if (!judulPorto || !deskripsi || !fileMedia) return setPesan("⚠️ Judul, Deskripsi, dan File wajib diisi!");
    setLoading(true); setPesan("⏳ Mengunggah data...");
    try {
      const namaBersih = fileMedia.name.replace(/[^a-zA-Z0-9.\-]/g, '-');
      const namaFileUnik = `${Date.now()}-${namaBersih}`;
      const { error: uploadErr } = await supabase.storage.from("gambar-portofolio").upload(namaFileUnik, fileMedia);
      if (uploadErr) throw uploadErr;
      const { data: publicUrl } = supabase.storage.from("gambar-portofolio").getPublicUrl(namaFileUnik);
      const { error: dbErr } = await supabase.from("portofolio").insert([{
        judul: judulPorto, deskripsi, teknologi, link_proyek: linkProyek, gambar_url: publicUrl.publicUrl
      }]);
      if (dbErr) throw dbErr;
      setPesan("✅ Data berhasil diunggah!");
      setJudulPorto(""); setDeskripsi(""); setTeknologi(""); setLinkProyek(""); setFileMedia(null);
    } catch (err: any) {
      setPesan(`❌ Gagal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Panel Admin</h1>
        <p className="text-zinc-400">Pilih menu untuk mengunggah konten baru.</p>
      </div>

      <div className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
        <button onClick={() => {setTab("jurnal"); setPesan("");}} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tab === "jurnal" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>Jurnal</button>
        <button onClick={() => {setTab("portofolio"); setPesan("");}} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tab === "portofolio" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>Portofolio / Sertifikat</button>
      </div>

      <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
        {tab === "jurnal" && (
          <form onSubmit={handleUploadJurnal} className="space-y-6">
            <div className="space-y-2"><label className="text-sm text-zinc-300">Judul Jurnal</label><input type="text" value={judulJurnal} onChange={(e) => setJudulJurnal(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white" /></div>
            <div className="space-y-2"><label className="text-sm text-zinc-300">File Dokumen (PDF/Word)</label><input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFileJurnal(e.target.files?.[0] || null)} className="w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-zinc-800 file:text-white cursor-pointer" /></div>
            <button type="submit" disabled={loading} className="w-full bg-white text-zinc-950 font-bold py-3 rounded-lg">{loading ? "Memproses..." : "Unggah Jurnal"}</button>
          </form>
        )}

        {tab === "portofolio" && (
          <form onSubmit={handleUploadPorto} className="space-y-4">
            <div className="space-y-2"><label className="text-sm text-zinc-300">Judul Proyek / Sertifikat</label><input type="text" value={judulPorto} onChange={(e) => setJudulPorto(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white" /></div>
            <div className="space-y-2"><label className="text-sm text-zinc-300">Deskripsi Lengkap</label><textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white h-24" /></div>
            <div className="space-y-2"><label className="text-sm text-zinc-300">Teknologi (Opsional - khusus coding)</label><input type="text" value={teknologi} onChange={(e) => setTeknologi(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white" /></div>
            <div className="space-y-2"><label className="text-sm text-zinc-300">Tautan Terkait (Opsional)</label><input type="text" value={linkProyek} onChange={(e) => setLinkProyek(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white" /></div>
            
            {/* INI YANG BERUBAH: Sekarang bisa terima Gambar DAN PDF */}
            <div className="space-y-2"><label className="text-sm text-zinc-300">File Media (Gambar atau PDF)</label><input type="file" accept="image/*,.pdf" onChange={(e) => setFileMedia(e.target.files?.[0] || null)} className="w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-zinc-800 file:text-white cursor-pointer" /></div>
            
            <button type="submit" disabled={loading} className="w-full bg-white text-zinc-950 font-bold py-3 rounded-lg mt-4">{loading ? "Memproses..." : "Unggah Data"}</button>
          </form>
        )}

        {pesan && <div className="p-3 mt-6 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-center text-zinc-300">{pesan}</div>}
      </div>
    </div>
  );
}