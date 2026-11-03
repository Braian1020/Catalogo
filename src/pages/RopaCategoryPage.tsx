import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { SHORTS_POLIESTER, SHORTS_WIN, PRODUCTOS } from '../data/productos';
import {
  ArrowRight,
  Shirt,
  Ruler,
  CheckCircle2,
} from 'lucide-react';

export default function RopaCategoryPage() {
  const { setModalGuiaTallas } = useCart();

  useEffect(() => {
    document.title = 'Ropa | POOL STORE Chiclayo';
    const description =
      'Shorts Clásicos Polistrech y Shorts Deportivos Win en POOL STORE. Prendas con bolsillos laterales con cierre reforzado de seguridad.';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Ropa | POOL STORE');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, []);

  // Muestras para las tarjetas
  const muestraClasico =
    PRODUCTOS.find((p) => p.colorShort === 'Negro' && p.colorRayas === 'Blancas') ||
    SHORTS_POLIESTER[0];
  const muestraDeportivo =
    SHORTS_WIN.find((p) => p.id === 'win-real-madrid') || SHORTS_WIN[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <Breadcrumbs
        items={[{ label: 'Ropa' }]}
        showBackButton
        backFallbackPath="/productos"
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-8">
        
        {/* Encabezado limpio y directo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Ropa
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Shorts Clásicos y Shorts Deportivos con bolsillos con cierre reforzado
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalGuiaTallas(true)}
            className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Ruler className="w-4 h-4 text-amber-400" />
            <span>Guía de tallas</span>
          </button>
        </div>

        {/* Tarjetas directas de los shorts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* SELECCIONAR: SHORTS CLÁSICOS */}
          <div className="bg-white rounded-3xl border-2 border-slate-900 p-6 sm:p-7 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-black text-xs uppercase tracking-wider">
                  Shorts Clásicos
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {SHORTS_POLIESTER.length} Modelos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                <div className="sm:col-span-5 aspect-square bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-200/80 group overflow-hidden">
                  <img
                    src={muestraClasico?.imagen}
                    alt="Shorts Clásicos"
                    className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="sm:col-span-7 space-y-2.5">
                  <h2 className="font-black text-xl text-slate-950 leading-snug">
                    Shorts Clásicos
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Confeccionados en <strong>tela Polistrech</strong> (suave, fresca y elástica). Cuentan con bolsillos laterales con cierre reforzado de seguridad y pretina adaptable.
                  </p>

                  <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Variedad de colores y combinaciones</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>2 bolsillos laterales con cierre reforzado</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Pretina elástica con pasador ajustable</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Tallas S, M, L y XL</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block">Precio por unidad</span>
                  <span className="font-black text-slate-950 text-base">S/ 15.00</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-700 font-bold block">Promociones activas</span>
                  <span className="font-extrabold text-slate-800 text-xs">6x S/ 81 · 12x S/ 144</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100">
              <Link
                to="/ropa/shorts/clasicos"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Seleccionar Shorts Clásicos ({SHORTS_POLIESTER.length} modelos)</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          </div>

          {/* SELECCIONAR: SHORTS DEPORTIVOS */}
          <div className="bg-white rounded-3xl border-2 border-blue-900 p-6 sm:p-7 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-900 text-white font-black text-xs uppercase tracking-wider">
                  Shorts Deportivos
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {SHORTS_WIN.length} Modelos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                <div className="sm:col-span-5 aspect-square bg-slate-50 rounded-2xl p-2.5 flex items-center justify-center border border-slate-200/80 group overflow-hidden">
                  <img
                    src={muestraDeportivo?.imagen}
                    alt="Shorts Deportivos"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="sm:col-span-7 space-y-2.5">
                  <h2 className="font-black text-xl text-slate-950 leading-snug">
                    Shorts Deportivos
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Confeccionados en <strong>tela Win deportiva</strong> (microperforada, ligera y de secado rápido). Modelos de clubes y selecciones con bolsillos laterales con cierre.
                  </p>

                  <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Clubes oficiales y selecciones</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Bolsillos laterales con cierre reforzado</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Tejido deportivo fresco y transpirable</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Tallas S, M, L y XL</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block">Precio por unidad</span>
                  <span className="font-black text-slate-950 text-base">S/ 25.00</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-blue-800 font-bold block">Promociones activas</span>
                  <span className="font-extrabold text-slate-800 text-xs">3x S/ 69 · 12x S/ 240</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100">
              <Link
                to="/ropa/shorts/deportivos"
                className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Seleccionar Shorts Deportivos ({SHORTS_WIN.length} modelos)</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
