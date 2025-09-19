import React from "react"
import products from "../data/products.js"

export default function Productos() {
  return (
    <section className="py-16">
      <div className="wrap-wide px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Productos Civiles Pro</h1>
        <section id="productos" className="py-16">
                <div className="wrap-wide px-4">
                  <h2 className="text-2xl md:text-3xl font-bold">Nuestros productos</h2>
                  <p className="mt-2 text-gray-700">Plantillas, Excel y plataforma para acelerar tu trabajo diario.</p>
        
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {products.map((p) => (
                      <article key={p.slug} className="p-6 border rounded-2xl bg-white">
                        <h3 className="text-lg font-semibold">{p.title}</h3>
                        {p.desc && <p className="mt-2 text-gray-700">{p.desc}</p>}
                        <div className="mt-4 font-bold">{p.price}</div>
                        <div className="mt-4 flex gap-3">
                          <a href={`/producto/${p.slug}`} className="btn-primary">Ver más</a>
                          <a href="/contacto" className="btn-outline">Consultar</a>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
        <div className="mt-12 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
          Próximamente encontrarás más información sobre nuestros productos destacados.
        </div>
      </div>
    </section>
  )
}
