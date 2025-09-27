import React from "react"
import { Helmet } from "react-helmet-async"

export default function SEO({ title, description, url, image, jsonLd, canonical }) {
  const canonicalHref = canonical || url

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {canonicalHref && <link rel="canonical" href={canonicalHref} />}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
