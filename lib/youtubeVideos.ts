import type { LibraryAsset } from "@/lib/mock/content";

/**
 * Tritorc's own YouTube videos shown in the Library (Video tab). Each one opens in an in-app YouTube
 * player (iframe with the normal controls). The title is only used for search and screen readers; the
 * Library shows the picture, not the name.
 *
 * To add one: paste the part after youtu.be/ (or watch?v=) as `id`. The thumbnail is YouTube's own
 * full-size picture for that video, so nothing has to be uploaded.
 */
const LIBRARY_YOUTUBE_VIDEOS: { id: string; title: string; categoryLabel: string }[] = [
  { id: "zWvrrXhzcxE", title: "Flange Management Tools for Oil & Gas Shutdowns", categoryLabel: "Flange Management" },
  { id: "T-INgo5-VvY", title: "Square Drive Hydraulic Torque Wrench, TSL Series", categoryLabel: "Hydraulic Torque Wrenches and Pumps" },
  { id: "oLQYxEzzZvM", title: "Hydraulic Bolt Tensioner Assembly: Step-by-Step Guide", categoryLabel: "Hydraulic Bolt Tensioners" },
  { id: "duJdVg2rxJo", title: "Spring Return Bolt Tensioner, SLT Series", categoryLabel: "Hydraulic Bolt Tensioners" },
];

/** YouTube's full-size (1280x720) picture for a video. */
export function youtubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

export function getYoutubeLibraryAssets(): LibraryAsset[] {
  return LIBRARY_YOUTUBE_VIDEOS.map((v) => ({
    id: `youtube-${v.id}`,
    type: "Video",
    title: v.title,
    categoryLabel: v.categoryLabel,
    youtubeId: v.id,
    directImageUrl: youtubeThumbnail(v.id),
  }));
}
