import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import matter from "gray-matter"
import blogs from "../data/blogList.json"
import SEO from "../components/SEO.jsx"

const BLOG_POSTS = import.meta.glob("../blog/*.md", { as: "raw" })

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

export default function BlogPost() {
  const { slug } = useParams()
  const [content, setContent] = useState("")
  const [meta, setMeta] = useState({})
  const [status, setStatus] = useState("loading")

  const listMeta = useMemo(
    () => blogs.find((item) => item.slug === slug) ?? null,
    [slug],
  )

  useEffect(() => {
    let cancelled = false

    setStatus("loading")

    setMeta({})
    setContent("")

    const importer = BLOG_POSTS[`../blog/${slug}.md`]

    if (!importer) {
      setStatus("error")
      return () => {
        cancelled = true
      }
    }

    importer()
      .then((rawContent) => {
        if (cancelled) return null
        const { data, content: markdown } = matter(rawContent)
        setMeta(data)
        setContent(markdown)
        setStatus("ready")
        return null
      })
      .catch(() => {
        if (cancelled) return
        setStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (status === "error") {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Blog</p>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Artículo no encontrado</h1>
          <p className="mt-4 text-gray-600">
            El contenido que buscas no existe o fue actualizado. Vuelve al listado para encontrar más recursos.
          </p>
          <Link to="/blog" className="mt-6 inline-flex items-center font-semibold text-primary">
            Ir al blog
          </Link>
        </div>
      </section>
    )
  }

  const pageTitle = meta.title || listMeta?.title || "Blog"
  const pageDescription = meta.description || listMeta?.description
  const canonical = `${SITE_URL}/blog/${slug}`
  const publishedDate = meta.date || listMeta?.date
  const formattedDate = formatDate(publishedDate)
  
  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        url={canonical}
        canonical={canonical}
        image={meta.image}
      />

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <Link to="/blog" className="text-sm font-semibold text-primary">
            ← Volver al blog
          </Link>

          <article className="mt-8">
            {status === "loading" ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-5/6 rounded bg-gray-200" />
                <div className="h-96 w-full rounded bg-gray-200" />
              </div>
            ) : (
              <>
                <header className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                    {meta.category === "manual" || listMeta?.category === "manual" ? "Manual de uso" : "Blog"}
                  </p>
                  <h1 className="mt-3 text-4xl font-extrabold text-gray-900">{pageTitle}</h1>
                  {formattedDate && <p className="mt-2 text-sm text-gray-500">{formattedDate}</p>}
                  {pageDescription && <p className="mt-4 text-lg text-gray-600">{pageDescription}</p>}
                </header>

                <ReactMarkdown className="blog-content">{content}</ReactMarkdown>
              </>
            )}
          </article>
        </div>
      </section>
    </>
  )
}
