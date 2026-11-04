// Datos configurables y centralizados para el Sistema Android - TV Box de POOL STORE
// Permite modificar precios, especificaciones, tutoriales, FAQs y opciones de soporte fácilmente

export const TV_BOX_CONFIG = {
  telefonoWhatsApp: '51903566655',
  telefonoWhatsAppDisplay: '+51 903 566 655',
  precioEquipo: 'S/ 250.00',
  precioEquipoNumero: 250,
  deliveryGratis: true,
  deliveryGratisTexto: 'Delivery gratis incluido en Chiclayo',
  precioInstalacionAproximado: 'S/ 20.00 - S/ 30.00 (opcional)',
  coberturaInstalacion: 'Chiclayo, La Victoria, José Leonardo Ortiz y zonas previa coordinación.',
  garantiaMeses: 3,
  memoriaRam: '2 GB',
  almacenamiento: '16 GB',
  sistemaOperativo: 'Android TV OS optimizado',
  resolucionMaxima: 'Hasta 4K Ultra HD (según tu televisor)',
  conectividad: 'Wi-Fi 2.4 GHz + Puerto Ethernet RJ45 + 2 Puertos USB + Ranura MicroSD + HDMI + Salida AV',
};

// Generador de enlace de WhatsApp con mensaje personalizado
export const getTvBoxWhatsAppUrl = (mensaje: string): string => {
  return `https://wa.me/${TV_BOX_CONFIG.telefonoWhatsApp}?text=${encodeURIComponent(mensaje)}`;
};

export interface AppIncluida {
  id: string;
  nombre: string;
  categoria: string;
  badge: string;
  badgeColor: string;
  icono: string;
  imagen: string;
  descripcionCorta: string;
  detalle: string;
  notaLegal: string;
}

export const APPS_INCLUIDAS: AppIncluida[] = [
  {
    id: 'youtube',
    nombre: 'YouTube',
    categoria: 'Video & Entretenimiento',
    badge: 'Preinstalado',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    icono: 'Youtube',
    imagen: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    descripcionCorta: 'Disfruta videos, música, tutoriales, podcasts y entretenimiento en pantalla grande.',
    detalle: 'Navega por tus canales favoritos, listas de reproducción y contenido en alta definición con una interfaz optimizada para control remoto.',
    notaLegal: 'YouTube Premium podrá utilizarse iniciando sesión con una cuenta que tenga una membresía activa, pero no está incluido por defecto.',
  },
  {
    id: 'peliculas-series',
    nombre: 'Películas y Series',
    categoria: 'Streaming Multimedia',
    badge: 'Apps Compatibles',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icono: 'Film',
    imagen: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=600&q=80',
    descripcionCorta: 'Accede a aplicaciones multimedia compatibles y a plataformas gratuitas autorizadas.',
    detalle: 'Puedes disfrutar de servicios gratuitos legales como Pluto TV, Runtime, Vix (versión gratuita), entre otros disponibles en la tienda.',
    notaLegal: 'También podrán instalarse aplicaciones oficiales como Netflix, Prime Video o Disney+ cuando el dispositivo sea compatible. Su contenido de pago requiere la suscripción personal del usuario.',
  },
  {
    id: 'television-en-vivo',
    nombre: 'Televisión en Vivo',
    categoria: 'Canales Abiertos y Autorizados',
    badge: 'Canales Gratuitos',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icono: 'Tv',
    imagen: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
    descripcionCorta: 'Accede a canales de televisión gratuitos y legalmente disponibles mediante aplicaciones compatibles.',
    detalle: 'Transmisiones de señales nacionales y abiertas legalmente transmitidas por internet (canales nacionales, noticias, cultura y entretenimiento abierto).',
    notaLegal: 'No promovemos la piratería ni servicios ilegales. Solo se configuran accesos a señales públicas autorizadas y legales.',
  },
  {
    id: 'deportes-en-vivo',
    nombre: 'Deportes y Eventos',
    categoria: 'Información y Transmisiones',
    badge: 'Apps Oficiales',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icono: 'Trophy',
    imagen: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
    descripcionCorta: 'Utiliza aplicaciones oficiales y servicios autorizados para consultar y disfrutar eventos deportivos.',
    detalle: 'Acceso a resúmenes en video, marcadores, noticias y transmisiones autorizadas a través de plataformas oficiales.',
    notaLegal: 'Ciertos eventos y transmisiones exclusivas pueden requerir una suscripción o membresía activa por parte de la plataforma correspondiente.',
  },
  {
    id: 'tienda-apps',
    nombre: 'Tienda de Aplicaciones',
    categoria: 'Descargas Oficiales',
    badge: 'Google Play / Store',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    icono: 'Download',
    imagen: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    descripcionCorta: 'Busca, descarga y actualiza aplicaciones compatibles desde fuentes oficiales.',
    detalle: 'Explora miles de aplicaciones diseñadas para Android TV: reproductores de video, navegadores ligeros, utilidades y juegos sencillos.',
    notaLegal: 'La disponibilidad de cada app depende de la compatibilidad con la versión de Android y hardware del equipo.',
  },
  {
    id: 'musica-entretenimiento',
    nombre: 'Música y Entretenimiento',
    categoria: 'Audio, Podcasts y Anime',
    badge: 'Multi-plataforma',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    icono: 'Music',
    imagen: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    descripcionCorta: 'Disfruta música, videos, anime y otros contenidos mediante aplicaciones disponibles para Android TV.',
    detalle: 'Compatible con Spotify, Deezer, radios online mundiales, Crunchyroll y reproductores multimedia USB (VLC).',
    notaLegal: 'Las cuentas gratuitas tienen publicidad propia de cada servicio; las funciones premium requieren la cuenta del usuario.',
  },
];

