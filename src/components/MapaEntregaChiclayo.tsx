import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Compass, AlertCircle } from 'lucide-react';

export interface InfoEntregaDomicilio {
  direccion: string;
  referencia: string;
  distanciaKm: number;
  costoEnvio: number;
  coordenadas: { lat: number; lng: number };
}

interface Props {
  onCambioEntrega: (info: InfoEntregaDomicilio) => void;
  esGratisPorPromo?: boolean;
}

// Punto centro acordado: Mercado Modelo de Chiclayo / Av. José Balta
export const PUNTO_CENTRO_CHICLAYO = {
  nombre: 'Mercado Modelo / Balta (Centro de Despacho)',
  lat: -6.7719,
  lng: -79.8388,
};

// Zonas predeterminadas de Chiclayo para selección rápida
export const ZONAS_RAPIDAS_CHICLAYO = [
  { nombre: 'Chiclayo Centro', lat: -6.7725, lng: -79.8405 },
  { nombre: 'Santa Victoria', lat: -6.7820, lng: -79.8450 },
  { nombre: 'La Victoria', lat: -6.7910, lng: -79.8415 },
  { nombre: 'Campodónico / San Antonio', lat: -6.7680, lng: -79.8250 },
  { nombre: 'José Leonardo Ortiz', lat: -6.7560, lng: -79.8420 },
  { nombre: 'Las Brisas / P. Libre', lat: -6.7850, lng: -79.8600 },
];

/**
 * Calcula la distancia aproximada en kilómetros considerando factor de trazado vial
 */
export function calcularDistanciaKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanciaRecta = R * c;

  // Factor de recorrido vial urbano de Chiclayo (~1.22x la distancia en línea recta)
  const distanciaVial = distanciaRecta * 1.22;
  return Math.max(0.6, Math.round(distanciaVial * 10) / 10);
}

/**
 * Tarifa: 1.5 soles el kilómetro (con mínimo de S/ 3.00, rango de 3 a 5 soles según distancia urbana)
 */
export function calcularCostoDelivery(distanciaKm: number): number {
  // A 1.5 soles el kilómetro
  const costoBruto = distanciaKm * 1.5;
  // Mínimo de 3 soles (1 a 2 km), redondeado a múltiplos de 0.50
  const costoAjustado = Math.max(3.0, costoBruto);
  return Math.round(costoAjustado * 2) / 2;
}

