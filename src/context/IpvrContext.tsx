import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  OrganizacionData,
  RegistroIPVR,
  AccionSeguimiento,
  CatalogoConfig,
  PeligroCatalogoItem,
  NaturalezaPeligro
} from '../types';
import {
  INITIAL_ORG_DATA,
  INITIAL_RECORDS,
  INITIAL_ACTIONS,
  INITIAL_CATALOGS,
  PELIGROS_GTC45,
  calcularNP,
  calcularNR
} from '../data/gtc45Data';
import { generateIpvrPDF } from '../utils/pdfAndExcelExporter';
import { exportMatrixToTemplateExcel } from '../utils/excelTemplateEngine';
import { generateExecutiveDocxReport } from '../utils/docxExecutiveReport';
import { generateFullMatrixWithAI } from '../services/geminiClient';

const STORAGE_KEYS = {
  ORG: 'sgsst_ipvr_org_v4',
  RECORDS: 'sgsst_ipvr_records_v4',
  ACTIONS: 'sgsst_ipvr_actions_v4',
  CATALOGS: 'sgsst_ipvr_catalogs_v4',
  CUSTOM_HAZARDS: 'sgsst_ipvr_custom_hazards_v4'
};

export type ActiveTab = 'dashboard' | 'bloque1' | 'bloque2' | 'bloque3' | 'bloque4' | 'matriz' | 'catalogos' | 'asistente';

interface IpvrContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  orgData: OrganizacionData;
  setOrgData: React.Dispatch<React.SetStateAction<OrganizacionData>>;
  records: RegistroIPVR[];
  actions: AccionSeguimiento[];
  catalogs: CatalogoConfig;
  hazardsCatalog: PeligroCatalogoItem[];
  
  // Records operations
  addRecord: (record: Omit<RegistroIPVR, 'id' | 'fechaCreacion'>) => RegistroIPVR;
  updateRecord: (id: string, record: Partial<RegistroIPVR>) => void;
  deleteRecord: (id: string) => void;
  getRecordById: (id: string) => RegistroIPVR | undefined;
  
  // Actions operations
  addAction: (action: Omit<AccionSeguimiento, 'id'>) => AccionSeguimiento;
  updateAction: (id: string, action: Partial<AccionSeguimiento>) => void;
  deleteAction: (id: string) => void;
  
  // Catalogs operations
  updateCatalogs: (newCatalogs: Partial<CatalogoConfig>) => void;
  addCustomHazard: (hazard: PeligroCatalogoItem) => void;
  
  // Quick valuation calculation
  calculateValuation: (nd: number, ne: number, nc: number) => {
    nd: any;
    ne: any;
    np: number;
    interpretacionNP: any;
    nc: any;
    nr: number;
    nivelRiesgo: any;
    aceptabilidad: string;
    significadoNR: string;
    estado: any;
  };
  
  // Persistence & Data Management
  resetToDefaults: () => void;
  loadEmergencyHazards: () => void;
  generateMatrixWithAI: () => Promise<void>;
  syncCompanyDataToAllRecords: (customOrg?: OrganizacionData) => void;
  updateOrgData: (newData: Partial<OrganizacionData>, autoSync?: boolean) => void;
  clearAllData: () => void;
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonData: string) => boolean;
  exportMatrixCSV: () => void;
  exportMatrixExcel: () => Promise<void>;
  exportMatrixPDF: () => void;
  exportMatrixDOCX: () => Promise<void>;
  setRecords: React.Dispatch<React.SetStateAction<RegistroIPVR[]>>;
  
  // UI Helpers
  editingRecordId: string | null;
  setEditingRecordId: (id: string | null) => void;
  isRecordModalOpen: boolean;
  setIsRecordModalOpen: (open: boolean) => void;
  editingActionId: string | null;
  setEditingActionId: (id: string | null) => void;
  isActionModalOpen: boolean;
  setIsActionModalOpen: (open: boolean) => void;
  isExcelImportModalOpen: boolean;
  setIsExcelImportModalOpen: (open: boolean) => void;
  
  // Quick filters for Matrix
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  filterProceso: string;
  setFilterProceso: (s: string) => void;
  filterPeligro: string;
  setFilterPeligro: (s: string) => void;
  filterNivelRiesgo: string;
  setFilterNivelRiesgo: (s: string) => void;
  filterAceptabilidad: string;
  setFilterAceptabilidad: (s: string) => void;
}

