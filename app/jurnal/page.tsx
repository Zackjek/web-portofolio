import type { Metadata } from "next";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import { formatDate, stripHtml, type JournalItem } from "@/lib/content";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Jurnal",
  description: "Catatan belajar, eksperimen, dan perjalanan Muhammad Zaky Mubarok.",
};

export const revalidate = 0;

export default async function JournalPage() {
  const { data } = await supabase
    .from("jurnal")
    .select("*")
    .order("created_at", { ascending: false });

  const journals = (data ?? []) as JournalItem[];

  return (
    <section className="page-intro section-pad page-shell pt-36 md:pt-44">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
        <div>
          <p className="eyebrow">Notes from the process</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.06em] text-gradient md:text-7xl">
            Belajar lebih dalam dengan menuliskannya.
          </h1>
        </div>
        <p className="max-w-md text-sm leading-7 text-zinc-500">
          Dokumentasi rutin tentang hal yang saya bangun, kesalahan yang saya temui, dan pelajaran yang layak disimpan.
        </p>
      </div>

      <div className="mt-14">
        {journals.length > 0 ? (
          <div className="divide-y divide-white/[0.09] border-y border-white/[0.09]">
            {journals.map((journal, index) => (
              <article key={journal.id} className="journal-row group relative grid gap-5 py-7 md:grid-cols-[4rem_1fr_auto] md:items-center md:py-9">
                <span className="font-mono text-[10px] tracking-[0.16em] text-zinc-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Link href={`/jurnal/${journal.id}`} className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-white/[0.08] px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider text-zinc-600">
                      Weekly log
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-700">
                      {formatDate(journal.created_at)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black tracking-[-0.035em] text-zinc-200 transition-colors group-hover:text-lime-300 md:text-3xl">
                    {journal.judul}
                  </h2>
                  <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-7 text-zinc-600">
                    {stripHtml(journal.konten)}
                  </p>
                </Link>
                <div className="relative z-10 flex items-center gap-3">
                  <ShareButton path={`/jurnal/${journal.id}`} title={journal.judul} />
                  <Link href={`/jurnal/${journal.id}`} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-600 transition-all group-hover:border-lime-300/30 group-hover:bg-lime-300 group-hover:text-[#202127]" aria-label={`Baca ${journal.judul}`}>
                    ↗
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-600">Jurnal pertama sedang disiapkan</p>
          </div>
        )}
      </div>
    </section>
  );
}
