import ExcelJS from 'exceljs';
import { OrganizacionData, RegistroIPVR, AccionSeguimiento } from '../types';
import { ND_OPTIONS, NE_OPTIONS, NC_OPTIONS } from '../data/gtc45Data';

const CUSTOM_TEMPLATE_STORAGE_KEY = 'sgsst_custom_excel_template_b64';

/**
 * Storage helpers for user-defined custom physical template
 */
export function saveCustomTemplateBase64(base64: string, filename: string): void {
  try {
    localStorage.setItem(CUSTOM_TEMPLATE_STORAGE_KEY, base64);
    localStorage.setItem('sgsst_custom_excel_template_name', filename);
  } catch (e) {
    console.error('Error saving custom template to localStorage', e);
  }
}

export function getCustomTemplateBase64(): { base64: string | null; filename: string | null } {
  return {
    base64: localStorage.getItem(CUSTOM_TEMPLATE_STORAGE_KEY),
    filename: localStorage.getItem('sgsst_custom_excel_template_name')
  };
}

export function removeCustomTemplate(): void {
  localStorage.removeItem(CUSTOM_TEMPLATE_STORAGE_KEY);
  localStorage.removeItem('sgsst_custom_excel_template_name');
}

/**
 * Creates the Institutional Master Multi-Sheet GTC 45 Workbook
 * Preserves 6 interconnected sheets:
 * 1. 00_Portada_e_Instrucciones
 * 2. 01_Organización_SST
 * 3. 02_Matriz_IPVR_GTC45 (Target Data Injection)
 * 4. 03_Planes_de_Accion_PEC
 * 5. 04_Catalogos_GTC45
 * 6. 05_Dashboard_Resumen
 */
