/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  PRODUCTOS,
  SHORTS_POLIESTER,
  SHORTS_WIN,
  SHORTS_CLASICOS,
  SHORTS_DEPORTIVOS,
  COLORES_SHORT_POLIESTER,
  COLOR_HEX_MAP,
  getRayasPorColorShort,
  findProductoPoliester,
  estaTallaDisponible,
} from './data/productos';
import { Producto, Talla, ItemCarrito, TALLAS_DISPONIBLES, GUIA_TALLAS } from './types';
import {
  generarMensajeWhatsApp,
  getWhatsAppUrl,
  POLESTORE_WHATSAPP_NUMBER,
  POLESTORE_PHONE_DISPLAY,
} from './utils/whatsapp';
import {
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  Check,
  Lock,
  ArrowRight,
  Truck,
  MapPin,
  Package,
  Ruler,
  X,
  MessageCircle,
  Home,
  Shirt,
  ArrowLeft,
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
      {/* Pretina elástica superior con relleno sutil */}
      <path d="M4 5h16l-.8 3.5H4.8L4 5z" fill="currentColor" fillOpacity="0.2" />
      {/* Silueta exterior del short y entrepierna */}
      <path d="M4 5l1.6 14h4.8l1.6-8 1.6 8h4.8L20 5H4z" />
      {/* Cordones de ajuste frontales */}
      <path d="M11 6v3" />
      <path d="M13 6v3" />
      {/* Rayas decorativas deportivas laterales */}
      <path d="M6.8 9.5l.8 6.5" strokeOpacity="0.6" strokeWidth="1.5" />
      <path d="M17.2 9.5l-.8 6.5" strokeOpacity="0.6" strokeWidth="1.5" />
    </svg>
  );
}

const STORAGE_KEY_CARRITO = 'polestore_carrito_v2';

// Jerarquía de navegación exacta: Inicio → Ropa → Shorts → Shorts Clásicos / Shorts Deportivos
type VistaNavegacion =
  | 'inicio'
  | 'ropa'
  | 'shorts'
  | 'shorts-clasicos'
  | 'shorts-deportivos';

type TipoEntrega = 'delivery' | 'punto' | 'shalom';

const PUNTOS_ENTREGA = [
  'La Catedral de Chiclayo',
  'Plaza Cívica de JLO',
  'Las Musas – Chiclayo',
];

const ZONAS_DELIVERY_GRATIS = [
  'Chiclayo',
  'José Leonardo Ortiz (JLO)',
  'Lambayeque',
  'La Victoria',
];

