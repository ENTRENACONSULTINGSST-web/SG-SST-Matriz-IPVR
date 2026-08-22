import React from 'react';
import { useIpvr, ActiveTab } from '../context/IpvrContext';
import {
  LayoutDashboard,
  Building2,
  Search,
  Sliders,
  CheckSquare,
  TableProperties,
  BookOpen,
  Plus,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Printer,
  UploadCloud,
  FileDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    orgData,
    records,
    actions,
    setIsRecordModalOpen,
    setEditingRecordId,
    setIsExcelImportModalOpen,
    exportMatrixCSV,
    exportMatrixExcel,
    exportMatrixPDF,
    exportMatrixDOCX,
    exportDatabaseJSON,
    resetToDefaults
  } = useIpvr();

  const handleNewRecord = () => {
    setEditingRecordId(null);
    setIsRecordModalOpen(true);
  };

  const navItems: { id: ActiveTab; label: string; numberBadge?: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'bloque1', label: '01 · Organización', numberBadge: '01', icon: Building2 },
    { id: 'bloque2', label: '02 · Identificación', numberBadge: '02', icon: Search },
    { id: 'bloque3', label: '03 · Valoración y controles', numberBadge: '03', icon: Sliders },
    { id: 'bloque4', label: '04 · Seguimiento', numberBadge: '04', icon: CheckSquare },
    { id: 'matriz', label: 'Matriz IPVR', icon: TableProperties },
    { id: 'catalogos', label: 'Catálogos', icon: BookOpen },
    { id: 'asistente', label: 'Asistente GTC 45', icon: Sparkles }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-inner font-black text-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                  SG-SST · Matriz IPVR
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  GTC 45 V3
                </span>
                <span className="hidden sm:inline-block bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded border border-slate-700">
                  Versión {orgData.versionMatriz || '3.0'}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md font-medium">
                {orgData.empresa || 'Empresa sin configurar'} &bull; NIT: {orgData.nit || 'S/N'} &bull; Clase {orgData.claseRiesgo || 'I'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-import-excel-nav"
              onClick={() => setIsExcelImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/40 transition-colors cursor-pointer shadow-xs"
              title="Cargar archivo Excel (.xlsx / .csv) para poblar la matriz IPVR"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Cargar Excel</span>
            </button>

            <button
              id="btn-nuevo-peligro-nav"
              onClick={handleNewRecord}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              title="Registrar nuevo peligro en la matriz"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Peligro</span>
            </button>

            <button
              id="btn-export-docx-direct"
              onClick={exportMatrixDOCX}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Descargar Informe Ejecutivo Oficial en Word (.docx) con gráficos, Matriz de Calor y tablas"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Informe Word (.docx)</span>
            </button>

            <button
              id="btn-export-pdf-direct"
              onClick={exportMatrixPDF}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Descargar documento oficial PDF de la Matriz IPVR (GTC 45)"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Descargar PDF</span>
            </button>

            <button
              id="btn-export-excel"
              onClick={exportMatrixExcel}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Descargar libro Excel (.xlsx) con todas las hojas y formato base"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar Excel</span>
            </button>

            <button
              id="btn-print-view"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Imprimir vista de pantalla"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Imprimir</span>
            </button>

            <button
              id="btn-export-backup"
              onClick={exportDatabaseJSON}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Exportar respaldo JSON de la base de datos"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Respaldo</span>
            </button>

            <button
              id="btn-reset-demo"
              onClick={() => {
                if (window.confirm('¿Desea restablecer los datos de la matriz a los 10 peligros oficiales del PEC?')) {
                  resetToDefaults();
                }
              }}
              className="inline-flex items-center gap-1 px-2 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-medium rounded transition-colors cursor-pointer"
              title="Restablecer datos oficiales"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 border-t border-slate-800/80 mt-2 text-xs scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'bloque2' && records.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-slate-700 text-slate-200 text-[10px] rounded-full font-bold">
                    {records.length}
                  </span>
                )}
                {item.id === 'bloque4' && actions.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-slate-700 text-slate-200 text-[10px] rounded-full font-bold">
                    {actions.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
