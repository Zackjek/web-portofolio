import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import { formatDate } from "@/lib/content";
import { supabase } from "@/lib/supabase";

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: journal } = await supabase
    .from("jurnal")
    .select("*")
    .eq("id", id)
    .single();

  if (!journal) {
    return (
      <div className="page-shell grid min-h-screen place-items-center pt-24 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-600">404 / Entry not found</p>
          <Link href="/jurnal" className="mt-5 inline-block text-sm font-bold text-lime-300">Kembali ke jurnal</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="section-pad page-shell pt-32 md:pt-40">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/jurnal" className="group inline-flex items-center gap-2 text-xs font-bold text-zinc-500 transition-colors hover:text-white">
            <span className="transition-transform group-hover:-translate-x-1">←</span> Semua jurnal
          </Link>
          <ShareButton path={`/jurnal/${journal.id}`} title={journal.judul} />
        </div>

        <header className="pb-12 pt-14 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-lime-300/20 bg-lime-300/[0.07] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-lime-300">
              Learning log
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-600">
              {formatDate(journal.created_at, { weekday: "long" })}
            </span>
          </div>
          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-[1.03] tracking-[-0.055em] text-gradient md:text-6xl">
            {journal.judul}
          </h1>
          <div className="mx-auto mt-9 flex w-max items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-lime-300 font-mono text-[10px] font-black text-[#071005]">ZM</span>
            <span className="text-left">
              <span className="block text-xs font-bold text-white">Muhammad Zaky Mubarok</span>
              <span className="block text-[10px] text-zinc-600">Mahasiswa Informatika</span>
            </span>
          </div>
        </header>

        <article className="glass-card rounded-[1.7rem] p-6 md:p-12">
          <div
            className="prose prose-invert prose-lg max-w-none overflow-x-auto prose-headings:tracking-tight prose-headings:text-white prose-p:leading-8 prose-p:text-zinc-400 prose-a:text-lime-300 prose-strong:text-white"
            dangerouslySetInnerHTML={{
              __html:
                journal.konten ||
                "<p class='italic text-zinc-600'>Jurnal ini belum memiliki konten.</p>",
            }}
          />
        </article>

        <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-sm font-bold text-white">Menemukan sesuatu yang menarik?</p>
            <p className="mt-1 text-xs text-zinc-600">Bagikan catatan ini ke temanmu.</p>
          </div>
          <ShareButton path={`/jurnal/${journal.id}`} title={journal.judul} />
        </div>
      </div>
    </section>
  );
}
