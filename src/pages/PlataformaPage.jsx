import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa6";
import { LuCalculator, LuDownload, LuListChecks, LuWallet, LuFileSpreadsheet, LuPercent, LuBuilding2, LuFileText, LuArrowRight, LuCopyCheck } from "react-icons/lu";
import { LuUser } from "react-icons/lu";
import SEO from "../components/SEO.jsx";
import { LuCircleCheck, LuCircleX, LuCrown, LuLock } from "react-icons/lu";
import Reveal from "../components/Reveal.jsx";
import VideoLoop from "@/components/VideoLoop";
import blogs from "../data/blogList.json";

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
    <div className="flex items-center gap-1 text-sm text-amber-400/90" aria-label={`${value} estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < value ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

// Beneficio con GIF a la izquierda y texto a la derecha
function BenefitRow({
  title,
  text,
  itemunico,
  gif,
  pngFallback,
  videoWebm,
  poster,
  icon,
  index = 0,
}) {
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
          "grid grid-cols-1 items-center gap-6 rounded-2xl  bg-white p-4 sm:p-6 md:grid-cols-[70%_30%]",
          "transition-all duration-700 will-change-transform",
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-[0.98]",
        ].join(" ")}
        style={{ transitionDelay: `${Math.min(index * 60, 240)}ms` }} // leve “stagger”
      >
        <div
          className=" order-1 md:order-none flex justify-center"
          style={{
            perspective: "1200px", // Profundidad 3D
          }}
        >
          {videoWebm ? (
            <div
              className="order-1 md:order-none flex justify-center w-full  "
              style={{ perspective: "1200px" }}
            >
              <VideoLoop
                webm={videoWebm}
                poster={poster}
                className="w-full h-auto [clip-path:inset(2.3%_0%_2.7%_0%)] "
              />
            </div>
          ) : (
            <picture>
              <source srcSet={gif} type="image/gif" />
              <img
                src={pngFallback || poster}
                alt={title}
                loading="lazy"
                className="w-full max-w-6xl rounded-2xl shadow-2xl transform 
                          rotate-y-[-15deg] rotate-x-[2deg] scale-[1.05]"
              />
            </picture>
          )}
        </div>

        <div className="flex flex-col  items-start">
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
      title: "Calculadora de Materiales",
      text: "Calcula cantidades de Materiales para cualquier trabajo.",
      icon: <LuListChecks className="h-5 w-5" aria-hidden="true" />,
    },
    {
      title: "Aumenta tu rentabilidad",
      text: "Agrega costos indirectos, directos y impuestos claros.",
      icon: <LuCalculator className="h-5 w-5" aria-hidden="true" />,
    },
  ];
  return (
    <Reveal
      as="section"
      variant="fade-in"
      once={false}
      rootMargin="-15% 0px -15% 0px"
      className="bg-gradient-to-b from-white to-emerald-50/40 py-20"
    >
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-4xl font-black tracking-tight text-gray-900 md:text-5xl">Y ademas...</h2>

        {/* Grid 2 columnas */}
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
          {steps.map((s, i) => (
            <Reveal
              key={s.title}
              variant="fade-up"
              delay={i * 90}
              once={false}
              rootMargin="-20% 0px -20% 0px"
            >
              <div className="space-y-2 rounded-2xl border border-emerald-100/70 bg-white/70 p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-25px_rgba(0,0,0,0.35)]">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-700 ring-1 ring-emerald-100">
                  {s.icon}
                  <span className="text-xs font-semibold uppercase">{s.title}</span>
                </div>
                <p className="text-gray-600">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Banner verde de privacidad – ocupa el ancho de ambas tarjetas */}
        <Reveal variant="fade-up" delay={120} once={false} rootMargin="-20% 0px -20% 0px">
          <div className="mx-auto mt-4 max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-600 p-6 shadow-[0_20px_60px_-35px_rgba(16,185,129,0.65)] ring-1 ring-white/15">
              <div className="pointer-events-none absolute inset-0 bg-white/10 blur-2xl" aria-hidden="true" />
              <div className="relative space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white ring-1 ring-white/20">
                  <LuLock className="h-5 w-5" aria-hidden="true" />
                  <span>Privacidad</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Tus presupuestos son <span className="decoration-white/10">Privados</span>.
                </h3>
                <p className="text-white/85">
                  Nadie ve tus precios, APU o cantidades los datos se guardan en tu navegador. Tu información está segura.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Reveal>
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
    <Reveal
      as="section"
      id="planes"
      variant="fade-in"
      once={false}
      rootMargin="-12% 0px -12% 0px"
      className="relative overflow-hidden py-16 bg-gradient-to-b from-white to-emerald-50/50"
    >
      {/* Fondo decorativo (arcos laterales) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Izquierda */}
        <div className="absolute -left-[520px] top-1/2 h-[1100px] w-[1100px] -translate-y-1/2 rounded-full border border-emerald-200/60" />
        <div className="absolute -left-[360px] top-1/2 h-[850px] w-[850px] -translate-y-1/2 rounded-full border border-emerald-200/50" />
        

        {/* Derecha */}
        <div className="absolute -right-[520px] top-1/2 h-[1100px] w-[1100px] -translate-y-1/2 rounded-full border border-emerald-200/60" />
        <div className="absolute -right-[360px] top-1/2 h-[850px] w-[850px] -translate-y-1/2 rounded-full border border-emerald-200/50" />
        
      </div>
       <div className="wrap-wide px-4">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">Nuestros Planes</h2>
        <p className="mt-1 text-center text-gray-600">Elige el plan mas apropiado para tu obra.</p>
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {/* -------- Plan Plus -------- */}
          <Reveal variant="slide-right" delay={80} once={false}>
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

              <p className="mt-3 text-sm text-gray-600">Ideal para contratistas independientes.</p>

              <div className="mt-6 space-y-3">
                <Feature ok>Presupuesto + APU</Feature>
                <Feature ok>Exportar a Excel</Feature>
                <Feature>Memorias de Cantidades</Feature>
                <Feature>Cálculos</Feature>
                <Feature>Registro Diario</Feature>
              </div>

              <a
                href="https://checkout.wompi.co/l/vyKSFA"
                className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-lg px-5 font-semibold text-white transition-colors"
                style={{ backgroundColor: "#03a042ff" }}
              >
                Activar Plus anual
              </a>
            </article>
          </Reveal>

          {/* -------- Plan Premium -------- */}
          <Reveal variant="slide-left" delay={160} once={false}>
            <article className="group relative flex min-h-[480px] flex-col rounded-2xl border-2 border-emerald-400 bg-white p-6 shadow-md ring-1 ring-emerald-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
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
                Para empresas que manejan varias obras.
              </p>

              <div className="mt-6 space-y-3">
                <Feature ok>Presupuesto + APU</Feature>
                <Feature ok>Exportar a Excel</Feature>
                <Feature ok>Memoria de Cantidades</Feature>
                <Feature ok>Cálculos</Feature>
                <Feature ok>Registro Diario</Feature>
              </div>

              <a
                href="https://checkout.wompi.co/l/Wcbaj4"
                className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-lg px-5 font-semibold text-white transition-colors"
                style={{ backgroundColor: "#03a042ff" }}
              >
                Activar Premium anual
              </a>
            </article>
          </Reveal>
        </div>
      </div>
    </Reveal>
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
    { f: "Biblioteca de APU", free: true, plus: true, premium: true },
    { f: "Capítulos y partidas", free: true, plus: true, premium: true },
    // PLUS / PREMIUM
    { f: "Exportar presupuesto a Excel", free: false, plus: true,  premium: true },
    { f: "Memorias de Cantidades", free: false, plus: false, premium: true },

    // PREMIUM extra
    { f: "Calculadora de Materiales",        free: false, plus: false, premium: true },
    { f: "Generar consolidados",              free: false, plus: false, premium: true },
    { f: "Registro Diario",                   free: false, plus: false, premium: true },
    

    // SOPORTE
    { f: "Soporte", free: false, plus: "Whatsapp", premium: "Prioritario" },
  ];

  return (
    <Reveal
      as="section"
      variant="fade-up"
      once={false}
      rootMargin="-10% 0px -10% 0px"
      className="py-10"
    >
      <div className="wrap-wide px-4">
        <Reveal variant="fade-up" delay={80} once={false}>
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
            {/* Cabecera */}
            <div className="grid grid-cols-4 border-b bg-emerald-50/40 px-4 py-3 text-sm font-semibold text-emerald-900">
              <div>Incluye</div>
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
        </Reveal>
      </div>
    </Reveal>
  );
}

function Testimonials() {
  const items = [
    { name: "Carlos M.", role: "Ingeniero Civil", rating: 5, text: "Pasé de 4 horas a 20 minutos para el presupuesto base. Exporto a Excel y listo para cotizar." },
    { name: "Andrea R.", role: "Arquitecta", rating: 5, text: "Me encanta la vista dividida APU/Presupuesto. Es súper claro para iterar y ajustar." },
    { name: "Luis G.", role: "Maestro de obra", rating: 5, text: "La biblioteca de APU me salva: parto de un APU y lo adapto a la obra en curso." },
  ];
  return (
    <Reveal
      as="section"
      variant="fade-in"
      once={false}
      rootMargin="-12% 0px -12% 0px"
      className="bg-gradient-to-b from-white via-emerald-50/30 to-white py-20"
    >
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-4xl font-black tracking-tight text-gray-900 md:text-5xl">Testimonios</h2>
        <div className="mx-auto mt-12 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal
              key={t.name}
              variant="fade-up"
              delay={i * 120}
              once={false}
              rootMargin="-20% 0px -20% 0px"
            >
              <article className="relative h-full overflow-hidden rounded-3xl border border-emerald-100/70 bg-white/70 p-7 backdrop-blur-md ring-1 ring-white/50 transition-all duration-200 hover:-translate-y-1  md:p-8">
                
                
                <div className="pointer-events-none absolute -bottom-28 -right-28 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute top-3 left-4 text-[90px] font-black leading-none text-gray-900/5 select-none" aria-hidden="true">
                  “
                </div>
                <div className="relative z-10 flex h-full flex-col">
                  <Stars value={t.rating} />
                  <p className="mt-4 text-base leading-relaxed text-gray-800 md:text-lg">“{t.text}”</p>
                  <div className="mt-6 flex items-center justify-between gap-4 pt-5 border-t border-gray-200/60">
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function RecommendedBlogs() {
  const recommendedSlugs = ["presupuesto-obra", "que-es-un-apu"];
  const posts = recommendedSlugs
    .map((slug) => blogs.find((post) => post.slug === slug))
    .filter(Boolean);

  if (posts.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-white to-emerald-50/30 py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Blogs recomendados
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
            Sigue aprendiendo sobre presupuesto y APU
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-700 md:text-lg">
            Dos lecturas clave para profundizar en presupuestos de obra y análisis de precios unitarios.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex h-full flex-col rounded-2xl border border-emerald-100/70 bg-white/70 p-6 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold leading-tight text-gray-900">{post.title}</h3>
              <p className="mt-3 text-gray-700 leading-relaxed">{post.description}</p>
              <Link
                to={`/blog/${post.slug}`}
                className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Leer
                <LuArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
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

  const { pathname } = useLocation();
  const canonicalPath = pathname === "/presupuesto" ? "/presupuesto" : "/plataforma";

  // Scroll al top cuando se entra a la página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <>
      <SEO
        title="Presupuesto de Obra con APU — Civiles Pro"
        description="Crea presupuestos de obra en minutos con APU conectados. Biblioteca de APU, vista dividida y exportación a Excel/PDF."
        url={`${SITE_URL}${canonicalPath}`}
        canonical={`${SITE_URL}${canonicalPath}`}
      />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-emerald-50">
        <div className="wrap-wide px-4 py-20 md:py-24 lg:py-28 min-h-[560px] lg:min-h-[720px]">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            {/* Texto */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                <span className="text-xs font-semibold uppercase tracking-wide">El tiempo es dinero cuando se trata de contratos.</span>
              </div>
              <h1 className="mt-4 text-4xl  font-black tracking-tight leading-tight text-gray-900 sm:text-5xl">
              Crea presupuestos de Obra
                            <br />
                <span className="text-emerald-700">Sin retrasarte en el cierre de contratos.</span>
              </h1>
              <p className="mt-5 text-lg text-gray-700">
                Utiliza/crea APU conectados al Presupuesto · Exporta a Excel
              </p>
              <div className="mt-8 flex flex-col justify-start gap-3 sm:flex-row">
                <a
                  href="https://app.civilespro.com/register"
                  className="btn"
                  style={{ backgroundColor: SECONDARY, borderColor: SECONDARY, color: "#fff" }}
                >
                  Comienza gratis
                </a>
                <a href="#planes" className="btn-outline" style={{ borderColor: SECONDARY, color: SECONDARY }}>
                  Ver planes
                </a>
              </div>
            </div>

            {/* Mock visual */}
            <div className="">
              <div className="relative flex justify-center md:justify-end">
                <HeroScreens />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Beneficios con GIF ===== */}
      <section className="py-16">
        <div className="wrap-wide px-4">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Beneficios para tu presupuesto
          </h2>

          <div className="mx-auto mt-10 max-w-10xl space-y-10 snap-y">
            {[
              {
                itemunico: "APU Faciles de hacer",
                title: "Crea APU en Minutos  ",
                text: "Mas 1500 insumos que incluyen: materiales, mano de obra, equipos y transporte. Con precios Actualizados.",
                gif: "/gif/beneficio-apu-segundos.gif",
                pngFallback: "/gif/beneficio-apu-segundos.png", 
                videoWebm: "/apuvideos/apu-crear.webm",
                poster: "/gif/beneficio-apu-segundos.png",
                icon: <LuCalculator className="h-4 w-4" aria-hidden="true" />,
              },
              {
                itemunico: "Listos para usar",
                title: "Biblioteca de APU",
                text: "Usa y edita nuestra biblioteca privada de APU. Todos con rendimientos listos para usar en tu presupuesto.",
                gif: "/gif/beneficio-biblioteca-180.gif",
                pngFallback: "/gif/beneficio-biblioteca-180.png",
                videoWebm: "/apuvideos/apu-biblioteca.webm",
                poster: "/gif/beneficio-biblioteca-180.png",
                icon: <LuListChecks className="h-4 w-4" aria-hidden="true" />,
              },
              {
                itemunico: "Interfaz fácil de usar",
                title: "Crea un Presupuesto en una sola pantalla",
                text: "Deja de perder tiempo buscando entre varias hojas de Excel. Nuestra interfaz está diseñada para ser rápida y fácil: APU a la izquierda, Presupuesto a la derecha.",
                gif: "/gif/beneficio-splitview.gif",
                pngFallback: "/gif/beneficio-splitview.png",
                videoWebm: "/apuvideos/apu-interfaz.webm",
                poster: "/gif/beneficio-splitview.png",
                icon: <LuWallet className="h-4 w-4" aria-hidden="true" />,
              },
              {
                itemunico: "Datos confiables",
                title: "Memorias de Cantidades.",
                text: "Agrega memorias de cantidades a cada APU que uses y conéctalas directamente con el presupuesto.",
                gif: "/gif/memorias-cantidades.gif",
                pngFallback: "/gif/memorias-cantidades.png",
                videoWebm: "/apuvideos/memorias-cantidades.webm",
                poster: "/gif/memorias-cantidades.png",
                icon: <LuFileSpreadsheet className="h-4 w-4" aria-hidden="true" />,
              },
              {
                itemunico: "Excel listo para presentar",
                title: "Exporta a Excel",
                text: "Lleva tu presupuesto, sus APU y Memorias de Cantidades a Excel con formulas y datos conectados.",
                gif: "/gif/beneficio-export-excel.gif",
                pngFallback: "/gif/beneficio-export-excel.png",
                videoWebm: "/apuvideos/excel-exportar.webm",
                poster: "/gif/beneficio-export-excel.png",
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

      {/* ===== Blogs recomendados ===== */}
      <RecommendedBlogs />

      {/* ===== CTA final ===== */}
      <section className="bg-gradient-to-b from-white via-emerald-50/30 to-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-emerald-100/70 bg-white/70 p-10 text-center  backdrop-blur-md md:p-12">
            <span className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
           
            <div className="relative">
              <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-700 ring-1 ring-emerald-100">
                tiempo = dinero
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
                ¿Listo para presupuestar más rápido?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-gray-600 md:text-lg">
                Te ayudamos a ser mas eficiente y rentable. Empieza gratis hoy. 
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="https://app.civilespro.com/register"
                  className="rounded-full bg-emerald-700 px-7 py-3 font-semibold text-white shadow-[0_12px_30px_-18px_rgba(16,185,129,0.8)] transition hover:bg-emerald-800"
                >
                  Comienza gratis
                </a>
                <a
                  href="https://wa.me/573127437848?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20la%20Plataforma%20de%20Presupuesto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-7 py-3 font-semibold text-gray-900 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  <FaWhatsapp aria-hidden="true" />
                  Hablar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
