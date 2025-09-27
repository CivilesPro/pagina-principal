// src/components/BimDeepSections.jsx
import React from "react";

// Utilidad para clases
const cx = (...c) => c.filter(Boolean).join(" ");

// Reutilizable: ítem con desplegable + imagen a la derecha
function CollapsibleRow({ item, isOpen, onToggle }) {
  const { title, teaser, details, img } = item;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div>
          <h4 className="text-base font-semibold text-gray-900">{title}</h4>
          {teaser ? (
            <p className="mt-1 text-sm text-gray-600">{teaser}</p>
          ) : null}
        </div>
        <span
          className={cx(
            "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-gray-600 transition",
            isOpen ? "rotate-180 bg-gray-50" : "bg-white"
          )}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {/* Contenido expandible */}
      <div
        className={cx(
          "grid transition-all duration-300",
          isOpen ? "mt-4 grid-cols-1 md:grid-cols-[1fr_320px] gap-4" : "max-h-0 overflow-hidden"
        )}
      >
        <div className="min-w-0">
          {Array.isArray(details) ? (
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-700">{details}</p>
          )}
        </div>

        {/* Imagen al lado (abajo en móvil) */}
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
          <img
            src={img}
            alt={title}
            className="h-56 w-full rounded-md object-contain md:h-48"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

// Bloque de lista con título/sección
function CollapsibleGroup({ id, title, subtitle, items }) {
  const [openIndex, setOpenIndex] = React.useState(0); // abre el primero por UX

  return (
    <section id={id} className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <header className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {subtitle ? <p className="mt-1 text-gray-600">{subtitle}</p> : null}
      </header>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <CollapsibleRow
            key={`${id}-${idx}`}
            item={item}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
          />
        ))}
      </div>
    </section>
  );
}

