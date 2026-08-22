import React, { useState, useEffect } from 'react';
import { useIpvr } from '../context/IpvrContext';
import {
  NaturalezaPeligro,
  TipoProceso,
  TipoRutinaria,
  FrecuenciaExposicion,
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
  X,
  Save,
  CheckCircle2,
  AlertTriangle,
  Building,
  Target,
  Sliders,
  Shield,
  Layers,
  Sparkles,
  Info,
  Scale,
  CheckSquare,
  Loader2
} from 'lucide-react';
import { generateHazardAnalysisWithAI } from '../services/geminiClient';

export const RecordModal: React.FC = () => {
  const {
    isRecordModalOpen,
    setIsRecordModalOpen,
    editingRecordId,
    getRecordById,
    addRecord,
    updateRecord,
    catalogs,
    hazardsCatalog,
    orgData
  } = useIpvr();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Form State: 02 Identificación
  const [proceso, setProceso] = useState(catalogs.procesos[0] || 'Misional / Operativo');
  const [tipoProceso, setTipoProceso] = useState<TipoProceso>('Misional / Operativo');
  const [area, setArea] = useState(catalogs.areas[0] || 'Almacén Principal');
  const [lugarEspecifico, setLugarEspecifico] = useState('');
  const [actividad, setActividad] = useState('');
  const [tarea, setTarea] = useState('');
  const [rutinaria, setRutinaria] = useState<TipoRutinaria>('Rutinaria');
  const [cargoExpuesto, setCargoExpuesto] = useState(catalogs.cargos[0] || 'Operario');
  const [expuestosDirectos, setExpuestosDirectos] = useState<number>(1);
  const [expuestosContratistas, setExpuestosContratistas] = useState<number>(0);
  const [expuestosTemporales, setExpuestosTemporales] = useState<number>(0);
  const [frecuencia, setFrecuencia] = useState<FrecuenciaExposicion>('Continua (Toda la jornada)');

  // Peligro: Clasificación + Descripción + Efectos Posibles
  const [naturalezaPeligro, setNaturalezaPeligro] = useState<NaturalezaPeligro>('Condiciones de Seguridad');
  const [clasificacionPeligro, setClasificacionPeligro] = useState('Mecánico');
  const [fuenteGeneradora, setFuenteGeneradora] = useState('');
  const [descripcionPeligro, setDescripcionPeligro] = useState('');
  const [efectosPosibles, setEfectosPosibles] = useState('');

  // Controles Existentes (Fuente, Medio, Individuo)
  const [controlFuente, setControlFuente] = useState('');
  const [controlMedio, setControlMedio] = useState('');
  const [controlIndividuo, setControlIndividuo] = useState('');

  // 03 Valoración GTC 45
  const [nd, setNd] = useState<NivelDeficiencia>(6);
  const [ne, setNe] = useState<NivelExposicion>(3);
  const [nc, setNc] = useState<NivelConsecuencia>(25);

  // Criterios para Controles
  const [peorConsecuencia, setPeorConsecuencia] = useState('');
  const [tieneRequisitoLegal, setTieneRequisitoLegal] = useState<boolean>(true);
  const [requisitoLegalEspecifico, setRequisitoLegalEspecifico] = useState('');

  // Medidas de Intervención (Jerarquía de Controles)
  const [eliminacion, setEliminacion] = useState('');
  const [sustitucion, setSustitucion] = useState('');
  const [controlIngenieria, setControlIngenieria] = useState('');
  const [controlAdministrativo, setControlAdministrativo] = useState('');
  const [epp, setEpp] = useState('');

  // AI Generation State
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    setAiMessage('Analizando peligro con IA Generativa según GTC 45 y normativa colombiana...');
    try {
      const generated = await generateHazardAnalysisWithAI({
        amenaza: clasificacionPeligro || descripcionPeligro || 'Peligro laboral GTC 45',
        categoria: naturalezaPeligro,
        fuenteDetalle: fuenteGeneradora || descripcionPeligro,
        orgData
      });

      if (generated.proceso) setProceso(generated.proceso);
      if (generated.tipoProceso) setTipoProceso(generated.tipoProceso as TipoProceso);
      if (generated.area) setArea(generated.area);
      if (generated.lugarEspecifico) setLugarEspecifico(generated.lugarEspecifico);
      if (generated.actividad) setActividad(generated.actividad);
      if (generated.tarea) setTarea(generated.tarea);
      if (generated.rutinaria) setRutinaria(generated.rutinaria as TipoRutinaria);
      if (generated.cargoExpuesto) setCargoExpuesto(generated.cargoExpuesto);
      if (generated.naturalezaPeligro) setNaturalezaPeligro(generated.naturalezaPeligro as NaturalezaPeligro);
      if (generated.clasificacionPeligro) setClasificacionPeligro(generated.clasificacionPeligro);
      if (generated.fuenteGeneradora) setFuenteGeneradora(generated.fuenteGeneradora);
      if (generated.descripcionPeligro) setDescripcionPeligro(generated.descripcionPeligro);
      if (generated.efectosPosibles) setEfectosPosibles(generated.efectosPosibles);

      if (generated.controlesExistentes) {
        if (generated.controlesExistentes.fuente) setControlFuente(generated.controlesExistentes.fuente);
        if (generated.controlesExistentes.medio) setControlMedio(generated.controlesExistentes.medio);
        if (generated.controlesExistentes.individuo) setControlIndividuo(generated.controlesExistentes.individuo);
      }

      if (generated.valoracion) {
        if (generated.valoracion.nd !== undefined) setNd(generated.valoracion.nd as NivelDeficiencia);
        if (generated.valoracion.ne !== undefined) setNe(generated.valoracion.ne as NivelExposicion);
        if (generated.valoracion.nc !== undefined) setNc(generated.valoracion.nc as NivelConsecuencia);
      }

      if (generated.criterios) {
        if (generated.criterios.peorConsecuencia) setPeorConsecuencia(generated.criterios.peorConsecuencia);
        if (generated.criterios.tieneRequisitoLegal !== undefined) setTieneRequisitoLegal(generated.criterios.tieneRequisitoLegal);
        if (generated.criterios.requisitoLegalEspecifico) setRequisitoLegalEspecifico(generated.criterios.requisitoLegalEspecifico);
      }

      if (generated.medidas) {
        if (generated.medidas.eliminacion) setEliminacion(generated.medidas.eliminacion);
        if (generated.medidas.sustitucion) setSustitucion(generated.medidas.sustitucion);
        if (generated.medidas.controlIngenieria) setControlIngenieria(generated.medidas.controlIngenieria);
        if (generated.medidas.controlAdministrativo) setControlAdministrativo(generated.medidas.controlAdministrativo);
        if (generated.medidas.epp) setEpp(generated.medidas.epp);
      }

      setAiMessage('¡Matriz autocompletada exitosamente con IA Generativa según GTC 45!');
      setTimeout(() => setAiMessage(null), 5000);
    } catch (err: any) {
      setAiMessage(`Error en IA: ${err.message || 'No fue posible completar los datos.'}`);
      setTimeout(() => setAiMessage(null), 6000);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Load existing data if editing
  useEffect(() => {
    if (editingRecordId) {
      const rec = getRecordById(editingRecordId);
      if (rec) {
        setProceso(rec.proceso);
        setTipoProceso(rec.tipoProceso);
        setArea(rec.area);
        setLugarEspecifico(rec.lugarEspecifico || '');
        setActividad(rec.actividad);
        setTarea(rec.tarea);
        setRutinaria(rec.rutinaria);
        setCargoExpuesto(rec.cargoExpuesto);
        setExpuestosDirectos(rec.expuestosDirectos || 1);
        setExpuestosContratistas(rec.expuestosContratistas || 0);
        setExpuestosTemporales(rec.expuestosTemporales || 0);
        setFrecuencia(rec.frecuencia);
        setNaturalezaPeligro(rec.naturalezaPeligro);
        setClasificacionPeligro(rec.clasificacionPeligro);
        setFuenteGeneradora(rec.fuenteGeneradora);
        setDescripcionPeligro(rec.descripcionPeligro);
        setEfectosPosibles(rec.efectosPosibles);
        setControlFuente(rec.controlesExistentes?.fuente || '');
        setControlMedio(rec.controlesExistentes?.medio || '');
        setControlIndividuo(rec.controlesExistentes?.individuo || '');
        setNd(rec.valoracion?.nd || 6);
        setNe(rec.valoracion?.ne || 3);
        setNc(rec.valoracion?.nc || 25);
        setPeorConsecuencia(rec.criterios?.peorConsecuencia || '');
        setTieneRequisitoLegal(rec.criterios?.tieneRequisitoLegal ?? true);
        setRequisitoLegalEspecifico(rec.criterios?.requisitoLegalEspecifico || rec.criterios?.requisitoLegal || '');
        setEliminacion(rec.medidas?.eliminacion || '');
        setSustitucion(rec.medidas?.sustitucion || '');
        setControlIngenieria(rec.medidas?.controlIngenieria || '');
        setControlAdministrativo(rec.medidas?.controlAdministrativo || '');
        setEpp(rec.medidas?.epp || '');
      }
    } else {
      // Defaults for new record using general company data
      setProceso(catalogs.procesos[0] || 'Misional / Operativo');
      setTipoProceso('Misional / Operativo');
      setArea(catalogs.areas[0] || orgData.centroPrincipal || 'Sede Principal');
      setLugarEspecifico(orgData.centroPrincipal || orgData.direccion || (orgData.centrosTrabajo && orgData.centrosTrabajo[0]) || '');
      setActividad('');
      setTarea('');
      setRutinaria('Rutinaria');
      setCargoExpuesto('Todo el personal (Administrativos, Operativos, Contratistas)');
      setExpuestosDirectos(Number(orgData.numTrabajadores) || 1);
      setExpuestosContratistas(Number(orgData.numContratistas) || 0);
      setExpuestosTemporales(Number(orgData.numTemporales) || 0);
      setFrecuencia('Continua (Toda la jornada)');
      setNaturalezaPeligro('Condiciones de Seguridad');
      setClasificacionPeligro('Mecánico');
      setFuenteGeneradora('');
      setDescripcionPeligro('');
      setEfectosPosibles('');
      setControlFuente('');
      setControlMedio('');
      setControlIndividuo('');
      setNd(6);
      setNe(3);
      setNc(25);
      setPeorConsecuencia('');
      setTieneRequisitoLegal(true);
      setRequisitoLegalEspecifico('');
      setEliminacion('');
      setSustitucion('');
      setControlIngenieria('');
      setControlAdministrativo('');
      setEpp('');
      setActiveStep(1);
    }
  }, [editingRecordId, isRecordModalOpen, orgData]);

  if (!isRecordModalOpen) return null;

  // Filter classified subhazards by nature
  const availableClassifications = hazardsCatalog.filter(h => h.naturaleza === naturalezaPeligro);
  
  // Available areas including company sedes & centros de trabajo
  const availableAreas = Array.from(
    new Set(
      [
        ...(orgData.centrosTrabajo || []),
        orgData.centroPrincipal,
        orgData.direccion,
        ...catalogs.areas
      ].filter((a): a is string => Boolean(a && a.trim()))
    )
  );

  const handleSelectSubhazard = (clasificacion: string) => {
    setClasificacionPeligro(clasificacion);
    const item = hazardsCatalog.find(h => h.naturaleza === naturalezaPeligro && h.clasificacion === clasificacion);
    if (item) {
      if (!efectosPosibles) setEfectosPosibles(item.efectosPosibles);
      if (!descripcionPeligro) setDescripcionPeligro(item.descripcion);
    }
  };

  // Math live calculations according to GTC 45
  const { np, interpretacion: interpretacionNP } = calcularNP(nd, ne);
  const { nr, nivelRiesgo, interpretacionNR, aceptabilidad, significadoNR } = calcularNR(np, nc);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalExp = (Number(expuestosDirectos) || 0) + (Number(expuestosContratistas) || 0) + (Number(expuestosTemporales) || 0);

    const recordPayload: Omit<RegistroIPVR, 'id' | 'fechaCreacion'> = {
      proceso,
      tipoProceso,
      area,
      lugarEspecifico,
      actividad,
      tarea,
      rutinaria,
      cargoExpuesto,
      expuestosDirectos: Number(expuestosDirectos) || 1,
      expuestosContratistas: Number(expuestosContratistas) || 0,
      expuestosTemporales: Number(expuestosTemporales) || 0,
      expuestosTotal: totalExp > 0 ? totalExp : 1,
      frecuencia,
      naturalezaPeligro,
      clasificacionPeligro,
      fuenteGeneradora,
      descripcionPeligro: descripcionPeligro || clasificacionPeligro,
      efectosPosibles: efectosPosibles || 'Lesiones o afectaciones a la salud derivadas de la exposición.',
      controlesExistentes: {
        fuente: controlFuente,
        medio: controlMedio,
        individuo: controlIndividuo
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
        numExpuestos: totalExp > 0 ? totalExp : 1,
        peorConsecuencia: peorConsecuencia || efectosPosibles,
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
      },
      responsableRevision: orgData.responsableSST || 'Responsable SG-SST'
    };

    if (editingRecordId) {
      updateRecord(editingRecordId, recordPayload);
    } else {
      addRecord(recordPayload);
    }

    setIsRecordModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              IPVR
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {editingRecordId ? `Editar Registro ${editingRecordId}` : 'Identificar y Valorar Nuevo Peligro (V3.1)'}
              </h2>
              <p className="text-xs text-slate-300">
                02 Identificación (Peligro + Efectos) → Controles Existentes → 03 Valoración GTC 45 & Medidas
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRecordModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeStep === 1
                ? 'border-emerald-600 text-emerald-800 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              activeStep === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              1
            </span>
            <span>02 · Identificación (Peligro: Clasificación + Descripción)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeStep === 2
                ? 'border-emerald-600 text-emerald-800 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              activeStep === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </span>
            <span>Controles Existentes (Fuente / Medio / Individuo)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeStep === 3
                ? 'border-emerald-600 text-emerald-800 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              activeStep === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              3
            </span>
            <span>03 · Valoración GTC 45, Criterios & Jerarquía</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 text-xs space-y-5">
          {/* AI Assistance Banner */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                {isGeneratingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span>IA Generativa GTC 45 / Dec. 1072</span>
                  <span className="px-1.5 py-0.2 text-[10px] bg-emerald-100 text-emerald-800 rounded font-semibold">Gemini Flash</span>
                </h4>
                <p className="text-[11px] text-slate-600">
                  Completa automáticamente controles, valoración GTC 45, criterios y jerarquía de intervención según la organización.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
              id="btn-modal-autocompletar-ia"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-lg shadow-xs transition-all cursor-pointer shrink-0 text-xs"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analizando con IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Autocompletar con IA GTC 45</span>
                </>
              )}
            </button>
          </div>

          {/* AI Feedback Notification */}
          {aiMessage && (
            <div className="bg-emerald-100/80 border border-emerald-300 text-emerald-950 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{aiMessage}</span>
            </div>
          )}

          {/* STEP 1: Bloque 02 Identificación & Peligro (Descripción + Clasificación) */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>1. Localización y Descripción de la Actividad</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Proceso *</label>
                  <select
                    value={proceso}
                    onChange={e => setProceso(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {catalogs.procesos.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Proceso</label>
                  <select
                    value={tipoProceso}
                    onChange={e => setTipoProceso(e.target.value as TipoProceso)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Estratégico">Estratégico</option>
                    <option value="Misional / Operativo">Misional / Operativo</option>
                    <option value="Apoyo / Soporte">Apoyo / Soporte</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Área / Zona / Sede *</label>
                  <select
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {availableAreas.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-semibold text-slate-700 mb-1">Lugar Específico / Puesto de Trabajo</label>
                  <input
                    type="text"
                    list="sedes-list"
                    value={lugarEspecifico}
                    onChange={e => setLugarEspecifico(e.target.value)}
                    placeholder="Ej. Instalaciones Generales / Bodega Principal"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <datalist id="sedes-list">
                    {availableAreas.map((s, i) => (
                      <option key={i} value={s} />
                    ))}
                  </datalist>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Actividad Principal *</label>
                  <input
                    type="text"
                    value={actividad}
                    onChange={e => setActividad(e.target.value)}
                    placeholder="Ej. Recepción y almacenamiento de materias primas"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">¿Es Rutinaria? *</label>
                  <select
                    value={rutinaria}
                    onChange={e => setRutinaria(e.target.value as TipoRutinaria)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    <option value="Rutinaria">Rutinaria (Habitual del proceso)</option>
                    <option value="No Rutinaria">No Rutinaria (Esporádica / Ocasional)</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-semibold text-slate-700 mb-1">Tarea Específica Evaluada *</label>
                  <input
                    type="text"
                    value={tarea}
                    onChange={e => setTarea(e.target.value)}
                    placeholder="Ej. Cargue manual de bultos de 25 kg y apilamiento en estibas a 1.80m"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Personal Expuesto */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 pt-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>2. Población y Frecuencia de Exposición</span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setExpuestosDirectos(Number(orgData.numTrabajadores) || 1);
                      setExpuestosContratistas(Number(orgData.numContratistas) || 0);
                      setExpuestosTemporales(Number(orgData.numTemporales) || 0);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md font-semibold cursor-pointer transition-colors"
                    title="Cargar la cantidad de directos, contratistas y temporales configurados en Datos Generales de la Empresa"
                  >
                    <span>🏢 Copiar Total Empresa ({orgData.numTrabajadores} dir., {orgData.numContratistas} cont., {orgData.numTemporales || 0} temp.)</span>
                  </button>

                  <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-md border border-slate-200">
                    Total: {(Number(expuestosDirectos) || 0) + (Number(expuestosContratistas) || 0) + (Number(expuestosTemporales) || 0)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Cargo / Población Expuesta *</label>
                  <input
                    type="text"
                    value={cargoExpuesto}
                    onChange={e => setCargoExpuesto(e.target.value)}
                    placeholder="Ej. Auxiliar de Bodega / Operario de Máquina"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Directos</label>
                  <input
                    type="number"
                    min="0"
                    value={expuestosDirectos}
                    onChange={e => setExpuestosDirectos(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg outline-none text-center"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contratistas</label>
                  <input
                    type="number"
                    min="0"
                    value={expuestosContratistas}
                    onChange={e => setExpuestosContratistas(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg outline-none text-center"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Temporales</label>
                  <input
                    type="number"
                    min="0"
                    value={expuestosTemporales}
                    onChange={e => setExpuestosTemporales(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg outline-none text-center"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block font-semibold text-slate-700 mb-1">Frecuencia de Exposición</label>
                  <select
                    value={frecuencia}
                    onChange={e => setFrecuencia(e.target.value as FrecuenciaExposicion)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {catalogs.frecuencias.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Peligro: Bloque 02 Requisito -> Clasificación + Descripción y Efectos posibles */}
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2 pt-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>3. Peligro: Clasificación (GTC 45), Descripción y Efectos Posibles</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Naturaleza del Peligro *</label>
                  <select
                    value={naturalezaPeligro}
                    onChange={e => {
                      const nat = e.target.value as NaturalezaPeligro;
                      setNaturalezaPeligro(nat);
                      const firstSub = hazardsCatalog.find(h => h.naturaleza === nat);
                      if (firstSub) {
                        setClasificacionPeligro(firstSub.clasificacion);
                        setEfectosPosibles(firstSub.efectosPosibles);
                        setDescripcionPeligro(firstSub.descripcion);
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    <option value="Biológico">Biológico</option>
                    <option value="Físico">Físico</option>
                    <option value="Químico">Químico</option>
                    <option value="Psicosocial">Psicosocial</option>
                    <option value="Biomecánico">Biomecánico</option>
                    <option value="Condiciones de Seguridad">Condiciones de Seguridad</option>
                    <option value="Fenómenos Naturales">Fenómenos Naturales</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clasificación del Peligro (GTC 45) *</label>
                  <select
                    value={clasificacionPeligro}
                    onChange={e => handleSelectSubhazard(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    {availableClassifications.map(sub => (
                      <option key={sub.id} value={sub.clasificacion}>{sub.clasificacion}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Fuente Generadora del Peligro</label>
                  <input
                    type="text"
                    value={fuenteGeneradora}
                    onChange={e => setFuenteGeneradora(e.target.value)}
                    placeholder="Ej. Pulidora angular de 7 pulgadas / Bultos de insumos de 25 kg / Estantería pesada"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Descripción Detallada del Peligro *</label>
                  <textarea
                    value={descripcionPeligro}
                    onChange={e => setDescripcionPeligro(e.target.value)}
                    rows={2}
                    required
                    placeholder="Detalle la condición de riesgo y forma de interacción del trabajador con el agente o condición..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Efectos Posibles a la Salud / Consecuencias *</label>
                  <textarea
                    value={efectosPosibles}
                    onChange={e => setEfectosPosibles(e.target.value)}
                    rows={2}
                    required
                    placeholder="Ej. Politraumatismos, heridas abiertas, síndrome del túnel carpiano, lumbago, hipoacusia ocupacional..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Controles Existentes (Separados estrictamente según GTC 45: Fuente, Medio, Individuo) */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Controles Existentes (Implementados Actualmente)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  GTC 45 establece que los controles existentes se registran antes de la valoración y se clasifican en: <b>Fuente</b>, <b>Medio</b> e <b>Individuo</b>.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <label className="block font-bold text-slate-800">1. En la Fuente</label>
                  <p className="text-[11px] text-slate-500">
                    Controles aplicados directamente en la máquina, equipo, herramienta, sustancia o material generador.
                  </p>
                  <input
                    type="text"
                    value={controlFuente}
                    onChange={e => setControlFuente(e.target.value)}
                    placeholder="Ej. Guardas de seguridad originales, silenciadores de escape, aislamiento de partes móviles (o 'Ninguno')"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <label className="block font-bold text-slate-800">2. En el Medio</label>
                  <p className="text-[11px] text-slate-500">
                    Controles aplicados en el ambiente de trabajo, vías de propagación, ventilación o cerramientos.
                  </p>
                  <input
                    type="text"
                    value={controlMedio}
                    onChange={e => setControlMedio(e.target.value)}
                    placeholder="Ej. Mamparas protectoras, delimitación de zonas, ventilación forzada, señalización de piso (o 'Ninguno')"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <label className="block font-bold text-slate-800">3. En el Individuo / Trabajador</label>
                  <p className="text-[11px] text-slate-500">
                    Capacitaciones previas, procedimientos seguros existentes, exámenes ocupacionales y EPP asignados.
                  </p>
                  <input
                    type="text"
                    value={controlIndividuo}
                    onChange={e => setControlIndividuo(e.target.value)}
                    placeholder="Ej. Inducción SST, procedimiento seguro PTS, uso de guantes de nitrilo y calzado de seguridad"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Bloque 03 Valoración GTC 45, Criterios y Medidas de Intervención */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Bloque 03 · Valoración Cuantitativa GTC 45, Criterios & Jerarquía de Medidas</span>
              </h3>

              {/* 3 Selectors for GTC 45 Valuation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nivel de Deficiencia (ND) *</label>
                  <select
                    value={nd}
                    onChange={e => setNd(Number(e.target.value) as NivelDeficiencia)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    {ND_OPTIONS.map(o => (
                      <option key={o.valor} value={o.valor}>{o.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nivel de Exposición (NE) *</label>
                  <select
                    value={ne}
                    onChange={e => setNe(Number(e.target.value) as NivelExposicion)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    {NE_OPTIONS.map(o => (
                      <option key={o.valor} value={o.valor}>{o.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nivel de Consecuencia (NC) *</label>
                  <select
                    value={nc}
                    onChange={e => setNc(Number(e.target.value) as NivelConsecuencia)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    {NC_OPTIONS.map(o => (
                      <option key={o.valor} value={o.valor}>{o.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Result Score Card with Interpretación NP and Interpretación NR */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                nivelRiesgo === 'I' ? 'bg-red-50 border-red-300 text-red-950' :
                nivelRiesgo === 'II' ? 'bg-amber-50 border-amber-300 text-amber-950' :
                nivelRiesgo === 'III' ? 'bg-yellow-50 border-yellow-300 text-yellow-950' :
                'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold">NP = {nd} × {ne} = <b>{np}</b></span>
                    <span className="px-2 py-0.5 bg-white/80 rounded border font-bold text-[11px]">
                      Interpretación NP: {interpretacionNP}
                    </span>
                    <span className="font-semibold">&bull; NC = <b>{nc}</b></span>
                  </div>

                  <div className="text-xl font-black flex items-center gap-2">
                    <span>NR = {nr} (Nivel {nivelRiesgo})</span>
                    <span className="text-sm font-semibold px-2 py-0.5 rounded-md bg-white/90">
                      {aceptabilidad}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-slate-800">
                    <b>Interpretación NR:</b> {interpretacionNR}
                  </div>
                  <p className="text-[11px] opacity-90">{significadoNR}</p>
                </div>
              </div>

              {/* Criterios para Establecer Controles */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>Criterios para Establecer Controles (GTC 45)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Peor Consecuencia Identificada *</label>
                    <input
                      type="text"
                      value={peorConsecuencia}
                      onChange={e => setPeorConsecuencia(e.target.value)}
                      placeholder="Ej. Fatalidad / Amputación de extremidad / Invalidez permanente"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">¿Existe Requisito Legal Asociado? *</label>
                    <div className="flex items-center gap-4 py-2">
                      <label className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="radio"
                          name="tieneRequisitoLegal"
                          checked={tieneRequisitoLegal === true}
                          onChange={() => setTieneRequisitoLegal(true)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Sí (Obligatorio)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="radio"
                          name="tieneRequisitoLegal"
                          checked={tieneRequisitoLegal === false}
                          onChange={() => setTieneRequisitoLegal(false)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Requisito Legal Específico Aplicable</label>
                    <input
                      type="text"
                      value={requisitoLegalEspecifico}
                      onChange={e => setRequisitoLegalEspecifico(e.target.value)}
                      placeholder="Ej. Resolución 4272 de 2021 (Alturas) / Resolución 2400 de 1979 (Higiene y Seguridad)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Medidas de Intervención: Jerarquía Estricta (Eliminación, Sustitución, Ingeniería, Administrativos, EPP) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Medidas de Intervención Planificadas (Jerarquía de Controles)</span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">1. Eliminación</label>
                    <input
                      type="text"
                      value={eliminacion}
                      onChange={e => setEliminacion(e.target.value)}
                      placeholder="Ej. Rediseñar el proceso para eliminar la tarea en altura (o 'No viable técnicamente')"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">2. Sustitución</label>
                    <input
                      type="text"
                      value={sustitucion}
                      onChange={e => setSustitucion(e.target.value)}
                      placeholder="Ej. Reemplazar químico corrosivo por sustancia biodegradable base agua"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">3. Controles de Ingeniería</label>
                    <input
                      type="text"
                      value={controlIngenieria}
                      onChange={e => setControlIngenieria(e.target.value)}
                      placeholder="Ej. Instalación de sistema de extracción localizada, guardas de enclavamiento"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">4. Controles Administrativos / Señalización / Advertencia</label>
                    <input
                      type="text"
                      value={controlAdministrativo}
                      onChange={e => setControlAdministrativo(e.target.value)}
                      placeholder="Ej. Procedimiento seguro PTS, rotación de personal, permiso de trabajo de alto riesgo, demarcación"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">5. Equipos / Elementos de Protección Personal (EPP)</label>
                    <input
                      type="text"
                      value={epp}
                      onChange={e => setEpp(e.target.value)}
                      placeholder="Ej. Protección respiratoria N95, protección auditiva de copa 27dB, arnés dieléctrico con eslinga"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Bottom Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div>
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep((activeStep - 1) as any)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
                >
                  ← Paso Anterior
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((activeStep + 1) as any)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg cursor-pointer"
                >
                  Siguiente Paso →
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Peligro en Matriz IPVR V3.1</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
