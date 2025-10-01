import { useEffect, useState, useRef } from "react";
import {
  motion as Motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { LuCalculator, LuListChecks, LuWallet, LuDownload } from "react-icons/lu";

/* ================== THEME ================== */
const PRIMARY = "#055a27";
const SECUNDARY = "#111111ff";
const ROLES = ["Ingenieros", "Arquitectos", "Maestros de obra"];

/** Imágenes en public/img/*.png (sin slash inicial; se concatena BASE_URL) */
const DEFAULT_LEAD = "Cálculo de materiales para:";

/* ================== CARDS (naipes) ================== */
const CARDS = [
 
  {
    key: "murodebloques",
    lead: "Cantidades precisas para:",
    title: "Muros en Bloques",
    img: "img/bloques.png",
    desc:
      "Bloques, mortero y aparejo por cara del muro. Centraliza el cálculo y controla desperdicios.",
  },
   
  {
    key: "cielorazoendrywall",
    lead: "Perfiles, placas y tornillos de:",
    title: "Cielo raso en Drywall",
    img: "img/cielorazo.png",
    desc:
      "Perfiles, placas, tornillos y masilla, que cambian según el diseño. Todo calculado en segundos.",
  },
  {
    key: "pdf",
    lead: "Entrega y trazabilidad:",
    title: "Exporta un informe por ítem",
    img: "img/informe.png",
    desc: "Descarga un reporte claro para enviar a comprar o documentar tu obra.",
  },
  {
    key: "consolidado",
    lead: "Llévalo a números:",
    title: "Crea un Consolidado",
    img: "img/consolidado.png",
    desc:
      "Reúne tus cálculos en un consolidado de obra. Decide con datos claros y todo en un solo lugar.",
  },
  {
    key: "presupuesto",
    lead: "Convierte cantidades en valor:",
    title: "Presupuesto y APU",
    img: "img/presupuesto.png",
    desc:
      "Genera un presupuesto completo listo para exportar en Excel. Incluye APU con detalles de mano de obra, equipos, transporte e indirectos. Todo claro y ajustado para presentar un proyecto serio.",
  },
];

/* ================== utils ================== */
function useTypewriter(words) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  useEffect(() => {
    const current = words[index];
    let i = 0;
    const typing = setInterval(() => {
      setText(current.slice(0, i + 1));
      i++;
      if (i === current.length) {
        clearInterval(typing);
        setTimeout(() => {
          const deleting = setInterval(() => {
            i--;
            setText(current.slice(0, i));
            if (i === 0) {
              clearInterval(deleting);
              setIndex((index + 1) % words.length);
            }
          }, 100);
        }, 150);
      }
    }, 100);
    return () => clearInterval(typing);
  }, [index, words]);
  return text;
}

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : true
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

/* ================== UI blocks ================== */
function Section({ children, className }) {
  return <section className={className}>{children}</section>;
}

function CTAButton() {
  return (
    <a
      href="https://wa.me/573127437848?text=Hola%20quiero%20activar%20Civiles%20Pro&utm_source=landing&utm_medium=cta"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-white"
      style={{ backgroundColor: SECUNDARY }}
    >
      <FaWhatsapp size={20} />
      Contactar a un asesor
    </a>
  );
}

