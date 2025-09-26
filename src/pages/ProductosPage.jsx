import React from "react"
import SEO from "../components/SEO.jsx"
import products from "../data/products.js"

const SITE_URL = "https://civilespro.com"

export default function ProductosPage() {
  return (
    <>
      <SEO
        title="Productos digitales y herramientas para obra — Civiles Pro"
        description="Explora nuestras plantillas, herramientas digitales y acceso a la plataforma Civiles Pro para gestionar obra y presupuestos."
        url={`${SITE_URL}/`}
        canonical={`${SITE_URL}/`}
      />

      <section className="py-16">
        <div className="wrap-wide px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
              Productos Civiles Pro
            </h1>
            <p className="mt-5 text-lg text-gray-700">
              Plantillas, Excel y acceso a la plataforma para que calcules materiales, generes presupuestos y documentes tu obra sin complicaciones.
            </p>
          </div>

          <section id="productos" className="mt-14">
            <div className="flex items-baseline justify-between gap-6 flex-wrap">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Nuestros productos</h2>
                <p className="mt-2 text-gray-700">
                  Recursos listos para usar que aceleran tu flujo de trabajo diario.
                </p>
              </div>
              <a href="/contacto" className="btn-outline whitespace-nowrap">
                Solicitar asesoría
              </a>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <article key={product.slug} className="flex flex-col gap-4 p-6 border rounded-2xl bg-white shadow-sm">
                  <header>
                    <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                    {product.desc && <p className="mt-2 text-gray-700">{product.desc}</p>}
                  </header>
                  <div className="mt-auto">
                    <p className="font-bold text-primary">{product.price}</p>
                    <div className="mt-4 flex gap-3">
                      <a href={`/producto/${product.slug}`} className="btn-primary">
                        Ver detalles
                      </a>
                      <a href="/contacto" className="btn-outline">
                        Consultar
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-16 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
            ¿Buscas un producto a medida? Escríbenos y diseñamos la solución ideal para tu proyecto.
          </div>
        </div>
      </section>
    </>
  )
}
