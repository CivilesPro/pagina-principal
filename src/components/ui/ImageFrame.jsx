export default function ImageFrame({ children, className = '' }) {
  return <div className={`aspect-video rounded-xl overflow-hidden bg-slate-100 ${className}`}>{children}</div>;
}
