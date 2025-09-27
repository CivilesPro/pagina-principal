import { useState } from 'react';
import CollapseItem from '../ui/CollapseItem';
import ImageFrame from '../ui/ImageFrame';
import { executedProjects } from '../../data/BimDeepSections';

function Chip({ active, children, onClick }) {
  return (
    <button
      type="button"
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
        <ProjectItem key={p.id} project={p} />
      ))}
    </div>
  );
}

function ProjectItem({ project }) {
  const [activeDiscipline, setActiveDiscipline] = useState(project.disciplines?.[0] || null);
  const [activeLOD, setActiveLOD] = useState(project.lodLevels?.[0] || null);

  const resolveImage = () => {
    const imgs = project.images || {};
    if (imgs.imagesByDisciplineAndLOD?.[activeDiscipline]?.[activeLOD])
      return imgs.imagesByDisciplineAndLOD[activeDiscipline][activeLOD];
    if (imgs.imagesByDiscipline?.[activeDiscipline]) return imgs.imagesByDiscipline[activeDiscipline];
    if (imgs.imagesByLOD?.[activeLOD]) return imgs.imagesByLOD[activeLOD];
    return imgs.main || '';
  };

  return (
    <CollapseItem title={project.name} subtitle={project.intro} level="main" defaultOpen={false}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-7 space-y-4">
          {project.disciplines?.length ? (
            <CollapseItem title="Disciplina" level="sub">
              <div className="flex flex-wrap gap-2">
                {project.disciplines.map((d) => (
                  <Chip key={d} active={d === activeDiscipline} onClick={() => setActiveDiscipline(d)}>
                    {d}
                  </Chip>
                ))}
              </div>
            </CollapseItem>
          ) : null}

          {project.lodLevels?.length ? (
            <CollapseItem title="Nivel de Detalle (LOD)" level="sub">
              <div className="flex flex-wrap gap-2">
                {project.lodLevels.map((l) => (
                  <Chip key={l} active={l === activeLOD} onClick={() => setActiveLOD(l)}>
                    {l}
                  </Chip>
                ))}
              </div>
            </CollapseItem>
          ) : null}

          {project.complexity?.text ? (
            <CollapseItem title={project.complexity.title || 'Tipo de Edificio y Complejidad'} level="sub" defaultOpen={false}>
              <p className="text-slate-600 text-sm leading-6">{project.complexity.text}</p>
            </CollapseItem>
          ) : null}

          <p className="text-xs text-slate-500">Entregables: {(project.deliverables || ['IFC', 'PDF', 'DWG']).join(' / ')}</p>
        </div>

        <div className="lg:col-span-5">
          <ImageFrame>
            <img src={resolveImage()} alt={project.name} className="w-full h-full object-cover" />
          </ImageFrame>
        </div>
      </div>
    </CollapseItem>
  );
}
