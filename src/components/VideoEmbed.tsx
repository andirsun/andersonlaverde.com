"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Click-to-play YouTube embed. Until the visitor presses play the page shows only the
 * thumbnail, so YouTube's player and trackers don't load on every visit. The iframe uses
 * youtube-nocookie.com (privacy-enhanced mode).
 */
export function VideoEmbed({ id, title, thumbnail }: { id: string; title: string; thumbnail: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="embed">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`Reproducir: ${title}`}>
          <Image src={thumbnail} alt="" width={1280} height={720} />
          {/* U+FE0E keeps ▶ as a text glyph, not an emoji */}
          <span className="play">{"\u25B6\uFE0E"} play</span>
        </button>
      )}
    </div>
  );
}
