import {
  PeligroCatalogoItem,
  NaturalezaPeligro,
  NivelDeficiencia,
  NivelExposicion,
  NivelConsecuencia,
  NivelProbabilidadInterpretacion,
  NivelRiesgoInterpretacion,
  OrganizacionData,
  RegistroIPVR,
  AccionSeguimiento,
  CatalogoConfig
} from '../types';

export const PELIGROS_GTC45: PeligroCatalogoItem[] = [
  // 1. BIOLÓGICO
  {
    id: 'BIO-01',
    naturaleza: 'Biológico',
    clasificacion: 'Virus',
    descripcion: 'Exposición a agentes virales (SARS-CoV-2, Influenza, Hepatitis, etc.)',
    efectosPosibles: 'Enfermedades infecciosas agudas o crónicas, afectación respiratoria, incapacidad temporal o permanente.',
    ejemplosFuente: ['Atención al público', 'Personal de salud', 'Manejo de residuos', 'Aglomeraciones']
  },
  {
    id: 'BIO-02',
    naturaleza: 'Biológico',
    clasificacion: 'Bacterias',
    descripcion: 'Contacto con bacterias patógenas por aerosoles, alimentos, aguas o superficies contaminadas.',
    efectosPosibles: 'Infecciones gastrointestinales, cutáneas, respiratorias, tétanos, leptospirosis.',
    ejemplosFuente: ['Manipulación de alimentos', 'Mantenimiento de redes hidrosanitarias', 'Laboratorios', 'Limpieza general']
  },
  {
    id: 'BIO-03',
    naturaleza: 'Biológico',
    clasificacion: 'Hongos',
    descripcion: 'Inhalación de esporas o contacto con hongos en ambientes húmedos o mal ventilados.',
    efectosPosibles: 'Micosis dérmica, asma ocupacional, alveolitis alérgica extrínseca, rinitis.',
    ejemplosFuente: ['Archivos históricos', 'Bodegas húmedas', 'Plantas de tratamiento', 'Sistemas de aire acondicionado']
  },
  {
    id: 'BIO-04',
    naturaleza: 'Biológico',
    clasificacion: 'Picaduras y Mordeduras',
    descripcion: 'Ataque o contacto con animales, insectos, ofidios, arácnidos, roedores o animales domésticos/salvajes.',
    efectosPosibles: 'Envenenamiento, shock anafiláctico, rabia, infecciones locales, dermatitis, muerte.',
    ejemplosFuente: ['Trabajo en campo', 'Inspección de obras', 'Zonas verdes', 'Almacenes abiertos']
  },
  {
    id: 'BIO-05',
    naturaleza: 'Biológico',
    clasificacion: 'Fluidos o Excrementos',
    descripcion: 'Contacto directo o salpicaduras con sangre, secreciones biológicas o desechos orgánicos.',
    efectosPosibles: 'Transmisión de patógenos hemáticos, infecciones severas.',
    ejemplosFuente: ['Primeros auxilios', 'Lavado de baños', 'Recolección de basuras', 'Servicios de salud']
  },

  // 2. FÍSICO
  {
    id: 'FIS-01',
    naturaleza: 'Físico',
    clasificacion: 'Ruido (Impacto, Intermitente, Continuo)',
    descripcion: 'Exposición a niveles de presión sonora superiores a 85 dBA por maquinaria o herramientas.',
    efectosPosibles: 'Hipoacusia neurosensorial inducida por ruido (HNIR), fatiga auditiva, estrés, cefalea, disminución de concentración.',
    ejemplosFuente: ['Compresores', 'Tornos', 'Prensas', 'Herramientas neumáticas', 'Tráfico vehicular', 'Plantas eléctricas']
  },
  {
    id: 'FIS-02',
    naturaleza: 'Físico',
    clasificacion: 'Iluminación (Deficiente o Excesiva)',
    descripcion: 'Niveles inadecuados de iluminancia (lux) o presencia de deslumbramiento y sombras.',
    efectosPosibles: 'Fatiga visual, cefalea, ardor ocular, aumento en tasa de errores y accidentes laborales.',
    ejemplosFuente: ['Puestos de digitación', 'Talleres de precisión', 'Bodegas oscuras', 'Reflejos en pantallas']
  },
  {
    id: 'FIS-03',
    naturaleza: 'Físico',
    clasificacion: 'Vibración (Cuerpo Entero / Segmentaria)',
    descripcion: 'Transmisión de oscilaciones mecánicas al sistema mano-brazo o a todo el cuerpo.',
    efectosPosibles: 'Síndrome de Raynaud (dedo blanco), lumbalgias, discopatías vertebrales, artrosis precoz.',
    ejemplosFuente: ['Martillos neumáticos', 'Manejo de montacargas', 'Conducción de maquinaria pesada', 'Pulidoras']
  },
  {
    id: 'FIS-04',
    naturaleza: 'Físico',
    clasificacion: 'Temperaturas Extremas (Calor / Frío)',
    descripcion: 'Exposición a estrés térmico por calor (sobrecarga térmica) o bajas temperaturas (cuartos fríos).',
    efectosPosibles: 'Golpe de calor, deshidratación, síncope, hipotermia, congelamiento, fatiga.',
    ejemplosFuente: ['Fundición', 'Hornos', 'Trabajo a la intemperie', 'Cuartos fríos de conservación', 'Calderas']
  },
  {
    id: 'FIS-05',
    naturaleza: 'Físico',
    clasificacion: 'Radiaciones No Ionizantes (UV, Infrarroja, RF, Láser)',
    descripcion: 'Emisión de campos electromagnéticos, luz ultravioleta solar o de soldadura, microondas.',
    efectosPosibles: 'Fotoqueratitis, cataratas, eritema solar, quemaduras dérmicas, cáncer de piel.',
    ejemplosFuente: ['Soldadura eléctrica', 'Trabajo bajo el sol directo', 'Secadores UV', 'Torres de telecomunicaciones']
  },
  {
    id: 'FIS-06',
    naturaleza: 'Físico',
    clasificacion: 'Radiaciones Ionizantes (Rayos X, Gamma, Alfa, Beta)',
    descripcion: 'Exposición a partículas y ondas con energía suficiente para ionizar la materia.',
    efectosPosibles: 'Mutaciones genéticas, síndrome de radiación aguda, cáncer radioinducido.',
    ejemplosFuente: ['Equipos de radiografía industrial', 'Equipos médicos de rayos X', 'Gammagrafía de soldaduras']
  },

  // 3. QUÍMICO
  {
    id: 'QUI-01',
    naturaleza: 'Químico',
    clasificacion: 'Polvos y Material Particulado',
    descripcion: 'Suspensión en aire de partículas sólidas orgánicas o inorgánicas (sílice, madera, cemento).',
    efectosPosibles: 'Neumoconiosis, silicosis, asma ocupacional, rinitis, irritación ocular y de vías aéreas.',
    ejemplosFuente: ['Corte de concreto', 'Lijado de maderas', 'Manipulación de sacos de cemento', 'Molienda']
  },
  {
    id: 'QUI-02',
    naturaleza: 'Químico',
    clasificacion: 'Líquidos (Nieblas, Rocíos, Salpicaduras)',
    descripcion: 'Contacto dérmico o inhalación de sustancias químicas líquidas, disolventes, ácidos o bases.',
    efectosPosibles: 'Quemaduras químicas, dermatitis de contacto, intoxicaciones agudas o crónicas.',
    ejemplosFuente: ['Pintura en aerosol', 'Desengrasado de piezas', 'Limpieza con sustancias desinfectantes', 'Baños galvánicos']
  },
  {
    id: 'QUI-03',
    naturaleza: 'Químico',
    clasificacion: 'Gases y Vapores',
    descripcion: 'Inhalación de vapores orgánicos volátiles, gases asfixiantes o tóxicos (CO, H2S, amoníaco, cloro).',
    efectosPosibles: 'Asfixia química, edema pulmonar, mareo, cefalea, pérdida de conocimiento, intoxicación fatal.',
    ejemplosFuente: ['Recarga de combustible', 'Pintura con solventes', 'Uso de refrigerantes', 'Espacios con descomposición']
  },
  {
    id: 'QUI-04',
    naturaleza: 'Químico',
    clasificacion: 'Humos Metálicos y No Metálicos',
    descripcion: 'Condensación de vapores metálicos producto de procesos de calentamiento o combustión.',
    efectosPosibles: 'Fiebre de humos metálicos, bronquitis crónica, intoxicación por plomo o cadmio.',
    ejemplosFuente: ['Procesos de soldadura', 'Fundición de metales', 'Oxicorte']
  },

  // 4. PSICOSOCIAL
  {
    id: 'PSI-01',
    naturaleza: 'Psicosocial',
    clasificacion: 'Gestión Organizacional y Liderazgo',
    descripcion: 'Estilo de mando deficiente, falta de inducción, retroalimentación inadecuada o comunicación deficiente.',
    efectosPosibles: 'Estrés laboral crónico, síndrome de burnout, desmotivación, ausentismo, conflictividad.',
    ejemplosFuente: ['Relación supervisor-colaborador', 'Políticas de ascensos poco claras', 'Falta de reconocimiento']
  },
  {
    id: 'PSI-02',
    naturaleza: 'Psicosocial',
    clasificacion: 'Condiciones de la Tarea (Carga Mental, Ritmo, Demandas Emocionales)',
    descripcion: 'Alta concentración requerida, ritmo de trabajo acelerado, toma de decisiones crítica, atención a usuarios difíciles.',
    efectosPosibles: 'Fatiga mental, ansiedad, trastornos del sueño, cefaleas tensionales, hipertensión arterial reactiva.',
    ejemplosFuente: ['Atención de quejas y reclamos', 'Cajeros', 'Digitación bajo tiempo límite', 'Controladores de procesos']
  },
  {
    id: 'PSI-03',
    naturaleza: 'Psicosocial',
    clasificacion: 'Jornada de Trabajo (Horas Extras, Turnos Rotativos, Descansos)',
    descripcion: 'Extensión prolongada de jornadas laborales, trabajo nocturno o turnos rotativos sin descanso suficiente.',
    efectosPosibles: 'Alteración del ciclo circadiano, somnolencia diurna, fatiga crónica, desbalance vida-trabajo.',
    ejemplosFuente: ['Vigilancia de noche', 'Operarios de planta 24/7', 'Cierres contables', 'Atención de emergencias']
  },

  // 5. BIOMECÁNICO
  {
    id: 'BIO-M01',
    naturaleza: 'Biomecánico',
    clasificacion: 'Postura Prolongada / Mantenida / Forzada',
    descripcion: 'Permanencia en la misma posición (sedente o bípeda) por más del 75% de la jornada o adopción de posturas antigravitacionales.',
    efectosPosibles: 'Lumbalgia, dorsalgia, cervicalgia, espasmos musculares, insuficiencia venosa periférica.',
    ejemplosFuente: ['Puestos de oficina en pantalla', 'Cajeros de pie', 'Mantenimiento bajo vehículos', 'Líneas de ensamble']
  },
  {
    id: 'BIO-M02',
    naturaleza: 'Biomecánico',
    clasificacion: 'Movimiento Repetitivo',
    descripcion: 'Ciclos de trabajo cortos menores a 30 segundos o repetición del mismo patrón articular por más del 50% del ciclo.',
    efectosPosibles: 'Síndrome del túnel carpiano, tendinitis de Quervain, epicondilitis (codo de tenista), bursitis.',
    ejemplosFuente: ['Uso constante de mouse y teclado', 'Empaque manual', 'Corte con tijeras', 'Atornillado manual']
  },
  {
    id: 'BIO-M03',
    naturaleza: 'Biomecánico',
    clasificacion: 'Manipulación Manual de Cargas y Sobreesfuerzo',
    descripcion: 'Levantamiento, descenso, empuje, tracción o transporte de cargas > 25 kg en hombres o > 12.5 kg en mujeres.',
    efectosPosibles: 'Hernias discales, lumbalgia aguda, desgarros musculares, lesiones osteomusculares articulares.',
    ejemplosFuente: ['Cargue y descargue de bultos', 'Movilización de pacientes', 'Traslado de cajas en bodega']
  },

  // 6. CONDICIONES DE SEGURIDAD
  {
    id: 'SEG-01',
    naturaleza: 'Condiciones de Seguridad',
    clasificacion: 'Mecánico',
    descripcion: 'Elementos de máquinas, herramientas manuales, piezas en movimiento, proyección de partículas o fluidos a presión.',
    efectosPosibles: 'Atrapamientos, cortes, amputaciones, laceraciones, golpes, fracturas, cuerpos extraños en ojos.',
    ejemplosFuente: ['Sierras circulares sin guarda', 'Bandas transportadoras', 'Prensas', 'Uso de martillos y destornilladores']
  },
  {
    id: 'SEG-02',
    naturaleza: 'Condiciones de Seguridad',
    clasificacion: 'Eléctrico (Alta / Baja Tensión / Estática)',
    descripcion: 'Contacto directo o indirecto con conductores energizados, tableros eléctricos, arcos eléctricos o electricidad estática.',
    efectosPosibles: 'Electrocución, paro cardiorrespiratorio, quemaduras por arco eléctrico de 2º y 3º grado, caídas secundarias.',
    ejemplosFuente: ['Tableros eléctricos sin tapa', 'Cables pelados', 'Intervención en subestaciones', 'Herramientas eléctricas sin polo a tierra']
  },
  {
    id: 'SEG-03',
    naturaleza: 'Condiciones de Seguridad',
    clasificacion: 'Locativo (Superficies, Desniveles, Espacio, Caída Objetos)',
    descripcion: 'Pisos resbalosos, desniveles, desorden, falta de señalización, almacenamiento inadecuado, estructuras en mal estado.',
    efectosPosibles: 'Caídas al mismo nivel, tropiezos, golpes contra objetos, traumatismos, aplastamiento por caída de estanterías.',
    ejemplosFuente: ['Pisos húmedos o aceitosos', 'Escaleras sin pasamanos', 'Estanterías sin anclaje', 'Pasillos obstruidos']
  },
  {
    id: 'SEG-04',
    naturaleza: 'Condiciones de Seguridad',
    clasificacion: 'Tecnológico (Incendio, Explosión, Fuga, Derrame)',
    descripcion: 'Presencia de sustancias inflamables o reactivas, almacenamiento de combustibles, atmosferas potencialmente explosivas.',
    efectosPosibles: 'Quemaduras graves, intoxicación masiva por humo, traumatismo por onda expansiva, pérdida de vidas e infraestructura.',
    ejemplosFuente: ['Almacén de solventes', 'Calderas a gas', 'Cilindros de gas comprimido', 'Instalaciones sin sistema contra incendios']
  },
  {
    id: 'SEG-05',
    naturaleza: 'Condiciones de Seguridad',
    clasificacion: 'Trabajo en Alturas (> 1.50 m)',
    descripcion: 'Labores ejecutadas con riesgo de caída a diferente nivel superior o igual a 1.50 metros (Res. 4272/2021).',
    efectosPosibles: 'Politraumatismos graves, traumatismo craneoencefálico, muerte por impacto contra el suelo o estructuras.',
    ejemplosFuente: ['Mantenimiento de techos', 'Trabajo en andamios o escaleras', 'Instalación de cables en postes', 'Limpieza de fachadas']
  },
  {
    id: 'SEG-06',
    naturaleza: 'Condiciones de Seguridad',
    clasificacion: 'Espacios Confinados',
    descripcion: 'Trabajo en recintos cerrados con aberturas limitadas de entrada/salida y ventilación natural deficiente (Res. 0491/2020).',
    efectosPosibles: 'Asfixia por deficiencia de O2, intoxicación por gases tóxicos, atrapamiento, explosión, muerte.',
    ejemplosFuente: ['Tanques de almacenamiento', 'Silos', 'Alcantarillas', 'Túneles', 'Cajas de inspección subterráneas']
  },
  {
    id: 'SEG-07',
    naturaleza: 'Condiciones de Seguridad',
    clasificacion: 'Público (Robos, Atracos, Asaltos, Asonadas)',
    descripcion: 'Exposición a actos delictivos, hurtos, agresiones verbales o físicas por terceros en vía pública o sedes con atención masiva.',
    efectosPosibles: 'Heridas por arma blanca o de fuego, lesiones personales, trauma psicológico, estrés postraumático, muerte.',
    ejemplosFuente: ['Mensajería', 'Conductores de reparto', 'Cajas de recaudo', 'Vigilancia de seguridad privada', 'Visitas comerciales']
  },
  {
    id: 'SEG-08',
    naturaleza: 'Condiciones de Seguridad',
    clasificacion: 'Accidentes de Tránsito',
    descripcion: 'Riesgos asociados al desplazamiento vial de vehículos de la empresa, motocicletas, bicicletas o peatones en cumplimiento de labores.',
    efectosPosibles: 'Politraumatismos, fracturas, latigazo cervical, invalidez, muerte del conductor o peatón.',
    ejemplosFuente: ['Distribución y transporte', 'Desplazamientos entre sedes', 'Mantenimiento preventivo en vía', 'Comisiones de servicio']
  },

  // 7. FENÓMENOS NATURALES
  {
    id: 'FEN-01',
    naturaleza: 'Fenómenos Naturales',
    clasificacion: 'Sismo / Terremoto',
    descripcion: 'Movimientos telúricos que pueden causar colapso de infraestructuras o caída de elementos no estructurales.',
    efectosPosibles: 'Aplastamiento, atrapamiento, traumatismos severos, muerte.',
    ejemplosFuente: ['Instalaciones en zonas de amenaza sísmica', 'Edificaciones sin sismorresistencia']
  },
  {
    id: 'FEN-02',
    naturaleza: 'Fenómenos Naturales',
    clasificacion: 'Precipitaciones / Inundación / Vendaval',
    descripcion: 'Lluvias torrenciales, desbordamiento de afluentes, granizadas o vientos huracanados.',
    efectosPosibles: 'Ahogamiento, hipotermia, electrocución por contacto con redes caídas, colapso de cubiertas.',
    ejemplosFuente: ['Sedes cerca a ríos o laderas', 'Trabajos a cielo abierto durante tormentas']
  }
];