export interface ItemIncluido {
  id: string;
  titulo: string;
  estado: 'incluido' | 'confirmado';
  descripcion: string;
  icono: string;
  imagen: string;
  detalleEspecifico: string;
}

export const QUE_INCLUYE: ItemIncluido[] = [
  {
    id: 'dispositivo',
    titulo: 'Dispositivo Android TV Box',
    estado: 'incluido',
    descripcion: 'Equipo compacto de alto rendimiento con procesador quad-core, 2GB RAM y 16GB de memoria.',
    icono: 'Cpu',
    imagen: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
    detalleEspecifico: 'Modelo con Android TV OS, antena Wi-Fi integrada y refrigeración pasiva silenciosa.',
  },
  {
    id: 'sistema-configurado',
    titulo: 'Sistema Configurado y Listo',
    estado: 'incluido',
    descripcion: 'No necesitas saber de programación. Lo recibes configurado en español y optimizado para fluidez.',
    icono: 'CheckCircle2',
    imagen: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    detalleEspecifico: 'Menú simplificado, hora local automática de Perú y ajustes de pantalla preestablecidos.',
  },
  {
    id: 'apps-instaladas',
    titulo: 'Aplicaciones Compatibles Preinstaladas',
    estado: 'incluido',
    descripcion: 'Las aplicaciones principales listas para su uso inmediato desde el primer encendido.',
    icono: 'LayoutGrid',
    imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    detalleEspecifico: 'YouTube, navegador web ligero, reproductor multimedia y accesos directos configurados.',
  },
  {
    id: 'cable-alimentacion',
    titulo: 'Cable y Adaptador de Corriente',
    estado: 'incluido',
    descripcion: 'Transformador de pared oficial de 5V / 2A de bajo consumo de energía eléctrica.',
    icono: 'Zap',
    imagen: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    detalleEspecifico: 'Enchufe plano estándar compatible con los tomacorrientes de Perú (no requiere adaptador de enchufe).',
  },
  {
    id: 'cable-hdmi',
    titulo: 'Cable HDMI de Alta Velocidad (1 Metro)',
    estado: 'incluido',
    descripcion: 'Transmite imagen nítida en alta definición y audio digital directo a tu televisor.',
    icono: 'Cable',
    imagen: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    detalleEspecifico: 'Longitud de 1 metro, conectores dorados resistentes a la corrosión para señal estable.',
  },
  {
    id: 'control-remoto',
    titulo: 'Control Remoto Ergonómico',
    estado: 'incluido',
    descripcion: 'Control por infrarrojos ligero con botones directos de inicio, volumen y modo mouse.',
    icono: 'Sliders',
    imagen: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=600&q=80',
    detalleEspecifico: 'Funciona con 2 pilas AAA (confirmar disponibilidad de pilas al coordinar la compra).',
  },
  {
    id: 'manual-soporte',
    titulo: 'Manual de Conexión + Centro de Ayuda',
    estado: 'incluido',
    descripcion: 'Guía paso a paso ilustrada en español creada por POOL STORE para que no tengas dudas.',
    icono: 'BookOpen',
    imagen: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    detalleEspecifico: 'Acceso ilimitado a nuestra página web de tutoriales y contacto directo a WhatsApp.',
  },
];

export const QUE_NO_INCLUYE: string[] = [
  'No incluye suscripciones pagadas a Netflix, Prime Video, YouTube Premium, Disney+, HBO Max u otras plataformas de streaming.',
  'No incluye cuentas oficiales de terceros ni claves ajenas.',
  'No incluye contenidos protegidos de pago de forma fraudulenta o sin autorización.',
  'No incluye el servicio de internet (debes contar con Wi-Fi en casa o datos móviles con zona Wi-Fi).',
  'No incluye accesorios no indicados (como teclados inalámbricos o convertidores RCA antiguos, disponibles por separado si los requieres).',
];

export interface TipoTvOpcion {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  conexionRequerida: string;
  compatibilidad: 'Total e inmediata' | 'Requiere cable o convertidor especial';
  esCompatibleDirecto: boolean;
  instrucciones: string;
  recomendacion: string;
}

