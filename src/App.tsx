/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import { SHORTS } from './data/shorts';
import { SHORTS_WIN } from './data/shorts-win';
import { ShortProduct, Size, CollectionType } from './types';

// Teléfono oficial de WhatsApp de PoolStore
const WHATSAPP_NUM = '51903566655';
const TALLAS_CLASICOS: Size[] = ['XS', 'S', 'M', 'L', 'XL'];

// Zonas para delivery gratis desde 3 unidades
const ZONAS_DELIVERY_GRATIS = [
  'Chiclayo',
  'José Leonardo Ortiz (JLO)',
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

// Cálculo de precios para Shorts Clásicos (Polistrech)
// 1 a 5 unidades: S/ 15 c/u
// 6 a 11 unidades: S/ 13.50 c/u (6 = S/ 81)
// Desde 12 unidades: S/ 12.00 c/u (12 = S/ 144)
function calcularTotalesClasicos(cantidad: number) {
  if (cantidad <= 0) return { total: 0, precioUnitario: 15, ahorro: 0, promoTag: '', precioAplicadoTexto: 'S/ 15 c/u' };

  if (cantidad >= 12) {
    const total = cantidad * 12;
    const regular = cantidad * 15;
    return {
      total,
      precioUnitario: 12,
      ahorro: regular - total,
      promoTag: 'Precio Docena (S/ 12 c/u)',
      precioAplicadoTexto: 'S/ 12 c/u',
    };
  } else if (cantidad >= 6) {
    const total = cantidad * 13.5;
    const regular = cantidad * 15;
    return {
      total,
      precioUnitario: 13.5,
      ahorro: regular - total,
      promoTag: 'Promo 6+ shorts (S/ 13.50 c/u)',
      precioAplicadoTexto: 'S/ 13.50 c/u',
    };
  } else {
    return {
      total: cantidad * 15,
      precioUnitario: 15,
      ahorro: 0,
      promoTag: 'S/ 15 c/u',
      precioAplicadoTexto: 'S/ 15 c/u',
    };
  }
}

// Cálculo de precios para Shorts de Equipos (Win)
// 1 o 2 unidades: S/ 28 c/u
// Desde 3 unidades: S/ 25 c/u (3 = S/ 75)
function calcularTotalesWin(cantidad: number) {
  if (cantidad <= 0) return { total: 0, precioUnitario: 28, ahorro: 0, promoTag: '', precioAplicadoTexto: 'S/ 28 c/u' };

  if (cantidad >= 3) {
    const total = cantidad * 25;
    const regular = cantidad * 28;
    return {
      total,
      precioUnitario: 25,
      ahorro: regular - total,
      promoTag: 'Promo desde 3 shorts (S/ 25 c/u)',
      precioAplicadoTexto: 'S/ 25 c/u',
    };
  } else {
    return {
      total: cantidad * 28,
      precioUnitario: 28,
      ahorro: 0,
      promoTag: 'S/ 28 c/u',
      precioAplicadoTexto: 'S/ 28 c/u',
    };
  }
}

// Componente para tarjeta de Short Clásico (Polistrech)
interface TarjetaClasicoProps {
  short: ShortProduct;
  index: number;
  tallaActual: Size;
  cantidadActual: number;
  onSeleccionarTalla: (id: string, talla: Size) => void;
  onCambiarCantidad: (id: string, delta: number) => void;
  onAgregar: (prod: ShortProduct) => void;
  onVerImagen: (prod: ShortProduct) => void;
}

const TarjetaClasico = React.memo(function TarjetaClasico({
  short,
  index,
  tallaActual,
  cantidadActual,
  onSeleccionarTalla,
  onCambiarCantidad,
  onAgregar,
  onVerImagen,
}: TarjetaClasicoProps) {
  const isAboveFold = index < 3;

  return (
    <article className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col justify-between">
      {/* Contenedor de Imagen */}
      <div
        className="w-full aspect-[3/2] bg-neutral-50 flex items-center justify-center p-2.5 cursor-pointer relative group"
        onClick={() => onVerImagen(short)}
        title="Toca para ver en grande"
      >
        <img
          src={short.image}
          alt={short.title}
          width={900}
          height={600}
          loading={isAboveFold ? 'eager' : 'lazy'}
          fetchPriority={isAboveFold ? 'high' : 'low'}
          decoding="async"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200 pointer-events-none"
        />
        <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs pointer-events-none">
          Tela Polistrech
        </div>
        <span className="absolute top-3 right-3 bg-neutral-950 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-xs pointer-events-none">
          S/ 15
        </span>
      </div>

      {/* Info y Controles */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h2 className="font-bold text-base text-neutral-950 capitalize leading-snug">
            {short.title}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Short deportivo con cordón ajustable · Polistrech
          </p>
        </div>

        {/* Selector de Tallas */}
        <div>
          <div className="flex justify-between text-xs text-neutral-600 mb-1.5 font-medium">
            <span>Talla:</span>
            <span className="font-bold text-neutral-950">{tallaActual}</span>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {TALLAS_CLASICOS.map((talla) => (
              <button
                key={talla}
                type="button"
                onClick={() => onSeleccionarTalla(short.id, talla)}
                className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  tallaActual === talla
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300'
                }`}
              >
                {talla}
              </button>
            ))}
          </div>
        </div>

        {/* Cantidad y Agregar */}
        <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
          <div className="flex items-center border border-neutral-300 rounded-lg bg-neutral-50">
            <button
              type="button"
              onClick={() => onCambiarCantidad(short.id, -1)}
              className="px-2.5 py-1.5 text-neutral-700 hover:bg-neutral-200 font-bold text-sm cursor-pointer select-none"
              title="Menos"
            >
              -
            </button>
            <span className="px-2 text-xs font-bold text-neutral-950 tabular-nums">
              {cantidadActual}
            </span>
            <button
              type="button"
              onClick={() => onCambiarCantidad(short.id, 1)}
              className="px-2.5 py-1.5 text-neutral-700 hover:bg-neutral-200 font-bold text-sm cursor-pointer select-none"
              title="Más"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => onAgregar(short)}
            className="flex-1 py-2 px-3 bg-neutral-950 hover:bg-neutral-800 active:scale-98 text-white text-xs font-bold rounded-lg transition-transform cursor-pointer"
          >
            Agregar ({tallaActual})
          </button>
        </div>
      </div>
    </article>
  );
});

// Componente para tarjeta de Short de Equipos (Win)
interface TarjetaWinProps {
  short: ShortProduct;
  index: number;
  cantidadActual: number;
  onCambiarCantidad: (id: string, delta: number) => void;
  onAgregar: (prod: ShortProduct) => void;
  onVerImagen: (prod: ShortProduct) => void;
}

const TarjetaWin = React.memo(function TarjetaWin({
  short,
  index,
  cantidadActual,
  onCambiarCantidad,
  onAgregar,
  onVerImagen,
}: TarjetaWinProps) {
  const isAboveFold = index < 3;

  return (
    <article className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col justify-between">
      {/* Contenedor de Imagen */}
      <div
        className="w-full aspect-[3/2] bg-neutral-50 flex items-center justify-center p-2.5 cursor-pointer relative group"
        onClick={() => onVerImagen(short)}
        title="Toca para ver detalles, perspectivas y tela Win"
      >
        <img
          src={short.image}
          alt={short.title}
          width={900}
          height={600}
          loading={isAboveFold ? 'eager' : 'lazy'}
          fetchPriority={isAboveFold ? 'high' : 'low'}
          decoding="async"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200 pointer-events-none"
        />

        {/* Badges de Colección Win */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start pointer-events-none">
          <span className="bg-neutral-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
            Tela Win
          </span>
          <span className="bg-blue-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs">
            Talla L
          </span>
        </div>

        {/* Precio Unitario y Promo */}
        <div className="absolute top-3 right-3 flex flex-col items-end pointer-events-none">
          <span className="bg-neutral-950 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-xs">
            S/ 28
          </span>
          <span className="mt-1 bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs">
            3 por S/ 75
          </span>
        </div>
      </div>

      {/* Info y Controles */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-extrabold text-base text-neutral-950 leading-snug">
              {short.title}
            </h2>
            <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 shrink-0">
              Disponible en talla L
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Short deportivo oficial con escudo y tela Win transpirable
          </p>
        </div>

        {/* Etiqueta de precio y promo informativa */}
        <div className="bg-neutral-50 p-2 rounded-lg border border-neutral-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-neutral-500 text-[11px] block">Precio unitario:</span>
            <strong className="text-neutral-950 font-bold">S/ 28</strong>
          </div>
          <div className="text-right">
            <span className="text-emerald-700 text-[11px] block font-semibold">Promoción por 3:</span>
            <strong className="text-emerald-700 font-extrabold">S/ 25 c/u (S/ 75)</strong>
          </div>
        </div>

        {/* Selector de Cantidad y Botón de Agregar */}
        <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
          <div className="flex items-center border border-neutral-300 rounded-lg bg-neutral-50">
            <button
              type="button"
              onClick={() => onCambiarCantidad(short.id, -1)}
              className="px-2.5 py-1.5 text-neutral-700 hover:bg-neutral-200 font-bold text-sm cursor-pointer select-none"
              title="Menos"
            >
              -
            </button>
            <span className="px-2 text-xs font-bold text-neutral-950 tabular-nums">
              {cantidadActual}
            </span>
            <button
              type="button"
              onClick={() => onCambiarCantidad(short.id, 1)}
              className="px-2.5 py-1.5 text-neutral-700 hover:bg-neutral-200 font-bold text-sm cursor-pointer select-none"
              title="Más"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => onAgregar(short)}
            className="flex-1 py-2 px-3 bg-neutral-950 hover:bg-neutral-800 active:scale-98 text-white text-xs font-bold rounded-lg transition-transform cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Agregar al pedido</span>
            <span className="bg-neutral-800 text-[10px] px-1.5 py-0.2 rounded font-extrabold">(L)</span>
          </button>
        </div>
      </div>
    </article>
  );
});

export default function App() {
  // Selector de Colección Activa: 'clasicos' (Polistrech) o 'equipos' (Win)
  const [coleccionActiva, setColeccionActiva] = useState<CollectionType>('clasicos');

  // Carritos 100% independientes para no mezclar pedidos ni promociones
  const [pedidoClasicos, setPedidoClasicos] = useState<ItemPedido[]>([]);
  const [pedidoWin, setPedidoWin] = useState<ItemPedido[]>([]);

  // Carrito actualmente visualizado en el modal ('clasicos' o 'equipos')
  const [carritoModalActivo, setCarritoModalActivo] = useState<CollectionType>('clasicos');

  // Estados temporales de selección por tarjeta
  const [tallasClasicos, setTallasClasicos] = useState<Record<string, Size>>({});
  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  // Modales
  const [modalPedidoAbierto, setModalPedidoAbierto] = useState<boolean>(false);
  const [modalImagen, setModalImagen] = useState<ShortProduct | null>(null);
  const [modalTallas, setModalTallas] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Modalidad de entrega para Clásicos
  const [tipoEntregaClasicos, setTipoEntregaClasicos] = useState<TipoEntrega>('punto');
  const [zonaDeliveryClasicos, setZonaDeliveryClasicos] = useState<string>('Chiclayo');
  const [direccionDeliveryClasicos, setDireccionDeliveryClasicos] = useState<string>('');
  const [puntoSeleccionadoClasicos, setPuntoSeleccionadoClasicos] = useState<string>('La Catedral de Chiclayo');
  const [destinoShalomClasicos, setDestinoShalomClasicos] = useState<string>('');

  // Modalidad de entrega para Win
  const [tipoEntregaWin, setTipoEntregaWin] = useState<TipoEntrega>('punto');
  const [zonaDeliveryWin, setZonaDeliveryWin] = useState<string>('Chiclayo');
  const [direccionDeliveryWin, setDireccionDeliveryWin] = useState<string>('');
  const [puntoSeleccionadoWin, setPuntoSeleccionadoWin] = useState<string>('La Catedral de Chiclayo');
  const [destinoShalomWin, setDestinoShalomWin] = useState<string>('');

  // Cálculos independientes para Shorts Clásicos
  const totalPrendasClasicos = useMemo(
    () => pedidoClasicos.reduce((acc, it) => acc + it.cantidad, 0),
    [pedidoClasicos]
  );
  const {
    total: precioTotalClasicos,
    ahorro: ahorroClasicos,
    promoTag: promoTagClasicos,
    precioAplicadoTexto: precioAplicadoTextoClasicos,
  } = useMemo(() => calcularTotalesClasicos(totalPrendasClasicos), [totalPrendasClasicos]);
  const deliveryGratisClasicos = totalPrendasClasicos >= 3;

  // Cálculos independientes para Shorts Win
  const totalPrendasWin = useMemo(
    () => pedidoWin.reduce((acc, it) => acc + it.cantidad, 0),
    [pedidoWin]
  );
  const {
    total: precioTotalWin,
    ahorro: ahorroWin,
    promoTag: promoTagWin,
    precioAplicadoTexto: precioAplicadoTextoWin,
  } = useMemo(() => calcularTotalesWin(totalPrendasWin), [totalPrendasWin]);
  const deliveryGratisWin = totalPrendasWin >= 3;

  // Colección activa en vista
  const esClasicos = coleccionActiva === 'clasicos';

  // Total de prendas para la barra inferior según la colección que se está navegando
  const totalPrendasActiva = esClasicos ? totalPrendasClasicos : totalPrendasWin;
  const precioTotalActiva = esClasicos ? precioTotalClasicos : precioTotalWin;
  const ahorroActiva = esClasicos ? ahorroClasicos : ahorroWin;
  const deliveryGratisActiva = esClasicos ? deliveryGratisClasicos : deliveryGratisWin;

  // Manejo de Selección de Talla para Clásicos
  const handleSeleccionarTalla = useCallback((id: string, talla: Size) => {
    setTallasClasicos((prev) => (prev[id] === talla ? prev : { ...prev, [id]: talla }));
  }, []);

  // Manejo de Cantidad (+ / -)
  const handleCambiarCantidad = useCallback((id: string, delta: number) => {
    setCantidades((prev) => {
      const val = prev[id] || 1;
      const nuevo = Math.max(1, val + delta);
      return val === nuevo ? prev : { ...prev, [id]: nuevo };
    });
  }, []);

  // Agregar al pedido Clásicos (Polistrech)
  const handleAgregarClasico = useCallback((prod: ShortProduct) => {
    setTallasClasicos((currTallas) => {
      const t = currTallas[prod.id] || 'M';
      setCantidades((currCant) => {
        const c = currCant[prod.id] || 1;

        setPedidoClasicos((prev) => {
          const idx = prev.findIndex((it) => it.producto.id === prod.id && it.talla === t);
          if (idx > -1) {
            const copia = [...prev];
            copia[idx].cantidad += c;
            return copia;
          }
          return [...prev, { producto: prod, talla: t, cantidad: c }];
        });

        return { ...currCant, [prod.id]: 1 };
      });
      return currTallas;
    });

    setToast(`¡Agregado ${prod.title}!`);
    setTimeout(() => setToast(null), 2400);

    setPedidoClasicos((prev) => {
      const count = prev.reduce((acc, it) => acc + it.cantidad, 0);
      if (count >= 3) {
        setTipoEntregaClasicos((curr) => (curr === 'punto' ? 'delivery' : curr));
      }
      return prev;
    });
  }, []);

  // Agregar al pedido Win (Shorts de Equipos - Siempre Talla L)
  const handleAgregarWin = useCallback((prod: ShortProduct) => {
    setCantidades((currCant) => {
      const c = currCant[prod.id] || 1;

      setPedidoWin((prev) => {
        const idx = prev.findIndex((it) => it.producto.id === prod.id && it.talla === 'L');
        if (idx > -1) {
          const copia = [...prev];
          copia[idx].cantidad += c;
          return copia;
        }
        return [...prev, { producto: prod, talla: 'L', cantidad: c }];
      });

      return { ...currCant, [prod.id]: 1 };
    });

    setToast(`¡Agregado ${prod.title} (Talla L)!`);
    setTimeout(() => setToast(null), 2400);

    setPedidoWin((prev) => {
      const count = prev.reduce((acc, it) => acc + it.cantidad, 0);
      if (count >= 3) {
        setTipoEntregaWin((curr) => (curr === 'punto' ? 'delivery' : curr));
      }
      return prev;
    });
  }, []);

  const handleVerImagen = useCallback((prod: ShortProduct) => {
    setModalImagen(prod);
  }, []);

  // Modificar cantidades dentro del carrito
  const handleActualizarItemClasicos = useCallback((index: number, delta: number) => {
    setPedidoClasicos((prev) => {
      const copia = [...prev];
      const n = copia[index].cantidad + delta;
      if (n <= 0) return copia.filter((_, i) => i !== index);
      copia[index].cantidad = n;
      return copia;
    });
  }, []);

  const handleEliminarItemClasicos = useCallback((index: number) => {
    setPedidoClasicos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleActualizarItemWin = useCallback((index: number, delta: number) => {
    setPedidoWin((prev) => {
      const copia = [...prev];
      const n = copia[index].cantidad + delta;
      if (n <= 0) return copia.filter((_, i) => i !== index);
      copia[index].cantidad = n;
      return copia;
    });
  }, []);

  const handleEliminarItemWin = useCallback((index: number) => {
    setPedidoWin((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Selección de entrega con validación de 3 unidades
  const handleSeleccionarEntregaClasicos = useCallback((tipo: TipoEntrega) => {
    if (tipo === 'delivery' && !deliveryGratisClasicos) {
      setToast('¡Agrega 3 o más shorts Clásicos para Delivery GRATIS!');
      setTimeout(() => setToast(null), 2600);
      return;
    }
    setTipoEntregaClasicos(tipo);
  }, [deliveryGratisClasicos]);

  const handleSeleccionarEntregaWin = useCallback((tipo: TipoEntrega) => {
    if (tipo === 'delivery' && !deliveryGratisWin) {
      setToast('¡Agrega 3 o más shorts de Equipos para Delivery GRATIS!');
      setTimeout(() => setToast(null), 2600);
      return;
    }
    setTipoEntregaWin(tipo);
  }, [deliveryGratisWin]);

  // Generador de Mensaje de WhatsApp para Shorts Clásicos (Polistrech)
  const mensajeWhatsAppClasicos = useMemo(() => {
    if (pedidoClasicos.length === 0) return '';

    let txt = 'Hola POOLSTORE 👋\n\nQuiero realizar el siguiente pedido:\n\n';

    pedidoClasicos.forEach((it) => {
      const nom = it.producto.title.startsWith('Short')
        ? it.producto.title
        : `Short ${it.producto.title}`;
      txt += `🩳 ${nom}\n`;
      txt += `Tela: Polistrech\n`;
      txt += `Talla: ${it.talla}\n`;
      txt += `Cantidad: ${it.cantidad}\n\n`;
    });

    const precioStr = precioTotalClasicos % 1 === 0 ? precioTotalClasicos.toString() : precioTotalClasicos.toFixed(2);
    txt += `📦 Total: ${totalPrendasClasicos} ${totalPrendasClasicos === 1 ? 'unidad' : 'unidades'}\n`;
    txt += `💰 Precio aplicado: ${precioAplicadoTextoClasicos}\n`;
    txt += `💵 Total: S/${precioStr}\n`;

    if (tipoEntregaClasicos === 'delivery' && deliveryGratisClasicos) {
      const ref = direccionDeliveryClasicos.trim() ? ` (${direccionDeliveryClasicos.trim()})` : '';
      txt += `📍 Entrega: ${zonaDeliveryClasicos}${ref}\n`;
      txt += `🛵 Delivery gratis\n\n`;
    } else if (tipoEntregaClasicos === 'shalom') {
      const dest = destinoShalomClasicos.trim() ? ` a ${destinoShalomClasicos.trim()}` : '';
      txt += `📍 Entrega: Agencia Shalom${dest} (Costo a coordinar)\n\n`;
    } else {
      txt += `📍 Entrega: Punto de encuentro - ${puntoSeleccionadoClasicos}\n\n`;
    }

    txt += '¿Me confirmas disponibilidad y coordinamos la entrega?';
    return txt;
  }, [
    pedidoClasicos,
    precioTotalClasicos,
    totalPrendasClasicos,
    precioAplicadoTextoClasicos,
    tipoEntregaClasicos,
    deliveryGratisClasicos,
    zonaDeliveryClasicos,
    direccionDeliveryClasicos,
    puntoSeleccionadoClasicos,
    destinoShalomClasicos,
  ]);

  // Generador de Mensaje de WhatsApp para Shorts de Equipos (Win)
  const mensajeWhatsAppWin = useMemo(() => {
    if (pedidoWin.length === 0) return '';

    let txt = 'Hola POOLSTORE 👋\n\nQuiero realizar el siguiente pedido:\n\n';

    pedidoWin.forEach((it) => {
      const nom = it.producto.title.startsWith('Short')
        ? it.producto.title
        : `Short ${it.producto.title}`;
      txt += `🩳 ${nom}\n`;
      txt += `Tela: Win\n`;
      txt += `Talla: L\n`;
      txt += `Cantidad: ${it.cantidad}\n\n`;
    });

    const precioStr = precioTotalWin % 1 === 0 ? precioTotalWin.toString() : precioTotalWin.toFixed(2);
    txt += `📦 Total: ${totalPrendasWin} ${totalPrendasWin === 1 ? 'unidad' : 'unidades'}\n`;
    txt += `💰 Precio aplicado: ${precioAplicadoTextoWin}\n`;
    txt += `💵 Total: S/${precioStr}\n`;

    if (tipoEntregaWin === 'delivery' && deliveryGratisWin) {
      const ref = direccionDeliveryWin.trim() ? ` (${direccionDeliveryWin.trim()})` : '';
      txt += `📍 Entrega: ${zonaDeliveryWin}${ref}\n`;
      txt += `🛵 Delivery gratis\n\n`;
    } else if (tipoEntregaWin === 'shalom') {
      const dest = destinoShalomWin.trim() ? ` a ${destinoShalomWin.trim()}` : '';
      txt += `📍 Entrega: Agencia Shalom${dest} (Costo a coordinar)\n\n`;
    } else {
      txt += `📍 Entrega: Punto de encuentro - ${puntoSeleccionadoWin}\n\n`;
    }

    txt += '¿Me confirmas disponibilidad y coordinamos la entrega?';
    return txt;
  }, [
    pedidoWin,
    precioTotalWin,
    totalPrendasWin,
    precioAplicadoTextoWin,
    tipoEntregaWin,
    deliveryGratisWin,
    zonaDeliveryWin,
    direccionDeliveryWin,
    puntoSeleccionadoWin,
    destinoShalomWin,
  ]);

  const handleEnviarWhatsAppClasicos = () => {
    if (!mensajeWhatsAppClasicos) return;
    const url = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(mensajeWhatsAppClasicos)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEnviarWhatsAppWin = () => {
    if (!mensajeWhatsAppWin) return;
    const url = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(mensajeWhatsAppWin)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const abrirModalPedido = (coleccion?: CollectionType) => {
    const target = coleccion || coleccionActiva;
    setCarritoModalActivo(target);
    setModalPedidoAbierto(true);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans pb-28">
      
      {/* 1. CABECERA: POOLSTORE + Tu tienda virtual de confianza */}
      <header className="sticky top-0 z-30 bg-white/98 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-xl sm:text-2xl font-black tracking-widest text-neutral-950 uppercase leading-none hover:opacity-90 transition-opacity"
            >
              POOLSTORE
            </a>
            <span className="text-[11px] text-neutral-500 font-semibold italic mt-0.5 tracking-tight">
              Tu tienda virtual de confianza.
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setModalTallas(true)}
              className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-neutral-950 underline decoration-neutral-300 underline-offset-4 cursor-pointer hidden xs:inline-block"
            >
              Guía de Tallas
            </button>

            {/* Botón Carrito con contadores separados */}
            <button
              type="button"
              onClick={() => abrirModalPedido()}
              className="px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <span>Mi Pedido</span>
              {(totalPrendasClasicos > 0 || totalPrendasWin > 0) && (
                <div className="flex items-center gap-1">
                  {totalPrendasClasicos > 0 && (
                    <span 
                      title={`${totalPrendasClasicos} shorts Clásicos`}
                      className="bg-white text-neutral-950 px-1.5 py-0.2 rounded-full text-[10px] font-black tabular-nums"
                    >
                      {totalPrendasClasicos}
                    </span>
                  )}
                  {totalPrendasWin > 0 && (
                    <span 
                      title={`${totalPrendasWin} shorts de Equipos`}
                      className="bg-blue-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-black tabular-nums"
                    >
                      {totalPrendasWin}
                    </span>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notificación flotante rápida */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 text-white px-4 py-2 rounded-lg shadow-xl text-xs font-semibold animate-fade-in text-center max-w-sm pointer-events-none">
          {toast}
        </div>
      )}

      {/* 2. SELECTOR DE COLECCIONES DE SHORTS DEPORTIVOS */}
      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 block">
                Categoría
              </span>
              <p className="text-sm font-extrabold text-neutral-900 uppercase tracking-tight">
                SHORTS DEPORTIVOS
              </p>
            </div>

            {/* Selector interactivo de Colecciones */}
            <nav aria-label="Selector de colecciones" className="flex items-center bg-neutral-200/80 p-1 rounded-xl shadow-inner">
              <button
                type="button"
                onClick={() => setColeccionActiva('clasicos')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  esClasicos
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/60'
                }`}
              >
                <span>Shorts Clásicos</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${esClasicos ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-300 text-neutral-700'}`}>
                  Polistrech · S/15
                </span>
                {totalPrendasClasicos > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-0.5" title="Prendas en carrito" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setColeccionActiva('equipos')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  !esClasicos
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/60'
                }`}
              >
                <span>Shorts de Equipos</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${!esClasicos ? 'bg-blue-600 text-white' : 'bg-neutral-300 text-neutral-700'}`}>
                  Win · S/28
                </span>
                {totalPrendasWin > 0 && (
                  <span className="w-2 h-2 rounded-full bg-blue-400 inline-block ml-0.5" title="Prendas en carrito" />
                )}
              </button>
            </nav>
          </div>
        </div>
      </section>

      {/* Contenido animado de la Colección con transición Fade y Slide */}
      <div key={coleccionActiva} className="animate-collection-enter">
        {/* 3. SECCIÓN HERO DE LA COLECCIÓN SELECCIONADA + PRECIOS + ENTREGAS */}
        <section className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
                esClasicos ? 'bg-neutral-200 text-neutral-800' : 'bg-blue-100 text-blue-900'
              }`}>
                {esClasicos ? 'Colección 1 · Tela Polistrech' : 'Colección 2 · Tela Win'}
              </span>
              {!esClasicos && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider bg-neutral-900 text-white">
                  Única Talla L
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
              {esClasicos ? 'Shorts Deportivos Clásicos' : 'Shorts Deportivos de Equipos'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              {esClasicos 
                ? '36 combinaciones en stock · Tallas XS, S, M, L y XL · Elige tus colores'
                : '11 modelos de clubes y selecciones · Diseños con escudo y tela Win · Talla L'}
            </p>
          </div>

          {/* Tarjeta de Precios Oficiales de la Colección Activa */}
          {esClasicos ? (
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
          ) : (
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 flex items-center gap-3 sm:gap-4 text-xs self-start md:self-auto shadow-2xs">
              <div className="text-center px-1">
                <span className="block text-[10px] text-neutral-500 font-semibold">1 short</span>
                <strong className="text-sm font-black text-neutral-950">S/ 28</strong>
              </div>
              <div className="h-6 w-px bg-neutral-200" />
              <div className="text-center px-2 bg-emerald-50 rounded-lg py-1 border border-emerald-200">
                <span className="block text-[10px] text-emerald-800 font-bold">Desde 3 shorts</span>
                <strong className="text-sm font-black text-emerald-700">S/ 25 c/u (3 por S/ 75)</strong>
              </div>
            </div>
          )}
        </div>

        {/* Condiciones de Entrega */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2.5">
            <span className="text-lg">🛵</span>
            <div className="text-xs">
              <strong className="font-extrabold text-emerald-950 block">
                DELIVERY GRATIS desde 3 shorts {esClasicos ? 'Clásicos' : 'de Equipos'}
              </strong>
              <p className="text-emerald-800 mt-0.5">
                Chiclayo, JLO, Lambayeque y La Victoria.
              </p>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-start gap-2.5">
            <span className="text-lg">📍</span>
            <div className="text-xs">
              <strong className="font-extrabold text-neutral-950 block">
                PUNTOS DE ENTREGA desde 1 short
              </strong>
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

      {/* 4. CUADRÍCULA DE PRODUCTOS (SEGÚN COLECCIÓN SELECCIONADA) */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {esClasicos ? (
          /* Colección 1: Shorts Clásicos (Polistrech - 36 modelos) */
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Catálogo Polistrech ({SHORTS.length} modelos)
              </span>
              <span className="text-xs text-neutral-400">
                Tallas XS, S, M, L y XL
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {SHORTS.map((short, idx) => (
                <TarjetaClasico
                  key={short.id}
                  short={short}
                  index={idx}
                  tallaActual={tallasClasicos[short.id] || 'M'}
                  cantidadActual={cantidades[short.id] || 1}
                  onSeleccionarTalla={handleSeleccionarTalla}
                  onCambiarCantidad={handleCambiarCantidad}
                  onAgregar={handleAgregarClasico}
                  onVerImagen={handleVerImagen}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Colección 2: Shorts de Equipos (Win - 11 modelos) */
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Catálogo Equipos Win ({SHORTS_WIN.length} modelos)
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                Disponible únicamente en Talla L · S/28 c/u · 3 por S/75
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {SHORTS_WIN.map((short, idx) => (
                <TarjetaWin
                  key={short.id}
                  short={short}
                  index={idx}
                  cantidadActual={cantidades[short.id] || 1}
                  onCambiarCantidad={handleCambiarCantidad}
                  onAgregar={handleAgregarWin}
                  onVerImagen={handleVerImagen}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      </div>

      {/* 5. BARRA INFERIOR DE PEDIDO (Aparece al haber prendas en el catálogo activo o en ambos) */}
      {(totalPrendasClasicos > 0 || totalPrendasWin > 0) && (
        <aside 
          aria-label="Resumen de pedido" 
          className="fixed bottom-0 inset-x-0 z-30 p-3 bg-neutral-950 text-white border-t border-neutral-800 shadow-2xl animate-fade-in"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-extrabold tabular-nums">
                  {esClasicos ? 'Clásicos: ' : 'Equipos: '}
                  {totalPrendasActiva} {totalPrendasActiva === 1 ? 'short' : 'shorts'} · S/ {precioTotalActiva % 1 === 0 ? precioTotalActiva : precioTotalActiva.toFixed(2)}
                </p>
                {ahorroActiva > 0 && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Ahorras S/ {ahorroActiva % 1 === 0 ? ahorroActiva : ahorroActiva.toFixed(2)}
                  </span>
                )}
                {/* Indicador del otro carrito si tiene ítems */}
                {esClasicos && totalPrendasWin > 0 && (
                  <button 
                    type="button"
                    onClick={() => abrirModalPedido('equipos')}
                    className="text-[10px] text-blue-400 underline cursor-pointer"
                  >
                    (+ {totalPrendasWin} en Equipos)
                  </button>
                )}
                {!esClasicos && totalPrendasClasicos > 0 && (
                  <button 
                    type="button"
                    onClick={() => abrirModalPedido('clasicos')}
                    className="text-[10px] text-emerald-400 underline cursor-pointer"
                  >
                    (+ {totalPrendasClasicos} en Clásicos)
                  </button>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {deliveryGratisActiva ? (
                  <span className="text-emerald-400 font-semibold">🛵 ¡Delivery GRATIS habilitado en esta colección!</span>
                ) : (
                  <span>📍 Puntos de entrega (Faltan {3 - totalPrendasActiva} para Delivery Gratis de {esClasicos ? 'Clásicos' : 'Equipos'})</span>
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => abrirModalPedido(coleccionActiva)}
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors shrink-0"
            >
              <span>Ver Pedido</span>
              <span>→</span>
            </button>
          </div>
        </aside>
      )}

      {/* 6. BOTÓN FLOTANTE DISCRETO DE WHATSAPP (903 566 655) */}
      <aside 
        aria-label="Chat de WhatsApp"
        className={`fixed z-20 right-4 sm:right-6 transition-all duration-200 ${
          totalPrendasActiva > 0 ? 'bottom-20 sm:bottom-6' : 'bottom-5 sm:bottom-6'
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

      {/* 7. MODAL DE PEDIDO INDEPENDIENTE (CON SELECTOR DE CARRITO) */}
      {modalPedidoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 animate-fade-in">
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
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h2 id="order-title" className="text-lg font-bold text-neutral-950">
                  Tu Pedido PoolStore
                </h2>
                <p className="text-xs text-neutral-500">
                  Carritos 100% independientes por colección
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

            {/* Pestañas para alternar entre Carrito Clásicos y Carrito Win */}
            <div className="flex gap-2 pt-3 pb-1">
              <button
                type="button"
                onClick={() => setCarritoModalActivo('clasicos')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  carritoModalActivo === 'clasicos'
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <span>Shorts Clásicos</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  carritoModalActivo === 'clasicos' ? 'bg-white text-neutral-950' : 'bg-neutral-200 text-neutral-800'
                }`}>
                  {totalPrendasClasicos}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCarritoModalActivo('equipos')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  carritoModalActivo === 'equipos'
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <span>Shorts de Equipos</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  carritoModalActivo === 'equipos' ? 'bg-white text-neutral-950' : 'bg-neutral-200 text-neutral-800'
                }`}>
                  {totalPrendasWin}
                </span>
              </button>
            </div>

            {/* CONTENIDO DEL CARRITO SELECCIONADO */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
              {carritoModalActivo === 'clasicos' ? (
                /* CARRITO CLÁSICOS (POLISTRECH) */
                pedidoClasicos.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500 text-sm">
                    <p>No tienes shorts Clásicos agregados.</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Elige tus combinaciones y tallas (XS a XL) desde S/ 15.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Lista de productos Clásicos */}
                    <div className="space-y-2">
                      {pedidoClasicos.map((it, idx) => (
                        <div
                          key={`clasico-${it.producto.id}-${it.talla}-${idx}`}
                          className="flex items-center justify-between gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200"
                        >
                          <img
                            src={it.producto.image}
                            alt={it.producto.title}
                            width={60}
                            height={40}
                            loading="lazy"
                            className="w-13 h-10 object-contain bg-white rounded border border-neutral-200 shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-neutral-900 truncate capitalize">
                              {it.producto.title}
                            </p>
                            <p className="text-xs text-neutral-600 font-semibold">
                              Tela: Polistrech · Talla: {it.talla}
                            </p>
                          </div>

                          <div className="flex items-center border border-neutral-300 rounded bg-white">
                            <button
                              type="button"
                              onClick={() => handleActualizarItemClasicos(idx, -1)}
                              className="px-2 py-0.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold text-neutral-950 tabular-nums">
                              {it.cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleActualizarItemClasicos(idx, 1)}
                              className="px-2 py-0.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleEliminarItemClasicos(idx)}
                            className="text-neutral-400 hover:text-red-600 font-bold text-sm px-1 cursor-pointer"
                            title="Quitar"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Resumen de Costos y Promociones Clásicos */}
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs">
                      <div className="flex justify-between items-center text-neutral-600">
                        <span>Cantidad de shorts Clásicos:</span>
                        <strong className="text-neutral-950">{totalPrendasClasicos}</strong>
                      </div>
                      <div className="flex justify-between items-center text-neutral-600 mt-1">
                        <span>Precio aplicado:</span>
                        <strong className="text-neutral-950">{precioAplicadoTextoClasicos}</strong>
                      </div>
                      {ahorroClasicos > 0 && (
                        <div className="flex justify-between items-center text-emerald-700 mt-1 font-semibold">
                          <span>Descuento por volumen:</span>
                          <strong>- S/ {ahorroClasicos % 1 === 0 ? ahorroClasicos : ahorroClasicos.toFixed(2)}</strong>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm font-extrabold text-neutral-950 pt-2 border-t border-neutral-200 mt-2">
                        <span>Total a pagar:</span>
                        <span className="text-emerald-700">S/ {precioTotalClasicos % 1 === 0 ? precioTotalClasicos : precioTotalClasicos.toFixed(2)}</span>
                      </div>
                      {promoTagClasicos && (
                        <span className="inline-block text-[11px] text-neutral-500 mt-1 font-medium">
                          {promoTagClasicos}
                        </span>
                      )}
                    </div>

                    {/* SELECCIÓN DE MODALIDAD DE ENTREGA CLÁSICOS */}
                    <div className="border border-neutral-200 rounded-xl p-3.5 bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-xs text-neutral-900 uppercase tracking-wide">
                          Modalidad de Entrega (Clásicos)
                        </h3>
                        {deliveryGratisClasicos ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            🛵 Delivery GRATIS Activo
                          </span>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">
                            Faltan {3 - totalPrendasClasicos} para Delivery Gratis
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleSeleccionarEntregaClasicos('delivery')}
                          className={`py-2 px-1 text-center rounded-md font-bold text-xs transition-colors cursor-pointer ${
                            tipoEntregaClasicos === 'delivery'
                              ? 'bg-white text-emerald-700 shadow-xs'
                              : deliveryGratisClasicos
                              ? 'text-neutral-700 hover:text-neutral-950'
                              : 'text-neutral-400 opacity-60'
                          }`}
                        >
                          🛵 Delivery {deliveryGratisClasicos ? 'GRATIS' : '(Desde 3)'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSeleccionarEntregaClasicos('punto')}
                          className={`py-2 px-1 text-center rounded-md font-bold text-xs transition-colors cursor-pointer ${
                            tipoEntregaClasicos === 'punto'
                              ? 'bg-white text-neutral-950 shadow-xs'
                              : 'text-neutral-700 hover:text-neutral-950'
                          }`}
                        >
                          📍 Puntos de Entrega
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSeleccionarEntregaClasicos('shalom')}
                          className={`py-2 px-1 text-center rounded-md font-bold text-xs transition-colors cursor-pointer ${
                            tipoEntregaClasicos === 'shalom'
                              ? 'bg-white text-neutral-950 shadow-xs'
                              : 'text-neutral-700 hover:text-neutral-950'
                          }`}
                        >
                          📦 Shalom
                        </button>
                      </div>

                      {/* Caso Delivery Gratis */}
                      {tipoEntregaClasicos === 'delivery' && deliveryGratisClasicos && (
                        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-2.5">
                          <p className="font-bold text-emerald-950">
                            Selecciona tu zona de Delivery GRATIS:
                          </p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {ZONAS_DELIVERY_GRATIS.map((zona) => (
                              <button
                                key={zona}
                                type="button"
                                onClick={() => setZonaDeliveryClasicos(zona)}
                                className={`py-1.5 px-2 rounded-lg border text-left font-semibold text-xs cursor-pointer ${
                                  zonaDeliveryClasicos === zona
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
                              value={direccionDeliveryClasicos}
                              onChange={(e) => setDireccionDeliveryClasicos(e.target.value)}
                              placeholder="Ej: Av. Balta 450 / Urb. Santa Victoria"
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-emerald-600"
                            />
                          </div>
                        </div>
                      )}

                      {/* Caso Delivery sin alcanzar las 3 unidades */}
                      {tipoEntregaClasicos === 'delivery' && !deliveryGratisClasicos && (
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                          <p className="font-bold text-neutral-800">
                            El delivery gratis aplica a partir de 3 shorts Clásicos.
                          </p>
                          <p className="mt-1">
                            Actualmente tienes {totalPrendasClasicos}. ¡Agrega {3 - totalPrendasClasicos} short(s) más para delivery sin costo en Chiclayo, JLO, Lambayeque o La Victoria!
                          </p>
                        </div>
                      )}

                      {/* Caso Puntos de Entrega */}
                      {tipoEntregaClasicos === 'punto' && (
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
                          <p className="font-bold text-neutral-800">
                            Elige tu punto de entrega:
                          </p>
                          <div className="space-y-1.5">
                            {PUNTOS_ENTREGA.map((punto) => (
                              <label
                                key={punto}
                                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  puntoSeleccionadoClasicos === punto
                                    ? 'bg-neutral-950 text-white border-neutral-950'
                                    : 'bg-white text-neutral-800 border-neutral-200'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="punto_entrega_clasicos"
                                  checked={puntoSeleccionadoClasicos === punto}
                                  onChange={() => setPuntoSeleccionadoClasicos(punto)}
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

                      {/* Caso Shalom */}
                      {tipoEntregaClasicos === 'shalom' && (
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
                              value={destinoShalomClasicos}
                              onChange={(e) => setDestinoShalomClasicos(e.target.value)}
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

                    {/* Mensaje preparado para enviar */}
                    <div className="pt-2">
                      <p className="text-xs font-bold text-neutral-700 mb-1">
                        Mensaje preparado para WhatsApp:
                      </p>
                      <pre className="bg-neutral-100 p-3 rounded-lg text-xs font-mono text-neutral-800 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                        {mensajeWhatsAppClasicos}
                      </pre>
                    </div>
                  </>
                )
              ) : (
                /* CARRITO SHORTS DE EQUIPOS (WIN) */
                pedidoWin.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500 text-sm">
                    <p>No tienes shorts de Equipos agregados.</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Elige tus equipos favoritos (Talla L) a S/ 28 c/u o aprovecha la promo de 3 por S/ 75.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Lista de productos Win */}
                    <div className="space-y-2">
                      {pedidoWin.map((it, idx) => (
                        <div
                          key={`win-${it.producto.id}-${idx}`}
                          className="flex items-center justify-between gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200"
                        >
                          <img
                            src={it.producto.image}
                            alt={it.producto.title}
                            width={60}
                            height={40}
                            loading="lazy"
                            className="w-13 h-10 object-contain bg-white rounded border border-neutral-200 shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-neutral-900 truncate">
                              {it.producto.title}
                            </p>
                            <p className="text-xs text-neutral-600 font-semibold">
                              Tela: Win · Talla: L (Única)
                            </p>
                          </div>

                          <div className="flex items-center border border-neutral-300 rounded bg-white">
                            <button
                              type="button"
                              onClick={() => handleActualizarItemWin(idx, -1)}
                              className="px-2 py-0.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold text-neutral-950 tabular-nums">
                              {it.cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleActualizarItemWin(idx, 1)}
                              className="px-2 py-0.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleEliminarItemWin(idx)}
                            className="text-neutral-400 hover:text-red-600 font-bold text-sm px-1 cursor-pointer"
                            title="Quitar"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Resumen de Costos y Promociones Win */}
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs">
                      <div className="flex justify-between items-center text-neutral-600">
                        <span>Cantidad de shorts de Equipos:</span>
                        <strong className="text-neutral-950">{totalPrendasWin}</strong>
                      </div>
                      <div className="flex justify-between items-center text-neutral-600 mt-1">
                        <span>Precio aplicado:</span>
                        <strong className="text-neutral-950">{precioAplicadoTextoWin}</strong>
                      </div>
                      {ahorroWin > 0 && (
                        <div className="flex justify-between items-center text-emerald-700 mt-1 font-semibold">
                          <span>Ahorro promo 3+ shorts:</span>
                          <strong>- S/ {ahorroWin % 1 === 0 ? ahorroWin : ahorroWin.toFixed(2)}</strong>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm font-extrabold text-neutral-950 pt-2 border-t border-neutral-200 mt-2">
                        <span>Total a pagar:</span>
                        <span className="text-emerald-700">S/ {precioTotalWin % 1 === 0 ? precioTotalWin : precioTotalWin.toFixed(2)}</span>
                      </div>
                      {promoTagWin && (
                        <span className="inline-block text-[11px] text-neutral-500 mt-1 font-medium">
                          {promoTagWin}
                        </span>
                      )}
                    </div>

                    {/* SELECCIÓN DE MODALIDAD DE ENTREGA WIN */}
                    <div className="border border-neutral-200 rounded-xl p-3.5 bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-xs text-neutral-900 uppercase tracking-wide">
                          Modalidad de Entrega (Equipos Win)
                        </h3>
                        {deliveryGratisWin ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            🛵 Delivery GRATIS Activo
                          </span>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">
                            Faltan {3 - totalPrendasWin} para Delivery Gratis
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleSeleccionarEntregaWin('delivery')}
                          className={`py-2 px-1 text-center rounded-md font-bold text-xs transition-colors cursor-pointer ${
                            tipoEntregaWin === 'delivery'
                              ? 'bg-white text-emerald-700 shadow-xs'
                              : deliveryGratisWin
                              ? 'text-neutral-700 hover:text-neutral-950'
                              : 'text-neutral-400 opacity-60'
                          }`}
                        >
                          🛵 Delivery {deliveryGratisWin ? 'GRATIS' : '(Desde 3)'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSeleccionarEntregaWin('punto')}
                          className={`py-2 px-1 text-center rounded-md font-bold text-xs transition-colors cursor-pointer ${
                            tipoEntregaWin === 'punto'
                              ? 'bg-white text-neutral-950 shadow-xs'
                              : 'text-neutral-700 hover:text-neutral-950'
                          }`}
                        >
                          📍 Puntos de Entrega
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSeleccionarEntregaWin('shalom')}
                          className={`py-2 px-1 text-center rounded-md font-bold text-xs transition-colors cursor-pointer ${
                            tipoEntregaWin === 'shalom'
                              ? 'bg-white text-neutral-950 shadow-xs'
                              : 'text-neutral-700 hover:text-neutral-950'
                          }`}
                        >
                          📦 Shalom
                        </button>
                      </div>

                      {/* Caso Delivery Gratis */}
                      {tipoEntregaWin === 'delivery' && deliveryGratisWin && (
                        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-2.5">
                          <p className="font-bold text-emerald-950">
                            Selecciona tu zona de Delivery GRATIS:
                          </p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {ZONAS_DELIVERY_GRATIS.map((zona) => (
                              <button
                                key={zona}
                                type="button"
                                onClick={() => setZonaDeliveryWin(zona)}
                                className={`py-1.5 px-2 rounded-lg border text-left font-semibold text-xs cursor-pointer ${
                                  zonaDeliveryWin === zona
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
                              value={direccionDeliveryWin}
                              onChange={(e) => setDireccionDeliveryWin(e.target.value)}
                              placeholder="Ej: Av. Balta 450 / Urb. Santa Victoria"
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-emerald-600"
                            />
                          </div>
                        </div>
                      )}

                      {/* Caso Delivery sin alcanzar 3 unidades */}
                      {tipoEntregaWin === 'delivery' && !deliveryGratisWin && (
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                          <p className="font-bold text-neutral-800">
                            El delivery gratis aplica a partir de 3 shorts de Equipos.
                          </p>
                          <p className="mt-1">
                            Actualmente tienes {totalPrendasWin}. ¡Agrega {3 - totalPrendasWin} short(s) más para delivery sin costo en Chiclayo, JLO, Lambayeque o La Victoria!
                          </p>
                        </div>
                      )}

                      {/* Caso Puntos de Entrega */}
                      {tipoEntregaWin === 'punto' && (
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
                          <p className="font-bold text-neutral-800">
                            Elige tu punto de entrega:
                          </p>
                          <div className="space-y-1.5">
                            {PUNTOS_ENTREGA.map((punto) => (
                              <label
                                key={punto}
                                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  puntoSeleccionadoWin === punto
                                    ? 'bg-neutral-950 text-white border-neutral-950'
                                    : 'bg-white text-neutral-800 border-neutral-200'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="punto_entrega_win"
                                  checked={puntoSeleccionadoWin === punto}
                                  onChange={() => setPuntoSeleccionadoWin(punto)}
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

                      {/* Caso Shalom */}
                      {tipoEntregaWin === 'shalom' && (
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
                              value={destinoShalomWin}
                              onChange={(e) => setDestinoShalomWin(e.target.value)}
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

                    {/* Mensaje preparado para enviar */}
                    <div className="pt-2">
                      <p className="text-xs font-bold text-neutral-700 mb-1">
                        Mensaje preparado para WhatsApp:
                      </p>
                      <pre className="bg-neutral-100 p-3 rounded-lg text-xs font-mono text-neutral-800 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                        {mensajeWhatsAppWin}
                      </pre>
                    </div>
                  </>
                )
              )}
            </div>

            {/* BOTÓN WHATSAPP DE ENVÍO SEGÚN EL CARRITO VISUALIZADO */}
            {carritoModalActivo === 'clasicos' && pedidoClasicos.length > 0 && (
              <div className="pt-3 border-t border-neutral-200 space-y-2">
                <button
                  type="button"
                  onClick={handleEnviarWhatsAppClasicos}
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Enviar pedido Clásicos por WhatsApp</span>
                </button>
                <p className="text-[11px] text-neutral-400 text-center">
                  Se enviará al 903 566 655 con el detalle de shorts Clásicos y entrega.
                </p>
              </div>
            )}

            {carritoModalActivo === 'equipos' && pedidoWin.length > 0 && (
              <div className="pt-3 border-t border-neutral-200 space-y-2">
                <button
                  type="button"
                  onClick={handleEnviarWhatsAppWin}
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Enviar pedido de Equipos por WhatsApp</span>
                </button>
                <p className="text-[11px] text-neutral-400 text-center">
                  Se enviará al 903 566 655 con el detalle de shorts de Equipos (Win) y entrega.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. MODAL DE FOTO EN ALTA RESOLUCIÓN Y DETALLES */}
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
              <div>
                <h3 className="font-bold text-sm capitalize text-neutral-950">
                  {modalImagen.title}
                </h3>
                <span className="text-[11px] text-neutral-500 font-medium">
                  {modalImagen.fabric === 'Win' 
                    ? 'Tela Win transpirable · Disponible en Talla L · S/ 28 c/u (3 por S/ 75)'
                    : 'Tela Polistrech · Tallas XS a XL · S/ 15 c/u'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalImagen(null)}
                className="text-neutral-400 hover:text-neutral-950 font-bold text-base p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="w-full aspect-[3/2] flex items-center justify-center py-2 bg-neutral-50 my-2 rounded-xl overflow-hidden">
              <img
                src={modalImagen.image}
                alt={modalImagen.title}
                width={900}
                height={600}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="pt-2 text-center flex items-center justify-center gap-2">
              {modalImagen.fabric === 'Win' ? (
                <button
                  type="button"
                  onClick={() => {
                    handleAgregarWin(modalImagen);
                    setModalImagen(null);
                  }}
                  className="px-5 py-2.5 bg-neutral-950 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  Agregar este short al pedido (Talla L)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleAgregarClasico(modalImagen);
                    setModalImagen(null);
                  }}
                  className="px-5 py-2.5 bg-neutral-950 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  Agregar este short ({tallasClasicos[modalImagen.id] || 'M'}) al pedido
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL DE GUÍA DE TALLAS */}
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

            {/* Tallas Polistrech */}
            <div className="pt-3">
              <span className="text-[11px] font-extrabold uppercase text-neutral-500 tracking-wider block mb-1">
                Shorts Clásicos (Tela Polistrech)
              </span>
              <div className="py-1 text-xs text-neutral-600 space-y-1.5">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="font-bold text-neutral-950">XS</span>
                  <span className="font-semibold text-neutral-700">Talla 36</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="font-bold text-neutral-950">S</span>
                  <span className="font-semibold text-neutral-700">Talla 38</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="font-bold text-neutral-950">M</span>
                  <span className="font-semibold text-neutral-700">Talla 40</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="font-bold text-neutral-950">L</span>
                  <span className="font-semibold text-neutral-700">Talla 42</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-bold text-neutral-950">XL</span>
                  <span className="font-semibold text-neutral-700">Talla 44</span>
                </div>
              </div>
            </div>

            {/* Nota sobre Shorts de Equipos Win */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950">
              <strong className="block font-bold">⚽ Shorts de Equipos (Tela Win):</strong>
              <p className="mt-0.5 text-blue-800">
                Todos los modelos de equipos vienen en <strong>talla estándar L</strong> con pretina elástica y cordón ajustable para un calce cómodo.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalTallas(false)}
              className="mt-4 w-full py-2.5 bg-neutral-950 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* 10. PIE DE PÁGINA LIMPIO */}
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
