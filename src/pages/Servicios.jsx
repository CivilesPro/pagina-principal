import React from "react"
import products from "../data/products.js"

export default function Servicios() {
  return (
    <section className="py-16">
      <div className="wrap-wide px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Servicios Civiles Pro</h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-700">
          Plantillas, herramientas y acompañamiento para que tus proyectos avancen con
          confianza.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map((p) => (
            <article key={p.slug} className="p-6 border rounded-2xl bg-white shadow-sm">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              {p.desc && <p className="mt-2 text-gray-700">{p.desc}</p>}
              <div className="mt-6 flex gap-3">
                <a href={`/producto/${p.slug}`} className="btn-primary">
                  Ver más
                </a>
                <a href="/contacto" className="btn-outline">
                  Consultar
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
