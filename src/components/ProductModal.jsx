import React from "react"
import fakeReviews from "../data/fakeReviews.json"
import { formatPrice } from "../utils/formatPrice.js"

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID

function useLockBodyScroll(active) {
  React.useEffect(() => {
    if (!active) return undefined
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [active])
}

function usePayPalButtons({ clientId, currency, dependencyKey, createOrder, onApprove, onError }) {
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    if (!clientId || !dependencyKey) return undefined
    const container = containerRef.current
    if (!container) return undefined

    container.innerHTML = ""

    const removeExistingScripts = () => {
      const scripts = document.querySelectorAll("script[data-paypal-sdk]")
      scripts.forEach((script) => {
        if (
          script instanceof HTMLScriptElement &&
          (script.dataset.currency !== currency || script.dataset.clientId !== clientId)
        ) {
          script.remove()
        }
      })
    }

    removeExistingScripts()

    let isMounted = true

    const renderButtons = () => {
      if (!isMounted || typeof window === "undefined" || !window.paypal) return
      try {
        const buttons = window.paypal.Buttons({
          style: {
            shape: "rect",
            layout: "vertical",
            label: "paypal",
            height: 48,
            color: "gold",
          },
          fundingSource: window.paypal.FUNDING.PAYPAL,
          createOrder,
          onApprove,
          onError,
        })

        buttons.render(container).catch((err) => {
          console.error("paypal.render", err)
          onError?.(err)
        })
      } catch (error) {
        console.error("paypal.buttons", error)
        onError?.(error)
      }
    }

    const existingScript = document.querySelector(
      `script[data-paypal-sdk][data-currency="${currency}"][data-client-id="${clientId}"]`,
    )

    if (existingScript) {
      if (existingScript.hasAttribute("data-loaded") && window.paypal) {
        renderButtons()
      } else {
        existingScript.addEventListener("load", renderButtons, { once: true })
        existingScript.addEventListener(
          "error",
          () => onError?.(new Error("No se pudo cargar el SDK de PayPal.")),
          { once: true },
        )
      }
    } else {
      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`
      script.async = true
      script.dataset.paypalSdk = "true"
      script.dataset.currency = currency
      script.dataset.clientId = clientId
      script.addEventListener("load", () => {
        script.setAttribute("data-loaded", "true")
        renderButtons()
      })
      script.addEventListener("error", () => {
        onError?.(new Error("No se pudo cargar el SDK de PayPal."))
      })
      document.body.appendChild(script)
    }

    return () => {
      isMounted = false
    }
  }, [clientId, currency, dependencyKey, createOrder, onApprove, onError])

  return containerRef
}

function StarRating({ value, size = "md" }) {
  const rounded = Math.round(value)
  return (
    <div className={`flex items-center gap-1 ${size === "sm" ? "text-sm" : "text-lg"}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < rounded ? "text-amber-500" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  const formattedDate = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(review.date))
    } catch (error) {
      console.warn("Fecha de reseña inválida", review.date, error)
      return review.date
    }
  }, [review.date])

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900">{review.name}</p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
        <StarRating value={review.rating} size="sm" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-700">{review.text}</p>
    </article>
  )
}

