import { useState, useEffect } from "react";

export default function SectionToolbar({
  onSearch,
  searchPlaceholder = "Buscar…",
  leftChips = [],
  rightChips = [],
  showExpandToggle = false,
  expanded = false,
  onToggleExpand,
  className = "",
}) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (onSearch) onSearch(q);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${className}`}>
      {/* IZQUIERDA: chips + buscador */}
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {leftChips.map((ch) => (
          <button
            key={ch.id}
            type="button"
            onClick={ch.onClick}
            className={`px-2 py-1 rounded-full border text-xs transition
              ${ch.active ? "bg-slate-800 text-white border-slate-800" : "hover:bg-slate-50"}`}
          >
            {ch.label}
          </button>
        ))}
        <div className="relative ml-auto md:ml-4 w-full md:w-64">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* DERECHA: chips y expandir/colapsar */}
      <div className="flex items-center gap-2">
        {rightChips.map((ch) => (
          <button
            key={ch.id}
            type="button"
            onClick={ch.onClick}
            className={`px-2 py-1 rounded-full border text-xs transition
              ${ch.active ? "bg-slate-800 text-white border-slate-800" : "hover:bg-slate-50"}`}
          >
            {ch.label}
          </button>
        ))}
        {showExpandToggle && (
          <button
            type="button"
            onClick={onToggleExpand}
            className="px-2 py-1 rounded-full border text-xs hover:bg-slate-50"
            aria-pressed={expanded}
          >
            {expanded ? "Colapsar todo" : "Expandir todo"}
          </button>
        )}
      </div>
    </div>
  );
}
