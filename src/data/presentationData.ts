import { StationData, TeamMember, QuizQuestion } from '../types/presentation';

export const UNIVERSITY_INFO = {
  institution: 'Universidad Politécnica Salesiana (UPS)',
  campus: 'Sede Cuenca / Campus El Vecino',
  career: 'Ingeniería Mecatrónica',
  course: 'TECNOLOGÍAS Y SOFTWARE PARA MECATRÓNICA',
  group: 'Grupo 2',
  tutor: 'Ing. Ángel Eugenio Cárdenas Cadme',
  topic: 'Estaciones MPS y Célula de Manufactura Automatizada',
  academicPeriod: 'Período Académico 2026',
};

export const TEAM_MEMBERS: TeamMember[] = [
  { name: 'AARON FERNANDO GARCIA GOMEZ', role: 'Estudiante de Mecatrónica' },
  { name: 'FREDDY ALEXANDER IDROVO GUERRERO', role: 'Estudiante de Mecatrónica' },
  { name: 'DAVID ALEJANDRO PIZARRO LOOR', role: 'Estudiante de Mecatrónica' },
  { name: 'HUGO ANDRES SARES VEGA', role: 'Estudiante de Mecatrónica' },
  { name: 'ZICHENG ZHANG', role: 'Estudiante de Mecatrónica' },
  { name: 'ANA CAROLINA ZUÑIGA BRAVO', role: 'Estudiante de Mecatrónica' },
  { name: 'ELIZABETH DEL CARMEN FRANCO NAVARRO', role: 'Estudiante de Mecatrónica' },
];

