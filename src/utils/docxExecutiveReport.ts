import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ShadingType
} from 'docx';
import { OrganizacionData, RegistroIPVR, AccionSeguimiento } from '../types';

/**
 * Generates an institutional executive Word (.docx) report with full dashboard KPIs,
 * color-coded GTC 45 Heat Map, Hazard breakdown, full IPVR matrix, and Action Plans.
 */
export async function generateExecutiveDocxReport(
  orgData: OrganizacionData,
  records: RegistroIPVR[],
  actions: AccionSeguimiento[]
): Promise<Blob> {
  const totalPeligros = records.length;
  const nivelI = records.filter(r => r.valoracion?.nivelRiesgo === 'I').length;
  const nivelII = records.filter(r => r.valoracion?.nivelRiesgo === 'II').length;
  const nivelIII = records.filter(r => r.valoracion?.nivelRiesgo === 'III').length;
  const nivelIV = records.filter(r => r.valoracion?.nivelRiesgo === 'IV').length;

  const totalAcciones = actions.length;
  const accionesAbiertas = actions.filter(a => a.estado !== 'Cerrada').length;
  const accionesCerradas = actions.filter(a => a.estado === 'Cerrada').length;
  const pctCumplimiento = totalAcciones > 0 ? Math.round((accionesCerradas / totalAcciones) * 100) : 0;

  // Breakdown by Hazard Nature
  const hazardsByNature = records.reduce((acc, r) => {
    const nat = r.naturalezaPeligro || 'Otro';
    acc[nat] = (acc[nat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Heat map cell counters
  const hm = {
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

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header title
          new Paragraph({
            text: (orgData.empresa || 'SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO').toUpperCase(),
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'INFORME EJECUTIVO Y TÉCNICO DE IDENTIFICACIÓN DE PELIGROS, EVALUACIÓN Y VALORACIÓN DE RIESGOS (IPVR)',
                bold: true,
                size: 24,
                color: '065F46'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Metodología: Guía Técnica Colombiana GTC 45:2012 · Decreto 1072 de 2015 · Res. 0312 de 2019`,
                italics: true,
                size: 20,
                color: '64748B'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),

          // Section 1: Organization Data
          new Paragraph({
            children: [new TextRun({ text: '1. CONTROL DOCUMENTAL Y CARACTERIZACIÓN DE LA ORGANIZACIÓN', bold: true, size: 22, color: '0F172A' })],
            spacing: { before: 200, after: 150 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Parámetro', 30),
                  createHeaderCell('Información Institucional Registrada', 70)
                ]
              }),
              createDataRow('Razón Social / Empresa', orgData.empresa || 'No especificada'),
              createDataRow('NIT', orgData.nit || 'Sin Registrar'),
              createDataRow('Actividad Económica', `${orgData.actividadEconomica || ''} (CIIU: ${orgData.ciiu || 'N/A'})`),
              createDataRow('Clase de Riesgo Principal', `Clase ${orgData.claseRiesgo || 'I'}`),
              createDataRow('Administradora de Riesgos (ARL)', orgData.arl || 'SURA'),
              createDataRow('Sede / Dirección', `${orgData.centroPrincipal || orgData.direccion || 'Principal'} (${orgData.ciudad || ''} - ${orgData.departamento || ''})`),
              createDataRow('Total Población Expuesta', `${orgData.numTrabajadores || records.reduce((s, r) => s + (r.expuestosDirectos || 0), 0)} directos / ${orgData.numContratistas || 0} contratistas`),
              createDataRow('Responsable SG-SST', `${orgData.elaboradoPor || 'Responsable SST'} ${orgData.licenciaSST ? '(Lic. ' + orgData.licenciaSST + ')' : ''}`),
              createDataRow('Aprobado por', orgData.aprobadoPor || 'Representante Legal / Gerencia General'),
              createDataRow('Versión de la Matriz', `Versión ${orgData.versionMatriz || '3.2'} - Fecha: ${orgData.fechaActualizacion || new Date().toISOString().split('T')[0]}`),
              createDataRow('Motivo de Actualización', orgData.motivoActualizacion || 'Actualización anual reglamentaria (Decreto 1072/2015)')
            ]
          }),

          // Section 2: KPIs & Dashboard Summary
          new Paragraph({
            children: [new TextRun({ text: '2. TABLERO DE CONTROL E INDICADORES EJECUTIVOS (KPIs)', bold: true, size: 22, color: '0F172A' })],
            spacing: { before: 350, after: 150 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createKpiCell('TOTAL PELIGROS', `${totalPeligros}`, '100% Identificados', '0F172A', 'F1F5F9'),
                  createKpiCell('NIVEL I (CRÍTICO)', `${nivelI}`, 'No Aceptable (Urgente)', '991B1B', 'FEE2E2'),
                  createKpiCell('NIVEL II (ALTO)', `${nivelII}`, 'Control Específico', '92400E', 'FEF3C7'),
                  createKpiCell('ACCIONES ABIERTAS', `${accionesAbiertas}`, `${accionesCerradas} cerradas`, '1E40AF', 'DBEAFE'),
                  createKpiCell('CUMPLIMIENTO', `${pctCumplimiento}%`, 'Eficacia PEC', '065F46', 'D1FAE5')
                ]
              })
            ]
          }),

          // Section 3: Risk Level Distribution & Hazard Natures
          new Paragraph({
            children: [new TextRun({ text: '3. DISTRIBUCIÓN POR NIVEL DE RIESGO Y TIPOLOGÍA DE PELIGRO', bold: true, size: 22, color: '0F172A' })],
            spacing: { before: 350, after: 150 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Nivel de Riesgo (NR)', 30),
                  createHeaderCell('Rango GTC 45', 20),
                  createHeaderCell('Cantidad', 15),
                  createHeaderCell('% Participación', 15),
                  createHeaderCell('Aceptabilidad Normativa', 20)
                ]
              }),
              createRiskRow('Nivel I (Rojo)', '4000 - 600', nivelI, totalPeligros ? Math.round((nivelI / totalPeligros) * 100) : 0, 'No Aceptable', 'FEE2E2', '991B1B'),
              createRiskRow('Nivel II (Ámbar)', '500 - 150', nivelII, totalPeligros ? Math.round((nivelII / totalPeligros) * 100) : 0, 'No Aceptable / Control Esp.', 'FEF3C7', '92400E'),
              createRiskRow('Nivel III (Amarillo)', '120 - 40', nivelIII, totalPeligros ? Math.round((nivelIII / totalPeligros) * 100) : 0, 'Mejorable', 'FEFCE8', '854D0E'),
              createRiskRow('Nivel IV (Verde)', '20', nivelIV, totalPeligros ? Math.round((nivelIV / totalPeligros) * 100) : 0, 'Aceptable', 'D1FAE5', '065F46')
            ]
          }),

          new Paragraph({
            children: [new TextRun({ text: 'Clasificación por Naturaleza del Peligro:', bold: true, size: 20, color: '334155' })],
            spacing: { before: 200, after: 100 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Naturaleza del Peligro', 60),
                  createHeaderCell('Peligros Identificados', 20),
                  createHeaderCell('Porcentaje', 20)
                ]
              }),
              ...Object.entries(hazardsByNature).map(([nat, cnt]) =>
                new TableRow({
                  children: [
                    createNormalCell(nat, 60, false),
                    createNormalCell(`${cnt}`, 20, true),
                    createNormalCell(`${totalPeligros ? Math.round((cnt / totalPeligros) * 100) : 0}%`, 20, true)
                  ]
                })
              )
            ]
          }),

          // Section 4: Heat Map Matrix 4x4
          new Paragraph({
            children: [new TextRun({ text: '4. MATRIZ DE CALOR GTC 45 (PROBABILIDAD × CONSECUENCIA)', bold: true, size: 22, color: '0F172A' })],
            spacing: { before: 350, after: 150 }
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Evaluación cruzada de severidad y frecuencia conforme a la metodología estándar colombiana GTC 45:2012.', italics: true, size: 18, color: '64748B' })],
            spacing: { after: 150 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Consecuencia (NC) \\ Probabilidad (NP)', 32),
                  createHeaderCell('Muy Alto (40-24)', 17),
                  createHeaderCell('Alto (20-10)', 17),
                  createHeaderCell('Medio (8-6)', 17),
                  createHeaderCell('Bajo (4-2)', 17)
                ]
              }),
              // NC 100
              new TableRow({
                children: [
                  createNormalCell('Mortal / Catastrófico (100)', 32, false, true),
                  createHeatCell(`I (4000-2400)\n${hm.nc100_ma} peligros`, 'DC2626', 'FFFFFF'),
                  createHeatCell(`I (2000-1000)\n${hm.nc100_a} peligros`, 'DC2626', 'FFFFFF'),
                  createHeatCell(`I (800-600)\n${hm.nc100_m} peligros`, 'DC2626', 'FFFFFF'),
                  createHeatCell(`II (400-200)\n${hm.nc100_b} peligros`, 'EA580C', 'FFFFFF')
                ]
              }),
              // NC 60
              new TableRow({
                children: [
                  createNormalCell('Muy Grave (60)', 32, false, true),
                  createHeatCell(`I (2400-1440)\n${hm.nc60_ma} peligros`, 'DC2626', 'FFFFFF'),
                  createHeatCell(`I (1200-600)\n${hm.nc60_a} peligros`, 'DC2626', 'FFFFFF'),
                  createHeatCell(`II (480-360)\n${hm.nc60_m} peligros`, 'EA580C', 'FFFFFF'),
                  createHeatCell(`II (240-120)\n${hm.nc60_b} peligros`, 'EA580C', 'FFFFFF')
                ]
              }),
              // NC 25
              new TableRow({
                children: [
                  createNormalCell('Grave (25)', 32, false, true),
                  createHeatCell(`I (1000-600)\n${hm.nc25_ma} peligros`, 'DC2626', 'FFFFFF'),
                  createHeatCell(`II (500-250)\n${hm.nc25_a} peligros`, 'EA580C', 'FFFFFF'),
                  createHeatCell(`II (200-150)\n${hm.nc25_m} peligros`, 'EA580C', 'FFFFFF'),
                  createHeatCell(`III (100-50)\n${hm.nc25_b} peligros`, '2563EB', 'FFFFFF')
                ]
              }),
              // NC 10
              new TableRow({
                children: [
                  createNormalCell('Leve (10)', 32, false, true),
                  createHeatCell(`II (400-240)\n${hm.nc10_ma} peligros`, 'EA580C', 'FFFFFF'),
                  createHeatCell(`III (200-100)\n${hm.nc10_a} peligros`, '2563EB', 'FFFFFF'),
                  createHeatCell(`III (80-60)\n${hm.nc10_m} peligros`, '2563EB', 'FFFFFF'),
                  createHeatCell(`IV (40-20)\n${hm.nc10_b} peligros`, '059669', 'FFFFFF')
                ]
              })
            ]
          }),

          // Section 5: Matrix Records Table
          new Paragraph({
            children: [new TextRun({ text: '5. MATRIZ TÉCNICA IPVR GTC 45 (IDENTIFICACIÓN, VALORACIÓN Y CONTROLES)', bold: true, size: 22, color: '0F172A' })],
            spacing: { before: 350, after: 150 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('ID / Cód', 12),
                  createHeaderCell('Proceso / Actividad / Tarea', 26),
                  createHeaderCell('Peligro y Descripción', 26),
                  createHeaderCell('ND × NE = NP | NC = NR (Nivel)', 16),
                  createHeaderCell('Jerarquía de Medidas de Intervención', 20)
                ]
              }),
              ...records.map(r => {
                const medidas = [
                  r.medidas.eliminacion ? `• Elim: ${r.medidas.eliminacion}` : null,
                  r.medidas.sustitucion ? `• Sust: ${r.medidas.sustitucion}` : null,
                  r.medidas.controlIngenieria ? `• Ing: ${r.medidas.controlIngenieria}` : null,
                  r.medidas.controlAdministrativo ? `• Admin: ${r.medidas.controlAdministrativo}` : null,
                  r.medidas.epp ? `• EPP: ${r.medidas.epp}` : null
                ].filter(Boolean).join('\n');

                const nivelBg = r.valoracion.nivelRiesgo === 'I' ? 'FEE2E2' : r.valoracion.nivelRiesgo === 'II' ? 'FEF3C7' : r.valoracion.nivelRiesgo === 'III' ? 'FEFCE8' : 'D1FAE5';
                const nivelColor = r.valoracion.nivelRiesgo === 'I' ? '991B1B' : r.valoracion.nivelRiesgo === 'II' ? '92400E' : r.valoracion.nivelRiesgo === 'III' ? '854D0E' : '065F46';

                return new TableRow({
                  children: [
                    createNormalCell(`${r.id}\n${r.codigoInterno || ''}`.trim(), 12, true, true),
                    createNormalCell(`${r.proceso} - ${r.area}\n${r.actividad}\nTarea: ${r.tarea} (${r.rutinaria})`, 26, false),
                    createNormalCell(`[${r.naturalezaPeligro}]\n${r.clasificacionPeligro}\nDesc: ${r.descripcionPeligro}\nFuente: ${r.fuenteGeneradora || 'N/A'}`, 26, false),
                    new TableCell({
                      width: { size: 16, type: WidthType.PERCENTAGE },
                      shading: { type: ShadingType.CLEAR, fill: nivelBg },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: `ND: ${r.valoracion.nd} | NE: ${r.valoracion.ne}\nNP: ${r.valoracion.np} (${r.valoracion.interpretacionNP})\nNC: ${r.valoracion.nc} → NR: ${r.valoracion.nr}\nNIVEL ${r.valoracion.nivelRiesgo}\n(${r.valoracion.aceptabilidad})`, bold: true, size: 16, color: nivelColor })
                          ],
                          alignment: AlignmentType.CENTER
                        })
                      ]
                    }),
                    createNormalCell(medidas || 'Mantener controles actuales', 20, false)
                  ]
                });
              })
            ]
          }),

          // Section 6: Action Plans (PEC)
          new Paragraph({
            children: [new TextRun({ text: '6. PLAN DE ACCIÓN Y SEGUIMIENTO A MEDIDAS DE INTERVENCIÓN (PEC)', bold: true, size: 22, color: '0F172A' })],
            spacing: { before: 350, after: 150 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('ID Acción', 12),
                  createHeaderCell('Peligro / Riesgo', 24),
                  createHeaderCell('Medida a Implementar', 30),
                  createHeaderCell('Responsable / Cargo', 18),
                  createHeaderCell('Fecha Límite / Estado', 16)
                ]
              }),
              ...actions.map(act =>
                new TableRow({
                  children: [
                    createNormalCell(act.id, 12, true, true),
                    createNormalCell(`${act.peligroResumen}\n[${act.jerarquia}]`, 24, false),
                    createNormalCell(act.descripcionAccion, 30, false),
                    createNormalCell(`${act.responsable}\n${act.cargoResponsable || ''}`, 18, false),
                    createNormalCell(`Límite: ${act.fechaLimite}\nEstado: ${act.estado}\nEficacia: ${act.eficacia}`, 16, true)
                  ]
                })
              )
            ]
          }),

          // Signatures Block
          new Paragraph({
            children: [new TextRun({ text: '7. APROBACIÓN Y FIRMAS DE RESPONSABILIDAD', bold: true, size: 22, color: '0F172A' })],
            spacing: { before: 350, after: 150 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createSignatureCell('ELABORADO POR:', orgData.elaboradoPor || 'Responsable SG-SST', `Licencia SST: ${orgData.licenciaSST || 'Vigente'}`),
                  createSignatureCell('REVISADO Y APROBADO POR:', orgData.aprobadoPor || 'Representante Legal / Gerencia', 'Gerencia General / Dirección')
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  return await Packer.toBlob(doc);
}

// Helpers for DOCX formatting
function createHeaderCell(text: string, widthPct: number): TableCell {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: '0F172A' },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 18 })],
        alignment: AlignmentType.CENTER
      })
    ]
  });
}

function createDataRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18, color: '1E293B' })] })]
      }),
      new TableCell({
        width: { size: 70, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 18, color: '0F172A' })] })]
      })
    ]
  });
}

function createKpiCell(title: string, mainValue: string, subtitle: string, textColor: string, bgColor: string): TableCell {
  return new TableCell({
    width: { size: 20, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: bgColor },
    children: [
      new Paragraph({
        children: [new TextRun({ text: title, bold: true, size: 16, color: textColor })],
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [new TextRun({ text: mainValue, bold: true, size: 32, color: textColor })],
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [new TextRun({ text: subtitle, italics: true, size: 14, color: textColor })],
        alignment: AlignmentType.CENTER
      })
    ]
  });
}

function createRiskRow(level: string, range: string, count: number, pct: number, accept: string, bg: string, color: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: bg },
        children: [new Paragraph({ children: [new TextRun({ text: level, bold: true, size: 18, color })] })]
      }),
      createNormalCell(range, 20, true),
      createNormalCell(`${count}`, 15, true),
      createNormalCell(`${pct}%`, 15, true),
      createNormalCell(accept, 20, true)
    ]
  });
}

function createHeatCell(text: string, bgColor: string, textColor: string): TableCell {
  return new TableCell({
    width: { size: 17, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: bgColor },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 16, color: textColor })],
        alignment: AlignmentType.CENTER
      })
    ]
  });
}

function createNormalCell(text: string, widthPct: number, center = false, bold = false): TableCell {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        children: [new TextRun({ text, size: 17, bold, color: '1E293B' })],
        alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT
      })
    ]
  });
}

function createSignatureCell(role: string, name: string, sub: string): TableCell {
  return new TableCell({
    width: { size: 50, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({ children: [new TextRun({ text: role, bold: true, size: 16, color: '64748B' })], spacing: { after: 300 } }),
      new Paragraph({ children: [new TextRun({ text: '______________________________________', color: 'CBD5E1' })], spacing: { after: 100 } }),
      new Paragraph({ children: [new TextRun({ text: name, bold: true, size: 18, color: '0F172A' })] }),
      new Paragraph({ children: [new TextRun({ text: sub, size: 16, color: '64748B' })] })
    ]
  });
}
