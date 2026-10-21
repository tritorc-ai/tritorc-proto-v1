import { strapiWrite } from "@/lib/strapiClient";
import { ALLOWED_TOPICS, clientIp, isValidEndpoint, rateLimited } from "@/lib/pushApi";

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const sub = body?.subscription;
  const keys = sub?.keys;
  if (
    !isValidEndpoint(sub?.endpoint) ||
    typeof keys?.p256dh !== "string" ||
    typeof keys?.auth !== "string" ||
    typeof body?.deviceId !== "string" ||
    body.deviceId.length > 64
  ) {
    return Response.json({ error: "Invalid subscription" }, { status: 400 });
  }

  const topics = Array.isArray(body.topics)
    ? body.topics.filter((t: unknown) => typeof t === "string" && ALLOWED_TOPICS.includes(t))
    : ["general"];

  // Custom Strapi route on the `push-subscription` collection that upserts by
  // the unique `endpoint` field (to be built on the Strapi side — see decision.md).
  const result = await strapiWrite("POST", "/api/push-subscriptions/upsert", {
    data: {
      endpoint: sub.endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      deviceId: body.deviceId,
      topics: topics.length ? topics : ["general"],
      userAgent: (req.headers.get("user-agent") ?? "").slice(0, 255),
      active: true,
    },
  });

  if (!result.ok) return Response.json({ error: "Backend unavailable" }, { status: 502 });
  return Response.json({ ok: true });
}
