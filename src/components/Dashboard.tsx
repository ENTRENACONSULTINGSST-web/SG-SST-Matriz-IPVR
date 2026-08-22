import React from 'react';
import { useIpvr } from '../context/IpvrContext';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Plus,
  FileSpreadsheet,
  Building,
  Target,
  Sparkles,
  Sliders,
  FileDown,
  Download,
  Printer
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    records,
    actions,
    orgData,
    setActiveTab,
    setIsRecordModalOpen,
    setEditingRecordId,
    setIsActionModalOpen,
    setEditingActionId,
    exportMatrixCSV,
    exportMatrixExcel,
    exportMatrixPDF,
    exportMatrixDOCX
  } = useIpvr();

  // Computations for KPIs
  const totalPeligros = records.length;
  const pendientesValoracion = records.filter(r => !r.valoracion || !r.valoracion.nr || r.valoracion.nr === 0).length;
  const nivelI = records.filter(r => r.valoracion?.nivelRiesgo === 'I').length;
  const nivelII = records.filter(r => r.valoracion?.nivelRiesgo === 'II').length;
  const nivelIII = records.filter(r => r.valoracion?.nivelRiesgo === 'III').length;
  const nivelIV = records.filter(r => r.valoracion?.nivelRiesgo === 'IV').length;

  const noAceptables = records.filter(r => /No aceptable/i.test(r.valoracion?.aceptabilidad || '')).length;

  const totalAcciones = actions.length;
  const accionesAbiertas = actions.filter(a => a.estado !== 'Cerrada').length;
  const accionesCerradas = actions.filter(a => a.estado === 'Cerrada').length;
  const accionesEficaces = actions.filter(a => a.eficacia === 'Eficaz').length;
  const porcentajeCumplimiento = totalAcciones > 0 ? Math.round((accionesCerradas / totalAcciones) * 100) : 0;
  const porcentajeEficacia = totalAcciones > 0 ? Math.round((accionesEficaces / totalAcciones) * 100) : 0;

  // Breakdown by Hazard Nature
  const hazardsByNature = records.reduce((acc, r) => {
    const nat = r.naturalezaPeligro || 'Otro';
    acc[nat] = (acc[nat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const natureColors: Record<string, string> = {
    'Biológico': 'bg-emerald-500',
    'Físico': 'bg-blue-500',
    'Químico': 'bg-purple-500',
    'Psicosocial': 'bg-pink-500',
    'Biomecánico': 'bg-amber-500',
    'Condiciones de Seguridad': 'bg-red-500',
    'Fenómenos Naturales': 'bg-teal-500'
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Company Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Sistema de Gestión SST
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-slate-600 font-medium">Metodología GTC 45 / Dec. 1072</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {orgData.empresa || orgData.razonSocial || 'Razón Social de la Empresa'}
            {orgData.nit ? <span className="text-sm font-normal text-slate-500 ml-2">NIT: {orgData.nit}</span> : null}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Responsable SST: <strong className="font-semibold text-slate-700">{orgData.responsableSST || 'Por asignar'}</strong></span>
            <span>&bull;</span>
            <span>Planta Total: <strong className="font-semibold text-emerald-700">{(Number(orgData.numTrabajadores) || 0) + (Number(orgData.numContratistas) || 0) + (Number(orgData.numTemporales) || 0)} trabajadores</strong> ({orgData.numTrabajadores || 0} directos, {orgData.numContratistas || 0} contratistas, {orgData.numTemporales || 0} temporales)</span>
            <span>&bull;</span>
            <span>Clase de Riesgo: <strong className="font-semibold text-slate-700">{orgData.claseRiesgo || 'I'}</strong></span>
            {orgData.centroPrincipal ? (
              <>
                <span>&bull;</span>
                <span>Sede: <strong className="font-semibold text-slate-700">{orgData.centroPrincipal}</strong></span>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setEditingRecordId(null);
              setIsRecordModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Identificar Peligro</span>
          </button>

          <button
            onClick={() => {
              setEditingActionId(null);
              setIsActionModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Acción</span>
          </button>
        </div>
      </div>

      {/* Institutional Document Download Hub */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-xl p-4 text-white shadow-sm border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              DESCARGA DE INFORMES FORMALES
            </span>
            <span className="text-xs text-slate-300">GTC 45:2012 &bull; Decreto 1072</span>
          </div>
          <h3 className="text-sm font-bold text-white mt-1">
            Exportar todo el formato, gráficas, KPIs y Matriz de Calor consolidada
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Genera documentos completos y oficiales con todas las tablas, cálculos y evaluaciones del sistema.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-dash-export-docx"
            onClick={exportMatrixDOCX}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
            title="Descargar informe ejecutivo formal en Microsoft Word (.docx)"
          >
            <FileDown className="w-4 h-4 text-white" />
            <span>Informe Word (.docx)</span>
          </button>

          <button
            id="btn-dash-export-pdf"
            onClick={exportMatrixPDF}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
            title="Descargar informe oficial en PDF con portada ejecutiva y matriz técnica"
          >
            <FileDown className="w-4 h-4 text-white" />
            <span>Informe PDF</span>
          </button>

          <button
            id="btn-dash-export-excel"
            onClick={exportMatrixExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
            title="Descargar libro Excel (.xlsx) con 6 hojas, Dashboard y Matriz de Calor"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>Excel Completo (6 Hojas)</span>
          </button>
        </div>
      </div>

      {/* 5 Main KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* KPI 1 */}
        <div 
          onClick={() => setActiveTab('bloque2')} 
          className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Peligros</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalPeligros}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Ver bloque 02</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => setActiveTab('bloque3')}
          className="bg-white rounded-xl border border-red-200 bg-red-50/20 p-4 shadow-xs hover:border-red-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-700">No Aceptables (I)</span>
            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-700 mt-2">{nivelI}</div>
          <div className="text-[11px] text-red-600/80 mt-1">
            {nivelI > 0 ? 'Intervención urgente' : 'Controlados'}
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => setActiveTab('bloque3')}
          className="bg-white rounded-xl border border-amber-200 bg-amber-50/20 p-4 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-800">Pend. Valoración</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 group-hover:bg-amber-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-800 mt-2">{pendientesValoracion}</div>
          <div className="text-[11px] text-amber-700/80 mt-1">
            {pendientesValoracion > 0 ? 'Requieren ND/NE/NC' : '100% Valorados'}
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => setActiveTab('bloque4')}
          className="bg-white rounded-xl border border-blue-200 bg-blue-50/20 p-4 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-700">Acciones Abiertas</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-800 mt-2">{accionesAbiertas}</div>
          <div className="text-[11px] text-blue-700/80 mt-1">
            {accionesAbiertas} en ejecución / verif.
          </div>
        </div>

        {/* KPI 5 */}
        <div 
          onClick={() => setActiveTab('bloque4')}
          className="bg-white rounded-xl border border-emerald-200 bg-emerald-50/20 p-4 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-800">Cumplimiento</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-800 mt-2">{porcentajeCumplimiento}%</div>
          <div className="text-[11px] text-emerald-700/80 mt-1">
            {accionesCerradas} de {totalAcciones} cerradas
          </div>
        </div>
      </div>

      {/* Main 4 Blocks Architecture Road */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Arquitectura Funcional IPVR (GTC 45)</h3>
            <p className="text-xs text-slate-500">Flujo de 4 bloques estandarizado con catálogos internos encapsulados</p>
          </div>
          <button
            onClick={() => setActiveTab('matriz')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Matriz Completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Block 01 */}
          <div 
            onClick={() => setActiveTab('bloque1')}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                01
              </span>
              <Building className="w-4 h-4 text-slate-500" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">Organización</h4>
            <p className="text-xs text-slate-500 mt-0.5">Control documental, sedes, responsables y catálogos admin.</p>
            <div className="mt-3 text-[11px] font-medium text-slate-700 flex items-center gap-1">
              <span>{orgData.centrosTrabajo?.length || 0} Sedes registradas</span>
            </div>
          </div>

          {/* Block 02 */}
          <div 
            onClick={() => setActiveTab('bloque2')}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                02
              </span>
              <Target className="w-4 h-4 text-slate-500" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">Identificación</h4>
            <p className="text-xs text-slate-500 mt-0.5">Proceso → Área → Tarea → Exposición → Peligro GTC 45.</p>
            <div className="mt-3 text-[11px] font-medium text-emerald-700 flex items-center gap-1">
              <span>{records.length} Peligros catalogados</span>
            </div>
          </div>

          {/* Block 03 */}
          <div 
            onClick={() => setActiveTab('bloque3')}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                03
              </span>
              <Sliders className="w-4 h-4 text-slate-500" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">Valoración y Controles</h4>
            <p className="text-xs text-slate-500 mt-0.5">ND × NE = NP &bull; NP × NC = NR e intervención jerárquica.</p>
            <div className="mt-3 text-[11px] font-medium text-indigo-700 flex items-center gap-1">
              <span>{records.filter(r => r.valoracion?.nr > 0).length} Evaluados matemáticamente</span>
            </div>
          </div>

          {/* Block 04 */}
          <div 
            onClick={() => setActiveTab('bloque4')}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                04
              </span>
              <CheckCircle2 className="w-4 h-4 text-slate-500" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">Seguimiento</h4>
            <p className="text-xs text-slate-500 mt-0.5">Plan de acción, responsables, fechas, evidencias y eficacia.</p>
            <div className="mt-3 text-[11px] font-medium text-amber-700 flex items-center gap-1">
              <span>{actions.length} Acciones registradas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Split section: Risk Distribution & GTC 45 Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Risk Level Distribution & Hazard Natures */}
        <div className="lg:col-span-5 space-y-5">
          {/* Risk Level Gauge Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Distribución por Nivel de Riesgo (NR)</span>
              <span className="text-xs font-normal text-slate-500">{records.length} evaluados</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-red-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
                    Nivel I · No Aceptable (4000 - 600)
                  </span>
                  <span className="text-slate-700">{nivelI} ({totalPeligros ? Math.round((nivelI / totalPeligros) * 100) : 0}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 rounded-full transition-all duration-500"
                    style={{ width: `${totalPeligros ? (nivelI / totalPeligros) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                    Nivel II · No Aceptable / Control Esp. (500 - 150)
                  </span>
                  <span className="text-slate-700">{nivelII} ({totalPeligros ? Math.round((nivelII / totalPeligros) * 100) : 0}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalPeligros ? (nivelII / totalPeligros) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-blue-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                    Nivel III · Mejorable (120 - 40)
                  </span>
                  <span className="text-slate-700">{nivelIII} ({totalPeligros ? Math.round((nivelIII / totalPeligros) * 100) : 0}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalPeligros ? (nivelIII / totalPeligros) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                    Nivel IV · Aceptable (20)
                  </span>
                  <span className="text-slate-700">{nivelIV} ({totalPeligros ? Math.round((nivelIV / totalPeligros) * 100) : 0}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${totalPeligros ? (nivelIV / totalPeligros) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hazard Nature Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Clasificación de Peligros Identificados</h3>
            <div className="space-y-2">
              {Object.keys(hazardsByNature).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No hay peligros registrados aún.</p>
              ) : (
                (Object.entries(hazardsByNature) as [string, number][]).map(([nature, count]) => {
                  const pct = totalPeligros ? Math.round(((count as number) / totalPeligros) * 100) : 0;
                  const dotColor = natureColors[nature] || 'bg-slate-500';
                  return (
                    <div key={nature} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
                        <span className="font-medium text-slate-700">{nature}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{count}</span>
                        <span className="text-slate-400 text-[11px]">({pct}%)</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Matriz de Calor GTC 45 (Probabilidad vs Consecuencia) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Matriz de Calor GTC 45 (Probabilidad × Consecuencia)
                </h3>
                <span className="text-xs text-slate-500 font-medium">Evaluación Cruzada</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Ubicación de los peligros registrados según su Nivel de Probabilidad (NP) y Nivel de Consecuencia (NC).
              </p>

              {/* Heatmap Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border border-slate-200 bg-slate-100 font-semibold text-slate-700 text-left">
                        Nivel de Consecuencia (NC) ↓ \ Probabilidad (NP) →
                      </th>
                      <th className="p-2 border border-slate-200 bg-slate-100 font-semibold text-slate-700">
                        Muy Alto (40 - 24)
                      </th>
                      <th className="p-2 border border-slate-200 bg-slate-100 font-semibold text-slate-700">
                        Alto (20 - 10)
                      </th>
                      <th className="p-2 border border-slate-200 bg-slate-100 font-semibold text-slate-700">
                        Medio (8 - 6)
                      </th>
                      <th className="p-2 border border-slate-200 bg-slate-100 font-semibold text-slate-700">
                        Bajo (4 - 2)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* NC = 100 */}
                    <tr>
                      <td className="p-2 border border-slate-200 bg-slate-50 font-medium text-slate-700 text-left">
                        <b>Mortal (100)</b>
                      </td>
                      <td className="p-3 border border-slate-200 bg-red-600 text-white font-bold">
                        I (4000-2400)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 100 && (r.valoracion?.np || 0) >= 24).length} peligros
                        </div>
                      </td>
                      <td className="p-3 border border-slate-200 bg-red-600 text-white font-bold">
                        I (2000-1000)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 100 && (r.valoracion?.np || 0) >= 10 && (r.valoracion?.np || 0) < 24).length} peligros
                        </div>
                      </td>
                      <td className="p-3 border border-slate-200 bg-red-600 text-white font-bold">
                        I (800-600)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 100 && (r.valoracion?.np || 0) >= 6 && (r.valoracion?.np || 0) < 10).length} peligros
                        </div>
                      </td>
                      <td className="p-3 border border-slate-200 bg-amber-500 text-white font-bold">
                        II (400-200)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 100 && (r.valoracion?.np || 0) < 6).length} peligros
                        </div>
                      </td>
                    </tr>

                    {/* NC = 60 */}
                    <tr>
                      <td className="p-2 border border-slate-200 bg-slate-50 font-medium text-slate-700 text-left">
                        <b>Muy Grave (60)</b>
                      </td>
                      <td className="p-3 border border-slate-200 bg-red-600 text-white font-bold">
                        I (2400-1440)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 60 && (r.valoracion?.np || 0) >= 24).length} peligros
                        </div>
                      </td>
                      <td className="p-3 border border-slate-200 bg-red-600 text-white font-bold">
                        I (1200-600)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 60 && (r.valoracion?.np || 0) >= 10 && (r.valoracion?.np || 0) < 24).length} peligros
                        </div>
                      </td>
                      <td className="p-3 border border-slate-200 bg-amber-500 text-white font-bold">
                        II (480-360)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 60 && (r.valoracion?.np || 0) >= 6 && (r.valoracion?.np || 0) < 10).length} peligros
                        </div>
                      </td>
                      <td className="p-3 border border-slate-200 bg-amber-500 text-white font-bold">
                        II (240-120)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 60 && (r.valoracion?.np || 0) < 6).length} peligros
                        </div>
                      </td>
                    </tr>

                    {/* NC = 25 */}
                    <tr>
                      <td className="p-2 border border-slate-200 bg-slate-50 font-medium text-slate-700 text-left">
                        <b>Grave (25)</b>
                      </td>
                      <td className="p-3 border border-slate-200 bg-red-600 text-white font-bold">
                        I (1000-600)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 25 && (r.valoracion?.np || 0) >= 24).length} peligros
                        </div>
                      </td>
                      <td className="p-3 border border-slate-200 bg-amber-500 text-white font-bold">
                        II (500-250)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 25 && (r.valoracion?.np || 0) >= 10 && (r.valoracion?.np || 0) < 24).length} peligros
                        </div>
                      </td>
                      <td className="p-3 border border-slate-200 bg-amber-500 text-white font-bold">
                        II (200-150)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 25 && (r.valoracion?.np || 0) >= 6 && (r.valoracion?.np || 0) < 10).length} peligros
                        </div>
                      </td>
                      <td className="p-3 border border-slate-200 bg-blue-500 text-white font-bold">
                        III (100-50)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 25 && (r.valoracion?.np || 0) < 6).length} peligros
                        </div>
                      </td>
                    </tr>

                    {/* NC = 10 */}
                    <tr>
                      <td className="p-2 border border-slate-200 bg-slate-50 font-medium text-slate-700 text-left">
                        <b>Leve (10)</b>
                      </td>
                      <td className="p-3 border border-slate-200 bg-amber-500 text-white font-bold">
                        II (400-240)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 10 && (r.valoracion?.np || 0) >= 24).length} peligros
                        </div>
                      </td>
                      <td className="p-3 border border-slate-200 bg-blue-500 text-white font-bold">
                        III (200-100)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 10 && (r.valoracion?.np || 0) >= 10 && (r.valoracion?.np || 0) < 24).length} peligros
                        </div>
                      </td>
                      <td className="p-3 border border-slate-200 bg-blue-500 text-white font-bold">
                        III (80-60)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 10 && (r.valoracion?.np || 0) >= 6 && (r.valoracion?.np || 0) < 10).length} peligros
                        </div>
                      </td>
                      <td className="p-3 border border-slate-200 bg-emerald-600 text-white font-bold">
                        IV (40-20)
                        <div className="text-[11px] font-normal opacity-90">
                          {records.filter(r => r.valoracion?.nc === 10 && (r.valoracion?.np || 0) < 6).length} peligros
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Matrix Legend */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs flex-wrap gap-2 text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-600 rounded"></span>
                <span>Nivel I (No Aceptable)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-amber-500 rounded"></span>
                <span>Nivel II (Control Específico)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-blue-500 rounded"></span>
                <span>Nivel III (Mejorable)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-600 rounded"></span>
                <span>Nivel IV (Aceptable)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Plan Summary Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Últimas Acciones de Seguimiento (Bloque 04)</h3>
            <p className="text-xs text-slate-500">Monitoreo de medidas preventivas y correctivas en ejecución</p>
          </div>
          <button
            onClick={() => setActiveTab('bloque4')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Plan Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="py-2.5 px-3 font-semibold">ID</th>
                <th className="py-2.5 px-3 font-semibold">Peligro Asociado</th>
                <th className="py-2.5 px-3 font-semibold">Jerarquía</th>
                <th className="py-2.5 px-3 font-semibold">Medida Propuesta</th>
                <th className="py-2.5 px-3 font-semibold">Responsable</th>
                <th className="py-2.5 px-3 font-semibold">Fecha Límite</th>
                <th className="py-2.5 px-3 font-semibold">Estado</th>
                <th className="py-2.5 px-3 font-semibold">Eficacia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {actions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-slate-400">
                    No hay acciones de seguimiento registradas.
                  </td>
                </tr>
              ) : (
                actions.slice(0, 5).map(act => (
                  <tr key={act.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-800">{act.id}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">{act.peligroResumen || act.ipvrId}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {act.jerarquia}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={act.descripcionAccion}>
                      {act.descripcionAccion}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{act.responsable}</td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{act.fechaLimite}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        act.estado === 'Cerrada' ? 'bg-emerald-100 text-emerald-800' :
                        act.estado === 'En ejecución' ? 'bg-blue-100 text-blue-800' :
                        act.estado === 'Verificación' ? 'bg-purple-100 text-purple-800' :
                        act.estado === 'Vencida' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {act.estado}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        act.eficacia === 'Eficaz' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        act.eficacia === 'Parcialmente eficaz' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        act.eficacia === 'No eficaz' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'text-slate-400'
                      }`}>
                        {act.eficacia}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
