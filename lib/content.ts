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

const certificateCategoryTranslations: Record<string, string> = {
  pelatihan: "Training",
  kompetisi: "Competition",
  konferensi: "Conference",
  organisasi: "Organization",
  akademik: "Academic",
  lainnya: "Other",
  kompetensi: "Professional Development",
};

function translateCertificateCategory(category: string) {
  return certificateCategoryTranslations[category.toLowerCase()] ?? category;
}

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
    item.judul.toLowerCase().includes("certificate") ||
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
    issuer: details[0] ?? "Verified issuer",
    category: translateCertificateCategory(details[1] ?? "Professional Development"),
    year,
  };
}

export function getCertificateDescription(
  item: Pick<PortfolioItem, "deskripsi">,
) {
  const description = item.deskripsi?.trim() ?? "";
  const legacyDescription = description.match(
    /^Sertifikat\s+(.+?)\s+yang diterbitkan oleh\s+(.+?)\.?$/i,
  );

  if (legacyDescription) {
    return `${legacyDescription[1]}, issued by ${legacyDescription[2]}.`;
  }

  return (
    description ||
    "A verified credential demonstrating professional development and achievement."
  );
}

export function localizeJournalTitle(title: string) {
  return title.replace(
    /^Jurnal\s+Minggu\s+Ke\s+(\d+)$/i,
    "Weekly Journal — Week $1",
  );
}

