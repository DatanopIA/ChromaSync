const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY no encontrada en las variables de entorno.");
}

const fs = require('fs');
const path = require('path');

function logDebug(message) {
  const logPath = path.join(__dirname, '../debug-ai.log');
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

/**
 * Genera una paleta de colores con sistema de fallback y limpieza robusta.
 * Puede basarse en un prompt de texto o en una imagen.
 */
async function generatePalette(prompt, imageBase64 = null) {
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite", "gemini-pro"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      logDebug(`Intentando generación con modelo: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      let promptContent = [];

      const systemInstruction = `
        Eres un experto en teoría del color y diseño de branding.
        Genera una paleta de 5 colores basada en lo que ves o se te pide: "${prompt}".
        RESPUESTA: EXCLUSIVAMENTE UN JSON, sin texto explicativo, sin markdown.
        Estructura:
        {
          "name": "Nombre creativo",
          "colors": [
            { "hex": "#HEX", "name": "Nombre color", "psychology": "Breve nota" }
          ],
          "typography_suggestion": { "heading": "Fuente", "body": "Fuente" },
          "vibe": "Emoción"
        }
      `;

      promptContent.push(systemInstruction);

      if (imageBase64) {
        logDebug(`Añadiendo imagen a la petición de IA`);
        // Extraer formato si viene con data:image/...;base64,
        const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let mimeType = "image/jpeg";
        let data = imageBase64;

        if (matches && matches.length === 3) {
          mimeType = matches[1];
          data = matches[2];
        }

        promptContent.push({
          inlineData: {
            data: data,
            mimeType: mimeType
          }
        });
      }

      const result = await model.generateContent(promptContent);
      const response = await result.response;
      const text = response.text();

      logDebug(`Respuesta recibida de ${modelName}: ${text.substring(0, 50)}...`);

      // Limpieza agresiva de JSON
      let jsonString = text.trim();
      if (jsonString.includes("```")) {
        jsonString = jsonString.replace(/```json|```/g, "").trim();
      }

      // Intentar encontrar el primer '{' y el último '}' por si hay basura
      const start = jsonString.indexOf('{');
      const end = jsonString.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        jsonString = jsonString.substring(start, end + 1);
      }

      const parsed = JSON.parse(jsonString);
      logDebug(`Éxito con modelo ${modelName}`);
      return parsed;

    } catch (error) {
      logDebug(`Error con modelo ${modelName}: ${error.message}`);
      lastError = error;
      // Continuar al siguiente modelo
    }
  }

  logDebug(`Todos los modelos fallaron. Último error: ${lastError.message}`);
  throw new Error(`Error de IA persistente: ${lastError.message}`);
}

async function listModels() {
  const result = await genAI.listModels();
  console.log(result);
}

module.exports = { generatePalette, listModels };