export const STATIONS: StationData[] = [
  {
    id: 'handling',
    number: 1,
    orderTitle: '1ª Estación del Flujo',
    name: 'Estación de Manipulación / Selección (MPS Handling)',
    shortName: 'MPS Selección (Handling)',
    subtitle: 'Alimentación, sujeción y transferencia de piezas mediante pórtico neumático',
    summary:
      'Encargada de tomar las piezas del módulo de alimentación mediante una pinza neumática y trasladarlas transversalmente usando un cilindro sin vástago Festo DGE hacia la siguiente estación o rampa de clasificación.',
    videoSrc: '/assets/aistudio/mps_seleccion_c6492c4c.mp4',
    posterSrc: '/assets/posters/seleccion.jpg',
    pdfFile: '/assets/aistudio/MPS_de_selecci_n_-_Handling_72c467fa.pdf',
    pdfName: 'MPS_de_selección_Handling.pdf',
    photos: [
      '/assets/photos/handling_3.jpg',
      '/assets/photos/handling_7.jpg',
      '/assets/photos/handling_5.jpg',
      '/assets/photos/handling_2.jpg',
      '/assets/photos/handling_8.jpg',
      '/assets/photos/handling_11.jpg',
      '/assets/photos/handling_1.jpg',
    ],
    keySpecs: {
      precision: '±0.1 mm (topes mecánicos ajustables)',
      speed: 'Hasta 3.0 m/s (Eje X Festo DGE)',
      pressureForce: '150 N de empuje a 6 bar (Eje Z)',
      cycleTime: '10 - 15 ms por electroválvula',
      precisionBadge: '±0.1 mm',
      speedBadge: 'Hasta 3.0 m/s',
      forceBadge: '150 N (6 bar)',
      cycleBadge: '10 - 15 ms',
    },
    controllers: [
      {
        title: 'Electroválvulas / Bloque Neumático Festo',
        model: 'Festo Manifold CPV / Válvulas biestables 5/2 y monoestables',
        description:
          'Actúan como conmutadores de fluido. Reciben el pulso de 24V del PLC y conmutan mecánicamente su vía en apenas 10 a 15 milisegundos para inyectar o purgar aire a alta presión en las cámaras de los cilindros.',
        executionSpeed: '10 - 15 ms de conmutación de vía',
        signals: '24V DC con señal luminosa LED de estado en bobina',
        highlights: [
          'Conmutación ultrarrápida para ciclos continuos de alta cadencia',
          'Alimentación neumática regulada a 6 bar con unidad de mantenimiento',
          'Válvulas biestables que mantienen posición en caso de pérdida momentánea de energía',
        ],
      },
      {
        title: 'PLC Siemens Simatic S7-300',
        model: 'CPU 314C / 315-2 DP (Siemens)',
        description:
          'Ejecuta la rutina secuencial de pick & place (bajar pinza, cerrar garra, subir, mover carro X, descender y soltar). Tiempo de escaneo de microsegundos con bus MPI/Profibus.',
        executionSpeed: '0.01 a 0.1 µs por instrucción binaria',
        signals: 'Entradas/Salidas optoacopladas 24V DC',
        highlights: [
          'Coordinación directa de interbloqueos de seguridad con estaciones adyacentes',
          'Manejo de señales de sensores magnéticos y fotoeléctricos en tiempo real',
        ],
      },
    ],
    actuators: [
      {
        title: 'Cilindro Lineal sin Vástago (Eje X)',
        model: 'Festo DGE-25-300-ZR / DGE Linear Drive',
        type: 'Actuador neumático lineal de traslación transversal',
        specs: [
          { label: 'Velocidad Operativa Máxima', value: 'Hasta 3 m/s' },
          { label: 'Repetibilidad', value: '±0.1 mm', detail: 'Lograda mediante topes mecánicos ajustables en extremos' },
          { label: 'Tipo de Transmisión', value: 'Acoplamiento magnético / mecánico hermético' },
          { label: 'Aplicación Principal', value: 'Pick & Place de alta velocidad y amplio recorrido' },
        ],
        description:
          'Guía lineal neumática diseñada para traslaciones transversales rápidas. Ofrece alta rigidez a la torsión y traslada el conjunto del eje Z entre las posiciones de toma y entrega con suavidad amortiguada.',
      },
      {
        title: 'Cilindro Guiado Anti-rotación (Eje Z)',
        model: 'Festo DZF-18-40-A-P-A',
        type: 'Cilindro neumático plano de descenso vertical',
        specs: [
          { label: 'Fuerza de Empuje', value: '~150 N directos', detail: 'A presión de trabajo nominal de 6 bar' },
          { label: 'Geometría del Émbolo', value: 'Perfil ovalado anti-rotación', detail: 'Evita el cabeceo angular de la pinza' },
          { label: 'Carrera', value: '40 mm / 50 mm', detail: 'Descenso vertical preciso hacia la pieza' },
        ],
        description:
          'Cilindro de descenso vertical. A 6 bares de presión proporciona una fuerza de empuje directa de aproximadamente 150 N, asegurando que la pinza baje con rigidez estructural sin ladearse ni girar.',
      },
      {
        title: 'Pinza Neumática Festo',
        model: 'Festo HGP / HGD paralelo',
        type: 'Garra de sujeción mecánica de 2 dedos',
        specs: [
          { label: 'Fuerza de Cierre', value: '40 N a 120 N' },
          { label: 'Tiempo de Apertura/Cierre', value: '~0.04 - 0.05 s' },
          { label: 'Mordazas', value: 'Mecanizadas con insertos de agarre firme' },
        ],
        description:
          'Grip neumático sincronizado de doble efecto que aprisiona la pieza cilíndrica con alta seguridad antes de iniciar la carrera de elevación.',
      },
    ],
    sensors: [
      {
        title: 'Sensores Magnéticos de Final de Carrera (SME / SMT)',
        type: 'Estado Sólido (Efecto Hall) / Reed Switch',
        range: 'Detección del campo magnético del émbolo a través del aluminio',
        responseTime: '< 1.5 milisegundos',
        description:
          'Montados externamente en las ranuras en T del perfil de los cilindros Festo (2B1, 2B2). Detectan la posición exacta del émbolo con precisión de ±0.1 mm, enviando al PLC la señal de confirmación de fin de carrera.',
      },
      {
        title: 'Sensor Fotoeléctrico de Presencia (PART_AV)',
        type: 'Barrera difusa / Reflexión directa por fibra óptica',
        range: '10 a 50 mm regulable por potenciómetro',
        responseTime: '1 a 2 milisegundos',
        description:
          'Monitorea el nido o rampa de entrada para detectar si una pieza ha sido posicionada, autorizando al PLC a iniciar la secuencia de sujeción sin disparos en falso.',
      },
    ],
    threeModelType: 'handling',
  },
  {
    id: 'sorting',
    number: 2,
    orderTitle: '2ª Estación del Flujo',
    name: 'Estación de Posicionamiento / Clasificación (MPS Sorting)',
    shortName: 'MPS Posicionamiento (Sorting)',
    subtitle: 'Transporte continuo, discriminación de materiales y direccionamiento neumático',
    summary:
      'Transporta las piezas a lo largo de una cinta accionada por motor DC de 24V. Mediante sensores ópticos e inductivos discrimina infaliblemente entre metal y plástico, y activa cilindros neumáticos de carrera corta para desviar cada pieza a su respectiva rampa.',
    videoSrc: '/assets/aistudio/mps_posicion_ae176984.mp4',
    posterSrc: '/assets/posters/posicion.jpg',
    pdfFile: '/assets/aistudio/MPS_de_posicionamiento_-___Sorting_35c6720f.pdf',
    pdfName: 'MPS_de_posicionamiento_Sorting.pdf',
    photos: [
      '/assets/photos/sorting_8.jpg',
      '/assets/photos/sorting_2.jpg',
      '/assets/photos/sorting_6.jpg',
      '/assets/photos/sorting_4.jpg',
      '/assets/photos/sorting_9.jpg',
      '/assets/photos/sorting_10.jpg',
      '/assets/photos/sorting_1.jpg',
    ],
    keySpecs: {
      precision: '2 a 4 mm rango sensor inductivo / 100-500 PPR encoder',
      speed: '10 a 20 cm/s en banda transportadora continua',
      pressureForce: 'Cilindros Festo a 4 - 8 bar',
      cycleTime: '0.1 a 0.2 s en carrera de expulsión',
      precisionBadge: '2 - 4 mm / 500 PPR',
      speedBadge: '10 - 20 cm/s',
      forceBadge: '4 - 8 bar',
      cycleBadge: '0.1 - 0.2 s',
    },
    controllers: [
      {
        title: 'Tarjetas Amplificadoras de Motor (AM1 / AM2)',
        model: 'Valentin Elektronik / Zettler K1 - Tarjetas de Potencia AM',
        description:
          'Manejan la etapa de potencia comandada por el PLC. Entregan voltaje modulado (0-24V DC) o señales de Modulación por Ancho de Pulso (PWM) para controlar el torque, el sentido de giro y la velocidad continua del motor de la banda.',
        executionSpeed: 'Control de corriente continuo con protección térmica',
        signals: 'Consigna analógica 0-10V o PWM desde salida de transistor del PLC',
        highlights: [
          'Aislamiento galvánico total entre la lógica del PLC y la corriente del motor',
          'Arranque y frenado suave para evitar desprendimiento o vuelco de piezas en la cinta',
          'Disipador de aluminio integrado en tarjeta AM1 y relés K1/K2 de inversión de marcha',
        ],
      },
      {
        title: 'PLC Siemens Simatic S7-300 (Lógica de Clasificación)',
        model: 'CPU 314C con contadores rápidos HSC (High Speed Counter)',
        description:
          'Monitorea el canal de pulsos del encoder acoplado al motor. Cuando un sensor detecta la pieza, el PLC registra la cota métrica y calcula con exactitud matemática el momento de disparar el cilindro correspondiente.',
        executionSpeed: 'Frecuencia de conteo por hardware hasta decenas de kHz',
        signals: 'Conteo incremental y disparo por interrupción de tiempo',
        highlights: [
          'Sincronización milimétrica entre desplazamiento lineal y activación neumática',
          'Discriminación lógica por tipo de material (Metálico, Plástico Rojo, Plástico Negro)',
        ],
      },
    ],
    actuators: [
      {
        title: 'Motor DC con Reductor Mecánico de Corona y Sinfín',
        model: 'Dunkermotoren / Festo 4610 24V DC',
        type: 'Motor de corriente continua con escobillas y tren reductor',
        specs: [
          { label: 'Tensión de Operación', value: '24V DC' },
          { label: 'Velocidad de Transporte', value: '10 a 20 cm/s', detail: 'Calibrado para estabilidad de piezas en celdas' },
          { label: 'Torque de Salida', value: 'Elevado mediante reductor mecánico integrado' },
          { label: 'Acople', value: 'Rodillo motriz estriado de la banda de transporte' },
        ],
        description:
          'Motor DC de 24V acoplado mecánicamente al rodillo de la cinta transportadora. Provee un par motor constante para arrastrar piezas de distintos pesos a velocidad lineal uniforme.',
      },
      {
        title: 'Cilindros Desviadores Neumáticos Festo',
        model: 'Festo DSNU / Cilindro de carrera corta con palpador de desvío',
        type: 'Actuador neumático de expulsión rápida',
        specs: [
          { label: 'Velocidad de Acción', value: '0.1 a 0.2 segundos de extensión' },
          { label: 'Presión de Operación', value: '4 a 8 bar' },
          { label: 'Número de Desviadores', value: '2 cilindros para rampas 1 y 2 + paso libre rampa 3' },
        ],
        description:
          'Cilindros neumáticos de carrera corta que se extienden en un lapso de 0.1 a 0.2 segundos a presiones de 4 a 8 bares para impactar y desviar la pieza en movimiento hacia su rampa correspondiente, retrayéndose de inmediato.',
      },
    ],
    sensors: [
      {
        title: 'Encoder Óptico Incremental en Tapa de Motor',
        type: 'Disco codificador óptico ranurado con doble fototransistor',
        range: '100 a 500 Pulsos Por Revolución (PPR)',
        responseTime: 'Microsegundos (salida digital en cuadratura A/B)',
        description:
          'Acoplado directamente al eje trasero del motor DC. Genera pulsos digitales que el PLC contabiliza para conocer el trayecto métrico exacto recorrido por la banda y determinar el milisegundo exacto de disparo del desviador.',
      },
      {
        title: 'Sensor Inductivo de Proximidad',
        type: 'Oscilador electromagnético de alta frecuencia',
        range: 'Rango ciego muy corto: 2 mm a 4 mm',
        responseTime: '< 2 milisegundos',
        description:
          'Detecta exclusivamente materiales conductores metálicos al amortiguar el campo oscilante generado en su bobina frontal. Permite al sistema discriminar infaliblemente metal de plástico en milésimas de segundo.',
      },
      {
        title: 'Sensores Ópticos / Retrorreflectivos de Presencia',
        type: 'Barreras de luz en inicio y rampas',
        range: '10 a 100 mm',
        responseTime: '1 a 2 ms',
        description:
          'Detectan la entrada de pieza a la banda y verifican el llenado o atasco en las rampas de salida mediante fotocélulas calibradas.',
      },
    ],
    threeModelType: 'sorting',
  },
  {
    id: 'robot',
    number: 3,
    orderTitle: '3ª Estación del Flujo',
    name: 'Estación de Brazo Robot Articulado (MPS Robot)',
    shortName: 'Brazo Robot (RV-2AJ)',
    subtitle: 'Manipulación robótica articulada de 5 ejes para enlace inter-estaciones',
    summary:
      'Robot industrial articulado vertical de 5 grados de libertad con cinemática inversa en tiempo real. Enlaza el flujo de producción recogiendo las piezas clasificadas para insertarlas con precisión micrométrica en el mandril del torno CNC.',
    videoSrc: '/assets/aistudio/brazo_ddf2695d.mp4',
    posterSrc: '/assets/posters/brazo.jpg',
    pdfFile: '/assets/aistudio/Brazo_robotico_4c9ce533.pdf',
    pdfName: 'Brazo_robótico_RV-2AJ.pdf',
    photos: [
      '/assets/photos/robot_4.jpg',
      '/assets/photos/robot_11.jpg',
      '/assets/photos/robot_10.jpg',
      '/assets/photos/robot_1.jpg',
      '/assets/photos/robot_9.jpg',
      '/assets/photos/robot_12.jpg',
      '/assets/photos/robot_7.jpg',
    ],
    keySpecs: {
      precision: '±0.02 mm (Repetibilidad micrométrica)',
      speed: '2100 mm/s en trayectoria compuesta',
      pressureForce: 'Payload 2 kg / Pinza 40 - 150 N a 6 bar',
      cycleTime: '0.05 s apertura/cierre de pinza',
      precisionBadge: '±0.02 mm',
      speedBadge: '2100 mm/s',
      forceBadge: 'Payload 2 kg (150 N)',
      cycleBadge: '0.05 s',
    },
    controllers: [
      {
        title: 'Controlador Mitsubishi MELFA CR1 / Teach Pendant (R28TB)',
        model: 'Mitsubishi R28TB con Display LCD y Parada de Emergencia',
        description:
          'Unidad de programación manual y control cinemático. Ejecuta cálculos matriciales de cinemática inversa en tiempo real para mover los 5 ejes de manera simultánea e interpolada en coordenadas cartesianas (XYZ), articulares (Joint) o herramienta (Tool).',
        executionSpeed: 'Cálculo de interpolación en tiempo real (< 5 ms)',
        signals: 'Canal RS-422 / Ethernet industrial con switch de hombre muerto',
        highlights: [
          'Consola ergonómica con llave de habilitación Enable/Disable y seta de emergencia',
          'Ajuste punto a punto con jogging fino en incrementos de 0.01 mm',
          'Memorización de trayectorias seguras con prevención de singularidades cinemáticas',
        ],
      },
      {
        title: 'PLC Siemens Simatic S7-300 (Supervisión de Célula)',
        model: 'Siemens CPU 314 / 315 operando a 24V DC',
        description:
          'Supervisa la lógica general de la estación. Su tiempo de ejecución es ultrarrápido, procesando instrucciones binarias en aproximadamente 0.01 a 0.1 microsegundos, gestionando los permisos de entrada/salida y barreras de seguridad.',
        executionSpeed: '0.01 a 0.1 µs por instrucción binaria',
        signals: 'Bus de campo y señales discretas de 24V DC',
        highlights: [
          'Handshake I/O sincronizado con el controlador Mitsubishi para autorizar toma de piezas',
          'Monitoreo de presostatos y electroválvulas Festo dedicadas a la pinza',
        ],
      },
    ],
    actuators: [
      {
        title: 'Servomotores AC con Reductores Armónicos (Harmonic Drives)',
        model: 'Mitsubishi MELFA RV-2AJ (5 Grados de Libertad)',
        type: 'Robot articulado vertical de 5 ejes (J1 a J5)',
        specs: [
          { label: 'Capacidad de Carga (Payload)', value: '2 kg', detail: 'Incluyendo el peso de la pinza neumática y accesorios' },
          { label: 'Precisión de Repetibilidad', value: '±0.02 mm', detail: 'Escala micrométrica para inserciones de alta precisión' },
          { label: 'Alcance Máximo Radial (Reach)', value: '410 mm', detail: 'Radio esférico de trabajo con envolvente optimizada' },
          { label: 'Velocidad Máxima Compuesta', value: 'Aprox. 2100 mm/s', detail: 'En trayectoria cartesiana interpolada' },
        ],
        description:
          'Cinco servomotores AC sin escobillas gobernados por encoders ópticos acoplados a reductores armónicos de juego cero (Harmonic Drives). Permiten trayectorias de alta aceleración con frenado suave y nulo contragolpe mecánico.',
      },
      {
        title: 'Pinza Neumática Festo (Efector Final)',
        model: 'Festo HGP-10-A / Paralelo de precisión',
        type: 'Gripper neumático de 2 mordazas autocentrantes',
        specs: [
          { label: 'Fuerza de Sujeción Mecánica', value: 'Entre 40 N y 150 N', detail: 'Operando a 6 bares de presión constante' },
          { label: 'Tiempo de Apertura/Cierre', value: 'Aprox. 0.05 segundos', detail: 'Accionamiento casi instantáneo' },
          { label: 'Presión Nominal', value: '6 bar (0.6 MPa)' },
        ],
        description:
          'Efector final montado en la brida de la muñeca del robot. Aplica fuerza mecánica firme para asegurar que la pieza torneada o bruta no sufra desalineación durante movimientos de alta aceleración.',
      },
    ],
    sensors: [
      {
        title: 'Sensores Fotoeléctricos PART_AV',
        type: 'Sensores de haz de luz infrarrojo / visible',
        range: '10 a 50 mm de distancia de detección típica',
        responseTime: '1 a 2 milisegundos de conmutación',
        description:
          'Detectan la presencia física de la pieza en el nido de transferencia y en la bandeja de aproximación. Informan al PLC que la pieza está disponible para ser recogida por el robot.',
      },
      {
        title: 'Sensores de Vacío / Presostatos de Pinza (PEV)',
        type: 'Monitoreo de presión neumática',
        range: '0 a 8 bar',
        responseTime: '< 3 ms',
        description:
          'Verifican que la línea de 6 bar esté presurizada y que las mordazas de la pinza hayan aprisionado efectivamente el material antes de autorizar el despegue del robot.',
      },
    ],
    threeModelType: 'robot',
  },
  {
    id: 'torno',
    number: 4,
    orderTitle: '4ª Estación del Flujo',
    name: 'Estación de Torno CNC (EMCO PC Turn)',
    shortName: 'Torno CNC (EMCO)',
    subtitle: 'Mecanizado sustractivo por control numérico computarizado de alta precisión',
    summary:
      'Unidad de maquinado CNC que recibe la pieza bruta desde el robot para realizar operaciones de cilindrado, refrentado y roscado. Gobernado por el CNC GE Fanuc Series 21 con resolución de 1.5 micrómetros y husillo de hasta 4000 RPM.',
    videoSrc: '/assets/aistudio/torno__da40e924.mp4',
    posterSrc: '/assets/posters/torno.jpg',
    pdfFile: '/assets/aistudio/Torno_f98dc7a1.pdf',
    pdfName: 'Torno_EMCO_PC_Turn.pdf',
    photos: [
      '/assets/photos/torno_5.jpg',
      '/assets/photos/torno_3.jpg',
      '/assets/photos/torno_1.jpg',
      '/assets/photos/torno_4.jpg',
      '/assets/photos/torno_2.jpg',
      '/assets/photos/torno_6.jpg',
    ],
    keySpecs: {
      precision: '0.0015 mm (1.5 µm) de resolución',
      speed: '150 a 4000 RPM / Avance rápido 5000 mm/min',
      pressureForce: 'Potencia 2.2 kW a 2.8 kW (Husillo)',
      cycleTime: '2 a 8 ms de interpolación CNC',
      precisionBadge: '1.5 µm (0.0015 mm)',
      speedBadge: '150 - 4000 RPM',
      forceBadge: '2.8 kW (Husillo)',
      cycleBadge: '2 - 8 ms',
    },
    controllers: [
      {
        title: 'GE Fanuc Series 21 (Panel de Control CNC)',
        model: 'GE Fanuc 21i-T / EMCO Industrial Control Console',
        description:
          'Interpreta los bloques de código G para cálculos de interpolación lineal (G01) y circular (G02/G03). Sus ciclos de procesamiento de trayectoria se ejecutan en rangos de 2 a 8 milisegundos para actualizar la posición de los motores de avance sin demoras ni errores de contorno.',
        executionSpeed: 'Ciclos de interpolación de 2 a 8 milisegundos',
        signals: 'Control de lazo cerrado con encoders y bus servo digital Fanuc',
        highlights: [
          'Consola con teclado MDI, selector rotativo de porcentaje de avance (Feed Override) y husillo (Spindle Override)',
          'Subrutinas de roscado (G76), ciclos fijos de desbaste (G71) y compensación de radio de herramienta (G41/G42)',
          'Interbloqueo de seguridad con puerta de policarbonato y microinterruptor de cabina',
        ],
      },
    ],
    actuators: [
      {
        title: 'Motor del Husillo Principal (Spindle)',
        model: 'Motor AC de inducción / Frecuencia Variable Trifásico',
        type: 'Accionamiento del plato de garras y pieza rotativa',
        specs: [
          { label: 'Velocidad de Rotación', value: '150 hasta 4000 RPM', detail: 'Infinitamente variable mediante variador vectorial' },
          { label: 'Potencia de Accionamiento', value: '2.2 kW a 2.8 kW', detail: 'Par constante en bajas RPM y potencia constante en altas' },
          { label: 'Mandril / Chuck', value: 'Plato autocentrante de 3 mordazas' },
        ],
        description:
          'Motor AC de frecuencia variable encargado de rotar el mandril y la pieza de trabajo. Proporciona alto torque a bajas velocidades para desbastes pesados y giro suave hasta 4000 RPM para lograr rugosidades superficiales especulares (Ra < 0.4 µm).',
      },
      {
        title: 'Motores Ejes X y Z con Husillos de Bolas Recirculantes',
        model: 'Servomotores AC / Motores Paso a Paso de bucle cerrado',
        type: 'Cinemática de avance de corte transversal y longitudinal',
        specs: [
          { label: 'Resolución de Avance', value: '0.0015 mm (1.5 micrómetros)', detail: 'Hasta 0.000625 mm por pulso eléctrico' },
          { label: 'Velocidad de Avance Rápido', value: 'Hasta 5000 mm/minuto', detail: 'Posicionamiento veloz en vacío (G00)' },
          { label: 'Husillos de Precisión', value: 'Husillos de bolas rectificadas de juego nulo con doble tuerca precargada' },
        ],
        description:
          'Accionan los husillos de bolas recirculantes para desplazar la herramienta de corte con rigidez micrométrica. Permiten torneado cónico, desbastes cilíndricos y roscado sincronizado con exactitud de nivel metrológico.',
      },
      {
        title: 'Torreta Portaherramientas Automática',
        model: 'EMCO 6/8 posiciones indexables',
        type: 'Cambiador automático de herramientas (ATC)',
        specs: [
          { label: 'Herramientas', value: '6 a 8 estaciones con cambio rápido' },
          { label: 'Tiempo de Indexación', value: '< 1.2 segundos entre estaciones' },
          { label: 'Bloqueo', value: 'Acoplamiento dentado tipo Hirth con fijación neumática' },
        ],
        description:
          'Permite montar buriles de desbaste, acabado, ranurado, tronzado y cuchillas de roscar, alternando herramientas bajo comando T (Tool) sin intervención del operador.',
      },
    ],
    sensors: [
      {
        title: 'Encoders Absolutos e Incrementales de Alta Resolución',
        type: 'Encoders ópticos montados en husillo y servomotores',
        range: 'Miles de Pulsos Por Revolución (PPR) con canal Z de referencia',
        responseTime: '< 1 microsegundo de latencia de cuadratura',
        description:
          'Acoplados directamente al husillo principal y a los husillos de avance X y Z. Emiten miles de pulsos por revolución para rastrear la velocidad angular exacta de la pieza y retroalimentar la posición de la herramienta de manera rígidamente sincronizada, esencial para cortar roscas exactas.',
      },
      {
        title: 'Sensores de Seguridad y Presión de Puerta',
        type: 'Sensores de enclavamiento de seguridad CAT 4',
        range: 'Monitoreo de estado de puerta y presión neumática del mandril',
        responseTime: '< 5 milisegundos',
        description:
          'Bloquean el arranque del husillo si el cerramiento no está cerrado o si la presión de sujeción del mandril no garantiza retención segura de la pieza contra la fuerza centrífuga a 4000 RPM.',
      },
    ],
    threeModelType: 'torno',
  },
];

