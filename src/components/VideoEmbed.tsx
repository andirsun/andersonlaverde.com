/**
 * Standard YouTube player (logo, title, red play button). youtube-nocookie.com keeps
 * YouTube's cookies off until the visitor plays it; loading="lazy" defers the iframe
 * until it's near the viewport. `autoplay` is for a video the visitor just picked.
 */
export function VideoEmbed({ id, title, autoplay = false }: { id: string; title: string; autoplay?: boolean }) {
  return (
    <div className="embed">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0${autoplay ? "&autoplay=1" : ""}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
