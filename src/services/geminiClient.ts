import { OrganizacionData, RegistroIPVR, AccionSeguimiento } from '../types';

export interface HazardAIGeneratedData {
  proceso?: string;
  tipoProceso?: 'Estratégico' | 'Misional / Operativo' | 'Apoyo' | 'Evaluación y Control';
  area?: string;
  lugarEspecifico?: string;
  actividad?: string;
  tarea?: string;
  rutinaria?: 'Rutinaria' | 'No Rutinaria';
  cargoExpuesto?: string;
  naturalezaPeligro?: string;
  clasificacionPeligro?: string;
  fuenteGeneradora?: string;
  descripcionPeligro?: string;
  efectosPosibles?: string;
  controlesExistentes?: {
    fuente?: string;
    medio?: string;
    individuo?: string;
  };
  valoracion?: {
    nd: 10 | 6 | 2 | 0;
    ne: 4 | 3 | 2 | 1;
    nc: 100 | 60 | 25 | 10;
  };
  criterios?: {
    peorConsecuencia?: string;
    tieneRequisitoLegal?: boolean;
    requisitoLegalEspecifico?: string;
  };
  medidas?: {
    eliminacion?: string;
    sustitucion?: string;
    controlIngenieria?: string;
    controlAdministrativo?: string;
    epp?: string;
  };
  accionSeguimiento?: {
    tipoControl?: string;
    descripcionAccion?: string;
    responsable?: string;
    fechaProgramada?: string;
    periodicidad?: string;
    indicador?: string;
  };
}

export async function generateHazardAnalysisWithAI(params: {
  amenaza: string;
  categoria?: string;
  origen?: string;
  fuenteDetalle?: string;
  calificacion?: string;
  orgData: OrganizacionData;
}): Promise<HazardAIGeneratedData> {
  const response = await fetch('/api/gemini/generate-hazard-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error en servidor (${response.status})`);
  }

  const result = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'No se recibió información de la IA.');
  }

  return result.data;
}

export async function generateFullMatrixWithAI(orgData: OrganizacionData): Promise<any[]> {
  const response = await fetch('/api/gemini/generate-full-matrix', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orgData })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error en servidor (${response.status})`);
  }

  const result = await response.json();
  if (!result.success || !result.data?.records) {
    throw new Error(result.error || 'No se recibieron registros de la matriz.');
  }

  return result.data.records;
}
