// src/pages/Home.jsx
import React from "react"
import SEO from "../components/SEO.jsx"
import BimServiceCard from "../components/BimServiceCard.jsx"

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Civiles Pro",
    "url": "https://civilespro.com",
    "logo": "https://civilespro.com/img/logociviles.png",
    "sameAs": [
      "https://www.facebook.com/ingcivilespro",
      "https://www.instagram.com/civilespro/",
      "https://www.tiktok.com/@ingcivilespro",
    ],
    "description":
      "Comunidad de ingenieros, arquitectos y maestros de obra. Calcula materiales, genera presupuestos con APU y exporta a Excel.",
  }

  return (
    <>
      <SEO
        title="Civiles Pro — Comunidad, Servicios y Herramientas para Obra"
        description="Somos una comunidad de la construcción. Calcula materiales, crea presupuestos con APU, exporta a Excel y aprende con manuales y blog."
        url="https://civilespro.com"
        jsonLd={jsonLd}
      />

      {/* HERO */}
      <section className="pt-10 md:pt-14 pb-16 text-center">
        <div className="wrap-wide px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
            Somos una comunidad de la construcción
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-lg text-gray-700">
            Ingenieros, arquitectos y maestros de obra compartiendo recursos, plantillas y herramientas para que tu obra sea más <b>rápida</b> y <b>confiable</b>.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <a href="/manuales" className="btn-primary">
              Ver manuales
            </a>
            <a href="/blog" className="btn-outline">
              Leer blog
            </a>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="bg-gray-50 py-16">
        <div className="wrap-wide px-4">
          <h2 className="text-2xl md:text-3xl font-bold">Servicios</h2>
          <p className="mt-2 text-gray-700">Te acompañamos en todas las etapas del proyecto.</p>

          {/* Tarjeta hero de Modelado BIM */}
          <div className="mt-8">
            <BimServiceCard />
          </div>

          <div className="mt-10 text-center">
            <a href="/servicios" className="btn-outline">
              Ver todos los servicios
            </a>
          </div>
        </div>
      </section>

      {/* CTA (full-bleed) */}
      <section className="bg-primary">
        <div className="wrap-wide px-4 py-14 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold">¿Arrancamos?</h2>
          <p className="mt-3 opacity-90">
            Accede a manuales, blog y a nuestra plataforma para presupuesto con APU.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <a href="/manuales" className="btn bg-white text-primary hover:opacity-90 border-transparent">
              Ver manuales
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
