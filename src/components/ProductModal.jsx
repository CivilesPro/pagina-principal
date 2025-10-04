import React from "react";
import { formatPrice } from "../utils/formatPrice.js";

/* Utils */
const cx = (...c) => c.filter(Boolean).join(" ");

// Reseñas por producto (puedes ajustar nombres/orden)
const STATIC_REVIEWS = {
  "pedido-acero": [
    { name: "Arq Jeckner Gallegos", rating: 4, text: "Me ha ayudado ahorrando full tiempo, tengo todas las plantillas que necesito y hago presupuesto rapidísimo." },
    { name: "Jairo Antonio Gutierrez", rating: 4, text: "¡Muy buen producto! Ya lo adquirí y es demasiado útil." },
    { name: "Nestor Evelio Parra", rating: 5, text: "Muy buen producto. Además de la atención prestada. Solicité soporte técnico y me atendieron de inmediato. ¡Recomendado!" },
  ],
  "control-acero": [
    { name: "Jairo Antonio Gutierrez", rating: 4, text: "¡Muy buen producto! Ya lo adquirí y es demasiado útil." },
    { name: "Nestor Evelio Parra", rating: 5, text: "Muy buen producto. Además de la atención prestada. Solicité soporte técnico y me atendieron de inmediato. ¡Recomendado!" },
    { name: "Arq Jeckner Gallegos", rating: 4, text: "Me ha ayudado ahorrando full tiempo, tengo todas las plantillas que necesito y hago presupuesto rapidísimo." },
  ],
  default: [
    { name: "Arq Jeckner Gallegos", rating: 4, text: "Me ha ayudado ahorrando full tiempo, tengo todas las plantillas que necesito y hago presupuesto rapidísimo." },
    { name: "Jairo Antonio Gutierrez", rating: 4, text: "¡Muy buen producto! Ya lo adquirí y es demasiado útil." },
    { name: "Nestor Evelio Parra", rating: 5, text: "Muy buen producto. Además de la atención prestada. Solicité soporte técnico y me atendieron de inmediato. ¡Recomendado!" },
  ],
};

// Estrellitas simples
function Stars({ value, max = 5 }) {
  const full = "★".repeat(value);
  const empty = "☆".repeat(Math.max(0, max - value));
  return (
    <span className="text-amber-500" aria-label={`${value} de ${max} estrellas`} title={`${value} de ${max} estrellas`}>
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
    try { return JSON.parse(text); } catch {}
  }
  try { return JSON.parse(text); } catch { return { message: text }; }
}