export const TIPOS_DE_TV: TipoTvOpcion[] = [
  {
    id: 'smart-moderna',
    nombre: 'Smart TV moderna',
    icono: 'Tv',
    descripcion: 'Televisor con puertos HDMI y sistema propio (LG, Samsung, Sony, etc.).',
    conexionRequerida: 'Conexión directa con el Cable HDMI incluido.',
    compatibilidad: 'Total e inmediata',
    esCompatibleDirecto: true,
    instrucciones: 'Conecta el TV Box al puerto HDMI 1 o 2. Con el control de tu televisor cambia la entrada a HDMI. Ideal para televisores donde quieras mayor libertad para instalar aplicaciones que tu TV no tiene.',
    recomendacion: 'Funciona al 100% con la máxima resolución de tu pantalla (Full HD o 4K).',
  },
  {
    id: 'smart-desactualizada',
    nombre: 'Smart TV desactualizada',
    icono: 'History',
    descripcion: 'Televisor Smart de años anteriores donde YouTube ya no abre o la tienda no actualiza.',
    conexionRequerida: 'Conexión directa con el Cable HDMI incluido.',
    compatibilidad: 'Total e inmediata',
    esCompatibleDirecto: true,
    instrucciones: '¡Es el uso más recomendado! El TV Box reemplaza la interfaz vieja de tu televisor usando el puerto HDMI. No necesitas usar más el sistema lento de tu TV.',
    recomendacion: 'Soluciona de raíz el aviso "¿Tu TV ya no abre YouTube o no actualiza?".',
  },
  {
    id: 'led-lcd-sin-smart',
    nombre: 'Televisor LED o LCD sin funciones Smart',
    icono: 'Monitor',
    descripcion: 'Pantalla plana tradicional con entradas HDMI pero sin conexión a internet ni apps.',
    conexionRequerida: 'Conexión directa con el Cable HDMI incluido.',
    compatibilidad: 'Total e inmediata',
    esCompatibleDirecto: true,
    instrucciones: 'Conecta el HDMI al televisor y enchufa el TV Box a la corriente. Tu televisor tradicional se convierte automáticamente en una Smart TV completa con Android.',
    recomendacion: 'Ahorras cientos de soles evitando comprar una pantalla nueva.',
  },
  {
    id: 'plasma',
    nombre: 'Televisor Plasma',
    icono: 'Layers',
    descripcion: 'Televisor de tecnología plasma con puertos HDMI posteriores o laterales.',
    conexionRequerida: 'Conexión directa con el Cable HDMI incluido.',
    compatibilidad: 'Total e inmediata',
    esCompatibleDirecto: true,
    instrucciones: 'Verifica que tu televisor plasma disponga de al menos un puerto HDMI en buen estado. Conéctalo y disfruta de contenido en alta calidad.',
    recomendacion: 'Revisa que el puerto HDMI no tenga falsos contactos por el tiempo.',
  },
  {
    id: 'tubo-culona',
    nombre: 'Televisor antiguo de tubo (TV culona / CRT)',
    icono: 'Radio',
    descripcion: 'Televisores pesados y cuadrados con entradas de 3 colores (Amarillo, Blanco, Rojo).',
    conexionRequerida: 'Cable Plug AV a 3 RCA (o convertidor HDMI a AV RCA activo).',
    compatibilidad: 'Requiere cable o convertidor especial',
    esCompatibleDirecto: false,
    instrucciones: 'Estos televisores NO tienen puerto HDMI. Para utilizarlos se requiere conectar la salida AV de 3.5mm del TV Box al televisor mediante un cable AV a 3 RCA (Amarillo de video, Blanco y Rojo de audio), o usar un convertidor HDMI a RCA.',
    recomendacion: 'Consúltanos antes de comprar para verificar si disponemos del cable AV compatible para tu televisor antiguo.',
  },
];

export interface TutorialPrimeraVez {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  tiempoAproximado: string;
  pasos: string[];
  consejos: string;
  preguntasFrecuentes: { pregunta: string; respuesta: string }[];
  placeholderVideoText: string;
}

export const TUTORIALES_PRIMERA_VEZ: TutorialPrimeraVez[] = [
  {
    id: 'conexion-tv',
    numero: 1,
    titulo: 'Cómo conectar el TV Box al televisor',
    subtitulo: 'Paso esencial para transmitir imagen y sonido desde el primer segundo.',
    tiempoAproximado: '2 minutos',
    pasos: [
      'Ubica el cable HDMI incluido en la caja del TV Box.',
      'Conecta un extremo del cable en el puerto rotulado "HDMI" en la parte trasera del TV Box.',
      'Conecta el otro extremo en cualquier puerto HDMI disponible de tu televisor (ejemplo: HDMI 1, HDMI 2 o HDMI ARC).',
      'Asegúrate de que el cable quede firmemente insertado sin forzarlo.',
    ],
    consejos: 'Recuerda en qué número de puerto HDMI lo conectaste (por ejemplo HDMI 1), ya que lo necesitarás en el paso 3.',
    preguntasFrecuentes: [
      {
        pregunta: '¿Puedo usar otro cable HDMI más largo?',
        respuesta: 'Sí, cualquier cable HDMI 1.4 o 2.0 estándar funciona perfectamente con el TV Box.',
      },
      {
        pregunta: '¿Y si mi televisor no tiene HDMI?',
        respuesta: 'Necesitarás el cable de salida analógica AV (mini jack a 3 conectores RCA amarillo, blanco y rojo). Consúltanos por WhatsApp.',
      },
    ],
    placeholderVideoText: 'Video tutorial: Conexión física HDMI y ubicación de puertos.',
  },
  {
    id: 'cable-alimentacion',
    numero: 2,
    titulo: 'Cómo conectar el cable de alimentación eléctrica',
    subtitulo: 'Energiza el equipo de forma segura para prolongar su vida útil.',
    tiempoAproximado: '1 minuto',
    pasos: [
      'Retira el adaptador de corriente de 5V incluido en la caja.',
      'Inserta la punta redonda en la entrada de energía rotulada "DC 5V" o "POWER" en la parte trasera del TV Box.',
      'Enchufa el adaptador a un tomacorriente de pared estable o a un supresor de picos.',
      'Verifica que la pequeña luz frontal del TV Box se encienda (habitualmente color azul o rojo según el estado).',
    ],
    consejos: 'Utiliza preferentemente un tomacorriente en buen estado o supresor de picos para proteger el equipo de variaciones de voltaje.',
    preguntasFrecuentes: [
      {
        pregunta: '¿Puedo alimentar el TV Box desde el puerto USB del televisor?',
        respuesta: 'No es recomendable. Los puertos USB de los televisores entregan poca corriente (0.5A) y el TV Box necesita sus 2A oficiales para funcionar sin reiniciarse.',
      },
    ],
    placeholderVideoText: 'Video tutorial: Conexión correcta de la fuente de energía de 5V.',
  },
  {
    id: 'seleccionar-hdmi',
    numero: 3,
    titulo: 'Cómo seleccionar HDMI en el televisor',
    subtitulo: 'El paso donde la mayoría de personas se confunde al no ver imagen.',
    tiempoAproximado: '1 minuto',
    pasos: [
      'Toma el control remoto original de tu televisor (no el del TV Box).',
      'Busca el botón llamado "INPUT", "SOURCE", o el icono de una flecha entrando a un cuadro.',
      'Presiónalo y aparecerá una lista en pantalla: TV, AV, HDMI 1, HDMI 2, etc.',
      'Selecciona exactamente el puerto HDMI donde enchufaste el cable en el Paso 1.',
      'En pocos segundos verás en pantalla el logotipo de inicio o la pantalla principal de Android.',
    ],
    consejos: 'Si la pantalla dice "Sin señal", asegúrate de que el TV Box esté encendido con su luz azul y prueba cambiando a HDMI 2.',
    preguntasFrecuentes: [
      {
        pregunta: '¿Qué pasa si mi control de TV no tiene botón INPUT?',
        respuesta: 'Muchos controles de marcas como LG o Samsung tienen el botón SOURCE o una tecla de "Casa" (Home) para elegir la entrada.',
      },
    ],
    placeholderVideoText: 'Video tutorial: Cómo cambiar de canal de TV a entrada HDMI.',
  },
  {
    id: 'conectar-wifi',
    numero: 4,
    titulo: 'Cómo conectar el equipo al Wi-Fi de tu casa',
    subtitulo: 'Dale conexión a internet para disfrutar de streaming y descargas.',
    tiempoAproximado: '3 minutos',
    pasos: [
      'Con el control remoto del TV Box, dirígete al icono de engranaje (Ajustes / Configuración) en la esquina superior.',
      'Selecciona la opción "Red e Internet" o "Wi-Fi".',
      'Asegúrate de que la casilla de Wi-Fi esté activada.',
      'Busca el nombre de la red Wi-Fi de tu hogar en la lista que aparece.',
      'Presiona el botón "OK" del control remoto e introduce tu contraseña con el teclado en pantalla.',
      'Selecciona el botón de flecha derecha (Enter) para conectar y espera a que indique "Conectado".',
    ],
    consejos: 'Para una experiencia aún más estable sin fluctuaciones de señal, puedes conectar un cable de red de internet directo al puerto Ethernet.',
    preguntasFrecuentes: [
      {
        pregunta: '¿Qué velocidad mínima de internet necesito?',
        respuesta: 'Recomendamos al menos 15 a 20 Mbps para videos en alta definición (1080p) sin cortes.',
      },
      {
        pregunta: '¿La contraseña distingue mayúsculas?',
        respuesta: 'Sí, ten cuidado con mayúsculas, minúsculas y números al escribir tu clave en el teclado virtual.',
      },
    ],
    placeholderVideoText: 'Video tutorial: Conexión inalámbrica y cableada a internet.',
  },
  {
    id: 'configuracion-inicial',
    numero: 5,
    titulo: 'Cómo configurar el sistema por primera vez',
    subtitulo: 'Ajuste de hora, idioma y vinculación de tu cuenta personal de Google.',
    tiempoAproximado: '4 minutos',
    pasos: [
      'Nosotros enviamos el equipo con el idioma español ya seleccionado y hora de Perú sincronizada.',
      'Abre la aplicación "Google Play Store" desde la pantalla principal.',
      'Selecciona "Iniciar sesión" e ingresa tu correo de Gmail y contraseña de Google.',
      'Esto te permitirá descargar e instalar cualquier aplicación adicional que desees.',
      '¡Listo! Tu TV Box está 100% operativo para comenzar a disfrutar.',
    ],
    consejos: 'Puedes usar tu cuenta habitual de Gmail o crear una exclusiva para el uso familiar del televisor.',
    preguntasFrecuentes: [
      {
        pregunta: '¿Es obligatorio iniciar sesión con Google?',
        respuesta: 'Para ver YouTube y las apps que ya vienen preinstaladas no es estrictamente obligatorio, pero sí lo es si deseas descargar nuevas apps de la tienda oficial.',
      },
    ],
    placeholderVideoText: 'Video tutorial: Ajustes recomendados de inicio y cuenta de usuario.',
  },
];

