import { useMemo, useRef, useState } from "react"

export default function ImageCarousel({ images = [], className = "" }) {
  const sanitizedImages = useMemo(() => images.filter(Boolean), [images])
  const [current, setCurrent] = useState(0)
  const touchStartRef = useRef(null)

  if (sanitizedImages.length === 0) {
    return null
  }

  const goToIndex = (index) => {
    const total = sanitizedImages.length
    if (total === 0) return
    const next = (index + total) % total
    setCurrent(next)
  }

  const handlePrev = () => {
    goToIndex(current - 1)
  }

  const handleNext = () => {
    goToIndex(current + 1)
  }

  const handleTouchStart = (event) => {
    if (!event.touches?.length) return
    touchStartRef.current = event.touches[0].clientX
  }

  const handleTouchEnd = (event) => {
    if (touchStartRef.current == null) return
    const touchEnd = event.changedTouches?.[0]?.clientX
    if (touchEnd == null) {
      touchStartRef.current = null
      return
    }

    const delta = touchEnd - touchStartRef.current
    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        handlePrev()
      } else {
        handleNext()
      }
    }
    touchStartRef.current = null
  }

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 ${className}`.trim()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={sanitizedImages[current]}
        alt="Visualización LOD"
        className="h-full w-full object-cover"
        loading="lazy"
      />

      {sanitizedImages.length > 1 ? (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute inset-y-0 left-0 flex items-center px-2 text-slate-700 opacity-70 transition hover:opacity-100"
            aria-label="Imagen anterior"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 6-6 6 6 6" />
              </svg>
            </span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 opacity-70 transition hover:opacity-100"
            aria-label="Imagen siguiente"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 6 6 6-6 6" />
              </svg>
            </span>
          </button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {sanitizedImages.map((_, index) => {
              const isActive = index === current
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    isActive ? "bg-slate-900" : "bg-white/80"
                  }`}
                  aria-label={`Ir a la imagen ${index + 1}`}
                />
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}
