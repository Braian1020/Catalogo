import React, { useState, useEffect } from 'react';
import { ShortProduct, Size, SIZES, SIZE_CONFIG } from '../types';
import { X, ChevronLeft, ChevronRight, Plus, Minus, Check, ShoppingBag } from 'lucide-react';

interface ProductModalProps {
  product: ShortProduct | null;
  onClose: () => void;
  onAddToCart: (product: ShortProduct, size: Size, quantity: number) => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalProducts: number;
  currentInCart: number;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onNext,
  onPrev,
  currentIndex,
  totalProducts,
  currentInCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const [showAddedNotice, setShowAddedNotice] = useState<boolean>(false);

  useEffect(() => {
    setQuantity(1);
    setShowAddedNotice(false);
  }, [product?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setShowAddedNotice(true);
    setTimeout(() => setShowAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog */}
      <div 
        className="relative bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl border border-neutral-200 flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-800">Modelo {currentIndex + 1} de {totalProducts}</span>
            <span>·</span>
            <span className="capitalize">{product.colorDescription}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Prev / Next arrows */}
            <div className="flex items-center gap-1 border border-neutral-200 rounded-lg p-0.5">
              <button
                type="button"
                onClick={onPrev}
                className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                title="Anterior"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNext}
                className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                title="Siguiente"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Clean Full Image Container (7 cols) */}
          <div className="md:col-span-7 flex flex-col">
            <div className="relative w-full aspect-[3/2] bg-neutral-50 rounded-xl overflow-hidden border border-neutral-200 flex items-center justify-center p-3">
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right Column: Short details, Size & Add controls (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                Short Deportivo PoolStore
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1 capitalize leading-tight">
                {product.title}
              </h2>

              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Confección de alta resistencia, material transpirable de secado rápido, pretina elástica reforzada con pasador de ajuste y franjas deportivas.
              </p>

              {/* Size Selector */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-neutral-800">Elige tu talla:</span>
                  <span className="text-neutral-500 font-medium">
                    {SIZE_CONFIG[selectedSize].numericSize}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {SIZES.map((size) => {
                    const isSelected = selectedSize === size;
                    const config = SIZE_CONFIG[size];
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm scale-[1.03]'
                            : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-100'
                        }`}
                      >
                        <span className="text-sm font-bold">{size}</span>
                        <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}>
                          {config.waist}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-5">
                <label className="block text-xs font-bold text-neutral-800 mb-2">
                  Cantidad:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2.5 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-sm text-neutral-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2.5 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {quantity === 1 ? '1 unidad' : `${quantity} unidades`}
                  </span>
                </div>
              </div>

              {/* Status in cart message */}
              {currentInCart > 0 && (
                <div className="mt-4 p-2.5 bg-neutral-100 rounded-lg text-xs text-neutral-700 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tienes {currentInCart} {currentInCart === 1 ? 'unidad' : 'unidades'} de este modelo en tu pedido.</span>
                </div>
              )}
            </div>

            {/* Actions Button */}
            <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleAdd}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
                  showAddedNotice
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                }`}
              >
                {showAddedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Agregado al pedido ({quantity}x Talla {selectedSize})!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Agregar al pedido · Talla {selectedSize} ({quantity})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors text-center"
              >
                Seguir explorando el catálogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
