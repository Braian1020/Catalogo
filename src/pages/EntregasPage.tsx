import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { MapaEntregaChiclayo } from '../components/MapaEntregaChiclayo';
import { POLESTORE_PHONE_DISPLAY, getWhatsAppUrl } from '../utils/whatsapp';
import {
  MapPin,
  Truck,
  Clock,
  MessageCircle,
  Package,
  Navigation,
} from 'lucide-react';

export default function EntregasPage() {
  useEffect(() => {
    document.title = 'Entregas y Envíos | POOL STORE Chiclayo & Perú';
    const description =
      'Entrega en Plaza Cívica de José Leonardo Ortiz, delivery en Chiclayo a S/ 1.50 por km desde Balta y Arica, y envíos a todo el Perú por Shalom.';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Entregas y Envíos | POOL STORE');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <Breadcrumbs
        items={[{ label: 'Entregas y Envíos' }]}
        showBackButton
        backFallbackPath="/"
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-8">
        
        {/* Encabezado directo */}
        <div className="border-b border-slate-200 pb-6 text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Entregas Chiclayo & Envíos Perú</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Modalidades de Entrega
          </h1>

          <p className="text-xs sm:text-sm text-slate-600">
            Coordinación directa, rápida y sin complicaciones.
          </p>
        </div>

        {/* 2 Opciones Directas: Punto Plaza Cívica & Delivery por Km */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Opción 1: Plaza Cívica */}
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-900 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Sin costo adicional
                </span>
              </div>

              <h2 className="text-xl font-black text-slate-950">
                Plaza Cívica
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                Punto de encuentro acordado en la <strong>Plaza Cívica de José Leonardo Ortiz</strong> (frente a la Municipalidad distrital).
              </p>

              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-700 border border-slate-100">
                <div className="flex items-center gap-2 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Horario de entrega:</span>
                </div>
                <p className="text-slate-600 pl-5 text-[11px]">
                  Lunes a Sábado previa coordinación por WhatsApp.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <a
                href={getWhatsAppUrl('¡Hola POOL STORE! Deseo coordinar la entrega de mi pedido en Plaza Cívica.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Coordinar en Plaza Cívica</span>
              </a>
            </div>
          </div>

          {/* Opción 2: Delivery por Km */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
                  <Navigation className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  S/ 1.50 por km
                </span>
              </div>

              <h2 className="text-xl font-black text-slate-950">
                Delivery a Domicilio en Chiclayo
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                Envíos directos a tu casa, oficina o local en Chiclayo y distritos cercanos calculados a <strong>S/ 1.50 por kilómetro</strong> desde el centro de Chiclayo (<strong>Av. Balta y Av. Arica</strong>).
              </p>

              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-700 border border-slate-100">
                <span className="font-semibold block">Punto de salida:</span>
                <p className="text-slate-600 text-[11px]">
                  Av. José Balta con Av. Arica (Centro de Chiclayo).
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <a
                href={getWhatsAppUrl('¡Hola POOL STORE! Deseo cotizar mi delivery a domicilio desde Balta y Arica.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Cotizar delivery a mi dirección</span>
              </a>
            </div>
          </div>

        </div>

        {/* Mapa y Calculador de Distancia */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-slate-950">
                Calculador de Distancia en Chiclayo
              </h3>
              <p className="text-xs text-slate-500">
                Punto central de referencia: Av. Balta y Av. Arica. Tarifa: S/ 1.50 por kilómetro.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <MapaEntregaChiclayo onCambioEntrega={() => {}} />
          </div>
        </div>

        {/* Envíos Nacionales Shalom */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-blue-400 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-950">Envíos a todo el Perú por Shalom</h3>
              <p className="text-xs text-slate-500">
                Despachos diarios con embalaje sellado y foto de guía de remisión para retiro en agencia de tu provincia.
              </p>
            </div>
          </div>

          <Link
            to="/productos"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
          >
            Ver productos
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
