import { useEffect, useMemo, useRef, useState } from "react";
import { lodItems } from "@/data/BimDeepSections";

const WHATS_NUMBER = "573127437848";
const mkWsp = (msg) => `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(msg)}`;

const DISCLOSURE_ICON = (
  <svg viewBox="0 0 12 8" aria-hidden="true" className="h-3 w-3 fill-none stroke-current">
    <path d="M10.5 1.5 6 6 1.5 1.5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Íconos neutros por LOD */
function LODIcon({ id }) {
  const map = {
    lod100: (
      // Idea
      <svg viewBox="0 0 24 24" className="h-4 w-4">
        <path fill="currentColor" d="M9 21h6v-1H9v1Zm3-19a7 7 0 0 0-4.9 11.9c.6.6.9 1.3.9 2.1V17h6v-1c0-.8.3-1.5.9-2.1A7 7 0 0 0 12 2Z"/>
      </svg>
    ),
    lod200: (
      // Esquemático
      <svg viewBox="0 0 24 24" className="h-4 w-4">
        <path fill="currentColor" d="m3 17.25 8.88-8.88 3.75 3.75L6.75 21H3v-3.75Zm13.59-8.59 1.41-1.41 1.75 1.75-1.41 1.41-1.75-1.75Z"/>
      </svg>
    ),
    lod300: (
      // Coordinado
      <svg viewBox="0 0 24 24" className="h-4 w-4">
        <path fill="currentColor" d="M12 2 4 6v8l8 4 8-4V6l-8-4Zm0 2.2 5.5 2.75L12 9.7 6.5 6.95 12 4.2Z"/>
      </svg>
    ),
    lod400: (
      // Construcción / prefabricación
      <svg viewBox="0 0 24 24" className="h-4 w-4">
        <path fill="currentColor" d="M22 6.5 17.5 11l-2.5-2.5L19.5 4A6 6 0 0 0 10 10.2L2 18v4h4l8.2-8A6 6 0 0 0 22 6.5Z"/>
      </svg>
    ),
    lod500: (
      // Operación y mantenimiento
      <svg viewBox="0 0 24 24" className="h-4 w-4">
        <path fill="currentColor" d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm8.6 3.5a7.8 7.8 0 0 0-.5-1.2l2-1.6-2-3.4-2.4 1a7.8 7.8 0 0 0-1-.6l-.4-2.5H9.7l-.4 2.5c-.3.2-.6.4-.9.6l-2.4-1-2 3.4 2 1.6c-.2.4-.4.8-.5 1.2l-2.5.4v3.9l2.5.4c.1.4.3.8.5 1.2l-2 1.6 2 3.4 2.4-1c.3.2.6.4.9.6l.4 2.5h3.9l.4-2.5c.3-.2.6-.4 1-.6l2.4 1 2-3.4-2-1.6c.2-.4.4-.8.5-1.2l2.5-.4v-3.9l-2.5-.4Z"/>
      </svg>
    ),
  };
  const icon = map[id] || map.lod300;
  return (
    <span aria-hidden className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400">
      {icon}
    </span>
  );
}

/* Colapso con animación de altura */
function Collapse({ isOpen, children, id }) {
  const wrapperRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setMaxHeight(0);
      return;
    }
    const node = wrapperRef.current;
    if (!node) return;
    const update = () => setMaxHeight(node.scrollHeight);
    update();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(update);
      observer.observe(node);
      return () => observer.disconnect();
    }
  }, [isOpen, children]);

  return (
    <div
      id={id}
      className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      style={{ maxHeight: isOpen ? `${maxHeight}px` : "0px" }}
      aria-hidden={!isOpen}
    >
      <div ref={wrapperRef}>{children}</div>
    </div>
  );
}

