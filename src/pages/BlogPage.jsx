import React, { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import SEO from "../components/SEO.jsx"

const SITE_URL = "https://civilespro.com"

const posts = [
  {
    slug: "manual-calculadora-materiales",
    title: "Manual de uso: Calculadora de materiales",
    excerpt: "Paso a paso para sacar cantidades, controlar desperdicios y exportar a Excel.",
    category: "manual",
  },
  {
    slug: "manual-apu",
    title: "Manual de uso: Presupuestos con APU",
    excerpt: "Configura análisis de precios unitarios y comparte tus resultados con el equipo.",
    category: "manual",
  },
  {
    slug: "bim-coordinacion",
    title: "Coordinación BIM en proyectos reales",
    excerpt: "Buenas prácticas para trabajar con múltiples disciplinas y mantener la trazabilidad.",
    category: "blog",
  },
  {
    slug: "control-materiales-obra",
    title: "Control de materiales en obra sin dolores de cabeza",
    excerpt: "Cómo registrar entradas, salidas y generar reportes que el equipo entienda.",
    category: "blog",
  },
]

export default function BlogPage() {
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get("cat")

  const filteredPosts = useMemo(() => {
    if (categoryFilter === "manual") {
      return posts.filter((post) => post.category === "manual")
    }
    return posts
  }, [categoryFilter])

  return (
    <>
      <SEO
        title="Blog y manuales de Civiles Pro"
        description="Aprende sobre gestión de obra, BIM y cómo aprovechar nuestras herramientas digitales con manuales detallados."
        url={`${SITE_URL}/blog`}
        canonical={`${SITE_URL}/blog`}
      />

      <section className="py-16">
        <div className="wrap-wide px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary">Blog</h1>
              <p className="mt-4 text-lg text-gray-700">
                Historias, aprendizajes y guías prácticas para gestionar tus proyectos con claridad.
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href="/blog"
                className={`btn-outline ${categoryFilter === null ? "border-primary text-primary" : ""}`}
              >
                Todo
              </a>
              <a
                href="/blog?cat=manual"
                className={`btn-outline ${categoryFilter === "manual" ? "border-primary text-primary" : ""}`}
              >
                Manual de Uso
              </a>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {filteredPosts.map((post) => (
              <article key={post.slug} className="flex h-full flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm">
                <header>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {post.category === "manual" ? "Manual de uso" : "Blog"}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-gray-900">{post.title}</h2>
                </header>
                <p className="text-gray-700">{post.excerpt}</p>
                <a href={`/blog/${post.slug}`} className="mt-auto inline-flex items-center font-semibold text-primary">
                  Leer más
                  <span className="ml-1">→</span>
                </a>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="mt-12 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
              No encontramos artículos para esta categoría. Vuelve pronto para más contenido.
            </div>
          )}
        </div>
      </section>
    </>
  )
}
