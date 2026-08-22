import React, { useState } from 'react';
import { useIpvr } from '../context/IpvrContext';
import { NaturalezaPeligro, RegistroIPVR } from '../types';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Sliders,
  ShieldAlert,
  AlertCircle,
  Tag,
  ArrowUpDown,
  BookOpen,
  Flame,
  CheckCircle2,
  Sparkles,
  Download,
  Building,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export const Bloque02Identificacion: React.FC = () => {
  const {
    records,
    orgData,
    deleteRecord,
    setEditingRecordId,
    setIsRecordModalOpen,
    setActiveTab,
    loadEmergencyHazards,
    syncCompanyDataToAllRecords,
    hazardsCatalog
  } = useIpvr();

  const [selectedNature, setSelectedNature] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProceso, setSelectedProceso] = useState<string>('TODOS');
  const [pecFilter, setPecFilter] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<RegistroIPVR | null>(null);

  const confirmDelete = () => {
    if (recordToDelete) {
      deleteRecord(recordToDelete.id);
      setNotification(`Peligro ${recordToDelete.id} (${recordToDelete.clasificacionPeligro}) eliminado correctamente.`);
      setRecordToDelete(null);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Filter processes
  const uniqueProcesses = Array.from(new Set(records.map(r => r.proceso).filter(Boolean)));

  // Count emergency hazards
  const emgCount = records.filter(r => r.id.startsWith('IPVR-EMG') || r.codigoInterno?.startsWith('EMG')).length;

  const filteredRecords = records.filter(r => {
    const matchNature = selectedNature === 'TODOS' || r.naturalezaPeligro === selectedNature;
    const matchProceso = selectedProceso === 'TODOS' || r.proceso === selectedProceso;
    const matchPEC = !pecFilter || (r.id.startsWith('IPVR-EMG') || r.codigoInterno?.startsWith('EMG'));
    const text = `${r.id} ${r.codigoInterno || ''} ${r.proceso} ${r.area} ${r.actividad} ${r.tarea} ${r.naturalezaPeligro} ${r.clasificacionPeligro} ${r.descripcionPeligro}`.toLowerCase();
    const matchSearch = !searchQuery || text.includes(searchQuery.toLowerCase());
    return matchNature && matchProceso && matchPEC && matchSearch;
  });

  const handleEdit = (id: string) => {
    setEditingRecordId(id);
    setIsRecordModalOpen(true);
  };

  const handleNew = () => {
    setEditingRecordId(null);
    setIsRecordModalOpen(true);
  };

  const handleGoToValuation = (id: string) => {
    setActiveTab('bloque3');
  };

  const handleLoadEmergencyHazards = () => {
    loadEmergencyHazards();
    setNotification('¡10 Peligros del Plan de Emergencias (PEC) cargados y sincronizados exitosamente!');
    setTimeout(() => setNotification(null), 4000);
  };

  const natures: NaturalezaPeligro[] = [
    'Biológico',
    'Físico',
    'Químico',
    'Psicosocial',
    'Biomecánico',
    'Condiciones de Seguridad',
    'Fenómenos Naturales'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Notification Toast */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">✕</button>
        </div>
      )}

      {/* Block Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              02
            </span>
            <h2 className="text-lg font-bold text-slate-900">Bloque 02 · Identificación del Peligro</h2>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
              {records.length} Peligros Totales
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Estructura sistemática: Proceso → Área → Actividad → Tarea (Rutinaria) → Exposición → Peligro GTC 45 y Controles Existentes.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleLoadEmergencyHazards}
            id="btn-cargar-peligros-pec"
            title="Cargar los 10 peligros identificados del Plan de Emergencias (PEC)"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Cargar 10 Peligros PEC ({emgCount}/10)</span>
          </button>

          <button
            onClick={handleNew}
            id="btn-identificar-nuevo-peligro"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Identificar Nuevo Peligro</span>
          </button>
        </div>
      </div>

      {/* Synchronized Organization Info Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Building className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-slate-500">Organización Vinculada: </span>
            <strong className="text-slate-900 font-bold">{orgData.empresa || orgData.razonSocial || 'ORGANIZACIÓN'}</strong>
            <span className="text-slate-400 mx-1.5">•</span>
            <span className="text-slate-500">NIT: </span>
            <strong className="text-slate-800">{orgData.nit || 'Sin registrar'}</strong>
            <span className="text-slate-400 mx-1.5">•</span>
            <span className="text-slate-500">Planta Total: </span>
            <strong className="text-emerald-700 font-bold">
              {(Number(orgData.numTrabajadores) || 0) + (Number(orgData.numContratistas) || 0) + (Number(orgData.numTemporales) || 0)} trabajadores
            </strong>
            <span className="text-slate-500 text-[11px] ml-1">
              ({orgData.numTrabajadores || 0} directos, {orgData.numContratistas || 0} contratistas, {orgData.numTemporales || 0} temporales)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              syncCompanyDataToAllRecords();
              setNotification('Población de la empresa y sedes sincronizadas exitosamente con los peligros.');
              setTimeout(() => setNotification(null), 4000);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Sincronizar la población configurada en Bloque 01 con todos los peligros"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sincronizar Datos Generales</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bloque1')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Modificar los datos generales de la organización"
          >
            <span>Editar Bloque 01</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Nature Quick Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => { setSelectedNature('TODOS'); setPecFilter(false); }}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
            selectedNature === 'TODOS' && !pecFilter
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todos los Peligros ({records.length})
        </button>

        <button
          onClick={() => setPecFilter(!pecFilter)}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            pecFilter
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Plan de Emergencias PEC ({emgCount})</span>
        </button>

        {natures.map(nat => {
          const count = records.filter(r => r.naturalezaPeligro === nat).length;
          return (
            <button
              key={nat}
              onClick={() => { setSelectedNature(nat); setPecFilter(false); }}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedNature === nat && !pecFilter
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{nat}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${selectedNature === nat && !pecFilter ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Secondary Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por ID, código interno (EMG-...), proceso, área, peligro o descripción..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedProceso}
            onChange={e => setSelectedProceso(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium outline-none"
          >
            <option value="TODOS">Todos los Procesos</option>
            {uniqueProcesses.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hazard Records List */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No se encontraron peligros</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No hay registros que coincidan con los filtros seleccionados o aún no se han identificado peligros.
            </p>
            <button
              onClick={handleNew}
              className="mt-3 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              + Identificar primer peligro
            </button>
          </div>
        ) : (
          filteredRecords.map(r => {
            const isNivelI = r.valoracion?.nivelRiesgo === 'I';
            const isNivelII = r.valoracion?.nivelRiesgo === 'II';
            const isEmergency = r.id.startsWith('IPVR-EMG') || r.codigoInterno?.startsWith('EMG');

            return (
              <div
                key={r.id}
                className={`bg-white rounded-xl border p-4 shadow-xs hover:border-slate-300 transition-all ${
                  isEmergency ? 'border-amber-200 bg-linear-to-r from-amber-50/20 to-white' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono text-white ${
                        isEmergency ? 'bg-amber-900' : 'bg-slate-900'
                      }`}>
                        {r.id}
                      </span>
                      {r.codigoInterno && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {r.codigoInterno}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {isEmergency && (
                          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-600" />
                            Plan Emergencias (PEC)
                          </span>
                        )}
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {r.naturalezaPeligro}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {r.clasificacionPeligro}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {r.rutinaria}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        <b className="text-slate-700">{r.proceso}</b> &bull; {r.area} &bull; {r.actividad}
                      </p>
                    </div>
                  </div>

                  {/* Valuation Status Badge & Actions */}
                  <div className="flex items-center gap-2">
                    {r.valoracion?.nr > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isNivelI ? 'bg-red-100 text-red-800 border border-red-200' :
                          isNivelII ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          NR: {r.valoracion.nr} (Nivel {r.valoracion.nivelRiesgo})
                        </span>
                      </div>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                        Pendiente de Valoración
                      </span>
                    )}

                    <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                      <button
                        onClick={() => handleGoToValuation(r.id)}
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Ir a Valoración (ND x NE x NC)"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(r.id)}
                        className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Editar identificación completa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setRecordToDelete(r)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar peligro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-0.5">Tarea & Exposición:</span>
                    <p className="text-slate-600">{r.tarea}</p>
                    <div className="mt-1.5 text-[11px] text-slate-500">
                      Cargo: <b>{r.cargoExpuesto}</b> ({r.expuestosTotal} trabajadores)
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-0.5">Fuente & Consecuencias:</span>
                    <p className="text-slate-600">{r.descripcionPeligro || r.fuenteGeneradora}</p>
                    <div className="mt-1.5 text-[11px] text-slate-500">
                      Efectos: <b>{r.efectosPosibles}</b>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-0.5">Controles Existentes:</span>
                    <ul className="text-[11px] text-slate-600 space-y-0.5">
                      <li><b>Fuente:</b> {r.controlesExistentes.fuente || 'Ninguno'}</li>
                      <li><b>Medio:</b> {r.controlesExistentes.medio || 'Ninguno'}</li>
                      <li><b>Individuo:</b> {r.controlesExistentes.individuo || 'Ninguno'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            );
          })
        )}
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
                <h3 className="text-base font-bold text-slate-900">¿Eliminar Peligro?</h3>
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
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Sí, Eliminar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