export default function BimDeepSections() {
  // DATA — cambia las rutas de imagen por las tuyas
  const PEB = [
    {
      title: "Definición de roles y responsabilidades",
      teaser: "Estructuramos equipos y alcances desde el PEB.",
      details: [
        "Matriz RACI para clarificar responsables, consultados e informados.",
        "Intercambios de información definidos (EIR/BEP).",
        "Gobernanza del modelo: propietarios, revisores y aprobadores.",
      ],
      img: "/bim/peb-roles.png",
    },
    {
      title: "Procesos de trabajo colaborativos",
      teaser: "Flujos claros para federación, revisión y publicación.",
      details: [
        "Ciclos de coordinación con hitos y entregables por disciplina.",
        "Uso de CDE (Common Data Environment) para control documental.",
        "Worksets, naming y estados de revisión coherentes.",
      ],
      img: "/bim/peb-colaboracion.png",
    },
    {
      title: "Estándares y normas internacionales",
      teaser: "ISO 19650 y guías locales para consistencia y trazabilidad.",
      details: [
        "Convenciones de nomenclatura, unidades y plantillas.",
        "Estados del modelo, versiones y auditorías.",
        "IFC, COBie y formatos abiertos para interoperabilidad.",
      ],
      img: "/bim/peb-standards.png",
    },
    {
      title: "Entregables BIM claros y estructurados",
      teaser: "Qué, cuándo y cómo se entrega en cada hito del proyecto.",
      details: [
        "Modelos federados, reportes de interferencias, láminas y listados.",
        "Entrega escalonada por LOD y capítulo.",
        "Paquetes de publicación con metadatos y control de calidad.",
      ],
      img: "/bim/peb-entregables.png",
    },
  ];

  const LOD = [
    {
      title: "LOD 100 — Idea / Anteproyecto conceptual",
      teaser: "Volúmenes y parámetros globales.",
      details:
        "Representación conceptual para estimaciones iniciales, análisis de ocupación y decisiones tempranas sobre el alcance.",
      img: "/bim/lod-100.png",
    },
    {
      title: "LOD 200 — Diseño preliminar",
      teaser: "Sistemas aproximados y ubicación.",
      details:
        "Geometrías genéricas, elementos aproximados, relaciones espaciales y primeras interferencias relevantes entre disciplinas.",
      img: "/bim/lod-200.png",
    },
    {
      title: "LOD 300 — Geometría precisa y coordinación",
      teaser: "Dimensiones exactas y conexiones.",
      details:
        "Elementos con tamaño, forma y ubicación definidas para documentación, cómputos precisos y coordinación técnica.",
      img: "/bim/lod-300.png",
    },
    {
      title: "LOD 400 — Construcción y documentación",
      teaser: "Listo para fabricación / montaje.",
      details:
        "Detalles constructivos, despieces y especificaciones para fabricación, montaje y secuencias en obra.",
      img: "/bim/lod-400.png",
    },
    {
      title: "LOD 500 — As-Built / Operación y mantenimiento",
      teaser: "Modelo como construido con datos de activo.",
      details:
        "Modelo verificado en obra, con información para gestión de activos, operación y mantenimiento.",
      img: "/bim/lod-500.png",
    },
  ];

  const PROYECTOS = [
    {
      title: "Nave Industrial (Arquitectura + Estructuras)",
      teaser: "Modelado federado y coordinación de interferencias.",
      details:
        "Resolución de colisiones tempranas, secuenciación de etapas y extracción de cómputos para fabricación.",
      img: "/bim/proyecto-nave.png",
    },
    {
      title: "Vivienda Unifamiliar (Arquitectura)",
      teaser: "Optimización de áreas y costos.",
      details:
        "Iteraciones rápidas de diseño, análisis de iluminación y listados automáticos de materiales.",
      img: "/bim/proyecto-vivienda.png",
    },
    {
      title: "Edificio Residencial (Arquitectura + MEP)",
      teaser: "Coordinación vertical y núcleos técnicos.",
      details:
        "Ruteo MEP sin conflictos, patios, shafts y espacios mecánicos validados antes de obra.",
      img: "/bim/proyecto-residencial.png",
    },
    {
      title: "Hospital de Primer Nivel (Arquitectura + Estructuras + MEP)",
      teaser: "Criterios sanitarios y flujos funcionales.",
      details:
        "Áreas críticas, apoyos técnicos, instalaciones hospitalarias y control documental bajo ISO 19650.",
      img: "/bim/proyecto-hospital.png",
    },
    {
      title: "Bloque Escolar (Arquitectura + Estructuras)",
      teaser: "Modularidad y eficiencia.",
      details:
        "Sistemas repetibles, detalles estructurales tipificados y modelado apto para licitación.",
      img: "/bim/proyecto-escolar.png",
    },
    {
      title: "Centros IPS (Arquitectura)",
      teaser: "Trazabilidad y requisitos técnicos.",
      details:
        "EIR/PEB definidos, checklist normativo y entregables escalonados por fases.",
      img: "/bim/proyecto-ips.png",
    },
    {
      title: "Edificio Multifuncional (Estructuras)",
      teaser: "Integración con análisis estructural.",
      details:
        "Interoperabilidad con software de cálculo y control de cambios en geometrías críticas.",
      img: "/bim/proyecto-multifuncional.png",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 space-y-8">
      {/* Grupo PEB */}
      <CollapsibleGroup
        id="peb"
        title="Planes de Ejecución BIM (PEB)"
        subtitle="Estructuramos el proyecto desde el día uno: responsables, flujos, estándares y entregables."
        items={PEB}
      />

      {/* Grupo LOD */}
      <CollapsibleGroup
        id="lod"
        title="LOD – Niveles de Desarrollo"
        subtitle="Adaptamos el nivel de detalle según la etapa: de idea a operación y mantenimiento."
        items={LOD}
      />

      {/* Grupo Proyectos */}
      <CollapsibleGroup
        id="proyectos"
        title="Proyectos ejecutados"
        subtitle="Aplicamos la metodología BIM en tipologías diversas, priorizando coordinación y calidad de información."
        items={PROYECTOS}
      />
    </div>
  );
}
