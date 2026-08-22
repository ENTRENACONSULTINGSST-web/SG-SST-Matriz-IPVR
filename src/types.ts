export type ClaseRiesgo = 'I' | 'II' | 'III' | 'IV' | 'V';

export type RolParticipacion = 
  | 'Trabajador operativo / administrativo'
  | 'Representante COPASST'
  | 'Vigía de Seguridad y Salud'
  | 'Líder de Proceso / Jefe de Área'
  | 'Brigadista de Emergencias'
  | 'Asesor ARL'
  | 'Responsable SG-SST';

export interface RegistroParticipacion {
  id: string;
  fecha: string;
  nombre: string;
  cargo: string;
  area: string;
  rol: RolParticipacion;
  tipoEvidencia: string; // e.g. Acta de reunión COPASST, Lista de asistencia inspección, Encuesta de peligros
  soporteUrl?: string;
  observaciones?: string;
}

export type MotivoActualizacionMatriz = 
  | 'Actualización anual reglamentaria (Dec. 1072 Art. 2.2.4.6.15)'
  | 'Ocurrencia de accidente de trabajo mortal o evento catastrófico'
  | 'Cambios en procesos, instalaciones, maquinaria o materias primas'
  | 'Resultados de auditoría interna / externa o inspección ARL / Mintrabajo'
  | 'Creación inicial de la matriz IPVR';

export interface OrganizacionData {
  empresa: string;
  razonSocial?: string;
  nit: string;
  ciiu: string;
  actividadEconomica: string;
  arl: string;
  claseRiesgo: ClaseRiesgo;
  numTrabajadores: number;
  numContratistas: number;
  numTemporales?: number;
  centrosTrabajo: string[];
  centroPrincipal: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  
  // Control de Metodología & Versión
  metodologia: string; // e.g. "GTC 45:2012 / Decreto 1072 de 2015 Art. 2.2.4.6.15"
  alcanceMetodologia: string;
  versionMatriz: string; // e.g. "V3.1"
  fechaElaboracion: string;
  fechaActualizacion: string;
  fechaProximaRevision: string;
  motivoActualizacion: MotivoActualizacionMatriz;
  
  // Control de Revisión y Aprobación
  elaboradoPor: string;
  cargoElaborador: string;
  licenciaSST: string;
  revisadoPor: string;
  cargoRevisor: string;
  aprobadoPor: string;
  cargoAprobador: string;
  fechaAprobacion: string;
  
  // Registro de Participación de los Trabajadores
  registrosParticipacion: RegistroParticipacion[];

  responsableSST: string;
  cargoResponsable: string;
  politicaSST: string;
  objetivosSST: string;
}

export type TipoProceso = 'Estratégico' | 'Misional / Operativo' | 'Apoyo' | 'Evaluación y Control';
export type TipoRutinaria = 'Rutinaria' | 'No Rutinaria';
export type FrecuenciaExposicion = 'Esporádica (1 vez/mes o menos)' | 'Ocasional (1 vez/semana)' | 'Intermitente (Varias veces/semana)' | 'Frecuente (Varias veces/día)' | 'Continua (Toda la jornada)';

export type NaturalezaPeligro = 
  | 'Biológico'
  | 'Físico'
  | 'Químico'
  | 'Psicosocial'
  | 'Biomecánico'
  | 'Condiciones de Seguridad'
  | 'Fenómenos Naturales';

export interface PeligroCatalogoItem {
  id: string;
  naturaleza: NaturalezaPeligro;
  clasificacion: string;
  descripcion: string;
  efectosPosibles: string;
  ejemplosFuente: string[];
}

// Estructura GTC 45 Oficial: Controles Existentes (Fuente, Medio, Individuo)
export interface ControlesExistentes {
  fuente: string;
  medio: string;
  individuo: string;
}

// Estructura GTC 45 Oficial: Criterios para Establecer Controles
export interface CriteriosControles {
  numExpuestos: number;
  peorConsecuencia: string; // Diferenciado de "Efectos Posibles"
  tieneRequisitoLegal: boolean; // ¿Existe requisito legal específico asociado? Sí / No
  requisitoLegalEspecifico: string; // ¿Cuál?
  requisitoLegal?: string; // alias retrocompatible
}

// Estructura GTC 45 Oficial: Medidas de Intervención (Jerarquía de 5 niveles)
export interface MedidasIntervencion {
  eliminacion: string;
  sustitucion: string;
  controlIngenieria: string;
  controlAdministrativo: string; // Controles administrativos, señalización, advertencia
  epp: string; // Equipos / Elementos de Protección Personal
}

export type NivelDeficiencia = 10 | 6 | 2 | 0;
export type NivelExposicion = 4 | 3 | 2 | 1;
export type NivelConsecuencia = 100 | 60 | 25 | 10;

