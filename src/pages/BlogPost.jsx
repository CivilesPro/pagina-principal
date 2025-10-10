// src/pages/BlogPost.jsx
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import fm from "front-matter"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Cargamos TODOS los .md del blog como texto (raw) de forma EAGER.
 * La ruta absoluta '/src/blog/*.md' funciona igual en dev y en build.
 */
const BLOG_RAWS = import.meta.glob("/src/blog/*.md", {
  as: "raw",
  eager: true,
});

/**
 * Construimos un índice en tiempo de carga:
 *  - key: slug (nombre de archivo sin .md)
 *  - value: { meta (frontmatter), content (markdown), path }
 */
const POSTS_BY_SLUG = Object.fromEntries(
  Object.entries(BLOG_RAWS).map(([path, raw]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    const parsed = fm(raw);
      return [
        slug.toLowerCase(),
        {
          slug,
          path,
          meta: parsed.attributes || {},
          content: parsed.body || "",
        },
      ];
  })
);

/** Lista ordenada por fecha (si existe en frontmatter) para navegación opcional */
const POSTS_SORTED = Object.values(POSTS_BY_SLUG).sort((a, b) => {
  const ad = a.meta?.date || "";
  const bd = b.meta?.date || "";
  return bd.localeCompare(ad);
});

export default function BlogPost() {
  const { slug: rawSlug } = useParams();
  const slug = decodeURIComponent(rawSlug || "").toLowerCase();

  // Busca el post por slug normalizado:
  const post = POSTS_BY_SLUG[slug];

  // Saca prev/next para navegar (opcional)
  const { prev, next } = useMemo(() => {
    if (!post) return { prev: null, next: null };
    const idx = POSTS_SORTED.findIndex((p) => p.slug.toLowerCase() === slug);
    return {
      prev: idx > 0 ? POSTS_SORTED[idx - 1] : null,
      next: idx >= 0 && idx < POSTS_SORTED.length - 1 ? POSTS_SORTED[idx + 1] : null,
    };
  }, [post, slug]);

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-xs tracking-widest text-green-700 font-semibold">BLOG</p>
        <h1 className="mt-2 text-3xl font-bold">Artículo no encontrado</h1>
        <p className="mt-2 text-gray-600">
          El contenido que buscas no existe o fue actualizado. Vuelve al listado para encontrar más
          recursos.
        </p>
        <Link to="/blog" className="mt-6 inline-block text-green-700 font-semibold underline">
          Ir al blog
        </Link>
      </main>
    );
  }

  const { meta, content } = post;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Encabezado */}
      <p className="text-xs tracking-widest text-green-700 font-semibold">BLOG</p>
      <h1 className="mt-2 text-3xl font-bold">{meta.title || post.slug}</h1>
      {meta.description && <p className="mt-2 text-gray-600">{meta.description}</p>}
      {meta.date && (
        <p className="mt-1 text-sm text-gray-400">
          {new Date(meta.date).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      {/* Imagen de portada opcional (frontmatter: cover: "/ruta.jpg") */}
      {meta.cover && (
        <img
          src={meta.cover}
          alt={meta.title || post.slug}
          className="mt-6 w-full rounded-xl border"
          loading="lazy"
        />
      )}

        {/* Galería desde front-matter (PNG/JPG/GIF) */}
        {Array.isArray(meta?.images) && meta.images.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {meta.images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${meta?.title || post.slug} – imagen ${i + 1}`}
                className="w-full rounded-xl border shadow-sm"
                loading="lazy"
              />
            ))}
          </div>
        )}

      {/* Contenido */}
      <article className="prose max-w-none mt-8 prose-headings:scroll-mt-24">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>

      {/* Navegación prev/next */}
      <nav className="mt-12 flex items-center justify-between gap-4">
        {prev ? (
          <Link
            to={`/blog/${prev.slug}`}
            className="inline-block rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            ← {prev.meta?.title || prev.slug}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/blog/${next.slug}`}
            className="inline-block rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            {next.meta?.title || next.slug} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
