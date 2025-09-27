export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-lg font-bold text-emerald-700">Civiles Pro</div>
          <p className="mt-2 text-sm text-gray-600">
            Plantillas, herramientas y recursos para ingeniería y arquitectura.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://www.facebook.com/ingcivilespro"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 transition hover:text-emerald-600"
            >
              <span className="sr-only">Facebook</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-2.9h2V9.7c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.9h2.2l-.4 2.9h-1.8v7A10 10 0 0 0 22 12" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/civilespro/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 transition hover:text-emerald-600"
            >
              <span className="sr-only">Instagram</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8m0 2A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8m5.5-3.6a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@ingcivilespro"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 transition hover:text-emerald-600"
            >
              <span className="sr-only">TikTok</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M18 5.1a5.3 5.3 0 0 1-2.6-1.5 5.2 5.2 0 0 1-1.5-2.6h-2.5v14a2.2 2.2 0 1 1-3.5-1.8V10H5.4v3.2a4.7 4.7 0 1 0 7.2 4V9.2a7.9 7.9 0 0 0 4.8 1.6V8.3a5.6 5.6 0 0 1-1.4-.4 5.7 5.7 0 0 1-2-1.3 5.6 5.6 0 0 0 3 1z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-900">Productos</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <a href="/?tab=productos" className="hover:text-gray-900">
                Plantillas Excel
              </a>
            </li>
            <li>
              <a href="/?tab=bim" className="hover:text-gray-900">
                BIM / Revit
              </a>
            </li>
            <li>
              <a href="/?tab=plataforma" className="hover:text-gray-900">
                Plataforma APU + IOD
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-900">Soporte</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <a
                href="https://wa.me/573127437848"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-900"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a href="mailto:soporte@civilespro.com" className="hover:text-gray-900">
                soporte@civilespro.com
              </a>
            </li>
            <li>
              <a href="/preguntas-frecuentes" className="hover:text-gray-900">
                Preguntas frecuentes
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-900">Legal</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <a href="/terminos" className="hover:text-gray-900">
                Términos de servicio
              </a>
            </li>
            <li>
              <a href="/privacidad" className="hover:text-gray-900">
                Política de privacidad
              </a>
            </li>
            <li>
              <a href="/licencias" className="hover:text-gray-900">
                Licencias de uso
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs leading-relaxed text-gray-600">
          <p>
            <strong>Descargas digitales:</strong> los productos se entregan mediante enlace de descarga inmediato tras la
            confirmación de pago. Al tratarse de bienes digitales,
            <strong> no se realizan reembolsos una vez descargados</strong>, salvo fallas técnicas atribuibles al proveedor.
            Ofrecemos soporte técnico para instalación/uso básico.
          </p>
          <p className="mt-2">
            <strong>Moneda y precios:</strong> los valores mostrados pueden visualizarse en diferentes monedas para referencia.
            <strong> Los pagos se procesan en USD a través de PayPal</strong>, pudiendo aplicar comisiones/impuestos de
            terceros. Precios y disponibilidad sujetos a cambios sin previo aviso.
          </p>
          <p className="mt-2">
            Marcas y nombres comerciales pertenecen a sus respectivos propietarios. © {year} Civiles Pro.
          </p>
        </div>
      </div>
    </footer>
  )
}
