import React from "react";

export default function VideoLoop({ webm, mp4, poster, className }) {
  const ref = React.useRef(null);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (typeof IntersectionObserver === "undefined") {
      if (!prefersReduced) {
        v.play().catch(() => {});
      }
      return;
    }

    const onIntersect = ([entry]) => {
      if (entry.isIntersecting) {
        if (!prefersReduced) {
          v.play().catch(() => {});
        }
      } else {
        v.pause();
      }
    };

    const observer = new IntersectionObserver(onIntersect, {
      threshold: 0.15,
    });

    observer.observe(v);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      onLoadedData={(e) => {
        if (!prefersReduced) e.currentTarget.play().catch(() => {});
      }}
    >
      {webm && <source src={webm} type="video/webm" />}
      {mp4 && <source src={mp4} type="video/mp4" />}
    </video>
  );
}
