import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Producto, Talla, TALLAS_DISPONIBLES } from '../types';
import { getProductSlug } from '../data/productos';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Check, ChevronRight } from 'lucide-react';

interface ProductCardItemProps {
  producto: Producto;
  priority?: boolean;
}

export default function ProductCardItem({ producto, priority = false }: ProductCardItemProps) {
  const { agregarAlCarrito } = useCart();
  const slug = getProductSlug(producto);
  const isWin = producto.tipoTela === 'win';
  const precio = isWin ? 25 : 15;

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
    <article className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
      {/* 1. Contenedor de Imagen: con margen, sin recortar y detallado */}
      <Link
        to={`/producto/${slug}`}
        className="relative aspect-square w-full bg-slate-50 flex items-center justify-center p-3.5 sm:p-5 overflow-hidden cursor-pointer"
        title={`Ver ficha de ${producto.nombre}`}
      >
        <img
          src={producto.imagen}
          alt={producto.nombre}
          loading={priority ? 'eager' : 'lazy'}
          className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* 2. Información limpia y directa */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        {/* Título limpio */}
        <div>
          <Link
            to={`/producto/${slug}`}
            className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 block leading-snug"
          >
            {producto.nombre}
          </Link>
        </div>

        {/* Selector de Tallas Rápido */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Talla:</span>
            <span className="text-[10px] text-slate-400 font-medium">
              {tallaSeleccionada}
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
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all text-center cursor-pointer ${
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

        {/* Precio y Botón de Acción */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-slate-950">
                S/ {precio}.00
              </span>
              <span className="text-[10px] text-slate-400 font-medium">c/u</span>
            </div>
            {isWin && (
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">
                3 x S/ 69
              </span>
            )}
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
                  <span>¡Listo ({tallaSeleccionada})!</span>
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
              className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer shrink-0"
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
