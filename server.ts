import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Lazy initialize Gemini API client with required User-Agent header
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not configured.');
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Gemini API: Generate / complete individual GTC 45 hazard record
  app.post('/api/gemini/generate-hazard-analysis', async (req, res) => {
    try {
      const {
        amenaza,
        categoria,
        origen,
        fuenteDetalle,
        calificacion,
        orgData,
        recordContext
      } = req.body;

      if (!amenaza) {
        return res.status(400).json({ error: 'El campo "amenaza" es requerido.' });
      }

      const ai = getAiClient();

      const prompt = `Eres un Ingeniero Especialista en Seguridad y Salud en el Trabajo (SST) y Experto Certificado en la Guía Técnica Colombiana GTC 45:2012 y el Decreto 1072 de 2015.

Debes analizar y redactar técnicamente la información de evaluación para la siguiente amenaza identificada en el Plan de Prevención, Preparación y Respuesta ante Emergencias de la empresa:

DATOS DE LA AMENAZA:
- Amenaza / Peligro: "${amenaza}"
- Categoría / Naturaleza: "${categoria || 'Tecnológico'}"
- Origen: "${origen || 'Externo / Interno'}"
- Fuente de la Amenaza / Detalle: "${fuenteDetalle || ''}"
- Calificación preliminar: "${calificacion || 'PROBABLE'}"

CONTEXTO ORGANIZACIONAL:
- Razón Social: "${orgData?.empresa || orgData?.razonSocial || 'EMPRESA PRINCIPAL'}"
- Actividad Económica: "${orgData?.actividadEconomica || 'Comercio y Servicios Logísticos'}"
- Clase de Riesgo ARL: "${orgData?.claseRiesgo || 'I'}"
- Planta Total: ${(Number(orgData?.numTrabajadores) || 0) + (Number(orgData?.numContratistas) || 0)} trabajadores (${orgData?.numTrabajadores || 0} directos, ${orgData?.numContratistas || 0} contratistas, ${orgData?.numTemporales || 0} temporales)
- Centros / Sedes: "${orgData?.centroPrincipal || 'Sede Principal'}"

Genera un análisis técnico riguroso, formal y preciso estructurado según la GTC 45:2012 para todos los módulos de la matriz. Devuelve exclusivamente JSON con el siguiente esquema exacto:
{
  "proceso": "string (ej: Misional / Operativo, Estratégico, o Apoyo)",
  "tipoProceso": "Estratégico | Misional / Operativo | Apoyo | Evaluación y Control",
  "area": "string (área o sede de la empresa)",
  "lugarEspecifico": "string (descripción del puesto/lugar)",
  "actividad": "string (actividad laboral)",
  "tarea": "string (tarea puntual)",
  "rutinaria": "Rutinaria | No Rutinaria",
  "cargoExpuesto": "string (cargos afectados)",
  "naturalezaPeligro": "Fenómenos Naturales | Condiciones de Seguridad | Biológico | Físico | Químico | Psicosocial | Biomecánico",
  "clasificacionPeligro": "string",
  "fuenteGeneradora": "string (fuente real de la amenaza)",
  "descripcionPeligro": "string (descripción técnica del evento peligroso)",
  "efectosPosibles": "string (lesiones y daños esperados)",
  "controlesExistentes": {
    "fuente": "string (control existente en la fuente o 'Ninguno')",
    "medio": "string (control en el medio de transmisión)",
    "individuo": "string (control en el trabajador)"
  },
  "valoracion": {
    "nd": 10 | 6 | 2 | 0,
    "ne": 4 | 3 | 2 | 1,
    "nc": 100 | 60 | 25 | 10
  },
  "criterios": {
    "peorConsecuencia": "string (peor consecuencia posible)",
    "tieneRequisitoLegal": true,
    "requisitoLegalEspecifico": "string (artículo y norma colombiana específica ej: Dec. 1072/2015, NSR-10, Res. 2400/1979)"
  },
  "medidas": {
    "eliminacion": "string",
    "sustitucion": "string",
    "controlIngenieria": "string",
    "controlAdministrativo": "string",
    "epp": "string"
  },
  "accionSeguimiento": {
    "tipoControl": "Eliminación | Sustitución | Control de Ingeniería | Control Administrativo | Equipos / EPP",
    "descripcionAccion": "string",
    "responsable": "string",
    "fechaProgramada": "string (YYYY-MM-DD)",
    "periodicidad": "string",
    "indicador": "string"
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });

      const jsonStr = response.text ? response.text.trim() : '{}';
      const parsedData = JSON.parse(jsonStr);

      return res.json({ success: true, data: parsedData });
    } catch (error: any) {
      console.error('Error generating hazard analysis with Gemini:', error);
      return res.status(500).json({
        success: false,
        error: error?.message || 'Error al procesar la solicitud con Gemini AI.'
      });
    }
  });

  // Gemini API: Generate all 10 hazards for the matrix based on the document table
  app.post('/api/gemini/generate-full-matrix', async (req, res) => {
    try {
      const { orgData } = req.body;
      const ai = getAiClient();

      const prompt = `Eres un Consultor Senior en Seguridad y Salud en el Trabajo (SST) en Colombia.
Debes estructurar y generar técnicamente los textos completos de los 10 PELIGROS identificados en el documento de Plan de Prevención, Preparación y Respuesta ante Emergencias (IDENTIFICACIÓN Y CLASIFICACIÓN DE AMENAZAS):

LAS 10 AMENAZAS OFICIALES EXACTAS SON:
1. Categoría NATURAL:
   - Amenaza: "Movimientos sísmicos" | Origen: "Externo" | Fuente: "Situaciones de sismo presentadas en la ciudad." | Calificación: "PROBABLE"
   - Amenaza: "Inundaciones" | Origen: "Externo / Interno" | Fuente: "Inundaciones presentadas con anterioridad en la Bodega." | Calificación: "PROBABLE"

2. Categoría TECNOLÓGICO:
   - Amenaza: "Incendios" | Origen: "Externo / Interno" | Fuente: "Por almacenamiento de mercancía mistas y tuberia EMT" | Calificación: "PROBABLE"
   - Amenaza: "Explosiones" | Origen: "Externo / Interno" | Fuente: "Almacenamiento de mercancías, sustancias y sistemas presurizados o eléctricos" | Calificación: "PROBABLE"
   - Amenaza: "Fallas estructurales" | Origen: "Interno" | Fuente: "Debilitamiento de estructura física en la oficina, caída de techos." | Calificación: "POSIBLE"
   - Amenaza: "Ausencia del fluido eléctrico" | Origen: "Externo / Interno" | Fuente: "Corte en el suministro de energía por reparación o daños." | Calificación: "PROBABLE"
   - Amenaza: "Accidentes Viales" | Origen: "Externo / Interno" | Fuente: "Ingresan vehículos para cargue y descargue de mercancía." | Calificación: "PROBABLE"

3. Categoría SOCIAL:
   - Amenaza: "Terrorismo" | Origen: "Externo" | Fuente: "Situación socio política del país." | Calificación: "POSIBLE"
   - Amenaza: "De orden público" | Origen: "Externo" | Fuente: "Situación socio política del país." | Calificación: "POSIBLE"
   - Amenaza: "Asaltos y hurtos" | Origen: "Externo / Interno" | Fuente: "Situación socio política del país." | Calificación: "POSIBLE"

CONTEXTO DE LA EMPRESA:
- Empresa: "${orgData?.empresa || orgData?.razonSocial || 'ORGANIZACIÓN'}"
- NIT: "${orgData?.nit || 'Sin registrar'}"
- Trabajadores Directos: ${orgData?.numTrabajadores || 1}
- Contratistas: ${orgData?.numContratistas || 0}
- Temporales: ${orgData?.numTemporales || 0}
- Sede: "${orgData?.centroPrincipal || 'Sede Principal'}"

Genera un arreglo de exactamente 10 objetos con la información técnica completa GTC 45 para cada amenaza.
Devuelve exclusivamente JSON con el formato:
{
  "records": [
    {
      "id": "IPVR-EMG-01 a IPVR-EMG-10",
      "codigoInterno": "EMG-NAT-01, etc.",
      "amenazaNombre": "string exacto",
      "proceso": "string",
      "tipoProceso": "Estratégico | Misional / Operativo | Apoyo",
      "area": "string",
      "lugarEspecifico": "string",
      "actividad": "string",
      "tarea": "string",
      "rutinaria": "Rutinaria | No Rutinaria",
      "cargoExpuesto": "string",
      "frecuencia": "string",
      "naturalezaPeligro": "Fenómenos Naturales | Condiciones de Seguridad",
      "clasificacionPeligro": "string",
      "fuenteGeneradora": "string",
      "descripcionPeligro": "string",
      "efectosPosibles": "string",
      "controlesExistentes": {
        "fuente": "string",
        "medio": "string",
        "individuo": "string"
      },
      "valoracion": {
        "nd": 10 | 6 | 2 | 0,
        "ne": 4 | 3 | 2 | 1,
        "nc": 100 | 60 | 25 | 10
      },
      "criterios": {
        "peorConsecuencia": "string",
        "tieneRequisitoLegal": true,
        "requisitoLegalEspecifico": "string"
      },
      "medidas": {
        "eliminacion": "string",
        "sustitucion": "string",
        "controlIngenieria": "string",
        "controlAdministrativo": "string",
        "epp": "string"
      },
      "accionSugerida": {
        "tipoControl": "string",
        "descripcionAccion": "string",
        "responsable": "string",
        "periodicidad": "string",
        "indicador": "string"
      }
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const jsonStr = response.text ? response.text.trim() : '{"records":[]}';
      const parsedData = JSON.parse(jsonStr);

      return res.json({ success: true, data: parsedData });
    } catch (error: any) {
      console.error('Error generating full matrix with Gemini:', error);
      return res.status(500).json({
        success: false,
        error: error?.message || 'Error al generar la matriz con Gemini AI.'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