/* Cargar PayPal SDK (una vez) */
function usePayPalSDK(clientId) {
  const [ready, setReady] = React.useState(!!window.paypal);
  React.useEffect(() => {
    if (window.paypal) { setReady(true); return; }
    if (!clientId) return;
    const id = "paypal-sdk-script";
    if (document.getElementById(id)) { setReady(true); return; }
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
function useRenderPayPalButtons({ enabled, createOrder, onApprove, onError, isOpen, productSlug }) {
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
      if (btnsInstance?.close) { try { btnsInstance.close(); } catch {} }
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [enabled, createOrder, onApprove, onError, isOpen, productSlug]);
  return ref;
}

/* Render profesional para descripciones con bullets/encabezados */
function RichDescription({ text }) {
  if (!text) return null;
  const rawLines = text.replace(/\r\n/g, "\n").split("\n").map(l => l.trim()).filter(Boolean);
  const isBullet = (l) => /^((✅|•|-|—|–|—|►|▪|▫|➤|➔|🛠|📦|🎯|📐|🏗|📊|🪵|🌐)\s+)/.test(l);
  const isHeading = (l) => /^(🎯|📦|🎥|🛠|🏛|📊|⚡|🏗)\s/.test(l) || (/[:：]$/.test(l) && !isBullet(l));
  const blocks = [];
  let current = { heading: null, items: [], paragraphs: [] };
  rawLines.forEach((line) => {
    if (isHeading(line)) {
      if (current.heading || current.items.length || current.paragraphs.length) {
        blocks.push(current); current = { heading: null, items: [], paragraphs: [] };
      }
      current.heading = line.replace(/[:：]\s*$/, "");
    } else if (isBullet(line)) {
      current.items.push(line.replace(/^((✅|•|-|—|–|—|►|▪|▫|➤|➔|🛠|📦|🎯|📐|🏗|📊|🪵|🌐)\s+)/, ""));
    } else {
      current.paragraphs.push(line);
    }
  });
  if (current.heading || current.items.length || current.paragraphs.length) blocks.push(current);
  return (
    <div className="space-y-4 leading-relaxed text-gray-700">
      {blocks.length === 0 && <p className="whitespace-pre-line">{text}</p>}
      {blocks.map((b, i) => (
        <div key={`desc-block-${i}`} className="space-y-2">
          {b.heading && <h4 className="font-semibold text-gray-900">{b.heading}</h4>}
          {b.paragraphs.map((p, j) => (<p key={`p-${i}-${j}`} className="whitespace-pre-line">{p}</p>))}
          {b.items.length > 0 && (
            <ul className="ml-5 list-disc space-y-1">
              {b.items.map((it, k) => (<li key={`li-${i}-${k}`}>{it}</li>))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProductModal({ isOpen = true, product, currency = "COP", onClose }) {
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const safeCurrency = React.useMemo(() => (currency || "COP").toUpperCase(), [currency]);
  const slug = product?.slug ?? null;

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
    const arr = (product?.images?.length ? product.images : [product?.image].filter(Boolean)) || [];
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
  }, [slug]);

  // PayPal
  const paypalReady = usePayPalSDK(PAYPAL_CLIENT_ID);

  const createOrder = React.useCallback(async () => {
    if (!slug) throw new Error("Producto inválido (falta slug).");
    try {
      setCreating(true);
      setErrorMsg(null);
      const res = await fetch(`/api/paypal/create-order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, currency: safeCurrency }),
      });
      const data = await parseSafe(res);
      if (!res.ok || !data?.orderID) {
        throw new Error(data?.message || data?.detail || "No se pudo crear la orden.");
      }
      setOrderId(data.orderID);
      return data.orderID; // PayPal Buttons espera el orderID
    } catch (error) {
      const message = error?.message || "No se pudo crear la orden.";
      setOrderId(null);
      setErrorMsg(message);
      throw error;
    } finally {
      setCreating(false);
    }
  }, [safeCurrency, slug]);

  const onApprove = React.useCallback(async (data) => {
    if (!slug) { setErrorMsg("Producto inválido (falta slug)."); return; }
    try {
      setCapturing(true);
      setErrorMsg(null);
      const orderID = data?.orderID || orderId;
      if (!orderID) throw new Error("La respuesta de PayPal no incluye orderID.");
      const res = await fetch(`/api/paypal/capture-order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID, slug }),
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
  }, [slug, orderId]);

  const onError = React.useCallback((err) => {
    setErrorMsg(err?.message || "Error en PayPal.");
  }, []);

  const paypalContainerRef = useRenderPayPalButtons({
    enabled: paypalReady && !paid,
    createOrder,
    onApprove,
    onError,
    isOpen,
    productSlug: slug,
  });

  const handleRetry = React.useCallback(() => {
    if (!creating) createOrder().catch(() => {});
  }, [creating, createOrder]);

  if (!isOpen) return null;

  const canClose = true;
  const titleId = `modal-title-${product?.slug || "producto"}`;

  // Precios (COP base) convertidos a moneda seleccionada
  const showPrice =
    product?.priceCop != null ? formatPrice(product.priceCop, safeCurrency, { withCode: false }) : null;

  const showYearPrice =
    product?.priceCopYear != null ? formatPrice(product.priceCopYear, safeCurrency, { withCode: false }) : null;

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
          {/* Bloque de imágenes */}
          <div className="lg:sticky lg:top-6">
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

          {/* Información del producto */}
          <div className="pr-2 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto">
            <h3 id={titleId} className="text-2xl font-bold text-gray-900">
              {product?.title || "Producto"}
            </h3>

            {/* Precio */}
            {showPrice ? (
              showYearPrice ? (
                <>
                  <p className="mt-1 text-sm text-gray-700">
                    Desde:
                    <span className="ml-1 font-semibold text-gray-900">
                      {showPrice}<span className="ml-1 text-gray-500">{safeCurrency}</span>
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    Premium:
                    <span className="ml-1 font-semibold text-gray-900">
                      {showYearPrice}<span className="ml-1 text-gray-500">{safeCurrency}</span>
                    </span>
                  </p>
                </>
              ) : (
                <p className="mt-1 text-sm text-gray-700">
                  Precio:
                  <span className="ml-1 font-semibold text-gray-900">
                    {showPrice}<span className="ml-1 text-gray-500">{safeCurrency}</span>
                  </span>
                </p>
              )
            ) : (
              <p className="text-base font-semibold text-amber-700">Precio a consultar</p>
            )}

            <div className="mb-2 mt-2 flex items-center gap-1 text-amber-500" aria-hidden>
              {"★★★★★".split("").map((s, i) => (<span key={`star-${i}`}>★</span>))}
              <span className="ml-2 text-sm text-gray-500">(128 reseñas)</span>
            </div>

            <div className="mb-4">
              <RichDescription text={product?.description} />
            </div>

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

            {/* Avisos PayPal */}
            <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-800">
              Al pagar se activará el botón <strong>Descargar</strong> para obtener el archivo al instante.
            </div>

            <div className="mt-2 flex items-center gap-2 rounded-md border border-sky-200 bg-sky-50 p-2 text-sm text-sky-800">
              <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
                <path fill="currentColor" d="M12 1l3 5l6 1l-4 4l1 6l-6-3l-6 3l1-6L1 7l6-1z" />
              </svg>
              Pagos procesados en <strong>USD</strong> por PayPal. El precio mostrado es referencial en {safeCurrency}.
            </div>

            {/* Reseñas */}
            <div className="mt-6 space-y-4">
              <p className="text-gray-700">Lee lo que dicen nuestros clientes:</p>
              {(STATIC_REVIEWS[product?.slug] || STATIC_REVIEWS.default).map((rev, idx) => (
                <div key={`${product?.slug || "p"}-rev-${idx}-${rev.name}`} className="rounded-xl border border-gray-200 p-4">
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
