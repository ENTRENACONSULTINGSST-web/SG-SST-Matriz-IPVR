import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  OrganizacionData,
  RegistroIPVR,
  AccionSeguimiento,
  FrecuenciaExposicion,
  NaturalezaPeligro
} from '../types';
import { calcularNP, calcularNR } from '../data/gtc45Data';

/**
 * Generates an institutional PDF report for the IPVR Matrix (GTC 45)
 * including Executive Dashboard, GTC 45 Heat Map, Full Technical Matrix, and Action Plans.
 */
export function generateIpvrPDF(
  orgData: OrganizacionData,
  records: RegistroIPVR[],
  actions: AccionSeguimiento[]
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Color Palette
  const primaryColor = [15, 23, 42]; // slate-900
  const emeraldColor = [5, 150, 105]; // emerald-600

  // ==========================================
  // PAGE 1: RESUMEN EJECUTIVO & MATRIZ DE CALOR
  // ==========================================

  // 1. Institutional Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(
    (orgData.empresa || 'SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO').toUpperCase(),
    14,
    9
  );

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `INFORME EJECUTIVO DE IDENTIFICACIÓN DE PELIGROS, EVALUACIÓN Y VALORACIÓN DE RIESGOS · METODOLOGÍA GTC 45:2012`,
    14,
    15
  );

  doc.setFontSize(7.5);
  doc.text(
    `Versión: ${orgData.versionMatriz || '3.2'} | NIT: ${orgData.nit || 'S/N'} | Fecha: ${orgData.fechaActualizacion || new Date().toISOString().split('T')[0]} | Clase Riesgo: ${orgData.claseRiesgo || 'I'} | ARL: ${orgData.arl || 'SURA'}`,
    14,
    20
  );

  // 2. 5 KPI metrics summary table
  const nivelI = records.filter(r => r.valoracion?.nivelRiesgo === 'I').length;
  const nivelII = records.filter(r => r.valoracion?.nivelRiesgo === 'II').length;
  const nivelIII = records.filter(r => r.valoracion?.nivelRiesgo === 'III').length;
  const nivelIV = records.filter(r => r.valoracion?.nivelRiesgo === 'IV').length;
  const totAcc = actions.length;
  const accCerr = actions.filter(a => a.estado === 'Cerrada').length;
  const accAbier = actions.filter(a => a.estado !== 'Cerrada').length;
  const pctCump = totAcc > 0 ? Math.round((accCerr / totAcc) * 100) : 0;

  autoTable(doc, {
    startY: 27,
    margin: { left: 14, right: 14 },
    head: [[
      'TOTAL PELIGROS',
      'NIVEL I (CRÍTICO)',
      'NIVEL II (ALTO)',
      'ACCIONES ABIERTAS',
      'CUMPLIMIENTO PEC'
    ]],
    body: [[
      `${records.length}\n100% Identificados`,
      `${nivelI}\nNo Aceptable (Urgente)`,
      `${nivelII}\nControl Específico`,
      `${accAbier}\n${accCerr} cerradas`,
      `${pctCump}%\nEficacia PEC`
    ]],
    styles: {
      fontSize: 8,
      halign: 'center',
      valign: 'middle',
      cellPadding: 2,
      fontStyle: 'bold'
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 7.5
    },
    didParseCell: function(data) {
      if (data.section === 'body') {
        if (data.column.index === 0) {
          data.cell.styles.fillColor = [241, 245, 249];
          data.cell.styles.textColor = [15, 23, 42];
        } else if (data.column.index === 1) {
          data.cell.styles.fillColor = [254, 226, 226];
          data.cell.styles.textColor = [153, 27, 27];
        } else if (data.column.index === 2) {
          data.cell.styles.fillColor = [254, 243, 199];
          data.cell.styles.textColor = [146, 64, 14];
        } else if (data.column.index === 3) {
          data.cell.styles.fillColor = [219, 234, 254];
          data.cell.styles.textColor = [30, 64, 175];
        } else if (data.column.index === 4) {
          data.cell.styles.fillColor = [209, 250, 229];
          data.cell.styles.textColor = [6, 95, 70];
        }
      }
    }
  });

  // 3. Left side: Distribution Table & Hazards By Nature
  const totRecs = records.length || 1;
  const distTableHead = [['Nivel de Riesgo (NR)', 'Rango', 'Cant.', '%', 'Aceptabilidad']];
  const distTableBody = [
    ['Nivel I (Rojo)', '4000 - 600', `${nivelI}`, `${Math.round((nivelI / totRecs) * 100)}%`, 'No Aceptable'],
    ['Nivel II (Ámbar)', '500 - 150', `${nivelII}`, `${Math.round((nivelII / totRecs) * 100)}%`, 'Control Esp.'],
    ['Nivel III (Amarillo)', '120 - 40', `${nivelIII}`, `${Math.round((nivelIII / totRecs) * 100)}%`, 'Mejorable'],
    ['Nivel IV (Verde)', '20', `${nivelIV}`, `${Math.round((nivelIV / totRecs) * 100)}%`, 'Aceptable']
  ];

  autoTable(doc, {
    startY: 48,
    margin: { left: 14, right: pageWidth / 2 + 3 },
    head: distTableHead,
    body: distTableBody,
    styles: { fontSize: 7, cellPadding: 1.5, valign: 'middle' },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 32, fontStyle: 'bold' },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 16, halign: 'center' },
      4: { cellWidth: 'auto' }
    },
    didParseCell: function(data) {
      if (data.section === 'body') {
        if (data.row.index === 0) {
          data.cell.styles.fillColor = [254, 226, 226];
          data.cell.styles.textColor = [153, 27, 27];
        } else if (data.row.index === 1) {
          data.cell.styles.fillColor = [254, 243, 199];
          data.cell.styles.textColor = [146, 64, 14];
        } else if (data.row.index === 2) {
          data.cell.styles.fillColor = [254, 252, 232];
          data.cell.styles.textColor = [133, 77, 14];
        } else if (data.row.index === 3) {
          data.cell.styles.fillColor = [209, 250, 229];
          data.cell.styles.textColor = [6, 95, 70];
        }
      }
    }
  });

  // Heat map calculations
  const hmCounts = {
    nc100_ma: records.filter(r => r.valoracion?.nc === 100 && (r.valoracion?.np || 0) >= 24).length,
    nc100_a: records.filter(r => r.valoracion?.nc === 100 && (r.valoracion?.np || 0) >= 10 && (r.valoracion?.np || 0) < 24).length,
    nc100_m: records.filter(r => r.valoracion?.nc === 100 && (r.valoracion?.np || 0) >= 6 && (r.valoracion?.np || 0) < 10).length,
    nc100_b: records.filter(r => r.valoracion?.nc === 100 && (r.valoracion?.np || 0) <= 4).length,

    nc60_ma: records.filter(r => r.valoracion?.nc === 60 && (r.valoracion?.np || 0) >= 24).length,
    nc60_a: records.filter(r => r.valoracion?.nc === 60 && (r.valoracion?.np || 0) >= 10 && (r.valoracion?.np || 0) < 24).length,
    nc60_m: records.filter(r => r.valoracion?.nc === 60 && (r.valoracion?.np || 0) >= 6 && (r.valoracion?.np || 0) < 10).length,
    nc60_b: records.filter(r => r.valoracion?.nc === 60 && (r.valoracion?.np || 0) <= 4).length,

    nc25_ma: records.filter(r => r.valoracion?.nc === 25 && (r.valoracion?.np || 0) >= 24).length,
    nc25_a: records.filter(r => r.valoracion?.nc === 25 && (r.valoracion?.np || 0) >= 10 && (r.valoracion?.np || 0) < 24).length,
    nc25_m: records.filter(r => r.valoracion?.nc === 25 && (r.valoracion?.np || 0) >= 6 && (r.valoracion?.np || 0) < 10).length,
    nc25_b: records.filter(r => r.valoracion?.nc === 25 && (r.valoracion?.np || 0) <= 4).length,

    nc10_ma: records.filter(r => r.valoracion?.nc === 10 && (r.valoracion?.np || 0) >= 24).length,
    nc10_a: records.filter(r => r.valoracion?.nc === 10 && (r.valoracion?.np || 0) >= 10 && (r.valoracion?.np || 0) < 24).length,
    nc10_m: records.filter(r => r.valoracion?.nc === 10 && (r.valoracion?.np || 0) >= 6 && (r.valoracion?.np || 0) < 10).length,
    nc10_b: records.filter(r => r.valoracion?.nc === 10 && (r.valoracion?.np || 0) <= 4).length
  };

  // 4. Right side: Full 4x4 Color-Coded Heat Map (Matriz de Calor GTC 45)
  const hmHead = [['NC \\ NP', 'Muy Alto (40-24)', 'Alto (20-10)', 'Medio (8-6)', 'Bajo (4-2)']];
  const hmBody = [
    ['Mortal (100)', `I (${hmCounts.nc100_ma})`, `I (${hmCounts.nc100_a})`, `I (${hmCounts.nc100_m})`, `II (${hmCounts.nc100_b})`],
    ['Muy Grave (60)', `I (${hmCounts.nc60_ma})`, `I (${hmCounts.nc60_a})`, `II (${hmCounts.nc60_m})`, `II (${hmCounts.nc60_b})`],
    ['Grave (25)', `I (${hmCounts.nc25_ma})`, `II (${hmCounts.nc25_a})`, `II (${hmCounts.nc25_m})`, `III (${hmCounts.nc25_b})`],
    ['Leve (10)', `II (${hmCounts.nc10_ma})`, `III (${hmCounts.nc10_a})`, `III (${hmCounts.nc10_m})`, `IV (${hmCounts.nc10_b})`]
  ];

  autoTable(doc, {
    startY: 48,
    margin: { left: pageWidth / 2 + 2, right: 14 },
    head: hmHead,
    body: hmBody,
    styles: { fontSize: 7, cellPadding: 2, halign: 'center', valign: 'middle', fontStyle: 'bold' },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold', halign: 'left', fillColor: [248, 250, 252], textColor: [15, 23, 42] }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index > 0) {
        const raw = String(data.cell.raw || '');
        if (raw.startsWith('I (')) {
          data.cell.styles.fillColor = [220, 38, 38]; // red-600
          data.cell.styles.textColor = [255, 255, 255];
        } else if (raw.startsWith('II (')) {
          data.cell.styles.fillColor = [234, 88, 12]; // orange-600
          data.cell.styles.textColor = [255, 255, 255];
        } else if (raw.startsWith('III (')) {
          data.cell.styles.fillColor = [37, 99, 235]; // blue-600
          data.cell.styles.textColor = [255, 255, 255];
        } else if (raw.startsWith('IV (')) {
          data.cell.styles.fillColor = [5, 150, 105]; // emerald-600
          data.cell.styles.textColor = [255, 255, 255];
        }
      }
    }
  });

  // Add new page for the technical matrix table
  doc.addPage('a4', 'landscape');

  // ==========================================
  // PAGE 2+: MATRIZ IPVR GTC 45 COMPLETA
  // ==========================================

  // Mini header on page 2
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`MATRIZ IPVR GTC 45 · ${orgData.empresa || 'EMPRESA'} · VERSIÓN ${orgData.versionMatriz || '3.2'}`, 14, 9);

  // 5. Build Table Data for IPVR Matrix
  const head = [[
    'ID / Cód',
    'Proceso / Área',
    'Actividad / Tarea',
    'Rut.',
    'Peligro / Clasificación GTC 45',
    'Descripción / Fuente',
    'Controles Existentes (F / M / I)',
    'ND',
    'NE',
    'NP',
    'NC',
    'NR',
    'Nivel',
    'Aceptabilidad',
    'Medidas Intervención Propuestas'
  ]];

  const body = records.map(r => {
    const controles = [
      r.controlesExistentes.fuente ? `F: ${r.controlesExistentes.fuente}` : null,
      r.controlesExistentes.medio ? `M: ${r.controlesExistentes.medio}` : null,
      r.controlesExistentes.individuo ? `I: ${r.controlesExistentes.individuo}` : null
    ].filter(Boolean).join('\n');

    const medidas = [
      r.medidas.eliminacion ? `Elim: ${r.medidas.eliminacion}` : null,
      r.medidas.sustitucion ? `Sust: ${r.medidas.sustitucion}` : null,
      r.medidas.controlIngenieria ? `Ing: ${r.medidas.controlIngenieria}` : null,
      r.medidas.controlAdministrativo ? `Admin: ${r.medidas.controlAdministrativo}` : null,
      r.medidas.epp ? `EPP: ${r.medidas.epp}` : null
    ].filter(Boolean).join('\n');

    return [
      `${r.id}\n${r.codigoInterno || ''}`.trim(),
      `${r.proceso}\n${r.area}`,
      `${r.actividad}\n• ${r.tarea}`,
      r.rutinaria === 'Rutinaria' ? 'SÍ' : 'NO',
      `${r.naturalezaPeligro}\n(${r.clasificacionPeligro})`,
      `${r.descripcionPeligro}\nFuente: ${r.fuenteGeneradora || 'N/A'}`,
      controles || 'Sin controles registrados',
      r.valoracion.nd,
      r.valoracion.ne,
      r.valoracion.np,
      r.valoracion.nc,
      r.valoracion.nr,
      r.valoracion.nivelRiesgo,
      r.valoracion.aceptabilidad,
      medidas || 'Mantener controles actuales'
    ];
  });

  autoTable(doc, {
    head: head,
    body: body,
    startY: 18,
    margin: { left: 10, right: 10 },
    styles: {
      fontSize: 6.5,
      cellPadding: 1.5,
      overflow: 'linebreak',
      valign: 'middle'
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 6.5,
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 16, fontStyle: 'bold', halign: 'center' }, // ID
      1: { cellWidth: 22 }, // Proceso
      2: { cellWidth: 26 }, // Actividad/Tarea
      3: { cellWidth: 8, halign: 'center' }, // Rutinaria
      4: { cellWidth: 24 }, // Peligro
      5: { cellWidth: 32 }, // Descripcion
      6: { cellWidth: 32 }, // Controles
      7: { cellWidth: 7, halign: 'center' }, // ND
      8: { cellWidth: 7, halign: 'center' }, // NE
      9: { cellWidth: 8, halign: 'center', fontStyle: 'bold' }, // NP
      10: { cellWidth: 8, halign: 'center' }, // NC
      11: { cellWidth: 10, halign: 'center', fontStyle: 'bold' }, // NR
      12: { cellWidth: 12, halign: 'center', fontStyle: 'bold' }, // Nivel
      13: { cellWidth: 20, halign: 'center' }, // Aceptabilidad
      14: { cellWidth: 'auto' } // Medidas
    },
    didParseCell: function(data) {
      // Color-code Nivel de Riesgo column
      if (data.section === 'body' && data.column.index === 12) {
        const val = data.cell.raw;
        if (val === 'I') {
          data.cell.styles.fillColor = [254, 226, 226]; // red-100
          data.cell.styles.textColor = [185, 28, 28]; // red-700
        } else if (val === 'II') {
          data.cell.styles.fillColor = [254, 243, 199]; // amber-100
          data.cell.styles.textColor = [180, 83, 9]; // amber-700
        } else if (val === 'III') {
          data.cell.styles.fillColor = [254, 252, 232]; // yellow-100
          data.cell.styles.textColor = [161, 98, 7]; // yellow-700
        } else if (val === 'IV') {
          data.cell.styles.fillColor = [209, 250, 229]; // emerald-100
          data.cell.styles.textColor = [4, 120, 87]; // emerald-700
        }
      }
    },
    didDrawPage: function(data) {
      // Footer page numbering
      const str = `Página ${data.pageNumber} de ${doc.getNumberOfPages()} | SG-SST GTC 45 · Generado el ${new Date().toLocaleDateString()}`;
      doc.setFontSize(7);
      doc.setTextColor(100);
      doc.text(str, pageWidth - 10 - doc.getTextWidth(str), pageHeight - 5);
      doc.text(
        `${orgData.empresa || 'Empresa Principal'} - Confidencial para uso del SG-SST`,
        10,
        pageHeight - 5
      );
    }
  });

  // Save the PDF file
  const fileName = `Informe_Ejecutivo_IPVR_GTC45_${(orgData.empresa || 'Empresa').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

/**
 * Parses an Excel (.xlsx / .xls) or CSV file and converts it to RegistroIPVR objects
 */
export async function parseExcelTemplate(file: File): Promise<{
  records: Partial<RegistroIPVR>[];
  detectedCols: string[];
  totalRows: number;
}> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert sheet to JSON array of objects
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
    defval: ''
  });

  if (rawRows.length === 0) {
    throw new Error('La hoja de cálculo está vacía o no contiene filas con datos válidos.');
  }

  const detectedCols = Object.keys(rawRows[0] || {});

  // Mapping logic from various possible header names (standard GTC 45 or typical templates)
  const mappedRecords: Partial<RegistroIPVR>[] = rawRows.map((row, idx) => {
    // Helper to find value by multiple possible header keys
    const getVal = (...keys: string[]) => {
      for (const k of keys) {
        const foundKey = Object.keys(row).find(
          rk => rk.toLowerCase().trim() === k.toLowerCase().trim() ||
                rk.toLowerCase().includes(k.toLowerCase())
        );
        if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') {
          return String(row[foundKey]).trim();
        }
      }
      return '';
    };

    const getNum = (fallback: number, ...keys: string[]) => {
      const val = getVal(...keys);
      const parsed = parseFloat(val);
      return isNaN(parsed) ? fallback : parsed;
    };

    const id = getVal('id', 'código', 'codigo', 'item', 'no', 'n°') || `IPVR-IMP-${String(idx + 1).padStart(3, '0')}`;
    const codigoInterno = getVal('codigo interno', 'código interno', 'cod interno', 'referencia');
    const proceso = getVal('proceso', 'macroproceso') || 'Misional / Operativo';
    const area = getVal('área', 'area', 'lugar', 'zona', 'sede') || 'Área General';
    const lugarEspecifico = getVal('lugar especifico', 'lugar específico', 'ubicación', 'ubicacion') || area;
    const actividad = getVal('actividad', 'subproceso') || 'Actividad Operativa';
    const tarea = getVal('tarea', 'operación', 'operacion', 'labor') || actividad;
    
    const rutRaw = getVal('rutinaria', 'rutinario', 'es rutinaria', 'rut');
    const rutinaria = (rutRaw.toLowerCase().includes('si') || rutRaw.toLowerCase().includes('sí') || rutRaw.toLowerCase() === 's' || rutRaw.toLowerCase() === 'r')
      ? 'Rutinaria'
      : (rutRaw.toLowerCase().includes('no') || rutRaw.toLowerCase() === 'n' || rutRaw.toLowerCase() === 'nr')
        ? 'No Rutinaria'
        : 'Rutinaria';

    const cargoExpuesto = getVal('cargo', 'cargos', 'población expuesta', 'poblacion expuesta', 'ocupación') || 'Personal Operativo';
    const expuestosDirectos = getNum(1, 'directos', 'planta', 'expuestos directos', 'trabajadores directos');
    const expuestosContratistas = getNum(0, 'contratistas', 'expuestos contratistas', 'terceros');
    const expuestosTemporales = getNum(0, 'temporales', 'expuestos temporales');
    const expuestosTotal = expuestosDirectos + expuestosContratistas + expuestosTemporales;

    const frecuencia: FrecuenciaExposicion = 'Frecuente (Varias veces/día)';
    const naturalezaPeligro: NaturalezaPeligro = (getVal('naturaleza', 'clasificacion peligro', 'tipo de peligro') || 'Condiciones de Seguridad') as NaturalezaPeligro;
    const clasificacionPeligro = getVal('clasificación', 'clasificacion', 'peligro', 'factor de riesgo') || 'Seguridad General';
    const fuenteGeneradora = getVal('fuente', 'fuente generadora', 'origen') || 'Actividades propias del proceso';
    const descripcionPeligro = getVal('descripción', 'descripcion', 'descripción del peligro', 'detalle peligro') || `${clasificacionPeligro} en ${tarea}`;
    const efectosPosibles = getVal('efectos', 'efectos posibles', 'consecuencias', 'daño') || 'Lesiones osteomusculares, traumatismos o afectación a la salud.';

    const controlFuente = getVal('control fuente', 'fuente (controles)', 'controles existentes fuente', 'f');
    const controlMedio = getVal('control medio', 'medio (controles)', 'controles existentes medio', 'm');
    const controlIndividuo = getVal('control individuo', 'individuo', 'administrativo', 'epp', 'controles existentes individuo', 'i');

    const nd = getNum(6, 'nd', 'deficiencia', 'nivel deficiencia') as any;
    const ne = getNum(3, 'ne', 'exposición', 'exposicion', 'nivel exposicion') as any;
    const nc = getNum(25, 'nc', 'consecuencia', 'nivel consecuencia') as any;

    const { np, interpretacion: interpretacionNP } = calcularNP(nd, ne);
    const { nr, nivelRiesgo, interpretacionNR, aceptabilidad, significadoNR } = calcularNR(np, nc);

    return {
      id,
      codigoInterno,
      proceso,
      tipoProceso: 'Misional / Operativo',
      area,
      lugarEspecifico,
      actividad,
      tarea,
      rutinaria,
      cargoExpuesto,
      expuestosDirectos,
      expuestosContratistas,
      expuestosTemporales,
      expuestosTotal,
      frecuencia,
      naturalezaPeligro,
      clasificacionPeligro,
      fuenteGeneradora,
      descripcionPeligro,
      efectosPosibles,
      controlesExistentes: {
        fuente: controlFuente || 'Ninguno en la fuente',
        medio: controlMedio || 'Ninguno en el medio',
        individuo: controlIndividuo || 'Uso de EPP y capacitación básica'
      },
      valoracion: {
        nd,
        ne,
        np,
        interpretacionNP,
        nc,
        nr,
        nivelRiesgo,
        interpretacionNR,
        aceptabilidad,
        significadoNR,
        estado: 'Valorado'
      },
      criterios: {
        numExpuestos: expuestosTotal,
        peorConsecuencia: getVal('peor consecuencia', 'consecuencia critica') || 'Incapacidad permanente o severa.',
        tieneRequisitoLegal: true,
        requisitoLegalEspecifico: getVal('requisito legal', 'normatividad') || 'Decreto 1072 de 2015 / Res. 0312 de 2019'
      },
      medidas: {
        eliminacion: getVal('eliminación', 'eliminacion') || 'No viable técnicamente',
        sustitucion: getVal('sustitución', 'sustitucion') || 'No aplica',
        controlIngenieria: getVal('ingeniería', 'ingenieria', 'control de ingeniería') || 'Instalación de guardas y protecciones físicas',
        controlAdministrativo: getVal('administrativo', 'control administrativo', 'señalización') || 'Procedimientos de trabajo seguro y capacitación periódica',
        epp: getVal('epp', 'equipos de protección', 'dotación') || 'Dotación de EPP certificado conforme a matriz de EPP'
      },
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaRevision: new Date().toISOString().split('T')[0],
      responsableRevision: 'Responsable SG-SST'
    };
  });

  return {
    records: mappedRecords,
    detectedCols,
    totalRows: mappedRecords.length
  };
}

/**
 * Downloads a pre-formatted Excel template for GTC 45 data loading
 */
export function downloadExcelGtc45Template() {
  const headers = [
    'ID',
    'Codigo Interno',
    'Proceso',
    'Area',
    'Lugar Especifico',
    'Actividad',
    'Tarea',
    'Rutinaria (Si/No)',
    'Cargo Expuesto',
    'Expuestos Directos',
    'Expuestos Contratistas',
    'Frecuencia',
    'Naturaleza Peligro',
    'Clasificacion Peligro',
    'Fuente Generadora',
    'Descripcion Peligro',
    'Efectos Posibles',
    'Controles Fuente',
    'Controles Medio',
    'Controles Individuo',
    'ND (2, 6, 10)',
    'NE (1, 2, 3, 4)',
    'NC (10, 25, 60, 100)',
    'Peor Consecuencia',
    'Requisito Legal',
    'Medida Eliminacion',
    'Medida Sustitucion',
    'Medida Control Ingenieria',
    'Medida Control Administrativo',
    'Medida EPP'
  ];

  const exampleRows = [
    [
      'IPVR-001',
      'LOG-ALM-01',
      'Logística y Distribución',
      'Bodega Principal',
      'Pasillos de Racks Superiores',
      'Almacenamiento en altura',
      'Ubicación de estibas a más de 3 metros',
      'Si',
      'Operario de montacargas / Auxiliar',
      5,
      1,
      'Continua (Toda la jornada)',
      'Condiciones de Seguridad',
      'Trabajo en Alturas (> 1.50 m)',
      'Estantería industrial a 4.5 metros',
      'Caída de personas a distinto nivel durante inspección',
      'Fracturas, traumatismos severos, muerte',
      'Líneas de vida en racks',
      'Delimitación peatonal en pasillo',
      'Capacitación trabajo en alturas y arnés certificado',
      6,
      3,
      60,
      'Muerte por caída libre',
      'Resolución 4272 de 2021',
      'Automatización de racks',
      'No aplica',
      'Mallas de contención perimetral',
      'Permiso de trabajo en alturas e inspección preoperacional',
      'Arnés cuerpo entero ANSI Z359.11 y casco 3 puntos'
    ]
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...exampleRows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla_GTC45');

  XLSX.writeFile(workbook, 'Plantilla_GTC45_Matriz_IPVR.xlsx');
}
