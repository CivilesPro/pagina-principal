const products = [
  {
    slug: "pedido-acero",
    title: "Excel para el Pedido de Acero en Longitudes Comercial",
    priceCop: 100000,
    image: "/productos/Excel Pedido de Acero.png",
    images: [
      "/productos/Excel Pedido de Acero.png",
     
    ],
    fileKey: "pedido-acero-v2.zip",
    description: `
    📐 Plantilla especializada para calcular pedidos de acero en longitudes comerciales,
    optimizando el corte de varillas y reduciendo desperdicios. 
    ✅ Define automáticamente las combinaciones más eficientes.
    ✅ Genera reportes claros por diámetros, longitudes y totales.
    ✅ Incluye control de sobrantes para reutilizar en otros pedidos.
    Ideal para ingenieros, maestros y contratistas que necesitan rapidez y precisión en obra.`,
  },
  {
    slug: "control-acero",
    title: "Excel para Control de Acero",
    priceCop: 50000,
    image: "/productos/Excel de Control de Acero.png",
    images: [
      "/productos/Excel de Control de Acero.png",
      
    ],
    fileKey: "control-acero-control.zip",
    description: `
    📊 Lleva un control detallado de existencias, cortes y consumos de acero.
    ✅ Kardex automático con entradas y salidas.
    ✅ Reportes listos para supervisión y control de obra.
    ✅ Consolida cantidades por capítulo o frente de trabajo.
    Perfecto para proyectos donde el acero representa el mayor costo estructural.`,
  },
  {
    slug: "almacen-obra",
    title: "Excel para el Control de Almacén de Obra",
    priceCop: 30000,
    image: "/productos/Excel de Almacen.png",
    images: [
      "/productos/Excel de Almacen.png",
     
    ],
    fileKey: "almacen-obra-control.zip",
    description: `
    🏗 Gestiona el almacén de obra de forma simple.
    ✅ Entradas y salidas con kardex automático.
    ✅ Control de materiales por proveedor y por capítulo.
    ✅ Consolidado general para informes de residente o interventoría.
    Con esta plantilla sabes exactamente qué material entra, cuál sale y en qué frente se utiliza.`,
  },
  {
    slug: "formaletas-encofrados",
    title: "Excel para el Control de Formaletas & Encofrados",
    priceCop: 30000,
    image: "/productos/Excel de Encofrados.png",
    images: [
      "/productos/Excel de Encofrados.png",
      
    ],
    fileKey: "formaletas-encofrados-kit.zip",
    description: `
    🪵 Controla la rotación de formaletas y encofrados en tu proyecto.
    ✅ Planificación por frente de trabajo.
    ✅ Registra ciclos de uso, cantidades instaladas y recuperadas.
    ✅ Reduce pérdidas y optimiza la reutilización del material.
    Especial para pavimentos, losas y elementos que requieren varios encofrados.`,
  },
  {
    slug: "cantidades-instant",
    title: "Excel para Materiales de Obra al Instante 2.0",
    priceCop: 165000,
    image: "/productos/Excel de Cantidades de Materiales.png",
    images: [
      "/productos/Excel de Cantidades de Materiales.png",
      
    ],
    fileKey: "cantidades-instant-2.zip",
    description: `
    ⚡ Calcula materiales de múltiples partidas al instante:
    ✅ Concreto, ciclópeo, pavimento rígido, bordillos.
    ✅ Muros en bloques, mampostería estructural y drywall.
    ✅ Cubiertas (fibrocemento, UPVC, zinc, sándwich, standing seam).
    ✅ Pisos (porcelanato, cerámica, pulido).
    ✅ Acabados (pintura, yeso) y losas (concreto armado, placa fácil, losacero, aligerada).
    Incluye exportación a PDF con reportes listos para obra y presupuesto.`,
  },
  {
    slug: "concretos-autohormigoneras",
    title: "Excel para Concretos en Autohormigoneras & Mezcladoras",
    priceCop: 27000,
    image: "/productos/Excel de Concreto de Hormigueras.png",
    images: [
      "/productos/Excel de Concreto de Hormigueras.png",
      
    ],
    fileKey: "concretos-autohormigoneras.xlsx",
    description: `
    🏗 ¡¡Esta plantilla de Concreto lo hace TODO!!
    ✅ Calcula cemento, arena, grava y aditivos según resistencia.
    ✅ Dosificación precisa por tanda (trompos, mezcladoras, Carmix).
    ✅ Te da el tiempo exacto por ciclo de mezcla.
    ✅ Entrega cantidades en m³, kg, baldes o viajes de volqueta.
    ✅ Exporta PDF con resultados y permite cargar nuevos diseños de mezcla.
    Una herramienta indispensable en obra para controlar cada vaciado de concreto.`,
  },
  {
    slug: "plataforma-civilespro",
    title: "Plataforma CivilesPro (BIBLIOTECA de APU + Informes de Obra Diarios)",
    priceCop: 60000,
    priceCopYear: 150000,
    image: "/productos/PRESUPUESTO.png",
    images: [
      "/productos/PRESUPUESTO.png",
      
    ],
    fileKey: "plataforma-civilespro-plan.zip",
    description: `
    🌐 Herramienta para Crear Presupuestos Profesionales Rápidamente
    ✅ Armá APU en segundos desde una biblioteca con más de 1500 insumos: materiales, mano de obra, equipos y transporte actualizados al año.
    ✅ Usá, editá y duplicá una biblioteca de APU listos con fórmulas predefinidas y precios reales de obra actualizados.
    ✅ Calcula automáticamente todo: insumos, IVA, imprevistos, costos indirectos, utilidad por contrato y/o por labor.
    ✅ Crea memorias de cálculos conectados directamente al presupuesto.
    ✅ Incluye Informes de Obra Diarios (materiales, mano de obra, avances).
    ✅ Crea memorias de cálculos conectados directamente al presupuesto.
    Ajustá rendimientos según la realidad de tu proyecto, sin tener que rehacer fórmulas.

    Ideal para presupuestar, cotizar o simplemente tener claro cuánto cuesta cada actividad con datos reales.`
  },
  {
    slug: "plantillas-revit",
    title: "Plantillas de Revit Estructural & Arquitectónicas",
    priceCop: 60000,
    image: "/productos/Familia de Revit.png",
    images: [
      "/productos/Familia de Revit.png",
      
    ],
    fileKey: "plantillas-revit-pack.zip",
    description: `
    🏛 Paquete de plantillas de Revit listas para producción:
    ✅ Familias paramétricas estructurales y arquitectónicas.
    ✅ Vistas preconfiguradas, filtros, estilos de línea y cotas.
    ✅ Parámetros compartidos para coordinación entre disciplinas.
    Ahorra tiempo en cada proyecto BIM y mejora la presentación de planos.`,
  },
  {
    slug: "bloques-dinamicos",
    title: "Plantillas de Bloques Dinámicos (Arq + Estruct + Sanit + Eléctr.)",
    priceCop: 60000,
    image: "/productos/Bloques Dinamicos.png",
    images: [
      "/productos/Bloques Dinamicos.png",
      
    ],
    fileKey: "bloques-dinamicos-pack.zip",
    description: `
    📐 Biblioteca de bloques dinámicos para AutoCAD:
    ✅ Arquitectura: puertas, ventanas, mobiliario, detalles.
    ✅ Estructural: vigas, columnas, escaleras.
    ✅ Sanitario y Eléctrico: accesorios y símbolos normalizados.
    Listos para cuantificación, con atributos editables y escalables.`,
  },
  {
    slug: "megapack",
    title: "MEGAPACK INGENIERÍA & ARQUITECTURA",
    priceCop: 30000,
    image: "/productos/Megapack.png",
    images: [
      "/productos/Megapack.png",
     
    ],
    fileKey: null,
    description: `
    🎯 ¡Acceso de por vida al paquete más completo!
    📦 Programas FULL en español:
      Revit 2024, ArchiCAD 25, Tekla Structures 2024, SketchUp 2024,
      AutoCAD 2024 / 2021, Microsoft Office 2021 / 2024.
    🎥 16 Cursos PRO:
      Revit (Metodología BIM, Estructural, MEP), ArchiCAD Completo,
      Tekla Avanzado, AutoCAD Avanzado + 3D, 3ds Max desde cero,
      Project – Programación de obra, CYPE, Navisworks y más.
    🛠 Material extra:
      Bloques dinámicos, rutinas LISP, familias Revit, componentes SketchUp,
      patrones hatch, plugins, libros técnicos de ingeniería y arquitectura.
    Una biblioteca definitiva para tu carrera profesional.`,
  },
];

export default products;
