export default function MediaWithText({ media, children, reverse = false, className = "" }) {
  const textOrder = reverse ? "md:order-2" : "md:order-1"
  const mediaOrder = reverse ? "md:order-1" : "md:order-2"

  return (
    <div className={`grid gap-6 md:grid-cols-12 md:gap-8 ${className}`.trim()}>
      <div className={`md:col-span-7 ${textOrder}`}>
        {children}
      </div>
      <div className={`md:col-span-5 ${mediaOrder}`}>
        {media}
      </div>
    </div>
  )
}
