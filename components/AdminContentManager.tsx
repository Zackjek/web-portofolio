"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  CERTIFICATE_MARKER,
  formatDate,
  getCertificateMeta,
  isCertificate,
  isPdfUrl,
  stripHtml,
  type JournalItem,
  type PortfolioItem,
} from "@/lib/content";
import { supabase } from "@/lib/supabase";
import { removeMedia, uploadMedia } from "@/lib/storage";

type ContentKind = "semua" | "sertifikat" | "portofolio" | "jurnal";

type ManagedItem =
  | {
      kind: "sertifikat" | "portofolio";
      data: PortfolioItem;
    }
  | {
      kind: "jurnal";
      data: JournalItem;
    };

type EditDraft =
  | {
      kind: "sertifikat";
      title: string;
      description: string;
      issuer: string;
      year: string;
      category: string;
      link: string;
      replacementFile: File | null;
    }
  | {
      kind: "portofolio";
      title: string;
      description: string;
      technologies: string;
      link: string;
      replacementFile: File | null;
    }
  | {
      kind: "jurnal";
      title: string;
      content: string;
    };

const fieldClass =
  "w-full rounded-xl border border-white/[0.09] bg-[#080d11] px-4 py-3 text-sm text-white placeholder:text-zinc-700 transition focus:border-lime-300/50 focus:outline-none";

const kindLabel: Record<Exclude<ContentKind, "semua">, string> = {
  sertifikat: "Sertifikat",
  portofolio: "Karya",
  jurnal: "Jurnal",
};

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Terjadi kesalahan yang tidak diketahui.";
}

function itemTitle(item: ManagedItem) {
  return item.data.judul;
}

function itemDate(item: ManagedItem) {
  return item.data.created_at;
}

function itemKey(item: ManagedItem) {
  return `${item.kind}-${item.data.id}`;
}

function itemSummary(item: ManagedItem) {
  if (item.kind === "jurnal") return stripHtml(item.data.konten);
  if (item.kind === "sertifikat") {
    const meta = getCertificateMeta(item.data);
    return `${meta.issuer} • ${meta.category}${meta.year ? ` • ${meta.year}` : ""}`;
  }
  return item.data.deskripsi || "Belum ada deskripsi proyek.";
}

function itemHref(item: ManagedItem) {
  if (item.kind === "jurnal") return `/jurnal/${item.data.id}`;
  if (item.kind === "portofolio") return `/portofolio/${item.data.id}`;
  return item.data.gambar_url || "/sertifikat";
}

