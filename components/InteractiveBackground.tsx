"use client";

import { useEffect } from "react";

export default function InteractiveBackground() {
  useEffect(() => {
    let frame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 grid-surface" />
      <div className="absolute inset-0 pointer-light" />
      <div className="absolute inset-0 noise-surface mix-blend-soft-light" />
      <div className="ambient-lavender absolute -top-52 -left-48 h-[34rem] w-[34rem] rounded-full blur-[140px]" />
      <div className="ambient-mint absolute top-[38%] -right-72 h-[38rem] w-[38rem] rounded-full blur-[155px]" />
      <div className="ambient-coral absolute bottom-[3%] -left-64 h-[34rem] w-[34rem] rounded-full blur-[150px]" />
    </div>
  );
}
