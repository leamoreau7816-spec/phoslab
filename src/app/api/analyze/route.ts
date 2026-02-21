import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `Tu es Phoslab, un système d'analyse d'information. Tu reçois une question et tu dois produire une carte de connaissance structurée.

RÈGLES ABSOLUES :
- Ne donne JAMAIS une seule réponse. Montre toujours le spectre complet.
- Cite des sources RÉELLES et vérifiables. Si tu n'as pas de source, dis-le.
- Distingue clairement ce qui est établi, débattu, et inconnu.
- Identifie les acteurs et leurs intérêts.
- Sois honnête sur tes limites et tes biais possibles.
- N'invente JAMAIS de sources, d'études, ou de statistiques.
- Si tu ne sais pas, dis "je ne sais pas" — c'est une information utile.

FORMAT DE SORTIE (JSON strict) :
{
  "question": "la question reformulée clairement",
  "known": {
    "summary": "résumé de ce qui fait consensus",
    "points": [
      { "text": "point établi", "source": "nom de la source", "url": "url si disponible" }
    ]
  },
  "debated": {
    "summary": "résumé des zones de débat",
    "points": [
      { "text": "point débattu", "source": "nom de la source", "url": "url si disponible" }
    ]
  },
  "unknown": {
    "summary": "résumé de ce qu'on ne sait pas encore",
    "points": [
      { "text": "ce qui reste inconnu" }
    ]
  },
  "perspectives": [
    {
      "actor": "qui (type d'acteur)",
      "position": "ce qu'ils disent",
      "interest": "pourquoi ils le disent (leur intérêt)",
      "credibility": "élevée / moyenne / faible / variable"
    }
  ],
  "sources": [
    {
      "title": "titre de la source",
      "url": "url réelle",
      "type": "academic / institutional / media / commercial",
      "reliability": "élevée / moyenne / faible"
    }
  ],
  "confidence": "élevée / moyenne / faible — avec explication courte",
  "lastUpdated": "date ISO"
}

Réponds UNIQUEMENT avec le JSON, pas de texte autour. La langue de réponse doit correspondre à la langue de la question.`;

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question manquante" }, { status: 400 });
    }

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Clé API non configurée. Ajoutez ANTHROPIC_API_KEY." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json(
        { error: "Erreur lors de l'analyse. Réessayez." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Réponse mal formatée. Réessayez." },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (e: unknown) {
    console.error("Error:", e);
    return NextResponse.json(
      { error: "Erreur interne. Réessayez." },
      { status: 500 }
    );
  }
}
