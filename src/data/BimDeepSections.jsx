export const deepSectionsIntro = {
  title: "Profundiza en nuestro enfoque BIM",
  description:
    "Explora cómo estructuramos procesos, niveles de detalle y la experiencia que respalda cada proyecto que modelamos.",
}

export const pebSection = {
  id: "peb",
  title: "Planes de Ejecución BIM (PEB)",
  summary:
    "Metodología y documentación para coordinar a todos los participantes desde la concepción hasta la entrega.",
  image: "/bim/peb.jpg",
  items: [
    "Definimos entregables, flujos de trabajo y canales de comunicación para que todas las disciplinas avancen alineadas.",
    "Estructuramos la documentación en función de la ISO 19650 para asegurar trazabilidad y control de versiones.",
    "Establecemos métricas de seguimiento para medir avances y tomar decisiones a tiempo.",
  ],
}

export const lodSection = {
  id: "lod",
  title: "LOD – Niveles de Desarrollo",
  summary:
    "Escalamos la precisión del modelo según la etapa del proyecto y las decisiones que se necesitan tomar.",
}

export const projectsSection = {
  id: "projects",
  title: "Proyectos Ejecutados",
  summary:
    "Experiencia comprobada implementando flujos BIM en proyectos reales de distintas escalas.",
}

// LODs
export const lodItems = [
  {
    id: "lod100",
    title: "LOD 100: Idea / Anteproyecto conceptual",
    short: "Modelo conceptual para evaluar volumen, áreas y alternativas.",
    desc:
      "Modelo a nivel conceptual que apoya decisiones tempranas (volumetrías, relaciones espaciales y supuestos de costo/plazo). Útil para estimaciones de alto nivel y evaluación de alternativas.",
    images: ["/img/bim/lod100/01.webp", "/img/bim/lod100/02.webp"],
    whatsMsg: "Hola, me interesa el servicio LOD 100.",
  },
  {
    id: "lod200",
    title: "LOD 200: Desarrollo esquemático",
    short: "Geometrías aproximadas, ubicación de sistemas y coordinación inicial.",
    desc: "Diseño preliminar con definiciones aproximadas, ubicación de elementos y base para coordinación temprana entre disciplinas.",
    images: ["/img/bim/lod200/01.webp"],
    whatsMsg: "Hola, me interesa el servicio LOD 200.",
  },
  {
    id: "lod300",
    title: "LOD 300: Diseño coordinado",
    short: "Geometría definida y relaciones precisas.",
    desc: "Listo para coordinación técnica, detección de interferencias y cantidades confiables.",
    images: ["/img/bim/lod300/01.webp"],
    whatsMsg: "Hola, me interesa el servicio LOD 300.",
  },
  {
    id: "lod400",
    title: "LOD 400: Construcción y prefabricación",
    short: "Detalles para producción en obra/taller.",
    desc: "Incluye detalles, uniones y secuencias para fabricación/armado.",
    images: ["/img/bim/lod400/01.webp"],
    whatsMsg: "Hola, me interesa el servicio LOD 400.",
  },
  {
    id: "lod500",
    title: "LOD 500: Operación y mantenimiento",
    short: "Modelo conforme a obra (as-built).",
    desc: "Base para operación, mantenimiento y gestión de activos.",
    images: ["/img/bim/lod500/01.webp"],
    whatsMsg: "Hola, me interesa el servicio LOD 500.",
  },
]