export const CIM_INTEGRATION_FLOW = [
  {
    step: 1,
    stationId: 'handling',
    title: '1. Selección y Alimentación (Handling)',
    equipment: 'Festo DGE (Eje X) + DZF (Eje Z) + Pinza Festo',
    action: 'Detección de pieza en tolva, descenso a 150 N, agarre a 6 bar y traslado transversal a 3 m/s hacia la cinta.',
    dataExchange: 'PLC S7-300 emite señal de listo "HANDLING_DONE" (24V) a la estación de Posicionamiento.',
    sensorTrigger: 'Sensor magnético SMT confirma fin de carrera en < 1.5 ms.',
  },
  {
    step: 2,
    stationId: 'sorting',
    title: '2. Posicionamiento y Clasificación (Sorting)',
    equipment: 'Motor DC 24V con Encoder 100-500 PPR + Sensor Inductivo + Desviadores Festo',
    action: 'Arrastre continuo a 15 cm/s. El sensor inductivo discrimina metal vs plástico en < 2 ms; el PLC calcula métricamente el trayecto y dispara el cilindro neumático a los 0.15 s.',
    dataExchange: 'PLC S7-300 activa tarjeta AM1/AM2 mediante PWM y envía cota de rampa al Robot.',
    sensorTrigger: 'Encoder óptico cuenta pulsos métricos para sincronizar impacto en rampa seleccionada.',
  },
  {
    step: 3,
    stationId: 'robot',
    title: '3. Enlace Robótico 5 Ejes (MPS Robot)',
    equipment: 'Mitsubishi MELFA RV-2AJ + Teach Pendant R28TB + Pinza Festo',
    action: 'Cinemática inversa en tiempo real. El brazo se posiciona con repetibilidad de ±0.02 mm, toma la pieza de la rampa a 2100 mm/s y la transporta hacia el torno CNC.',
    dataExchange: 'Handshake de seguridad con el Torno CNC: solicita apertura de puerta automática y parada de husillo.',
    sensorTrigger: 'PART_AV confirma presencia en nido antes del cierre de pinza en 0.05 s.',
  },
  {
    step: 4,
    stationId: 'torno',
    title: '4. Mecanizado de Precisión (EMCO PC Turn)',
    equipment: 'GE Fanuc Series 21 + Husillo AC 4000 RPM (2.8 kW) + Ejes X/Z (1.5 µm)',
    action: 'El mandril aprisiona la pieza. El CNC interpola trayectorias G01/G02 cada 2-8 ms, aplicando desbaste y acabado superficial con avance rápido de hasta 5000 mm/min.',
    dataExchange: 'CNC Fanuc informa código M30 (Fin de Programa) al PLC general y autoriza extracción de pieza terminada.',
    sensorTrigger: 'Encoders de husillo sincronizan roscado y monitor de cabina autoriza ciclo.',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    station: 'MPS Selección (Handling)',
    question: '¿Cuál es la velocidad operativa máxima que puede alcanzar el cilindro lineal sin vástago Festo DGE en el eje X?',
    options: ['0.5 m/s', '1.2 m/s', 'Hasta 3.0 m/s', '10 m/s'],
    correctAnswer: 2,
    explanation: 'El cilindro Festo DGE es una guía neumática sin vástago de alto rendimiento capaz de desplazar cargas a velocidades de hasta 3 m/s con amortiguación.',
  },
  {
    id: 2,
    station: 'MPS Posicionamiento (Sorting)',
    question: '¿Por qué el sensor inductivo de la estación de sorting es capaz de discriminar infaliblemente metal de plástico?',
    options: [
      'Porque detecta el color negro de la pieza plástica',
      'Porque su oscilador electromagnético se amortigua únicamente ante materiales conductores metálicos',
      'Porque mide el peso de la pieza al pasar por la rampa',
      'Porque utiliza una cámara de visión artificial con código QR'
    ],
    correctAnswer: 1,
    explanation: 'El sensor inductivo funciona mediante una bobina de alta frecuencia; los metales absorben energía del campo electromagnético en un rango ciego de 2 a 4 mm en menos de 2 ms.',
  },
  {
    id: 3,
    station: 'MPS Robot RV-2AJ',
    question: '¿Cuál es la repetibilidad de posicionamiento micrométrica del brazo robot Mitsubishi MELFA RV-2AJ?',
    options: ['±0.5 mm', '±0.1 mm', '±0.02 mm', '±0.001 mm'],
    correctAnswer: 2,
    explanation: 'El brazo Mitsubishi MELFA RV-2AJ cuenta con reductores armónicos (Harmonic Drives) que garantizan una repetibilidad de ±0.02 mm, ideal para ensamblaje e inserción de precisión.',
  },
  {
    id: 4,
    station: 'Torno CNC EMCO',
    question: '¿Qué tiempo de ciclo toma el controlador GE Fanuc Series 21 para procesar bloques e interpolar posiciones de motor?',
    options: ['50 a 100 milisegundos', '2 a 8 milisegundos', '1 segundo', '0.01 microsegundos'],
    correctAnswer: 1,
    explanation: 'El GE Fanuc Series 21 calcula trayectorias lineales y circulares en ciclos ultrarrápidos de 2 a 8 ms para evitar faceteado o demoras en el contorneado de corte.',
  },
  {
    id: 5,
    station: 'Controladores PLC',
    question: '¿A qué velocidad procesa las instrucciones binarias el PLC Siemens Simatic S7-300 presente en la celda?',
    options: ['1 a 5 milisegundos', '0.01 a 0.1 microsegundos', '100 microsegundos', '10 nanosegundos'],
    correctAnswer: 1,
    explanation: 'El PLC Siemens S7-300 ejecuta instrucciones lógicas binarias en un rango récord de 0.01 a 0.1 microsegundos operando con niveles de señal de 24V DC.',
  },
  {
    id: 6,
    station: 'MPS Posicionamiento (Sorting)',
    question: '¿Qué función cumplen las tarjetas amplificadoras AM1 y AM2 en la estación de Sorting?',
    options: [
      'Gobernar la neumática de la pinza del robot',
      'Manejar la etapa de potencia comandada por el PLC (0-24V o PWM) para controlar velocidad y torque del motor DC',
      'Decodificar el código G de torneado',
      'Medir la temperatura del cilindro neumático'
    ],
    correctAnswer: 1,
    explanation: 'Las tarjetas AM1/AM2 reciben consignas del PLC y entregan voltaje modulado o PWM con alta corriente para controlar suavemente el motor DC de la banda.',
  },
  {
    id: 7,
    station: 'MPS Selección (Handling)',
    question: '¿Qué fuerza directa proporciona el cilindro guiado anti-rotación Festo DZF (Eje Z) a 6 bares de presión?',
    options: ['20 N', '50 N', 'Aproximadamente 150 N', '800 N'],
    correctAnswer: 2,
    explanation: 'El cilindro plano Festo DZF entrega aproximadamente 150 N directos a 6 bar, garantizando descenso rígido sin ladeo ni giro angular.',
  },
  {
    id: 8,
    station: 'MPS Robot RV-2AJ',
    question: '¿Cuánto tiempo tarda la pinza neumática Festo del robot en abrir o cerrar sus mordazas?',
    options: ['Aproximadamente 0.05 segundos', '1.5 segundos', '0.5 segundos', '10 milisegundos'],
    correctAnswer: 0,
    explanation: 'A 6 bar de presión, la pinza neumática Festo acciona sus mordazas en apenas 0.05 s con fuerza de sujeción entre 40 N y 150 N.',
  },
  {
    id: 9,
    station: 'MPS Robot RV-2AJ',
    question: '¿Cuál es la capacidad de carga nominal (Payload) del brazo robot articulado Mitsubishi RV-2AJ?',
    options: ['500 gramos', '2 kg (incluyendo la pinza)', '5 kg', '10 kg'],
    correctAnswer: 1,
    explanation: 'El robot Mitsubishi MELFA RV-2AJ tiene un payload de 2 kg con un alcance radial de 410 mm y velocidad máxima compuesta de 2100 mm/s.',
  },
  {
    id: 10,
    station: 'Torno CNC EMCO',
    question: '¿Cuál es el rango de velocidad de rotación variable del husillo principal (Spindle) en el torno EMCO PC Turn?',
    options: ['50 a 500 RPM', '150 a 4000 RPM', '1000 a 10000 RPM', 'Velocidad fija de 1800 RPM'],
    correctAnswer: 1,
    explanation: 'El husillo del torno EMCO cuenta con motor AC y variador vectorial de 2.2 a 2.8 kW, con velocidad infinitamente variable de 150 a 4000 RPM.',
  },
  {
    id: 11,
    station: 'Torno CNC EMCO',
    question: '¿Qué resolución de avance alcanzan los husillos de bolas recirculantes en los ejes X y Z del torno CNC?',
    options: ['0.1 mm', '0.0015 mm (1.5 micrómetros)', '0.5 mm', '2 mm'],
    correctAnswer: 1,
    explanation: 'Permite una resolución de 0.0015 mm (1.5 µm) o hasta 0.000625 mm por pulso, permitiendo mecanizados con acabado especular y roscado preciso.',
  },
  {
    id: 12,
    station: 'MPS Posicionamiento (Sorting)',
    question: '¿Cuántos pulsos por revolución (PPR) genera el encoder óptico acoplado al eje trasero del motor DC?',
    options: ['1 a 10 PPR', '100 a 500 PPR', '10000 PPR', '100000 PPR'],
    correctAnswer: 1,
    explanation: 'El encoder óptico en la tapa del motor genera entre 100 y 500 PPR, permitiendo al PLC cronometrar el milisegundo exacto de disparo del cilindro desviador.',
  },
  {
    id: 13,
    station: 'MPS Selección (Handling)',
    question: '¿Cuál es el tiempo de respuesta de los sensores magnéticos SME/SMT de final de carrera?',
    options: ['Menos de 1.5 milisegundos', '50 milisegundos', '1 segundo', '10 segundos'],
    correctAnswer: 0,
    explanation: 'Los sensores de estado sólido SME/SMT detectan el campo magnético del émbolo a través del aluminio y conmutan en menos de 1.5 ms con repetibilidad de ±0.1 mm.',
  },
  {
    id: 14,
    station: 'MPS Robot RV-2AJ',
    question: '¿Qué cálculo ejecuta el Teach Pendant Mitsubishi R28TB en tiempo real para mover los 5 ejes?',
    options: [
      'Cálculo de elementos finitos térmico',
      'Cálculos de cinemática inversa interpolada en tiempo real',
      'Balanceo dinámico del rotor',
      'Regresión lineal de corriente'
    ],
    correctAnswer: 1,
    explanation: 'El controlador Mitsubishi / Teach Pendant R28TB resuelve matrices de cinemática inversa en tiempo real para coordinar simultáneamente los 5 ejes.',
  },
  {
    id: 15,
    station: 'MPS Posicionamiento (Sorting)',
    question: '¿En qué lapso se extienden los cilindros desviadores neumáticos Festo para desviar una pieza hacia las rampas?',
    options: ['0.1 a 0.2 segundos', '1.0 a 2.0 segundos', '5 segundos', '0.001 segundos'],
    correctAnswer: 0,
    explanation: 'Los cilindros desviadores se extienden rápidamente en 0.1 a 0.2 s a presiones de 4 a 8 bar, impactando y desviando la pieza en movimiento.',
  },
  {
    id: 16,
    station: 'MPS Robot RV-2AJ',
    question: '¿Qué tipo de reductores de juego cero utiliza el brazo Mitsubishi MELFA RV-2AJ en sus articulaciones?',
    options: [
      'Reductores armónicos (Harmonic Drives)',
      'Tren de engranajes de madera',
      'Correas de goma sin tensión',
      'Cajas de cambio sincronizadas de fricción'
    ],
    correctAnswer: 0,
    explanation: 'Utiliza reductores armónicos (Harmonic Drives) acoplados a servomotores AC, garantizando nulo contragolpe mecánico y repetibilidad de ±0.02 mm.',
  },
];
