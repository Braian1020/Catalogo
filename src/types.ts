export type Talla = 'XS' | 'S' | 'M' | 'L' | 'XL';
export type Size = Talla;

export type Categoria = 'ropa';
export type Subcategoria = 'shorts';
export type TipoTela = 'poliester' | 'win';

export type CollectionType = 'clasicos' | 'equipos';

export interface Producto {
  id: string;
  nombre: string;
  categoria: Categoria;
  subcategoria: Subcategoria;
  tipoTela?: TipoTela;
  precio: number;
  precioPromo?: number;
  modelo: string;
  colorShort: string;
  colorRayas: string;
  imagen: string;
  imagenes?: string[];
  tallasDisponibles: Talla[];
  disponible: boolean;
  destacado?: boolean;
  descripcion?: string;
}

export interface ItemCarrito {
  id: string; // `${producto.id}-${talla}`
  producto: Producto;
  talla: Talla;
  cantidad: number;
}

// Backward compatibility types
export interface ShortProduct {
  id: string;
  title: string;
  colorDescription?: string;
  image: string;
  driveId?: string;
  originalFilename?: string;
  name?: string;
  collection?: CollectionType;
  fabric?: 'Polistrech' | 'Win';
  availableSizes?: Size[];
  price?: number;
  promoPrice?: number;
  images?: string[];
  googlePhotosUrl?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: ShortProduct;
  size: Size;
  quantity: number;
}

export const TALLAS_DISPONIBLES: Talla[] = ['XS', 'S', 'M', 'L', 'XL'];
export const SIZES: Size[] = TALLAS_DISPONIBLES;

export const GUIA_TALLAS: Record<Talla, { label: string; cintura: string; tallaNumero: string }> = {
  XS: { label: 'XS', cintura: '36', tallaNumero: 'Talla 36' },
  S: { label: 'S', cintura: '38', tallaNumero: 'Talla 38' },
  M: { label: 'M', cintura: '40', tallaNumero: 'Talla 40' },
  L: { label: 'L', cintura: '42', tallaNumero: 'Talla 42' },
  XL: { label: 'XL', cintura: '44', tallaNumero: 'Talla 44' },
};

export const SIZE_CONFIG: Record<Size, { label: string; waist: string; numericSize: string }> = {
  XS: { label: 'XS', waist: '36', numericSize: 'Talla 36' },
  S: { label: 'S', waist: '38', numericSize: 'Talla 38' },
  M: { label: 'M', waist: '40', numericSize: 'Talla 40' },
  L: { label: 'L', waist: '42', numericSize: 'Talla 42' },
  XL: { label: 'XL', waist: '44', numericSize: 'Talla 44' },
};
