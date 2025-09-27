// src/components/BimServiceCard.jsx
import React from "react";

export default function BimServiceCard({
  title = "SERVICIOS DE\nMODELADO BIM",
  subtitle = "Desarrollamos tus proyectos bajo protocolos BIM para mayor eficiencia y coordinación.",
  phone = "+57 312 743 7848",
  wa = "https://wa.me/573127437848",
}) {
  const base = import.meta.env.BASE_URL;

  return (
    // 1) El rectángulo permite desbordes y tiene las esquinas redondeadas
    <article className="relative overflow-visible rounded-3xl text-white">
      {/* Fondo 1: gradiente */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-900 to-emerald-700" />
      {/* Fondo 2: textura */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-3xl bg-cover bg-center opacity-50 mix-blend-overlay"
        style={{ backgroundImage: `url(${base}bgverde.png)` }}
      />
      {/* Brillo decorativo */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      {/* 2) Contenido. OJO: reservamos espacio a la derecha para la imagen absoluta */}
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

      {/* 3) Ilustración ABSOLUTA que se sale del rectángulo */}
      <div className="pointer-events-none absolute hidden md:block -right-1 bottom-0 translate-y-6 z-10">
        <img
          src={`${base}bim-edificio.png`}
          alt="Modelado BIM"
          className="w-[520px] max-w-none drop-shadow-2xl"
        />
      </div>
    </article>
  );
}
