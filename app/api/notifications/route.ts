import { getLiveNotifications } from "@/lib/notifications";

// Live inbox for the client (unread badge + in-app banner). Returns only real
// notifications — never the bundled mock content — so the badge stays accurate.
export async function GET() {
  const items = (await getLiveNotifications()) ?? [];
  return Response.json({ items }, { headers: { "Cache-Control": "no-store" } });
}
