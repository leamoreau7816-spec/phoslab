export function LoadingState() {
  const steps = [
    "Recherche de sources fiables...",
    "Croisement des perspectives...",
    "Analyse des biais...",
    "Construction de la carte...",
  ];

  return (
    <div className="mt-12 max-w-2xl w-full">
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div
            key={step}
            className="flex items-center gap-3 text-neutral-400 animate-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="text-sm">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
