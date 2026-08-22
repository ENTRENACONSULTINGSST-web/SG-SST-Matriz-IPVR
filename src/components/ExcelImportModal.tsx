import React, { useState, useRef, useEffect } from 'react';
import { useIpvr } from '../context/IpvrContext';
import { parseExcelTemplate } from '../utils/pdfAndExcelExporter';
import {
  saveCustomTemplateBase64,
  getCustomTemplateBase64,
  removeCustomTemplate,
  exportMatrixToTemplateExcel
} from '../utils/excelTemplateEngine';
import { RegistroIPVR } from '../types';
import ExcelJS from 'exceljs';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  FileCheck,
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
  Trash2,
  Settings2
} from 'lucide-react';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({ isOpen, onClose }) => {
  const { orgData, records, actions, setRecords, exportMatrixExcel } = useIpvr();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'import_data' | 'fix_template'>('import_data');

  // Import Data States
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{
    records: Partial<RegistroIPVR>[];
    detectedCols: string[];
    totalRows: number;
  } | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('merge');
  const [successCount, setSuccessCount] = useState<number | null>(null);

  // Custom Template States
  const [customTemplateInfo, setCustomTemplateInfo] = useState<{
    filename: string | null;
    isCustom: boolean;
    sheetNames: string[];
  }>({
    filename: null,
    isCustom: false,
    sheetNames: []
  });
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateSuccessMsg, setTemplateSuccessMsg] = useState<string | null>(null);
  const [templateErrorMsg, setTemplateErrorMsg] = useState<string | null>(null);

  // Load custom template info on mount/open
  useEffect(() => {
    if (isOpen) {
      checkActiveTemplate();
    }
  }, [isOpen]);

  const checkActiveTemplate = async () => {
    const { base64, filename } = getCustomTemplateBase64();
    if (base64 && filename) {
      try {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.load(bytes.buffer);
        setCustomTemplateInfo({
          filename,
          isCustom: true,
          sheetNames: wb.worksheets.map(w => w.name)
        });
      } catch {
        setCustomTemplateInfo({
          filename: null,
          isCustom: false,
          sheetNames: [
            '00_Portada_e_Instrucciones',
            '01_Organización_SST',
            '02_Matriz_IPVR_GTC45',
            '03_Planes_de_Accion_PEC',
            '04_Catalogos_GTC45',
            '05_Dashboard_Resumen'
          ]
        });
      }
    } else {
      setCustomTemplateInfo({
        filename: null,
        isCustom: false,
        sheetNames: [
          '00_Portada_e_Instrucciones',
          '01_Organización_SST',
          '02_Matriz_IPVR_GTC45',
          '03_Planes_de_Accion_PEC',
          '04_Catalogos_GTC45',
          '05_Dashboard_Resumen'
        ]
      });
    }
  };

  if (!isOpen) return null;

  // --- Data Import Handlers ---
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (selectedFile: File) => {
    setErrorMsg(null);
    setSuccessCount(null);
    setFile(selectedFile);
    setIsLoading(true);

    try {
      const result = await parseExcelTemplate(selectedFile);
      setPreviewData(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el archivo Excel. Asegúrese de que sea un archivo .xlsx, .xls o .csv válido.');
      setPreviewData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (!previewData || previewData.records.length === 0) return;

    const validatedRecords = previewData.records as RegistroIPVR[];

    setRecords(prev => {
      if (importMode === 'replace') {
        return validatedRecords;
      } else {
        const newMap = new Map<string, RegistroIPVR>();
        prev.forEach(r => newMap.set(r.id, r));
        validatedRecords.forEach(r => newMap.set(r.id, r));
        return Array.from(newMap.values());
      }
    });

    setSuccessCount(validatedRecords.length);
    setTimeout(() => {
      onClose();
      setPreviewData(null);
      setFile(null);
      setSuccessCount(null);
    }, 1500);
  };

  // --- Custom Physical Template Handlers ---
  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const tFile = e.target.files[0];
    setTemplateLoading(true);
    setTemplateErrorMsg(null);
    setTemplateSuccessMsg(null);

    try {
      const buffer = await tFile.arrayBuffer();
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(buffer);

      if (wb.worksheets.length === 0) {
        throw new Error('El archivo seleccionado no contiene hojas de cálculo válidas.');
      }

      // Convert ArrayBuffer to base64
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const b64 = btoa(binary);

      saveCustomTemplateBase64(b64, tFile.name);
      setCustomTemplateInfo({
        filename: tFile.name,
        isCustom: true,
        sheetNames: wb.worksheets.map(w => w.name)
      });

      setTemplateSuccessMsg(`¡Plantilla "${tFile.name}" fijada con éxito! Se detectaron ${wb.worksheets.length} hojas preservadas.`);
    } catch (err: any) {
      setTemplateErrorMsg(err.message || 'Error al procesar y fijar la plantilla Excel.');
    } finally {
      setTemplateLoading(false);
    }
  };

  const handleRestoreMasterTemplate = () => {
    removeCustomTemplate();
    checkActiveTemplate();
    setTemplateSuccessMsg('Se ha restablecido la Plantilla Maestra Institucional GTC 45 (6 Hojas).');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Gestión de Plantillas y Datos Excel (GTC 45)
              </h3>
              <p className="text-xs text-slate-500">
                Importa registros o fija tu libro Excel base respetando todas las hojas, estilos y fórmulas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('import_data')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'import_data'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>1. Cargar Datos a la Matriz</span>
          </button>

          <button
            onClick={() => setActiveTab('fix_template')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'fix_template'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>2. Fijar Plantilla Base de Exportación (.xlsx)</span>
          </button>
        </div>

        {/* TAB 1: IMPORT DATA */}
        {activeTab === 'import_data' && (
          <div className="space-y-4">
            {/* Banner info */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>¿Deseas descargar la plantilla de datos con encabezados GTC 45 y fila de ejemplo?</span>
              </div>
              <button
                onClick={exportMatrixExcel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-lg border border-slate-300 shrink-0 shadow-xs cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Descargar Libro Base (.xlsx)</span>
              </button>
            </div>

            {/* Dropzone Area */}
            {!previewData && (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    Arrastra tu archivo Excel aquí o haz clic para seleccionarlo
                  </p>
                  <p className="text-xs text-slate-500">
                    Archivos compatibles: <b>.xlsx, .xls, .csv</b>
                  </p>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="py-6 text-center text-xs text-slate-600 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Leyendo columnas y procesando hoja de cálculo...</span>
              </div>
            )}

            {/* Error Alert */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Alert */}
            {successCount !== null && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>¡{successCount} registros importados y valorados con éxito en la Matriz IPVR!</span>
              </div>
            )}

            {/* Preview State */}
            {previewData && !successCount && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2 font-semibold">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Archivo: {file?.name} ({previewData.totalRows} filas detectadas)</span>
                  </div>
                  <button
                    onClick={() => {
                      setPreviewData(null);
                      setFile(null);
                    }}
                    className="text-emerald-700 hover:text-emerald-900 underline font-bold cursor-pointer"
                  >
                    Cambiar archivo
                  </button>
                </div>

                {/* Import Mode Radio */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
                  <p className="font-bold text-slate-800">Modo de Importación:</p>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="importMode"
                        value="merge"
                        checked={importMode === 'merge'}
                        onChange={() => setImportMode('merge')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span><b>Fusionar / Agregar:</b> Mantiene los registros existentes y actualiza/agrega los del Excel.</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="importMode"
                        value="replace"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span><b>Reemplazar Todo:</b> Limpia la matriz actual y deja solo los registros del Excel.</span>
                    </label>
                  </div>
                </div>

                {/* Sample Table Preview */}
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                      <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Proceso / Área</th>
                        <th className="p-2">Tarea</th>
                        <th className="p-2">Peligro</th>
                        <th className="p-2 text-center">Nivel Riesgo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewData.records.slice(0, 5).map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2 font-mono font-bold text-slate-800">{r.id}</td>
                          <td className="p-2">{r.proceso} - {r.area}</td>
                          <td className="p-2 truncate max-w-xs">{r.tarea}</td>
                          <td className="p-2">{r.clasificacionPeligro}</td>
                          <td className="p-2 text-center font-bold text-amber-700">{r.valoracion?.nivelRiesgo || 'II'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewData.records.length > 5 && (
                  <p className="text-[11px] text-slate-500 text-right">
                    ...y {previewData.records.length - 5} filas más listas para importar.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FIX BASE TEMPLATE */}
        {activeTab === 'fix_template' && (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Estado de la Plantilla Base Fija</h4>
                    <p className="text-[11px] text-slate-500">
                      {customTemplateInfo.isCustom
                        ? `Plantilla Física Personalizada: ${customTemplateInfo.filename}`
                        : 'Plantilla Maestra Institucional GTC 45 (6 Hojas Autocontenidas)'}
                    </p>
                  </div>
                </div>
                {customTemplateInfo.isCustom && (
                  <button
                    onClick={handleRestoreMasterTemplate}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 cursor-pointer"
                    title="Restablecer a la plantilla institucional por defecto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Restablecer Maestra</span>
                  </button>
                )}
              </div>

              {/* Sheet badges list */}
              <div className="bg-white rounded-lg p-3 border border-slate-200 space-y-2">
                <p className="text-[11px] font-bold text-slate-700">
                  Diligenciamiento e Inyección Inteligente por Hojas en cada Exportación:
                </p>
                <div className="flex flex-wrap gap-2">
                  {customTemplateInfo.sheetNames.map((sheet, sIdx) => {
                    const sLower = sheet.toLowerCase();
                    let badgeType = 'Preservada';
                    let badgeStyle = 'bg-slate-50 text-slate-700 border-slate-200';
                    let tagStyle = 'bg-slate-200 text-slate-700';

                    if (sLower.includes('matriz') || sLower.includes('ipvr') || sLower.includes('gtc') || sLower.includes('peligro') || sLower.includes('02')) {
                      badgeType = 'Inyección Matriz & IA';
                      badgeStyle = 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold';
                      tagStyle = 'bg-emerald-600 text-white font-semibold';
                    } else if (sLower.includes('documental') || sLower.includes('organiz') || sLower.includes('empresa') || sLower.includes('portada') || sLower.includes('01')) {
                      badgeType = 'Inyección Organización';
                      badgeStyle = 'bg-blue-50 text-blue-900 border-blue-300 font-bold';
                      tagStyle = 'bg-blue-600 text-white font-semibold';
                    } else if (sLower.includes('accion') || sLower.includes('acción') || sLower.includes('plan') || sLower.includes('pec') || sLower.includes('03')) {
                      badgeType = 'Inyección Plan de Acción';
                      badgeStyle = 'bg-amber-50 text-amber-900 border-amber-300 font-bold';
                      tagStyle = 'bg-amber-600 text-white font-semibold';
                    } else if (sLower.includes('cambio') || sLower.includes('historial') || sLower.includes('version') || sLower.includes('05')) {
                      badgeType = 'Inyección Control Cambios';
                      badgeStyle = 'bg-purple-50 text-purple-900 border-purple-300 font-bold';
                      tagStyle = 'bg-purple-600 text-white font-semibold';
                    } else if (sLower.includes('catalog') || sLower.includes('tablas') || sLower.includes('04')) {
                      badgeType = 'Normativo Preservado';
                      badgeStyle = 'bg-slate-50 text-slate-700 border-slate-200';
                      tagStyle = 'bg-slate-200 text-slate-600';
                    }

                    return (
                      <span
                        key={sIdx}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] border shadow-2xs ${badgeStyle}`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{sheet}</span>
                        <span className={`text-[9.5px] px-1.5 py-0.5 rounded ${tagStyle}`}>{badgeType}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Template Upload section */}
            <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">
                    ¿Tienes tu propio archivo .xlsx con logos, macros y hojas existentes?
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Sube tu archivo .xlsx para fijarlo como la plantilla base. La aplicación inyectará los datos en la hoja de Matriz respetando todas las demás pestañas y fórmulas.
                  </p>
                </div>
                <input
                  ref={templateInputRef}
                  type="file"
                  accept=".xlsx"
                  onChange={handleTemplateUpload}
                  className="hidden"
                />
                <button
                  onClick={() => templateInputRef.current?.click()}
                  disabled={templateLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs shrink-0"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{templateLoading ? 'Cargando...' : 'Fijar Mi Plantilla (.xlsx)'}</span>
                </button>
              </div>

              {templateSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{templateSuccessMsg}</span>
                </div>
              )}

              {templateErrorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{templateErrorMsg}</span>
                </div>
              )}
            </div>

            {/* Test export button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Al exportar, los datos de la matriz se inyectarán en la plantilla activa sin alterar las demás hojas.
              </span>
              <button
                onClick={exportMatrixExcel}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Matriz con Plantilla Activa</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
          >
            Cerrar
          </button>

          {activeTab === 'import_data' && previewData && (
            <button
              onClick={handleConfirmImport}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              <span>Importar {previewData.totalRows} Peligros a la Matriz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
