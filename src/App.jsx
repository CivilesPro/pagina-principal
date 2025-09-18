import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Header fijo (h-16): compensamos con pt-16 */}
      <main className="flex-1 pt-16 md:pt-20">
        {/* ⛔️ sin wrapper global para permitir secciones full-bleed */}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
