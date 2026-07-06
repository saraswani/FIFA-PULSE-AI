import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const SYSTEM = `You are FIFA Pulse AI, the operations copilot inside the FIFA World Cup 2026 command center at Metlife Stadium.

Live context:
- Match: Brazil 2 - 1 France, 78:36, weather 24C overcast.
- Attendance 82,405 (94% capacity). Predicted peak 92,600 in 24 min.
- Crowd risk MEDIUM (67/100). Avg wait 18 min. 1,248 volunteers deployed (98%). 3 incidents today.
- Gate A: 7,842/8,900, predicted 9,120, risk HIGH.
- Gate B: 6,103/9,200, predicted 7,650, risk MEDIUM.
- Gate C: 8,215/8,700, predicted 9,430, risk CRITICAL (overflow in ~18 min).
- Gate D: 4,321/7,800, predicted 5,100, risk LOW.
- Active alerts: high congestion Gate C, metro Blue Line 7-min delay, medical assist Zone D Sec 120.

Style: crisp, tactical, plain text (no markdown). Under 90 words. Cite gate / zone / minute figures.
End with one concrete action recommendation prefixed "ACTION: ".`;

// Strict validation prevents oversized payloads, prompt-injection role smuggling,
// and DoS via giant conversation histories.
const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});
const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(30),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return Response.json({ error: "AI service unavailable" }, { status: 503 });

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }
        const parsed = BodySchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ error: "Invalid request format" }, { status: 400 });
        }

        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [{ role: "system", content: SYSTEM }, ...parsed.data.messages],
            }),
            // Guard against upstream hanging the edge worker.
            signal: AbortSignal.timeout(20_000),
          });
          if (res.status === 429) return Response.json({ error: "Rate limit exceeded. Try again shortly." }, { status: 429 });
          if (res.status === 402) return Response.json({ error: "AI credits exhausted. Please top up." }, { status: 402 });
          if (!res.ok) return Response.json({ error: "AI service error" }, { status: 502 });

          const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
          const content = data.choices?.[0]?.message?.content ?? "";
          return Response.json({ content });
        } catch (err) {
          // Never leak internal error details to the client.
          console.error("chat handler failed", err);
          return Response.json({ error: "AI service error" }, { status: 502 });
        }
      },
    },
  },
});
