import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCardItem from '../components/ProductCardItem';
import { PRODUCTOS, SHORTS_POLIESTER, SHORTS_WIN } from '../data/productos';
import { Producto } from '../types';
import {
  Search,
  SlidersHorizontal,
  Shirt,
  Sparkles,
  ArrowUpDown,
  X,
  PackageOpen,
  ChevronRight,
  Layers,
} from 'lucide-react';

type TipoFiltro = 'todos' | 'clasicos' | 'deportivos';
type Ordenamiento = 'destacados' | 'precio-asc' | 'precio-desc' | 'nombre';

export default function ProductsPage() {
  const [filtroTipo, setFiltroTipo] = useState<TipoFiltro>('todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [orden, setOrden] = useState<Ordenamiento>('destacados');

  useEffect(() => {
    document.title = 'Todos los Productos | POOL STORE Catálogo Oficial';
    const description =
      'Explora el catálogo completo de POOL STORE: Shorts Clásicos Polistrech en 12 colores y Shorts Deportivos Win de clubes y selecciones. Envíos a todo el Perú.';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Todos los Productos | POOL STORE');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, []);

  // Filtrado reactivo de productos
  const productosFiltrados = useMemo(() => {
    let prods = [...PRODUCTOS];

    // Filtro por tipo/colección
    if (filtroTipo === 'clasicos') {
      prods = prods.filter((p) => p.tipoTela === 'poliester');
    } else if (filtroTipo === 'deportivos') {
      prods = prods.filter((p) => p.tipoTela === 'win');
    }

    // Filtro por búsqueda
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      prods = prods.filter((p) => {
        const nombre = p.nombre.toLowerCase();
        const colorShort = (p.colorShort || '').toLowerCase();
        const colorRayas = (p.colorRayas || '').toLowerCase();
        const modelo = (p.modelo || '').toLowerCase();
        return (
          nombre.includes(q) ||
          colorShort.includes(q) ||
          colorRayas.includes(q) ||
          modelo.includes(q)
        );
      });
    }

    // Ordenamiento
    switch (orden) {
      case 'destacados':
        prods.sort((a, b) => {
          if (a.destacado && !b.destacado) return -1;
          if (!a.destacado && b.destacado) return 1;
          return a.nombre.localeCompare(b.nombre);
        });
        break;
      case 'precio-asc':
        prods.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        prods.sort((a, b) => b.precio - a.precio);
        break;
      case 'nombre':
        prods.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
    }

    return prods;
  }, [filtroTipo, busqueda, orden]);

  const limpiarFiltros = () => {
    setFiltroTipo('todos');
    setBusqueda('');
    setOrden('destacados');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <Breadcrumbs
        items={[{ label: 'Productos' }]}
        showBackButton
        backFallbackPath="/"
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Todos los productos
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Catálogo completo de POOL STORE con fotografías reales, tallas y opciones de compra inmediata.
            </p>
          </div>

          {/* Category Navigation Tabs */}
          <div className="flex items-center flex-wrap gap-2">
            <Link
              to="/productos"
              className="px-3.5 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Todos ({PRODUCTOS.length})
            </Link>
            <Link
              to="/ropa"
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors"
            >
              Ropa
            </Link>
            <Link
              to="/ropa/shorts/clasicos"
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors"
            >
              Shorts Clásicos ({SHORTS_POLIESTER.length})
            </Link>
            <Link
              to="/ropa/shorts/deportivos"
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors"
            >
              Shorts Deportivos ({SHORTS_WIN.length})
            </Link>
          </div>
        </div>

        {/* Enhanced Search & Sort Control Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, color, rayas o equipo (ej. Azul noche, Barcelona, Argentina)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label="Borrar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter by collection & Sort */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as TipoFiltro)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-950 cursor-pointer"
                aria-label="Filtrar por colección"
              >
                <option value="todos">Todas las colecciones ({PRODUCTOS.length})</option>
                <option value="clasicos">Shorts Clásicos ({SHORTS_POLIESTER.length})</option>
                <option value="deportivos">Shorts Deportivos ({SHORTS_WIN.length})</option>
              </select>

              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value as Ordenamiento)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-950 cursor-pointer"
                aria-label="Ordenar productos"
              >
                <option value="destacados">Destacados</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre (A - Z)</option>
              </select>

              {(busqueda || filtroTipo !== 'todos' || orden !== 'destacados') && (
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="px-2.5 py-2 text-xs text-slate-600 hover:text-slate-950 font-bold underline cursor-pointer shrink-0"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Mostrando <strong>{productosFiltrados.length}</strong> de <strong>{PRODUCTOS.length}</strong> productos
          </span>
          {busqueda && (
            <span>
              Resultados para &ldquo;<strong className="text-slate-900">{busqueda}</strong>&rdquo;
            </span>
          )}
        </div>

        {/* Product Grid */}
        {productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {productosFiltrados.map((prod, index) => (
              <ProductCardItem
                key={prod.id}
                producto={prod}
                priority={index < 6}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <PackageOpen className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">No encontramos coincidencias</h3>
              <p className="text-xs text-slate-500 mt-1">
                No hay productos que coincidan con &ldquo;{busqueda}&rdquo; en esta selección. Intenta con otro término o limpia los filtros.
              </p>
            </div>
            <button
              type="button"
              onClick={limpiarFiltros}
              className="px-6 py-2.5 bg-slate-950 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Ver todos los productos
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
