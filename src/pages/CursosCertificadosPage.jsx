import React from "react"
import SEO from "../components/SEO.jsx"

const SITE_URL = "https://civilespro.com"

const courses = [
  {
    title: "Programa de Presupuestos con APU",
    description: "Aprende a estructurar análisis de precios unitarios y genera presupuestos confiables paso a paso.",
    status: "En desarrollo",
  },
  {
    title: "Gestión de Obra con Modelado BIM",
    description: "Integra metodología BIM a tu gestión diaria para coordinar disciplinas y controlar entregables.",
    status: "Lista de espera",
  },
]

const certifications = [
  {
    title: "Certificación en Coordinación BIM",
    description: "Valida tus habilidades coordinando proyectos multidisciplinarios con estándares ISO 19650.",
    status: "Próximamente",
  },
  {
    title: "Certificación en Control de Obra",
    description: "Demuestra dominio en seguimiento de cronogramas, control de materiales y reportes diarios.",
    status: "En planeación",
  },
]

function Section({ title, description, items }) {
  return (
    <section className="mt-16">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-gray-700">{description}</p>
        </div>
        <a href="/contacto" className="btn-outline whitespace-nowrap">
          Quiero participar
        </a>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.title} className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm">
            <header>
              <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
              <p className="mt-2 text-gray-700">{item.description}</p>
            </header>
            <div className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-gray-600">
              <span className="inline-flex h-2 w-2 rounded-full bg-primary"></span>
              {item.status}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function CursosCertificadosPage() {
  return (
    <>
      <SEO
        title="Cursos y Certificados para profesionales de obra — Civiles Pro"
        description="Centralizamos programas formativos y certificaciones para que fortalezcas tus habilidades en obra, BIM y gestión de proyectos."
        url={`${SITE_URL}/cursos-certificados`}
        canonical={`${SITE_URL}/cursos-certificados`}
      />

      <section className="py-16">
        <div className="wrap-wide px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
              Cursos y Certificados
            </h1>
            <p className="mt-5 text-lg text-gray-700">
              Aprende con expertos, comparte experiencias con la comunidad y valida tus competencias profesionales con programas diseñados por Civiles Pro.
            </p>
          </div>

          <Section
            title="Cursos"
            description="Programas en vivo y on-demand con acompañamiento de nuestro equipo."
            items={courses}
          />

          <Section
            title="Certificados"
            description="Evaluaciones y proyectos aplicados para respaldar tus habilidades frente a la industria."
            items={certifications}
          />

          <div className="mt-16 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
            ¿Quieres ser de los primeros en acceder? Déjanos un mensaje y te avisamos cuando abramos inscripciones.
          </div>
        </div>
      </section>
    </>
  )
}
