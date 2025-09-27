import { useEffect, useMemo, useRef, useState } from "react"

const levelStyles = {
  main: {
    container: "rounded-xl border border-slate-200/70 bg-slate-50",
    header: "py-3 px-3 md:py-4 md:px-4",
    title: "text-slate-800 text-base md:text-lg font-semibold",
    subtitle: "text-slate-500 text-sm",
    body: "px-3 pb-3 md:px-4",
  },
  sub: {
    container: "rounded-lg border border-slate-200 bg-white",
    header: "py-2.5 px-3",
    title: "text-slate-700 text-sm font-medium",
    subtitle: "text-slate-500 text-xs",
    body: "px-3 pb-3",
  },
}

const baseChevronClasses =
  "flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 transition-transform duration-300 border border-slate-200"

export default function CollapseItem({
  title,
  subtitle,
  defaultOpen = false,
  children,
  level = "main",
  leadingIcon = null,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [maxHeight, setMaxHeight] = useState(defaultOpen ? "none" : "0px")
  const contentRef = useRef(null)

  const styles = useMemo(() => levelStyles[level] ?? levelStyles.main, [level])

  useEffect(() => {
    const node = contentRef.current
    if (!node) return

    const height = node.scrollHeight

    if (isOpen) {
      setMaxHeight(`${height}px`)
      const timeout = setTimeout(() => {
        setMaxHeight("none")
      }, 250)
      return () => clearTimeout(timeout)
    }

    setMaxHeight(`${height}px`)
    requestAnimationFrame(() => {
      setMaxHeight("0px")
    })
  }, [isOpen])

  return (
    <div className={`${styles.container} ${className}`.trim()}>
      <button
        type="button"
        className={`flex w-full items-center justify-between gap-4 text-left ${styles.header}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className="flex flex-1 items-start gap-3">
          {leadingIcon ? leadingIcon : null}
          <div className="flex-1">
            <p className={`${styles.title}`}>{title}</p>
            {subtitle ? <p className={`${styles.subtitle} mt-1`}>{subtitle}</p> : null}
          </div>
        </div>
        <span className={`${baseChevronClasses} ${isOpen ? "rotate-180" : "rotate-0"}`} aria-hidden="true">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      <div
        style={{
          maxHeight: maxHeight === "none" ? undefined : maxHeight,
          overflow: "hidden",
          transition: "max-height 0.25s ease, opacity 0.25s ease",
          opacity: isOpen || maxHeight !== "0px" ? 1 : 0,
        }}
      >
        <div ref={contentRef} className={`${styles.body} pt-0`.trim()}>
          {children}
        </div>
      </div>
    </div>
  )
}
