import { Producto, Talla } from '../types';
import rawProductos from './productos.json';

export const PRODUCTOS: Producto[] = rawProductos as Producto[];

// Catálogo Ropa: Shorts Clásicos (Poliéster, 36 modelos)
export const SHORTS_POLIESTER = PRODUCTOS.filter(
  (p) => p.categoria === 'ropa' && p.subcategoria === 'shorts' && p.tipoTela === 'poliester'
);
export const SHORTS_CLASICOS = SHORTS_POLIESTER;

// Catálogo Ropa: Shorts Deportivos (Tela Win de Equipos, 11 modelos)
export const SHORTS_WIN = PRODUCTOS.filter(
  (p) => p.categoria === 'ropa' && p.subcategoria === 'shorts' && p.tipoTela === 'win'
);
export const SHORTS_DEPORTIVOS = SHORTS_WIN;

export interface VersionShortWin {
  id: string; // id único del producto (e.g. 'win-barcelona', 'win-barcelona-v2')
  etiqueta: string; // 'V1', 'V2'
  subtitulo: string; // 'Azulgrana / Oficial', 'Amarillo / Alternativo'
  producto: Producto;
}

export interface GrupoShortWin {
  id: string;
  equipo: string;
  nombreBase: string;
  destacado: boolean;
  versiones: VersionShortWin[];
}

export const GRUPOS_SHORTS_WIN: GrupoShortWin[] = [
  {
    id: 'argentina',
    equipo: 'Selección Argentina',
    nombreBase: 'Short Argentina',
    destacado: true,
    versiones: [
      {
        id: 'win-argentina',
        etiqueta: 'V1',
        subtitulo: 'Celeste y Blanco',
        producto: SHORTS_WIN.find((p) => p.id === 'win-argentina')!,
      },
      {
        id: 'win-argentina-v2',
        etiqueta: 'V2',
        subtitulo: 'Negro y Celeste (Alternativo)',
        producto: SHORTS_WIN.find((p) => p.id === 'win-argentina-v2')!,
      },
    ].filter((v) => Boolean(v.producto)),
  },
  {
    id: 'barcelona',
    equipo: 'FC Barcelona',
    nombreBase: 'Short FC Barcelona',
    destacado: true,
    versiones: [
      {
        id: 'win-barcelona',
        etiqueta: 'V1',
        subtitulo: 'Azulgrana Oficial',
        producto: SHORTS_WIN.find((p) => p.id === 'win-barcelona')!,
      },
      {
        id: 'win-barcelona-v2',
        etiqueta: 'V2',
        subtitulo: 'Amarillo / Alternativo',
        producto: SHORTS_WIN.find((p) => p.id === 'win-barcelona-v2')!,
      },
    ].filter((v) => Boolean(v.producto)),
  },
  {
    id: 'real-madrid',
    equipo: 'Real Madrid',
    nombreBase: 'Short Real Madrid',
    destacado: true,
    versiones: [
      {
        id: 'win-real-madrid',
        etiqueta: 'V1',
        subtitulo: 'Blanco Oficial',
        producto: SHORTS_WIN.find((p) => p.id === 'win-real-madrid')!,
      },
    ].filter((v) => Boolean(v.producto)),
  },
  {
    id: 'alianza-lima',
    equipo: 'Alianza Lima',
    nombreBase: 'Short Alianza Lima',
    destacado: true,
    versiones: [
      {
        id: 'win-alianza-lima',
        etiqueta: 'V1',
        subtitulo: 'Blanco y Azul',
        producto: SHORTS_WIN.find((p) => p.id === 'win-alianza-lima')!,
      },
    ].filter((v) => Boolean(v.producto)),
  },
  {
    id: 'universitario',
    equipo: 'Universitario de Deportes',
    nombreBase: 'Short Universitario',
    destacado: true,
    versiones: [
      {
        id: 'win-universitario',
        etiqueta: 'V1',
        subtitulo: 'Crema y Granate',
        producto: SHORTS_WIN.find((p) => p.id === 'win-universitario')!,
      },
    ].filter((v) => Boolean(v.producto)),
  },
  {
    id: 'brasil',
    equipo: 'Selección Brasil',
    nombreBase: 'Short Brasil',
    destacado: true,
    versiones: [
      {
        id: 'win-brasil',
        etiqueta: 'V1',
        subtitulo: 'Azul Canarinho',
        producto: SHORTS_WIN.find((p) => p.id === 'win-brasil')!,
      },
    ].filter((v) => Boolean(v.producto)),
  },
  {
    id: 'manchester-united',
    equipo: 'Manchester United',
    nombreBase: 'Short Manchester United',
    destacado: false,
    versiones: [
      {
        id: 'win-manchester-united',
        etiqueta: 'V1',
        subtitulo: 'Blanco Oficial',
        producto: SHORTS_WIN.find((p) => p.id === 'win-manchester-united')!,
      },
    ].filter((v) => Boolean(v.producto)),
  },
  {
    id: 'francia',
    equipo: 'Selección Francia',
    nombreBase: 'Short Francia',
    destacado: false,
    versiones: [
      {
        id: 'win-francia',
        etiqueta: 'V1',
        subtitulo: 'Azul Marino',
        producto: SHORTS_WIN.find((p) => p.id === 'win-francia')!,
      },
    ].filter((v) => Boolean(v.producto)),
  },
  {
    id: 'portugal',
    equipo: 'Selección Portugal',
    nombreBase: 'Short Portugal',
    destacado: false,
    versiones: [
      {
        id: 'win-portugal',
        etiqueta: 'V1',
        subtitulo: 'Verde y Rojo',
        producto: SHORTS_WIN.find((p) => p.id === 'win-portugal')!,
      },
    ].filter((v) => Boolean(v.producto)),
  },
];

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

// Obtiene todos los productos (variantes con sus diferentes rayas) para un color de short
export function getProductosPorColorShort(colorShort: string): Producto[] {
  return SHORTS_POLIESTER.filter(
    (s) => s.colorShort.toLowerCase() === colorShort.toLowerCase()
  );
}

// Obtiene la imagen representativa para la tarjeta de catálogo de un color de short
export function getImagenColorShort(colorShort: string): string {
  const p = SHORTS_POLIESTER.find(
    (s) => s.colorShort.toLowerCase() === colorShort.toLowerCase()
  );
  return p ? p.imagen : '';
}
