export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface ShortProduct {
  id: string;
  title: string;
  colorDescription: string;
  image: string;
  driveId: string;
  originalFilename: string;
}

export interface OrderItem {
  id: string; // `${productId}-${size}`
  productId: string;
  product: ShortProduct;
  size: Size;
  quantity: number;
}

export type Perspective = 'all' | 'front' | 'back' | 'left' | 'right';

export const SIZE_CONFIG: Record<Size, { label: string; waist: string; numericSize: string }> = {
  XS: { label: 'XS', waist: '36', numericSize: 'Talla 36' },
  S: { label: 'S', waist: '38', numericSize: 'Talla 38' },
  M: { label: 'M', waist: '40', numericSize: 'Talla 40' },
  L: { label: 'L', waist: '42', numericSize: 'Talla 42' },
  XL: { label: 'XL', waist: '44', numericSize: 'Talla 44' },
};

export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL'];
