import { EXCHANGE } from "../data/exchangeRates.js"

const LOCALES = {
  COP: "es-CO",
  USD: "en-US",
  MXN: "es-MX",
  ARS: "es-AR",
  PEN: "es-PE",
}

export function formatPrice(amountCop, currency = "COP", opts = {}) {
  const { withCode = true, locale: forcedLocale } = opts

  if (amountCop == null) {
    return withCode ? `— ${currency}` : "—"
  }

  const rate = EXCHANGE.rates?.[currency] ?? 1
  const converted = amountCop * rate
  const locale = forcedLocale || LOCALES[currency] || "es-CO"
  const fractionDigits = currency === "USD" ? 2 : 0

  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(converted)

  return withCode ? `${formatted} ${currency}` : formatted
}
