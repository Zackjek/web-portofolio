import { supabase } from "@/lib/supabase";

export const MEDIA_BUCKET = "gambar-portofolio";

export type UploadedMedia = {
  path: string;
  publicUrl: string;
};

function cleanFileName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export async function uploadMedia(file: File, folder: string): Promise<UploadedMedia> {
  const safeName = cleanFileName(file.name) || "file";
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export function getStoragePath(publicUrl: string | null | undefined) {
  if (!publicUrl) return null;

  try {
    const { pathname } = new URL(publicUrl);
    const markers = [
      `/storage/v1/object/public/${MEDIA_BUCKET}/`,
      `/storage/v1/object/sign/${MEDIA_BUCKET}/`,
      `/storage/v1/object/authenticated/${MEDIA_BUCKET}/`,
    ];
    const marker = markers.find((value) => pathname.includes(value));

    if (!marker) return null;
    const encodedPath = pathname.slice(pathname.indexOf(marker) + marker.length);
    return encodedPath ? decodeURIComponent(encodedPath) : null;
  } catch {
    return null;
  }
}

export async function removeMedia(publicUrl: string | null | undefined) {
  const path = getStoragePath(publicUrl);
  if (!path) return { removed: false, error: null };

  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  return { removed: !error, error };
}
