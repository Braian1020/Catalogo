import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { POLESTORE_PHONE_DISPLAY, getWhatsAppUrl } from '../utils/whatsapp';
import {
  ShieldCheck,
  Heart,
  Sparkles,
  Truck,
  Users,
  CheckCircle2,
  MessageCircle,
  CreditCard,
  Target,
  ArrowRight,
  Shirt,
} from 'lucide-react';

export default function NosotrosPage() {
  useEffect(() => {
    document.title = 'Sobre POOL STORE | Historia, Valores y Compromiso';
    const description =
      'Conoce más sobre POOL STORE: nuestra visión como tienda virtual multiproducto en Perú, compromiso con la calidad y atención directa a cada cliente.';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Sobre POOL STORE | Conócenos');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <Breadcrumbs
        items={[{ label: 'Nosotros' }]}
        showBackButton
        backFallbackPath="/"
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-12">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-lg text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Users className="w-3.5 h-3.5" />
            <span>Nuestra Historia y Visión</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Sobre POOL STORE
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Una tienda virtual concebida para ofrecer productos esenciales de calidad, precios accesibles y una atención cálida y directa en cada pedido.
          </p>
        </div>

        {/* Historia & Identidad */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-blue-900 block">
                ¿Quiénes Somos?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug">
                Más que una tienda, un servicio transparente pensado para ti.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                POOL STORE nació en Chiclayo con el objetivo de simplificar la compra de prendas cotidianas de alta demanda. Notamos que muchos clientes querían comprar ropa cómoda y funcional sin tener que lidiar con procesos impersonales, precios inflados o incertidumbre en la entrega.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Comenzamos especializándonos en <strong>shorts clásicos y deportivos</strong> con una característica fundamental: bolsillos profundos con cierre para proteger el celular, llaves y billetera. Con 47 combinaciones de colores y modelos de clubes, hoy seguimos expandiendo nuestro catálogo para convertirnos en tu tienda virtual integral.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-700">
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Precios desde S/ 25
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Atención directa WhatsApp
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Envíos Shalom a todo el Perú
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">Nuestra Visión</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ser la tienda virtual favorita de los peruanos para adquirir prendas y productos básicos de uso diario, respaldados por una comunicación transparente, despacho inmediato y la mejor relación calidad-precio.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Desde Chiclayo para todo el territorio nacional.
              </div>
            </div>

          </div>
        </section>

        {/* 4 Pilares de Confianza */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
              Nuestros Valores
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Los pilares de POOL STORE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">1. Calidad Real</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Solo publicamos prendas que nosotros mismos usaríamos. Revisamos las costuras, los cierres y la elasticidad de cada lote antes de comercializarlo.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">2. Precios Honestos</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Precios directos de fábrica sin sobrecostos innecesarios. Premiamos a quienes compran por volumen (3 x S/ 69 y 12 x S/ 240).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">3. Compromiso de Entrega</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cumplimos los horarios y lugares acordados. Brindamos foto del paquete y número de remisión en cada envío a provincia.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">4. Trato Cercano</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Detrás de la pantalla hay personas reales dispuestas a asesorarte con tu talla exacta, resolver dudas y atender cambios con amabilidad.
              </p>
            </div>
          </div>
        </section>

        {/* Métodos de Pago y Seguridad */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>Facilidad de Pago</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                Paga de forma cómoda y segura
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Aceptamos pagos a través de los medios más usados en Perú: billeteras digitales como Yape y Plin, transferencias bancarias directas (BCP, Interbank, BBVA) y pago contraentrega en nuestros puntos céntricos de Chiclayo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="font-black text-sm text-purple-700 block">YAPE / PLIN</span>
                <span className="text-xs text-slate-700 font-bold block mt-1">903566655</span>
                <span className="text-[10px] text-slate-400 block">Inmediato sin comisiones</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="font-black text-sm text-blue-700 block">TRANSFERENCIAS</span>
                <span className="text-xs text-slate-700 font-bold block mt-1">BCP / BBVA / Interbank</span>
                <span className="text-[10px] text-slate-400 block">Cuentas verificadas</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Contacto */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            ¿Listo para hacer tu pedido?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Revisa nuestro catálogo de shorts activos o escríbenos directamente para asesorarte con las mejores combinaciones.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/productos"
              className="w-full sm:w-auto px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Ver catálogo de productos</span>
              <ArrowRight className="w-4 h-4 text-blue-900" />
            </Link>

            <a
              href={getWhatsAppUrl('¡Hola POOL STORE! Deseo consultar sobre sus productos y promociones.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chatear por WhatsApp ({POLESTORE_PHONE_DISPLAY})</span>
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