export default function ProductModal({ product, currency, onClose }) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [orderId, setOrderId] = React.useState(null)
  const [loadingOrder, setLoadingOrder] = React.useState(false)
  const [capturing, setCapturing] = React.useState(false)
  const [paid, setPaid] = React.useState(false)
  const [downloadUrl, setDownloadUrl] = React.useState(null)
  const [errorMsg, setErrorMsg] = React.useState(null)

  const dialogRef = React.useRef(null)
  const closeButtonRef = React.useRef(null)

  const isOpen = Boolean(product)
  const isPurchasable = React.useMemo(() => {
    if (!product) return false
    return product.priceCop != null && Boolean(product.fileKey)
  }, [product])

  const productImages = React.useMemo(() => {
    if (!product) return []
    if (product.images && product.images.length > 0) {
      return product.images
    }
    return product.image ? [product.image] : []
  }, [product])

  const reviews = React.useMemo(() => {
    if (!product) return []
    return fakeReviews[product.slug] ?? []
  }, [product])

  const averageRating = React.useMemo(() => {
    if (!reviews.length) return 5
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return total / reviews.length
  }, [reviews])

  const formattedPrice = React.useMemo(() => {
    if (!product) return null
    return formatPrice(product.priceCop, currency)
  }, [currency, product])

  const formattedYearPrice = React.useMemo(() => {
    if (!product || product.priceCopYear == null) return null
    return formatPrice(product.priceCopYear, currency)
  }, [currency, product])

  const descriptionParagraphs = React.useMemo(() => {
    if (!product?.description) return []
    return product.description
      .split("\n")
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
  }, [product])

  useLockBodyScroll(isOpen)

  React.useEffect(() => {
    if (!isOpen) return undefined

    const handler = (event) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose?.()
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  React.useEffect(() => {
    if (!isOpen) return
    const element = dialogRef.current
    if (element) {
      element.focus()
    }
    const timeout = window.setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 150)

    return () => window.clearTimeout(timeout)
  }, [isOpen])

  React.useEffect(() => {
    if (!isOpen) return
    setActiveIndex(0)
    setOrderId(null)
    setPaid(false)
    setDownloadUrl(null)
    setErrorMsg(null)
  }, [isOpen, product])

  const fetchOrder = React.useCallback(async () => {
    if (!product || !isPurchasable) {
      return
    }

    if (!PAYPAL_CLIENT_ID) {
      setErrorMsg("Configuración de PayPal incompleta. Contacta al administrador.")
      return
    }

    setLoadingOrder(true)
    setErrorMsg(null)
    setOrderId(null)

    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: product.slug,
          currency,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const message = errorData?.detail || "No se pudo iniciar el pago."
        throw new Error(message)
      }

      const data = await response.json()
      if (!data?.orderID) {
        throw new Error("Respuesta inválida del servidor.")
      }
      setOrderId(data.orderID)
    } catch (error) {
      console.error("create-order", error)
      setErrorMsg(error.message || "No se pudo iniciar el pago.")
    } finally {
      setLoadingOrder(false)
    }
  }, [currency, isPurchasable, product])

  React.useEffect(() => {
    if (!isOpen) return
    if (!isPurchasable) {
      return
    }
    fetchOrder()
  }, [fetchOrder, isOpen, isPurchasable])

  const handlePayPalError = React.useCallback((error) => {
    console.error("paypal-error", error)
    setErrorMsg(error?.message || "Ocurrió un error con PayPal. Intenta nuevamente.")
  }, [])

  const handleApprove = React.useCallback(async () => {
    if (!orderId) {
      handlePayPalError(new Error("Orden no disponible."))
      return
    }

    setCapturing(true)
    setErrorMsg(null)

    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderID: orderId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const message = errorData?.detail || "No se pudo completar el pago."
        throw new Error(message)
      }

      const data = await response.json()
      if (!data?.downloadUrl) {
        throw new Error("No se recibió el enlace de descarga.")
      }

      setPaid(true)
      setDownloadUrl(data.downloadUrl)
      setErrorMsg(null)
    } catch (error) {
      console.error("capture-order", error)
      setErrorMsg(error.message || "No se pudo completar el pago.")
    } finally {
      setCapturing(false)
    }
  }, [handlePayPalError, orderId])

  const createOrderCallback = React.useCallback(() => {
    if (!orderId) {
      return Promise.reject(new Error("Orden no disponible."))
    }
    return orderId
  }, [orderId])

  const paypalDependencyKey = !paid && orderId ? `${orderId}-${currency}` : null
  const paypalContainerRef = usePayPalButtons({
    clientId: PAYPAL_CLIENT_ID,
    currency,
    dependencyKey: paypalDependencyKey,
    createOrder: createOrderCallback,
    onApprove: handleApprove,
    onError: handlePayPalError,
  })

  if (!isOpen) {
    return null
  }

  const handleRetry = React.useCallback(() => {
    if (!loadingOrder) {
      fetchOrder()
    }
  }, [fetchOrder, loadingOrder])

  const modalTitleId = `product-modal-${product.slug}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        ref={dialogRef}
        tabIndex={-1}
        className="relative max-h-[calc(100vh-48px)] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl focus:outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Cerrar"
        >
          <span aria-hidden="true">✕</span>
        </button>

        <div className="grid h-full gap-6 overflow-hidden lg:grid-cols-[1fr_520px]">
          <div className="order-2 flex flex-col overflow-hidden lg:order-1">
            <div className="flex-1 overflow-y-auto px-6 pb-10 pt-10 lg:max-h-[calc(100vh-96px)] lg:pr-8">
              <div className="flex flex-col gap-6">
                <header className="space-y-3">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                    <StarRating value={averageRating} />
                    <span className="text-xs text-gray-500">
                      {reviews.length > 0 ? `${averageRating.toFixed(1)} · ${reviews.length} reseñas` : "Nuevo"}
                    </span>
                  </span>
                  <h2 id={modalTitleId} className="text-2xl font-bold text-gray-900 md:text-3xl">
                    {product.title}
                  </h2>
                  <div className="space-y-1 text-gray-900">
                    {formattedYearPrice ? (
                      <>
                        <p className="text-xl font-semibold">Plan mensual: {formattedPrice}</p>
                        <p className="text-sm text-gray-600">
                          Plan anual: <span className="font-semibold text-gray-900">{formattedYearPrice}</span>
                        </p>
                      </>
                    ) : (
                      <p className="text-xl font-semibold">{formattedPrice}</p>
                    )}
                  </div>
                </header>

                <div className="space-y-4 text-gray-700">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-4 space-y-4">
                  {paid ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
                      <p className="text-lg font-semibold">Pago exitoso ✅</p>
                      <p className="mt-1 text-sm">
                        Tu descarga está lista. El enlace permanecerá activo durante 24 horas.
                      </p>
                      <a
                        href={downloadUrl}
                        className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        Descargar
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {loadingOrder ? (
                        <div className="flex items-center gap-2 rounded-xl border border-dashed border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                          <span className="inline-flex h-3 w-3 animate-ping rounded-full bg-emerald-500" aria-hidden="true" />
                          Preparando pago seguro…
                        </div>
                      ) : null}

                      {errorMsg && !loadingOrder ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                          <p className="font-semibold">{errorMsg}</p>
                          {isPurchasable ? (
                            <button
                              type="button"
                              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                              onClick={handleRetry}
                            >
                              Reintentar
                            </button>
                          ) : null}
                        </div>
                      ) : null}

                      {!loadingOrder && !errorMsg && isPurchasable ? (
                        <div className="relative">
                          <div ref={paypalContainerRef} className="min-h-[48px]" />
                          {capturing ? (
                            <div className="absolute inset-0 grid place-items-center rounded-lg bg-white/70">
                              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                <span className="inline-flex h-3 w-3 animate-ping rounded-full bg-emerald-500" aria-hidden="true" />
                                Procesando pago…
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                      {!isPurchasable ? (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                          Este producto requiere asesoría personalizada para la compra. Escríbenos para coordinar.
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                <hr className="my-6 border-dashed border-gray-200" />

                <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Lo que dicen nuestros clientes</h3>
                  <div className="grid gap-4">
                    {reviews.map((review) => (
                      <ReviewCard key={`${review.name}-${review.date}`} review={review} />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="order-1 border-b border-gray-100 bg-gray-50 px-6 pb-8 pt-14 lg:order-2 lg:border-l lg:border-b-0 lg:bg-white">
            <div className="lg:sticky lg:top-6">
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={productImages[activeIndex]}
                  alt={`${product.title} vista ${activeIndex + 1}`}
                  className="h-full w-full object-contain"
                />
              </div>
              {productImages.length > 1 ? (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((imgSrc, index) => {
                    const isActive = index === activeIndex
                    return (
                      <button
                        type="button"
                        key={imgSrc + index}
                        onClick={() => setActiveIndex(index)}
                        className={`aspect-square h-20 min-w-[5rem] overflow-hidden rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          isActive ? "border-emerald-500 ring-2 ring-emerald-200" : "border-transparent"
                        }`}
                      >
                        <img src={imgSrc} alt="Miniatura" className="h-full w-full object-contain" />
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
