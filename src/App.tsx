/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SHORTS_POLIESTER,
  SHORTS_WIN,
  COLORES_SHORT_POLIESTER,
  COLOR_HEX_MAP,
  getRayasPorColorShort,
  findProductoPoliester,
  estaTallaDisponible,
  GRUPOS_SHORTS_WIN,
  GrupoShortWin,
  VersionShortWin,
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
  Truck,
  Package,
  Ruler,
  X,
  ChevronRight,
  Copy,
  MapPin,
  Search,
  ZoomIn,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Filter,
  Menu,
  Clock,
  Users,
  MessageCircle,
  Home,
  CheckCircle2,
} from 'lucide-react';

/**
 * Icono de shorts deportivos
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
      <path d="M4 5h16l-.8 3.5H4.8L4 5z" fill="currentColor" fillOpacity="0.15" />
      <path d="M4 5l1.6 14h4.8l1.6-8 1.6 8h4.8L20 5H4z" />
      <path d="M11 6v3" />
      <path d="M13 6v3" />
      <path d="M6.8 9.5l.8 6.5" strokeOpacity="0.6" strokeWidth="1.5" />
      <path d="M17.2 9.5l-.8 6.5" strokeOpacity="0.6" strokeWidth="1.5" />
    </svg>
  );
}

const STORAGE_KEY_CARRITO = 'poolstore_carrito_v3';

export type CategoriaActiva = 'todos' | 'clasicos' | 'deportivos';
export type ModalidadEntrega = 'domicilio' | 'punto_centrico' | 'shalom';
export type MetodoPago = 'contraentrega' | 'yape';

// PUNTOS DE ENTREGA EN CHICLAYO SOLICITADOS
export const PUNTOS_CENTRICOS_CHICLAYO = [
  {
    id: 'plaza_civica',
    nombre: 'Plaza Cívica',
    detalle: 'Punto céntrico de encuentro en Chiclayo',
    icono: '🏛️',
  },
  {
    id: 'catedral',
    nombre: 'Catedral',
    detalle: 'Parque Principal de Chiclayo / Atrio central',
    icono: '⛪',
  },
  {
    id: 'banco_nacion',
    nombre: 'Banco de la Nación',
    detalle: 'Zona céntrica de Chiclayo',
    icono: '🏦',
  },
  {
    id: 'plazuela',
    nombre: 'Plazuela',
    detalle: 'Plazuela Elías Aguirre',
    icono: '🌳',
  },
  {
    id: 'zonas_cercanas',
    nombre: 'Zonas cercanas',
    detalle: 'Previa coordinación por WhatsApp',
    icono: '📍',
  },
];

interface EstadoArticuloClasico {
  colorRayas: string;
  talla: Talla;
  cantidad: number;
}

export default function App() {
  // 1. CARRITO CON PERSISTENCIA
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

  // 2. NAVEGACIÓN Y FILTROS
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaActiva>('clasicos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState<boolean>(false);
  const [modalFoto, setModalFoto] = useState<Producto | null>(null);
  const [modalGuiaTallas, setModalGuiaTallas] = useState<boolean>(false);
  const [modalTelasAbierto, setModalTelasAbierto] = useState<boolean>(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const mostrarToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Función para navegación suave entre secciones
  const navegarA = useCallback((id: string) => {
    setMenuMovilAbierto(false);
    if (id === 'mi-pedido') {
      setModalCarritoAbierto(true);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // 3. ESTADOS INDEPENDIENTES DE PRODUCTOS
  const [estadoClasicos, setEstadoClasicos] = useState<Record<string, EstadoArticuloClasico>>(() => {
    const inicial: Record<string, EstadoArticuloClasico> = {};
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

  interface EstadoGrupoWin {
    versionId: string;
    cantidad: number;
    talla: Talla;
  }

  const [estadoGruposWin, setEstadoGruposWin] = useState<Record<string, EstadoGrupoWin>>(() => {
    const inicial: Record<string, EstadoGrupoWin> = {};
    GRUPOS_SHORTS_WIN.forEach((g) => {
      const v1 = g.versiones[0];
      inicial[g.id] = {
        versionId: v1 ? v1.id : '',
        cantidad: 1,
        talla: 'L',
      };
    });
    return inicial;
  });

  const handleCambiarRayaClasico = useCallback((colorShort: string, raya: string) => {
    setEstadoClasicos((prev) => {
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

  const handleCambiarTallaClasico = useCallback((colorShort: string, talla: Talla) => {
    setEstadoClasicos((prev) => {
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

  const handleCambiarCantidadClasico = useCallback((colorShort: string, delta: number) => {
    setEstadoClasicos((prev) => {
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

  const handleCambiarVersionWin = useCallback((grupoId: string, versionId: string) => {
    setEstadoGruposWin((prev) => {
      const actual = prev[grupoId];
      if (!actual) return prev;
      return {
        ...prev,
        [grupoId]: {
          ...actual,
          versionId,
        },
      };
    });
  }, []);

  const handleCambiarCantidadWin = useCallback((grupoId: string, delta: number) => {
    setEstadoGruposWin((prev) => {
      const actual = prev[grupoId] || {
        versionId: '',
        cantidad: 1,
        talla: 'L',
      };
      const nueva = Math.max(1, actual.cantidad + delta);
      return {
        ...prev,
        [grupoId]: {
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

  // 5. CÁLCULO DE TOTALES Y PRECIOS POR VOLUMEN
  const totalPrendas = useMemo(() => {
    return carrito.reduce((acc, it) => acc + it.cantidad, 0);
  }, [carrito]);

  const prendasPoliester = useMemo(() => {
    return carrito
      .filter((it) => it.producto.tipoTela === 'poliester')
      .reduce((acc, it) => acc + it.cantidad, 0);
  }, [carrito]);

  const prendasWin = useMemo(() => {
    return carrito
      .filter((it) => it.producto.tipoTela === 'win')
      .reduce((acc, it) => acc + it.cantidad, 0);
  }, [carrito]);

  // Precios por volumen (Shorts Clásicos): 1-5 a S/ 15 | 6-11 a S/ 13.50 | 12+ a S/ 12.00
  const precioUnitarioPoliester = useMemo(() => {
    if (prendasPoliester >= 12) return 12.0;
    if (prendasPoliester >= 6) return 13.5;
    return 15.0;
  }, [prendasPoliester]);

  // Precios por volumen (Shorts Deportivos Tela Win): 1x a S/ 25 | 3x a S/ 69 (S/ 23 c/u) | 12x a S/ 240 (S/ 20 c/u)
  const precioUnitarioWin = useMemo(() => {
    if (prendasWin >= 12) return 20.0;
    if (prendasWin >= 3) return 23.0;
    return 25.0;
  }, [prendasWin]);

  // Delivery gratis en domicilio desde 3 prendas
  const deliveryGratisDesbloqueado = totalPrendas >= 3;

  const costoEnvioAplicado = useMemo(() => {
    if (modalidadEntrega === 'domicilio') {
      return deliveryGratisDesbloqueado ? 0 : 4.0;
    }
    return 0; // punto céntrico o shalom sin cargo local
  }, [modalidadEntrega, deliveryGratisDesbloqueado]);

  const { totalGeneral, subtotalPrendas, subtotalRegular, ahorroTotal } = useMemo(() => {
    let subtotal = 0;
    let regular = 0;

    carrito.forEach((it) => {
      const isWin = it.producto.tipoTela === 'win';
      const unit = isWin ? precioUnitarioWin : precioUnitarioPoliester;
      const reg = isWin ? 25.0 : 15.0;

      subtotal += unit * it.cantidad;
      regular += reg * it.cantidad;
    });

    return {
      subtotalPrendas: subtotal,
      totalGeneral: subtotal + costoEnvioAplicado,
      subtotalRegular: regular,
      ahorroTotal: Math.max(0, regular - subtotal),
    };
  }, [carrito, precioUnitarioPoliester, precioUnitarioWin, costoEnvioAplicado]);

  const detallesEntrega = useMemo(() => {
    const textoPago =
      metodoPago === 'yape'
        ? '📱 Pago por Yape al 903566655 (Pool Store)'
        : '💵 Pago Contraentrega al recibir (Efectivo o Yape)';

    if (modalidadEntrega === 'domicilio') {
      const costoTxt = deliveryGratisDesbloqueado
        ? '¡GRATIS por promo desde 3 shorts!'
        : 'S/ 4.00 (Tarifa Chiclayo / JLO / La Victoria)';

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
      `📦 *Modalidad:* Envío Shalom (Provincias)`,
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

      mostrarToast(`¡Agregado al pedido: ${producto.nombre} (${talla})!`);
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

  const handleComprarPorWhatsApp = useCallback(() => {
    if (carrito.length === 0) {
      mostrarToast('Tu pedido está vacío. Elige tus shorts antes de enviar.');
      return;
    }

    const mensaje = generarMensajeWhatsApp({
      items: carrito,
      total: totalGeneral,
      subtotalPrendas,
      ahorroTotal,
      costoEnvio: costoEnvioAplicado,
      precioUnitarioPoliester,
      precioUnitarioWin,
      modalidadEntrega,
      direccionEntrega,
      referenciaEntrega,
      puntoCentrico,
      destinoShalom,
      metodoPago,
    });
    const url = getWhatsAppUrl(mensaje);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [
    carrito,
    totalGeneral,
    subtotalPrendas,
    ahorroTotal,
    costoEnvioAplicado,
    precioUnitarioPoliester,
    precioUnitarioWin,
    modalidadEntrega,
    direccionEntrega,
    referenciaEntrega,
    puntoCentrico,
    destinoShalom,
    metodoPago,
    mostrarToast,
  ]);

  // 7. FILTRADO DE CATÁLOGO
  const q = busqueda.trim().toLowerCase();

  const coloresClasicosFiltrados = useMemo(() => {
    if (categoriaActiva === 'deportivos') return [];
    if (!q) return COLORES_SHORT_POLIESTER;

    return COLORES_SHORT_POLIESTER.filter((color) => {
      if (color.toLowerCase().includes(q)) return true;
      const rayas = getRayasPorColorShort(color);
      return rayas.some((r) => r.toLowerCase().includes(q));
    });
  }, [categoriaActiva, q]);

  const gruposWinFiltrados = useMemo(() => {
    if (categoriaActiva === 'clasicos') return [];
    if (!q) return GRUPOS_SHORTS_WIN;

    return GRUPOS_SHORTS_WIN.filter((g) => {
      if (g.nombreBase.toLowerCase().includes(q) || g.equipo.toLowerCase().includes(q)) {
        return true;
      }
      return g.versiones.some((v) => {
        const p = v.producto;
        return (
          v.etiqueta.toLowerCase().includes(q) ||
          v.subtitulo.toLowerCase().includes(q) ||
          p.nombre.toLowerCase().includes(q) ||
          p.modelo.toLowerCase().includes(q) ||
          p.colorShort.toLowerCase().includes(q) ||
          p.colorRayas.toLowerCase().includes(q)
        );
      });
    });
  }, [categoriaActiva, q]);

  const totalResultados = coloresClasicosFiltrados.length + gruposWinFiltrados.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-montserrat selection:bg-slate-900 selection:text-white relative overflow-x-hidden">
      {/* TOAST FLOTANTE */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* 1. MARQUESINA CONTINUA DE COBERTURA Y PRECIOS */}
      <div className="bg-slate-900 text-white text-xs py-2 overflow-hidden border-b border-slate-800 select-none">
        <div className="animate-marquee gap-8 items-center cursor-default">
          <span className="inline-flex items-center gap-6 text-[11px] sm:text-xs font-semibold tracking-wide">
            <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <Truck className="w-3.5 h-3.5" /> Delivery a Domicilio en Chiclayo, JLO, La Victoria y Lambayeque
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> Puntos Céntricos: Plaza Cívica · Catedral · Banco de la Nación · Plazuela · Zonas cercanas (S/ 0 Gratis)
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-300 font-bold">
              🏷️ Shorts Clásicos: 1x S/ 15 · 6x S/ 13.50 · Docena S/ 12.00
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-300 font-bold">
              ⚽ Shorts Win: 1x S/ 25 · 3x S/ 69 · Docena S/ 240
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-200 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-emerald-400" /> Envíos diarios a todo el Perú por Shalom
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-blue-300 font-bold">
              📱 WhatsApp de Pedidos: {POLESTORE_PHONE_DISPLAY}
            </span>
          </span>

          {/* DUPLICADO PARA BUCLE CONTINUO */}
          <span className="inline-flex items-center gap-6 text-[11px] sm:text-xs font-semibold tracking-wide" aria-hidden="true">
            <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <Truck className="w-3.5 h-3.5" /> Delivery a Domicilio en Chiclayo, JLO, La Victoria y Lambayeque
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> Puntos Céntricos: Plaza Cívica · Catedral · Banco de la Nación · Plazuela · Zonas aledañas (S/ 0 Gratis)
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-300 font-bold">
              🏷️ Shorts Clásicos: 1x S/ 15 · 6x S/ 13.50 · Docena S/ 12.00
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-300 font-bold">
              ⚽ Shorts Win: 1x S/ 25 · 3x S/ 69 · Docena S/ 240
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-200 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-emerald-400" /> Envíos diarios a todo el Perú por Shalom
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-blue-300 font-bold">
              📱 WhatsApp de Pedidos: {POLESTORE_PHONE_DISPLAY}
            </span>
          </span>
        </div>
      </div>

      {/* 2. HEADER Y MENÚ PRINCIPAL EN EL ORDEN EXACTO SOLICITADO: */}
      {/* Inicio | Guía de tallas | Lugares de entrega | Horarios de atención | Quiénes somos | Mi pedido */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Logo Brand */}
          <button
            type="button"
            onClick={() => navegarA('inicio')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <ShortsIcon className="w-5 h-5 text-white" strokeWidth={2.4} />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-wider text-slate-900 block leading-none">
                POOL STORE
              </span>
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block mt-0.5">
                Tienda Virtual
              </span>
            </div>
          </button>

          {/* Menú Principal Desktop - ORDEN EXACTO */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-700">
            <button
              type="button"
              onClick={() => navegarA('inicio')}
              className="px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Inicio
            </button>

            <span className="text-slate-300 select-none">|</span>

            <button
              type="button"
              onClick={() => navegarA('guia-tallas')}
              className="px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Guía de tallas
            </button>

            <span className="text-slate-300 select-none">|</span>

            <button
              type="button"
              onClick={() => navegarA('lugares-entrega')}
              className="px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Lugares de entrega
            </button>

            <span className="text-slate-300 select-none">|</span>

            <button
              type="button"
              onClick={() => navegarA('horarios-atencion')}
              className="px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Horarios de atención
            </button>

            <span className="text-slate-300 select-none">|</span>

            <button
              type="button"
              onClick={() => navegarA('quienes-somos')}
              className="px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Quiénes somos
            </button>

            <span className="text-slate-300 select-none">|</span>

            {/* Mi Pedido */}
            <button
              type="button"
              onClick={() => setModalCarritoAbierto(true)}
              className="ml-1 flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl shadow-xs transition-all cursor-pointer font-black"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Mi pedido</span>
              {totalPrendas > 0 && (
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {totalPrendas}
                </span>
              )}
            </button>
          </nav>

          {/* Acciones Móvil y Tablet: Mi Pedido + Hamburguesa */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setModalCarritoAbierto(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-xl shadow-xs transition-all cursor-pointer text-xs font-black"
              aria-label="Abrir mi pedido"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Mi pedido</span>
              {totalPrendas > 0 && (
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {totalPrendas}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              {menuMovilAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desplegable Menú Móvil - ORDEN EXACTO */}
        {menuMovilAbierto && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-fade-in font-montserrat">
            <div className="max-w-6xl mx-auto px-4 py-3 divide-y divide-slate-100 text-xs font-bold text-slate-800">
              <button
                type="button"
                onClick={() => navegarA('inicio')}
                className="w-full py-2.5 flex items-center justify-between text-left hover:text-slate-950 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-slate-400" /> Inicio (Tienda Virtual)
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navegarA('guia-tallas')}
                className="w-full py-2.5 flex items-center justify-between text-left hover:text-slate-950 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-slate-400" /> Guía de tallas
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navegarA('lugares-entrega')}
                className="w-full py-2.5 flex items-center justify-between text-left hover:text-slate-950 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" /> Lugares de entrega
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navegarA('horarios-atencion')}
                className="w-full py-2.5 flex items-center justify-between text-left hover:text-slate-950 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" /> Horarios de atención
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navegarA('quienes-somos')}
                className="w-full py-2.5 flex items-center justify-between text-left hover:text-slate-950 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" /> Quiénes somos
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navegarA('mi-pedido')}
                className="w-full py-3 flex items-center justify-between text-left text-emerald-700 font-black cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" /> Mi pedido ({totalPrendas} prendas)
                </span>
                <span className="text-slate-900 font-black">S/ {totalGeneral.toFixed(2)}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* SUB-BARRA HORIZONTAL RÁPIDA EN MÓVILES PARA NAVEGAR CON UN TOQUE */}
      <div className="lg:hidden bg-slate-100 border-b border-slate-200 px-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
          <button
            type="button"
            onClick={() => navegarA('inicio')}
            className="px-3 py-1 rounded-full bg-white shadow-xs text-slate-900 hover:bg-slate-50 cursor-pointer"
          >
            Inicio
          </button>
          <button
            type="button"
            onClick={() => navegarA('guia-tallas')}
            className="px-3 py-1 rounded-full bg-white shadow-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Guía de tallas
          </button>
          <button
            type="button"
            onClick={() => navegarA('lugares-entrega')}
            className="px-3 py-1 rounded-full bg-white shadow-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Lugares de entrega
          </button>
          <button
            type="button"
            onClick={() => navegarA('horarios-atencion')}
            className="px-3 py-1 rounded-full bg-white shadow-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Horarios
          </button>
          <button
            type="button"
            onClick={() => navegarA('quienes-somos')}
            className="px-3 py-1 rounded-full bg-white shadow-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Quiénes somos
          </button>
        </div>
      </div>

      {/* 3. CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6 w-full flex-1 space-y-12">
        {/* ======================================================== */}
        {/* SECCIÓN 1: INICIO – TIENDA VIRTUAL DIRECTA               */}
        {/* Sin banners gigantes: productos directos, precios claros */}
        {/* ======================================================== */}
        <section id="inicio" aria-label="Tienda virtual" className="scroll-mt-20">
          {/* Categorías dentro del catálogo (no en el menú principal) y Buscador */}
          <div className="mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Pestañas de categoría dentro del catálogo */}
            <div className="inline-flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold text-slate-700 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCategoriaActiva('clasicos')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  categoriaActiva === 'clasicos'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'hover:text-slate-900 text-slate-600'
                }`}
              >
                Shorts Clásicos (36)
              </button>
              <button
                type="button"
                onClick={() => setCategoriaActiva('deportivos')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  categoriaActiva === 'deportivos'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'hover:text-slate-900 text-slate-600'
                }`}
              >
                Shorts Deportivos (11)
              </button>
              <button
                type="button"
                onClick={() => setCategoriaActiva('todos')}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  categoriaActiva === 'todos'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'hover:text-slate-900 text-slate-600'
                }`}
              >
                Todos
              </button>
            </div>

            {/* Buscador Rápido */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar color o equipo..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all shadow-xs"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Ribbon Comercial de Precios Dinámico: Cambia automáticamente según la categoría seleccionada */}
          <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
            {categoriaActiva === 'deportivos' ? (
              /* PRECIOS Y ESPECIFICACIONES PARA SHORTS DEPORTIVOS WIN (1x S/ 25, 3x S/ 69, 12x S/ 240) */
              <div className="animate-fade-in space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                      1x
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Por Unidad (1 a 2 uds.)
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        S/ 25.00 <span className="text-xs font-medium text-slate-500">c/u</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                      3x
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                        Promo 3 Shorts Win
                      </span>
                      <span className="text-lg font-black text-emerald-800">
                        3 por S/ 69.00 <span className="text-xs font-medium text-emerald-600 block">(S/ 23.00 c/u)</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/70">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                      12x
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                        Docena Mayorista (12+)
                      </span>
                      <span className="text-lg font-black text-blue-800">
                        12 por S/ 240.00 <span className="text-xs font-medium text-blue-600 block">(S/ 20.00 c/u)</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    <span>
                      <strong>Delivery Gratis</strong> en Chiclayo por la compra de 3 o más prendas (¡automático con la promo 3 x S/ 69!).
                    </span>
                  </div>
                  <div className="text-slate-500 font-semibold">
                    11 modelos de clubes y selecciones en Talla L
                  </div>
                </div>

                {/* Breve descripción de Tela Win + Botón Saber más sobre la tela */}
                <div className="pt-2.5 border-t border-slate-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-emerald-50/50 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3.5 sm:p-4 rounded-b-2xl border-t border-emerald-100">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-xs">
                      ⚽
                    </span>
                    <div>
                      <span className="font-black text-emerald-950 block text-xs">
                        Tela Win Deportiva:
                      </span>
                      <p className="text-emerald-800 text-[11px] leading-tight">
                        Tejido técnico transpirable de microfibra deportiva, secado ultra veloz y máxima ligereza para fútbol y entrenamiento.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalTelasAbierto(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saber más sobre la tela</span>
                  </button>
                </div>
              </div>
            ) : categoriaActiva === 'clasicos' ? (
              /* PRECIOS Y DESCUENTOS POR VOLUMEN PARA SHORTS CLÁSICOS (1x S/ 15, 6x S/ 13.50, 12x S/ 12.00) */
              <div className="animate-fade-in space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                      1x
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Short Clásico (1 a 5 uds.)
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        S/ 15.00 <span className="text-xs font-medium text-slate-500">c/u</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                      6x
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                        Desde 6 unidades
                      </span>
                      <span className="text-lg font-black text-emerald-800">
                        S/ 13.50 <span className="text-xs font-medium text-emerald-600">c/u</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/70">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                      12x
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                        Docena Mayorista (12+)
                      </span>
                      <span className="text-lg font-black text-blue-800">
                        S/ 12.00 <span className="text-xs font-medium text-blue-600">c/u</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    <span>
                      <strong>Delivery Gratis</strong> en Chiclayo por la compra de 3 o más prendas.
                    </span>
                  </div>
                  <div className="text-slate-500 font-semibold">
                    36 colores disponibles en tallas XS a XL
                  </div>
                </div>

                {/* Breve descripción de Tela Polistrech + Botón Saber más sobre la tela */}
                <div className="pt-2.5 border-t border-slate-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3.5 sm:p-4 rounded-b-2xl border-t border-slate-200/80">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-xs">
                      🩳
                    </span>
                    <div>
                      <span className="font-black text-slate-900 block text-xs">
                        Tela Polistrech (Poliéster Elástico):
                      </span>
                      <p className="text-slate-600 text-[11px] leading-tight">
                        Suave al tacto, elástica, fresca y durable. Cuenta con pretina reforzada y cordón ajustable a tu cintura.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalTelasAbierto(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saber más sobre la tela</span>
                  </button>
                </div>
              </div>
            ) : (
              /* VISTA GENERAL DE PRECIOS CUANDO 'TODOS' ESTÁ ACTIVO */
              <div className="animate-fade-in space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                      🩳
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Shorts Clásicos Polistrech
                      </span>
                      <span className="text-base font-black text-slate-900">
                        1x S/ 15 · 6x S/ 13.50 · 12x S/ 12
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70">
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                      ⚽
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Shorts Deportivos Win
                      </span>
                      <span className="text-base font-black text-emerald-950">
                        1x S/ 25 · 3x S/ 69 · 12x S/ 240
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/70">
                    <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                      🛵
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                        Promoción Delivery
                      </span>
                      <span className="text-base font-black text-blue-950">
                        ¡Gratis desde 3 prendas!
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    <span>
                      Combina modelos clásicos y deportivos en tu mismo pedido.
                    </span>
                  </div>
                  <div className="text-slate-500 font-semibold">
                    Catálogo completo: 47 modelos en total
                  </div>
                </div>

                {/* Breve descripción comparativa de ambas telas + Botón Saber más sobre la tela */}
                <div className="pt-2.5 border-t border-slate-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3.5 sm:p-4 rounded-b-2xl border-t border-slate-200/80">
                  <div className="text-[11px] text-slate-600 leading-tight">
                    <span className="font-bold text-slate-900">Polistrech:</span> Elástica y suave para uso diario. · <span className="font-bold text-emerald-900">Win:</span> Técnica, microperforada y de secado rápido para deporte.
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalTelasAbierto(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saber más sobre la tela</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Feedback de Búsqueda */}
          {busqueda && (
            <div className="mb-4 text-xs text-slate-600 flex items-center justify-between">
              <span>
                Mostrando resultados para &quot;<strong>{busqueda}</strong>&quot; ({totalResultados}{' '}
                {totalResultados === 1 ? 'resultado' : 'resultados'})
              </span>
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="text-slate-900 font-bold underline cursor-pointer hover:text-black"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}

          {totalResultados === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500 my-6">
              <Filter className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="font-bold text-slate-800 text-sm">No se encontraron productos con ese término</p>
              <p className="text-xs text-slate-500 mt-1">
                Prueba buscando por color como &quot;Negro&quot;, &quot;Azul&quot; o por club como &quot;Real Madrid&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setBusqueda('');
                  setCategoriaActiva('todos');
                }}
                className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-black"
              >
                Ver todo el catálogo
              </button>
            </div>
          )}

          {/* 1.1 SHORTS CLÁSICOS: MOSTRADOS PRIMERO COMO PRODUCTO PRINCIPAL */}
          {coloresClasicosFiltrados.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Shorts Clásicos Polistrech</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      S/ 15.00 c/u
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Nuestros productos más vendidos. Selecciona el color de rayas para ver la foto real y elige tu talla.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {coloresClasicosFiltrados.map((colorShort) => {
                  const estado = estadoClasicos[colorShort] || {
                    colorRayas: getRayasPorColorShort(colorShort)[0] || '',
                    talla: 'M' as Talla,
                    cantidad: 1,
                  };

                  const rayasDisponibles = getRayasPorColorShort(colorShort);
                  const productoActivo =
                    findProductoPoliester(colorShort, estado.colorRayas) ||
                    findProductoPoliester(colorShort, rayasDisponibles[0]);

                  if (!productoActivo) return null;

                  const hexInfo = COLOR_HEX_MAP[colorShort] || {
                    bg: '#0f172a',
                    text: '#ffffff',
                  };

                  return (
                    <article
                      key={colorShort}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
                    >
                      {/* FOTO GRANDE Y NÍTIDA */}
                      <div className="relative aspect-4/3 sm:aspect-square bg-slate-100 overflow-hidden">
                        <img
                          src={productoActivo.imagen}
                          alt={`Short ${colorShort} con rayas ${estado.colorRayas}`}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                        />

                        {/* Badge de color */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg shadow-xs text-xs font-black text-slate-900">
                          <span
                            className="w-3.5 h-3.5 rounded-full inline-block border border-black/10 shrink-0"
                            style={{ backgroundColor: hexInfo.bg }}
                          />
                          <span>{colorShort}</span>
                        </div>

                        {/* Botón Zoom */}
                        <button
                          type="button"
                          onClick={() => setModalFoto(productoActivo)}
                          className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 hover:text-black rounded-lg shadow-xs cursor-pointer transition-colors"
                          aria-label={`Ver foto ampliada de short ${colorShort}`}
                          title="Ampliar foto"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>

                        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-slate-900/80 backdrop-blur-sm text-white rounded text-[10px] font-bold">
                          Rayas: {estado.colorRayas}
                        </div>
                      </div>

                      {/* CONTROLES INTERACTIVOS DIRECTOS */}
                      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                        <div>
                          {/* Selector de color de rayas (cambia la imagen en tiempo real) */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-bold text-slate-700">Color de Rayas:</span>
                              <span className="text-[11px] font-bold text-slate-900">
                                {estado.colorRayas}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {rayasDisponibles.map((raya) => {
                                const esSeleccionada = estado.colorRayas.toLowerCase() === raya.toLowerCase();
                                const rayaHex = COLOR_HEX_MAP[raya] || { bg: '#64748b', text: '#ffffff' };

                                return (
                                  <button
                                    key={raya}
                                    type="button"
                                    onClick={() => handleCambiarRayaClasico(colorShort, raya)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                      esSeleccionada
                                        ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900 ring-offset-1'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <span
                                      className="w-2.5 h-2.5 rounded-full inline-block border border-black/15 shrink-0"
                                      style={{ backgroundColor: rayaHex.bg }}
                                    />
                                    <span>{raya}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Selector de Tallas */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-bold text-slate-700">Talla:</span>
                              <button
                                type="button"
                                onClick={() => navegarA('guia-tallas')}
                                className="text-[10px] text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer"
                              >
                                Ver guía de tallas
                              </button>
                            </div>

                            <div className="grid grid-cols-5 gap-1.5">
                              {TALLAS_DISPONIBLES.map((t) => {
                                const disponible = estaTallaDisponible(productoActivo, t);
                                const seleccionada = estado.talla === t;

                                return (
                                  <button
                                    key={t}
                                    type="button"
                                    disabled={!disponible}
                                    onClick={() => handleCambiarTallaClasico(colorShort, t)}
                                    className={`py-1.5 text-xs font-black rounded-lg transition-all text-center cursor-pointer ${
                                      seleccionada
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : disponible
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                        : 'bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                                    }`}
                                  >
                                    {t}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Cantidad + Precio + Agregar */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                            <button
                              type="button"
                              onClick={() => handleCambiarCantidadClasico(colorShort, -1)}
                              className="p-2 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              aria-label="Restar una unidad"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-black text-xs text-slate-900">
                              {estado.cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCambiarCantidadClasico(colorShort, 1)}
                              className="p-2 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              aria-label="Sumar una unidad"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleAgregarAlCarrito(productoActivo, estado.talla, estado.cantidad)
                            }
                            className="flex-1 py-2 px-3 bg-slate-900 hover:bg-black active:scale-98 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Agregar</span>
                            <span className="text-slate-300 font-normal">
                              · S/ {(15.0 * estado.cantidad).toFixed(2)}
                            </span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* 1.2 SHORTS DEPORTIVOS TELA WIN */}
          {gruposWinFiltrados.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Shorts Deportivos Tela Win</span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      1x S/ 25 · 3x S/ 69 · 12x S/ 240
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Modelos de clubes y selecciones en tela Win. Puedes elegir versión oficial (V1) o alternativa (V2).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {gruposWinFiltrados.map((grupo) => {
                  const estado = estadoGruposWin[grupo.id] || {
                    versionId: grupo.versiones[0].id,
                    cantidad: 1,
                    talla: 'L' as Talla,
                  };
                  const versionActiva =
                    grupo.versiones.find((v) => v.id === estado.versionId) || grupo.versiones[0];
                  const productoActivo = versionActiva.producto;

                  const winUnitPriceCard =
                    estado.cantidad >= 12 ? 20.0 : estado.cantidad >= 3 ? 23.0 : 25.0;
                  const subtotalCard = winUnitPriceCard * estado.cantidad;

                  const tieneMultiplesVersiones = grupo.versiones.length > 1;

                  return (
                    <article
                      key={grupo.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
                    >
                      {/* FOTO GRANDE Y NÍTIDA */}
                      <div className="relative aspect-4/3 sm:aspect-square bg-slate-100 overflow-hidden">
                        <img
                          src={productoActivo.imagen}
                          alt={productoActivo.nombre}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                        />

                        {/* Badge de Equipo / Versión activa */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg shadow-xs text-xs font-black text-slate-900">
                          <span>{grupo.equipo}</span>
                          {tieneMultiplesVersiones && (
                            <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded text-[10px] font-extrabold uppercase tracking-wide">
                              {versionActiva.etiqueta}
                            </span>
                          )}
                        </div>

                        {/* Botón flotante selector rápido V1 / V2 en la foto */}
                        {tieneMultiplesVersiones && (
                          <div className="absolute top-3 right-12 z-10 flex items-center bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-xs border border-slate-200/80 gap-1">
                            {grupo.versiones.map((v) => {
                              const esActiva = v.id === versionActiva.id;
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() => handleCambiarVersionWin(grupo.id, v.id)}
                                  className={`px-2 py-0.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                    esActiva
                                      ? 'bg-slate-900 text-white shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                  }`}
                                  title={`Ver versión ${v.etiqueta}: ${v.subtitulo}`}
                                >
                                  {v.etiqueta}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Botón Zoom */}
                        <button
                          type="button"
                          onClick={() => setModalFoto(productoActivo)}
                          className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 hover:text-black rounded-lg shadow-xs cursor-pointer transition-colors"
                          aria-label={`Ver foto ampliada de ${productoActivo.nombre}`}
                          title="Ampliar foto"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>

                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-extrabold uppercase tracking-wide">
                            Tela Win Premium
                          </span>
                          <span className="px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-white rounded text-[10px] font-bold">
                            {estado.cantidad >= 12
                              ? 'Docena S/ 20 c/u'
                              : estado.cantidad >= 3
                              ? 'Promo 3x S/ 69'
                              : '1x S/ 25'}
                          </span>
                        </div>
                      </div>

                      {/* CONTROLES INTERACTIVOS DIRECTOS */}
                      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-black text-sm text-slate-900">
                              {productoActivo.nombre}
                            </h3>
                            <div className="text-right">
                              <span className="text-sm font-black text-slate-900 block leading-tight">
                                S/ 25.00
                              </span>
                              <span className="text-[10px] text-emerald-700 font-extrabold block">
                                3x S/ 69 · 12x S/ 240
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Color: {productoActivo.colorShort} · {productoActivo.colorRayas}
                          </p>

                          {/* SELECTOR DE VERSIÓN (V1 / V2) ESTILO BOTONES DIRECTOS */}
                          {tieneMultiplesVersiones ? (
                            <div className="mt-3 mb-1">
                              <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>Versión del Modelo:</span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-extrabold">
                                    {versionActiva.etiqueta}
                                  </span>
                                </span>
                                <span className="text-[11px] font-bold text-slate-900 truncate max-w-[140px]">
                                  {versionActiva.subtitulo}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                {grupo.versiones.map((v) => {
                                  const esSeleccionada = v.id === versionActiva.id;
                                  return (
                                    <button
                                      key={v.id}
                                      type="button"
                                      onClick={() => handleCambiarVersionWin(grupo.id, v.id)}
                                      className={`py-1.5 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                        esSeleccionada
                                          ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900 ring-offset-1'
                                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                      }`}
                                    >
                                      <span
                                        className={`w-2 h-2 rounded-full shrink-0 ${
                                          esSeleccionada ? 'bg-emerald-400' : 'bg-slate-400'
                                        }`}
                                      />
                                      <span>{v.etiqueta}</span>
                                      <span className="text-[10px] font-normal opacity-80 truncate">
                                        {v.etiqueta === 'V1' ? 'Principal' : 'Alternativo'}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 mb-1">
                              <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="font-bold text-slate-700">Versión:</span>
                                <span className="text-[11px] font-bold text-slate-600">
                                  V1 Oficial
                                </span>
                              </div>
                              <div className="py-1 px-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs flex items-center justify-between text-slate-600">
                                <span className="font-bold text-[11px] flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                  V1 Oficial
                                </span>
                                <span className="text-[10px] text-slate-500">{versionActiva.subtitulo}</span>
                              </div>
                            </div>
                          )}

                          <div className="mt-2.5 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700">Talla disponible:</span>
                            <span className="px-2.5 py-1 bg-slate-100 rounded-md font-black text-slate-900">
                              Talla L (Cintura 42 cm)
                            </span>
                          </div>
                        </div>

                        {/* Cantidad + Precio + Agregar */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                            <button
                              type="button"
                              onClick={() => handleCambiarCantidadWin(grupo.id, -1)}
                              className="p-2 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              aria-label="Restar una unidad"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-black text-xs text-slate-900">
                              {estado.cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCambiarCantidadWin(grupo.id, 1)}
                              className="p-2 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              aria-label="Sumar una unidad"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleAgregarAlCarrito(productoActivo, estado.talla, estado.cantidad)
                            }
                            className="flex-1 py-2 px-3 bg-slate-900 hover:bg-black active:scale-98 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Agregar</span>
                            <span className="text-slate-300 font-normal">
                              · S/ {subtotalCard.toFixed(2)}
                            </span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 2: GUÍA DE TALLAS                                */}
        {/* Guía visual clara y fácil de entender                    */}
        {/* ======================================================== */}
        <section id="guia-tallas" aria-label="Guía de tallas" className="scroll-mt-20">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Ruler className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Guía de Tallas Oficial Pool Store
                  </h2>
                  <p className="text-xs text-slate-500">
                    Referencia exacta de medidas para elegir tu talla con total seguridad.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-slate-50 text-xs">
                {Object.entries(GUIA_TALLAS).map(([t, info]) => (
                  <div key={t} className="flex justify-between items-center p-3.5 hover:bg-slate-100/60 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                        {t}
                      </span>
                      <span className="font-black text-slate-900 text-sm">{info.tallaNumero}</span>
                    </div>
                    <span className="text-slate-600 font-medium">
                      Cintura con elástico: <strong>{info.cintura} cm</strong>
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <strong className="text-slate-900 block font-bold">Shorts Clásicos (Polistrech)</strong>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Tela elástica suave con pretina reforzada y cordón regulable. Tallas desde XS hasta XL.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <strong className="text-emerald-900 block font-bold">Shorts Deportivos (Win)</strong>
                  <p className="text-emerald-700 text-[11px] leading-relaxed">
                    Talla L estándar (Cintura 42 cm), tejido de alto rendimiento y secado rápido.
                  </p>
                </div>
              </div>

              <div className="pt-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => setModalTelasAbierto(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saber más sobre la composición y cuidado de las telas</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 3: LUGARES DE ENTREGA                            */}
        {/* Plaza Cívica, Catedral, Banco de la Nación, Plazuela     */}
        {/* y Zonas cercanas (previa coordinación por WhatsApp)     */}
        {/* ======================================================== */}
        <section id="lugares-entrega" aria-label="Lugares de entrega" className="scroll-mt-20">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Lugares de Entrega en Chiclayo
                  </h2>
                  <p className="text-xs text-slate-500">
                    Puntos céntricos de encuentro sin costo adicional y entrega coordinada.
                  </p>
                </div>
              </div>

              {/* Grid visual de los 5 puntos de entrega */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PUNTOS_CENTRICOS_CHICLAYO.map((pto) => (
                  <div
                    key={pto.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start gap-3 hover:border-slate-300 transition-colors"
                  >
                    <span className="text-2xl shrink-0">{pto.icono}</span>
                    <div>
                      <h3 className="font-black text-sm text-slate-900">{pto.nombre}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{pto.detalle}</p>
                      <span className="inline-block mt-2 text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        Entrega S/ 0.00 Gratis
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicación de coordinación por WhatsApp */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 space-y-2">
                <div className="flex items-center gap-2 font-black text-sm text-blue-950">
                  <MessageCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Coordinación previa de entregas por WhatsApp</span>
                </div>
                <p className="text-blue-800 leading-relaxed text-xs">
                  Los puntos de encuentro y las entregas se coordinan previamente por WhatsApp. También realizamos <strong>delivery a domicilio</strong> (Chiclayo, JLO, La Victoria y Lambayeque) y <strong>envíos diarios por Shalom</strong> a cualquier ciudad del Perú.
                </p>
                <div className="pt-1">
                  <a
                    href="https://wa.me/51903566655?text=Hola%20Pool%20Store%20%F0%9F%91%8B%2C%20deseo%20coordinar%20un%20punto%20de%20entrega%20para%20mi%20pedido."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-black text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Coordinar punto por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 4: HORARIOS DE ATENCIÓN                          */}
        {/* Todos los días, de lunes a domingo. Botón WhatsApp       */}
        {/* ======================================================== */}
        <section id="horarios-atencion" aria-label="Horarios de atención" className="scroll-mt-20">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-xs">
                <Clock className="w-6 h-6 text-emerald-400" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
                  Atención Continua
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Horarios de Atención
                </h2>
                <p className="text-base font-extrabold text-slate-800 mt-1">
                  Atendemos todos los días, de lunes a domingo.
                </p>
              </div>

              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Estamos a tu disposición para responder dudas, verificar stock de modelos y tallas, y programar tus entregas o envíos sin complicaciones.
              </p>

              <div className="pt-2">
                <a
                  href="https://wa.me/51903566655?text=Hola%20Pool%20Store%20%F0%9F%91%8B%2C%20deseo%20consultar%20disponibilidad%20para%20coordinar%20un%20pedido."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-black shadow-md hover:shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar disponibilidad y coordinar pedidos</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 5: QUIÉNES SOMOS                                 */}
        {/* Descripción exacta solicitada por el usuario             */}
        {/* ======================================================== */}
        <section id="quienes-somos" aria-label="Quiénes somos" className="scroll-mt-20">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Quiénes Somos
                  </h2>
                  <p className="text-xs text-slate-500">
                    Conoce más sobre Pool Store.
                  </p>
                </div>
              </div>

              {/* Texto exacto solicitado */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-slate-800 text-sm leading-relaxed font-medium">
                  Somos <strong>POOL STORE</strong>, una tienda 100 % virtual dedicada a ofrecer productos de calidad a precios accesibles. Actualmente contamos con shorts clásicos y deportivos, y próximamente incorporaremos nuevos productos a nuestro catálogo. Compras fáciles, atención directa y entregas coordinadas en Chiclayo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center">
                <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200/50">
                  <strong className="text-slate-900 block font-black">100 % Virtual</strong>
                  <span className="text-slate-500 text-[11px]">Compra rápida desde tu celular</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200/50">
                  <strong className="text-slate-900 block font-black">Atención Directa</strong>
                  <span className="text-slate-500 text-[11px]">Coordinación personalizada</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200/50">
                  <strong className="text-slate-900 block font-black">Precios Accesibles</strong>
                  <span className="text-slate-500 text-[11px]">Calidad garantizada</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* 4. MODAL / DRAWER DEL CARRITO (SLIDE-OVER MI PEDIDO)     */}
      {/* ======================================================== */}
      {modalCarritoAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Resumen de tu pedido"
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs font-montserrat animate-fade-in"
        >
          <button
            type="button"
            aria-label="Cerrar pedido"
            onClick={() => setModalCarritoAbierto(false)}
            className="absolute inset-0 w-full h-full cursor-default bg-transparent"
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-slate-200">
            {/* Header del carrito */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 leading-none">Mi Pedido</h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {totalPrendas} {totalPrendas === 1 ? 'prenda' : 'prendas'} seleccionadas
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {carrito.length > 0 && (
                  <button
                    type="button"
                    onClick={handleVaciarCarrito}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded cursor-pointer"
                  >
                    Vaciar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setModalCarritoAbierto(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                  aria-label="Cerrar carrito"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenido del Carrito */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {carrito.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <ShortsIcon className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-bold text-slate-700 text-sm">Tu pedido está vacío</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Elige tus colores y tallas favoritas en el catálogo y agrégalos a tu pedido.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setModalCarritoAbierto(false);
                      navegarA('inicio');
                    }}
                    className="mt-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-black"
                  >
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                <>
                  {/* Banner de progreso para precio por volumen */}
                  {prendasPoliester > 0 && (
                    <div className="p-3 rounded-xl bg-slate-900 text-white text-xs">
                      {prendasPoliester >= 12 ? (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>
                            <strong>¡Precio Docena Activado!</strong> Pagas solo{' '}
                            <span className="text-amber-300 font-black">S/ 12.00 c/u</span> en tus shorts clásicos.
                          </span>
                        </div>
                      ) : prendasPoliester >= 6 ? (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            <strong>¡Precio Mayorista Activado!</strong> Pagas{' '}
                            <span className="text-emerald-300 font-black">S/ 13.50 c/u</span>. Lleva {12 - prendasPoliester} más para precio docena (S/ 12.00).
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>
                            Lleva <strong>{6 - prendasPoliester} shorts clásicos más</strong> para pagar solo S/ 13.50 c/u.
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Banner de progreso para precio por volumen Shorts Win */}
                  {prendasWin > 0 && (
                    <div className="p-3 rounded-xl bg-slate-900 text-white text-xs">
                      {prendasWin >= 12 ? (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            <strong>¡Precio Docena Win Activado!</strong> Pagas solo{' '}
                            <span className="text-emerald-300 font-black">S/ 20.00 c/u</span> (12 por S/ 240.00).
                          </span>
                        </div>
                      ) : prendasWin >= 3 ? (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            <strong>¡Promo 3x S/ 69 Activada!</strong> Pagas{' '}
                            <span className="text-emerald-300 font-black">S/ 23.00 c/u</span> en shorts Win. Lleva {12 - prendasWin} más para precio docena (S/ 20.00 c/u).
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>
                            Lleva <strong>{3 - prendasWin} short{3 - prendasWin === 1 ? '' : 's'} Win más</strong> para pagar solo <strong>3 por S/ 69.00</strong> (S/ 23.00 c/u).
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Lista de productos */}
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    {carrito.map((item) => {
                      const p = item.producto;
                      const isWin = p.tipoTela === 'win';
                      const unit = isWin ? precioUnitarioWin : precioUnitarioPoliester;
                      const subtotal = unit * item.cantidad;

                      return (
                        <div key={item.id} className="p-3 flex items-center gap-3">
                          <img
                            src={p.imagen}
                            alt={p.nombre}
                            className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-xs text-slate-900 truncate">
                              {p.nombre}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Talla: <strong className="text-slate-800">{item.talla}</strong>
                              {p.colorRayas && ` · Rayas: ${p.colorRayas}`}
                            </p>
                            <p className="text-xs font-black text-slate-900 mt-1">
                              S/ {unit.toFixed(2)}{' '}
                              <span className="text-[10px] font-normal text-slate-500">
                                x {item.cantidad} = S/ {subtotal.toFixed(2)}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleModificarCantidad(item.id, -1)}
                              className="p-1.5 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              aria-label="Restar una unidad"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-bold text-xs text-slate-900">
                              {item.cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleModificarCantidad(item.id, 1)}
                              className="p-1.5 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              aria-label="Sumar una unidad"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleEliminarItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                            aria-label={`Eliminar ${p.nombre}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Modalidad de Entrega */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                      Modalidad de Entrega
                    </span>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setModalidadEntrega('domicilio')}
                        className={`p-2 rounded-xl text-center transition-all cursor-pointer ${
                          modalidadEntrega === 'domicilio'
                            ? 'bg-slate-900 text-white font-black shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs'
                        }`}
                      >
                        <Truck className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-[11px] block leading-tight">A Domicilio</span>
                        <span className="text-[9px] opacity-80 block mt-0.5">
                          {deliveryGratisDesbloqueado ? '¡Gratis!' : 'S/ 4.00'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setModalidadEntrega('punto_centrico')}
                        className={`p-2 rounded-xl text-center transition-all cursor-pointer ${
                          modalidadEntrega === 'punto_centrico'
                            ? 'bg-slate-900 text-white font-black shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs'
                        }`}
                      >
                        <MapPin className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-[11px] block leading-tight">Punto Céntrico</span>
                        <span className="text-[9px] opacity-80 block mt-0.5">S/ 0 Gratis</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setModalidadEntrega('shalom')}
                        className={`p-2 rounded-xl text-center transition-all cursor-pointer ${
                          modalidadEntrega === 'shalom'
                            ? 'bg-slate-900 text-white font-black shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs'
                        }`}
                      >
                        <Package className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-[11px] block leading-tight">Shalom</span>
                        <span className="text-[9px] opacity-80 block mt-0.5">Provincias</span>
                      </button>
                    </div>

                    {modalidadEntrega === 'domicilio' && (
                      <div className="space-y-2 pt-1 animate-fade-in">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Dirección de entrega (Chiclayo / JLO / La Victoria / Lambayeque):
                          </label>
                          <input
                            type="text"
                            value={direccionEntrega}
                            onChange={(e) => setDireccionEntrega(e.target.value)}
                            placeholder="Ej: Av. Balta 450, Urb. Santa Victoria"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={referenciaEntrega}
                            onChange={(e) => setReferenciaEntrega(e.target.value)}
                            placeholder="Referencia (ej: Frente al parque, casa blanca)"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {deliveryGratisDesbloqueado ? (
                            <span className="text-emerald-700 font-bold">
                              ✓ ¡Delivery GRATIS desbloqueado por llevar 3 o más prendas!
                            </span>
                          ) : (
                            <span>
                              Costo estimado: S/ 4.00. ¡Lleva {3 - totalPrendas} prendas más para delivery gratis!
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {modalidadEntrega === 'punto_centrico' && (
                      <div className="space-y-1.5 pt-1 animate-fade-in">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Selecciona el punto de encuentro en Chiclayo:
                        </label>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {PUNTOS_CENTRICOS_CHICLAYO.map((pto) => (
                            <button
                              key={pto.id}
                              type="button"
                              onClick={() => setPuntoCentrico(pto.nombre)}
                              className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                                puntoCentrico === pto.nombre
                                  ? 'bg-slate-900 text-white font-bold'
                                  : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              <div>
                                <span className="block font-bold">{pto.icono} {pto.nombre}</span>
                                <span className={`text-[10px] block ${puntoCentrico === pto.nombre ? 'text-slate-300' : 'text-slate-500'}`}>
                                  {pto.detalle}
                                </span>
                              </div>
                              {puntoCentrico === pto.nombre && (
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {modalidadEntrega === 'shalom' && (
                      <div className="space-y-2 pt-1 animate-fade-in">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Ciudad y Agencia Shalom de destino:
                        </label>
                        <input
                          type="text"
                          value={destinoShalom}
                          onChange={(e) => setDestinoShalom(e.target.value)}
                          placeholder="Ej: Trujillo - Agencia Av. América Sur"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <p className="text-[10px] text-slate-500">
                          Enviamos diariamente por Shalom. El flete se abona directamente en la agencia de destino.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Forma de Pago */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                      Forma de Pago
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setMetodoPago('contraentrega')}
                        className={`p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          metodoPago === 'contraentrega'
                            ? 'bg-slate-900 text-white font-bold shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-black">💵 Contraentrega</span>
                        <span className={`text-[10px] block ${metodoPago === 'contraentrega' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Pagas al recibir tu pedido
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMetodoPago('yape')}
                        className={`p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          metodoPago === 'yape'
                            ? 'bg-slate-900 text-white font-bold shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-black">📱 Yape Directo</span>
                        <span className={`text-[10px] block ${metodoPago === 'yape' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Al 903566655
                        </span>
                      </button>
                    </div>

                    {metodoPago === 'yape' && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between gap-2 animate-fade-in">
                        <div>
                          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wide block">
                            Yape Oficial Pool Store
                          </span>
                          <span className="text-sm font-black text-purple-950">903566655</span>
                        </div>
                        <button
                          type="button"
                          onClick={copiarNumeroYape}
                          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          {yapeCopiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{yapeCopiado ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Totales y Botón WhatsApp */}
            {carrito.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal prendas ({totalPrendas}):</span>
                    <span className="font-bold text-slate-900">S/ {subtotalPrendas.toFixed(2)}</span>
                  </div>

                  {ahorroTotal > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Descuento por volumen aplicado:</span>
                      <span>- S/ {ahorroTotal.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Costo de envío:</span>
                    <span className="font-bold text-slate-900">
                      {costoEnvioAplicado === 0 ? 'S/ 0.00 (Gratis)' : `S/ ${costoEnvioAplicado.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                    <span>TOTAL A PAGAR:</span>
                    <span className="text-emerald-700">S/ {totalGeneral.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleComprarPorWhatsApp}
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <ShortsIcon className="w-5 h-5" />
                  <span>COMPRAR POR WHATSAPP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-slate-400">
                  Se enviará tu comprobante de pedido con los datos de entrega y pago.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL DE ZOOM DE FOTO                                 */}
      {/* ======================================================== */}
      {modalFoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada de ${modalFoto.nombre}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-montserrat animate-fade-in"
        >
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="relative aspect-square bg-slate-100">
              <img
                src={modalFoto.imagen}
                alt={modalFoto.nombre}
                className="w-full h-full object-contain p-4"
              />
              <button
                type="button"
                onClick={() => setModalFoto(null)}
                className="absolute top-4 right-4 p-2 bg-slate-900/80 text-white hover:bg-slate-900 rounded-full cursor-pointer transition-colors"
                aria-label="Cerrar vista previa"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-black text-sm text-slate-900">{modalFoto.nombre}</h4>
                <p className="text-xs text-slate-500">
                  {modalFoto.tipoTela === 'win' ? 'Tela Win Premium' : 'Tela Polistrech'} · S/{' '}
                  {modalFoto.precio.toFixed(2)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalFoto(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5.1 MODAL: SABER MÁS SOBRE LA TELA (POLISTRECH VS WIN)    */}
      {/* ======================================================== */}
      {modalTelasAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-modal-telas"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-montserrat animate-fade-in"
        >
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            {/* Cabecera */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="titulo-modal-telas" className="font-black text-base sm:text-lg">
                    Guía de Telas Pool Store
                  </h3>
                  <p className="text-xs text-slate-300">
                    Conoce cómo es cada tela y elige la ideal para ti
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalTelasAbierto(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Cerrar información de telas"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido scrolleable */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Tarjeta 1: Tela Polistrech */}
              <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                      🩳
                    </span>
                    <div>
                      <h4 className="font-black text-sm text-slate-900">
                        Tela Polistrech (Shorts Clásicos)
                      </h4>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        Nuestros shorts más versátiles y vendidos
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-extrabold text-[10px]">
                    1x S/ 15 · 6x S/ 13.50 · 12x S/ 12
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  El <strong>Polistrech</strong> es un tejido elásticado de microfibra de poliéster de tacto suave y agradable a la piel. Su composición permite libertad total de movimiento sin deformarse, manteniendo su elasticidad tras constantes lavadas.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-slate-900 block mb-0.5">✨ Tacto y Sensación:</span>
                    <span className="text-slate-600">Suave, elástica, fresca y ligera. No irrita ni raspa.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-slate-900 block mb-0.5">🪢 Pretina y Ajuste:</span>
                    <span className="text-slate-600">Banda elástica reforzada con cordón pasador ajustable a medida.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-slate-900 block mb-0.5">🎯 Uso Recomendado:</span>
                    <span className="text-slate-600">Uso diario, descanso en casa, gimnasio, playa, piscina o salidas casuales.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-slate-900 block mb-0.5">📐 Tallas y Variedad:</span>
                    <span className="text-slate-600">Tallas XS, S, M, L y XL en 36 combinaciones de colores vibrantes.</span>
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: Tela Win */}
              <div className="border border-emerald-200 rounded-2xl p-4 sm:p-5 bg-emerald-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm">
                      ⚽
                    </span>
                    <div>
                      <h4 className="font-black text-sm text-emerald-950">
                        Tela Win Deportiva (Shorts de Clubes y Selecciones)
                      </h4>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        Tejido deportivo técnico de alto rendimiento
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 font-extrabold text-[10px]">
                    1x S/ 25 · 3x S/ 69 · 12x S/ 240
                  </span>
                </div>

                <p className="text-emerald-900/90 leading-relaxed">
                  La <strong>Tela Win</strong> es el tejido oficial utilizado en indumentaria de alta competencia deportiva. Posee una microestructura transpirable que permite la rápida evaporación del sudor, evitando que la prenda se pegue o se vuelva pesada durante la actividad física.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80">
                    <span className="font-bold text-emerald-950 block mb-0.5">💨 Transpirabilidad:</span>
                    <span className="text-slate-600">Disipación de calor y sudor inmediata, secado ultra veloz al aire.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80">
                    <span className="font-bold text-emerald-950 block mb-0.5">🛡️ Resistencia:</span>
                    <span className="text-slate-600">Tejido tenaz resistente a fricción, tirones en cancha y lavado continuo.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80">
                    <span className="font-bold text-emerald-950 block mb-0.5">⚽ Uso Recomendado:</span>
                    <span className="text-slate-600">Fútbol, fulbito, running, crossfit, entrenamientos intensos y deporte al aire libre.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80">
                    <span className="font-bold text-emerald-950 block mb-0.5">🏆 Equipos y Tallas:</span>
                    <span className="text-slate-600">Modelos de Barcelona, Argentina, Real Madrid, Alianza, Universitario, etc. Talla L (Cintura 42 cm).</span>
                  </div>
                </div>
              </div>

              {/* Comparativa Rápida en Tabla */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <div className="bg-slate-100 p-3 font-black text-slate-800 text-xs">
                  Comparativa Rápida de Telas
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="grid grid-cols-3 p-3 gap-2 text-[11px]">
                    <span className="font-bold text-slate-500">Característica</span>
                    <span className="font-bold text-slate-900">Shorts Clásicos</span>
                    <span className="font-bold text-emerald-800">Shorts Deportivos</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 gap-2 text-[11px]">
                    <span className="text-slate-500 font-medium">Tipo de tela</span>
                    <span className="text-slate-800">Polistrech elástico</span>
                    <span className="text-emerald-800 font-semibold">Win deportivo técnico</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 gap-2 text-[11px]">
                    <span className="text-slate-500 font-medium">Sensación al cuerpo</span>
                    <span className="text-slate-800">Suave, elástico y cómodo</span>
                    <span className="text-slate-800">Ultra liviano y fresco</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 gap-2 text-[11px]">
                    <span className="text-slate-500 font-medium">Ajuste de cintura</span>
                    <span className="text-slate-800">Elástico con pasador</span>
                    <span className="text-slate-800">Elástico anatómico</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 gap-2 text-[11px]">
                    <span className="text-slate-500 font-medium">Secado</span>
                    <span className="text-slate-800">Rápido</span>
                    <span className="text-emerald-800 font-semibold">Ultra rápido instantáneo</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 gap-2 text-[11px]">
                    <span className="text-slate-500 font-medium">Enfoque</span>
                    <span className="text-slate-800">Diario, descanso y deporte</span>
                    <span className="text-slate-800">Fútbol y alto rendimiento</span>
                  </div>
                </div>
              </div>

              {/* Consejos de cuidado */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-xl text-blue-900 text-xs flex items-start gap-2.5">
                <span className="text-base shrink-0">💡</span>
                <p className="leading-relaxed text-[11px]">
                  <strong>Consejo de cuidado:</strong> Ambas telas son de excelente durabilidad. Se recomienda lavar con agua fría o tibia, secar a la sombra y no usar lejía para conservar los colores vivos por mucho más tiempo.
                </p>
              </div>
            </div>

            {/* Pie del modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setModalTelasAbierto(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-xl transition-colors cursor-pointer"
              >
                Entendido, ver productos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. BARRA RESUMEN MÓVIL CUANDO HAY PRENDAS SELECCIONADAS  */}
      {/* ======================================================== */}
      {totalPrendas > 0 && !modalCarritoAbierto && (
        <aside
          aria-label="Barra de pedido rápido móvil"
          className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-xl animate-fade-in font-montserrat"
        >
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide">
                {totalPrendas} {totalPrendas === 1 ? 'prenda' : 'prendas'} seleccionadas
              </span>
              <strong className="text-base font-black text-slate-900">
                S/ {totalGeneral.toFixed(2)}
              </strong>
            </div>

            <button
              type="button"
              onClick={() => setModalCarritoAbierto(true)}
              className="py-2.5 px-4 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Ver Pedido</span>
            </button>
          </div>
        </aside>
      )}

      {/* 7. FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500 space-y-3 font-montserrat">
        <p className="font-black text-slate-900 tracking-widest text-sm uppercase">
          POOL STORE
        </p>
        <p className="text-slate-600">
          Tu tienda virtual de confianza. Compras fáciles, atención directa y entregas coordinadas.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-700">
          <button type="button" onClick={() => navegarA('inicio')} className="hover:text-black cursor-pointer">
            Inicio
          </button>
          <span>·</span>
          <button type="button" onClick={() => navegarA('guia-tallas')} className="hover:text-black cursor-pointer">
            Guía de tallas
          </button>
          <span>·</span>
          <button type="button" onClick={() => navegarA('lugares-entrega')} className="hover:text-black cursor-pointer">
            Lugares de entrega
          </button>
          <span>·</span>
          <button type="button" onClick={() => navegarA('horarios-atencion')} className="hover:text-black cursor-pointer">
            Horarios de atención
          </button>
          <span>·</span>
          <button type="button" onClick={() => navegarA('quienes-somos')} className="hover:text-black cursor-pointer">
            Quiénes somos
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Puntos de entrega: Plaza Cívica · Catedral · Banco de la Nación · Plazuela · Zonas aledañas · Envíos Shalom a todo el Perú
        </p>
        <p className="text-[10px] text-slate-400">
          Pedidos WhatsApp: {POLESTORE_PHONE_DISPLAY} · Mi Yape: 903566655
        </p>
      </footer>
    </div>
  );
}