export const ND_OPTIONS = [
  {
    valor: 10 as NivelDeficiencia,
    nombre: 'Muy Alto (MA) - 10',
    descripcion: 'Se han detectado peligros que determinan como muy posible la generación de incidentes, o la eficacia del conjunto de medidas preventivas existentes respecto al riesgo es nula o no existe, o ambos.'
  },
  {
    valor: 6 as NivelDeficiencia,
    nombre: 'Alto (A) - 6',
    descripcion: 'Se han detectado algunos peligros que pueden dar lugar a consecuencias significativas, o la eficacia del conjunto de medidas preventivas existentes es baja, o ambos.'
  },
  {
    valor: 2 as NivelDeficiencia,
    nombre: 'Medio (M) - 2',
    descripcion: 'Se han detectado peligros que pueden dar lugar a consecuencias poco significativas o de menor importancia, o la eficacia del conjunto de medidas preventivas existentes es moderada, o ambos.'
  },
  {
    valor: 0 as NivelDeficiencia,
    nombre: 'Bajo (B) - 0',
    descripcion: 'No se ha detectado consecuencia alguna, o la eficacia del conjunto de medidas preventivas existentes es alta, o ambos. El riesgo está controlado.'
  }
];

export const NE_OPTIONS = [
  {
    valor: 4 as NivelExposicion,
    nombre: 'Continua (EC) - 4',
    descripcion: 'La situación de exposición se presenta sin interrupción o varias veces con tiempo prolongado durante la jornada laboral.'
  },
  {
    valor: 3 as NivelExposicion,
    nombre: 'Frecuente (EF) - 3',
    descripcion: 'La situación de exposición se presenta varias veces durante la jornada laboral por tiempos cortos.'
  },
  {
    valor: 2 as NivelExposicion,
    nombre: 'Ocasional (EO) - 2',
    descripcion: 'La situación de exposición se presenta alguna vez durante la jornada laboral y por un periodo de tiempo corto.'
  },
  {
    valor: 1 as NivelExposicion,
    nombre: 'Esporádica (EE) - 1',
    descripcion: 'La situación de exposición se presenta de manera eventual o esporádica (una vez al mes o menos).'
  }
];

