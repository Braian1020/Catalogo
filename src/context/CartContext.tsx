import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ItemCarrito, Producto, Talla } from '../types';
import { generarMensajeWhatsApp, getWhatsAppUrl } from '../utils/whatsapp';

export const STORAGE_KEY_CARRITO = 'poolstore_carrito_v3';

export type ModalidadEntrega = 'domicilio' | 'punto_centrico' | 'shalom';
export type MetodoPago = 'contraentrega' | 'yape';

export interface PuntoCentrico {
  id: string;
  nombre: string;
  detalle: string;
  icono: string;
}

export const PUNTOS_CENTRICOS_CHICLAYO: PuntoCentrico[] = [
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
    detalle: 'Sede Principal Chiclayo',
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

interface CartContextType {
  carrito: ItemCarrito[];
  agregarAlCarrito: (producto: Producto, talla: Talla, cantidad?: number) => void;
  actualizarCantidad: (id: string, delta: number) => void;
  eliminarDelCarrito: (id: string) => void;
  vaciarCarrito: () => void;
  totalPrendas: number;
  prendasPoliester: number;
  prendasWin: number;
  precioUnitarioPoliester: number;
  precioUnitarioWin: number;
  subtotalPrendas: number;
  subtotalRegular: number;
  ahorroTotal: number;
  costoEnvioAplicado: number;
  totalGeneral: number;
  deliveryGratisDesbloqueado: boolean;

  // Modals & Navigation
  modalCarritoAbierto: boolean;
  setModalCarritoAbierto: (open: boolean) => void;
  modalFoto: Producto | null;
  setModalFoto: (p: Producto | null) => void;
  modalGuiaTallas: boolean;
  setModalGuiaTallas: (open: boolean) => void;
  modalTelasAbierto: boolean;
  setModalTelasAbierto: (open: boolean) => void;
  toast: string | null;
  mostrarToast: (msg: string) => void;

  // Checkout info
  modalidadEntrega: ModalidadEntrega;
  setModalidadEntrega: (m: ModalidadEntrega) => void;
  metodoPago: MetodoPago;
  setMetodoPago: (m: MetodoPago) => void;
  puntoCentrico: string;
  setPuntoCentrico: (p: string) => void;
  direccionEntrega: string;
  setDireccionEntrega: (d: string) => void;
  referenciaEntrega: string;
  setReferenciaEntrega: (r: string) => void;
  compartirUbicacionPorWhatsApp: boolean;
  setCompartirUbicacionPorWhatsApp: (c: boolean) => void;
  agenciaShalom: string;
  setAgenciaShalom: (a: string) => void;
  nombreCliente: string;
  setNombreCliente: (n: string) => void;
  telefonoCliente: string;
  setTelefonoCliente: (t: string) => void;
  dniCliente: string;
  setDniCliente: (d: string) => void;
  notasCliente: string;
  setNotasCliente: (n: string) => void;
  detallesEntrega: string;
  handleEnviarPedidoWhatsApp: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // 1. Carrito con persistencia en localStorage
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

  // 2. Modals y Toast
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState<boolean>(false);
  const [modalFoto, setModalFoto] = useState<Producto | null>(null);
  const [modalGuiaTallas, setModalGuiaTallas] = useState<boolean>(false);
  const [modalTelasAbierto, setModalTelasAbierto] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const mostrarToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // 3. Formulario de Entrega y Pago
  const [modalidadEntrega, setModalidadEntrega] = useState<ModalidadEntrega>('domicilio');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('contraentrega');
  const [puntoCentrico, setPuntoCentrico] = useState<string>(PUNTOS_CENTRICOS_CHICLAYO[0].nombre);
  const [direccionEntrega, setDireccionEntrega] = useState<string>('');
  const [referenciaEntrega, setReferenciaEntrega] = useState<string>('');
  const [compartirUbicacionPorWhatsApp, setCompartirUbicacionPorWhatsApp] = useState<boolean>(false);
  const [agenciaShalom, setAgenciaShalom] = useState<string>('Agencia Central Chiclayo');
  const [nombreCliente, setNombreCliente] = useState<string>('');
  const [telefonoCliente, setTelefonoCliente] = useState<string>('');
  const [dniCliente, setDniCliente] = useState<string>('');
  const [notasCliente, setNotasCliente] = useState<string>('');

  // 4. Operaciones del Carrito
  const agregarAlCarrito = useCallback(
    (producto: Producto, talla: Talla, cantidad: number = 1) => {
      if (cantidad <= 0) return;
      const itemId = `${producto.id}-${talla}`;
      setCarrito((prev) => {
        const existe = prev.find((item) => item.id === itemId);
        if (existe) {
          return prev.map((item) =>
            item.id === itemId ? { ...item, cantidad: item.cantidad + cantidad } : item
          );
        }
        return [...prev, { id: itemId, producto, talla, cantidad }];
      });
      mostrarToast(`✓ ${cantidad} ${producto.nombre} (Talla ${talla}) agregado`);
    },
    [mostrarToast]
  );

  const actualizarCantidad = useCallback((id: string, delta: number) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nuevaCantidad = item.cantidad + delta;
            return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
          }
          return item;
        })
        .filter((item): item is ItemCarrito => item !== null)
    );
  }, []);

  const eliminarDelCarrito = useCallback((id: string) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const vaciarCarrito = useCallback(() => {
    setCarrito([]);
  }, []);

  // 5. Cálculos de Totales y Descuentos
  const totalPrendas = useMemo(() => {
    return carrito.reduce((acc, item) => acc + item.cantidad, 0);
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

  const deliveryGratisDesbloqueado = totalPrendas >= 3;

  // No calculamos tarifas ficticias: si no es gratis por promo, queda "Por confirmar vía WhatsApp"
  const costoEnvioAplicado = 0;

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
      totalGeneral: subtotal, // Sin sumar montos ficticios
      subtotalRegular: regular,
      ahorroTotal: Math.max(0, regular - subtotal),
    };
  }, [carrito, precioUnitarioPoliester, precioUnitarioWin]);

  const detallesEntrega = useMemo(() => {
    const textoPago =
      metodoPago === 'yape'
        ? '📱 Pago por Yape al 903566655 (Pool Store)'
        : '💵 Pago Contraentrega al recibir (Efectivo o Yape)';

    if (modalidadEntrega === 'domicilio') {
      const costoTxt = deliveryGratisDesbloqueado
        ? '¡GRATIS por promoción desde 3 prendas!'
        : 'Por confirmar por WhatsApp según dirección';

      const dirTxt =
        compartirUbicacionPorWhatsApp || !direccionEntrega.trim()
          ? '• Dirección: Compartiré mi ubicación o dirección por WhatsApp'
          : `• Dirección: ${direccionEntrega.trim()}`;

      return [
        `📍 *Modalidad:* A Domicilio en Chiclayo (Contraentrega)`,
        dirTxt,
        referenciaEntrega.trim() && !compartirUbicacionPorWhatsApp
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
      `📍 *Modalidad:* Envío Nacional por Shalom`,
      agenciaShalom.trim() ? `• Agencia / Destino: ${agenciaShalom.trim()}` : null,
      dniCliente.trim() ? `• DNI para retiro: ${dniCliente.trim()}` : null,
      `• Flete: Pago en destino al recoger en agencia`,
      `• Forma de pago de las prendas: ${textoPago}`,
    ]
      .filter(Boolean)
      .join('\n');
  }, [
    modalidadEntrega,
    metodoPago,
    puntoCentrico,
    direccionEntrega,
    referenciaEntrega,
    compartirUbicacionPorWhatsApp,
    agenciaShalom,
    dniCliente,
    deliveryGratisDesbloqueado,
  ]);

  const handleEnviarPedidoWhatsApp = useCallback(() => {
    if (carrito.length === 0) {
      mostrarToast('Tu carrito está vacío. Agrega al menos un short.');
      return;
    }

    const textoMensaje = generarMensajeWhatsApp({
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
      compartirUbicacionPorWhatsApp,
      deliveryGratisDesbloqueado,
      puntoCentrico,
      destinoShalom: agenciaShalom,
      metodoPago,
    });
    const urlWa = getWhatsAppUrl(textoMensaje);
    window.location.href = urlWa;
  }, [
    carrito,
    precioUnitarioWin,
    precioUnitarioPoliester,
    modalidadEntrega,
    direccionEntrega,
    referenciaEntrega,
    compartirUbicacionPorWhatsApp,
    deliveryGratisDesbloqueado,
    puntoCentrico,
    agenciaShalom,
    metodoPago,
    subtotalPrendas,
    costoEnvioAplicado,
    totalGeneral,
    ahorroTotal,
    mostrarToast,
  ]);

  const value = {
    carrito,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    totalPrendas,
    prendasPoliester,
    prendasWin,
    precioUnitarioPoliester,
    precioUnitarioWin,
    subtotalPrendas,
    subtotalRegular,
    ahorroTotal,
    costoEnvioAplicado,
    totalGeneral,
    deliveryGratisDesbloqueado,
    modalCarritoAbierto,
    setModalCarritoAbierto,
    modalFoto,
    setModalFoto,
    modalGuiaTallas,
    setModalGuiaTallas,
    modalTelasAbierto,
    setModalTelasAbierto,
    toast,
    mostrarToast,
    modalidadEntrega,
    setModalidadEntrega,
    metodoPago,
    setMetodoPago,
    puntoCentrico,
    setPuntoCentrico,
    direccionEntrega,
    setDireccionEntrega,
    referenciaEntrega,
    setReferenciaEntrega,
    compartirUbicacionPorWhatsApp,
    setCompartirUbicacionPorWhatsApp,
    agenciaShalom,
    setAgenciaShalom,
    nombreCliente,
    setNombreCliente,
    telefonoCliente,
    setTelefonoCliente,
    dniCliente,
    setDniCliente,
    notasCliente,
    setNotasCliente,
    detallesEntrega,
    handleEnviarPedidoWhatsApp,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}
