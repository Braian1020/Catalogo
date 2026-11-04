import React, { useState } from 'react';
import { TIPOS_DE_TV, TipoTvOpcion, getTvBoxWhatsAppUrl } from '../../data/tvBoxData';
import {
  Tv,
  History,
  Monitor,
  Layers,
  Radio,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  HelpCircle,
  Cable,
} from 'lucide-react';

export default function TvCompatibilitySelector() {
  const [selectedTvId, setSelectedTvId] = useState<string>('smart-desactualizada');

  const selectedTv: TipoTvOpcion =
    TIPOS_DE_TV.find((t) => t.id === selectedTvId) || TIPOS_DE_TV[0];

  const renderIcon = (id: string, className: string = 'w-5 h-5') => {
    switch (id) {
      case 'smart-moderna':
        return <Tv className={className} />;
      case 'smart-desactualizada':
        return <History className={className} />;
      case 'led-lcd-sin-smart':
        return <Monitor className={className} />;
      case 'plasma':
        return <Layers className={className} />;
      case 'tubo-culona':
        return <Radio className={className} />;
      default:
        return <Tv className={className} />;
    }
  };

  const whatsappMessage = `¡Hola POOL STORE! Tengo un televisor tipo "${selectedTv.nombre}" y deseo verificar la compatibilidad y cables necesarios para conectar el Sistema Android TV Box (S/ 250 con delivery gratis).`;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 text-slate-900 shadow-sm">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Verificador de Compatibilidad</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          ¿QUÉ TIPO DE TELEVISOR TIENES?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Selecciona tu pantalla a continuación para ver exactamente los requisitos y cables que necesitarás para conectarlo.
        </p>
      </div>

      {/* Selector de opciones de televisor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        {TIPOS_DE_TV.map((tv) => {
          const isSelected = selectedTvId === tv.id;
          return (
            <button
              key={tv.id}
              type="button"
              onClick={() => setSelectedTvId(tv.id)}
              className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between border active:scale-[0.98] ${
                isSelected
                  ? 'bg-slate-950 border-slate-950 text-white shadow-md'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    isSelected ? 'bg-white text-slate-950' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {renderIcon(tv.id)}
                </div>
                <div className="font-bold text-sm leading-snug">{tv.nombre}</div>
              </div>
              <div
                className={`text-[11px] font-semibold mt-3 pt-2 border-t flex items-center gap-1 ${
                  isSelected
                    ? 'border-slate-800 text-slate-200'
                    : 'border-slate-200 text-slate-500'
                }`}
              >
                {tv.esCompatibleDirecto ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>HDMI Directo</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Requiere AV/RCA</span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detalle dinámico del televisor seleccionado */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 text-white">
                {selectedTv.nombre}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 flex items-center gap-1.5">
                <Cable className="w-3.5 h-3.5 text-blue-600" />
                <span>{selectedTv.conexionRequerida}</span>
              </span>
            </div>

            <h4 className="text-lg font-black text-slate-950">
              Requisitos y diagnóstico de conexión
            </h4>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedTv.instrucciones}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Incluye Cable HDMI 1m en el paquete</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Configuración previa incluida</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <a
              href={getTvBoxWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consultar compatibilidad por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
