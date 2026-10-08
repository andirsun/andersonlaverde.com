/**
 * Standard YouTube player (logo, title, red play button). youtube-nocookie.com keeps
 * YouTube's cookies off until the visitor plays it; loading="lazy" defers the iframe
 * until it's near the viewport.
 */
export function VideoEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="embed">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
