const products = [
  {
    slug: "pedido-acero",
    title: "Excel para el Pedido de Acero en Longitudes Comercial",
    priceCop: 100000,
    image: "/productos/Excel Pedido de Acero.png",
    images: [
      "/productos/Excel Pedido de Acero.png",
      "/productos/Excel Pedido de Acero.png",
      "/productos/Excel Pedido de Acero.png",
    ],
    fileKey: "pedido-acero-v2.zip",
    description:
      "Plantilla para calcular pedidos de acero en longitudes comerciales y optimizar desperdicios.",
  },
  {
    slug: "control-acero",
    title: "Excel para Control de Acero",
    priceCop: 50000,
    image: "/productos/Excel de Control de Acero.png",
    images: [
      "/productos/Excel de Control de Acero.png",
      "/productos/Excel de Control de Acero.png",
      "/productos/Excel de Control de Acero.png",
    ],
    fileKey: "control-acero-control.zip",
    description:
      "Control de existencias, cortes y consumos de acero con reportes rápidos.",
  },
  {

    slug: "almacen-obra",
    title: "Excel para el Control de Almacén de Obra",
    priceCop: 30000,
    image: "/productos/Excel de Almacen.png",
    images: [
      "/productos/Excel de Almacen.png",
      "/productos/Excel de Almacen.png",
      "/productos/Excel de Almacen.png",
    ],
    fileKey: "almacen-obra-control.zip",
    description:
      "Entradas, salidas y kardex de materiales con consolidado por capítulo.",
  },
  {
    slug: "formaletas-encofrados",
    title: "Excel para el Control de Formaletas & Encofrados",
    priceCop: 30000,
    image: "/productos/Excel de Encofrados.png",
    images: [
      "/productos/Excel de Encofrados.png",
      "/productos/Excel de Encofrados.png",
      "/productos/Excel de Encofrados.png",
    ],
    fileKey: "formaletas-encofrados-kit.zip",
    description:
      "Planificación y control de encofrados por frente de trabajo.",
  },
  {

    slug: "cantidades-instant",
    title: "Excel para Materiales de Obra al Instante 2.0",
    priceCop: 165000,
    image: "/productos/Excel de Cantidades de Materiales.png",
    images: [
      "/productos/Excel de Cantidades de Materiales.png",
      "/productos/Excel de Cantidades de Materiales.png",
      "/productos/Excel de Cantidades de Materiales.png",
    ],
    fileKey: "cantidades-instant-2.zip",
    description:
      "Calcula materiales de múltiples partidas (concreto, muros, losas, acabados, cubiertas, etc.) al instante.",
  },
  {
    slug: "concretos-autohormigoneras",
    title: "Excel para Concretos en Autohormigoneras & Mezcladoras",
    priceCop: 20000,
    image: "/productos/Excel de Concreto de Hormigueras.png",
    images: [
      "/productos/Excel de Concreto de Hormigueras.png",
      "/productos/Excel de Concreto de Hormigueras.png",
      "/productos/Excel de Concreto de Hormigueras.png",
    ],
    fileKey: "concretos-autohormigoneras.xlsx",
    description:
      "¡¡Esta plantilla de Concreto lo hace TODO!! ✅ Calcula cemento, arena, grava y aditivos por resistencia. ✅ Tiempos por tanda en trompos/mezcladoras/Carmix. ✅ Dosificación por ciclo. ✅ Entrega en m³, kg, baldes o viajes. ✅ Exporta PDF. ✅ Permite cargar nuevos diseños de mezcla.",
  },
   {
    slug: "almacen-obra",
    title: "Excel para el Control de Almacén de Obra",
    priceCop: 30000,
    image: "/productos/Excel de Almacen.png",
    description:
      "Entradas, salidas y kardex de materiales con consolidado por capítulo.",
  },
  {
    slug: "formaletas-encofrados",
    title: "Excel para el Control de Formaletas & Encofrados",
    priceCop: 30000,
    image: "/productos/Excel de Encofrados.png",
    description:
      "Planificación y control de encofrados por frente de trabajo.",
  },
  {
    slug: "plataforma-civilespro",
    title: "Plataforma CivilesPro (APU + Informes de Obra Diarios)",
    priceCop: 60000,
    priceCopYear: 150000,
    image: "/productos/Excel de Cantidades de Materiales.png",
    images: [
      "/productos/Excel de Cantidades de Materiales.png",
      "/productos/Excel de Cantidades de Materiales.png",
      "/productos/Excel de Cantidades de Materiales.png",
    ],
    fileKey: "plataforma-civilespro-plan.zip",
    description:
      "Genera presupuestos con APU conectados + Informes de Obra Diarios en Excel. Plan mensual y anual.",
  },
  {
    slug: "plantillas-revit",
    title: "Plantillas de Revit Estructural & Arquitectónicas",
    priceCop: 60000,
    image: "/productos/Familia de Revit.png",
    images: [
      "/productos/Familia de Revit.png",
      "/productos/Familia de Revit.png",
      "/productos/Familia de Revit.png",
    ],
    fileKey: "plantillas-revit-pack.zip",
    description:
      "Incluye vistas, familias, detalles y parámetros compartidos listos para producción.",
  },
  {
    slug: "bloques-dinamicos",
    title: "Plantillas de Bloques Dinámicos (Arq + Estruct + Sanit + Eléctr.)",
    priceCop: 60000,
    image: "/productos/Bloques Dinamicos.png",
    images: [
      "/productos/Bloques Dinamicos.png",
      "/productos/Bloques Dinamicos.png",
      "/productos/Bloques Dinamicos.png",
    ],
    fileKey: "bloques-dinamicos-pack.zip",
    description:
      "Bloques dinámicos listos para acelerar dibujo y cuantificación en AutoCAD.",
  },
  {
    slug: "megapack",
    title: "MEGAPACK INGENIERÍA & ARQUITECTURA",
    priceCop: 30000,
    image: "/productos/Megapack.png",
    images: [
      "/productos/Megapack.png",
      "/productos/Megapack.png",
      "/productos/Megapack.png",
    ],
    fileKey: null,
    description:
      "Acceso de por vida. Incluye programas FULL (Revit 2024, ArchiCAD 25, Tekla 2024, SketchUp 2024, AutoCAD 2024/2021, Office 2021/2024), 16 cursos PRO (Revit BIM, Estructural, MEP, ArchiCAD, Tekla, AutoCAD, 3ds Max, Project, CYPE, Navisworks y más), materiales extra (bloques dinámicos, LISP, familias Revit, componentes SketchUp, hatches, plugins), y galería de libros técnicos.",
  },
]

export default products
