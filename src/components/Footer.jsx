const PRIMARY = "#055a27";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="text-white" style={{ backgroundColor: PRIMARY }}>
      <div className="wrap-wide px-4 py-12 space-y-12">
        <div className="pt-8 mt-8 border-t border-white/20 text-xs text-center">
          © {year} Civiles Pro. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
