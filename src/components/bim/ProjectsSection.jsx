import { useMemo, useState } from "react"
import CollapseItem from "../ui/CollapseItem"
import ImageFrame from "../ui/ImageFrame"
import { executedProjects, projectsSection } from "../../data/BimDeepSections"

function OptionChips({ options, active, onChange }) {
  if (!options?.length) {
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
            className={`rounded-full border px-2 py-1 text-xs transition ${
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
  const [activeComplexity, setActiveComplexity] = useState(project.complexity?.options?.[0] ?? null)

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

    if (activeComplexity) {
      const byComplexity = images.imagesByComplexity?.[activeComplexity]
      if (byComplexity) {
        return byComplexity
      }
    }

    return images.main ?? null
  }, [project, activeDiscipline, activeLOD, activeComplexity])

  return (
    <CollapseItem title={project.name} level="main" defaultOpen={false}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-4 lg:col-span-7">
          <p className="text-sm leading-6 text-slate-600 md:text-base">{project.intro}</p>

          <CollapseItem
            title="Disciplina"
            subtitle="Selecciona la disciplina que quieres analizar"
            level="sub"
            defaultOpen={false}
          >
            <OptionChips options={project.disciplines} active={activeDiscipline} onChange={setActiveDiscipline} />
          </CollapseItem>

          <CollapseItem
            title="Nivel de Detalle (LOD)"
            subtitle="Explora cómo evoluciona el modelo"
            level="sub"
            defaultOpen={false}
          >
            <OptionChips options={project.lodLevels} active={activeLOD} onChange={setActiveLOD} />
          </CollapseItem>

          <CollapseItem
            title={project.complexity?.title ?? "Tipo de Edificio y Complejidad"}
            subtitle="Contexto del proyecto"
            level="sub"
            defaultOpen={false}
          >
            <div className="space-y-2 text-xs text-slate-600">
              <p className="leading-5">{project.complexity?.text}</p>
              <OptionChips
                options={project.complexity?.options}
                active={activeComplexity}
                onChange={setActiveComplexity}
              />
            </div>
          </CollapseItem>

          <p className="text-xs text-slate-500">Entregables: {project.deliverables?.join(" / ") ?? "IFC / PDF / DWG"}</p>
        </div>
        <div className="lg:col-span-5">
          <ImageFrame>
            {resolvedImage ? (
              <img src={resolvedImage} alt={project.name} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                Sin vista disponible
              </div>
            )}
          </ImageFrame>
        </div>
      </div>
    </CollapseItem>
  )
}

export default function ProjectsSection() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
      <header className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">{projectsSection.title}</h3>
        <p className="text-sm text-slate-600 md:text-base">{projectsSection.summary}</p>
      </header>

      <div className="mt-6 space-y-4 md:space-y-5">
        {executedProjects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
