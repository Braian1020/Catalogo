/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  PRODUCTOS,
  SHORTS_POLIESTER,
  SHORTS_WIN,
  PRODUCTOS_TECNOLOGIA,
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
  ExternalLink,
  MessageCircle,
  Home,
  Layers,
  Shirt,
  Tv,
  Speaker,
  Headphones,
} from 'lucide-react';

const STORAGE_KEY_CARRITO = 'polestore_carrito_v2';

type VistaNavegacion =
  | 'inicio'
  | 'ropa-shorts-poliester'
  | 'ropa-shorts-win'
  | 'tecnologia';

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

  // 2. CARRITO CON PERSISTENCIA EN LOCALSTORAGE (Requisito 6)
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

  // 4. CONFIGURADOR INTERACTIVO DE SHORT POLIÉSTER (Requisito 3)
  const [colorShortConfig, setColorShortConfig] = useState<string>('Negro');
  const [colorRayasConfig, setColorRayasConfig] = useState<string>('Dorado');
  const [tallaConfig, setTallaConfig] = useState<Talla>('M');
  const [cantidadConfig, setCantidadConfig] = useState<number>(1);

  // Obtener rayas disponibles para el color de short actual
  const rayasDisponibles = useMemo(() => {
    return getRayasPorColorShort(colorShortConfig);
  }, [colorShortConfig]);

  // Si las rayas actuales no son válidas para este color, ajustar automáticamente a la primera válida
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

  // 5. ESTADO PARA SHORT WIN (EQUIPOS)
  const [idWinSeleccionado, setIdWinSeleccionado] = useState<string>('win-argentina');
  const [cantidadWin, setCantidadWin] = useState<number>(1);

  const productoWinSeleccionado = useMemo(() => {
    return SHORTS_WIN.find((w) => w.id === idWinSeleccionado) || SHORTS_WIN[0];
  }, [idWinSeleccionado]);

  // 6. MODALIDADES DE ENTREGA
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>('punto');
  const [zonaDelivery, setZonaDelivery] = useState<string>('Chiclayo');
  const [direccionDelivery, setDireccionDelivery] = useState<string>('');
  const [puntoEntrega, setPuntoEntrega] = useState<string>('La Catedral de Chiclayo');
  const [destinoShalom, setDestinoShalom] = useState<string>('');

  // 7. CÁLCULO AUTOMÁTICO DE PRECIOS Y PROMOCIONES (Requisitos 6 y 7)
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

  // Precio unitario efectivo según cantidad por colección
  const precioUnitarioPoliester = useMemo(() => {
    if (prendasPoliester >= 12) return 12.0;
    if (prendasPoliester >= 6) return 13.5;
    return 15.0;
  }, [prendasPoliester]);

  const precioUnitarioWin = useMemo(() => {
    if (prendasWin >= 3) return 25.0;
    return 28.0;
  }, [prendasWin]);

  // Total y Ahorro calculado
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
      // Validar que la talla esté disponible
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

  const handleEliminarItem = useCallback((idItem: string) => {
    setCarrito((prev) => prev.filter((it) => it.id !== idItem));
    mostrarToast('Producto eliminado del pedido.');
  }, [mostrarToast]);

  const handleVaciarCarrito = useCallback(() => {
    setCarrito([]);
    mostrarToast('Pedido vaciado.');
  }, [mostrarToast]);

  // 9. ENVÍO POR WHATSAPP (Requisito 7)
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
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* TOAST FLOTANTE */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl border border-neutral-800 animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* CABECERA PRINCIPAL Y BARRA DE NAVEGACIÓN (Requisitos 1 y 8) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
        {/* Banner superior de confianza */}
        <div className="bg-neutral-950 text-neutral-200 text-[11px] py-1 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap">
          <span>🛵 Delivery Gratis desde 3 shorts</span>
          <span className="text-neutral-500">•</span>
          <span>📍 Chiclayo, JLO, Lambayeque y La Victoria</span>
          <span className="text-neutral-500">•</span>
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
              <span className="text-xl sm:text-2xl font-black tracking-widest text-neutral-950 block leading-none">
                POLESTORE
              </span>
              <span className="text-[10px] text-neutral-500 font-medium tracking-tight block">
                Tu tienda virtual de confianza
              </span>
            </button>
          </div>

          {/* NAVEGACIÓN RÁPIDA EN DESKTOP */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setVista('inicio')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                vista === 'inicio'
                  ? 'bg-neutral-100 text-neutral-950 font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </button>

            <button
              type="button"
              onClick={() => setVista('ropa-shorts-poliester')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                vista === 'ropa-shorts-poliester'
                  ? 'bg-neutral-950 text-white font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>Shorts Poliéster (S/15)</span>
            </button>

            <button
              type="button"
              onClick={() => setVista('ropa-shorts-win')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                vista === 'ropa-shorts-win'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shorts Win Equipos (S/28)</span>
            </button>

            <button
              type="button"
              onClick={() => setVista('tecnologia')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                vista === 'tecnologia'
                  ? 'bg-amber-500 text-white font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Tecnología</span>
              <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase">
                Nuevo
              </span>
            </button>
          </nav>

          {/* ACCIONES: GUÍA DE TALLAS Y CARRITO */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalGuiaTallas(true)}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-950 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Tallas</span>
            </button>

            <button
              type="button"
              onClick={() => setModalCarritoAbierto(true)}
              className="relative px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              aria-label="Ver pedido"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Mi Pedido</span>
              <span className="sm:hidden">S/ {totalGeneral.toFixed(0)}</span>
              {totalPrendas > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none tabular-nums">
                  {totalPrendas}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* BREADCRUMB DE NAVEGACIÓN (Requisito 1: POLESTORE → Ropa → Shorts → Poliéster / Tela Win) */}
        <div className="bg-neutral-50 border-t border-neutral-200/80 px-4 py-2 text-xs">
          <div className="max-w-6xl mx-auto flex items-center gap-1.5 text-neutral-500 font-medium overflow-x-auto whitespace-nowrap">
            <button
              type="button"
              onClick={() => setVista('inicio')}
              className="hover:text-neutral-950 transition-colors font-semibold"
            >
              POLESTORE
            </button>

            {vista !== 'inicio' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                {vista.startsWith('ropa') ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setVista('ropa-shorts-poliester')}
                      className="hover:text-neutral-950 transition-colors"
                    >
                      Ropa
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="text-neutral-700">Shorts</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="font-bold text-neutral-950">
                      {vista === 'ropa-shorts-poliester' ? 'Poliéster (Polistrech)' : 'Tela Win (Equipos)'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-neutral-950">Tecnología</span>
                    <span className="text-neutral-400 text-[11px]">(Parlantes, TV Box y Accesorios)</span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL SEGÚN LA VISTA SELECCIONADA */}
      <main className="flex-1">
        {/* ========================================================
            VISTA 1: INICIO (HOME CON CATEGORÍAS Y PRODUCTOS DESTACADOS)
            ======================================================== */}
        {vista === 'inicio' && (
          <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-12 animate-fade-in">
            {/* HERO PRINCIPAL */}
            <section className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xl">
              <div className="max-w-xl space-y-4 relative z-10">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  Catálogo 2026 actualizado
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Encuentra tu Short Deportivo Ideal
                </h1>
                <p className="text-sm sm:text-base text-neutral-300">
                  Shorts Clásicos de Poliéster y Shorts Win de Equipos de Fútbol. Elige tus colores, tallas y pide directo por WhatsApp sin registros ni complicaciones.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setVista('ropa-shorts-poliester')}
                    className="px-5 py-3 bg-white text-neutral-950 rounded-xl text-xs sm:text-sm font-extrabold hover:bg-neutral-100 transition-all cursor-pointer flex items-center gap-2 shadow-md"
                  >
                    <span>Configurar Short Poliéster</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setVista('ropa-shorts-win')}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Ver Equipos Win</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Elemento gráfico decorativo */}
              <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-15 pointer-events-none">
                <span className="text-[200px] font-black leading-none select-none">POLE</span>
              </div>
            </section>

            {/* SECCIÓN 1: EXPLORAR POR CATEGORÍAS (Requisito 1) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-950">
                    Explora por Categorías
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Navega de forma ordenada según lo que estés buscando
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Categoría Ropa -> Shorts Poliéster */}
                <div
                  onClick={() => setVista('ropa-shorts-poliester')}
                  className="group bg-white border border-neutral-200 hover:border-neutral-950 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                      <Shirt className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Ropa · Shorts
                    </span>
                    <h3 className="text-lg font-black text-neutral-950">
                      Shorts Clásicos Poliéster
                    </h3>
                    <p className="text-xs text-neutral-600">
                      36 combinaciones de colores con cordón ajustable. Tallas XS a XXL.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <strong className="text-neutral-950 font-black">Desde S/ 15 c/u</strong>
                    <span className="text-neutral-900 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Configurar <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Categoría Ropa -> Shorts Win Equipos */}
                <div
                  onClick={() => setVista('ropa-shorts-win')}
                  className="group bg-white border border-neutral-200 hover:border-blue-600 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                      Ropa · Shorts
                    </span>
                    <h3 className="text-lg font-black text-neutral-950">
                      Shorts de Equipos (Win)
                    </h3>
                    <p className="text-xs text-neutral-600">
                      11 modelos de selecciones y clubes internacionales. Tela Win transpirable.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <strong className="text-blue-700 font-black">S/ 28 c/u · 3 por S/ 75</strong>
                    <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Ver Equipos <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Categoría Tecnología (Futura / Próximamente) */}
                <div
                  onClick={() => setVista('tecnologia')}
                  className="group bg-neutral-50 border border-neutral-200 hover:border-amber-500 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                        Tecnología & Gadgets
                      </span>
                      <span className="bg-amber-200 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                        Próximamente
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-neutral-950">
                      Parlantes, TV Box y Accesorios
                    </h3>
                    <p className="text-xs text-neutral-600">
                      Sonido portátil, Smart TV Box 4K y accesorios de carga rápida para complementar tu pedido.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-200 flex items-center justify-between text-xs">
                    <span className="text-amber-700 font-bold">Novedades</span>
                    <span className="text-neutral-900 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Ver Catálogo <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN 2: PRODUCTOS DESTACADOS (Requisito 1) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-950">
                    Productos Destacados
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Los modelos más solicitados por nuestros clientes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setVista('ropa-shorts-poliester')}
                  className="text-xs font-bold text-neutral-950 hover:underline flex items-center gap-1"
                >
                  Ver todos los shorts <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {PRODUCTOS.filter((p) => p.destacado).slice(0, 8).map((prod) => (
                  <article
                    key={prod.id}
                    className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div
                      className="aspect-[3/2] bg-neutral-50 p-2 flex items-center justify-center cursor-pointer relative"
                      onClick={() => setModalFoto(prod)}
                    >
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                      />
                      <span className="absolute top-2 left-2 bg-neutral-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {prod.tipoTela === 'poliester' ? 'Poliéster' : prod.tipoTela === 'win' ? 'Tela Win' : 'Tecnología'}
                      </span>
                      {prod.tallasDisponibles.length === 1 && (
                        <span className="absolute bottom-2 left-2 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> Solo {prod.tallasDisponibles[0]}
                        </span>
                      )}
                    </div>

                    <div className="p-3 flex flex-col gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-neutral-950 truncate" title={prod.nombre}>
                          {prod.nombre}
                        </h4>
                        <span className="text-[10px] text-neutral-500 block">
                          {prod.colorShort} · Rayas {prod.colorRayas}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-neutral-100 text-xs">
                        <strong className="font-extrabold text-neutral-950">
                          S/ {prod.precio.toFixed(2)}
                        </strong>

                        {prod.disponible ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (prod.tipoTela === 'poliester') {
                                setColorShortConfig(prod.colorShort);
                                setColorRayasConfig(prod.colorRayas);
                                setVista('ropa-shorts-poliester');
                              } else {
                                setIdWinSeleccionado(prod.id);
                                setVista('ropa-shorts-win');
                              }
                            }}
                            className="px-2 py-1 bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Ver y Elegir
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            Próximamente
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ========================================================
            VISTA 2: ROPA → SHORTS POLIÉSTER (S/15) (Requisito 3)
            ======================================================== */}
        {vista === 'ropa-shorts-poliester' && (
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-10 animate-fade-in">
            {/* SUBNAV ENTRE POLIÉSTER Y TELA WIN */}
            <div className="flex items-center justify-center">
              <div className="bg-neutral-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold border border-neutral-200">
                <button
                  type="button"
                  className="px-4 py-2 bg-neutral-950 text-white rounded-lg shadow-xs cursor-default flex items-center gap-1.5"
                >
                  <Shirt className="w-3.5 h-3.5" />
                  <span>Shorts Clásicos (Poliéster) · S/ 15</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVista('ropa-shorts-win')}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-950 rounded-lg hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Shorts de Equipos (Win) · S/ 28</span>
                </button>
              </div>
            </div>

            {/* RECORDATORIO DE PROMOCIONES POLIÉSTER */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">1 a 5 unidades</span>
                <strong className="text-neutral-950 text-sm font-black">S/ 15.00 c/u</strong>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                <span className="text-emerald-700 block text-[11px]">Promo desde 6 unidades</span>
                <strong className="text-emerald-900 text-sm font-black">S/ 13.50 c/u (6 = S/ 81)</strong>
              </div>
              <div className="p-3 bg-neutral-900 text-white rounded-xl shadow-xs">
                <span className="text-neutral-400 block text-[11px]">Precio Docena (12+)</span>
                <strong className="text-white text-sm font-black">S/ 12.00 c/u (12 = S/ 144)</strong>
              </div>
            </div>

            {/* CONFIGURADOR INTERACTIVO DE SHORT POLIÉSTER (Requisito 3) */}
            <section className="bg-white border-2 border-neutral-950 rounded-3xl p-5 sm:p-8 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* COLUMNA IZQUIERDA: FOTO PRINCIPAL GRANDE CON ZOOM */}
                <div className="lg:col-span-6 flex flex-col items-center">
                  <div
                    className="w-full aspect-[4/3] bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex items-center justify-center cursor-pointer relative group overflow-hidden"
                    onClick={() => setModalFoto(productoConfigurado)}
                    title="Toca para ampliar foto"
                  >
                    <img
                      src={productoConfigurado.imagen}
                      alt={productoConfigurado.nombre}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        Tela Polistrech
                      </span>
                      {productoConfigurado.tallasDisponibles.length === 1 && (
                        <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Solo Talla {productoConfigurado.tallasDisponibles[0]}
                        </span>
                      )}
                    </div>

                    <span className="absolute top-3 right-3 bg-neutral-950 text-white text-sm font-black px-3 py-1 rounded-lg shadow-xs">
                      S/ 15
                    </span>

                    <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-neutral-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      🔍 Toca para ampliar
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400 mt-2 text-center">
                    Fotografía 100% real de la combinación seleccionada.
                  </p>
                </div>

                {/* COLUMNA DERECHA: SELECTOR DE COLOR DEL SHORT, COLOR DE RAYAS, TALLAS Y BOTÓN AGREGAR */}
                <div className="lg:col-span-6 space-y-6">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase text-neutral-400 tracking-wider">
                      Configura tu short personalizado
                    </span>
                    <h2 className="text-2xl font-black text-neutral-950 leading-tight">
                      {productoConfigurado.nombre}
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Short deportivo con elástico resistente y cordón ajustable. Tela Polistrech fresca y duradera.
                    </p>
                  </div>

                  {/* 1. CUADRADITOS PARA SELECCIONAR COLOR DEL SHORT */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-neutral-700">1. Color del Short:</span>
                      <strong className="text-neutral-950">{colorShortConfig}</strong>
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
                                ? 'border-neutral-950 ring-2 ring-neutral-950 shadow-sm bg-neutral-950 text-white'
                                : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-md shrink-0 border border-neutral-300"
                              style={{ backgroundColor: styleInfo.bg }}
                            />
                            <span>{color}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. CUADRADITOS PARA SELECCIONAR COLOR DE RAYAS */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-neutral-700">2. Color de las Rayas:</span>
                      <strong className="text-neutral-950">{colorRayasConfig}</strong>
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
                                ? 'border-neutral-950 ring-2 ring-neutral-950 shadow-sm bg-neutral-950 text-white'
                                : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-md shrink-0 border border-neutral-300"
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
                        <span className="font-bold text-neutral-700">3. Selecciona Talla:</span>
                        <button
                          type="button"
                          onClick={() => setModalGuiaTallas(true)}
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                        >
                          <Ruler className="w-3 h-3" /> Guía de medidas
                        </button>
                      </div>
                      <strong className="text-neutral-950">{tallaConfig}</strong>
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
                              className="py-2 rounded-xl text-xs font-bold border border-dashed border-neutral-300 bg-neutral-100 text-neutral-400 cursor-not-allowed pointer-events-none flex flex-col items-center justify-center opacity-60"
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
                                ? 'bg-neutral-950 text-white border-neutral-950 ring-2 ring-neutral-950 shadow-sm'
                                : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
                            }`}
                          >
                            {talla}
                          </button>
                        );
                      })}
                    </div>
                    {productoConfigurado.tallasDisponibles.length === 1 && (
                      <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 pt-1">
                        <Lock className="w-3 h-3 shrink-0" />
                        Este modelo solo está disponible en talla {productoConfigurado.tallasDisponibles[0]}. Las demás tallas tienen candado.
                      </p>
                    )}
                  </div>

                  {/* 4. SELECTOR DE CANTIDAD Y BOTÓN AGREGAR AL CARRITO */}
                  <div className="pt-3 border-t border-neutral-200 flex items-center gap-3">
                    <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => setCantidadConfig((prev) => Math.max(1, prev - 1))}
                        className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 rounded-lg font-bold cursor-pointer"
                        title="Menos"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-neutral-950 tabular-nums">
                        {cantidadConfig}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCantidadConfig((prev) => prev + 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 rounded-lg font-bold cursor-pointer"
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
                      className="flex-1 py-3 px-5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      <span>AGREGAR AL CARRITO</span>
                      <span className="text-neutral-400 text-xs">({tallaConfig})</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* CATÁLOGO COMPLETO DE LOS 36 MODELOS DE POLIÉSTER */}
            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-neutral-950">
                    Todos los 36 Modelos de Shorts Clásicos
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Haz clic en cualquier modelo para cargarlo en el configurador o ver la foto
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {SHORTS_POLIESTER.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setColorShortConfig(prod.colorShort);
                      setColorRayasConfig(prod.colorRayas);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className={`bg-white border rounded-xl p-2 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${
                      productoConfigurado.id === prod.id
                        ? 'border-neutral-950 ring-2 ring-neutral-950'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="aspect-[3/2] bg-neutral-50 rounded-lg flex items-center justify-center p-1 relative overflow-hidden">
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                      {prod.tallasDisponibles.length === 1 && (
                        <span className="absolute top-1 left-1 bg-amber-600 text-white text-[8px] font-bold px-1 rounded">
                          🔒 {prod.tallasDisponibles[0]}
                        </span>
                      )}
                    </div>

                    <div className="pt-2 text-left">
                      <h4 className="font-bold text-[11px] text-neutral-950 truncate">
                        {prod.colorShort}
                      </h4>
                      <p className="text-[10px] text-neutral-500 truncate">
                        Rayas {prod.colorRayas}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ========================================================
            VISTA 3: ROPA → SHORTS TELA WIN (EQUIPOS) (Requisito 4)
            ======================================================== */}
        {vista === 'ropa-shorts-win' && (
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-10 animate-fade-in">
            {/* SUBNAV ENTRE POLIÉSTER Y TELA WIN */}
            <div className="flex items-center justify-center">
              <div className="bg-neutral-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setVista('ropa-shorts-poliester')}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-950 rounded-lg hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Shirt className="w-3.5 h-3.5" />
                  <span>Shorts Clásicos (Poliéster) · S/ 15</span>
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-xs cursor-default flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Shorts de Equipos (Win) · S/ 28</span>
                </button>
              </div>
            </div>

            {/* RECORDATORIO DE PROMOCIÓN WIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">1 o 2 unidades</span>
                <strong className="text-neutral-950 text-sm font-black">S/ 28.00 c/u</strong>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-950">
                <span className="text-blue-700 block text-[11px]">Promoción desde 3 shorts Win</span>
                <strong className="text-blue-900 text-sm font-black">S/ 25.00 c/u (3 = S/ 75)</strong>
              </div>
            </div>

            {/* SELECTOR INTERACTIVO DE SHORT WIN */}
            <section className="bg-white border-2 border-blue-600 rounded-3xl p-5 sm:p-8 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 flex flex-col items-center">
                  <div
                    className="w-full aspect-[4/3] bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex items-center justify-center cursor-pointer relative group overflow-hidden"
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
                      <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        Disponible en Talla L
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col items-end">
                      <span className="bg-neutral-950 text-white text-sm font-black px-3 py-1 rounded-lg shadow-xs">
                        S/ 28
                      </span>
                      <span className="mt-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        3 por S/ 75
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-2 text-center">
                    Fotografía oficial de {productoWinSeleccionado.nombre}.
                  </p>
                </div>

                <div className="lg:col-span-6 space-y-6">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase text-blue-600 tracking-wider">
                      Colección Fútbol 2026
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 leading-tight">
                      {productoWinSeleccionado.nombre}
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Short oficial con escudo y tela Win de alta ventilación. Talla estándar L con cordón y pretina elástica.
                    </p>
                  </div>

                  {/* Selector rápido de modelos de equipos */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-neutral-700 block">
                      Selecciona el equipo o modelo:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1 border border-neutral-100 rounded-xl">
                      {SHORTS_WIN.map((team) => (
                        <button
                          key={team.id}
                          type="button"
                          onClick={() => setIdWinSeleccionado(team.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            idWinSeleccionado === team.id
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                          }`}
                        >
                          {team.modelo}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Talla y cantidad */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs p-3 bg-blue-50 border border-blue-200 rounded-xl">
                      <div>
                        <span className="text-blue-900 font-bold block">Talla Única Disponible:</span>
                        <span className="text-blue-700 text-[11px]">Talla L (Equivalente Talla 42 con cordón ajustable)</span>
                      </div>
                      <span className="px-3 py-1 bg-blue-600 text-white font-black text-xs rounded-lg">
                        Talla L
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 p-0.5">
                        <button
                          type="button"
                          onClick={() => setCantidadWin((prev) => Math.max(1, prev - 1))}
                          className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 rounded-lg font-bold cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-neutral-950 tabular-nums">
                          {cantidadWin}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCantidadWin((prev) => prev + 1)}
                          className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 rounded-lg font-bold cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleAgregarAlCarrito(productoWinSeleccionado, 'L', cantidadWin)
                        }
                        className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98"
                      >
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>AGREGAR AL CARRITO (Talla L)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CUADRÍCULA DE LOS 11 MODELOS DE EQUIPOS */}
            <section className="space-y-4 pt-4">
              <h3 className="text-lg font-black text-neutral-950">
                Catálogo de Equipos ({SHORTS_WIN.length} modelos)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {SHORTS_WIN.map((team) => (
                  <div
                    key={team.id}
                    className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div
                      className="aspect-[3/2] bg-neutral-50 p-2 flex items-center justify-center cursor-pointer relative"
                      onClick={() => setModalFoto(team)}
                    >
                      <img
                        src={team.imagen}
                        alt={team.nombre}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                      />
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Tela Win
                      </span>
                      <span className="absolute top-2 right-2 bg-neutral-900 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                        S/ 28
                      </span>
                    </div>

                    <div className="p-3 flex flex-col gap-2">
                      <h4 className="font-bold text-xs text-neutral-950 truncate">
                        {team.nombre}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-100">
                        <span className="text-neutral-500">Talla L</span>
                        <button
                          type="button"
                          onClick={() => handleAgregarAlCarrito(team, 'L', 1)}
                          className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          + Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ========================================================
            VISTA 4: TECNOLOGÍA (PARLANTES, TV BOX, ACCESORIOS) (Requisitos 1 y 8)
            ======================================================== */}
        {vista === 'tecnologia' && (
          <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white rounded-3xl p-6 sm:p-10 shadow-lg">
              <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
                Novedades Tecnológicas POLESTORE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black">
                Tecnología, Parlantes y TV Box
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 max-w-xl mt-1">
                Estamos preparando los mejores gadgets y accesorios para ti. Consulta disponibilidad o reserva tu pedido vía WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCTOS_TECNOLOGIA.map((tec) => (
                <article
                  key={tec.id}
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
                    <img
                      src={tec.imagen}
                      alt={tec.nombre}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-xs uppercase">
                      Próximamente
                    </span>
                  </div>

                  <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        {tec.subcategoria}
                      </span>
                      <h4 className="font-bold text-sm text-neutral-950 leading-snug mt-0.5">
                        {tec.nombre}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1">
                        Modelo: {tec.modelo}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400 block">Precio estimado</span>
                        <strong className="text-sm font-black text-neutral-950">
                          S/ {tec.precio.toFixed(2)}
                        </strong>
                      </div>

                      <a
                        href={`https://wa.me/${POLESTORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Hola POLESTORE 👋, deseo consultar la fecha de llegada del producto: ${tec.nombre} (Modelo: ${tec.modelo})`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Consultar</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* RECOMENDACIONES DE TECNOLOGÍA AL PIE DE LA SECCIÓN DE ROPA (Requisito 8) */}
        {(vista === 'ropa-shorts-poliester' || vista === 'ropa-shorts-win') && (
          <section className="max-w-6xl mx-auto px-4 py-8 border-t border-neutral-200 mt-12 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-600 tracking-wider">
                  Productos Relacionados
                </span>
                <h3 className="text-lg font-black text-neutral-950">
                  Complementa tu pedido con Tecnología
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setVista('tecnologia')}
                className="text-xs font-bold text-neutral-950 hover:underline flex items-center gap-1"
              >
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRODUCTOS_TECNOLOGIA.slice(0, 4).map((tec) => (
                <div
                  key={tec.id}
                  onClick={() => setVista('tecnologia')}
                  className="p-3 bg-neutral-50 hover:bg-white border border-neutral-200 hover:border-amber-500 rounded-xl cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[3/2] rounded-lg overflow-hidden bg-neutral-200 mb-2">
                    <img src={tec.imagen} alt={tec.nombre} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-neutral-950 truncate">{tec.nombre}</h5>
                    <span className="text-[10px] text-amber-700 font-semibold block">Próximo ingreso</span>
                  </div>
                  <strong className="text-xs font-black text-neutral-950 mt-1">S/ {tec.precio.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ========================================================
          DRAWER LATERAL DEL CARRITO DE COMPRAS (Requisitos 6 y 7)
          ======================================================== */}
      {modalCarritoAbierto && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
          {/* Fondo oscuro */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setModalCarritoAbierto(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-neutral-200">
              {/* Cabecera del Carrito */}
              <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-neutral-950" />
                  <div>
                    <h2 className="text-base font-black text-neutral-950">Tu Pedido POLESTORE</h2>
                    <p className="text-xs text-neutral-500">
                      {totalPrendas === 0
                        ? 'Carrito vacío'
                        : `${totalPrendas} ${totalPrendas === 1 ? 'prenda seleccionada' : 'prendas seleccionadas'}`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalCarritoAbierto(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-950 rounded-lg transition-colors cursor-pointer"
                  aria-label="Cerrar pedido"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lista de Productos en el Carrito */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {carrito.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-neutral-700">Tu carrito está vacío</p>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                      Explora nuestros shorts de Poliéster y shorts Win para armar tu pedido.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setModalCarritoAbierto(false);
                        setVista('ropa-shorts-poliester');
                      }}
                      className="px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-bold"
                    >
                      Ver Shorts Clásicos
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                        Artículos agregados
                      </span>
                      <button
                        type="button"
                        onClick={handleVaciarCarrito}
                        className="text-[11px] text-red-600 hover:underline cursor-pointer"
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
                          className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center gap-3"
                        >
                          <img
                            src={p.imagen}
                            alt={p.nombre}
                            className="w-14 h-14 object-contain bg-white rounded-xl border border-neutral-200 shrink-0 p-1"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-xs text-neutral-950 truncate">
                              {p.nombre}
                            </h4>
                            <p className="text-[11px] text-neutral-600">
                              Color: {p.colorShort} · Rayas: {p.colorRayas}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded">
                                Talla {item.talla}
                              </span>
                              <span className="text-xs font-black text-neutral-950">
                                S/ {subtotalItem.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1.5">
                            <div className="flex items-center border border-neutral-300 rounded-lg bg-white">
                              <button
                                type="button"
                                onClick={() => handleModificarCantidad(item.id, -1)}
                                className="px-2 py-0.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold text-neutral-950 tabular-nums">
                                {item.cantidad}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleModificarCantidad(item.id, 1)}
                                className="px-2 py-0.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleEliminarItem(item.id)}
                              className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* MODALIDAD DE ENTREGA EN CARRITO */}
                    <div className="pt-3 border-t border-neutral-200 space-y-2">
                      <span className="text-xs font-bold text-neutral-700 block">
                        Modalidad de Entrega:
                      </span>

                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        <button
                          type="button"
                          onClick={() => setTipoEntrega('punto')}
                          className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-colors ${
                            tipoEntrega === 'punto'
                              ? 'bg-neutral-950 text-white border-neutral-950'
                              : 'bg-white text-neutral-700 border-neutral-200'
                          }`}
                        >
                          Punto Fijo
                        </button>

                        <button
                          type="button"
                          onClick={() => setTipoEntrega('delivery')}
                          className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-colors ${
                            tipoEntrega === 'delivery'
                              ? 'bg-neutral-950 text-white border-neutral-950'
                              : 'bg-white text-neutral-700 border-neutral-200'
                          }`}
                        >
                          Delivery {deliveryGratisDesbloqueado ? 'Gratis' : ''}
                        </button>

                        <button
                          type="button"
                          onClick={() => setTipoEntrega('shalom')}
                          className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-colors ${
                            tipoEntrega === 'shalom'
                              ? 'bg-neutral-950 text-white border-neutral-950'
                              : 'bg-white text-neutral-700 border-neutral-200'
                          }`}
                        >
                          Shalom
                        </button>
                      </div>

                      {tipoEntrega === 'delivery' && (
                        <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2 text-xs">
                          {deliveryGratisDesbloqueado ? (
                            <span className="text-emerald-700 font-extrabold flex items-center gap-1 text-[11px]">
                              <Check className="w-3.5 h-3.5" /> ¡Calificas para Delivery Gratis!
                            </span>
                          ) : (
                            <span className="text-amber-800 text-[11px] block">
                              Agrega {3 - totalPrendas} short(s) más para desbloquear Delivery Gratis.
                            </span>
                          )}

                          <select
                            value={zonaDelivery}
                            onChange={(e) => setZonaDelivery(e.target.value)}
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs font-semibold"
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
                        <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs">
                          <select
                            value={puntoEntrega}
                            onChange={(e) => setPuntoEntrega(e.target.value)}
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs font-semibold"
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
                        <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs">
                          <input
                            type="text"
                            placeholder="Ciudad / Agencia de destino Shalom"
                            value={destinoShalom}
                            onChange={(e) => setDestinoShalom(e.target.value)}
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Pie del Carrito: Totales y Botón COMPRAR POR WHATSAPP (Requisito 7) */}
              {carrito.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
                  <div className="space-y-1 text-xs">
                    {ahorroTotal > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Ahorro aplicado:</span>
                        <span>- S/ {ahorroTotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm font-black text-neutral-950 pt-1">
                      <span>Total General:</span>
                      <span className="text-xl">S/ {totalGeneral.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleComprarPorWhatsApp}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-sm font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                    <span>COMPRAR POR WHATSAPP</span>
                  </button>

                  <p className="text-[10px] text-neutral-400 text-center">
                    Se abrirá WhatsApp ({POLESTORE_PHONE_DISPLAY}) con el detalle completo de tus productos y fotos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL DE FOTO EN ALTA RESOLUCIÓN
          ======================================================== */}
      {modalFoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in"
          onClick={() => setModalFoto(null)}
        >
          <div
            className="relative bg-white max-w-xl w-full rounded-3xl p-5 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <div>
                <h3 className="font-extrabold text-sm text-neutral-950">{modalFoto.nombre}</h3>
                <span className="text-xs text-neutral-500">
                  {modalFoto.colorShort} · Rayas {modalFoto.colorRayas} · S/ {modalFoto.precio.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalFoto(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-950 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-[4/3] bg-neutral-50 rounded-2xl flex items-center justify-center p-2 my-4">
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
                className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-950"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (modalFoto.tipoTela === 'poliester') {
                    setColorShortConfig(modalFoto.colorShort);
                    setColorRayasConfig(modalFoto.colorRayas);
                    setVista('ropa-shorts-poliester');
                  } else {
                    setIdWinSeleccionado(modalFoto.id);
                    setVista('ropa-shorts-win');
                  }
                  setModalFoto(null);
                }}
                className="px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800"
              >
                Configurar este modelo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL DE GUÍA DE MEDIDAS Y TALLAS
          ======================================================== */}
      {modalGuiaTallas && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in"
          onClick={() => setModalGuiaTallas(false)}
        >
          <div
            className="bg-white max-w-sm w-full rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h3 className="font-extrabold text-base text-neutral-950 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-neutral-700" />
                <span>Guía de Tallas POLESTORE</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalGuiaTallas(false)}
                className="p-1 text-neutral-400 hover:text-neutral-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabla Poliéster */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[11px] font-extrabold uppercase text-neutral-500 tracking-wider block">
                Shorts Clásicos (Tela Polistrech)
              </span>
              <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
                {Object.entries(GUIA_TALLAS).map(([t, info]) => (
                  <div key={t} className="flex justify-between p-2">
                    <span className="font-bold text-neutral-950">{t}</span>
                    <span className="text-neutral-600">{info.tallaNumero} (Cintura {info.cintura} cm)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nota Win */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950">
              <strong className="block font-bold">⚽ Shorts de Equipos (Tela Win):</strong>
              <p className="mt-0.5 text-blue-800">
                Talla estándar L con elástico adaptable y cordón de ajuste.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalGuiaTallas(false)}
              className="w-full py-2.5 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* BARRA INFERIOR FIJA EN MÓVILES CUANDO HAY PRODUCTOS (Requisito 8) */}
      {totalPrendas > 0 && !modalCarritoAbierto && (
        <aside aria-label="Resumen de pedido móvil" className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-neutral-500 font-bold block">
                {totalPrendas} {totalPrendas === 1 ? 'prenda' : 'prendas'} seleccionadas
              </span>
              <strong className="text-base font-black text-neutral-950">
                S/ {totalGeneral.toFixed(2)}
              </strong>
            </div>

            <button
              type="button"
              onClick={() => setModalCarritoAbierto(true)}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Pedido</span>
            </button>
          </div>
        </aside>
      )}

      {/* PIE DE PÁGINA */}
      <footer className="mt-auto border-t border-neutral-200 bg-neutral-50 py-8 px-4 text-center text-xs text-neutral-500 space-y-2">
        <p className="font-black text-neutral-950 tracking-widest text-sm uppercase">
          POLESTORE
        </p>
        <p className="italic">Tu tienda virtual de confianza.</p>
        <p className="text-[11px] text-neutral-400">
          Chiclayo · José Leonardo Ortiz · Lambayeque · La Victoria · Envíos por Shalom a todo el Perú
        </p>
        <p className="text-[10px] text-neutral-400">
          WhatsApp oficial: {POLESTORE_PHONE_DISPLAY}
        </p>
      </footer>
    </div>
  );
}
