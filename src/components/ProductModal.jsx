import React from "react";
import { formatPrice } from "../utils/formatPrice.js";

/* Utils */
const cx = (...c) => c.filter(Boolean).join(" ");

// Reseñas por producto (puedes ajustar nombres/orden)
const STATIC_REVIEWS = {
  "pedido-acero": [
    {
      name: "Arq Jeckner Gallegos",
      rating: 4,
      text:
        "Me ha ayudado ahorrando full tiempo, tengo todas las plantillas que necesito y hago presupuesto rapidísimo.",
    },
    {
      name: "Jairo Antonio Gutierrez",
      rating: 4,
      text: "¡Muy buen producto! Ya lo adquirí y es demasiado útil.",
    },
    {
      name: "Nestor Evelio Parra",
      rating: 5,
      text:
        "Muy buen producto. Además de la atención prestada. Solicité soporte técnico y me atendieron de inmediato. ¡Recomendado!",
    },
  ],
  "control-acero": [
    {
      name: "Jairo Antonio Gutierrez",
      rating: 4,
      text: "¡Muy buen producto! Ya lo adquirí y es demasiado útil.",
    },
    {
      name: "Nestor Evelio Parra",
      rating: 5,
      text:
        "Muy buen producto. Además de la atención prestada. Solicité soporte técnico y me atendieron de inmediato. ¡Recomendado!",
    },
    {
      name: "Arq Jeckner Gallegos",
      rating: 4,
      text:
        "Me ha ayudado ahorrando full tiempo, tengo todas las plantillas que necesito y hago presupuesto rapidísimo.",
    },
  ],
  default: [
    {
      name: "Arq Jeckner Gallegos",
      rating: 4,
      text:
        "Me ha ayudado ahorrando full tiempo, tengo todas las plantillas que necesito y hago presupuesto rapidísimo.",
    },
    {
      name: "Jairo Antonio Gutierrez",
      rating: 4,
      text: "¡Muy buen producto! Ya lo adquirí y es demasiado útil.",
    },
    {
      name: "Nestor Evelio Parra",
      rating: 5,
      text:
        "Muy buen producto. Además de la atención prestada. Solicité soporte técnico y me atendieron de inmediato. ¡Recomendado!",
    },
  ],
};

// Estrellitas simples
function Stars({ value, max = 5 }) {
  const full = "★".repeat(value);
  const empty = "☆".repeat(Math.max(0, max - value));
  return (
    <span
      className="text-amber-500"
      aria-label={`${value} de ${max} estrellas`}
      title={`${value} de ${max} estrellas`}
    >
      {full}
      <span className="text-gray-300">{empty}</span>
    </span>
  );
}

async function parseSafe(res) {
  const contentType = res.headers?.get?.("content-type") || "";
  const text = await res.text();

  if (!text) return { message: `HTTP ${res.status}` };

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {}
  }
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

