export type PortfolioItem = {
  id: string | number;
  judul: string;
  deskripsi: string | null;
  teknologi: string | null;
  link_proyek: string | null;
  gambar_url: string | null;
  created_at: string;
};

export type JournalItem = {
  id: string | number;
  judul: string;
  konten: string | null;
  created_at: string;
};

export const CERTIFICATE_MARKER = "SERTIFIKAT";

export function getTags(value: string | null | undefined) {
  return (value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function isPdfUrl(url: string | null | undefined) {
  if (!url) return false;
  return /\.pdf(?:$|[?#])/i.test(url);
}

export function isCertificate(item: Pick<PortfolioItem, "judul" | "teknologi" | "gambar_url">) {
  const tags = getTags(item.teknologi);
  return (
    tags.some((tag) => tag.toUpperCase() === CERTIFICATE_MARKER) ||
    item.judul.toLowerCase().includes("sertifikat") ||
    isPdfUrl(item.gambar_url)
  );
}

export function getCertificateMeta(item: Pick<PortfolioItem, "teknologi">) {
  const tags = getTags(item.teknologi).filter(
    (tag) => tag.toUpperCase() !== CERTIFICATE_MARKER,
  );
  const year = tags.find((tag) => /^(19|20)\d{2}$/.test(tag)) ?? "";
  const details = tags.filter((tag) => tag !== year);

  return {
    issuer: details[0] ?? "Penerbit terverifikasi",
    category: details[1] ?? "Kompetensi",
    year,
  };
}

export function stripHtml(html: string | null | undefined) {
  if (!html) return "Belum ada ringkasan.";

  let text = html
    .replace(/<(style|script|xml)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/(?:v|o|w)\\?:\*\s*\{[^}]*\}/gi, " ")
    .replace(/\.shape\s*\{[^}]*\}/gi, " ")
    .replace(/table\.MsoNormalTable\s*\{[^}]*\}/gi, " ")
    .replace(/\/\*\s*Style Definitions\s*\*\//gi, " ")
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (
    /behavior\s*:\s*url|mso-|MsoNormal|Style Definitions|\bNormal\s+0\s+false/i.test(
      text,
    )
  ) {
    const meaningfulStart = [
      text.search(/Ringkasan Aktivitas/i),
      text.search(/Capaian (?:Minggu|Utama)/i),
      text.search(/(?:^|\s)1(?:️)?\s*(?:⃣|️⃣)/u),
    ].filter((index) => index >= 0);

    if (meaningfulStart.length > 0) {
      text = text.slice(Math.min(...meaningfulStart));
    }
  }

  return text || "Belum ada ringkasan.";
}

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(new Date(date));
}
