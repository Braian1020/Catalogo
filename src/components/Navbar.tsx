import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getWhatsAppUrl } from '../utils/whatsapp';
import {
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  Truck,
  Compass,
  Home,
  Headphones,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface NavbarProps {
  hideBanner?: boolean;
}

export default function Navbar({ hideBanner = false }: NavbarProps) {
  const { setModalCarritoAbierto, totalPrendas } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cerrar el menú automáticamente al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Bloquear el scroll de fondo mientras el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    {
      label: 'Inicio',
      path: '/',
      icon: Home,
      sublabel: 'Página principal de POOL STORE',
    },
    {
      label: 'Productos',
      path: '/productos',
      icon: Compass,
      sublabel: 'Catálogo general, ropa y colecciones',
    },
    {
      label: 'Entregas',
      path: '/entregas',
      icon: Truck,
      sublabel: 'Puntos céntricos, delivery y envíos Shalom',
    },
  ];

  const handleAbrirCarrito = () => {
    setMobileMenuOpen(false);
    setModalCarritoAbierto(true);
  };

  return (
    <>
      {/* 1. TOP MARQUEE BANNER */}
      {!hideBanner && (
        <div className="bg-slate-950 text-white text-[11px] sm:text-xs py-2 px-3 border-b border-slate-800 text-center font-bold tracking-tight">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-amber-400 mx-auto">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              <span>
                🔥 Promociones: <strong>1x S/ 25</strong> · <strong>3x S/ 69</strong> · <strong>12x S/ 240</strong> | Entregas coordinadas en Chiclayo y todo el Perú
              </span>
            </span>
          </div>
        </div>
      )}

      {/* 2. MAIN HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-900 group"
            title="POOL STORE - Tu tienda virtual"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-slate-800 transition-colors">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-lg tracking-tight leading-none text-slate-900 group-hover:text-blue-900 transition-colors">
                POOL STORE
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase leading-tight mt-0.5">
                Tu tienda virtual
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons: Support, Cart & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ícono de Soporte en lugar del número */}
            <a
              href={getWhatsAppUrl('¡Hola POOL STORE! Vengo de su tienda virtual y deseo comunicarme con soporte.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-950 transition-colors cursor-pointer"
              title="Soporte y Atención al Cliente"
              aria-label="Soporte y Atención al Cliente"
            >
              <Headphones className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline font-bold">Soporte</span>
            </a>

            {/* Botón Mi Pedido */}
            <button
              type="button"
              onClick={handleAbrirCarrito}
              className="relative px-3 sm:px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
              aria-label={`Ver pedido actual (${totalPrendas} prendas)`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline font-bold">Mi pedido</span>
              {totalPrendas > 0 ? (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black flex items-center justify-center shadow-xs">
                  {totalPrendas}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">(0)</span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-800 hover:text-black hover:bg-slate-100 rounded-xl md:hidden transition-colors cursor-pointer active:scale-90"
              aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-900 transition-transform duration-200 rotate-90 animate-in" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* 3. MOBILE FULL-SCREEN RESPONSIVE OVERLAY & MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 z-50 flex flex-col">
            {/* Backdrop con desenfoque suave para cerrar al hacer clic fuera */}
            <div
              className="fixed inset-0 top-16 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Contenedor del menú a pantalla completa */}
            <div className="relative w-full h-full bg-white flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-top-3 duration-250 ease-out">
              
              {/* Lista de enlaces con áreas táctiles generosas */}
              <div className="p-4 space-y-2">
                <div className="px-2 pb-1 flex items-center justify-between">
                  <span className="text-[11px] uppercase font-black tracking-wider text-slate-400">
                    Menú Principal
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Toca para navegar
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {navLinks.map((item) => {
                    const IconComponent = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-150 active:scale-[0.98] ${
                          active
                            ? 'bg-slate-950 text-white shadow-sm ring-1 ring-slate-900'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              active
                                ? 'bg-slate-800 text-emerald-400'
                                : 'bg-white text-slate-700 shadow-2xs border border-slate-200'
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="font-black text-sm tracking-tight leading-tight">
                              {item.label}
                            </span>
                            <span
                              className={`text-[11px] leading-tight mt-0.5 ${
                                active ? 'text-slate-300' : 'text-slate-500'
                              }`}
                            >
                              {item.sublabel}
                            </span>
                          </div>
                        </div>

                        <ChevronRight
                          className={`w-5 h-5 shrink-0 transition-transform ${
                            active ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        />
                      </Link>
                    );
                  })}
                </div>

                {/* Acceso rápido a Mi Pedido dentro del menú móvil */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAbrirCarrito}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all text-emerald-950 active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm leading-tight text-emerald-950">
                            Ver mi pedido
                          </span>
                          {totalPrendas > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                              {totalPrendas} prendas
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-emerald-800 mt-0.5">
                          {totalPrendas > 0 ? 'Revisa tus artículos seleccionados' : 'Tu carrito está listo para agregar'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-emerald-700 shrink-0" />
                  </button>
                </div>
              </div>

              {/* Botón Soporte con ícono en la base del menú móvil */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/80">
                <a
                  href={getWhatsAppUrl('¡Hola POOL STORE! Vengo de su tienda virtual y deseo comunicarme con soporte.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all active:scale-[0.98]"
                >
                  <Headphones className="w-4 h-4 text-emerald-400" />
                  <span>Soporte y Atención al Cliente</span>
                </a>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  POOL STORE · Compras fáciles y entregas coordinadas
                </p>
              </div>

            </div>
          </div>
        )}
      </header>
    </>
  );
}
