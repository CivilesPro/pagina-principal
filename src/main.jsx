import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./index.css"
import App from "./App.jsx"
import ProductosPage from "./pages/ProductosPage.jsx"
import ModeladoBIMPage from "./pages/ModeladoBIMPage.jsx"
import CursosCertificadosPage from "./pages/CursosCertificadosPage.jsx"
import PlataformaPage from "./pages/PlataformaPage.jsx"
import BlogPage from "./pages/BlogPage.jsx"
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
            <Route path="/" element={<ProductosPage />} />
            <Route path="/productos" element={<Navigate to="/" replace />} />
            <Route path="/modelado-bim" element={<ModeladoBIMPage />} />
            <Route path="/cursos" element={<Navigate to="/cursos-certificados" replace />} />
            <Route path="/certificados" element={<Navigate to="/cursos-certificados" replace />} />
            <Route path="/cursos-certificados" element={<CursosCertificadosPage />} />
            <Route path="/plataforma" element={<PlataformaPage />} />
            <Route path="/calculadora-de-materiales" element={<PlataformaPage />} />
            <Route path="/manual-de-uso" element={<Navigate to="/blog?cat=manual" replace />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/entrar" element={<Entrar />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
