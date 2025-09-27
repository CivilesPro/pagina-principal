import { useMemo, useState } from "react"
import CollapseItem from "../ui/CollapseItem"
import MediaWithText from "../ui/MediaWithText"
import { executedProjects, projectsSection } from "../../data/BimDeepSections"

function ImageFrame({ src, alt }) {
  return (
    <div className="overflow-hidden rounded-xl bg-slate-100">
      <div className="aspect-video w-full">
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">Sin vista disponible</div>
        )}
      </div>
    </div>
  )
}

function OptionPills({ options, active, onChange }) {
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
            className={`rounded-full border px-2 py-1 text-xs font-medium transition-colors ${
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-800"
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
  const [activeDiscipline, setActiveDiscipline] = useState(project.disciplines[0] ?? null)
  const [activeLOD, setActiveLOD] = useState(project.lodLevels[0] ?? null)
  const [activeComplexity, setActiveComplexity] = useState(project.complexity?.options?.[0] ?? null)

  const resolvedImage = useMemo(() => {
    const { images } = project
    if (!images) return null

    if (images.imagesByDisciplineAndLOD && activeDiscipline && activeLOD) {
      const byDiscipline = images.imagesByDisciplineAndLOD[activeDiscipline]
      const byLod = byDiscipline?.[activeLOD]
      if (byLod) {
        return byLod
      }
    }

    if (images.imagesByDiscipline && activeDiscipline) {
      const byDiscipline = images.imagesByDiscipline[activeDiscipline]
      if (byDiscipline) {
        return byDiscipline
      }
    }

    if (images.imagesByLOD && activeLOD) {
      const byLod = images.imagesByLOD[activeLOD]
      if (byLod) {
        return byLod
      }
    }

    if (images.imagesByComplexity && activeComplexity) {
      const byComplexity = images.imagesByComplexity[activeComplexity]
      if (byComplexity) {
        return byComplexity
      }
    }

    return images.main ?? null
  }, [project, activeDiscipline, activeLOD, activeComplexity])

  return (
    <CollapseItem title={project.name} subtitle={project.summary} defaultOpen={false}>
      <MediaWithText media={<ImageFrame src={resolvedImage} alt={project.name} />}>
        <div className="space-y-4">
          <CollapseItem
            title="Disciplina"
            subtitle="Selecciona la disciplina que quieres analizar"
            level="sub"
            defaultOpen
          >
            <OptionPills options={project.disciplines} active={activeDiscipline} onChange={setActiveDiscipline} />
          </CollapseItem>

          <CollapseItem
            title="Nivel de Detalle (LOD)"
            subtitle="Explora cómo evoluciona el modelo"
            level="sub"
            defaultOpen
          >
            <OptionPills options={project.lodLevels} active={activeLOD} onChange={setActiveLOD} />
          </CollapseItem>

          <CollapseItem
            title={project.complexity?.title ?? "Tipo de Edificio y Complejidad"}
            subtitle="Contexto del proyecto"
            level="sub"
            defaultOpen
          >
            <div className="space-y-2 text-xs text-slate-600">
              <p className="leading-5">{project.complexity?.text}</p>
              <OptionPills
                options={project.complexity?.options}
                active={activeComplexity}
                onChange={setActiveComplexity}
              />
            </div>
          </CollapseItem>

          <p className="text-xs text-slate-500">
            Entrega final: {project.deliverables?.join(" / ") ?? "IFC / PDF / DWG"}
          </p>
        </div>
      </MediaWithText>
    </CollapseItem>
  )
}

export default function ProjectsSection() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <header>
        <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">{projectsSection.title}</h3>
        <p className="mt-2 text-sm text-slate-600 md:text-base">{projectsSection.summary}</p>
      </header>
      <div className="mt-6 space-y-4 md:space-y-5">
        {executedProjects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
