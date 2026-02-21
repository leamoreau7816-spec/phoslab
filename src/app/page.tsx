"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { LoadingState } from "@/components/LoadingState";
import { LanguageToggle } from "@/components/LanguageToggle";
import { type Lang, t } from "@/i18n";

export type AnalysisResult = {
  question: string;
  known: { summary: string; points: { text: string; source?: string; url?: string }[] };
  debated: { summary: string; points: { text: string; source?: string; url?: string }[] };
  unknown: { summary: string; points: { text: string }[] };
  perspectives: { actor: string; position: string; interest: string; credibility: string }[];
  sources: { title: string; url: string; type: string; reliability: string }[];
  confidence: string;
  lastUpdated: string;
};

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>("en");

  const i = t(lang);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || i.errorAnalysis);
      }

      const data = await res.json();
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : i.errorUnknown);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <span className="text-xl font-bold tracking-tight">Phoslab</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-500">{i.tagline}</span>
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {!result && !loading && (
          <div className="text-center mb-12 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[var(--accent)] bg-clip-text text-transparent">
              {i.heroTitle}
            </h1>
            <p className="text-neutral-400 text-lg">
              {i.heroSubtitle1}<br />
              {lang === "en" ? (
                <>get the <strong className="text-white">map of the territory</strong>.</>
              ) : (
                <>recevez la <strong className="text-white">carte du territoire</strong>.</>
              )}
            </p>
          </div>
        )}

        <SearchBar onSearch={handleSearch} loading={loading} lang={lang} />

        {loading && <LoadingState lang={lang} />}

        {error && (
          <div className="mt-8 p-4 rounded-xl border border-red-800 bg-red-950/30 text-red-300 max-w-2xl w-full">
            {error}
          </div>
        )}

        {result && <KnowledgeCard result={result} lang={lang} />}
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--border)] px-6 py-6">
        <div className="max-w-4xl mx-auto text-center text-xs text-neutral-500 space-y-1">
          <p>
            ⚠️ {i.footerWarning}{" "}
            <button className="underline hover:text-white transition">{i.footerReport}</button>.
          </p>
          <p>{i.footerTagline}</p>
        </div>
      </footer>
    </main>
  );
}
