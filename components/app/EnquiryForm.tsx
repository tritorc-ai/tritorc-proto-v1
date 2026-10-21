"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { CONTACT } from "@/lib/mock/appContent";

const INTERESTS = ["Products", "Services", "Calibration / rental", "Technical support", "Other"] as const;

const field =
  "w-full rounded-2xl bg-white px-4 py-3.5 text-[15px] text-brand-dark outline-none ring-0 transition-shadow placeholder:text-brand-text-tertiary focus:shadow-[0_0_0_2px_var(--brand-red)]";

/**
 * There's no enquiry backend yet, so submitting opens the user's mail app with
 * a pre-filled message to Tritorc's response inbox.
 */
export function EnquiryForm({ defaultInterest }: { defaultInterest?: string }) {
  const [interest, setInterest] = useState<string>(defaultInterest ?? INTERESTS[0]);
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Name: ${f.get("name")}`,
      `Company: ${f.get("company") || "-"}`,
      `Phone: ${f.get("phone") || "-"}`,
      `Email: ${f.get("email")}`,
      `Interested in: ${interest}`,
      "",
      `${f.get("message")}`,
    ].join("\n");
    const subject = `Tritorc enquiry — ${interest}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
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
      <button
        type="submit"
        className="press flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-red py-4 text-[16px] font-semibold text-white"
      >
        <Send size={17} /> Send enquiry
      </button>
      {sent && (
        <p role="status" className="text-center text-[13px] text-brand-text-secondary">
          Your mail app should open with the enquiry ready to send. Nothing is sent until you press send there.
        </p>
      )}
    </form>
  );
}
