import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCardItem from '../components/ProductCardItem';
import { PRODUCTOS, SHORTS_POLIESTER, SHORTS_WIN } from '../data/productos';
import { getWhatsAppUrl } from '../utils/whatsapp';
import {
  Search,
  Shirt,
  Sparkles,
  ArrowRight,
  X,
  PackageOpen,
  CheckCircle2,
  Headphones,
  Info,
} from 'lucide-react';

type TipoFiltro = 'todos' | 'clasicos' | 'deportivos';
type Ordenamiento = 'destacados' | 'precio-asc' | 'precio-desc' | 'nombre';

export default function ProductsPage() {
  const [filtroTipo, setFiltroTipo] = useState<TipoFiltro>('todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [orden, setOrden] = useState<Ordenamiento>('destacados');

  useEffect(() => {
    document.title = 'Productos | POOL STORE Chiclayo';
    const description =
      'Catálogo de productos de POOL STORE. Selecciona Shorts Clásicos o Shorts Deportivos. Por el momento solo disponemos de estas prendas en tienda.';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Productos | POOL STORE');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, []);

  // Filtrado reactivo de productos
  const productosFiltrados = useMemo(() => {
    let prods = [...PRODUCTOS];

    if (filtroTipo === 'clasicos') {
      prods = prods.filter((p) => p.tipoTela === 'poliester');
    } else if (filtroTipo === 'deportivos') {
      prods = prods.filter((p) => p.tipoTela === 'win');
    }

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

  const seleccionarTipoYScroll = (tipo: TipoFiltro) => {
    setFiltroTipo(tipo);
    const el = document.getElementById('grid-productos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const limpiarFiltros = () => {
    setFiltroTipo('todos');
    setBusqueda('');
    setOrden('destacados');
  };

  const muestraClasico =
    PRODUCTOS.find((p) => p.colorShort === 'Negro' && p.colorRayas === 'Blancas') ||
    SHORTS_POLIESTER[0];
  const muestraDeportivo =
    SHORTS_WIN.find((p) => p.id === 'win-real-madrid') || SHORTS_WIN[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <Breadcrumbs
        items={[{ label: 'Productos' }]}
        showBackButton
        backFallbackPath="/"
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-8">
        
        {/* 1. Header de la página Productos */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Productos
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Catálogo oficial de POOL STORE Chiclayo. Compra rápida por WhatsApp y entregas coordinadas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs">
              {PRODUCTOS.length} Prendas disponibles
            </span>
          </div>
        </div>

        {/* 2. AVISO: SOLO TENEMOS ESTO POR EL MOMENTO + CONSULTA CON SOPORTE */}
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-amber-800" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xs sm:text-sm font-black text-amber-950">
                Aviso: Por el momento solo tenemos estos productos disponibles
              </h2>
              <p className="text-xs text-amber-900/80 leading-relaxed max-w-3xl">
                Actualmente en tienda disponemos exclusivamente de <strong>Shorts Clásicos</strong> y <strong>Shorts Deportivos</strong>. Si buscas alguna talla especial, pedidos por mayor o deseas consultar por próximos ingresos, puedes comunicarte directamente con soporte.
              </p>
            </div>
          </div>

          <a
            href={getWhatsAppUrl('¡Hola POOL STORE! Quisiera consultar con soporte sobre la disponibilidad de productos.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-950 hover:bg-black text-white font-black text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            title="Consultar con soporte por WhatsApp"
          >
            <Headphones className="w-4 h-4 text-emerald-400" />
            <span>Consultar con soporte</span>
          </a>
        </div>

        {/* 3. CATEGORÍA PRINCIPAL: ROPA Y SELECCIÓN DE SHORTS */}
        <section aria-labelledby="categoria-ropa-heading" className="space-y-6">
          {/* Banner de Categoría Ropa */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <Shirt className="w-3.5 h-3.5" />
                  <span>Categoría Principal</span>
                </div>
                <h2 id="categoria-ropa-heading" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Categoría: Ropa
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Prendas deportivas y urbanas de alta calidad con <strong>bolsillos laterales con cierre reforzado</strong> y pretina ajustable. Selecciona directamente entre <strong>Shorts Clásicos</strong> o <strong>Shorts Deportivos</strong> para ver sus modelos y promociones activas.
                </p>
              </div>

              <Link
                to="/ropa"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-slate-100 transition-colors shrink-0 shadow-sm self-start md:self-auto cursor-pointer"
              >
                <span>Explorar categoría Ropa</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </Link>
            </div>
          </div>

          {/* Tarjetas directas para seleccionar cada tipo de shorts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SELECCIONAR: SHORTS CLÁSICOS */}
            <div className="bg-white rounded-3xl border-2 border-slate-900 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-950 text-white font-black text-xs uppercase tracking-wider">
                    Shorts Clásicos
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {SHORTS_POLIESTER.length} Modelos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5 aspect-square bg-slate-50 rounded-2xl p-3 flex items-center justify-center border border-slate-200/80 overflow-hidden">
                    <img
                      src={muestraClasico?.imagen}
                      alt="Shorts Clásicos"
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                  </div>
                  <div className="sm:col-span-7 space-y-2">
                    <h3 className="font-black text-xl text-slate-950">
                      Shorts Clásicos
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Confeccionados en <strong>tela Polistrech</strong> (suave, fresca y elástica). Cuentan con bolsillos laterales con cierre reforzado y pretina ajustable.
                    </p>
                    <div className="text-xs text-slate-700 font-medium space-y-1 pt-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>12 colores con 36 variantes de rayas</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Tallas S, M, L y XL</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promociones de Shorts Clásicos */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-900 font-bold uppercase block">Precio unitario</span>
                    <span className="font-black text-slate-950 text-base">S/ 15.00</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase block">Promociones activas</span>
                    <span className="font-extrabold text-emerald-950 text-xs">6x S/ 81 · 12x S/ 144</span>
                  </div>
                </div>
              </div>

              {/* Botón directo a página completa de Shorts Clásicos */}
              <div className="pt-5 mt-4 border-t border-slate-100">
                <Link
                  to="/ropa/shorts/clasicos"
                  className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-2 text-center shadow-xs cursor-pointer"
                >
                  <span>Ver colección Shorts Clásicos ({SHORTS_POLIESTER.length} modelos)</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>
              </div>
            </div>

            {/* SELECCIONAR: SHORTS DEPORTIVOS */}
            <div className="bg-white rounded-3xl border-2 border-blue-900 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-900 text-white font-black text-xs uppercase tracking-wider">
                    Shorts Deportivos
                  </span>
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {SHORTS_WIN.length} Modelos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5 aspect-square bg-slate-50 rounded-2xl p-3 flex items-center justify-center border border-slate-200/80 overflow-hidden">
                    <img
                      src={muestraDeportivo?.imagen}
                      alt="Shorts Deportivos"
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                  </div>
                  <div className="sm:col-span-7 space-y-2">
                    <h3 className="font-black text-xl text-slate-950">
                      Shorts Deportivos
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Confeccionados en <strong>tela Win deportiva</strong> (microperforada, ligera y de secado rápido). Modelos de clubes y selecciones con bolsillos con cierre.
                    </p>
                    <div className="text-xs text-slate-700 font-medium space-y-1 pt-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Clubes oficiales y selecciones</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Tallas S, M, L y XL</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promociones de Shorts Deportivos */}
                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-blue-900 font-bold uppercase block">Precio unitario</span>
                    <span className="font-black text-slate-950 text-base">S/ 25.00</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-blue-800 font-bold uppercase block">Promociones activas</span>
                    <span className="font-extrabold text-blue-950 text-xs">3x S/ 69 · 12x S/ 240</span>
                  </div>
                </div>
              </div>

              {/* Botón directo a página completa de Shorts Deportivos */}
              <div className="pt-5 mt-4 border-t border-slate-100">
                <Link
                  to="/ropa/shorts/deportivos"
                  className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-2 text-center shadow-xs cursor-pointer"
                >
                  <span>Ver colección Shorts Deportivos ({SHORTS_WIN.length} modelos)</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* 4. CATÁLOGO COMPLETO DE SHORTS */}
        <section id="grid-productos" className="space-y-4 pt-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-950">
                  Explorar catálogo ({productosFiltrados.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Selecciona una opción o busca directamente
                </p>
              </div>

              {/* Botones directos de selección */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFiltroTipo('todos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filtroTipo === 'todos'
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Shorts Clásicos ({SHORTS_POLIESTER.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroTipo('deportivos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filtroTipo === 'deportivos'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Shorts Deportivos ({SHORTS_WIN.length})
                </button>
              </div>
            </div>

            {/* Búsqueda y Orden */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por color (Negro, Marino...) o equipo (Madrid, Barça, Argentina)..."
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

              <div className="flex items-center gap-2 shrink-0">
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

          {/* Grilla de productos */}
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
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <PackageOpen className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900">No encontramos coincidencias</h4>
                <p className="text-xs text-slate-500 mt-1">
                  No hay prendas que coincidan con &ldquo;{busqueda}&rdquo;. Intenta con otro término o limpia los filtros.
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
        </section>

      </main>

      <Footer />
    </div>
  );
}
