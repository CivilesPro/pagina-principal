// src/components/ProductModal.jsx
import React from "react";

/* ================== Utils ================== */
const cx = (...c) => c.filter(Boolean).join(" ");

/* Carga el SDK de PayPal una sola vez por app */
function usePayPalSDK(clientId) {
  const [ready, setReady] = React.useState(!!window.paypal);

  React.useEffect(() => {
    if (window.paypal) {
      setReady(true);
      return;
    }
    if (!clientId) return;

    const id = "paypal-sdk-script";
    if (document.getElementById(id)) return; // ya agregado

    const s = document.createElement("script");
    s.id = id;
    s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    s.async = true;
    s.onload = () => setReady(true);
    s.onerror = () => setReady(false);
    document.body.appendChild(s);
  }, [clientId]);

  return ready;
}

/* Renderizador de PayPal Buttons en un contenedor DOM */
function useRenderPayPalButtons({ enabled, createOrder, onApprove, onError }) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!enabled) return;
    if (!window.paypal || !containerRef.current) return;

    // limpiar render anterior (si lo hubiera)
    containerRef.current.innerHTML = "";

    const btns = window.paypal.Buttons({
      style: { layout: "vertical", shape: "rect", label: "paypal" },
      createOrder,
      onApprove,
      onError,
    });

    btns.render(containerRef.current);

    return () => {
      try {
        btns.close();
      } catch (_) {}
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [enabled, createOrder, onApprove, onError]);

  return containerRef;
}

/* ================== Modal ================== */
export default function ProductModal({
  isOpen = true,
  product,
  currency = "COP",
  onClose,
}) {
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  /* --------- HOOKS: siempre al tope y en mismo orden --------- */
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [orderId, setOrderId] = React.useState(null);
  const [creating, setCreating] = React.useState(false);
  const [capturing, setCapturing] = React.useState(false);
  const [paid, setPaid] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);

  // imágenes del producto
  const images = React.useMemo(() => {
    const arr =
      (product?.images && product.images.length > 0
        ? product.images
        : [product?.image].filter(Boolean)) || [];
    // forzar 1:1 consistencia; no tocar si ya están bien
    return arr;
  }, [product?.images, product?.image, product?.slug]);

  // reset por cambio de producto
  React.useEffect(() => {
    setActiveIndex(0);
    setOrderId(null);
    setCreating(false);
    setCapturing(false);
    setPaid(false);
    setDownloadUrl(null);
    setErrorMsg(null);
  }, [product?.slug]);

  // SDK listo
  const paypalReady = usePayPalSDK(PAYPAL_CLIENT_ID);

  // crear orden en backend (no depende del SDK)
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
      const data = await res.json();
      if (!res.ok || !data?.orderID) {
        throw new Error(data?.message || "No se pudo crear la orden.");
      }
      setOrderId(data.orderID);
      return data.orderID;
    } catch (e) {
      setErrorMsg(e.message || "Error creando la orden.");
      throw e;
    } finally {
      setCreating(false);
    }
  }, [product?.slug, currency]);

  // capturar pago en backend
  const onApprove = React.useCallback(
    async (data) => {
      try {
        setCapturing(true);
        setErrorMsg(null);
        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: data.orderID }),
        });
        const out = await res.json();
        if (!res.ok || !out?.downloadUrl) {
          throw new Error(out?.message || "Error capturando el pago.");
        }
        setPaid(true);
        setDownloadUrl(out.downloadUrl);
      } catch (e) {
        setErrorMsg(e.message || "Error al procesar el pago.");
      } finally {
        setCapturing(false);
      }
    },
    []
  );

  const onError = React.useCallback((err) => {
    setErrorMsg(err?.message || "Error en PayPal.");
  }, []);

  // Renderizar botones cuando SDK listo
  const paypalContainerRef = useRenderPayPalButtons({
    enabled: paypalReady && !paid,
    createOrder,
    onApprove,
    onError,
  });

  // Botón reintentar crear orden (no es un hook condicional)
  const handleRetry = React.useCallback(() => {
    if (!creating) createOrder().catch(() => {});
  }, [creating, createOrder]);

  // (Opción segura) no hacemos early return condicional de hooks.
  // Si quieres ocultar visualmente cuando isOpen = false:
  if (!isOpen) return null;

  const canClose = !capturing; // bloquear cierre durante captura
  const titleId = `modal-title-${product?.slug || "producto"}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => canClose && onClose?.()}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-6xl rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 id={titleId} className="text-2xl font-bold text-gray-900">
            {product?.title || "Producto"}
          </h3>

          <button
            type="button"
            onClick={() => canClose && onClose?.()}
            disabled={!canClose}
            className={cx(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border text-gray-600 hover:bg-gray-50",
              !canClose && "opacity-60 cursor-not-allowed"
            )}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Body: 2 columnas */}
        <div className="grid gap-6 lg:grid-cols-[1fr_520px]">
          {/* IZQUIERDA: panel con scroll independiente */}
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
            {/* Estrellas fake */}
            <div className="mb-2 flex items-center gap-1 text-amber-500">
              {"★★★★★".split("").map((s, i) => (
                <span key={`star-${i}`} aria-hidden>
                  ★
                </span>
              ))}
              <span className="ml-2 text-sm text-gray-500">(128 reseñas)</span>
            </div>

            {/* Precio */}
            <div className="mb-3 text-xl font-semibold text-gray-900">
              {/* El precio final lo muestras en la tarjeta;
                  aquí puedes repetirlo si quieres */}
              {/* Ejemplo: */}
              {/* {formattedPrice} */}
            </div>

            {/* Descripción */}
            <p className="mb-4 text-gray-700">{product?.description}</p>

            {/* PayPal */}
            <div
              className="rounded-xl border border-gray-200 p-4"
              aria-busy={capturing ? "true" : "false"}
              aria-live="polite"
            >
              {!paypalReady && (
                <p className="text-sm text-gray-500">Cargando PayPal…</p>
              )}

              <div ref={paypalContainerRef} className="min-h-[48px]" />

              {creating && (
                <p className="mt-2 text-sm text-gray-500">
                  Preparando orden…
                </p>
              )}
              {capturing && (
                <p className="mt-2 text-sm text-gray-500">
                  Procesando pago…
                </p>
              )}
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
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <p className="font-medium text-emerald-800">
                    Pago exitoso ✅
                  </p>
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

            {/* Reseñas (fake) */}
            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={`${product?.slug || "p"}-rev-${i}`}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="font-semibold text-gray-800">
                      Usuario {i}
                    </div>
                    <div className="text-amber-500" aria-hidden>
                      ★★★★☆
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Excelente plantilla, ahorra tiempo y evita errores.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* DERECHA: carrusel sticky (no se mueve) */}
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
                  <img
                    src={src}
                    alt={`Vista ${i + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
