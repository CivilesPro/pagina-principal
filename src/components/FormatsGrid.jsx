import React from "react"

const cards = [
  {
    title: "PDF / DWG / IFC",
    description: "Archivos listos para coordinación y uso en plataformas como Navisworks, ArchiCAD, Tekla.",
    accent: "from-emerald-500 to-emerald-300",
  },
  {
    title: "RVT (opcional)",
    description:
      "Entregable bajo condiciones especiales, ya que contiene información diferenciadora del modelador.",
    accent: "from-slate-500 to-slate-300",
  },
]

export default function FormatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className={`h-36 w-full rounded-t-2xl bg-gradient-to-br ${card.accent} opacity-80`} aria-hidden />
          <div className="space-y-3 p-6">
            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
            <p className="text-gray-700">{card.description}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
