import type { Metadata } from "next";
import PortfolioExplorer from "@/components/PortfolioExplorer";
import { isCertificate, type PortfolioItem } from "@/lib/content";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Karya",
  description: "Pilihan proyek web dan eksperimen digital Muhammad Zaky Mubarok.",
};

export const revalidate = 0;

export default async function PortfolioPage() {
  const { data } = await supabase
    .from("portofolio")
    .select("*")
    .order("created_at", { ascending: false });

  const items = ((data ?? []) as PortfolioItem[]).filter((item) => !isCertificate(item));

  return (
    <section className="page-intro section-pad page-shell pt-36 md:pt-44">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow">Selected archive / 2026</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.06em] text-gradient md:text-7xl">
            Karya yang mengubah ide menjadi pengalaman.
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-7 text-zinc-500 lg:pb-2">
          Kumpulan aplikasi, eksperimen antarmuka, dan solusi yang saya bangun sambil terus memperdalam engineering dan product thinking.
        </p>
      </div>

      <PortfolioExplorer items={items} />
    </section>
  );
}
