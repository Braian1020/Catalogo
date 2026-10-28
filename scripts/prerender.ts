import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolver directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const indexHtmlPath = path.resolve(distDir, 'index.html');
const productosJsonPath = path.resolve(rootDir, 'src/data/productos.json');

function slugifyText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface ProductoRaw {
  id: string;
  nombre: string;
  categoria: string;
  subcategoria: string;
  tipoTela?: 'poliester' | 'win';
  precio: number;
  modelo: string;
  colorShort: string;
  colorRayas: string;
  imagen: string;
  tallasDisponibles: string[];
  disponible: boolean;
  destacado?: boolean;
}

function getProductSlug(p: ProductoRaw): string {
  if (p.tipoTela === 'win') {
    const cleanId = p.id.toLowerCase().replace(/^short-/, '');
    return `short-${cleanId}`;
  }
  const colorShortSlug = slugifyText(p.colorShort);
  const colorRayasSlug = slugifyText(p.colorRayas);
  return `short-${colorShortSlug}-rayas-${colorRayasSlug}`;
}

interface PaginaEstatica {
  relativeDir: string;
  title: string;
  description: string;
  url: string;
  image?: string;
}

async function runPrerender() {
  if (!fs.existsSync(indexHtmlPath)) {
    console.warn('[Prerender] dist/index.html no encontrado. Omitiendo prerenderizado.');
    return;
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  const rawProductos: ProductoRaw[] = JSON.parse(fs.readFileSync(productosJsonPath, 'utf-8'));

  console.log(`[Prerender] Iniciando prerenderizado estático de categorías y productos con OpenGraph...`);
  let count = 0;

  // 1. PÁGINAS DE CATEGORÍAS Y SUBCATEGORÍAS
  const defaultImage = rawProductos[0]?.imagen || '';
  const paginasCategorias: PaginaEstatica[] = [
    {
      relativeDir: 'productos',
      title: 'Todos los Productos | Catálogo Oficial POOL STORE',
      description:
        'Explora todas las opciones disponibles en POOL STORE: 47 modelos de shorts deportivos y clásicos con precios reales y promociones por volumen.',
      url: '/productos',
      image: defaultImage,
    },
    {
      relativeDir: 'ropa',
      title: 'Ropa Deportiva y Urbana | Catálogo Oficial POOL STORE',
      description:
        'Explora la colección de ropa de POOL STORE: Shorts Clásicos Polistrech y Shorts Deportivos Win. Próximamente polos, joggers y casacas. Envíos a todo el Perú.',
      url: '/ropa',
      image: defaultImage,
    },
    {
      relativeDir: 'ropa/shorts',
      title: 'Shorts Deportivos y Clásicos (47 modelos) | POOL STORE',
      description:
        'Catálogo de 47 shorts con bolsillos reforzados con cierre, tela Polistrech y tela Win deportiva transpirable. Promociones: 1x S/ 25, 3x S/ 69, 12x S/ 240.',
      url: '/ropa/shorts',
      image: defaultImage,
    },
    {
      relativeDir: 'ropa/shorts/clasicos',
      title: 'Shorts Clásicos Polistrech (36 combinaciones) | POOL STORE',
      description:
        'Shorts clásicos elásticos y frescos en 12 colores con 36 variantes de rayas. Tallas S, M, L, XL. Promoción: 1x S/ 25, 3x S/ 69, 12x S/ 240. Envíos a todo el Perú.',
      url: '/ropa/shorts/clasicos',
      image: defaultImage,
    },
    {
      relativeDir: 'ropa/shorts/deportivos',
      title: 'Shorts Deportivos Tela Win (Clubes y Selecciones) | POOL STORE',
      description:
        'Shorts deportivos en tela Win microperforada de Real Madrid, Barcelona, Selección Argentina y más equipos. Promoción: 1x S/ 25, 3x S/ 69, 12x S/ 240.',
      url: '/ropa/shorts/deportivos',
      image: defaultImage,
    },
    {
      relativeDir: 'entregas',
      title: 'Entregas y Envíos | POOL STORE Chiclayo & Perú',
      description:
        'Punto de entrega en Plaza Cívica de José Leonardo Ortiz, delivery en Chiclayo a S/ 1.50 por km desde Balta y Arica, y envíos a todo el Perú por Shalom.',
      url: '/entregas',
      image: defaultImage,
    },
    {
      relativeDir: 'nosotros',
      title: 'Sobre POOL STORE | Historia, Valores y Compromiso',
      description:
        'Descubre qué es POOL STORE: nuestra visión como tienda virtual multiproducto en Perú, compromiso con la calidad y atención personalizada.',
      url: '/nosotros',
      image: defaultImage,
    },
  ];

  for (const cat of paginasCategorias) {
    let catHtml = baseHtml;
    catHtml = catHtml.replace(/<title>.*?<\/title>/i, `<title>${cat.title}</title>`);
    catHtml = catHtml.replace(
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${cat.description}" />`
    );
    catHtml = catHtml.replace(
      /<meta\s+property=["']og:title["'][^>]*>/i,
      `<meta property="og:title" content="${cat.title}" />`
    );
    catHtml = catHtml.replace(
      /<meta\s+property=["']og:description["'][^>]*>/i,
      `<meta property="og:description" content="${cat.description}" />`
    );

    const extraCatMeta = `
    <!-- Category OpenGraph -->
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${cat.image}" />
    <meta property="og:url" content="${cat.url}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${cat.title}" />
    <meta name="twitter:description" content="${cat.description}" />
    <meta name="twitter:image" content="${cat.image}" />
    <link rel="canonical" href="${cat.url}" />
`;
    catHtml = catHtml.replace('</head>', `${extraCatMeta}</head>`);

    const targetDir = path.resolve(distDir, cat.relativeDir);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.resolve(targetDir, 'index.html'), catHtml, 'utf-8');
    count++;
  }

  // 2. PÁGINAS INDIVIDUALES DE PRODUCTO
  for (const p of rawProductos) {
    const canonicalSlug = getProductSlug(p);
    const slugs = Array.from(new Set([canonicalSlug, p.id, `short-${p.id}`]));

    const telaDesc =
      p.tipoTela === 'win'
        ? 'Tela Win deportiva microperforada y transpirable'
        : 'Tela Polistrech elástica, fresca y ligera';

    const pageTitle = `${p.nombre} | Pool Store`;
    const pageDesc = `${p.nombre} de Pool Store. ${telaDesc}. Bolsillos con cierre y pretina ajustable. Promoción: 1 por S/ 25, 3 por S/ 69, 12 por S/ 240. Envíos a todo el Perú.`;
    const imageUrl = p.imagen.startsWith('http') ? p.imagen : `${p.imagen}`;

    const schemaJson = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: p.nombre,
      image: [imageUrl],
      description: pageDesc,
      category: p.tipoTela === 'win' ? 'Ropa > Shorts > Shorts Deportivos' : 'Ropa > Shorts > Shorts Clásicos',
      brand: {
        '@type': 'Brand',
        name: 'Pool Store',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'PEN',
        price: '25.00',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
    };

    let productHtml = baseHtml;
    productHtml = productHtml.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
    productHtml = productHtml.replace(
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${pageDesc}" />`
    );
    productHtml = productHtml.replace(
      /<meta\s+property=["']og:title["'][^>]*>/i,
      `<meta property="og:title" content="${pageTitle}" />`
    );
    productHtml = productHtml.replace(
      /<meta\s+property=["']og:description["'][^>]*>/i,
      `<meta property="og:description" content="${pageDesc}" />`
    );

    const extraMeta = `
    <!-- Social OpenGraph & Product Previews for WhatsApp / Facebook / Twitter -->
    <meta property="og:type" content="product" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:alt" content="${p.nombre}" />
    <meta property="og:url" content="/producto/${canonicalSlug}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageTitle}" />
    <meta name="twitter:description" content="${pageDesc}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <link rel="canonical" href="/producto/${canonicalSlug}" />
    <script type="application/ld+json">
${JSON.stringify(schemaJson, null, 2)}
    </script>
`;
    productHtml = productHtml.replace('</head>', `${extraMeta}</head>`);

    // Guardar tanto en /producto/:slug como en /ropa/shorts/:slug
    for (const s of slugs) {
      // 1. /producto/:slug
      const productDir = path.resolve(distDir, 'producto', s);
      fs.mkdirSync(productDir, { recursive: true });
      fs.writeFileSync(path.resolve(productDir, 'index.html'), productHtml, 'utf-8');
      count++;

      // 2. /ropa/shorts/:slug
      const ropaShortDir = path.resolve(distDir, 'ropa', 'shorts', s);
      fs.mkdirSync(ropaShortDir, { recursive: true });
      fs.writeFileSync(path.resolve(ropaShortDir, 'index.html'), productHtml, 'utf-8');
      count++;
    }
  }

  console.log(`[Prerender] ¡Completado! Se generaron ${count} archivos estáticos HTML con meta tags OpenGraph.`);
}

runPrerender().catch((err) => {
  console.error('[Prerender] Error generando páginas estáticas:', err);
});