export interface BotonControlRemoto {
  id: string;
  nombre: string;
  icono: string;
  color: string;
  ubicacion: string;
  funcionPrincipal: string;
  consejoUtil: string;
}

export const BOTONES_CONTROL_REMOTO: BotonControlRemoto[] = [
  {
    id: 'power',
    nombre: 'Botón de Encendido / Apagado (Power)',
    icono: 'Power',
    color: 'text-red-500 bg-red-500/10 border-red-500/30',
    ubicacion: 'Parte superior (color rojo o símbolo de poder)',
    funcionPrincipal: 'Enciende el TV Box o lo pone en modo de reposo de bajo consumo (Standby).',
    consejoUtil: 'Para apagar por completo y liberar memoria RAM, mantén presionado el botón 2 segundos y selecciona "Apagar" o "Reiniciar" si aparece la opción.',
  },
  {
    id: 'home',
    nombre: 'Botón Inicio (Home / Casa)',
    icono: 'Home',
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    ubicacion: 'Centro, con el icono de una casa',
    funcionPrincipal: 'Te regresa inmediatamente a la pantalla principal del TV Box sin importar qué aplicación tengas abierta.',
    consejoUtil: 'Si una aplicación se congela o te pierdes dentro de un menú, presiona una sola vez "Inicio" para volver a tu pantalla de inicio.',
  },
  {
    id: 'back',
    nombre: 'Botón Atrás (Back / Flecha de retorno)',
    icono: 'CornerUpLeft',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    ubicacion: 'Junto al botón de inicio, con una flecha curva hacia la izquierda',
    funcionPrincipal: 'Retrocede un paso dentro de menús, videos o páginas de aplicaciones.',
    consejoUtil: 'En muchas aplicaciones como YouTube, presionar Atrás dos veces seguidas muestra la pregunta para salir ordenadamente de la app.',
  },
  {
    id: 'dpad',
    nombre: 'Cruceta de Direcciones (Arriba, Abajo, Izq, Der)',
    icono: 'Compass',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    ubicacion: 'Rueda redonda de navegación central',
    funcionPrincipal: 'Mueve el cursor de selección entre aplicaciones, filas de videos y opciones del menú.',
    consejoUtil: 'Mantener presionada una dirección permite desplazarse velozmente a través de listas largas de canales o videos.',
  },
  {
    id: 'ok',
    nombre: 'Botón Confirmar (OK / Centro)',
    icono: 'Check',
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
    ubicacion: 'En el centro exacto de la cruceta direccional',
    funcionPrincipal: 'Abre la aplicación seleccionada, reproduce o pausa un video y confirma acciones.',
    consejoUtil: 'Durante la reproducción de un video, presionar OK muestra la barra de tiempo, volumen y botones de calidad.',
  },
  {
    id: 'volume',
    nombre: 'Botones de Volumen (+ y -)',
    icono: 'Volume2',
    color: 'text-violet-500 bg-violet-500/10 border-violet-500/30',
    ubicacion: 'Parte inferior o lateral derecha',
    funcionPrincipal: 'Sube o baja el nivel de audio interno del TV Box.',
    consejoUtil: 'Recomendamos dejar el volumen del TV Box al 80%-90% y regular el volumen final con el control del televisor para evitar distorsiones.',
  },
  {
    id: 'settings',
    nombre: 'Botón de Configuración / Menú',
    icono: 'Settings',
    color: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
    ubicacion: 'Icono de engranaje o tres líneas horizontales',
    funcionPrincipal: 'Abre opciones avanzadas de la aplicación en pantalla o los ajustes del sistema operativo.',
    consejoUtil: 'En aplicaciones de video permite cambiar subtítulos, pista de audio o calidad de imagen.',
  },
  {
    id: 'mouse',
    nombre: 'Modo Puntero / Ratón Virtual (Mouse)',
    icono: 'MousePointer',
    color: 'text-pink-500 bg-pink-500/10 border-pink-500/30',
    ubicacion: 'Icono de un ratón de computadora',
    funcionPrincipal: 'Hace aparecer un cursor tipo flecha en la pantalla que se mueve con la cruceta direccional.',
    consejoUtil: 'Muy útil para presionar botones pequeños dentro de páginas web o aplicaciones que fueron diseñadas para pantallas táctiles de celulares.',
  },
  {
    id: 'mute',
    nombre: 'Botón Silencio (Mute)',
    icono: 'VolumeX',
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
    ubicacion: 'Altavoz tachado',
    funcionPrincipal: 'Silencia el audio al instante con una sola pulsación y lo restablece al presionarlo nuevamente.',
    consejoUtil: 'Ideal para llamadas entrantes o momentos donde necesitas silencio inmediato.',
  },
];

