import { ItemCarrito } from '../types';

export const POLESTORE_WHATSAPP_NUMBER = '51903566655';
export const POLESTORE_PHONE_DISPLAY = '+51 903 566 655';

export interface OpcionesMensajePedido {
  items: ItemCarrito[];
  total: number;
  subtotalPrendas?: number;
  ahorroTotal?: number;
  costoEnvio?: number;
  precioUnitarioPoliester?: number;
  precioUnitarioWin?: number;
  modalidadEntrega?: 'domicilio' | 'punto_centrico' | 'shalom';
  direccionEntrega?: string;
  referenciaEntrega?: string;
  puntoCentrico?: string;
  destinoShalom?: string;
  metodoPago?: 'contraentrega' | 'yape';
}

/**
 * Genera un mensaje tipo comprobante de compra, limpio, compacto y profesional
 * para enviar directamente a WhatsApp sin URLs largas ni caracteres dañados.
 */
export function generarMensajeWhatsApp(
  itemsOrOptions: ItemCarrito[] | OpcionesMensajePedido,
  totalParam?: number,
  precioPoliesterParam?: number,
  precioWinParam?: number,
  detallesEntregaParam?: string
): string {
  // Soporte para llamada con objeto de opciones o parámetros posicionales
  let items: ItemCarrito[];
  let total: number;
  let subtotalPrendas: number | undefined;
  let ahorroTotal: number | undefined;
  let costoEnvio: number | undefined;
  let precioUnitarioPoliester: number;
  let precioUnitarioWin: number;
  let modalidadEntrega: 'domicilio' | 'punto_centrico' | 'shalom' = 'domicilio';
  let direccionEntrega = '';
  let referenciaEntrega = '';
  let puntoCentrico = 'Plaza Cívica';
  let destinoShalom = '';
  let metodoPago: 'contraentrega' | 'yape' = 'contraentrega';
  let detallesRaw = '';

  if (Array.isArray(itemsOrOptions)) {
    items = itemsOrOptions;
    total = totalParam || 0;
    precioUnitarioPoliester = precioPoliesterParam || 15.0;
    precioUnitarioWin = precioWinParam || 25.0;
    detallesRaw = detallesEntregaParam || '';
  } else {
    items = itemsOrOptions.items;
    total = itemsOrOptions.total;
    subtotalPrendas = itemsOrOptions.subtotalPrendas;
    ahorroTotal = itemsOrOptions.ahorroTotal;
    costoEnvio = itemsOrOptions.costoEnvio;
    precioUnitarioPoliester = itemsOrOptions.precioUnitarioPoliester || 15.0;
    precioUnitarioWin = itemsOrOptions.precioUnitarioWin || 25.0;
    modalidadEntrega = itemsOrOptions.modalidadEntrega || 'domicilio';
    direccionEntrega = itemsOrOptions.direccionEntrega || '';
    referenciaEntrega = itemsOrOptions.referenciaEntrega || '';
    puntoCentrico = itemsOrOptions.puntoCentrico || 'Plaza Cívica';
    destinoShalom = itemsOrOptions.destinoShalom || '';
    metodoPago = itemsOrOptions.metodoPago || 'contraentrega';
  }

  if (!items || items.length === 0) {
    return 'Hola Pool Store 👋, deseo consultar sobre los productos de su catálogo virtual.';
  }

  const itemsPoliester = items.filter((it) => it.producto.tipoTela === 'poliester');
  const itemsWin = items.filter((it) => it.producto.tipoTela === 'win');
  const totalPoliester = itemsPoliester.reduce((acc, it) => acc + it.cantidad, 0);
  const totalWin = itemsWin.reduce((acc, it) => acc + it.cantidad, 0);
  const totalPrendas = items.reduce((acc, it) => acc + it.cantidad, 0);

  // Precios calculados si no vinieron explícitos
  const winUnit =
    precioUnitarioWin || (totalWin >= 12 ? 20.0 : totalWin >= 3 ? 23.0 : 25.0);
  const poliesterUnit =
    precioUnitarioPoliester || (totalPoliester >= 12 ? 12.0 : totalPoliester >= 6 ? 13.5 : 15.0);

  // Cálculo de subtotales si no se pasaron
  let subtotalCalculado = 0;
  let regularCalculado = 0;
  items.forEach((it) => {
    const isWin = it.producto.tipoTela === 'win';
    const unit = isWin ? winUnit : poliesterUnit;
    const regular = isWin ? 25.0 : 15.0;
    subtotalCalculado += unit * it.cantidad;
    regularCalculado += regular * it.cantidad;
  });

  const subtotalFinal = subtotalPrendas !== undefined ? subtotalPrendas : subtotalCalculado;
  const ahorroFinal =
    ahorroTotal !== undefined ? ahorroTotal : Math.max(0, regularCalculado - subtotalCalculado);
  const envioFinal = costoEnvio !== undefined ? costoEnvio : Math.max(0, total - subtotalFinal);

  // 1. Encabezado
  const lines: string[] = [
    '🛍️ *NUEVO PEDIDO | POOL STORE*',
    '────────────────────────────',
    '',
    '📦 *DETALLE DE PRODUCTOS:*',
  ];

  // 2. Lista numerada de productos (sin URLs de fotos para mantenerlo compacto y limpio)
  items.forEach((item, index) => {
    const num = index + 1;
    const p = item.producto;
    const isWin = p.tipoTela === 'win';
    const unitPrice = isWin ? winUnit : poliesterUnit;
    const itemSubtotal = unitPrice * item.cantidad;

    lines.push(`*[${num}] ${p.nombre}*`);

    if (isWin) {
      lines.push(`• Modelo: ${p.modelo} (Tela Win)`);
    } else {
      lines.push(`• Color: ${p.colorShort}${p.colorRayas ? ` | Rayas: ${p.colorRayas}` : ''}`);
    }

    lines.push(`• Talla: *${item.talla}* | Cantidad: *${item.cantidad}*`);
    lines.push(
      `• Precio: S/ ${unitPrice.toFixed(2)} c/u | Subtotal: *S/ ${itemSubtotal.toFixed(2)}*`
    );
    lines.push('');
  });

  // 3. Resumen de compra
  lines.push('────────────────────────────');
  lines.push('📋 *RESUMEN DE COMPRA:*');
  lines.push(`• Total de prendas: *${totalPrendas}*`);
  lines.push(`• Subtotal prendas: S/ ${subtotalFinal.toFixed(2)}`);

  // Descuentos promocionales aplicados
  if (totalPoliester >= 12) {
    lines.push('• Promo Clásicos: *Docena S/ 12.00 c/u*');
  } else if (totalPoliester >= 6) {
    lines.push('• Promo Clásicos: *Desde 6 uds. S/ 13.50 c/u*');
  }

  if (totalWin >= 12) {
    lines.push('• Promo Win: *Docena 12 x S/ 240 (S/ 20 c/u)*');
  } else if (totalWin >= 3) {
    lines.push('• Promo Win: *3 x S/ 69 (S/ 23 c/u)*');
  }

  if (ahorroFinal > 0) {
    lines.push(`• Descuento aplicado: *-S/ ${ahorroFinal.toFixed(2)}*`);
  }

  const textoDelivery =
    envioFinal === 0
      ? 'S/ 0.00 (Gratis)'
      : `S/ ${envioFinal.toFixed(2)}`;
  lines.push(`• Costo de envío: ${textoDelivery}`);

  lines.push('────────────────────────────');
  lines.push(`💰 *TOTAL GENERAL A PAGAR: S/ ${total.toFixed(2)}*`);
  lines.push('────────────────────────────');
  lines.push('');

  // 4. Datos de Entrega y Pago
  if (detallesRaw) {
    // Si vino texto preformateado, limpiamos caracteres extraños y lo anexamos
    lines.push(detallesRaw.trim());
  } else {
    lines.push('📍 *ENTREGA:*');
    if (modalidadEntrega === 'domicilio') {
      lines.push('• Modalidad: A Domicilio (Contraentrega)');
      if (direccionEntrega.trim()) {
        lines.push(`• Dirección: ${direccionEntrega.trim()}`);
      } else {
        lines.push('• Dirección: (Coordinar por chat)');
      }
      if (referenciaEntrega.trim()) {
        lines.push(`• Referencia: ${referenciaEntrega.trim()}`);
      }
    } else if (modalidadEntrega === 'punto_centrico') {
      lines.push('• Modalidad: Punto Céntrico (Gratis S/ 0)');
      lines.push(`• Punto de encuentro: ${puntoCentrico}`);
    } else {
      lines.push('• Modalidad: Envío Shalom (Provincias)');
      lines.push(`• Destino: ${destinoShalom.trim() || 'A coordinar por chat'}`);
      lines.push('• Flete: Pago en destino Shalom');
    }

    lines.push('');
    lines.push('💳 *FORMA DE PAGO:*');
    if (metodoPago === 'yape') {
      lines.push('• Método: Yape al 903566655 (Pool Store)');
    } else {
      lines.push('• Método: Contraentrega al recibir');
    }
  }

  lines.push('');
  lines.push('¿Me confirmas disponibilidad para despachar mi pedido?');

  return lines.join('\n');
}

/**
 * Codifica el mensaje de forma segura aplicando encodeURIComponent exactamente una sola vez
 */
export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${POLESTORE_WHATSAPP_NUMBER}?text=${encoded}`;
}

// Backward compatibility exports
export const POOLSTORE_WHATSAPP_NUMBER = POLESTORE_WHATSAPP_NUMBER;
export const POOLSTORE_PHONE_DISPLAY = POLESTORE_PHONE_DISPLAY;

export function generateWhatsAppMessage(items: any[]): string {
  if (!items || items.length === 0) {
    return 'Hola Pool Store 👋, deseo consultar sobre los shorts deportivos de su catálogo.';
  }

  return generarMensajeWhatsApp({
    items,
    total: 0,
  });
}
