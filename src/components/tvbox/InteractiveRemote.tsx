import React, { useState } from 'react';
import {
  BOTONES_CONTROL_REMOTO,
  BotonControlRemoto,
} from '../../data/tvBoxData';
import {
  Power,
  Home,
  CornerUpLeft,
  Compass,
  Check,
  Volume2,
  VolumeX,
  Settings,
  MousePointer,
  Info,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function InteractiveRemote() {
  const [selectedButtonId, setSelectedButtonId] = useState<string>('power');

  const selectedButton =
    BOTONES_CONTROL_REMOTO.find((b) => b.id === selectedButtonId) ||
    BOTONES_CONTROL_REMOTO[0];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 text-slate-900 shadow-sm">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Simulador Interactivo del Control Remoto</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
          Aprende a utilizar cada botón de tu control
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Haz clic o pulsa sobre cualquier tecla del control remoto para conocer su función exacta y recomendaciones de uso.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Lado izquierdo: Representación visual realista del control remoto */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs text-slate-500 font-bold mb-2">
            Toca los botones del control:
          </div>

          {/* Carcasa del control remoto */}
          <div className="relative w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-[48px] p-6 border-2 border-slate-700/80 shadow-2xl flex flex-col items-center select-none ring-1 ring-white/10">
            {/* Sensor infrarrojo superior */}
            <div className="w-12 h-2.5 bg-red-950 rounded-full mb-4 border border-red-800/40 shadow-inner flex items-center justify-center">
              <div className="w-2 h-1 bg-red-500/60 rounded-full"></div>
            </div>

            {/* Fila superior: Botón Power y Mute */}
            <div className="w-full flex items-center justify-between px-2 mb-5">
              {/* Botón Encendido (Power) */}
              <button
                type="button"
                onClick={() => setSelectedButtonId('power')}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                  selectedButtonId === 'power'
                    ? 'bg-red-600 text-white ring-4 ring-red-400/50 scale-105 animate-pulse'
                    : 'bg-red-900/40 text-red-400 border border-red-700/50 hover:bg-red-800/60'
                }`}
                title="Botón Encendido"
              >
                <Power className="w-5 h-5" />
              </button>

              <div className="text-[10px] tracking-widest uppercase font-black text-slate-600">
                POOL STORE
              </div>

              {/* Botón Silencio (Mute) */}
              <button
                type="button"
                onClick={() => setSelectedButtonId('mute')}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                  selectedButtonId === 'mute'
                    ? 'bg-orange-600 text-white ring-4 ring-orange-400/50 scale-105'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-700'
                }`}
                title="Botón Silencio"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            </div>

            {/* Fila 2: Modo Mouse y Configuración */}
            <div className="w-full flex items-center justify-between px-3 mb-6">
              <button
                type="button"
                onClick={() => setSelectedButtonId('mouse')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedButtonId === 'mouse'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md ring-2 ring-cyan-300'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
                title="Modo Puntero Ratón"
              >
                <MousePointer className="w-3.5 h-3.5" />
                <span>MOUSE</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedButtonId('settings')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  selectedButtonId === 'settings'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
                title="Configuración"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Cruzeta Direccional (D-Pad) y Botón OK */}
            <div className="relative w-44 h-44 rounded-full bg-slate-900 border-2 border-slate-700/80 flex items-center justify-center mb-6 shadow-inner">
              {/* Botones direccionales */}
              <div className="absolute inset-0">
                {/* Botón Arriba */}
                <button
                  type="button"
                  onClick={() => setSelectedButtonId('dpad')}
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-10 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer active:scale-95"
                  title="Dirección Arriba"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>

                {/* Botón Abajo */}
                <button
                  type="button"
                  onClick={() => setSelectedButtonId('dpad')}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-10 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer active:scale-95"
                  title="Dirección Abajo"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>

                {/* Botón Izquierda */}
                <button
                  type="button"
                  onClick={() => setSelectedButtonId('dpad')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-12 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer active:scale-95"
                  title="Dirección Izquierda"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Botón Derecha */}
                <button
                  type="button"
                  onClick={() => setSelectedButtonId('dpad')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-12 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer active:scale-95"
                  title="Dirección Derecha"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Botón Central OK */}
              <button
                type="button"
                onClick={() => setSelectedButtonId('ok')}
                className={`relative z-10 w-20 h-20 rounded-full font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                  selectedButtonId === 'ok'
                    ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-300 scale-105'
                    : 'bg-slate-950 text-white border-2 border-slate-700 hover:bg-slate-900'
                }`}
                title="Botón Confirmar OK"
              >
                <div className="flex flex-col items-center">
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span className="text-[10px] font-black tracking-wider">OK</span>
                </div>
              </button>
            </div>

            {/* Fila Navegación Principal: Atrás y Home */}
            <div className="w-full grid grid-cols-2 gap-3 px-2 my-4">
              <button
                type="button"
                onClick={() => setSelectedButtonId('back')}
                className={`py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 font-bold text-xs transition-all cursor-pointer active:scale-95 ${
                  selectedButtonId === 'back'
                    ? 'bg-amber-500 text-slate-950 ring-3 ring-amber-300'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                }`}
                title="Botón Atrás"
              >
                <CornerUpLeft className="w-4 h-4" />
                <span>ATRÁS</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedButtonId('home')}
                className={`py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 font-bold text-xs transition-all cursor-pointer active:scale-95 ${
                  selectedButtonId === 'home'
                    ? 'bg-blue-600 text-white ring-3 ring-blue-300'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                }`}
                title="Botón Inicio (Home)"
              >
                <Home className="w-4 h-4" />
                <span>INICIO</span>
              </button>
            </div>

            {/* Fila Controles de Volumen */}
            <div className="w-full flex items-center justify-between px-3 mt-2">
              <button
                type="button"
                onClick={() => setSelectedButtonId('volumen-menos')}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black transition-all cursor-pointer shadow-sm active:scale-95 ${
                  selectedButtonId === 'volumen-menos'
                    ? 'bg-purple-600 text-white ring-3 ring-purple-300'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                }`}
                title="Bajar Volumen"
              >
                <span className="text-base font-black px-1">-</span>
              </button>

              <div className="flex flex-col items-center">
                <Volume2 className="w-4 h-4 text-slate-500" />
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-600">VOL</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedButtonId('volumen-mas')}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black transition-all cursor-pointer shadow-sm active:scale-95 ${
                  selectedButtonId === 'volumen-mas'
                    ? 'bg-purple-600 text-white ring-3 ring-purple-300'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                }`}
                title="Subir Volumen"
              >
                <span className="text-base font-black px-1">+</span>
              </button>
            </div>

            {/* Base del control */}
            <div className="w-16 h-1 bg-slate-800 rounded-full mt-4"></div>
          </div>
        </div>

        {/* Lado derecho: Tarjeta de detalle del botón seleccionado */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Selector rápido por pestañas */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {BOTONES_CONTROL_REMOTO.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSelectedButtonId(btn.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedButtonId === btn.id
                    ? 'bg-slate-950 text-white shadow-xs font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {btn.nombre.split(' ')[0]} {btn.nombre.includes('(') ? btn.nombre.match(/\((.*?)\)/)?.[1] : ''}
              </button>
            ))}
          </div>

          {/* Tarjeta explicativa detallada */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Botón Seleccionado
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                  {selectedButton.nombre}
                </h4>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-blue-600 shadow-xs">
                <Info className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Ubicación en el control
                </div>
                <p className="text-xs sm:text-sm text-slate-800 bg-white p-3 rounded-xl border border-slate-200 font-medium">
                  {selectedButton.ubicacion}
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  ¿Qué función cumple?
                </div>
                <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  {selectedButton.funcionPrincipal}
                </p>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs font-black text-blue-900 uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Consejo práctico POOL STORE</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedButton.consejoUtil}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
