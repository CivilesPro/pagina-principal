import { NavLink } from "react-router-dom"

const SECONDARY = "#111111ff"

const NAV_ITEMS = [
  { to: "/productos", label: "Productos" },
  { to: "/cursos", label: "Cursos" },
  { to: "/certificados", label: "Certificados" },
  { to: "/plataforma", label: "Plataforma" },
  { to: "/blog", label: "Blog" },
  { to: "/manuales", label: "Manual de Uso" },
]

const baseLinkClasses =
  "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="wrap-wide px-4">
        <div className="flex h-20 items-center gap-6">
          <a href="/" aria-label="Inicio" className="shrink-0">
            <img
              src={import.meta.env.BASE_URL + "logociviles.png"}
              alt="Civiles Pro"
              className="h-12 w-auto"
            />
          </a>

          <nav className="flex-1">
            <ul className="flex items-center justify-center gap-2 overflow-x-auto">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        baseLinkClasses,
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-primary/5 hover:text-primary",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <NavLink to="/planes" className="btn-outline whitespace-nowrap">
              Ver planes
            </NavLink>
            <NavLink
              to="/entrar"
              className="btn"
              style={{ backgroundColor: SECONDARY, color: "white", borderColor: SECONDARY }}
            >
              Entrar
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  )
}
