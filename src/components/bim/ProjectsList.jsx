import { executedProjects } from '../../data/BimDeepSections';
import { useState } from 'react';

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

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded-full border text-xs ${active ? 'bg-slate-800 text-white border-slate-800' : 'hover:bg-slate-50'}`}
    >
      {children}
    </button>
  );
}

export default function ProjectsList() {
  return (
    <div className="space-y-4">
      {executedProjects.map((p) => (
        <Project key={p.id} p={p} />
      ))}
    </div>
  );
}

function Project({ p }) {
  const [disc, setDisc] = useState(p.disciplines?.[0] || null);
  const [lod, setLOD] = useState(p.lodLevels?.[0] || null);

  const img = (() => {
    const i = p.images || {};
    if (i.imagesByDisciplineAndLOD?.[disc]?.[lod]) return i.imagesByDisciplineAndLOD[disc][lod];
    if (i.imagesByDiscipline?.[disc]) return i.imagesByDiscipline[disc];
    if (i.imagesByLOD?.[lod]) return i.imagesByLOD[lod];
    return i.main || '';
  })();

  return (
    <Collapse title={p.name} subtitle={p.intro}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-7 space-y-4">
          {p.disciplines?.length ? (
            <Collapse title="Disciplina">
              <div className="flex flex-wrap gap-2">
                {p.disciplines.map((d) => (
                  <Chip key={d} active={d === disc} onClick={() => setDisc(d)}>
                    {d}
                  </Chip>
                ))}
              </div>
            </Collapse>
          ) : null}

          {p.lodLevels?.length ? (
            <Collapse title="Nivel de Detalle (LOD)">
              <div className="flex flex-wrap gap-2">
                {p.lodLevels.map((l) => (
                  <Chip key={l} active={l === lod} onClick={() => setLOD(l)}>
                    {l}
                  </Chip>
                ))}
              </div>
            </Collapse>
          ) : null}

          {p.complexity?.text ? (
            <Collapse title={p.complexity.title || 'Tipo de Edificio y Complejidad'}>
              <p className="text-slate-600 text-sm leading-6">{p.complexity.text}</p>
            </Collapse>
          ) : null}

          <p className="text-xs text-slate-500">Entregables: {(p.deliverables || ['IFC', 'PDF', 'DWG']).join(' / ')}</p>
        </div>

        <div className="lg:col-span-5">
          <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
            <img src={img} alt={p.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </Collapse>
  );
}
