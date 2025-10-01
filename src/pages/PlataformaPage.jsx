import React, { useEffect, useRef, useState } from "react"
import { FaWhatsapp } from "react-icons/fa6";
import { LuCalculator, LuDownload, LuListChecks, LuWallet } from "react-icons/lu";
import { useLocation } from "react-router-dom"
import SEO from "../components/SEO.jsx"

const SITE_URL = "https://civilespro.com"
const PRIMARY = "#055a27"
const SECONDARY = "#111111ff"

const HERO_ROLES = ["Ingenieros", "Arquitectos", "Maestros de obra"]

const CARD_ITEMS = [
  {
    key: "murodebloques",
    lead: "Cantidades precisas para:",
    title: "Muros en Bloques",
    description:
      "Bloques, mortero y aparejo por cara del muro. Centraliza el cálculo y controla desperdicios.",
    image: "img/bloques.png",
  },
  {
    key: "cielorazoendrywall",
    lead: "Perfiles, placas y tornillos de:",
    title: "Cielo raso en Drywall",
    description:
      "Perfiles, placas, tornillos y masilla, que cambian según el diseño. Todo calculado en segundos.",
    image: "img/cielorazo.png",
  },
  {
    key: "pdf",
    lead: "Entrega y trazabilidad:",
    title: "Exporta un informe por ítem",
    description: "Descarga un reporte claro para enviar a comprar o documentar tu obra.",
    image: "img/informe.png",
  },
  {
    key: "consolidado",
    lead: "Llévalo a números:",
    title: "Crea un Consolidado",
    description:
      "Reúne tus cálculos en un consolidado de obra. Decide con datos claros y todo en un solo lugar.",
    image: "img/consolidado.png",
  },
  {
    key: "presupuesto",
    lead: "Convierte cantidades en valor:",
    title: "Presupuesto y APU",
    description:
      "Genera un presupuesto completo listo para exportar en Excel. Incluye APU con detalles de mano de obra, equipos, transporte e indirectos.",
    image: "img/presupuesto.png",
  },
]

const WORKFLOW_STEPS = [
  {
    icon: <LuCalculator className="h-6 w-6 text-emerald-700" aria-hidden="true" />,
    title: "Calcula en minutos",
    description:
      "Selecciona una actividad, ingresa dimensiones y obtén las cantidades con desperdicios optimizados.",
  },
  {
    icon: <LuListChecks className="h-6 w-6 text-emerald-700" aria-hidden="true" />,
    title: "Controla tus metrados",
    description:
      "Organiza capítulos, frentes de obra y versiones para mantener tu documentación siempre bajo control.",
  },
  {
    icon: <LuWallet className="h-6 w-6 text-emerald-700" aria-hidden="true" />,
    title: "Construye el presupuesto",
    description:
      "Convierte cantidades en APU completos y genera presupuestos que puedes editar en equipo.",
  },
  {
    icon: <LuDownload className="h-6 w-6 text-emerald-700" aria-hidden="true" />,
    title: "Comparte reportes",
    description:
      "Exporta a Excel o PDF y comparte con proveedores, clientes o tu equipo de campo en segundos.",
  },
]

const TESTIMONIALS = [
  {
    name: "Carlos M.",
    role: "Ingeniero civil",
    rating: 5,
    text: "Los APU y el presupuesto me ahorran horas. Antes tardaba una tarde, ahora en 20 minutos tengo la propuesta lista.",
  },
  {
    name: "Laura G.",
    role: "Arquitecta",
    rating: 5,
    text: "Me encanta poder exportar a Excel y ajustar indirectos. Es perfecto para enviar a mi cliente sin retrabajos.",
  },
  {
    name: "José R.",
    role: "Maestro de obra",
    rating: 4,
    text: "Los materiales salen precisos y compro lo justo. Menos desperdicio y mejor control del trabajo.",
  },
  {
    name: "Andrés T.",
    role: "Residente de obra",
    rating: 5,
    text: "El consolidado + Presupuesto es oro. Tengo todo el proyecto organizado y con trazabilidad.",
  },
]

const MONTHLY_FEATURES = [
  "Compatible con Mac.",
  "Compatible con teléfonos.",
  "32 herramientas de cálculo de materiales.",
  "Genera Presupuesto y APU.",
  "Biblioteca de APU y materiales.",
  "No requiere Excel.",
  "Exporta resultados en Excel.",
  "Soporte 24/7.",
]

