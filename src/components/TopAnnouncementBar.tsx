import React from 'react';

export interface TopAnnouncementBarProps {
  /**
   * Mensaje principal a mostrar de forma continua.
   * Por defecto: '🚚 Delivery gratis a partir de 3 prendas'
   */
  message?: string;
  /**
   * Texto complementario o ciudad de cobertura opcional.
   */
  submessage?: string;
  /**
   * Clases adicionales para personalizar el contenedor.
   */
  className?: string;
  /**
   * Si está posicionado de forma fija en la parte superior. Por defecto: true.
   */
  isFixed?: boolean;
}

/**
 * Componente de banner superior con texto animado continuo (marquee).
 * Muestra el aviso de delivery gratis posicionado de forma fija en la parte superior.
 */
export default function TopAnnouncementBar({
  message = '🚚 Delivery gratis a partir de 3 prendas',
  submessage = 'Chiclayo y Zonas Cercanas',
  className = '',
  isFixed = true,
}: TopAnnouncementBarProps) {
  // Generamos un bloque de elementos repetidos para garantizar un desplazamiento
  // continuo y sin cortes tanto en pantallas móviles como en monitores ultra-wide.
  const items = Array.from({ length: 8 });

  return (
    <aside
      role="region"
      aria-label="Aviso de promociones y envíos de POOL STORE"
      className={`w-full overflow-hidden bg-slate-950 text-white border-b border-slate-800/90 select-none shadow-xs transition-all ${
        isFixed ? 'fixed top-0 left-0 right-0 z-50' : 'relative z-30'
      } ${className}`}
    >
      <div className="h-8 sm:h-9 flex items-center overflow-hidden">
        {/* Pista animada continua usando la clase @keyframes marquee */}
        <div
          className="flex w-max animate-marquee items-center will-change-transform"
          style={{ animationDuration: '22s' }}
        >
          {/* Primer bloque para el ciclo continuo */}
          {items.map((_, i) => (
            <div
              key={`bar-item-a-${i}`}
              className="inline-flex items-center gap-2 sm:gap-2.5 mx-4 sm:mx-6 whitespace-nowrap text-[11px] sm:text-xs font-bold tracking-tight text-slate-100"
            >
              <span className="text-white drop-shadow-2xs">{message}</span>
              {submessage && (
                <>
                  <span className="text-slate-600 font-normal">·</span>
                  <span className="text-emerald-400 font-extrabold tracking-wide uppercase text-[10px] sm:text-[11px]">
                    {submessage}
                  </span>
                </>
              )}
              <span className="text-slate-600 font-normal">·</span>
            </div>
          ))}

          {/* Segundo bloque gemelo para lograr un bucle infinito 100% fluido al 50% de desplazamiento */}
          {items.map((_, i) => (
            <div
              key={`bar-item-b-${i}`}
              aria-hidden="true"
              className="inline-flex items-center gap-2 sm:gap-2.5 mx-4 sm:mx-6 whitespace-nowrap text-[11px] sm:text-xs font-bold tracking-tight text-slate-100"
            >
              <span className="text-white drop-shadow-2xs">{message}</span>
              {submessage && (
                <>
                  <span className="text-slate-600 font-normal">·</span>
                  <span className="text-emerald-400 font-extrabold tracking-wide uppercase text-[10px] sm:text-[11px]">
                    {submessage}
                  </span>
                </>
              )}
              <span className="text-slate-600 font-normal">·</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export { TopAnnouncementBar };