export interface GuiaApp {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  pasos: string[];
}

export const GUIAS_APPS: GuiaApp[] = [
  {
    id: 'descargar-tienda',
    titulo: 'Cómo descargar aplicaciones desde la tienda oficial',
    descripcion: 'Aprende a buscar e instalar nuevas aplicaciones de forma segura desde Google Play Store.',
    icono: 'Download',
    pasos: [
      'Ve a la pantalla de inicio y abre la aplicación "Google Play Store".',
      'Dirígete a la barra de búsqueda en la parte superior (icono de lupa).',
      'Escribe el nombre de la app (ejemplo: "VLC", "Spotify", "Pluto TV") y presiona Buscar.',
      'Selecciona la app oficial de la lista y presiona el botón "Instalar".',
      'Espera a que termine la descarga e instalación. Al finalizar verás el botón "Abrir".',
    ],
  },
  {
    id: 'actualizar-apps',
    titulo: 'Cómo actualizar aplicaciones instaladas',
    descripcion: 'Mantén tus aplicaciones al día para recibir mejoras de rendimiento y seguridad.',
    icono: 'RefreshCw',
    pasos: [
      'Abre Google Play Store.',
      'Selecciona el icono de tu perfil en la esquina superior derecha.',
      'Elige "Gestionar aplicaciones y juegos".',
      'Si hay actualizaciones disponibles, verás la opción "Actualizar todo" o podrás actualizar cada app individualmente.',
      'Deja que el equipo descargue las actualizaciones sin desconectarlo.',
    ],
  },
  {
    id: 'app-no-compatible',
    titulo: 'Qué hacer si una aplicación dice que no es compatible',
    descripcion: 'Soluciones prácticas cuando una app de celular no aparece en la tienda de Android TV.',
    icono: 'AlertCircle',
    pasos: [
      'Algunas aplicaciones están diseñadas exclusivamente para pantallas táctiles de teléfonos y no para televisores con control remoto.',
      'Busca si existe una versión alternativa oficial en la tienda (muchas plataformas tienen una versión terminada en "for TV").',
      'Puedes usar el navegador web del TV Box para acceder al sitio web oficial del servicio.',
      'Si necesitas ayuda con una app en particular, escríbenos a nuestro WhatsApp de soporte para orientarte.',
    ],
  },
  {
    id: 'abrir-cerrar-apps',
    titulo: 'Cómo abrir y cerrar aplicaciones correctamente',
    descripcion: 'Evita la saturación de memoria RAM cerrando aplicaciones en segundo plano.',
    icono: 'Square',
    pasos: [
      'Para abrir una aplicación, ubícala en la pantalla de inicio con la cruceta y presiona OK.',
      'Para salir de forma limpia, presiona el botón Atrás hasta que la app pregunte "¿Deseas salir?".',
      'Si sales siempre presionando Home, la app quedará suspendida en la memoria.',
      'Para cerrar apps abiertas en segundo plano: ve a Ajustes > Aplicaciones > [Nombre de la app] > Forzar detención.',
    ],
  },
  {
    id: 'iniciar-sesion-cuentas',
    titulo: 'Cómo iniciar sesión en aplicaciones personales',
    descripcion: 'Consejos para ingresar fácil a Netflix, Prime Video, YouTube u otras cuentas.',
    icono: 'Key',
    pasos: [
      'Abre la aplicación correspondiente.',
      'La mayoría de servicios modernos para TV ofrecen el método de vinculación rápida por código QR o código numérico desde tu celular (ejemplo: entrar a netflix.com/activate desde el teléfono).',
      'Si prefieres escribir usuario y contraseña en pantalla, activa el Modo Mouse si el cursor no alcanza el recuadro.',
      'Una vez iniciada la sesión, la app recordará tu usuario permanentemente.',
    ],
  },
  {
    id: 'organizar-pantalla',
    titulo: 'Cómo organizar accesos directos en la pantalla principal',
    descripcion: 'Ten a mano tus aplicaciones preferidas en la primera fila de tu pantalla.',
    icono: 'Grid',
    pasos: [
      'En la pantalla principal, desplázate hasta el final de la fila de aplicaciones y pulsa el botón "+" (Añadir).',
      'Marca las aplicaciones que más utilizas para que aparezcan en el menú directo.',
      'Para reordenar una app, colócate sobre ella y mantén presionado el botón OK del control durante 2 segundos.',
      'Elige la opción "Mover" y desplázala con las flechas hacia la izquierda o derecha.',
      'Presiona OK nuevamente para fijar la posición.',
    ],
  },
];

