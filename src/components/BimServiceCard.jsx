// src/components/BimServiceCard.jsx
import React from "react";

export default function BimServiceCard({
  title = "SERVICIOS DE\nMODELADO BIM",
  subtitle = "Desarrollamos tus proyectos bajo protocolos BIM para mayor eficiencia y coordinación.",
  phone = "+57 312 743 7848",
  wa = "https://wa.me/573127437848",
  children,
}) {
  const base = import.meta.env.BASE_URL;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* HERO VERDE */}
      <article className="relative overflow-visible rounded-3xl text-white">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-900 to-emerald-700" />
        <div
          aria-hidden
          className="absolute inset-0 rounded-3xl bg-cover bg-center opacity-50 mix-blend-overlay"
          style={{ backgroundImage: `url(${base}bgverde.png)` }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative p-8 md:p-12 md:pr-[360px]">
          <div className="flex items-center gap-2">
            <h2 className="whitespace-pre-line text-5xl md:text-6xl font-extrabold leading-none">
              {title}
            </h2>
          </div>
          <p className="mt-4 text-lg opacity-90">{subtitle}</p>
          <p className="mt-2 text-sm opacity-75">
            Más información escribir al Whatsapp: {phone}
          </p>

          <div className="mt-6">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white text-primary hover:bg-gray-100"
            >
              Escribir ahora
            </a>
          </div>
        </div>

        <div className="pointer-events-none absolute hidden md:block -right-1 bottom-0 translate-y-6 z-10">
          <img
            src={`${base}bim-edificio.png`}
            alt="Modelado BIM"
            className="w-[520px] max-w-none drop-shadow-2xl"
          />
        </div>
      </article>

      {/* CONTENIDO INFERIOR (tarjetas blancas) */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {children /* Aquí inyectaremos PEB, LOD y Proyectos como tarjetas */}
      </div>
    </section>
  );
}
