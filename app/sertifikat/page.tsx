import type { Metadata } from "next";
import CertificateGallery from "@/components/CertificateGallery";
import { isCertificate, type PortfolioItem } from "@/lib/content";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Sertifikat",
  description: "Galeri sertifikat, pelatihan, dan pencapaian Muhammad Zaky Mubarok.",
};

export const revalidate = 0;

export default async function CertificatePage() {
  const { data } = await supabase
    .from("portofolio")
    .select("*")
    .order("created_at", { ascending: false });

  const certificates = ((data ?? []) as PortfolioItem[]).filter(isCertificate);

  return (
    <section className="page-intro section-pad page-shell pt-36 md:pt-44">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.62fr] lg:items-end">
        <div>
          <p className="eyebrow">Credentials vault</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.06em] text-gradient md:text-7xl">
            Bukti dari proses belajar yang nyata.
          </h1>
        </div>
        <div className="summary-panel border border-white/[0.08] p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">Verified archive</span>
            <span className="flex items-center gap-2 text-xs font-bold text-lime-300">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-300 pulse-dot" />
              {certificates.length} kredensial
            </span>
          </div>
          <p className="mt-5 text-sm leading-7 text-zinc-500">
            Klik setiap kartu untuk melihat gambar resolusi penuh atau membaca dokumen PDF tanpa meninggalkan halaman.
          </p>
        </div>
      </div>

      <CertificateGallery items={certificates} />
    </section>
  );
}
