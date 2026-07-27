"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PageMotion() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section"),
    );
    let backToTopVisible = false;

    const updateScrollState = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      const nextBackToTopVisible = window.scrollY > 720;
      if (nextBackToTopVisible !== backToTopVisible) {
        backToTopVisible = nextBackToTopVisible;
        setShowBackToTop(nextBackToTopVisible);
      }
    };

    root.classList.add("motion-ready");
    const initialFrame = window.requestAnimationFrame(updateScrollState);
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState, { passive: true });

    if (prefersReducedMotion) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return () => {
        window.cancelAnimationFrame(initialFrame);
        root.classList.remove("motion-ready");
        window.removeEventListener("scroll", updateScrollState);
        window.removeEventListener("resize", updateScrollState);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    sections.forEach((section) => {
      section.classList.add("scroll-reveal");
      if (section.getBoundingClientRect().top < window.innerHeight * 0.9) {
        section.classList.add("is-visible");
      } else {
        observer.observe(section);
      }
    });

    return () => {
      window.cancelAnimationFrame(initialFrame);
      observer.disconnect();
      root.classList.remove("motion-ready");
      sections.forEach((section) =>
        section.classList.remove("scroll-reveal", "is-visible"),
      );
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [pathname]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[70] h-[2px]" aria-hidden="true">
        <div
          ref={progressRef}
          className="page-progress h-full origin-left scale-x-0"
        />
      </div>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`back-to-top fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-[#0a1015]/85 text-lime-300 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-lime-300/45 ${
          showBackToTop
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-4 opacity-0"
        }`}
        aria-label="Back to top"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </button>
    </>
  );
}
