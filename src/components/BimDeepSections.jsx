import ImageFrame from "./ui/ImageFrame"
import LODList from "./bim/LODList"
import ProjectsList from "./bim/ProjectsList"
import { deepSectionsIntro, pebSection, lodSection, projectsSection } from "../data/BimDeepSections"

function PebSectionCard() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
      <header className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">{pebSection.title}</h3>
        <p className="text-sm text-slate-600 md:text-base">{pebSection.summary}</p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-3 text-sm text-slate-700 md:text-base lg:col-span-7">
          <ul className="space-y-3">
            {pebSection.items.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5">
          <ImageFrame>
            <img
              src={pebSection.image}
              alt={pebSection.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </ImageFrame>
        </div>
      </div>
    </section>
  )
}

function LODSectionCard() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
      <header className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">{lodSection.title}</h3>
        <p className="text-sm text-slate-600 md:text-base">{lodSection.summary}</p>
      </header>

      <div className="mt-6">
        <LODList />
      </div>
    </section>
  )
}

function ProjectsSectionCard() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
      <header className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">{projectsSection.title}</h3>
        <p className="text-sm text-slate-600 md:text-base">{projectsSection.summary}</p>
      </header>

      <div className="mt-6">
        <ProjectsList />
      </div>
    </section>
  )
}

export default function BimDeepSections() {
  return (
    <div className="space-y-8 md:space-y-10">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{deepSectionsIntro.title}</h2>
        <p className="mt-3 text-sm text-slate-600 md:text-base">{deepSectionsIntro.description}</p>
      </div>

      <PebSectionCard />
      <LODSectionCard />
      <ProjectsSectionCard />
    </div>
  )
}
