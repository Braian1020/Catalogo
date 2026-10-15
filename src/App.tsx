/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SHORTS } from './data/shorts';
import { ShortProduct, Size } from './types';

// Teléfono oficial de WhatsApp de PoolStore
const WHATSAPP_NUM = '51903566655';
const TALLAS: Size[] = ['XS', 'S', 'M', 'L', 'XL'];

// Zonas para delivery gratis desde 3 unidades
const ZONAS_DELIVERY_GRATIS = [
  'José Leonardo Ortiz (JLO)',
  'Chiclayo',
  'Lambayeque',
  'La Victoria',
];

// Puntos de entrega desde 1 unidad
const PUNTOS_ENTREGA = [
  'La Catedral de Chiclayo',
  'Plaza Cívica de JLO',
  'Las Musas – Chiclayo',
];

interface ItemPedido {
  producto: ShortProduct;
  talla: Size;
  cantidad: number;
}

type TipoEntrega = 'delivery' | 'punto' | 'shalom';

// Precios oficiales de PoolStore:
// 1 unidad: S/ 15
// 6 unidades: S/ 81 (S/ 13.50 c/u)
// 12 unidades: S/ 144 (S/ 12.00 c/u - Mayorista)
function calcularTotales(cantidad: number): { total: number; precioUnitario: number; ahorro: number; promoTag: string } {
  if (cantidad <= 0) return { total: 0, precioUnitario: 15, ahorro: 0, promoTag: '' };

  if (cantidad >= 12) {
    const total = cantidad * 12;
    const regular = cantidad * 15;
    return {
      total,
      precioUnitario: 12,
      ahorro: regular - total,
      promoTag: 'Precio Docena (S/ 12 c/u)',
    };
  } else if (cantidad >= 6) {
    const total = cantidad * 13.5;
    const regular = cantidad * 15;
    return {
      total,
      precioUnitario: 13.5,
      ahorro: regular - total,
      promoTag: 'Promo 6+ shorts (S/ 13.50 c/u)',
    };
  } else {
    return {
      total: cantidad * 15,
      precioUnitario: 15,
      ahorro: 0,
      promoTag: 'S/ 15 c/u',
    };
  }
}

