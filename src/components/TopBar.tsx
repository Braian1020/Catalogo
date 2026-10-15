import React from 'react';
import { ShoppingBag, Ruler } from 'lucide-react';

interface TopBarProps {
  totalItemsInCart: number;
  onOpenOrder: () => void;
  onOpenSizeGuide: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  totalItemsInCart,
  onOpenOrder,
  onOpenSizeGuide,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="/" 
          className="text-xl font-extrabold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-1.5"
        >
          <span className="tracking-widest uppercase font-black text-neutral-900">POOLSTORE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
        </a>

        {/* Zone 2: Concise single-line text navigation links (No WhatsApp here as requested) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <a 
            href="#catalogo" 
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            Catálogo
          </a>
          <button 
            type="button"
            onClick={onOpenSizeGuide}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Ruler className="w-3.5 h-3.5 text-neutral-400" />
            <span>Guía de Tallas</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenOrder}
            className="px-3.5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 shadow-xs whitespace-nowrap shrink-0"
            aria-label="Abrir pedido"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mi Pedido</span>
            {totalItemsInCart > 0 && (
              <span className="bg-white text-neutral-900 text-[11px] font-extrabold px-1.5 py-0.2 rounded-full tabular-nums">
                {totalItemsInCart}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
