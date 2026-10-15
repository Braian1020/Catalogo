import { OrderItem } from '../types';

export const POOLSTORE_WHATSAPP_NUMBER = '51903566655';
export const POOLSTORE_PHONE_DISPLAY = '+51 903 566 655';

/**
 * Builds the exact WhatsApp message formatted according to PoolStore's standard:
 * 
 * Hola PoolStore 👋, quiero realizar el siguiente pedido:
 * 
 * 🩳 Short negro con rayas doradas  
 * Talla: M  
 * Cantidad: 2
 * 
 * 🩳 Short plomo con rayas blancas  
 * Talla: L  
 * Cantidad: 1
 * 
 * ¿Me confirmas la disponibilidad y el precio?
 */
export function generateWhatsAppMessage(items: OrderItem[]): string {
  if (items.length === 0) {
    return 'Hola PoolStore 👋, deseo consultar sobre los shorts deportivos de su catálogo.';
  }

  const header = 'Hola PoolStore 👋, quiero realizar el siguiente pedido:\n\n';

  const itemsText = items
    .map((item) => {
      // Clean color description or title
      const shortName = item.product.title.startsWith('Short')
        ? item.product.title
        : `Short ${item.product.title}`;

      return `🩳 ${shortName}\nTalla: ${item.size}\nCantidad: ${item.quantity}`;
    })
    .join('\n\n');

  const footer = '\n\n¿Me confirmas la disponibilidad y el precio?';

  return `${header}${itemsText}${footer}`;
}

/**
 * Generates the direct WhatsApp URL for mobile and desktop web
 */
export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${POOLSTORE_WHATSAPP_NUMBER}?text=${encoded}`;
}
