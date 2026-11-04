import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ProductsPage() {
  useEffect(() => {
    document.title = 'Categorías de Productos | POOL STORE Chiclayo';
    const description =
      'Explora las categorías oficiales de POOL STORE: Ropa (Shorts Clásicos y Deportivos) y Tecnología (Sistema Android TV Box).';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Productos | POOL STORE');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <Breadcrumbs
        items={[{ label: 'Productos' }]}
        showBackButton
        backFallbackPath="/"
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex flex-col justify-center">
        
        {/* Encabezado limpio y conciso */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Catálogo POOL STORE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Categorías de Productos
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Selecciona una categoría para ver los productos disponibles.
          </p>
        </div>

        {/* Cuadrícula de categorías compacta para ver todo en pantalla sin recorte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto w-full">
          
          {/* ========================================================= */}
          {/* CATEGORÍA 1: ROPA                                          */}
          {/* ========================================================= */}
          <Link
            to="/ropa"
            className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-slate-950 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
            title="Entrar a la categoría Ropa"
          >
            {/* Imagen con proporción exacta 3:1 para que se vea completa al 100% sin recortes */}
            <div className="relative aspect-[3/1] w-full bg-slate-950 overflow-hidden border-b border-slate-100">
              <img
                src="/assets/categorias/Ropa.png"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://lh3.googleusercontent.com/d/1FV1EUPfaRLkSY4WAhwslj3H5hJyxzh2_';
                }}
                alt="Categoría Ropa POOL STORE"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
            </div>

            {/* Contenido de la categoría */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Categoría
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 group-hover:text-emerald-700 transition-colors">
                  Ropa
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Shorts Clásicos en Polistrech y Shorts Deportivos en tela Win. Prendas frescas, elásticas y resistentes.
                </p>
              </div>

              <div className="pt-2">
                <span className="w-full py-3 bg-slate-950 group-hover:bg-slate-800 text-white font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-2 text-center shadow-xs">
                  <span>Entrar a Ropa</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

          {/* ========================================================= */}
          {/* CATEGORÍA 2: TECNOLOGÍA                                   */}
          {/* ========================================================= */}
          <Link
            to="/tecnologia"
            className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-slate-950 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
            title="Entrar a la categoría Tecnología"
          >
            {/* Imagen con proporción exacta 3:1 para que se vea completa al 100% sin recortes */}
            <div className="relative aspect-[3/1] w-full bg-slate-950 overflow-hidden border-b border-slate-100">
              <img
                src="/assets/categorias/Tecnologia.png"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://lh3.googleusercontent.com/d/1tX3ErZD5Ypcu3KDu0ZAbd57C4oShlPqT';
                }}
                alt="Categoría Tecnología POOL STORE"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
            </div>

            {/* Contenido de la categoría */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Categoría
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 group-hover:text-blue-600 transition-colors">
                  Tecnología
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Sistema Android TV Box configurado con aplicaciones. Transforma cualquier televisor antiguo en pantalla multimedia.
                </p>
              </div>

              <div className="pt-2">
                <span className="w-full py-3 bg-blue-600 group-hover:bg-blue-500 text-white font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-2 text-center shadow-xs">
                  <span>Entrar a Tecnología</span>
                  <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

        </div>
      </main>

      <Footer />
    </div>
  );
}
