/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Suitable for a single serverless instance / small deployments. For
 * horizontally-scaled production traffic swap the store for Upstash
 * Redis (@upstash/ratelimit) — the call-site API below stays the same.
 */

type Window = { count: number; resetAt: number };

const store = new Map<string, Window>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/** Derive a client key from a request (IP + route). */
export function clientKey(req: Request, route: string): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return `${route}:${ip}`;
}

/** Periodically clear expired windows to bound memory usage. */
export function pruneExpired(now = Date.now()): void {
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}
