import Image from "next/image";
import { Quote, User } from "lucide-react";

export interface FounderMessageProps {
  /** Founder's name. */
  name: string;
  /** Title shown under the name. */
  role: string;
  /** The message itself: keep to roughly 130-150 characters so the card stays compact. */
  message: string;
  /** Portrait (square crop, head and shoulders; shown in a circle). Leave undefined to show the photo placeholder. */
  photo?: string;
}

/**
 * Founder's message bento. Pure greys and black, like the home tiles and hero:
 * warm light card, near-black type with the grey second line from the hero
 * headline, hairline dividers, no accent colour. The portrait is the focal
 * point: a plain circle with no border or shadow.
 */
export function FounderMessage({ name, role, message, photo }: FounderMessageProps) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-black/5 bg-[#f7f6f4] p-4 shadow-xs tablet:p-6">
      <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
        Founder&apos;s message
        <span className="h-[1px] flex-1 bg-neutral-300/70" />
      </div>

      <div className="mt-3 grid grid-cols-[100px_1fr] gap-4">
        <div className="relative aspect-square self-start overflow-hidden rounded-full bg-gradient-to-b from-[#ecebe9] to-[#dedfe1]">
          {photo ? (
            <Image
              src={photo}
              alt={`${name}, ${role}`}
              fill
              sizes="100px"
              className="object-cover object-top"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-neutral-400/70">
              <User size={32} strokeWidth={1} />
              <span className="text-[7.5px] font-medium uppercase tracking-[0.18em]">Photo</span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <h2 className="text-[19px] font-bold leading-[1.1] tracking-[-0.025em] text-[#0f0f10]">
            A word from
            <br />
            <span className="text-[#6b6b70]">our founder.</span>
          </h2>
          <p className="mt-2 text-[13.5px] font-medium leading-[1.42] text-[#2a2a2c] tablet:text-[15px]">
            <Quote size={13} fill="currentColor" strokeWidth={0} className="mb-0.5 mr-1 inline rotate-180 text-neutral-400" />
            {message}
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-black/[0.08] pt-2.5">
        <div className="text-[15px] font-bold leading-tight tracking-[-0.015em] text-[#0a0a0b]">{name}</div>
        <div className="mt-0.5 text-[12px] font-medium text-neutral-500">{role}</div>
      </div>
    </div>
  );
}