export const NC_OPTIONS = [
  {
    valor: 100 as NivelConsecuencia,
    nombre: 'Mortal o Catastrófico (100)',
    descripcion: 'Muerte de 1 o más trabajadores, o incapacidad permanente total / invalidez.'
  },
  {
    valor: 60 as NivelConsecuencia,
    nombre: 'Muy Grave (60)',
    descripcion: 'Lesiones o enfermedades graves irreparables (incapacidad permanente parcial o invalidez relativa).'
  },
  {
    valor: 25 as NivelConsecuencia,
    nombre: 'Grave (25)',
    descripcion: 'Lesiones o enfermedades con incapacidad laboral temporal (ILT).'
  },
  {
    valor: 10 as NivelConsecuencia,
    nombre: 'Leve (10)',
    descripcion: 'Lesiones o enfermedades que no requieren incapacidad laboral (primeros auxilios o molestias menores).'
  }
];

export function calcularNP(nd: NivelDeficiencia, ne: NivelExposicion): { np: number; interpretacion: NivelProbabilidadInterpretacion } {
  const np = nd * ne;
  let interpretacion: NivelProbabilidadInterpretacion = 'Bajo (B)';

  if (np >= 24) {
    interpretacion = 'Muy Alto (MA)';
  } else if (np >= 10) {
    interpretacion = 'Alto (A)';
  } else if (np >= 6) {
    interpretacion = 'Medio (M)';
  } else {
    interpretacion = 'Bajo (B)';
  }

  return { np, interpretacion };
}

export function calcularNR(np: number, nc: NivelConsecuencia): {
  nr: number;
  nivelRiesgo: NivelRiesgoInterpretacion;
  interpretacionNR: string;
  aceptabilidad: string;
  significadoNR: string;
} {
  const nr = np * nc;
  let nivelRiesgo: NivelRiesgoInterpretacion = 'IV';
  let interpretacionNR = 'Nivel IV (20)';
  let aceptabilidad = 'Aceptable';
  let significadoNR = 'Mantener las medidas de control existentes. Se deberían considerar soluciones o mejoras que no supongan una carga económica excesiva.';

  if (nr >= 600) {
    nivelRiesgo = 'I';
    interpretacionNR = 'Nivel I (4000 - 600)';
    aceptabilidad = 'No Aceptable';
    significadoNR = 'Situación crítica. Suspender actividades inmediatamente hasta que el riesgo esté bajo control. Intervención urgente requerida.';
  } else if (nr >= 150) {
    nivelRiesgo = 'II';
    interpretacionNR = 'Nivel II (500 - 150)';
    aceptabilidad = 'No Aceptable o Aceptable con control específico';
    significadoNR = 'Corregir y adoptar medidas de control de inmediato. Mantener control específico riguroso.';
  } else if (nr >= 40) {
    nivelRiesgo = 'III';
    interpretacionNR = 'Nivel III (120 - 40)';
    aceptabilidad = 'Mejorable';
    significadoNR = 'Mejorar si es posible. Sería conveniente justificar la intervención y su rentabilidad.';
  } else {
    nivelRiesgo = 'IV';
    interpretacionNR = 'Nivel IV (20)';
    aceptabilidad = 'Aceptable';
    significadoNR = 'Mantener las medidas de control existentes. Inspecciones periódicas recomendadas.';
  }

  return { nr, nivelRiesgo, interpretacionNR, aceptabilidad, significadoNR };
}

export const INITIAL_ORG_DATA: OrganizacionData = {
  empresa: 'PLAN DE PREVENCIÓN, PREPARACIÓN Y RESPUESTA ANTE EMERGENCIAS',
  razonSocial: 'ORGANIZACIÓN',
  nit: 'S/N',
  ciiu: 'Comercio, Bodegaje y Operaciones Generales',
  actividadEconomica: 'Almacenamiento, operaciones en bodega y oficinas administrativas',
  arl: 'ARL SURA',
  claseRiesgo: 'I',
  numTrabajadores: 48,
  numContratistas: 6,
  numTemporales: 0,
  centrosTrabajo: ['Sede Principal - Bodega y Oficinas'],
  centroPrincipal: 'Sede Principal - Bodega y Oficinas',
  direccion: 'Sede de Operaciones',
  ciudad: 'Bogotá D.C.',
  departamento: 'Cundinamarca',
  
  // Control de Metodología & Versión
  metodologia: 'Decreto 1072 de 2015 / Diamante de Riesgo y GTC 45:2012',
  alcanceMetodologia: 'Análisis de Amenazas y Vulnerabilidad para el Plan de Prevención, Preparación y Respuesta ante Emergencias (PEC) y Plan de Continuidad del Negocio (BCP).',
  versionMatriz: 'V1.0 - 2026',
  fechaElaboracion: '2026-08-04',
  fechaActualizacion: '2026-08-04',
  fechaProximaRevision: '2027-08-04',
  motivoActualizacion: 'Creación inicial de la matriz IPVR',
  
  // Control de Revisión y Aprobación Institucional
  elaboradoPor: 'Coordinador SST / Brigada de Emergencias',
  cargoElaborador: 'Coordinador SST',
  licenciaSST: '',
  revisadoPor: 'Comité de Emergencias',
  cargoRevisor: 'Comité de Emergencias',
  aprobadoPor: 'Gerencia General',
  cargoAprobador: 'Gerente General',
  fechaAprobacion: '2026-08-04',
  
  // Registro de Participación
  registrosParticipacion: [],

  responsableSST: 'Coordinador SST / Brigada de Emergencias',
  cargoResponsable: 'Coordinador SST',
  politicaSST: 'Compromiso con la prevención, preparación y respuesta ante emergencias para salvaguardar la vida, la infraestructura y garantizar la continuidad operativa.',
  objetivosSST: '1. Implementar el Plan de Prevención, Preparación y Respuesta ante Emergencias (PEC).\n2. Conformar y capacitar la Brigada de Emergencias en primeros auxilios y control de conatos.\n3. Ejecutar el Plan de Continuidad del Negocio (BCP) y respaldos DRP.'
};

