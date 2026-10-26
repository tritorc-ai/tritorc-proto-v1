"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { CONTACT } from "@/lib/mock/appContent";

const INTERESTS = ["Products", "Services", "Calibration / rental", "Technical support", "Other"] as const;

const field =
  "w-full rounded-2xl bg-white px-4 py-3.5 text-[15px] text-brand-dark outline-none ring-0 transition-shadow placeholder:text-brand-text-tertiary focus:shadow-[0_0_0_2px_var(--brand-red)]";

type Status = "idle" | "sending" | "sent" | "mail";

/**
 * Sends the enquiry to our Strapi through /api/enquiries. If that fails (backend down,
 * offline, too many requests) it falls back to opening the user's mail app with the
 * message pre-filled for Tritorc's response inbox, so an enquiry is never lost.
 */
export function EnquiryForm({ defaultInterest }: { defaultInterest?: string }) {
  const [interest, setInterest] = useState<string>(defaultInterest ?? INTERESTS[0]);
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const value = (k: string) => String(f.get(k) ?? "");
    setStatus("sending");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value("name"),
          company: value("company"),
          phone: value("phone"),
          email: value("email"),
          message: value("message"),
          website: value("website"),
          interest,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      const body = [
        `Name: ${value("name")}`,
        `Company: ${value("company") || "-"}`,
        `Phone: ${value("phone") || "-"}`,
        `Email: ${value("email")}`,
        `Interested in: ${interest}`,
        "",
        value("message"),
      ].join("\n");
      const subject = `Tritorc enquiry - ${interest}`;
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("mail");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1" role="radiogroup" aria-label="Interested in">
        {INTERESTS.map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={interest === i}
            onClick={() => setInterest(i)}
            className={`press shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
              interest === i ? "bg-brand-dark text-white" : "bg-white text-brand-dark"
            }`}
          >
            {i}
          </button>
        ))}
      </div>
      <input name="name" required placeholder="Your name" autoComplete="name" className={field} />
      <input name="company" placeholder="Company" autoComplete="organization" className={field} />
      <div className="grid grid-cols-2 gap-3">
        <input name="email" type="email" required placeholder="Email" autoComplete="email" className={field} />
        <input name="phone" type="tel" placeholder="Phone" autoComplete="tel" className={field} />
      </div>
      <textarea
        name="message"
        required
        rows={5}
        placeholder="Tell us about the joint, the site and the schedule"
        className={`${field} resize-none rounded-[22px]`}
      />
      {/* Honeypot: hidden from people, filled by bots. */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="press flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-red py-4 text-[16px] font-semibold text-white disabled:opacity-60"
      >
        <Send size={17} /> {status === "sending" ? "Sending..." : "Send enquiry"}
      </button>
      {status === "sent" && (
        <p role="status" className="text-center text-[13px] text-brand-text-secondary">
          Thank you. Your enquiry has been sent and our team will get back to you.
        </p>
      )}
      {status === "mail" && (
        <p role="status" className="text-center text-[13px] text-brand-text-secondary">
          We could not send it from the app, so your mail app should open with the enquiry ready to send. Nothing is
          sent until you press send there.
        </p>
      )}
    </form>
  );
}
