import React from 'react';
import { Link } from 'react-router-dom';
import { getWhatsAppUrl } from '../utils/whatsapp';
import {
  MapPin,
  Truck,
  CreditCard,
  ChevronRight,
  ArrowUpRight,
  Headphones,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 font-montserrat border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand Info & Support */}
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
              Tu tienda virtual multiproducto. Artículos seleccionados con calidad y precios accesibles, atención personalizada y entregas coordinadas en Chiclayo y todo el Perú.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppUrl('¡Hola POOL STORE! Vengo de su tienda virtual y deseo comunicarme con soporte.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <Headphones className="w-4 h-4 text-emerald-400" />
                <span>Atención y Soporte por WhatsApp</span>
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

          {/* Entregas y Puntos en Chiclayo */}
          <div className="space-y-3">
            <p className="font-bold text-xs uppercase tracking-wider text-white">Puntos de Entrega</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Plaza Cívica (JLO)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Catedral (Parque Principal)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Banco de la Nación (JLO)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>La Plazuela (Elías Aguirre)</span>
              </li>
              <li className="flex items-start gap-2 pt-1 border-t border-slate-900">
                <Truck className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <span>Delivery: Confirmado por WhatsApp</span>
              </li>
              <li className="flex items-start gap-2">
                <Truck className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                <span>Envíos nacionales por Shalom</span>
              </li>
            </ul>
            <div className="pt-1">
              <Link
                to="/entregas"
                className="text-[11px] text-teal-400 hover:text-teal-300 font-bold inline-flex items-center gap-1"
              >
                <span>Ver puntos y zonas de entrega</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Métodos de Pago */}
          <div className="space-y-3">
            <p className="font-bold text-xs uppercase tracking-wider text-white">Medios de Pago</p>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-white">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Pagos seguros</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Aceptamos billeteras digitales (Yape, Plin), transferencias directas (BCP, Interbank, BBVA) y pago contraentrega en puntos céntricos.
              </p>
              <div className="pt-1 border-t border-slate-800 text-[10px] text-emerald-400 font-semibold">
                ✓ Sin cobros extra por comisiones
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-900 py-6 px-4 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} POOL STORE. Todos los derechos reservados. Tienda virtual peruana.</p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
            <span>Ropa</span>
            <span>·</span>
            <span>Shorts</span>
            <span>·</span>
            <span>Chiclayo</span>
            <span>·</span>
            <span>Envíos Perú</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