function AppHeader() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 backdrop-blur"
      style={{ background: "rgba(5, 90, 39, 0.9)" }}
    >
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4">
        <a href="/" aria-label="Inicio">
          <img
            src={import.meta.env.BASE_URL + "img/logociviles.png"}
            alt="Civiles Pro"
            className="h-10 w-auto"
          />
        </a>

        {/* Navegación derecha */}
        <nav className="flex items-center gap-3">
          <a
            href="#planes"
            className="hidden sm:inline text-white/90 hover:text-white"
          >
            Ver planes
          </a>
          <a
            href="https://app.civilespro.com/login"
            className="px-4 py-2 rounded-md font-semibold text-white"
            style={{ backgroundColor: SECUNDARY }}
          >
            Entrar
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const typed = useTypewriter(ROLES);
  return (
    <Section className="flex flex-col items-center pt-16 lg:pt-24 px-4">
     <h1
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-center leading-tight"
        style={{ color: SECUNDARY }}
      >
        <span className="block">
          La herramienta que los{" "}
          <br />
          <span className="inline-block border-b-4" >
            {typed || "\u00A0"}
          </span>
        </span>
        <span className="block">
          <span style={{ color: PRIMARY }}>Utilizan para Calcular Materiales</span>
          <br />
          <span style={{ color: PRIMARY }}>Y Crear Presupuesto de Obra.</span>
        </span>
      </h1>

      <h2 className="text-lg sm:text-xl mt-3 text-center text-gray-700">
        Calculadora de materiales de obra • Presupuesto de obra civil con APU • Exporta a Excel
      </h2>


      {/* CTA principal + secundario */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <a
          href="https://app.civilespro.com/register"
          className="px-6 py-3 rounded-md font-semibold text-white"
          style={{ backgroundColor: SECUNDARY }}
        >
          Crear cuenta gratis
        </a>
        <a
          href="#planes"
          className="px-6 py-3 rounded-md font-semibold border text-center"
          style={{ borderColor: SECUNDARY, color: SECUNDARY }}
        >
          Ver planes
        </a>
      </div>
    </Section>
  );
}

