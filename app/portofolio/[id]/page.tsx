/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import { getTags, isPdfUrl } from "@/lib/content";
import { supabase } from "@/lib/supabase";

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: project } = await supabase
    .from("portofolio")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    return (
      <div className="page-shell grid min-h-screen place-items-center pt-24 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-600">404 / Work not found</p>
          <Link href="/portofolio" className="mt-5 inline-block text-sm font-bold text-lime-300">Kembali ke karya</Link>
        </div>
      </div>
    );
  }

  const pdf = isPdfUrl(project.gambar_url);

  return (
    <section className="section-pad page-shell pt-32 md:pt-40">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/portofolio" className="group inline-flex items-center gap-2 text-xs font-bold text-zinc-500 transition-colors hover:text-white">
          <span className="transition-transform group-hover:-translate-x-1">←</span> Kembali ke karya
        </Link>
        <ShareButton path={`/portofolio/${project.id}`} title={project.judul} />
      </div>

      <header className="grid gap-8 py-14 lg:grid-cols-[1fr_0.52fr] lg:items-end">
        <div>
          <p className="eyebrow">Project case / {String(project.id).padStart(2, "0")}</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.06em] text-gradient md:text-7xl">
            {project.judul}
          </h1>
        </div>
        <div>
          <p className="text-sm leading-7 text-zinc-500">{project.deskripsi}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {getTags(project.teknologi).map((tag: string) => (
              <span key={tag} className="rounded-full border border-white/[0.09] px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="dark-media overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-[#0a1015] shadow-2xl">
        {pdf ? (
          <div className="grid min-h-[65vh] place-items-center p-8 text-center">
            <div>
              <svg className="mx-auto h-20 w-20 text-lime-300/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
                <path d="M7 3h7l4 4v14H7z" />
                <path d="M14 3v5h5M9.5 15h5M9.5 18h3.5" />
              </svg>
              <h2 className="mt-6 text-2xl font-black text-white">Dokumen PDF</h2>
              <a href={project.gambar_url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-3 rounded-full bg-lime-300 px-6 py-3 text-sm font-black text-[#202127]">
                Buka dokumen <span>↗</span>
              </a>
            </div>
          </div>
        ) : project.gambar_url ? (
          <img src={project.gambar_url} alt={project.judul} className="h-auto w-full object-cover" />
        ) : (
          <div className="grid min-h-[50vh] place-items-center font-mono text-xs text-zinc-700">NO PREVIEW AVAILABLE</div>
        )}
      </div>

      <div className="grid gap-8 border-b border-white/[0.08] py-14 lg:grid-cols-[0.45fr_1fr]">
        <p className="eyebrow h-max">About the project</p>
        <div>
          <p className="whitespace-pre-wrap text-lg leading-9 text-zinc-400">{project.deskripsi}</p>
          {project.link_proyek && (
            <a href={project.link_proyek} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-3 rounded-full border border-lime-300/25 bg-lime-300/[0.07] px-5 py-3 text-sm font-bold text-lime-300 transition hover:bg-lime-300/[0.13]">
              Kunjungi proyek <span>↗</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
