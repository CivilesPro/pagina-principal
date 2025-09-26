import { EXCHANGE } from "../data/exchangeRates.js"

const LOCALES = {
  COP: "es-CO",
  USD: "en-US",
  MXN: "es-MX",
  ARS: "es-AR",
  PEN: "es-PE",
}

export function formatPrice(copValue, currency) {
  if (copValue == null) {
    return "Consultar"
  }

  const rate = EXCHANGE.rates[currency] ?? 1
  const value = copValue * rate
  const locale = LOCALES[currency] ?? "es-CO"
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "COP" ? 0 : 2,
  })

  return formatter.format(value)
}
