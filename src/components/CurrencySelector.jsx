import * as React from "react";
import { SUPPORTED_CURRENCIES } from "../data/exchangeRates.js";

export default function CurrencySelector({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2 md:items-end">
      <span className="text-sm font-medium text-gray-600">Moneda</span>
      <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-gray-200 bg-white p-1 shadow-sm snap-x">
        {SUPPORTED_CURRENCIES.map((code) => {
          const active = code === value;
          return (
            <button
              key={code}
              type="button"
              onClick={() => onChange(code)}
              className={`snap-center rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                active ? "bg-emerald-600 text-white shadow" : "text-gray-700 hover:bg-emerald-50"
              }`}
            >
              {code}
            </button>
          );
        })}
      </div>
    </div>
  );
}
