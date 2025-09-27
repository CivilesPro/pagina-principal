import React, { useState } from "react"

const PEB_DETAILS = [
  "Definimos entregables, flujos de trabajo y canales de comunicación para que todas las disciplinas avancen alineadas.",
  "Estructuramos la documentación en función de la ISO 19650 para asegurar trazabilidad y control de versiones.",
  "Establecemos métricas de seguimiento para medir avances y tomar decisiones a tiempo.",
]

const LOD_DETAILS = [
  "Adaptamos el nivel de detalle a la fase del proyecto para optimizar tiempos y esfuerzo.",
  "Integramos geometría, datos y especificaciones para facilitar la coordinación interdisciplinar.",
  "Validamos el modelo con revisiones colaborativas y control de colisiones.",
]

const PROJECTS_DETAILS = [
  "Modelado de edificaciones industriales, comerciales y residenciales con equipos multidisciplinares.",
  "Coordinación MEP y estructural en proyectos hospitalarios y educativos.",
  "Implementaciones BIM para operación y mantenimiento posterior a la entrega.",
]

const BIM_DEEP_SECTIONS = [
  {
    id: "peb",
    title: "Planes de Ejecución BIM (PEB)",
    summary:
      "Metodología y documentación para coordinar a todos los participantes desde la concepción hasta la entrega.",
    image: "/bim/peb.jpg",
    items: PEB_DETAILS,
  },
  {
    id: "lod",
    title: "LOD – Niveles de Desarrollo",
    summary: "Escalamos la precisión del modelo según la etapa del proyecto y las decisiones que se necesitan tomar.",
    image: "/bim/lod.jpg",
    items: LOD_DETAILS,
  },
  {
    id: "projects",
    title: "Proyectos Ejecutados",
    summary: "Experiencia comprobada implementando flujos BIM en proyectos reales de distintas escalas.",
    image: "/bim/projects.jpg",
    items: PROJECTS_DETAILS,
  },
]

function ChevronIcon({ expanded }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 transition-transform duration-300 ${expanded ? "rotate-180" : "rotate-0"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

export default function BimDeepSections() {
  const [openId, setOpenId] = useState(BIM_DEEP_SECTIONS[0]?.id ?? null)

  const handleToggle = (id) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Profundiza en nuestro enfoque BIM</h2>
          <p className="mt-3 text-gray-600">
            Explora cómo estructuramos procesos, niveles de detalle y la experiencia que respalda cada proyecto que modelamos.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {BIM_DEEP_SECTIONS.map((section) => {
            const isOpen = openId === section.id
            const contentId = `${section.id}-content`

            return (
              <article key={section.id} className="rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
                <button
                  type="button"
                  id={`${section.id}-trigger`}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => handleToggle(section.id)}
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{section.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{section.summary}</p>
                  </div>
                  <ChevronIcon expanded={isOpen} />
                </button>

                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={`${section.id}-trigger`}
                  className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-gray-200 px-6 py-6">
                      <div className="flex flex-col gap-6 md:flex-row md:items-center">
                        <div className="md:w-1/2">
                          <ul className="space-y-3 text-sm text-gray-700">
                            {section.items.map((item, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="md:w-1/2">
                          <img
                            src={section.image}
                            alt={section.title}
                            loading="lazy"
                            className="h-full w-full rounded-xl object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
