import React, { useEffect, useMemo } from "react"
import { useLocation } from "react-router-dom"

const formatPlanLabel = (planRaw) => {
  if (!planRaw) return "desconocido"
  const normalized = planRaw.replace(/[-_]+/g, " ")
  return normalized
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function Gracias() {
  const location = useLocation()

  const { transactionId, planLabel } = useMemo(() => {
    const search = new URLSearchParams(location.search)
    const txId =
      search.get("transactionId") || search.get("id") || search.get("reference") || ""
    const planParam = search.get("plan") || ""
    return {
      transactionId: txId,
      planLabel: formatPlanLabel(planParam),
    }
  }, [location.search])

  useEffect(() => {
    const planText = planLabel || "desconocido"
    const codeText = transactionId || "sin código"
    const message = `Hola CivilesPro, ya pagué. Mi plan es ${planText}. Código Wompi: ${codeText}`
    const whatsappUrl = `https://wa.me/573127437848?text=${encodeURIComponent(message)}`
    window.location.replace(whatsappUrl)
  }, [planLabel, transactionId])

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></span>
        <p className="text-lg font-medium text-gray-700">Redirigiendo a activación manual…</p>
      </div>
    </div>
  )
}
