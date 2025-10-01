import React, { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"

const SECONDARY = "#111111ff"

const NAV_ITEMS = [
  { to: "/", label: "Productos", end: true },
  { to: "/plataforma", label: "Plataforma", aliases: ["/calculadora-de-materiales"] },
  { to: "/blog", label: "Blog" },
]

const baseLinkClasses =
  "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

function NavLinks({ onClick, orientation = "horizontal", currentPathname }) {
  const itemClasses =
    orientation === "horizontal"
      ? "flex w-full items-center justify-center gap-2 overflow-x-auto"
      : "flex w-full flex-col gap-2"

  return (
    <ul className={`${itemClasses}`}>
      {NAV_ITEMS.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={item.end}
            className={({ isActive }) => {
              const matchAlias = item.aliases?.includes(currentPathname)

              return [
                baseLinkClasses,
                isActive || matchAlias
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-primary/5 hover:text-primary",
              ].join(" ")
            }}
            onClick={onClick}
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header className="fixed inset-x-0 top-[36px] md:top-[40px] z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="wrap-wide px-4">
        <div className="relative flex h-20 items-center gap-6">
          <a href="/" aria-label="Inicio" className="shrink-0">
            <img
              src={import.meta.env.BASE_URL + "logociviles.png"}
              alt="Civiles Pro"
              className="h-12 w-auto"
            />
          </a>

          <nav className="hidden flex-1 md:block">
            <NavLinks currentPathname={location.pathname} />
          </nav>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            <a href="https://app.civilespro.com/register" className="btn-outline whitespace-nowrap">
              Registrarse
            </a>
            <a
              href="https://app.civilespro.com/login"
              className="btn"
              style={{ backgroundColor: SECONDARY, color: "white", borderColor: SECONDARY }}
            >
              Entrar
            </a>
          </div>

          <button
            type="button"
            className="ml-auto inline-flex items-center justify-center rounded-full border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Abrir menú"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {mobileOpen && (
            <div className="absolute left-0 top-full mt-4 w-full rounded-3xl border border-gray-200 bg-white p-4 shadow-lg md:hidden">
              <NavLinks
                onClick={() => setMobileOpen(false)}
                orientation="vertical"
                currentPathname={location.pathname}
              />
              <div className="mt-4 flex flex-col gap-3">
                <a href="https://app.civilespro.com/register" className="btn-outline">
                  Registrarse
                </a>
                <a
                  href="https://app.civilespro.com/login"
                  className="btn"
                  style={{ backgroundColor: SECONDARY, color: "white", borderColor: SECONDARY }}
                >
                  Entrar
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
