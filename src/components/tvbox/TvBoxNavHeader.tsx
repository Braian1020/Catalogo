import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, HelpCircle, MessageCircle, ChevronRight, Home } from 'lucide-react';
import { getTvBoxWhatsAppUrl, TV_BOX_CONFIG } from '../../data/tvBoxData';

interface TvBoxNavHeaderProps {
  currentTab: 'comprar' | 'ayuda';
}

export default function TvBoxNavHeader({ currentTab }: TvBoxNavHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200 text-slate-900 font-montserrat sticky top-16 z-30 shadow-xs">
      {/* Barra de migas de pan y contacto rápido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100">
        <nav aria-label="Migas de pan" className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Link to="/" className="hover:text-slate-950 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Inicio</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/productos" className="hover:text-slate-950 transition-colors">
            Productos
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/tecnologia" className="hover:text-slate-950 transition-colors">
            Tecnología
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-950 font-bold truncate">
            {currentTab === 'comprar' ? 'Sistema Android TV Box' : 'Centro de Ayuda TV Box'}
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-slate-500 text-[11px]">¿Dudas sobre el equipo?</span>
          <a
            href={getTvBoxWhatsAppUrl(`¡Hola POOL STORE! Deseo consultar información sobre el Sistema Android TV Box (${TV_BOX_CONFIG.precioEquipo} con delivery gratis).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors font-bold text-[11px]"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Asesoría por WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Tabs principales de la sección comercial y soporte */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-xs shadow-xs">
            TV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black tracking-tight text-slate-950">
                SISTEMA ANDROID TV BOX
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                {TV_BOX_CONFIG.precioEquipo} · Delivery Gratis
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Transforma tu televisor sin comprar uno nuevo
            </p>
          </div>
        </div>

        {/* Dos botones solicitados en el menú principal */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <Link
            to="/tecnologia/sistemas-tv-box"
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              currentTab === 'comprar'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>COMPRAR TV BOX</span>
          </Link>

          <Link
            to="/tecnologia/sistemas-tv-box/ayuda"
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              currentTab === 'ayuda'
                ? 'bg-cyan-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>SOY COMPRADOR</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
