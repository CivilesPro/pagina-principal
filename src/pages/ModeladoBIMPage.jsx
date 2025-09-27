import React from "react"
import SEO from "../components/SEO.jsx"
import BimServiceCard from "../components/BimServiceCard.jsx"
import LODList from "../components/bim/LODList.jsx"
import ProjectsList from "../components/bim/ProjectsList.jsx"

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
            >
              {/* Tarjeta PEB */}
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-8">
                <h3 className="text-lg font-semibold">Planes de Ejecución BIM (PEB)</h3>
                <ul className="mt-4 space-y-2 text-slate-700">
                  <li>✓ Definición de roles y responsabilidades.</li>
                  <li>✓ Procesos de trabajo colaborativos.</li>
                  <li>✓ Estándares y normas internacionales.</li>
                  <li>✓ Entregables BIM claros y estructurados.</li>
                </ul>
              </div>

              {/* Tarjeta LOD con colapsables por nivel */}
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-8">
                <h3 className="text-lg font-semibold">LOD – Niveles de Desarrollo</h3>
                <p className="text-slate-600 text-sm">Adaptamos el nivel de detalle según la etapa del proyecto.</p>
                <div className="mt-4">
                  {/* contenido puro, sin tarjeta adicional */}
                  <LODList />
                </div>
              </div>

              {/* Tarjeta Proyectos Ejecutados */}
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-8 lg:col-span-2">
                <h3 className="text-lg font-semibold">Proyectos Ejecutados</h3>
                <p className="text-slate-600 text-sm">Experiencia comprobada en distintas escalas.</p>
                <div className="mt-4">
                  {/* contenido puro, sin tarjeta adicional */}
                  <ProjectsList />
                </div>
              </div>

              {/* Tarjeta Entregables (si la usas) */}
              {/* <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-8 lg:col-span-2">...</div> */}
            </BimServiceCard>
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