export const INITIAL_RECORDS: RegistroIPVR[] = [
  // === 10 PELIGROS IDENTIFICADOS DEL PLAN DE PREVENCIÓN, PREPARACIÓN Y RESPUESTA ANTE EMERGENCIAS (PEC) ===
  {
    id: 'IPVR-EMG-01',
    codigoInterno: 'EMG-NAT-01',
    proceso: 'Direccionamiento Estratégico',
    tipoProceso: 'Estratégico',
    area: 'Sede Principal - Oficinas Administrativas',
    lugarEspecifico: 'Toda la edificación / Bodega, Oficinas y Pasillos',
    actividad: 'Permanencia y desarrollo de labores operativas y administrativas',
    tarea: 'Trabajo general en instalaciones físicas y atención de contingencias',
    rutinaria: 'Rutinaria',
    cargoExpuesto: 'Todo el personal (Administrativos, Operativos, Contratistas y Visitantes)',
    expuestosDirectos: 45,
    expuestosContratistas: 10,
    expuestosTemporales: 0,
    expuestosTotal: 55,
    frecuencia: 'Continua (Toda la jornada)',
    naturalezaPeligro: 'Fenómenos Naturales',
    clasificacionPeligro: 'Sismo / Terremoto',
    fuenteGeneradora: 'Situaciones de sismo presentadas en la ciudad.',
    descripcionPeligro: 'Movimiento telúrico que puede ocasionar colapso de estanterías, caída de mampostería, fisuras o daños estructurales en la edificación.',
    efectosPosibles: 'Politraumatismos, heridas abiertas, aplastamiento, fracturas múltiples, atrapamiento, muerte por colapso estructural.',
    controlesExistentes: {
      fuente: 'Anclaje sísmico de estanterías pesadas.',
      medio: 'Salida peatonal y salida de vehículos (edificación sin escaleras de emergencia externas).',
      individuo: 'Botiquín tipo A (Res. 705/2007) y camillas de inmovilización en bodega.'
    },
    valoracion: {
      nd: 6,
      ne: 3,
      np: 18,
      interpretacionNP: 'Alto (A)',
      nc: 60,
      nr: 1080,
      nivelRiesgo: 'I',
      interpretacionNR: 'Nivel I (4000 - 600)',
      aceptabilidad: 'No Aceptable',
      significadoNR: 'Situación crítica. Suspender actividades inmediatamente hasta que el riesgo esté bajo control. Intervención urgente requerida.',
      estado: 'En Intervención'
    },
    criterios: {
      numExpuestos: 55,
      peorConsecuencia: 'Muerte masiva o lesiones incapacitantes por colapso de estructura o caída de techos.',
      tieneRequisitoLegal: true,
      requisitoLegalEspecifico: 'Decreto 1072 de 2015 Art. 2.2.4.6.25, Reglamento Sismo Resistente NSR-10, Ley 1523 de 2012.'
    },
    medidas: {
      eliminacion: 'No es viable técnicamente (fenómeno natural ineludible).',
      sustitucion: 'No aplica.',
      controlIngenieria: 'Estudio de vulnerabilidad sísmica NSR-10, adecuación de doble pasamanos en escaleras y anclajes certificados.',
      controlAdministrativo: 'Procedimiento Operativo Normalizado PON-GEN-012, conformación y capacitación de Brigada de Emergencias, simulacros anuales (SIM-GEN-12) e inspección de equipos (INS-GEN-12).',
      epp: 'Cascos de rescate, chalecos reflectivos distintivos y megáfonos para brigadistas.'
    },
    fechaCreacion: '2026-08-04',
    fechaRevision: '2026-08-04',
    responsableRevision: 'Brigada / SST'
  },
  {
    id: 'IPVR-EMG-02',
    codigoInterno: 'EMG-NAT-02',
    proceso: 'Logística y Almacenamiento',
    tipoProceso: 'Misional / Operativo',
    area: 'Almacén y Centro de Distribución',
    lugarEspecifico: 'Bodega de almacenamiento y patios de descarga',
    actividad: 'Recepción, almacenamiento y custodia de inventarios',
    tarea: 'Tránsito peatonal y apilamiento en cotas bajas de bodega',
    rutinaria: 'Rutinaria',
    cargoExpuesto: 'Auxiliares de bodega, montacarguistas y personal logístico',
    expuestosDirectos: 15,
    expuestosContratistas: 3,
    expuestosTemporales: 0,
    expuestosTotal: 18,
    frecuencia: 'Frecuente (Varias veces/día)',
    naturalezaPeligro: 'Fenómenos Naturales',
    clasificacionPeligro: 'Precipitaciones (Lluvias, Granizadas, Inundaciones)',
    fuenteGeneradora: 'Inundaciones presentadas con anterioridad en la Bodega.',
    descripcionPeligro: 'Anegación de instalaciones de bodega, desbordamiento de redes de aguas lluvias y riesgo eléctrico asociado.',
    efectosPosibles: 'Caídas al mismo nivel por superficies resbalosas, choque eléctrico por contacto con tomas inundadas, enfermedades dérmicas/infecciosas, pérdidas materiales.',
    controlesExistentes: {
      fuente: 'Ninguno en la fuente.',
      medio: 'Red de drenaje y sumideros inspeccionados mensualmente (INS-DRE-04).',
      individuo: 'Calzado de seguridad con suela antideslizante.'
    },
    valoracion: {
      nd: 6,
      ne: 2,
      np: 12,
      interpretacionNP: 'Medio (M)',
      nc: 25,
      nr: 300,
      nivelRiesgo: 'II',
      interpretacionNR: 'Nivel II (500 - 150)',
      aceptabilidad: 'No Aceptable o Aceptable con control específico',
      significadoNR: 'Corregir y adoptar medidas de control de inmediato. Mantener control específico riguroso.',
      estado: 'Valorado'
    },
    criterios: {
      numExpuestos: 18,
      peorConsecuencia: 'Electrocución por contacto con tomas energizadas o fracturas por caída en piso anegado.',
      tieneRequisitoLegal: true,
      requisitoLegalEspecifico: 'Decreto 1072 de 2015 Art. 2.2.4.6.25, Ley 9 de 1979 Art. 93.'
    },
    medidas: {
      eliminacion: 'No aplica.',
      sustitucion: 'Elevación de estibas a mínimo 15 cm del piso en zonas bajas.',
      controlIngenieria: 'Instalación de bombas sumergibles de achique automáticas y diques de contención en portones.',
      controlAdministrativo: 'Procedimiento PON-INU-004, simulacro bianual SIM-INU-04, mantenimiento preventivo de colectores y techos.',
      epp: 'Botas de caucho caña alta con suela antideslizante y puntera dieléctrica.'
    },
    fechaCreacion: '2026-08-04',
    fechaRevision: '2026-08-04',
    responsableRevision: 'Servicios Generales'
  },
  {
    id: 'IPVR-EMG-03',
    codigoInterno: 'EMG-TEC-03',
    proceso: 'Logística y Almacenamiento',
    tipoProceso: 'Misional / Operativo',
    area: 'Almacén y Centro de Distribución',
    lugarEspecifico: 'Racks de mercancía mixta, zona de baterías y tableros eléctricos',
    actividad: 'Almacenamiento y manipulación de productos y baterías',
    tarea: 'Custodia de mercancías mixtas, tubería EMT y carga de equipos de litio',
    rutinaria: 'Rutinaria',
    cargoExpuesto: 'Personal de almacén, supervisores de logística y brigadistas',
    expuestosDirectos: 25,
    expuestosContratistas: 5,
    expuestosTemporales: 0,
    expuestosTotal: 30,
    frecuencia: 'Continua (Toda la jornada)',
    naturalezaPeligro: 'Condiciones de Seguridad',
    clasificacionPeligro: 'Tecnológico (Incendio, Explosión, Fuga, Derrame)',
    fuenteGeneradora: 'Por almacenamiento de mercancía mistas y tuberia EMT',
    descripcionPeligro: 'Conato de incendio en bodega o desbocamiento térmico (thermal runaway) en módulos de baterías de litio.',
    efectosPosibles: 'Quemaduras de 2º y 3º grado, asfixia por inhalación de monóxido de carbono y gases tóxicos, intoxicación aguda, muerte.',
    controlesExistentes: {
      fuente: 'Ninguno (sin rociadores automáticos ni aspersores).',
      medio: 'Parlante de alarma de seguridad (sin pulsadores manuales de alarma de incendio).',
      individuo: 'Extintores portátiles multipropósito (sin red hidráulica de gabinetes dotada).'
    },
    valoracion: {
      nd: 6,
      ne: 3,
      np: 18,
      interpretacionNP: 'Alto (A)',
      nc: 60,
      nr: 1080,
      nivelRiesgo: 'I',
      interpretacionNR: 'Nivel I (4000 - 600)',
      aceptabilidad: 'No Aceptable',
      significadoNR: 'Situación crítica. Suspender actividades inmediatamente hasta que el riesgo esté bajo control. Intervención urgente requerida.',
      estado: 'En Intervención'
    },
    criterios: {
      numExpuestos: 30,
      peorConsecuencia: 'Muerte por asfixia por humos tóxicos o quemaduras de tercer grado en incendio generalizado.',
      tieneRequisitoLegal: true,
      requisitoLegalEspecifico: 'NSR-10 Títulos J y K, NFPA 10, NFPA 855 (Baterías de Litio), Res. 2400 de 1979, Dec. 1072/2015.'
    },
    medidas: {
      eliminacion: 'No aplica.',
      sustitucion: 'Separación y aislamiento de celdas de litio en gabinetes ignífugos especiales.',
      controlIngenieria: 'Instalación de sistema de detección temprana de humo, pulsadores de alarma y red hidráulica contra incendios.',
      controlAdministrativo: 'Procedimiento PON-LIT-001, inspección mensual de extintores (INS-EXT-01), simulacro semestral de conato (SIM-INC-01) y capacitación con ARL.',
      epp: 'Extintores de agente encapsulador / clase D (NFPA 855) y trajes ignífugos para la brigada.'
    },
    fechaCreacion: '2026-08-04',
    fechaRevision: '2026-08-04',
    responsableRevision: 'SST / Brigada'
  },
  {
    id: 'IPVR-EMG-04',
    codigoInterno: 'EMG-TEC-04',
    proceso: 'Mantenimiento e Infraestructura',
    tipoProceso: 'Apoyo',
    area: 'Taller de Mantenimiento Mecánico',
    lugarEspecifico: 'Líneas de acometida de gas natural / GLP y talleres',
    actividad: 'Mantenimiento locativo y servicios de alimentación',
    tarea: 'Operación e inspección de tuberías y válvulas de gas',
    rutinaria: 'Rutinaria',
    cargoExpuesto: 'Técnicos de mantenimiento y operarios',
    expuestosDirectos: 8,
    expuestosContratistas: 2,
    expuestosTemporales: 0,
    expuestosTotal: 10,
    frecuencia: 'Ocasional (1 vez/semana)',
    naturalezaPeligro: 'Condiciones de Seguridad',
    clasificacionPeligro: 'Tecnológico (Incendio, Explosión, Fuga, Derrame)',
    fuenteGeneradora: 'Redes de gas natural / GLP, cilindros y accesorios sometidos a presión.',
    descripcionPeligro: 'Fuga de gas natural/GLP o concentración en atmósferas explosivas con fuente de ignición.',
    efectosPosibles: 'Traumatismos severos por onda expansiva, quemaduras graves, asfixia por desplazamiento de oxígeno, fatalidades.',
    controlesExistentes: {
      fuente: 'Válvula de corte rápido manual.',
      medio: 'Ventilación natural en áreas perimetrales.',
      individuo: 'Ninguno.'
    },
    valoracion: {
      nd: 6,
      ne: 2,
      np: 12,
      interpretacionNP: 'Medio (M)',
      nc: 60,
      nr: 720,
      nivelRiesgo: 'I',
      interpretacionNR: 'Nivel I (4000 - 600)',
      aceptabilidad: 'No Aceptable',
      significadoNR: 'Situación crítica. Suspender actividades inmediatamente hasta que el riesgo esté bajo control. Intervención urgente requerida.',
      estado: 'En Intervención'
    },
    criterios: {
      numExpuestos: 10,
      peorConsecuencia: 'Muerte o lesiones incapacitantes permanentes por explosión de gas.',
      tieneRequisitoLegal: true,
      requisitoLegalEspecifico: 'Resolución 2400 de 1979 Título VII, Decreto 1072 de 2015 Art. 2.2.4.6.25.'
    },
    medidas: {
      eliminacion: 'No aplica.',
      sustitucion: 'Transición a equipos de inducción eléctrica cuando sea factible.',
      controlIngenieria: 'Instalación de detectores de gas con electroválvula de corte automático solenoide.',
      controlAdministrativo: 'Procedimiento PON-EXP-002, inspección trimestral de válvulas e integridad de tuberías (INS-VAL-02), simulacro anual (SIM-EXP-02).',
      epp: 'Detector portátil de gases y EPP antiestático para personal de mantenimiento.'
    },
    fechaCreacion: '2026-08-04',
    fechaRevision: '2026-08-04',
    responsableRevision: 'Mantenimiento'
  },
  {
    id: 'IPVR-EMG-05',
    codigoInterno: 'EMG-TEC-05',
    proceso: 'Gestión Integral HSEQ',
    tipoProceso: 'Estratégico',
    area: 'Sede Principal - Oficinas Administrativas',
    lugarEspecifico: 'Oficinas administrativas, cielo raso y cubierta de bodega',
    actividad: 'Labores de oficina y almacenamiento general',
    tarea: 'Permanencia en puestos de trabajo bajo techos y cubiertas',
    rutinaria: 'Rutinaria',
    cargoExpuesto: 'Personal administrativo, comercial y operativo',
    expuestosDirectos: 20,
    expuestosContratistas: 2,
    expuestosTemporales: 0,
    expuestosTotal: 22,
    frecuencia: 'Continua (Toda la jornada)',
    naturalezaPeligro: 'Condiciones de Seguridad',
    clasificacionPeligro: 'Locativo (Superficies, Desniveles, Espacio, Caída Objetos)',
    fuenteGeneradora: 'Debilitamiento de estructura física en la oficina, caída de techos.',
    descripcionPeligro: 'Desprendimiento de cubierta, paneles de cielo raso o caída de estanterías industriales por fatiga de material o sobrecarga.',
    efectosPosibles: 'Contusiones, laceraciones en cuero cabelludo, traumatismo craneal, fracturas de miembros superiores e inferiores.',
    controlesExistentes: {
      fuente: 'Ninguno (edificación sin muros ni puertas cortafuego).',
      medio: 'Inspección visual periódica de techos.',
      individuo: 'Uso de casco de seguridad obligatorio únicamente en pasillos de bodega.'
    },
    valoracion: {
      nd: 6,
      ne: 2,
      np: 12,
      interpretacionNP: 'Medio (M)',
      nc: 25,
      nr: 300,
      nivelRiesgo: 'II',
      interpretacionNR: 'Nivel II (500 - 150)',
      aceptabilidad: 'No Aceptable o Aceptable con control específico',
      significadoNR: 'Corregir y adoptar medidas de control de inmediato. Mantener control específico riguroso.',
      estado: 'Valorado'
    },
    criterios: {
      numExpuestos: 22,
      peorConsecuencia: 'Traumatismo craneoencefálico severo por impacto de lámina o perfil metálico.',
      tieneRequisitoLegal: true,
      requisitoLegalEspecifico: 'Resolución 2400 de 1979 Art. 17-28, Decreto 1072 de 2015.'
    },
    medidas: {
      eliminacion: 'Retiro y sustitución de paneles de cielo raso con humedad o agrietamiento.',
      sustitucion: 'Reemplazo de cubiertas deterioradas por tejas termoacústicas ultralivianas.',
      controlIngenieria: 'Reforzamiento de cerchas metálicas, revisión de anclajes de estanterías y soporte de techos.',
      controlAdministrativo: 'Procedimiento PON-EST-003, programa de inspección técnica anual de estructura (INS-EST-03), simulacro anual (SIM-EST-03).',
      epp: 'Casco de seguridad tipo I para labores bajo cubiertas en mantenimiento.'
    },
    fechaCreacion: '2026-08-04',
    fechaRevision: '2026-08-04',
    responsableRevision: 'Mantenimiento'
  },
  {
    id: 'IPVR-EMG-06',
    codigoInterno: 'EMG-TEC-06',
    proceso: 'Tecnología e Informática',
    tipoProceso: 'Apoyo',
    area: 'Sede Principal - Oficinas Administrativas',
    lugarEspecifico: 'Sala de servidores, áreas de trabajo y rutas de evacuación',
    actividad: 'Operación continua de sistemas de información y seguridad',
    tarea: 'Suministro ininterrumpido de energía y respaldo de información',
    rutinaria: 'Rutinaria',
    cargoExpuesto: 'Analistas de sistemas, administrativos y personal general',
    expuestosDirectos: 45,
    expuestosContratistas: 5,
    expuestosTemporales: 0,
    expuestosTotal: 50,
    frecuencia: 'Continua (Toda la jornada)',
    naturalezaPeligro: 'Condiciones de Seguridad',
    clasificacionPeligro: 'Eléctrico (Alta / Baja Tensión / Estática)',
    fuenteGeneradora: 'Corte en el suministro de energía por reparación o daños.',
    descripcionPeligro: 'Suspensión de energía de red, apagón de sistemas de seguridad, CCTV, iluminación de escaleras y vías de evacuación.',
    efectosPosibles: 'Caídas en escaleras por oscuridad súbita, golpes, desorientación, pánico, atrapamiento en accesos electrónicos y parálisis operativa.',
    controlesExistentes: {
      fuente: 'UPS central para servidores (sin generador eléctrico de emergencia).',
      medio: 'Sin sistema de iluminación autónoma de emergencia en escaleras.',
      individuo: 'Linternas manuales en recepción y teléfonos celulares.'
    },
    valoracion: {
      nd: 6,
      ne: 2,
      np: 12,
      interpretacionNP: 'Medio (M)',
      nc: 25,
      nr: 300,
      nivelRiesgo: 'II',
      interpretacionNR: 'Nivel II (500 - 150)',
      aceptabilidad: 'No Aceptable o Aceptable con control específico',
      significadoNR: 'Corregir y adoptar medidas de control de inmediato. Mantener control específico riguroso.',
      estado: 'Valorado'
    },
    criterios: {
      numExpuestos: 50,
      peorConsecuencia: 'Politraumatismo grave por caída en escalera a oscuras durante evacuación de emergencia.',
      tieneRequisitoLegal: true,
      requisitoLegalEspecifico: 'Reglamento Técnico RETIE, NSR-10 Título J y K, Decreto 1072 de 2015 Art. 2.2.4.6.25.'
    },
    medidas: {
      eliminacion: 'No aplica.',
      sustitucion: 'No aplica.',
      controlIngenieria: 'Instalación de generador eléctrico de emergencia con transferencia automática y lámparas de emergencia LED autónomas (autonomía 90 min) en escaleras y pasillos.',
      controlAdministrativo: 'Procedimiento PON-ELE-007, mantenimiento mensual de UPS y baterías (INS-UPS-07), simulacro semestral de corte y respaldo DRP en nube (< 4h RTO).',
      epp: 'No aplica.'
    },
    fechaCreacion: '2026-08-04',
    fechaRevision: '2026-08-04',
    responsableRevision: 'TI / Eléctrico'
  },
  {
    id: 'IPVR-EMG-07',
    codigoInterno: 'EMG-TEC-07',
    proceso: 'Logística y Almacenamiento',
    tipoProceso: 'Misional / Operativo',
    area: 'Zona de Muelles y Cargue/Descargue',
    lugarEspecifico: 'Patio de maniobras y acceso vehicular/peatonal',
    actividad: 'Cargue, descargue y despacho de mercancías',
    tarea: 'Ingreso, parqueo, reversa y maniobra de vehículos pesados y furgones',
    rutinaria: 'Rutinaria',
    cargoExpuesto: 'Conductores, auxiliares logísticos, bodegueros y peatones',
    expuestosDirectos: 12,
    expuestosContratistas: 4,
    expuestosTemporales: 0,
    expuestosTotal: 16,
    frecuencia: 'Continua (Toda la jornada)',
    naturalezaPeligro: 'Condiciones de Seguridad',
    clasificacionPeligro: 'Condiciones de Seguridad - Tránsito / Movilidad',
    fuenteGeneradora: 'Ingresan vehículos para cargue y descargue de mercancía.',
    descripcionPeligro: 'Atropellamiento o colisión vehicular en patio de maniobras por coexistencia de flujo peatonal y vehicular.',
    efectosPosibles: 'Atropellamiento, aplastamiento contra muelles o muros, fracturas múltiples, politraumatismos, muerte.',
    controlesExistentes: {
      fuente: 'Mantenimiento preventivo de 1 furgón propio de la empresa.',
      medio: 'Edificación con una salida peatonal y una salida de vehículos.',
      individuo: 'Uso de chalecos reflectivos en patio de maniobras.'
    },
    valoracion: {
      nd: 6,
      ne: 3,
      np: 18,
      interpretacionNP: 'Alto (A)',
      nc: 60,
      nr: 1080,
      nivelRiesgo: 'I',
      interpretacionNR: 'Nivel I (4000 - 600)',
      aceptabilidad: 'No Aceptable',
      significadoNR: 'Situación crítica. Suspender actividades inmediatamente hasta que el riesgo esté bajo control. Intervención urgente requerida.',
      estado: 'En Intervención'
    },
    criterios: {
      numExpuestos: 16,
      peorConsecuencia: 'Muerte por atropellamiento o aprisionamiento contra muelle de descargue.',
      tieneRequisitoLegal: true,
      requisitoLegalEspecifico: 'Ley 1503 de 2011, Resolución 40595 de 2022 (PESV), Decreto 1072 de 2015.'
    },
    medidas: {
      eliminacion: 'Segregación física total de la circulación peatonal de la vehicular.',
      sustitucion: 'No aplica.',
      controlIngenieria: 'Instalación de barandas de protección peatonal, espejos convexos de 360°, tope-llantas de caucho en muelles y reductores de velocidad.',
      controlAdministrativo: 'Procedimiento PON-VIA-009, Plan Estratégico de Seguridad Vial (PESV), inspección diaria preoperacional de vehículos (INS-VIA-09) y simulacro semestral.',
      epp: 'Chaleco reflectivo clase 2 norma ANSI/ISEA 107 y calzado de seguridad con puntera de acero.'
    },
    fechaCreacion: '2026-08-04',
    fechaRevision: '2026-08-04',
    responsableRevision: 'PESV / Logística'
  },
  {
    id: 'IPVR-EMG-08',
    codigoInterno: 'EMG-SOC-08',
    proceso: 'Gestión Integral HSEQ',
    tipoProceso: 'Estratégico',
    area: 'Parqueadero y Accesos Peatonales',
    lugarEspecifico: 'Portería principal, recepción y fachada perimetral',
    actividad: 'Control de accesos y recepción de correspondencia/paquetería',
    tarea: 'Recepción de paquetes externos y control de ingreso de visitantes',
    rutinaria: 'Rutinaria',
    cargoExpuesto: 'Guardas de seguridad, recepcionista y colaboradores',
    expuestosDirectos: 48,
    expuestosContratistas: 6,
    expuestosTemporales: 0,
    expuestosTotal: 54,
    frecuencia: 'Intermitente (Varias veces/semana)',
    naturalezaPeligro: 'Condiciones de Seguridad',
    clasificacionPeligro: 'Público (Robos, Atracos, Asaltos, Asonadas)',
    fuenteGeneradora: 'Situación socio política del país.',
    descripcionPeligro: 'Paquete sospechoso abandonado, intrusión violenta o amenaza de atentado terrorista.',
    efectosPosibles: 'Lesiones por metralla o esquirlas, quemaduras, trauma acústico, shock nervioso severo, politraumatismos, muerte.',
    controlesExistentes: {
      fuente: 'Ninguno en la fuente.',
      medio: 'Circuito cerrado de televisión (CCTV monitoreado por Prosegur).',
      individuo: 'Servicio de vigilancia privada física (Prosegur) y comunicación celular.'
    },
    valoracion: {
      nd: 6,
      ne: 1,
      np: 6,
      interpretacionNP: 'Medio (M)',
      nc: 60,
      nr: 360,
      nivelRiesgo: 'II',
      interpretacionNR: 'Nivel II (500 - 150)',
      aceptabilidad: 'No Aceptable o Aceptable con control específico',
      significadoNR: 'Corregir y adoptar medidas de control de inmediato. Mantener control específico riguroso.',
      estado: 'Valorado'
    },
    criterios: {
      numExpuestos: 54,
      peorConsecuencia: 'Muerte o lesiones mutilantes por detonación de artefacto explosivo.',
      tieneRequisitoLegal: true,
      requisitoLegalEspecifico: 'Decreto 1072 de 2015 Art. 2.2.4.6.25, Ley 1523 de 2012.'
    },
    medidas: {
      eliminacion: 'No aplica.',
      sustitucion: 'No aplica.',
      controlIngenieria: 'Instalación de detector de metales portátil / tipo arco y esclusa de seguridad de doble puerta.',
      controlAdministrativo: 'Procedimiento PON-SOC-008, protocolo de inspección quincenal de cámaras e iluminación perimetral (INS-CCTV-08), simulacro anual.',
      epp: 'Dotación reglamentaria de seguridad para personal de vigilancia.'
    },
    fechaCreacion: '2026-08-04',
    fechaRevision: '2026-08-04',
    responsableRevision: 'Vigilancia / SST'
  },
  {
    id: 'IPVR-EMG-09',
    codigoInterno: 'EMG-SOC-09',
    proceso: 'Direccionamiento Estratégico',
    tipoProceso: 'Estratégico',
    area: 'Parqueadero y Accesos Peatonales',
    lugarEspecifico: 'Vías perimetrales y fachadas externas de la sede',
    actividad: 'Ingreso, permanencia y salida de colaboradores y clientes',
    tarea: 'Tránsito peatonal y vehicular en inmediaciones de la edificación',
    rutinaria: 'No Rutinaria',
    cargoExpuesto: 'Todos los trabajadores, contratistas y visitantes',
    expuestosDirectos: 48,
    expuestosContratistas: 6,
    expuestosTemporales: 0,
    expuestosTotal: 54,
    frecuencia: 'Ocasional (1 vez/semana)',
    naturalezaPeligro: 'Condiciones de Seguridad',
    clasificacionPeligro: 'Público (Robos, Atracos, Asaltos, Asonadas)',
    fuenteGeneradora: 'Situación socio política del país.',
    descripcionPeligro: 'Disturbios, marchas violentas o bloqueos de vías en inmediaciones con lanzamiento de objetos contundentes y gases lacrimógenos.',
    efectosPosibles: 'Contusiones por objetos contundentes, irritación respiratoria/ocular por gases lacrimógenos, laceraciones, pánico colectivo.',
    controlesExistentes: {
      fuente: 'Ninguno en la fuente.',
      medio: 'Puertas de acceso principal con cerraduras de seguridad.',
      individuo: 'Comunicación celular directa y monitoreo de noticias.'
    },
    valoracion: {
      nd: 2,
      ne: 2,
      np: 4,
      interpretacionNP: 'Bajo (B)',
      nc: 25,
      nr: 100,
      nivelRiesgo: 'III',
      interpretacionNR: 'Nivel III (120 - 40)',
      aceptabilidad: 'Mejorable',
      significadoNR: 'Mejorar si es posible. Sería conveniente justificar la intervención y su rentabilidad.',
      estado: 'Controlado'
    },
    criterios: {
      numExpuestos: 54,
      peorConsecuencia: 'Traumatismos por impacto de objetos contundentes o asfixia por agentes químicos antidisturbios.',
      tieneRequisitoLegal: true,
      requisitoLegalEspecifico: 'Decreto 1072 de 2015 Art. 2.2.4.6.25, Ley 9 de 1979.'
    },
    medidas: {
      eliminacion: 'Evacuación temprana y modalidad remota / teletrabajo ante alertas de orden público.',
      sustitucion: 'No aplica.',
      controlIngenieria: 'Películas de seguridad anti-esquirlas en ventanales perimetrales y persianas metálicas de protección.',
      controlAdministrativo: 'Procedimiento PON-ORD-010, monitoreo diario de cámaras (INS-CCTV-10), canal de alerta temprana con Policía Nacional y simulacro anual.',
      epp: 'Mascarillas de protección respiratoria con carbón activado para brigadistas.'
    },
    fechaCreacion: '2026-08-04',
    fechaRevision: '2026-08-04',
    responsableRevision: 'Gerencia / Seguridad'
  },
  {
    id: 'IPVR-EMG-10',
    codigoInterno: 'EMG-SOC-10',
    proceso: 'Gestión Financiera y Contable',
    tipoProceso: 'Apoyo',
    area: 'Sede Principal - Oficinas Administrativas',
    lugarEspecifico: 'Módulos de caja, tesorería, despachos y acceso principal',
    actividad: 'Custodia de valores, recaudo y despacho de mercancías',
    tarea: 'Manejo de dinero en efectivo, mercancías de alto valor y atención a terceros',
    rutinaria: 'Rutinaria',
    cargoExpuesto: 'Cajeros, analistas contables, bodegueros y guardas de seguridad',
    expuestosDirectos: 10,
    expuestosContratistas: 2,
    expuestosTemporales: 0,
    expuestosTotal: 12,
    frecuencia: 'Continua (Toda la jornada)',
    naturalezaPeligro: 'Condiciones de Seguridad',
    clasificacionPeligro: 'Público (Robos, Atracos, Asaltos, Asonadas)',
    fuenteGeneradora: 'Situación socio política del país.',
    descripcionPeligro: 'Robo a mano armada, atraco en accesos o intrusión delictiva en áreas de custodia de bienes.',
    efectosPosibles: 'Heridas por arma de fuego o arma blanca, trauma psicológico severo, estrés postraumático, fatalidades.',
    controlesExistentes: {
      fuente: 'Ninguno en la fuente.',
      medio: 'CCTV perimetral Prosegur, botón de pánico conectado a central de monitoreo.',
      individuo: 'Personal de seguridad privada con radiocomunicación.'
    },
    valoracion: {
      nd: 6,
      ne: 2,
      np: 12,
      interpretacionNP: 'Medio (M)',
      nc: 25,
      nr: 300,
      nivelRiesgo: 'II',
      interpretacionNR: 'Nivel II (500 - 150)',
      aceptabilidad: 'No Aceptable o Aceptable con control específico',
      significadoNR: 'Corregir y adoptar medidas de control de inmediato. Mantener control específico riguroso.',
      estado: 'Valorado'
    },
    criterios: {
      numExpuestos: 12,
      peorConsecuencia: 'Muerte o discapacidad permanente por impacto de arma de fuego en atraco.',
      tieneRequisitoLegal: true,
      requisitoLegalEspecifico: 'Decreto 1072 de 2015, Resolución 0312 de 2019 Estándar 4.1.2.'
    },
    medidas: {
      eliminacion: 'Eliminación del manejo de efectivo en caja física (100% bancarizado).',
      sustitucion: 'No aplica.',
      controlIngenieria: 'Ventanilla blindada Nivel III para caja y cerraduras electromagnéticas con lector biométrico.',
      controlAdministrativo: 'Procedimiento PON-ALT-011, inspección mensual de pulsadores de alarma (INS-ALM-11), capacitación anti-atraco y simulacro anual.',
      epp: 'Chaleco antibalas nivel IIIA para guardas de seguridad en puestos de acceso.'
    },
    fechaCreacion: '2026-08-04',
    fechaRevision: '2026-08-04',
    responsableRevision: 'Seguridad Privada'
  }
];