/* Cargar PayPal SDK (una vez) */
function usePayPalSDK(clientId) {
  const [ready, setReady] = React.useState(!!window.paypal);
  React.useEffect(() => {
    if (window.paypal) {
      setReady(true);
      return;
    }
    if (!clientId) return;

    const id = "paypal-sdk-script";
    if (document.getElementById(id)) {
      setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons&intent=capture`;
    s.async = true;
    s.onload = () => setReady(true);
    s.onerror = () => setReady(false);
    document.body.appendChild(s);
  }, [clientId]);
  return ready;
}

/* Renderizar PayPal Buttons en un div */
function useRenderPayPalButtons({
  enabled,
  createOrder,
  onApprove,
  onError,
  isOpen,
  productSlug,
}) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!enabled || !window.paypal || !ref.current || !isOpen) return;

    ref.current.innerHTML = "";
    let btnsInstance = null;

    const frameId = window.requestAnimationFrame(() => {
      if (!ref.current) return;
      btnsInstance = window.paypal.Buttons({
        style: { layout: "vertical", label: "paypal" },
        createOrder,
        onApprove,
        onError,
        funding: { disallowed: [window.paypal.FUNDING.CARD] },
      });
      btnsInstance.render(ref.current);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (btnsInstance && typeof btnsInstance.close === "function") {
        try {
          btnsInstance.close();
        } catch {}
      }
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [enabled, createOrder, onApprove, onError, isOpen, productSlug]);

  return ref;
}

export default function ProductModal({
  isOpen = true,
  product,
  currency = "COP",
  onClose,
}) {
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  // Estado general del modal
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [orderId, setOrderId] = React.useState(null);
  const [creating, setCreating] = React.useState(false);
  const [capturing, setCapturing] = React.useState(false);
  const [paid, setPaid] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);

  // Imágenes del carrusel
  const images = React.useMemo(() => {
    const arr =
      (product?.images && product.images.length > 0
        ? product.images
        : [product?.image].filter(Boolean)) || [];
    return arr;
  }, [product?.images, product?.image, product?.slug]);

  // Reset al cambiar de producto
  React.useEffect(() => {
    setActiveIndex(0);
    setOrderId(null);
    setCreating(false);
    setCapturing(false);
    setPaid(false);
    setDownloadUrl(null);
    setErrorMsg(null);
  }, [product?.slug]);

  // PayPal
  const paypalReady = usePayPalSDK(PAYPAL_CLIENT_ID);

  const createOrder = React.useCallback(async () => {
    if (!product?.slug) throw new Error("Producto inválido.");
    try {
      setCreating(true);
      setErrorMsg(null);

      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: product.slug, currency }),
      });
      const data = await parseSafe(res);

      if (!res.ok || !data?.orderID) {
        throw new Error(data?.message || data?.detail || "No se pudo crear la orden.");
      }
      setOrderId(data.orderID);
      return data.orderID;
    } catch (error) {
      const message = error?.message || "No se pudo crear la orden.";
      setOrderId(null);
      setErrorMsg(message);
      throw error;
    } finally {
      setCreating(false);
    }
  }, [product?.slug, currency]);

  const onApprove = React.useCallback(async (data) => {
    try {
      setCapturing(true);
      setErrorMsg(null);

      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID }),
      });
      const out = await parseSafe(res);

      if (!res.ok || !out?.downloadUrl) {
        throw new Error(out?.message || out?.detail || "Error capturando el pago.");
      }

      setPaid(true);
      setDownloadUrl(out.downloadUrl);
    } catch (e) {
      setPaid(false);
      setDownloadUrl(null);
      setErrorMsg(e.message || "Error al procesar el pago.");
    } finally {
      setCapturing(false);
    }
  }, []);

  const onError = React.useCallback((err) => {
    setErrorMsg(err?.message || "Error en PayPal.");
  }, []);

  const paypalContainerRef = useRenderPayPalButtons({
    enabled: paypalReady && !paid,
    createOrder,
    onApprove,
    onError,
    isOpen,
    productSlug: product?.slug,
  });

  const handleRetry = React.useCallback(() => {
    if (!creating) createOrder().catch(() => {});
  }, [creating, createOrder]);

  if (!isOpen) return null;

  const canClose = true;
  const titleId = `modal-title-${product?.slug || "producto"}`;

  // ✅ Precios (COP base) convertidos a moneda seleccionada, usando el mismo helper del listado
  const formattedPrice =
    product?.priceCop != null ? formatPrice(product.priceCop, currency) : null;

  const formattedYearPrice =
    product?.priceCopYear != null
      ? formatPrice(product.priceCopYear, currency)
      : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => canClose && onClose?.()}
    >
      {/* modal */}
      <div
        className="relative z-10 w-full max-w-6xl rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <button
            type="button"
            onClick={() => canClose && onClose?.()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-gray-600 hover:bg-gray-50"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_520px]">
          {/* Der: carrusel sticky */}
          <div className="hidden lg:block lg:sticky lg:top-6">
            <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={images[activeIndex]}
                alt={`${product?.title || "Producto"} - vista ${activeIndex + 1}`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={`${product?.slug || "p"}-thumb-${i}`}
                  onClick={() => setActiveIndex(i)}
                  className={cx(
                    "h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white",
                    i === activeIndex ? "border-emerald-600" : "border-gray-300"
                  )}
                  aria-label={`Vista ${i + 1}`}
                >
                  <img src={src} alt={`Vista ${i + 1}`} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Izq: scroll propio */}
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
            <h3 id={titleId} className="text-2xl font-bold text-gray-900">
              {product?.title || "Producto"}
            </h3>

            {/* ✅ Precio */}
            {formattedPrice && (
              formattedYearPrice ? (
                <>
                  <p className="text-base font-bold text-gray-900">Desde: {formattedPrice}</p>
                  <p className="text-xs text-gray-500">
                    Premium:{" "}
                    <span className="font-semibold text-gray-900">{formattedYearPrice}</span>
                  </p>
                </>
              ) : (
                <p className="text-base font-bold text-gray-900">Precio: {formattedPrice}</p>
              )
            )}
            {!formattedPrice && (
              <p className="text-base font-semibold text-amber-700">Precio a consultar</p>
            )}

            <div className="mb-2 mt-2 flex items-center gap-1 text-amber-500" aria-hidden>
              {"★★★★★".split("").map((s, i) => (
                <span key={`star-${i}`}>★</span>
              ))}
              <span className="ml-2 text-sm text-gray-500">(128 reseñas)</span>
            </div>

            <p className="mb-4 text-gray-700">{product?.description}</p>

            {/* Pago */}
            <div className="rounded-xl border border-gray-200 p-4" aria-live="polite">
              {!paypalReady && (
                <div className="text-sm text-gray-500">
                  Cargando PayPal…
                  {!PAYPAL_CLIENT_ID && (
                    <div className="mt-2 rounded border border-amber-300 bg-amber-50 p-2 text-amber-800">
                      Falta VITE_PAYPAL_CLIENT_ID en .env.local (raíz). Reinicia el dev server.
                    </div>
                  )}
                </div>
              )}
              <div ref={paypalContainerRef} className="min-h-[48px]" />
              {creating && <p className="mt-2 text-sm text-gray-500">Preparando orden…</p>}
              {capturing && <p className="mt-2 text-sm text-gray-500">Procesando pago…</p>}

              {errorMsg && !paid && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {errorMsg}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="rounded-md border px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              )}

              {paid && downloadUrl && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <p className="font-medium text-emerald-800">Pago exitoso ✅</p>
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
                  >
                    Descargar
                  </a>
                </div>
              )}
            </div>

            {/* Reseñas */}
            <div className="mt-6 space-y-4">
              {(STATIC_REVIEWS[product?.slug] || STATIC_REVIEWS.default).map((rev, idx) => (
                <div
                  key={`${product?.slug || "p"}-rev-${idx}-${rev.name}`}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="font-semibold text-gray-800">{rev.name}</div>
                    <Stars value={rev.rating} />
                  </div>
                  <p className="text-sm text-gray-600">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}
