"use client";

import { useEffect, useRef, useState } from "react";
import type {
  PDFDocumentLoadingTask,
  RenderTask,
} from "pdfjs-dist";

type PreviewStatus = "idle" | "loading" | "ready" | "error";

function PreviewPlaceholder({ failed }: { failed: boolean }) {
  return (
    <div className="accent-radial absolute inset-0 grid place-items-center">
      <div className="text-center">
        <svg
          className={`mx-auto h-12 w-12 ${
            failed ? "text-zinc-600" : "animate-pulse text-lime-300/75"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M14 3v5h5M9.5 15h5M9.5 18h3.5" />
        </svg>
        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
          {failed ? "Preview tidak tersedia" : "Menyiapkan preview"}
        </p>
      </div>
    </div>
  );
}

export default function PdfThumbnail({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [status, setStatus] = useState<PreviewStatus>("idle");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "320px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | null = null;
    let renderTask: RenderTask | null = null;

    const renderFirstPage = async () => {
      setStatus("loading");

      try {
        const pdfjs = await import("pdfjs-dist");
        if (cancelled) return;

        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
        loadingTask = pdfjs.getDocument({ url });
        const document = await loadingTask.promise;
        const page = await document.getPage(1);
        if (cancelled) return;

        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const bounds = container.getBoundingClientRect();
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const coverScale = Math.max(
          Math.max(bounds.width, 320) / baseViewport.width,
          Math.max(bounds.height, 240) / baseViewport.height,
        );
        const viewport = page.getViewport({
          scale: coverScale * pixelRatio,
        });

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        renderTask = page.render({
          canvas,
          viewport,
          background: "rgb(255,255,255)",
        });
        await renderTask.promise;

        if (!cancelled) setStatus("ready");
      } catch (error) {
        if (cancelled || (error instanceof Error && error.name === "RenderingCancelledException")) {
          return;
        }
        console.error(`Gagal membuat thumbnail PDF "${title}".`, error);
        setStatus("error");
      }
    };

    void renderFirstPage();

    return () => {
      cancelled = true;
      renderTask?.cancel();
      void loadingTask?.destroy();
    };
  }, [shouldLoad, title, url]);

  return (
    <div ref={containerRef} className="relative h-full w-full bg-[#10171c]">
      {status !== "ready" && (
        <PreviewPlaceholder failed={status === "error"} />
      )}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Halaman pertama ${title}`}
        className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
          status === "ready" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
