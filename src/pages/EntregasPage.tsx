import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { getWhatsAppUrl } from '../utils/whatsapp';
import {
  MapPin,
  Truck,
  Clock,
  MessageCircle,
  Package,
  Sparkles,
} from 'lucide-react';

interface PuntoEncuentro {
  id: string;
  nombre: string;
  detalle: string;
  referencia: string;
}

const PUNTOS_ENTREGA_CHICLAYO: PuntoEncuentro[] = [
  {
    id: 'plaza_civica',
    nombre: 'Plaza Cívica',
    detalle: 'José Leonardo Ortiz',
    referencia: 'Frente a la Municipalidad distrital',
  },
  {
    id: 'catedral',
    nombre: 'Catedral de Chiclayo',
    detalle: 'Parque Principal',
    referencia: 'Atrio central / calle San José con Balta',
  },
  {
    id: 'banco_nacion',
    nombre: 'Banco de la Nación',
    detalle: 'José Leonardo Ortiz',
    referencia: 'Sede distrital / zona céntrica',
  },
  {
    id: 'plazuela',
    nombre: 'La Plazuela',
    detalle: 'Plazuela Elías Aguirre',
    referencia: 'Calle Elías Aguirre con San José',
  },
];

export default function EntregasPage() {
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<string>('Plaza Cívica');

  useEffect(() => {
    document.title = 'Puntos de Entrega y Envíos | POOL STORE Chiclayo & Perú';
    const description =
      'Entrega sin costo en Plaza Cívica, Catedral, Banco de la Nación y La Plazuela. Delivery en Chiclayo a S/ 1.50 por km desde Balta y Arica, y envíos Shalom a todo el Perú.';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Puntos de Entrega y Envíos | POOL STORE');

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

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-10">
        
        {/* Encabezado */}
        <div className="border-b border-slate-200 pb-6 text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Entregas Chiclayo & Envíos Perú</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Puntos de Entrega y Envíos
          </h1>

          <p className="text-xs sm:text-sm text-slate-600">
            Puntos de recojo en Chiclayo sin costo adicional, delivery a domicilio y envíos nacionales por Shalom.
          </p>
        </div>

        {/* 1. PUNTOS CÉNTRICOS EN CHICLAYO */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 block">
                Recojo presencial
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                Puntos de Entrega en Chiclayo
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              ✓ Entrega sin costo adicional
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PUNTOS_ENTREGA_CHICLAYO.map((p) => {
              const isSelected = puntoSeleccionado === p.nombre;
              return (
                <div
                  key={p.id}
                  onClick={() => setPuntoSeleccionado(p.nombre)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-slate-900 shadow-md ring-2 ring-slate-950/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Seleccionado
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-slate-950 leading-snug">
                      {p.nombre}
                    </h3>
                    <p className="text-xs font-semibold text-slate-700">
                      {p.detalle}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {p.referencia}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400 text-[11px]">Costo:</span>
                    <span className="text-emerald-700">¡Gratis!</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coordinación por WhatsApp */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Horario de entregas en Chiclayo</p>
                <p className="text-[11px] text-slate-300">
                  Lunes a Sábado previa confirmación por WhatsApp en el punto acordado.
                </p>
              </div>
            </div>

            <a
              href={getWhatsAppUrl(`¡Hola POOL STORE! Deseo coordinar la entrega de mi pedido en ${puntoSeleccionado}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Coordinar en {puntoSeleccionado}</span>
            </a>
          </div>
        </section>

        {/* 2. DELIVERY A DOMICILIO EN CHICLAYO */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Atención y entregas en Chiclayo</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Delivery a Domicilio en Chiclayo
              </h2>

              <p className="text-sm font-semibold text-slate-800">
                Llevamos tus pedidos a domicilio en Chiclayo y zonas cercanas.
              </p>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                El costo de envío se confirma por WhatsApp según tu dirección o ubicación.
              </p>

              <div className="pt-1 flex items-center gap-2 text-xs text-emerald-700 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¡Delivery GRATIS en Chiclayo a partir de 3 prendas!</span>
              </div>
            </div>

            <div className="shrink-0 flex sm:justify-end">
              <a
                href={getWhatsAppUrl('Hola Pool Store, quiero consultar el costo de delivery a mi dirección.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span>Consultar delivery por WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* 3. ENVÍOS A TODO EL PERÚ POR SHALOM */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-blue-400 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-950">Envíos a todo el Perú por Shalom</h3>
              <p className="text-xs text-slate-500">
                Despachos diarios con embalaje sellado y foto de guía de remisión para retiro en la agencia Shalom de tu provincia.
              </p>
            </div>
          </div>

          <Link
            to="/productos"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
          >
            Ver catálogo de productos
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
}
