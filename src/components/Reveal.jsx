import React from "react";

/**
 * Reveal: anima su contenido al entrar/salir del viewport.
 * Props:
 *  - as: contenedor (div/section/...)
 *  - variant: "fade-up" | "fade-in" | "slide-left" | "slide-right"
 *  - delay: ms
 *  - threshold: 0..1 (cuánta porción debe verse)
 *  - rootMargin: "top right bottom left" (para adelantar/retrasar el disparo)
 *  - once: si true, anima solo la 1ª vez; si false, también se oculta al salir
 *  - duration: ms
 */
export default function Reveal({
  as: Tag = "div",
  variant = "fade-up",
  delay = 0,
  threshold = 0.25,
  rootMargin = "-12% 0px -12% 0px",
  once = false, // ⬅️ ahora por defecto vuelve a ocultar/al mostrar
  duration = 700,
  className = "",
  children,
  ...rest
}) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Respeto de accesibilidad
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  const variants = {
    "fade-up": { x: 0, y: 20 },
    "fade-in": { x: 0, y: 0 },
    "slide-left": { x: -24, y: 0 },
    "slide-right": { x: 24, y: 0 },
  };
  const { x, y } = variants[variant] || variants["fade-up"];

  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translate3d(0,0,0)" : `translate3d(${x}px, ${y}px, 0)`,
    transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
    transitionDelay: `${delay}ms`,
    willChange: "opacity, transform",
  };

  return (
    <Tag ref={ref} style={style} className={className} {...rest}>
      {children}
    </Tag>
  );
}
