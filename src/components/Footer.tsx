import React from 'react';
import { Link } from 'react-router-dom';
import { POLESTORE_PHONE_DISPLAY, getWhatsAppUrl } from '../utils/whatsapp';
import {
  MapPin,
  Truck,
  MessageCircle,
  Phone,
  Clock,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 font-montserrat border-t border-slate-800">
      {/* 1. Value Props Ribbon */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-white">Calidad comprobada</p>
              <p className="text-[11px] text-slate-400">Telas Polistrech y Win seleccionadas</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-white">Promociones reales</p>
              <p className="text-[11px] text-slate-400">1x S/ 25, 3x S/ 69, 12x S/ 240</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-white">Entregas y Envíos</p>
              <p className="text-[11px] text-slate-400">Chiclayo céntrico y Shalom Perú</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-teal-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-white">Atención directa</p>
              <p className="text-[11px] text-slate-400">WhatsApp oficial {POLESTORE_PHONE_DISPLAY}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-slate-950 flex items-center justify-center font-black text-lg">
                P
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-tight block">POOL STORE</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Tu tienda virtual
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Tu tienda virtual multiproducto. Seleccionamos artículos de calidad a precios accesibles, con atención personalizada, pedidos rápidos por WhatsApp y entregas coordinadas en Chiclayo y todo el Perú.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppUrl('¡Hola POOL STORE! Deseo consultar sobre sus productos y envíos.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir por WhatsApp: {POLESTORE_PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>

          {/* Links Navegación */}
          <div className="space-y-3">
            <p className="font-bold text-xs uppercase tracking-wider text-white">Navegación</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>Inicio</span>
                </Link>
              </li>
              <li>
                <Link to="/productos" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>Todos los productos</span>
                </Link>
              </li>
              <li>
                <Link to="/ropa" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>Categoría Ropa</span>
                </Link>
              </li>
              <li>
                <Link to="/ropa/shorts" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>Colección Shorts (47)</span>
                </Link>
              </li>
              <li>
                <Link to="/ropa/shorts/clasicos" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>Shorts Clásicos Polistrech</span>
                </Link>
              </li>
              <li>
                <Link to="/ropa/shorts/deportivos" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>Shorts Deportivos Win</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Entregas y Puntos */}
          <div className="space-y-3">
            <p className="font-bold text-xs uppercase tracking-wider text-white">Entregas y Envíos</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Punto de encuentro: <strong>Plaza Cívica</strong> (JLO)</span>
              </li>
              <li className="flex items-start gap-2">
                <Truck className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <span>Delivery: <strong>S/ 1.50 por km</strong> desde el centro de Chiclayo (Balta y Arica)</span>
              </li>
              <li className="flex items-start gap-2">
                <Truck className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                <span>Envíos a todo el Perú por Shalom</span>
              </li>
            </ul>
            <div className="pt-1">
              <Link
                to="/entregas"
                className="text-[11px] text-teal-400 hover:text-teal-300 font-bold inline-flex items-center gap-1"
              >
                <span>Ver calculador y detalles</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Información y Confianza */}
          <div className="space-y-3">
            <p className="font-bold text-xs uppercase tracking-wider text-white">Nosotros & Ayuda</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/nosotros" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>Sobre POOL STORE</span>
                </Link>
              </li>
              <li>
                <Link to="/entregas" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <span>Tiempos de envío</span>
                </Link>
              </li>
              <li className="pt-2">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] space-y-1">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pagos aceptados</span>
                  </p>
                  <p className="text-slate-400 text-[10px] leading-relaxed">
                    Yape, Plin, Transferencias BCP / Interbank / BBVA y efectivo contraentrega.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright */}
      <div className="border-t border-slate-900 py-6 px-4 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} POOL STORE. Todos los derechos reservados. Tienda virtual peruana.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
            <span>Ropa</span>
            <span>·</span>
            <span>Shorts Clásicos</span>
            <span>·</span>
            <span>Shorts Deportivos</span>
            <span>·</span>
            <span>Chiclayo & Perú</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
