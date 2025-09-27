export default function ImageFrame({ children, className = "" }) {
  return (
    <div className={`aspect-video w-full overflow-hidden rounded-xl bg-slate-100 ${className}`.trim()}>
      {children}
    </div>
  )
}
