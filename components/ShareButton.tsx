"use client";
import { useState } from "react";

export default function ShareButton({ section, id, title }: { section: string, id: number, title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah klik tembus ke file aslinya
    
    // Bikin link spesifik menuju kotak elemen ini
    const url = `${window.location.origin}/${section}#item-${id}`;
    
    try {
      // Fitur share bawaan HP (iOS/Android)
      if (navigator.share && /mobile/i.test(navigator.userAgent)) {
        await navigator.share({ title: `Lihat ${title} dari Zaky`, url });
      } else {
        // Kalau di laptop, copy link ke clipboard
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Gagal membagikan link", err);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="p-2.5 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 rounded-lg transition-all flex items-center gap-2 text-sm font-medium z-20 relative bg-zinc-900/50 border border-zinc-800"
      title="Bagikan Tautan"
    >
      {copied ? (
        <span className="text-emerald-400">Tersalin!</span>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          <span className="hidden sm:inline">Bagikan</span>
        </>
      )}
    </button>
  );
}