import CollapseItem from "../ui/CollapseItem"
import ImageCarousel from "../ui/ImageCarousel"
import { lodItems, lodSection } from "../../data/BimDeepSections"

const WHATS_NUMBER = "573127437848"
const mkWhatsapp = (msg) => `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(msg)}`

function BrainBadge() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-lg leading-none text-emerald-700">
      🧠
    </span>
  )
}

export default function LODSection() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
      <header className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">{lodSection.title}</h3>
        <p className="text-sm text-slate-600 md:text-base">{lodSection.summary}</p>
      </header>

      <div className="mt-6 space-y-4 md:space-y-5">
        {lodItems.map((item) => (
          <CollapseItem
            key={item.id}
            title={item.title}
            subtitle={item.short}
            leadingIcon={<BrainBadge />}
            level="main"
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7">
                <p className="text-sm leading-6 text-slate-600 md:text-base">{item.desc}</p>
                <a
                  href={mkWhatsapp(item.whatsMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-700"
                >
                  ¿Este nivel encaja con tu proyecto? Escríbenos por WhatsApp
                </a>
              </div>
              <div className="lg:col-span-5">
                <ImageCarousel images={item.images} />
              </div>
            </div>
          </CollapseItem>
        ))}
      </div>
    </section>
  )
}
