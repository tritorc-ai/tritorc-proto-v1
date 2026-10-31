/**
 * A short muted looping clip for a service card. Either a file in /public (`src`, with the still
 * shown until it plays) or a YouTube Short (`youtubeId`), which plays muted and looped inside the card.
 */
export interface HeroVideoSource {
  src?: string;
  poster?: string;
  youtubeId?: string;
}

/**
 * Clips that replace a service's still image on its card in the Services list, keyed by service
 * slug. The service's detail page opens with its photo instead. Files live in /public/services;
 * they are trimmed to 10s, silent and H.264 so they autoplay on mobile.
 * To add one: a file -> `{ src, poster }`; a YouTube Short -> `{ youtubeId }` (the part after /shorts/).
 */
export const HERO_VIDEOS: Record<string, HeroVideoSource> = {
  "hot-tapping-line-stopping": {
    src: "/services/hot-tapping-hero.mp4",
    poster: "/services/hot-tapping-hero-poster.jpg",
  },
  // "Pipe Freezing Line Isolation Explained | TRITORC Cryogenic Freezing Technology", 0:22 to 0:29 only
  // (nitrogen tank, hose and freeze jacket on a pipe). 7s, silent, H.264, 720x900: the 16:9 picture sits
  // whole in the middle of a 4:5 frame with a blurred copy of itself above and below.
  "nitrogen-purging-preservation": {
    src: "/services/nitrogen-purging-hero.mp4",
    poster: "/services/nitrogen-purging-poster.jpg",
  },
  // Tritorc Equipments channel: "Hydraulic bolt tensioner at work" (Short)
  "onsite-controlled-bolting": { youtubeId: "fuR72ytB98Q" },
  // Tritorc Equipments channel: "TRITORC TSF Series | Cold Pipe Cutting & Bevelling Machine" (Short).
  // This is the front card of the Onsite Machining group.
  "pipeline-coldcutting-bevelling": { youtubeId: "rU15bA8lUcY" },
};
