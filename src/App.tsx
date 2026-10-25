/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SHORTS_POLIESTER,
  COLORES_SHORT_POLIESTER,
  COLOR_HEX_MAP,
  getRayasPorColorShort,
  findProductoPoliester,
  estaTallaDisponible,
  getImagenColorShort,
  getProductosPorColorShort,
} from './data/productos';
import { Producto, Talla, ItemCarrito, TALLAS_DISPONIBLES, GUIA_TALLAS } from './types';
import {
  generarMensajeWhatsApp,
  getWhatsAppUrl,
  POLESTORE_PHONE_DISPLAY,
} from './utils/whatsapp';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Check,
  Lock,
  Truck,
  Package,
  Ruler,
  X,
  MessageCircle,
  ChevronRight,
  Copy,
  CheckCheck,
  MapPin,
  Compass,
  Store,
  CreditCard,
  Phone,
} from 'lucide-react';

/**
 * Icono SVG deportivo específico para Shorts:
 * Muestra pretina con elástico, silueta deportiva, corte de pierna, rayas y cordones.
 */
function ShortsIcon({
  className = 'w-6 h-6',
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 5h16l-.8 3.5H4.8L4 5z" fill="currentColor" fillOpacity="0.2" />
      <path d="M4 5l1.6 14h4.8l1.6-8 1.6 8h4.8L20 5H4z" />
      <path d="M11 6v3" />
      <path d="M13 6v3" />
      <path d="M6.8 9.5l.8 6.5" strokeOpacity="0.6" strokeWidth="1.5" />
      <path d="M17.2 9.5l-.8 6.5" strokeOpacity="0.6" strokeWidth="1.5" />
    </svg>
  );
}

const STORAGE_KEY_CARRITO = 'polestore_carrito_v2';

export type ModalidadEntrega = 'domicilio' | 'punto_centrico' | 'shalom';
export type MetodoPago = 'contraentrega' | 'yape';

export const PUNTOS_CENTRICOS_CHICLAYO = [
  {
    id: 'real_plaza',
    nombre: 'Real Plaza Chiclayo',
    detalle: 'Av. Bolognesi / Patio de Comidas',
    icono: '🛍️',
  },
  {
    id: 'plazuela',
    nombre: 'Plazuela Elías Aguirre',
    detalle: 'Calle Elías Aguirre / Frente a la fuente central',
    icono: '🌳',
  },
  {
    id: 'catedral',
    nombre: 'Catedral de Chiclayo',
    detalle: 'Parque Principal de Chiclayo / Frente al atrio',
    icono: '⛪',
  },
  {
    id: 'modelo',
    nombre: 'Mercado Modelo / Av. Balta',
    detalle: 'Av. Balta con Arica (Punto Central)',
    icono: '🏢',
  },
  {
    id: 'otro',
    nombre: 'Otro punto céntrico a coordinar',
    detalle: 'Coordinamos la ubicación exacta por WhatsApp',
    icono: '🤝',
  },
];

