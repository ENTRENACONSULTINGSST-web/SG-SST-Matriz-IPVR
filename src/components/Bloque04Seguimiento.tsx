import React, { useState } from 'react';
import { useIpvr } from '../context/IpvrContext';
import { EstadoAccion, EficaciaAccion, AccionSeguimiento } from '../types';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  FileCheck,
  Award,
  AlertCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
  Edit2,
  Trash2,
  Paperclip
} from 'lucide-react';

export const Bloque04Seguimiento: React.FC = () => {
  const {
    actions,
    deleteAction,
    setEditingActionId,
    setIsActionModalOpen,
    records
  } = useIpvr();

  const [filterEstado, setFilterEstado] = useState<string>('TODOS');
  const [filterEficacia, setFilterEficacia] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionToDelete, setActionToDelete] = useState<AccionSeguimiento | null>(null);

  const filteredActions = actions.filter(act => {
    const matchEstado = filterEstado === 'TODOS' || act.estado === filterEstado;
    const matchEficacia = filterEficacia === 'TODOS' || act.eficacia === filterEficacia;
    const text = `${act.id} ${act.ipvrId} ${act.peligroResumen} ${act.descripcionAccion} ${act.responsable} ${act.tipoEvidencia}`.toLowerCase();
    const matchSearch = !searchQuery || text.includes(searchQuery.toLowerCase());
    return matchEstado && matchEficacia && matchSearch;
  });

  const total = actions.length;
  const abiertas = actions.filter(a => a.estado === 'Abierta').length;
  const enEjecucion = actions.filter(a => a.estado === 'En ejecución').length;
  const enVerificacion = actions.filter(a => a.estado === 'Verificación').length;
  const cerradas = actions.filter(a => a.estado === 'Cerrada').length;
  const vencidas = actions.filter(a => a.estado === 'Vencida').length;

  const eficaces = actions.filter(a => a.eficacia === 'Eficaz').length;
  const pctCumplimiento = total > 0 ? Math.round((cerradas / total) * 100) : 0;
  const pctEficacia = total > 0 ? Math.round((eficaces / total) * 100) : 0;

  const handleEdit = (id: string) => {
    setEditingActionId(id);
    setIsActionModalOpen(true);
  };

  const handleNew = () => {
    setEditingActionId(null);
    setIsActionModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              04
            </span>
            <h2 className="text-lg font-bold text-slate-900">Bloque 04 · Plan de Seguimiento y Eficacia</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión del ciclo PHVA: Acción correctiva/preventiva → Responsable → Fechas límite → Evidencia documental → Evaluación de Eficacia.
          </p>
        </div>

        <button
          onClick={handleNew}
          id="btn-nueva-accion-seguimiento"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nueva Acción de Seguimiento</span>
        </button>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 font-medium block">Total Acciones</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{total}</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <span className="text-blue-700 font-medium block">En Ejecución</span>
          <span className="text-xl font-bold text-blue-800 mt-1 block">{enEjecucion + abiertas}</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-purple-200 bg-purple-50/20 shadow-xs">
          <span className="text-purple-700 font-medium block">En Verificación</span>
          <span className="text-xl font-bold text-purple-800 mt-1 block">{enVerificacion}</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-emerald-700 font-medium block">Cerradas</span>
          <span className="text-xl font-bold text-emerald-800 mt-1 block">{cerradas}</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 font-medium block">% Cumplimiento</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{pctCumplimiento}%</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-emerald-700 font-medium block">% Eficacia SST</span>
          <span className="text-xl font-bold text-emerald-800 mt-1 block">{pctEficacia}%</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar acción por ID, peligro, responsable, evidencia..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterEstado}
            onChange={e => setFilterEstado(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium outline-none"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="Abierta">Abierta</option>
            <option value="En ejecución">En ejecución</option>
            <option value="Verificación">Verificación</option>
            <option value="Cerrada">Cerrada</option>
            <option value="Vencida">Vencida</option>
          </select>

          <select
            value={filterEficacia}
            onChange={e => setFilterEficacia(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium outline-none"
          >
            <option value="TODOS">Toda la Eficacia</option>
            <option value="Eficaz">Eficaz</option>
            <option value="Parcialmente eficaz">Parcialmente eficaz</option>
            <option value="No eficaz">No eficaz</option>
            <option value="No evaluada">No evaluada</option>
          </select>
        </div>
      </div>

      {/* Action Cards List */}
      <div className="space-y-3">
        {filteredActions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No se encontraron acciones</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No hay acciones de seguimiento que coincidan con los filtros seleccionados.
            </p>
            <button
              onClick={handleNew}
              className="mt-3 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              + Crear primera acción
            </button>
          </div>
        ) : (
          filteredActions.map(act => {
            const isCerrada = act.estado === 'Cerrada';
            const isEficaz = act.eficacia === 'Eficaz';

            return (
              <div
                key={act.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold font-mono">
                      {act.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {act.ipvrId}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {act.peligroResumen || 'Peligro Vinculado'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {act.jerarquia}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1.5 font-medium">
                        {act.descripcionAccion}
                      </p>
                    </div>
                  </div>

                  {/* Status Badges & Controls */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      act.estado === 'Cerrada' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      act.estado === 'En ejecución' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      act.estado === 'Verificación' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                      act.estado === 'Vencida' ? 'bg-red-100 text-red-800 border border-red-200' :
                      'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {act.estado}
                    </span>

                    {/* Efficacy Badge */}
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      act.eficacia === 'Eficaz' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' :
                      act.eficacia === 'Parcialmente eficaz' ? 'bg-amber-50 text-amber-700 border border-amber-300' :
                      act.eficacia === 'No eficaz' ? 'bg-red-50 text-red-700 border border-red-300' :
                      'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {act.eficacia}
                    </span>

                    <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                      <button
                        onClick={() => handleEdit(act.id)}
                        className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Editar acción y registrar evidencias"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActionToDelete(act)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar acción"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub-grid: Dates, Evidence, and Efficacy details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Responsable y Plazos:</span>
                    </span>
                    <p className="text-slate-700 font-medium">{act.responsable || 'Por asignar'}</p>
                    <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-2">
                      <span>Límite: <b>{act.fechaLimite || 'S/F'}</b></span>
                      {act.fechaCierre && <span className="text-emerald-700 font-semibold">&bull; Cerrada: {act.fechaCierre}</span>}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                      <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                      <span>Evidencia Verificable:</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">
                      {act.tipoEvidencia}
                    </span>
                    <p className="text-slate-600 mt-1 text-[11px] line-clamp-2">
                      {act.detalleEvidencia || 'Sin detalle de evidencia cargado.'}
                    </p>
                    {act.linkEvidencia && (
                      <a
                        href={act.linkEvidencia}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline mt-1 font-semibold"
                      >
                        <span>Ver evidencia digital</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-500" />
                      <span>Evaluación de Eficacia:</span>
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      {act.observaciones || 'En seguimiento continuo por el responsable SST.'}
                    </p>
                    {act.nuevoNR && (
                      <div className="mt-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                        Riesgo Residual Re-evaluado: NR {act.nuevoNR} (Nivel {act.nuevoNivelRiesgo})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal for Action Deletion */}
      {actionToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-50 rounded-full border border-red-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">¿Eliminar Acción de Intervención?</h3>
                <p className="text-xs text-slate-500">Esta acción removerá el seguimiento de control.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1">
              <div className="font-mono font-bold text-slate-800 flex items-center gap-2">
                <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[11px]">{actionToDelete.id}</span>
                <span className="text-slate-600 font-semibold">{actionToDelete.peligroResumen}</span>
              </div>
              <p className="text-slate-600"><b>Jerarquía:</b> {actionToDelete.jerarquia} &bull; <b>Responsable:</b> {actionToDelete.responsable}</p>
              <p className="text-slate-500 italic text-[11px] line-clamp-2">"{actionToDelete.descripcionAccion}"</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActionToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteAction(actionToDelete.id);
                  setActionToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Sí, Eliminar Acción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
