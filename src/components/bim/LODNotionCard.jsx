import { useMemo, useState } from 'react';
import { lodItems } from '@/data/BimDeepSections';

const WHATS_NUMBER = '573127437848';
const mkWsp = (msg) => `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(msg)}`;

export default function LODNotionCard() {
  // LOD activo (para el preview de la derecha)
  const [activeId, setActiveId] = useState(lodItems?.[0]?.id || null);
  const [openDetail, setOpenDetail] = useState(() => new Set()); // ids abiertos (ver detalle)
  const [imageOverrides, setImageOverrides] = useState({});

  const active = useMemo(() => lodItems.find((x) => x.id === activeId) || null, [activeId]);
  const displayImages = active ? imageOverrides[active.id] || active.images || [] : [];

  const toggleDetail = (id) => {
    const n = new Set(openDetail);
    n.has(id) ? n.delete(id) : n.add(id);
    setOpenDetail(n);
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-8 lg:col-span-2">
      {/* Header del card */}
      <h3 className="text-xl md:text-2xl font-bold text-slate-900">LOD – Niveles de Desarrollo</h3>
      <p className="mt-1 text-slate-600">
        Adaptamos el nivel de detalle según la etapa del proyecto.
      </p>

      {/* Layout Notion: lista izquierda (60%) + preview derecha (40%) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Lista */}
        <div className="lg:col-span-7">
          <ul className="space-y-3">
            {lodItems.map((item) => {
              const isOpen = openDetail.has(item.id);
              const isActive = item.id === activeId;
              return (
                <li
                  key={item.id}
                  className={`rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 ${
                    isActive ? 'ring-1 ring-emerald-300/50' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className="w-full text-left px-4 py-3 flex items-start gap-3"
                    aria-pressed={isActive}
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">🧠</span>
                    <div>
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-sm text-slate-600">{item.short}</div>
                    </div>
                    <div className="ml-auto pl-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDetail(item.id);
                        }}
                        className="text-slate-500 hover:text-slate-700"
                        aria-expanded={isOpen}
                        aria-controls={`lod-detail-${item.id}`}
                        title="Ver detalle"
                      >
                        {isOpen ? '▴' : '▾'}
                      </button>
                    </div>
                  </button>

                  {/* Detalle plano (sin sub-card) */}
                  {isOpen && (
                    <div id={`lod-detail-${item.id}`} className="px-4 pb-4 -mt-1">
                      <p className="text-sm leading-6 text-slate-700">{item.desc}</p>
                      <a
                        href={mkWsp(item.whatsMsg || `Hola, me interesa ${item.title}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-slate-500 underline underline-offset-4 hover:text-slate-700"
                      >
                        ¿Este nivel encaja con tu proyecto? Escríbenos por WhatsApp
                      </a>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Preview derecha */}
        <div className="lg:col-span-5">
          <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200/60">
            {displayImages?.[0] ? (
              <img
                src={displayImages[0]}
                alt={active?.title || 'Visualización LOD'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
                Visualización LOD
              </div>
            )}
          </div>
          {/* Mini thumbs opcionales */}
          {displayImages.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {displayImages.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!active) return;
                    // Reordenar para mostrar elegida primero
                    setImageOverrides((prev) => {
                      const base = prev[active.id] || active.images || [];
                      const reordered = [src, ...base.filter((s) => s !== src)];
                      return {
                        ...prev,
                        [active.id]: reordered,
                      };
                    });
                  }}
                  className="h-12 w-20 shrink-0 rounded-lg overflow-hidden ring-1 ring-slate-200/70"
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
