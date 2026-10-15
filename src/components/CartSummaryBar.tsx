import React from 'react';
import { OrderItem } from '../types';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface CartSummaryBarProps {
  items: OrderItem[];
  onOpenOrder: () => void;
}

export const CartSummaryBar: React.FC<CartSummaryBarProps> = ({ items, onOpenOrder }) => {
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  if (totalUnits === 0) return null;

  return (
    <aside 
      aria-label="Resumen de pedido" 
      className="fixed bottom-0 inset-x-0 z-40 p-2 sm:p-3 pointer-events-none"
    >
      <div className="max-w-xl mx-auto pointer-events-auto">
        <div className="bg-neutral-900 text-white rounded-xl shadow-xl px-4 py-2.5 flex items-center justify-between gap-3 border border-neutral-700/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold leading-tight truncate">
                {totalUnits} {totalUnits === 1 ? 'short seleccionado' : 'shorts seleccionados'}
              </p>
              <p className="text-[11px] text-neutral-400 truncate">
                {items.length} {items.length === 1 ? 'modelo' : 'modelos'} en tu lista
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenOrder}
            className="shrink-0 px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Ver pedido & WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