/* ============ Desktop: “naipes” con framer-motion ============ */
function CardSticky({ index, total, img, title, desc, scrollYProgress }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });
  const controls = useAnimation();
  useEffect(() => {
    controls.start(inView ? { scale: 1 } : { scale: 0.98 });
  }, [inView, controls]);

  const start = index / total;
  const mid = start + (1 / total) * 0.35;
  const end = (index + 1) / total;

  const opacity = useTransform(scrollYProgress, [start, mid, end], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [start, mid, end], [40, 0, -40]);
  const rotateX = useTransform(scrollYProgress, [start, mid, end], [10, 6, -4]);
  const rotateY = useTransform(scrollYProgress, [start, mid, end], [-12, -8, 0]);

  return (
    <article ref={ref} className="sticky top-24 lg:top-28" style={{ zIndex: index + 1 }}>
      <Motion.div
        style={{ opacity, y }}
        initial={{ scale: 0.98 }}
        animate={controls}
        className="mx-auto max-w-8xl"
      >
        <div className="grid lg:grid-cols-12 gap-8 items-center px-2 lg:px-4">
          {/* Imagen */}
          <div className="lg:col-span-7" style={{ perspective: "1000px" }}>
            <Motion.img
              src={import.meta.env.BASE_URL + img.replace(/^\//, "")}
              alt={title}
              loading="lazy"
              width={1280}
              height={768}
              className="w-full h-[68vh] lg:h-[72vh] object-contain"
              style={{ rotateX, rotateY }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          {/* Texto */}
          <div className="lg:col-span-5 px-2 lg:px-6">
            <h4 className="text-sm lg:text-base text-gray-600">
              {CARDS[index].lead || DEFAULT_LEAD}
            </h4>
            <h3 className="text-2xl lg:text-4xl font-extrabold mt-2" style={{ color: PRIMARY }}>
              {title}
            </h3>
            {desc && (
              <p className="mt-2 text-sm text-gray-700 text-[15px] leading-relaxed max-w-[520px]">
                {desc}
              </p>
            )}
          </div>
        </div>
      </Motion.div>
    </article>
  );
}

function CardsDesktop() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <div ref={containerRef} className="relative" style={{ height: `${CARDS.length * 100}vh` }}>
      {CARDS.map((c, i) => (
        <CardSticky
          key={c.key}
          index={i}
          total={CARDS.length}
          img={c.img}
          title={c.title}
          desc={c.desc}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

/* ============ Mobile: carrusel horizontal manual ============ */
function CardsMobile() {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef(null);

  const goTo = (idx) => {
    const el = scrollerRef.current?.children[idx];
    if (el && "scrollIntoView" in el)
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActive(idx);
  };

  return (
    <div className="relative">
      {/* Flechas opcionales */}
      <button
        onClick={() => goTo(Math.max(0, active - 1))}
        className="hidden xs:block absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 border rounded-md shadow px-3 py-2"
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={() => goTo(Math.min(CARDS.length - 1, active + 1))}
        className="hidden xs:block absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 border rounded-md shadow px-3 py-2"
        aria-label="Siguiente"
      >
        ›
      </button>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar"
        onScroll={(e) => {
          const children = Array.from(e.currentTarget.children);
          const center = e.currentTarget.scrollLeft + e.currentTarget.clientWidth / 2;
          const idx = children.findIndex((ch) => {
            const left = ch.offsetLeft;
            const right = left + ch.clientWidth;
            return left <= center && right >= center;
          });
          if (idx >= 0) setActive(idx);
        }}
      >
        {CARDS.map((c) => (
          <Motion.div
            key={c.key}
            className="snap-center shrink-0 w-[88vw] overflow-visible"
            initial={{ opacity: 0.85, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <div className="p-2">
              <div className="w-full h-[32vh] sm:h-[36vh] md:h-[44vh] flex items-center justify-center">
                <img
                  src={import.meta.env.BASE_URL + c.img.replace(/^\//, "")}
                  alt={c.title}
                  loading="lazy"
                  width={960}
                  height={540}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="mt-3 max-w-[520px]">
                <h4 className="text-sm text-gray-600">
                  {c.lead || DEFAULT_LEAD}
                </h4>
                <h3 className="text-2xl font-extrabold mt-1" style={{ color: PRIMARY }}>
                  {c.title}
                </h3>
                {c.desc && (
                  <p className="mt-2 text-sm text-gray-700 text-[15px] leading-relaxed">
                    {c.desc}
                  </p>
                )}
              </div>
            </div>
          </Motion.div>
        ))}
      </div>

      {/* Paginadores */}
      <div className="flex justify-center gap-2 mt-2">
        {CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 w-2 rounded-full ${i === active ? "bg-green-700 scale-110" : "bg-gray-300"}`}
            aria-label={`Ir a tarjeta ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function CardsWow() {
  const isMobile = useIsMobile(1024);
  return (
    <Section className="mt-10 px-4 lg:px-8">
  <ul className="grid gap-4 text-center max-w-3xl mx-auto">
    <li className="flex gap-3 items-center">
      <p>
        <span className="font-bold text-gray-900">Puedes usarla para calcular:</span>{" "}
        <span className="text-gray-700">
          concreto, ciclópeo, pavimento rígido, bordillos, mallas electrosoldada, muros en bloques, mampostería estructural, muros de concretos, drywall, cielo razo, cubiertas en fibrocemento, upvc, sándwich, standing, zinc, pisos en porcelanatos, cerámicas, pulidos. Acabados de pinturas y yeso, losas de concreto armado, placa fácil, losacero, losa aligerada... <strong>y presupuesto.</strong>
        </span>
      </p>
    </li>
    
  </ul>

  {isMobile ? <CardsMobile /> : <CardsDesktop />}
</Section>

  );
}

/* ============================  TESTIMONIOS (CARRUSEL SIMPLE)  ============================ */
const TESTIMONIALS = [
  {
    name: "Carlos M.",
    role: "Ingeniero civil",
    rating: 5,
    text:
      "Los APU y el presupuesto me ahorran horas. Antes tardaba una tarde, ahora en 20 minutos tengo la propuesta lista.",
  },
  {
    name: "Laura G.",
    role: "Arquitecta",
    rating: 5,
    text:
      "Me encanta poder exportar a Excel y ajustar indirectos. Es perfecto para enviar a mi cliente sin retrabajos.",
  },
  {
    name: "José R.",
    role: "Maestro de obra",
    rating: 4,
    text:
      "Los materiales salen precisos y compro lo justo. Menos desperdicio y mejor control del trabajo.",
  },
  {
    name: "Andrés T.",
    role: "Residente de obra",
    rating: 5,
    text:
      "El consolidado + Presupuesto es oro. Tengo todo el proyecto organizado y con trazabilidad.",
  },
];

function Stars({ value = 5, className = "" }) {
  return (
    <div className={`inline-flex items-center ${className}`} aria-label={`${value} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? "text-yellow-400" : "text-gray-300"}>★</span>
      ))}
    </div>
  );
}

function TestimonialsCarousel() {
  const avg = (
    TESTIMONIALS.reduce((s, t) => s + t.rating, 0) / TESTIMONIALS.length
  ).toFixed(1);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = TESTIMONIALS.length;

  const goTo = (i) => setIndex((i + total) % total);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => next(), 4500);
    return () => clearInterval(id);
  }, [index, paused]);

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header tipo Trustpilot */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <Stars value={5} className="text-2xl" />
            <span className="text-sm font-semibold px-2 py-1 rounded bg-white shadow">
              Valoración {avg}/5
            </span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold" style={{ color: PRIMARY }}>
            Opiniones verificadas de profesionales
          </h2>
          <p className="mt-1 text-sm text-gray-600">Basado en experiencias reales con Civiles Pro.</p>
        </div>

        {/* Carrusel */}
        <div
          className="relative mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="min-w-full px-2">
                  <article className="bg-white p-6 md:p-7 rounded-xl shadow h-full max-w-3xl mx-auto">
                    <Stars value={t.rating} />
                    <p className="mt-3 text-gray-800 italic">“{t.text}”</p>
                    <div className="mt-4 font-semibold">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role} ✅</div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Flechas */}
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 border rounded-md shadow px-3 py-2 hidden sm:block"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 border rounded-md shadow px-3 py-2 hidden sm:block"
          >
            ›
          </button>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir al testimonio ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index ? "bg-green-700 scale-110" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sellito inferior */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Stars value={5} />
          <span className="text-sm text-gray-700">
            Valorado por más de <strong>120 profesionales</strong> en Colombia
          </span>
        </div>
      </div>
    </section>
  );
}



function StepCard({ icon, title, text, delay = 0 }) {
  return (
    <div
      className="group relative rounded-2xl border border-green-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
      style={{ transitionDelay: `${delay}s` }}
    >
      {/* Medallón */}
      <div className="mx-auto h-14 w-14 rounded-full grid place-items-center mb-4 relative">
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-green-300 via-green-200 to-transparent" />
        <span className="relative z-10 h-12 w-12 rounded-full grid place-items-center bg-green-100 ring-2 ring-white shadow-sm">
          {icon}
        </span>
      </div>

      <h3 className="text-lg font-bold text-center" style={{ color: PRIMARY }}>
        {title}
      </h3>
      <p className="mt-2 text-gray-600 text-center text-[15px] leading-relaxed">
        {text}
      </p>

      {/* Barra activa al hover */}
      <span className="pointer-events-none absolute left-6 right-6 -bottom-px h-0.5 bg-gradient-to-r from-transparent via-green-500/80 to-transparent scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300" />
    </div>
  );
}

/* ============================  PRECIOS  ============================ */
function CheckLine({ children }) {
  return (
    <li className="flex items-start gap-2 text-[15px] text-gray-800">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mt-0.5 h-4 w-4 flex-none"
        viewBox="0 0 20 20"
        fill={PRIMARY}
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <span>{children}</span>
    </li>
  );
}

function MaterialsAndPricing() {
  const base = import.meta.env.BASE_URL;

  return (
    <section id="planes" className="px-4 py-16 scroll-mt-24">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-3xl font-bold leading-7 text-gray-800">
          Ves los bultos, la arena, la grava, las varillas… pero lo que no ves son los errores.
          Aquí todo está medido, ajustado y listo para construir.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <img
          src={base + "img/materiales.png"}
          alt="Materiales (cemento, arena, gravilla, acero, etc.)"
          loading="lazy"
          width={960}
          height={320}
          className="h-[300px] sm:h-[300px] md:h-[320px] object-contain"
        />
      </div>

      <div className="relative mt-8 max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <div
          className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gray-300"
          aria-hidden="true"
        />
      </div>

      {/* PRECIOS */}
      <div className="mt-6 mb-10 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 text-center items-start sm:divide-x sm:divide-gray-300">
        <div className="flex flex-col items-center sm:px-6">
          <div className="text-[34px] sm:text-[36px] font-extrabold tracking-tight text-primary">$20.000 COP</div>
          <div className="text-[14px] text-gray-700 mt-1">Suscripción Mensual</div>
          <p className="text-[15px] text-gray-800 font-medium">Cancela cuando quieras</p>
          <ul className="mt-4 space-y-2 text-left w-full">
            <CheckLine>Compatible con Mac.</CheckLine>
            <CheckLine>Compatible con Telefonos.</CheckLine>
            <CheckLine>32 Herramientas de Calculo de Materiales.</CheckLine>
            <CheckLine>Genera Presupuesto y APU.</CheckLine>
            <CheckLine>Biblioteca de APU y materiales.</CheckLine>
            <CheckLine>No requiere Excel.</CheckLine>
            <CheckLine>Exporta resultados en Excel.</CheckLine>
            <CheckLine>Soporte 24/7.</CheckLine>
          </ul>
          <a
            href="https://app.civilespro.com/register"
            className="mt-4 px-6 py-3 rounded-md font-semibold text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            Suscríbete
          </a>
        </div>

       
   <div className="flex flex-col items-center mt-10 sm:mt-0 sm:px-6 relative text-center">


      
        {/* Ahora */}
        <div className="mt-1 text-[34px] sm:text-[36px] font-extrabold tracking-tight text-primary whitespace-nowrap">
          $150.000 COP
        </div>
          {/* Subtítulo */}
        <div className="text-[14px] text-gray-700 mt-1">
          Suscripción anual
        </div>

        {/* Línea de apoyo */}
        <p className="mt-1 text-[13px] text-gray-700">
          40% de descuento frente al plan mensual
        </p>
        {/* Antes (tachado) */}
          <div className="text-[15px] text-gray-500 line-through">
            $240.000 COP
          </div>
      

        {/* Chip de ahorro */}
        <span className="mt-2 inline-block text-[12px] font-semibold bg-green-600 text-white px-3 py-1 rounded-full shadow">
          Ahorra $90.000 COP
        </span>

        

        {/* Beneficios (alineación coherente) */}
        <ul className="mt-4 space-y-2 text-left w-full max-w-[320px]">
          <CheckLine>Todo lo del plan mensual.</CheckLine>
          <CheckLine><strong>Soporte prioritario.</strong></CheckLine>
          <CheckLine><strong>Incluye plantilla de Excel:</strong> Control y gestión de formaletas.</CheckLine>
          <CheckLine><strong>Incluye plantilla de Excel:</strong> Control de almacén en obra.</CheckLine>
          <CheckLine>Acceso a nuevas herramientas durante el año.</CheckLine>
        </ul>

        {/* Botón */}
        <a
          href="https://checkout.wompi.co/l/so1kfv"
          className="mt-4 px-6 py-3 rounded-md font-semibold text-white ring-2"
          style={{ backgroundColor: PRIMARY, boxShadow: "0 6px 18px rgba(5,90,39,0.2)" }}
        >
          Comprar
        </a>
      </div>


      </div>

      <div className="max-w-3xl mx-auto text-center mt-2">
        <p className="text-[14px] text-gray-700">
          <span className="font-medium">Ambas incluyen tutorial.</span> Elige la que prefieras. Sin restricciones.
        </p>
      </div>
      <div className="mt-6 flex items-center justify-center">
        <img
          src={base + "img/mediosdepago.png"}
          alt="Medios de pago"
          loading="lazy"
          width={800}
          height={160}
          className="h-[120px] sm:h-[120px] md:h-[120px] object-contain"
        />
      </div>
      <div className="max-w-3xl mx-auto text-center mt-8 space-y-3">
        <p className="text-[15px] text-gray-800 font-semibold">
          Exporta cada cálculo en PDF (ordenado por ítem) para cotizar y documentar.
        </p>
        <p className="text-[15px] text-gray-800 font-semibold">
          Crea un Presupuesto con APU en minutos.
        </p>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <Section className="py-16 text-center">
      <CTAButton />
    </Section>
  );
}

function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="text-white" style={{ backgroundColor: PRIMARY }}>
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Encabezado */}
        <div className="grid gap-6 md:grid-cols-3 items-start">
          <div>
            <img
              src={import.meta.env.BASE_URL + "img/logociviles.png"}
              alt="Civiles Pro"
              className="h-20 w-auto"
            />
          </div>
          <div className="md:col-span-2 text-xs opacity-90">
            Civiles Pro es una plataforma diseñada para ingenieros, arquitectos y maestros de obra que 
            necesitan calcular materiales y costos de manera rápida y confiable. 
            Nuestros resultados se apoyan en parámetros técnicos y buenas prácticas de construcción, 
            y pueden ajustarse a las especificaciones de cada proyecto. 
            La herramienta facilita la elaboración de consolidados y presupuestos para estimar; no sustituye la validación técnica del profesional responsable de la obra.
          </div>
        </div>

        {/* Cuerpo */}
        <div className="grid gap-8 md:grid-cols-2">
          <ul className="space-y-2">
            <li><a href="" className="block opacity-90 hover:opacity-100">Inicio</a></li>
            <li><a href="" className="block opacity-90 hover:opacity-100">Plantilla de cálculo de concreto</a></li>
            <li><a href="" className="block opacity-90 hover:opacity-100">Cursos</a></li>
            <li><a href="" className="block opacity-90 hover:opacity-100">Recursos para Autocad</a></li>
            <li><a href="" className="block opacity-90 hover:opacity-100">Recursos para Revit</a></li>
            <li><a href="" className="block opacity-90 hover:opacity-100">Plantilla de gestión de formaleta</a></li>
            <li><a href="" className="block opacity-90 hover:opacity-100">Plantilla de almacén</a></li>
          </ul>
          <div className="flex gap-4">
            {/* Redes */}
            <a href="https://www.facebook.com/ingcivilespro" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M24 12.073C24 5.404 18.627 0 12 0 5.373 0 0 5.404 0 12.073c0 6.053 4.388 11.07 10.125 11.928v-8.432H7.078v-3.496h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.492 0-1.956.925-1.956 1.874v2.251h3.328l-.532 3.497h-2.796v8.432C19.612 23.142 24 18.125 24 12.073" /></svg>
            </a>
            <a href="https://www.instagram.com/civilespro/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 0c3.3 0 3.7.012 5.004.072 1.206.058 2.003.25 2.48.415a4.92 4.92 0 011.8 1.17 4.92 4.92 0 011.17 1.8c.165.477.357 1.274.415 2.48C22.988 5.3 23 5.7 23 9c0 3.3-.012 3.7-.072 5.004-.058 1.206-.25 2.003-.415 2.48a4.92 4.92 0 01-1.17 1.8 4.92 4.92 0 01-1.8 1.17c-.477.165-1.274.357-2.48.415C15.7 22.988 15.3 23 12 23c-3.3 0-3.7-.012-5.004-.072-1.206-.058-2.003-.25-2.48-.415a4.92 4.92 0 01-1.8-1.17 4.92 4.92 0 01-1.17-1.8c-.165-.477-.357-1.274-.415-2.48C1.012 15.7 1 15.3 1 12c0-3.3.012-3.7.072-5.004.058-1.206.25-2.003.415-2.48a3.2 3.2 0 00-.765-1.178 3.2 3.2 0 00-1.178-.765c-.358-.143-.902-.31-1.898-.356-1.294-.058-1.704-.07-4.964-.07zm0 3.405a5.432 5.432 0 110 10.864 5.432 5.432 0 010-10.864zm0 8.962a3.53 3.53 0 100-7.06 3.53 3.53 0 000 7.06zm5.6-9.994a1.272 1.272 0 11-2.544 0 1.272 1.272 0 012.544 0z" /></svg>
            </a>
            <a href="https://www.tiktok.com/@ingcivilespro" target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 0h4.837c.375 2.73 2.426 4.87 5.163 5.11v4.89a9.075 9.075 0 01-4.812-1.318v8.306a6.93 6.93 0 11-6.93-6.928c.45 0 .885.046 1.309.126V5.105H12V0zm1.309 13.61a2.437 2.437 0 00-1.309-.365 2.485 2.485 0 102.485 2.485v-6.199a9.088 9.088 0 004.812 1.319V8.184a5.127 5.127 0 01-4.812-5.059H13.31v10.485z" /></svg>
            </a>
          </div>
        </div>

        {/* Pie */}
        <div className="pt-8 mt-8 border-t border-white/20 text-xs text-center">
          © {year} Civiles Pro. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

/* ============================  LAYOUT  ============================ */

export default function Landing() {
  return (
    <div className="font-sans scroll-smooth">
      <AppHeader />
      <div className="pt-20 lg:pt-24">
        <Hero />
        <CardsWow />

        {/* Planes */}
        <MaterialsAndPricing />

          {/* Testimonios */}
        <TestimonialsCarousel />

        <FinalCTA />
        <SiteFooter />
      </div>
    </div>
  );
}
