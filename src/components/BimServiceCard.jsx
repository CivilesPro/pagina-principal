// src/components/BimServiceCard.jsx
import React from "react";

export default function BimServiceCard({
  title = "SERVICIOS DE\nMODELADO BIM",
  subtitle = "Desarrollamos tus proyectos bajo protocolos BIM para mayor eficiencia y coordinación.",
  phone = "+57 312 743 7848",
  wa = "https://wa.me/573127437848",
}) {
  const base = import.meta.env.BASE_URL; // respeta la config base de Vite

  return (
    <article className="relative overflow-hidden rounded-3xl text-white">
      {/* Capa 1: gradiente corporativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-emerald-700" />

      {/* Capa 2: textura */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay"
        style={{ backgroundImage: `url(${base}bgverde.png)` }}
      />

      {/* Capa 3: brillo decorativo */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      {/* Contenido principal */}
      <div className="relative grid items-center gap-8 p-8 md:p-12 md:grid-cols-2">
        {/* Texto izquierda */}
        <div>
          <div className="flex items-center gap-2">
            
            <h2 className="text-6xl font-extrabold whitespace-pre-line leading-none">
              {title}
            </h2>
          </div>
          <p className="mt-4 text-lg opacity-90">{subtitle}</p>
          <p className="mt-2 text-sm opacity-75">
            Más información escribir al Whatsapp: {phone}
          </p>

          <div className="mt-6 flex gap-3">
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

        {/* Imagen derecha */}
        <div className="relative hidden md:block">
          {/* Aquí puedes usar la imagen 3D del edificio o un SVG */}
          <img
            src={`${base}bim-edificio.png`}
            alt="Modelado BIM"
            className="w-full max-w-lg mx-auto drop-shadow-2xl"
          />
        </div>
      </div>
    </article>
  );
}
