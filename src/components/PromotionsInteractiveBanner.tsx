import React, { useState } from 'react';
import {
  Truck,
  Flame,
  Star,
  Award,
} from 'lucide-react';

interface PromotionsInteractiveBannerProps {
  tipo: 'clasicos' | 'deportivos' | 'todos';
  className?: string;
}

export default function PromotionsInteractiveBanner({
  tipo,
  className = '',
}: PromotionsInteractiveBannerProps) {
  // Pestaña activa si está en modo "todos"
  const [subTipo, setSubTipo] = useState<'clasicos' | 'deportivos'>(
    tipo === 'deportivos' ? 'deportivos' : 'clasicos'
  );

  const modoActivo = tipo === 'todos' ? subTipo : tipo;
  const isWin = modoActivo === 'deportivos';

  return (
    <section
      aria-label="Promociones y descuentos por cantidad"
      className={`rounded-3xl border border-slate-200 overflow-hidden shadow-md bg-white ${className}`}
    >
      {/* 1. ENCABEZADO LLAMATIVO CON GRADIENTE */}
      <div
        className={`p-6 sm:p-7 text-white transition-colors duration-300 ${
          isWin
            ? 'bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950'
            : 'bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-xs bg-white/10 backdrop-blur-xs border-white/20">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Promociones por Cantidad</span>
              <span className="text-white/40">·</span>
              <span className="text-emerald-300 font-extrabold">¡Combina colores y tallas!</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isWin ? 'Shorts Deportivos Tela Win' : 'Shorts Clásicos Polistrech'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              {isWin
                ? 'Confeccionados en tela Win deportiva microperforada, ligera y de secado rápido. ¡Ahorra llevando varios clubes y selecciones!'
                : 'Confeccionados en tela Polistrech suave, elástica y fresca con bolsillos reforzados con cierre. ¡Ahorra llevando por media docena o docena!'}
            </p>
          </div>

          {/* Selector de pestañas solo si estamos en modo general 'todos' */}
          {tipo === 'todos' && (
            <div className="flex items-center gap-2 p-1.5 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setSubTipo('clasicos')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  subTipo === 'clasicos'
                    ? 'bg-white text-slate-950 shadow-md scale-102'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Clásicos (S/ 15 c/u)
              </button>
              <button
                type="button"
                onClick={() => setSubTipo('deportivos')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  subTipo === 'deportivos'
                    ? 'bg-blue-600 text-white shadow-md scale-102'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Deportivos (S/ 25 c/u)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. TARJETAS DE NIVELES DE DESCUENTO (VISIBLES, ENTENDIBLES Y LLAMATIVAS) */}
      <div className="p-5 sm:p-6 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* TIER 1: INDIVIDUAL */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  1 Unidad
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Individual</span>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-950">
                  S/ {isWin ? '25.00' : '15.00'}
                </span>
                <span className="text-xs text-slate-500 ml-1 font-medium">por prenda</span>
              </div>

              <p className="text-xs text-slate-600 leading-normal">
                {isWin
                  ? 'Precio normal para probar tu modelo de club favorito.'
                  : 'Precio regular por unidad en cualquier color de short.'}
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
              <span>Delivery coordinado por WhatsApp</span>
            </div>
          </div>

          {/* TIER 2: PACK MÁS POPULAR */}
          <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/70 shadow-sm flex flex-col justify-between relative overflow-hidden">
            {/* Cinta Más Popular */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-xs">
              <Star className="w-3 h-3 fill-current" />
              <span>MÁS POPULAR</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                  {isWin ? 'Tripack (3 prendas)' : 'Media Docena (6)'}
                </span>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-black text-emerald-950">
                  S/ {isWin ? '69.00' : '81.00'}
                </span>
                <div className="text-xs font-black text-emerald-700 mt-0.5">
                  {isWin ? 'S/ 23.00 c/u' : 'S/ 13.50 c/u'}
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-emerald-200/90 text-[10px] font-extrabold text-emerald-950">
                    Ahorras S/ {isWin ? '6.00' : '9.00'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-900/80 leading-normal">
                {isWin
                  ? 'Combina 3 clubes o selecciones a precio rebajado.'
                  : 'Combina 6 colores o rayas distintas para toda la semana.'}
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-emerald-200/60 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>¡Incluye Delivery GRATIS en Chiclayo!</span>
            </div>
          </div>

          {/* TIER 3: DOCENA / MAYOR AHORRO */}
          <div className="p-4 sm:p-5 rounded-2xl border-2 border-amber-500 bg-amber-50/70 shadow-sm flex flex-col justify-between relative overflow-hidden">
            {/* Cinta Mejor Precio */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black shadow-xs">
              <Award className="w-3 h-3" />
              <span>MEJOR PRECIO</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md">
                  Docena (12 prendas)
                </span>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-black text-amber-950">
                  S/ {isWin ? '240.00' : '144.00'}
                </span>
                <div className="text-xs font-black text-amber-800 mt-0.5">
                  {isWin ? 'S/ 20.00 c/u' : 'S/ 12.00 c/u'}
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-amber-200 text-[10px] font-extrabold text-amber-950">
                    Ahorras S/ {isWin ? '60.00' : '36.00'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-amber-900/80 leading-normal">
                {isWin
                  ? 'Precio mayorista de S/ 20 por short para equipos o reventa.'
                  : 'Precio mayorista de S/ 12 por short. ¡20% de descuento directo!'}
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-amber-200/60 text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>¡Delivery GRATIS + Ahorro Máximo!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { PromotionsInteractiveBanner };