export default function App() {
  // Estado del pedido
  const [pedido, setPedido] = useState<ItemPedido[]>([]);
  // Talla y cantidad seleccionadas temporalmente en cada tarjeta
  const [tallas, setTallas] = useState<Record<string, Size>>({});
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  
  // Modales
  const [modalPedidoAbierto, setModalPedidoAbierto] = useState<boolean>(false);
  const [modalImagen, setModalImagen] = useState<ShortProduct | null>(null);
  const [modalTallas, setModalTallas] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Modalidad de entrega
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>('punto');
  const [zonaDelivery, setZonaDelivery] = useState<string>('Chiclayo');
  const [direccionDelivery, setDireccionDelivery] = useState<string>('');
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<string>('La Catedral de Chiclayo');
  const [destinoShalom, setDestinoShalom] = useState<string>('');

  // Cálculos globales
  const totalPrendas = pedido.reduce((acc, it) => acc + it.cantidad, 0);
  const { total: precioTotal, ahorro, promoTag } = calcularTotales(totalPrendas);
  const deliveryGratisHabilitado = totalPrendas >= 3;

  // Handlers para tarjetas
  const getTalla = (id: string): Size => tallas[id] || 'M';
  const getCantidad = (id: string): number => cantidades[id] || 1;

  const handleSeleccionarTalla = (id: string, talla: Size) => {
    setTallas((prev) => ({ ...prev, [id]: talla }));
  };

  const handleCambiarCantidad = (id: string, delta: number) => {
    setCantidades((prev) => {
      const val = prev[id] || 1;
      return { ...prev, [id]: Math.max(1, val + delta) };
    });
  };

  const handleAgregarAlPedido = (prod: ShortProduct) => {
    const t = getTalla(prod.id);
    const c = getCantidad(prod.id);

    setPedido((prev) => {
      const idx = prev.findIndex((it) => it.producto.id === prod.id && it.talla === t);
      if (idx > -1) {
        const copia = [...prev];
        copia[idx].cantidad += c;
        return copia;
      }
      return [...prev, { producto: prod, talla: t, cantidad: c }];
    });

    // Resetear cantidad a 1 y mostrar aviso
    setCantidades((prev) => ({ ...prev, [prod.id]: 1 }));
    setToast(`¡Agregado ${prod.title} (Talla ${t})!`);
    setTimeout(() => setToast(null), 2400);

    // Si alcanza 3 o más prendas y estaba en punto, habilitar delivery gratis
    if (totalPrendas + c >= 3 && tipoEntrega === 'punto') {
      setTipoEntrega('delivery');
    }
  };

  const handleActualizarItem = (index: number, delta: number) => {
    setPedido((prev) => {
      const copia = [...prev];
      const n = copia[index].cantidad + delta;
      if (n <= 0) return copia.filter((_, i) => i !== index);
      copia[index].cantidad = n;
      return copia;
    });
  };

  const handleEliminarItem = (index: number) => {
    setPedido((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSeleccionarTipoEntrega = (tipo: TipoEntrega) => {
    if (tipo === 'delivery' && !deliveryGratisHabilitado) {
      setToast('¡Agrega 3 o más shorts para Delivery GRATIS!');
      setTimeout(() => setToast(null), 2600);
      return;
    }
    setTipoEntrega(tipo);
  };

  // Generador de mensaje de WhatsApp
  const generarMensajeWhatsApp = () => {
    if (pedido.length === 0) return '';

    let txt = 'Hola PoolStore 👋, quiero realizar el siguiente pedido:\n\n';

    pedido.forEach((it) => {
      const nom = it.producto.title.startsWith('Short')
        ? it.producto.title
        : `Short ${it.producto.title}`;

      txt += `🩳 ${nom}\n`;
      txt += `Talla: ${it.talla}\n`;
      txt += `Cantidad: ${it.cantidad}\n\n`;
    });

    const precioStr = precioTotal % 1 === 0 ? precioTotal.toString() : precioTotal.toFixed(2);
    txt += `💰 Total: S/ ${precioStr} (${totalPrendas} ${totalPrendas === 1 ? 'short' : 'shorts'})\n`;

    if (tipoEntrega === 'delivery' && deliveryGratisHabilitado) {
      const ref = direccionDelivery.trim() ? ` (Dirección: ${direccionDelivery.trim()})` : '';
      txt += `🛵 Modalidad de entrega: Delivery GRATIS en ${zonaDelivery}${ref}\n\n`;
    } else if (tipoEntrega === 'shalom') {
      const dest = destinoShalom.trim() ? ` a ${destinoShalom.trim()}` : '';
      txt += `📦 Modalidad de entrega: Envío por Shalom${dest} (Costo a coordinar)\n\n`;
    } else {
      txt += `📍 Modalidad de entrega: Punto de entrega - ${puntoSeleccionado} (Horario a coordinar)\n\n`;
    }

    txt += '¿Me confirmas la disponibilidad y el horario?';
    return txt;
  };

  const handleEnviarWhatsApp = () => {
    const msg = generarMensajeWhatsApp();
    if (!msg) return;
    const url = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans pb-28">
      
      {/* ============================================================== */}
      {/* 1. CABECERA: POOLSTORE + Tu tienda virtual de confianza        */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-30 bg-white/98 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <a 
              href="#" 
              className="text-xl sm:text-2xl font-black tracking-widest text-neutral-950 uppercase leading-none hover:opacity-90 transition-opacity"
            >
              POOLSTORE
            </a>
            <span className="text-[11px] text-neutral-500 font-semibold italic mt-0.5 tracking-tight">
              Tu tienda virtual de confianza.
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setModalTallas(true)}
              className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-neutral-950 underline decoration-neutral-300 underline-offset-4 cursor-pointer"
            >
              Guía de Tallas
            </button>

            {/* Botón de Pedido */}
            <button
              type="button"
              onClick={() => setModalPedidoAbierto(true)}
              className="px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <span>Mi Pedido</span>
              {totalPrendas > 0 && (
                <span className="bg-white text-neutral-950 px-1.5 py-0.2 rounded-full text-[11px] font-black tabular-nums">
                  {totalPrendas}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notificación flotante rápida */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 text-white px-4 py-2 rounded-lg shadow-xl text-xs font-semibold animate-fade-in text-center max-w-sm">
          {toast}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SECCIÓN SUPERIOR: CATÁLOGO DE SHORTS + PRECIOS + ENTREGAS   */}
      {/* ============================================================== */}
      <section className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
              Shorts Deportivos
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              36 combinaciones en stock · Tallas XS, S, M, L y XL · Elige tus colores
            </p>
          </div>

          {/* Tarjeta de Precios Oficiales */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 flex items-center gap-3 sm:gap-4 text-xs self-start md:self-auto shadow-2xs">
            <div className="text-center px-1">
              <span className="block text-[10px] text-neutral-500 font-semibold">1 short</span>
              <strong className="text-sm font-black text-neutral-950">S/ 15</strong>
            </div>
            <div className="h-6 w-px bg-neutral-200" />
            <div className="text-center px-1">
              <span className="block text-[10px] text-neutral-500 font-semibold">6 shorts</span>
              <strong className="text-sm font-black text-neutral-950">S/ 81</strong>
            </div>
            <div className="h-6 w-px bg-neutral-200" />
            <div className="text-center px-1">
              <span className="block text-[10px] text-neutral-500 font-semibold">12 shorts</span>
              <strong className="text-sm font-black text-emerald-700">S/ 144</strong>
            </div>
          </div>
        </div>

        {/* Condiciones de Entrega */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2.5">
            <span className="text-lg">🛵</span>
            <div className="text-xs">
              <strong className="font-extrabold text-emerald-950 block">DELIVERY GRATIS desde 3 shorts</strong>
              <p className="text-emerald-800 mt-0.5">
                Chiclayo, JLO, Lambayeque y La Victoria.
              </p>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-start gap-2.5">
            <span className="text-lg">📍</span>
            <div className="text-xs">
              <strong className="font-extrabold text-neutral-950 block">PUNTOS DE ENTREGA desde 1 short</strong>
              <p className="text-neutral-600 mt-0.5">
                Catedral de Chiclayo, Plaza Cívica JLO o Las Musas.
              </p>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-start gap-2.5">
            <span className="text-lg">📦</span>
            <div className="text-xs">
              <strong className="font-extrabold text-neutral-950 block">ENVÍOS POR SHALOM</strong>
              <p className="text-neutral-600 mt-0.5">
                A todo el Perú. Costo coordinado por WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. CUADRÍCULA DE SHORTS (FOTOGRAFÍAS GRANDES Y ACCIONES)       */}
      {/* ============================================================== */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {SHORTS.map((short) => {
            const tActual = getTalla(short.id);
            const cActual = getCantidad(short.id);

            return (
              <article
                key={short.id}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                {/* Imagen del short */}
                <div
                  className="w-full aspect-[3/2] bg-neutral-50 flex items-center justify-center p-2.5 cursor-pointer relative group"
                  onClick={() => setModalImagen(short)}
                  title="Toca para ver en grande"
                >
                  <img
                    src={short.image}
                    alt={short.title}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                  <span className="absolute top-3 right-3 bg-neutral-950 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-xs">
                    S/ 15
                  </span>
                </div>

                {/* Info y Controles de Compra */}
                <div className="p-4 flex flex-col gap-3">
                  <div>
                    <h2 className="font-bold text-base text-neutral-950 capitalize leading-snug">
                      {short.title}
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Short deportivo con cordón ajustable
                    </p>
                  </div>

                  {/* Selector de Talla */}
                  <div>
                    <div className="flex justify-between text-xs text-neutral-600 mb-1.5 font-medium">
                      <span>Talla:</span>
                      <span className="font-bold text-neutral-950">{tActual}</span>
                    </div>

                    <div className="grid grid-cols-5 gap-1">
                      {TALLAS.map((talla) => (
                        <button
                          key={talla}
                          type="button"
                          onClick={() => handleSeleccionarTalla(short.id, talla)}
                          className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            tActual === talla
                              ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300'
                          }`}
                        >
                          {talla}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cantidad y Botón de Agregar */}
                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                    <div className="flex items-center border border-neutral-300 rounded-lg bg-neutral-50">
                      <button
                        type="button"
                        onClick={() => handleCambiarCantidad(short.id, -1)}
                        className="px-2.5 py-1.5 text-neutral-700 hover:bg-neutral-200 font-bold text-sm cursor-pointer"
                        title="Menos"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-neutral-950 tabular-nums">
                        {cActual}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCambiarCantidad(short.id, 1)}
                        className="px-2.5 py-1.5 text-neutral-700 hover:bg-neutral-200 font-bold text-sm cursor-pointer"
                        title="Más"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAgregarAlPedido(short)}
                      className="flex-1 py-2 px-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer active:scale-98"
                    >
                      Agregar ({tActual})
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* ============================================================== */}
      {/* 4. BARRA INFERIOR DE PEDIDO (Aparece al haber prendas)         */}
      {/* ============================================================== */}
      {totalPrendas > 0 && (
        <aside 
          aria-label="Resumen de pedido" 
          className="fixed bottom-0 inset-x-0 z-30 p-3 bg-neutral-950 text-white border-t border-neutral-800 shadow-2xl"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-extrabold tabular-nums">
                  {totalPrendas} {totalPrendas === 1 ? 'short' : 'shorts'} · S/ {precioTotal % 1 === 0 ? precioTotal : precioTotal.toFixed(2)}
                </p>
                {ahorro > 0 && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Ahorras S/ {ahorro % 1 === 0 ? ahorro : ahorro.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {deliveryGratisHabilitado ? (
                  <span className="text-emerald-400 font-semibold">🛵 ¡Delivery GRATIS habilitado!</span>
                ) : (
                  <span>📍 Puntos de entrega (Faltan {3 - totalPrendas} para Delivery Gratis)</span>
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalPedidoAbierto(true)}
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors shrink-0"
            >
              <span>Ver Pedido y Entrega</span>
              <span>→</span>
            </button>
          </div>
        </aside>
      )}

      {/* ============================================================== */}
      {/* 5. BOTÓN FLOTANTE DISCRETO DE WHATSAPP (903 566 655)           */}
      {/* ============================================================== */}
      <aside 
        aria-label="Chat de WhatsApp"
        className={`fixed z-20 right-4 sm:right-6 transition-all duration-200 ${
          totalPrendas > 0 ? 'bottom-20 sm:bottom-6' : 'bottom-5 sm:bottom-6'
        }`}
      >
        <a
          href={`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(
            'Hola PoolStore 👋, deseo realizar una consulta sobre sus shorts deportivos.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg hover:shadow-xl transition-transform active:scale-95"
          title="Hablar por WhatsApp con PoolStore (903 566 655)"
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </aside>

      {/* ============================================================== */}
      {/* 6. MODAL DE PEDIDO, SELECCIÓN DE ENTREGA Y ENVÍO A WHATSAPP    */}
      {/* ============================================================== */}
      {modalPedidoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60">
          <div
            className="absolute inset-0"
            onClick={() => setModalPedidoAbierto(false)}
          />

          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-title"
            className="relative bg-white w-full max-w-lg rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[92vh] flex flex-col z-10"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h2 id="order-title" className="text-lg font-bold text-neutral-950">
                  Tu Pedido PoolStore
                </h2>
                <p className="text-xs text-neutral-500">
                  {totalPrendas} {totalPrendas === 1 ? 'short' : 'shorts'} · Total: <strong>S/ {precioTotal % 1 === 0 ? precioTotal : precioTotal.toFixed(2)}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalPedidoAbierto(false)}
                className="text-neutral-400 hover:text-neutral-950 font-bold text-lg p-1 cursor-pointer"
                aria-label="Cerrar pedido"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
              {pedido.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-sm">
                  <p>Aún no has agregado ningún short.</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Selecciona tu talla y presiona «Agregar».
                  </p>
                </div>
              ) : (
                <>
                  {/* Lista de productos */}
                  <div className="space-y-2">
                    {pedido.map((it, idx) => (
                      <div
                        key={`${it.producto.id}-${it.talla}-${idx}`}
                        className="flex items-center justify-between gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200"
                      >
                        <img
                          src={it.producto.image}
                          alt={it.producto.title}
                          className="w-13 h-10 object-contain bg-white rounded border border-neutral-200 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-neutral-900 truncate capitalize">
                            {it.producto.title}
                          </p>
                          <p className="text-xs text-neutral-600 font-semibold">
                            Talla: {it.talla}
                          </p>
                        </div>

                        <div className="flex items-center border border-neutral-300 rounded bg-white">
                          <button
                            type="button"
                            onClick={() => handleActualizarItem(idx, -1)}
                            className="px-2 py-0.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-neutral-950 tabular-nums">
                            {it.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleActualizarItem(idx, 1)}
                            className="px-2 py-0.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleEliminarItem(idx)}
                          className="text-neutral-400 hover:text-red-600 font-bold text-sm px-1 cursor-pointer"
                          title="Quitar"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Resumen de Costos y Promociones */}
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs">
                    <div className="flex justify-between items-center text-neutral-600">
                      <span>Cantidad de shorts:</span>
                      <strong className="text-neutral-950">{totalPrendas}</strong>
                    </div>
                    {ahorro > 0 && (
                      <div className="flex justify-between items-center text-emerald-700 mt-1 font-semibold">
                        <span>Descuento por volumen:</span>
                        <strong>- S/ {ahorro % 1 === 0 ? ahorro : ahorro.toFixed(2)}</strong>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm font-extrabold text-neutral-950 pt-2 border-t border-neutral-200 mt-2">
                      <span>Total a pagar:</span>
                      <span className="text-emerald-700">S/ {precioTotal % 1 === 0 ? precioTotal : precioTotal.toFixed(2)}</span>
                    </div>
                    {promoTag && (
                      <span className="inline-block text-[11px] text-neutral-500 mt-1 font-medium">
                        {promoTag}
                      </span>
                    )}
                  </div>

                  {/* SELECCIÓN DE MODALIDAD DE ENTREGA */}
                  <div className="border border-neutral-200 rounded-xl p-3.5 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-xs text-neutral-900 uppercase tracking-wide">
                        Modalidad de Entrega
                      </h3>
                      {deliveryGratisHabilitado ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          🛵 Delivery GRATIS Activo
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-[11px]">
                          Faltan {3 - totalPrendas} para Delivery Gratis
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleSeleccionarTipoEntrega('delivery')}
                        className={`py-2 px-1 text-center rounded-md font-bold text-xs transition-colors cursor-pointer ${
                          tipoEntrega === 'delivery'
                            ? 'bg-white text-emerald-700 shadow-xs'
                            : deliveryGratisHabilitado
                            ? 'text-neutral-700 hover:text-neutral-950'
                            : 'text-neutral-400 opacity-60'
                        }`}
                      >
                        🛵 Delivery {deliveryGratisHabilitado ? 'GRATIS' : '(Desde 3)'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSeleccionarTipoEntrega('punto')}
                        className={`py-2 px-1 text-center rounded-md font-bold text-xs transition-colors cursor-pointer ${
                          tipoEntrega === 'punto'
                            ? 'bg-white text-neutral-950 shadow-xs'
                            : 'text-neutral-700 hover:text-neutral-950'
                        }`}
                      >
                        📍 Puntos de Entrega
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSeleccionarTipoEntrega('shalom')}
                        className={`py-2 px-1 text-center rounded-md font-bold text-xs transition-colors cursor-pointer ${
                          tipoEntrega === 'shalom'
                            ? 'bg-white text-neutral-950 shadow-xs'
                            : 'text-neutral-700 hover:text-neutral-950'
                        }`}
                      >
                        📦 Shalom
                      </button>
                    </div>

                    {/* Caso A: Delivery Gratis */}
                    {tipoEntrega === 'delivery' && deliveryGratisHabilitado && (
                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-2.5">
                        <p className="font-bold text-emerald-950">
                          Selecciona tu zona de Delivery GRATIS:
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {ZONAS_DELIVERY_GRATIS.map((zona) => (
                            <button
                              key={zona}
                              type="button"
                              onClick={() => setZonaDelivery(zona)}
                              className={`py-1.5 px-2 rounded-lg border text-left font-semibold text-xs cursor-pointer ${
                                zonaDelivery === zona
                                  ? 'bg-emerald-700 text-white border-emerald-700'
                                  : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-400'
                              }`}
                            >
                              ✓ {zona}
                            </button>
                          ))}
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                            Dirección o referencia (opcional):
                          </label>
                          <input
                            type="text"
                            value={direccionDelivery}
                            onChange={(e) => setDireccionDelivery(e.target.value)}
                            placeholder="Ej: Av. Balta 450 / Urb. Santa Victoria"
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-emerald-600"
                          />
                        </div>
                      </div>
                    )}

                    {tipoEntrega === 'delivery' && !deliveryGratisHabilitado && (
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                        <p className="font-bold text-neutral-800">
                          El delivery gratis aplica a partir de 3 shorts.
                        </p>
                        <p className="mt-1">
                          Actualmente tienes {totalPrendas}. ¡Agrega {3 - totalPrendas} short(s) más para no pagar delivery en Chiclayo, JLO, Lambayeque o La Victoria!
                        </p>
                      </div>
                    )}

                    {/* Caso B: Puntos de Entrega */}
                    {tipoEntrega === 'punto' && (
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
                        <p className="font-bold text-neutral-800">
                          Elige tu punto de entrega:
                        </p>
                        <div className="space-y-1.5">
                          {PUNTOS_ENTREGA.map((punto) => (
                            <label
                              key={punto}
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                puntoSeleccionado === punto
                                  ? 'bg-neutral-950 text-white border-neutral-950'
                                  : 'bg-white text-neutral-800 border-neutral-200'
                              }`}
                            >
                              <input
                                type="radio"
                                name="punto_entrega"
                                checked={puntoSeleccionado === punto}
                                onChange={() => setPuntoSeleccionado(punto)}
                                className="accent-neutral-950"
                              />
                              <span className="font-semibold text-xs">{punto}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-[11px] text-neutral-500 italic">
                          ℹ️ Los horarios de encuentro se coordinan directamente por WhatsApp.
                        </p>
                      </div>
                    )}

                    {/* Caso C: Shalom */}
                    {tipoEntrega === 'shalom' && (
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
                        <p className="font-bold text-neutral-800">
                          Envíos a otros destinos por Agencia Shalom:
                        </p>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                            Ciudad o Provincia de destino:
                          </label>
                          <input
                            type="text"
                            value={destinoShalom}
                            onChange={(e) => setDestinoShalom(e.target.value)}
                            placeholder="Ej: Piura, Trujillo, Lima, Cajamarca..."
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-neutral-900"
                          />
                        </div>
                        <p className="text-[11px] text-neutral-500 italic">
                          ℹ️ El costo de envío por Shalom se coordina y cotiza por WhatsApp.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Vista previa del mensaje */}
                  <div className="pt-2">
                    <p className="text-xs font-bold text-neutral-700 mb-1">
                      Mensaje preparado para enviar al 903 566 655:
                    </p>
                    <pre className="bg-neutral-100 p-3 rounded-lg text-xs font-mono text-neutral-800 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                      {generarMensajeWhatsApp()}
                    </pre>
                  </div>
                </>
              )}
            </div>

            {/* Botón WhatsApp de envío */}
            {pedido.length > 0 && (
              <div className="pt-3 border-t border-neutral-200 space-y-2">
                <button
                  type="button"
                  onClick={handleEnviarWhatsApp}
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Enviar pedido por WhatsApp</span>
                </button>
                <p className="text-[11px] text-neutral-400 text-center">
                  Se enviará al 903 566 655 con el detalle de prendas y modalidad de entrega.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. MODAL DE FOTO EN TAMAÑO COMPLETO                            */}
      {/* ============================================================== */}
      {modalImagen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-fade-in"
          onClick={() => setModalImagen(null)}
        >
          <div
            className="relative bg-white max-w-2xl w-full rounded-2xl overflow-hidden p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h3 className="font-bold text-sm capitalize text-neutral-950">
                {modalImagen.title} · S/ 15
              </h3>
              <button
                type="button"
                onClick={() => setModalImagen(null)}
                className="text-neutral-400 hover:text-neutral-950 font-bold text-base p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="w-full aspect-[3/2] flex items-center justify-center py-2">
              <img
                src={modalImagen.image}
                alt={modalImagen.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  handleAgregarAlPedido(modalImagen);
                  setModalImagen(null);
                }}
                className="px-4 py-2.5 bg-neutral-950 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 cursor-pointer"
              >
                Agregar este short ({getTalla(modalImagen.id)}) al pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. MODAL DE GUÍA DE TALLAS                                     */}
      {/* ============================================================== */}
      {modalTallas && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in"
          onClick={() => setModalTallas(false)}
        >
          <div
            className="bg-white max-w-sm w-full rounded-2xl p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <h3 className="font-bold text-base text-neutral-950">Guía de Tallas</h3>
              <button
                type="button"
                onClick={() => setModalTallas(false)}
                className="text-neutral-400 hover:text-neutral-950 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-3 text-xs text-neutral-600 space-y-2">
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="font-bold text-neutral-950">XS</span>
                <span className="font-semibold text-neutral-700">Talla 36</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="font-bold text-neutral-950">S</span>
                <span className="font-semibold text-neutral-700">Talla 38</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="font-bold text-neutral-950">M</span>
                <span className="font-semibold text-neutral-700">Talla 40</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="font-bold text-neutral-950">L</span>
                <span className="font-semibold text-neutral-700">Talla 42</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-bold text-neutral-950">XL</span>
                <span className="font-semibold text-neutral-700">Talla 44</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalTallas(false)}
              className="mt-3 w-full py-2.5 bg-neutral-950 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. PIE DE PÁGINA LIMPIO Y ELEGANTE                             */}
      {/* ============================================================== */}
      <footer className="mt-16 text-center text-xs text-neutral-400 py-8 border-t border-neutral-100">
        <p className="font-extrabold text-neutral-900 tracking-widest uppercase">POOLSTORE</p>
        <p className="italic text-neutral-500 mt-0.5">Tu tienda virtual de confianza.</p>
        <p className="text-[11px] text-neutral-400 mt-1">
          Chiclayo · JLO · Lambayeque · La Victoria · Envíos por Shalom al 903 566 655
        </p>
      </footer>
    </div>
  );
}
