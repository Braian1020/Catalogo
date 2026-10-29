import React, { useState } from 'react';
import { useCart, PUNTOS_CENTRICOS_CHICLAYO } from '../context/CartContext';
import { GUIA_TALLAS } from '../types';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  X,
  Sparkles,
  Check,
  Copy,
  MessageCircle,
  Truck,
  MapPin,
  Package,
} from 'lucide-react';

export default function SharedModals() {
  const {
    carrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    modalCarritoAbierto,
    setModalCarritoAbierto,
    modalFoto,
    setModalFoto,
    modalGuiaTallas,
    setModalGuiaTallas,
    modalTelasAbierto,
    setModalTelasAbierto,
    toast,
    totalPrendas,
    prendasPoliester,
    prendasWin,
    precioUnitarioPoliester,
    precioUnitarioWin,
    subtotalPrendas,
    ahorroTotal,
    costoEnvioAplicado,
    totalGeneral,
    deliveryGratisDesbloqueado,
    modalidadEntrega,
    setModalidadEntrega,
    metodoPago,
    setMetodoPago,
    puntoCentrico,
    setPuntoCentrico,
    direccionEntrega,
    setDireccionEntrega,
    referenciaEntrega,
    setReferenciaEntrega,
    compartirUbicacionPorWhatsApp,
    setCompartirUbicacionPorWhatsApp,
    agenciaShalom,
    setAgenciaShalom,
    nombreCliente,
    setNombreCliente,
    telefonoCliente,
    setTelefonoCliente,
    dniCliente,
    setDniCliente,
    notasCliente,
    setNotasCliente,
    handleEnviarPedidoWhatsApp,
  } = useCart();

  const [yapeCopiado, setYapeCopiado] = useState<boolean>(false);

  const copiarNumeroYape = () => {
    navigator.clipboard.writeText('903566655');
    setYapeCopiado(true);
    setTimeout(() => setYapeCopiado(false), 2000);
  };

  return (
    <>
      {/* 1. TOAST FLOTANTE */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 font-montserrat text-xs font-bold animate-fade-in"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>{toast}</span>
          <button
            type="button"
            onClick={() => setModalCarritoAbierto(true)}
            className="ml-2 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-lg cursor-pointer transition-colors"
          >
            Ver Pedido
          </button>
        </div>
      )}

      {/* 2. DRAWER / MODAL DEL CARRITO */}
      {modalCarritoAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Resumen de tu pedido"
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs font-montserrat animate-fade-in"
        >
          <button
            type="button"
            aria-label="Cerrar pedido"
            onClick={() => setModalCarritoAbierto(false)}
            className="absolute inset-0 w-full h-full cursor-default bg-transparent"
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-slate-200">
            {/* Header del carrito */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-black text-sm text-slate-900">Tu Pedido</h2>
                  <p className="text-[11px] text-slate-500">
                    {totalPrendas} {totalPrendas === 1 ? 'prenda' : 'prendas'} seleccionadas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {carrito.length > 0 && (
                  <button
                    type="button"
                    onClick={vaciarCarrito}
                    className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    title="Vaciar todo el pedido"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px] font-bold">Vaciar</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setModalCarritoAbierto(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-200 cursor-pointer transition-colors"
                  aria-label="Cerrar pedido"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {carrito.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Tu pedido está vacío</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Explora el catálogo o las fichas de productos y agrega tus shorts favoritos.
                  </p>
                  <button
                    type="button"
                    onClick={() => setModalCarritoAbierto(false)}
                    className="mt-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-black"
                  >
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                <>
                  {/* Banners de progreso para promociones por volumen */}
                  {prendasPoliester > 0 && (
                    <div className="p-3 rounded-xl bg-slate-900 text-white text-xs">
                      {prendasPoliester >= 12 ? (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>
                            <strong>¡Precio Docena Activado!</strong> Pagas solo{' '}
                            <span className="text-amber-300 font-black">S/ 12.00 c/u</span> en tus shorts clásicos.
                          </span>
                        </div>
                      ) : prendasPoliester >= 6 ? (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            <strong>¡Precio Mayorista Activado!</strong> Pagas{' '}
                            <span className="text-emerald-300 font-black">S/ 13.50 c/u</span>. Lleva {12 - prendasPoliester} más para precio docena (S/ 12.00).
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>
                            Lleva <strong>{6 - prendasPoliester} shorts clásicos más</strong> para pagar solo S/ 13.50 c/u.
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {prendasWin > 0 && (
                    <div className="p-3 rounded-xl bg-slate-900 text-white text-xs">
                      {prendasWin >= 12 ? (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            <strong>¡Precio Docena Win Activado!</strong> Pagas solo{' '}
                            <span className="text-emerald-300 font-black">S/ 20.00 c/u</span> (12 por S/ 240.00).
                          </span>
                        </div>
                      ) : prendasWin >= 3 ? (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            <strong>¡Promo 3x S/ 69 Activada!</strong> Pagas{' '}
                            <span className="text-emerald-300 font-black">S/ 23.00 c/u</span> en shorts Win. Lleva {12 - prendasWin} más para precio docena (S/ 20.00 c/u).
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>
                            Lleva <strong>{3 - prendasWin} short{3 - prendasWin === 1 ? '' : 's'} Win más</strong> para pagar solo <strong>3 por S/ 69.00</strong> (S/ 23.00 c/u).
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Lista de productos agregados */}
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    {carrito.map((item) => {
                      const p = item.producto;
                      const isWin = p.tipoTela === 'win';
                      const unit = isWin ? precioUnitarioWin : precioUnitarioPoliester;
                      const subtotal = unit * item.cantidad;

                      return (
                        <div key={item.id} className="p-3 flex items-center gap-3">
                          <img
                            src={p.imagen}
                            alt={p.nombre}
                            className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{p.nombre}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-bold text-slate-800">Talla {item.talla}</span>
                              <span>·</span>
                              <span>S/ {unit.toFixed(2)} c/u</span>
                            </div>
                            <span className="text-xs font-black text-slate-900 block mt-1">
                              S/ {subtotal.toFixed(2)}
                            </span>
                          </div>

                          {/* Selector cantidad */}
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                            <button
                              type="button"
                              onClick={() => actualizarCantidad(item.id, -1)}
                              className="p-1.5 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              aria-label="Restar una unidad"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold">{item.cantidad}</span>
                            <button
                              type="button"
                              onClick={() => actualizarCantidad(item.id, 1)}
                              className="p-1.5 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              aria-label="Sumar una unidad"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Botón eliminar */}
                          <button
                            type="button"
                            onClick={() => eliminarDelCarrito(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Datos del Cliente */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                      Tus Datos de Contacto
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={nombreCliente}
                        onChange={(e) => setNombreCliente(e.target.value)}
                        placeholder="Tu Nombre completo"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                      <input
                        type="tel"
                        value={telefonoCliente}
                        onChange={(e) => setTelefonoCliente(e.target.value)}
                        placeholder="Teléfono / WhatsApp"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  {/* Modalidad de Entrega */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                      Modalidad de Entrega
                    </span>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setModalidadEntrega('domicilio')}
                        className={`p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          modalidadEntrega === 'domicilio'
                            ? 'bg-slate-900 text-white font-bold shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-black">🛵 A Domicilio</span>
                        <span className={`text-[10px] block ${modalidadEntrega === 'domicilio' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Chiclayo y Zonas cercanas
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setModalidadEntrega('punto_centrico')}
                        className={`p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          modalidadEntrega === 'punto_centrico'
                            ? 'bg-slate-900 text-white font-bold shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-black">📍 Punto Céntrico</span>
                        <span className={`text-[10px] block ${modalidadEntrega === 'punto_centrico' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Gratis en Chiclayo
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setModalidadEntrega('shalom')}
                        className={`p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          modalidadEntrega === 'shalom'
                            ? 'bg-slate-900 text-white font-bold shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-black">📦 Envío Shalom</span>
                        <span className={`text-[10px] block ${modalidadEntrega === 'shalom' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Todo el Perú
                        </span>
                      </button>
                    </div>

                    {modalidadEntrega === 'domicilio' && (
                      <div className="space-y-2.5 pt-1 animate-fade-in">
                        {/* Opción de compartir ubicación por WhatsApp o escribir dirección */}
                        <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-xl">
                          <input
                            type="checkbox"
                            id="chk-compartir-wa"
                            checked={compartirUbicacionPorWhatsApp}
                            onChange={(e) => setCompartirUbicacionPorWhatsApp(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                          />
                          <label
                            htmlFor="chk-compartir-wa"
                            className="text-xs text-slate-800 font-semibold cursor-pointer select-none"
                          >
                            Compartiré mi ubicación o dirección por WhatsApp
                          </label>
                        </div>

                        {!compartirUbicacionPorWhatsApp ? (
                          <>
                            <input
                              type="text"
                              value={direccionEntrega}
                              onChange={(e) => setDireccionEntrega(e.target.value)}
                              placeholder="Calle, número, urbanización / barrio"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                            <input
                              type="text"
                              value={referenciaEntrega}
                              onChange={(e) => setReferenciaEntrega(e.target.value)}
                              placeholder="Referencia (cerca a parque, tienda, etc.)"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                          </>
                        ) : null}

                        <div className="p-2.5 bg-blue-50/80 border border-blue-200/70 rounded-xl text-[11px] text-blue-950 leading-relaxed">
                          {deliveryGratisDesbloqueado ? (
                            <span className="text-emerald-700 font-bold block">
                              ✓ ¡Delivery GRATIS aplicado por llevar 3 o más prendas!
                            </span>
                          ) : (
                            <div className="space-y-0.5">
                              <span className="font-bold block text-slate-900">
                                Delivery: Por confirmar
                              </span>
                              <span className="text-slate-600 block">
                                El costo de envío se coordinará y confirmará por WhatsApp según tu dirección o ubicación. ¡Lleva {3 - totalPrendas} prenda(s) más para Delivery GRATIS!
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {modalidadEntrega === 'punto_centrico' && (
                      <div className="space-y-1.5 pt-1 animate-fade-in">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Selecciona el punto de encuentro en Chiclayo:
                        </label>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {PUNTOS_CENTRICOS_CHICLAYO.map((pto) => (
                            <button
                              key={pto.id}
                              type="button"
                              onClick={() => setPuntoCentrico(pto.nombre)}
                              className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                                puntoCentrico === pto.nombre
                                  ? 'bg-slate-900 text-white font-bold'
                                  : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              <div>
                                <span className="block font-bold">{pto.icono} {pto.nombre}</span>
                                <span className={`text-[10px] block ${puntoCentrico === pto.nombre ? 'text-slate-300' : 'text-slate-500'}`}>
                                  {pto.detalle}
                                </span>
                              </div>
                              {puntoCentrico === pto.nombre && (
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {modalidadEntrega === 'shalom' && (
                      <div className="space-y-2 pt-1 animate-fade-in">
                        <input
                          type="text"
                          value={agenciaShalom}
                          onChange={(e) => setAgenciaShalom(e.target.value)}
                          placeholder="Ciudad y Agencia Shalom de destino"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <input
                          type="text"
                          value={dniCliente}
                          onChange={(e) => setDniCliente(e.target.value)}
                          placeholder="DNI del titular para retiro en agencia"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <p className="text-[10px] text-slate-500">
                          Enviamos diariamente por Shalom. El flete se abona directamente en la agencia de destino.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Forma de Pago */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                      Forma de Pago
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setMetodoPago('contraentrega')}
                        className={`p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          metodoPago === 'contraentrega'
                            ? 'bg-slate-900 text-white font-bold shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-black">💵 Contraentrega</span>
                        <span className={`text-[10px] block ${metodoPago === 'contraentrega' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Pagas al recibir
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMetodoPago('yape')}
                        className={`p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          metodoPago === 'yape'
                            ? 'bg-slate-900 text-white font-bold shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-black">📱 Yape Directo</span>
                        <span className={`text-[10px] block ${metodoPago === 'yape' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Al 903566655
                        </span>
                      </button>
                    </div>

                    {metodoPago === 'yape' && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between gap-2 animate-fade-in">
                        <div>
                          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wide block">
                            Yape Oficial Pool Store
                          </span>
                          <span className="text-sm font-black text-purple-950">903566655</span>
                        </div>
                        <button
                          type="button"
                          onClick={copiarNumeroYape}
                          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          {yapeCopiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{yapeCopiado ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Totales y Botón WhatsApp */}
            {carrito.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal prendas ({totalPrendas}):</span>
                    <span className="font-bold text-slate-900">S/ {subtotalPrendas.toFixed(2)}</span>
                  </div>

                  {ahorroTotal > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Descuento por volumen aplicado:</span>
                      <span>- S/ {ahorroTotal.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Costo de envío:</span>
                    <span className="font-bold">
                      {deliveryGratisDesbloqueado ? (
                        <span className="text-emerald-700 font-bold">¡Gratis! (Promo 3+ prendas)</span>
                      ) : modalidadEntrega === 'domicilio' ? (
                        <span className="text-amber-700 font-bold">Por confirmar</span>
                      ) : modalidadEntrega === 'punto_centrico' ? (
                        <span className="text-emerald-700 font-bold">S/ 0.00 (Gratis)</span>
                      ) : (
                        <span className="text-slate-600 font-medium">Pago en destino</span>
                      )}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                    <span>{modalidadEntrega === 'domicilio' && !deliveryGratisDesbloqueado ? 'SUBTOTAL A PAGAR:' : 'TOTAL A PAGAR:'}</span>
                    <span className="text-emerald-700">S/ {subtotalPrendas.toFixed(2)}</span>
                  </div>

                  {modalidadEntrega === 'domicilio' && !deliveryGratisDesbloqueado && (
                    <p className="text-[11px] text-slate-500 text-right leading-tight">
                      * El importe final incluirá el envío confirmado por WhatsApp según tu dirección.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleEnviarPedidoWhatsApp}
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Enviar Pedido por WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. MODAL DE FOTO EN ALTA RESOLUCIÓN */}
      {modalFoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 font-montserrat animate-fade-in"
        >
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setModalFoto(null)}
              className="absolute top-3 right-3 z-10 p-2.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
              aria-label="Cerrar foto"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-square bg-slate-900 flex items-center justify-center">
              <img
                src={modalFoto.imagen}
                alt={modalFoto.nombre}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm">{modalFoto.nombre}</h3>
                <span className="text-xs text-slate-400">
                  {modalFoto.tipoTela === 'win' ? 'Tela Win Deportiva' : `Rayas ${modalFoto.colorRayas}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL GUÍA DE MEDIDAS */}
      {modalGuiaTallas && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 font-montserrat animate-fade-in"
        >
          <div className="relative max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">Guía de Tallas Oficial</h3>
              <button
                type="button"
                onClick={() => setModalGuiaTallas(false)}
                className="p-1 text-slate-400 hover:text-slate-900 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              {Object.entries(GUIA_TALLAS).map(([t, info]) => (
                <div key={t} className="flex justify-between items-center p-2.5">
                  <span className="font-black text-slate-900 text-sm">{t} ({info.tallaNumero})</span>
                  <span className="text-slate-600 font-medium">Cintura: <strong>{info.cintura} cm</strong></span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500">
              * Todas las prendas cuentan con pretina elásticada y cordón regulable interior.
            </p>

            <button
              type="button"
              onClick={() => setModalGuiaTallas(false)}
              className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* 5. MODAL INTERACTIVO DE TELAS */}
      {modalTelasAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 font-montserrat animate-fade-in overflow-y-auto"
        >
          <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                  🧵
                </div>
                <div>
                  <h3 className="font-black text-base">Guía de Telas Pool Store</h3>
                  <p className="text-xs text-slate-400">Polistrech vs Win Deportiva</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalTelasAbierto(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Tarjeta Polistrech */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <h4 className="font-black text-sm text-blue-950">Tela Polistrech (Shorts Clásicos)</h4>
                <p className="text-slate-700 leading-relaxed">
                  Tejido suave, ligero y elástico con tacto agradable a la piel. Gran libertad de movimiento, no pierde su forma y es perfecto para uso diario, playa, gimnasio o descanso.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-white p-2 rounded-lg border border-blue-100">
                    <strong>Tallas:</strong> S, M, L, XL
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-blue-100">
                    <strong>Ajuste:</strong> Pretina con cordón regulable
                  </div>
                </div>
              </div>

              {/* Tarjeta Win */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <h4 className="font-black text-sm text-emerald-950">Tela Win Deportiva (Shorts de Clubes)</h4>
                <p className="text-slate-700 leading-relaxed">
                  Tejido técnico oficial de alta competencia. Cuenta con microestructura transpirable para rápida evaporación del sudor, evitando la humedad y fricción durante el deporte.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                    <strong>Tallas:</strong> M, L, XL
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                    <strong>Secado:</strong> Ultra rápido instantáneo
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setModalTelasAbierto(false)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-black rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. BARRA RESUMEN MÓVIL INFERIOR */}
      {totalPrendas > 0 && !modalCarritoAbierto && (
        <aside
          aria-label="Barra de pedido rápido móvil"
          className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-xl animate-fade-in font-montserrat"
        >
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide">
                {totalPrendas} {totalPrendas === 1 ? 'prenda' : 'prendas'} seleccionadas
              </span>
              <strong className="text-base font-black text-slate-900">
                S/ {totalGeneral.toFixed(2)}
              </strong>
            </div>

            <button
              type="button"
              onClick={() => setModalCarritoAbierto(true)}
              className="py-2.5 px-4 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Ver Pedido</span>
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
