import { lodItems } from '../../data/BimDeepSections';
import { useState } from 'react';

const WHATS_NUMBER = '573127437848';
const mkWsp = (msg) => `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(msg)}`;

function Collapse({ title, subtitle, children }) {
  const [open, setOpen] = useState(false);
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
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

export default function LODList() {
  return (
    <div className="space-y-4">
      {lodItems.map((item) => (
        <Collapse
          key={item.id}
          title={
            <span>
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">🧠</span>
              {item.title}
            </span>
          }
          subtitle={item.short}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
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
