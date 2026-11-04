import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';
import SharedModals from './components/SharedModals';

// Critical initial page (direct load without waterfall)
import HomePage from './pages/HomePage';

// Lazy-loaded secondary pages
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const RopaCategoryPage = lazy(() => import('./pages/RopaCategoryPage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const EntregasPage = lazy(() => import('./pages/EntregasPage'));
const NosotrosPage = lazy(() => import('./pages/NosotrosPage'));

const PageFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center py-20">
    <div className="w-7 h-7 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
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
      </Suspense>
      <SharedModals />
    </CartProvider>
  );
}
