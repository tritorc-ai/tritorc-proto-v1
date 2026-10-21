import { strapiWrite } from "@/lib/strapiClient";
import { clientIp, isValidEndpoint, rateLimited } from "@/lib/pushApi";

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!isValidEndpoint(body?.endpoint)) {
    return Response.json({ error: "Invalid endpoint" }, { status: 400 });
  }

  const result = await strapiWrite("POST", "/api/push-subscriptions/deactivate", {
    data: { endpoint: body.endpoint },
  });
  if (!result.ok) return Response.json({ error: "Backend unavailable" }, { status: 502 });
  return Response.json({ ok: true });
}
