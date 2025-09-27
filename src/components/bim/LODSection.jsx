import CollapseItem from "../ui/CollapseItem"
import ImageCarousel from "../ui/ImageCarousel"
import MediaWithText from "../ui/MediaWithText"
import { lodItems, lodSection } from "../../data/BimDeepSections"

const WHATS_NUMBER = "57XXXXXXXXXX"

function BrainIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 3.5A3.5 3.5 0 0 0 5 7v2.25c0 .414-.336.75-.75.75h-.5A1.75 1.75 0 0 0 2 11.75v.5c0 .966.784 1.75 1.75 1.75H5" />
      <path d="M5 14v.75A3.25 3.25 0 0 0 8.25 18H9" />
      <path d="M15.5 3.5A3.5 3.5 0 0 1 19 7v2.25c0 .414.336.75.75.75h.5A1.75 1.75 0 0 1 22 11.75v.5A1.75 1.75 0 0 1 20.25 14H19" />
      <path d="M19 14v.75A3.25 3.25 0 0 1 15.75 18H15" />
      <path d="M9 6.75A2.25 2.25 0 0 1 11.25 4.5H12a2.5 2.5 0 0 1 2.5 2.5V7" />
      <path d="M9 10.5A2.5 2.5 0 0 0 11.5 13v.5A2.5 2.5 0 0 1 9 16" />
      <path d="M15 6.75A2.25 2.25 0 0 0 12.75 4.5H12a2.5 2.5 0 0 0-2.5 2.5V7" />
      <path d="M15 10.5A2.5 2.5 0 0 1 12.5 13v.5A2.5 2.5 0 0 0 15 16" />
    </svg>
  )
}

export default function LODSection() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <header>
        <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">{lodSection.title}</h3>
        <p className="mt-2 text-sm text-slate-600 md:text-base">{lodSection.summary}</p>
      </header>
      <div className="mt-6 space-y-4 md:space-y-5">
        {lodItems.map((item) => (
          <CollapseItem
            key={item.id}
            title={item.title}
            subtitle={item.short}
            leadingIcon={<BrainIcon />}
          >
            <MediaWithText
              media={<ImageCarousel images={item.images} className="mt-4 md:mt-0" />}
            >
              <div className="flex flex-col gap-4">
                <p className="text-slate-600 text-sm leading-6 md:text-base">{item.desc}</p>
                <a
                  href={`https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(item.whatsMsg)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-700"
                >
                  ¿Este nivel encaja con tu proyecto? Escríbenos por WhatsApp
                </a>
              </div>
            </MediaWithText>
          </CollapseItem>
        ))}
      </div>
    </section>
  )
}
