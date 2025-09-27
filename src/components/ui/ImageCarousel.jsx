import { useState, useMemo } from "react"

export default function ImageCarousel({ images = [], className = "" }) {
  const sanitizedImages = useMemo(() => images.filter(Boolean), [images])
  const [current, setCurrent] = useState(0)

  if (sanitizedImages.length === 0) {
    return null
  }

  const goToIndex = (index) => {
    const total = sanitizedImages.length
    if (total === 0) return
    const nextIndex = (index + total) % total
    setCurrent(nextIndex)
  }

  const handlePrev = () => {
    goToIndex(current - 1)
  }

  const handleNext = () => {
    goToIndex(current + 1)
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-slate-100 ${className}`.trim()}>
      <div className="aspect-video w-full">
        <img
          src={sanitizedImages[current]}
          alt="Visualización LOD"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      {sanitizedImages.length > 1 ? (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between p-2">
            <button
              type="button"
              onClick={handlePrev}
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow"
              aria-label="Imagen anterior"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow"
              aria-label="Imagen siguiente"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
            {sanitizedImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToIndex(index)}
                className={`pointer-events-auto h-2.5 w-2.5 rounded-full transition-opacity ${
                  current === index ? "bg-slate-900 opacity-90" : "bg-white opacity-60"
                }`}
                aria-label={`Mostrar imagen ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
