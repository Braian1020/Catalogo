import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import RopaCategoryPage from './pages/RopaCategoryPage';
import SharedModals from './components/SharedModals';

export default function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Inicio */}
        <Route path="/" element={<CatalogPage />} />

        {/* Categoría Principal: Ropa */}
        <Route path="/ropa" element={<RopaCategoryPage />} />

        {/* Subcategoría: Shorts (Todos, Clásicos, Deportivos) */}
        <Route path="/ropa/shorts" element={<CatalogPage initialCategoria="todos" />} />
        <Route path="/ropa/shorts/clasicos" element={<CatalogPage initialCategoria="clasicos" />} />
        <Route path="/ropa/shorts/deportivos" element={<CatalogPage initialCategoria="deportivos" />} />

        {/* Fichas individuales de producto (Soporta ruta jerárquica y directa) */}
        <Route path="/ropa/shorts/:slug" element={<ProductDetailPage />} />
        <Route path="/producto/:slug" element={<ProductDetailPage />} />

        {/* Redirecciones de compatibilidad */}
        <Route path="/catalogo" element={<Navigate to="/ropa/shorts" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SharedModals />
    </CartProvider>
  );
}