export type NivelProbabilidadInterpretacion = 'Muy Alto (MA)' | 'Alto (A)' | 'Medio (M)' | 'Bajo (B)';
export type NivelRiesgoInterpretacion = 'I' | 'II' | 'III' | 'IV';
export type AceptabilidadRiesgo = 
  | 'No Aceptable'
  | 'No Aceptable o Aceptable con control específico'
  | 'Aceptable'
  | 'Aceptable con control específico'
  | 'Mejorable';

export interface ValoracionRiesgo {
  nd: NivelDeficiencia;
  ne: NivelExposicion;
  np: number; // ND * NE
  interpretacionNP: NivelProbabilidadInterpretacion;
  nc: NivelConsecuencia;
  nr: number; // NP * NC
  nivelRiesgo: NivelRiesgoInterpretacion;
  interpretacionNR: string; // Interpretación y Significado oficial GTC 45
  aceptabilidad: string;
  significadoNR: string;
  estado: 'Pendiente' | 'Valorado' | 'En Intervención' | 'Controlado';
}

export interface RegistroIPVR {
  id: string; // e.g. IPVR-001
  codigoInterno?: string;
  
  // 01 / 02 Localización y Actividad
  proceso: string;
  tipoProceso: TipoProceso;
  area: string; // Zona / Lugar
  lugarEspecifico: string;
  actividad: string;
  tarea: string;
  rutinaria: TipoRutinaria; // Rutinaria: Sí / No
  
  // Población Expuesta
  cargoExpuesto: string;
  expuestosDirectos: number;
  expuestosContratistas: number;
  expuestosTemporales?: number;
  expuestosTotal: number;
  frecuencia: FrecuenciaExposicion;
  
  // Peligro (Descripción + Clasificación según GTC 45)
  naturalezaPeligro: NaturalezaPeligro;
  clasificacionPeligro: string;
  fuenteGeneradora: string;
  descripcionPeligro: string;
  
  // Efectos Posibles en la Salud (GTC 45)
  efectosPosibles: string;
  
  // Controles Existentes (Fuente, Medio, Individuo)
  controlesExistentes: ControlesExistentes;
  
  // 03 Valoración del Riesgo (GTC 45)
  valoracion: ValoracionRiesgo;
  
  // Criterios para Establecer Controles
  criterios: CriteriosControles;
  
  // Medidas de Intervención (Jerarquía de Controles)
  medidas: MedidasIntervencion;
  
  fechaCreacion: string;
  fechaRevision?: string;
  responsableRevision?: string;
}

export type JerarquiaControl = 
  | 'Eliminación'
  | 'Sustitución'
  | 'Control de Ingeniería'
  | 'Control Administrativo'
  | 'Señalización / Advertencia'
  | 'Equipos / EPP';

export type EstadoAccion = 'Abierta' | 'En ejecución' | 'Verificación' | 'Cerrada' | 'Vencida';
export type EficaciaAccion = 'No evaluada' | 'Eficaz' | 'Parcialmente eficaz' | 'No eficaz';
export type TipoEvidencia = 'Inspección' | 'Capacitación' | 'Registro fotográfico' | 'Medición ambiental' | 'Procedimiento / PTS' | 'Acta de entrega EPP' | 'Mantenimiento' | 'Exámenes médicos' | 'Otro';

export interface AccionSeguimiento {
  id: string; // e.g. ACT-001
  ipvrId: string; // Vinculación a registro IPVR
  peligroResumen: string;
  jerarquia: JerarquiaControl;
  descripcionAccion: string;
  responsable: string;
  cargoResponsable: string;
  fechaPropuesta: string;
  fechaLimite: string;
  fechaCierre?: string;
  recursosNecesarios?: string;
  estado: EstadoAccion;
  tipoEvidencia: TipoEvidencia;
  detalleEvidencia: string;
  linkEvidencia?: string;
  eficacia: EficaciaAccion;
  fechaEvaluacionEficacia?: string;
  evaluadorEficacia?: string;
  observaciones?: string;
  // Re-evaluación post control
  nuevoND?: NivelDeficiencia;
  nuevoNE?: NivelExposicion;
  nuevoNC?: NivelConsecuencia;
  nuevoNP?: number;
  nuevoNR?: number;
  nuevoNivelRiesgo?: NivelRiesgoInterpretacion;
}

export interface CatalogoConfig {
  procesos: string[];
  areas: string[];
  cargos: string[];
  responsablesSST: string[];
  versiones: string[];
  clasesRiesgo: ClaseRiesgo[];
  frecuencias: FrecuenciaExposicion[];
  tiposEvidencia: TipoEvidencia[];
  estadosAccion: EstadoAccion[];
  nivelesEficacia: EficaciaAccion[];
}