const IpvrContext = createContext<IpvrContextType | undefined>(undefined);

export const IpvrProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // 1. Organization state
  const [orgData, setOrgData] = useState<OrganizacionData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORG);
      return saved ? JSON.parse(saved) : INITIAL_ORG_DATA;
    } catch {
      return INITIAL_ORG_DATA;
    }
  });

  // 2. Records state
  const [records, setRecords] = useState<RegistroIPVR[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
      if (!saved) return INITIAL_RECORDS;
      let parsed: RegistroIPVR[] = JSON.parse(saved);
      // Clean up legacy template demo records IPVR-001 to IPVR-004 that do not belong to the document
      parsed = parsed.filter(r => !['IPVR-001', 'IPVR-002', 'IPVR-003', 'IPVR-004'].includes(r.id));
      if (parsed.length === 0) return INITIAL_RECORDS;
      return parsed;
    } catch {
      return INITIAL_RECORDS;
    }
  });

  // 3. Actions state
  const [actions, setActions] = useState<AccionSeguimiento[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIONS);
      if (!saved) return INITIAL_ACTIONS;
      let parsed: AccionSeguimiento[] = JSON.parse(saved);
      // Clean up legacy template demo actions that do not belong to the document
      parsed = parsed.filter(
        a => !['ACT-001', 'ACT-002', 'ACT-003', 'ACT-004'].includes(a.id) &&
             !['IPVR-001', 'IPVR-002', 'IPVR-003', 'IPVR-004'].includes(a.ipvrId)
      );
      if (parsed.length === 0) return INITIAL_ACTIONS;
      return parsed;
    } catch {
      return INITIAL_ACTIONS;
    }
  });

  // 4. Catalogs state
  const [catalogs, setCatalogs] = useState<CatalogoConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATALOGS);
      return saved ? JSON.parse(saved) : INITIAL_CATALOGS;
    } catch {
      return INITIAL_CATALOGS;
    }
  });

  // 5. Custom Hazards catalog state
  const [customHazards, setCustomHazards] = useState<PeligroCatalogoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_HAZARDS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isExcelImportModalOpen, setIsExcelImportModalOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProceso, setFilterProceso] = useState('');
  const [filterPeligro, setFilterPeligro] = useState('');
  const [filterNivelRiesgo, setFilterNivelRiesgo] = useState('');
  const [filterAceptabilidad, setFilterAceptabilidad] = useState('');

  // Sync to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORG, JSON.stringify(orgData));
  }, [orgData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATALOGS, JSON.stringify(catalogs));
  }, [catalogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_HAZARDS, JSON.stringify(customHazards));
  }, [customHazards]);

  const hazardsCatalog = [...PELIGROS_GTC45, ...customHazards];

  const calculateValuation = (nd: number, ne: number, nc: number) => {
    const { np, interpretacion } = calcularNP(nd as any, ne as any);
    const { nr, nivelRiesgo, interpretacionNR, aceptabilidad, significadoNR } = calcularNR(np, nc as any);
    return {
      nd: nd as any,
      ne: ne as any,
      np,
      interpretacionNP: interpretacion,
      nc: nc as any,
      nr,
      nivelRiesgo,
      interpretacionNR,
      aceptabilidad,
      significadoNR,
      estado: (nr > 0 ? 'Valorado' : 'Pendiente') as any
    };
  };

  const addRecord = (recordData: Omit<RegistroIPVR, 'id' | 'fechaCreacion'>): RegistroIPVR => {
    // Generate next ID
    const highestNum = records.reduce((max, r) => {
      const match = r.id.match(/IPVR-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    const nextId = `IPVR-${String(highestNum + 1).padStart(3, '0')}`;
    const newRecord: RegistroIPVR = {
      ...recordData,
      id: nextId,
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    setRecords(prev => [newRecord, ...prev]);
    return newRecord;
  };

  const updateRecord = (id: string, updatedFields: Partial<RegistroIPVR>) => {
    setRecords(prev =>
      prev.map(r => {
        if (r.id === id) {
          const updated = { ...r, ...updatedFields, fechaRevision: new Date().toISOString().split('T')[0] };
          return updated;
        }
        return r;
      })
    );
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    // Also delete linked actions or disassociate
    setActions(prev => prev.filter(a => a.ipvrId !== id));
  };

  const getRecordById = (id: string) => records.find(r => r.id === id);

  const addAction = (actionData: Omit<AccionSeguimiento, 'id'>): AccionSeguimiento => {
    const highestNum = actions.reduce((max, a) => {
      const match = a.id.match(/ACT-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    const nextId = `ACT-${String(highestNum + 1).padStart(3, '0')}`;
    const newAction: AccionSeguimiento = {
      ...actionData,
      id: nextId
    };
    setActions(prev => [newAction, ...prev]);
    return newAction;
  };

  const updateAction = (id: string, updatedFields: Partial<AccionSeguimiento>) => {
    setActions(prev => prev.map(a => (a.id === id ? { ...a, ...updatedFields } : a)));
  };

  const deleteAction = (id: string) => {
    setActions(prev => prev.filter(a => a.id !== id));
  };

  const updateCatalogs = (newCatalogs: Partial<CatalogoConfig>) => {
    setCatalogs(prev => ({ ...prev, ...newCatalogs }));
  };

  const addCustomHazard = (hazard: PeligroCatalogoItem) => {
    setCustomHazards(prev => [...prev, hazard]);
  };

  const syncCompanyDataToAllRecords = (customOrg?: OrganizacionData) => {
    const targetOrg = customOrg || orgData;
    const directos = Number(targetOrg.numTrabajadores) || 0;
    const contratistas = Number(targetOrg.numContratistas) || 0;
    const temporales = Number(targetOrg.numTemporales) || 0;
    const totalCompanyStaff = directos + contratistas + temporales;
    const effectiveTotal = totalCompanyStaff > 0 ? totalCompanyStaff : 1;

    setRecords(prev =>
      prev.map(r => {
        const cargo = (r.cargoExpuesto || '').toLowerCase();
        const isCompanyWide =
          cargo.includes('todo') ||
          cargo.includes('todos') ||
          cargo.includes('personal') ||
          cargo.includes('general') ||
          cargo.includes('operativo') ||
          cargo.includes('colaborador') ||
          cargo.includes('brigad') ||
          r.id.startsWith('IPVR-EMG') ||
          r.codigoInterno?.startsWith('EMG') ||
          r.naturalezaPeligro === 'Fenómenos Naturales' ||
          r.clasificacionPeligro?.toLowerCase().includes('sismo') ||
          r.clasificacionPeligro?.toLowerCase().includes('inundaci') ||
          r.clasificacionPeligro?.toLowerCase().includes('incendio') ||
          r.clasificacionPeligro?.toLowerCase().includes('evacuaci') ||
          r.clasificacionPeligro?.toLowerCase().includes('terroris') ||
          r.clasificacionPeligro?.toLowerCase().includes('público') ||
          r.clasificacionPeligro?.toLowerCase().includes('asalto') ||
          r.clasificacionPeligro?.toLowerCase().includes('precipitacion');

        let recDirectos = r.expuestosDirectos;
        let recContratistas = r.expuestosContratistas;
        let recTemporales = r.expuestosTemporales;

        if (isCompanyWide) {
          recDirectos = directos > 0 ? directos : 1;
          recContratistas = contratistas;
          recTemporales = temporales;
        } else {
          // If departmental or specific, clamp so directos / contratistas / temporales don't exceed company totals
          if (directos > 0 && recDirectos > directos) {
            recDirectos = directos;
          }
          if (recContratistas > contratistas) {
            recContratistas = contratistas;
          }
          if (recTemporales > temporales) {
            recTemporales = temporales;
          }
        }

        const recTotal = (Number(recDirectos) || 0) + (Number(recContratistas) || 0) + (Number(recTemporales) || 0);
        const finalTotal = recTotal > 0 ? recTotal : 1;

        return {
          ...r,
          expuestosDirectos: recDirectos,
          expuestosContratistas: recContratistas,
          expuestosTemporales: recTemporales,
          expuestosTotal: finalTotal,
          criterios: {
            ...r.criterios,
            numExpuestos: finalTotal
          },
          responsableRevision: targetOrg.elaboradoPor || targetOrg.responsableSST || r.responsableRevision
        };
      })
    );

    // Synchronize Catalogs (sedes and SST responsibles)
    setCatalogs(prev => {
      const allSedes = [
        ...(targetOrg.centrosTrabajo || []),
        targetOrg.centroPrincipal,
        targetOrg.direccion
      ].filter((s): s is string => Boolean(s && s.trim()));

      const updatedAreas = Array.from(new Set([...allSedes, ...prev.areas]));
      const updatedResponsables = Array.from(new Set([
        targetOrg.elaboradoPor,
        targetOrg.responsableSST,
        targetOrg.revisadoPor,
        targetOrg.aprobadoPor,
        ...prev.responsablesSST
      ].filter((resp): resp is string => Boolean(resp && resp.trim()))));

      return {
        ...prev,
        areas: updatedAreas.length > 0 ? updatedAreas : prev.areas,
        responsablesSST: updatedResponsables.length > 0 ? updatedResponsables : prev.responsablesSST
      };
    });
  };

  const updateOrgData = (newData: Partial<OrganizacionData>, autoSync: boolean = true) => {
    setOrgData(prev => {
      const merged = { ...prev, ...newData };
      if (autoSync) {
        setTimeout(() => syncCompanyDataToAllRecords(merged), 10);
      }
      return merged;
    });
  };

  const resetToDefaults = () => {
    setOrgData(INITIAL_ORG_DATA);
    setRecords(INITIAL_RECORDS);
    setActions(INITIAL_ACTIONS);
    setCatalogs(INITIAL_CATALOGS);
    setCustomHazards([]);
    setTimeout(() => syncCompanyDataToAllRecords(INITIAL_ORG_DATA), 10);
  };

  const loadEmergencyHazards = () => {
    // Merges all 10 emergency hazards if not present, adapted to company workforce
    const directos = Number(orgData.numTrabajadores) || 1;
    const contratistas = Number(orgData.numContratistas) || 0;
    const temporales = Number(orgData.numTemporales) || 0;
    const totalExp = directos + contratistas + temporales;

    const adaptedInitial = INITIAL_RECORDS.map(r => ({
      ...r,
      expuestosDirectos: directos,
      expuestosContratistas: contratistas,
      expuestosTemporales: temporales,
      expuestosTotal: totalExp > 0 ? totalExp : 1,
      criterios: {
        ...r.criterios,
        numExpuestos: totalExp > 0 ? totalExp : 1
      },
      responsableRevision: orgData.elaboradoPor || orgData.responsableSST || r.responsableRevision
    }));

    setRecords(prev => {
      const existingIds = new Set(prev.map(r => r.id));
      const missing = adaptedInitial.filter(r => !existingIds.has(r.id));
      return missing.length > 0 ? [...prev, ...missing] : prev;
    });
    setActions(prev => {
      const existingIds = new Set(prev.map(a => a.id));
      const missing = INITIAL_ACTIONS.filter(a => !existingIds.has(a.id));
      return missing.length > 0 ? [...prev, ...missing] : prev;
    });
  };

  const generateMatrixWithAI = async () => {
    const rawGeneratedRecords = await generateFullMatrixWithAI(orgData);
    if (!rawGeneratedRecords || !Array.isArray(rawGeneratedRecords) || rawGeneratedRecords.length === 0) {
      throw new Error('La IA no devolvió registros válidos.');
    }

    const directos = Number(orgData.numTrabajadores) || 1;
    const contratistas = Number(orgData.numContratistas) || 0;
    const temporales = Number(orgData.numTemporales) || 0;
    const totalExp = directos + contratistas + temporales;

    const formattedRecords: RegistroIPVR[] = rawGeneratedRecords.map((r, index) => {
      const nd = Number(r.valoracion?.nd) || 6;
      const ne = Number(r.valoracion?.ne) || 2;
      const nc = Number(r.valoracion?.nc) || 25;
      const valCalc = calculateValuation(nd, ne, nc);

      return {
        id: r.id || `IPVR-EMG-${String(index + 1).padStart(2, '0')}`,
        codigoInterno: r.codigoInterno || `EMG-${String(index + 1).padStart(2, '0')}`,
        proceso: r.proceso || 'Logística y Almacenamiento',
        tipoProceso: r.tipoProceso || 'Misional / Operativo',
        area: r.area || orgData.centroPrincipal || 'Sede Principal',
        lugarEspecifico: r.lugarEspecifico || orgData.direccion || 'Instalaciones de la empresa',
        actividad: r.actividad || 'Operación general de la sede',
        tarea: r.tarea || 'Tránsito y desarrollo de labores en sitio',
        rutinaria: r.rutinaria || 'Rutinaria',
        cargoExpuesto: r.cargoExpuesto || 'Personal de planta, contratistas y visitantes',
        expuestosDirectos: directos,
        expuestosContratistas: contratistas,
        expuestosTemporales: temporales,
        expuestosTotal: totalExp > 0 ? totalExp : 1,
        frecuencia: r.frecuencia || 'Continua (Toda la jornada)',
        naturalezaPeligro: r.naturalezaPeligro || 'Condiciones de Seguridad',
        clasificacionPeligro: r.clasificacionPeligro || 'Peligro General',
        fuenteGeneradora: r.fuenteGeneradora || '',
        descripcionPeligro: r.descripcionPeligro || '',
        efectosPosibles: r.efectosPosibles || '',
        controlesExistentes: {
          fuente: r.controlesExistentes?.fuente || 'Ninguno en la fuente.',
          medio: r.controlesExistentes?.medio || 'Medidas preventivas en instalaciones.',
          individuo: r.controlesExistentes?.individuo || 'Elementos de protección y capacitación.'
        },
        valoracion: {
          nd: valCalc.nd,
          ne: valCalc.ne,
          np: valCalc.np,
          interpretacionNP: valCalc.interpretacionNP,
          nc: valCalc.nc,
          nr: valCalc.nr,
          nivelRiesgo: valCalc.nivelRiesgo,
          interpretacionNR: valCalc.interpretacionNR,
          aceptabilidad: valCalc.aceptabilidad,
          significadoNR: valCalc.significadoNR,
          estado: valCalc.estado
        },
        criterios: {
          numExpuestos: totalExp > 0 ? totalExp : 1,
          peorConsecuencia: r.criterios?.peorConsecuencia || 'Lesiones incapacitantes o afectación severa.',
          tieneRequisitoLegal: r.criterios?.tieneRequisitoLegal ?? true,
          requisitoLegalEspecifico: r.criterios?.requisitoLegalEspecifico || 'Decreto 1072 de 2015 Art. 2.2.4.6.25.'
        },
        medidas: {
          eliminacion: r.medidas?.eliminacion || 'No aplica.',
          sustitucion: r.medidas?.sustitucion || 'No aplica.',
          controlIngenieria: r.medidas?.controlIngenieria || '',
          controlAdministrativo: r.medidas?.controlAdministrativo || '',
          epp: r.medidas?.epp || ''
        },
        fechaCreacion: orgData.fechaElaboracion || new Date().toISOString().split('T')[0],
        fechaRevision: orgData.fechaActualizacion || new Date().toISOString().split('T')[0],
        responsableRevision: orgData.elaboradoPor || orgData.responsableSST || 'Responsable SG-SST'
      };
    });

    setRecords(formattedRecords);
  };

  const clearAllData = () => {
    setOrgData({
      empresa: '',
      razonSocial: '',
      nit: '',
      ciiu: '',
      actividadEconomica: '',
      arl: '',
      claseRiesgo: 'I',
      numTrabajadores: 0,
      numContratistas: 0,
      numTemporales: 0,
      centrosTrabajo: [],
      centroPrincipal: '',
      direccion: '',
      ciudad: '',
      departamento: '',
      metodologia: 'GTC 45:2012 / Decreto 1072 de 2015',
      alcanceMetodologia: '',
      versionMatriz: 'V3.1',
      fechaElaboracion: new Date().toISOString().split('T')[0],
      fechaActualizacion: new Date().toISOString().split('T')[0],
      fechaProximaRevision: '',
      motivoActualizacion: 'Creación inicial de la matriz IPVR',
      elaboradoPor: '',
      cargoElaborador: '',
      licenciaSST: '',
      revisadoPor: '',
      cargoRevisor: '',
      aprobadoPor: '',
      cargoAprobador: '',
      fechaAprobacion: '',
      registrosParticipacion: [],
      responsableSST: '',
      cargoResponsable: '',
      politicaSST: '',
      objetivosSST: ''
    });
    setRecords([]);
    setActions([]);
  };

  const exportDatabaseJSON = () => {
    const backup = {
      version: '3.1',
      fechaExportacion: new Date().toISOString(),
      orgData,
      records,
      actions,
      catalogs,
      customHazards
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SG-SST_IPVR_V3.1_Backup_${orgData.empresa ? orgData.empresa.replace(/\s+/g, '_') : 'Base'}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseJSON = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.orgData) setOrgData(parsed.orgData);
      if (Array.isArray(parsed.records)) setRecords(parsed.records);
      if (Array.isArray(parsed.actions)) setActions(parsed.actions);
      if (parsed.catalogs) setCatalogs(parsed.catalogs);
      if (Array.isArray(parsed.customHazards)) setCustomHazards(parsed.customHazards);
      return true;
    } catch (e) {
      console.error('Error importing backup:', e);
      return false;
    }
  };

  const exportMatrixCSV = () => {
    const headers = [
      'ID Registro',
      'Código Interno',
      'Proceso',
      'Tipo de Proceso',
      'Área / Zona / Lugar',
      'Lugar Específico',
      'Actividad',
      'Tarea',
      'Rutinaria (Sí/No)',
      'Cargo / Población Expuesta',
      'Expuestos Directos',
      'Expuestos Contratistas',
      'Expuestos Temporales',
      'Total Expuestos',
      'Frecuencia de Exposición',
      'Naturaleza del Peligro',
      'Clasificación del Peligro (GTC 45)',
      'Fuente Generadora',
      'Descripción del Peligro',
      'Efectos Posibles a la Salud',
      'Controles Existentes - Fuente',
      'Controles Existentes - Medio',
      'Controles Existentes - Individuo',
      'Nivel de Deficiencia (ND)',
      'Nivel de Exposición (NE)',
      'Nivel de Probabilidad (NP = ND x NE)',
      'Interpretación NP',
      'Nivel de Consecuencia (NC)',
      'Nivel de Riesgo (NR = NP x NC)',
      'Nivel de Riesgo (I-IV)',
      'Interpretación NR (GTC 45)',
      'Aceptabilidad del Riesgo',
      'Significado del Nivel de Riesgo',
      'Estado Valoración',
      'Criterio - No. Expuestos',
      'Criterio - Peor Consecuencia',
      'Criterio - ¿Tiene Requisito Legal?',
      'Criterio - Requisito Legal Específico',
      'Medida - Eliminación',
      'Medida - Sustitución',
      'Medida - Control de Ingeniería',
      'Medida - Control Administrativo / Señalización',
      'Medida - Equipos / EPP',
      'Fecha Creación',
      'Fecha Última Revisión'
    ];

    const rows = records.map(r => [
      r.id,
      r.codigoInterno || '',
      r.proceso,
      r.tipoProceso,
      r.area,
      r.lugarEspecifico,
      r.actividad,
      r.tarea,
      r.rutinaria,
      r.cargoExpuesto,
      r.expuestosDirectos,
      r.expuestosContratistas,
      r.expuestosTemporales || 0,
      r.expuestosTotal,
      r.frecuencia,
      r.naturalezaPeligro,
      r.clasificacionPeligro,
      r.fuenteGeneradora,
      r.descripcionPeligro,
      r.efectosPosibles,
      r.controlesExistentes.fuente,
      r.controlesExistentes.medio,
      r.controlesExistentes.individuo,
      r.valoracion.nd,
      r.valoracion.ne,
      r.valoracion.np,
      r.valoracion.interpretacionNP,
      r.valoracion.nc,
      r.valoracion.nr,
      r.valoracion.nivelRiesgo,
      r.valoracion.interpretacionNR || '',
      r.valoracion.aceptabilidad,
      r.valoracion.significadoNR,
      r.valoracion.estado,
      r.criterios.numExpuestos,
      r.criterios.peorConsecuencia,
      r.criterios.tieneRequisitoLegal ? 'Sí' : 'No',
      r.criterios.requisitoLegalEspecifico || '',
      r.medidas.eliminacion,
      r.medidas.sustitucion,
      r.medidas.controlIngenieria,
      r.medidas.controlAdministrativo,
      r.medidas.epp,
      r.fechaCreacion,
      r.fechaRevision || ''
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(';'))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Matriz_IPVR_GTC45_${orgData.empresa ? orgData.empresa.replace(/\s+/g, '_') : 'SGSST'}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMatrixExcel = async () => {
    await exportMatrixToTemplateExcel(orgData, records, actions);
  };

  const exportMatrixPDF = () => {
    generateIpvrPDF(orgData, records, actions);
  };

  const exportMatrixDOCX = async () => {
    try {
      const blob = await generateExecutiveDocxReport(orgData, records, actions);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Informe_Ejecutivo_IPVR_GTC45_${(orgData.empresa || 'Empresa').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error generating DOCX report:', err);
      alert('Error al generar el informe en Word (.docx). Verifique los datos.');
    }
  };

  return (
    <IpvrContext.Provider
      value={{
        activeTab,
        setActiveTab,
        orgData,
        setOrgData,
        records,
        setRecords,
        actions,
        catalogs,
        hazardsCatalog,
        addRecord,
        updateRecord,
        deleteRecord,
        getRecordById,
        addAction,
        updateAction,
        deleteAction,
        updateCatalogs,
        addCustomHazard,
        calculateValuation,
        resetToDefaults,
        loadEmergencyHazards,
        generateMatrixWithAI,
        syncCompanyDataToAllRecords,
        updateOrgData,
        clearAllData,
        exportDatabaseJSON,
        importDatabaseJSON,
        exportMatrixCSV,
        exportMatrixExcel,
        exportMatrixPDF,
        exportMatrixDOCX,
        editingRecordId,
        setEditingRecordId,
        isRecordModalOpen,
        setIsRecordModalOpen,
        editingActionId,
        setEditingActionId,
        isActionModalOpen,
        setIsActionModalOpen,
        isExcelImportModalOpen,
        setIsExcelImportModalOpen,
        searchTerm,
        setSearchTerm,
        filterProceso,
        setFilterProceso,
        filterPeligro,
        setFilterPeligro,
        filterNivelRiesgo,
        setFilterNivelRiesgo,
        filterAceptabilidad,
        setFilterAceptabilidad
      }}
    >
      {children}
    </IpvrContext.Provider>
  );
};

export const useIpvr = () => {
  const context = useContext(IpvrContext);
  if (!context) {
    throw new Error('useIpvr must be used within an IpvrProvider');
  }
  return context;
};
