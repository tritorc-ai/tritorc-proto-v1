import { Anybody, Chakra_Petch, Plus_Jakarta_Sans } from "next/font/google";

/** Plus Jakarta Sans, used by the Company and Library screens. */
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

/** Startup splash: technical geometric wordmark. */
export const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["700"], // heaviest weight Google Fonts offers for Chakra Petch
  display: "swap",
});

/** Startup splash footer: extra-wide ("wdth" axis) lettering. */
export const anybody = Anybody({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});
