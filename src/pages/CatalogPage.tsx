import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  SHORTS_POLIESTER,
  SHORTS_WIN,
  COLORES_SHORT_POLIESTER,
  COLOR_HEX_MAP,
  getRayasPorColorShort,
  findProductoPoliester,
  estaTallaDisponible,
  GRUPOS_SHORTS_WIN,
  GrupoShortWin,
  getProductSlug,
} from '../data/productos';
import { Producto, Talla, TALLAS_DISPONIBLES, GUIA_TALLAS } from '../types';
import { useCart, PUNTOS_CENTRICOS_CHICLAYO } from '../context/CartContext';
import { POLESTORE_PHONE_DISPLAY } from '../utils/whatsapp';
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Truck,
  Package,
  Ruler,
  ZoomIn,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Filter,
  Menu,
  Clock,
  Users,
  MessageCircle,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export type CategoriaActiva = 'todos' | 'clasicos' | 'deportivos';

interface EstadoArticuloClasico {
  colorRayas: string;
  talla: Talla;
  cantidad: number;
}

interface EstadoGrupoWin {
  versionId: string;
  cantidad: number;
  talla: Talla;
}

interface CatalogPageProps {
  initialCategoria?: CategoriaActiva;
}

export default function CatalogPage({ initialCategoria }: CatalogPageProps = {}) {
  const {
    agregarAlCarrito,
    setModalCarritoAbierto,
    setModalFoto,
    setModalGuiaTallas,
    setModalTelasAbierto,
    totalPrendas,
  } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  // Determinar categoría activa según la ruta o prop
  const getCategoriaInicial = useCallback((): CategoriaActiva => {
    if (initialCategoria) return initialCategoria;
    if (location.pathname === '/ropa/shorts/clasicos') return 'clasicos';
    if (location.pathname === '/ropa/shorts/deportivos') return 'deportivos';
    if (location.pathname === '/ropa/shorts') return 'todos';
    return 'clasicos';
  }, [initialCategoria, location.pathname]);

  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaActiva>(getCategoriaInicial);
  const [busqueda, setBusqueda] = useState<string>('');
  const [menuMovilAbierto, setMenuMovilAbierto] = useState<boolean>(false);

  // Sincronizar si cambia de ruta por navegación en navegador o enlaces directos
  useEffect(() => {
    if (location.pathname === '/ropa/shorts/clasicos') {
      setCategoriaActiva('clasicos');
    } else if (location.pathname === '/ropa/shorts/deportivos') {
      setCategoriaActiva('deportivos');
    } else if (location.pathname === '/ropa/shorts') {
      setCategoriaActiva('todos');
    }
  }, [location.pathname]);

  // Actualizar títulos según la categoría o subcategoría
  useEffect(() => {
    if (location.pathname === '/ropa/shorts/clasicos' || (location.pathname.startsWith('/ropa/shorts') && categoriaActiva === 'clasicos')) {
      document.title = 'Shorts Clásicos Polistrech | Catálogo Oficial POOL STORE';
    } else if (location.pathname === '/ropa/shorts/deportivos' || (location.pathname.startsWith('/ropa/shorts') && categoriaActiva === 'deportivos')) {
      document.title = 'Shorts Deportivos Tela Win | Catálogo Oficial POOL STORE';
    } else if (location.pathname.startsWith('/ropa/shorts')) {
      document.title = 'Shorts Deportivos y Clásicos (47 modelos) | POOL STORE';
    } else {
      document.title = 'POOL STORE | Tienda Oficial de Shorts Deportivos y Ropa';
    }
  }, [location.pathname, categoriaActiva]);

  // Cambiar categoría y actualizar URL
  const cambiarCategoria = useCallback((cat: CategoriaActiva) => {
    setCategoriaActiva(cat);
    if (cat === 'todos') {
      navigate('/ropa/shorts');
    } else if (cat === 'clasicos') {
      navigate('/ropa/shorts/clasicos');
    } else if (cat === 'deportivos') {
      navigate('/ropa/shorts/deportivos');
    }
  }, [navigate]);

  // Navegación suave interna
  const navegarA = useCallback((id: string) => {
    setMenuMovilAbierto(false);
    if (id === 'mi-pedido') {
      setModalCarritoAbierto(true);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [setModalCarritoAbierto]);

  // 2. ESTADOS INDEPENDIENTES DE PRODUCTOS EN EL CATÁLOGO
  const [estadoClasicos, setEstadoClasicos] = useState<Record<string, EstadoArticuloClasico>>(() => {
    const inicial: Record<string, EstadoArticuloClasico> = {};
    COLORES_SHORT_POLIESTER.forEach((color) => {
      const rayas = getRayasPorColorShort(color);
      const primeraRaya = rayas[0] || '';
      const prod = findProductoPoliester(color, primeraRaya);
      const primeraTalla: Talla =
        prod && prod.tallasDisponibles.length > 0
          ? prod.tallasDisponibles.includes('M')
            ? 'M'
            : prod.tallasDisponibles[0]
          : 'M';

      inicial[color] = {
        colorRayas: primeraRaya,
        talla: primeraTalla,
        cantidad: 1,
      };
    });
    return inicial;
  });

  const [estadoGruposWin, setEstadoGruposWin] = useState<Record<string, EstadoGrupoWin>>(() => {
    const inicial: Record<string, EstadoGrupoWin> = {};
    GRUPOS_SHORTS_WIN.forEach((g) => {
      const v1 = g.versiones[0];
      inicial[g.id] = {
        versionId: v1 ? v1.id : '',
        cantidad: 1,
        talla: 'L',
      };
    });
    return inicial;
  });

  const handleCambiarRayaClasico = useCallback((colorShort: string, raya: string) => {
    setEstadoClasicos((prev) => {
      const actual = prev[colorShort] || { colorRayas: raya, talla: 'M', cantidad: 1 };
      const prod = findProductoPoliester(colorShort, raya);
      let tallaActualizada = actual.talla;
      if (prod && !estaTallaDisponible(prod, tallaActualizada)) {
        if (prod.tallasDisponibles.length > 0) {
          tallaActualizada = prod.tallasDisponibles[0];
        }
      }
      return {
        ...prev,
        [colorShort]: {
          ...actual,
          colorRayas: raya,
          talla: tallaActualizada,
        },
      };
    });
  }, []);

  const handleCambiarTallaClasico = useCallback((colorShort: string, talla: Talla) => {
    setEstadoClasicos((prev) => {
      const actual = prev[colorShort];
      if (!actual) return prev;
      return {
        ...prev,
        [colorShort]: {
          ...actual,
          talla,
        },
      };
    });
  }, []);

  const handleCambiarCantidadClasico = useCallback((colorShort: string, delta: number) => {
    setEstadoClasicos((prev) => {
      const actual = prev[colorShort];
      if (!actual) return prev;
      const nuevaCantidad = Math.max(1, actual.cantidad + delta);
      return {
        ...prev,
        [colorShort]: {
          ...actual,
          cantidad: nuevaCantidad,
        },
      };
    });
  }, []);

  const handleCambiarVersionWin = useCallback((grupoId: string, versionId: string) => {
    setEstadoGruposWin((prev) => {
      const actual = prev[grupoId] || { versionId, cantidad: 1, talla: 'L' };
      return {
        ...prev,
        [grupoId]: {
          ...actual,
          versionId,
        },
      };
    });
  }, []);

  const handleCambiarTallaWin = useCallback((grupoId: string, talla: Talla) => {
    setEstadoGruposWin((prev) => {
      const actual = prev[grupoId];
      if (!actual) return prev;
      return {
        ...prev,
        [grupoId]: {
          ...actual,
          talla,
        },
      };
    });
  }, []);

  const handleCambiarCantidadWin = useCallback((grupoId: string, delta: number) => {
    setEstadoGruposWin((prev) => {
      const actual = prev[grupoId];
      if (!actual) return prev;
      const nuevaCantidad = Math.max(1, actual.cantidad + delta);
      return {
        ...prev,
        [grupoId]: {
          ...actual,
          cantidad: nuevaCantidad,
        },
      };
    });
  }, []);

  // 3. FILTRADO INTELIGENTE
  const q = busqueda.trim().toLowerCase();

  const coloresClasicosFiltrados = useMemo(() => {
    if (categoriaActiva === 'deportivos') return [];
    return COLORES_SHORT_POLIESTER.filter((color) => {
      if (!q) return true;
      if (color.toLowerCase().includes(q)) return true;
      const rayas = getRayasPorColorShort(color);
      return rayas.some((r) => r.toLowerCase().includes(q));
    });
  }, [categoriaActiva, q]);

  const gruposWinFiltrados = useMemo(() => {
    if (categoriaActiva === 'clasicos') return [];
    return GRUPOS_SHORTS_WIN.filter((grupo) => {
      if (!q) return true;
      if (grupo.equipo.toLowerCase().includes(q)) return true;
      if (grupo.nombreBase.toLowerCase().includes(q)) return true;
      return grupo.versiones.some(
        (v) =>
          v.subtitulo.toLowerCase().includes(q) ||
          v.producto.nombre.toLowerCase().includes(q)
      );
    });
  }, [categoriaActiva, q]);

  const totalResultados = coloresClasicosFiltrados.length + gruposWinFiltrados.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* 1. HEADER NAVBAR UNIFICADO */}
      <Navbar />

      {/* 3. HERO / RIBBON DE PROMOCIONES */}
      <section id="inicio" className="bg-slate-900 text-white pt-8 pb-10 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full inline-block border border-emerald-800/40">
            Catálogo Oficial 2026
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white max-w-2xl mx-auto">
            Shorts Clásicos y Deportivos para Cada Momento
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Explora las páginas individuales de cada producto para ver fotos ampliadas, combinaciones de rayas y compartir tus favoritos directamente.
          </p>

          {/* Tarjetas de Promoción */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-2">
            <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">1 Unidad</span>
              <strong className="text-base font-black text-white">S/ 25.00</strong>
            </div>

            <div className="p-3 bg-emerald-950/70 border border-emerald-600/50 rounded-2xl text-center relative overflow-hidden">
              <span className="absolute top-1 right-2 text-[9px] font-black text-emerald-400 uppercase">
                Recomendado
              </span>
              <span className="text-[10px] text-emerald-300 font-bold uppercase block">Promo x3</span>
              <strong className="text-base font-black text-emerald-400">3 x S/ 69.00</strong>
              <span className="block text-[10px] text-emerald-200">S/ 23.00 c/u</span>
            </div>

            <div className="p-3 bg-amber-950/70 border border-amber-600/50 rounded-2xl text-center">
              <span className="text-[10px] text-amber-300 font-bold uppercase block">Mayorista / Docena</span>
              <strong className="text-base font-black text-amber-400">12 x S/ 240.00</strong>
              <span className="block text-[10px] text-amber-200">S/ 20.00 c/u</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FILTROS Y BÚSQUEDA */}
      <section id="catalogo" className="max-w-6xl mx-auto px-4 py-6 w-full flex-1">
        {/* Breadcrumb de navegación jerárquica con Productos */}
        <nav aria-label="Ruta de navegación" className="mb-6">
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/productos" className="hover:text-slate-900 transition-colors">
              Productos
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/ropa" className="hover:text-slate-900 transition-colors">
              Ropa
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {categoriaActiva === 'todos' ? (
              <span className="text-slate-900 font-bold">
                Shorts ({SHORTS_POLIESTER.length + SHORTS_WIN.length})
              </span>
            ) : (
              <>
                <Link to="/ropa/shorts" className="hover:text-slate-900 transition-colors">
                  Shorts
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-900 font-bold">
                  {categoriaActiva === 'clasicos'
                    ? `Shorts Clásicos (${SHORTS_POLIESTER.length})`
                    : `Shorts Deportivos (${SHORTS_WIN.length})`}
                </span>
              </>
            )}
          </div>
        </nav>

        {/* 2 TARJETAS DESTACADAS: Clásicos Polistrech & Deportivos Win */}
        {categoriaActiva === 'todos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div
              onClick={() => cambiarCategoria('clasicos')}
              className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-900 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
                    36 Combinaciones
                  </span>
                  <span className="text-xs font-bold text-slate-500">Tela Polistrech</span>
                </div>
                <h3 className="font-black text-lg text-slate-950 group-hover:text-blue-900 transition-colors">
                  Shorts Clásicos Polistrech
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  12 colores principales con 36 variantes de rayas. Tela elástica, fresca, suave y bolsillos reforzados con cierre.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Ver solo Clásicos</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => cambiarCategoria('deportivos')}
              className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-900 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                    11 Modelos de Clubes
                  </span>
                  <span className="text-xs font-bold text-slate-500">Tela Win Deportiva</span>
                </div>
                <h3 className="font-black text-lg text-slate-950 group-hover:text-blue-900 transition-colors">
                  Shorts Deportivos Tela Win
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ediciones de Real Madrid, Barcelona, Selección Argentina, Bayern y más. Microperforada, ultra ligera y transpirable.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-900">
                <span>Ver solo Deportivos</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        )}

        {/* Barra de Búsqueda y Filtros de Categoría */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl w-full sm:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => cambiarCategoria('todos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                categoriaActiva === 'todos'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({SHORTS_POLIESTER.length + SHORTS_WIN.length})
            </button>

            <button
              type="button"
              onClick={() => cambiarCategoria('clasicos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                categoriaActiva === 'clasicos'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shorts Clásicos Polistrech ({SHORTS_POLIESTER.length})
            </button>

            <button
              type="button"
              onClick={() => cambiarCategoria('deportivos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                categoriaActiva === 'deportivos'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shorts Deportivos ({SHORTS_WIN.length})
            </button>
          </div>

          {/* Input de Búsqueda */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por color, equipo o rayas..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-black cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Modal de telas link */}
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => setModalTelasAbierto(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Saber más sobre la tela Polistrech vs Win</span>
          </button>
        </div>

        {/* Sin resultados */}
        {totalResultados === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500 my-6">
            <Filter className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-slate-800 text-sm">No se encontraron productos con ese término</p>
            <p className="text-xs text-slate-500 mt-1">
              Prueba buscando por color como &quot;Negro&quot;, &quot;Azul&quot; o por club como &quot;Real Madrid&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setBusqueda('');
                cambiarCategoria('todos');
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-black"
            >
              Ver todo el catálogo
            </button>
          </div>
        )}

        {/* 4.1 SHORTS CLÁSICOS */}
        {coloresClasicosFiltrados.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Shorts Clásicos Polistrech
                </h2>
                <p className="text-xs text-slate-500">
                  Selecciona el color de rayas o haz clic en la foto para ver la ficha completa y compartir.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {coloresClasicosFiltrados.map((colorShort, idx) => {
                const estado = estadoClasicos[colorShort] || {
                  colorRayas: getRayasPorColorShort(colorShort)[0] || '',
                  talla: 'M' as Talla,
                  cantidad: 1,
                };

                const rayasDisponibles = getRayasPorColorShort(colorShort);
                const productoActivo =
                  findProductoPoliester(colorShort, estado.colorRayas) ||
                  findProductoPoliester(colorShort, rayasDisponibles[0]);

                if (!productoActivo) return null;

                const hexInfo = COLOR_HEX_MAP[colorShort] || {
                  bg: '#0f172a',
                  text: '#ffffff',
                };
                const slugProducto = getProductSlug(productoActivo);

                return (
                  <article
                    key={`${categoriaActiva}-${busqueda}-${colorShort}`}
                    style={{ animationDelay: `${Math.min(idx * 35, 350)}ms` }}
                    className="animate-card-stagger bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
                  >
                    {/* FOTO GRANDE Y NÍTIDA CON ENLACE DIRECTO */}
                    <div className="relative aspect-4/3 sm:aspect-square bg-slate-100 overflow-hidden">
                      <Link
                        to={`/producto/${slugProducto}`}
                        title={`Ver página individual de ${productoActivo.nombre}`}
                        className="block w-full h-full cursor-pointer"
                      >
                        <img
                          src={productoActivo.imagen}
                          alt={`Short ${colorShort} con rayas ${estado.colorRayas}`}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                        />
                      </Link>

                      {/* Badge de color */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg shadow-xs text-xs font-black text-slate-900 pointer-events-none">
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block border border-black/10 shrink-0"
                          style={{ backgroundColor: hexInfo.bg }}
                        />
                        <span>{colorShort}</span>
                      </div>

                      {/* Botón Zoom */}
                      <button
                        type="button"
                        onClick={() => setModalFoto(productoActivo)}
                        className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 hover:text-black rounded-lg shadow-xs cursor-pointer transition-colors"
                        aria-label={`Ver foto ampliada de short ${colorShort}`}
                        title="Ampliar foto"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-slate-900/80 backdrop-blur-sm text-white rounded text-[10px] font-bold">
                        Rayas: {estado.colorRayas}
                      </div>

                      <Link
                        to={`/producto/${slugProducto}`}
                        className="absolute bottom-3 right-3 px-2.5 py-1 bg-blue-600/90 hover:bg-blue-600 backdrop-blur-sm text-white rounded-lg text-[10px] font-black flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <span>Ficha</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* CONTROLES INTERACTIVOS DIRECTOS */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        {/* Selector de color de rayas */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-bold text-slate-700">Color de Rayas:</span>
                            <span className="text-[11px] font-bold text-slate-900">
                              {estado.colorRayas}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {rayasDisponibles.map((raya) => {
                              const esSeleccionada = estado.colorRayas.toLowerCase() === raya.toLowerCase();
                              const rayaHex = COLOR_HEX_MAP[raya] || { bg: '#64748b', text: '#ffffff' };

                              return (
                                <button
                                  key={raya}
                                  type="button"
                                  onClick={() => handleCambiarRayaClasico(colorShort, raya)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                    esSeleccionada
                                      ? 'bg-slate-900 text-white shadow-xs'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  <span
                                    className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                                    style={{ backgroundColor: rayaHex.bg }}
                                  />
                                  <span>{raya}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Selector de Tallas */}
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-bold text-slate-700">Talla:</span>
                            <span className="text-[10px] text-slate-400">
                              Cintura: {GUIA_TALLAS[estado.talla]?.cintura} cm
                            </span>
                          </div>
                          <div className="grid grid-cols-5 gap-1.5">
                            {TALLAS_DISPONIBLES.map((t) => {
                              const disponible = estaTallaDisponible(productoActivo, t);
                              const seleccionada = estado.talla === t;

                              return (
                                <button
                                  key={t}
                                  type="button"
                                  disabled={!disponible}
                                  onClick={() => handleCambiarTallaClasico(colorShort, t)}
                                  className={`py-1.5 text-xs font-black rounded-lg transition-all text-center cursor-pointer ${
                                    seleccionada
                                      ? 'bg-slate-900 text-white shadow-xs'
                                      : disponible
                                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                      : 'bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                                  }`}
                                >
                                  {t}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Cantidad + Agregar + Enlace Ficha */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                            <button
                              type="button"
                              onClick={() => handleCambiarCantidadClasico(colorShort, -1)}
                              className="p-2 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              aria-label="Restar una unidad"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-black text-xs text-slate-900">
                              {estado.cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCambiarCantidadClasico(colorShort, 1)}
                              className="p-2 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              aria-label="Sumar una unidad"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              agregarAlCarrito(productoActivo, estado.talla, estado.cantidad)
                            }
                            className="flex-1 py-2 px-3 bg-slate-900 hover:bg-black active:scale-98 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Agregar</span>
                          </button>
                        </div>

                        <Link
                          to={`/producto/${slugProducto}`}
                          className="w-full py-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>Ver ficha completa y compartir</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* 4.2 SHORTS DEPORTIVOS (WIN) */}
        {gruposWinFiltrados.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Shorts Deportivos (Tela Win de Clubes y Selecciones)
                </h2>
                <p className="text-xs text-slate-500">
                  Tejido deportivo transpirable. Selecciona versión (V1/V2) o abre la página individual del modelo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gruposWinFiltrados.map((grupo, idx) => {
                const estado = estadoGruposWin[grupo.id] || {
                  versionId: grupo.versiones[0].id,
                  cantidad: 1,
                  talla: 'L' as Talla,
                };
                const versionActiva =
                  grupo.versiones.find((v) => v.id === estado.versionId) || grupo.versiones[0];
                const productoActivo = versionActiva.producto;

                const baseDelay = categoriaActiva === 'todos' && coloresClasicosFiltrados.length > 0 ? 80 : 0;
                const delay = Math.min(baseDelay + idx * 35, 360);
                const slugProducto = getProductSlug(productoActivo);

                return (
                  <article
                    key={`${categoriaActiva}-${busqueda}-${grupo.id}`}
                    style={{ animationDelay: `${delay}ms` }}
                    className="animate-card-stagger bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
                  >
                    {/* FOTO GRANDE Y NÍTIDA */}
                    <div className="relative aspect-4/3 sm:aspect-square bg-slate-100 overflow-hidden">
                      <Link
                        to={`/producto/${slugProducto}`}
                        title={`Ver página individual de ${productoActivo.nombre}`}
                        className="block w-full h-full cursor-pointer"
                      >
                        <img
                          src={productoActivo.imagen}
                          alt={productoActivo.nombre}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                        />
                      </Link>

                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg shadow-xs text-xs font-black text-slate-900 pointer-events-none">
                        <span>{grupo.equipo}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setModalFoto(productoActivo)}
                        className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 hover:text-black rounded-lg shadow-xs cursor-pointer transition-colors"
                        aria-label={`Ver foto ampliada de ${productoActivo.nombre}`}
                        title="Ampliar foto"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>

                      <Link
                        to={`/producto/${slugProducto}`}
                        className="absolute bottom-3 right-3 px-2.5 py-1 bg-amber-500/90 hover:bg-amber-500 backdrop-blur-sm text-slate-950 rounded-lg text-[10px] font-black flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <span>Ficha</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* CONTROLES */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        {/* Título y versión */}
                        <div className="mb-2">
                          <h3 className="font-black text-sm text-slate-900">{productoActivo.nombre}</h3>
                          <p className="text-[11px] text-slate-500">{versionActiva.subtitulo}</p>
                        </div>

                        {/* Botones de versiones V1 / V2 si aplica */}
                        {grupo.versiones.length > 1 && (
                          <div className="mb-3">
                            <span className="text-[11px] font-bold text-slate-700 block mb-1">
                              Versión:
                            </span>
                            <div className="flex gap-2">
                              {grupo.versiones.map((v) => {
                                const esActiva = v.id === versionActiva.id;
                                return (
                                  <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => handleCambiarVersionWin(grupo.id, v.id)}
                                    className={`px-3 py-1 text-xs font-black rounded-lg border transition-all cursor-pointer ${
                                      esActiva
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    {v.etiqueta} ({v.subtitulo.split('/')[0].trim()})
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Talla */}
                        <div>
                          <span className="text-[11px] font-bold text-slate-700 block mb-1">
                            Talla disponible:
                          </span>
                          <div className="flex gap-2">
                            {productoActivo.tallasDisponibles.map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => handleCambiarTallaWin(grupo.id, t)}
                                className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                                  estado.talla === t
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Cantidad + Agregar + Enlace Ficha */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                            <button
                              type="button"
                              onClick={() => handleCambiarCantidadWin(grupo.id, -1)}
                              className="p-2 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              aria-label="Restar una unidad"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-black text-xs text-slate-900">
                              {estado.cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCambiarCantidadWin(grupo.id, 1)}
                              className="p-2 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              aria-label="Sumar una unidad"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              agregarAlCarrito(productoActivo, estado.talla, estado.cantidad)
                            }
                            className="flex-1 py-2 px-3 bg-slate-900 hover:bg-black active:scale-98 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Agregar</span>
                          </button>
                        </div>

                        <Link
                          to={`/producto/${slugProducto}`}
                          className="w-full py-1.5 text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>Ver ficha completa y compartir</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECCIÓN 2: GUÍA DE TALLAS                                */}
        {/* ======================================================== */}
        <section id="guia-tallas" aria-label="Guía de tallas" className="mb-12 scroll-mt-20">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Ruler className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Guía de Tallas Oficial Pool Store
                  </h2>
                  <p className="text-xs text-slate-500">
                    Referencia exacta de medidas para elegir tu talla con total seguridad.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-slate-50 text-xs">
                {Object.entries(GUIA_TALLAS).map(([t, info]) => (
                  <div key={t} className="flex justify-between items-center p-3.5 hover:bg-slate-100/60 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                        {t}
                      </span>
                      <span className="font-black text-slate-900 text-sm">{info.tallaNumero}</span>
                    </div>
                    <span className="text-slate-600 font-medium">
                      Cintura con elástico: <strong>{info.cintura} cm</strong>
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <strong className="text-slate-900 block font-bold">Shorts Clásicos (Polistrech)</strong>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Tela elástica suave con pretina reforzada y cordón regulable. Tallas desde XS hasta XL.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <strong className="text-emerald-900 block font-bold">Shorts Deportivos (Win)</strong>
                  <p className="text-emerald-700 text-[11px] leading-relaxed">
                    Talla estándar, tejido de alto rendimiento y secado rápido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 3: PUNTOS DE ENTREGA EN CHICLAYO                 */}
        {/* ======================================================== */}
        <section id="lugares-entrega" aria-label="Lugares de entrega" className="mb-12 scroll-mt-20">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Truck className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Lugares de Entrega en Chiclayo
                  </h2>
                  <p className="text-xs text-slate-500">
                    Puntos céntricos de encuentro sin costo adicional y entrega rápida en Zonas cercanas.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PUNTOS_CENTRICOS_CHICLAYO.map((pto) => (
                  <div
                    key={pto.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start gap-3 hover:border-slate-300 transition-colors"
                  >
                    <span className="text-2xl shrink-0">{pto.icono}</span>
                    <div>
                      <h3 className="font-black text-sm text-slate-900">{pto.nombre}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{pto.detalle}</p>
                      <span className="inline-block mt-2 text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        Entrega S/ 0.00 Gratis
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 4: HORARIOS DE ATENCIÓN                          */}
        {/* ======================================================== */}
        <section id="horarios-atencion" aria-label="Horarios de atención" className="mb-12 scroll-mt-20">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-xs">
                <Clock className="w-6 h-6 text-emerald-400" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
                  Atención Continua
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Horarios de Atención
                </h2>
                <p className="text-base font-extrabold text-slate-800 mt-1">
                  Atendemos todos los días, de lunes a domingo.
                </p>
              </div>

              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Estamos a tu disposición para responder dudas, verificar stock de modelos y tallas, y programar tus entregas o envíos sin complicaciones.
              </p>

              <div className="pt-2">
                <a
                  href={`https://wa.me/51${POLESTORE_PHONE_DISPLAY.replace(/\D/g, '')}?text=Hola%20Pool%20Store%20%F0%9F%91%8B%2C%20deseo%20consultar%20disponibilidad%20para%20coordinar%20un%20pedido.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-black shadow-md hover:shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar disponibilidad y coordinar pedidos</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 5: QUIÉNES SOMOS                                 */}
        {/* ======================================================== */}
        <section id="quienes-somos" aria-label="Quiénes somos" className="mb-12 scroll-mt-20">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Quiénes Somos
                  </h2>
                  <p className="text-xs text-slate-500">
                    Conoce más sobre Pool Store.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-slate-800 text-sm leading-relaxed font-medium">
                  Somos <strong>POOL STORE</strong>, una tienda 100 % virtual dedicada a ofrecer productos de calidad a precios accesibles. Actualmente contamos con shorts clásicos y deportivos, y próximamente incorporaremos nuevos productos a nuestro catálogo. Compras fáciles, atención directa y entregas coordinadas en Chiclayo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center">
                <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200/50">
                  <strong className="text-slate-900 block font-black">100 % Virtual</strong>
                  <span className="text-slate-500 text-[11px]">Compra rápida desde tu celular</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200/50">
                  <strong className="text-slate-900 block font-black">Atención Directa</strong>
                  <span className="text-slate-500 text-[11px]">Coordinación personalizada</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200/50">
                  <strong className="text-slate-900 block font-black">Precios Accesibles</strong>
                  <span className="text-slate-500 text-[11px]">Calidad garantizada</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* 5. FOOTER OFICIAL */}
      <Footer />
    </div>
  );
}
