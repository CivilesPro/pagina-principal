import React from "react";

/**
 * Reveal: anima su contenido cuando entra al viewport.
 * Props:
 *  - as: tag contenedor (div/section/etc)
 *  - variant: "fade-up" | "fade-in" | "slide-left" | "slide-right"
 *  - delay: ms (stagger)
 *  - threshold: porcentaje visible para disparar (0..1)
 *  - once: si true, no se oculta al salir (default true)
 *  - duration: ms transición
 */
export default function Reveal({
  as: Tag = "div",
  variant = "fade-up",
  delay = 0,
  threshold = 0.2,
  once = true,
  duration = 700,
  className = "",
  children,
  ...rest
}) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Si el usuario prefiere menos animación, mostrar directo
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
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  // Variantes
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
