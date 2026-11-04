import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import TvBoxNavHeader from '../components/tvbox/TvBoxNavHeader';
import TvCompatibilitySelector from '../components/tvbox/TvCompatibilitySelector';
import {
  TV_BOX_CONFIG,
  getTvBoxWhatsAppUrl,
  APPS_INCLUIDAS,
  QUE_INCLUYE,
  QUE_NO_INCLUYE,
  PREGUNTAS_FRECUENTES_TV_BOX,
} from '../data/tvBoxData';
import {
  Tv,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ArrowDown,
  Sparkles,
  ShieldCheck,
  Zap,
  HelpCircle,
  Truck,
  Wrench,
  ChevronDown,
  ChevronUp,
  Cpu,
  Wifi,
  Radio,
  ExternalLink,
  Layers,
  ArrowRight,
  Info,
  PackageCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TvBoxLandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleScrollToQueIncluye = () => {
    const el = document.getElementById('que-recibiras');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Navbar General de POOL STORE */}
      <Navbar />

      {/* Sub-navegación comercial y de soporte para TV Box con estética de tienda */}
      <TvBoxNavHeader currentTab="comprar" />

      <main className="flex-grow">
        {/* =========================================================================
            1. PORTADA PRINCIPAL (HERO)
           ========================================================================= */}
        <section className="relative overflow-hidden pt-8 pb-14 sm:pb-20 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Preguntas atractivas discretas arriba del título */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                ¿Te sucede esto?
              </span>
              {[
                '¿Aún pagas televisión por cable?',
                '¿Tu Smart TV ya no recibe actualizaciones?',
                '¿Quieres disfrutar más aplicaciones en tu televisor?',
                '¿Piensas comprar otra TV porque la tuya es antigua?',
              ].map((pregunta, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-xs"
                >
                  {pregunta}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Columna Izquierda: Mensaje y llamadas a la acción */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-black tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>SISTEMA ANDROID – TV BOX CONFIGURADO</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
                  TRANSFORMA TU TELEVISOR{' '}
                  <span className="text-emerald-600 block sm:inline">
                    SIN COMPRAR UNO NUEVO.
                  </span>
                </h1>

                <p className="text-base sm:text-lg font-bold text-slate-800">
                  ¿Tu televisor ya no abre YouTube? ¿Está desactualizado o es demasiado antiguo?
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  ¡No lo cambies todavía! Dale una nueva vida con nuestro sistema Android TV Box.
                  Disfruta de películas, series, música, anime, televisión y aplicaciones de entretenimiento desde un solo dispositivo.
                </p>

                {/* Badge de precio y Delivery Gratis */}
                <div className="inline-flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-xs">
                  <div>
                    <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider block">
                      Precio de oferta POOL STORE
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-950">
                        {TV_BOX_CONFIG.precioEquipo}
                      </span>
                      <span className="text-xs font-black text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded-md">
                        Delivery Gratis
                      </span>
                    </div>
                  </div>
                  <div className="h-px sm:h-10 sm:w-px bg-emerald-200" />
                  <div className="text-left text-xs text-slate-700">
                    <span className="text-emerald-950 font-bold block">✓ Un solo pago · Sin cuotas</span>
                    <span className="text-slate-600">Configurado y listo para conectar en Chiclayo</span>
                  </div>
                </div>

                {/* Dos botones solicitados en el diseño */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center lg:justify-start">
                  <button
                    type="button"
                    onClick={handleScrollToQueIncluye}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Ver qué incluye</span>
                    <ArrowDown className="w-4 h-4 text-emerald-400" />
                  </button>

                  <a
                    href={getTvBoxWhatsAppUrl(
                      `¡Hola POOL STORE! Deseo consultar y coordinar la compra del Sistema Android TV Box (${TV_BOX_CONFIG.precioEquipo} con delivery gratis).`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>Consultar por WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Columna Derecha: Fotografía realista de TV, TV Box y control remoto */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-md group">
                  <img
                    src="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=85"
                    alt="Televisor moderno reproduciendo contenido con TV Box y control remoto"
                    className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Tarjeta flotante realista */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 text-xs shadow-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-slate-950 text-xs flex items-center gap-1.5">
                        <Tv className="w-4 h-4 text-blue-600" />
                        Dispositivo + Control + Cables
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Garantía 3 meses
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-tight">
                      No gastes S/ 800 o S/ 1,500 en una pantalla nueva. Actualiza la que ya tienes hoy mismo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. AHORRA DINERO Y ACTUALIZA TU TV
           ========================================================================= */}
        <section className="py-14 sm:py-18 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                Ahorro inteligente y práctico
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                DALE UNA SEGUNDA VIDA A TU TELEVISOR
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No necesitas comprar un televisor nuevo solamente porque su sistema está desactualizado.
                Con un dispositivo Android TV Box compatible puedes acceder a nuevas aplicaciones, servicios de entretenimiento y contenido multimedia desde tu televisor actual.
              </p>
            </div>

            {/* Tres beneficios destacados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 relative hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 border border-slate-200 flex items-center justify-center mb-4 shadow-xs">
                  <Tv className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-base font-black text-slate-950 mb-2">
                  1. Aprovecha tu televisor actual
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Evita gastar cientos de soles en un televisor nuevo. Mantén tu pantalla actual con toda su calidad visual y sonido.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 relative hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 border border-slate-200 flex items-center justify-center mb-4 shadow-xs">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-base font-black text-slate-950 mb-2">
                  2. Disfruta aplicaciones de entretenimiento
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Accede a YouTube, música, canales abiertos de televisión y plataformas multimedia con una interfaz cómoda y rápida.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 relative hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 border border-slate-200 flex items-center justify-center mb-4 shadow-xs">
                  <Zap className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-base font-black text-slate-950 mb-2">
                  3. Compra el equipo con un solo pago
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pagas el equipo y su configuración una sola vez ({TV_BOX_CONFIG.precioEquipo} con delivery gratis). No te atamos a cobros mensuales.
                </p>
              </div>
            </div>

            {/* Aclaración de transparencia requerida */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 max-w-4xl mx-auto">
              <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-950 font-bold">Nota de transparencia POOL STORE: </strong>
                Las suscripciones externas de aplicaciones (como Netflix, Prime Video o Disney+) no están incluidas en el precio del equipo y pueden generar cobros adicionales directamente con sus respectivas empresas si decides contratarlas.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. ¿QUÉ APLICACIONES Y FUNCIONES INCLUYE?
           ========================================================================= */}
        <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-2 mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Catálogo de servicios y funciones
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                ¿QUÉ APLICACIONES Y FUNCIONES INCLUYE?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Información clara, verídica y transparente de cada servicio compatible con tu TV Box.
              </p>
            </div>

            {/* Tarjetas de aplicaciones en estilo limpio de tienda */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {APPS_INCLUIDAS.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 flex flex-col justify-between hover:shadow-md transition-all shadow-xs"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                        {app.categoria}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {app.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                        <img
                          src={app.imagen}
                          alt={app.nombre}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h3 className="font-black text-base text-slate-950 leading-snug">
                          {app.nombre}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          {app.descripcionCorta}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {app.detalle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[10px] text-slate-500 leading-tight">
                      ℹ️ {app.notaLegal}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. ¿QUÉ ES UN TV BOX?
           ========================================================================= */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Conceptos claros para toda la familia
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                ¿QUÉ ES UN TV BOX Y PARA QUÉ SIRVE?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Un TV Box es un pequeño dispositivo que se conecta al televisor para utilizar un sistema multimedia con aplicaciones y funciones inteligentes.
                Es una alternativa práctica para aprovechar televisores que no cuentan con funciones Smart TV o cuyo sistema original se ha quedado desactualizado.
              </p>
            </div>

            {/* Ilustración interactiva: TV BOX -> TELEVISOR -> INTERNET */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
              <div className="text-center text-xs font-black uppercase tracking-wider text-slate-500 mb-6">
                Esquema de funcionamiento simplificado
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-2 font-black text-sm">
                    TV BOX
                  </div>
                  <h4 className="font-bold text-sm text-slate-950">1. Dispositivo Android</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Procesa las aplicaciones con su propio procesador y memoria.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center text-center py-2">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs mb-1">
                    <span>Cable HDMI o AV</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[11px] text-slate-400">Transmite imagen y sonido en HD</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 font-black text-sm">
                    PANTALLA
                  </div>
                  <h4 className="font-bold text-sm text-slate-950">2. Tu Televisor</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Solo muestra la imagen. No exige que el televisor sea moderno.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 text-center">
                <strong className="text-slate-950">Importante: </strong>
                El equipo utiliza su propio sistema operativo Android TV y no reemplaza físicamente el sistema interno del televisor; simplemente funciona a través del canal HDMI.
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. ¿QUÉ RECIBIRÁS CON TU COMPRA?
           ========================================================================= */}
        <section id="que-recibiras" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black tracking-wide">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <span>SECCIÓN ESENCIAL · CONTENIDO EXACTO</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                ¿QUÉ RECIBIRÁS CON TU COMPRA?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Tu compra incluye exactamente el equipo y los accesorios detallados a continuación, además de las instrucciones para comenzar a utilizarlo de inmediato.
              </p>
            </div>

            {/* Grilla de lo que se recibe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {QUE_INCLUYE.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center p-2">
                      <img
                        src={item.imagen}
                        alt={item.titulo}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-sm text-slate-950 leading-snug">
                        {item.titulo}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.estado}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.descripcion}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Confirmado en el paquete</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center max-w-2xl mx-auto text-xs text-slate-600 shadow-xs">
              Tu compra incluye el equipo y los accesorios detallados en esta página, además de las instrucciones para comenzar a utilizarlo con garantía de 3 meses.
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. ¿QUÉ NO INCLUYE?
           ========================================================================= */}
        <section className="py-14 sm:py-18 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                Cuentas claras y honestidad
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                ¿QUÉ NO INCLUYE?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Información transparente para que realices tu compra con absoluta seguridad.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="space-y-2.5">
                {QUE_NO_INCLUYE.map((exclusion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{exclusion}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Nuestro objetivo es ofrecerte una forma práctica de aprovechar tu televisor, organizar tus aplicaciones de entretenimiento y acceder a opciones gratuitas y autorizadas.
                </p>
                <p className="text-xs sm:text-sm font-bold text-emerald-950 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                  La compra del dispositivo y su configuración se realiza mediante un solo pago ({TV_BOX_CONFIG.precioEquipo} con Delivery Gratis). Los servicios externos pueden tener suscripciones independientes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. ¿QUÉ NECESITAS? + SELECTOR DE COMPATIBILIDAD
           ========================================================================= */}
        <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="max-w-3xl mx-auto text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Requisitos previos en casa
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                ¿QUÉ NECESITAS PARA UTILIZAR TU TV BOX?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Para comenzar a disfrutar sólo requieres 4 elementos básicos que seguramente ya tienes en tu hogar:
              </p>
            </div>

            {/* Cuatro tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto mb-3">
                  <Tv className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-bold text-blue-600 mb-1">Requisito 1</div>
                <h4 className="font-black text-sm text-slate-950 mb-1">Un televisor compatible</h4>
                <p className="text-xs text-slate-500">
                  Cualquier pantalla que tenga entrada HDMI (o RCA con cable AV).
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center mx-auto mb-3">
                  <Wifi className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-bold text-cyan-600 mb-1">Requisito 2</div>
                <h4 className="font-black text-sm text-slate-950 mb-1">Conexión a internet</h4>
                <p className="text-xs text-slate-500">
                  Wi-Fi o cable de red Ethernet según prefieras en tu dispositivo.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-bold text-amber-600 mb-1">Requisito 3</div>
                <h4 className="font-black text-sm text-slate-950 mb-1">Un tomacorriente</h4>
                <p className="text-xs text-slate-500">
                  Para alimentar el equipo con su transformador incluido.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-bold text-emerald-600 mb-1">Requisito 4</div>
                <h4 className="font-black text-sm text-slate-950 mb-1">Los cables adecuados</h4>
                <p className="text-xs text-slate-500">
                  El cable HDMI ya viene incluido en tu paquete.
                </p>
              </div>
            </div>

            {/* Selector visual interactivo: ¿QUÉ TIPO DE TELEVISOR TIENES? */}
            <TvCompatibilitySelector />
          </div>
        </section>

        {/* =========================================================================
            8. ENTREGA E INSTALACIÓN
           ========================================================================= */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-2 mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                Modalidades de servicio
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                RECIBE TU TV BOX Y COMIENZA A DISFRUTARLO
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Elige la forma de entrega y asesoramiento que más te acomode:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Opción 1: Entrega del producto con Delivery Gratis */}
              <div className="bg-slate-50 border-2 border-emerald-300 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
                      <Truck className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-[11px] uppercase">
                      Incluido Gratis
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-950">
                    DELIVERY GRATIS EN CHICLAYO
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    El cliente recibe su equipo con todos los accesorios y la configuración básica indicados sin costo adicional de envío en Chiclayo.
                  </p>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div>🛵 Delivery gratis en Chiclayo y zonas urbanas</div>
                    <div>📦 Envíos nacionales por Shalom o agencia</div>
                    <div>⏱️ Entregas el mismo día previa coordinación</div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 text-xs font-bold text-emerald-800">
                  ¡Ahorras en envío con tu compra de S/ 250!
                </div>
              </div>

              {/* Opción 2: Instalación a domicilio */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white text-cyan-600 border border-cyan-200 flex items-center justify-center shadow-xs">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">
                    INSTALACIÓN A DOMICILIO
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Instalación profesional en tu hogar y explicación básica paso a paso del funcionamiento con tu control.
                  </p>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div>🛠️ Cobertura: {TV_BOX_CONFIG.coberturaInstalacion}</div>
                    <div>💵 Costo adicional de instalación: {TV_BOX_CONFIG.precioInstalacionAproximado}</div>
                    <div>⏱️ Sujeto a disponibilidad y previa cita</div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 text-xs text-slate-500">
                  Ideal si deseas que te dejemos todo conectado y funcionando en tus televisores.
                </div>
              </div>

              {/* Opción 3: Asesoría */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">
                    ASESORÍA Y SOPORTE
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Orientación gratuita sobre conexión, controles y configuración inicial a través de WhatsApp y nuestro Centro de Ayuda.
                  </p>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div>📱 Guía remota personalizada por chat</div>
                    <div>📖 Acceso ilimitado al manual digital</div>
                    <div>🎥 Videos tutoriales paso a paso</div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 text-xs text-emerald-700 font-bold">
                  Incluida sin costo adicional con la compra de tu equipo.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            9. ENLACE DESTACADO AL CENTRO DE AYUDA (SOY COMPRADOR)
           ========================================================================= */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                ¿Ya compraste tu equipo?
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                CENTRO DE AYUDA TV BOX PARA CLIENTES
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Aprende a instalarlo, descubre los botones del control remoto interactivo y soluciona cualquier duda con nuestras 10 guías paso a paso.
              </p>
            </div>

            <Link
              to="/tecnologia/sistemas-tv-box/ayuda"
              className="px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
            >
              <HelpCircle className="w-4 h-4 text-slate-950" />
              <span>Ir a "Soy Comprador"</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>
        </section>

        {/* =========================================================================
            10. PREGUNTAS FRECUENTES (FAQ)
           ========================================================================= */}
        <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center space-y-2 mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Resolvemos todas tus dudas
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                PREGUNTAS FRECUENTES
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Respuestas claras antes de realizar tu compra:
              </p>
            </div>

            <div className="space-y-3">
              {PREGUNTAS_FRECUENTES_TV_BOX.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-bold text-sm sm:text-base text-slate-950">
                        {faq.pregunta}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.respuesta}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Llamada a la acción final */}
            <div className="mt-12 text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                ¿Listo para transformar tu televisor?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Adquiere hoy tu Sistema Android TV Box por <strong>{TV_BOX_CONFIG.precioEquipo}</strong> con <strong>Delivery Gratis en Chiclayo</strong> y soporte garantizado.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href={getTvBoxWhatsAppUrl(
                    `¡Hola POOL STORE! Deseo pedir el Sistema Android TV Box (${TV_BOX_CONFIG.precioEquipo} con delivery gratis). ¿Podrían coordinar mi entrega?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs inline-flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Pedir TV Box por WhatsApp ({TV_BOX_CONFIG.precioEquipo})</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
