import { describe, expect, it } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows requests up to the limit and then blocks", () => {
    const key = `test-${Math.random()}`;
    const opts = { limit: 3, windowMs: 60_000 };

    expect(rateLimit(key, opts).success).toBe(true);
    expect(rateLimit(key, opts).success).toBe(true);
    expect(rateLimit(key, opts).success).toBe(true);
    const blocked = rateLimit(key, opts);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("tracks remaining count", () => {
    const key = `test-${Math.random()}`;
    const opts = { limit: 2, windowMs: 60_000 };
    expect(rateLimit(key, opts).remaining).toBe(1);
    expect(rateLimit(key, opts).remaining).toBe(0);
  });

  it("isolates keys from each other", () => {
    const opts = { limit: 1, windowMs: 60_000 };
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    expect(rateLimit(a, opts).success).toBe(true);
    expect(rateLimit(b, opts).success).toBe(true);
    expect(rateLimit(a, opts).success).toBe(false);
  });
});
