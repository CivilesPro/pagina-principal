import * as React from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import ProductModal from "../components/ProductModal.jsx";
import products from "../data/products.js";
import CurrencySelector from "../components/CurrencySelector.jsx";
import { SUPPORTED_CURRENCIES } from "../data/exchangeRates.js";
import { formatPrice } from "../utils/formatPrice.js";

const SITE_URL = "https://civilespro.com";
const DEFAULT_CURRENCY = "COP";

const BADGES_BY_SLUG = {
  "cantidades-instant": "Más vendido",
  "control-acero": "Mejor precio",
  "concretos-autohormigoneras": "Nuevo",
};

function normalizeCurrency(code) {
  if (!code) return null;
  const up = String(code).toUpperCase();
  return SUPPORTED_CURRENCIES.includes(up) ? up : null;
}

export default function ProductosPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // INIT: una sola vez, resolviendo prioridad URL -> localStorage -> default
  const [currency, setCurrency] = React.useState(() => {
    const fromURL = normalizeCurrency(searchParams.get("currency"));
    if (fromURL) return fromURL;
    const fromStorage = normalizeCurrency(
      typeof window !== "undefined" ? window.localStorage.getItem("currency") : null
    );
    return fromStorage || DEFAULT_CURRENCY;
  });

  // Escribir en localStorage cuando cambie currency
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("currency", currency);
    }
  }, [currency]);

  // Mantener URL sincronizada con currency (sin hacer eco de vuelta)
  React.useEffect(() => {
    const current = normalizeCurrency(searchParams.get("currency"));
    if (currency === DEFAULT_CURRENCY) {
      if (current) {
        const next = new URLSearchParams(searchParams);
        next.delete("currency");
        setSearchParams(next, { replace: true });
      }
      return;
    }
    if (currency !== current) {
      const next = new URLSearchParams(searchParams);
      next.set("currency", currency);
      setSearchParams(next, { replace: true });
    }
  }, [currency, searchParams, setSearchParams]);

  // Si el usuario pega un link con ?currency=XXX, reflejarlo UNA VEZ si cambia el query
  React.useEffect(() => {
    const fromParam = normalizeCurrency(searchParams.get("currency"));
    if (fromParam && fromParam !== currency) {
      setCurrency(fromParam);
    }
    // No pongas `currency` en deps para no ciclar: este efecto
    // solo escucha cambios de los searchParams.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // handler directo y sin memo para evitar closures obsoletos
  const handleCurrencyChange = (code) => {
    const norm = normalizeCurrency(code) || DEFAULT_CURRENCY;
    setCurrency(norm);
  };

  const [selectedProduct, setSelectedProduct] = React.useState(null);

  const handleOpenProduct = React.useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  React.useEffect(() => {
    if (!selectedProduct) return;
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const scrollY = window.scrollY;
    const body = document.body;
    if (!body) return;

    const { style } = body;
    const previousStyles = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      width: style.width,
    };

    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";

    return () => {
      style.overflow = previousStyles.overflow || "";
      style.position = previousStyles.position || "";
      style.top = previousStyles.top || "";
      style.width = previousStyles.width || "";
      window.scrollTo(0, scrollY);
    };
  }, [selectedProduct]);

  return (
    <>
      <SEO
        title="Productos digitales y herramientas para obra — Civiles Pro"
        description="Explora nuestras plantillas, herramientas digitales y acceso a la plataforma Civiles Pro para gestionar obra y presupuestos."
        url={`${SITE_URL}/`}
        canonical={`${SITE_URL}/`}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/40 to-white py-16">
        {/* Fondo decorativo luxury (sin imágenes) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Spotlight superior (halo central) */}
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_20%,rgba(16,185,129,0.20),transparent_62%)]" />

          {/* Arcos laterales más finos (look premium) */}
          <div className="absolute -left-[520px] top-1/2 h-[980px] w-[980px] -translate-y-1/2 rounded-full border border-emerald-200/60" />
          <div className="absolute -left-[380px] top-1/2 h-[760px] w-[760px] -translate-y-1/2 rounded-full border border-emerald-200/45" />

          <div className="absolute -right-[520px] top-1/2 h-[980px] w-[980px] -translate-y-1/2 rounded-full border border-emerald-200/60" />
          <div className="absolute -right-[380px] top-1/2 h-[760px] w-[760px] -translate-y-1/2 rounded-full border border-emerald-200/45" />

          {/* Glow lateral suave (para “profundidad”) */}
          <div className="absolute -left-[260px] top-1/2 h-[620px] w-[620px] -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -right-[260px] top-1/2 h-[620px] w-[620px] -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

          {/* Patrón sutil tipo “dot grid” (muy luxury, casi invisible) */}
          <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.9)_1px,transparent_0)] [background-size:26px_26px]" />
        </div>

        <div className="relative z-10">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-center text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-950 to-emerald-600 sm:text-5xl">
              Plantillas de Excel y recursos para construcción 🚧
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-center text-base text-gray-700 sm:mt-5 sm:text-lg">
              Calcula materiales, controla acero y concreto, y genera presupuestos de obra en minutos con plantillas de Excel listas para usar.
            </p>
          </div>
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

            <CurrencySelector value={currency} onChange={handleCurrencyChange} />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const formattedPrice = formatPrice(product.priceCop, currency, { withCode: false });
              const formattedYearPrice =
                product.priceCopYear != null
                  ? formatPrice(product.priceCopYear, currency, { withCode: false })
                  : null;

              const badgeLabel = BADGES_BY_SLUG[product.slug];
              const isConsultation = product.priceCop == null;

              return (
                <article
                  key={product.slug}
                  className={`group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                    isConsultation ? "" : "cursor-pointer"
                  }`}
                  role="button"
                  tabIndex={isConsultation ? -1 : 0}
                  aria-disabled={isConsultation}
                  onClick={() => {
                    if (isConsultation) return;
                    handleOpenProduct(product);
                  }}
                  onKeyDown={(event) => {
                    if (isConsultation) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleOpenProduct(product);
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
                      {isConsultation ? (
                        <p className="text-base font-semibold text-amber-700">Precio a consultar</p>
                      ) : formattedYearPrice ? (
                        <>
                          <p className="text-base font-bold text-gray-900">
                            Desde: {formattedPrice}
                            <span className="ml-1 text-sm font-semibold text-gray-500">{currency}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Premium:
                            <span className="ml-1 font-semibold text-gray-900">
                              {formattedYearPrice}
                              <span className="ml-1 text-gray-500">{currency}</span>
                            </span>
                          </p>
                        </>
                      ) : (
                        <p className="text-base font-bold text-gray-900">
                          Precio: {formattedPrice}
                          <span className="ml-1 text-sm font-semibold text-gray-500">{currency}</span>
                        </p>
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
                        event.stopPropagation();
                        if (isConsultation) return;
                        handleOpenProduct(product);
                      }}
                      disabled={isConsultation}
                    >
                      {isConsultation ? "Solicitar información" : "Comprar"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-16 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-700">
            ¿Buscas una plantilla de Excel a la medida?
            <a
              href="https://wa.me/573127437848?text=Hola%20CivilesPro%2C%20necesito%20un%20producto%20a%20medida."
              target="_blank"
              rel="noreferrer"
              className="ml-2 inline-flex items-center justify-center rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Escríbenos por WhatsApp
            </a>
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
  );
}
