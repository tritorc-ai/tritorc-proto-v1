"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Muted, looping, inline clip that fills its positioned parent. The poster
 * shows until playback starts, and stays if autoplay is blocked or the user
 * prefers reduced motion. Pass `youtubeId` to play a YouTube Short instead of a file.
 */
export function HeroVideo({
  src,
  poster,
  label,
  youtubeId,
}: {
  src?: string;
  poster?: string;
  label?: string;
  youtubeId?: string;
}) {
  if (youtubeId) return <YouTubeShortLoop id={youtubeId} label={label} />;
  return <FileVideo src={src ?? ""} poster={poster} label={label} />;
}

function FileVideo({ src, poster, label }: { src: string; poster?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // React does not reliably reflect the `muted` attribute, and browsers only
    // autoplay muted video, so set the property before playing.
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {
      // autoplay blocked (e.g. data saver): the poster stays visible
    });
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="auto"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

/**
 * A YouTube Short (9:16) played muted on a loop behind the card. The card's own photo sits underneath
 * and stays until YouTube reports that the video is really playing, so there is never a black box.
 * The player is sized 9:16 and centred so it fills a 4:5 card with no bars (the top and bottom are
 * cropped). It is loaded only when the card is near the screen, ignores touches so the card stays
 * tappable, and is skipped for people who prefer reduced motion or are offline.
 */
function YouTubeShortLoop({ id, label }: { id: string; label?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion, getReducedMotion, () => false);

  useEffect(() => {
    const el = wrap.current;
    // No IntersectionObserver (very old browser): the card keeps its photo and the video never loads.
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // YouTube posts the player state to the page once we say we are listening.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || typeof e.data !== "string") return;
      try {
        const msg = JSON.parse(e.data);
        if (msg.event === "infoDelivery" && msg.info?.playerState === 1) setPlaying(true);
      } catch {
        // not a message we understand
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const src =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0&modestbranding=1` +
    `&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1`;

  return (
    <div ref={wrap} className="absolute inset-0 overflow-hidden" aria-hidden={label ? undefined : true}>
      {near && !reduced && (
        <iframe
          ref={frame}
          src={src}
          title={label ?? "Video"}
          allow="autoplay; encrypted-media"
          loading="lazy"
          tabIndex={-1}
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() =>
            frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*")
          }
          className={cn(
            "pointer-events-none absolute left-0 w-full border-0 transition-opacity duration-700",
            playing ? "opacity-100" : "opacity-0",
          )}
          // 9:16 player, 4:5 card: height = width x 16/9 = 142.2% of the card, centred.
          style={{ height: "142.22%", top: "-21.11%" }}
        />
      )}
    </div>
  );
}
