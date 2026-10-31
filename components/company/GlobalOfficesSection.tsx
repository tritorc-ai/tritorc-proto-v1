"use client";

import { useState } from "react";
import { OfficesMap, TRITORC_OFFICES } from "./OfficesMap";

const FLAG_CODE: Record<string, string> = {
  India: "in",
  USA: "us",
  UAE: "ae",
  Algeria: "dz",
  Oman: "om",
  Canada: "ca",
  Germany: "de",
};

interface Office {
  city: string;
  country: string;
}

export function GlobalOfficesSection({ offices }: { offices: Office[] }) {
  const [focusCity, setFocusCity] = useState<string | null>(null);

  // Merge Strapi offices with our known lat/lng list — fall back to Strapi data for display
  const displayOffices = offices.length > 0 ? offices : TRITORC_OFFICES;

  function handleChipClick(city: string) {
    // Strip suffixes like "Texas" from "Pasadena, Texas" → match "Pasadena"
    const baseCity = city.split(",")[0].trim();
    setFocusCity(null); // reset first so same city re-triggers effect
    requestAnimationFrame(() => setFocusCity(baseCity));
    // Smooth scroll down to the map
    document.getElementById("offices-map")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <>
      {/* Country chips grid */}
      <div className="grid grid-cols-2 gap-2 tablet:grid-cols-3 tablet:gap-3 tablet-lg:grid-cols-4">
        {displayOffices.map((o) => {
          const baseCity = o.city.split(",")[0].trim();
          const isActive = focusCity === baseCity;
          return (
            <button
              key={o.city + o.country}
              type="button"
              onClick={() => handleChipClick(o.city)}
              className={[
                "flex min-w-0 items-center gap-1.5 rounded-[18px] px-2.5 py-2 text-[11.5px] font-medium leading-tight text-left transition-all duration-200 active:scale-95 tablet:gap-2 tablet:px-4 tablet:py-3 tablet:text-[14px]",
                isActive
                  ? "bg-[#e11d24] text-white shadow-sm"
                  : "bg-[#e4e5e7] text-brand-dark hover:bg-[#d8d9db]",
              ].join(" ")}
            >
              {FLAG_CODE[o.country] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/flags/${FLAG_CODE[o.country]}.png`}
                  alt=""
                  height={14}
                  className="h-[14px] w-auto shrink-0 rounded-[2px] ring-1 ring-black/10"
                />
              )}
              <span className="min-w-0 [text-wrap:balance]">
                {o.city},{" "}
                <span className={isActive ? "text-white/75" : "text-brand-text-secondary"}>
                  {o.country}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Google Map — scrolls into view on chip click */}
      <div id="offices-map">
        <OfficesMap focusCity={focusCity} />
      </div>
    </>
  );
}
