import React, { useState } from 'react';
import { useIpvr } from '../context/IpvrContext';
import {
  NivelDeficiencia,
  NivelExposicion,
  NivelConsecuencia,
  RegistroIPVR
} from '../types';
import {
  ND_OPTIONS,
  NE_OPTIONS,
  NC_OPTIONS,
  calcularNP,
  calcularNR
} from '../data/gtc45Data';
import {
  Sliders,
  Calculator,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Plus,
  Save,
  Layers,
  ArrowRight,
  Sparkles,
  Shield,
  Scale
} from 'lucide-react';

export const Bloque03Valoracion: React.FC = () => {
  const {
    records,
    updateRecord,
    setEditingActionId,
    setIsActionModalOpen,
    setActiveTab
  } = useIpvr();

  const [selectedRecordId, setSelectedRecordId] = useState<string>(records[0]?.id || '');
  const [saveToast, setSaveToast] = useState(false);

  const selectedRecord = records.find(r => r.id === selectedRecordId) || records[0];

  // Local state for the active record valuation to allow live changes
  const [localND, setLocalND] = useState<NivelDeficiencia>(selectedRecord?.valoracion?.nd || 6);
  const [localNE, setLocalNE] = useState<NivelExposicion>(selectedRecord?.valoracion?.ne || 3);
  const [localNC, setLocalNC] = useState<NivelConsecuencia>(selectedRecord?.valoracion?.nc || 25);

  // Controles Existentes (Pre-valoración)
  const [controlFuente, setControlFuente] = useState(selectedRecord?.controlesExistentes?.fuente || '');
  const [controlMedio, setControlMedio] = useState(selectedRecord?.controlesExistentes?.medio || '');
  const [controlIndividuo, setControlIndividuo] = useState(selectedRecord?.controlesExistentes?.individuo || selectedRecord?.controlesExistentes?.administrativo || '');

  // Criterios
  const [peorConsecuencia, setPeorConsecuencia] = useState(selectedRecord?.criterios?.peorConsecuencia || '');
  const [tieneRequisitoLegal, setTieneRequisitoLegal] = useState<boolean>(selectedRecord?.criterios?.tieneRequisitoLegal ?? true);
  const [requisitoLegalEspecifico, setRequisitoLegalEspecifico] = useState(selectedRecord?.criterios?.requisitoLegalEspecifico || selectedRecord?.criterios?.requisitoLegal || '');
  
  // Medidas de Intervención (Jerarquía)
  const [eliminacion, setEliminacion] = useState(selectedRecord?.medidas?.eliminacion || '');
  const [sustitucion, setSustitucion] = useState(selectedRecord?.medidas?.sustitucion || '');
  const [controlIngenieria, setControlIngenieria] = useState(selectedRecord?.medidas?.controlIngenieria || '');
  const [controlAdministrativo, setControlAdministrativo] = useState(selectedRecord?.medidas?.controlAdministrativo || '');
  const [epp, setEpp] = useState(selectedRecord?.medidas?.epp || '');

  // When switching selected hazard, sync local state
  const handleSelectRecord = (id: string) => {
    setSelectedRecordId(id);
    const rec = records.find(r => r.id === id);
    if (rec) {
      setLocalND(rec.valoracion?.nd || 6);
      setLocalNE(rec.valoracion?.ne || 3);
      setLocalNC(rec.valoracion?.nc || 25);
      setControlFuente(rec.controlesExistentes?.fuente || '');
      setControlMedio(rec.controlesExistentes?.medio || '');
      setControlIndividuo(rec.controlesExistentes?.individuo || rec.controlesExistentes?.administrativo || '');
      setPeorConsecuencia(rec.criterios?.peorConsecuencia || '');
      setTieneRequisitoLegal(rec.criterios?.tieneRequisitoLegal ?? true);
      setRequisitoLegalEspecifico(rec.criterios?.requisitoLegalEspecifico || rec.criterios?.requisitoLegal || '');
      setEliminacion(rec.medidas?.eliminacion || '');
      setSustitucion(rec.medidas?.sustitucion || '');
      setControlIngenieria(rec.medidas?.controlIngenieria || '');
      setControlAdministrativo(rec.medidas?.controlAdministrativo || '');
      setEpp(rec.medidas?.epp || '');
    }
  };

  // Live Math calculations
  const { np, interpretacion: interpretacionNP } = calcularNP(localND, localNE);
  const { nr, nivelRiesgo, interpretacionNR, aceptabilidad, significadoNR } = calcularNR(np, localNC);

  const handleSaveValuation = () => {
    if (!selectedRecord) return;
    updateRecord(selectedRecord.id, {
      controlesExistentes: {
        fuente: controlFuente,
        medio: controlMedio,
        individuo: controlIndividuo
      },
      valoracion: {
        nd: localND,
        ne: localNE,
        np,
        interpretacionNP,
        nc: localNC,
        nr,
        nivelRiesgo,
        interpretacionNR,
        aceptabilidad,
        significadoNR,
        estado: 'Valorado'
      },
      criterios: {
        numExpuestos: selectedRecord.expuestosTotal || 1,
        peorConsecuencia,
        tieneRequisitoLegal,
        requisitoLegalEspecifico,
        requisitoLegal: requisitoLegalEspecifico
      },
      medidas: {
        eliminacion,
        sustitucion,
        controlIngenieria,
        controlAdministrativo,
        epp
      }
    });

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              03
            </span>
            <h2 className="text-lg font-bold text-slate-900">Bloque 03 · Valoración GTC 45, Criterios y Jerarquía de Medidas</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Motor de cálculo GTC 45: <b>NP = ND × NE</b> &bull; <b>NR = NP × NC</b> &bull; Interpretación técnica &bull; Criterios y separación estricta entre <b>Controles Existentes</b> y <b>Medidas de Intervención</b>.
          </p>
        </div>

        {saveToast && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>¡Valoración y controles V3.1 guardados!</span>
          </div>
        )}
      </div>

      {/* Main Layout: Hazard Selector + Valuation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Hazard Picker List */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Seleccionar Peligro a Valorar ({records.length})
          </h3>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {records.map(rec => {
              const isSelected = rec.id === (selectedRecord?.id || selectedRecordId);
              const nrVal = rec.valoracion?.nr || 0;
              const isNivelI = rec.valoracion?.nivelRiesgo === 'I';
              const isNivelII = rec.valoracion?.nivelRiesgo === 'II';

              return (
                <div
                  key={rec.id}
                  onClick={() => handleSelectRecord(rec.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-800">{rec.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isNivelI ? 'bg-red-100 text-red-800' :
                      isNivelII ? 'bg-amber-100 text-amber-800' :
                      nrVal > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {nrVal > 0 ? `NR: ${nrVal} (${rec.valoracion?.nivelRiesgo})` : 'Pendiente'}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-900 mt-1">
                    {rec.clasificacionPeligro}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {rec.proceso} &bull; {rec.tarea}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Valuation Panel */}
        <div className="lg:col-span-8 space-y-5">
          {selectedRecord ? (
            <>
              {/* Selected Hazard Header Card */}
              <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs rounded border border-emerald-500/30">
                      {selectedRecord.id}
                    </span>
                    <h3 className="font-bold text-base text-white">
                      {selectedRecord.clasificacionPeligro} ({selectedRecord.naturalezaPeligro})
                    </h3>
                  </div>
                  <span className="text-xs bg-slate-800 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
                    {selectedRecord.rutinaria}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  <b>Proceso:</b> {selectedRecord.proceso} &bull; <b>Área:</b> {selectedRecord.area} &bull; <b>Tarea:</b> {selectedRecord.tarea}
                </p>
                <div className="mt-2 text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60 space-y-1">
                  <div><b>Descripción:</b> {selectedRecord.descripcionPeligro}</div>
                  <div><b>Efectos Posibles:</b> {selectedRecord.efectosPosibles}</div>
                </div>
              </div>

              {/* Step 1: Controles Existentes (Fuente / Medio / Individuo) */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>1. Controles Existentes (Implementados Pre-valoración)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">GTC 45 Numeral 3.1.2</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">En la Fuente</label>
                    <input
                      type="text"
                      value={controlFuente}
                      onChange={e => setControlFuente(e.target.value)}
                      placeholder="Ej. Guardas de seguridad, aislamiento"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">En el Medio</label>
                    <input
                      type="text"
                      value={controlMedio}
                      onChange={e => setControlMedio(e.target.value)}
                      placeholder="Ej. Ventilación forzada, señalización de piso"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">En el Individuo / EPP</label>
                    <input
                      type="text"
                      value={controlIndividuo}
                      onChange={e => setControlIndividuo(e.target.value)}
                      placeholder="Ej. PTS seguro, guantes de nitrilo"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: ND & NE Selectors -> NP */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>2. Evaluación de Probabilidad (NP = ND × NE)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Nivel de Deficiencia (ND) */}
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      Nivel de Deficiencia (ND) *
                    </label>
                    <select
                      value={localND}
                      onChange={e => setLocalND(Number(e.target.value) as NivelDeficiencia)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      {ND_OPTIONS.map(opt => (
                        <option key={opt.valor} value={opt.valor}>{opt.nombre}</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500 mt-1 bg-slate-50 p-2 rounded border border-slate-100">
                      {ND_OPTIONS.find(o => o.valor === localND)?.descripcion}
                    </p>
                  </div>

                  {/* Nivel de Exposición (NE) */}
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      Nivel de Exposición (NE) *
                    </label>
                    <select
                      value={localNE}
                      onChange={e => setLocalNE(Number(e.target.value) as NivelExposicion)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      {NE_OPTIONS.map(opt => (
                        <option key={opt.valor} value={opt.valor}>{opt.nombre}</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500 mt-1 bg-slate-50 p-2 rounded border border-slate-100">
                      {NE_OPTIONS.find(o => o.valor === localNE)?.descripcion}
                    </p>
                  </div>
                </div>

                {/* NP Calculation Result Card with Interpretación NP */}
                <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-semibold text-emerald-900">Nivel de Probabilidad (NP = ND × NE):</span>
                    <div className="text-xs text-emerald-700 mt-0.5">
                      Fórmula: {localND} × {localNE} = <b className="text-sm font-black">{np}</b>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Interpretación NP:</span>
                    <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold inline-block mt-0.5">
                      {interpretacionNP}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3: NC Selector -> NR Calculation */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  <span>3. Consecuencia y Nivel de Riesgo (NR = NP × NC)</span>
                </h4>

                <div className="text-xs">
                  <label className="block font-semibold text-slate-800 mb-1">
                    Nivel de Consecuencia (NC) *
                  </label>
                  <select
                    value={localNC}
                    onChange={e => setLocalNC(Number(e.target.value) as NivelConsecuencia)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {NC_OPTIONS.map(opt => (
                      <option key={opt.valor} value={opt.valor}>{opt.nombre}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1 bg-slate-50 p-2 rounded border border-slate-100">
                    {NC_OPTIONS.find(o => o.valor === localNC)?.descripcion}
                  </p>
                </div>

                {/* Final NR Card with Interpretación NR */}
                <div className={`mt-4 p-4 rounded-xl border ${
                  nivelRiesgo === 'I' ? 'bg-red-50 border-red-300 text-red-950' :
                  nivelRiesgo === 'II' ? 'bg-amber-50 border-amber-300 text-amber-950' :
                  nivelRiesgo === 'III' ? 'bg-blue-50 border-blue-300 text-blue-950' :
                  'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Nivel de Riesgo e Intervención (NR):
                      </span>
                      <div className="text-2xl font-black mt-1">
                        NR {nr} &bull; Nivel {nivelRiesgo}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        nivelRiesgo === 'I' ? 'bg-red-600 text-white' :
                        nivelRiesgo === 'II' ? 'bg-amber-600 text-white' :
                        nivelRiesgo === 'III' ? 'bg-blue-600 text-white' :
                        'bg-emerald-600 text-white'
                      }`}>
                        {aceptabilidad}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs font-semibold text-slate-800 border-t border-current/20 pt-2">
                    <b>Interpretación NR (GTC 45):</b> {interpretacionNR}
                  </div>

                  <p className="text-xs mt-1 font-normal opacity-90">
                    <b>Significado de Intervención:</b> {significadoNR}
                  </p>
                </div>
              </div>

              {/* Step 4: Criterios para Establecer Controles */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>4. Criterios para Establecer Controles</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Peor Consecuencia Posible *</label>
                    <input
                      type="text"
                      value={peorConsecuencia}
                      onChange={e => setPeorConsecuencia(e.target.value)}
                      placeholder="Ej. Fatalidad / Amputación / Invalidez permanente"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Requisito Legal Específico Aplicable</label>
                    <input
                      type="text"
                      value={requisitoLegalEspecifico}
                      onChange={e => setRequisitoLegalEspecifico(e.target.value)}
                      placeholder="Ej. Resolución 4272/2021 / Res. 2400/1979 / Dec. 1072"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 5: Medidas de Intervención (Jerarquía de Controles GTC 45) */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>5. Medidas de Intervención Planificadas (Jerarquía de Controles)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">Decreto 1072 Art. 2.2.4.6.24</span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Eliminación */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-red-600 text-white font-bold text-[10px] flex items-center justify-center">1</span>
                        Eliminación
                      </span>
                      <span className="text-[11px] text-slate-400">Modificar el diseño para eliminar el peligro por completo</span>
                    </div>
                    <textarea
                      value={eliminacion}
                      onChange={e => setEliminacion(e.target.value)}
                      rows={2}
                      placeholder="Medida de eliminación (o 'No viable técnicamente')"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Sustitución */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center">2</span>
                        Sustitución
                      </span>
                      <span className="text-[11px] text-slate-400">Reemplazar por un material, equipo o proceso menos peligroso</span>
                    </div>
                    <textarea
                      value={sustitucion}
                      onChange={e => setSustitucion(e.target.value)}
                      rows={2}
                      placeholder="Medida de sustitución (o 'No aplica')..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Controles de Ingeniería */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">3</span>
                        Controles de Ingeniería
                      </span>
                      <span className="text-[11px] text-slate-400">Instalación de guardas, barreras, ventilación, enclavamientos</span>
                    </div>
                    <textarea
                      value={controlIngenieria}
                      onChange={e => setControlIngenieria(e.target.value)}
                      rows={2}
                      placeholder="Medidas de control de ingeniería..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Controles Administrativos / Señalización */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">4</span>
                        Controles Administrativos, Señalización y Advertencia
                      </span>
                      <span className="text-[11px] text-slate-400">Procedimientos, capacitación, permisos, señalética, rotación</span>
                    </div>
                    <textarea
                      value={controlAdministrativo}
                      onChange={e => setControlAdministrativo(e.target.value)}
                      rows={2}
                      placeholder="Medidas de control administrativo..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Equipos / Elementos de Protección Personal (EPP) */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">5</span>
                        Equipos y Elementos de Protección Personal (EPP)
                      </span>
                      <span className="text-[11px] text-slate-400">Última barrera: dotación y mantenimiento de EPP certificados</span>
                    </div>
                    <textarea
                      value={epp}
                      onChange={e => setEpp(e.target.value)}
                      rows={2}
                      placeholder="Especificación de EPP requeridos..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Save & Action Triggers */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingActionId(null);
                      setIsActionModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-slate-600" />
                    <span>+ Crear Acción en Seguimiento (Bloque 04)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveValuation}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Valoración y Jerarquía de {selectedRecord.id}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Seleccione un peligro para realizar la valoración.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
