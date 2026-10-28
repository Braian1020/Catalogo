import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  findProductoBySlug,
  getProductSlug,
  getRayasPorColorShort,
  findProductoPoliester,
  findGrupoWinByProductoId,
  getRelatedProducts,
  COLOR_HEX_MAP,
  PRODUCTOS,
} from '../data/productos';
import { Producto, Talla, GUIA_TALLAS } from '../types';
import { useCart } from '../context/CartContext';
import { getWhatsAppUrl, POLESTORE_PHONE_DISPLAY } from '../utils/whatsapp';
import {
  ShoppingBag,
  ArrowLeft,
  Share2,
  Check,
  ZoomIn,
  Truck,
  ShieldCheck,
  Sparkles,
  Info,
  Ruler,
  MessageCircle,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
  PackageCheck,
  HelpCircle,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    agregarAlCarrito,
    setModalCarritoAbierto,
    setModalFoto,
    setModalGuiaTallas,
    setModalTelasAbierto,
    totalPrendas,
    mostrarToast,
  } = useCart();

  // 1. Encontrar el producto correspondiente al slug
  const productoActivo = useMemo(() => {
    if (!slug) return undefined;
    return findProductoBySlug(slug);
  }, [slug]);

  // Si no se encuentra el producto, fallback al primero o vista 404 controlada
  const grupoWin = useMemo(() => {
    if (!productoActivo || productoActivo.tipoTela !== 'win') return undefined;
    return findGrupoWinByProductoId(productoActivo.id);
  }, [productoActivo]);

  // Variantes de rayas si es clásico
  const rayasDisponibles = useMemo(() => {
    if (!productoActivo || productoActivo.tipoTela === 'win') return [];
    return getRayasPorColorShort(productoActivo.colorShort);
  }, [productoActivo]);

  // Talla seleccionada (por defecto M o la primera disponible)
  const [tallaSeleccionada, setTallaSeleccionada] = useState<Talla>('M');
  const [cantidad, setCantidad] = useState<number>(1);
  const [copiado, setCopiado] = useState<boolean>(false);

  // Sincronizar talla cuando cambia el producto
  useEffect(() => {
    if (productoActivo && productoActivo.tallasDisponibles.length > 0) {
      if (!productoActivo.tallasDisponibles.includes(tallaSeleccionada)) {
        setTallaSeleccionada(productoActivo.tallasDisponibles[0]);
      }
    }
    setCantidad(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productoActivo]);

  // 2. Metadatos dinámicos Open Graph y Title para SEO y Redes
  useEffect(() => {
    if (!productoActivo) {
      document.title = 'Producto no encontrado | Pool Store';
      return;
    }

    const title = `${productoActivo.nombre} | Pool Store`;
    document.title = title;

    const telaDesc =
      productoActivo.tipoTela === 'win'
        ? 'Tela Win deportiva microperforada y transpirable'
        : 'Tela Polistrech elástica y de secado rápido';
    const description = `${productoActivo.nombre}. ${telaDesc}. Promoción: 1x S/ 25, 3x S/ 69, 12x S/ 240. Envíos a todo el Perú por Pool Store.`;

    // Actualizar meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    // Actualizar Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', productoActivo.imagen);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', window.location.href);

    // Twitter
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description);

    const twImage = document.querySelector('meta[name="twitter:image"]');
    if (twImage) twImage.setAttribute('content', productoActivo.imagen);
  }, [productoActivo]);

  // Si no se encuentra el producto
  if (!productoActivo) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-montserrat">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-2xl font-black">
          !
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Producto no encontrado</h1>
        <p className="text-sm text-slate-600 max-w-md mb-6">
          El short o la combinación que buscas no existe o ha sido modificado. Puedes explorar nuestro catálogo oficial completo.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-sm font-black rounded-xl inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo Oficial</span>
        </Link>
      </div>
    );
  }

  // Cálculos de precio para este producto individual
  const isWin = productoActivo.tipoTela === 'win';
  const precioUnitario = cantidad >= 12 ? 20.0 : cantidad >= 3 ? 23.0 : 25.0;
  const precioRegularTotal = 25.0 * cantidad;
  const subtotalItem = precioUnitario * cantidad;
  const ahorroItem = Math.max(0, precioRegularTotal - subtotalItem);

  // Productos relacionados
  const productosRelacionados = getRelatedProducts(productoActivo, 4);

  // Cambiar variante de raya en shorts clásicos (actualiza imagen Y url al instante)
  const handleSelectRaya = (raya: string) => {
    if (raya.toLowerCase() === productoActivo.colorRayas.toLowerCase()) return;
    const nuevoProducto = findProductoPoliester(productoActivo.colorShort, raya);
    if (nuevoProducto) {
      const nuevoSlug = getProductSlug(nuevoProducto);
      navigate(`/producto/${nuevoSlug}`, { replace: true });
    }
  };

  // Cambiar versión en shorts win (actualiza imagen Y url al instante)
  const handleSelectVersionWin = (versionId: string) => {
    if (versionId === productoActivo.id) return;
    const vProd = PRODUCTOS.find((p) => p.id === versionId);
    if (vProd) {
      const nuevoSlug = getProductSlug(vProd);
      navigate(`/producto/${nuevoSlug}`, { replace: true });
    }
  };

  // Compartir producto
  const handleCompartir = async () => {
    const url = window.location.href;
    const shareData = {
      title: `${productoActivo.nombre} | Pool Store`,
      text: `Mira este ${productoActivo.nombre} en Pool Store. ¡Envíos directos y promociones por cantidad!`,
      url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback a portapapeles si el usuario cancela o hay error
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      mostrarToast('✓ ¡Enlace del producto copiado al portapapeles!');
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      mostrarToast('Enlace: ' + url);
    }
  };

  // Comprar directo por WhatsApp este producto específico
  const handleComprarWhatsAppDirecto = () => {
    const itemMsg = `1. *${productoActivo.nombre}*\n` +
      `   • Talla: *${tallaSeleccionada}*\n` +
      `   • Cantidad: *${cantidad}*\n` +
      `   • Precio: *S/ ${subtotalItem.toFixed(2)}*\n` +
      (productoActivo.tipoTela === 'win'
        ? `   • Tela: Win deportiva\n`
        : `   • Detalle: Rayas ${productoActivo.colorRayas}\n`);

    const texto = `🛍️ *NUEVO PEDIDO DIRECTO | POOL STORE*\n\n` +
      `Hola Pool Store, deseo comprar directamente este producto:\n\n` +
      itemMsg +
      `\n📊 *RESUMEN DEL PEDIDO:*\n` +
      `• Total de prendas: *${cantidad}*\n` +
      `• Importe a pagar: *S/ ${subtotalItem.toFixed(2)}*\n` +
      (ahorroItem > 0 ? `• Descuento por promoción: *S/ ${ahorroItem.toFixed(2)}*\n` : '') +
      `\n🔗 *Enlace:* ${window.location.href}\n\n` +
      `¿Tienen disponibilidad para coordinar la entrega?`;

    const url = getWhatsAppUrl(texto);
    window.location.href = url;
  };

  const hexColor = COLOR_HEX_MAP[productoActivo.colorShort] || {
    bg: '#0f172a',
    text: '#ffffff',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col">
      {/* 1. TOP MARQUEE BANNER */}
      <div className="bg-slate-950 text-white text-[11px] sm:text-xs py-2 px-3 border-b border-slate-800 text-center font-bold">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-amber-400 mx-auto">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>
              🔥 Promociones: <strong>1x S/ 25</strong> · <strong>3x S/ 69</strong> · <strong>12x S/ 240</strong> | Envíos a todo el Perú
            </span>
          </span>
        </div>
      </div>

      {/* 2. HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-900 hover:opacity-85 transition-opacity"
            title="Ir al inicio de Pool Store"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-sm">
              P
            </div>
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight block leading-none">
                POOL STORE
              </span>
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block">
                Catálogo Oficial
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/ropa/shorts"
              className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Ver todos los shorts</span>
            </Link>

            {/* Botón Carrito */}
            <button
              type="button"
              onClick={() => setModalCarritoAbierto(true)}
              className="relative p-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              aria-label="Abrir pedido"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline text-xs font-black">Mi Pedido</span>
              {totalPrendas > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black flex items-center justify-center shadow-xs">
                  {totalPrendas}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. BREADCRUMBS Y NAVEGACIÓN */}
      <nav aria-label="Ruta de navegación" className="max-w-6xl mx-auto px-4 pt-4 pb-2 w-full">
        <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-slate-900 transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/ropa" className="hover:text-slate-900 transition-colors">
            Ropa
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/ropa/shorts" className="hover:text-slate-900 transition-colors">
            Shorts
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            to={isWin ? '/ropa/shorts/deportivos' : '/ropa/shorts/clasicos'}
            className="hover:text-slate-900 transition-colors"
          >
            {isWin ? 'Shorts Deportivos' : 'Shorts Clásicos'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">
            {productoActivo.nombre}
          </span>
        </div>
      </nav>

      {/* 4. CONTENIDO PRINCIPAL: FICHA DEL PRODUCTO */}
      <main className="max-w-6xl mx-auto px-4 py-4 w-full flex-1">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* COLUMNA IZQUIERDA: FOTO GRANDE Y GALERÍA */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Imagen Principal */}
              <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
                <img
                  src={productoActivo.imagen}
                  alt={productoActivo.nombre}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />

                {/* Badge de Tela */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span
                    className={`px-3 py-1 text-xs font-black rounded-lg shadow-sm backdrop-blur-md uppercase tracking-wider ${
                      isWin
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {isWin ? 'Tela Win Deportiva' : 'Tela Polistrech'}
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/95 text-slate-800 rounded-md shadow-xs backdrop-blur-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    En Stock
                  </span>
                </div>

                {/* Botón Zoom */}
                <button
                  type="button"
                  onClick={() => setModalFoto(productoActivo)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/75 hover:bg-black text-white text-xs font-bold rounded-xl backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
                  title="Ampliar fotografía"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Ampliar foto</span>
                </button>
              </div>

              {/* Galería de variantes / otras rayas de este mismo color */}
              {!isWin && rayasDisponibles.length > 1 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Combinaciones de rayas para Short {productoActivo.colorShort} ({rayasDisponibles.length} opciones):
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {rayasDisponibles.map((raya) => {
                      const prodVariante = findProductoPoliester(productoActivo.colorShort, raya);
                      if (!prodVariante) return null;
                      const esSeleccionado =
                        raya.toLowerCase() === productoActivo.colorRayas.toLowerCase();

                      return (
                        <button
                          key={raya}
                          type="button"
                          onClick={() => handleSelectRaya(raya)}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                            esSeleccionado
                              ? 'border-blue-600 ring-2 ring-blue-500/30'
                              : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                          }`}
                          title={`Ver combinación con rayas ${raya}`}
                        >
                          <img
                            src={prodVariante.imagen}
                            alt={`Rayas ${raya}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {esSeleccionado && (
                            <span className="absolute bottom-1 right-1 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px] font-black">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Si es Win y tiene múltiples versiones (V1 / V2) */}
              {isWin && grupoWin && grupoWin.versiones.length > 1 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Versiones disponibles de {grupoWin.equipo}:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {grupoWin.versiones.map((v) => {
                      const esSeleccionado = v.id === productoActivo.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => handleSelectVersionWin(v.id)}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            esSeleccionado
                              ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                          }`}
                        >
                          <img
                            src={v.producto.imagen}
                            alt={v.etiqueta}
                            className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-black text-slate-900 block truncate">
                              {v.etiqueta} - {v.subtitulo}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {esSeleccionado ? 'Seleccionado actualmente' : 'Clic para ver'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* COLUMNA DERECHA: INFORMACIÓN, SELECTORES Y ACCIONES */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Categoría y botón de tela */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    {isWin ? 'Colección Equipos Deportivos' : 'Colección Clásicos Diarios'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalTelasAbierto(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Saber más sobre la tela</span>
                  </button>
                </div>

                {/* Título */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                  {productoActivo.nombre}
                </h1>

                {/* Resumen de características */}
                <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
                  {isWin
                    ? 'Short deportivo de alto rendimiento confeccionado en tela Win microperforada. Máxima frescura, escudo del club y bolsillos con cierre para mayor seguridad.'
                    : `Short clásico confeccionado en tela Polistrech suave y de secado rápido en color ${productoActivo.colorShort} con franjas laterales color ${productoActivo.colorRayas}. Incluye bolsillos con cierre y cordón ajustable.`}
                </p>

                {/* CAJA DE PRECIOS Y PROMOCIONES */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      S/ {precioUnitario.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">por unidad</span>
                    {cantidad >= 3 && (
                      <span className="ml-auto px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full">
                        ¡Ahorras S/ {ahorroItem.toFixed(2)}!
                      </span>
                    )}
                  </div>

                  {/* Escala de promociones */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div
                      className={`p-2 rounded-xl border transition-all ${
                        cantidad < 3
                          ? 'bg-white border-blue-500 shadow-xs'
                          : 'bg-white/60 border-slate-200'
                      }`}
                    >
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">1 Unidad</span>
                      <strong className="text-xs font-black text-slate-900">S/ 25.00</strong>
                      <span className="block text-[9px] text-slate-400">c/u</span>
                    </div>

                    <div
                      className={`p-2 rounded-xl border transition-all ${
                        cantidad >= 3 && cantidad < 12
                          ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                          : 'bg-white/60 border-slate-200'
                      }`}
                    >
                      <span className="block text-[10px] text-emerald-700 font-bold uppercase">3 Unidades</span>
                      <strong className="text-xs font-black text-emerald-800">S/ 69.00</strong>
                      <span className="block text-[9px] text-emerald-600">S/ 23 c/u</span>
                    </div>

                    <div
                      className={`p-2 rounded-xl border transition-all ${
                        cantidad >= 12
                          ? 'bg-amber-50 border-amber-500 shadow-xs'
                          : 'bg-white/60 border-slate-200'
                      }`}
                    >
                      <span className="block text-[10px] text-amber-700 font-bold uppercase">Docena (12)</span>
                      <strong className="text-xs font-black text-amber-900">S/ 240.00</strong>
                      <span className="block text-[9px] text-amber-700">S/ 20 c/u</span>
                    </div>
                  </div>
                </div>

                {/* SELECTOR DE RAYAS (Si es clásico) */}
                {!isWin && rayasDisponibles.length > 1 && (
                  <div className="mb-5">
                    <label className="text-xs font-bold text-slate-800 block mb-2">
                      Color de Rayas:{' '}
                      <span className="text-blue-600 font-black">{productoActivo.colorRayas}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {rayasDisponibles.map((r) => {
                        const esActivo =
                          r.toLowerCase() === productoActivo.colorRayas.toLowerCase();
                        const hexRaya = COLOR_HEX_MAP[r] || { bg: '#cbd5e1', text: '#0f172a' };

                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => handleSelectRaya(r)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                              esActivo
                                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: hexRaya.bg }}
                            />
                            <span>{r}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SELECTOR DE VERSIÓN (Si es Win) */}
                {isWin && grupoWin && grupoWin.versiones.length > 1 && (
                  <div className="mb-5">
                    <label className="text-xs font-bold text-slate-800 block mb-2">
                      Versión del Club:{' '}
                      <span className="text-amber-600 font-black">
                        {grupoWin.versiones.find((v) => v.id === productoActivo.id)?.etiqueta} -{' '}
                        {grupoWin.versiones.find((v) => v.id === productoActivo.id)?.subtitulo}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {grupoWin.versiones.map((v) => {
                        const esActivo = v.id === productoActivo.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleSelectVersionWin(v.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                              esActivo
                                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <span className="font-black text-amber-400">{v.etiqueta}</span>
                            <span>{v.subtitulo}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SELECTOR DE TALLA */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800">
                      Talla Disponible:{' '}
                      <span className="text-slate-900 font-black">{tallaSeleccionada}</span>
                      <span className="text-slate-400 font-normal ml-1">
                        (Cintura: {GUIA_TALLAS[tallaSeleccionada]?.cintura || 'Estándar'} cm)
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setModalGuiaTallas(true)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Guía de medidas</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {productoActivo.tallasDisponibles.map((talla) => {
                      const esSeleccionada = tallaSeleccionada === talla;
                      return (
                        <button
                          key={talla}
                          type="button"
                          onClick={() => setTallaSeleccionada(talla)}
                          className={`py-2.5 px-3 rounded-xl text-center font-bold text-xs border transition-all cursor-pointer ${
                            esSeleccionada
                              ? 'border-blue-600 bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/30'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <span className="block font-black text-sm">{talla}</span>
                          <span
                            className={`block text-[10px] ${
                              esSeleccionada ? 'text-blue-100' : 'text-slate-400'
                            }`}
                          >
                            {GUIA_TALLAS[talla]?.tallaNumero || ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SELECTOR DE CANTIDAD */}
                <div className="mb-6 flex items-center gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1.5">
                      Cantidad:
                    </label>
                    <div className="flex items-center border border-slate-200 bg-white rounded-xl shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                        disabled={cantidad <= 1}
                        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-black text-sm text-slate-900">
                        {cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCantidad((prev) => prev + 1)}
                        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      Subtotal estimado:
                    </span>
                    <strong className="text-lg font-black text-slate-900">
                      S/ {subtotalItem.toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* BOTONES DE ACCIÓN PRINCIPALES */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Botón Agregar al Pedido */}
                  <button
                    type="button"
                    onClick={() => {
                      agregarAlCarrito(productoActivo, tallaSeleccionada, cantidad);
                    }}
                    className="w-full py-3.5 px-4 bg-slate-900 hover:bg-black text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>Agregar al pedido</span>
                  </button>

                  {/* Botón Comprar por WhatsApp */}
                  <button
                    type="button"
                    onClick={handleComprarWhatsAppDirecto}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Comprar por WhatsApp</span>
                  </button>
                </div>

                {/* Botón Compartir Producto */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCompartir}
                    className="flex-1 py-2.5 px-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    {copiado ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 font-black">¡Enlace copiado al portapapeles!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-slate-500" />
                        <span>Compartir enlace de este producto</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/"
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver al catálogo</span>
                  </Link>
                </div>

                {/* Garantías y entrega */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Entrega rápida en Chiclayo y Shalom a provincias</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fotos reales de las prendas en stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. SECCIÓN DE PRODUCTOS RELACIONADOS */}
        {productosRelacionados.length > 0 && (
          <section className="mt-12 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  También te podría interesar
                </h2>
                <p className="text-xs text-slate-500">
                  Otros modelos populares de la misma colección
                </p>
              </div>
              <Link
                to="/"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Ver todo el catálogo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {productosRelacionados.map((rel) => {
                const slugRel = getProductSlug(rel);
                return (
                  <Link
                    key={rel.id}
                    to={`/producto/${slugRel}`}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
                  >
                    <div className="relative aspect-square bg-slate-100 overflow-hidden">
                      <img
                        src={rel.imagen}
                        alt={rel.nombre}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-slate-900 shadow-2xs">
                        {rel.tipoTela === 'win' ? 'Win' : 'Polistrech'}
                      </span>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {rel.nombre}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-900">
                          S/ 25.00
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5">
                          Ver detalle
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* 6. FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500 space-y-3 font-montserrat">
        <p className="font-black text-slate-900 tracking-widest text-sm uppercase">
          POOL STORE
        </p>
        <p className="text-slate-600">
          Tu tienda virtual de confianza. Compras fáciles, atención directa y entregas coordinadas.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-700">
          <Link to="/" className="hover:text-black">
            Inicio
          </Link>
          <span>·</span>
          <Link to="/ropa" className="hover:text-black">
            Ropa
          </Link>
          <span>·</span>
          <Link to="/ropa/shorts" className="hover:text-black">
            Shorts
          </Link>
          <span>·</span>
          <button
            type="button"
            onClick={() => setModalGuiaTallas(true)}
            className="hover:text-black cursor-pointer"
          >
            Guía de tallas
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setModalTelasAbierto(true)}
            className="hover:text-black cursor-pointer"
          >
            Saber más sobre la tela
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Puntos de entrega: Plaza Cívica · Catedral · Banco de la Nación · Plazuela · Zonas cercanas · Envíos Shalom a todo el Perú
        </p>
        <p className="text-[10px] text-slate-400">
          Pedidos WhatsApp: {POLESTORE_PHONE_DISPLAY} · Mi Yape: 903566655
        </p>
      </footer>
    </div>
  );
}
