export interface SubcategoriaInfo {
  id: string;
  nombre: string;
  slug: string;
  ruta: string;
  descripcion: string;
  imagen: string;
  disponible: boolean;
  cantidadProductos?: number;
  etiqueta?: string;
}

export interface CategoriaInfo {
  id: string;
  nombre: string;
  slug: string;
  ruta: string;
  descripcion: string;
  imagen: string;
  disponible: boolean;
  subcategorias: SubcategoriaInfo[];
  etiqueta?: string;
}

export const CATEGORIAS: CategoriaInfo[] = [
  {
    id: 'ropa',
    nombre: 'Ropa',
    slug: 'ropa',
    ruta: '/ropa',
    descripcion: 'Prendas cómodas, resistentes y versátiles para uso diario, deporte y descanso.',
    imagen: 'https://lh3.googleusercontent.com/d/1Bf2R7P-6f9Z6z_T7qXk_v1w1f2q_3g4h=w800',
    disponible: true,
    etiqueta: 'Colección disponible',
    subcategorias: [
      {
        id: 'shorts',
        nombre: 'Shorts',
        slug: 'shorts',
        ruta: '/ropa/shorts',
        descripcion: 'Shorts clásicos elásticos y deportivos con bolsillos reforzados con cierre.',
        imagen: 'https://lh3.googleusercontent.com/d/1Bf2R7P-6f9Z6z_T7qXk_v1w1f2q_3g4h=w800',
        disponible: true,
        cantidadProductos: 47,
        etiqueta: '47 modelos',
      },
      {
        id: 'polos',
        nombre: 'Polos y Camisetas',
        slug: 'polos',
        ruta: '#',
        descripcion: 'Polos en algodón reactivo y telas deportivas transpirables.',
        imagen: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
        disponible: false,
        etiqueta: 'Próximamente',
      },
      {
        id: 'joggers',
        nombre: 'Pantalones y Joggers',
        slug: 'joggers',
        ruta: '#',
        descripcion: 'Joggers urbanos y deportivos con acabados de primera calidad.',
        imagen: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=600&q=80',
        disponible: false,
        etiqueta: 'Próximamente',
      },
      {
        id: 'poleras',
        nombre: 'Poleras y Casacas',
        slug: 'poleras',
        ruta: '#',
        descripcion: 'Prendas de abrigo ligeras y modernas para cualquier ocasión.',
        imagen: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
        disponible: false,
        etiqueta: 'Próximamente',
      },
    ],
  },
  {
    id: 'calzado',
    nombre: 'Calzado',
    slug: 'calzado',
    ruta: '#',
    descripcion: 'Zapatillas deportivas y urbanas seleccionadas para máxima durabilidad y confort.',
    imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    disponible: false,
    etiqueta: 'Próximamente',
    subcategorias: [],
  },
  {
    id: 'accesorios',
    nombre: 'Accesorios',
    slug: 'accesorios',
    ruta: '#',
    descripcion: 'Gorras, mochilas, medias deportivas y complementos esenciales.',
    imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    disponible: false,
    etiqueta: 'Próximamente',
    subcategorias: [],
  },
];
