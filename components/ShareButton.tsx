"use client";
import { useState, useEffect } from "react";

export default function ShareButton({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    setFullUrl(`${window.location.origin}${path}`);
  }, [path]);

  const handleShare = async () => {
    const url = fullUrl || `${window.location.origin}${path}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${title} — Muhammad Zaky Mubarok`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Unable to share the link", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-bold text-zinc-500 transition-all hover:border-lime-300/30 hover:text-lime-300"
      title="Share this page"
    >
      {copied ? (
        <span className="text-lime-300">Link copied</span>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
          </svg>
          <span>Share</span>
        </>
      )}
    </button>
  );
}
