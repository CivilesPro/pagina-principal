import { useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import blogs from "../data/blogList.json"
import SEO from "../components/SEO.jsx"

const SITE_URL = "https://civilespro.com"

const formatDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function Blog() {
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get("cat")

  const posts = useMemo(() => {
    const sorted = [...blogs].sort((a, b) => {
      const dateA = new Date(a.date || 0)
      const dateB = new Date(b.date || 0)
      return dateB - dateA
    })

    if (!categoryFilter) {
      return sorted
    }

    return sorted.filter((post) => post.category === categoryFilter)
  }, [categoryFilter])

  const isFiltered = Boolean(categoryFilter)

  return (
    <>
      <SEO
        title="Blog y manuales de CivilesPro"
        description="Aprende sobre gestión de obra, BIM y cómo aprovechar nuestras herramientas digitales con manuales detallados."
        url={`${SITE_URL}/blog`}
        canonical={`${SITE_URL}/blog`}
      />

      <section className="py-16">
        <div className="wrap-wide px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {isFiltered ? "Manual de uso" : "Blog y manuales"}
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary">Blog</h1>
              <p className="mt-4 text-lg text-gray-700">
                Historias, aprendizajes y guías prácticas para gestionar tus proyectos con claridad.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/blog"
                className={`btn-outline ${!isFiltered ? "border-primary text-primary" : ""}`}
              >
                Todo
              </Link>
              <Link
                to="/blog?cat=manual"
                className={`btn-outline ${categoryFilter === "manual" ? "border-primary text-primary" : ""}`}
              >
                Manual de Uso
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="flex h-full flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <header>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {post.category === "manual" ? "Manual de uso" : "Blog"}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-gray-900">{post.title}</h2>
                  {post.date && (
                    <p className="mt-1 text-sm text-gray-500">{formatDate(post.date)}</p>
                  )}
                </header>
                <p className="text-gray-700">{post.description}</p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-auto inline-flex items-center font-semibold text-primary"
                >
                  Leer más
                  <span className="ml-1">→</span>
                </Link>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="mt-12 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
              No encontramos artículos para esta categoría. Vuelve pronto para más contenido.
            </div>
          )}
        </div>
      </section>
    </>
  )
}