export default function LODNotionCard() {
  const [activeId, setActiveId] = useState(lodItems?.[0]?.id ?? null);
  const [openId, setOpenId] = useState(null);
  const [thumbSelection, setThumbSelection] = useState({});

  const active = useMemo(() => lodItems.find((item) => item.id === activeId) ?? null, [activeId]);
  const activeImages = active?.images ?? [];
  const currentIndex = activeId && thumbSelection[activeId] != null ? thumbSelection[activeId] : 0;
  const currentImage = activeImages[currentIndex] ?? null;

  useEffect(() => {
    if (!activeId) return;
    setThumbSelection((prev) => (prev[activeId] != null ? prev : { ...prev, [activeId]: 0 }));
  }, [activeId]);

  const handleSelect = (id) => {
    setActiveId(id);
    // toggle exclusivo: si repites el mismo, se cierra
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleThumbSelect = (id, index) => {
    setThumbSelection((prev) => ({ ...prev, [id]: index }));
  };

  return (
    <section className="lg:col-span-2 rounded-[18px] border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      {/* Altura fija en desktop: la card ya no cambia de tamaño */}
      <div className="mt-1 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 lg:h-[668px]">
        {/* Columna izquierda (40%): header arriba + items abajo con espacio entre y scroll */}
        <div className="lg:col-span-5 grid h-full grid-rows-[auto,1fr] content-between">
          {/* Header dentro del costado (arriba) */}
          <header className="max-w-2xl pb-6 md:pb-7 lg:pb-8">
            <h3 className="text-[22px] md:text-[24px] font-bold leading-tight text-slate-900">
              LOD – Niveles de Desarrollo
            </h3>
            <p className="mt-1 text-[15px] md:text-base text-slate-500">
              Ajustamos el nivel de detalle del modelo según la etapa y las decisiones que necesita tu proyecto.
            </p>
          </header>

          {/* Lista (debajo) con scroll interno */}
          <div className="min-h-0 overflow-y-auto pr-1">
            <ul className="flex flex-col gap-1">
              {lodItems.map((item) => {
                const isActive = item.id === activeId;
                const isOpen = item.id === openId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item.id)}
                      className={`group flex w-full items-start gap-3 rounded-[14px] px-4 py-3 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${
                        isActive ? "bg-slate-100" : "bg-white hover:bg-slate-50"
                      }`}
                      aria-expanded={isOpen}
                      aria-controls={`lod-detail-${item.id}`}
                    >
                      <LODIcon id={item.id} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] md:text-base font-semibold text-slate-900">
                          {item.title}
                        </span>
                        
                      </span>
                      <span
                        aria-hidden
                        className={`ml-3 mt-1 flex h-5 w-5 items-center justify-center text-slate-400 transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        {DISCLOSURE_ICON}
                      </span>
                    </button>

                    <Collapse isOpen={isOpen} id={`lod-detail-${item.id}`}>
                      <div className="px-4 pb-4 pt-0 text-sm leading-6 text-slate-600">
                        <p>{item.desc}</p>
                        <a
                          href={mkWsp(item.whatsMsg || `Hola, me interesa ${item.title}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block text-xs text-slate-500 underline underline-offset-4 hover:text-slate-600"
                        >
                          ¿Este nivel encaja con tu proyecto? Escríbenos por WhatsApp
                        </a>
                      </div>
                    </Collapse>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Columna derecha (60%): preview ocupa todo el alto */}
        <div className="lg:col-span-7 h-full flex flex-col">
          <div className="flex-1 overflow-hidden rounded-[18px] border border-[#E5E7EB] bg-[#F3F4F6]">
            {currentImage ? (
              <img src={currentImage} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-400">
                Visualización LOD
              </div>
            )}
          </div>

          {activeImages.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {activeImages.map((image, index) => {
                const selected = index === currentIndex;
                return (
                  <button
                    key={`${active?.id || "lod"}-${index}`}
                    type="button"
                    onClick={() => active && handleThumbSelect(active.id, index)}
                    className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-[12px] border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${
                      selected ? "border-slate-800" : "border-[#E5E7EB] hover:border-slate-300"
                    }`}
                    aria-pressed={selected}
                    aria-label={`Ver imagen ${index + 1} de ${active?.title ?? "LOD"}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
