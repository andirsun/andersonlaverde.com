"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import T from "@/components/T";
import { VideoEmbed } from "@/components/VideoEmbed";

/** Dates come preformatted from the server, so server and client render the same text. */
export type PickerVideo = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  date: { en: string; es: string };
};

/**
 * The newest video plays on the page; picking another from the list swaps it into the
 * player and starts it, so nobody has to leave for YouTube to watch.
 */
export default function VideoPicker({ videos }: { videos: PickerVideo[] }) {
  const [current, setCurrent] = useState(videos[0]);
  const [picked, setPicked] = useState(false);
  const player = useRef<HTMLDivElement>(null);

  const pick = (video: PickerVideo) => {
    setCurrent(video);
    setPicked(true);
    // On a phone the list sits under the player; bring the player back into view.
    if (player.current && player.current.getBoundingClientRect().top < 0) {
      player.current.scrollIntoView({ block: "start" });
    }
  };

  return (
    <section className="vidtop">
      <div className="vidmain" ref={player}>
        <VideoEmbed key={current.id} id={current.id} title={current.title} autoplay={picked} />
        <span className="eyebrow">
          {current.id === videos[0].id ? <T en="Latest" es="Último" /> : <T en="Playing" es="Reproduciendo" />}
          {" · "}
          <T en={current.date.en} es={current.date.es} />
        </span>
        <h2>{current.title}</h2>
        <a className="ytlink" href={current.url} target="_blank" rel="noreferrer">
          <T en="Watch on YouTube ↗" es="Ver en YouTube ↗" />
        </a>
      </div>
      <ul className="vidlist" aria-label="Videos">
        {videos.map((video) => (
          <li key={video.id}>
            <button
              type="button"
              className="vid"
              aria-current={video.id === current.id ? "true" : undefined}
              onClick={() => pick(video)}
            >
              <span className="thumb">
                <Image src={video.thumbnail} alt="" width={480} height={360} />
              </span>
              <span>
                <span className="t">{video.title}</span>
                <span className="m">
                  {video.id === current.id ? (
                    <T en="Playing now" es="Reproduciendo" />
                  ) : (
                    <T en={video.date.en} es={video.date.es} />
                  )}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