const legacyJournalTranslations: Array<[RegExp, string]> = [
  [/Ringkasan Aktivitas Mingguan/gi, "Weekly Activity Summary"],
  [/Capaian Minggu Ini/gi, "This Week's Achievements"],
  [/Progress terhadap Target Semester/gi, "Progress Toward Semester Goals"],
  [/Kendala Mingguan/gi, "Weekly Challenges"],
  [/Evaluasi Diri/gi, "Self-Evaluation"],
  [/Rencana Minggu Depan/gi, "Plan for Next Week"],
  [/Tuliskan pencapaian utama\s*:?/gi, "Key achievements:"],
  [/Target Semester\s*:?/gi, "Semester goal:"],
  [/Progress saat ini\s*:?/gi, "Current progress:"],
  [/Keterangan\s*:?/gi, "Notes:"],
  [/Jawab reflektif\s*:?/gi, "Reflection:"],
  [/Apa keberhasilan terbaik minggu ini\?/gi, "What was this week's biggest success?"],
  [/Apa kesalahan terbesar\?/gi, "What was the biggest mistake?"],
  [/Apa strategi minggu depan\?/gi, "What is the strategy for next week?"],
  [/Ingin mendapat Nilai A di semua matkul, dan paham semua materi/gi, "Earn an A in every course and understand all of the material"],
  [/Saya ingin lulus tepat waktu tapi juga ada ilmu yang saya bawa Ketika lulus/gi, "I want to graduate on time while retaining meaningful knowledge I can carry forward"],
  [/Menyelesaikan laprak secara langsung Ketika dikasih/gi, "Complete lab reports as soon as they are assigned"],
  [/Menyelesaikan Proker Bem yang berkelanjutan dengan baik/gi, "Continue completing BEM work programs effectively"],
  [/Tidak ada tugas selama lebaran \(maksudnya memastikan semuanya telah selesai dikerjakan\)/gi, "Have no outstanding assignments during Eid by completing everything beforehand"],
  [/Menyelesaikan kuis dan mendapatkan nilai/gi, "Completed the quiz and received a grade"],
  [/Mendapat Sertifikat Course Huawei/gi, "Earned a Huawei Course certificate"],
  [/Mengikuti mata kuliah DKA praktikum/gi, "Attended the DKA lab session"],
  [/Dapet materi/gi, "Received course material"],
  [/(\d+)\s+jam\s+setengah/gi, "$1.5 hours"],
  [/Mengikuti Matkul online dengan baik/gi, "Participate fully in online classes"],
  [/Mengikuti Matkul dengan baik/gi, "Participate fully in classes"],
  [/Membuat Web blog buat upload jurnal/gi, "Build a blog for publishing journal entries"],
  [/Laprak Selesai dengan baik/gi, "Lab reports completed successfully"],
  [/UTS Selesai dengan baik/gi, "Midterms completed successfully"],
  [/Menyelesaaikan tugas kuliah dengan baik/gi, "Coursework completed successfully"],
  [/Kuliah masuk semua/gi, "Attended all classes"],
  [/Organisasi aman/gi, "Organizational responsibilities on track"],
  [/Proker aman/gi, "Work programs on track"],
  [/Pengmas aman/gi, "Community service responsibilities on track"],
  [/Menunda Laprak/gi, "Delaying lab reports"],
  [/Lebih disiplin lagi/gi, "Be more disciplined"],
  [/\(Disiplin\)/gi, "(Discipline)"],
  [/\(Belum ada\)/gi, "(None yet)"],
  [/Presentasi Tubes DKA/gi, "DKA final project presentation"],
  [/Presentasi Tubes Jarkom/gi, "Computer Networks final project presentation"],
  [/Mengikuti Mata kuliah DKA Teori (?:&|&amp;|dan) praktikum/gi, "Attended DKA theory and lab sessions"],
  [/Mengikuti UTS Mata kuliah DKA Teori dan praktikum/gi, "Completed DKA theory and lab midterms"],
  [/Mengikuti UTS mata kuliah strategi algoritma/gi, "Completed the Algorithm Strategy midterm"],
  [/Mengikuti UTS mata kuliah JARKOM teori/gi, "Completed the Computer Networks theory midterm"],
  [/Mengikuti mata kuliah strategi algoritma/gi, "Attended Algorithm Strategy class"],
  [/Mengikuti matkul strategi algoritma/gi, "Attended Algorithm Strategy class"],
  [/Mengikuti mata kuliah JARKOM teori dan praktikum/gi, "Attended Computer Networks theory and lab sessions"],
  [/m?engikuti mata kuliah JARKOM praktikum/gi, "Attended the Computer Networks lab"],
  [/Mengikuti mata kuliah jarkom/gi, "Attended Computer Networks class"],
  [/Mengikuti matkul WGTIK dan PBO teori/gi, "Attended WGTIK and OOP theory classes"],
  [/Ikut matkul wgtik dan PBO/gi, "Attended WGTIK and OOP classes"],
  [/Mengikuti Kuliah Tamu WGTIK/gi, "Attended a WGTIK guest lecture"],
  [/Mengikuti kegiatan Pengmas/gi, "Participated in community service activities"],
  [/Mengerjakan Kursus Huawei Advanced/gi, "Completed the Huawei Advanced course"],
  [/Mengerjakan course Huawei wgtik/gi, "Completed the Huawei WGTIK course"],
  [/Mengerjakan Kuis PBO/gi, "Completed the OOP quiz"],
  [/Mengerjakan Laporan Mingguan wgtik/gi, "Completed the WGTIK weekly report"],
  [/Mengerjakan semua laprak Jarkom/gi, "Completed all Computer Networks lab reports"],
  [/Mengedit dan membuat desain sertifikat/gi, "Edited and designed a certificate"],
  [/Ngelaprak PBO \+ DKA/gi, "Completed OOP and DKA lab reports"],
  [/Ngelaprak Jarkom/gi, "Completed the Computer Networks lab report"],
  [/Ngelaprak DKA/gi, "Completed the DKA lab report"],
  [/Ngelaprak PBO/gi, "Completed the OOP lab report"],
  [/Presentasi IMK/gi, "HCI presentation"],
  [/Meet WGTIK/gi, "WGTIK meeting"],
  [/Rapat Internal Divisi BEM/gi, "BEM division internal meeting"],
  [/Rapat Kerja BEM/gi, "BEM work meeting"],
  [/Mengikuti mata kuliah/gi, "Attended classes"],
  [/Tidak ada Keigiatan Support Kuliah/gi, "No academic support activities"],
  [/Tidak Ada aktivitas support kuliah/gi, "No academic support activities"],
  [/Tidak ada aktivitas support kuliah/gi, "No academic support activities"],
  [/Terpilih menjadi Penanggung Jawab Proker/gi, "Selected as the work program lead"],
  [/Menjadi Penanggung Jawab Proker/gi, "Served as the work program lead"],
  [/Mendapatkan evidence Pengmas/gi, "Collected community service evidence"],
  [/Mendapat Nilai UTS/gi, "Received a midterm grade"],
  [/Mendapat nilai UTS/gi, "Received a midterm grade"],
  [/Materi tersampaikan/gi, "Presentation delivered"],
  [/Mendapat materi (?:&|&amp;|dan) laprak/gi, "Received course material and lab assignments"],
  [/Mendapat laprak/gi, "Received a lab assignment"],
  [/Mendapat materi/gi, "Received course material"],
  [/Laprak Jadi/gi, "Lab report completed"],
  [/Laprak jadi/gi, "Lab report completed"],
  [/Jurnal Mingguan/gi, "Weekly Journal"],
  [/Alhamdulillah selesai semua/gi, "Thank God, everything was completed"],
  [/Minggu ke-(\d+)/gi, "Week $1"],
  [/\bSenin\b/gi, "Monday"],
  [/\bSelasa\b/gi, "Tuesday"],
  [/\bRabu\b/gi, "Wednesday"],
  [/\bKamis\b/gi, "Thursday"],
  [/\bJumat\b/gi, "Friday"],
  [/\bHari\b/g, "Day"],
  [/Fokus Aktivitas/gi, "Activity Focus"],
  [/\bDurasi \(jam\)/gi, "Duration (hours)"],
  [/\bAkademik\b/gi, "Academic"],
  [/\bTeknis\b/gi, "Technical"],
  [/\bPribadi\b/gi, "Personal"],
  [/\bSertifikat\b/gi, "Certificate"],
  [/\bNilai\b/gi, "Grade"],
  [/\bMateri\b/gi, "Course material"],
  [/\bpraktikum\b/gi, "lab session"],
  [/\bmenit\b/gi, "minutes"],
  [/\bjam\b/gi, "hours"],
  [/\bhari\b/gi, "days"],
  [/\b1 hours\b/gi, "1 hour"],
];

