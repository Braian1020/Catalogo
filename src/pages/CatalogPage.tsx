import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PromotionsInteractiveBanner from '../components/PromotionsInteractiveBanner';
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
import { useCart } from '../context/CartContext';
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

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* Breadcrumb de navegación jerárquica con enlaces clicables y botón regresar */}
        <nav aria-label="Ruta de navegación">
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

        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {categoriaActiva === 'clasicos'
                ? 'Shorts Clásicos Polistrech'
                : categoriaActiva === 'deportivos'
                ? 'Shorts Deportivos Tela Win'
                : 'Colección de Shorts'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {categoriaActiva === 'clasicos'
                ? '12 colores y 36 combinaciones de rayas con bolsillos con cierre. Tela elástica y fresca.'
                : categoriaActiva === 'deportivos'
                ? '11 diseños oficiales y alternativos en tela Win microperforada de alta transpirabilidad.'
                : '47 modelos disponibles para deporte, entrenamiento y uso casual con entregas en Chiclayo y Perú.'}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={() => cambiarCategoria('todos')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoriaActiva === 'todos'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-800'
              }`}
            >
              Todos ({SHORTS_POLIESTER.length + SHORTS_WIN.length})
            </button>
            <button
              type="button"
              onClick={() => cambiarCategoria('clasicos')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoriaActiva === 'clasicos'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-800'
              }`}
            >
              Shorts Clásicos ({SHORTS_POLIESTER.length})
            </button>
            <button
              type="button"
              onClick={() => cambiarCategoria('deportivos')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoriaActiva === 'deportivos'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-800'
              }`}
            >
              Shorts Deportivos ({SHORTS_WIN.length})
            </button>
          </div>
        </div>

        {/* BANNER DE PROMOCIONES VISIBLES, ENTENDIBLES, LLAMATIVAS Y ENTRETENIDAS */}
        <PromotionsInteractiveBanner tipo={categoriaActiva} className="mb-6" />

        {/* Barra de Búsqueda */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por color, equipo o rayas..."
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs"
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
          <span className="text-xs font-bold text-slate-500">
            Mostrando {totalResultados} {totalResultados === 1 ? 'modelo' : 'modelos'}
          </span>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Shorts Clásicos
                </h2>
                <p className="text-xs text-slate-500">
                  Tela Polistrech elástica, suave y fresca con bolsillos con cierre reforzado.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200 shadow-xs">
                  1x S/ 15 · 6x S/ 81 · 12x S/ 144
                </span>
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
                    {/* FOTO CON MARGEN Y SIN RECORTAR */}
                    <div className="relative aspect-square bg-slate-50 overflow-hidden flex items-center justify-center p-4">
                      <Link
                        to={`/producto/${slugProducto}`}
                        title={`Ver ficha de ${productoActivo.nombre}`}
                        className="w-full h-full flex items-center justify-center cursor-pointer"
                      >
                        <img
                          src={productoActivo.imagen}
                          alt={productoActivo.nombre}
                          loading="lazy"
                          className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setModalFoto(productoActivo)}
                        className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 hover:bg-white text-slate-600 rounded-lg shadow-xs cursor-pointer transition-colors"
                        title="Ampliar foto"
                        aria-label="Ampliar foto"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* CONTROLES DIRECTOS Y LIMPIOS */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        {/* Título y Precio */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Link
                            to={`/producto/${slugProducto}`}
                            className="font-bold text-sm text-slate-900 hover:text-blue-900 transition-colors"
                          >
                            Short {colorShort}
                          </Link>
                          <span className="text-sm font-black text-slate-950">
                            S/ 15.00
                          </span>
                        </div>

                        {/* Selector de color de rayas directo */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-semibold text-slate-700">Rayas:</span>
                            <span className="text-[11px] font-bold text-slate-900">
                              {estado.colorRayas}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {rayasDisponibles.map((raya) => {
                              const esSeleccionada = estado.colorRayas.toLowerCase() === raya.toLowerCase();

                              return (
                                <button
                                  key={raya}
                                  type="button"
                                  onClick={() => handleCambiarRayaClasico(colorShort, raya)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    esSeleccionada
                                      ? 'bg-slate-950 text-white shadow-xs'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {raya}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Shorts Deportivos
                </h2>
                <p className="text-xs text-slate-500">
                  Tela Win deportiva microperforada, ligera, transpirable y de secado rápido.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-black border border-blue-200 shadow-xs">
                  1x S/ 25 · 3x S/ 69 · 12x S/ 240
                </span>
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
                    {/* FOTO CON MARGEN Y SIN RECORTAR */}
                    <div className="relative aspect-square bg-slate-50 overflow-hidden flex items-center justify-center p-4">
                      <Link
                        to={`/producto/${slugProducto}`}
                        title={`Ver ficha de ${productoActivo.nombre}`}
                        className="w-full h-full flex items-center justify-center cursor-pointer"
                      >
                        <img
                          src={productoActivo.imagen}
                          alt={productoActivo.nombre}
                          loading="lazy"
                          className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setModalFoto(productoActivo)}
                        className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 hover:bg-white text-slate-600 rounded-lg shadow-xs cursor-pointer transition-colors"
                        title="Ampliar foto"
                        aria-label="Ampliar foto"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* CONTROLES DIRECTOS */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        {/* Título y Precio */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div>
                            <Link
                              to={`/producto/${slugProducto}`}
                              className="font-bold text-sm text-slate-900 hover:text-blue-900 transition-colors block"
                            >
                              {productoActivo.nombre}
                            </Link>
                            <span className="text-[11px] text-slate-500">{versionActiva.subtitulo}</span>
                          </div>
                          <span className="text-sm font-black text-slate-950 shrink-0">
                            S/ 25.00
                          </span>
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

      </main>

      {/* 5. FOOTER OFICIAL */}
      <Footer />
    </div>
  );
}
