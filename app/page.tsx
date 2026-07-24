/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  formatDate,
  isCertificate,
  type JournalItem,
  type PortfolioItem,
  stripHtml,
} from "@/lib/content";

const stack = ["NEXT.JS", "TYPESCRIPT", "SUPABASE", "GO", "TAILWIND CSS", "POSTGRESQL"];

export const revalidate = 0;

export default async function Home() {
  const [{ data: portfolioData }, { data: journalData }] = await Promise.all([
    supabase.from("portofolio").select("*").order("created_at", { ascending: false }),
    supabase.from("jurnal").select("*").order("created_at", { ascending: false }),
  ]);

  const portfolio = (portfolioData ?? []) as PortfolioItem[];
  const journals = (journalData ?? []) as JournalItem[];
  const projects = portfolio.filter((item) => !isCertificate(item));
  const certificates = portfolio.filter(isCertificate);

  return (
    <>
      <section className="relative min-h-screen overflow-hidden pt-32 md:pt-40">
        <div className="page-shell grid items-center gap-14 pb-20 lg:grid-cols-[1.16fr_0.84fr] lg:gap-20">
          <div className="relative z-10">
            <div className="eyebrow reveal-up">Web developer • Informatics student</div>
            <h1 className="display-title text-gradient mt-7 reveal-up delay-1">
              I build digital things that <span className="accent-gradient">feel alive.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-zinc-400 reveal-up delay-2 md:text-lg">
              Halo, saya <strong className="font-semibold text-zinc-100">Muhammad Zaky Mubarok</strong>.
              Saya merancang dan membangun produk web yang cepat, intuitif, dan enak dipandang—dari ide
              pertama sampai siap digunakan.
            </p>

            <div className="mt-10 flex flex-wrap gap-3 reveal-up delay-3">
              <Link
                href="/portofolio"
                className="group inline-flex items-center gap-3 rounded-full bg-lime-300 px-6 py-3.5 text-sm font-black text-[#071005] transition-all hover:scale-[1.03] hover:bg-lime-200"
              >
                Lihat karya pilihan
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <a
                href="https://wa.me/6282138057177"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.035] px-6 py-3.5 text-sm font-bold text-white transition-all hover:border-white/30 hover:bg-white/[0.07]"
              >
                Hubungi saya
                <span className="text-zinc-500">↗</span>
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-7 border-t border-white/[0.08] pt-7 text-xs font-semibold text-zinc-500 reveal-up delay-3">
              <a href="https://github.com/Zackjek" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-white">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
              <a href="https://www.instagram.com/mzakkyy_" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-white">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-300 pulse-dot" />
                Jakarta, Indonesia
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-10 rounded-full bg-cyan-300/[0.05] blur-3xl" />
            <div className="glass-card float-slow relative mx-auto aspect-[4/5] max-w-[420px] overflow-hidden rounded-[2rem] p-3">
              <div className="relative h-full overflow-hidden rounded-[1.45rem] bg-[#10171c]">
                <Image
                  src="/fotokuy.png"
                  alt="Muhammad Zaky Mubarok"
                  fill
                  priority
                  sizes="(max-width: 1024px) 420px, 38vw"
                  className="object-cover object-top grayscale-[18%] transition duration-700 hover:scale-[1.03] hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b0e] via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime-300">Currently exploring</p>
                      <p className="mt-2 text-lg font-bold tracking-tight text-white">Better systems. Better interfaces.</p>
                    </div>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-black/30 backdrop-blur">
                      <svg className="h-4 w-4 text-lime-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m7 17 10-10M8 7h9v9" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card absolute -left-3 top-[18%] rounded-2xl px-4 py-3 shadow-2xl sm:-left-10">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">Status</p>
              <p className="mt-1 flex items-center gap-2 text-xs font-bold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-300 pulse-dot" />
                Open to collaborate
              </p>
            </div>

            <div className="glass-card absolute -bottom-5 right-0 grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-2xl sm:-right-6">
              {[
                [String(projects.length).padStart(2, "0"), "Projects"],
                [String(certificates.length).padStart(2, "0"), "Credentials"],
                [String(journals.length).padStart(2, "0"), "Notes"],
              ].map(([value, label]) => (
                <div key={label} className="px-4 py-3 text-center sm:px-5">
                  <p className="text-lg font-black text-white">{value}</p>
                  <p className="font-mono text-[8px] uppercase tracking-wider text-zinc-600">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-y border-white/[0.08] bg-black/10 py-5">
          <div className="overflow-hidden">
            <div className="marquee-track flex items-center">
              {[...stack, ...stack].map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-center">
                  <span className="px-7 font-mono text-[11px] font-bold tracking-[0.18em] text-zinc-500">{item}</span>
                  <span className="text-lime-300/60">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad page-shell" id="about">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="eyebrow">What I do</p>
            <h2 className="mt-6 text-3xl font-black tracking-[-0.045em] text-white md:text-4xl">
              Dari masalah nyata menjadi produk yang mudah dipakai.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                number: "01",
                title: "Frontend engineering",
                copy: "Antarmuka responsif dengan detail interaksi yang halus, aksesibel, dan tetap cepat.",
              },
              {
                number: "02",
                title: "Backend & data",
                copy: "API, autentikasi, storage, dan database yang dirancang rapi untuk tumbuh bersama produk.",
              },
              {
                number: "03",
                title: "Product thinking",
                copy: "Tidak berhenti di kode—saya memikirkan alur, prioritas, dan pengalaman pengguna secara utuh.",
              },
              {
                number: "04",
                title: "Continuous learning",
                copy: "Eksperimen dan dokumentasi rutin agar setiap proyek menjadi pijakan untuk hasil berikutnya.",
              },
            ].map((service) => (
              <article key={service.number} className="glass-card interactive-card min-h-52 rounded-2xl p-6">
                <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-lime-300">{service.number}</span>
                <h3 className="mt-12 text-xl font-bold tracking-tight text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">{service.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-white/[0.07] bg-white/[0.018]">
        <div className="page-shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">Karya terbaru.</h2>
            </div>
            <Link href="/portofolio" className="group inline-flex items-center gap-2 text-sm font-bold text-zinc-300 transition-colors hover:text-lime-300">
              Lihat semua karya
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.length > 0 ? (
              projects.slice(0, 3).map((project, index) => (
                <Link
                  key={project.id}
                  href={`/portofolio/${project.id}`}
                  className={`glass-card interactive-card group rounded-2xl p-3 ${index === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#10171c]">
                    {project.gambar_url ? (
                      <img src={project.gambar_url} alt={project.judul} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="grid h-full place-items-center font-mono text-xs text-zinc-700">NO PREVIEW</div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white backdrop-blur-md">
                      Project 0{index + 1}
                    </span>
                  </div>
                  <div className="p-3 pb-4 pt-5">
                    <h3 className="text-lg font-bold text-white">{project.judul}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">{project.deskripsi}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="glass-card col-span-full rounded-2xl p-10 text-center text-sm text-zinc-500">
                Karya terbaru akan segera tampil di sini.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-pad page-shell">
        <div className="grid overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#0b1217] lg:grid-cols-[1fr_0.85fr]">
          <div className="relative p-8 md:p-12 lg:p-16">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-lime-300/[0.07] blur-3xl" />
            <div className="relative">
              <p className="eyebrow">Verified growth</p>
              <h2 className="mt-6 max-w-xl text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">
                Setiap sertifikat adalah jejak proses belajar.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400">
                Galeri kredensial berisi pelatihan, kompetisi, dan pencapaian yang bisa dibuka langsung dalam
                format gambar maupun PDF.
              </p>
              <Link href="/sertifikat" className="mt-9 inline-flex items-center gap-3 rounded-full border border-lime-300/30 bg-lime-300/[0.08] px-5 py-3 text-sm font-bold text-lime-200 transition-all hover:bg-lime-300/15">
                Buka galeri sertifikat <span>↗</span>
              </Link>
            </div>
          </div>
          <div className="grid min-h-[310px] place-items-center border-t border-white/[0.08] bg-[radial-gradient(circle_at_center,rgba(71,215,232,0.11),transparent_60%)] p-8 lg:border-l">
            <div className="relative grid h-56 w-56 place-items-center rounded-full border border-dashed border-white/20">
              <div className="absolute inset-5 rounded-full border border-white/[0.08]" />
              <div className="text-center">
                <p className="text-7xl font-black tracking-[-0.07em] text-white">{String(certificates.length).padStart(2, "0")}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-lime-300">Credentials</p>
              </div>
              <span className="absolute right-2 top-8 grid h-11 w-11 place-items-center rounded-full bg-lime-300 font-black text-[#071005]">✓</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-white/[0.07]">
        <div className="page-shell">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="eyebrow">Learning log</p>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">Catatan dari proses.</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-500">
                Dokumentasi mingguan tentang eksperimen, tantangan, dan hal yang saya pelajari.
              </p>
            </div>
            <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {journals.length > 0 ? (
                journals.slice(0, 3).map((journal, index) => (
                  <Link key={journal.id} href={`/jurnal/${journal.id}`} className="group grid gap-4 py-6 sm:grid-cols-[3rem_1fr_auto] sm:items-center">
                    <span className="font-mono text-[10px] text-zinc-600">0{index + 1}</span>
                    <div>
                      <h3 className="font-bold text-zinc-200 transition-colors group-hover:text-lime-300">{journal.judul}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">{stripHtml(journal.konten)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-600">{formatDate(journal.created_at, { month: "short" })}</span>
                      <span className="text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-lime-300">→</span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="py-10 text-sm text-zinc-600">Catatan pertama sedang disiapkan.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell pb-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-lime-300/20 bg-lime-300 px-7 py-12 text-[#071005] md:px-12 md:py-16">
          <div className="absolute -right-10 -top-24 text-[15rem] font-black leading-none text-black/[0.055]">Z</div>
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em]">Have an idea?</p>
              <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.055em] md:text-6xl">Mari bikin sesuatu yang berguna.</h2>
            </div>
            <a href="https://wa.me/6282138057177" target="_blank" rel="noreferrer" className="inline-flex w-max items-center gap-3 rounded-full bg-[#071005] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]">
              Mulai percakapan <span className="text-lime-300">↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
