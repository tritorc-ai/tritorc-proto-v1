import "server-only";

// Shared validation + naive per-IP rate limit for the /api/push/* handlers.
// The limiter is in-memory (per server instance) — fine for a prototype;
// swap for Redis/Upstash if this runs on multiple instances.

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimited(ip: string, max = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || rec.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  rec.count++;
  return rec.count > max;
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

/** Push endpoints are always https URLs on the browser vendor's push service. */
export function isValidEndpoint(endpoint: unknown): endpoint is string {
  if (typeof endpoint !== "string" || endpoint.length > 1024) return false;
  try {
    return new URL(endpoint).protocol === "https:";
  } catch {
    return false;
  }
}

export const ALLOWED_TOPICS = ["general", "events", "products", "services", "library", "linkedin"];
