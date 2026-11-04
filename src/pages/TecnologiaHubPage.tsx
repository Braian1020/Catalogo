import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { TV_BOX_CONFIG, getTvBoxWhatsAppUrl } from '../data/tvBoxData';
import {
  Tv,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

export default function TecnologiaHubPage() {
  useEffect(() => {
    document.title = 'Tecnología | POOL STORE Chiclayo';
    const description =
      'Dispositivos de tecnología en POOL STORE: Sistema Android TV Box configurado con aplicaciones, control remoto y cable HDMI por S/ 250.00 con delivery gratis.';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Tecnología | POOL STORE');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <Breadcrumbs
        items={[{ label: 'Tecnología' }]}
        showBackButton
        backFallbackPath="/productos"
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-8">
        
        {/* Encabezado limpio de la categoría Tecnología */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Tecnología
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Dispositivos multimedia y sistemas inteligentes para tu televisor
            </p>
          </div>

          <Link
            to="/tecnologia/sistemas-tv-box/ayuda"
            className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Centro de Ayuda TV Box</span>
          </Link>
        </div>

        {/* Banner accesible de la categoría Tecnología */}
        <div className="w-full max-w-4xl mx-auto aspect-[3/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 bg-slate-950">
          <img
            src="/assets/categorias/Tecnologia.png"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://lh3.googleusercontent.com/d/1tX3ErZD5Ypcu3KDu0ZAbd57C4oShlPqT';
            }}
            alt="Categoría Tecnología POOL STORE - Sistema Android TV Box"
            className="w-full h-full object-cover block"
            loading="eager"
          />
        </div>

        {/* Productos de Tecnología (Sistema Android TV Box al estilo de la tienda) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          
          {/* ========================================================= */}
          {/* PRODUCTO: SISTEMA ANDROID – TV BOX CONFIGURADO             */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border-2 border-slate-900 p-6 sm:p-7 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-950 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sistema Android – TV Box</span>
                </span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Delivery Gratis</span>
                </span>
              </div>

              {/* Imagen del producto: Al hacer clic entra a la página del TV Box */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                <Link
                  to="/tecnologia/sistemas-tv-box"
                  className="sm:col-span-5 aspect-square bg-slate-100 rounded-2xl p-2 flex items-center justify-center border border-slate-200 group overflow-hidden cursor-pointer"
                  title="Ver página completa de TV Box"
                >
                  <img
                    src="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80"
                    alt="Sistema Android TV Box configurado con control y cables"
                    className="max-w-full max-h-full w-auto h-auto object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>

                <div className="sm:col-span-7 space-y-2.5">
                  <Link
                    to="/tecnologia/sistemas-tv-box"
                    className="font-black text-xl text-slate-950 leading-snug hover:text-emerald-700 transition-colors block"
                  >
                    Sistema Android TV Box
                  </Link>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Transforma cualquier televisor en Smart TV. Disfruta de <strong>YouTube, películas, series y canales</strong> en pantalla grande sin pagar suscripciones obligatorias.
                  </p>

                  <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Configurado y listo para conectar (Plug & Play)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Incluye Control Remoto + Cable HDMI 1m</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Garantía de 3 meses + soporte continuo</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Precios y Promociones */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-900 font-bold uppercase block">Precio del equipo</span>
                  <span className="font-black text-slate-950 text-xl">{TV_BOX_CONFIG.precioEquipo}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Beneficio exclusivo</span>
                  <span className="font-extrabold text-emerald-950 text-xs">Delivery Gratis en Chiclayo</span>
                </div>
              </div>
            </div>

            {/* Botones de acción directos */}
            <div className="pt-5 mt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
              <Link
                to="/tecnologia/sistemas-tv-box"
                className="flex-1 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-2 text-center shadow-xs cursor-pointer"
              >
                <span>Ver qué incluye y detalles</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
              <a
                href={getTvBoxWhatsAppUrl(
                  `¡Hola POOL STORE! Deseo comprar el Sistema Android TV Box (${TV_BOX_CONFIG.precioEquipo} con delivery gratis). ¿Tienen disponibilidad inmediata?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-2 text-center shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CENTRO DE AYUDA (SOY COMPRADOR)                           */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Soy Comprador</span>
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  Manual Digital & Guías
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="font-black text-xl text-slate-950 leading-snug">
                  Centro de Ayuda TV Box
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ¿Ya tienes tu TV Box? Hemos preparado un manual interactivo con todo lo que necesitas para sacarle el máximo provecho a tu dispositivo.
                </p>

                <ul className="text-xs text-slate-700 space-y-2 pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span><strong>Simulador interactivo del control remoto:</strong> aprende qué hace cada botón</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span><strong>5 Guías de conexión:</strong> HDMI, RCA, alimentación y Wi-Fi paso a paso</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span><strong>Solución de problemas:</strong> diagnóstico para las 10 situaciones más comunes</span>
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cyan-900 font-bold uppercase block">Acceso permanente</span>
                  <span className="font-black text-slate-950 text-sm">Gratuito para clientes</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-cyan-800 font-bold uppercase block">Soporte directo</span>
                  <span className="font-extrabold text-cyan-950 text-xs">Asesoría por WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100">
              <Link
                to="/tecnologia/sistemas-tv-box/ayuda"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-2 text-center shadow-xs cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Entrar al Centro de Ayuda TV Box</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

        </div>

      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