export interface ProblemaFrecuente {
  id: string;
  titulo: string;
  sintoma: string;
  causaProbable: string;
  solucionPasos: string[];
  advertencia: string;
  mensajeWhatsAppSoporte: string;
}

export const SOLUCION_PROBLEMAS: ProblemaFrecuente[] = [
  {
    id: 'no-enciende',
    titulo: '1. El TV Box no enciende o no prende la luz indicadora',
    sintoma: 'El equipo no muestra ninguna luz LED (ni azul ni roja) al conectarlo.',
    causaProbable: 'Falso contacto en el enchufe, toma de corriente sin energía o clavija de alimentación mal insertada.',
    solucionPasos: [
      'Verifica que el transformador esté firmemente conectado a la pared y que el tomacorriente tenga energía (prueba enchufando un cargador de celular u otro artefacto para confirmar).',
      'Asegúrate de que la clavija redonda esté insertada hasta el fondo en el puerto DC del TV Box.',
      'Si estás usando un supresor de picos o extensión, confirma que su interruptor de encendido esté activo.',
      'Si todo está conectado y la luz no enciende, prueba en otro enchufe de tu casa.',
    ],
    advertencia: 'Nunca utilices transformadores de otro voltaje diferente a 5V (ejemplo 12V de módems), ya que quemarías el equipo.',
    mensajeWhatsAppSoporte: 'Hola soporte POOL STORE, mi TV Box no enciende ni prende la luz led. Ya verifiqué el tomacorriente. ¿Me pueden ayudar?',
  },
  {
    id: 'sin-imagen',
    titulo: '2. No se ve nada en la pantalla del televisor (Sin señal / pantalla negra)',
    sintoma: 'El TV Box tiene luz encendida pero el televisor muestra "Sin Señal" o pantalla negra.',
    causaProbable: 'Canal de entrada HDMI incorrecto seleccionado en el televisor o cable HDMI flojo.',
    solucionPasos: [
      'Toma el control remoto de tu televisor y presiona "INPUT" o "SOURCE".',
      'Revisa físicamente en qué número de puerto HDMI conectaste el cable (HDMI 1, HDMI 2, etc.) y selecciona exactamente ese canal en tu TV.',
      'Desconecta ambos extremos del cable HDMI y vuelve a conectarlos con firmeza.',
      'Prueba conectando el cable en otro puerto HDMI de tu televisor.',
      'Si es posible, apaga el televisor y el TV Box durante 30 segundos y vuelve a encender primero el televisor y luego el TV Box.',
    ],
    advertencia: 'No muevas con brusquedad los cables mientras el televisor está encendido para no dañar los puertos.',
    mensajeWhatsAppSoporte: 'Hola soporte POOL STORE, mi TV Box tiene la luz encendida pero mi televisor dice "Sin Señal" en HDMI. ¿Qué puedo hacer?',
  },
  {
    id: 'sin-wifi',
    titulo: '3. El equipo no se conecta al Wi-Fi o la conexión es inestable',
    sintoma: 'El Wi-Fi se desconecta con frecuencia, sale "Sin internet" o no encuentra la red.',
    causaProbable: 'Distancia excesiva con el router, contraseña mal escrita o saturación de canales en la banda de 2.4 GHz.',
    solucionPasos: [
      'Ve a Ajustes > Red e Internet > Wi-Fi, desactívalo 5 segundos y vuelve a activarlo.',
      'Olvida la red Wi-Fi guardada y vuelve a ingresar la contraseña prestando atención a mayúsculas y minúsculas.',
      'Reinicia tu router de internet de casa (desconéctalo de la pared 1 minuto y vuelve a enchufarlo).',
      'Si el TV Box está muy lejos del router con paredes gruesas de por medio, acércalo temporalmente o conecta un cable de red Ethernet RJ45 para una señal 100% estable.',
    ],
    advertencia: 'Las paredes de concreto armado y microondas pueden degradar fuertemente la señal Wi-Fi.',
    mensajeWhatsAppSoporte: 'Hola soporte POOL STORE, mi TV Box no conecta al Wi-Fi o la señal se cae constantemente. Deseo orientación técnica.',
  },
  {
    id: 'youtube-no-abre',
    titulo: '4. YouTube o una aplicación no abre o se queda congelada',
    sintoma: 'Presionas el icono de YouTube y se cierra solo, se queda en pantalla negra o cargando en bucle.',
    causaProbable: 'Memoria caché saturada de la aplicación o fecha y hora desincronizada en el TV Box.',
    solucionPasos: [
      'Comprobación clave: Ve a Ajustes > Preferencias del dispositivo > Fecha y hora. Asegúrate de que la fecha y hora sean las correctas de hoy (si la fecha está en el año 2020 o desfasada, internet y YouTube se bloquean automáticamente).',
      'Ve a Ajustes > Aplicaciones > Ver todas las aplicaciones > YouTube.',
      'Selecciona "Forzar detención" y luego "Borrar memoria caché".',
      'Vuelve a abrir YouTube desde la pantalla de inicio.',
    ],
    advertencia: 'No selecciones "Borrar datos" a menos que desees volver a iniciar sesión desde cero.',
    mensajeWhatsAppSoporte: 'Hola soporte POOL STORE, la aplicación de YouTube se queda cargando en mi TV Box y no abre los videos.',
  },
  {
    id: 'app-dejo-funcionar',
    titulo: '5. Una aplicación instalada dejó de funcionar o pide actualizar',
    sintoma: 'Al ingresar sale un aviso que dice "Esta versión ya no es compatible, por favor actualice".',
    causaProbable: 'La plataforma lanzó una actualización obligatoria en sus servidores.',
    solucionPasos: [
      'Abre Google Play Store en el TV Box.',
      'Busca la aplicación en la tienda y pulsa "Actualizar".',
      'Si la tienda no muestra actualización, desinstala la aplicación y vuelve a instalarla desde Google Play.',
      'Verifica que tu TV Box tenga espacio disponible de almacenamiento (Ajustes > Almacenamiento).',
    ],
    advertencia: 'No descargues archivos APK de páginas desconocidas en internet que puedan contener publicidad invasiva.',
    mensajeWhatsAppSoporte: 'Hola soporte POOL STORE, una app de mi TV Box me pide actualizar obligatoriamente. ¿Cómo lo resuelvo?',
  },
  {
    id: 'equipo-lento',
    titulo: '6. El equipo funciona lento o se demora en responder',
    sintoma: 'Los menús tardan en abrir, el cursor se pega o los videos tienen tirones.',
    causaProbable: 'Demasiadas aplicaciones abiertas simultáneamente en segundo plano o memoria casi llena.',
    solucionPasos: [
      'Reinicia el equipo: Mantén presionado el botón de encendido del control durante 3 segundos y pulsa "Reiniciar" (o desconéctalo de la corriente 10 segundos). Esto libera toda la memoria RAM.',
      'Desinstala aplicaciones o juegos que hayas instalado y que no utilices para liberar memoria interna.',
      'Cierra las aplicaciones con el botón Atrás y no únicamente con Home.',
      'Verifica que no haya descargas activas en segundo plano en la Play Store.',
    ],
    advertencia: 'No dejes el TV Box encendido las 24 horas del día durante semanas; reiniciarlo periódicamente mantiene el sistema rápido.',
    mensajeWhatsAppSoporte: 'Hola soporte POOL STORE, siento mi TV Box un poco lento al navegar por los menús. Deseo consejos para optimizarlo.',
  },
  {
    id: 'control-no-responde',
    titulo: '7. El control remoto no responde o responde con retraso',
    sintoma: 'Presionas los botones y la luz del TV Box no parpadea o hay que acercarse demasiado.',
    causaProbable: 'Pilas gastadas o con poca carga, o bloqueo físico del sensor infrarrojo frontal.',
    solucionPasos: [
      'Cambia las 2 pilas AAA del control remoto por un par de pilas alcalinas nuevas de buena marca.',
      'Asegúrate de apuntar directamente hacia la parte delantera del TV Box (donde está la luz LED), sin objetos que tapen la línea de visión.',
      'Limpia con un paño seco la ventanita frontal del TV Box y la punta emisora del control.',
      'Si tienes activo el "Modo Mouse", presiona el botón del ratón en el control para volver al modo de cruceta normal.',
    ],
    advertencia: 'No mezcles pilas viejas con pilas nuevas dentro del control remoto.',
    mensajeWhatsAppSoporte: 'Hola soporte POOL STORE, el control remoto de mi TV Box no responde a los comandos. Ya revisé las pilas.',
  },
  {
    id: 'sin-sonido',
    titulo: '8. El televisor no tiene sonido o el audio sale desfasado',
    sintoma: 'El video se reproduce correctamente pero los altavoces no emiten audio.',
    causaProbable: 'Volumen del TV Box en cero, modo silencio (Mute) activo o formato de audio incompatible.',
    solucionPasos: [
      'Presiona el botón de subir volumen en el control remoto del TV Box hasta ver la barra de audio al máximo.',
      'Verifica también que el televisor no esté en "MUTE" con el control de tu TV.',
      'Ve a Ajustes > Preferencias del dispositivo > Pantalla y sonido > Sonido avanzado.',
      'En formatos de sonido, selecciona "PCM" o "Nunca usar sonido envolvente" si tu televisor no cuenta con decodificador de teatro en casa.',
      'Desconecta y vuelve a insertar el cable HDMI.',
    ],
    advertencia: 'Evita jalar el cable HDMI bruscamente para no averiar el canal de audio del conector.',
    mensajeWhatsAppSoporte: 'Hola soporte POOL STORE, en mi TV Box se ve la imagen pero no sale sonido en los videos.',
  },
  {
    id: 'error-tienda',
    titulo: '9. Error al descargar o actualizar en Google Play Store',
    sintoma: 'La tienda muestra mensaje "Descarga pendiente", código de error o no descarga nada.',
    causaProbable: 'Caché de servicios de Google Play saturada o falta de conexión estable.',
    solucionPasos: [
      'Ve a Ajustes > Aplicaciones > Ver todas las aplicaciones.',
      'Busca "Google Play Store" > Forzar detención > Borrar memoria caché y Borrar datos.',
      'Busca también "Servicios de Google Play" > Borrar memoria caché.',
      'Reinicia el TV Box y vuelve a ingresar a Play Store.',
      'Asegúrate de que la fecha y hora sigan estando en sincronización automática.',
    ],
    advertencia: 'Espera un par de minutos después de reiniciar antes de abrir la tienda para que carguen los servicios de fondo.',
    mensajeWhatsAppSoporte: 'Hola soporte POOL STORE, tengo un error en la Play Store de mi TV Box que no me deja descargar.',
  },
  {
    id: 'reiniciar-seguro',
    titulo: '10. Cómo reiniciar el TV Box correctamente de forma segura',
    sintoma: 'Deseas refrescar el sistema o restablecer el funcionamiento tras varias horas de uso.',
    causaProbable: 'Procedimiento de mantenimiento preventivo para mantener el equipo ágil.',
    solucionPasos: [
      'Método 1 (Recomendado): Mantén presionado el botón rojo de apagado en el control remoto durante 3 segundos. Aparecerá una ventana con la opción "Reiniciar". Presiona OK.',
      'Método 2: Ve a Ajustes > Preferencias del dispositivo > Información > Reiniciar.',
      'Método 3 (Si el equipo no responde por completo): Desconecta con suavidad la clavija de alimentación en la parte trasera del TV Box, espera 15 segundos y vuelve a enchufarla.',
    ],
    advertencia: 'No desenchufes el equipo mientras se esté realizando una actualización de sistema en pantalla.',
    mensajeWhatsAppSoporte: 'Hola soporte POOL STORE, necesito consultar el procedimiento de mantenimiento y reinicio de mi equipo.',
  },
];

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

