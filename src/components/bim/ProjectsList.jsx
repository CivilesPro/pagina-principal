import { useMemo, useState } from "react"
import { executedProjects } from "../../data/BimDeepSections"
import CollapseItem from "../ui/CollapseItem"
import ImageFrame from "../ui/ImageFrame"

function OptionChips({ options = [], active, onChange }) {
  if (!options.length) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option === active
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full border px-2 py-1 text-xs transition-colors ${
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

function ProjectItem({ project }) {
  const [activeDiscipline, setActiveDiscipline] = useState(project.disciplines?.[0] ?? null)
  const [activeLOD, setActiveLOD] = useState(project.lodLevels?.[0] ?? null)

  const resolvedImage = useMemo(() => {
    const { images } = project
    if (!images) return null

    if (activeDiscipline && activeLOD) {
      const byDisciplineAndLOD = images.imagesByDisciplineAndLOD?.[activeDiscipline]?.[activeLOD]
      if (byDisciplineAndLOD) {
        return byDisciplineAndLOD
      }
    }

    if (activeDiscipline) {
      const byDiscipline = images.imagesByDiscipline?.[activeDiscipline]
      if (byDiscipline) {
        return byDiscipline
      }
    }

    if (activeLOD) {
      const byLOD = images.imagesByLOD?.[activeLOD]
      if (byLOD) {
        return byLOD
      }
    }

    return images.main ?? null
  }, [project, activeDiscipline, activeLOD])

  return (
    <CollapseItem title={project.name} level="main" defaultOpen={false}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-4 text-sm leading-6 text-slate-600 md:text-base lg:col-span-7">
          <p>{project.intro}</p>

          <CollapseItem
            title="Disciplina"
            subtitle="Selecciona la disciplina que quieres analizar"
            level="sub"
          >
            <OptionChips options={project.disciplines} active={activeDiscipline} onChange={setActiveDiscipline} />
          </CollapseItem>

          <CollapseItem
            title="Nivel de Detalle (LOD)"
            subtitle="Explora cómo evoluciona el modelo"
            level="sub"
          >
            <OptionChips options={project.lodLevels} active={activeLOD} onChange={setActiveLOD} />
          </CollapseItem>

          <CollapseItem
            title={project.complexity?.title ?? "Tipo de Edificio y Complejidad"}
            subtitle="Contexto del proyecto"
            level="sub"
          >
            <p className="text-xs leading-5 text-slate-600">{project.complexity?.text}</p>
          </CollapseItem>

          <p className="text-xs text-slate-500">Entregables: {(project.deliverables ?? ["IFC", "PDF", "DWG"]).join(" / ")}</p>
        </div>
        <div className="lg:col-span-5">
          <ImageFrame>
            {resolvedImage ? (
              <img src={resolvedImage} alt={project.name} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">Sin vista disponible</div>
            )}
          </ImageFrame>
        </div>
      </div>
    </CollapseItem>
  )
}

export default function ProjectsList() {
  return (
    <div className="space-y-4 md:space-y-5">
      {executedProjects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  )
}
