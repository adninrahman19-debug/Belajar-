
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Device, MovementHistory } from "../types/index";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const controlFunctions: FunctionDeclaration[] = [
  {
    name: 'pindah_halaman',
    parameters: {
      type: Type.OBJECT,
      description: 'Navigasi antar modul sistem.',
      properties: {
        target: { type: Type.STRING, description: 'dashboard, devices, sensors, vault, blueprints, compliance' },
      },
      required: ['target'],
    },
  },
  {
    name: 'mulai_pelacakan',
    parameters: {
      type: Type.OBJECT,
      description: 'Inisialisasi pelacakan GPS pada nomor telepon.',
      properties: { nomorTelepon: { type: Type.STRING } },
      required: ['nomorTelepon'],
    },
  },
  {
    name: 'kontrol_sensor',
    parameters: {
      type: Type.OBJECT,
      description: 'Mengontrol feed sensor target.',
      properties: {
        tipe: { type: Type.STRING, description: 'camera atau screen' },
        status: { type: Type.STRING, description: 'start atau stop' }
      },
      required: ['tipe', 'status'],
    },
  }
];

export const getAIAssistantResponse = async (userMessage: string, chatHistory: any[] = []) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: userMessage }] },
      config: {
        tools: [{ functionDeclarations: controlFunctions }],
        systemInstruction: `Anda adalah ECHO-LINK, AI taktis Shadow.OS. 
        Gaya bicara: Profesional, Teknis, Cyberpunk. 
        Tugas: Membantu operator mengelola modul sistem dan memberikan analisis intelijen.`,
      },
    });
    
    return {
      text: response.text || "INSTRUKSI_DITERIMA.",
      functionCalls: response.functionCalls
    };
  } catch (error) {
    console.error("AI Error:", error);
    return { text: "GALAT: ECHO-LINK_OFFLINE.", functionCalls: [] };
  }
};

export const analyzeMovementPattern = async (device: Device, history: MovementHistory[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analis pola pergerakan: ${device.name}. Data: ${JSON.stringify(history)}`,
    });
    return response.text || "Analisis tidak tersedia.";
  } catch (error) {
    return "SISTEM_OFFLINE.";
  }
};