export default function App() {
  // 1. ESTADO DE NAVEGACIÓN Y VISTAS
  const [vista, setVista] = useState<VistaNavegacion>('inicio');

  // Desplazar suavemente arriba al cambiar de vista
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [vista]);

  // 2. CARRITO CON PERSISTENCIA EN LOCALSTORAGE
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

  // 3. ESTADOS DE MODALES Y NOTIFICACIONES
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState<boolean>(false);
  const [modalFoto, setModalFoto] = useState<Producto | null>(null);
  const [modalGuiaTallas, setModalGuiaTallas] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const mostrarToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // 4. CONFIGURADOR INTERACTIVO DE SHORT POLIÉSTER (SHORTS CLÁSICOS)
  const [colorShortConfig, setColorShortConfig] = useState<string>('Negro');
  const [colorRayasConfig, setColorRayasConfig] = useState<string>('Dorado');
  const [tallaConfig, setTallaConfig] = useState<Talla>('M');
  const [cantidadConfig, setCantidadConfig] = useState<number>(1);

  // Rayas disponibles para el color de short actual
  const rayasDisponibles = useMemo(() => {
    return getRayasPorColorShort(colorShortConfig);
  }, [colorShortConfig]);

  // Si las rayas actuales no son válidas para este color, ajustar a la primera válida
  useEffect(() => {
    if (rayasDisponibles.length > 0 && !rayasDisponibles.includes(colorRayasConfig)) {
      setColorRayasConfig(rayasDisponibles[0]);
    }
  }, [rayasDisponibles, colorRayasConfig]);

  // Producto activo resuelto en el configurador de Poliéster
  const productoConfigurado = useMemo(() => {
    return findProductoPoliester(colorShortConfig, colorRayasConfig) || SHORTS_POLIESTER[0];
  }, [colorShortConfig, colorRayasConfig]);

  // Validar si la talla seleccionada está disponible; si no, ajustar a la primera disponible (ej. XL en negro con rayas negras)
  useEffect(() => {
    if (productoConfigurado) {
      if (!estaTallaDisponible(productoConfigurado, tallaConfig)) {
        if (productoConfigurado.tallasDisponibles.length > 0) {
          setTallaConfig(productoConfigurado.tallasDisponibles[0]);
        }
      }
    }
  }, [productoConfigurado, tallaConfig]);

  // 5. ESTADO PARA SHORTS DEPORTIVOS (EQUIPOS TELA WIN)
  const [idWinSeleccionado, setIdWinSeleccionado] = useState<string>('win-argentina');
  const [cantidadWin, setCantidadWin] = useState<number>(1);

  const productoWinSeleccionado = useMemo(() => {
    return SHORTS_WIN.find((w) => w.id === idWinSeleccionado) || SHORTS_WIN[0];
  }, [idWinSeleccionado]);

  // 6. MODALIDADES DE ENTREGA
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>('punto');
  const [zonaDelivery, setZonaDelivery] = useState<string>('Chiclayo');
  const [puntoEntrega, setPuntoEntrega] = useState<string>('La Catedral de Chiclayo');
  const [destinoShalom, setDestinoShalom] = useState<string>('');

  // 7. CÁLCULO AUTOMÁTICO DE PRECIOS Y PROMOCIONES
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

  // Precios por volumen
  const precioUnitarioPoliester = useMemo(() => {
    if (prendasPoliester >= 12) return 12.0;
    if (prendasPoliester >= 6) return 13.5;
    return 15.0;
  }, [prendasPoliester]);

  const precioUnitarioWin = useMemo(() => {
    if (prendasWin >= 3) return 25.0;
    return 28.0;
  }, [prendasWin]);

  const { totalGeneral, subtotalRegular, ahorroTotal } = useMemo(() => {
    let total = 0;
    let regular = 0;

    carrito.forEach((it) => {
      const p = it.producto;
      if (p.tipoTela === 'poliester') {
        total += precioUnitarioPoliester * it.cantidad;
        regular += 15.0 * it.cantidad;
      } else if (p.tipoTela === 'win') {
        total += precioUnitarioWin * it.cantidad;
        regular += 28.0 * it.cantidad;
      } else {
        total += p.precio * it.cantidad;
        regular += p.precio * it.cantidad;
      }
    });

    return {
      totalGeneral: total,
      subtotalRegular: regular,
      ahorroTotal: Math.max(0, regular - total),
    };
  }, [carrito, precioUnitarioPoliester, precioUnitarioWin]);

  const deliveryGratisDesbloqueado = totalPrendas >= 3;

  // 8. ACCIONES DEL CARRITO
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

  // 9. ENVÍO POR WHATSAPP
  const handleComprarPorWhatsApp = useCallback(() => {
    if (carrito.length === 0) {
      mostrarToast('Tu pedido está vacío. Elige tus shorts antes de enviar.');
      return;
    }

    const mensaje = generarMensajeWhatsApp(carrito, totalGeneral);
    const url = getWhatsAppUrl(mensaje);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [carrito, totalGeneral, mostrarToast]);

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-montserrat selection:bg-blue-600 selection:text-white">
      {/* TOAST FLOTANTE */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl border border-blue-500/40 animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* CABECERA PRINCIPAL Y BARRA DE NAVEGACIÓN (solo visible en catálogo y subsecciones) */}
      {vista !== 'inicio' && (
        <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-md border-b border-white/10 text-white shadow-xl">
          {/* Banner superior de confianza */}
          <div className="bg-black/60 text-blue-300 text-[11px] py-1 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap border-b border-white/5">
            <span>🛵 Delivery Gratis desde 3 shorts</span>
            <span className="text-white/20">•</span>
            <span>📍 Chiclayo, JLO, Lambayeque y La Victoria</span>
            <span className="text-white/20">•</span>
            <span>📦 Envíos por Shalom a todo el Perú</span>
          </div>

          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            {/* LOGO E IDENTIDAD */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setVista('inicio')}
                className="text-left group cursor-pointer focus:outline-hidden"
              >
                <span className="text-xl sm:text-2xl font-black tracking-widest text-white block leading-none group-hover:text-blue-400 transition-colors">
                  POOL STORE
                </span>
                <span className="text-[10px] text-blue-300/80 font-medium tracking-tight block">
                  Tienda 100% Virtual
                </span>
              </button>
            </div>

            {/* MENÚ PRINCIPAL: 'Inicio' Y 'Ropa' */}
            <nav className="flex items-center gap-1 sm:gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setVista('inicio')}
                className="px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-white/10"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Inicio</span>
              </button>

              <button
                type="button"
                onClick={() => setVista('ropa')}
                className="px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Ropa</span>
              </button>
            </nav>

            {/* ACCIONES: GUÍA DE TALLAS Y MI PEDIDO */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalGuiaTallas(true)}
                className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
              >
                <Ruler className="w-3.5 h-3.5 text-blue-400" />
                <span>Tallas</span>
              </button>

              <button
                type="button"
                onClick={() => setModalCarritoAbierto(true)}
                className="relative px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95"
                aria-label="Ver pedido"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Mi Pedido</span>
                <span className="sm:hidden">S/ {totalGeneral.toFixed(0)}</span>
                {totalPrendas > 0 && (
                  <span className="bg-white text-blue-600 text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none tabular-nums shadow-sm">
                    {totalPrendas}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* BREADCRUMB DE NAVEGACIÓN EXACTO: Inicio → Ropa → Shorts → Shorts Clásicos / Shorts Deportivos */}
          <div className="bg-neutral-900/50 backdrop-blur-xs border-t border-white/5 px-4 py-2 text-xs">
            <div className="max-w-6xl mx-auto flex items-center gap-1.5 text-slate-400 font-medium overflow-x-auto whitespace-nowrap">
              <button
                type="button"
                onClick={() => setVista('inicio')}
                className="hover:text-blue-400 transition-colors hover:underline"
              >
                Inicio
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-blue-500/60 shrink-0" />
              <button
                type="button"
                onClick={() => setVista('ropa')}
                className={`hover:text-blue-400 transition-colors ${
                  vista === 'ropa' ? 'font-black text-white' : 'hover:underline'
                }`}
              >
                Ropa
              </button>

              {(vista === 'shorts' ||
                vista === 'shorts-clasicos' ||
                vista === 'shorts-deportivos') && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500/60 shrink-0" />
                  <button
                    type="button"
                    onClick={() => setVista('shorts')}
                    className={`hover:text-blue-400 transition-colors ${
                      vista === 'shorts' ? 'font-black text-white' : 'hover:underline'
                    }`}
                  >
                    Shorts
                  </button>
                </>
              )}

              {vista === 'shorts-clasicos' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500/60 shrink-0" />
                  <span className="font-black text-blue-400">Shorts Clásicos</span>
                </>
              )}

              {vista === 'shorts-deportivos' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500/60 shrink-0" />
                  <span className="font-black text-blue-400">Shorts Deportivos</span>
                </>
              )}
            </div>
          </div>
        </header>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 relative">
        {/* Resplandor cósmico superior sutil para dar continuidad estética con el Inicio */}
        {vista !== 'inicio' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(37,99,235,0.14),rgba(3,7,18,0))] pointer-events-none -z-0" />
        )}
        {/* ========================================================
            VISTA 1: INICIO (DISEÑO FUTURISTA CON ECLIPSE Y BARRA TRANSPARENTE)
            ======================================================== */}
        {vista === 'inicio' && (
          <div
            className="min-h-[100dvh] w-full flex flex-col justify-between relative bg-black text-white font-montserrat select-none overflow-x-hidden animate-fade-in -mt-px"
            style={{
              backgroundImage: "url('/fondo-inicio.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Capa de atmósfera sutil para asegurar contraste sin tapar el eclipse luminoso */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />

            {/* PARTE SUPERIOR: BARRA DE NAVEGACIÓN ELEGANTE Y TRANSPARENTE
                POOL STORE | Inicio | Ropa | Carrito 🛒 */}
            <header className="relative z-20 w-full border-b border-white/10 bg-black/25 backdrop-blur-md">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
                {/* POOL STORE Marca */}
                <button
                  type="button"
                  onClick={() => setVista('inicio')}
                  className="text-left group cursor-pointer focus:outline-hidden"
                >
                  <span className="text-xl sm:text-2xl font-black tracking-widest text-white block leading-none drop-shadow-md group-hover:text-blue-300 transition-colors">
                    POOL STORE
                  </span>
                  <span className="text-[10px] text-blue-200/80 font-medium tracking-tight block mt-0.5">
                    Tienda 100% Virtual
                  </span>
                </button>

                {/* Categorías y Carrito alineados horizontalmente */}
                <nav className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-semibold tracking-wide">
                  <button
                    type="button"
                    onClick={() => setVista('inicio')}
                    className="text-white hover:text-blue-300 font-extrabold px-3 py-1.5 rounded-lg transition-colors cursor-pointer bg-white/10 shadow-xs"
                  >
                    Inicio
                  </button>

                  <span className="text-white/30 hidden sm:inline select-none">|</span>

                  <button
                    type="button"
                    onClick={() => setVista('ropa')}
                    className="text-slate-200 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Ropa
                  </button>

                  <span className="text-white/30 hidden sm:inline select-none">|</span>

                  <button
                    type="button"
                    onClick={() => setModalCarritoAbierto(true)}
                    className="flex items-center gap-1.5 sm:gap-2 text-white bg-blue-600/30 hover:bg-blue-600/50 hover:border-blue-400/60 active:scale-95 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-blue-400/30 backdrop-blur-md transition-all cursor-pointer shadow-sm ml-1"
                    aria-label="Ver carrito"
                  >
                    <span className="font-bold">Carrito</span>
                    <span className="text-sm">🛒</span>
                    {totalPrendas > 0 && (
                      <span className="bg-blue-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none">
                        {totalPrendas}
                      </span>
                    )}
                  </button>
                </nav>
              </div>
            </header>

            {/* PARTE CENTRAL: CONTENIDO CENTRADO SOBRE EL FONDO */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-20 max-w-4xl mx-auto my-auto">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-wider sm:tracking-widest leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] animate-fade-in">
                BIENVENIDO A POOL STORE
              </h1>

              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-200 font-light leading-relaxed drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
                <p className="font-normal text-white text-base sm:text-lg">
                  Somos una tienda 100% virtual donde encontrarás variedad de productos a excelentes precios.
                </p>
                <p className="text-blue-100/85">
                  Actualmente ofrecemos shorts clásicos y deportivos. Próximamente incorporaremos más prendas, tecnología y otros productos.
                </p>
              </div>

              {/* Botón azul eléctrico con bordes redondeados */}
              <div className="mt-8 sm:mt-12 animate-fade-in">
                <button
                  type="button"
                  onClick={() => setVista('ropa')}
                  className="px-8 sm:px-12 py-3.5 sm:py-4.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-sm sm:text-base rounded-full tracking-widest uppercase transition-all duration-300 glow-blue-electric hover:scale-105 cursor-pointer inline-flex items-center gap-3 border border-blue-400/50 shadow-2xl"
                >
                  <span>EXPLORAR CATÁLOGO</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* PARTE INFERIOR: PIE MINIMALISTA DISCRETO */}
            <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-400/80 font-light tracking-wide px-4 border-t border-white/5 bg-black/20 backdrop-blur-xs">
              <p className="drop-shadow-sm">POOL STORE · Tienda 100% Virtual · Envíos por Shalom a todo el Perú · WhatsApp: {POLESTORE_PHONE_DISPLAY}</p>
            </footer>
          </div>
        )}

        {/* ========================================================
            VISTA 2: ROPA (MOSTRAR ÚNICAMENTE LA CATEGORÍA SHORTS)
            ======================================================== */}
        {vista === 'ropa' && (
          <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-8 animate-fade-in font-montserrat">
            {/* Cabecera de la sección Ropa */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[11px] font-extrabold uppercase text-blue-400 tracking-wider">
                  Navegación POOL STORE
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Ropa
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  En la categoría Ropa disponemos de nuestra línea especializada en shorts deportivos.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setVista('inicio')}
                className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al Inicio</span>
              </button>
            </div>

            {/* LUGAR DE SHORTS ORGANIZADO CON ICONO DE SHORTS */}
            <div className="space-y-6">
              {/* Tarjeta Principal: Lugar de Shorts */}
              <div className="bg-gradient-to-r from-neutral-900/90 via-blue-950/25 to-neutral-900/90 border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_40px_rgba(37,99,235,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-4">
                  {/* Icono de Shorts exclusivo */}
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-400/40 text-blue-300 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25 glow-blue-electric">
                    <ShortsIcon className="w-9 h-9" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600/30 text-blue-300 border border-blue-400/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Categoría Activa
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                        • 47 modelos disponibles
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                      Shorts Deportivos
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                      Nuestra colección principal de shorts está organizada en dos líneas especializadas: <strong>Shorts Clásicos</strong> (tela polistrech) y <strong>Shorts Deportivos</strong> (tela win de equipos).
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setVista('shorts')}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl text-sm font-extrabold transition-all shrink-0 shadow-lg glow-blue-electric flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShortsIcon className="w-4 h-4" />
                  <span>Ver Todos los Shorts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* GRID ORGANIZADA: 2 SUB-CATEGORÍAS DE SHORTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Shorts Clásicos */}
                <div
                  onClick={() => setVista('shorts-clasicos')}
                  className="group bg-neutral-900/80 border border-neutral-800 hover:border-blue-500/70 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] flex flex-col justify-between backdrop-blur-md"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                          <ShortsIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-wider">
                          Shorts Clásicos
                        </span>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-black rounded-lg">
                        S/ 15.00 c/u
                      </span>
                    </div>

                    <div className="aspect-[4/3] bg-neutral-950 rounded-2xl p-3 flex items-center justify-center border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                      <img
                        src="/shorts/negro-con-rayas-doradas.webp"
                        alt="Short Clásico Poliéster"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                        Tela Polistrech / Poliéster
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Shorts lisos deportivos con cordón ajustable y elástico resistente. Al ingresar podrás elegir el color del short, el color de las rayas y tu talla (XS, S, M, L, XL, XXL).
                      </p>
                    </div>

                    {/* Muestra visual de colores disponibles directamente en la tarjeta */}
                    <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                      <span className="text-[11px] font-bold text-slate-300 block">
                        Colores disponibles:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {COLORES_SHORT_POLIESTER.map((color) => {
                          const styleInfo = COLOR_HEX_MAP[color] || { bg: '#333', text: '#fff' };
                          return (
                            <span
                              key={color}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-[10px] text-slate-300"
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-white/20"
                                style={{ backgroundColor: styleInfo.bg }}
                              />
                              <span>{color}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Desde S/ 15.00</span>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 group-hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors glow-blue-electric cursor-pointer"
                    >
                      <span>Ver Shorts Clásicos</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* 2. Shorts Deportivos Win */}
                <div
                  onClick={() => setVista('shorts-deportivos')}
                  className="group bg-neutral-900/80 border border-neutral-800 hover:border-blue-500/70 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] flex flex-col justify-between backdrop-blur-md"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                          <ShortsIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-wider">
                          Shorts Deportivos
                        </span>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-black rounded-lg">
                        S/ 28.00 c/u
                      </span>
                    </div>

                    <div className="aspect-[4/3] bg-neutral-950 rounded-2xl p-3 flex items-center justify-center border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                      <img
                        src="/shorts-win/argentina.jpg"
                        alt="Short Deportivo Tela Win"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                        Tela Win Oficial · Equipos
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Shorts oficiales de clubes y selecciones en tela Win transpirable con escudo de alta calidad. Talla estándar L con elástico y cordón.
                      </p>
                    </div>

                    {/* Muestra de equipos disponibles directamente en la tarjeta */}
                    <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                      <span className="text-[11px] font-bold text-slate-300 block">
                        Equipos disponibles:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {SHORTS_WIN.map((team) => (
                          <span
                            key={team.id}
                            className="px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-[10px] text-slate-300 font-medium"
                          >
                            {team.modelo}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-bold">Promo 3 por S/ 75</span>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 group-hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors glow-blue-electric cursor-pointer"
                    >
                      <span>Ver Shorts Deportivos</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* BENEFICIOS Y GARANTÍAS DE POOL STORE EN ROPA */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3.5 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Delivery Gratis</strong>
                    <span className="text-slate-400 text-[11px]">En compras desde 3 shorts</span>
                  </div>
                </div>

                <div className="p-3.5 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Envíos por Shalom</strong>
                    <span className="text-slate-400 text-[11px]">A todas las provincias del Perú</span>
                  </div>
                </div>

                <div className="p-3.5 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Atención WhatsApp</strong>
                    <span className="text-slate-400 text-[11px]">Respuesta rápida y directa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VISTA 3: SHORTS (MOSTRAR DOS OPCIONES: SHORTS CLÁSICOS Y SHORTS DEPORTIVOS)
            ======================================================== */}
        {vista === 'shorts' && (
          <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-8 animate-fade-in">
            {/* Cabecera */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[11px] font-extrabold uppercase text-blue-400 tracking-wider">
                  Ropa → Shorts
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                  <ShortsIcon className="w-7 h-7 text-blue-400" />
                  <span>Shorts POOL STORE</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Selecciona una de las dos opciones para ver colores, tallas y agregar a tu pedido:
                </p>
              </div>

              <button
                type="button"
                onClick={() => setVista('ropa')}
                className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a Ropa</span>
              </button>
            </div>

            {/* LAS DOS OPCIONES EXACTAS: Shorts Clásicos y Shorts Deportivos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* OPCIÓN 1: SHORTS CLÁSICOS */}
              <div
                onClick={() => setVista('shorts-clasicos')}
                className="group bg-neutral-900/80 border border-neutral-800 hover:border-blue-500/70 rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] flex flex-col justify-between backdrop-blur-md relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-white/10 text-slate-200 border border-white/10 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      Poliéster / Polistrech
                    </span>
                    <span className="text-base font-black text-blue-400">
                      S/ 15.00 c/u
                    </span>
                  </div>

                  <div className="aspect-[4/3] bg-neutral-950 rounded-2xl p-4 flex items-center justify-center border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                    <img
                      src="/shorts/negro-con-rayas-doradas.webp"
                      alt="Short Clásico Poliéster"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                      Shorts Clásicos
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Shorts deportivos lisos en tela Polistrech de poliéster. Confección fresca y resistente con cordón ajustable y elástico duradero.
                    </p>
                  </div>

                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-neutral-800">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>36 combinaciones reales de color y rayas</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Tallas XS, S, M, L, XL y XXL</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Promociones: 6 a S/ 13.50 c/u · 12 a S/ 12.00 c/u</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-300">
                    Desde S/ 15.00
                  </span>
                  <div className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 glow-blue-electric">
                    <span>Ver Shorts Clásicos</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* OPCIÓN 2: SHORTS DEPORTIVOS */}
              <div
                onClick={() => setVista('shorts-deportivos')}
                className="group bg-neutral-900/80 border border-neutral-800 hover:border-blue-500/70 rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] flex flex-col justify-between backdrop-blur-md relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      Tela Win · Equipos de Fútbol
                    </span>
                    <span className="text-base font-black text-blue-400">
                      S/ 28.00 c/u
                    </span>
                  </div>

                  <div className="aspect-[4/3] bg-neutral-950 rounded-2xl p-4 flex items-center justify-center border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                    <img
                      src="/shorts-win/argentina.jpg"
                      alt="Short Deportivo de Equipos"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                      Shorts Deportivos
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Shorts oficiales de selecciones y clubes internacionales en tela Win transpirable con escudo bordado/estampado de alta resistencia.
                    </p>
                  </div>

                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-neutral-800">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>11 modelos: Argentina, Brasil, Barcelona, Alianza Lima, U y más</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Talla estándar L con cordón de ajuste y elástico</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Promoción especial: <strong>3 por S/ 75</strong> (S/ 25 c/u)</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-300">
                    S/ 28.00 c/u (3 x S/ 75)
                  </span>
                  <div className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 glow-blue-electric">
                    <span>Ver Shorts Deportivos</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VISTA 4: SHORTS CLÁSICOS (POLIÉSTER / POLISTRECH · S/ 15)
            ======================================================== */}
        {vista === 'shorts-clasicos' && (
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-10 animate-fade-in">
            {/* BARRA SUPERIOR DE NAVEGACIÓN Y CAMBIO ENTRE OPCIONES */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setVista('shorts')}
                className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a Shorts</span>
              </button>

              <div className="bg-neutral-900/90 p-1 rounded-xl flex items-center gap-1 text-xs font-bold border border-neutral-800">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md cursor-default flex items-center gap-1.5"
                >
                  <ShortsIcon className="w-3.5 h-3.5" />
                  <span>Shorts Clásicos (S/ 15)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVista('shorts-deportivos')}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Ver Shorts Deportivos (S/ 28)</span>
                </button>
              </div>
            </div>

            {/* RECORDATORIO DE PRECIOS Y PROMOCIONES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-neutral-900/70 rounded-xl border border-neutral-800 text-slate-300">
                <span className="text-slate-400 block text-[11px]">1 a 5 unidades</span>
                <strong className="text-white text-sm font-black">S/ 15.00 c/u</strong>
              </div>
              <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/60 text-blue-200">
                <span className="text-blue-300 block text-[11px]">Promo desde 6 unidades</span>
                <strong className="text-blue-400 text-sm font-black">S/ 13.50 c/u (6 = S/ 81)</strong>
              </div>
              <div className="p-3 bg-neutral-900 rounded-xl border border-blue-500/30 text-white shadow-md">
                <span className="text-slate-400 block text-[11px]">Precio Docena (12+)</span>
                <strong className="text-white text-sm font-black">S/ 12.00 c/u (12 = S/ 144)</strong>
              </div>
            </div>

            {/* CONFIGURADOR INTERACTIVO DE SHORT CLÁSICO */}
            <section className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* FOTOGRAFÍA PRINCIPAL */}
                <div className="lg:col-span-6 flex flex-col items-center">
                  <div
                    className="w-full aspect-[4/3] bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex items-center justify-center cursor-pointer relative group overflow-hidden"
                    onClick={() => setModalFoto(productoConfigurado)}
                    title="Toca para ampliar foto"
                  >
                    <img
                      src={productoConfigurado.imagen}
                      alt={productoConfigurado.nombre}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      <span className="bg-neutral-900/90 text-slate-200 border border-white/10 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        Tela Polistrech
                      </span>
                      {productoConfigurado.tallasDisponibles.length === 1 && (
                        <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Solo Talla {productoConfigurado.tallasDisponibles[0]}
                        </span>
                      )}
                    </div>

                    <span className="absolute top-3 right-3 bg-blue-600 text-white text-sm font-black px-3 py-1 rounded-lg shadow-md glow-blue-electric">
                      S/ 15
                    </span>

                    <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-slate-200 border border-white/10 text-[10px] font-bold px-2 py-1 rounded-md shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      🔍 Toca para ampliar
                    </span>
                  </div>
                </div>

                {/* SELECTORES DE VARIANTES */}
                <div className="lg:col-span-6 space-y-6">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase text-blue-400 tracking-wider">
                      Shorts Clásicos POOL STORE
                    </span>
                    <h2 className="text-2xl font-black text-white leading-tight">
                      {productoConfigurado.nombre}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Short deportivo con elástico resistente y cordón ajustable. Tela Polistrech fresca y duradera.
                    </p>
                  </div>

                  {/* 1. CUADRADITOS PARA COLOR DEL SHORT */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-300">1. Color del Short:</span>
                      <strong className="text-blue-400">{colorShortConfig}</strong>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {COLORES_SHORT_POLIESTER.map((color) => {
                        const styleInfo = COLOR_HEX_MAP[color] || { bg: '#333333', text: '#ffffff' };
                        const isSelected = colorShortConfig === color;

                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setColorShortConfig(color)}
                            className={`group relative px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-neutral-950 bg-blue-600 text-white shadow-md'
                                : 'border-neutral-800 bg-neutral-950/80 text-slate-300 hover:border-neutral-700 hover:text-white'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-md shrink-0 border border-white/20"
                              style={{ backgroundColor: styleInfo.bg }}
                            />
                            <span>{color}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. CUADRADITOS PARA COLOR DE RAYAS */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-300">2. Color de las Rayas:</span>
                      <strong className="text-blue-400">{colorRayasConfig}</strong>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {rayasDisponibles.map((rayas) => {
                        const styleInfo = COLOR_HEX_MAP[rayas] || { bg: '#111', text: '#fff' };
                        const isSelected = colorRayasConfig === rayas;

                        return (
                          <button
                            key={rayas}
                            type="button"
                            onClick={() => setColorRayasConfig(rayas)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-neutral-950 bg-blue-600 text-white shadow-md'
                                : 'border-neutral-800 bg-neutral-950/80 text-slate-300 hover:border-neutral-700 hover:text-white'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-md shrink-0 border border-white/20"
                              style={{ backgroundColor: styleInfo.bg }}
                            />
                            <span>Rayas {rayas}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. SELECTOR DE TALLAS (XS, S, M, L, XL, XXL) CON CANDADO */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-300">3. Selecciona Talla:</span>
                        <button
                          type="button"
                          onClick={() => setModalGuiaTallas(true)}
                          className="text-[11px] text-blue-400 hover:underline flex items-center gap-0.5"
                        >
                          <Ruler className="w-3 h-3" /> Guía de medidas
                        </button>
                      </div>
                      <strong className="text-blue-400">{tallaConfig}</strong>
                    </div>

                    <div className="grid grid-cols-6 gap-1.5">
                      {TALLAS_DISPONIBLES.map((talla) => {
                        const disponible = estaTallaDisponible(productoConfigurado, talla);
                        const isSelected = tallaConfig === talla;

                        if (!disponible) {
                          return (
                            <button
                              key={talla}
                              type="button"
                              disabled
                              title={`Talla ${talla} no disponible para esta combinación (candado)`}
                              className="py-2 rounded-xl text-xs font-bold border border-dashed border-neutral-800/80 bg-neutral-950/40 text-neutral-600 cursor-not-allowed pointer-events-none flex flex-col items-center justify-center opacity-50"
                            >
                              <span className="line-through">{talla}</span>
                              <Lock className="w-2.5 h-2.5 mt-0.5" />
                            </button>
                          );
                        }

                        return (
                          <button
                            key={talla}
                            type="button"
                            onClick={() => setTallaConfig(talla)}
                            className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500 ring-offset-2 ring-offset-neutral-950 shadow-md font-black'
                                : 'bg-neutral-950/80 text-slate-200 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                            }`}
                          >
                            {talla}
                          </button>
                        );
                      })}
                    </div>

                    {productoConfigurado.tallasDisponibles.length === 1 && (
                      <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 pt-1">
                        <Lock className="w-3 h-3 shrink-0" />
                        Este modelo solo está disponible en talla {productoConfigurado.tallasDisponibles[0]}. Las demás tallas tienen candado.
                      </p>
                    )}
                  </div>

                  {/* 4. SELECTOR DE CANTIDAD Y BOTÓN AGREGAR */}
                  <div className="pt-3 border-t border-neutral-800 flex items-center gap-3">
                    <div className="flex items-center border border-neutral-800 rounded-xl bg-neutral-950 p-0.5">
                      <button
                        type="button"
                        onClick={() => setCantidadConfig((prev) => Math.max(1, prev - 1))}
                        className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-neutral-900 hover:text-white rounded-lg font-bold cursor-pointer"
                        title="Menos"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-white tabular-nums">
                        {cantidadConfig}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCantidadConfig((prev) => prev + 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-neutral-900 hover:text-white rounded-lg font-bold cursor-pointer"
                        title="Más"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleAgregarAlCarrito(productoConfigurado, tallaConfig, cantidadConfig)
                      }
                      className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl glow-blue-electric active:scale-98"
                    >
                      <ShoppingBag className="w-4 h-4 text-white" />
                      <span>AGREGAR AL CARRITO (S/ 15)</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================
            VISTA 5: SHORTS DEPORTIVOS (TELA WIN DE EQUIPOS · S/ 28)
            ======================================================== */}
        {vista === 'shorts-deportivos' && (
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-10 animate-fade-in">
            {/* BARRA SUPERIOR DE NAVEGACIÓN Y CAMBIO ENTRE OPCIONES */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setVista('shorts')}
                className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a Shorts</span>
              </button>

              <div className="bg-neutral-900/90 p-1 rounded-xl flex items-center gap-1 text-xs font-bold border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setVista('shorts-clasicos')}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ShortsIcon className="w-3.5 h-3.5" />
                  <span>Ver Shorts Clásicos (S/ 15)</span>
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md cursor-default flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Shorts Deportivos (S/ 28)</span>
                </button>
              </div>
            </div>

            {/* RECORDATORIO DE PROMOCIÓN WIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 bg-neutral-900/70 rounded-xl border border-neutral-800 text-slate-300">
                <span className="text-slate-400 block text-[11px]">1 o 2 unidades</span>
                <strong className="text-white text-sm font-black">S/ 28.00 c/u</strong>
              </div>
              <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/60 text-blue-200">
                <span className="text-blue-300 block text-[11px]">Promoción Especial de Equipos</span>
                <strong className="text-blue-400 text-sm font-black">3 shorts por S/ 75 (S/ 25.00 c/u)</strong>
              </div>
            </div>

            {/* SELECTOR INTERACTIVO DE SHORT DEPORTIVO WIN */}
            <section className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 flex flex-col items-center">
                  <div
                    className="w-full aspect-[4/3] bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex items-center justify-center cursor-pointer relative group overflow-hidden"
                    onClick={() => setModalFoto(productoWinSeleccionado)}
                  >
                    <img
                      src={productoWinSeleccionado.imagen}
                      alt={productoWinSeleccionado.nombre}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs">
                        Tela Win Transpirable
                      </span>
                      <span className="bg-neutral-900/90 text-slate-200 border border-white/10 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        Disponible en Talla L
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col items-end">
                      <span className="bg-blue-600 text-white text-sm font-black px-3 py-1 rounded-lg shadow-md glow-blue-electric">
                        S/ 28
                      </span>
                      <span className="mt-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        3 por S/ 75
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-6">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase text-blue-400 tracking-wider">
                      Shorts Deportivos de Equipos
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      {productoWinSeleccionado.nombre}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Short oficial con escudo y tela Win de alta ventilación. Talla estándar L con cordón y pretina elástica.
                    </p>
                  </div>

                  {/* Selector rápido de modelos de equipos */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">
                      Selecciona el equipo o modelo:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1.5 border border-neutral-800 rounded-xl bg-neutral-950/60">
                      {SHORTS_WIN.map((team) => (
                        <button
                          key={team.id}
                          type="button"
                          onClick={() => setIdWinSeleccionado(team.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            idWinSeleccionado === team.id
                              ? 'bg-blue-600 text-white shadow-md border border-blue-400'
                              : 'bg-neutral-900 hover:bg-neutral-800 text-slate-300 hover:text-white border border-neutral-800'
                          }`}
                        >
                          {team.modelo}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Talla y cantidad */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs p-3 bg-blue-950/30 border border-blue-900/60 rounded-xl">
                      <div>
                        <span className="text-blue-300 font-bold block">Talla Única Disponible:</span>
                        <span className="text-slate-300 text-[11px]">Talla L (Equivalente Talla 42 con cordón ajustable)</span>
                      </div>
                      <span className="px-3 py-1 bg-blue-600 text-white font-black text-xs rounded-lg shadow-sm">
                        Talla L
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex items-center border border-neutral-800 rounded-xl bg-neutral-950 p-0.5">
                        <button
                          type="button"
                          onClick={() => setCantidadWin((prev) => Math.max(1, prev - 1))}
                          className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-neutral-900 hover:text-white rounded-lg font-bold cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-white tabular-nums">
                          {cantidadWin}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCantidadWin((prev) => prev + 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-neutral-900 hover:text-white rounded-lg font-bold cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleAgregarAlCarrito(productoWinSeleccionado, 'L', cantidadWin)
                        }
                        className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl glow-blue-electric active:scale-98"
                      >
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>AGREGAR AL CARRITO (Talla L)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ========================================================
          DRAWER LATERAL DEL CARRITO DE COMPRAS
          ======================================================== */}
      {modalCarritoAbierto && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in font-montserrat">
          {/* Fondo oscuro con desenfoque */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setModalCarritoAbierto(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className="w-screen max-w-md bg-neutral-950 text-white shadow-2xl flex flex-col justify-between border-l border-neutral-800">
              {/* Cabecera del Carrito */}
              <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/80 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white tracking-wide">Tu Pedido Pool Store</h2>
                    <p className="text-xs text-slate-400">
                      {totalPrendas === 0
                        ? 'Carrito vacío'
                        : `${totalPrendas} ${totalPrendas === 1 ? 'prenda seleccionada' : 'prendas seleccionadas'}`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalCarritoAbierto(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  aria-label="Cerrar pedido"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lista de Productos en el Carrito */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {carrito.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-slate-200">Tu carrito está vacío</p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Explora nuestros shorts de Poliéster y shorts Win para armar tu pedido.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setModalCarritoAbierto(false);
                        setVista('shorts-clasicos');
                      }}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all glow-blue-electric cursor-pointer"
                    >
                      Ver Shorts Clásicos
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                        Artículos agregados
                      </span>
                      <button
                        type="button"
                        onClick={handleVaciarCarrito}
                        className="text-[11px] text-red-400 hover:text-red-300 hover:underline cursor-pointer transition-colors"
                      >
                        Vaciar carrito
                      </button>
                    </div>

                    {carrito.map((item) => {
                      const p = item.producto;
                      const precioItem =
                        p.tipoTela === 'poliester'
                          ? precioUnitarioPoliester
                          : p.tipoTela === 'win'
                          ? precioUnitarioWin
                          : p.precio;
                      const subtotalItem = precioItem * item.cantidad;

                      return (
                        <div
                          key={item.id}
                          className="p-3 bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl flex items-center gap-3 transition-colors backdrop-blur-xs"
                        >
                          <img
                            src={p.imagen}
                            alt={p.nombre}
                            className="w-14 h-14 object-contain bg-neutral-950 rounded-xl border border-neutral-800 shrink-0 p-1"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-xs text-white truncate">
                              {p.nombre}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              {p.tipoTela === 'poliester'
                                ? `Color: ${p.colorShort} · Rayas: ${p.colorRayas}`
                                : `Modelo: ${p.modelo}`}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold bg-neutral-800 text-slate-300 border border-neutral-700 px-1.5 py-0.5 rounded">
                                Talla {item.talla}
                              </span>
                              <span className="text-xs font-black text-blue-400">
                                S/ {subtotalItem.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1.5">
                            <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-950 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => handleModificarCantidad(item.id, -1)}
                                className="px-2 py-0.5 text-xs font-bold text-slate-300 hover:bg-neutral-800 hover:text-white cursor-pointer transition-colors"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold text-white tabular-nums">
                                {item.cantidad}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleModificarCantidad(item.id, 1)}
                                className="px-2 py-0.5 text-xs font-bold text-slate-300 hover:bg-neutral-800 hover:text-white cursor-pointer transition-colors"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleEliminarItem(item.id)}
                              className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer p-1"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* MODALIDAD DE ENTREGA EN CARRITO */}
                    <div className="pt-3 border-t border-neutral-800 space-y-2">
                      <span className="text-xs font-bold text-slate-300 block">
                        Modalidad de Entrega:
                      </span>

                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        <button
                          type="button"
                          onClick={() => setTipoEntrega('punto')}
                          className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                            tipoEntrega === 'punto'
                              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                              : 'bg-neutral-900 text-slate-300 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          Punto Fijo
                        </button>

                        <button
                          type="button"
                          onClick={() => setTipoEntrega('delivery')}
                          className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                            tipoEntrega === 'delivery'
                              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                              : 'bg-neutral-900 text-slate-300 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          Delivery {deliveryGratisDesbloqueado ? 'Gratis' : ''}
                        </button>

                        <button
                          type="button"
                          onClick={() => setTipoEntrega('shalom')}
                          className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                            tipoEntrega === 'shalom'
                              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                              : 'bg-neutral-900 text-slate-300 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          Shalom
                        </button>
                      </div>

                      {tipoEntrega === 'delivery' && (
                        <div className="p-2.5 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-2 text-xs">
                          {deliveryGratisDesbloqueado ? (
                            <span className="text-emerald-400 font-extrabold flex items-center gap-1 text-[11px]">
                              <Check className="w-3.5 h-3.5" /> ¡Calificas para Delivery Gratis!
                            </span>
                          ) : (
                            <span className="text-amber-400 text-[11px] block">
                              Agrega {3 - totalPrendas} short(s) más para desbloquear Delivery Gratis.
                            </span>
                          )}

                          <select
                            value={zonaDelivery}
                            onChange={(e) => setZonaDelivery(e.target.value)}
                            className="w-full p-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-semibold text-white focus:outline-hidden focus:border-blue-500"
                          >
                            {ZONAS_DELIVERY_GRATIS.map((z) => (
                              <option key={z} value={z}>
                                {z}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {tipoEntrega === 'punto' && (
                        <div className="p-2.5 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs">
                          <select
                            value={puntoEntrega}
                            onChange={(e) => setPuntoEntrega(e.target.value)}
                            className="w-full p-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-semibold text-white focus:outline-hidden focus:border-blue-500"
                          >
                            {PUNTOS_ENTREGA.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {tipoEntrega === 'shalom' && (
                        <div className="p-2.5 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs">
                          <input
                            type="text"
                            placeholder="Ciudad / Agencia de destino Shalom"
                            value={destinoShalom}
                            onChange={(e) => setDestinoShalom(e.target.value)}
                            className="w-full p-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Pie del Carrito: Totales y Botón COMPRAR POR WHATSAPP */}
              {carrito.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-900/90 backdrop-blur-md space-y-3">
                  <div className="space-y-1 text-xs">
                    {ahorroTotal > 0 && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Ahorro aplicado:</span>
                        <span>- S/ {ahorroTotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm font-black text-white pt-1">
                      <span>Total General:</span>
                      <span className="text-xl text-blue-400 font-black">S/ {totalGeneral.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleComprarPorWhatsApp}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-sm font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                    <span>COMPRAR POR WHATSAPP</span>
                  </button>

                  <p className="text-[10px] text-slate-400 text-center">
                    Se abrirá WhatsApp ({POLESTORE_PHONE_DISPLAY}) con el detalle completo de tus productos y fotos.
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-montserrat"
          onClick={() => setModalFoto(null)}
        >
          <div
            className="relative bg-neutral-950 border border-neutral-800 text-white max-w-xl w-full rounded-3xl p-5 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <div>
                <h3 className="font-extrabold text-sm text-white">{modalFoto.nombre}</h3>
                <span className="text-xs text-slate-400">
                  {modalFoto.colorShort} · {modalFoto.tipoTela === 'poliester' ? `Rayas ${modalFoto.colorRayas}` : 'Modelo Oficial'} · S/ {modalFoto.precio.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalFoto(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-[4/3] bg-neutral-900/60 border border-neutral-800/80 rounded-2xl flex items-center justify-center p-2 my-4">
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
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (modalFoto.tipoTela === 'poliester') {
                    setColorShortConfig(modalFoto.colorShort);
                    setColorRayasConfig(modalFoto.colorRayas);
                    setVista('shorts-clasicos');
                  } else {
                    setIdWinSeleccionado(modalFoto.id);
                    setVista('shorts-deportivos');
                  }
                  setModalFoto(null);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all glow-blue-electric cursor-pointer"
              >
                <span>Ver este modelo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE GUÍA DE MEDIDAS Y TALLAS */}
      {modalGuiaTallas && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-montserrat"
          onClick={() => setModalGuiaTallas(false)}
        >
          <div
            className="bg-neutral-950 border border-neutral-800 text-white max-w-sm w-full rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Ruler className="w-4 h-4 text-blue-400" />
                <span>Guía de Tallas Pool Store</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalGuiaTallas(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabla Poliéster */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[11px] font-extrabold uppercase text-blue-400 tracking-wider block">
                Shorts Clásicos (Tela Polistrech)
              </span>
              <div className="border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-800/80 bg-neutral-900/40">
                {Object.entries(GUIA_TALLAS).map(([t, info]) => (
                  <div key={t} className="flex justify-between p-2.5">
                    <span className="font-black text-white">{t}</span>
                    <span className="text-slate-300">{info.tallaNumero} (Cintura {info.cintura} cm)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nota Win */}
            <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl text-xs text-blue-200">
              <strong className="block font-bold text-blue-300">⚽ Shorts Deportivos (Tela Win):</strong>
              <p className="mt-0.5 text-slate-300">
                Talla estándar L con elástico adaptable y cordón de ajuste (Cintura 42 cm).
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalGuiaTallas(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all glow-blue-electric cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* BARRA INFERIOR FIJA EN MÓVILES CUANDO HAY PRODUCTOS */}
      {totalPrendas > 0 && !modalCarritoAbierto && (
        <aside aria-label="Resumen de pedido móvil" className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-neutral-950/95 backdrop-blur-md border-t border-white/10 p-3 shadow-2xl animate-fade-in font-montserrat">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                {totalPrendas} {totalPrendas === 1 ? 'prenda' : 'prendas'} seleccionadas
              </span>
              <strong className="text-base font-black text-white">
                S/ {totalGeneral.toFixed(2)}
              </strong>
            </div>

            <button
              type="button"
              onClick={() => setModalCarritoAbierto(true)}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Pedido</span>
            </button>
          </div>
        </aside>
      )}

      {/* PIE DE PÁGINA (solo para catálogo y subsecciones) */}
      {vista !== 'inicio' && (
        <footer className="mt-auto border-t border-white/10 bg-black/60 backdrop-blur-md py-8 px-4 text-center text-xs text-slate-400 space-y-2 font-montserrat">
          <p className="font-black text-white tracking-widest text-sm uppercase">
            POOL STORE
          </p>
          <p className="italic text-slate-300">Tu tienda 100% virtual de confianza.</p>
          <p className="text-[11px] text-slate-400">
            Chiclayo · José Leonardo Ortiz · Lambayeque · La Victoria · Envíos por Shalom a todo el Perú
          </p>
          <p className="text-[10px] text-slate-500">
            WhatsApp oficial: {POLESTORE_PHONE_DISPLAY}
          </p>
        </footer>
      )}
    </div>
  );
}
