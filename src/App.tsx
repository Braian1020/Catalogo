import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';
import SharedModals from './components/SharedModals';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import RopaCategoryPage from './pages/RopaCategoryPage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import EntregasPage from './pages/EntregasPage';
import NosotrosPage from './pages/NosotrosPage';

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Routes>
        {/* 1. Página de Inicio (Presentación de POOL STORE) */}
        <Route path="/" element={<HomePage />} />

        {/* 2. Catálogo Central de Productos */}
        <Route path="/productos" element={<ProductsPage />} />

        {/* 3. Categoría Principal: Ropa */}
        <Route path="/ropa" element={<RopaCategoryPage />} />

        {/* 4. Subcategoría: Shorts (Colección completa de 47 modelos) */}
        <Route path="/ropa/shorts" element={<CatalogPage initialCategoria="todos" />} />
        <Route path="/ropa/shorts/clasicos" element={<CatalogPage initialCategoria="clasicos" />} />
        <Route path="/ropa/shorts/deportivos" element={<CatalogPage initialCategoria="deportivos" />} />

        {/* 5. Fichas Individuales de Producto (URLs compartibles y permanentes) */}
        <Route path="/ropa/shorts/:slug" element={<ProductDetailPage />} />
        <Route path="/producto/:slug" element={<ProductDetailPage />} />

        {/* 6. Páginas Informativas */}
        <Route path="/entregas" element={<EntregasPage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />

        {/* 7. Redirecciones de Compatibilidad */}
        <Route path="/catalogo" element={<Navigate to="/ropa/shorts" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SharedModals />
    </CartProvider>
  );
}
