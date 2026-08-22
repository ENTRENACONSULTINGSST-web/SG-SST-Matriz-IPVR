import React, { useState } from 'react';
import { useIpvr } from '../context/IpvrContext';
import { NaturalezaPeligro, PeligroCatalogoItem } from '../types';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle,
  Building2,
  Search,
  Sliders,
  CheckSquare,
  Shield,
  Layers,
  HelpCircle
} from 'lucide-react';
import { PELIGROS_GTC45, ND_OPTIONS, NE_OPTIONS, NC_OPTIONS } from '../data/gtc45Data';

export const CatalogosManager: React.FC = () => {
  const { catalogs, updateCatalogs, hazardsCatalog, addCustomHazard } = useIpvr();
  const [activeCatalogTab, setActiveCatalogTab] = useState<'01' | '02' | '03' | '04'>('02');
  
  // Custom hazard form state
  const [newHazardNature, setNewHazardNature] = useState<NaturalezaPeligro>('Condiciones de Seguridad');
  const [newHazardClass, setNewHazardClass] = useState('');
  const [newHazardDesc, setNewHazardDesc] = useState('');
  const [newHazardEffects, setNewHazardEffects] = useState('');

  // Item additions
  const [newProceso, setNewProceso] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newCargo, setNewCargo] = useState('');

  const handleAddProceso = () => {
    if (!newProceso.trim()) return;
    updateCatalogs({ procesos: [...catalogs.procesos, newProceso.trim()] });
    setNewProceso('');
  };

  const handleRemoveProceso = (index: number) => {
    updateCatalogs({ procesos: catalogs.procesos.filter((_, i) => i !== index) });
  };

  const handleAddArea = () => {
    if (!newArea.trim()) return;
    updateCatalogs({ areas: [...catalogs.areas, newArea.trim()] });
    setNewArea('');
  };

  const handleRemoveArea = (index: number) => {
    updateCatalogs({ areas: catalogs.areas.filter((_, i) => i !== index) });
  };

  const handleAddCargo = () => {
    if (!newCargo.trim()) return;
    updateCatalogs({ cargos: [...catalogs.cargos, newCargo.trim()] });
    setNewCargo('');
  };

  const handleRemoveCargo = (index: number) => {
    updateCatalogs({ cargos: catalogs.cargos.filter((_, i) => i !== index) });
  };

  const handleCreateCustomHazard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHazardClass.trim()) return;

    const newHazard: PeligroCatalogoItem = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      naturaleza: newHazardNature,
      clasificacion: newHazardClass.trim(),
      descripcion: newHazardDesc.trim() || newHazardClass.trim(),
      efectosPosibles: newHazardEffects.trim() || 'Efectos a determinar según evaluación médica/técnica.',
      ejemplosFuente: ['Peligro personalizado de la organización']
    };

    addCustomHazard(newHazard);
    setNewHazardClass('');
    setNewHazardDesc('');
    setNewHazardEffects('');
    alert('¡Peligro personalizado agregado al catálogo GTC 45!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Catálogos Centralizados por Bloque</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión y consulta de los catálogos normativos GTC 45 y listas configurables de la organización.
          </p>
        </div>
      </div>

      {/* Block Tabs for Catalogs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveCatalogTab('01')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeCatalogTab === '01'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>01 · Organización</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('02')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeCatalogTab === '02'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>02 · Peligros GTC 45</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('03')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeCatalogTab === '03'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>03 · Valoración y Controles</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('04')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeCatalogTab === '04'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>04 · Seguimiento</span>
        </button>
      </div>

      {/* Catalog Content */}
      {activeCatalogTab === '01' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Procesos */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Catálogo de Procesos</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newProceso}
                onChange={e => setNewProceso(e.target.value)}
                placeholder="Nuevo proceso..."
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleAddProceso}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
              >
                +
              </button>
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {catalogs.procesos.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-medium">{p}</span>
                  <button onClick={() => handleRemoveProceso(idx)} className="text-slate-400 hover:text-red-600 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Áreas */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Catálogo de Áreas / Lugares</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newArea}
                onChange={e => setNewArea(e.target.value)}
                placeholder="Nueva área..."
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleAddArea}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
              >
                +
              </button>
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {catalogs.areas.map((a, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-medium">{a}</span>
                  <button onClick={() => handleRemoveArea(idx)} className="text-slate-400 hover:text-red-600 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cargos */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Catálogo de Cargos Expuestos</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCargo}
                onChange={e => setNewCargo(e.target.value)}
                placeholder="Nuevo cargo..."
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleAddCargo}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
              >
                +
              </button>
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {catalogs.cargos.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-medium">{c}</span>
                  <button onClick={() => handleRemoveCargo(idx)} className="text-slate-400 hover:text-red-600 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeCatalogTab === '02' && (
        <div className="space-y-6">
          {/* Custom Hazard Creator */}
          <form onSubmit={handleCreateCustomHazard} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Agregar Peligro Personalizado al Catálogo</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Naturaleza del Peligro *</label>
                <select
                  value={newHazardNature}
                  onChange={e => setNewHazardNature(e.target.value as NaturalezaPeligro)}
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
                <label className="block font-semibold text-slate-700 mb-1">Clasificación / Subtipo *</label>
                <input
                  type="text"
                  value={newHazardClass}
                  onChange={e => setNewHazardClass(e.target.value)}
                  placeholder="Ej. Baterías de Litio / Espacios Reducidos"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Efectos Posibles a la Salud</label>
                <input
                  type="text"
                  value={newHazardEffects}
                  onChange={e => setNewHazardEffects(e.target.value)}
                  placeholder="Ej. Quemaduras térmicas, inhalación de vapores"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer"
              >
                Guardar en Catálogo GTC 45
              </button>
            </div>
          </form>

          {/* GTC 45 Standard Catalog Viewer */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Catálogo Normativo GTC 45 ({hazardsCatalog.length} Peligros Clasificados)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {hazardsCatalog.map(haz => (
                <div key={haz.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-[11px] bg-slate-900 text-white px-2 py-0.5 rounded">
                      {haz.id}
                    </span>
                    <span className="font-bold text-emerald-800 text-[11px] bg-emerald-100/70 px-2 py-0.5 rounded">
                      {haz.naturaleza}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 mt-1">{haz.clasificacion}</h4>
                  <p className="text-slate-600 text-[11px]">{haz.descripcion}</p>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <b>Efectos:</b> {haz.efectosPosibles}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeCatalogTab === '03' && (
        <div className="space-y-6 text-xs">
          {/* ND, NE, NC Tables */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ND */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Nivel de Deficiencia (ND)</h4>
              <div className="space-y-2">
                {ND_OPTIONS.map(o => (
                  <div key={o.valor} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <b className="text-emerald-800">{o.nombre}</b>
                    <p className="text-slate-600 text-[11px] mt-0.5">{o.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* NE */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Nivel de Exposición (NE)</h4>
              <div className="space-y-2">
                {NE_OPTIONS.map(o => (
                  <div key={o.valor} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <b className="text-indigo-800">{o.nombre}</b>
                    <p className="text-slate-600 text-[11px] mt-0.5">{o.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* NC */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Nivel de Consecuencia (NC)</h4>
              <div className="space-y-2">
                {NC_OPTIONS.map(o => (
                  <div key={o.valor} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <b className="text-amber-800">{o.nombre}</b>
                    <p className="text-slate-600 text-[11px] mt-0.5">{o.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Jerarquía de Controles Definiciones */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Jerarquía de Medidas de Intervención (Decreto 1072/2015 Art. 2.2.4.6.24)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="font-bold text-red-900 block">1. Eliminación</span>
                <p className="text-red-700 text-[11px] mt-1">Modificar el diseño o proceso para suprimir y eliminar el peligro definitivamente.</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="font-bold text-amber-900 block">2. Sustitución</span>
                <p className="text-amber-700 text-[11px] mt-1">Reemplazar un peligro por otro que genere menor riesgo o peligro.</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="font-bold text-blue-900 block">3. Controles de Ingeniería</span>
                <p className="text-blue-700 text-[11px] mt-1">Aislamiento, guardas, extractores, barreras acústicas o protecciones físicas.</p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <span className="font-bold text-purple-900 block">4. Controles Administrativos</span>
                <p className="text-purple-700 text-[11px] mt-1">Señalización, advertencia, procedimientos, permisos de trabajo y capacitación.</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="font-bold text-emerald-900 block">5. Equipos / EPP</span>
                <p className="text-emerald-700 text-[11px] mt-1">Medidas basadas en el uso de elementos de protección personal certificados.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeCatalogTab === '04' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Estados */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Estados de la Acción</h4>
            <div className="space-y-1.5">
              {catalogs.estadosAccion.map(est => (
                <div key={est} className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">{est}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eficacia */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Criterios de Eficacia</h4>
            <div className="space-y-1.5">
              {catalogs.nivelesEficacia.map(ef => (
                <div key={ef} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-700">{ef}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidencias */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Tipos de Evidencia Verificable</h4>
            <div className="space-y-1.5">
              {catalogs.tiposEvidencia.map(ev => (
                <div key={ev} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-700">{ev}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
