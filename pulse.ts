import { z } from "zod";

/**
 * Deterministic pseudo-random generator (mulberry32).
 * Used across the dashboard so charts / simulations render identically
 * on every mount — important for SSR hydration parity.
 */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Risk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/** Map a 0-100 congestion score to a discrete risk level. */
export function riskFromScore(score: number): Risk {
  if (!Number.isFinite(score)) throw new Error("score must be finite");
  const s = Math.max(0, Math.min(100, score));
  if (s >= 85) return "CRITICAL";
  if (s >= 65) return "HIGH";
  if (s >= 35) return "MEDIUM";
  return "LOW";
}

/** Compute stadium occupancy percentage, clamped and rounded. */
export function occupancyPct(current: number, capacity: number): number {
  if (capacity <= 0) return 0;
  const pct = (current / capacity) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

/** Format large numbers with thousands separators (locale-stable). */
export function formatCount(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return Math.round(n).toLocaleString("en-US");
}

/** Shared chat payload schema — mirrored by the /api/chat route. */
export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});
export const ChatBodySchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(30),
});
export type ChatBody = z.infer<typeof ChatBodySchema>;
