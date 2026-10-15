import React from 'react';
import { X, Ruler, Check } from 'lucide-react';
import { SIZES, SIZE_CONFIG } from '../types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      
      <div 
        className="relative bg-white w-full max-w-md rounded-2xl shadow-xl border border-neutral-200 p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-neutral-800" />
            <h3 className="text-base font-bold text-neutral-900">Tabla de Tallas PoolStore</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Cerrar guía de tallas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
          Nuestros shorts deportivos cuentan con pretina elástica y pasador ajustable para un calce óptimo. Guíate con la equivalencia numérica:
        </p>

        <div className="mt-4 border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
          <div className="grid grid-cols-3 bg-neutral-50 px-4 py-2.5 text-xs font-bold text-neutral-700">
            <span>Letra</span>
            <span>Talla Numérica</span>
            <span>Cintura Aprox.</span>
          </div>

          {SIZES.map((size) => {
            const config = SIZE_CONFIG[size];
            const cintura = size === 'XS' ? '28 - 30 pulg.' : size === 'S' ? '30 - 32 pulg.' : size === 'M' ? '32 - 34 pulg.' : size === 'L' ? '34 - 36 pulg.' : '36 - 38 pulg.';
            return (
              <div key={size} className="grid grid-cols-3 px-4 py-3 text-xs items-center hover:bg-neutral-50/60 transition-colors">
                <span className="font-extrabold text-neutral-900 text-sm">{size}</span>
                <span className="font-semibold text-neutral-700">{config.numericSize} ({config.waist})</span>
                <span className="text-neutral-500 tabular-nums">{cintura}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-neutral-50 rounded-xl text-[11px] text-neutral-600 space-y-1">
          <p className="font-semibold text-neutral-800 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Ajuste anatómico deportivo
          </p>
          <p className="leading-relaxed">
            Si estás entre dos tallas, te recomendamos la talla superior para mayor holgura al entrenar, o la talla justa para ajuste ceñido.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
        >
          Entendido, volver al catálogo
        </button>
      </div>
    </div>
  );
};
