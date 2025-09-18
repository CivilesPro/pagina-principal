import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./index.css"
import App from "./App.jsx"
import Home from "./pages/Home.jsx"
import Productos from "./pages/Productos.jsx"
import Cursos from "./pages/Cursos.jsx"
import Certificados from "./pages/Certificados.jsx"
import Plataforma from "./pages/Plataforma.jsx"
import Blog from "./pages/Blog.jsx"
import Manuales from "./pages/Manuales.jsx"
import Servicios from "./pages/Servicios.jsx"
import Planes from "./pages/Planes.jsx"
import Entrar from "./pages/Entrar.jsx"
import { HelmetProvider } from "react-helmet-async"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/certificados" element={<Certificados />} />
            <Route path="/plataforma" element={<Plataforma />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/manuales" element={<Manuales />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/entrar" element={<Entrar />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
