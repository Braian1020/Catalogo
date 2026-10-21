import { ItemCarrito } from '../types';

export const POLESTORE_WHATSAPP_NUMBER = '51903566655';
export const POLESTORE_PHONE_DISPLAY = '+51 903 566 655';

/**
 * Genera el mensaje estructurado de WhatsApp con todos los detalles requeridos:
 * - Producto
 * - Modelo
 * - Color
 * - Color de rayas
 * - Talla
 * - Cantidad
 * - Precio
 * - Subtotal
 * - Total general
 * - Enlaces directos a las fotografías seleccionadas
 */
export function generarMensajeWhatsApp(
  items: ItemCarrito[],
  total: number,
  baseUrl: string = typeof window !== 'undefined' ? window.location.origin : ''
): string {
  if (items.length === 0) {
    return 'Hola POLESTORE 👋, deseo consultar sobre los productos de su catálogo web.';
  }

  const header = 'Hola POLESTORE 👋\nQuiero realizar el siguiente pedido desde la web:\n\n';

  const itemsText = items
    .map((item) => {
      const p = item.producto;
      const subtotal = p.precio * item.cantidad;
      const urlFoto = p.imagen.startsWith('http')
        ? p.imagen
        : baseUrl
        ? `${baseUrl}${p.imagen}`
        : p.imagen;

      return [
        `🩳 *${p.nombre}*`,
        `• Modelo: ${p.modelo}`,
        `• Color: ${p.colorShort}`,
        `• Color de rayas: ${p.colorRayas}`,
        `• Talla: ${item.talla}`,
        `• Cantidad: ${item.cantidad}`,
        `• Precio unitario: S/ ${p.precio.toFixed(2)}`,
        `• Subtotal: S/ ${subtotal.toFixed(2)}`,
        `• Foto: ${urlFoto}`,
      ].join('\n');
    })
    .join('\n\n');

  const totalPrendas = items.reduce((acc, it) => acc + it.cantidad, 0);

  const footer = `\n\n══════════════════════\n📦 *Total de productos:* ${totalPrendas}\n💰 *TOTAL GENERAL: S/ ${total.toFixed(2)}*\n\n¿Me confirmas la disponibilidad y coordinamos la entrega?`;

  return `${header}${itemsText}${footer}`;
}

export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${POLESTORE_WHATSAPP_NUMBER}?text=${encoded}`;
}

// Backward compatibility exports
export const POOLSTORE_WHATSAPP_NUMBER = POLESTORE_WHATSAPP_NUMBER;
export const POOLSTORE_PHONE_DISPLAY = POLESTORE_PHONE_DISPLAY;

export function generateWhatsAppMessage(items: any[]): string {
  if (!items || items.length === 0) {
    return 'Hola POLESTORE 👋, deseo consultar sobre los shorts deportivos de su catálogo.';
  }

  const header = 'Hola POLESTORE 👋, quiero realizar el siguiente pedido:\n\n';
  const itemsText = items
    .map((item) => {
      const prod = item.product || item.producto;
      const title = prod?.title || prod?.nombre || 'Short deportivo';
      const size = item.size || item.talla || 'L';
      const qty = item.quantity || item.cantidad || 1;
      return `🩳 ${title}\nTalla: ${size}\nCantidad: ${qty}`;
    })
    .join('\n\n');

  return `${header}${itemsText}\n\n¿Me confirmas la disponibilidad y el precio?`;
}
