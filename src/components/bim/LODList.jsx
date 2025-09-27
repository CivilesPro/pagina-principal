import { useMemo, useRef, useEffect, useState } from "react";
import { lodItems } from "@/data/BimDeepSections";

const WHATS_NUMBER = "573127437848";
const mkWsp = (msg) => `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(msg)}`;

export function filterLODItemsByQuery(items = lodItems, query = "") {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((it) => (it.title + it.short + it.desc).toLowerCase().includes(q));
}

export function filterLODItemsByLevels(items = lodItems, activeLevels = new Set()) {
  if (!activeLevels || !activeLevels.size) return items;
  return items.filter((it) => activeLevels.has(it.id));
}

export function expandAllLODItems(items = lodItems) {
  return items.reduce((acc, item) => {
    acc[item.id] = true;
    return acc;
  }, {});
}

export function collapseAllLODItems(items = lodItems) {
  return items.reduce((acc, item) => {
    acc[item.id] = false;
    return acc;
  }, {});
}

function Collapse({ title, subtitle, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <div className="rounded-xl border border-slate-200/70 bg-slate-50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-3 px-3"
      >
        <div className="text-left">
          <div className="text-slate-800 font-semibold">{title}</div>
          {subtitle && <div className="text-slate-500 text-sm">{subtitle}</div>}
        </div>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

export default function LODList({ query = "", activeLevels = new Set(), expandAll = false, onItemRef }) {
  const refs = useRef({});

  const filtered = useMemo(() => {
    const byQuery = filterLODItemsByQuery(lodItems, query);
    return filterLODItemsByLevels(byQuery, activeLevels);
  }, [query, activeLevels]);

  useEffect(() => {
    if (!onItemRef) return;
    const map = filtered.reduce((acc, item) => {
      acc[item.id] = () => {
        const el = refs.current[item.id];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      };
      return acc;
    }, {});
    onItemRef(map);
  }, [filtered, onItemRef]);

  return (
    <div className="space-y-4">
      {filtered.map((item) => (
        <Collapse
          key={item.id}
          title={
            <span>
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">🧠</span>
              {item.title}
            </span>
          }
          subtitle={item.short}
          defaultOpen={expandAll}
        >
          <div
            ref={(el) => {
              if (el) {
                refs.current[item.id] = el;
              } else {
                delete refs.current[item.id];
              }
            }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
          >
            <div className="lg:col-span-7">
              <p className="text-slate-600 text-sm md:text-base leading-6">{item.desc}</p>
              <a
                href={mkWsp(item.whatsMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-xs text-slate-500 underline underline-offset-4 hover:text-slate-700"
              >
                ¿Este nivel encaja con tu proyecto? Escríbenos por WhatsApp
              </a>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={item.images?.[0]}
                  alt="Visualización LOD"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </Collapse>
      ))}
    </div>
  );
}
