"use client";

type Theme = "dark" | "light";

function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const toggleTheme = () => {
    const nextTheme: Theme = getCurrentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    try {
      window.localStorage.setItem("portfolio-theme", nextTheme);
    } catch {
      // The theme still changes for this session when storage is unavailable.
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle group grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04] text-white transition-all hover:border-lime-300/45 hover:bg-lime-300/10"
      aria-label="Switch color theme"
      title="Switch color theme"
    >
      <svg
        className="theme-icon theme-icon-sun h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </svg>
      <svg
        className="theme-icon theme-icon-moon h-[18px] w-[18px] transition-transform duration-300 group-hover:-rotate-12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z" />
      </svg>
    </button>
  );
}
