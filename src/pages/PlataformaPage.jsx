import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa6";
import { LuCalculator, LuDownload, LuListChecks, LuWallet, LuFileSpreadsheet, LuPercent, LuBuilding2, LuFileText, LuArrowRight, LuCopyCheck } from "react-icons/lu";
import { LuUser } from "react-icons/lu";
import SEO from "../components/SEO.jsx";
import { LuCircleCheck, LuCircleX, LuCrown } from "react-icons/lu";



/**
 * PlataformaPage.jsx
 * Página enfocada 100% en PRESUPUESTO DE OBRA (APU + Presupuesto).
 * - Hero se mantiene (estructura y estilo base).
 * - Se eliminan menciones a "calculadora de materiales" e "informes diarios".
 * - Se agregan Beneficios con GIF (placeholders) y texto corto.
 * - Se simplifica "Cómo funciona" a 4 pasos de presupuesto.
 * - Planes con bullets solo de presupuesto/APU.
 */

const SITE_URL = "https://civilespro.com";
const PRIMARY = "#055a27";
const SECONDARY = "#111111ff";

// Texto “role typing” que aparece en el hero
const HERO_ROLES = ["Ingenieros", "Arquitectos", "Maestros de obra"];

// =====================
// Utilidades
// =====================

// ——— Parallax para dos imágenes en el Hero ———
function useParallaxPair() {
  const ref = React.useRef(null);
  const [progress, setProgress] = React.useState(0); // 0..1

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // Progreso simple: cuando el top del bloque entra desde 80% hasta -20% del viewport
      const start = vh * 0.8;
      const end = -vh * 0.2;
      const p = 1 - (rect.top - end) / (start - end);

      setProgress(clamp(p, 0, 1));
      rafId = 0;
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return [ref, progress];
}

function HeroScreens() {
  const [ref, p] = useParallaxPair();

  // Transforms distintos para cada imagen
  const tAPU = {
    transform: `translateY(${(-32 * p).toFixed(1)}px) rotateZ(${(-8 + 8 * p).toFixed(2)}deg)`,
  };
  const tPresu = {
    transform: `translateY(${(70 * p).toFixed(1)}px) translateX(${(170 * p).toFixed(1)}px) rotateZ(${(10 - 5 * p).toFixed(2)}deg)`,
  };

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-xl md:max-w-2xl h-[320px] sm:h-[360px] md:h-[420px] overflow-visible pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Imagen APU (debajo, izquierda) */}
      <img
        src="/img/apu1.png"
        alt="Lista de APU"
        className="absolute left-[-6%] top-[18%] w-100 md:w-[100%] rounded-2xl border  shadow-2xl"
        style={tAPU}
        loading="eager"
      />

      {/* Imagen Presupuesto (encima, derecha) */}
      <img
        src="/img/presupuesto1.png"
        alt="Presupuesto"
        className="absolute right-[-6%] top-0 w-100 md:w-[100%] rounded-2xl border shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        style={tPresu}
        loading="eager"
      />
    </div>
  );
}


function useTypewriter(words, speed = 90, pause = 900) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  useEffect(() => {
    let mounted = true;
    let i = 0;
    let forward = true;
    const loop = () => {
      const current = words[index % words.length];
      if (!mounted) return;
      if (forward) {
        if (i <= current.length) {
          setTyped(current.slice(0, i));
          i += 1;
          setTimeout(loop, speed);
        } else {
          forward = false;
          setTimeout(loop, pause);
        }
      } else {
        if (i > 0) {
          i -= 1;
          setTyped(current.slice(0, i));
          setTimeout(loop, speed / 2);
        } else {
          forward = true;
          setIndex((p) => (p + 1) % words.length);
          setTimeout(loop, speed);
        }
      }
    };
    loop();
    return () => {
      mounted = false;
    };
  }, [index, words, speed, pause]);
  return typed;
}

