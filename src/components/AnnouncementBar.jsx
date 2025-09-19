import React from "react"

const MESSAGE =
  "Ingenieros, arquitectos y maestros de obra compartiendo recursos, plantillas y herramientas para que tu obra sea más rápida y confiable."

export default function AnnouncementBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] bg-emerald-900 text-white">
      <div className="group relative h-9 md:h-10 overflow-hidden">
        <div className="announcement-track flex w-max items-center gap-12 whitespace-nowrap px-6 text-sm md:text-base group-hover:[animation-play-state:paused]">
          {[0, 1].map((index) => (
            <p key={index} className="flex items-center gap-3">
              <span className="font-semibold">Todo lo que un proyecto necesita, en un solo lugar.</span>
              <span>{MESSAGE}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
