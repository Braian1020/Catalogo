import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { SHORTS_POLIESTER, SHORTS_WIN, PRODUCTOS } from '../data/productos';
import {
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Shirt,
  Layers,
  Ruler,
  Info,
} from 'lucide-react';

export default function RopaCategoryPage() {
  const { setModalGuiaTallas, setModalTelasAbierto } = useCart();

  useEffect(() => {
    document.title = 'Ropa Deportiva y Urbana | Categoría Oficial POOL STORE';
    const description =
      'Explora la colección de ropa de POOL STORE: Shorts Clásicos Polistrech y Shorts Deportivos Win. Próximamente polos, joggers y casacas. Envíos a todo el Perú.';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Categoría Ropa | POOL STORE');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, []);

  const totalShorts = SHORTS_POLIESTER.length + SHORTS_WIN.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <Breadcrumbs
        items={[
          { label: 'Productos', path: '/productos' },
          { label: 'Ropa' },
        ]}
        showBackButton
        backFallbackPath="/productos"
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-10">
        
        {/* Category Header Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Shirt className="w-3.5 h-3.5" />
              <span>Categoría Principal</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ropa
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Prendas seleccionadas para brindarte máxima comodidad, durabilidad y estilo. Actualmente nuestra línea insignia es la colección de shorts con bolsillos reforzados con cierre, y próximamente ampliaremos con polos, pantalones y casacas.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/ropa/shorts"
                className="px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Ver colección de Shorts ({totalShorts})</span>
                <ArrowRight className="w-4 h-4 text-blue-900" />
              </Link>

              <button
                type="button"
                onClick={() => setModalTelasAbierto(true)}
                className="px-4 py-3 bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Info className="w-4 h-4 text-teal-400" />
                <span>Conocer telas (Polistrech y Win)</span>
              </button>

              <button
                type="button"
                onClick={() => setModalGuiaTallas(true)}
                className="px-4 py-3 bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Ruler className="w-4 h-4 text-amber-400" />
                <span>Guía de tallas (S a XL)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Subcategories Section */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-900 block mb-1">
              Subcategorías de Ropa
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Explora por tipo de prenda
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Subcategoría Activa: SHORTS */}
            <div className="group bg-white rounded-3xl border-2 border-slate-900 p-6 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-800 font-black text-[11px] uppercase tracking-wider">
                    {totalShorts} Modelos disponibles
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    ★
                  </div>
                </div>

                {/* Thumbnail collage */}
                <div className="aspect-[4/3] bg-slate-50 rounded-2xl overflow-hidden p-2 flex items-center justify-center border border-slate-100">
                  <img
                    src={PRODUCTOS[0]?.imagen}
                    alt="Shorts POOL STORE"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div>
                  <h3 className="font-black text-xl text-slate-950">Shorts</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Shorts clásicos elásticos en 12 colores y deportivos Win de equipos. Con bolsillos reforzados con cierre y pretina adaptable.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    to="/ropa/shorts/clasicos"
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span>Shorts Clásicos Polistrech (36)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </Link>
                  <Link
                    to="/ropa/shorts/deportivos"
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span>Shorts Deportivos Win (11)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </Link>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100">
                <Link
                  to="/ropa/shorts"
                  className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-900"
                >
                  <span>Ver todos los Shorts</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>
              </div>
            </div>

            {/* Subcategoría Próxima: Polos */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between opacity-85">
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 font-bold text-[11px] uppercase tracking-wider inline-block">
                  Próximamente
                </span>

                <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400">
                  <Shirt className="w-12 h-12" />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-800">Polos y Camisetas</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Polos en algodón reactivo y camisetas de secado rápido para deporte y uso diario.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 text-center">
                <span className="text-xs font-semibold text-slate-400">En confección y selección</span>
              </div>
            </div>

            {/* Subcategoría Próxima: Pantalones & Joggers */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between opacity-85">
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 font-bold text-[11px] uppercase tracking-wider inline-block">
                  Próximamente
                </span>

                <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400">
                  <Layers className="w-12 h-12" />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-800">Pantalones y Joggers</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Joggers ergonómicos con bolsillos de seguridad y pretina ajustable.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 text-center">
                <span className="text-xs font-semibold text-slate-400">En confección y selección</span>
              </div>
            </div>

            {/* Subcategoría Próxima: Poleras & Casacas */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between opacity-85">
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 font-bold text-[11px] uppercase tracking-wider inline-block">
                  Próximamente
                </span>

                <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400">
                  <Shirt className="w-12 h-12" />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-800">Poleras y Casacas</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Prendas de abrigo ligeras con diseños sobrios y cortes modernos.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 text-center">
                <span className="text-xs font-semibold text-slate-400">En confección y selección</span>
              </div>
            </div>

          </div>
        </section>

        {/* Fabric Information Callout */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                Materiales y Confección
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                ¿Qué tipo de telas usamos en nuestros shorts?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Seleccionamos dos telas clave: <strong>Polistrech</strong> para quienes buscan frescura, elasticidad y suavidad para el uso diario o caminatas, y <strong>Tela Win</strong> para actividades deportivas de alta exigencia que requieren transpirabilidad y secado veloz.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setModalTelasAbierto(true)}
                  className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Ver comparativa completa de telas
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-black text-slate-900 block">Tela Polistrech</span>
                <span className="text-[11px] text-slate-500 block">Elástica, fresca, suave</span>
                <span className="text-[10px] font-bold text-blue-800 block mt-2">12 Colores · 36 Variantes</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-black text-slate-900 block">Tela Win Deportiva</span>
                <span className="text-[11px] text-slate-500 block">Microperforada, ultra ligera</span>
                <span className="text-[10px] font-bold text-emerald-800 block mt-2">11 Diseños de Clubes</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
