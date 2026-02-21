import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are Phoslab, an information analysis system. You receive a question and must produce a structured knowledge map.

ABSOLUTE RULES:
- NEVER give a single answer. Always show the full spectrum.
- Cite REAL, verifiable sources. If you don't have a source, say so.
- Clearly distinguish what is established, debated, and unknown.
- Identify actors and their interests.
- Be honest about your limits and possible biases.
- NEVER invent sources, studies, or statistics.
- If you don't know, say "I don't know" — that is useful information.
- CRITICAL: Respond in the SAME LANGUAGE as the user's question. If the question is in French, respond in French. If in English, respond in English. Match the language exactly.

OUTPUT FORMAT (strict JSON):
{
  "question": "the question clearly reformulated (in the same language as asked)",
  "known": {
    "summary": "summary of what is consensus",
    "points": [
      { "text": "established point", "source": "source name", "url": "url if available" }
    ]
  },
  "debated": {
    "summary": "summary of areas of debate",
    "points": [
      { "text": "debated point", "source": "source name", "url": "url if available" }
    ]
  },
  "unknown": {
    "summary": "summary of what we don't know yet",
    "points": [
      { "text": "what remains unknown" }
    ]
  },
  "perspectives": [
    {
      "actor": "who (type of actor)",
      "position": "what they say",
      "interest": "why they say it (their interest)",
      "credibility": "high / medium / low / variable"
    }
  ],
  "sources": [
    {
      "title": "source title",
      "url": "real url",
      "type": "academic / institutional / media / commercial",
      "reliability": "high / medium / low"
    }
  ],
  "confidence": "high / medium / low — with short explanation",
  "lastUpdated": "ISO date"
}

Respond ONLY with the JSON, no surrounding text. The response language MUST match the language of the question.`;

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
