import type { Metadata } from "next";
import PortfolioExplorer from "@/components/PortfolioExplorer";
import { isCertificate, type PortfolioItem } from "@/lib/content";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "A selection of web projects and digital experiments by Muhammad Zaky Mubarok.",
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
            Work that turns ideas into experiences.
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-7 text-zinc-500 lg:pb-2">
          A collection of applications, interface experiments, and practical
          solutions built while continuously sharpening my engineering and
          product thinking.
        </p>
      </div>

      <PortfolioExplorer items={items} />
    </section>
  );
}
