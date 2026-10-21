"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Product image that settles in once loaded: fades up from a soft blur and a
 * hair of extra scale, so cards never pop in. Sits on a neutral studio-grey
 * backdrop that also shows behind transparent product cut-outs.
 */
export function CardImage({
  src,
  alt,
  sizes,
}: {
  src?: string;
  alt: string;
  sizes: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#f6f6f5_0%,#e9e9e7_100%)]">
      {/* Outer layer handles the press/hover zoom so it never fights the load-in transition */}
      <div className="absolute inset-0 transition-transform duration-[900ms] ease-(--ease-premium) group-hover:scale-[1.04] group-active:scale-[1.04]">
        {src && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            onLoad={() => setLoaded(true)}
            className={cn(
              "object-cover transition-[opacity,filter,transform] duration-700 ease-(--ease-premium) motion-reduce:transition-none",
              loaded
                ? "scale-100 opacity-100 blur-0"
                : "scale-[1.04] opacity-0 blur-md",
            )}
          />
        )}
      </div>
    </div>
  );
}
