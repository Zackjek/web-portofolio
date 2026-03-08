"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPanel() {
  const [judul, setJudul] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pengecekan awal
    if (!judul || !file) {
      setPesan("⚠️ Judul dan file wajib diisi!");
      return;
    }

    setLoading(true);
    setPesan("⏳ Sedang mengunggah... Mohon tunggu.");

    try {
      // 1. Upload File ke Supabase Storage (dengan pembersihan nama file)
      const namaBersih = file.name.replace(/[^a-zA-Z0-9.\-]/g, '-');
      const namaFileUnik = `${Date.now()}-${namaBersih}`;
      
      const { error: uploadError } = await supabase.storage
        .from("dokumen-jurnal")
        .upload(namaFileUnik, file);

      if (uploadError) throw uploadError;

      // 2. Ambil Link Publik dari file yang baru diupload
      const { data: publicUrlData } = supabase.storage
        .from("dokumen-jurnal")
        .getPublicUrl(namaFileUnik);

      // 3. Simpan Judul dan Link File ke Database (Tabel: jurnal)
      const { error: dbError } = await supabase
        .from("jurnal")
        .insert([
          { judul: judul, file_url: publicUrlData.publicUrl }
        ]);

      if (dbError) throw dbError;

      // Jika sukses semua
      setPesan("✅ Jurnal berhasil diunggah!");
      setJudul(""); // Kosongkan form teks
      setFile(null); // Kosongkan form file
      
    } catch (error: any) {
      setPesan(`❌ Gagal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Panel Admin</h1>
        <p className="text-zinc-400">Unggah jurnal mingguan baru ke database.</p>
      </div>

      <form onSubmit={handleUpload} className="space-y-6 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
        
        {/* Input Judul */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Judul Jurnal</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Misal: Laporan Minggu Ke-1"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-zinc-500"
          />
        </div>

        {/* Input File */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">File Dokumen (PDF/Word)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
          />
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-zinc-950 font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Mengunggah..." : "Unggah Jurnal"}
        </button>

        {/* Pesan Sukses / Error */}
        {pesan && (
          <div className="p-3 mt-4 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-center text-zinc-300">
            {pesan}
          </div>
        )}

      </form>
    </div>
  );
}