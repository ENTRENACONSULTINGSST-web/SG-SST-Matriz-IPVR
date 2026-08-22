import React, { useState, useEffect } from 'react';
import { useIpvr } from '../context/IpvrContext';
import {
  RegistroParticipacion,
  RolParticipacion,
  MotivoActualizacionMatriz
} from '../types';
import {
  Building2,
  Save,
  CheckCircle2,
  FileText,
  Shield,
  Calendar,
  Users,
  MapPin,
  ListPlus,
  Trash2,
  BookOpen,
  UserCheck,
  Award,
  PlusCircle,
  ExternalLink,
  Info,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Bloque01Organizacion: React.FC = () => {
  const { orgData, setOrgData, syncCompanyDataToAllRecords, catalogs, setActiveTab } = useIpvr();
  const [formData, setFormData] = useState(orgData);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [autoSyncHazards, setAutoSyncHazards] = useState(true);
  const [newSede, setNewSede] = useState('');

  // Keep local state in sync when global orgData updates
  useEffect(() => {
    setFormData(orgData);
  }, [orgData]);

  // Worker participation modal / inline form state
  const [isAddingPart, setIsAddingPart] = useState(false);
  const [newPart, setNewPart] = useState<Omit<RegistroParticipacion, 'id'>>({
    fecha: new Date().toISOString().split('T')[0],
    nombre: '',
    cargo: '',
    area: '',
    rol: 'Trabajador operativo / administrativo',
    tipoEvidencia: 'Acta de reunión COPASST',
    soporteUrl: '',
    observaciones: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: name === 'numTrabajadores' || name === 'numContratistas' || name === 'numTemporales'
          ? (parseInt(value, 10) || 0)
          : value
      };
      // Keep razonSocial and empresa in sync
      if (name === 'empresa') updated.razonSocial = value;
      if (name === 'razonSocial') updated.empresa = value;
      return updated;
    });
  };

  const handleAddSede = () => {
    if (!newSede.trim()) return;
    setFormData(prev => ({
      ...prev,
      centrosTrabajo: [...(prev.centrosTrabajo || []), newSede.trim()]
    }));
    setNewSede('');
  };

  const handleRemoveSede = (index: number) => {
    setFormData(prev => ({
      ...prev,
      centrosTrabajo: (prev.centrosTrabajo || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddParticipacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPart.nombre.trim()) return;
    const partRecord: RegistroParticipacion = {
      ...newPart,
      id: `PAR-${String(Date.now()).slice(-4)}`
    };
    setFormData(prev => ({
      ...prev,
      registrosParticipacion: [partRecord, ...(prev.registrosParticipacion || [])]
    }));
    setNewPart({
      fecha: new Date().toISOString().split('T')[0],
      nombre: '',
      cargo: '',
      area: '',
      rol: 'Trabajador operativo / administrativo',
      tipoEvidencia: 'Acta de reunión COPASST',
      soporteUrl: '',
      observaciones: ''
    });
    setIsAddingPart(false);
  };

  const handleRemoveParticipacion = (id: string) => {
    setFormData(prev => ({
      ...prev,
      registrosParticipacion: (prev.registrosParticipacion || []).filter(p => p.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      razonSocial: formData.empresa || formData.razonSocial || 'ORGANIZACIÓN',
      empresa: formData.empresa || formData.razonSocial || 'ORGANIZACIÓN'
    };
    setOrgData(cleanedData);
    if (autoSyncHazards) {
      syncCompanyDataToAllRecords(cleanedData);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 5000);
  };

  const handleManualSyncNow = () => {
    const cleanedData = {
      ...formData,
      razonSocial: formData.empresa || formData.razonSocial || 'ORGANIZACIÓN',
      empresa: formData.empresa || formData.razonSocial || 'ORGANIZACIÓN'
    };
    setOrgData(cleanedData);
    syncCompanyDataToAllRecords(cleanedData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 5000);
  };

  const motivosList: MotivoActualizacionMatriz[] = [
    'Actualización anual reglamentaria (Dec. 1072 Art. 2.2.4.6.15)',
    'Ocurrencia de accidente de trabajo mortal o evento catastrófico',
    'Cambios en procesos, instalaciones, maquinaria o materias primas',
    'Resultados de auditoría interna / externa o inspección ARL / Mintrabajo',
    'Creación inicial de la matriz IPVR'
  ];

  const rolesParticipacion: RolParticipacion[] = [
    'Trabajador operativo / administrativo',
    'Representante COPASST',
    'Vigía de Seguridad y Salud',
    'Líder de Proceso / Jefe de Área',
    'Brigadista de Emergencias',
    'Asesor ARL',
    'Responsable SG-SST'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              01
            </span>
            <h2 className="text-lg font-bold text-slate-900">Bloque 01 · Organización, Metodología, Control de Versión y Participación</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Garantiza el cumplimiento del Decreto 1072/2015 Art. 2.2.4.6.15: Metodología técnica, control de versión, revisión, aprobación y evidencia de participación efectiva de los trabajadores.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold shadow-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-emerald-950">¡Información de la empresa guardada y sincronizada exitosamente!</p>
                <p className="text-[11px] text-emerald-800 font-normal">
                  Se actualizaron <strong>{formData.empresa || formData.razonSocial}</strong> (NIT: {formData.nit}), población de <strong>{(Number(formData.numTrabajadores) || 0) + (Number(formData.numContratistas) || 0) + (Number(formData.numTemporales) || 0)} trabajadores</strong> ({formData.numTrabajadores} directos, {formData.numContratistas} contratistas, {formData.numTemporales || 0} temporales) y sedes en los módulos de Peligros, Valoración y Matriz.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('bloque2')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              <span>Ver Peligros Sincronizados</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Control de Metodología y Versión (V3.1 Requisito Clave) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>1. Control de Metodología y Versión Documental (V3.1)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Metodología Técnica Aplicada *</label>
              <input
                type="text"
                name="metodologia"
                value={formData.metodologia || 'GTC 45:2012 / Decreto 1072 de 2015 (Art. 2.2.4.6.15)'}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Ej. Guía Técnica Colombiana GTC 45 (Segunda actualización) / Dec. 1072"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Versión de la Matriz *</label>
              <input
                type="text"
                name="versionMatriz"
                value={formData.versionMatriz || 'V3.1'}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-semibold text-slate-800"
                placeholder="Ej. V3.1"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fecha de Elaboración Inicial</label>
              <input
                type="date"
                name="fechaElaboracion"
                value={formData.fechaElaboracion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fecha de Última Actualización *</label>
              <input
                type="date"
                name="fechaActualizacion"
                value={formData.fechaActualizacion}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fecha Próxima Revisión Periódica</label>
              <input
                type="date"
                name="fechaProximaRevision"
                value={formData.fechaProximaRevision}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Motivo de la Actualización / Revisión *</label>
              <select
                name="motivoActualizacion"
                value={formData.motivoActualizacion || motivosList[0]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {motivosList.map((m, idx) => (
                  <option key={idx} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block font-semibold text-slate-700 mb-1">Alcance y Delimitación de la Metodología</label>
              <textarea
                name="alcanceMetodologia"
                value={formData.alcanceMetodologia || ''}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Aplica a todas las sedes, centros de trabajo, procesos estratégicos, misionales y de apoyo, actividades rutinarias y no rutinarias, abarcando personal directo, contratistas, temporales y visitantes."
              />
            </div>
          </div>
        </div>

        {/* Card 2: Control de Revisión y Aprobación (V3.1) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>2. Control de Elaboración, Revisión y Aprobación Formal</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Elaborado por */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Elaborado por (Responsable SG-SST)</span>
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5 font-medium">Nombre Completo *</label>
                <input
                  type="text"
                  name="elaboradoPor"
                  value={formData.elaboradoPor || formData.responsableSST}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Coordinador de SG-SST"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5 font-medium">Cargo</label>
                <input
                  type="text"
                  name="cargoElaborador"
                  value={formData.cargoElaborador || formData.cargoResponsable}
                  onChange={handleChange}
                  placeholder="Ej. Coordinador SG-SST"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5 font-medium">No. Licencia en SST *</label>
                <input
                  type="text"
                  name="licenciaSST"
                  value={formData.licenciaSST || ''}
                  onChange={handleChange}
                  placeholder="Ej. Licencia SST vigente (si aplica)"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Revisado por */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Revisado por (COPASST / Líder Técnico)</span>
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5 font-medium">Nombre del Revisor *</label>
                <input
                  type="text"
                  name="revisadoPor"
                  value={formData.revisadoPor || ''}
                  onChange={handleChange}
                  placeholder="Ej. Comité de Emergencias / Líder Técnico"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5 font-medium">Cargo / Rol</label>
                <input
                  type="text"
                  name="cargoRevisor"
                  value={formData.cargoRevisor || ''}
                  onChange={handleChange}
                  placeholder="Ej. Presidente COPASST / Comité de Emergencias"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Aprobado por */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Aprobado por (Gerencia / Rep. Legal)</span>
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5 font-medium">Nombre del Aprobador *</label>
                <input
                  type="text"
                  name="aprobadoPor"
                  value={formData.aprobadoPor || ''}
                  onChange={handleChange}
                  placeholder="Ej. Gerente General / Representante Legal"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5 font-medium">Cargo Gerencial</label>
                <input
                  type="text"
                  name="cargoAprobador"
                  value={formData.cargoAprobador || 'Representante Legal / Gerente General'}
                  onChange={handleChange}
                  placeholder="Ej. Gerente General"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5 font-medium">Fecha de Aprobación</label>
                <input
                  type="date"
                  name="fechaAprobacion"
                  value={formData.fechaAprobacion || ''}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Evidencia de Participación de los Trabajadores (V3.1 Dec. 1072 Art. 2.2.4.6.15) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>3. Registro y Evidencia de Participación de Trabajadores / COPASST</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Decreto 1072/2015 exige constancia de que los trabajadores y el COPASST participaron en la identificación de peligros y valoración de riesgos.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingPart(!isAddingPart)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isAddingPart ? 'Cancelar' : 'Registrar Participación'}</span>
            </button>
          </div>

          {/* Form to add worker participation */}
          {isAddingPart && (
            <div className="mb-4 p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3 text-xs animate-fade-in">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Nuevo Registro de Consulta y Participación</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    value={newPart.fecha}
                    onChange={e => setNewPart({ ...newPart, fecha: e.target.value })}
                    required
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nombre de Participante(s) o Grupo *</label>
                  <input
                    type="text"
                    value={newPart.nombre}
                    onChange={e => setNewPart({ ...newPart, nombre: e.target.value })}
                    required
                    placeholder="Ej. Líder de Proceso / Operarios de Bodega"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cargo / Puesto</label>
                  <input
                    type="text"
                    value={newPart.cargo}
                    onChange={e => setNewPart({ ...newPart, cargo: e.target.value })}
                    placeholder="Ej. Auxiliares de Almacén"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Área / Proceso</label>
                  <input
                    type="text"
                    value={newPart.area}
                    onChange={e => setNewPart({ ...newPart, area: e.target.value })}
                    placeholder="Ej. Almacén y Distribución"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rol en el SG-SST *</label>
                  <select
                    value={newPart.rol}
                    onChange={e => setNewPart({ ...newPart, rol: e.target.value as RolParticipacion })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {rolesParticipacion.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Evidencia / Mecanismo *</label>
                  <input
                    type="text"
                    value={newPart.tipoEvidencia}
                    onChange={e => setNewPart({ ...newPart, tipoEvidencia: e.target.value })}
                    placeholder="Ej. Acta COPASST No. 02-2026 / Lista de asistencia inspección"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enlace / Soporte Digital (URL)</label>
                  <input
                    type="url"
                    value={newPart.soporteUrl || ''}
                    onChange={e => setNewPart({ ...newPart, soporteUrl: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-semibold text-slate-700 mb-1">Observaciones / Aportes Recibidos</label>
                  <textarea
                    value={newPart.observaciones || ''}
                    onChange={e => setNewPart({ ...newPart, observaciones: e.target.value })}
                    rows={2}
                    placeholder="Descripción de los aportes sobre peligros o condiciones identificadas..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingPart(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200/60 rounded-md font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddParticipacion}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold cursor-pointer shadow-xs"
                >
                  Guardar Participación
                </button>
              </div>
            </div>
          )}

          {/* Participations Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Fecha</th>
                  <th className="px-3 py-2">Nombre / Participantes</th>
                  <th className="px-3 py-2">Rol SG-SST</th>
                  <th className="px-3 py-2">Área</th>
                  <th className="px-3 py-2">Tipo de Evidencia</th>
                  <th className="px-3 py-2">Aportes / Observaciones</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(formData.registrosParticipacion || []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                      No hay registros de participación de trabajadores cargados aún. Haz clic en "Registrar Participación".
                    </td>
                  </tr>
                ) : (
                  formData.registrosParticipacion.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3 py-2 font-mono text-slate-600 whitespace-nowrap">{p.fecha}</td>
                      <td className="px-3 py-2 font-semibold text-slate-800">
                        <div>{p.nombre}</div>
                        {p.cargo && <div className="text-[11px] text-slate-400 font-normal">{p.cargo}</div>}
                      </td>
                      <td className="px-3 py-2">
                        <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                          {p.rol}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-600">{p.area || 'Todas'}</td>
                      <td className="px-3 py-2">
                        <div className="text-slate-800 font-medium">{p.tipoEvidencia}</div>
                        {p.soporteUrl && (
                          <a
                            href={p.soporteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-600 hover:underline text-[11px] mt-0.5"
                          >
                            <span>Ver soporte</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-600 max-w-xs truncate">{p.observaciones || '—'}</td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipacion(p.id)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 4: Datos Generales de la Empresa */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>4. Datos Generales de la Empresa</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Razón Social / Empresa *</label>
              <input
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Ej. Industrias y Logística Colombia S.A.S."
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIT *</label>
              <input
                type="text"
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Ej. NIT / Identificación Tributaria"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Código y Actividad CIIU *</label>
              <input
                type="text"
                name="ciiu"
                value={formData.ciiu}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Ej. 4669 - Comercio al por mayor"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ARL Afiliada *</label>
              <input
                type="text"
                name="arl"
                value={formData.arl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Ej. SURA Seguros de Riesgos Laborales"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clase de Riesgo Principal (Decreto 768/2022) *</label>
              <select
                name="claseRiesgo"
                value={formData.claseRiesgo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-medium"
              >
                {catalogs.clasesRiesgo.map(cr => (
                  <option key={cr} value={cr}>Clase {cr} ({cr === 'I' ? 'Mínimo' : cr === 'II' ? 'Bajo' : cr === 'III' ? 'Medio' : cr === 'IV' ? 'Alto' : 'Máximo'})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nº Directos</label>
                <input
                  type="number"
                  min="0"
                  name="numTrabajadores"
                  value={formData.numTrabajadores}
                  onChange={handleChange}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-center"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nº Contratistas</label>
                <input
                  type="number"
                  min="0"
                  name="numContratistas"
                  value={formData.numContratistas}
                  onChange={handleChange}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-center"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nº Temporales</label>
                <input
                  type="number"
                  min="0"
                  name="numTemporales"
                  value={formData.numTemporales || 0}
                  onChange={handleChange}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-center"
                />
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">Descripción de la Actividad Económica</label>
              <input
                type="text"
                name="actividadEconomica"
                value={formData.actividadEconomica}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Ej. Distribución, almacenamiento, ensamble y logística industrial"
              />
            </div>
          </div>
        </div>

        {/* Card 5: Sedes y Centros de Trabajo */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>5. Sedes y Centros de Trabajo</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dirección Principal</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Ej. Calle 26 # 85D - 55"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ciudad / Municipio</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Ej. Bogotá D.C."
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Departamento</label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Ej. Cundinamarca"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Centros de Trabajo Registrados para la Matriz</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSede}
                onChange={e => setNewSede(e.target.value)}
                placeholder="Nombre de la sede o centro de trabajo adicional"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddSede}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ListPlus className="w-3.5 h-3.5" />
                <span>Agregar Centro</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(formData.centrosTrabajo || []).map((sede, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium"
                >
                  <span>{sede}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSede(idx)}
                    className="text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 6: Política y Objetivos SST */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>6. Política y Objetivos SST Articulados</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Compromiso / Política del SG-SST</label>
              <textarea
                name="politicaSST"
                value={formData.politicaSST}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Declaración de compromiso con la seguridad y salud..."
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Objetivos del SG-SST Vinculados a la Matriz</label>
              <textarea
                name="objetivosSST"
                value={formData.objetivosSST}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="1. Identificar el 100% de los peligros..."
              />
            </div>
          </div>
        </div>

        {/* Action Button & Sync Controls */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoSyncHazards}
              onChange={e => setAutoSyncHazards(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span>
              <strong>Sincronización automática:</strong> Reflejar Razón Social, NIT, Sedes y Planta de Personal ({formData.numTrabajadores} Directos + {formData.numContratistas} Contratistas + {formData.numTemporales || 0} Temporales) en la Identificación de Peligros y Valoración GTC 45.
            </span>
          </label>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleManualSyncNow}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Sincronizar inmediatamente la población y sedes con todos los peligros registrados"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sincronizar con Peligros</span>
            </button>

            <button
              type="submit"
              id="btn-guardar-org"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Guardar Configuración Organizacional</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
