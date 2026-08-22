import React, { useState } from 'react';
import { useIpvr } from '../context/IpvrContext';
import { RegistroIPVR } from '../types';
import {
  TableProperties,
  Search,
  Filter,
  FileSpreadsheet,
  Printer,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Sliders,
  ChevronDown,
  Layers,
  ArrowUpDown,
  Download,
  Building2,
  Shield,
  BookOpen,
  Scale,
  FileDown,
  UploadCloud
} from 'lucide-react';

export const MatrizIPVR: React.FC = () => {
  const {
    records,
    orgData,
    deleteRecord,
    setEditingRecordId,
    setIsRecordModalOpen,
    setIsExcelImportModalOpen,
    exportMatrixCSV,
    exportMatrixExcel,
    exportMatrixPDF,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    filterProceso,
    setFilterProceso,
    filterPeligro,
    setFilterPeligro,
    filterNivelRiesgo,
    setFilterNivelRiesgo,
    filterAceptabilidad,
    setFilterAceptabilidad
  } = useIpvr();

  const [activeFilterRutinaria, setActiveFilterRutinaria] = useState<string>('TODOS');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<RegistroIPVR | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<RegistroIPVR | null>(null);

  // Extract unique filter options
  const procesos = Array.from(new Set(records.map(r => r.proceso).filter(Boolean)));
  const naturalezas = Array.from(new Set(records.map(r => r.naturalezaPeligro).filter(Boolean)));

  const filteredRecords = records.filter(r => {
    const matchSearch = !searchTerm || `${r.id} ${r.proceso} ${r.area} ${r.actividad} ${r.tarea} ${r.naturalezaPeligro} ${r.clasificacionPeligro} ${r.descripcionPeligro}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchProceso = !filterProceso || filterProceso === 'TODOS' || r.proceso === filterProceso;
    const matchPeligro = !filterPeligro || filterPeligro === 'TODOS' || r.naturalezaPeligro === filterPeligro;
    const matchNR = !filterNivelRiesgo || filterNivelRiesgo === 'TODOS' || r.valoracion?.nivelRiesgo === filterNivelRiesgo;
    const matchAcept = !filterAceptabilidad || filterAceptabilidad === 'TODOS' || (
      filterAceptabilidad === 'NO_ACEPTABLE' ? /No aceptable/i.test(r.valoracion?.aceptabilidad || '') :
      filterAceptabilidad === 'ACEPTABLE' ? /Aceptable/i.test(r.valoracion?.aceptabilidad || '') && !/No aceptable/i.test(r.valoracion?.aceptabilidad || '') :
      filterAceptabilidad === 'PENDIENTE' ? (!r.valoracion?.nr || r.valoracion.nr === 0) : true
    );
    const matchRutinaria = activeFilterRutinaria === 'TODOS' || r.rutinaria === activeFilterRutinaria;

    return matchSearch && matchProceso && matchPeligro && matchNR && matchAcept && matchRutinaria;
  });

  const handleEdit = (id: string) => {
    setEditingRecordId(id);
    setIsRecordModalOpen(true);
  };

  const handleNew = () => {
    setEditingRecordId(null);
    setIsRecordModalOpen(true);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Institutional Document Header Box (Bloque 01 Meta) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs">
              V3.1
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {orgData.empresa || orgData.razonSocial || 'ORGANIZACIÓN'} &bull; Matriz de Identificación de Peligros y Valoración de Riesgos (IPVR)
              </h2>
              <p className="text-xs text-slate-500">
                <b>Metodología:</b> {orgData.metodologia || 'GTC 45:2012'} | <b>Versión:</b> {orgData.versionMatriz || 'V3.1'} | <b>Actualización:</b> {orgData.fechaActualizacion || orgData.fechaElaboracion} | <b>NIT:</b> {orgData.nit || 'Sin registrar'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap no-print">
            <button
              onClick={() => setIsExcelImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/40 shadow-xs transition-colors cursor-pointer"
              title="Cargar y mapear archivo Excel a la matriz"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Cargar Excel</span>
            </button>

            <button
              onClick={handleNew}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuevo Peligro</span>
            </button>

            <button
              onClick={exportMatrixExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Descargar libro Excel (.xlsx) con todas las hojas, estilos y fórmulas GTC 45"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Excel (.xlsx)</span>
            </button>

            <button
              onClick={exportMatrixPDF}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Descargar documento PDF formal de la Matriz IPVR"
            >
              <FileDown className="w-4 h-4" />
              <span>Descargar PDF</span>
            </button>

            <button
              onClick={exportMatrixCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 shadow-xs transition-colors cursor-pointer"
              title="Descargar matriz técnica en formato CSV"
            >
              <span>CSV</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer"
              title="Imprimir vista de pantalla"
            >
              <Printer className="w-4 h-4 text-sky-600" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* Responsible & Approver Mini Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600">
          <div><b>Elaboró:</b> {orgData.elaboradoPor || orgData.responsableSST || 'Responsable SG-SST'} {orgData.licenciaSST ? `(${orgData.licenciaSST})` : ''}</div>
          <div><b>Revisó:</b> {orgData.revisadoPor || 'COPASST / Asesor SST'}</div>
          <div><b>Aprobó:</b> {orgData.aprobadoPor || 'Gerencia General'}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 no-print">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar en toda la matriz (ID, proceso, área, tarea, peligro, controles, medidas, etc.)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <select
              value={filterProceso}
              onChange={e => setFilterProceso(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium outline-none"
            >
              <option value="TODOS">Todos los Procesos</option>
              {procesos.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={filterPeligro}
              onChange={e => setFilterPeligro(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium outline-none"
            >
              <option value="TODOS">Todos los Peligros</option>
              {naturalezas.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <select
              value={filterNivelRiesgo}
              onChange={e => setFilterNivelRiesgo(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium outline-none"
            >
              <option value="TODOS">Nivel Riesgo (Todos)</option>
              <option value="I">Nivel I (4000 - 600)</option>
              <option value="II">Nivel II (500 - 150)</option>
              <option value="III">Nivel III (120 - 40)</option>
              <option value="IV">Nivel IV (20)</option>
            </select>

            <select
              value={filterAceptabilidad}
              onChange={e => setFilterAceptabilidad(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium outline-none"
            >
              <option value="TODOS">Aceptabilidad (Todas)</option>
              <option value="NO_ACEPTABLE">No Aceptables</option>
              <option value="ACEPTABLE">Aceptables</option>
              <option value="PENDIENTE">Pendientes Valoración</option>
            </select>

            <select
              value={activeFilterRutinaria}
              onChange={e => setActiveFilterRutinaria(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium outline-none"
            >
              <option value="TODOS">Rutinaria / No Rutinaria</option>
              <option value="Rutinaria">Rutinaria</option>
              <option value="No Rutinaria">No Rutinaria</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Mostrando <b>{filteredRecords.length}</b> de <b>{records.length}</b> registros de peligro</span>
          {(searchTerm || filterProceso || filterPeligro || filterNivelRiesgo || filterAceptabilidad || activeFilterRutinaria !== 'TODOS') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterProceso('TODOS');
                setFilterPeligro('TODOS');
                setFilterNivelRiesgo('TODOS');
                setFilterAceptabilidad('TODOS');
                setActiveFilterRutinaria('TODOS');
              }}
              className="text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Main Consolidated GTC 45 V3.1 Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[660px]">
          <table className="w-full text-xs text-left border-collapse min-w-[1700px]">
            {/* Multi-Tier Table Header */}
            <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 z-10 shadow-xs">
              {/* Level 1 Group Headers */}
              <tr className="border-b border-slate-300 text-center text-[11px] uppercase tracking-wider bg-slate-200">
                <th colSpan={6} className="p-2 border-r border-slate-300 text-slate-800 bg-slate-200">
                  02 · IDENTIFICACIÓN DEL PELIGRO Y CONTEXTO
                </th>
                <th colSpan={3} className="p-2 border-r border-slate-300 text-slate-800 bg-slate-100">
                  CONTROLES EXISTENTES
                </th>
                <th colSpan={8} className="p-2 border-r border-slate-300 text-slate-800 bg-emerald-100/80">
                  03 · EVALUACIÓN Y VALORACIÓN DEL RIESGO (GTC 45)
                </th>
                <th colSpan={3} className="p-2 border-r border-slate-300 text-slate-800 bg-slate-200">
                  CRITERIOS CONTROLES
                </th>
                <th colSpan={5} className="p-2 border-r border-slate-300 text-slate-800 bg-amber-100/80">
                  MEDIDAS DE INTERVENCIÓN (JERARQUÍA)
                </th>
                <th className="p-2 text-slate-800 no-print">ACCIONES</th>
              </tr>

              {/* Level 2 Detailed Column Headers */}
              <tr className="border-b border-slate-300 text-[11px] bg-slate-100 divide-x divide-slate-200">
                <th className="p-2.5 font-bold min-w-[85px]">ID</th>
                <th className="p-2.5 min-w-[140px]">Proceso / Área</th>
                <th className="p-2.5 min-w-[160px]">Actividad / Tarea</th>
                <th className="p-2.5 min-w-[90px]">Rutinaria</th>
                <th className="p-2.5 min-w-[180px]">Peligro (Clasificación + Descripción)</th>
                <th className="p-2.5 min-w-[160px]">Efectos Posibles</th>

                {/* Controles Existentes (Separados: Fuente, Medio, Individuo) */}
                <th className="p-2.5 min-w-[120px]">Fuente</th>
                <th className="p-2.5 min-w-[120px]">Medio</th>
                <th className="p-2.5 min-w-[130px]">Individuo / EPP</th>

                {/* 03 Valoración GTC 45 */}
                <th className="p-2.5 text-center min-w-[45px] bg-emerald-50 font-bold" title="Nivel de Deficiencia">ND</th>
                <th className="p-2.5 text-center min-w-[45px] bg-emerald-50 font-bold" title="Nivel de Exposición">NE</th>
                <th className="p-2.5 text-center min-w-[55px] bg-emerald-50 font-bold" title="Nivel de Probabilidad (ND x NE)">NP</th>
                <th className="p-2.5 min-w-[95px] bg-emerald-50 font-semibold" title="Interpretación del Nivel de Probabilidad">Interp. NP</th>
                <th className="p-2.5 text-center min-w-[45px] bg-emerald-50 font-bold" title="Nivel de Consecuencia">NC</th>
                <th className="p-2.5 text-center min-w-[65px] bg-emerald-100 font-bold" title="Nivel de Riesgo (NP x NC)">NR</th>
                <th className="p-2.5 text-center min-w-[60px] bg-emerald-100 font-bold">Nivel</th>
                <th className="p-2.5 min-w-[140px] bg-emerald-100 font-semibold">Aceptabilidad & Interp. NR</th>

                {/* Criterios para Controles */}
                <th className="p-2.5 min-w-[65px] text-center" title="Número de trabajadores expuestos">Nº Exp</th>
                <th className="p-2.5 min-w-[130px]">Peor Consecuencia</th>
                <th className="p-2.5 min-w-[130px]">Requisito Legal Específico</th>

                {/* Medidas de Intervención (Jerarquía) */}
                <th className="p-2.5 min-w-[120px] bg-amber-50 font-semibold">Eliminación</th>
                <th className="p-2.5 min-w-[120px] bg-amber-50 font-semibold">Sustitución</th>
                <th className="p-2.5 min-w-[130px] bg-amber-50 font-semibold">C. Ingeniería</th>
                <th className="p-2.5 min-w-[140px] bg-amber-50 font-semibold">C. Administrativo</th>
                <th className="p-2.5 min-w-[120px] bg-amber-50 font-semibold">Equipos / EPP</th>

                <th className="p-2.5 text-center min-w-[90px] no-print">Opciones</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={24} className="text-center py-10 text-slate-400 italic">
                    No hay registros en la matriz que coincidan con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(r => {
                  const isNivelI = r.valoracion?.nivelRiesgo === 'I';
                  const isNivelII = r.valoracion?.nivelRiesgo === 'II';
                  const isNivelIII = r.valoracion?.nivelRiesgo === 'III';

                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors divide-x divide-slate-100">
                      {/* ID */}
                      <td className="p-2.5 font-bold font-mono text-slate-900 whitespace-nowrap">
                        {r.id}
                      </td>

                      {/* Proceso / Sede */}
                      <td className="p-2.5 text-slate-800">
                        <span className="font-semibold block">{r.proceso}</span>
                        <span className="text-[11px] text-slate-500">{r.area}</span>
                      </td>

                      {/* Actividad / Tarea */}
                      <td className="p-2.5 text-slate-700">
                        <span className="font-medium block">{r.tarea}</span>
                        <span className="text-[11px] text-slate-500">{r.actividad}</span>
                      </td>

                      {/* Rutinaria */}
                      <td className="p-2.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          r.rutinaria === 'Rutinaria' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.rutinaria}
                        </span>
                      </td>

                      {/* Bloque 02: Peligro (Clasificación + Descripción) */}
                      <td className="p-2.5 text-slate-800">
                        <span className="font-bold text-emerald-800 block text-[11px]">
                          {r.naturalezaPeligro} &bull; {r.clasificacionPeligro}
                        </span>
                        <span className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{r.descripcionPeligro}</span>
                        {r.fuenteGeneradora && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">Fuente: {r.fuenteGeneradora}</span>
                        )}
                      </td>

                      {/* Efectos Posibles */}
                      <td className="p-2.5 text-slate-600 text-[11px] max-w-xs">
                        {r.efectosPosibles}
                      </td>

                      {/* Controles Existentes (Separados) */}
                      <td className="p-2.5 text-[11px] text-slate-600">{r.controlesExistentes.fuente || '—'}</td>
                      <td className="p-2.5 text-[11px] text-slate-600">{r.controlesExistentes.medio || '—'}</td>
                      <td className="p-2.5 text-[11px] text-slate-600">{r.controlesExistentes.individuo || r.controlesExistentes.administrativo || '—'}</td>

                      {/* 03 Valoración GTC 45 */}
                      <td className="p-2.5 text-center font-bold bg-emerald-50/50">{r.valoracion?.nd ?? '—'}</td>
                      <td className="p-2.5 text-center font-bold bg-emerald-50/50">{r.valoracion?.ne ?? '—'}</td>
                      <td className="p-2.5 text-center font-bold text-emerald-800 bg-emerald-50">{r.valoracion?.np ?? '—'}</td>
                      <td className="p-2.5 text-[11px] font-medium bg-emerald-50/50 whitespace-nowrap">{r.valoracion?.interpretacionNP ?? '—'}</td>
                      <td className="p-2.5 text-center font-bold bg-emerald-50/50">{r.valoracion?.nc ?? '—'}</td>
                      <td className={`p-2.5 text-center font-black ${
                        isNivelI ? 'bg-red-100 text-red-800' :
                        isNivelII ? 'bg-amber-100 text-amber-800' :
                        isNivelIII ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.valoracion?.nr ?? '—'}
                      </td>
                      <td className="p-2.5 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isNivelI ? 'bg-red-600 text-white' :
                          isNivelII ? 'bg-amber-600 text-white' :
                          isNivelIII ? 'bg-blue-600 text-white' :
                          'bg-emerald-600 text-white'
                        }`}>
                          {r.valoracion?.nivelRiesgo ?? '—'}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold block whitespace-nowrap ${
                          isNivelI ? 'bg-red-100 text-red-800 border border-red-200' :
                          isNivelII ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          isNivelIII ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {r.valoracion?.aceptabilidad ?? 'Pendiente'}
                        </span>
                        {r.valoracion?.interpretacionNR && (
                          <span className="text-[10px] text-slate-500 block mt-0.5 line-clamp-1">
                            {r.valoracion.interpretacionNR}
                          </span>
                        )}
                      </td>

                      {/* Criterios */}
                      <td className="p-2.5 text-center font-bold text-slate-700">{r.expuestosTotal || 1}</td>
                      <td className="p-2.5 text-[11px] text-slate-600 max-w-xs">{r.criterios?.peorConsecuencia || '—'}</td>
                      <td className="p-2.5 text-[11px] text-slate-600">{r.criterios?.requisitoLegalEspecifico || r.criterios?.requisitoLegal || '—'}</td>

                      {/* Medidas (Jerarquía) */}
                      <td className="p-2.5 text-[11px] text-slate-600 bg-amber-50/20">{r.medidas?.eliminacion || '—'}</td>
                      <td className="p-2.5 text-[11px] text-slate-600 bg-amber-50/20">{r.medidas?.sustitucion || '—'}</td>
                      <td className="p-2.5 text-[11px] text-slate-600 bg-amber-50/20">{r.medidas?.controlIngenieria || '—'}</td>
                      <td className="p-2.5 text-[11px] text-slate-600 bg-amber-50/20">{r.medidas?.controlAdministrativo || '—'}</td>
                      <td className="p-2.5 text-[11px] text-slate-600 bg-amber-50/20">{r.medidas?.epp || '—'}</td>

                      {/* Actions */}
                      <td className="p-2.5 text-center no-print whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedRecordForDetail(r)}
                            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                            title="Ver ficha técnica completa"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(r.id)}
                            className="p-1 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded cursor-pointer"
                            title="Editar registro"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setRecordToDelete(r)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Hazard Deletion */}
      {recordToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-50 rounded-full border border-red-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">¿Eliminar Peligro de la Matriz?</h3>
                <p className="text-xs text-slate-500">Esta acción removerá el registro de la Matriz IPVR.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1">
              <div className="font-mono font-bold text-slate-800 flex items-center gap-2">
                <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[11px]">{recordToDelete.id}</span>
                {recordToDelete.codigoInterno && (
                  <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">{recordToDelete.codigoInterno}</span>
                )}
                <span>{recordToDelete.clasificacionPeligro}</span>
              </div>
              <p className="text-slate-600"><b>Proceso:</b> {recordToDelete.proceso} &bull; {recordToDelete.area}</p>
              <p className="text-slate-500 italic text-[11px] line-clamp-2">"{recordToDelete.descripcionPeligro || recordToDelete.tarea}"</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteRecord(recordToDelete.id);
                  setRecordToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Sí, Eliminar Registro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row Technical Sheet Detail Modal */}
      {selectedRecordForDetail && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded">
                  {selectedRecordForDetail.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedRecordForDetail.naturalezaPeligro} &bull; {selectedRecordForDetail.clasificacionPeligro}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Contexto y Actividad */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-500 block font-medium">Proceso</span>
                <span className="font-bold text-slate-800">{selectedRecordForDetail.proceso}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-500 block font-medium">Área / Sede</span>
                <span className="font-bold text-slate-800">{selectedRecordForDetail.area}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-500 block font-medium">Actividad</span>
                <span className="font-bold text-slate-800">{selectedRecordForDetail.actividad}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-500 block font-medium">Tarea ({selectedRecordForDetail.rutinaria})</span>
                <span className="font-bold text-slate-800">{selectedRecordForDetail.tarea}</span>
              </div>
            </div>

            {/* Peligro y Efectos */}
            <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-2">
              <div>
                <b className="text-slate-800">Descripción Detallada del Peligro:</b>
                <p className="text-slate-600 mt-0.5">{selectedRecordForDetail.descripcionPeligro}</p>
              </div>
              <div>
                <b className="text-slate-800">Efectos Posibles a la Salud:</b>
                <p className="text-slate-600 mt-0.5">{selectedRecordForDetail.efectosPosibles}</p>
              </div>
              {selectedRecordForDetail.fuenteGeneradora && (
                <div>
                  <b className="text-slate-800">Fuente Generadora:</b>
                  <p className="text-slate-600 mt-0.5">{selectedRecordForDetail.fuenteGeneradora}</p>
                </div>
              )}
            </div>

            {/* Controles Existentes */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
              <b className="text-slate-800 block border-b border-slate-200 pb-1">Controles Existentes (Implementados):</b>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div><b>Fuente:</b> {selectedRecordForDetail.controlesExistentes.fuente || 'Ninguno'}</div>
                <div><b>Medio:</b> {selectedRecordForDetail.controlesExistentes.medio || 'Ninguno'}</div>
                <div><b>Individuo / EPP:</b> {selectedRecordForDetail.controlesExistentes.individuo || selectedRecordForDetail.controlesExistentes.administrativo || 'Ninguno'}</div>
              </div>
            </div>

            {/* Valoración Cuantitativa GTC 45 */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <b>Valoración GTC 45:</b> ND={selectedRecordForDetail.valoracion?.nd} &bull; NE={selectedRecordForDetail.valoracion?.ne} &bull; NP={selectedRecordForDetail.valoracion?.np} ({selectedRecordForDetail.valoracion?.interpretacionNP}) &bull; NC={selectedRecordForDetail.valoracion?.nc}
                </div>
                <span className="font-bold px-2 py-0.5 bg-white rounded border">
                  NR {selectedRecordForDetail.valoracion?.nr} &bull; Nivel {selectedRecordForDetail.valoracion?.nivelRiesgo}
                </span>
              </div>
              <div className="text-sm font-bold text-emerald-950">
                Aceptabilidad: {selectedRecordForDetail.valoracion?.aceptabilidad}
              </div>
              {selectedRecordForDetail.valoracion?.interpretacionNR && (
                <p className="text-[11px] text-slate-700"><b>Interpretación NR:</b> {selectedRecordForDetail.valoracion.interpretacionNR}</p>
              )}
            </div>

            {/* Criterios */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <b className="text-slate-800">Criterios para Establecer Controles:</b>
              <div>&bull; <b>No. Expuestos:</b> {selectedRecordForDetail.expuestosTotal || 1} (Directos: {selectedRecordForDetail.expuestosDirectos}, Contratistas: {selectedRecordForDetail.expuestosContratistas}, Temporales: {selectedRecordForDetail.expuestosTemporales || 0})</div>
              <div>&bull; <b>Peor Consecuencia:</b> {selectedRecordForDetail.criterios?.peorConsecuencia || selectedRecordForDetail.efectosPosibles}</div>
              <div>&bull; <b>Requisito Legal Específico:</b> {selectedRecordForDetail.criterios?.requisitoLegalEspecifico || selectedRecordForDetail.criterios?.requisitoLegal || 'No especificado'}</div>
            </div>

            {/* Medidas de Intervención */}
            <div className="text-xs space-y-2">
              <b className="text-slate-800">Medidas de Intervención Planificadas (Jerarquía):</b>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li><b>1. Eliminación:</b> {selectedRecordForDetail.medidas?.eliminacion || 'No aplica'}</li>
                <li><b>2. Sustitución:</b> {selectedRecordForDetail.medidas?.sustitucion || 'No aplica'}</li>
                <li><b>3. Control de Ingeniería:</b> {selectedRecordForDetail.medidas?.controlIngenieria || 'No aplica'}</li>
                <li><b>4. Control Administrativo / Señalización:</b> {selectedRecordForDetail.medidas?.controlAdministrativo || 'No aplica'}</li>
                <li><b>5. Equipos / EPP:</b> {selectedRecordForDetail.medidas?.epp || 'No aplica'}</li>
              </ul>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 gap-2">
              <button
                onClick={() => {
                  const id = selectedRecordForDetail.id;
                  setSelectedRecordForDetail(null);
                  handleEdit(id);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Editar Registro
              </button>
              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
