import React, { useState } from 'react';
import { ShortProduct, Size, SIZES } from '../types';
import { Plus, Check, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: ShortProduct;
  onOpenDetails: (product: ShortProduct) => void;
  onAddToCart: (product: ShortProduct, size: Size, quantity: number) => void;
  itemsInCartCount: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onAddToCart,
  itemsInCartCount,
}) => {
  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="group bg-white rounded-xl border border-neutral-200 hover:border-neutral-400 transition-all duration-200 flex flex-col overflow-hidden shadow-xs hover:shadow-md">
      {/* Product Image Container */}
      <div 
        className="relative aspect-[3/2] w-full bg-neutral-50 overflow-hidden cursor-pointer flex items-center justify-center p-3"
        onClick={() => onOpenDetails(product)}
      >
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Subtle click cue */}
        <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 text-neutral-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-neutral-600" />
            Ver detalle
          </span>
        </div>

        {/* Items in cart indicator if already added */}
        {itemsInCartCount > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-neutral-900 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>{itemsInCartCount} en pedido</span>
          </div>
        )}
      </div>

      {/* Product Information & Size Controls */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <button 
            type="button"
            onClick={() => onOpenDetails(product)}
            className="text-left group/title focus:outline-hidden w-full"
          >
            <h3 className="text-base font-bold text-neutral-900 leading-snug group-hover/title:text-neutral-600 transition-colors capitalize">
              {product.title}
            </h3>
          </button>
          <p className="text-xs text-neutral-500 mt-0.5 font-normal">
            Short deportivo con cordón ajustable
          </p>
        </div>

        {/* Size Selection Grid */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
            <span className="font-semibold text-neutral-800">Talla:</span>
            <span className="text-[11px] text-neutral-400">Selecciona una</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {SIZES.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`py-1.5 text-xs font-bold rounded-md transition-all duration-150 border ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs scale-[1.02]'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
                  }`}
                  aria-label={`Talla ${size}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions Strip */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs active:scale-[0.99]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Agregado ({selectedSize})!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Agregar talla {selectedSize}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onOpenDetails(product)}
            className="p-2.5 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-600 rounded-lg transition-colors"
            title="Ver imagen completa"
            aria-label="Ver imagen completa"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
