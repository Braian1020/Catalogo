import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Producto, Talla, TALLAS_DISPONIBLES } from '../types';
import { getProductSlug, COLOR_HEX_MAP } from '../data/productos';
import { useCart } from '../context/CartContext';
import { Eye, Sparkles, Tag, ChevronRight, ShoppingBag, Check } from 'lucide-react';

interface ProductCardItemProps {
  producto: Producto;
  priority?: boolean;
}

export default function ProductCardItem({ producto, priority = false }: ProductCardItemProps) {
  const { agregarAlCarrito } = useCart();
  const slug = getProductSlug(producto);
  const isWin = producto.tipoTela === 'win';
  const colorConfig = COLOR_HEX_MAP[producto.colorShort] || { bg: '#475569', text: '#ffffff' };

  // Talla inicial válida
  const primeraTalla = (
    producto.tallasDisponibles.includes('M')
      ? 'M'
      : producto.tallasDisponibles[0] || 'M'
  ) as Talla;

  const [tallaSeleccionada, setTallaSeleccionada] = useState<Talla>(primeraTalla);
  const [agregadoReciente, setAgregadoReciente] = useState<boolean>(false);

  const handleAgregarAlPedido = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    agregarAlCarrito(producto, tallaSeleccionada, 1);
    setAgregadoReciente(true);
    setTimeout(() => setAgregadoReciente(false), 1400);
  };

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* 1. Image Container */}
      <Link
        to={`/producto/${slug}`}
        className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-3 cursor-pointer"
        title={`Ver ficha completa de ${producto.nombre}`}
      >
        <img
          src={producto.imagen}
          alt={producto.nombre}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges on Image */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span
            className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md shadow-xs ${
              isWin ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
            }`}
          >
            {isWin ? 'Deportivo Win' : 'Clásico'}
          </span>
          {producto.destacado && (
            <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Top</span>
            </span>
          )}
        </div>

        {/* Hover Cue */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-slate-700" />
            <span>Ver ficha</span>
          </span>
        </div>
      </Link>

      {/* 2. Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1">
          {/* Category / Material Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            {!isWin && (
              <span
                className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0"
                style={{ backgroundColor: colorConfig.bg }}
                title={`Color principal: ${producto.colorShort}`}
              />
            )}
            <span className="truncate">
              {isWin ? 'Tela Win transpirable' : `Color ${producto.colorShort}${producto.colorRayas ? ` · Rayas ${producto.colorRayas}` : ''}`}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/producto/${slug}`}
            className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 block leading-snug"
          >
            {producto.nombre}
          </Link>
        </div>

        {/* Selector de Tallas Rápido */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Talla:</span>
            <span className="text-[10px] text-slate-400">
              {producto.tallasDisponibles.length} disponibles
            </span>
          </div>
          <div className="flex items-center gap-1">
            {TALLAS_DISPONIBLES.map((t) => {
              const disponible = producto.tallasDisponibles.includes(t);
              const seleccionada = tallaSeleccionada === t;
              return (
                <button
                  key={t}
                  type="button"
                  disabled={!disponible}
                  onClick={(e) => {
                    e.preventDefault();
                    if (disponible) setTallaSeleccionada(t);
                  }}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all text-center ${
                    !disponible
                      ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400'
                      : seleccionada
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title={disponible ? `Talla ${t}` : `Talla ${t} agotada`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-slate-950">
                S/ {producto.precio}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">c/u</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              3 x S/ 69
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAgregarAlPedido}
              className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-xs ${
                agregadoReciente
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {agregadoReciente ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Agregado ({tallaSeleccionada})!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Agregar ({tallaSeleccionada})</span>
                </>
              )}
            </button>

            <Link
              to={`/producto/${slug}`}
              className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Ver ficha individual"
              aria-label={`Ver ficha individual de ${producto.nombre}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
