"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useMemo, useState } from "react";
import { getTags, type PortfolioItem } from "@/lib/content";

export default function PortfolioExplorer({ items }: { items: PortfolioItem[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const tags = useMemo(() => {
    const allTags = items.flatMap((item) => getTags(item.teknologi));
    return ["All", ...Array.from(new Set(allTags)).slice(0, 8)];
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const searchable = `${item.judul} ${item.deskripsi ?? ""} ${item.teknologi ?? ""}`.toLowerCase();
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesTag = activeTag === "All" || getTags(item.teknologi).includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [activeTag, items, query]);

  return (
    <div>
      <div className="filter-shell mt-10 flex flex-col gap-4 border border-white/[0.08] p-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#080d11] px-4 py-3">
          <svg className="h-4 w-4 shrink-0 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <span className="sr-only">Search work</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects or technologies..."
            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-700 focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="text-xs text-zinc-600 hover:text-white" aria-label="Clear search">
              ×
            </button>
          )}
        </label>
        <p className="px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600">
          {String(filteredItems.length).padStart(2, "0")} works
        </p>
      </div>

      {tags.length > 1 && (
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {tags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                activeTag === tag
                  ? "bg-lime-300 text-[#202127]"
                  : "border border-white/[0.08] bg-white/[0.025] text-zinc-500 hover:border-white/20 hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {filteredItems.map((item, index) => (
          <article
            key={item.id}
            className={`glass-card interactive-card color-card organic-card group p-3 ${
              index % 5 === 0 && filteredItems.length > 2 ? "md:col-span-2" : ""
            }`}
          >
            <Link href={`/portofolio/${item.id}`} className={`grid h-full ${index % 5 === 0 && filteredItems.length > 2 ? "md:grid-cols-[1.15fr_0.85fr]" : ""}`}>
              <div className={`dark-media relative overflow-hidden rounded-xl bg-[#10171c] ${index % 5 === 0 && filteredItems.length > 2 ? "aspect-[16/10] md:aspect-auto md:min-h-[360px]" : "aspect-[16/10]"}`}>
                {item.gambar_url ? (
                  <img
                    src={item.gambar_url}
                    alt={item.judul}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
                  />
                ) : (
                  <div className="grid h-full place-items-center font-mono text-[10px] tracking-widest text-zinc-700">NO PREVIEW</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70" />
                <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-zinc-200 backdrop-blur-lg">
                  Work / {String(index + 1).padStart(2, "0")}
                </span>
                <span className="absolute bottom-4 right-4 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-lime-300 text-[#202127] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  ↗
                </span>
              </div>

              <div className="flex flex-col p-4 pb-5 pt-6 md:p-7">
                <div className="flex items-start justify-between gap-5">
                  <h2 className="text-xl font-black tracking-tight text-white md:text-2xl">{item.judul}</h2>
                  <span className="mt-1 text-zinc-700 transition-colors group-hover:text-lime-300">↗</span>
                </div>
                <p className="mt-4 line-clamp-3 text-sm leading-7 text-zinc-500">{item.deskripsi}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  {getTags(item.teknologi).slice(0, 5).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/[0.08] px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-600">No matching work found</p>
          <button type="button" onClick={() => { setQuery(""); setActiveTag("All"); }} className="mt-4 text-sm font-bold text-lime-300">
            Reset search
          </button>
        </div>
      )}
    </div>
  );
}
