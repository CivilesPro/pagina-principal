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
