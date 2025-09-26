import React from "react"
import { useLocation } from "react-router-dom"
import SEO from "../components/SEO.jsx"

const SITE_URL = "https://civilespro.com"

const features = [
  {
    title: "Calculadora de materiales",
    description: "Define metrados, coeficientes y desperdicios para obtener cantidades precisas al instante.",
  },
  {
    title: "Presupuestos con APU",
    description: "Construye análisis de precios unitarios y genera reportes listos para compartir con tu equipo.",
  },
  {
    title: "Informes diarios",
    description: "Registra avances, controla cuadrillas y adjunta evidencias fotográficas desde cualquier dispositivo.",
  },
]

const steps = [
  "Carga o crea tus proyectos con sus capítulos y actividades.",
  "Calcula cantidades automáticamente con la calculadora de materiales.",
  "Genera presupuestos con APU y exporta a Excel en segundos.",
  "Documenta avances diarios y comparte reportes con tu equipo.",
]

export default function PlataformaPage() {
  const location = useLocation()
  const canonical = `${SITE_URL}/plataforma`
  const currentUrl = `${SITE_URL}${location.pathname}`

  return (
    <>
      <SEO
        title="Plataforma Civiles Pro — Calculadora de materiales y APU"
        description="Gestiona materiales, presupuestos y reportes diarios desde una sola plataforma pensada para obra."
        url={currentUrl}
        canonical={canonical}
      />

      <section className="py-16">
        <div className="wrap-wide px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
              Calculadora de materiales & Plataforma de obra
            </h1>
            <p className="mt-5 text-lg text-gray-700">
              Centraliza tus metrados, controla desperdicios y genera presupuestos confiables con reportes diarios listos para compartir.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="https://app.civilespro.com/register" className="btn-primary">
                Crear cuenta
              </a>
              <a href="https://app.civilespro.com/login" className="btn-outline">
                Entrar a la plataforma
              </a>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-primary">{feature.title}</h2>
                <p className="mt-3 text-gray-700">{feature.description}</p>
              </article>
            ))}
          </div>

          <section className="mt-16 rounded-3xl bg-gray-50 p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Cómo funciona</h2>
            <ol className="mt-6 space-y-4 text-gray-700">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-16 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h2 className="text-2xl font-bold text-primary">¿Listo para probarla?</h2>
            <p className="mt-3 text-gray-700">
              Solicita una demo personalizada y te mostramos cómo sacar el máximo provecho a la calculadora de materiales y los reportes diarios.
            </p>
            <a href="/contacto" className="mt-6 inline-flex items-center justify-center btn-outline">
              Agendar demo
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
