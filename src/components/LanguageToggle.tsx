"use client";

import type { Lang } from "@/i18n";

export function LanguageToggle({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        onClick={() => setLang("en")}
        className={`px-2 py-1 rounded-md transition ${
          lang === "en"
            ? "bg-[var(--accent)] text-black font-semibold"
            : "text-neutral-500 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("fr")}
        className={`px-2 py-1 rounded-md transition ${
          lang === "fr"
            ? "bg-[var(--accent)] text-black font-semibold"
            : "text-neutral-500 hover:text-white"
        }`}
      >
        FR
      </button>
    </div>
  );
}