function ContentThumbnail({ item }: { item: ManagedItem }) {
  if (item.kind === "jurnal") {
    return (
      <div className="accent-radial grid h-full place-items-center">
        <svg
          className="h-9 w-9 text-lime-300/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M9 10h6M9 14h6M9 18h4" />
        </svg>
      </div>
    );
  }

  if (isPdfUrl(item.data.gambar_url)) {
    return (
      <div className="accent-radial grid h-full place-items-center">
        <span className="font-mono text-xs font-black tracking-[0.16em] text-lime-300/75">
          PDF
        </span>
      </div>
    );
  }

  if (item.data.gambar_url) {
    return (
      <img
        src={item.data.gambar_url}
        alt=""
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="grid h-full place-items-center font-mono text-[8px] uppercase tracking-wider text-zinc-700">
      No media
    </div>
  );
}

function EditContentModal({
  item,
  saving,
  actionError,
  onClose,
  onSave,
}: {
  item: ManagedItem;
  saving: boolean;
  actionError: string;
  onClose: () => void;
  onSave: (draft: EditDraft) => void;
}) {
  const portfolioItem = item.kind === "jurnal" ? null : item.data;
  const certificateMeta =
    item.kind === "sertifikat" ? getCertificateMeta(item.data) : null;
  const editorRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState(item.data.judul);
  const [description, setDescription] = useState(
    portfolioItem?.deskripsi ?? "",
  );
  const [technologies, setTechnologies] = useState(
    item.kind === "portofolio" ? item.data.teknologi ?? "" : "",
  );
  const [link, setLink] = useState(portfolioItem?.link_proyek ?? "");
  const [issuer, setIssuer] = useState(certificateMeta?.issuer ?? "");
  const [year, setYear] = useState(certificateMeta?.year ?? "");
  const [category, setCategory] = useState(
    certificateMeta?.category ?? "Pelatihan",
  );
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (item.kind === "jurnal" && editorRef.current) {
      editorRef.current.innerHTML = item.data.konten ?? "";
    }
  }, [item]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setValidationMessage("Judul wajib diisi.");
      return;
    }

    if (replacementFile) {
      const validType =
        item.kind === "sertifikat"
          ? replacementFile.type.startsWith("image/") ||
            replacementFile.type === "application/pdf"
          : replacementFile.type.startsWith("image/");

      if (!validType) {
        setValidationMessage(
          item.kind === "sertifikat"
            ? "File pengganti harus berupa gambar atau PDF."
            : "Cover pengganti harus berupa gambar.",
        );
        return;
      }

      if (replacementFile.size > 20 * 1024 * 1024) {
        setValidationMessage("Ukuran file pengganti maksimal 20 MB.");
        return;
      }
    }

    if (item.kind === "jurnal") {
      const content = editorRef.current?.innerHTML.trim() ?? "";
      if (!content) {
        setValidationMessage("Isi jurnal wajib diisi.");
        return;
      }
      onSave({ kind: "jurnal", title: title.trim(), content });
      return;
    }

    if (!description.trim()) {
      setValidationMessage("Deskripsi wajib diisi.");
      return;
    }

    if (item.kind === "sertifikat") {
      if (!issuer.trim() || !year.trim() || !category.trim()) {
        setValidationMessage("Penerbit, tahun, dan kategori wajib diisi.");
        return;
      }
      onSave({
        kind: "sertifikat",
        title: title.trim(),
        description: description.trim(),
        issuer: issuer.trim(),
        year: year.trim(),
        category: category.trim(),
        link: link.trim(),
        replacementFile,
      });
      return;
    }

    onSave({
      kind: "portofolio",
      title: title.trim(),
      description: description.trim(),
      technologies: technologies.trim(),
      link: link.trim(),
      replacementFile,
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[120] grid place-items-center bg-black/85 p-3 backdrop-blur-xl sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${item.data.judul}`}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={saving ? undefined : onClose}
        aria-label="Tutup editor"
      />
      <form
        onSubmit={submit}
        className="relative z-10 max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/12 bg-[#0a1015] p-5 shadow-2xl md:p-7"
      >
        <div className="flex items-start justify-between gap-6 border-b border-white/[0.08] pb-5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-lime-300">
              Edit {kindLabel[item.kind]}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
              Perbarui konten
            </h2>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-500 transition hover:text-white disabled:opacity-40"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <label className="block space-y-2">
            <span className="text-xs font-bold text-zinc-400">Judul *</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={fieldClass}
            />
          </label>

          {item.kind === "jurnal" ? (
            <label className="block space-y-2">
              <span className="flex items-center justify-between gap-3 text-xs font-bold text-zinc-400">
                <span>Isi jurnal *</span>
                <span className="rounded-full bg-lime-300/10 px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-lime-300">
                  Rich text
                </span>
              </span>
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className={`${fieldClass} prose prose-invert max-h-[26rem] min-h-64 max-w-none overflow-y-auto`}
              />
            </label>
          ) : (
            <>
              <label className="block space-y-2">
                <span className="text-xs font-bold text-zinc-400">
                  Deskripsi *
                </span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className={`${fieldClass} min-h-28 resize-y`}
                />
              </label>

              {item.kind === "sertifikat" ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-xs font-bold text-zinc-400">
                      Penerbit *
                    </span>
                    <input
                      value={issuer}
                      onChange={(event) => setIssuer(event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400">
                      Tahun *
                    </span>
                    <input
                      value={year}
                      onChange={(event) => setYear(event.target.value)}
                      inputMode="numeric"
                      className={fieldClass}
                    />
                  </label>
                  <label className="space-y-2 md:col-span-3">
                    <span className="text-xs font-bold text-zinc-400">
                      Kategori *
                    </span>
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className={fieldClass}
                    >
                      <option>Pelatihan</option>
                      <option>Kompetisi</option>
                      <option>Konferensi</option>
                      <option>Organisasi</option>
                      <option>Akademik</option>
                      <option>Lainnya</option>
                    </select>
                  </label>
                </div>
              ) : (
                <label className="block space-y-2">
                  <span className="text-xs font-bold text-zinc-400">
                    Teknologi
                  </span>
                  <input
                    value={technologies}
                    onChange={(event) => setTechnologies(event.target.value)}
                    className={fieldClass}
                    placeholder="Next.js, Supabase, TypeScript"
                  />
                </label>
              )}

              <label className="block space-y-2">
                <span className="text-xs font-bold text-zinc-400">
                  {item.kind === "sertifikat"
                    ? "Tautan verifikasi"
                    : "Tautan proyek"}
                </span>
                <input
                  type="url"
                  value={link}
                  onChange={(event) => setLink(event.target.value)}
                  className={fieldClass}
                  placeholder="https://..."
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold text-zinc-400">
                  Ganti {item.kind === "sertifikat" ? "file" : "cover"}
                  <span className="ml-1 font-normal text-zinc-700">
                    (opsional)
                  </span>
                </span>
                <input
                  type="file"
                  accept={
                    item.kind === "sertifikat"
                      ? "image/png,image/jpeg,image/webp,application/pdf"
                      : "image/*"
                  }
                  onChange={(event) =>
                    setReplacementFile(event.target.files?.[0] ?? null)
                  }
                  className="block w-full rounded-xl border border-white/[0.09] bg-[#080d11] p-3 text-xs text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-white/[0.08] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white"
                />
                {replacementFile && (
                  <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-600">
                    {replacementFile.name} •{" "}
                    {(replacementFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </label>
            </>
          )}
        </div>

        {validationMessage && (
          <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-sm text-red-200">
            {validationMessage}
          </p>
        )}
        {actionError && (
          <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-sm text-red-200">
            {actionError}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-zinc-400 transition hover:text-white disabled:opacity-40"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-lime-300 px-5 py-3 text-sm font-black text-[#202127] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Menyimpan perubahan..." : "Simpan perubahan"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}

function DeleteContentModal({
  item,
  phrase,
  deleting,
  actionError,
  onPhraseChange,
  onClose,
  onDelete,
}: {
  item: ManagedItem;
  phrase: string;
  deleting: boolean;
  actionError: string;
  onPhraseChange: (value: string) => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  const confirmed = phrase.trim().toUpperCase() === "HAPUS";

  return createPortal(
    <div
      className="fixed inset-0 z-[130] grid place-items-center bg-black/90 p-4 backdrop-blur-xl"
      role="alertdialog"
      aria-modal="true"
      aria-label={`Hapus ${item.data.judul}`}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={deleting ? undefined : onClose}
        aria-label="Batal menghapus"
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-red-400/20 bg-[#0d1013] p-6 shadow-2xl md:p-8">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-red-400/20 bg-red-400/[0.08] text-xl text-red-300">
          !
        </span>
        <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.18em] text-red-300">
          Penghapusan permanen
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
          Hapus {kindLabel[item.kind]} ini?
        </h2>
        <p className="mt-4 text-sm leading-7 text-zinc-500">
          <span className="font-bold text-zinc-300">“{item.data.judul}”</span>{" "}
          akan dihapus dari database
          {item.kind !== "jurnal"
            ? " beserta file medianya di penyimpanan"
            : ""}
          . Tindakan ini tidak dapat dibatalkan.
        </p>

        <label className="mt-6 block space-y-2">
          <span className="text-xs font-bold text-zinc-400">
            Ketik <span className="text-red-300">HAPUS</span> untuk melanjutkan
          </span>
          <input
            value={phrase}
            onChange={(event) => onPhraseChange(event.target.value)}
            autoComplete="off"
            className={`${fieldClass} border-red-400/15 focus:border-red-300/50`}
            placeholder="HAPUS"
          />
        </label>

        {actionError && (
          <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-sm text-red-200">
            {actionError}
          </p>
        )}

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={deleting}
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-zinc-400 transition hover:text-white disabled:opacity-40"
          >
            Batalkan
          </button>
          <button
            type="button"
            disabled={!confirmed || deleting}
            onClick={onDelete}
            className="rounded-xl bg-red-400 px-5 py-3 text-sm font-black text-[#190606] transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {deleting ? "Sedang menghapus..." : "Hapus permanen"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function AdminContentManager({
  refreshKey,
}: {
  refreshKey: number;
}) {
  const [items, setItems] = useState<ManagedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ContentKind>("semua");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<ManagedItem | null>(null);
  const [deleting, setDeleting] = useState<ManagedItem | null>(null);
  const [deletePhrase, setDeletePhrase] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingNow, setDeletingNow] = useState(false);

  const loadContent = useCallback(async (quiet = false) => {
    if (quiet) setReloading(true);
    else setLoading(true);
    setError("");

    try {
      const [portfolioResult, journalResult] = await Promise.all([
        supabase
          .from("portofolio")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("jurnal")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (portfolioResult.error) throw portfolioResult.error;
      if (journalResult.error) throw journalResult.error;

      const portfolioItems = (portfolioResult.data ?? []).map((data) => ({
        kind: isCertificate(data as PortfolioItem)
          ? ("sertifikat" as const)
          : ("portofolio" as const),
        data: data as PortfolioItem,
      }));
      const journalItems = (journalResult.data ?? []).map((data) => ({
        kind: "jurnal" as const,
        data: data as JournalItem,
      }));

      setItems(
        [...portfolioItems, ...journalItems].sort(
          (a, b) =>
            new Date(itemDate(b)).getTime() - new Date(itemDate(a)).getTime(),
        ),
      );
    } catch (loadError) {
      setError(`Gagal memuat konten: ${errorMessage(loadError)}`);
    } finally {
      setLoading(false);
      setReloading(false);
    }
  }, []);

  useEffect(() => {
    void loadContent();
  }, [loadContent, refreshKey]);

  useEffect(() => {
    if (!editing && !deleting) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || saving || deletingNow) return;
      setEditing(null);
      setDeleting(null);
      setDeletePhrase("");
      setError("");
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [deleting, deletingNow, editing, saving]);

  const counts = useMemo(
    () => ({
      semua: items.length,
      sertifikat: items.filter((item) => item.kind === "sertifikat").length,
      portofolio: items.filter((item) => item.kind === "portofolio").length,
      jurnal: items.filter((item) => item.kind === "jurnal").length,
    }),
    [items],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== "semua" && item.kind !== filter) return false;
      if (!normalizedQuery) return true;

      const haystack =
        item.kind === "jurnal"
          ? `${item.data.judul} ${stripHtml(item.data.konten)}`
          : `${item.data.judul} ${item.data.deskripsi ?? ""} ${
              item.data.teknologi ?? ""
            }`;
      return haystack.toLowerCase().includes(normalizedQuery);
    });
  }, [filter, items, query]);

  const saveContent = async (draft: EditDraft) => {
    if (!editing) return;
    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editing.kind === "jurnal" && draft.kind === "jurnal") {
        const { data, error: updateError } = await supabase
          .from("jurnal")
          .update({ judul: draft.title, konten: draft.content })
          .eq("id", editing.data.id)
          .select("*")
          .single();

        if (updateError) throw updateError;

        const updated: ManagedItem = {
          kind: "jurnal",
          data: data as JournalItem,
        };
        setItems((current) =>
          current.map((item) =>
            itemKey(item) === itemKey(editing) ? updated : item,
          ),
        );
        setEditing(null);
        setNotice(`Jurnal “${draft.title}” berhasil diperbarui.`);
        return;
      }

      if (
        editing.kind !== "jurnal" &&
        (draft.kind === "portofolio" || draft.kind === "sertifikat")
      ) {
        let nextMediaUrl = editing.data.gambar_url;
        let uploadedUrl: string | null = null;

        if (draft.replacementFile) {
          const uploaded = await uploadMedia(
            draft.replacementFile,
            draft.kind === "sertifikat" ? "certificates" : "projects",
          );
          nextMediaUrl = uploaded.publicUrl;
          uploadedUrl = uploaded.publicUrl;
        }

        const payload =
          draft.kind === "sertifikat"
            ? {
                judul: draft.title,
                deskripsi: draft.description,
                teknologi: [
                  CERTIFICATE_MARKER,
                  draft.issuer,
                  draft.year,
                  draft.category,
                ].join(", "),
                link_proyek: draft.link || null,
                gambar_url: nextMediaUrl,
              }
            : {
                judul: draft.title,
                deskripsi: draft.description,
                teknologi: draft.technologies,
                link_proyek: draft.link || null,
                gambar_url: nextMediaUrl,
              };

        const { data, error: updateError } = await supabase
          .from("portofolio")
          .update(payload)
          .eq("id", editing.data.id)
          .select("*")
          .single();

        if (updateError) {
          if (uploadedUrl) await removeMedia(uploadedUrl);
          throw updateError;
        }

        let cleanupWarning = "";
        if (uploadedUrl && editing.data.gambar_url) {
          const cleanup = await removeMedia(editing.data.gambar_url);
          if (cleanup.error) {
            cleanupWarning =
              " Data sudah diperbarui, tetapi file lama gagal dibersihkan.";
          }
        }

        const updated: ManagedItem = {
          kind: draft.kind,
          data: data as PortfolioItem,
        };
        setItems((current) =>
          current.map((item) =>
            itemKey(item) === itemKey(editing) ? updated : item,
          ),
        );
        setEditing(null);
        setNotice(
          `${kindLabel[draft.kind]} “${draft.title}” berhasil diperbarui.${cleanupWarning}`,
        );
      }
    } catch (saveError) {
      setError(`Gagal menyimpan perubahan: ${errorMessage(saveError)}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async () => {
    if (!deleting || deletePhrase.trim().toUpperCase() !== "HAPUS") return;
    setDeletingNow(true);
    setError("");
    setNotice("");

    try {
      const table = deleting.kind === "jurnal" ? "jurnal" : "portofolio";
      const { data, error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq("id", deleting.data.id)
        .select("id");

      if (deleteError) throw deleteError;
      if (!data || data.length === 0) {
        throw new Error(
          "Tidak ada data yang terhapus. Periksa izin DELETE pada policy Supabase.",
        );
      }

      let cleanupWarning = "";
      if (deleting.kind !== "jurnal" && deleting.data.gambar_url) {
        const cleanup = await removeMedia(deleting.data.gambar_url);
        if (cleanup.error) {
          cleanupWarning =
            " Record sudah terhapus, tetapi file medianya gagal dibersihkan.";
        }
      }

      const deletedKey = itemKey(deleting);
      const deletedTitle = deleting.data.judul;
      const deletedKind = deleting.kind;
      setItems((current) =>
        current.filter((item) => itemKey(item) !== deletedKey),
      );
      setDeleting(null);
      setDeletePhrase("");
      setNotice(
        `${kindLabel[deletedKind]} “${deletedTitle}” berhasil dihapus.${cleanupWarning}`,
      );
    } catch (deleteError) {
      setError(`Gagal menghapus konten: ${errorMessage(deleteError)}`);
    } finally {
      setDeletingNow(false);
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-col gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-lime-300">
              Content control center
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
              Kelola semua konten
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
              Cari, perbarui, pratinjau, atau hapus konten yang sudah terbit dari
              satu tempat.
            </p>
          </div>
          <button
            type="button"
            disabled={reloading}
            onClick={() => void loadContent(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-zinc-400 transition hover:border-lime-300/25 hover:text-white disabled:opacity-40"
          >
            <span className={reloading ? "animate-spin" : ""}>↻</span>
            {reloading ? "Memuat..." : "Muat ulang"}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {(
            [
              ["semua", "Total konten"],
              ["sertifikat", "Sertifikat"],
              ["portofolio", "Karya"],
              ["jurnal", "Jurnal"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-xl border p-4 text-left transition ${
                filter === value
                  ? "border-lime-300/30 bg-lime-300/[0.07]"
                  : "border-white/[0.08] bg-[#080d11] hover:border-white/15"
              }`}
            >
              <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-600">
                {label}
              </span>
              <span
                className={`mt-2 block text-2xl font-black ${
                  filter === value ? "text-lime-300" : "text-white"
                }`}
              >
                {String(counts[value]).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#080d11] px-4 py-3">
            <svg
              className="h-4 w-4 shrink-0 text-zinc-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <span className="sr-only">Cari konten</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari judul, deskripsi, penerbit, teknologi..."
              className="w-full bg-transparent text-sm text-white placeholder:text-zinc-700 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-zinc-600 transition hover:text-white"
                aria-label="Hapus pencarian"
              >
                ×
              </button>
            )}
          </label>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as ContentKind)}
            className={`${fieldClass} sm:w-44`}
            aria-label="Filter jenis konten"
          >
            <option value="semua">Semua jenis</option>
            <option value="sertifikat">Sertifikat</option>
            <option value="portofolio">Karya</option>
            <option value="jurnal">Jurnal</option>
          </select>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
        {notice && (
          <div className="mt-5 flex items-start justify-between gap-4 rounded-xl border border-lime-300/15 bg-lime-300/[0.04] px-4 py-3 text-sm text-zinc-300">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="shrink-0 text-zinc-600 transition hover:text-white"
              aria-label="Tutup notifikasi"
            >
              ×
            </button>
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.025]"
                />
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <article
                  key={itemKey(item)}
                  className="group grid gap-4 rounded-xl border border-white/[0.08] bg-[#080d11] p-3 transition hover:border-white/15 sm:grid-cols-[88px_1fr] lg:grid-cols-[88px_1fr_auto] lg:items-center"
                >
                  <div className="aspect-square overflow-hidden rounded-lg border border-white/[0.06] bg-[#10171c]">
                    <ContentThumbnail item={item} />
                  </div>
                  <div className="min-w-0 px-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em] ${
                          item.kind === "sertifikat"
                            ? "bg-sky-300/10 text-sky-200"
                            : item.kind === "portofolio"
                              ? "bg-lime-300/10 text-lime-300"
                              : "bg-violet-300/10 text-violet-200"
                        }`}
                      >
                        {kindLabel[item.kind]}
                      </span>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-700">
                        {formatDate(item.data.created_at)}
                      </span>
                    </div>
                    <h3 className="mt-2 truncate text-base font-black text-white">
                      {itemTitle(item)}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs leading-5 text-zinc-600">
                      {itemSummary(item)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 border-t border-white/[0.07] pt-3 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                    <Link
                      href={itemHref(item)}
                      target="_blank"
                      rel="noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-xs text-zinc-500 transition hover:border-white/20 hover:text-white"
                      aria-label={`Pratinjau ${item.data.judul}`}
                      title="Pratinjau"
                    >
                      ↗
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setNotice("");
                        setError("");
                        setEditing(item);
                      }}
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-400 transition hover:border-lime-300/25 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNotice("");
                        setError("");
                        setDeletePhrase("");
                        setDeleting(item);
                      }}
                      className="rounded-lg border border-red-400/15 px-3 py-2 text-xs font-bold text-red-300/70 transition hover:border-red-300/35 hover:bg-red-400/[0.06] hover:text-red-200"
                    >
                      Hapus
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 py-16 text-center">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                {items.length === 0
                  ? "Belum ada konten untuk dikelola"
                  : "Konten tidak ditemukan"}
              </p>
              {(query || filter !== "semua") && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setFilter("semua");
                  }}
                  className="mt-4 text-sm font-bold text-lime-300"
                >
                  Reset filter
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-red-400/10 bg-red-400/[0.025] p-4">
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-red-300/60">
            Zona aman penghapusan
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-600">
            Setiap penghapusan membutuhkan konfirmasi tertulis. Data dihapus
            dahulu, lalu file terkait dibersihkan dari Supabase Storage.
          </p>
        </div>
      </div>

      {editing && (
        <EditContentModal
          item={editing}
          saving={saving}
          actionError={error}
          onClose={() => {
            setEditing(null);
            setError("");
          }}
          onSave={(draft) => void saveContent(draft)}
        />
      )}

      {deleting && (
        <DeleteContentModal
          item={deleting}
          phrase={deletePhrase}
          deleting={deletingNow}
          actionError={error}
          onPhraseChange={setDeletePhrase}
          onClose={() => {
            setDeleting(null);
            setDeletePhrase("");
            setError("");
          }}
          onDelete={() => void deleteContent()}
        />
      )}
    </>
  );
}
