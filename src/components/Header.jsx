// src/components/Header.jsx
const PRIMARY = "#055a27";
const SECUNDARY = "#111111ff";

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 backdrop-blur"
      style={{ background: "rgba(5, 90, 39, 0.9)" }}
    >
      <div className="container-wide h-16 flex items-center justify-between px-4">
        <a href="/" aria-label="Inicio">
          <img
            src={import.meta.env.BASE_URL + "logociviles.png"}
            alt="Civiles Pro"
            className="h-10 w-auto"
          />
        </a>

        {/* Navegación derecha */}
        <nav className="flex items-center gap-3">
          <a
            href="#planes"
            className="hidden sm:inline text-white/90 hover:text-white"
          >
            Ver planes
          </a>
          <a
            href="https://app.civilespro.com/login"
            className="px-4 py-2 rounded-md font-semibold text-white"
            style={{ backgroundColor: SECUNDARY }}
          >
            Entrar
          </a>
        </nav>
      </div>
    </header>
  );
}
