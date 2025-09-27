import { useState, useMemo, useEffect, useRef } from "react"

const levelStyles = {
  main: {
    container: "border border-slate-200 rounded-xl bg-slate-50",
    trigger: "px-4 py-3 md:px-5 md:py-4",
    title: "text-lg font-semibold text-slate-900",
    subtitle: "text-sm text-slate-600",
  },
  sub: {
    container: "border border-slate-200 rounded-lg bg-white",
    trigger: "px-3 py-2",
    title: "text-sm font-medium text-slate-900",
    subtitle: "text-xs text-slate-500",
  },
}

const chevronBase =
  "ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-transform duration-300"

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
      }, 300)
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
        className={`flex w-full items-center gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${styles.trigger}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        {leadingIcon ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/70 text-slate-700">
            {leadingIcon}
          </span>
        ) : null}
        <div className="flex-1">
          <div className={`flex items-start gap-2 ${leadingIcon ? "mt-0.5" : ""}`}>
            <span className={styles.title}>{title}</span>
          </div>
          {subtitle ? <p className={`${styles.subtitle} mt-1`}>{subtitle}</p> : null}
        </div>
        <span className={`${chevronBase} ${isOpen ? "rotate-180" : "rotate-0"}`} aria-hidden="true">
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
          transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s",
          opacity: isOpen || maxHeight !== "0px" ? 1 : 0,
        }}
      >
        <div ref={contentRef} className={`px-4 pb-4 pt-0 md:px-5 ${level === "sub" ? "text-sm" : "text-base"}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
