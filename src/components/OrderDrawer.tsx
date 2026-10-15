import React, { useState } from 'react';
import { OrderItem } from '../types';
import { generateWhatsAppMessage, getWhatsAppUrl, POOLSTORE_PHONE_DISPLAY } from '../utils/whatsapp';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageSquare, Copy, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const message = generateWhatsAppMessage(items);
  const whatsappUrl = getWhatsAppUrl(message);

  if (!isOpen) return null;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-neutral-200 animate-in slide-in-from-right duration-250">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-800" />
              <div>
                <h2 className="text-base font-bold text-neutral-900">Tu Pedido PoolStore</h2>
                <p className="text-xs text-neutral-500">
                  {totalUnits === 0 
                    ? 'Sin artículos seleccionados' 
                    : `${totalUnits} ${totalUnits === 1 ? 'short seleccionado' : 'shorts seleccionados'}`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Cerrar pedido"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-neutral-800">Tu pedido aún está vacío</h3>
                <p className="text-xs text-neutral-500 max-w-xs mt-1 leading-relaxed">
                  Elige tus colores favoritos del catálogo, selecciona tu talla (XS, S, M, L o XL) y agrégalos a tu lista.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Explorar catálogo de shorts
                </button>
              </div>
            ) : (
              <>
                {/* List of items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-500 pb-1">
                    <span>Modelos seleccionados ({items.length})</span>
                    <button
                      type="button"
                      onClick={onClearOrder}
                      className="text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      Vaciar lista
                    </button>
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors"
                    >
                      {/* Short thumbnail */}
                      <div className="w-16 h-14 bg-neutral-50 rounded-lg border border-neutral-100 overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain p-1"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-neutral-900 truncate capitalize">
                          {item.product.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded">
                            Talla: {item.size}
                          </span>
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
                          aria-label="Restar 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-neutral-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
                          aria-label="Sumar 1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Eliminar short del pedido"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* WhatsApp Message Preview Section */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-neutral-600 mb-1.5">
                    <span className="font-semibold flex items-center gap-1.5 text-neutral-800">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      Mensaje preparado para WhatsApp:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="text-[11px] text-neutral-500 hover:text-neutral-900 font-medium flex items-center gap-1"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 text-xs text-neutral-700 whitespace-pre-line font-mono font-normal leading-relaxed">
                    {message}
                  </div>
                </div>

                {/* Trust info */}
                <div className="flex items-start gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-[11px] text-neutral-500 leading-normal">
                  <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-700">Atención directa sin intermediarios</p>
                    <p className="mt-0.5">
                      No solicitamos registro ni pagos online. PoolStore ({POOLSTORE_PHONE_DISPLAY}) confirmará disponibilidad y precio directamente por WhatsApp.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer with Main WhatsApp CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-white space-y-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSendWhatsApp}
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {/* SVG WhatsApp Official Icon */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Enviar pedido por WhatsApp</span>
              </a>

              <p className="text-[11px] text-neutral-400 text-center">
                Se enviará a +51 903 566 655 con el resumen de tu pedido.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
