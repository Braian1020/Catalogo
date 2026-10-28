import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart, PUNTOS_CENTRICOS_CHICLAYO } from '../context/CartContext';
import { SHORTS_POLIESTER, SHORTS_WIN, PRODUCTOS, getProductSlug } from '../data/productos';
import { POLESTORE_PHONE_DISPLAY, getWhatsAppUrl } from '../utils/whatsapp';
import {
  ShoppingBag,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Layers,
  Shirt,
  Tag,
  MessageCircle,
} from 'lucide-react';

export default function RopaCategoryPage() {
  const { setModalCarritoAbierto, totalPrendas, setModalTelasAbierto, setModalGuiaTallas } = useCart();

  useEffect(() => {
    document.title = 'Ropa Deportiva y Urbana | Catálogo Oficial POOL STORE';
    const description =
      'Explora la colección de ropa de POOL STORE: Shorts Clásicos Polistrech y Shorts Deportivos Win. Próximamente polos, joggers y casacas. Envíos a todo el Perú.';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Ropa Deportiva y Urbana | POOL STORE');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 6 productos destacados para mostrar como vista previa
  const shortsDestacados = PRODUCTOS.filter((p) => p.destacado).slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col">
      {/* 1. TOP MARQUEE BANNER */}
      <div className="bg-slate-950 text-white text-[11px] sm:text-xs py-2 px-3 border-b border-slate-800 text-center font-bold">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-amber-400 mx-auto">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>
              🔥 Promociones: <strong>1x S/ 25</strong> · <strong>3x S/ 69</strong> · <strong>12x S/ 240</strong> | Envíos para Zonas cercanas y a todo el Perú
            </span>
          </span>
        </div>
      </div>

      {/* 2. HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-900 hover:opacity-85 transition-opacity"
            title="Ir al inicio de Pool Store"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-sm">
              P
            </div>
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight block leading-none">
                POOL STORE
              </span>
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block">
                Catálogo Oficial
              </span>
            </div>
          </Link>

          {/* Menú Desktop */}
          <nav aria-label="Menú principal de navegación" className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <Link to="/" className="hover:text-black transition-colors">
              Inicio
            </Link>
            <Link to="/ropa" className="text-blue-600 hover:text-blue-700 font-black transition-colors">
              Ropa
            </Link>
            <Link to="/ropa/shorts" className="hover:text-black transition-colors">
              Shorts ({SHORTS_POLIESTER.length + SHORTS_WIN.length})
            </Link>
            <button
              type="button"
              onClick={() => setModalGuiaTallas(true)}
              className="hover:text-black cursor-pointer transition-colors"
            >
              Guía de Tallas
            </button>
            <button
              type="button"
              onClick={() => setModalTelasAbierto(true)}
              className="hover:text-black cursor-pointer transition-colors"
            >
              Conoce las Telas
            </button>
          </nav>

          {/* Acciones Header */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalCarritoAbierto(true)}
              className="relative p-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              aria-label="Abrir mi pedido"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline text-xs font-black">Mi Pedido</span>
              {totalPrendas > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black flex items-center justify-center shadow-xs">
                  {totalPrendas}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. BREADCRUMBS */}
      <nav aria-label="Ruta de navegación" className="max-w-6xl mx-auto px-4 pt-4 pb-2 w-full">
        <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-slate-900 transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">Ropa</span>
        </div>
      </nav>

      {/* 4. HERO DE LA CATEGORÍA ROPA */}
      <section className="max-w-6xl mx-auto px-4 py-6 w-full">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4 uppercase tracking-wider">
              <Shirt className="w-3.5 h-3.5" />
              Categoría Principal
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">
              Ropa Deportiva y Urbana
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Descubre nuestra línea de indumentaria diseñada para máxima comodidad, rendimiento y estilo.
              Confección peruana de alta calidad con costuras reforzadas, bolsillos con cierre y telas de secado rápido.
            </p>

            {/* Badges de beneficios */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>1x S/ 25 · 3x S/ 69 · 12x S/ 240</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Envíos a todo el Perú</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SUB-CATEGORÍAS DE ROPA */}
      <section className="max-w-6xl mx-auto px-4 py-6 w-full flex-1">
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Subcategorías de Ropa
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Actualmente contamos con nuestra colección completa de Shorts. Próximamente sumaremos polos, pantalones y más prendas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SUBCATEGORÍA 1: SHORTS (ACTIVA) */}
          <div className="bg-white border-2 border-blue-500/40 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
              Disponible Ahora
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl mb-4 group-hover:scale-105 transition-transform">
                🩳
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Shorts</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                47 modelos disponibles con bolsillos reforzados con cierre, pretina elástica con cordón y telas de secado rápido.
              </p>

              {/* Sub-tipos clicables */}
              <div className="space-y-2 mb-6">
                <Link
                  to="/ropa/shorts/clasicos"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors group/sub"
                >
                  <div>
                    <span className="text-xs font-black text-slate-900 group-hover/sub:text-blue-700 block">
                      Shorts Clásicos Polistrech
                    </span>
                    <span className="text-[11px] text-slate-500">
                      36 combinaciones por color principal y color de rayas
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover/sub:text-blue-600" />
                </Link>

                <Link
                  to="/ropa/shorts/deportivos"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition-colors group/sub"
                >
                  <div>
                    <span className="text-xs font-black text-slate-900 group-hover/sub:text-amber-800 block">
                      Shorts Deportivos Tela Win
                    </span>
                    <span className="text-[11px] text-slate-500">
                      11 modelos de clubes y selecciones internacionales (V1 / V2)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover/sub:text-amber-600" />
                </Link>
              </div>
            </div>

            <Link
              to="/ropa/shorts"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Ver todos los Shorts (47 modelos)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* SUBCATEGORÍA 2: POLOS (PRÓXIMAMENTE) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between opacity-85">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xl">
                  👕
                </div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                  Próximamente
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Polos Deportivos y Casuales</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Nueva línea en preparación: polos de algodón pima peinado y tela deportiva transpirable para uso diario y entrenamiento.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                ⏳ Colección en confección. Muy pronto disponible con precios especiales por mayor y menor.
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                disabled
                className="w-full py-3 px-4 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl inline-flex items-center justify-center cursor-not-allowed"
              >
                Próximamente disponible
              </button>
            </div>
          </div>

          {/* SUBCATEGORÍA 3: PANTALONES Y JOGGERS (PRÓXIMAMENTE) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between opacity-85">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xl">
                  👖
                </div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                  Próximamente
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Pantalones y Joggers</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Joggers deportivos con puño elástico y bolsillos con cierre, confeccionados en tela stretch resistente.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                ⏳ En proceso de muestreo de telas y tallas.
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                disabled
                className="w-full py-3 px-4 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl inline-flex items-center justify-center cursor-not-allowed"
              >
                Próximamente disponible
              </button>
            </div>
          </div>

          {/* SUBCATEGORÍA 4: CASACAS Y POLERAS (PRÓXIMAMENTE) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between opacity-85">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xl">
                  🧥
                </div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                  Próximamente
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Casacas y Poleras</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Casacas cortaviento impermeables y poleras urbanas con capucha para completar tu outfit deportivo.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                ⏳ Diseños en fase final de producción.
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                disabled
                className="w-full py-3 px-4 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl inline-flex items-center justify-center cursor-not-allowed"
              >
                Próximamente disponible
              </button>
            </div>
          </div>
        </div>

        {/* 6. VISTA PREVIA DE SHORTS DISPONIBLES */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Modelos destacados disponibles en Shorts
              </h3>
              <p className="text-xs text-slate-500">
                Haz clic en cualquier modelo para ver su ficha con fotos grandes, tallas y pedir directo por WhatsApp.
              </p>
            </div>
            <Link
              to="/ropa/shorts"
              className="text-xs font-black text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              <span>Ver catálogo completo de shorts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {shortsDestacados.map((p) => {
              const slug = getProductSlug(p);
              return (
                <Link
                  key={p.id}
                  to={`/producto/${slug}`}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-black rounded-md ${
                        p.tipoTela === 'win'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {p.tipoTela === 'win' ? 'Win' : 'Polistrech'}
                    </span>
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <h4 className="text-[11px] font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {p.nombre}
                    </h4>
                    <span className="text-[11px] font-extrabold text-slate-900 mt-1 block">
                      S/ 25.00
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-950 text-white pt-10 pb-8 border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white text-slate-950 flex items-center justify-center font-black">
                  P
                </div>
                <span className="font-black text-base tracking-tight">POOL STORE</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-3">
                Tienda de ropa deportiva y urbana con la mejor calidad y promociones por unidad y al por mayor en Perú.
              </p>
              <div className="flex items-center gap-2 text-slate-400 font-bold">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Envíos a todo el país vía Olva Courier y Shalom</span>
              </div>
            </div>

            <div>
              <h4 className="font-black text-sm text-white mb-3 uppercase tracking-wider">
                Navegación
              </h4>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/ropa" className="text-white font-bold transition-colors">
                    Ropa (Categoría Principal)
                  </Link>
                </li>
                <li>
                  <Link to="/ropa/shorts" className="hover:text-white transition-colors">
                    Shorts (47 modelos)
                  </Link>
                </li>
                <li>
                  <Link to="/ropa/shorts/clasicos" className="hover:text-white transition-colors">
                    Shorts Clásicos Polistrech
                  </Link>
                </li>
                <li>
                  <Link to="/ropa/shorts/deportivos" className="hover:text-white transition-colors">
                    Shorts Deportivos Tela Win
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-sm text-white mb-3 uppercase tracking-wider">
                Atención y Pedidos
              </h4>
              <p className="text-slate-400 mb-2">
                Atención personalizada y confirmación de pedidos vía WhatsApp:
              </p>
              <a
                href={getWhatsAppUrl(
                  '¡Hola POOL STORE! Deseo consultar sobre su catálogo de ropa y shorts.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{POLESTORE_PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
            <span>© {new Date().getFullYear()} POOL STORE. Todos los derechos reservados.</span>
            <span>Ropa y Shorts con entrega en Chiclayo y envíos a todo el Perú.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
