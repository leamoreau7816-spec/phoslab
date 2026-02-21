import type { AnalysisResult } from "@/app/page";

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: string;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${color}`}>
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function SourceBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    academic: "bg-blue-900/50 text-blue-300 border-blue-800",
    institutional: "bg-purple-900/50 text-purple-300 border-purple-800",
    media: "bg-amber-900/50 text-amber-300 border-amber-800",
    commercial: "bg-red-900/50 text-red-300 border-red-800",
    other: "bg-neutral-800 text-neutral-300 border-neutral-700",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${colors[type] || colors.other}`}>
      {type}
    </span>
  );
}

export function KnowledgeCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="mt-8 mb-12 max-w-3xl w-full space-y-4">
      {/* Question */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white">&ldquo;{result.question}&rdquo;</h2>
        <p className="text-xs text-neutral-500 mt-1">
          Confiance de l&apos;analyse : {result.confidence} · Dernière MAJ : {result.lastUpdated}
        </p>
      </div>

      {/* Ce qu'on sait */}
      <Section icon="📗" title="Ce qu'on sait" color="text-green-400">
        <p className="text-neutral-300 text-sm mb-3">{result.known.summary}</p>
        <ul className="space-y-2">
          {result.known.points.map((p, i) => (
            <li key={i} className="text-sm text-neutral-300 flex gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>
                {p.text}
                {p.source && (
                  <span className="text-neutral-500 text-xs ml-1">
                    — {p.url ? <a href={p.url} target="_blank" rel="noopener" className="underline hover:text-white">{p.source}</a> : p.source}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Ce qui est débattu */}
      <Section icon="📙" title="Ce qui est débattu" color="text-amber-400">
        <p className="text-neutral-300 text-sm mb-3">{result.debated.summary}</p>
        <ul className="space-y-2">
          {result.debated.points.map((p, i) => (
            <li key={i} className="text-sm text-neutral-300 flex gap-2">
              <span className="text-amber-500 mt-0.5">◐</span>
              <span>
                {p.text}
                {p.source && (
                  <span className="text-neutral-500 text-xs ml-1">
                    — {p.url ? <a href={p.url} target="_blank" rel="noopener" className="underline hover:text-white">{p.source}</a> : p.source}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Ce qu'on ne sait pas */}
      <Section icon="📕" title="Ce qu'on ne sait pas" color="text-red-400">
        <p className="text-neutral-300 text-sm mb-3">{result.unknown.summary}</p>
        <ul className="space-y-2">
          {result.unknown.points.map((p, i) => (
            <li key={i} className="text-sm text-neutral-300 flex gap-2">
              <span className="text-red-500 mt-0.5">?</span>
              <span>{p.text}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Qui dit quoi */}
      <Section icon="🗺️" title="Qui dit quoi" color="text-purple-400">
        <div className="space-y-3">
          {result.perspectives.map((p, i) => (
            <div key={i} className="rounded-lg bg-neutral-900 p-3 border border-neutral-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-white">{p.actor}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                  {p.credibility}
                </span>
              </div>
              <p className="text-sm text-neutral-300">{p.position}</p>
              <p className="text-xs text-neutral-500 mt-1">💰 Intérêt : {p.interest}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Sources primaires */}
      <Section icon="🔗" title="Sources primaires" color="text-blue-400">
        <ul className="space-y-2">
          {result.sources.map((s, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <SourceBadge type={s.type} />
              <a
                href={s.url}
                target="_blank"
                rel="noopener"
                className="text-neutral-300 hover:text-white underline transition"
              >
                {s.title}
              </a>
              <span className="text-neutral-600 text-xs ml-auto">{s.reliability}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Transparence */}
      <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-4 text-center">
        <p className="text-xs text-amber-300/80">
          ⚠️ Cette analyse a été générée par une IA. Chaque source citée est vérifiable.
          L&apos;IA peut se tromper — croisez toujours avec les sources primaires.
        </p>
        <button className="mt-2 text-xs text-amber-400 underline hover:text-white transition">
          Signaler une erreur
        </button>
      </div>
    </div>
  );
}
