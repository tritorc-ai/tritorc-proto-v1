import "server-only";

// Low-level Strapi REST client. Server-only, never exposed to the browser —
// matches the tritorc-website convention (no NEXT_PUBLIC_STRAPI_URL).

function getBaseUrl(): string | null {
  const url = process.env.STRAPI_API_URL;
  if (!url) return null;
  return url.replace(/\/+$/, "");
}

function getHeaders(): Record<string, string> | null {
  const token = process.env.STRAPI_API_READ_TOKEN;
  if (!token) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[strapi] STRAPI_API_READ_TOKEN is not set");
      return null;
    }
    return {};
  }
  return { Authorization: `Bearer ${token}` };
}

// A Strapi that does not answer used to cost every call its full timeout, and a detail page makes
// several calls in two rounds, so one tap on a product could take 16 s. Now a call gives up after
// READ_TIMEOUT_MS, and after a failure Strapi is skipped for DOWN_FOR_MS (per server instance), so
// only the first request pays; the rest get the built-in content straight away.
const READ_TIMEOUT_MS = 3000;
const DOWN_FOR_MS = 60_000;
let strapiDownUntil = 0;

/**
 * Fetch from the Strapi REST API. Returns null on any failure (network,
 * timeout, missing config, non-2xx) — callers are expected to fall back to
 * mock/static content rather than crash the page, matching the resilience
 * pattern the official site uses.
 *
 * Cached for `revalidateSeconds` (Next.js Data Cache) instead of "no-store" —
 * every navigation was re-fetching from Strapi from scratch, which was the
 * main cause of slow page-to-page navigation. Content still shows up within
 * that window with no rebuild needed, just not instantaneously — a
 * reasonable trade for a marketing site whose content doesn't change
 * second-to-second. Pass 0 to opt back into always-fresh for a specific call.
 */
export async function strapiFetch<T>(
  path: string,
  params?: Record<string, string>,
  revalidateSeconds = 30
): Promise<T | null> {
  const baseUrl = getBaseUrl();
  const headers = getHeaders();
  if (!baseUrl || !headers) return null;
  if (Date.now() < strapiDownUntil) return null;

  const url = new URL(`${baseUrl}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), READ_TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      headers,
      signal: controller.signal,
      ...(revalidateSeconds > 0
        ? { next: { revalidate: revalidateSeconds } }
        : { cache: "no-store" as const }),
    });
    if (!res.ok) {
      console.warn(`[strapi] ${path} -> HTTP ${res.status}`);
      if (res.status >= 500) strapiDownUntil = Date.now() + DOWN_FOR_MS;
      return null;
    }
    strapiDownUntil = 0;
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[strapi] ${path} failed:`, err instanceof Error ? err.message : err);
    strapiDownUntil = Date.now() + DOWN_FOR_MS;
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Write to the Strapi REST API (POST/PUT/DELETE). Uses NOTIF_API_WRITE_TOKEN,
 * a separate token scoped to creating subscriptions/enquiries only — never
 * reuse the read token for writes. Never throws; callers inspect `ok`.
 */
export async function strapiWrite<T = unknown>(
  method: "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown
): Promise<{ ok: boolean; status: number; data: T | null }> {
  // Notifications/enquiries live in their own Strapi (tritorc-strapi), separate
  // from the content CMS behind STRAPI_API_URL.
  const baseUrl = process.env.NOTIF_API_URL?.replace(/\/+$/, "");
  const token = process.env.NOTIF_API_WRITE_TOKEN;
  if (!baseUrl || !token) {
    console.warn("[strapi] write skipped: NOTIF_API_URL or NOTIF_API_WRITE_TOKEN not set");
    return { ok: false, status: 503, data: null };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
    const data = res.status === 204 ? null : ((await res.json().catch(() => null)) as T | null);
    if (!res.ok) console.warn(`[strapi] ${method} ${path} -> HTTP ${res.status}`);
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.warn(`[strapi] ${method} ${path} failed:`, err instanceof Error ? err.message : err);
    return { ok: false, status: 502, data: null };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * GET from the notifications Strapi (tritorc-strapi, NOTIF_API_URL) with its
 * read-only token. Same contract as strapiFetch: null on any failure.
 */
export async function notifFetch<T>(
  path: string,
  params?: Record<string, string>,
  revalidateSeconds = 0
): Promise<T | null> {
  const baseUrl = process.env.NOTIF_API_URL?.replace(/\/+$/, "");
  const token = process.env.NOTIF_API_READ_TOKEN;
  if (!baseUrl || !token) return null;

  const url = new URL(`${baseUrl}${path}`);
  for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, v);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
      ...(revalidateSeconds > 0
        ? { next: { revalidate: revalidateSeconds } }
        : { cache: "no-store" as const }),
    });
    if (!res.ok) {
      console.warn(`[notif] ${path} -> HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[notif] ${path} failed:`, err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
