import React from "react"
import SEO from "../components/SEO.jsx"
import BimServiceCard from "../components/BimServiceCard.jsx"
import ServiceCard from "../components/ServiceCard.jsx"
import ExpandableCard from "../components/ExpandableCard.jsx"
import FormatsGrid from "../components/FormatsGrid.jsx"

const SITE_URL = "https://civilespro.com"

export default function ModeladoBIMPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Modelado BIM bajo protocolos ISO 19650",
    provider: {
      "@type": "Organization",
      name: "Civiles Pro",
      url: SITE_URL,
      logo: `${SITE_URL}/img/logociviles.png`,
    },
    url: `${SITE_URL}/modelado-bim`,
    description:
      "Integramos todas las disciplinas de un proyecto bajo estándares BIM, asegurando coordinación y eficiencia de principio a fin.",
  }

  const pebItems = [
    "Definición de roles y responsabilidades.",
    "Procesos de trabajo colaborativos.",
    "Estándares y normas internacionales.",
    "Entregables BIM claros y estructurados.",
  ]

  const lodItems = [
    "LOD 100: Idea / Anteproyecto conceptual.",
    "LOD 200: Diseño preliminar.",
    "LOD 300: Geometría precisa y coordinación.",
    "LOD 400: Construcción y documentación.",
    "LOD 500: Proyecto final para operación y mantenimiento.",
  ]

  const projectItems = [
    "Nave Industrial (Arquitectura + Estructuras).",
    "Vivienda Unifamiliar (Arquitectura).",
    "Edificio Residencial (Arquitectura + MEP).",
    "Hospital de Primer Nivel (Arquitectura + Estructuras + MEP).",
    "Bloque Escolar (Arquitectura + Estructuras).",
    "Centros de Atención IPS (Arquitectura).",
    "Edificio Multifuncional (Estructuras).",
  ]

  return (
    <>
      <SEO
        title="Modelado BIM bajo protocolos ISO 19650 — Civiles Pro"
        description="Coordinamos disciplinas y estándares BIM para que tu proyecto avance con claridad, desde la idea hasta la construcción."
        url={`${SITE_URL}/modelado-bim`}
        canonical={`${SITE_URL}/modelado-bim`}
        jsonLd={jsonLd}
      />

      <section className="pt-10 md:pt-14 pb-16 text-center">
        <div className="wrap-wide px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
            Todo lo que un proyecto necesita, en un solo lugar
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-lg text-gray-700">
            Ingenieros, arquitectos y maestros de obra compartiendo recursos, plantillas y herramientas para que tu obra sea más <b>rápida</b> y <b>confiable</b>.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <a href="/blog?cat=manual" className="btn-primary">
              Ver manual de uso
            </a>
            <a href="/blog" className="btn-outline">
              Leer blog
            </a>
          </div>
        </div>
      </section>

      <section id="servicios" className="bg-gray-50 py-16">
        <div className="wrap-wide px-4">
          <h2 className="text-2xl md:text-3xl font-bold">Servicios</h2>
          <p className="mt-2 text-gray-700">Te acompañamos en todas las etapas del proyecto.</p>

          <div className="mt-8">
            <BimServiceCard
              title={"Modelado BIM\nbajo protocolos ISO 19650"}
              subtitle="Integramos todas las disciplinas en un solo proyecto, asegurando eficiencia y coordinación desde la etapa conceptual hasta la construcción."
            />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ServiceCard title="Planes de Ejecución BIM (PEB)" items={pebItems} />

            <ExpandableCard
              title="LOD – Niveles de Desarrollo"
              intro="Adaptamos el nivel de detalle según la etapa del proyecto."
              items={lodItems}
            />

            <ServiceCard title="Proyectos Ejecutados" items={projectItems} />

            <div className="lg:col-span-2">
              <FormatsGrid />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary">
        <div className="wrap-wide px-4 py-14 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold">¿Arrancamos?</h2>
          <p className="mt-3 opacity-90">
            Accede a manuales, blog y a nuestra plataforma para presupuesto con APU.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <a href="/blog?cat=manual" className="btn bg-white text-primary hover:opacity-90 border-transparent">
              Ver manual de uso
            </a>
            <a href="/blog" className="btn-outline border-white text-white hover:bg-white/10">
              Blog
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
