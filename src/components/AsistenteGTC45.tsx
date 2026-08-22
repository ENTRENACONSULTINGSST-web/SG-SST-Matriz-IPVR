import React, { useState } from 'react';
import { useIpvr } from '../context/IpvrContext';
import {
  Sparkles,
  Calculator,
  ShieldCheck,
  BookOpen,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  Plus,
  TableProperties,
  Scale,
  Layers
} from 'lucide-react';
import {
  ND_OPTIONS,
  NE_OPTIONS,
  NC_OPTIONS,
  calcularNP,
  calcularNR
} from '../data/gtc45Data';
import { NivelDeficiencia, NivelExposicion, NivelConsecuencia } from '../types';

export const AsistenteGTC45: React.FC = () => {
  const {
    records,
    actions,
    orgData,
    setActiveTab,
    setIsRecordModalOpen,
    setEditingRecordId
  } = useIpvr();

  // Interactive Live Simulator State
  const [simND, setSimND] = useState<NivelDeficiencia>(6);
  const [simNE, setSimNE] = useState<NivelExposicion>(3);
  const [simNC, setSimNC] = useState<NivelConsecuencia>(25);

  const { np, interpretacion: interpNP } = calcularNP(simND, simNE);
  const { nr, nivelRiesgo, interpretacionNR, aceptabilidad, significadoNR } = calcularNR(np, simNC);

  // Diagnostic calculations
  const total = records.length;
  const sinValorar = records.filter(r => !r.valoracion?.nr || r.valoracion.nr === 0).length;
  const nivelI = records.filter(r => r.valoracion?.nivelRiesgo === 'I').length;
  const sinControles = records.filter(r => 
    !r.controlesExistentes.fuente && !r.controlesExistentes.medio && !r.controlesExistentes.individuo
  ).length;
  const sinMedidas = records.filter(r =>
    !r.medidas?.eliminacion && !r.medidas?.sustitucion && !r.medidas?.controlIngenieria && !r.medidas?.controlAdministrativo && !r.medidas?.epp
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Asistente Técnico y Diagnóstico GTC 45:2012</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Herramienta interactiva de simulación matemática, auditoría técnica de calidad de matriz y guía de aplicación para el SG-SST.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingRecordId(null);
            setIsRecordModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Peligro</span>
        </button>
      </div>

      {/* Grid: Matrix Health Diagnostic & GTC 45 Interactive Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Matrix Quality Audit */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Auditoría de Calidad de la Matriz IPVR</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {total} Peligros registrados
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Checklist Item 1: Metodología */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start justify-between gap-3">
              <div>
                <b className="text-slate-800 block">1. Control de Metodología y Versión (Bloque 01)</b>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Metodología: <b>{orgData.metodologia || 'GTC 45:2012'}</b> &bull; Versión: <b>{orgData.versionMatriz || 'V3.1'}</b> &bull; Empresa: <b>{orgData.empresa}</b>
                </p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px] whitespace-nowrap">
                Conforme
              </span>
            </div>

            {/* Checklist Item 2: Valoración Completa */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start justify-between gap-3">
              <div>
                <b className="text-slate-800 block">2. Valoración Cuantitativa ND × NE × NC (Bloque 03)</b>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {sinValorar === 0 ? '100% de peligros valorados cuantitativamente.' : `${sinValorar} peligros pendientes de valoración de riesgo.`}
                </p>
              </div>
              <span className={`px-2 py-0.5 font-bold rounded text-[10px] whitespace-nowrap ${
                sinValorar === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {sinValorar === 0 ? '100% Valorado' : `${sinValorar} Pendientes`}
              </span>
            </div>

            {/* Checklist Item 3: Separación Controles vs Medidas */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start justify-between gap-3">
              <div>
                <b className="text-slate-800 block">3. Jerarquía de Medidas de Intervención (V3.1)</b>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Separación técnica entre controles existentes y medidas de eliminación/sustitución/ingeniería/administrativo/EPP.
                </p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px] whitespace-nowrap">
                Estructurado
              </span>
            </div>

            {/* Checklist Item 4: Plan de Seguimiento */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start justify-between gap-3">
              <div>
                <b className="text-slate-800 block">4. Trazabilidad y Eficacia de Acciones (Bloque 04)</b>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {actions.length} acciones registradas con responsable, fecha, evidencia y evaluación de eficacia.
                </p>
              </div>
              <span className={`px-2 py-0.5 font-bold rounded text-[10px] whitespace-nowrap ${
                actions.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {actions.length} Acciones
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('matriz')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Ir a la Matriz Completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Interactive GTC 45 Risk Engine Simulator */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Simulador Cuantitativo de Riesgo GTC 45</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              Cálculo en vivo
            </span>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nivel Deficiencia (ND)</label>
              <select
                value={simND}
                onChange={e => setSimND(Number(e.target.value) as NivelDeficiencia)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {ND_OPTIONS.map(opt => (
                  <option key={opt.valor} value={opt.valor}>{opt.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nivel Exposición (NE)</label>
              <select
                value={simNE}
                onChange={e => setSimNE(Number(e.target.value) as NivelExposicion)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {NE_OPTIONS.map(opt => (
                  <option key={opt.valor} value={opt.valor}>{opt.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Consecuencia (NC)</label>
              <select
                value={simNC}
                onChange={e => setSimNC(Number(e.target.value) as NivelConsecuencia)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {NC_OPTIONS.map(opt => (
                  <option key={opt.valor} value={opt.valor}>{opt.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Math Output Card */}
          <div className={`p-4 rounded-xl border transition-all ${
            nivelRiesgo === 'I' ? 'bg-red-50 border-red-300 text-red-950' :
            nivelRiesgo === 'II' ? 'bg-amber-50 border-amber-300 text-amber-950' :
            nivelRiesgo === 'III' ? 'bg-blue-50 border-blue-300 text-blue-950' :
            'bg-emerald-50 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                  NP ({simND} × {simNE}) = <b>{np} ({interpNP})</b>
                </span>
                <div className="text-2xl font-black mt-0.5">
                  NR {nr} &bull; Nivel {nivelRiesgo}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                nivelRiesgo === 'I' ? 'bg-red-600 text-white' :
                nivelRiesgo === 'II' ? 'bg-amber-600 text-white' :
                nivelRiesgo === 'III' ? 'bg-blue-600 text-white' :
                'bg-emerald-600 text-white'
              }`}>
                {aceptabilidad}
              </span>
            </div>

            <div className="mt-2 text-xs font-semibold border-t border-current/20 pt-2">
              <b>Interpretación NR:</b> {interpretacionNR}
            </div>

            <p className="text-[11px] mt-1 font-normal opacity-90">
              <b>Significado de Intervención:</b> {significadoNR}
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
            <b>Jerarquía Recomendada Decreto 1072:</b>
            <div className="flex items-center gap-1 text-[11px] font-medium flex-wrap">
              <span className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded">1. Eliminación</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">2. Sustitución</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">3. Control Ingeniería</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded">4. Controles Administrativos</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">5. EPP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
