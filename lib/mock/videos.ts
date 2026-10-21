// Curated real Strapi Media Library video filenames (Aug 2026 batch),
// resolved to live URLs by lib/strapi.ts's getVideoUrls() — same pattern as
// lib/mock/images.ts's IMAGE_NAMES/getImageUrls().
export const VIDEO_NAMES = {
  svcHotTapping: "Hot Tapping and Line stopping services.mp4",
  prodPipeCutting: "Pipe Cutting and Bevelling machine TCSL & TTCB Series.mp4",
  prodBtl: "Top Side Hydraulic Bolt Tensioner BTL Series.mp4",
  prodTubeBeveling: "Tube _ Pipe Bevelling Machine (TFM Series) .mp4",
  prodTubeRemoval: "Tube Spinner Pneumatic Tube Removal Machine.mp4",
} as const;

export type VideoKey = keyof typeof VIDEO_NAMES;
