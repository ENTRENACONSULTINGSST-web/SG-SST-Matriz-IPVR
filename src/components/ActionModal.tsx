import React, { useState, useEffect } from 'react';
import { useIpvr } from '../context/IpvrContext';
import {
  JerarquiaControl,
  EstadoAccion,
  EficaciaAccion,
  TipoEvidencia,
  NivelDeficiencia,
  NivelExposicion,
  NivelConsecuencia,
  AccionSeguimiento
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
  Calendar,
  User,
  Paperclip,
  Award,
  Layers,
  Link as LinkIcon
} from 'lucide-react';

export const ActionModal: React.FC = () => {
  const {
    isActionModalOpen,
    setIsActionModalOpen,
    editingActionId,
    actions,
    records,
    addAction,
    updateAction,
    catalogs
  } = useIpvr();

  const [ipvrId, setIpvrId] = useState(records[0]?.id || 'IPVR-001');
  const [peligroResumen, setPeligroResumen] = useState('');
  const [jerarquia, setJerarquia] = useState<JerarquiaControl>('Control de Ingeniería');
  const [descripcionAccion, setDescripcionAccion] = useState('');
  const [responsable, setResponsable] = useState(catalogs.responsablesSST[0] || '');
  const [cargoResponsable, setCargoResponsable] = useState('');
  const [fechaPropuesta, setFechaPropuesta] = useState(new Date().toISOString().split('T')[0]);
  const [fechaLimite, setFechaLimite] = useState('');
  const [fechaCierre, setFechaCierre] = useState('');
  const [recursosNecesarios, setRecursosNecesarios] = useState('');
  const [estado, setEstado] = useState<EstadoAccion>('Abierta');
  const [tipoEvidencia, setTipoEvidencia] = useState<TipoEvidencia>('Inspección');
  const [detalleEvidencia, setDetalleEvidencia] = useState('');
  const [linkEvidencia, setLinkEvidencia] = useState('');
  const [eficacia, setEficacia] = useState<EficaciaAccion>('No evaluada');
  const [observaciones, setObservaciones] = useState('');

  // Re-evaluation post-control
  const [nuevoND, setNuevoND] = useState<NivelDeficiencia>(2);
  const [nuevoNE, setNuevoNE] = useState<NivelExposicion>(2);
  const [nuevoNC, setNuevoNC] = useState<NivelConsecuencia>(25);

  useEffect(() => {
    if (editingActionId) {
      const act = actions.find(a => a.id === editingActionId);
      if (act) {
        setIpvrId(act.ipvrId);
        setPeligroResumen(act.peligroResumen);
        setJerarquia(act.jerarquia);
        setDescripcionAccion(act.descripcionAccion);
        setResponsable(act.responsable);
        setCargoResponsable(act.cargoResponsable || '');
        setFechaPropuesta(act.fechaPropuesta);
        setFechaLimite(act.fechaLimite);
        setFechaCierre(act.fechaCierre || '');
        setRecursosNecesarios(act.recursosNecesarios || '');
        setEstado(act.estado);
        setTipoEvidencia(act.tipoEvidencia);
        setDetalleEvidencia(act.detalleEvidencia);
        setLinkEvidencia(act.linkEvidencia || '');
        setEficacia(act.eficacia);
        setObservaciones(act.observaciones || '');
        if (act.nuevoND) setNuevoND(act.nuevoND);
        if (act.nuevoNE) setNuevoNE(act.nuevoNE);
        if (act.nuevoNC) setNuevoNC(act.nuevoNC);
      }
    } else {
      // Default dates
      const today = new Date().toISOString().split('T')[0];
      const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setIpvrId(records[0]?.id || 'IPVR-001');
      setPeligroResumen(records[0]?.clasificacionPeligro || '');
      setJerarquia('Control de Ingeniería');
      setDescripcionAccion('');
      setResponsable(catalogs.responsablesSST[0] || 'Responsable SST');
      setCargoResponsable('Coordinador SG-SST');
      setFechaPropuesta(today);
      setFechaLimite(in30Days);
      setFechaCierre('');
      setRecursosNecesarios('');
      setEstado('Abierta');
      setTipoEvidencia('Inspección');
      setDetalleEvidencia('');
      setLinkEvidencia('');
      setEficacia('No evaluada');
      setObservaciones('');
    }
  }, [editingActionId, isActionModalOpen, records]);

  if (!isActionModalOpen) return null;

  // Selected linked record info
  const linkedRecord = records.find(r => r.id === ipvrId);

  const handleIpvrChange = (newId: string) => {
    setIpvrId(newId);
    const rec = records.find(r => r.id === newId);
    if (rec) {
      setPeligroResumen(`${rec.clasificacionPeligro} (${rec.area})`);
    }
  };

  // Math re-evaluation
  const { np: nuevoNP } = calcularNP(nuevoND, nuevoNE);
  const { nr: nuevoNR, nivelRiesgo: nuevoNivelRiesgo } = calcularNR(nuevoNP, nuevoNC);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const actionData: Omit<AccionSeguimiento, 'id'> = {
      ipvrId,
      peligroResumen: peligroResumen || (linkedRecord ? linkedRecord.clasificacionPeligro : 'Peligro IPVR'),
      jerarquia,
      descripcionAccion,
      responsable,
      cargoResponsable,
      fechaPropuesta,
      fechaLimite,
      fechaCierre: estado === 'Cerrada' ? (fechaCierre || new Date().toISOString().split('T')[0]) : undefined,
      recursosNecesarios,
      estado,
      tipoEvidencia,
      detalleEvidencia,
      linkEvidencia,
      eficacia,
      observaciones,
      nuevoND: eficacia === 'Eficaz' ? nuevoND : undefined,
      nuevoNE: eficacia === 'Eficaz' ? nuevoNE : undefined,
      nuevoNC: eficacia === 'Eficaz' ? nuevoNC : undefined,
      nuevoNP: eficacia === 'Eficaz' ? nuevoNP : undefined,
      nuevoNR: eficacia === 'Eficaz' ? nuevoNR : undefined,
      nuevoNivelRiesgo: eficacia === 'Eficaz' ? nuevoNivelRiesgo : undefined
    };

    if (editingActionId) {
      updateAction(editingActionId, actionData);
    } else {
      addAction(actionData);
    }

    setIsActionModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              ACT
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {editingActionId ? `Editar Acción ${editingActionId}` : 'Crear Nueva Acción de Seguimiento'}
              </h2>
              <p className="text-xs text-slate-300">
                Bloque 04: Acción → Responsable → Fechas → Evidencia → Eficacia
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsActionModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 text-xs space-y-4">
          {/* Linked Hazard & Hierarchy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Peligro IPVR Vinculado *</label>
              <select
                value={ipvrId}
                onChange={e => handleIpvrChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                {records.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.id} · {r.clasificacionPeligro} ({r.area})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jerarquía de la Medida *</label>
              <select
                value={jerarquia}
                onChange={e => setJerarquia(e.target.value as JerarquiaControl)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="Eliminación">1. Eliminación</option>
                <option value="Sustitución">2. Sustitución</option>
                <option value="Control de Ingeniería">3. Control de Ingeniería</option>
                <option value="Control Administrativo">4. Control Administrativo / Señalización</option>
                <option value="Equipos / EPP">5. Equipos y Elementos de Protección (EPP)</option>
              </select>
            </div>
          </div>

          {/* Description of Action */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Descripción de la Medida / Acción Propuesta *</label>
            <textarea
              value={descripcionAccion}
              onChange={e => setDescripcionAccion(e.target.value)}
              rows={3}
              required
              placeholder="Describa la acción técnica, operativa o administrativa a implementar con especificaciones..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Responsable & Cargo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Responsable de la Ejecución *</label>
              <input
                type="text"
                value={responsable}
                onChange={e => setResponsable(e.target.value)}
                required
                placeholder="Ej. Coordinador SG-SST / Líder de Mantenimiento"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recursos Necesarios (Presupuesto / Horas)</label>
              <input
                type="text"
                value={recursosNecesarios}
                onChange={e => setRecursosNecesarios(e.target.value)}
                placeholder="Ej. $12.000.000 COP / Asesoría ARL / 40 Horas"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Fechas & Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fecha Propuesta / Inicio</label>
              <input
                type="date"
                value={fechaPropuesta}
                onChange={e => setFechaPropuesta(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fecha Límite Planificada *</label>
              <input
                type="date"
                value={fechaLimite}
                onChange={e => setFechaLimite(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estado de la Acción *</label>
              <select
                value={estado}
                onChange={e => setEstado(e.target.value as EstadoAccion)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                {catalogs.estadosAccion.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Evidencia */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Paperclip className="w-4 h-4 text-emerald-600" />
              <span>Evidencia Documental y Verificable</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipo de Evidencia</label>
                <select
                  value={tipoEvidencia}
                  onChange={e => setTipoEvidencia(e.target.value as TipoEvidencia)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {catalogs.tiposEvidencia.map(te => (
                    <option key={te} value={te}>{te}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Enlace / Carpeta Digital (Drive/Cloud)</label>
                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={linkEvidencia}
                    onChange={e => setLinkEvidencia(e.target.value)}
                    placeholder="https://..."
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Detalle de la Evidencia Recopilada</label>
                <textarea
                  value={detalleEvidencia}
                  onChange={e => setDetalleEvidencia(e.target.value)}
                  rows={2}
                  placeholder="Detalle los soportes (número de acta, firmas, informe técnico, fotos de antes y después)..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Eficacia y Re-evaluación */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Evaluación de la Eficacia y Reducción del Riesgo</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resultado de la Eficacia</label>
                <select
                  value={eficacia}
                  onChange={e => setEficacia(e.target.value as EficaciaAccion)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  {catalogs.nivelesEficacia.map(nef => (
                    <option key={nef} value={nef}>{nef}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observaciones / Evaluación</label>
                <input
                  type="text"
                  value={observaciones}
                  onChange={e => setObservaciones(e.target.value)}
                  placeholder="Comentarios del evaluador SST sobre la efectividad..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none"
                />
              </div>
            </div>

            {eficacia === 'Eficaz' && (
              <div className="mt-3 p-3 bg-emerald-100/70 border border-emerald-300 rounded-lg space-y-2">
                <span className="font-bold text-emerald-900 block">
                  Re-evaluación del Riesgo Residual (Post-Control):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-950 mb-0.5">Nuevo ND</label>
                    <select
                      value={nuevoND}
                      onChange={e => setNuevoND(Number(e.target.value) as NivelDeficiencia)}
                      className="w-full p-1.5 bg-white border border-emerald-300 rounded"
                    >
                      {ND_OPTIONS.map(o => (
                        <option key={o.valor} value={o.valor}>ND {o.valor}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-950 mb-0.5">Nuevo NE</label>
                    <select
                      value={nuevoNE}
                      onChange={e => setNuevoNE(Number(e.target.value) as NivelExposicion)}
                      className="w-full p-1.5 bg-white border border-emerald-300 rounded"
                    >
                      {NE_OPTIONS.map(o => (
                        <option key={o.valor} value={o.valor}>NE {o.valor}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-950 mb-0.5">Nuevo NC</label>
                    <select
                      value={nuevoNC}
                      onChange={e => setNuevoNC(Number(e.target.value) as NivelConsecuencia)}
                      className="w-full p-1.5 bg-white border border-emerald-300 rounded"
                    >
                      {NC_OPTIONS.map(o => (
                        <option key={o.valor} value={o.valor}>NC {o.valor}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-emerald-950 pt-1">
                  Nuevo Nivel de Riesgo: NR {nuevoNR} (Nivel {nuevoNivelRiesgo})
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsActionModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Acción de Seguimiento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
