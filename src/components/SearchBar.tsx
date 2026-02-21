"use client";

import { useState } from "react";

export function SearchBar({
  onSearch,
  loading,
}: {
  onSearch: (q: string) => void;
  loading: boolean;
}) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) onSearch(query.trim());
  };

  const examples = [
    "Le jeûne intermittent est-il bon pour la santé ?",
    "Faut-il investir dans l'immobilier en 2026 ?",
    "Les écrans sont-ils dangereux pour les enfants ?",
  ];

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Posez votre question..."
          disabled={loading}
          className="w-full px-6 py-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-white text-lg placeholder:text-neutral-500 focus:outline-none focus:border-[var(--accent-dim)] focus:ring-1 focus:ring-[var(--accent-dim)] transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[var(--accent)] text-black font-semibold text-sm hover:bg-[var(--accent-dim)] transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Éclairer"}
        </button>
      </form>

      {!loading && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setQuery(ex);
                onSearch(ex);
              }}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-neutral-400 hover:text-white hover:border-[var(--accent-dim)] transition"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
