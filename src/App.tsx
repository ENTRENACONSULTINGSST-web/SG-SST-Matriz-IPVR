import React from 'react';
import { IpvrProvider, useIpvr } from './context/IpvrContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Bloque01Organizacion } from './components/Bloque01Organizacion';
import { Bloque02Identificacion } from './components/Bloque02Identificacion';
import { Bloque03Valoracion } from './components/Bloque03Valoracion';
import { Bloque04Seguimiento } from './components/Bloque04Seguimiento';
import { MatrizIPVR } from './components/MatrizIPVR';
import { CatalogosManager } from './components/CatalogosManager';
import { AsistenteGTC45 } from './components/AsistenteGTC45';
import { RecordModal } from './components/RecordModal';
import { ActionModal } from './components/ActionModal';
import { ExcelImportModal } from './components/ExcelImportModal';

const AppContent: React.FC = () => {
  const { activeTab, orgData, isExcelImportModalOpen, setIsExcelImportModalOpen } = useIpvr();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {(activeTab === 'bloque1' || (activeTab as any) === '01') && <Bloque01Organizacion />}
        {(activeTab === 'bloque2' || (activeTab as any) === '02') && <Bloque02Identificacion />}
        {(activeTab === 'bloque3' || (activeTab as any) === '03') && <Bloque03Valoracion />}
        {(activeTab === 'bloque4' || (activeTab as any) === '04') && <Bloque04Seguimiento />}
        {activeTab === 'matriz' && <MatrizIPVR />}
        {activeTab === 'catalogos' && <CatalogosManager />}
        {activeTab === 'asistente' && <AsistenteGTC45 />}
      </main>

      {/* System Modals */}
      <RecordModal />
      <ActionModal />
      <ExcelImportModal
        isOpen={isExcelImportModalOpen}
        onClose={() => setIsExcelImportModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {orgData.empresa || 'Empresa SG-SST'} &bull; NIT: {orgData.nit || 'Sin registrar'} &bull; Matriz IPVR bajo lineamientos <b>GTC 45 / Dec. 1072 de 2015</b>
          </span>
          <span className="text-[11px] text-slate-400">
            Responsable: {orgData.responsableSST || 'SG-SST'} &bull; Licencia SST: {orgData.licenciaSST || 'Vigente'}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <IpvrProvider>
      <AppContent />
    </IpvrProvider>
  );
}
