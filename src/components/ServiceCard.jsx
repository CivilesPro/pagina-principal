import React from "react"

function DefaultBulletIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-emerald-600"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function ServiceCard({ title, description, items = [], bulletIcon: BulletIcon = DefaultBulletIcon }) {
  return (
    <article className="h-full rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          {description && <p className="mt-2 text-gray-600">{description}</p>}
        </div>

        {items.length > 0 && (
          <ul className="space-y-3 text-gray-700">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5">
                  <BulletIcon />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
