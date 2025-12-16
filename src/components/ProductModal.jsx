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
    s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons&intent=capture&currency=USD`;
    s.async = true;
    s.onload = () => setReady(true);
    s.onerror = () => setReady(false);
    document.body.appendChild(s);
  }, [clientId]);
  return ready;
}

/* Renderizar PayPal Buttons en un div */
function useRenderPayPalButtons({ enabled, createOrder, onApprove, onError, productSlug }) {
  const ref = React.useRef(null);
  const createRef = React.useRef(createOrder);
  const approveRef = React.useRef(onApprove);
  const errorRef = React.useRef(onError);

  React.useEffect(() => { createRef.current = createOrder; }, [createOrder]);
  React.useEffect(() => { approveRef.current = onApprove; }, [onApprove]);
  React.useEffect(() => { errorRef.current = onError; }, [onError]);

  React.useEffect(() => {
    if (!enabled || !window.paypal || !ref.current) return;

    ref.current.innerHTML = "";

    const buttons = window.paypal.Buttons({
      style: { layout: "vertical", label: "paypal" },
      createOrder: (...args) => createRef.current?.(...args),
      onApprove: (...args) => approveRef.current?.(...args),
      onError: (...args) => errorRef.current?.(...args),
    });

    buttons.render(ref.current).catch((err) => {
      console.error("Error rendering PayPal Buttons", err);
      errorRef.current?.(err);
    });

    return () => {
      try {
        buttons.close?.();
      } catch (err) {
        console.warn("Error closing PayPal Buttons", err);
      }
      if (ref.current) {
        ref.current.innerHTML = "";
      }
    };
  }, [enabled, productSlug]);

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
  const [capturing, setCapturing] = React.useState(false);
  const [paid, setPaid] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [orderId, setOrderId] = React.useState(null); // <-- para WhatsApp

  // Imágenes del carrusel
  const images = React.useMemo(() => {
    const arr = (product?.images?.length ? product.images : [product?.image].filter(Boolean)) || [];
    return arr;
  }, [product?.images, product?.image, product?.slug]);

  // Reset al cambiar de producto
  React.useEffect(() => {
    setActiveIndex(0);
    setCapturing(false);
    setPaid(false);
    setDownloadUrl(null);
    setErrorMsg(null);
    setOrderId(null);
  }, [slug]);

  // PayPal
  const paypalReady = usePayPalSDK(PAYPAL_CLIENT_ID);

  const createOrder = React.useCallback(async () => {
    if (!slug) throw new Error("Producto inválido (falta slug).");

    try {
      const res = await fetch(`/api/paypal/create-order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, currency: safeCurrency }),
      });
      const data = await parseSafe(res);

      if (!res.ok || !data?.orderID) {
        const message = data?.message || data?.detail || "No se pudo crear la orden.";
        setTimeout(() => {
          setPaid(false);
          setDownloadUrl(null);
          setErrorMsg(message);
        }, 0);
        throw new Error(message);
      }

      setTimeout(() => {
        setErrorMsg(null);
      }, 0);

      return data.orderID;
    } catch (err) {
      const message = err?.message || "No se pudo crear la orden.";
      setTimeout(() => {
        setPaid(false);
        setDownloadUrl(null);
        setErrorMsg(message);
      }, 0);
      throw err instanceof Error ? err : new Error(message);
    }
  }, [safeCurrency, slug]);

  const onApprove = React.useCallback(async (data) => {
    if (!slug) { setErrorMsg("Producto inválido (falta slug)."); return; }
    try {
      setCapturing(true);
      setErrorMsg(null);
      const orderID = data?.orderID;
      if (!orderID) throw new Error("La respuesta de PayPal no incluye orderID.");

      setOrderId(orderID); // guardar para WhatsApp

      const res = await fetch(`/api/paypal/capture-order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID, slug }),
      });
      const out = await parseSafe(res);
      if (!res.ok || out?.status !== "ok") {
        throw new Error(out?.message || out?.detail || "Error capturando el pago.");
      }
      setPaid(true);
      setDownloadUrl(out.downloadUrl || null);
    } catch (e) {
      setPaid(false);
      setDownloadUrl(null);
      setErrorMsg(e.message || "Error al procesar el pago.");
    } finally {
      setCapturing(false);
    }
  }, [slug]);

  const onError = React.useCallback((err) => {
    setErrorMsg(err?.message || "Error en PayPal.");
  }, []);

  const paypalContainerRef = useRenderPayPalButtons({
    enabled: paypalReady && !paid && isOpen,
    createOrder,
    onApprove,
    onError,
    productSlug: slug,
  });

  const handleRetry = React.useCallback(() => {
    setErrorMsg(null);
    setPaid(false);
    setDownloadUrl(null);
    setOrderId(null);
  }, []);

  const panelRef = React.useRef(null);
  const closeButtonRef = React.useRef(null);
  const previouslyFocusedRef = React.useRef(null);

  // === BLOQUEO/RESTAURACIÓN DEL SCROLL DEL FONDO (simple y a prueba de balas) ===
React.useEffect(() => {
  const body = document.body;
  const html = document.documentElement;

  if (isOpen) {
    // guardar posición para restaurar luego (opcional)
    body.dataset.modalScrollY = String(window.scrollY || window.pageYOffset || 0);

    // bloquear scroll del fondo (sin position:fixed)
    body.classList.add("overflow-hidden");
    html.classList.add("overflow-hidden");
  } else {
    // restaurar scroll al cerrar
    const y = parseInt(body.dataset.modalScrollY || "0", 10);
    body.classList.remove("overflow-hidden");
    html.classList.remove("overflow-hidden");
    delete body.dataset.modalScrollY;
    window.scrollTo(0, y);
  }

  // safety cleanup por si el componente se desmonta
  return () => {
    body.classList.remove("overflow-hidden");
    html.classList.remove("overflow-hidden");
  };
}, [isOpen]);


  // Trap de foco + Esc
  React.useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const node = closeButtonRef.current;
    node?.focus({ preventScroll: true });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusableSelectors = [
        "a[href]",
        "button:not([disabled])",
        "textarea:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
      ];
      const focusable = panelRef.current.querySelectorAll(focusableSelectors.join(","));
      if (!focusable.length) return;

      const arr = Array.from(focusable);
      const first = arr[0];
      const last = arr[arr.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first || !panelRef.current.contains(document.activeElement)) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      const toFocus = previouslyFocusedRef.current;
      if (toFocus && toFocus instanceof HTMLElement) {
        toFocus.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const canClose = true;
  const titleId = `modal-title-${product?.slug || "producto"}`;

  // Precios (COP base) convertidos a moneda seleccionada
  const showPrice =
    product?.priceCop != null ? formatPrice(product.priceCop, safeCurrency, { withCode: false }) : null;

  const showYearPrice =
    product?.priceCopYear != null ? formatPrice(product.priceCopYear, safeCurrency, { withCode: false }) : null;

  // Número de WhatsApp (reemplazar por el real de CivilesPro)
  const WHATSAPP_NUMBER = "573001112233";

  // Mensaje para WhatsApp
  const whatsappMessage = `¡Hola! Acabo de comprar la plantilla "${product?.title || "CivilesPro"}" 🚀
ID de transacción: ${orderId || "N/A"}`;

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 z-10 bg-black/60"
        onClick={() => canClose && onClose?.()}
        aria-hidden="true"
      />

      {/* Contenedor scrollable del modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-20 flex h-full w-full pointer-events-none"
      >
        <div
          className="min-h-screen w-full overflow-y-auto overscroll-contain scroll-smooth touch-pan-y py-6 pointer-events-auto"
          onClick={() => canClose && onClose?.()}
        >
          <div
            ref={panelRef}
            className="relative mx-4 max-w-6xl overflow-hidden rounded-2xl bg-white p-6 shadow-xl pointer-events-auto sm:mx-6 lg:mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header sticky */}
            <div className="sticky top-0 z-20 bg-white/90 px-6 pt-4 pb-3 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-gray-200">
              <div className="flex items-center justify-between gap-3">
                <h3 id={titleId} className="text-lg font-semibold text-gray-900 sm:text-2xl">
                  {product?.title || "Producto"}
                </h3>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => canClose && onClose?.()}
                  aria-label="Cerrar"
                  className="inline-flex h-11 w-11 aspect-square items-center justify-center rounded-full
                             bg-white border border-gray-200 text-base font-semibold text-gray-700
                             shadow-sm transition hover:bg-gray-50 active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="pt-4">
              <div className="grid gap-6 lg:grid-cols-[1fr_520px]">
                {/* Bloque de imágenes */}
                <div className="lg:sticky lg:top-6">
                  <div className="overflow-hidden rounded-2xl bg-gray-100 aspect-square">
                    <img
                      src={images[activeIndex]}
                      alt={`${product?.title || "Producto"} - vista ${activeIndex + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  {/* Miniaturas — ocultas en móvil, visibles desde lg */}
                  {images.length > 1 && (
                    <div className="mt-3 hidden lg:flex gap-2 overflow-x-auto">
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
                  )}
                </div>

                {/* Información del producto */}
                <div className="pr-2 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto">
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
                      <p className="mt-2 text-base sm:text-lg font-medium text-gray-800">
                        Precio:
                        <span className="ml-2 text-xl sm:text-2xl font-bold text-gray-900">
                          {showPrice}
                          <span className="ml-1 text-gray-500 text-base font-semibold">
                            {safeCurrency}
                          </span>
                        </span>
                      </p>
                    )
                  ) : (
                    <p className="text-base font-semibold text-amber-700">Precio a consultar</p>
                  )}

                  <div className="mb-2 mt-3 flex items-center gap-1 text-amber-500" aria-hidden>
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
                    <div ref={paypalContainerRef} className="relative z-20 min-h-[48px]" />
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
                        <div className="mt-2 flex flex-wrap gap-3">
                          {/* Botón Descargar */}
                          <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 transition"
                          >
                            Descargar
                          </a>

                          {/* Botón WhatsApp */}
                          <a
                            href={`https://wa.me/573001112233?text=${encodeURIComponent(
                              `¡Hola! Acabo de comprar la plantilla "${product?.title || "CivilesPro"}" 🚀\nID de transacción: ${orderId || "N/A"}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 transition"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Avisos PayPal */}
                  <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-800">
                    Al pagar se activará el botón <strong>Descargar</strong> para obtener el archivo al instante.
                  </div>

                  <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 px-3 py-2.5 text-[15px] sm:text-base leading-snug text-sky-800">
                    <span>
                      Pagos procesados en <strong className="font-semibold text-sky-900">USD</strong> por PayPal.<br />
                      
                    </span>
                  </div>

                  {/* Reseñas */}
                  <div className="mt-8 space-y-4">
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
            {/* Fin contenido */}
          </div>
        </div>
      </div>
    </div>
  );
}
