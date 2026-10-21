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

  const url = new URL(`${baseUrl}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

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
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[strapi] ${path} failed:`, err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