export const INITIAL_ACTIONS: AccionSeguimiento[] = [
  // === ACCIONES DE TRAZABILIDAD OPERATIVA DEL PLAN DE EMERGENCIAS (PA-2026-XXX) ===
  {
    id: 'ACT-EMG-01',
    ipvrId: 'IPVR-EMG-01',
    peligroResumen: 'Movimientos Sísmicos y Sismo-Resistencia',
    jerarquia: 'Control Administrativo',
    descripcionAccion: 'Formalizar actas de conformación y entrenamiento de la Brigada de Emergencias y ejecutar simulacro general de evacuación (SIM-GEN-12 / PON-GEN-012).',
    responsable: 'Brigada / SST',
    cargoResponsable: 'Coordinador SG-SST',
    fechaPropuesta: '2026-08-04',
    fechaLimite: '2026-09-15',
    estado: 'En ejecución',
    recursosNecesarios: 'Horas de asesoría técnica ARL SURA + Kit de triaje',
    tipoEvidencia: 'Capacitación',
    detalleEvidencia: 'Actas de conformación de la brigada y reporte de simulacro de evacuación.',
    eficacia: 'No evaluada',
    observaciones: 'Código de acción institucional: PA-2026-012.'
  },
  {
    id: 'ACT-EMG-02',
    ipvrId: 'IPVR-EMG-02',
    peligroResumen: 'Inundaciones y Anegación en Bodega',
    jerarquia: 'Control de Ingeniería',
    descripcionAccion: 'Inspección técnica mensual y limpieza de colectores de aguas lluvias (INS-DRE-04) y cotización de bomba de achique sumergible.',
    responsable: 'Servicios Generales',
    cargoResponsable: 'Líder de Servicios Generales',
    fechaPropuesta: '2026-08-04',
    fechaLimite: '2026-08-30',
    estado: 'En ejecución',
    recursosNecesarios: '$3.500.000 COP para motobomba y adecuación de sumideros',
    tipoEvidencia: 'Inspección',
    detalleEvidencia: 'Lista de chequeo INS-DRE-04 y reporte fotográfico de limpieza.',
    eficacia: 'No evaluada',
    observaciones: 'Código de acción institucional: PA-2026-002.'
  },
  {
    id: 'ACT-EMG-03',
    ipvrId: 'IPVR-EMG-03',
    peligroResumen: 'Incendios en Bodega y Baterías de Litio (UN3481)',
    jerarquia: 'Control Administrativo',
    descripcionAccion: 'Implementar el procedimiento PON-LIT-001 con extintores de agente encapsulador / clase D (NFPA 855) e inspección mensual de extintores (INS-EXT-01).',
    responsable: 'SST / Brigada',
    cargoResponsable: 'Coordinador SG-SST',
    fechaPropuesta: '2026-08-04',
    fechaLimite: '2026-09-04',
    estado: 'En ejecución',
    recursosNecesarios: '$5.800.000 COP para recarga de extintores y agentes clase D',
    tipoEvidencia: 'Procedimiento / PTS',
    detalleEvidencia: 'Planilla de inspección mensual INS-EXT-01 y entrega de extintores para litio.',
    eficacia: 'No evaluada',
    observaciones: 'Código de acción institucional: PA-2026-003.'
  },
  {
    id: 'ACT-EMG-04',
    ipvrId: 'IPVR-EMG-04',
    peligroResumen: 'Fugas de Gas y Atmósferas Explosivas',
    jerarquia: 'Control de Ingeniería',
    descripcionAccion: 'Inspección trimestral de válvulas y hermeticidad de líneas de gas (INS-VAL-02) e instalación de sensores de fuga con corte automático.',
    responsable: 'Mantenimiento',
    cargoResponsable: 'Líder de Mantenimiento',
    fechaPropuesta: '2026-08-04',
    fechaLimite: '2026-10-15',
    estado: 'Abierta',
    recursosNecesarios: '$4.200.000 COP para electroválvula y sensores certificados',
    tipoEvidencia: 'Inspección',
    detalleEvidencia: 'Certificado de prueba de hermeticidad de gas emitido por técnico calificado.',
    eficacia: 'No evaluada',
    observaciones: 'Código de acción institucional: PA-2026-004.'
  },
  {
    id: 'ACT-EMG-05',
    ipvrId: 'IPVR-EMG-05',
    peligroResumen: 'Fallas Estructurales y Cubiertas',
    jerarquia: 'Control de Ingeniería',
    descripcionAccion: 'Inspección estructural anual de cubiertas y cielo rasos (INS-EST-03) y reemplazo de láminas con riesgo de desprendimiento.',
    responsable: 'Mantenimiento',
    cargoResponsable: 'Líder de Mantenimiento',
    fechaPropuesta: '2026-08-04',
    fechaLimite: '2026-09-30',
    estado: 'En ejecución',
    recursosNecesarios: '$6.500.000 COP para adecuaciones locativas de techos',
    tipoEvidencia: 'Mantenimiento',
    detalleEvidencia: 'Acta de entrega de obras de mantenimiento de cubiertas e informe estructural.',
    eficacia: 'No evaluada',
    observaciones: 'Código de acción institucional: PA-2026-005.'
  },
  {
    id: 'ACT-EMG-06',
    ipvrId: 'IPVR-EMG-06',
    peligroResumen: 'Ausencia de Fluido Eléctrico y Respaldo DRP',
    jerarquia: 'Control Administrativo',
    descripcionAccion: 'Implementar respaldos diarios cifrados en la nube externa con RTO < 4h (Plan DRP/BCP) y mantenimiento mensual a UPS y alumbrado autónomo (INS-UPS-07).',
    responsable: 'Área de Sistemas / TI',
    cargoResponsable: 'Líder de Sistemas / TI',
    fechaPropuesta: '2026-08-04',
    fechaLimite: '2026-11-30',
    estado: 'En ejecución',
    recursosNecesarios: '$12.000.000 COP anuales en infraestructura cloud redundante y luminarias autónomas',
    tipoEvidencia: 'Procedimiento / PTS',
    detalleEvidencia: 'Acta de prueba trimestral de restauración de bases de datos y checklist de UPS.',
    eficacia: 'No evaluada',
    observaciones: 'Código de acción institucional: PA-2026-006.'
  },
  {
    id: 'ACT-EMG-07',
    ipvrId: 'IPVR-EMG-07',
    peligroResumen: 'Accidentes Viales en Patio de Maniobras',
    jerarquia: 'Control Administrativo',
    descripcionAccion: 'Implementar inspección diaria preoperacional de furgón (INS-VIA-09), demarcación de senderos peatonales y simulacro vial semestral (SIM-VIA-09).',
    responsable: 'PESV / Logística',
    cargoResponsable: 'Coordinador de Logística y Transporte',
    fechaPropuesta: '2026-08-04',
    fechaLimite: '2026-08-25',
    estado: 'En ejecución',
    recursosNecesarios: '$1.800.000 COP en pintura epóxica vial y señalética reflectiva',
    tipoEvidencia: 'Inspección',
    detalleEvidencia: 'Planillas diarias INS-VIA-09 y registro fotográfico de demarcación de patio.',
    eficacia: 'No evaluada',
    observaciones: 'Código de acción institucional: PA-2026-007.'
  },
  {
    id: 'ACT-EMG-08',
    ipvrId: 'IPVR-EMG-08',
    peligroResumen: 'Terrorismo y Paquetes Sospechosos',
    jerarquia: 'Control Administrativo',
    descripcionAccion: 'Protocolo de inspección quincenal de cámaras de seguridad CCTV (INS-CCTV-08 / PON-SOC-008) y capacitación en detección de paquetes sospechosos.',
    responsable: 'Vigilancia / SST',
    cargoResponsable: 'Líder de Seguridad Física',
    fechaPropuesta: '2026-08-04',
    fechaLimite: '2026-09-10',
    estado: 'Abierta',
    recursosNecesarios: '$1.200.000 COP en garret detector de metales y señalización',
    tipoEvidencia: 'Inspección',
    detalleEvidencia: 'Reporte quincenal de verificación de cámaras y novedades de acceso.',
    eficacia: 'No evaluada',
    observaciones: 'Código de acción institucional: PA-2026-009.'
  },
  {
    id: 'ACT-EMG-09',
    ipvrId: 'IPVR-EMG-09',
    peligroResumen: 'Disturbios y Alteración del Orden Público',
    jerarquia: 'Control Administrativo',
    descripcionAccion: 'Procedimiento de alerta temprana y resguardo PON-ORD-010 con protocolo de cierre perimetral y monitoreo diario de cámaras.',
    responsable: 'Gerencia / Seguridad',
    cargoResponsable: 'Gerencia General',
    fechaPropuesta: '2026-08-04',
    fechaLimite: '2026-08-30',
    estado: 'En ejecución',
    recursosNecesarios: 'Canal de comunicación directa con cuadrante de Policía Nacional',
    tipoEvidencia: 'Procedimiento / PTS',
    detalleEvidencia: 'Documento PON-ORD-010 difundido y directorio de emergencias actualizado.',
    eficacia: 'No evaluada',
    observaciones: 'Código de acción institucional: PA-2026-010.'
  },
  {
    id: 'ACT-EMG-10',
    ipvrId: 'IPVR-EMG-10',
    peligroResumen: 'Asaltos, Hurtos y Atraco a Mano Armada',
    jerarquia: 'Control de Ingeniería',
    descripcionAccion: 'Inspección mensual del sistema de alarma y botón de pánico silencioso (INS-ALM-11 / PON-ALT-011) y eliminación progresiva de efectivo en caja.',
    responsable: 'Seguridad Privada',
    cargoResponsable: 'Líder de Seguridad Privada',
    fechaPropuesta: '2026-08-04',
    fechaLimite: '2026-09-20',
    estado: 'En ejecución',
    recursosNecesarios: '$2.400.000 COP para botón de pánico inalámbrico y enlace a central Prosegur',
    tipoEvidencia: 'Inspección',
    detalleEvidencia: 'Acta de prueba mensual de enlace con la central de monitoreo Prosegur.',
    eficacia: 'No evaluada',
    observaciones: 'Código de acción institucional: PA-2026-011.'
  }
];

