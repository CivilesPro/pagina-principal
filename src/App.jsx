import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import AnnouncementBar from "./components/AnnouncementBar"

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      {/* Header fijo + announcement bar: compensamos con padding superior */}
      <main className="flex-1 pt-[120px] md:pt-[136px]">
        {/* ⛔️ sin wrapper global para permitir secciones full-bleed */}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