export async function createMasterTemplateWorkbook(
  orgData: OrganizacionData,
  records: RegistroIPVR[],
  actions: AccionSeguimiento[]
): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST)';
  workbook.lastModifiedBy = orgData.elaboradoPor || 'Responsable SG-SST';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Styles Palette
  const darkHeaderFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' } // Slate 900
  };

  const subHeaderFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E293B' } // Slate 800
  };

  const emeraldHeaderFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF065F46' } // Emerald 800
  };

  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
  };

  // =========================================================================
  // HOJA 1: 00_Portada_e_Instrucciones
  // =========================================================================
  const wsPortada = workbook.addWorksheet('00_Portada_e_Instrucciones', {
    properties: { tabColor: { argb: 'FF0F172A' } },
    views: [{ showGridLines: true }]
  });

  wsPortada.columns = [
    { width: 5 },
    { width: 32 },
    { width: 50 },
    { width: 25 },
    { width: 25 }
  ];

  // Header Title
  wsPortada.mergeCells('B2:E2');
  const titleCell = wsPortada.getCell('B2');
  titleCell.value = 'SISTEMA DE GESTIÓN DE LA SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)';
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = darkHeaderFill;
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  wsPortada.getRow(2).height = 30;

  wsPortada.mergeCells('B3:E3');
  const subTitleCell = wsPortada.getCell('B3');
  subTitleCell.value = 'MATRIZ INSTITUCIONAL DE IDENTIFICACIÓN DE PELIGROS, EVALUACIÓN Y VALORACIÓN DE RIESGOS (IPVR) · GTC 45:2012';
  subTitleCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  subTitleCell.fill = emeraldHeaderFill;
  subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  wsPortada.getRow(3).height = 24;

  const portadaRows = [
    ['B5', 'Empresa / Razón Social:', orgData.empresa || 'Empresa Principal'],
    ['B6', 'NIT:', orgData.nit || 'Sin Registrar'],
    ['B7', 'Actividad Económica:', orgData.actividadEconomica || 'Sector Comercial / Industrial'],
    ['B8', 'Clase de Riesgo Principal:', `Clase ${orgData.claseRiesgo || 'I'}`],
    ['B9', 'Sede / Instalación:', orgData.centroPrincipal || orgData.direccion || 'Sede Principal'],
    ['B10', 'Versión del Documento:', orgData.versionMatriz || '3.1'],
    ['B11', 'Fecha de Aprobación:', orgData.fechaActualizacion || new Date().toISOString().split('T')[0]],
    ['B12', 'Responsable de Elaboración:', orgData.elaboradoPor || 'Ingeniero / Tecnólogo SST'],
    ['B13', 'Aprobado por (Gerencia):', orgData.aprobadoPor || 'Representante Legal']
  ];

  portadaRows.forEach(([cellPos, label, val]) => {
    const rowNum = parseInt(cellPos.substring(1));
    wsPortada.getCell(`B${rowNum}`).value = label;
    wsPortada.getCell(`B${rowNum}`).font = { name: 'Calibri', bold: true, size: 10, color: { argb: 'FF1E293B' } };
    wsPortada.getCell(`B${rowNum}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    wsPortada.getCell(`B${rowNum}`).border = thinBorder;

    wsPortada.mergeCells(`C${rowNum}:E${rowNum}`);
    const vCell = wsPortada.getCell(`C${rowNum}`);
    vCell.value = val;
    vCell.font = { name: 'Calibri', size: 10 };
    vCell.border = thinBorder;
  });

  // Instructions section
  wsPortada.mergeCells('B15:E15');
  const instTitle = wsPortada.getCell('B15');
  instTitle.value = 'ESTRUCTURA DEL LIBRO DE TRABAJO Y GUÍA DE NAVEGACIÓN';
  instTitle.font = { name: 'Calibri', bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
  instTitle.fill = darkHeaderFill;
  instTitle.alignment = { horizontal: 'left', indent: 1 };

  const tabsGuide = [
    ['01_Organización_SST', 'Datos generales de la empresa, centros de trabajo, política, alcance y firmas de aprobación.'],
    ['02_Matriz_IPVR_GTC45', 'Matriz técnica central con los 4 bloques: Identificación, Valoración Cuantitativa, Criterios y Jerarquía de Medidas.'],
    ['03_Planes_de_Accion_PEC', 'Seguimiento riguroso de tareas de intervención, fechas límite, responsables, presupuestos y eficacia.'],
    ['04_Catalogos_GTC45', 'Tablas oficiales de la Guía Técnica Colombiana GTC 45:2012 (Deficiencia, Exposición, Consecuencia, Interpretación).'],
    ['05_Dashboard_Resumen', 'Fórmulas y consolidado de indicadores de criticidad, nivel de riesgo y distribución por procesos.']
  ];

  tabsGuide.forEach(([tabName, tabDesc], idx) => {
    const rIdx = 16 + idx;
    wsPortada.getCell(`B${rIdx}`).value = tabName;
    wsPortada.getCell(`B${rIdx}`).font = { name: 'Calibri', bold: true, size: 10, color: { argb: 'FF065F46' } };
    wsPortada.getCell(`B${rIdx}`).border = thinBorder;

    wsPortada.mergeCells(`C${rIdx}:E${rIdx}`);
    wsPortada.getCell(`C${rIdx}`).value = tabDesc;
    wsPortada.getCell(`C${rIdx}`).font = { name: 'Calibri', size: 9.5 };
    wsPortada.getCell(`C${rIdx}`).border = thinBorder;
  });

  // =========================================================================
  // HOJA 2: 01_Organización_SST
  // =========================================================================
  const wsOrg = workbook.addWorksheet('01_Organización_SST', {
    properties: { tabColor: { argb: 'FF2563EB' } },
    views: [{ showGridLines: true }]
  });

  wsOrg.columns = [
    { width: 5 },
    { width: 30 },
    { width: 45 },
    { width: 30 },
    { width: 45 }
  ];

  wsOrg.mergeCells('B2:E2');
  const orgTitle = wsOrg.getCell('B2');
  orgTitle.value = 'INFORMACIÓN GENERAL DE LA ORGANIZACIÓN Y DEL SG-SST';
  orgTitle.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  orgTitle.fill = darkHeaderFill;
  orgTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  wsOrg.getRow(2).height = 26;

  const orgFields = [
    ['Razón Social / Empresa', orgData.empresa, 'NIT', orgData.nit],
    ['Actividad Económica Principal', orgData.actividadEconomica, 'Código CIIU', orgData.ciiu || 'N/A'],
    ['Clase de Riesgo Principal', `Clase ${orgData.claseRiesgo}`, 'Administradora de Riesgos (ARL)', orgData.arl || 'SURA'],
    ['Sede Principal / Dirección', orgData.centroPrincipal || orgData.direccion, 'Ciudad / Departamento', `${orgData.ciudad || ''} - ${orgData.departamento || ''}`],
    ['Total Trabajadores Directos', orgData.numTrabajadores || records.reduce((s, r) => s + (r.expuestosDirectos || 0), 0), 'Total Contratistas / Terceros', orgData.numContratistas || records.reduce((s, r) => s + (r.expuestosContratistas || 0), 0)],
    ['Metodología Aplicada', orgData.metodologia || 'GTC 45:2012', 'Alcance Metodología', orgData.alcanceMetodologia || 'Todos los procesos y sedes'],
    ['Responsable SG-SST', orgData.elaboradoPor, 'Licencia SST del Responsable', orgData.licenciaSST || 'Vigente'],
    ['Fecha de Elaboración', orgData.fechaElaboracion, 'Fecha Última Revisión', orgData.fechaActualizacion],
    ['Versión Matriz IPVR', orgData.versionMatriz, 'Motivo Actualización', orgData.motivoActualizacion || 'Actualización anual reglamentaria']
  ];

  orgFields.forEach((row, i) => {
    const rowIdx = 4 + i;
    const [l1, v1, l2, v2] = row;

    wsOrg.getCell(`B${rowIdx}`).value = l1;
    wsOrg.getCell(`B${rowIdx}`).font = { name: 'Calibri', bold: true, size: 9.5 };
    wsOrg.getCell(`B${rowIdx}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    wsOrg.getCell(`B${rowIdx}`).border = thinBorder;

    wsOrg.getCell(`C${rowIdx}`).value = String(v1 ?? '');
    wsOrg.getCell(`C${rowIdx}`).font = { name: 'Calibri', size: 9.5 };
    wsOrg.getCell(`C${rowIdx}`).border = thinBorder;

    wsOrg.getCell(`D${rowIdx}`).value = l2;
    wsOrg.getCell(`D${rowIdx}`).font = { name: 'Calibri', bold: true, size: 9.5 };
    wsOrg.getCell(`D${rowIdx}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    wsOrg.getCell(`D${rowIdx}`).border = thinBorder;

    wsOrg.getCell(`E${rowIdx}`).value = String(v2 ?? '');
    wsOrg.getCell(`E${rowIdx}`).font = { name: 'Calibri', size: 9.5 };
    wsOrg.getCell(`E${rowIdx}`).border = thinBorder;
  });

  // =========================================================================
  // HOJA 3: 02_Matriz_IPVR_GTC45 (HOJA OBJETIVO PRINCIPAL)
  // =========================================================================
  const wsMatriz = workbook.addWorksheet('02_Matriz_IPVR_GTC45', {
    properties: { tabColor: { argb: 'FF059669' } },
    views: [{ state: 'frozen', xSplit: 4, ySplit: 5, showGridLines: true }]
  });

  // Definición de Anchos de Columna para Matriz GTC 45
  wsMatriz.columns = [
    { width: 14 }, // A: ID
    { width: 15 }, // B: Cód Interno
    { width: 22 }, // C: Proceso
    { width: 18 }, // D: Tipo Proceso
    { width: 25 }, // E: Área / Lugar
    { width: 28 }, // F: Actividad
    { width: 32 }, // G: Tarea
    { width: 12 }, // H: Rutinaria
    { width: 24 }, // I: Cargo Expuesto
    { width: 10 }, // J: Exp. Dir
    { width: 10 }, // K: Exp. Cont
    { width: 10 }, // L: Exp. Tot
    { width: 24 }, // M: Naturaleza Peligro
    { width: 28 }, // N: Clasificación Peligro
    { width: 35 }, // O: Fuente Generadora
    { width: 40 }, // P: Descripción Peligro
    { width: 35 }, // Q: Efectos Posibles
    { width: 30 }, // R: Controles Fuente
    { width: 30 }, // S: Controles Medio
    { width: 35 }, // T: Controles Individuo
    { width: 8 },  // U: ND
    { width: 8 },  // V: NE
    { width: 8 },  // W: NP
    { width: 16 }, // X: Interp NP
    { width: 8 },  // Y: NC
    { width: 10 }, // Z: NR
    { width: 10 }, // AA: Nivel Riesgo
    { width: 26 }, // AB: Aceptabilidad
    { width: 35 }, // AC: Significado NR
    { width: 10 }, // AD: Criterio Exp
    { width: 32 }, // AE: Peor Consecuencia
    { width: 14 }, // AF: Req Legal (S/N)
    { width: 35 }, // AG: Requisito Legal
    { width: 30 }, // AH: Medida Eliminación
    { width: 30 }, // AI: Medida Sustitución
    { width: 35 }, // AJ: Control Ingeniería
    { width: 35 }, // AK: Control Administrativo
    { width: 35 }, // AL: Equipos / EPP
    { width: 14 }, // AM: Fecha Revisión
    { width: 25 }  // AN: Responsable
  ];

  // Banner Header
  wsMatriz.mergeCells('A1:AN1');
  const mH1 = wsMatriz.getCell('A1');
  mH1.value = `${(orgData.empresa || 'EMPRESA PRINCIPAL').toUpperCase()} - MATRIZ DE IDENTIFICACIÓN DE PELIGROS, EVALUACIÓN Y VALORACIÓN DE RIESGOS (GTC 45:2012)`;
  mH1.font = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  mH1.fill = darkHeaderFill;
  mH1.alignment = { horizontal: 'center', vertical: 'middle' };
  wsMatriz.getRow(1).height = 26;

  wsMatriz.mergeCells('A2:AN2');
  const mH2 = wsMatriz.getCell('A2');
  mH2.value = `NIT: ${orgData.nit || 'S/N'} | Clase Riesgo: ${orgData.claseRiesgo || 'I'} | Versión: ${orgData.versionMatriz || '3.1'} | Fecha Actualización: ${orgData.fechaActualizacion || new Date().toISOString().split('T')[0]}`;
  mH2.font = { name: 'Calibri', size: 9.5, bold: false, color: { argb: 'FFFFFFFF' } };
  mH2.fill = subHeaderFill;
  mH2.alignment = { horizontal: 'center', vertical: 'middle' };
  wsMatriz.getRow(2).height = 18;

  // Header Hierarchy Grouping (Row 4)
  const groupHeaders = [
    { range: 'A4:L4', text: '1. CONTEXTO OPERACIONAL Y POBLACIÓN EXPUESTA', fill: 'FF1E293B' },
    { range: 'M4:Q4', text: '2. IDENTIFICACIÓN DEL PELIGRO', fill: 'FF0F766E' },
    { range: 'R4:T4', text: '3. CONTROLES EXISTENTES', fill: 'FF0369A1' },
    { range: 'U4:AC4', text: '4. EVALUACIÓN Y VALORACIÓN DEL RIESGO (GTC 45)', fill: 'FF991B1B' },
    { range: 'AD4:AG4', text: '5. CRITERIOS PARA CONTROLES', fill: 'FF9A3412' },
    { range: 'AH4:AL4', text: '6. MEDIDAS DE INTERVENCIÓN (JERARQUÍA)', fill: 'FF065F46' },
    { range: 'AM4:AN4', text: '7. CONTROL DE CAMBIOS', fill: 'FF334155' }
  ];

  groupHeaders.forEach(gh => {
    wsMatriz.mergeCells(gh.range);
    const c = wsMatriz.getCell(gh.range.split(':')[0]);
    c.value = gh.text;
    c.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: gh.fill } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  wsMatriz.getRow(4).height = 20;

  // Specific Columns (Row 5)
  const colHeaders = [
    'ID Peligro', 'Cód. Interno', 'Proceso', 'Tipo Proceso', 'Área / Sede',
    'Actividad', 'Tarea', 'Rutinaria', 'Cargo Expuesto', 'Exp. Dir',
    'Exp. Cont', 'Exp. Tot', 'Naturaleza Peligro', 'Clasificación GTC 45',
    'Fuente Generadora', 'Descripción Peligro', 'Efectos Posibles',
    'Controles Fuente', 'Controles Medio', 'Controles Individuo',
    'ND', 'NE', 'NP', 'Interp. NP', 'NC', 'NR', 'Nivel', 'Aceptabilidad',
    'Significado NR', 'N° Exp', 'Peor Consecuencia', 'Req. Legal',
    'Requisito Legal Específico', 'Eliminación', 'Sustitución',
    'Control Ingeniería', 'Control Administrativo', 'Equipos / EPP',
    'Fecha Revisión', 'Responsable'
  ];

  const headerRow = wsMatriz.getRow(5);
  headerRow.height = 28;
  colHeaders.forEach((ch, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = ch;
    cell.font = { name: 'Calibri', size: 8.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = thinBorder;
  });

  // Inject Dynamic Rows into Matrix (Rows 6+)
  records.forEach((r, idx) => {
    const rNum = 6 + idx;
    const row = wsMatriz.getRow(rNum);
    row.height = 36;

    const rowData = [
      r.id,
      r.codigoInterno || '',
      r.proceso,
      r.tipoProceso,
      r.area,
      r.actividad,
      r.tarea,
      r.rutinaria,
      r.cargoExpuesto,
      r.expuestosDirectos,
      r.expuestosContratistas,
      r.expuestosTotal,
      r.naturalezaPeligro,
      r.clasificacionPeligro,
      r.fuenteGeneradora,
      r.descripcionPeligro,
      r.efectosPosibles,
      r.controlesExistentes.fuente || 'Ninguno',
      r.controlesExistentes.medio || 'Ninguno',
      r.controlesExistentes.individuo || 'Ninguno',
      r.valoracion.nd,
      r.valoracion.ne,
      r.valoracion.np,
      r.valoracion.interpretacionNP,
      r.valoracion.nc,
      r.valoracion.nr,
      r.valoracion.nivelRiesgo,
      r.valoracion.aceptabilidad,
      r.valoracion.significadoNR,
      r.criterios.numExpuestos,
      r.criterios.peorConsecuencia,
      r.criterios.tieneRequisitoLegal ? 'SÍ' : 'NO',
      r.criterios.requisitoLegalEspecifico || '',
      r.medidas.eliminacion || 'No viable',
      r.medidas.sustitucion || 'No aplica',
      r.medidas.controlIngenieria || 'No aplica',
      r.medidas.controlAdministrativo || 'No aplica',
      r.medidas.epp || 'No aplica',
      r.fechaRevision || '',
      r.responsableRevision || ''
    ];

    rowData.forEach((val, cIdx) => {
      const cell = row.getCell(cIdx + 1);
      cell.value = val;
      cell.font = { name: 'Calibri', size: 8.5 };
      cell.alignment = { vertical: 'middle', wrapText: true };
      cell.border = thinBorder;

      // Centered columns
      if ([1, 2, 4, 8, 10, 11, 12, 21, 22, 23, 24, 25, 26, 27, 30, 32, 39].includes(cIdx + 1)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      }

      // Color coding for Nivel de Riesgo (Column 27 = AA)
      if (cIdx + 1 === 27) {
        cell.font = { name: 'Calibri', size: 9, bold: true };
        if (val === 'I') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } }; // red-100
          cell.font = { color: { argb: 'FF991B1B' }, bold: true };
        } else if (val === 'II') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } }; // amber-100
          cell.font = { color: { argb: 'FF92400E' }, bold: true };
        } else if (val === 'III') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEFCE8' } }; // yellow-100
          cell.font = { color: { argb: 'FF854D0E' }, bold: true };
        } else if (val === 'IV') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } }; // emerald-100
          cell.font = { color: { argb: 'FF065F46' }, bold: true };
        }
      }
    });
  });

  // =========================================================================
  // HOJA 4: 03_Planes_de_Accion_PEC
  // =========================================================================
  const wsAcciones = workbook.addWorksheet('03_Planes_de_Accion_PEC', {
    properties: { tabColor: { argb: 'FFD97706' } },
    views: [{ showGridLines: true }]
  });

  wsAcciones.columns = [
    { width: 14 }, // A: ID Acción
    { width: 14 }, // B: ID Peligro
    { width: 28 }, // C: Peligro Resumen
    { width: 22 }, // D: Jerarquía
    { width: 45 }, // E: Descripción Acción
    { width: 26 }, // F: Responsable
    { width: 22 }, // G: Cargo
    { width: 14 }, // H: Fecha Límite
    { width: 14 }, // I: Fecha Cierre
    { width: 16 }, // J: Estado
    { width: 25 }, // K: Recursos
    { width: 18 }, // L: Eficacia
    { width: 35 }  // M: Observaciones
  ];

  wsAcciones.mergeCells('A1:M1');
  const aH1 = wsAcciones.getCell('A1');
  aH1.value = 'PLAN DE ACCIÓN Y SEGUIMIENTO A MEDIDAS DE INTERVENCIÓN (SG-SST / PEC)';
  aH1.font = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  aH1.fill = darkHeaderFill;
  aH1.alignment = { horizontal: 'center', vertical: 'middle' };
  wsAcciones.getRow(1).height = 26;

  const actHeaders = [
    'ID Acción', 'ID Peligro IPVR', 'Peligro / Riesgo Asociado', 'Jerarquía de Control',
    'Descripción de la Medida a Implementar', 'Responsable de Ejecución', 'Cargo Responsable',
    'Fecha Límite', 'Fecha Cierre', 'Estado Actual', 'Recursos Asignados', 'Eficacia Evaluada',
    'Observaciones / Evidencias'
  ];

  const actHeaderRow = wsAcciones.getRow(3);
  actHeaderRow.height = 24;
  actHeaders.forEach((ch, idx) => {
    const cell = actHeaderRow.getCell(idx + 1);
    cell.value = ch;
    cell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = thinBorder;
  });

  actions.forEach((act, idx) => {
    const rNum = 4 + idx;
    const row = wsAcciones.getRow(rNum);
    row.height = 30;

    const rowData = [
      act.id,
      act.ipvrId,
      act.peligroResumen,
      act.jerarquia,
      act.descripcionAccion,
      act.responsable,
      act.cargoResponsable || '',
      act.fechaLimite,
      act.fechaCierre || 'Pendiente',
      act.estado,
      act.recursosNecesarios || 'Presupuesto SST',
      act.eficacia,
      act.observaciones || ''
    ];

    rowData.forEach((val, cIdx) => {
      const cell = row.getCell(cIdx + 1);
      cell.value = val;
      cell.font = { name: 'Calibri', size: 8.5 };
      cell.alignment = { vertical: 'middle', wrapText: true };
      cell.border = thinBorder;

      if ([1, 2, 4, 8, 9, 10, 12].includes(cIdx + 1)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      }
    });
  });

  // =========================================================================
  // HOJA 5: 04_Catalogos_GTC45 (TABLAS NORMATIVAS)
  // =========================================================================
  const wsCat = workbook.addWorksheet('04_Catalogos_GTC45', {
    properties: { tabColor: { argb: 'FF64748B' } },
    views: [{ showGridLines: true }]
  });

  wsCat.columns = [
    { width: 5 },
    { width: 12 },
    { width: 25 },
    { width: 65 }
  ];

  wsCat.mergeCells('B2:D2');
  const catTitle = wsCat.getCell('B2');
  catTitle.value = 'CATÁLOGOS Y TABLAS DE CRITERIOS GTC 45:2012';
  catTitle.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  catTitle.fill = darkHeaderFill;
  catTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  wsCat.getRow(2).height = 26;

  // Deficiencia
  wsCat.mergeCells('B4:D4');
  const defTitle = wsCat.getCell('B4');
  defTitle.value = 'TABLA 1. DETERMINACIÓN DEL NIVEL DE DEFICIENCIA (ND)';
  defTitle.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  defTitle.fill = emeraldHeaderFill;

  let crIdx = 5;
  ND_OPTIONS.forEach(nd => {
    wsCat.getCell(`B${crIdx}`).value = nd.valor;
    wsCat.getCell(`B${crIdx}`).alignment = { horizontal: 'center' };
    wsCat.getCell(`B${crIdx}`).font = { bold: true };
    wsCat.getCell(`B${crIdx}`).border = thinBorder;

    wsCat.getCell(`C${crIdx}`).value = nd.nombre;
    wsCat.getCell(`C${crIdx}`).font = { bold: true };
    wsCat.getCell(`C${crIdx}`).border = thinBorder;

    wsCat.getCell(`D${crIdx}`).value = nd.descripcion;
    wsCat.getCell(`D${crIdx}`).font = { size: 9 };
    wsCat.getCell(`D${crIdx}`).border = thinBorder;
    crIdx++;
  });

  // Exposición
  crIdx += 1;
  wsCat.mergeCells(`B${crIdx}:D${crIdx}`);
  const neTitle = wsCat.getCell(`B${crIdx}`);
  neTitle.value = 'TABLA 2. DETERMINACIÓN DEL NIVEL DE EXPOSICIÓN (NE)';
  neTitle.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  neTitle.fill = emeraldHeaderFill;
  crIdx++;

  NE_OPTIONS.forEach(ne => {
    wsCat.getCell(`B${crIdx}`).value = ne.valor;
    wsCat.getCell(`B${crIdx}`).alignment = { horizontal: 'center' };
    wsCat.getCell(`B${crIdx}`).font = { bold: true };
    wsCat.getCell(`B${crIdx}`).border = thinBorder;

    wsCat.getCell(`C${crIdx}`).value = ne.nombre;
    wsCat.getCell(`C${crIdx}`).font = { bold: true };
    wsCat.getCell(`C${crIdx}`).border = thinBorder;

    wsCat.getCell(`D${crIdx}`).value = ne.descripcion;
    wsCat.getCell(`D${crIdx}`).font = { size: 9 };
    wsCat.getCell(`D${crIdx}`).border = thinBorder;
    crIdx++;
  });

  // Consecuencia
  crIdx += 1;
  wsCat.mergeCells(`B${crIdx}:D${crIdx}`);
  const ncTitle = wsCat.getCell(`B${crIdx}`);
  ncTitle.value = 'TABLA 3. DETERMINACIÓN DEL NIVEL DE CONSECUENCIA (NC)';
  ncTitle.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  ncTitle.fill = emeraldHeaderFill;
  crIdx++;

  NC_OPTIONS.forEach(nc => {
    wsCat.getCell(`B${crIdx}`).value = nc.valor;
    wsCat.getCell(`B${crIdx}`).alignment = { horizontal: 'center' };
    wsCat.getCell(`B${crIdx}`).font = { bold: true };
    wsCat.getCell(`B${crIdx}`).border = thinBorder;

    wsCat.getCell(`C${crIdx}`).value = nc.nombre;
    wsCat.getCell(`C${crIdx}`).font = { bold: true };
    wsCat.getCell(`C${crIdx}`).border = thinBorder;

    wsCat.getCell(`D${crIdx}`).value = nc.descripcion;
    wsCat.getCell(`D${crIdx}`).font = { size: 9 };
    wsCat.getCell(`D${crIdx}`).border = thinBorder;
    crIdx++;
  });

  // =========================================================================
  // HOJA 6: 05_Dashboard_Resumen (DASHBOARD COMPLETO & MATRIZ DE CALOR GTC 45)
  // =========================================================================
  const wsDash = workbook.addWorksheet('05_Dashboard_Resumen', {
    properties: { tabColor: { argb: 'FF8B5CF6' } },
    views: [{ showGridLines: true }]
  });

  wsDash.columns = [
    { width: 4 },
    { width: 32 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 30 }
  ];

  // 1. Main Title
  wsDash.mergeCells('B2:G2');
  const dTitle = wsDash.getCell('B2');
  dTitle.value = 'TABLERO DE CONTROL EJECUTIVO · CONSOLIDADO DE CRITICIDAD Y MATRIZ DE CALOR GTC 45';
  dTitle.font = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  dTitle.fill = darkHeaderFill;
  dTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  wsDash.getRow(2).height = 26;

  // Subtitle
  wsDash.mergeCells('B3:G3');
  const dSub = wsDash.getCell('B3');
  dSub.value = `${orgData.empresa || 'EMPRESA'} · NIT: ${orgData.nit || 'S/N'} · Responsable: ${orgData.elaboradoPor || 'SST'} · Fecha: ${orgData.fechaActualizacion || new Date().toISOString().split('T')[0]}`;
  dSub.font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FF475569' } };
  dSub.alignment = { horizontal: 'center', vertical: 'middle' };
  wsDash.getRow(3).height = 18;

  // 2. KPI Summary Cards (Row 5 - 6)
  const totalRecs = records.length || 1;
  const counts = {
    I: records.filter(r => r.valoracion.nivelRiesgo === 'I').length,
    II: records.filter(r => r.valoracion.nivelRiesgo === 'II').length,
    III: records.filter(r => r.valoracion.nivelRiesgo === 'III').length,
    IV: records.filter(r => r.valoracion.nivelRiesgo === 'IV').length
  };
  const totAcc = actions.length;
  const accCerr = actions.filter(a => a.estado === 'Cerrada').length;
  const pctCump = totAcc > 0 ? (accCerr / totAcc) : 0;

  const kpiDefs = [
    { col: 'B', label: 'TOTAL PELIGROS', val: records.length, sub: '100% Identificados', bg: 'FFF1F5F9', tc: 'FF0F172A' },
    { col: 'C', label: 'NIVEL I (CRÍTICO)', val: counts.I, sub: 'No Aceptable (Urgente)', bg: 'FFFEE2E2', tc: 'FF991B1B' },
    { col: 'D', label: 'NIVEL II (ALTO)', val: counts.II, sub: 'Control Específico', bg: 'FFFEF3C7', tc: 'FF92400E' },
    { col: 'E', label: 'ACCIONES ABIERTAS', val: actions.filter(a => a.estado !== 'Cerrada').length, sub: `${accCerr} cerradas`, bg: 'FFDBEAFE', tc: 'FF1E40AF' },
    { col: 'F', label: 'CUMPLIMIENTO PEC', val: `${Math.round(pctCump * 100)}%`, sub: `${totAcc} acciones reg.`, bg: 'FFD1FAE5', tc: 'FF065F46' }
  ];

  kpiDefs.forEach(k => {
    const cHead = wsDash.getCell(`${k.col}5`);
    cHead.value = k.label;
    cHead.font = { name: 'Calibri', size: 8, bold: true, color: { argb: k.tc } };
    cHead.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: k.bg } };
    cHead.alignment = { horizontal: 'center', vertical: 'middle' };
    cHead.border = thinBorder;

    const cVal = wsDash.getCell(`${k.col}6`);
    cVal.value = k.val;
    cVal.font = { name: 'Calibri', size: 15, bold: true, color: { argb: k.tc } };
    cVal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: k.bg } };
    cVal.alignment = { horizontal: 'center', vertical: 'middle' };
    cVal.border = thinBorder;
  });
  wsDash.getRow(5).height = 18;
  wsDash.getRow(6).height = 24;

  // 3. Section: Distribución por Nivel de Riesgo (NR) (Rows 8 - 14)
  wsDash.mergeCells('B8:E8');
  const dSec1 = wsDash.getCell('B8');
  dSec1.value = '1. DISTRIBUCIÓN POR NIVEL DE RIESGO (NR) - GTC 45';
  dSec1.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  dSec1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  dSec1.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  wsDash.getRow(8).height = 20;

  const dashHeader = wsDash.getRow(9);
  dashHeader.height = 20;
  ['Nivel de Riesgo (NR)', 'Cantidad Peligros', '% Participación', 'Aceptabilidad / Interpretación'].forEach((h, i) => {
    const c = dashHeader.getCell(i + 2);
    c.value = h;
    c.font = { name: 'Calibri', bold: true, size: 9, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.border = thinBorder;
  });

  const dashRows = [
    ['Nivel I · No Aceptable (4000 - 600)', counts.I, counts.I / totalRecs, 'No Aceptable (Situación Crítica)', 'FFFEE2E2', 'FF991B1B'],
    ['Nivel II · No Aceptable / Control Esp. (500 - 150)', counts.II, counts.II / totalRecs, 'No Aceptable o Aceptable con Control Específico', 'FFFEF3C7', 'FF92400E'],
    ['Nivel III · Mejorable (120 - 40)', counts.III, counts.III / totalRecs, 'Mejorable', 'FFFEFCE8', 'FF854D0E'],
    ['Nivel IV · Aceptable (20)', counts.IV, counts.IV / totalRecs, 'Aceptable', 'FFD1FAE5', 'FF065F46']
  ];

  dashRows.forEach((dr, i) => {
    const rIdx = 10 + i;
    const row = wsDash.getRow(rIdx);
    row.height = 19;

    row.getCell(2).value = dr[0];
    row.getCell(2).font = { name: 'Calibri', bold: true, size: 9, color: { argb: dr[5] as string } };
    row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: dr[4] as string } };
    row.getCell(2).border = thinBorder;

    row.getCell(3).value = dr[1];
    row.getCell(3).alignment = { horizontal: 'center' };
    row.getCell(3).font = { bold: true, size: 9.5 };
    row.getCell(3).border = thinBorder;

    row.getCell(4).value = dr[2];
    row.getCell(4).numFmt = '0.0%';
    row.getCell(4).alignment = { horizontal: 'center' };
    row.getCell(4).font = { bold: true, size: 9.5 };
    row.getCell(4).border = thinBorder;

    row.getCell(5).value = dr[3];
    row.getCell(5).font = { size: 8.5 };
    row.getCell(5).border = thinBorder;
  });

  // Total Row
  const totRow = wsDash.getRow(14);
  totRow.height = 20;
  totRow.getCell(2).value = 'TOTAL PELIGROS IDENTIFICADOS';
  totRow.getCell(2).font = { name: 'Calibri', bold: true, size: 9.5 };
  totRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
  totRow.getCell(2).border = thinBorder;

  totRow.getCell(3).value = records.length;
  totRow.getCell(3).font = { name: 'Calibri', bold: true, size: 10 };
  totRow.getCell(3).alignment = { horizontal: 'center' };
  totRow.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
  totRow.getCell(3).border = thinBorder;

  totRow.getCell(4).value = 1.0;
  totRow.getCell(4).numFmt = '100.0%';
  totRow.getCell(4).font = { name: 'Calibri', bold: true, size: 10 };
  totRow.getCell(4).alignment = { horizontal: 'center' };
  totRow.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
  totRow.getCell(4).border = thinBorder;

  totRow.getCell(5).value = '100% de peligros valorados y evaluados';
  totRow.getCell(5).font = { italic: true, size: 8.5 };
  totRow.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
  totRow.getCell(5).border = thinBorder;

  // 4. Section: Matriz de Calor GTC 45 (Probabilidad x Consecuencia) (Rows 16 - 23)
  wsDash.mergeCells('B16:F16');
  const dSec2 = wsDash.getCell('B16');
  dSec2.value = '2. MATRIZ DE CALOR GTC 45 (PROBABILIDAD × CONSECUENCIA · EVALUACIÓN CRUZADA)';
  dSec2.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  dSec2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  dSec2.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  wsDash.getRow(16).height = 20;

  // Heat map header
  const hmH = wsDash.getRow(17);
  hmH.height = 22;
  const hmCols = ['Nivel de Consecuencia (NC) ↓ \\ Probabilidad (NP) →', 'Muy Alto (40 - 24)', 'Alto (20 - 10)', 'Medio (8 - 6)', 'Bajo (4 - 2)'];
  hmCols.forEach((col, i) => {
    const c = hmH.getCell(i + 2);
    c.value = col;
    c.font = { name: 'Calibri', bold: true, size: 8.5, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF475569' } };
    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    c.border = thinBorder;
  });

  // Heat map calculations
  const hmCounts = {
    // NC = 100
    nc100_ma: records.filter(r => r.valoracion?.nc === 100 && (r.valoracion?.np || 0) >= 24).length,
    nc100_a: records.filter(r => r.valoracion?.nc === 100 && (r.valoracion?.np || 0) >= 10 && (r.valoracion?.np || 0) < 24).length,
    nc100_m: records.filter(r => r.valoracion?.nc === 100 && (r.valoracion?.np || 0) >= 6 && (r.valoracion?.np || 0) < 10).length,
    nc100_b: records.filter(r => r.valoracion?.nc === 100 && (r.valoracion?.np || 0) <= 4).length,

    // NC = 60
    nc60_ma: records.filter(r => r.valoracion?.nc === 60 && (r.valoracion?.np || 0) >= 24).length,
    nc60_a: records.filter(r => r.valoracion?.nc === 60 && (r.valoracion?.np || 0) >= 10 && (r.valoracion?.np || 0) < 24).length,
    nc60_m: records.filter(r => r.valoracion?.nc === 60 && (r.valoracion?.np || 0) >= 6 && (r.valoracion?.np || 0) < 10).length,
    nc60_b: records.filter(r => r.valoracion?.nc === 60 && (r.valoracion?.np || 0) <= 4).length,

    // NC = 25
    nc25_ma: records.filter(r => r.valoracion?.nc === 25 && (r.valoracion?.np || 0) >= 24).length,
    nc25_a: records.filter(r => r.valoracion?.nc === 25 && (r.valoracion?.np || 0) >= 10 && (r.valoracion?.np || 0) < 24).length,
    nc25_m: records.filter(r => r.valoracion?.nc === 25 && (r.valoracion?.np || 0) >= 6 && (r.valoracion?.np || 0) < 10).length,
    nc25_b: records.filter(r => r.valoracion?.nc === 25 && (r.valoracion?.np || 0) <= 4).length,

    // NC = 10
    nc10_ma: records.filter(r => r.valoracion?.nc === 10 && (r.valoracion?.np || 0) >= 24).length,
    nc10_a: records.filter(r => r.valoracion?.nc === 10 && (r.valoracion?.np || 0) >= 10 && (r.valoracion?.np || 0) < 24).length,
    nc10_m: records.filter(r => r.valoracion?.nc === 10 && (r.valoracion?.np || 0) >= 6 && (r.valoracion?.np || 0) < 10).length,
    nc10_b: records.filter(r => r.valoracion?.nc === 10 && (r.valoracion?.np || 0) <= 4).length
  };

  const redFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC2626' } };
  const orangeFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEA580C' } };
  const blueFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
  const greenFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } };

  const hmGrid = [
    {
      rowTitle: 'Mortal o Catastrófico (100)',
      cells: [
        { text: `I (4000-2400)\n[ ${hmCounts.nc100_ma} peligros ]`, fill: redFill },
        { text: `I (2000-1000)\n[ ${hmCounts.nc100_a} peligros ]`, fill: redFill },
        { text: `I (800-600)\n[ ${hmCounts.nc100_m} peligros ]`, fill: redFill },
        { text: `II (400-200)\n[ ${hmCounts.nc100_b} peligros ]`, fill: orangeFill }
      ]
    },
    {
      rowTitle: 'Muy Grave (60)',
      cells: [
        { text: `I (2400-1440)\n[ ${hmCounts.nc60_ma} peligros ]`, fill: redFill },
        { text: `I (1200-600)\n[ ${hmCounts.nc60_a} peligros ]`, fill: redFill },
        { text: `II (480-360)\n[ ${hmCounts.nc60_m} peligros ]`, fill: orangeFill },
        { text: `II (240-120)\n[ ${hmCounts.nc60_b} peligros ]`, fill: orangeFill }
      ]
    },
    {
      rowTitle: 'Grave (25)',
      cells: [
        { text: `I (1000-600)\n[ ${hmCounts.nc25_ma} peligros ]`, fill: redFill },
        { text: `II (500-250)\n[ ${hmCounts.nc25_a} peligros ]`, fill: orangeFill },
        { text: `II (200-150)\n[ ${hmCounts.nc25_m} peligros ]`, fill: orangeFill },
        { text: `III (100-50)\n[ ${hmCounts.nc25_b} peligros ]`, fill: blueFill }
      ]
    },
    {
      rowTitle: 'Leve (10)',
      cells: [
        { text: `II (400-240)\n[ ${hmCounts.nc10_ma} peligros ]`, fill: orangeFill },
        { text: `III (200-100)\n[ ${hmCounts.nc10_a} peligros ]`, fill: blueFill },
        { text: `III (80-60)\n[ ${hmCounts.nc10_m} peligros ]`, fill: blueFill },
        { text: `IV (40-20)\n[ ${hmCounts.nc10_b} peligros ]`, fill: greenFill }
      ]
    }
  ];

  hmGrid.forEach((rowDef, rI) => {
    const row = wsDash.getRow(18 + rI);
    row.height = 32;

    const rowHeaderCell = row.getCell(2);
    rowHeaderCell.value = rowDef.rowTitle;
    rowHeaderCell.font = { name: 'Calibri', bold: true, size: 9 };
    rowHeaderCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    rowHeaderCell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    rowHeaderCell.border = thinBorder;

    rowDef.cells.forEach((cellDef, cI) => {
      const c = row.getCell(cI + 3);
      c.value = cellDef.text;
      c.font = { name: 'Calibri', bold: true, size: 8.5, color: { argb: 'FFFFFFFF' } };
      c.fill = cellDef.fill as any;
      c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      c.border = thinBorder;
    });
  });

  // 5. Section: Clasificación por Naturaleza del Peligro (Rows 24 - 32)
  wsDash.mergeCells('B24:D24');
  const dSec3 = wsDash.getCell('B24');
  dSec3.value = '3. CLASIFICACIÓN DE PELIGROS IDENTIFICADOS';
  dSec3.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  dSec3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  dSec3.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  wsDash.getRow(24).height = 20;

  const natHeader = wsDash.getRow(25);
  natHeader.height = 20;
  ['Naturaleza del Peligro', 'Cantidad', '% Total'].forEach((h, i) => {
    const c = natHeader.getCell(i + 2);
    c.value = h;
    c.font = { name: 'Calibri', bold: true, size: 9, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.border = thinBorder;
  });

  const hazardsByNature = records.reduce((acc, r) => {
    const nat = r.naturalezaPeligro || 'Otro';
    acc[nat] = (acc[nat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let natRowIdx = 26;
  Object.entries(hazardsByNature).forEach(([nat, count]) => {
    const row = wsDash.getRow(natRowIdx);
    row.height = 18;

    row.getCell(2).value = nat;
    row.getCell(2).font = { name: 'Calibri', bold: true, size: 9 };
    row.getCell(2).border = thinBorder;

    row.getCell(3).value = count;
    row.getCell(3).alignment = { horizontal: 'center' };
    row.getCell(3).font = { size: 9 };
    row.getCell(3).border = thinBorder;

    row.getCell(4).value = totalRecs ? (count / totalRecs) : 0;
    row.getCell(4).numFmt = '0.0%';
    row.getCell(4).alignment = { horizontal: 'center' };
    row.getCell(4).font = { size: 9 };
    row.getCell(4).border = thinBorder;

    natRowIdx++;
  });

  return workbook;
}

/**
 * Injects dynamic matrix data, organization metadata, action plans, and change controls
 * into a user-provided custom Excel workbook template.
 * Automatically recognizes and populates:
 * 1. Control Documental / Organización
 * 2. Matriz IPVR GTC 45 (Calculations & AI texts)
 * 3. Planes de Acción (PEC)
 * 4. Control de Cambios / Historial
 * 5. Dashboard / Resumen de Criticidad
 */
export async function injectIntoCustomTemplate(
  templateBuffer: ArrayBuffer,
  orgData: OrganizacionData,
  records: RegistroIPVR[],
  actions: AccionSeguimiento[]
): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(templateBuffer);

  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
  };

  // -------------------------------------------------------------------------
  // 1. INYECTAR HOJA: 01 Control Documental / Organización
  // -------------------------------------------------------------------------
  const wsDoc = workbook.worksheets.find(ws => {
    const n = ws.name.toLowerCase();
    return n.includes('documental') || n.includes('organiz') || n.includes('empresa') || n.includes('portada') || n.includes('01');
  });

  if (wsDoc) {
    const orgValueMap: Record<string, string | number> = {
      'razón social': orgData.empresa || orgData.razonSocial || '',
      'empresa': orgData.empresa || '',
      'nit': orgData.nit || '',
      'código ciiu': orgData.ciiu || '',
      'ciiu': orgData.ciiu || '',
      'actividad económica': orgData.actividadEconomica || '',
      'arl': orgData.arl || '',
      'clase de riesgo': `Clase ${orgData.claseRiesgo || 'I'}`,
      'clase riesgo': `Clase ${orgData.claseRiesgo || 'I'}`,
      'nº trabajadores': orgData.numTrabajadores || records.reduce((s, r) => s + (r.expuestosDirectos || 0), 0) || 0,
      'n° trabajadores': orgData.numTrabajadores || records.reduce((s, r) => s + (r.expuestosDirectos || 0), 0) || 0,
      'número trabajadores': orgData.numTrabajadores || 0,
      'trabajadores': orgData.numTrabajadores || 0,
      'contratistas': orgData.numContratistas || 0,
      'centro de trabajo': orgData.centroPrincipal || orgData.centrosTrabajo?.join(', ') || 'Sede Principal',
      'centros de trabajo': orgData.centroPrincipal || orgData.centrosTrabajo?.join(', ') || 'Sede Principal',
      'dirección': orgData.direccion || 'Sede Principal',
      'ciudad / municipio': `${orgData.ciudad || ''}${orgData.departamento ? ' - ' + orgData.departamento : ''}`.trim() || 'Ciudad Principal',
      'ciudad': orgData.ciudad || '',
      'municipio': orgData.ciudad || '',
      'responsable sg-sst': `${orgData.elaboradoPor || 'Responsable SG-SST'}${orgData.licenciaSST ? ' (Lic. ' + orgData.licenciaSST + ')' : ''}`,
      'responsable sst': `${orgData.elaboradoPor || 'Responsable SG-SST'}${orgData.licenciaSST ? ' (Lic. ' + orgData.licenciaSST + ')' : ''}`,
      'elaborado por': orgData.elaboradoPor || 'Responsable SG-SST',
      'aprobado por': orgData.aprobadoPor || 'Representante Legal',
      'versión': orgData.versionMatriz || '3.2',
      'version': orgData.versionMatriz || '3.2',
      'fecha actualización': orgData.fechaActualizacion || new Date().toISOString().split('T')[0],
      'fecha actualizacion': orgData.fechaActualizacion || new Date().toISOString().split('T')[0],
      'fecha elaboración': orgData.fechaElaboracion || new Date().toISOString().split('T')[0],
      'próxima revisión': orgData.fechaProximaRevision || 'Anual reglamentaria (Decreto 1072/2015)',
      'proxima revision': orgData.fechaProximaRevision || 'Anual reglamentaria (Decreto 1072/2015)',
      'participación / niveles': orgData.alcanceMetodologia || 'COPASST, Vigía SST, Jefes de Área y Trabajadores Directos/Contratistas',
      'participacion / niveles': orgData.alcanceMetodologia || 'COPASST, Vigía SST, Jefes de Área y Trabajadores Directos/Contratistas',
      'motivo última actualización': orgData.motivoActualizacion || 'Actualización anual reglamentaria (Decreto 1072 Art. 2.2.4.6.15)',
      'motivo ultima actualizacion': orgData.motivoActualizacion || 'Actualización anual reglamentaria (Decreto 1072 Art. 2.2.4.6.15)',
      'evidencia participación / revisión': 'Actas de COPASST, inspecciones de seguridad en campo, reporte de actos y condiciones inseguras',
      'evidencia participacion / revision': 'Actas de COPASST, inspecciones de seguridad en campo, reporte de actos y condiciones inseguras'
    };

    // Scan each row and fill matching key in Column B or next adjacent column
    wsDoc.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip title row
      const cellA = row.getCell(1);
      const textA = String(cellA.value || '').trim().toLowerCase();

      if (textA) {
        // Find best match from dictionary
        for (const [key, val] of Object.entries(orgValueMap)) {
          if (textA === key || textA.includes(key) || key.includes(textA)) {
            const cellB = row.getCell(2);
            cellB.value = val;
            cellB.font = { name: 'Calibri', size: 10, color: { argb: 'FF0F172A' } };
            cellB.alignment = { vertical: 'middle' };
            break;
          }
        }
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. INYECTAR HOJA: 02 Matriz IPVR GTC 45 (Cálculos & Textos IA)
  // -------------------------------------------------------------------------
  let targetWs = workbook.worksheets.find(ws => {
    const n = ws.name.toLowerCase();
    return n.includes('matriz') || n.includes('ipvr') || n.includes('gtc') || n.includes('peligro') || n.includes('02');
  });

  if (!targetWs) {
    targetWs = workbook.worksheets[0];
  }

  // Identify header row (looking for ND, NE, NC, Peligro or Proceso)
  let headerRowIndex = 5;
  for (let r = 1; r <= 15; r++) {
    const row = targetWs.getRow(r);
    let foundKeywords = 0;
    row.eachCell(cell => {
      const text = String(cell.value || '').toLowerCase();
      if (text.includes('proceso') || text.includes('peligro') || text.includes('tarea') || text.includes('nd') || text.includes('riesgo')) {
        foundKeywords++;
      }
    });
    if (foundKeywords >= 2) {
      headerRowIndex = r;
      break;
    }
  }

  // Clear old data rows from target worksheet
  const lastRowNum = Math.max(targetWs.rowCount, headerRowIndex + 50);
  for (let r = headerRowIndex + 1; r <= lastRowNum + 20; r++) {
    const row = targetWs.getRow(r);
    row.eachCell({ includeEmpty: true }, cell => {
      cell.value = null;
    });
  }

  // Populate dynamic calculated IPVR records
  records.forEach((r, idx) => {
    const rNum = headerRowIndex + 1 + idx;
    const row = targetWs.getRow(rNum);
    row.height = 34;

    const rowData = [
      r.id,
      r.codigoInterno || '',
      r.proceso,
      r.tipoProceso,
      r.area,
      r.actividad,
      r.tarea,
      r.rutinaria,
      r.cargoExpuesto,
      r.expuestosDirectos,
      r.expuestosContratistas,
      r.expuestosTotal,
      r.naturalezaPeligro,
      r.clasificacionPeligro,
      r.fuenteGeneradora,
      r.descripcionPeligro,
      r.efectosPosibles,
      r.controlesExistentes.fuente || 'Ninguno',
      r.controlesExistentes.medio || 'Ninguno',
      r.controlesExistentes.individuo || 'Ninguno',
      r.valoracion.nd,
      r.valoracion.ne,
      r.valoracion.np,
      r.valoracion.interpretacionNP,
      r.valoracion.nc,
      r.valoracion.nr,
      r.valoracion.nivelRiesgo,
      r.valoracion.aceptabilidad,
      r.valoracion.significadoNR,
      r.criterios.numExpuestos,
      r.criterios.peorConsecuencia,
      r.criterios.tieneRequisitoLegal ? 'SÍ' : 'NO',
      r.criterios.requisitoLegalEspecifico || '',
      r.medidas.eliminacion || 'No viable',
      r.medidas.sustitucion || 'No aplica',
      r.medidas.controlIngenieria || 'No aplica',
      r.medidas.controlAdministrativo || 'No aplica',
      r.medidas.epp || 'No aplica',
      r.fechaRevision || '',
      r.responsableRevision || ''
    ];

    rowData.forEach((val, cIdx) => {
      const cell = row.getCell(cIdx + 1);
      cell.value = val;
      cell.font = { name: 'Calibri', size: 8.5 };
      cell.alignment = { vertical: 'middle', wrapText: true };
      cell.border = thinBorder;

      if ([1, 2, 4, 8, 10, 11, 12, 21, 22, 23, 24, 25, 26, 27, 30, 32, 39].includes(cIdx + 1)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      }

      if (cIdx + 1 === 27) {
        cell.font = { name: 'Calibri', size: 9, bold: true };
        if (val === 'I') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
          cell.font = { color: { argb: 'FF991B1B' }, bold: true };
        } else if (val === 'II') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
          cell.font = { color: { argb: 'FF92400E' }, bold: true };
        } else if (val === 'III') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEFCE8' } };
          cell.font = { color: { argb: 'FF854D0E' }, bold: true };
        } else if (val === 'IV') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
          cell.font = { color: { argb: 'FF065F46' }, bold: true };
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // 3. INYECTAR HOJA: 03 Plan de Acción / PEC
  // -------------------------------------------------------------------------
  const wsAcc = workbook.worksheets.find(ws => {
    const n = ws.name.toLowerCase();
    return n.includes('accion') || n.includes('acción') || n.includes('plan') || n.includes('pec') || n.includes('03');
  });

  if (wsAcc && actions && actions.length > 0) {
    let actHeaderRowIdx = 3;
    for (let r = 1; r <= 10; r++) {
      const row = wsAcc.getRow(r);
      let foundHeaders = 0;
      row.eachCell(c => {
        const text = String(c.value || '').toLowerCase();
        if (text.includes('id') || text.includes('peligro') || text.includes('medida') || text.includes('responsable') || text.includes('estado')) {
          foundHeaders++;
        }
      });
      if (foundHeaders >= 2) {
        actHeaderRowIdx = r;
        break;
      }
    }

    // Populate actions
    actions.forEach((act, idx) => {
      const rNum = actHeaderRowIdx + 1 + idx;
      const row = wsAcc.getRow(rNum);
      row.height = 28;

      const actData = [
        act.id,
        act.ipvrId,
        act.peligroResumen,
        act.jerarquia,
        act.descripcionAccion,
        act.responsable,
        act.cargoResponsable || '',
        act.fechaLimite,
        act.fechaCierre || 'Pendiente',
        act.estado,
        act.recursosNecesarios || 'Presupuesto SST',
        act.eficacia,
        act.observaciones || ''
      ];

      actData.forEach((val, cIdx) => {
        const cell = row.getCell(cIdx + 1);
        cell.value = val;
        cell.font = { name: 'Calibri', size: 8.5 };
        cell.alignment = { vertical: 'middle', wrapText: true };
        cell.border = thinBorder;

        if ([1, 2, 4, 8, 9, 10, 12].includes(cIdx + 1)) {
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. INYECTAR HOJA: 05 Control de Cambios / Historial
  // -------------------------------------------------------------------------
  const wsCambios = workbook.worksheets.find(ws => {
    const n = ws.name.toLowerCase();
    return n.includes('cambio') || n.includes('historial') || n.includes('version') || n.includes('05');
  });

  if (wsCambios) {
    let changeRowIdx = 4;
    for (let r = 1; r <= 8; r++) {
      const row = wsCambios.getRow(r);
      let foundHeaders = 0;
      row.eachCell(c => {
        const t = String(c.value || '').toLowerCase();
        if (t.includes('versi') || t.includes('fecha') || t.includes('descrip') || t.includes('responsable')) {
          foundHeaders++;
        }
      });
      if (foundHeaders >= 2) {
        changeRowIdx = r + 1;
        break;
      }
    }

    const row = wsCambios.getRow(changeRowIdx);
    row.getCell(1).value = orgData.versionMatriz || '3.2';
    row.getCell(2).value = orgData.fechaActualizacion || new Date().toISOString().split('T')[0];
    row.getCell(3).value = orgData.motivoActualizacion || 'Actualización periódica y valoración cuantitativa conforme a GTC 45:2012';
    row.getCell(4).value = orgData.elaboradoPor || 'Responsable SG-SST';
    row.getCell(5).value = orgData.aprobadoPor || 'Representante Legal / Gerencia';
  }

  return workbook;
}

/**
 * Main export function: clones/generates the workbook, injects matrix records,
 * and triggers direct browser download of the .xlsx file.
 */
export async function exportMatrixToTemplateExcel(
  orgData: OrganizacionData,
  records: RegistroIPVR[],
  actions: AccionSeguimiento[]
): Promise<void> {
  let workbook: ExcelJS.Workbook;

  const { base64: customTemplateB64 } = getCustomTemplateBase64();

  if (customTemplateB64) {
    try {
      // Decode Base64 to ArrayBuffer
      const binaryString = atob(customTemplateB64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      workbook = await injectIntoCustomTemplate(bytes.buffer, orgData, records, actions);
    } catch (err) {
      console.warn('Error reading custom template buffer, falling back to master institutional workbook:', err);
      workbook = await createMasterTemplateWorkbook(orgData, records, actions);
    }
  } else {
    // Generate institutional multi-sheet master template workbook
    workbook = await createMasterTemplateWorkbook(orgData, records, actions);
  }

  // Generate buffer in memory
  const buffer = await workbook.xlsx.writeBuffer();

  // Create Blob & trigger browser download
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const fileName = `Matriz_IPVR_GTC45_${(orgData.empresa || 'Empresa').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
