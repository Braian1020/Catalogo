import { Producto, Talla } from '../types';
import rawProductos from './productos.json';

export const PRODUCTOS: Producto[] = rawProductos as Producto[];

// Catálogo Ropa: Shorts de Poliéster (36 modelos)
export const SHORTS_POLIESTER = PRODUCTOS.filter(
  (p) => p.categoria === 'ropa' && p.subcategoria === 'shorts' && p.tipoTela === 'poliester'
);

// Catálogo Ropa: Shorts Win de Equipos (11 modelos)
export const SHORTS_WIN = PRODUCTOS.filter(
  (p) => p.categoria === 'ropa' && p.subcategoria === 'shorts' && p.tipoTela === 'win'
);

// Catálogo Tecnología: Parlantes, TV Box, Accesorios (Próximamente / Novedades)
export const PRODUCTOS_TECNOLOGIA = PRODUCTOS.filter(
  (p) => p.categoria === 'tecnologia'
);

// Lista única de colores de short disponibles en Poliéster
export const COLORES_SHORT_POLIESTER = Array.from(
  new Set(SHORTS_POLIESTER.map((s) => s.colorShort))
);

// Mapeo visual de color HEX para los cuadraditos de swatches
export const COLOR_HEX_MAP: Record<string, { bg: string; text: string; border?: string }> = {
  Negro: { bg: '#171717', text: '#ffffff' },
  'Negro Mate': { bg: '#1c1917', text: '#ffffff' },
  Azul: { bg: '#1d4ed8', text: '#ffffff' },
  'Azul Noche': { bg: '#0f172a', text: '#ffffff' },
  'Azul Marino': { bg: '#1e293b', text: '#ffffff' },
  'Azul Canarinho': { bg: '#2563eb', text: '#ffffff' },
  'Azulgrana': { bg: '#7f1d1d', text: '#ffffff' },
  Plomo: { bg: '#64748b', text: '#ffffff' },
  Blanco: { bg: '#ffffff', text: '#0f172a', border: '#cbd5e1' },
  Rojo: { bg: '#dc2626', text: '#ffffff' },
  Verde: { bg: '#15803d', text: '#ffffff' },
  'Verde Fosforescente': { bg: '#22c55e', text: '#000000' },
  Amarillo: { bg: '#eab308', text: '#000000' },
  Anaranjado: { bg: '#ea580c', text: '#ffffff' },
  Celeste: { bg: '#38bdf8', text: '#000000' },
  Rosado: { bg: '#f43f5e', text: '#ffffff' },
  Vino: { bg: '#881337', text: '#ffffff' },
  Dorado: { bg: '#d97706', text: '#ffffff' },
};

// Obtiene los colores de rayas disponibles para un color de short en Poliéster
export function getRayasPorColorShort(colorShort: string): string[] {
  const matches = SHORTS_POLIESTER.filter((s) => s.colorShort.toLowerCase() === colorShort.toLowerCase());
  return Array.from(new Set(matches.map((s) => s.colorRayas)));
}

// Encuentra el producto exacto por color de short y color de rayas
export function findProductoPoliester(colorShort: string, colorRayas: string): Producto | undefined {
  return SHORTS_POLIESTER.find(
    (s) =>
      s.colorShort.toLowerCase() === colorShort.toLowerCase() &&
      s.colorRayas.toLowerCase() === colorRayas.toLowerCase()
  );
}

// Helper para verificar si una talla está disponible para un producto
export function estaTallaDisponible(producto: Producto, talla: Talla): boolean {
  if (!producto.disponible) return false;
  return producto.tallasDisponibles.includes(talla);
}