// Proyectos ejecutados
export const executedProjects = [
  {
    id: "nave-industrial",
    name: "Nave Industrial",
    intro: "Modelado integral con coordinación de estructuras y arquitectura en etapas tempranas.",
    disciplines: ["Arquitectura", "Estructuras"],
    lodLevels: ["LOD 200", "LOD 300"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Nave industrial de uso múltiple para almacenamiento y operaciones logísticas ligeras. Pórticos en acero y elementos en concreto reforzado.",
    },
    deliverables: ["IFC", "PDF", "DWG"],
    images: {
      main: "/img/proyectos/nave/main.webp",
      imagesByDiscipline: {
        Arquitectura: "/img/proyectos/nave/arq.webp",
        Estructuras: "/img/proyectos/nave/est.webp",
      },
      imagesByLOD: {
        "LOD 200": "/img/proyectos/nave/lod200.webp",
        "LOD 300": "/img/proyectos/nave/lod300.webp",
      },
    },
  },
  {
    id: "vivienda-unifamiliar",
    name: "Vivienda Unifamiliar",
    intro: "Modelado arquitectónico con énfasis en tiempos de entrega y optimización de costos.",
    disciplines: ["Arquitectura"],
    lodLevels: ["LOD 200"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Vivienda unifamiliar compacta, diseñada para ejecución ágil y control presupuestal.",
    },
    deliverables: ["IFC", "PDF", "DWG"],
    images: {
      main: "/img/proyectos/vivienda/main.webp",
      imagesByDiscipline: { Arquitectura: "/img/proyectos/vivienda/arq.webp" },
      imagesByLOD: { "LOD 200": "/img/proyectos/vivienda/lod200.webp" },
    },
  },
  {
    id: "edificio-residencial",
    name: "Edificio Residencial",
    intro: "Torre de vivienda multifamiliar coordinada entre arquitectura y sistemas MEP.",
    disciplines: ["Arquitectura", "MEP"],
    lodLevels: ["LOD 200", "LOD 300"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Edificio residencial de media altura con foco en eficiencia energética y confort interior.",
    },
    deliverables: ["IFC", "PDF", "DWG"],
    images: {
      main: "/img/proyectos/residencial/main.webp",
      imagesByDiscipline: {
        Arquitectura: "/img/proyectos/residencial/arq.webp",
        MEP: "/img/proyectos/residencial/mep.webp",
      },
      imagesByLOD: {
        "LOD 200": "/img/proyectos/residencial/lod200.webp",
        "LOD 300": "/img/proyectos/residencial/lod300.webp",
      },
      imagesByDisciplineAndLOD: {
        Arquitectura: {
          "LOD 200": "/img/proyectos/residencial/arq-lod200.webp",
          "LOD 300": "/img/proyectos/residencial/arq-lod300.webp",
        },
        MEP: {
          "LOD 200": "/img/proyectos/residencial/mep-lod200.webp",
          "LOD 300": "/img/proyectos/residencial/mep-lod300.webp",
        },
      },
    },
  },
  {
    id: "hospital-primer-nivel",
    name: "Hospital de Primer Nivel",
    intro: "Coordinación multidisciplinar con rutas críticas de instalaciones y soporte a licenciamiento.",
    disciplines: ["Arquitectura", "Estructuras", "MEP"],
    lodLevels: ["LOD 300", "LOD 400"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Centro hospitalario básico con altos estándares sanitarios y densidad de redes técnicas.",
    },
    deliverables: ["IFC", "PDF", "DWG"],
    images: {
      main: "/img/proyectos/hospital/main.webp",
      imagesByDiscipline: {
        Arquitectura: "/img/proyectos/hospital/arq.webp",
        Estructuras: "/img/proyectos/hospital/est.webp",
        MEP: "/img/proyectos/hospital/mep.webp",
      },
      imagesByLOD: {
        "LOD 300": "/img/proyectos/hospital/lod300.webp",
        "LOD 400": "/img/proyectos/hospital/lod400.webp",
      },
      imagesByDisciplineAndLOD: {
        Arquitectura: {
          "LOD 300": "/img/proyectos/hospital/arq-lod300.webp",
          "LOD 400": "/img/proyectos/hospital/arq-lod400.webp",
        },
        Estructuras: {
          "LOD 300": "/img/proyectos/hospital/est-lod300.webp",
          "LOD 400": "/img/proyectos/hospital/est-lod400.webp",
        },
        MEP: {
          "LOD 300": "/img/proyectos/hospital/mep-lod300.webp",
          "LOD 400": "/img/proyectos/hospital/mep-lod400.webp",
        },
      },
    },
  },
  {
    id: "bloque-escolar",
    name: "Bloque Escolar",
    intro: "Bloque académico modular con integración de estructura prefabricada y envolvente eficiente.",
    disciplines: ["Arquitectura", "Estructuras"],
    lodLevels: ["LOD 200", "LOD 300"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Edificación educativa modular con requerimientos de flexibilidad y rápida ejecución.",
    },
    deliverables: ["IFC", "PDF", "DWG"],
    images: {
      main: "/img/proyectos/escolar/main.webp",
      imagesByDiscipline: {
        Arquitectura: "/img/proyectos/escolar/arq.webp",
        Estructuras: "/img/proyectos/escolar/est.webp",
      },
      imagesByLOD: {
        "LOD 200": "/img/proyectos/escolar/lod200.webp",
        "LOD 300": "/img/proyectos/escolar/lod300.webp",
      },
    },
  },
  {
    id: "centros-ips",
    name: "Centros de Atención IPS",
    intro: "Red de centros de salud con enfoque en replicabilidad y control de calidad.",
    disciplines: ["Arquitectura"],
    lodLevels: ["LOD 200", "LOD 300"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Centros de atención primaria con prototipos adaptables a diferentes ubicaciones.",
    },
    deliverables: ["IFC", "PDF", "DWG"],
    images: {
      main: "/img/proyectos/ips/main.webp",
      imagesByDiscipline: {
        Arquitectura: "/img/proyectos/ips/arq.webp",
      },
      imagesByLOD: {
        "LOD 200": "/img/proyectos/ips/lod200.webp",
        "LOD 300": "/img/proyectos/ips/lod300.webp",
      },
    },
  },
  {
    id: "edificio-multifuncional",
    name: "Edificio Multifuncional",
    intro: "Estructura de gran luz enfocada en coordinación estructural y logística constructiva.",
    disciplines: ["Estructuras"],
    lodLevels: ["LOD 300", "LOD 400"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Edificio de usos mixtos con grandes luces y cargas variables que requieren ingeniería avanzada.",
    },
    deliverables: ["IFC", "PDF", "DWG"],
    images: {
      main: "/img/proyectos/multifuncional/main.webp",
      imagesByDiscipline: {
        Estructuras: "/img/proyectos/multifuncional/est.webp",
      },
      imagesByLOD: {
        "LOD 300": "/img/proyectos/multifuncional/lod300.webp",
        "LOD 400": "/img/proyectos/multifuncional/lod400.webp",
      },
    },
  },
]
