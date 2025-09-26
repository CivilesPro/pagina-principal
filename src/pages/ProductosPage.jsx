import React from "react"
import { useSearchParams } from "react-router-dom"
import SEO from "../components/SEO.jsx"
import products from "../data/products.js"
import { SUPPORTED_CURRENCIES } from "../data/exchangeRates.js"
import { formatPrice } from "../utils/formatPrice.js"

const SITE_URL = "https://civilespro.com"
const DEFAULT_CURRENCY = "COP"

function normalizeCurrency(value) {
  if (!value) return null
  const upper = value.toUpperCase()
  return SUPPORTED_CURRENCIES.includes(upper) ? upper : null
}

export default function ProductosPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [currency, setCurrency] = React.useState(() => {
    const fromParam = normalizeCurrency(searchParams.get("currency"))
    if (fromParam) return fromParam

    if (typeof window !== "undefined") {
      const stored = normalizeCurrency(window.localStorage.getItem("currency"))
      if (stored) return stored
    }

    return DEFAULT_CURRENCY
  })

  React.useEffect(() => {
    const paramCurrency = normalizeCurrency(searchParams.get("currency"))
    if (paramCurrency && paramCurrency !== currency) {
      setCurrency(paramCurrency)
    }
  }, [searchParams, currency])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("currency", currency)
    }

    const currentParam = normalizeCurrency(searchParams.get("currency"))
    if (currency === DEFAULT_CURRENCY) {
      if (currentParam) {
        const next = new URLSearchParams(searchParams)
        next.delete("currency")
        setSearchParams(next, { replace: true })
      }
      return
    }

    if (currency !== currentParam) {
      const next = new URLSearchParams(searchParams)
      next.set("currency", currency)
      setSearchParams(next, { replace: true })
    }
  }, [currency, searchParams, setSearchParams])

  return (
    <>
      <SEO
        title="Productos digitales y herramientas para obra — Civiles Pro"
        description="Explora nuestras plantillas, herramientas digitales y acceso a la plataforma Civiles Pro para gestionar obra y presupuestos."
        url={`${SITE_URL}/`}
        canonical={`${SITE_URL}/`}
      />

      <section className="py-16">
        <div className="wrap-wide px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
              Productos Civiles Pro
            </h1>
            <p className="mt-5 text-lg text-gray-700">
              Plantillas, Excel y acceso a la plataforma para que calcules materiales, generes presupuestos y documentes tu obra sin complicaciones.
            </p>
          </div>

          <section id="productos" className="mt-14">
            <div className="flex items-baseline justify-between gap-6 flex-wrap">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Nuestros productos</h2>
                <p className="mt-2 text-gray-700">
                  Recursos listos para usar que aceleran tu flujo de trabajo diario.
                </p>
              </div>
              <div className="ml-auto flex items-center gap-4 flex-wrap">
                <label className="text-sm font-medium text-gray-700" htmlFor="currency-select">
                  Moneda
                </label>
                <select
                  id="currency-select"
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                >
                  {SUPPORTED_CURRENCIES.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
                <a href="/contacto" className="btn-outline whitespace-nowrap">
                  Solicitar asesoría
                </a>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => {
                const formattedPrice = formatPrice(product.priceCop, currency)
                const formattedYearPrice =
                  product.priceCopYear != null
                    ? formatPrice(product.priceCopYear, currency)
                    : null

                return (
                  <article
                    key={product.slug}
                    className="flex h-full flex-col gap-5 rounded-2xl border bg-white p-6 shadow-sm"
                  >
                    <div className="flex h-48 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <header>
                      <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                      <p className="mt-2 text-sm text-gray-700">{product.description}</p>
                    </header>
                    <div className="mt-auto space-y-1">
                      {formattedYearPrice ? (
                        <>
                          <p className="font-semibold text-primary">
                            Plan mensual: {formattedPrice}
                          </p>
                          <p className="text-sm text-gray-700">
                            Plan anual: <span className="font-semibold text-primary">{formattedYearPrice}</span>
                          </p>
                        </>
                      ) : (
                        <p className="font-semibold text-primary">{formattedPrice}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn-primary mt-4"
                      onClick={() => console.log(product.slug)}
                    >
                      Comprar
                    </button>
                  </article>
                )
              })}
            </div>
          </section>

          <div className="mt-16 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
            ¿Buscas un producto a medida? Escríbenos y diseñamos la solución ideal para tu proyecto.
          </div>
        </div>
      </section>
    </>
  )
}
