/** A short muted looping clip, plus the still shown until it plays. */
export interface HeroVideoSource {
  src: string;
  poster?: string;
}

/**
 * Clips that replace a service's still image on its card in the Services list,
 * keyed by service slug. The service's detail page opens with its photo instead.
 * Files live in /public/services; they are trimmed to 10s, silent and H.264 so
 * they autoplay on mobile.
 */
export const HERO_VIDEOS: Record<string, HeroVideoSource> = {
  "hot-tapping-line-stopping": {
    src: "/services/hot-tapping-hero.mp4",
    poster: "/services/hot-tapping-hero-poster.jpg",
  },
};
