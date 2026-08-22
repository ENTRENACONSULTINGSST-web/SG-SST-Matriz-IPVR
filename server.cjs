var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "10mb" }));
  let aiClient = null;
  function getAiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not configured.");
      }
      aiClient = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
    return aiClient;
  }
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/gemini/generate-hazard-analysis", async (req, res) => {
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
      const prompt = `Eres un Ingeniero Especialista en Seguridad y Salud en el Trabajo (SST) y Experto Certificado en la Gu\xEDa T\xE9cnica Colombiana GTC 45:2012 y el Decreto 1072 de 2015.

Debes analizar y redactar t\xE9cnicamente la informaci\xF3n de evaluaci\xF3n para la siguiente amenaza identificada en el Plan de Prevenci\xF3n, Preparaci\xF3n y Respuesta ante Emergencias de la empresa:

DATOS DE LA AMENAZA:
- Amenaza / Peligro: "${amenaza}"
- Categor\xEDa / Naturaleza: "${categoria || "Tecnol\xF3gico"}"
- Origen: "${origen || "Externo / Interno"}"
- Fuente de la Amenaza / Detalle: "${fuenteDetalle || ""}"
- Calificaci\xF3n preliminar: "${calificacion || "PROBABLE"}"

CONTEXTO ORGANIZACIONAL:
- Raz\xF3n Social: "${orgData?.empresa || orgData?.razonSocial || "EMPRESA PRINCIPAL"}"
- Actividad Econ\xF3mica: "${orgData?.actividadEconomica || "Comercio y Servicios Log\xEDsticos"}"
- Clase de Riesgo ARL: "${orgData?.claseRiesgo || "I"}"
- Planta Total: ${(Number(orgData?.numTrabajadores) || 0) + (Number(orgData?.numContratistas) || 0)} trabajadores (${orgData?.numTrabajadores || 0} directos, ${orgData?.numContratistas || 0} contratistas, ${orgData?.numTemporales || 0} temporales)
- Centros / Sedes: "${orgData?.centroPrincipal || "Sede Principal"}"

Genera un an\xE1lisis t\xE9cnico riguroso, formal y preciso estructurado seg\xFAn la GTC 45:2012 para todos los m\xF3dulos de la matriz. Devuelve exclusivamente JSON con el siguiente esquema exacto:
{
  "proceso": "string (ej: Misional / Operativo, Estrat\xE9gico, o Apoyo)",
  "tipoProceso": "Estrat\xE9gico | Misional / Operativo | Apoyo | Evaluaci\xF3n y Control",
  "area": "string (\xE1rea o sede de la empresa)",
  "lugarEspecifico": "string (descripci\xF3n del puesto/lugar)",
  "actividad": "string (actividad laboral)",
  "tarea": "string (tarea puntual)",
  "rutinaria": "Rutinaria | No Rutinaria",
  "cargoExpuesto": "string (cargos afectados)",
  "naturalezaPeligro": "Fen\xF3menos Naturales | Condiciones de Seguridad | Biol\xF3gico | F\xEDsico | Qu\xEDmico | Psicosocial | Biomec\xE1nico",
  "clasificacionPeligro": "string",
  "fuenteGeneradora": "string (fuente real de la amenaza)",
  "descripcionPeligro": "string (descripci\xF3n t\xE9cnica del evento peligroso)",
  "efectosPosibles": "string (lesiones y da\xF1os esperados)",
  "controlesExistentes": {
    "fuente": "string (control existente en la fuente o 'Ninguno')",
    "medio": "string (control en el medio de transmisi\xF3n)",
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
    "requisitoLegalEspecifico": "string (art\xEDculo y norma colombiana espec\xEDfica ej: Dec. 1072/2015, NSR-10, Res. 2400/1979)"
  },
  "medidas": {
    "eliminacion": "string",
    "sustitucion": "string",
    "controlIngenieria": "string",
    "controlAdministrativo": "string",
    "epp": "string"
  },
  "accionSeguimiento": {
    "tipoControl": "Eliminaci\xF3n | Sustituci\xF3n | Control de Ingenier\xEDa | Control Administrativo | Equipos / EPP",
    "descripcionAccion": "string",
    "responsable": "string",
    "fechaProgramada": "string (YYYY-MM-DD)",
    "periodicidad": "string",
    "indicador": "string"
  }
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      });
      const jsonStr = response.text ? response.text.trim() : "{}";
      const parsedData = JSON.parse(jsonStr);
      return res.json({ success: true, data: parsedData });
    } catch (error) {
      console.error("Error generating hazard analysis with Gemini:", error);
      return res.status(500).json({
        success: false,
        error: error?.message || "Error al procesar la solicitud con Gemini AI."
      });
    }
  });
  app.post("/api/gemini/generate-full-matrix", async (req, res) => {
    try {
      const { orgData } = req.body;
      const ai = getAiClient();
      const prompt = `Eres un Consultor Senior en Seguridad y Salud en el Trabajo (SST) en Colombia.
