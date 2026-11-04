import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import TvBoxNavHeader from '../components/tvbox/TvBoxNavHeader';
import InteractiveRemote from '../components/tvbox/InteractiveRemote';
import {
  TUTORIALES_PRIMERA_VEZ,
  GUIAS_APPS,
  SOLUCION_PROBLEMAS,
  TutorialPrimeraVez,
  ProblemaFrecuente,
  GuiaApp,
  getTvBoxWhatsAppUrl,
  TV_BOX_CONFIG,
} from '../data/tvBoxData';
import {
  HelpCircle,
  Play,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
  Sparkles,
  Tv,
  Wifi,
  Download,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Clock,
  Layers,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TvBoxHelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTutorialId, setSelectedTutorialId] = useState<string>('conectar-tv');
  const [openProblemId, setOpenProblemId] = useState<string | null>('no-enciende');
  const [activeSection, setActiveSection] = useState<'todos' | 'instalacion' | 'control' | 'apps' | 'problemas'>('todos');

  // Filtrado reactivo de problemas frecuentes según búsqueda
  const filteredProblems = useMemo(() => {
    if (!searchQuery.trim()) return SOLUCION_PROBLEMAS;
    const q = searchQuery.toLowerCase();
    return SOLUCION_PROBLEMAS.filter(
      (p: ProblemaFrecuente) =>
        p.titulo.toLowerCase().includes(q) ||
        p.sintoma.toLowerCase().includes(q) ||
        p.causaProbable.toLowerCase().includes(q) ||
        p.solucionPasos.some((s: string) => s.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredTutorials = useMemo(() => {
    if (!searchQuery.trim()) return TUTORIALES_PRIMERA_VEZ;
    const q = searchQuery.toLowerCase();
    return TUTORIALES_PRIMERA_VEZ.filter(
      (t) =>
        t.titulo.toLowerCase().includes(q) ||
        t.subtitulo.toLowerCase().includes(q) ||
        t.pasos.some((p) => p.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredGuiasApps = useMemo(() => {
    if (!searchQuery.trim()) return GUIAS_APPS;
    const q = searchQuery.toLowerCase();
    return GUIAS_APPS.filter(
      (g) =>
        g.titulo.toLowerCase().includes(q) ||
        g.descripcion.toLowerCase().includes(q) ||
        g.pasos.some((p) => p.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const selectedTutorial: TutorialPrimeraVez =
    TUTORIALES_PRIMERA_VEZ.find((t) => t.id === selectedTutorialId) ||
    TUTORIALES_PRIMERA_VEZ[0];

  const toggleProblemAccordion = (id: string) => {
    setOpenProblemId(openProblemId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-montserrat flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Navbar General */}
      <Navbar />

      {/* Navegación TV Box con pestaña activa "Soy Comprador" */}
      <TvBoxNavHeader currentTab="ayuda" />

      <main className="flex-grow">
        {/* =========================================================================
            ENCABEZADO DEL CENTRO DE AYUDA + BUSCADOR
           ========================================================================= */}
        <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 bg-gradient-to-b from-white via-slate-50 to-slate-50 border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-black tracking-wide">
              <HelpCircle className="w-4 h-4 text-cyan-600" />
              <span>MANUAL DIGITAL EXCLUSIVO POOL STORE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              CENTRO DE AYUDA TV BOX
            </h1>

            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              ¿Ya tienes tu TV Box? Aprende a instalarlo, utilizarlo y solucionar los problemas más comunes de manera sencilla y paso a paso.
            </p>

            {/* Barra de búsqueda interactiva */}
            <div className="pt-3 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Escribe tu duda (ej: YouTube, Wi-Fi, sin imagen, control, reiniciar)..."
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-900 px-2 py-1 rounded bg-slate-100"
                  >
                    Borrar
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-600">Búsquedas rápidas:</span>
                {['Sin señal', 'YouTube', 'Conectar Wi-Fi', 'Control no responde', 'Lento'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-950 cursor-pointer text-[11px]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Pestañas de filtrado de secciones del centro de ayuda */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'todos', label: 'Ver Todo', icon: Sparkles },
                { id: 'instalacion', label: 'A. Instalación Inicial', icon: BookOpen },
                { id: 'control', label: 'B. Control Remoto', icon: Sliders },
                { id: 'apps', label: 'C. Gestión de Apps', icon: Download },
                { id: 'problemas', label: 'D. Solución de Problemas (10)', icon: AlertTriangle },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isSelected = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSection(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            APARTADO A. INSTALACIÓN POR PRIMERA VEZ (5 TUTORIALES)
           ========================================================================= */}
        {(activeSection === 'todos' || activeSection === 'instalacion') && (
          <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mb-8 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Módulo A</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  INSTALACIÓN POR PRIMERA VEZ
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Sigue estos 5 sencillos pasos para conectar y comenzar a utilizar tu TV Box en cuestión de minutos.
                </p>
              </div>

              {/* Selector horizontal de los 5 tutoriales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                {filteredTutorials.map((tut) => {
                  const isSelected = selectedTutorial.id === tut.id;
                  return (
                    <button
                      key={tut.id}
                      type="button"
                      onClick={() => setSelectedTutorialId(tut.id)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
                        isSelected
                          ? 'bg-slate-950 border-slate-950 text-white shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center ${
                              isSelected ? 'bg-white text-slate-950' : 'bg-white text-slate-700 border border-slate-200'
                            }`}
                          >
                            #{tut.numero}
                          </span>
                          <span className="text-[10px] font-semibold opacity-80 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tut.tiempoAproximado}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm leading-snug line-clamp-2">
                          {tut.titulo}
                        </h4>
                      </div>
                      <div className="text-[11px] font-semibold mt-3 pt-2 border-t border-slate-200/40 opacity-90 truncate">
                        Paso {tut.numero} de 5
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Contenedor detallado del tutorial seleccionado */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Columna Izquierda: Información, Pasos y Preguntas Frecuentes */}
                  <div className="lg:col-span-7 space-y-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                        <span>Paso #{selectedTutorial.numero}</span>
                        <span>•</span>
                        <span>{selectedTutorial.tiempoAproximado}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                        {selectedTutorial.titulo}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        {selectedTutorial.subtitulo}
                      </p>
                    </div>

                    {/* Lista numerada de pasos */}
                    <div className="space-y-2.5">
                      <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                        Instrucciones paso a paso:
                      </div>
                      {selectedTutorial.pasos.map((paso, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200"
                        >
                          <span className="w-6 h-6 rounded-full bg-slate-950 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                            {paso}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Consejo útil */}
                    <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 text-xs font-black text-emerald-900 uppercase tracking-wider mb-1">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Consejo POOL STORE</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {selectedTutorial.consejos}
                      </p>
                    </div>

                    {/* Preguntas frecuentes del tutorial */}
                    {selectedTutorial.preguntasFrecuentes.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                          Dudas frecuentes sobre este paso:
                        </div>
                        {selectedTutorial.preguntasFrecuentes.map((faq, fIdx) => (
                          <div
                            key={fIdx}
                            className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1"
                          >
                            <div className="font-bold text-slate-950 flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>{faq.pregunta}</span>
                            </div>
                            <p className="text-slate-600 pl-5 leading-relaxed">
                              {faq.respuesta}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Columna Derecha: Placeholder de Video Tutorial con diseño limpio */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm aspect-video flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 text-slate-950 flex items-center justify-center mb-3">
                        <Play className="w-6 h-6 ml-0.5" />
                      </div>
                      <h5 className="font-black text-slate-950 text-xs sm:text-sm mb-1">
                        {selectedTutorial.placeholderVideoText}
                      </h5>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[11px] mt-2">
                        <Clock className="w-3.5 h-3.5" />
                        Tutorial en video próximamente
                      </span>
                      <p className="text-[11px] text-slate-500 mt-2 max-w-xs">
                        Estamos grabando nuestros videos propios en alta definición para añadirlos aquí sin enlaces ficticios.
                      </p>
                    </div>

                    {/* Soporte WhatsApp para este paso */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center space-y-3 shadow-xs">
                      <p className="text-xs text-slate-700">
                        ¿Tienes dudas con el paso "{selectedTutorial.titulo}"?
                      </p>
                      <a
                        href={getTvBoxWhatsAppUrl(
                          `¡Hola soporte POOL STORE! Necesito ayuda con la instalación de mi TV Box en el paso: "${selectedTutorial.titulo}".`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-white" />
                        <span>Consultar este paso por WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            APARTADO B. APRENDE A UTILIZAR EL CONTROL REMOTO
           ========================================================================= */}
        {(activeSection === 'todos' || activeSection === 'control') && (
          <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mb-8 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Módulo B</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  APRENDE A UTILIZAR EL CONTROL REMOTO
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Controla tu TV Box como un experto conociendo cada una de sus teclas y atajos.
                </p>
              </div>

              {/* Componente interactivo del control remoto */}
              <InteractiveRemote />
            </div>
          </section>
        )}

        {/* =========================================================================
            APARTADO C. INSTALACIÓN Y ACTUALIZACIÓN DE APLICACIONES
           ========================================================================= */}
        {(activeSection === 'todos' || activeSection === 'apps') && (
          <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mb-8 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                  <Download className="w-3.5 h-3.5" />
                  <span>Módulo C</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  INSTALACIÓN Y ACTUALIZACIÓN DE APLICACIONES
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Guías prácticas para sacarle el máximo provecho a la tienda y a tus plataformas multimedia.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredGuiasApps.map((guia) => (
                  <div
                    key={guia.id}
                    className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Guía Oficial
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </div>

                      <h4 className="font-black text-sm text-slate-950 leading-snug">
                        {guia.titulo}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {guia.descripcion}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-slate-200">
                        {guia.pasos.map((paso, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                            <span className="text-blue-600 font-bold shrink-0">{pIdx + 1}.</span>
                            <span>{paso}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                      💡 Sigue las indicaciones paso a paso para completar la descarga.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            APARTADO D. SOLUCIÓN DE PROBLEMAS COMUNES (10 SITUACIONES)
           ========================================================================= */}
        {(activeSection === 'todos' || activeSection === 'problemas') && (
          <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="text-center space-y-2 mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Módulo D · Diagnóstico Rápido</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  SOLUCIÓN A LOS 10 PROBLEMAS MÁS COMUNES
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  El 95% de los inconvenientes se resuelven en 2 minutos siguiendo estas indicaciones:
                </p>
              </div>

              {/* Lista en acordeón de los 10 problemas */}
              <div className="space-y-3">
                {filteredProblems.map((prob: ProblemaFrecuente, idx: number) => {
                  const isOpen = openProblemId === prob.id;
                  return (
                    <div
                      key={prob.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleProblemAccordion(prob.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center font-black text-xs shrink-0">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-xs sm:text-sm text-slate-950 block">
                              {prob.titulo}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Síntoma: {prob.sintoma}
                            </span>
                          </div>
                        </div>

                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-3 bg-slate-50/50">
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                              Causa más probable:
                            </span>
                            <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                              {prob.causaProbable}
                            </p>
                          </div>

                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                              Pasos de solución recomendados:
                            </span>
                            <div className="space-y-1.5">
                              {prob.solucionPasos.map((paso: string, sIdx: number) => (
                                <div
                                  key={sIdx}
                                  className="flex items-start gap-2.5 text-xs text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{paso}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <span className="text-slate-500">
                              ¿Aún no se resuelve tu problema con este paso?
                            </span>
                            <a
                              href={getTvBoxWhatsAppUrl(
                                `¡Hola soporte POOL STORE! Tengo el problema #${idx + 1} ("${prob.titulo}") en mi TV Box y no logro solucionarlo.`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors shrink-0"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Pedir ayuda a un asesor</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botón flotante al final del módulo */}
              <div className="mt-10 p-6 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
                <h4 className="font-black text-base text-slate-950">
                  ¿No encuentras la solución a tu problema?
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Nuestro equipo de atención al cliente en Chiclayo está listo para guiarte por chat o llamada sin costo adicional.
                </p>
                <div className="pt-1">
                  <a
                    href={getTvBoxWhatsAppUrl(
                      '¡Hola POOL STORE! Necesito ayuda técnica para configurar mi TV Box con un asesor.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Contactar con soporte técnico POOL STORE</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
