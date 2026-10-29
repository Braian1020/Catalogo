import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  useEffect(() => {
    document.title = 'POOL STORE | Tu tienda virtual, todo en un solo lugar';
    const description =
      'Descubre productos de calidad a precios accesibles. Compra fácil, atención directa y entregas coordinadas en Chiclayo.';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'POOL STORE | Tu tienda virtual');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-montserrat flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* PORTADA HERO: IMAGEN COMPLETA DE FONDO CON PRODUCTOS A LA DERECHA Y TEXTO A LA IZQUIERDA */}
        <section
          aria-label="Portada principal de POOL STORE"
          className="relative w-full flex-1 min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] xl:min-h-[660px] flex items-center bg-slate-950 overflow-hidden"
        >
          {/* Capa de imagen de fondo completa (cover) */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-no-repeat bg-[position:85%_center] sm:bg-[position:80%_center] md:bg-[position:76%_center] lg:bg-[position:right_center]"
            style={{
              backgroundImage: `url('/assets/aistudio/Nuevo_Fondo_9d1115e2.png')`,
            }}
          />

          {/* Degradado oscuro sutil para máxima legibilidad del texto en el lado izquierdo */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent sm:via-slate-950/55 sm:to-slate-950/10 lg:via-slate-950/40 lg:to-transparent pointer-events-none"
            aria-hidden="true"
          />
          {/* Viñeta sutil vertical para suavizar bordes */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 pointer-events-none"
            aria-hidden="true"
          />

          {/* Contenido alineado a la izquierda directamente sobre el fondo */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
            <div className="max-w-xl lg:max-w-2xl space-y-6 sm:space-y-7 text-left">
              
              {/* Títulos y descripción */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.05] drop-shadow-md">
                  POOL STORE
                  <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-[2.65rem] font-extrabold text-white/95 mt-2 sm:mt-3 tracking-tight leading-snug">
                    Tu tienda virtual, todo en un solo lugar.
                  </span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-normal leading-relaxed max-w-lg drop-shadow-sm pt-1">
                  Descubre productos de calidad a precios accesibles. Compra fácil, atención directa y entregas coordinadas en Chiclayo.
                </p>
              </div>

              {/* Botón de acción directo al catálogo */}
              <div className="pt-2 sm:pt-4">
                <Link
                  to="/productos"
                  className="inline-flex items-center justify-center gap-3 px-8 sm:px-9 py-4 bg-white hover:bg-slate-100 text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 group cursor-pointer active:scale-95"
                >
                  <span>Explorar productos</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900 group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