const ANNUAL_FEATURES = [
  "Todo lo del plan mensual.",
  "Soporte prioritario.",
  "Incluye plantilla de Excel: Control y gestión de formaletas.",
  "Incluye plantilla de Excel: Control de almacén en obra.",
  "Acceso a nuevas herramientas durante el año.",
]

function useTypewriter(words) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") {
      setText(words[index])
      return () => {}
    }

    const current = words[index]
    let i = 0
    let typingId
    let deletingId
    let pauseId

    typingId = window.setInterval(() => {
      i += 1
      setText(current.slice(0, i))
      if (i === current.length) {
        window.clearInterval(typingId)
        pauseId = window.setTimeout(() => {
          deletingId = window.setInterval(() => {
            i -= 1
            setText(current.slice(0, Math.max(i, 0)))
            if (i <= 0) {
              window.clearInterval(deletingId)
              setIndex((prev) => (prev + 1) % words.length)
            }
          }, 100)
        }, 150)
      }
    }, 100)

    return () => {
      window.clearInterval(typingId)
      window.clearInterval(deletingId)
      window.clearTimeout(pauseId)
    }
  }, [index, words])

  return text
}

function Stars({ value }) {
  return (
    <div className="inline-flex items-center" aria-label={`${value} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, starIndex) => (
        <span key={starIndex} className={starIndex < value ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  )
}

function CardsCarousel({ items }) {
  const [active, setActive] = useState(0)
  const scrollerRef = useRef(null)

  useEffect(() => {
    const node = scrollerRef.current
    if (!node) return

    const handleScroll = () => {
      const children = Array.from(node.children)
      const center = node.scrollLeft + node.clientWidth / 2
      const index = children.findIndex((child) => {
        const left = child.offsetLeft
        const right = left + child.clientWidth
        return left <= center && right >= center
      })
      if (index >= 0) setActive(index)
    }

    node.addEventListener("scroll", handleScroll, { passive: true })
    return () => node.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (index) => {
    const node = scrollerRef.current
    if (!node) return
    const child = node.children[index]
    if (!child) return
    child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    setActive(index)
  }

  return (
    <div className="lg:hidden">
      <div className="relative">
        <button
          type="button"
          onClick={() => scrollTo(Math.max(0, active - 1))}
          className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-md border bg-white/90 px-3 py-2 text-lg shadow sm:block"
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollTo(Math.min(items.length - 1, active + 1))}
          className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border bg-white/90 px-3 py-2 text-lg shadow sm:block"
          aria-label="Siguiente"
        >
          ›
        </button>

        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
        >
          {items.map((item) => (
            <article
              key={item.key}
              className="snap-center shrink-0 basis-[88vw] rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"
            >
              <div className="flex h-56 items-center justify-center">
                <img
                  src={import.meta.env.BASE_URL + item.image.replace(/^\//, "")}
                  alt={item.title}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-gray-600">{item.lead}</p>
                <h3 className="text-2xl font-extrabold" style={{ color: PRIMARY }}>
                  {item.title}
                </h3>
                <p className="text-sm text-gray-700">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.key}
            type="button"
            onClick={() => scrollTo(index)}
            className={`h-2 w-2 rounded-full transition ${index === active ? "bg-emerald-700 scale-110" : "bg-gray-300"}`}
            aria-label={`Ir a tarjeta ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = TESTIMONIALS.length

  useEffect(() => {
    if (paused || typeof window === "undefined") return undefined
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % total)
    }, 4500)
    return () => window.clearInterval(id)
  }, [paused, total])

  const average = (TESTIMONIALS.reduce((sum, testimonial) => sum + testimonial.rating, 0) / total).toFixed(1)

  const goTo = (position) => setIndex((position + total) % total)

  return (
    <section className="bg-white py-16">
      <div className="wrap-wide px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <Stars value={5} />
            <span className="rounded bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-700">
              Valoración {average}/5
            </span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold" style={{ color: PRIMARY }}>
            Opiniones verificadas de profesionales
          </h2>
          <p className="mt-2 text-sm text-gray-600">Basado en experiencias reales con Civiles Pro.</p>
        </div>

        <div
          className="relative mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {TESTIMONIALS.map((testimonial) => (
                <article key={testimonial.name} className="w-full shrink-0 px-2 py-8">
                  <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
                    <Stars value={testimonial.rating} />
                    <p className="mt-4 text-gray-800 italic">“{testimonial.text}”</p>
                    <div className="mt-5 font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role} ✅</div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-md border bg-white/90 px-3 py-2 text-lg shadow sm:block"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border bg-white/90 px-3 py-2 text-lg shadow sm:block"
            aria-label="Siguiente"
          >
            ›
          </button>

          <div className="mt-5 flex justify-center gap-2">
            {TESTIMONIALS.map((testimonial, dotIndex) => (
              <button
                key={testimonial.name}
                type="button"
                onClick={() => goTo(dotIndex)}
                className={`h-2.5 w-2.5 rounded-full transition ${dotIndex === index ? "bg-emerald-700 scale-110" : "bg-gray-300"}`}
                aria-label={`Ir al testimonio ${dotIndex + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-700">
          <Stars value={5} />
          <span>
            Valorado por más de <strong>120 profesionales</strong> en Colombia
          </span>
        </div>
      </div>
    </section>
  )
}

function PricingColumn({ title, price, subtitle, helper, previousPrice, savings, features, cta, href, highlight }) {
  return (
    <div
      className={`flex h-full flex-col items-center rounded-3xl border bg-white p-8 text-center shadow-sm ${
        highlight ? "ring-2 ring-emerald-500" : "border-gray-200"
      }`}
    >
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <div className="mt-2 text-3xl font-extrabold text-primary">{price}</div>
      {subtitle ? <div className="text-sm text-gray-600">{subtitle}</div> : null}
      {helper ? <p className="mt-1 text-sm text-gray-700">{helper}</p> : null}
      {previousPrice ? <div className="mt-1 text-sm text-gray-500 line-through">{previousPrice}</div> : null}
      {savings ? (
        <span className="mt-2 inline-block rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
          {savings}
        </span>
      ) : null}

      <ul className="mt-5 space-y-2 text-left text-sm text-gray-700">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={PRIMARY}
              className="mt-0.5 h-4 w-4 flex-none"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span dangerouslySetInnerHTML={{ __html: feature }} />
          </li>
        ))}
      </ul>

      <a
        href={href}
        className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-white"
        style={{ backgroundColor: highlight ? PRIMARY : SECONDARY }}
      >
        {cta}
      </a>
    </div>
  )
}

export default function PlataformaPage() {
  const location = useLocation()
  const canonical = `${SITE_URL}/plataforma`
  const currentUrl = `${SITE_URL}${location.pathname}`
  const typed = useTypewriter(HERO_ROLES)

  return (
    <>
      <SEO
        title="Plataforma Civiles Pro — Calculadora de materiales y APU"
        description="Gestiona materiales, presupuestos y reportes diarios desde una sola plataforma pensada para obra."
        url={currentUrl}
        canonical={canonical}
      />

      <div className="bg-[#f7f9f7]">
        <section className="py-16">
          <div className="wrap-wide px-4">
            <div className="mx-auto max-w-4xl text-center">
              <span className="text-base font-semibold uppercase tracking-wide text-emerald-700">
                Calculadora de materiales + Presupuesto
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
                La herramienta que los
                <span className="block">
                  <span className="inline-block border-b-4 border-gray-900 text-gray-900">
                    {typed || "\u00A0"}
                  </span>
                </span>
                <span className="block text-emerald-700">utilizan para calcular materiales y crear presupuesto de obra.</span>
              </h1>
              <p className="mt-5 text-lg text-gray-700">
                Calculadora de materiales de obra • Presupuesto de obra civil con APU • Exporta a Excel
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
          </div>
        </section>

        <section className="py-16">
          <div className="wrap-wide px-4">
            <div className="mx-auto max-w-3xl text-center text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Puedes usarla para calcular:</span> concreto, ciclópeo, pavimento
                rígido, bordillos, mallas electrosoldadas, muros en bloques, mampostería estructural, muros en concreto, drywall,
                cubiertas en fibrocemento, UPVC, sándwich, standing, zinc, pisos en porcelanato, cerámicas, acabados de pintura y
                yeso, losas de concreto armado, placa fácil, losacero, losa aligerada… <strong>y presupuesto.</strong>
              </p>
            </div>

            <div className="mt-12 hidden gap-6 lg:grid lg:grid-cols-2 xl:grid-cols-3">
              {CARD_ITEMS.map((item) => (
                <article key={item.key} className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                  <div className="flex h-56 items-center justify-center">
                    <img
                      src={import.meta.env.BASE_URL + item.image.replace(/^\//, "")}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-600">{item.lead}</p>
                    <h3 className="text-2xl font-extrabold" style={{ color: PRIMARY }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-700">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <CardsCarousel items={CARD_ITEMS} />
          </div>
        </section>

        <section className="py-16">
          <div className="wrap-wide px-4">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-center text-3xl font-extrabold text-gray-900 md:text-4xl">
                Controla tu proyecto de principio a fin
              </h2>
              <p className="mt-3 text-center text-gray-600">
                Todo sucede en la misma plataforma: calcula, consolida, presupuesta y entrega reportes con la misma exactitud.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {WORKFLOW_STEPS.map((step) => (
                  <article
                    key={step.title}
                    className="group relative rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                      {step.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-sm text-gray-700">{step.description}</p>
                    <span className="pointer-events-none absolute inset-x-6 bottom-0 h-0.5 origin-center scale-x-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="planes" className="py-16">
          <div className="wrap-wide px-4">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-3xl font-bold leading-tight text-gray-900">
                Ves los bultos, la arena, la grava, las varillas… pero lo que no ves son los errores. Aquí todo está medido, ajustado
                y listo para construir.
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <img
                src={import.meta.env.BASE_URL + "img/materiales.png"}
                alt="Materiales (cemento, arena, gravilla, acero, etc.)"
                className="h-72 w-auto max-w-full object-contain"
                loading="lazy"
              />
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <PricingColumn
                title="Plan mensual"
                price="$20.000 COP"
                subtitle="Suscripción mensual"
                helper="Cancela cuando quieras"
                features={MONTHLY_FEATURES}
                cta="Suscríbete"
                href="https://app.civilespro.com/register"
              />
              <PricingColumn
                title="Plan anual"
                price="$150.000 COP"
                subtitle="Suscripción anual"
                helper="40% de descuento frente al plan mensual"
                previousPrice="$240.000 COP"
                savings="Ahorra $90.000 COP"
                features={ANNUAL_FEATURES}
                cta="Comprar"
                href="https://checkout.wompi.co/l/so1kfv"
                highlight
              />
            </div>

            <p className="mt-6 text-center text-sm text-gray-700">
              <span className="font-medium">Ambas incluyen tutorial.</span> Elige la que prefieras. Sin restricciones.
            </p>

            <div className="mt-6 flex justify-center">
              <img
                src={import.meta.env.BASE_URL + "img/mediosdepago.png"}
                alt="Medios de pago"
                className="h-28 w-auto max-w-full object-contain"
                loading="lazy"
              />
            </div>

            <div className="mt-8 space-y-2 text-center text-sm font-semibold text-gray-800">
              <p>Exporta cada cálculo en PDF (ordenado por ítem) para cotizar y documentar.</p>
              <p>Crea un Presupuesto con APU en minutos.</p>
            </div>
          </div>
        </section>

        <TestimonialsSection />

        <section className="py-16">
          <div className="wrap-wide px-4">
            <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-sm">
              <h2 className="text-3xl font-extrabold text-gray-900">¿Listo para probarla?</h2>
              <p className="mt-3 text-gray-700">
                Solicita una demo personalizada y te mostramos cómo sacar el máximo provecho a la calculadora de materiales y los reportes diarios.
              </p>
              <a
                href="/contacto"
                className="btn-outline mt-6 inline-flex items-center justify-center"
                style={{ borderColor: SECONDARY, color: SECONDARY }}
              >
                Agendar demo
              </a>
              <div className="mt-8 flex justify-center">
                <a
                  href="https://wa.me/573127437848?text=Hola%20quiero%20activar%20Civiles%20Pro&utm_source=landing&utm_medium=cta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white"
                  style={{ backgroundColor: SECONDARY }}
                >
                  <FaWhatsapp aria-hidden="true" />
                  Contactar a un asesor
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