export const INITIAL_CATALOGS: CatalogoConfig = {
  procesos: [
    'Direccionamiento Estratégico',
    'Gestión Integral HSEQ',
    'Misional / Operativo',
    'Logística y Almacenamiento',
    'Mantenimiento e Infraestructura',
    'Gestión del Talento Humano',
    'Compras y Abastecimiento',
    'Gestión Comercial y Clientes',
    'Gestión Financiera y Contable',
    'Tecnología e Informática'
  ],
  areas: [
    'Sede Principal - Oficinas Administrativas',
    'Almacén y Centro de Distribución',
    'Zona de Muelles y Cargue/Descargue',
    'Línea de Ensamble y Empaque',
    'Taller de Mantenimiento Mecánico',
    'Laboratorio de Control de Calidad',
    'Archivo Central',
    'Comedor y Zonas Comunes',
    'Parqueadero y Accesos Peatonales'
  ],
  cargos: [
    'Gerente General',
    'Coordinador SG-SST',
    'Jefe de Planta / Operaciones',
    'Supervisor de Bodega / Almacén',
    'Operario de Montacargas',
    'Auxiliar Logístico / Bodeguero',
    'Operario de Ensamble y Empaque',
    'Técnico de Mantenimiento',
    'Analista Administrativo / Contable',
    'Conductor / Repartidor',
    'Personal de Servicios Generales y Aseo',
    'Guarda de Seguridad'
  ],
  responsablesSST: [
    'Coordinador SST / Brigada',
    'Servicios Generales',
    'SST / Brigada',
    'Líder de Mantenimiento',
    'Área de Sistemas / TI',
    'PESV / Logística',
    'Vigilancia / SST',
    'Gerencia / Seguridad',
    'Seguridad Privada (Prosegur)',
    'ARL SURA'
  ],
  versiones: ['1.0', '1.1', '2.0', '2.1', '3.0', '3.1'],
  clasesRiesgo: ['I', 'II', 'III', 'IV', 'V'],
  frecuencias: [
    'Esporádica (1 vez/mes o menos)',
    'Ocasional (1 vez/semana)',
    'Intermitente (Varias veces/semana)',
    'Frecuente (Varias veces/día)',
    'Continua (Toda la jornada)'
  ],
  tiposEvidencia: [
    'Inspección',
    'Capacitación',
    'Registro fotográfico',
    'Medición ambiental',
    'Procedimiento / PTS',
    'Acta de entrega EPP',
    'Mantenimiento',
    'Exámenes médicos',
    'Otro'
  ],
  estadosAccion: ['Abierta', 'En ejecución', 'Verificación', 'Cerrada', 'Vencida'],
  nivelesEficacia: ['No evaluada', 'Eficaz', 'Parcialmente eficaz', 'No eficaz']
};