function Stars({ value = 5 }) {
  return (
    <div className="flex items-center gap-1 text-amber-500" aria-label={`${value} estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < value ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

// Beneficio con GIF a la izquierda y texto a la derecha
function BenefitRow({ title, text, itemunico, gif, pngFallback, icon, index = 0 }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // visible solo cuando la tarjeta está mayormente en viewport
        setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.6);
      },
      {
        root: null,
        // deja un margen para que “prenda” cerca del centro
        rootMargin: "-10% 0px -10% 0px",
        threshold: [0, 0.6, 1],
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // Min-height grande para que cada tarjeta “ocupe” la vista
    <section
      ref={ref}
      className="min-h-[70vh] md:min-h-[65vh] flex items-center snap-start"
      aria-hidden={!visible}
    >
      <div
        className={[
          "grid grid-cols-1 items-center gap-6 rounded-2xl border border-emerald-100 bg-white p-4 sm:p-6 md:grid-cols-2",
          "transition-all duration-700 will-change-transform",
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-[0.98]",
        ].join(" ")}
        style={{ transitionDelay: `${Math.min(index * 60, 240)}ms` }} // leve “stagger”
      >
        <div className="order-1 md:order-none">
          <picture>
            <source srcSet={gif} type="image/gif" />
            <img
              src={pngFallback}
              alt={title}
              loading="lazy"
              className="mx-auto h-48 w-auto rounded-xl object-contain shadow-md md:h-56"
              style={{
                transform: "rotateZ(6deg)",
                perspective: "1000px",
              }}
            />
          </picture>
        </div>

        <div className="flex flex-col items-start">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
            {icon}
            <span className="text-xs font-semibold uppercase tracking-wide">
              {itemunico}
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
            {title}
          </h3>
          <p className="mt-2 text-gray-700">{text}</p>
        </div>
      </div>
    </section>
  );
}


function HowItWorks() {
  const steps = [
    {
      title: "Estructura por capítulos",
      text: "Crea Capitulos de Obra.",
      icon: <LuListChecks className="h-5 w-5" aria-hidden="true" />,
    },
    {
      title: "Aumenta tu rentabilidad",
      text: "Agrega costos indirectos, directos y impuestos claros.",
      icon: <LuCalculator className="h-5 w-5" aria-hidden="true" />,
    },
    
  ];
  return (
    <section className="py-16">
      <div className="wrap-wide px-4">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">Y ademas...</h2>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
          {steps.map((s) => (
            <div key={s.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1 text-emerald-700">
                {s.icon}
                <span className="text-xs font-semibold uppercase">{s.title}</span>
              </div>
              <p className="mt-3 text-gray-700">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Feature({ children, ok = false }) {
  return (
    <div className={`flex items-center gap-2 ${ok ? "text-gray-900" : "text-gray-400 line-through"}`}>
      {ok ? (
        <LuCircleCheck className="h-5 w-5 text-emerald-600 shrink-0" aria-hidden="true" />
      ) : (
        <LuCircleX className="h-5 w-5 text-gray-400 shrink-0 opacity-70" aria-hidden="true" />
      )}
      <span className="text-[15px] leading-6">{children}</span>
    </div>
  );
}

function Plans() {
  // precios
  const plusYear = 60000;
  const premiumYear = 150000;


  const formatCOP = (n) =>
    n.toLocaleString("es-CO", { maximumFractionDigits: 0, minimumFractionDigits: 0 });

  const plusMonth = Math.round(plusYear / 12);       // ≈ $5.000 / mes
  const premiumMonth = Math.round(premiumYear / 12); // ≈ $12.500 / mes

  return (
    <section id="planes" className="py-16">
      <div className="wrap-wide px-4">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">Nuestros Planes</h2>
      <p className="mt-1 text-center text-gray-600">Elige el plan mas apropiado para tu obra.</p>
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {/* -------- Plan Plus -------- */}
          <article className="group relative flex min-h-[460px] flex-col rounded-2xl border-2 border-emerald-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-lg font-semibold text-emerald-700">Plan Plus</div>
            <p className="mt-1 text-gray-600">Presupuesto + APU y exportación en Excel.</p>

            <div className="mt-5">
              <div className="text-[40px] font-extrabold leading-10 text-gray-900">
                ${formatCOP(plusYear)}
              </div>
              <div className="text-gray-500">Pago anual</div>
              <div className="mt-1 text-sm text-gray-500">Es igual a ${formatCOP(plusMonth)} / mes</div>
            </div>

            <p className="mt-3 text-sm text-gray-600">Ideal para cotizar rápido con APU y exportar.</p>

            <div className="mt-6 space-y-3">
              <Feature ok>Presupuesto + APU</Feature>
              <Feature ok>Exportar a Excel</Feature>
              <Feature>Cálculos</Feature>
              <Feature>Registro Diario</Feature>
            </div>

            <a
              href="#"
              className="mt-auto inline-flex h-12 w-full items-center justify-center rounded-lg px-5 font-semibold text-white transition-colors"
              style={{ backgroundColor: "#03a042ff" }}
            >
              Activar Plus anual
            </a>
          </article>

          {/* -------- Plan Premium -------- */}
          <article className="group relative flex min-h-[480px] flex-col rounded-2xl border-2 border-emerald-400 bg-emerald-50/40 p-6 shadow-md ring-1 ring-emerald-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            {/* Franja superior: MÁS POPULAR */}
            <div className="-mx-6 -mt-6 mb-5 h-9 rounded-t-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 text-white text-[11px] font-bold tracking-wide flex items-center justify-center shadow-sm">
              MÁS POPULAR
            </div>

            <div className="inline-flex items-center gap-2 text-lg font-semibold text-emerald-700">
              <LuCrown className="h-5 w-5 text-emerald-700" />
              Plan Premium
            </div>
            <p className="mt-1 text-gray-600">Todo CivilesPro por un año.</p>

            <div className="mt-5">
              <div className="text-[40px] font-extrabold leading-10 text-gray-900">
                ${formatCOP(premiumYear)}
              </div>
              <div className="text-gray-500">Pago anual</div>
              <div className="mt-1 text-sm text-gray-500">Es igual a ${formatCOP(premiumMonth)} / mes</div>

              {/* Ahorro vs mensual (sin decir % exacto) */}
              <div className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                Ahorra más del 70% si decides luego cambiar de plan
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              Para obra completa: cálculo, presupuesto y registro.
            </p>

            <div className="mt-6 space-y-3">
              <Feature ok>Presupuesto + APU</Feature>
              <Feature ok>Exportar a Excel</Feature>
              <Feature ok>Cálculos</Feature>
              <Feature ok>Registro Diario</Feature>
            </div>

            <a
              href="#"
              className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-lg px-5 font-semibold text-white transition-colors"
              style={{ backgroundColor: "#03a042ff" }}
            >
              Activar Premium anual
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

function PlanComparison() {
  // helper para pintar celdas (check / x / texto)
  const Cell = ({ v }) =>
    typeof v === "boolean" ? (
      v ? (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
          <LuCircleCheck className="mr-1 h-4 w-4" /> Sí
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-gray-500">
          <LuCircleX className="mr-1 h-4 w-4" /> No
        </span>
      )
    ) : (
      <span className="text-gray-700">{v}</span>
    );

  // Filas (sin proyectos ilimitados ni versiones/comparativos)
  const rows = [
    // GRATIS (solo estas 4)
    { f: "Crear Presupuesto", free: true,  plus: true,  premium: true },
    { f: "Crear APU",         free: true,  plus: true,  premium: true },
    { f: "Biblioteca de +180 APU", free: true, plus: true, premium: true },
    { f: "Capítulos y partidas", free: true, plus: true, premium: true },

    // PLUS / PREMIUM
    { f: "Exportar presupuesto a Excel", free: false, plus: true,  premium: true },

    // PREMIUM extra
    { f: "32 herramientas de cálculo",        free: false, plus: false, premium: true },
    { f: "Generar consolidados",              free: false, plus: false, premium: true },
    { f: "Registro Diario",                   free: false, plus: false, premium: true },
    { f: "Exportación Registro Diario a Excel", free: false, plus: false, premium: true },

    // SOPORTE
    { f: "Soporte", free: "Comunidad", plus: "Estándar", premium: "Prioritario" },
  ];

  return (
    <section className="py-10">
      <div className="wrap-wide px-4">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
          {/* Cabecera */}
          <div className="grid grid-cols-4 border-b bg-emerald-50/40 px-4 py-3 text-sm font-semibold text-emerald-900">
            <div>Características</div>
            <div className="text-center">Gratis</div>
            <div className="text-center">Plus</div>
            <div className="text-center">Premium</div>
          </div>

          {/* Filas */}
          <div className="divide-y">
            {rows.map((r) => (
              <div key={r.f} className="grid grid-cols-4 items-center px-4 py-3">
                <div className="text-gray-900">{r.f}</div>
                <div className="text-center"><Cell v={r.free} /></div>
                <div className="text-center"><Cell v={r.plus} /></div>
                <div className="text-center"><Cell v={r.premium} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Nota mini opcional */}
        {/* <p className="mx-auto mt-3 max-w-5xl px-1 text-sm text-gray-500">
          Algunas funciones pueden variar según promociones o impuestos aplicables.
        </p> */}
      </div>
    </section>
  );
}







function Testimonials() {
  const items = [
    { name: "Carlos M.", role: "Ingeniero Civil", rating: 5, text: "Pasé de 4 horas a 20 minutos para el presupuesto base. Exporto a Excel y listo para cotizar." },
    { name: "Andrea R.", role: "Arquitecta", rating: 5, text: "Me encanta la vista dividida APU/Presupuesto. Es súper claro para iterar y ajustar." },
    { name: "Luis G.", role: "Maestro de obra", rating: 5, text: "La biblioteca de APU me salva: parto de un APU y lo adapto a la obra en curso." },
  ];
  return (
    <section className="py-16">
      <div className="wrap-wide px-4">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">Testimonios</h2>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
          {items.map((t) => (
            <article key={t.name} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <Stars value={t.rating} />
              <p className="mt-3 text-gray-800 italic">“{t.text}”</p>
              <div className="mt-4 font-semibold text-gray-900">{t.name}</div>
              <div className="text-sm text-gray-500">{t.role} ✅</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================
// Página
// =====================
export default function PlataformaPage() {
  const typed = useTypewriter(HERO_ROLES);
  const { pathname } = useLocation();

  // Scroll al top cuando se entra a la página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <>
      <SEO
        title="Presupuesto de Obra con APU — Civiles Pro"
        description="Crea presupuestos de obra en minutos con APU conectados. Biblioteca de +180 APU, vista dividida y exportación a Excel/PDF."
        url={`${SITE_URL}/plataforma`}
        canonical={`${SITE_URL}/plataforma`}
      />

      {/* ===== Hero (mantener estilo base) ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-emerald-50">
        <div className="wrap-wide px-4 py-20 md:py-24 lg:py-28 min-h-[560px] lg:min-h-[720px]">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            {/* Texto */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                <span className="text-xs font-semibold uppercase tracking-wide">Civiles Pro · Plataforma para presupuestar obras civiles</span>
              </div>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
                Lo que{" "}
                <span className="inline-block border-b-4 border-gray-900 text-gray-900">
                  {typed || "\u00A0"}
                </span>
                <br />
                <span className="text-emerald-700">utilizan para crear Presupuesto de Obra.</span>
              </h1>
              <p className="mt-5 text-lg text-gray-700">
                Crea APU conectados al Presupuesto · Usa la biblioteca de APU · Exporta a Excel
              </p>
              <div className="mt-8 flex flex-col justify-start gap-3 sm:flex-row">
                <a
                  href="https://app.civilespro.com/register"
                  className="btn"
                  style={{ backgroundColor: SECONDARY, borderColor: SECONDARY, color: "#fff" }}
                >
                  Crear cuenta gratis
                </a>
                <a href="#planes" className="btn-outline" style={{ borderColor: SECONDARY, color: SECONDARY }}>
                  Ver planes
                </a>
              </div>
            </div>

            {/* Mock visual (imagen estática para ahora) */}
            <div className="">
              {/* Mock visual del Hero: reemplazar todo este div por <HeroScreens /> */}
              <div className="relative flex justify-center md:justify-end">
                <HeroScreens />
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* ===== Beneficios con GIF (reemplaza tu sección actual) ===== */}
<section className="py-16">
  <div className="wrap-wide px-4">
    <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
      Beneficios para tu presupuesto
    </h2>

    {/* El contenedor usa scroll snapping del viewport (funciona bien con min-h en cada card) */}
    <div className="mx-auto mt-10 max-w-5xl space-y-8 snap-y">
      {[
       {
          itemunico: "APU Faciles de hacer",
          title: "Crear APU en segundos",
          text: "Arma APU con materiales, mano de obra, equipos y transporte sin perder tiempo.",
          gif: "/gif/beneficio-apu-segundos.gif",
          pngFallback: "/gif/beneficio-apu-segundos.png",
          icon: <LuCalculator className="h-4 w-4" aria-hidden="true" />,
        },
        {
          itemunico: "Listos para usar",
          title: "Biblioteca de +180 APU",
          text: "Usa, edita y guarda APU de nuestra biblioteca; agrega los tuyos.",
          gif: "/gif/beneficio-biblioteca-180.gif",
          pngFallback: "/gif/beneficio-biblioteca-180.png",
          icon: <LuListChecks className="h-4 w-4" aria-hidden="true" />,
        },
        {
          itemunico: "Interfaz fácil de usar",
          title: "Presupuesto en una sola pantalla",
          text: "Vista dividida enfocada: APU a la izquierda, Presupuesto a la derecha.",
          gif: "/gif/beneficio-splitview.gif",
          pngFallback: "/gif/beneficio-splitview.png",
          icon: <LuWallet className="h-4 w-4" aria-hidden="true" />,
        },
        {
          itemunico: "Excel listo para enviar",
          title: "Exportar a Excel con APU conectados",
          text: "Lleva tu presupuesto y sus APU enlazados a Excel para cotizar al instante.",
          gif: "/gif/beneficio-export-excel.gif",
          pngFallback: "/gif/beneficio-export-excel.png",
          icon: <LuFileSpreadsheet className="h-4 w-4" aria-hidden="true" />,
        },

       
      ].map((b, i) => (
        <BenefitRow key={b.title} index={i} {...b} />
      ))}
    </div>
  </div>
</section>


      {/* ===== Cómo funciona ===== */}
      <HowItWorks />

    

      {/* ===== Planes ===== */}
      <Plans />

      <PlanComparison />

      {/* ===== Testimonios ===== */}
      <Testimonials />  

      {/* ===== CTA final ===== */}
      <section className="py-16">
        <div className="wrap-wide px-4">
          <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-sm">
            <h2 className="text-3xl font-extrabold text-gray-900">¿Listo para presupuestar más rápido?</h2>
            <p className="mt-3 text-gray-700">
              Te ayudamos a crear tu primer presupuesto con APU conectados. Exporta a Excel y compártelo hoy.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="https://app.civilespro.com/register"
                className="btn"
                style={{ backgroundColor: SECONDARY, borderColor: SECONDARY, color: "#fff" }}
              >
                Crear cuenta
              </a>
              <a
                href="https://wa.me/573127437848?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20la%20Plataforma%20de%20Presupuesto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white"
                style={{ backgroundColor: SECONDARY }}
              >
                <FaWhatsapp aria-hidden="true" />
                Hablar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