export default function App() {
  // 1. CARRITO CON PERSISTENCIA EN LOCALSTORAGE
  const [carrito, setCarrito] = useState<ItemCarrito[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CARRITO);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CARRITO, JSON.stringify(carrito));
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
    }
  }, [carrito]);

  // 2. ESTADOS DE MODALES Y NOTIFICACIONES
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState<boolean>(false);
  const [modalFoto, setModalFoto] = useState<Producto | null>(null);
  const [modalGuiaTallas, setModalGuiaTallas] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const mostrarToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // 3. ESTADO INDEPENDIENTE POR CADA ARTÍCULO / COLOR DE SHORT (3 POR FILA)
  interface EstadoArticulo {
    colorRayas: string;
    talla: Talla;
    cantidad: number;
  }

  const [estadoArticulos, setEstadoArticulos] = useState<Record<string, EstadoArticulo>>(() => {
    const inicial: Record<string, EstadoArticulo> = {};
    COLORES_SHORT_POLIESTER.forEach((color) => {
      const rayas = getRayasPorColorShort(color);
      const primeraRaya = rayas[0] || '';
      const prod = findProductoPoliester(color, primeraRaya);
      const primeraTalla: Talla =
        prod && prod.tallasDisponibles.length > 0
          ? prod.tallasDisponibles.includes('M')
            ? 'M'
            : prod.tallasDisponibles[0]
          : 'M';

      inicial[color] = {
        colorRayas: primeraRaya,
        talla: primeraTalla,
        cantidad: 1,
      };
    });
    return inicial;
  });

  const handleCambiarRayaArticulo = useCallback((colorShort: string, raya: string) => {
    setEstadoArticulos((prev) => {
      const actual = prev[colorShort] || { colorRayas: raya, talla: 'M', cantidad: 1 };
      const prod = findProductoPoliester(colorShort, raya);
      let tallaActualizada = actual.talla;
      if (prod && !estaTallaDisponible(prod, tallaActualizada)) {
        if (prod.tallasDisponibles.length > 0) {
          tallaActualizada = prod.tallasDisponibles[0];
        }
      }
      return {
        ...prev,
        [colorShort]: {
          ...actual,
          colorRayas: raya,
          talla: tallaActualizada,
        },
      };
    });
  }, []);

  const handleCambiarTallaArticulo = useCallback((colorShort: string, talla: Talla) => {
    setEstadoArticulos((prev) => {
      const actual = prev[colorShort];
      if (!actual) return prev;
      return {
        ...prev,
        [colorShort]: {
          ...actual,
          talla,
        },
      };
    });
  }, []);

  const handleCambiarCantidadArticulo = useCallback((colorShort: string, delta: number) => {
    setEstadoArticulos((prev) => {
      const actual = prev[colorShort];
      if (!actual) return prev;
      const nueva = Math.max(1, actual.cantidad + delta);
      return {
        ...prev,
        [colorShort]: {
          ...actual,
          cantidad: nueva,
        },
      };
    });
  }, []);

  // 4. MODALIDADES DE ENTREGA Y PAGO
  const [modalidadEntrega, setModalidadEntrega] = useState<ModalidadEntrega>('domicilio');
  const [direccionEntrega, setDireccionEntrega] = useState<string>('');
  const [referenciaEntrega, setReferenciaEntrega] = useState<string>('');
  const [puntoCentrico, setPuntoCentrico] = useState<string>(PUNTOS_CENTRICOS_CHICLAYO[0].nombre);
  const [destinoShalom, setDestinoShalom] = useState<string>('');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('contraentrega');
  const [yapeCopiado, setYapeCopiado] = useState<boolean>(false);

  const copiarNumeroYape = useCallback(() => {
    navigator.clipboard.writeText('903566655');
    setYapeCopiado(true);
    mostrarToast('¡Número Yape copiado: 903566655!');
    setTimeout(() => setYapeCopiado(false), 2500);
  }, [mostrarToast]);

  // 5. CÁLCULO AUTOMÁTICO DE PRECIOS Y PROMOCIONES
  const totalPrendas = useMemo(() => {
    return carrito.reduce((acc, it) => acc + it.cantidad, 0);
  }, [carrito]);

  const prendasPoliester = useMemo(() => {
    return carrito
      .filter((it) => it.producto.tipoTela === 'poliester')
      .reduce((acc, it) => acc + it.cantidad, 0);
  }, [carrito]);

  // Precios por volumen (1-5 = S/ 15, 6-11 = S/ 13.50, 12+ = S/ 12.00)
  const precioUnitarioPoliester = useMemo(() => {
    if (prendasPoliester >= 12) return 12.0;
    if (prendasPoliester >= 6) return 13.5;
    return 15.0;
  }, [prendasPoliester]);

  // Delivery gratis desbloqueado desde 3 shorts
  const deliveryGratisDesbloqueado = totalPrendas >= 3;

  // Si es a domicilio: gratis desde 3 shorts, o tarifa estimada de S/ 4.00 (3 a 5 soles según zona)
  const costoEnvioAplicado = useMemo(() => {
    if (modalidadEntrega === 'domicilio') {
      return deliveryGratisDesbloqueado ? 0 : 4.0;
    }
    return 0; // punto céntrico o shalom
  }, [modalidadEntrega, deliveryGratisDesbloqueado]);

  const { totalGeneral, subtotalPrendas, subtotalRegular, ahorroTotal } = useMemo(() => {
    let subtotal = 0;
    let regular = 0;

    carrito.forEach((it) => {
      subtotal += precioUnitarioPoliester * it.cantidad;
      regular += 15.0 * it.cantidad;
    });

    return {
      subtotalPrendas: subtotal,
      totalGeneral: subtotal + costoEnvioAplicado,
      subtotalRegular: regular,
      ahorroTotal: Math.max(0, regular - subtotal),
    };
  }, [carrito, precioUnitarioPoliester, costoEnvioAplicado]);

  const detallesEntrega = useMemo(() => {
    const textoPago =
      metodoPago === 'yape'
        ? '📱 Pago por Yape al 903566655 (Pool Store)'
        : '💵 Pago Contraentrega al recibir (Efectivo o Yape)';

    if (modalidadEntrega === 'domicilio') {
      const costoTxt = deliveryGratisDesbloqueado
        ? '¡GRATIS por promo desde 3 shorts!'
        : 'S/ 4.00 (S/ 3 a S/ 5 según zona en Chiclayo)';

      return [
        `📍 *Modalidad:* A Domicilio (Contraentrega)`,
        direccionEntrega.trim()
          ? `• Dirección: ${direccionEntrega.trim()}`
          : `• Dirección: (A coordinar por chat)`,
        referenciaEntrega.trim()
          ? `• Referencia: ${referenciaEntrega.trim()}`
          : null,
        `• Costo de delivery: ${costoTxt}`,
        `• Forma de pago: ${textoPago}`,
      ]
        .filter(Boolean)
        .join('\n');
    }

    if (modalidadEntrega === 'punto_centrico') {
      return [
        `📍 *Modalidad:* Punto Céntrico de Entrega (Gratis)`,
        `• Punto de encuentro: ${puntoCentrico}`,
        `• Costo de delivery: S/ 0.00 (Sin recargo)`,
        `• Forma de pago: ${textoPago}`,
      ].join('\n');
    }

    return [
      `📦 *Modalidad:* Envío Shalom (A coordinar)`,
      `• Destino / Agencia: ${destinoShalom.trim() || 'A coordinar'}`,
      `• Costo de flete: Pago en destino Shalom`,
      `• Forma de pago: ${textoPago}`,
    ].join('\n');
  }, [
    modalidadEntrega,
    direccionEntrega,
    referenciaEntrega,
    puntoCentrico,
    deliveryGratisDesbloqueado,
    metodoPago,
    destinoShalom,
  ]);

  // 6. ACCIONES DEL CARRITO
  const handleAgregarAlCarrito = useCallback(
    (producto: Producto, talla: Talla, cantidad: number) => {
      if (!estaTallaDisponible(producto, talla)) {
        mostrarToast(`La talla ${talla} no está disponible para este modelo.`);
        return;
      }

      setCarrito((prev) => {
        const idItem = `${producto.id}-${talla}`;
        const indexExistente = prev.findIndex((it) => it.id === idItem);

        if (indexExistente > -1) {
          const copia = [...prev];
          copia[indexExistente] = {
            ...copia[indexExistente],
            cantidad: copia[indexExistente].cantidad + cantidad,
          };
          return copia;
        }

        return [
          ...prev,
          {
            id: idItem,
            producto,
            talla,
            cantidad,
          },
        ];
      });

      mostrarToast(`¡Agregado: ${producto.nombre} (${talla})!`);
    },
    [mostrarToast]
  );

  const handleModificarCantidad = useCallback((idItem: string, delta: number) => {
    setCarrito((prev) => {
      return prev
        .map((it) => {
          if (it.id === idItem) {
            const nuevaCantidad = it.cantidad + delta;
            return nuevaCantidad > 0 ? { ...it, cantidad: nuevaCantidad } : null;
          }
          return it;
        })
        .filter((it): it is ItemCarrito => it !== null);
    });
  }, []);

  const handleEliminarItem = useCallback(
    (idItem: string) => {
      setCarrito((prev) => prev.filter((it) => it.id !== idItem));
      mostrarToast('Producto eliminado del pedido.');
    },
    [mostrarToast]
  );

  const handleVaciarCarrito = useCallback(() => {
    setCarrito([]);
    mostrarToast('Pedido vaciado.');
  }, [mostrarToast]);

  // 7. ENVÍO POR WHATSAPP
  const handleComprarPorWhatsApp = useCallback(() => {
    if (carrito.length === 0) {
      mostrarToast('Tu pedido está vacío. Elige tus shorts antes de enviar.');
      return;
    }

    const mensaje = generarMensajeWhatsApp(
      carrito,
      totalGeneral,
      precioUnitarioPoliester,
      detallesEntrega
    );
    const url = getWhatsAppUrl(mensaje);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [carrito, totalGeneral, precioUnitarioPoliester, detallesEntrega, mostrarToast]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-montserrat selection:bg-slate-900 selection:text-white relative overflow-x-hidden">
      {/* TOAST FLOTANTE */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl border border-slate-800 animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* CABECERA PRINCIPAL: ESTILO BLANCO VENDEDOR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
        {/* Banner de confianza superior vendedor */}
        <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 text-center font-bold tracking-wide flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap">
          <span className="text-emerald-400">🛵 Delivery Gratis desde 3 shorts</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-200">📍 Chiclayo, JLO, Lambayeque y La Victoria</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-200">📦 Envíos por Shalom a todo el Perú</span>
        </div>

        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo e Identidad: Blanco y Negro con toque retail */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm font-black">
              <ShortsIcon className="w-5 h-5 text-white" strokeWidth={2.4} />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-widest text-slate-900 block leading-none">
                POOL STORE
              </span>
              <span className="text-[10px] text-emerald-700 font-extrabold tracking-wide uppercase block mt-0.5">
                Tienda Virtual Oficial
              </span>
            </div>
          </div>

          {/* Acciones: Guía de Tallas y Carrito */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setModalGuiaTallas(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition-all cursor-pointer border border-slate-200 shadow-xs"
            >
              <Ruler className="w-3.5 h-3.5 text-slate-600" />
              <span>Guía de Tallas</span>
            </button>

            <button
              type="button"
              onClick={() => setModalCarritoAbierto(true)}
              className="relative px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95"
              aria-label="Ver pedido"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>Mi Pedido</span>
              <span className="text-white">🛒</span>
              {totalPrendas > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none tabular-nums shadow-xs">
                  {totalPrendas}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL: PRESENTACIÓN DIRECTA DE SHORTS CLÁSICOS */}
      <main className="flex-1 relative py-6 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 space-y-8 relative z-10 animate-fade-in">
          {/* TÍTULO Y PROMOCIONES */}
          <div className="space-y-4">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider shadow-xs">
                <ShortsIcon className="w-3 h-3 text-emerald-700" />
                <span>Calidad y Confección Garantizada · Tela Polistrech</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mt-2 tracking-tight">
                Shorts Clásicos Pool Store
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl font-medium leading-relaxed">
                Shorts deportivos lisos en tela Polistrech de poliéster. Confección fresca, elástico duradero y cordón de ajuste. Elige tus colores, rayas y talla con descuento por cantidad:
              </p>
            </div>

            {/* TABLA DE PRECIOS Y PROMOCIONES DESTACADA: ESTILO VENDEDOR */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center text-xs">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 text-slate-900 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
                <span className="text-slate-500 block text-[11px] font-bold">Precio por menor (1 a 5)</span>
                <strong className="text-slate-900 text-xl font-black mt-1">S/ 15.00 c/u</strong>
                <span className="text-slate-400 text-[10px] mt-1 font-medium">Ideal para probar la prenda</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500 text-slate-900 shadow-md relative overflow-hidden flex flex-col justify-between ring-2 ring-emerald-500/10">
                <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider py-0.5 px-3 rounded-b-md inline-block mx-auto mb-1">
                  🔥 Más Pedido · Ahorra S/ 9.00
                </span>
                <span className="text-slate-700 block text-[11px] font-extrabold">Promoción desde 6 unidades</span>
                <strong className="text-emerald-700 text-xl font-black mt-0.5">S/ 13.50 c/u (6 = S/ 81)</strong>
                <span className="text-emerald-700 text-[10px] mt-1 font-bold">¡Ahorras S/ 1.50 por prenda! + Delivery Gratis</span>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-900 shadow-lg relative overflow-hidden flex flex-col justify-between">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider py-0.5 px-3 rounded-b-md inline-block mx-auto mb-1">
                  🔥 Mejor Precio · Ahorra S/ 36.00
                </span>
                <span className="text-slate-300 block text-[11px] font-extrabold uppercase tracking-wide">
                  Precio Docena (12 a más)
                </span>
                <strong className="text-amber-400 text-xl font-black mt-0.5">S/ 12.00 c/u (12 = S/ 144)</strong>
                <span className="text-slate-300 text-[10px] mt-1 font-semibold">¡Ahorras S/ 3.00 por prenda! + Delivery Gratis</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              CATÁLOGO DE SHORTS (3 POR FILA):
              - Cada tarjeta tiene sus propios botones de rayas (cambian la foto en vivo)
              - Botones de tallas directos
              - Botón para agregar al carrito directamente
              - Se elimina por completo la "selección combinada" separada
              ======================================================== */}
          <section className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider block">
                  Catálogo Oficial Pool Store · Tela Polistrech (S/ 15 c/u)
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Shorts Clásicos por Color
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Elige tus rayas y tu talla directamente en cada modelo para agregarlo al carrito:
                </p>
              </div>
              <span className="text-xs text-slate-500 font-bold shrink-0">
                {COLORES_SHORT_POLIESTER.length} colores · 36 combinaciones
              </span>
            </div>

            {/* Cuadrícula de artículos: 3 POR FILA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {COLORES_SHORT_POLIESTER.map((color) => {
                const config = estadoArticulos[color] || { colorRayas: '', talla: 'M', cantidad: 1 };
                const rayasDelColor = getRayasPorColorShort(color);
                const prodActual =
                  findProductoPoliester(color, config.colorRayas) ||
                  SHORTS_POLIESTER.find((s) => s.colorShort === color) ||
                  SHORTS_POLIESTER[0];
                const styleInfo = COLOR_HEX_MAP[color] || { bg: '#333333', text: '#ffffff' };

                return (
                  <article
                    key={color}
                    id={`articulo-${color.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                  >
                    <div>
                      {/* Cabecera del artículo */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full shrink-0 border border-black/15 shadow-2xs"
                            style={{ backgroundColor: styleInfo.bg }}
                          />
                          <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                            Short {color}
                          </h3>
                        </div>
                        <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-xs">
                          S/ 15.00
                        </span>
                      </div>

                      {/* Fotografía del short que cambia en tiempo real al tocar cada raya */}
                      <div
                        className="w-full aspect-[4/3] bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center cursor-pointer group relative overflow-hidden my-3 hover:bg-slate-100/70 transition-colors shadow-2xs"
                        onClick={() => setModalFoto(prodActual)}
                        title="Toca para ampliar foto"
                      >
                        <img
                          key={prodActual.id}
                          src={prodActual.imagen}
                          alt={prodActual.nombre}
                          className="w-full h-full object-contain group-hover:scale-105 transition-all duration-300 animate-fade-in"
                        />

                        {/* Etiquetas sobre la imagen */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                          <span className="bg-white/95 text-slate-900 border border-slate-200 text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">
                            Tela Polistrech
                          </span>
                          {prodActual.tallasDisponibles.length === 1 && (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5 text-amber-800" /> Solo Talla {prodActual.tallasDisponibles[0]}
                            </span>
                          )}
                        </div>

                        <span className="absolute bottom-2.5 right-2.5 bg-slate-900/80 text-white text-[9px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          🔍 Ampliar
                        </span>
                      </div>

                      {/* Nombre específico del modelo según rayas */}
                      <p className="text-center text-xs text-slate-700 font-bold mb-3.5 truncate">
                        {prodActual.nombre}
                      </p>

                      {/* 1. Botones de colores de rayas (Debajo de cada artículo) */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-slate-900 text-xs">
                            Rayas disponibles ({rayasDelColor.length}):
                          </span>
                          <strong className="text-emerald-700 font-black text-xs">
                            Rayas {config.colorRayas}
                          </strong>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {rayasDelColor.map((raya) => {
                            const esRayaActiva = config.colorRayas === raya;
                            const prodRaya = findProductoPoliester(color, raya);
                            const colorRayaInfo = COLOR_HEX_MAP[raya] || { bg: '#111', text: '#fff' };

                            return (
                              <button
                                key={raya}
                                type="button"
                                onClick={() => handleCambiarRayaArticulo(color, raya)}
                                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 text-left min-h-[42px] ${
                                  esRayaActiva
                                    ? 'border-slate-900 bg-slate-900 text-white font-black shadow-xs ring-2 ring-slate-900/10'
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                                }`}
                              >
                                <div
                                  className={`w-7 h-7 rounded-lg shrink-0 border p-0.5 flex items-center justify-center overflow-hidden ${
                                    esRayaActiva ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                                  }`}
                                >
                                  {prodRaya?.imagen ? (
                                    <img
                                      src={prodRaya.imagen}
                                      alt={`Rayas ${raya}`}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <span
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: colorRayaInfo.bg }}
                                    />
                                  )}
                                </div>
                                <span className="truncate">{raya}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Botones de Talla (Debajo para seleccionar la talla) */}
                      <div className="space-y-2 pt-3">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900 text-xs">Talla:</span>
                            <button
                              type="button"
                              onClick={() => setModalGuiaTallas(true)}
                              className="text-xs text-emerald-700 hover:underline font-bold"
                            >
                              (Guía)
                            </button>
                          </div>
                          <strong className="text-slate-900 font-black text-xs bg-slate-100 px-2 py-0.5 rounded">
                            Talla {config.talla}
                          </strong>
                        </div>

                        <div className="grid grid-cols-6 gap-1.5">
                          {TALLAS_DISPONIBLES.map((talla) => {
                            const disponible = estaTallaDisponible(prodActual, talla);
                            const esTallaActiva = config.talla === talla;

                            if (!disponible) {
                              return (
                                <button
                                  key={talla}
                                  type="button"
                                  disabled
                                  title={`Talla ${talla} no disponible`}
                                  className="py-2.5 rounded-xl text-xs font-bold border border-dashed border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed line-through"
                                >
                                  {talla}
                                </button>
                              );
                            }

                            return (
                              <button
                                key={talla}
                                type="button"
                                onClick={() => handleCambiarTallaArticulo(color, talla)}
                                className={`py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                                  esTallaActiva
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs scale-105'
                                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-900 hover:bg-slate-50'
                                }`}
                              >
                                {talla}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* 3. Selector de Cantidad y Botón para Agregar al Carrito */}
                    <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 shadow-2xs h-11">
                        <button
                          type="button"
                          onClick={() => handleCambiarCantidadArticulo(color, -1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-200 rounded-lg font-bold cursor-pointer transition-colors"
                          title="Menos"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs sm:text-sm font-black text-slate-900 tabular-nums">
                          {config.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCambiarCantidadArticulo(color, 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-200 rounded-lg font-bold cursor-pointer transition-colors"
                          title="Más"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleAgregarAlCarrito(prodActual, config.talla, config.cantidad)
                        }
                        className="flex-1 h-11 px-4 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-98"
                      >
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>AGREGAR (S/ 15)</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* BENEFICIOS Y GARANTÍAS DE POOL STORE: BLANCO VENDEDOR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                <Truck className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <strong className="text-slate-900 block font-black">Delivery Gratis</strong>
                <span className="text-slate-500 text-[11px]">En compras desde 3 shorts en Chiclayo y distritos</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                <Package className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <strong className="text-slate-900 block font-black">Envíos por Shalom</strong>
                <span className="text-slate-500 text-[11px]">Despacho diario con clave y guía a todo el Perú</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                <MessageCircle className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <strong className="text-slate-900 block font-black">Atención WhatsApp</strong>
                <span className="text-slate-500 text-[11px]">Trato directo, fotos y confirmación inmediata</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================
          DRAWER LATERAL DEL CARRITO DE COMPRAS: BLANCO VENDEDOR
          ======================================================== */}
      {modalCarritoAbierto && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in font-montserrat">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setModalCarritoAbierto(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className="w-screen max-w-md bg-white text-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200">
              {/* Cabecera del Carrito */}
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 tracking-wide">Tu Pedido Pool Store</h2>
                    <p className="text-xs text-slate-500">
                      {totalPrendas === 0
                        ? 'Carrito vacío'
                        : `${totalPrendas} ${totalPrendas === 1 ? 'prenda seleccionada' : 'prendas seleccionadas'}`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalCarritoAbierto(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                  aria-label="Cerrar pedido"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lista de Productos en el Carrito */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {carrito.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-inner">
                      <ShoppingBag className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Tu carrito está vacío</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Elige tus colores y tallas de shorts clásicos para armar tu pedido.
                    </p>
                    <button
                      type="button"
                      onClick={() => setModalCarritoAbierto(false)}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-black rounded-xl text-xs transition-all cursor-pointer shadow-md"
                    >
                      Elegir Shorts
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Artículos agregados
                      </span>
                      <button
                        type="button"
                        onClick={handleVaciarCarrito}
                        className="text-[11px] text-red-600 hover:text-red-700 hover:underline cursor-pointer transition-colors font-medium"
                      >
                        Vaciar carrito
                      </button>
                    </div>

                    {carrito.map((item) => {
                      const p = item.producto;
                      const subtotalItem = precioUnitarioPoliester * item.cantidad;

                      return (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl flex items-center gap-3 transition-colors"
                        >
                          <img
                            src={p.imagen}
                            alt={p.nombre}
                            className="w-14 h-14 object-contain bg-white rounded-xl border border-slate-200 shrink-0 p-1"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-xs text-slate-900 truncate">
                              {p.nombre}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Color: {p.colorShort} · Rayas: {p.colorRayas}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded shadow-xs">
                                Talla {item.talla}
                              </span>
                              <span className="text-xs font-black text-slate-900">
                                S/ {subtotalItem.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1.5">
                            <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleModificarCantidad(item.id, -1)}
                                className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold text-slate-900 tabular-nums">
                                {item.cantidad}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleModificarCantidad(item.id, 1)}
                                className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleEliminarItem(item.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* MODALIDAD DE ENTREGA EN CARRITO: SIMPLE Y DIRECTO */}
                    <div className="pt-4 border-t border-slate-200 space-y-3.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-900 tracking-wide">
                          Modalidad de Entrega:
                        </span>
                        {deliveryGratisDesbloqueado && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                            Delivery Gratis
                          </span>
                        )}
                      </div>

                      {/* 3 BOTONES PRINCIPALES DE ENTREGA */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setModalidadEntrega('domicilio')}
                          className={`p-3 rounded-2xl border text-center font-black cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                            modalidadEntrega === 'domicilio'
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Truck className="w-4 h-4" />
                          <span className="leading-tight text-xs">A Domicilio</span>
                          <span className={`text-[10px] ${modalidadEntrega === 'domicilio' ? 'text-emerald-300 font-extrabold' : 'text-slate-500'}`}>
                            {deliveryGratisDesbloqueado ? 'Gratis' : 'S/ 3 a 5'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setModalidadEntrega('punto_centrico')}
                          className={`p-3 rounded-2xl border text-center font-black cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                            modalidadEntrega === 'punto_centrico'
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                          <span className="leading-tight text-xs">Punto Céntrico</span>
                          <span className={`text-[10px] ${modalidadEntrega === 'punto_centrico' ? 'text-emerald-300 font-extrabold' : 'text-emerald-600 font-bold'}`}>
                            Gratis S/ 0
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setModalidadEntrega('shalom')}
                          className={`p-3 rounded-2xl border text-center font-black cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                            modalidadEntrega === 'shalom'
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Package className="w-4 h-4" />
                          <span className="leading-tight text-xs">Shalom</span>
                          <span className={`text-[10px] ${modalidadEntrega === 'shalom' ? 'text-slate-300' : 'text-slate-500'}`}>
                            A coordinar
                          </span>
                        </button>
                      </div>

                      {/* CONTENIDO SIMPLE SEGÚN LA MODALIDAD SELECCIONADA */}
                      {modalidadEntrega === 'domicilio' && (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 text-xs animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-slate-900 text-[11px] uppercase tracking-wider">
                              Datos de entrega a domicilio:
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              {deliveryGratisDesbloqueado ? '¡Delivery Gratis!' : 'Tarifa: S/ 4.00 (S/ 3 a 5 segun zona)'}
                            </span>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                              Dirección de entrega:
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: Ca. San José 450, Urb. Santa Victoria"
                              value={direccionEntrega}
                              onChange={(e) => setDireccionEntrega(e.target.value)}
                              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                              Referencia (opcional):
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: Frente al parque, portón negro, casa de 2 pisos"
                              value={referenciaEntrega}
                              onChange={(e) => setReferenciaEntrega(e.target.value)}
                              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs"
                            />
                          </div>
                        </div>
                      )}

                      {modalidadEntrega === 'punto_centrico' && (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs animate-fade-in">
                          <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider block">
                            Selecciona el punto de encuentro:
                          </span>
                          <div className="space-y-1.5">
                            {PUNTOS_CENTRICOS_CHICLAYO.map((pto) => {
                              const seleccionado = puntoCentrico === pto.nombre;
                              return (
                                <button
                                  key={pto.id}
                                  type="button"
                                  onClick={() => setPuntoCentrico(pto.nombre)}
                                  className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2.5 ${
                                    seleccionado
                                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-slate-900/10'
                                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                                  }`}
                                >
                                  <span className="text-base">{pto.icono}</span>
                                  <div className="flex-1 min-w-0">
                                    <strong className="block text-xs font-black">
                                      {pto.nombre}
                                    </strong>
                                    <span
                                      className={`text-[10px] block truncate ${
                                        seleccionado ? 'text-slate-300' : 'text-slate-500'
                                      }`}
                                    >
                                      {pto.detalle}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                      seleccionado
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-emerald-50 text-emerald-700'
                                    }`}
                                  >
                                    Gratis
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {modalidadEntrega === 'shalom' && (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 animate-fade-in">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Ciudad o Agencia Shalom de destino:
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Trujillo, Piura, Lima, Cajamarca, etc."
                            value={destinoShalom}
                            onChange={(e) => setDestinoShalom(e.target.value)}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs"
                          />
                          <p className="text-[10px] text-slate-500">
                            📦 Despachamos diariamente con pago de flete en destino Shalom.
                          </p>
                        </div>
                      )}

                      {/* SECCIÓN DE MÉTODO DE PAGO: YAPE O CONTRAENTREGA */}
                      <div className="pt-3 border-t border-slate-200 space-y-2">
                        <span className="text-xs font-black text-slate-800 block">
                          Forma de Pago:
                        </span>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setMetodoPago('contraentrega')}
                            className={`p-2.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                              metodoPago === 'contraentrega'
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-black text-xs">
                              <span>💵</span>
                              <span>Contraentrega</span>
                            </div>
                            <span
                              className={`text-[10px] ${
                                metodoPago === 'contraentrega' ? 'text-slate-300' : 'text-slate-500'
                              }`}
                            >
                              Pagas al recibir
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setMetodoPago('yape')}
                            className={`p-2.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                              metodoPago === 'yape'
                                ? 'bg-[#742284] text-white border-[#742284] shadow-sm ring-2 ring-[#742284]/20'
                                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-black text-xs">
                              <span>📱</span>
                              <span>Pagar con Yape</span>
                            </div>
                            <span
                              className={`text-[10px] font-bold ${
                                metodoPago === 'yape' ? 'text-teal-200' : 'text-[#742284]'
                              }`}
                            >
                              903566655
                            </span>
                          </button>
                        </div>

                        {/* TARJETA VISUAL DE YAPE SI ELIGE YAPE */}
                        {metodoPago === 'yape' && (
                          <div className="p-3.5 bg-gradient-to-br from-[#742284] to-[#51135c] text-white rounded-2xl shadow-md space-y-2 animate-fade-in">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="bg-teal-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                                  Yape Oficial
                                </span>
                                <span className="block text-xl font-black mt-1 tracking-wider">
                                  903 566 655
                                </span>
                                <span className="text-[11px] text-purple-200 block font-medium">
                                  Titular: Pool Store / Pool
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={copiarNumeroYape}
                                className="px-3 py-1.5 bg-white text-[#742284] hover:bg-teal-50 rounded-xl text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                              >
                                {yapeCopiado ? (
                                  <>
                                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>¡Copiado!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copiar</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-[10px] text-purple-200/90 leading-tight">
                              Puedes yapar ahora o coordinarlo por WhatsApp enviando la captura de comprobante.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Pie del Carrito: Totales y Botón COMPRAR POR WHATSAPP */}
              {carrito.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3 shadow-lg">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal Shorts ({totalPrendas}):</span>
                      <span className="font-bold">S/ {subtotalPrendas.toFixed(2)}</span>
                    </div>

                    {ahorroTotal > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                        <span>Ahorro aplicado por cantidad:</span>
                        <span>- S/ {ahorroTotal.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600">
                      <span>
                        Entrega ({modalidadEntrega === 'domicilio' ? 'A Domicilio' : modalidadEntrega === 'punto_centrico' ? 'Punto Céntrico' : 'Shalom'}):
                      </span>
                      <span className="font-bold text-slate-900">
                        {modalidadEntrega === 'punto_centrico'
                          ? 'S/ 0.00 (Gratis)'
                          : modalidadEntrega === 'domicilio'
                          ? deliveryGratisDesbloqueado
                            ? 'S/ 0.00 (¡Gratis por 3+!)'
                            : `+ S/ ${costoEnvioAplicado.toFixed(2)}`
                          : 'Pago en destino'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-1.5 border-t border-slate-100">
                      <span>Total General a Pagar:</span>
                      <span className="text-2xl text-slate-900 font-black">
                        S/ {totalGeneral.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleComprarPorWhatsApp}
                    className="w-full py-4 px-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white text-base font-black rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-white" />
                    <span>COMPRAR POR WHATSAPP</span>
                  </button>

                  <p className="text-[10px] text-slate-500 text-center">
                    Se abrirá WhatsApp ({POLESTORE_PHONE_DISPLAY}) con el detalle completo de tus prendas, ubicación de entrega y método de pago ({metodoPago === 'yape' ? 'Yape 903566655' : 'Contraentrega'}).
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE FOTO EN ALTA RESOLUCIÓN */}
      {modalFoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in font-montserrat"
          onClick={() => setModalFoto(null)}
        >
          <div
            className="relative bg-white border border-slate-200 text-slate-900 max-w-xl w-full rounded-3xl p-6 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{modalFoto.nombre}</h3>
                <span className="text-xs text-slate-500">
                  {modalFoto.colorShort} · Rayas {modalFoto.colorRayas} · S/ {modalFoto.precio.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalFoto(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-[4/3] bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center p-2 my-4">
              <img
                src={modalFoto.imagen}
                alt={modalFoto.nombre}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setModalFoto(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCambiarRayaArticulo(modalFoto.colorShort, modalFoto.colorRayas);
                  setModalFoto(null);
                  const cardId = `articulo-${modalFoto.colorShort.toLowerCase().replace(/\s+/g, '-')}`;
                  const cardElem = document.getElementById(cardId);
                  if (cardElem) {
                    cardElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer"
              >
                <span>Elegir este modelo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE GUÍA DE MEDIDAS Y TALLAS */}
      {modalGuiaTallas && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in font-montserrat"
          onClick={() => setModalGuiaTallas(false)}
        >
          <div
            className="bg-white border border-slate-200 text-slate-900 max-w-sm w-full rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-slate-700" />
                <span>Guía de Tallas Pool Store</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalGuiaTallas(false)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabla Poliéster */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[11px] font-extrabold uppercase text-slate-600 tracking-wider block">
                Shorts Clásicos (Tela Polistrech)
              </span>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-slate-50">
                {Object.entries(GUIA_TALLAS).map(([t, info]) => (
                  <div key={t} className="flex justify-between p-2.5">
                    <span className="font-black text-slate-900">Talla {t}</span>
                    <span className="text-slate-600">{info.tallaNumero} (Cintura {info.cintura} cm)</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalGuiaTallas(false)}
              className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* BARRA INFERIOR FIJA EN MÓVILES CUANDO HAY PRODUCTOS */}
      {totalPrendas > 0 && !modalCarritoAbierto && (
        <aside aria-label="Resumen de pedido móvil" className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg animate-fade-in font-montserrat">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">
                {totalPrendas} {totalPrendas === 1 ? 'prenda' : 'prendas'} seleccionadas
              </span>
              <strong className="text-base font-black text-slate-900">
                S/ {totalGeneral.toFixed(2)}
              </strong>
            </div>

            <button
              type="button"
              onClick={() => setModalCarritoAbierto(true)}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>Ver Pedido</span>
            </button>
          </div>
        </aside>
      )}

      {/* BOTÓN FLOTANTE DE WHATSAPP PERMANENTE */}
      <a
        href={getWhatsAppUrl(
          carrito.length > 0
            ? generarMensajeWhatsApp(carrito, totalGeneral, precioUnitarioPoliester, detallesEntrega)
            : 'Hola Pool Store 👋, deseo consultar sobre los shorts deportivos de su catálogo.'
        )}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed z-40 transition-all duration-300 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-black rounded-full shadow-2xl p-3.5 sm:px-5 sm:py-3.5 ring-4 ring-white/90 hover:shadow-emerald-500/40 cursor-pointer ${
          totalPrendas > 0 ? 'bottom-20 right-4 sm:bottom-6 sm:right-6' : 'bottom-5 right-5 sm:bottom-6 sm:right-6'
        }`}
        aria-label="Chatear por WhatsApp"
        title="WhatsApp: +51 903 566 655"
      >
        <MessageCircle className="w-6 h-6 fill-white text-white shrink-0" />
        <span className="hidden sm:inline text-xs tracking-wide">
          WhatsApp 903 566 655
        </span>
        {totalPrendas > 0 && (
          <span className="sm:hidden absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            {totalPrendas}
          </span>
        )}
      </a>

      {/* PIE DE PÁGINA */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500 space-y-2 font-montserrat">
        <p className="font-black text-slate-900 tracking-widest text-sm uppercase">
          POOL STORE
        </p>
        <p className="italic text-slate-600">Tu tienda virtual de confianza.</p>
        <p className="text-[11px] text-slate-500">
          Chiclayo · José Leonardo Ortiz · Lambayeque · La Victoria · Envíos por Shalom a todo el Perú
        </p>
        <p className="text-[10px] text-slate-400">
          WhatsApp oficial: {POLESTORE_PHONE_DISPLAY}
        </p>
      </footer>
    </div>
  );
}
