"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { VideoSource } from "@/data/site-content";
import { pickVideoSource, prefersReducedMotion } from "@/lib/animation";

interface FooterMediaProps {
  image: string;
  alt: string;
  video: VideoSource | null;
}

/**
 * Footer backdrop. Plays the boomerang loop when one is configured (lazily,
 * only while on screen); otherwise the still drifts gently back and forth.
 */
export default function FooterMedia({ image, alt, video }: FooterMediaProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const v = videoRef.current;
    if (!root || !v || !video || prefersReducedMotion()) return;

    const onPlaying = () => setPlaying(true);
    const onError = () => setPlaying(false);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("error", onError);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!v.dataset.loaded) {
            const src = pickVideoSource(video);
            if (!src) return;
            v.dataset.loaded = "1";
            v.src = src;
            v.load();
          }
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("error", onError);
      v.pause();
    };
  }, [video]);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 ${playing ? "" : "footer-drift"}`}>
        <Image src={image} alt={alt} fill sizes="100vw" quality={82} className="object-cover object-center" />
      </div>
      {video && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={video.poster}
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-editorial"
          style={{ opacity: playing ? 1 : 0 }}
        />
      )}
    </div>
  );
}
