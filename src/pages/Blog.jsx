import React from "react"

export default function Blog() {
  return (
    <section className="py-16">
      <div className="wrap-wide px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Blog</h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-700">
          Historias, aprendizajes y consejos para gestionar tus proyectos con claridad.
        </p>
        <div className="mt-12 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
          En breve publicaremos artículos y guías prácticas para tu día a día.
        </div>
      </div>
    </section>
  )
}
