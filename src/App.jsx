import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Header fijo (h-20): compensamos con pt-20 */}
      <main className="flex-1 pt-20 md:pt-24">
        {/* ⛔️ sin wrapper global para permitir secciones full-bleed */}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