export const MapaEntregaChiclayo: React.FC<Props> = ({
  onCambioEntrega,
  esGratisPorPromo = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clienteMarkerRef = useRef<L.Marker | null>(null);
  const lineaRutaRef = useRef<L.Polyline | null>(null);

  // Ubicación inicial por defecto: Santa Victoria (~2.2 km -> ~S/ 3.50)
  const [destino, setDestino] = useState<{ lat: number; lng: number }>({
    lat: -6.782,
    lng: -79.845,
  });

  const [direccion, setDireccion] = useState<string>('');
  const [referencia, setReferencia] = useState<string>('');
  const [gpsCargando, setGpsCargando] = useState<boolean>(false);
  const [gpsMensaje, setGpsMensaje] = useState<string | null>(null);

  const distanciaKm = calcularDistanciaKm(
    PUNTO_CENTRO_CHICLAYO.lat,
    PUNTO_CENTRO_CHICLAYO.lng,
    destino.lat,
    destino.lng
  );

  const costoEnvio = esGratisPorPromo ? 0 : calcularCostoDelivery(distanciaKm);

  // Notificar al componente padre cada vez que cambien datos relevantes
  const emitirCambio = useCallback(
    (nuevaCoord: { lat: number; lng: number }, dir: string, ref: string) => {
      const dist = calcularDistanciaKm(
        PUNTO_CENTRO_CHICLAYO.lat,
        PUNTO_CENTRO_CHICLAYO.lng,
        nuevaCoord.lat,
        nuevaCoord.lng
      );
      const costo = esGratisPorPromo ? 0 : calcularCostoDelivery(dist);

      onCambioEntrega({
        direccion: dir,
        referencia: ref,
        distanciaKm: dist,
        costoEnvio: costo,
        coordenadas: nuevaCoord,
      });
    },
    [esGratisPorPromo, onCambioEntrega]
  );

  // Inicializar Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Crear mapa centrado entre punto centro y destino inicial
    const map = L.map(mapContainerRef.current, {
      center: [-6.777, -79.842],
      zoom: 14,
      zoomControl: true,
      attributionControl: false,
    });

    // Capa de tiles OpenStreetMap limpia y rápida
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      crossOrigin: true,
    }).addTo(map);

    // Ícono personalizado para Punto Centro (Mercado Modelo / Balta)
    const centroIcon = L.divIcon({
      className: 'custom-pin-centro',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
          <div style="background:#0f172a;color:#ffffff;padding:3px 8px;border-radius:12px;font-size:10px;font-weight:900;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:1px solid #334155;display:flex;align-items:center;gap:3px;">
            <span>🏢</span> Modelo / Balta
          </div>
          <div style="width:14px;height:14px;background:#0f172a;border:2px solid #ffffff;border-radius:50%;margin-top:2px;box-shadow:0 2px 4px rgba(0,0,0,0.25);"></div>
        </div>
      `,
      iconSize: [0, 0],
    });

    // Marcador Punto Centro (Fijo)
    L.marker([PUNTO_CENTRO_CHICLAYO.lat, PUNTO_CENTRO_CHICLAYO.lng], {
      icon: centroIcon,
      interactive: false,
    }).addTo(map);

    // Ícono personalizado para Cliente (Arrastrable)
    const clienteIcon = L.divIcon({
      className: 'custom-pin-cliente',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);cursor:grab;">
          <div style="background:#10b981;color:#ffffff;padding:3px 8px;border-radius:12px;font-size:10px;font-weight:900;white-space:nowrap;box-shadow:0 3px 8px rgba(16,185,129,0.4);border:1.5px solid #ffffff;display:flex;align-items:center;gap:3px;">
            <span>📍</span> Tu Domicilio
          </div>
          <div style="width:16px;height:16px;background:#10b981;border:3px solid #ffffff;border-radius:50%;margin-top:2px;box-shadow:0 2px 5px rgba(0,0,0,0.3);animation:pulse 2s infinite;"></div>
        </div>
      `,
      iconSize: [0, 0],
    });

    // Marcador Cliente
    const clienteMarker = L.marker([destino.lat, destino.lng], {
      icon: clienteIcon,
      draggable: true,
    }).addTo(map);

    clienteMarkerRef.current = clienteMarker;

    // Línea que une centro con destino
    const polyline = L.polyline(
      [
        [PUNTO_CENTRO_CHICLAYO.lat, PUNTO_CENTRO_CHICLAYO.lng],
        [destino.lat, destino.lng],
      ],
      {
        color: '#10b981',
        weight: 3,
        dashArray: '6, 6',
        opacity: 0.8,
      }
    ).addTo(map);

    lineaRutaRef.current = polyline;

    // Manejar evento de arrastre del marcador de cliente
    clienteMarker.on('dragend', () => {
      const pos = clienteMarker.getLatLng();
      const nuevaCoord = { lat: pos.lat, lng: pos.lng };
      setDestino(nuevaCoord);
      polyline.setLatLngs([
        [PUNTO_CENTRO_CHICLAYO.lat, PUNTO_CENTRO_CHICLAYO.lng],
        [pos.lat, pos.lng],
      ]);
      emitirCambio(nuevaCoord, direccion, referencia);
    });

    // Manejar clic en cualquier parte del mapa para reubicar pin
    map.on('click', (e: L.LeafletMouseEvent) => {
      const nuevaCoord = { lat: e.latlng.lat, lng: e.latlng.lng };
      clienteMarker.setLatLng([nuevaCoord.lat, nuevaCoord.lng]);
      polyline.setLatLngs([
        [PUNTO_CENTRO_CHICLAYO.lat, PUNTO_CENTRO_CHICLAYO.lng],
        [nuevaCoord.lat, nuevaCoord.lng],
      ]);
      setDestino(nuevaCoord);
      emitirCambio(nuevaCoord, direccion, referencia);
    });

    mapInstanceRef.current = map;

    // Invalidate size después del render para evitar descalces en modales
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timeout);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Actualizar la línea y emisión cuando cambian datos
  const actualizarDestinoManual = (nuevaCoord: { lat: number; lng: number }) => {
    setDestino(nuevaCoord);
    if (clienteMarkerRef.current) {
      clienteMarkerRef.current.setLatLng([nuevaCoord.lat, nuevaCoord.lng]);
    }
    if (lineaRutaRef.current) {
      lineaRutaRef.current.setLatLngs([
        [PUNTO_CENTRO_CHICLAYO.lat, PUNTO_CENTRO_CHICLAYO.lng],
        [nuevaCoord.lat, nuevaCoord.lng],
      ]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([nuevaCoord.lat, nuevaCoord.lng], {
        animate: true,
      });
    }
    emitirCambio(nuevaCoord, direccion, referencia);
  };

  const obtenerUbicacionGPS = () => {
    if (!navigator.geolocation) {
      setGpsMensaje('Tu navegador no soporta geolocalización.');
      return;
    }

    setGpsCargando(true);
    setGpsMensaje(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCargando(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        actualizarDestinoManual({ lat, lng });
        setGpsMensaje('¡Ubicación detectada con éxito!');
        setTimeout(() => setGpsMensaje(null), 3000);
      },
      (err) => {
        setGpsCargando(false);
        setGpsMensaje('No se pudo obtener el GPS. Puedes tocar tu ubicación en el mapa.');
        setTimeout(() => setGpsMensaje(null), 4000);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-3 font-montserrat">
      {/* Explicación y Tarifa */}
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            Punto Central de Salida: Mercado Modelo / Av. Balta
          </span>
          <p className="text-[11px] text-emerald-900 mt-0.5 font-medium">
            Tarifa: <strong>S/ 1.50 el kilómetro</strong> (rango de S/ 3 a S/ 5 según distancia en Chiclayo)
          </p>
        </div>

        <div className="bg-white border border-emerald-300 px-3 py-1.5 rounded-xl shadow-2xs shrink-0 text-right">
          <span className="text-[10px] text-slate-500 block font-bold">Costo de Envío:</span>
          <strong className="text-sm font-black text-emerald-700">
            {esGratisPorPromo ? '¡GRATIS!' : `S/ ${costoEnvio.toFixed(2)}`}
          </strong>
          <span className="text-[10px] text-slate-600 block">
            ({distanciaKm.toFixed(1)} km aprox)
          </span>
        </div>
      </div>

      {/* Contenedor del Mapa */}
      <div className="relative border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div
          ref={mapContainerRef}
          style={{ height: '220px', width: '100%' }}
          className="z-0 bg-slate-100"
        />

        {/* Botón flotante para GPS */}
        <button
          type="button"
          onClick={obtenerUbicacionGPS}
          disabled={gpsCargando}
          className="absolute top-2.5 right-2.5 z-10 bg-white/95 hover:bg-white text-slate-800 text-[11px] font-bold px-2.5 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${gpsCargando ? 'animate-spin' : ''}`} />
          <span>{gpsCargando ? 'Localizando...' : 'Mi Ubicación GPS'}</span>
        </button>

        <div className="absolute bottom-2 left-2 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
          👆 Toca o arrastra el pin verde a tu casa
        </div>
      </div>

      {gpsMensaje && (
        <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5" />
          {gpsMensaje}
        </p>
      )}

      {/* Zonas Rápidas de Chiclayo para seleccionar con un clic */}
      <div>
        <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider block mb-1.5">
          O marca tu zona rápida:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {ZONAS_RAPIDAS_CHICLAYO.map((zona) => {
            const dist = calcularDistanciaKm(
              PUNTO_CENTRO_CHICLAYO.lat,
              PUNTO_CENTRO_CHICLAYO.lng,
              zona.lat,
              zona.lng
            );
            const costo = esGratisPorPromo ? 0 : calcularCostoDelivery(dist);

            return (
              <button
                key={zona.nombre}
                type="button"
                onClick={() => actualizarDestinoManual({ lat: zona.lat, lng: zona.lng })}
                className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-400 rounded-lg text-slate-700 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>{zona.nombre}</span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  (S/ {costo.toFixed(2)})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Campos de Dirección y Referencia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            Dirección exacta:
          </label>
          <input
            type="text"
            placeholder="Ej: Ca. San José 450, Urb. Santa Victoria"
            value={direccion}
            onChange={(e) => {
              setDireccion(e.target.value);
              emitirCambio(destino, e.target.value, referencia);
            }}
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            Referencia:
          </label>
          <input
            type="text"
            placeholder="Ej: Casa de 2 pisos, portón negro, frente al parque"
            value={referencia}
            onChange={(e) => {
              setReferencia(e.target.value);
              emitirCambio(destino, direccion, e.target.value);
            }}
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900"
          />
        </div>
      </div>
    </div>
  );
};
