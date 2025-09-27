import React from "react"
import { useSearchParams } from "react-router-dom"
import SEO from "../components/SEO.jsx"
import ProductModal from "../components/ProductModal.jsx"
import products from "../data/products.js"
import { SUPPORTED_CURRENCIES } from "../data/exchangeRates.js"
import { formatPrice } from "../utils/formatPrice.js"

const SITE_URL = "https://civilespro.com"
const DEFAULT_CURRENCY = "COP"

const BADGES_BY_SLUG = {
  "cantidades-instant": "Más vendido",
  "control-acero": "Mejor precio",
  "concretos-autohormigoneras": "Nuevo",
}

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

  const handleCurrencyChange = React.useCallback(
    (nextCurrency) => {
      setCurrency((current) => (current === nextCurrency ? current : nextCurrency))
    },
    []
  )

  const [selectedProduct, setSelectedProduct] = React.useState(null)

  const handleOpenProduct = React.useCallback((product) => {
    setSelectedProduct(product)
  }, [])

  React.useEffect(() => {
    if (!selectedProduct) return
    if (typeof window === "undefined" || typeof document === "undefined") return

    const scrollY = window.scrollY
    const body = document.body
    if (!body) return

    const { style } = body
    const previousStyles = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      width: style.width,
    }

    style.overflow = "hidden"
    style.position = "fixed"
    style.top = `-${scrollY}px`
    style.width = "100%"

    return () => {
      style.overflow = previousStyles.overflow || ""
      style.position = previousStyles.position || ""
      style.top = previousStyles.top || ""
      style.width = previousStyles.width || ""
      window.scrollTo(0, scrollY)
    }
  }, [selectedProduct])

  React.useEffect(() => {
    const paramCurrency = normalizeCurrency(searchParams.get("currency"))
    if (paramCurrency && paramCurrency !== currency) {
      setCurrency(paramCurrency)
      if (typeof window !== "undefined") {
        window.localStorage.setItem("currency", paramCurrency)
      }
    }
  }, [searchParams, currency])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("currency", currency)
    }

    setSearchParams(
      (previousParams) => {
        const currentParam = normalizeCurrency(previousParams.get("currency"))

        if (currency === DEFAULT_CURRENCY) {
          if (!currentParam) {
            return previousParams
          }

          const nextParams = new URLSearchParams(previousParams)
          nextParams.delete("currency")
          return nextParams
        }

        if (currency === currentParam) {
          return previousParams
        }

        const nextParams = new URLSearchParams(previousParams)
        nextParams.set("currency", currency)
        return nextParams
      },
      { replace: true }
    )
  }, [currency, setSearchParams])

  return (
    <>
      <SEO
        title="Productos digitales y herramientas para obra — Civiles Pro"
        description="Explora nuestras plantillas, herramientas digitales y acceso a la plataforma Civiles Pro para gestionar obra y presupuestos."
        url={`${SITE_URL}/`}
        canonical={`${SITE_URL}/`}
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-extrabold text-primary md:text-5xl">
            Productos Civiles Pro
          </h1>
          <p className="mt-5 text-lg text-gray-700">
            Plantillas, Excel y acceso a la plataforma para que calcules materiales, generes presupuestos y documentes tu obra sin complicaciones.
          </p>
        </div>
      </section>

      <section id="productos" className="bg-gray-50 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-900">Nuestros productos</h2>
              <p className="mt-2 text-gray-600">
                Recursos listos para usar que aceleran tu flujo de trabajo diario.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <span className="text-sm font-medium text-gray-600">Moneda</span>
              <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-gray-200 bg-white p-1 shadow-sm snap-x">
                {SUPPORTED_CURRENCIES.map((code) => {
                  const isActive = code === currency
                  return (
                    <button
                      key={code}
                      type="button"
                      className={`snap-center rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                        isActive
                          ? "bg-emerald-600 text-white shadow"
                          : "text-gray-700 hover:bg-emerald-50"
                      }`}
                      onClick={() => handleCurrencyChange(code)}
                    >
                      {code}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const formattedPrice = formatPrice(product.priceCop, currency)
              const formattedYearPrice =
                product.priceCopYear != null
                  ? formatPrice(product.priceCopYear, currency)
                  : null

              const badgeLabel = BADGES_BY_SLUG[product.slug]
              const isConsultation = product.priceCop == null

              return (
                <article
                  key={product.slug}
                  className={`group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${isConsultation ? "" : "cursor-pointer"}`}
                  role="button"
                  tabIndex={isConsultation ? -1 : 0}
                  aria-disabled={isConsultation}
                  onClick={() => {
                    if (isConsultation) return
                    handleOpenProduct(product)
                  }}
                  onKeyDown={(event) => {
                    if (isConsultation) return
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      handleOpenProduct(product)
                    }
                  }}
                >
                  {badgeLabel ? (
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white shadow">
                      {badgeLabel}
                    </span>
                  ) : null}
                <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold leading-tight text-gray-900 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                  </div>
                  <div className="mt-auto space-y-4">
                    <div className="space-y-1 mt-5">
                      {formattedYearPrice ? (
                        <>
                          <p className="text-base font-bold text-gray-900">Desde: {formattedPrice}</p>
                          <p className="text-xs text-gray-500">
                            Premium: <span className="font-semibold text-gray-900">{formattedYearPrice}</span>
                          </p>
                        </>
                      ) : (
                        <p className="text-base font-bold text-gray-900">Precio: {formattedPrice}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      className={`h-11 w-full rounded-xl font-semibold shadow transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 ${
                        isConsultation
                          ? "border border-emerald-700 bg-white text-emerald-700 hover:bg-emerald-50"
                          : "bg-emerald-700 text-white hover:bg-emerald-800"
                      }`}
                      onClick={(event) => {
                        event.stopPropagation()
                        if (isConsultation) return
                        handleOpenProduct(product)
                      }}
                      disabled={isConsultation}
                    >
                      {isConsultation ? "Solicitar información" : "Comprar"}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-16 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
            ¿Buscas un producto a medida? Escríbenos y diseñamos la solución ideal para tu proyecto.
          </div>
        </div>
      </section>

      {selectedProduct && (
        <ProductModal
          isOpen={true}
          product={selectedProduct}
          currency={currency}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
