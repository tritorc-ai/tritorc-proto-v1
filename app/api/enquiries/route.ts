import { strapiWrite } from "@/lib/strapiClient";
import { clientIp, rateLimited } from "@/lib/pushApi";

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Receives the enquiry form and stores it in our Strapi (Enquiry collection) with the
// limited write token. A hidden "website" field is a honeypot: bots fill it, people never see it.
export async function POST(req: Request) {
  // A few submissions per minute per address is plenty for a contact form.
  if (rateLimited(clientIp(req), 5)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  // Looks successful to a bot, but nothing is stored.
  if (text(body.website, 200)) return Response.json({ ok: true });

  const name = text(body.name, 120);
  const email = text(body.email, 200);
  const message = text(body.message, 2000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Name, a valid email and a message are required" }, { status: 400 });
  }

  const result = await strapiWrite("POST", "/api/enquiries", {
    data: {
      name,
      email,
      phone: text(body.phone, 40) || undefined,
      company: text(body.company, 160) || undefined,
      interest: text(body.interest, 160) || undefined,
      message,
    },
  });

  if (!result.ok) return Response.json({ error: "Backend unavailable" }, { status: 502 });
  return Response.json({ ok: true });
}
