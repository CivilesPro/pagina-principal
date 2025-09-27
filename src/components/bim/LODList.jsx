import { lodItems } from "../../data/BimDeepSections"
import CollapseItem from "../ui/CollapseItem"
import ImageCarousel from "../ui/ImageCarousel"

const WHATS_NUMBER = "573127437848"
const mkWhatsapp = (msg) => `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(msg)}`

const BrainBadge = () => (
  <span
    aria-hidden="true"
    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-lg leading-none text-emerald-700"
  >
    🧠
  </span>
)

export default function LODList() {
  return (
    <div className="space-y-4 md:space-y-5">
      {lodItems.map((item) => (
        <CollapseItem
          key={item.id}
          title={item.title}
          subtitle={item.short}
          level="main"
          leadingIcon={<BrainBadge />}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="space-y-3 text-sm leading-6 text-slate-600 md:text-base lg:col-span-7">
              <p>{item.desc}</p>
              <a
                href={mkWhatsapp(item.whatsMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-700"
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
  )
}
