import React from "react";

export default function VideoLoop({ webm, mp4, poster, className, onError }) {
  const ref = React.useRef(null);
  const [loaded, setLoaded] = React.useState(false);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (typeof IntersectionObserver === "undefined") {
      if (!loaded) {
        const sources = [];
        if (webm) {
          const source = document.createElement("source");
          source.src = webm;
          source.type = "video/webm";
          sources.push(source);
        }
        if (mp4) {
          const source = document.createElement("source");
          source.src = mp4;
          source.type = "video/mp4";
          sources.push(source);
        }
        sources.forEach((source) => v.appendChild(source));
        v.load();
        setLoaded(true);
      }
      return;
    }

    const onIntersect = ([entry]) => {
      if (entry.isIntersecting) {
        if (!loaded) {
          const sources = [];
          if (webm) {
            const source = document.createElement("source");
            source.src = webm;
            source.type = "video/webm";
            sources.push(source);
          }
          if (mp4) {
            const source = document.createElement("source");
            source.src = mp4;
            source.type = "video/mp4";
            sources.push(source);
          }
          sources.forEach((source) => v.appendChild(source));
          v.load();
          setLoaded(true);
        }
        if (!prefersReduced) {
          v.play().catch(() => {});
        }
      } else {
        v.pause();
      }
    };

    const observer = new IntersectionObserver(onIntersect, {
      threshold: 0.4,
      rootMargin: "-10% 0px -10% 0px",
    });

    observer.observe(v);
    return () => observer.disconnect();
  }, [webm, mp4, loaded, prefersReduced]);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      onError={onError}
    />
  );
}