Debes estructurar y generar t\xE9cnicamente los textos completos de los 10 PELIGROS identificados en el documento de Plan de Prevenci\xF3n, Preparaci\xF3n y Respuesta ante Emergencias (IDENTIFICACI\xD3N Y CLASIFICACI\xD3N DE AMENAZAS):

LAS 10 AMENAZAS OFICIALES EXACTAS SON:
1. Categor\xEDa NATURAL:
   - Amenaza: "Movimientos s\xEDsmicos" | Origen: "Externo" | Fuente: "Situaciones de sismo presentadas en la ciudad." | Calificaci\xF3n: "PROBABLE"
   - Amenaza: "Inundaciones" | Origen: "Externo / Interno" | Fuente: "Inundaciones presentadas con anterioridad en la Bodega." | Calificaci\xF3n: "PROBABLE"

2. Categor\xEDa TECNOL\xD3GICO:
   - Amenaza: "Incendios" | Origen: "Externo / Interno" | Fuente: "Por almacenamiento de mercanc\xEDa mistas y tuberia EMT" | Calificaci\xF3n: "PROBABLE"
   - Amenaza: "Explosiones" | Origen: "Externo / Interno" | Fuente: "Almacenamiento de mercanc\xEDas, sustancias y sistemas presurizados o el\xE9ctricos" | Calificaci\xF3n: "PROBABLE"
   - Amenaza: "Fallas estructurales" | Origen: "Interno" | Fuente: "Debilitamiento de estructura f\xEDsica en la oficina, ca\xEDda de techos." | Calificaci\xF3n: "POSIBLE"
   - Amenaza: "Ausencia del fluido el\xE9ctrico" | Origen: "Externo / Interno" | Fuente: "Corte en el suministro de energ\xEDa por reparaci\xF3n o da\xF1os." | Calificaci\xF3n: "PROBABLE"
   - Amenaza: "Accidentes Viales" | Origen: "Externo / Interno" | Fuente: "Ingresan veh\xEDculos para cargue y descargue de mercanc\xEDa." | Calificaci\xF3n: "PROBABLE"

3. Categor\xEDa SOCIAL:
   - Amenaza: "Terrorismo" | Origen: "Externo" | Fuente: "Situaci\xF3n socio pol\xEDtica del pa\xEDs." | Calificaci\xF3n: "POSIBLE"
   - Amenaza: "De orden p\xFAblico" | Origen: "Externo" | Fuente: "Situaci\xF3n socio pol\xEDtica del pa\xEDs." | Calificaci\xF3n: "POSIBLE"
   - Amenaza: "Asaltos y hurtos" | Origen: "Externo / Interno" | Fuente: "Situaci\xF3n socio pol\xEDtica del pa\xEDs." | Calificaci\xF3n: "POSIBLE"

CONTEXTO DE LA EMPRESA:
- Empresa: "${orgData?.empresa || orgData?.razonSocial || "ORGANIZACI\xD3N"}"
- NIT: "${orgData?.nit || "Sin registrar"}"
- Trabajadores Directos: ${orgData?.numTrabajadores || 1}
- Contratistas: ${orgData?.numContratistas || 0}
- Temporales: ${orgData?.numTemporales || 0}
- Sede: "${orgData?.centroPrincipal || "Sede Principal"}"

Genera un arreglo de exactamente 10 objetos con la informaci\xF3n t\xE9cnica completa GTC 45 para cada amenaza.
Devuelve exclusivamente JSON con el formato:
{
  "records": [
    {
      "id": "IPVR-EMG-01 a IPVR-EMG-10",
      "codigoInterno": "EMG-NAT-01, etc.",
      "amenazaNombre": "string exacto",
      "proceso": "string",
      "tipoProceso": "Estrat\xE9gico | Misional / Operativo | Apoyo",
      "area": "string",
      "lugarEspecifico": "string",
      "actividad": "string",
      "tarea": "string",
      "rutinaria": "Rutinaria | No Rutinaria",
      "cargoExpuesto": "string",
      "frecuencia": "string",
      "naturalezaPeligro": "Fen\xF3menos Naturales | Condiciones de Seguridad",
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
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      const jsonStr = response.text ? response.text.trim() : '{"records":[]}';
      const parsedData = JSON.parse(jsonStr);
      return res.json({ success: true, data: parsedData });
    } catch (error) {
      console.error("Error generating full matrix with Gemini:", error);
      return res.status(500).json({
        success: false,
        error: error?.message || "Error al generar la matriz con Gemini AI."
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
