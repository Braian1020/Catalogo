import React from 'react';
import { Link } from 'react-router-dom';
import { Producto } from '../types';
import { getProductSlug, COLOR_HEX_MAP } from '../data/productos';
import { Eye, Sparkles, Tag, ChevronRight } from 'lucide-react';

interface ProductCardItemProps {
  producto: Producto;
  priority?: boolean;
}

export default function ProductCardItem({ producto, priority = false }: ProductCardItemProps) {
  const slug = getProductSlug(producto);
  const isWin = producto.tipoTela === 'win';
  const colorConfig = COLOR_HEX_MAP[producto.colorShort] || { bg: '#475569', text: '#ffffff' };

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* 1. Image Container */}
      <Link
        to={`/producto/${slug}`}
        className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-3 cursor-pointer"
        title={`Ver detalle de ${producto.nombre}`}
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
              isWin
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-white'
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
            <span>Ver producto</span>
          </span>
        </div>
      </Link>

      {/* 2. Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category / Material Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mb-1">
            {!isWin && (
              <span
                className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0"
                style={{ backgroundColor: colorConfig.bg }}
                title={`Color principal: ${producto.colorShort}`}
              />
            )}
            <span className="truncate">
              {isWin ? 'Tela Win transpirable' : `Color ${producto.colorShort}`}
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

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-950">
                S/ {producto.precio}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">c/u</span>
            </div>
            <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>3 por S/ 69 (S/ 23 c/u)</span>
            </p>
          </div>

          <Link
            to={`/producto/${slug}`}
            className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-xl transition-all duration-200 cursor-pointer shrink-0"
            title="Ver detalles"
            aria-label={`Ver detalles de ${producto.nombre}`}
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
