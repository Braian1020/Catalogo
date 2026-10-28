import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { POLESTORE_PHONE_DISPLAY, getWhatsAppUrl } from '../utils/whatsapp';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle,
  ThumbsUp,
  MapPin,
} from 'lucide-react';

export default function HomePage() {
  useEffect(() => {
    document.title = 'POOL STORE | Tu tienda virtual, todo en un solo lugar';
    const description =
      'En POOL STORE seleccionamos productos de calidad a precios accesibles. Compras fáciles, atención directa por WhatsApp y entregas coordinadas.';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'POOL STORE | Tu tienda virtual');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* PORTADA PRINCIPAL — HERO MINIMALISTA */}
        <section className="relative overflow-hidden bg-white border-b border-slate-200/80 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Columna Izquierda: Información Principal y Accesos */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
                    POOL STORE
                    <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-900 mt-1.5">
                      Tu tienda virtual, todo en un solo lugar.
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                    Descubre una manera sencilla de comprar. En POOL STORE seleccionamos productos de calidad a precios accesibles, con atención personalizada, compras fáciles y entregas coordinadas.
                  </p>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                  <Link
                    to="/productos"
                    className="w-full sm:w-auto px-8 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Explorar productos</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-emerald-400" />
                  </Link>

                  <Link
                    to="/nosotros"
                    className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl border border-slate-300 hover:border-slate-400 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    <span>Conoce POOL STORE</span>
                  </Link>
                </div>
              </div>

              {/* Columna Derecha: Composición Visual Limpia */}
              <div className="lg:col-span-6">
                <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-900">
                  <img
                    src="/assets/aistudio/Fondo_Page_5fdaf0bc"
                    alt="POOL STORE - Catálogo Oficial"
                    className="w-full h-auto object-cover object-center"
                    loading="eager"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* POR QUÉ COMPRAR EN POOL STORE (Las 3 B, Envíos coordinados y Atención) */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-blue-900 block mb-1">
                Nuestra Garantía
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                ¿Por qué comprar en POOL STORE?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Beneficio 1: Las 3 B */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
                  <ThumbsUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-950">Las 3 B</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Bueno, Bonito y Barato:</strong> Prendas y artículos seleccionados con telas resistentes, costuras reforzadas y cierres duraderos a precios justos y accesibles.
                </p>
              </div>

              {/* Beneficio 2: Envíos coordinados */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-950">Envíos coordinados</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Entrega en <strong>Plaza Cívica</strong> de José Leonardo Ortiz, delivery a domicilio en Chiclayo a solo <strong>S/ 1.50 por kilómetro</strong> (desde Balta y Arica) y envíos a todo el Perú por Shalom.
                </p>
              </div>

              {/* Beneficio 3: Atención personalizada */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-950">Atención directa</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Asesoría humana por WhatsApp ({POLESTORE_PHONE_DISPLAY}) para resolver dudas sobre tallas, disponibilidad de colores y coordinar la entrega en minutos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CÓMO COMPRAR */}
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-blue-900 block mb-1">
                Fácil y directo
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                ¿Cómo comprar en POOL STORE?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Paso 1 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-base text-slate-950 mb-2">Elige tus productos</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ingresa a productos, selecciona tus modelos favoritos, elige tus tallas y variantes, y agrégalos a tu pedido.
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-base text-slate-950 mb-2">Confirma por WhatsApp</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Con un solo clic envías tu pedido detallado a nuestro WhatsApp oficial para confirmar stock y datos de entrega.
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-base text-slate-950 mb-2">Recibe o recoge tu pedido</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Recoge en Plaza Cívica, recibe por delivery a domicilio o retira en la agencia Shalom de tu ciudad.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/productos"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                <span>Ir al catálogo de productos</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
