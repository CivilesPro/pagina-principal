import CollapseItem from "./ui/CollapseItem"
import MediaWithText from "./ui/MediaWithText"
import LODSection from "./bim/LODSection"
import ProjectsSection from "./bim/ProjectsSection"
import { deepSectionsIntro, pebSection } from "../data/BimDeepSections"

function PebSectionCard() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <CollapseItem title={pebSection.title} subtitle={pebSection.summary} defaultOpen>
        <MediaWithText
          media={
            <img
              src={pebSection.image}
              alt={pebSection.title}
              loading="lazy"
              className="h-full w-full rounded-xl object-cover"
            />
          }
        >
          <ul className="space-y-3 text-sm text-slate-700 md:text-base">
            {pebSection.items.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-slate-400"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </MediaWithText>
      </CollapseItem>
    </section>
  )
}

export default function BimDeepSections() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{deepSectionsIntro.title}</h2>
          <p className="mt-3 text-gray-600">{deepSectionsIntro.description}</p>
        </div>

        <div className="mt-10 space-y-6 md:space-y-8">
          <PebSectionCard />
          <LODSection />
          <ProjectsSection />
        </div>
      </div>
    </section>
  )
}
