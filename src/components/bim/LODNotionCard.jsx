import { useEffect, useMemo, useRef, useState } from "react";
import { lodItems } from "@/data/BimDeepSections";

const WHATS_NUMBER = "573127437848";
const mkWsp = (msg) => `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(msg)}`;

const DISCLOSURE_ICON = (
  <svg viewBox="0 0 12 8" aria-hidden="true" className="h-3 w-3 fill-none stroke-current">
    <path d="M10.5 1.5 6 6 1.5 1.5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function NeutralIcon() {
  return (
    <span
      aria-hidden
      className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400"
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4">
        <path
          d="M5.5 3.75h9a1.75 1.75 0 0 1 1.75 1.75v9a1.75 1.75 0 0 1-1.75 1.75h-9A1.75 1.75 0 0 1 3.75 14.5v-9A1.75 1.75 0 0 1 5.5 3.75Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

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
    setThumbSelection((prev) => {
      if (prev[activeId] != null) return prev;
      return { ...prev, [activeId]: 0 };
    });
  }, [activeId]);

  const handleSelect = (id) => {
    setActiveId(id);
    setOpenId(id);
  };

  const handleThumbSelect = (id, index) => {
    setThumbSelection((prev) => ({ ...prev, [id]: index }));
  };

  return (
    <section className="lg:col-span-2 rounded-[18px] border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <header className="max-w-2xl">
        <h3 className="text-[22px] font-bold leading-tight text-slate-900 md:text-[24px]">LOD – Niveles de Desarrollo</h3>
        <p className="mt-1 text-[15px] text-slate-500 md:text-base">
          Ajustamos el nivel de detalle del modelo según la etapa y las decisiones que necesita tu proyecto.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
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
                      isActive ? "bg-slate-100" : "bg-white"
                    } ${isActive ? "" : "hover:bg-slate-50"}`}
                    aria-expanded={isOpen}
                    aria-controls={`lod-detail-${item.id}`}
                  >
                    <NeutralIcon />
                    <span className="flex-1 text-left">
                      <span className="block text-[15px] font-semibold text-slate-900 md:text-base">{item.title}</span>
                      <span className="mt-1 block text-sm font-normal leading-5 text-slate-500">{item.short}</span>
                    </span>
                    <span
                      aria-hidden
                      className={`ml-3 mt-1 flex h-5 w-5 items-center justify-center text-slate-400 transition-transform duration-300 ease-in-out ${
                        isOpen ? "rotate-180" : "rotate-0"
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

        <div className="lg:col-span-5">
          <div className="aspect-[16/9] overflow-hidden rounded-[18px] border border-[#E5E7EB] bg-[#F3F4F6]">
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
                    key={image}
                    type="button"
                    onClick={() => active && handleThumbSelect(active.id, index)}
                    className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-[12px] border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${
                      selected ? "border-slate-400" : "border-[#E5E7EB] hover:border-slate-300"
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
