import { useState } from 'react';

export default function CollapseItem({ title, subtitle, children, defaultOpen = false, level = 'main' }) {
  const [open, setOpen] = useState(defaultOpen);
  const styles =
    level === 'sub'
      ? 'rounded-lg border border-slate-200 bg-white'
      : 'rounded-xl border border-slate-200/70 bg-slate-50';
  return (
    <div className={styles}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-3 px-3"
      >
        <div className="text-left">
          <div className="text-slate-800 font-semibold">{title}</div>
          {subtitle && <div className="text-slate-500 text-sm">{subtitle}</div>}
        </div>
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}