export const PREGUNTAS_FRECUENTES_TV_BOX: PreguntaFrecuente[] = [
  {
    pregunta: '¿Qué pasa si mi televisor no es Smart TV?',
    respuesta: '¡Funciona a la perfección! Esa es precisamente la mayor ventaja de un TV Box. Siempre que tu televisor tenga una entrada HDMI disponible (o cables RCA si es de tubo con el adaptador respectivo), el TV Box se encargará de todo el procesamiento inteligente, convirtiendo tu pantalla en un centro de entretenimiento con Android.',
  },
  {
    pregunta: '¿Necesito pagar mensualidades por el TV Box?',
    respuesta: 'No. El TV Box y su configuración inicial se pagan una sola vez. No existen cuotas mensuales obligatorias por el dispositivo ni por POOL STORE. Lo único que requiere pago mensual independiente son las suscripciones privadas que tú decidas contratar por tu cuenta con plataformas como Netflix, Disney+ o Prime Video si deseas ver su catálogo de pago.',
  },
  {
    pregunta: '¿Incluye canales de televisión?',
    respuesta: 'El sistema permite acceder a canales de televisión gratuitos, abiertos y legalmente disponibles mediante aplicaciones oficiales y compatibles. No vendemos ni incluimos servicios de piratería ni señales no autorizadas. Todo el contenido gratuito respeta las transmisiones legales por internet.',
  },
  {
    pregunta: '¿Funciona con televisores antiguos de tubo (TV culona)?',
    respuesta: 'Sí es posible, pero requiere una conexión especial. Los televisores de tubo no tienen puerto HDMI, por lo que se utiliza la salida AV del TV Box mediante un cable especial mini-jack a 3 conectores RCA (amarillo, blanco y rojo) o un convertidor activo. Consúltanos por WhatsApp para orientarte sobre el cable compatible.',
  },
  {
    pregunta: '¿Qué velocidad de internet necesito en casa?',
    respuesta: 'Recomendamos un mínimo de 15 a 20 Mbps de velocidad para reproducir videos en calidad Full HD de forma fluida. Si tienes varios dispositivos conectados a la vez en casa, una velocidad de 30 a 50 Mbps garantizará que no sufras pausas en las transmisiones.',
  },
  {
    pregunta: '¿Puedo usar mi cuenta existente de Netflix, Disney+ o Prime Video?',
    respuesta: 'Sí, por supuesto. Si ya dispones de una cuenta activa con tus claves personales, puedes ingresar a las aplicaciones compatibles con tus credenciales y disfrutar de todo tu catálogo sin inconvenientes.',
  },
  {
    pregunta: '¿Qué garantía tiene el producto?',
    respuesta: 'Ofrecemos 3 meses de garantía por defectos de fábrica en el equipo y componentes de hardware. Además, cuentas con nuestro asesoramiento continuo y centro de ayuda digital para cualquier duda sobre el funcionamiento del sistema.',
  },
  {
    pregunta: '¿Puedo instalar más aplicaciones además de las que vienen?',
    respuesta: 'Sí. El equipo cuenta con la tienda Google Play Store oficial, por lo que puedes buscar y descargar cualquier aplicación compatible con Android TV: reproductores de video (como VLC), aplicaciones de música (Spotify, radios), juegos livianos y navegadores web.',
  },
  {
    pregunta: '¿Se puede conectar por cable de red (Ethernet)?',
    respuesta: 'Sí. Además de Wi-Fi inalámbrico, el TV Box cuenta con un puerto de red RJ45 Ethernet en la parte posterior. Conectar un cable de red directo desde tu módem o router es la forma más recomendada para evitar cualquier interferencia en la señal.',
  },
  {
    pregunta: '¿Es difícil de instalar?',
    respuesta: 'Para nada. Solo son 3 conexiones sencillas: enchufar a la corriente, conectar el cable HDMI al televisor y vincularlo a tu Wi-Fi. Viene listo para usar en español y nosotros te proporcionamos el manual con pasos claros y videos de apoyo.',
  },
  {
    pregunta: '¿Viene listo para conectar y usar?',
    respuesta: 'Sí. En POOL STORE nos encargamos de verificar el equipo antes de entregarlo: configuramos el idioma en español, ajustamos la zona horaria de Perú e instalamos las aplicaciones base compatibles para que solo tengas que conectarlo a tu televisor y disfrutar.',
  },
];
