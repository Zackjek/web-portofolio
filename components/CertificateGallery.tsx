"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import PdfThumbnail from "@/components/PdfThumbnail";
import {
  getCertificateMeta,
  isPdfUrl,
  type PortfolioItem,
} from "@/lib/content";

export default function CertificateGallery({ items }: { items: PortfolioItem[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  const categories = useMemo(() => {
    const values = items.map((item) => getCertificateMeta(item).category).filter(Boolean);
    return ["Semua", ...Array.from(new Set(values))];
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const meta = getCertificateMeta(item);
      const searchable = `${item.judul} ${item.deskripsi ?? ""} ${meta.issuer} ${meta.year} ${meta.category}`.toLowerCase();
      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (activeCategory === "Semua" || meta.category === activeCategory)
      );
    });
  }, [activeCategory, items, query]);

  useEffect(() => {
    if (!selected) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selected]);

  return (
    <>
      <div className="mt-10 grid gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3 md:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#080d11] px-4 py-3">
          <svg className="h-4 w-4 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <span className="sr-only">Cari sertifikat</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari judul, penerbit, atau tahun..."
            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-700 focus:outline-none"
          />
        </label>
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.slice(0, 5).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-xl px-4 py-3 text-xs font-bold transition-all ${
                activeCategory === category ? "bg-lime-300 text-[#071005]" : "text-zinc-500 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => {
          const meta = getCertificateMeta(item);
          const pdf = isPdfUrl(item.gambar_url);

          return (
            <article key={item.id} className="glass-card interactive-card group rounded-[1.35rem] p-3">
              <button type="button" onClick={() => setSelected(item)} className="block w-full text-left">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#10171c]">
                  {pdf && item.gambar_url ? (
                    <PdfThumbnail url={item.gambar_url} title={item.judul} />
                  ) : item.gambar_url ? (
                    <img src={item.gambar_url} alt={item.judul} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="grid h-full place-items-center font-mono text-[10px] text-zinc-700">NO PREVIEW</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.15em] text-white backdrop-blur">
                    {meta.year || `CERT ${String(index + 1).padStart(2, "0")}`}
                  </span>
                  <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-lime-300 text-[#071005] opacity-0 transition-all group-hover:opacity-100">
                    +
                  </span>
                </div>
                <div className="px-2 pb-3 pt-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-lime-300">{meta.issuer}</p>
                  <h2 className="mt-2 line-clamp-2 text-lg font-black leading-6 tracking-tight text-white">{item.judul}</h2>
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-4">
                    <span className="text-xs text-zinc-600">{meta.category}</span>
                    <span className="text-xs font-bold text-zinc-500 transition-colors group-hover:text-white">Lihat detail ↗</span>
                  </div>
                </div>
              </button>
            </article>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-600">
            {items.length === 0 ? "Belum ada sertifikat yang diunggah" : "Sertifikat tidak ditemukan"}
          </p>
          {(query || activeCategory !== "Semua") && (
            <button type="button" onClick={() => { setQuery(""); setActiveCategory("Semua"); }} className="mt-4 text-sm font-bold text-lime-300">
              Reset pencarian
            </button>
          )}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-3 backdrop-blur-xl sm:p-6" role="dialog" aria-modal="true" aria-label={`Pratinjau ${selected.judul}`}>
          <button type="button" onClick={() => setSelected(null)} className="absolute inset-0 cursor-default" aria-label="Tutup pratinjau" />
          <div className="relative z-10 flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#0a1015] shadow-2xl lg:grid lg:grid-cols-[1fr_320px]">
            <div className="relative min-h-[45vh] bg-black lg:min-h-[75vh]">
              {isPdfUrl(selected.gambar_url) ? (
                <iframe src={`${selected.gambar_url}#toolbar=0&navpanes=0`} title={selected.judul} className="absolute inset-0 h-full w-full bg-white" />
              ) : selected.gambar_url ? (
                <div className="absolute inset-0 grid place-items-center overflow-auto p-4">
                  <img src={selected.gambar_url} alt={selected.judul} className="max-h-full max-w-full object-contain" />
                </div>
              ) : null}
            </div>
            <div className="flex max-h-[44vh] flex-col overflow-y-auto border-t border-white/10 p-6 lg:max-h-none lg:border-l lg:border-t-0">
              <button type="button" onClick={() => setSelected(null)} className="ml-auto grid h-9 w-9 place-items-center rounded-full border border-white/10 text-zinc-500 transition-colors hover:text-white" aria-label="Tutup">
                ×
              </button>
              <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.2em] text-lime-300">{getCertificateMeta(selected).issuer}</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white">{selected.judul}</h2>
              <p className="mt-5 text-sm leading-7 text-zinc-500">{selected.deskripsi || "Kredensial dan bukti pencapaian kompetensi."}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.08] p-3">
                  <p className="font-mono text-[8px] uppercase tracking-wider text-zinc-700">Tahun</p>
                  <p className="mt-1 text-sm font-bold text-white">{getCertificateMeta(selected).year || "—"}</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] p-3">
                  <p className="font-mono text-[8px] uppercase tracking-wider text-zinc-700">Kategori</p>
                  <p className="mt-1 text-sm font-bold text-white">{getCertificateMeta(selected).category}</p>
                </div>
              </div>
              <div className="mt-auto space-y-2 pt-8">
                {selected.gambar_url && (
                  <a href={selected.gambar_url} target="_blank" rel="noreferrer" className="flex w-full items-center justify-between rounded-xl bg-lime-300 px-4 py-3 text-sm font-black text-[#071005]">
                    Buka file asli <span>↗</span>
                  </a>
                )}
                {selected.link_proyek && (
                  <a href={selected.link_proyek} target="_blank" rel="noreferrer" className="flex w-full items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white">
                    Verifikasi kredensial <span>↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