export function localizeJournalHtml(html: string | null | undefined) {
  if (!html) return html ?? "";

  const plainText = stripHtml(html);

  return legacyJournalTranslations.reduce(
    (localized, [pattern, replacement]) =>
      localized.replace(pattern, replacement),
    plainText,
  );
}

function sanitizeJournalHtml(html: string) {
  return html
    .replace(/<(style|script|xml)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?(?:v|o|w|m):[^>]*>/gi, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatJournalHtml(html: string | null | undefined) {
  if (!html) return "";

  const isLegacyIndonesianJournal =
    /Ringkasan Aktivitas Mingguan|Capaian Minggu Ini|Progress terhadap Target Semester/i.test(
      html,
    );

  if (!isLegacyIndonesianJournal) {
    return sanitizeJournalHtml(html);
  }

  const localized = localizeJournalHtml(html).replace(
    /[1-6]\uFE0F?\s*\u20E3/gu,
    "",
  );
  const sectionPattern =
    /(Weekly Activity Summary\s*\(\s*Week\s+\d+\s*\)|This Week's Achievements|Progress Toward Semester Goals|Weekly Challenges|Self-Evaluation|Plan for Next Week)/g;
  const sections = localized.split(sectionPattern);

  if (sections.length < 3) {
    return `<p>${escapeHtml(localized)}</p>`;
  }

  let output = "";
  for (let index = 1; index < sections.length; index += 2) {
    const title = sections[index];
    const content = sections[index + 1]?.trim() ?? "";

    if (title.startsWith("Weekly Activity Summary")) {
      const week = title.match(/Week\s+\d+/)?.[0] ?? "";
      const activityText = content.replace(
        /^Day\s+Activity Focus\s+Output\s+Duration \(hours\)\s*/i,
        "",
      );
      const dayParts = activityText.split(
        /\b(Monday|Tuesday|Wednesday|Thursday|Friday)\b/g,
      );

      output += `<h2>Weekly Activity Summary</h2>`;
      if (week) output += `<p><strong>${escapeHtml(week)}</strong></p>`;

      for (
        let dayIndex = 1;
        dayIndex < dayParts.length;
        dayIndex += 2
      ) {
        const day = dayParts[dayIndex];
        const activity = dayParts[dayIndex + 1]?.trim() ?? "";
        output += `<p><strong>${day}</strong><br>${escapeHtml(activity)}</p>`;
      }
      continue;
    }

    const formattedContent = escapeHtml(content)
      .replace(
        /\s*•\s*Target\s+(\d+):\s*/g,
        "<br><strong>Target $1:</strong> ",
      )
      .replace(/\s*•\s*/g, "<br>• ")
      .replace(
        /\s*(Target\s+\d+):\s*/g,
        "<br><strong>$1:</strong> ",
      )
      .replace(/^<br>/, "");
    output += `<h2>${escapeHtml(title)}</h2><p>${formattedContent}</p>`;
  }

  return output;
}

export function stripHtml(html: string | null | undefined) {
  if (!html) return "No summary available yet.";

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

  return text || "No summary available yet.";
}

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(new Date(date));
}
