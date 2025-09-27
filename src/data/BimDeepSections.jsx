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

export const lodItems = [
  {
    id: "lod100",
    icon: "brain",
    title: "LOD 100: Idea / Anteproyecto conceptual",
    short: "Modelo conceptual para evaluar volumen, áreas y alternativas; útil para estimaciones de alto nivel.",
    desc: "Modelo a nivel conceptual que apoya decisiones tempranas: volumetrías, relaciones espaciales y supuestos de costos/plazos. Útil para evaluar alternativas y riesgos sin comprometer diseño detallado.",
    images: [
      "/img/bim/lod100/01.webp",
      "/img/bim/lod100/02.webp",
      "/img/bim/lod100/03.webp",
    ],
    whatsMsg:
      "Hola, me interesa el servicio LOD 100 (Idea/Anteproyecto). ¿Podemos hablar de mi proyecto?",
  },
  {
    id: "lod200",
    icon: "brain",
    title: "LOD 200: Desarrollo esquemático",
    short: "Diseño preliminar con geometrías aproximadas y ubicación de sistemas; base para coordinación inicial.",
    desc: "Modelo que incorpora geometrías aproximadas y ubicación general de sistemas. Permite validar criterios de diseño, estimar cantidades preliminares y preparar la coordinación interdisciplinar inicial.",
    images: [
      "/img/bim/lod200/01.webp",
      "/img/bim/lod200/02.webp",
      "/img/bim/lod200/03.webp",
    ],
    whatsMsg:
      "Hola, me interesa el servicio LOD 200 (Desarrollo esquemático). ¿Podemos hablar de mi proyecto?",
  },
  {
    id: "lod300",
    icon: "brain",
    title: "LOD 300: Diseño coordinado",
    short: "Geometría definida y relaciones precisas; lista para coordinación técnica y extracción confiable de cantidades.",
    desc: "Modelo con geometría definida, relaciones precisas y especificaciones asociadas. Facilita la coordinación técnica entre disciplinas y permite extraer cantidades confiables para planeación y compras.",
    images: [
      "/img/bim/lod300/01.webp",
      "/img/bim/lod300/02.webp",
      "/img/bim/lod300/03.webp",
    ],
    whatsMsg:
      "Hola, me interesa el servicio LOD 300 (Diseño coordinado). ¿Podemos hablar de mi proyecto?",
  },
  {
    id: "lod400",
    icon: "brain",
    title: "LOD 400: Construcción y prefabricación",
    short: "Modelo para construcción y fabricación; incluye detalles y ensamblajes para producción en obra/taller.",
    desc: "Modelo listo para construcción y prefabricación, con detalles constructivos, secuencias y ensamblajes. Soporta la fabricación en taller y la logística de montaje en obra.",
    images: [
      "/img/bim/lod400/01.webp",
      "/img/bim/lod400/02.webp",
      "/img/bim/lod400/03.webp",
    ],
    whatsMsg:
      "Hola, me interesa el servicio LOD 400 (Construcción/prefabricación). ¿Podemos hablar de mi proyecto?",
  },
  {
    id: "lod500",
    icon: "brain",
    title: "LOD 500: Operación y mantenimiento",
    short: "Modelo conforme a obra (as-built) para operación y mantenimiento.",
    desc: "Modelo conforme a obra que documenta el estado final del activo. Integra información para operación, mantenimiento preventivo y gestión del ciclo de vida de la infraestructura.",
    images: [
      "/img/bim/lod500/01.webp",
      "/img/bim/lod500/02.webp",
      "/img/bim/lod500/03.webp",
    ],
    whatsMsg:
      "Hola, me interesa el servicio LOD 500 (Operación/Mantenimiento). ¿Podemos hablar de mi proyecto?",
  },
]

export const executedProjects = [
  {
    id: "nave-industrial",
    name: "Nave Industrial",
    summary:
      "Modelado integral para nave logística con coordinación de estructuras y arquitectura en etapas tempranas.",
    disciplines: ["Arquitectura", "Estructuras"],
    lodLevels: ["LOD 200", "LOD 300"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Nave industrial de uso múltiple para almacenamiento y operaciones logísticas ligeras. Pórticos en acero y elementos en concreto reforzado.",
      options: ["Complejidad Media"],
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
    summary:
      "Residencia unifamiliar optimizada para un cronograma acelerado y control de costos desde la fase esquemática.",
    disciplines: ["Arquitectura"],
    lodLevels: ["LOD 200"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Vivienda unifamiliar de baja complejidad, optimizada para tiempos de obra y costos.",
      options: ["Baja Complejidad"],
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
    summary:
      "Torre de vivienda multifamiliar con coordinación entre arquitectura y sistemas MEP para mitigación de interferencias.",
    disciplines: ["Arquitectura", "MEP"],
    lodLevels: ["LOD 200", "LOD 300"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Edificio residencial de media altura con énfasis en eficiencia energética y confort interior.",
      options: ["Complejidad Alta"],
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
    summary:
      "Coordinación multidisciplinar de hospital básico con rutas críticas de instalaciones y soporte a licenciamiento.",
    disciplines: ["Arquitectura", "Estructuras", "MEP"],
    lodLevels: ["LOD 300", "LOD 400"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Centro hospitalario de primer nivel con estrictos estándares sanitarios y alta densidad de redes técnicas.",
      options: ["Alta Complejidad"],
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
      imagesByComplexity: {
        "Alta Complejidad": "/img/proyectos/hospital/alta-complejidad.webp",
      },
    },
  },
  {
    id: "bloque-escolar",
    name: "Bloque Escolar",
    summary:
      "Bloque académico modular con integración de estructura prefabricada y envolvente eficiente.",
    disciplines: ["Arquitectura", "Estructuras"],
    lodLevels: ["LOD 200", "LOD 300"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Edificación educativa modular con requerimientos de flexibilidad y rápida ejecución.",
      options: ["Complejidad Media"],
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
      imagesByComplexity: {
        "Complejidad Media": "/img/proyectos/escolar/media.webp",
      },
    },
  },
  {
    id: "centros-ips",
    name: "Centros de Atención IPS",
    summary:
      "Red de centros de salud para atención primaria con enfoque en replicabilidad y control de calidad.",
    disciplines: ["Arquitectura"],
    lodLevels: ["LOD 200", "LOD 300"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Centros de atención IPS distribuidos, con prototipos adaptables a diferentes ubicaciones.",
      options: ["Complejidad Media"],
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
    summary:
      "Estructura de gran luz para usos mixtos con énfasis en coordinación estructural y logística constructiva.",
    disciplines: ["Estructuras"],
    lodLevels: ["LOD 300", "LOD 400"],
    complexity: {
      title: "Tipo de Edificio y Complejidad",
      text: "Edificio multifuncional con grandes luces y cargas variables que demandan ingeniería estructural avanzada.",
      options: ["Alta Complejidad"],
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
      imagesByComplexity: {
        "Alta Complejidad": "/img/proyectos/multifuncional/alta.webp",
      },
    },
  },
]
