"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { LoadingState } from "@/components/LoadingState";

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
        throw new Error(data.error || "Erreur lors de l'analyse");
      }

      const data = await res.json();
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
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
          <span className="text-xs text-neutral-500">Le labo de la lumière</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {!result && !loading && (
          <div className="text-center mb-12 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[var(--accent)] bg-clip-text text-transparent">
              Éclairez n&apos;importe quel sujet
            </h1>
            <p className="text-neutral-400 text-lg">
              Posez une question. Recevez pas une réponse —<br />
              recevez la <strong className="text-white">carte du territoire</strong>.
            </p>
          </div>
        )}

        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading && <LoadingState />}

        {error && (
          <div className="mt-8 p-4 rounded-xl border border-red-800 bg-red-950/30 text-red-300 max-w-2xl w-full">
            {error}
          </div>
        )}

        {result && <KnowledgeCard result={result} />}
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--border)] px-6 py-6">
        <div className="max-w-4xl mx-auto text-center text-xs text-neutral-500 space-y-1">
          <p>
            ⚠️ Généré par IA. Chaque source est vérifiable. Si quelque chose est faux,{" "}
            <button className="underline hover:text-white transition">signalez-le</button>.
          </p>
          <p>Phoslab — φῶς (lumière) + lab. Open source. Pas de pub. Jamais.</p>
        </div>
      </footer>
    </main>
  );
}
