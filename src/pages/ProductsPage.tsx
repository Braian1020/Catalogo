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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold mb-2">
              <Shirt className="w-3.5 h-3.5 text-emerald-400" />
              <span>Catálogo completo activo</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Todos nuestros productos
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Explora todas las opciones disponibles en POOL STORE con precios, fotos y tallas reales.
            </p>
          </div>

          {/* Category Shortcut Link */}
          <Link
            to="/ropa"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors shadow-xs"
          >
            <span>Ver por Categoría Ropa</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>

        {/* Promotion Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Promociones por cantidad aplicadas</p>
              <p className="text-xs text-slate-300">
                1 short por S/ 25 · 3 shorts por S/ 69 · 12 shorts por S/ 240 (Docena a S/ 20 c/u)
              </p>
            </div>
          </div>
          <Link
            to="/ropa/shorts"
            className="px-4 py-2 bg-white text-slate-950 hover:bg-slate-100 rounded-xl text-xs font-black transition-colors shrink-0"
          >
            Ver Colección Shorts
          </Link>
        </div>

        {/* Filters & Search Control Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por color, rayas, equipo (ej. Azul noche, Barcelona, Argentina)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label="Borrar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Ordenar:</span>
              </span>
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value as Ordenamiento)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-950 cursor-pointer"
              >
                <option value="destacados">Destacados primero</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Colección:</span>
            </span>
            <button
              type="button"
              onClick={() => setFiltroTipo('todos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filtroTipo === 'todos'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({PRODUCTOS.length})
            </button>
            <button
              type="button"
              onClick={() => setFiltroTipo('clasicos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filtroTipo === 'clasicos'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Shorts Clásicos ({SHORTS_POLIESTER.length})
            </button>
            <button
              type="button"
              onClick={() => setFiltroTipo('deportivos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filtroTipo === 'deportivos'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Shorts Deportivos Win ({SHORTS_WIN.length})
            </button>

            {(busqueda || filtroTipo !== 'todos' || orden !== 'destacados') && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="ml-auto text-xs text-slate-500 hover:text-slate-900 font-bold underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
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
