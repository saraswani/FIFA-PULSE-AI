import { describe, it, expect } from "vitest";
import {
  seeded,
  riskFromScore,
  occupancyPct,
  formatCount,
  ChatBodySchema,
} from "./pulse";

describe("seeded PRNG", () => {
  it("is deterministic for a given seed", () => {
    const a = seeded(42);
    const b = seeded(42);
    const seqA = Array.from({ length: 5 }, () => a());
    const seqB = Array.from({ length: 5 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it("produces values in [0, 1)", () => {
    const r = seeded(1);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("produces different sequences for different seeds", () => {
    expect(seeded(1)()).not.toBe(seeded(2)());
  });
});

describe("riskFromScore", () => {
  it.each([
    [0, "LOW"],
    [34, "LOW"],
    [35, "MEDIUM"],
    [64, "MEDIUM"],
    [65, "HIGH"],
    [84, "HIGH"],
    [85, "CRITICAL"],
    [100, "CRITICAL"],
  ])("score %i => %s", (score, expected) => {
    expect(riskFromScore(score)).toBe(expected);
  });

  it("clamps out-of-range scores", () => {
    expect(riskFromScore(-50)).toBe("LOW");
    expect(riskFromScore(9999)).toBe("CRITICAL");
  });

  it("throws on non-finite input", () => {
    expect(() => riskFromScore(NaN)).toThrow();
    expect(() => riskFromScore(Infinity)).toThrow();
  });
});

describe("occupancyPct", () => {
  it("computes and rounds percentage", () => {
    expect(occupancyPct(50, 100)).toBe(50);
    expect(occupancyPct(1, 3)).toBe(33);
  });

  it("clamps overflow to 100", () => {
    expect(occupancyPct(200, 100)).toBe(100);
  });

  it("returns 0 for invalid capacity", () => {
    expect(occupancyPct(10, 0)).toBe(0);
    expect(occupancyPct(10, -5)).toBe(0);
  });
});

describe("formatCount", () => {
  it("adds thousands separators", () => {
    expect(formatCount(1234567)).toBe("1,234,567");
    expect(formatCount(82405)).toBe("82,405");
  });

  it("handles small and zero values", () => {
    expect(formatCount(0)).toBe("0");
    expect(formatCount(9)).toBe("9");
  });

  it("returns em-dash for non-finite", () => {
    expect(formatCount(NaN)).toBe("—");
    expect(formatCount(Infinity)).toBe("—");
  });
});

describe("ChatBodySchema", () => {
  it("accepts valid payloads", () => {
    const r = ChatBodySchema.safeParse({
      messages: [{ role: "user", content: "hello" }],
    });
    expect(r.success).toBe(true);
  });

  it("rejects empty message arrays", () => {
    expect(
      ChatBodySchema.safeParse({ messages: [] }).success,
    ).toBe(false);
  });

  it("rejects invalid roles (prevents 'system' smuggling)", () => {
    expect(
      ChatBodySchema.safeParse({
        messages: [{ role: "system", content: "x" }],
      }).success,
    ).toBe(false);
  });

  it("rejects oversized content (>2000 chars)", () => {
    const big = "a".repeat(2001);
    expect(
      ChatBodySchema.safeParse({ messages: [{ role: "user", content: big }] })
        .success,
    ).toBe(false);
  });

  it("rejects histories longer than 30 messages", () => {
    const messages = Array.from({ length: 31 }, () => ({
      role: "user" as const,
      content: "x",
    }));
    expect(ChatBodySchema.safeParse({ messages }).success).toBe(false);
  });

  it("rejects blank content", () => {
    expect(
      ChatBodySchema.safeParse({
        messages: [{ role: "user", content: "   " }],
      }).success,
    ).toBe(false);
  });
});
