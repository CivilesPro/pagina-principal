import React, { useEffect, useMemo, useRef, useState } from "react"

const getBadgeLabel = (item) => {
  const match = item.match(/LOD\s*(\d+)/i)
  return match ? match[1] : "+"
}

export default function ExpandableCard({ title, intro, items }) {
  const [isOpen, setIsOpen] = useState(false)
  const [maxHeight, setMaxHeight] = useState("0px")
  const contentRef = useRef(null)

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`)
    } else {
      setMaxHeight("0px")
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !contentRef.current || typeof ResizeObserver === "undefined") return

    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        setMaxHeight(`${contentRef.current.scrollHeight}px`)
      }
    })

    observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleToggle()
    }
  }

  const handleButtonClick = (event) => {
    event.stopPropagation()
    handleToggle()
  }

  const stateClasses = useMemo(
    () => ({
      container: isOpen ? "-translate-y-2 shadow-lg" : "hover:-translate-y-1 hover:shadow-lg",
      content: isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
    }),
    [isOpen],
  )

  return (
    <article
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={`h-full cursor-pointer rounded-2xl bg-white p-6 shadow-sm transition-transform duration-300 ease-out ${stateClasses.container}`}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-gray-600">{intro}</p>
        </div>

        <div
          style={{ maxHeight }}
          className="overflow-hidden transition-[max-height] duration-300 ease-out"
        >
          <div
            ref={contentRef}
            className={`space-y-3 pt-2 text-gray-700 transition-all duration-300 ease-out ${stateClasses.content}`}
          >
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                    LOD {getBadgeLabel(item)}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleButtonClick}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"
          >
            <span>{isOpen ? "Ver menos" : "Ver más"}</span>
            <svg
              aria-hidden="true"
              className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}
