
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Device, MovementHistory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Deklarasi fungsi yang dapat dipanggil oleh AI
const controlFunctions: FunctionDeclaration[] = [
  {
    name: 'pindah_halaman',
    parameters: {
      type: Type.OBJECT,
      description: 'Navigasi ke halaman atau modul tertentu dalam sistem Shadow.OS.',
      properties: {
        target: {
          type: Type.STRING,
          description: 'Nama modul tujuan: dashboard, devices, sensors, vault, blueprints, compliance.',
        },
      },
      required: ['target'],
    },
  },
  {
    name: 'mulai_pelacakan',
    parameters: {
      type: Type.OBJECT,
      description: 'Memulai proses pelacakan GPS pada nomor telepon target.',
      properties: {
        nomorTelepon: {
          type: Type.STRING,
          description: 'Nomor telepon target (contoh: 0812345678).',
        },
      },
      required: ['nomorTelepon'],
    },
  },
  {
    name: 'kontrol_sensor',
    parameters: {
      type: Type.OBJECT,
      description: 'Mengaktifkan atau menonaktifkan feed sensor (kamera/layar).',
      properties: {
        tipe: {
          type: Type.STRING,
          description: 'Tipe sensor: camera atau screen.',
        },
        status: {
          type: Type.STRING,
          description: 'Status: start atau stop.',
        },
      },
      required: ['tipe', 'status'],
    },
  },
  {
    name: 'buka_arsip_data',
    parameters: {
      type: Type.OBJECT,
      description: 'Membuka kategori data tertentu di Brankas Data.',
      properties: {
        kategori: {
          type: Type.STRING,
          description: 'Kategori data: gmail atau files.',
        },
      },
      required: ['kategori'],
    },
  }
];

export const getAIAssistantResponse = async (userMessage: string, chatHistory: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: userMessage }] },
      config: {
        tools: [{ functionDeclarations: controlFunctions }],
        systemInstruction: `Anda adalah ECHO-LINK, asisten taktis Shadow.OS.
        
        KEMAMPUAN EKSEKUSI:
        Anda dapat mengontrol sistem menggunakan fungsi yang tersedia. 
        - Jika pengguna ingin melihat lokasi/melacak, gunakan 'pindah_halaman' ke 'devices' atau gunakan 'mulai_pelacakan'.
        - Jika ingin melihat kamera/video, gunakan 'pindah_halaman' ke 'sensors' dan 'kontrol_sensor'.
        - Jika ingin melihat email atau berkas, gunakan 'pindah_halaman' ke 'vault' dan 'buka_arsip_data'.
        
        ATURAN FORMAT:
        1. JANGAN gunakan terlalu banyak simbol (**).
        2. Gunakan baris baru agar pesan rapi.
        3. Selalu konfirmasi tindakan Anda (Contoh: "Mengalihkan koneksi ke modul HUB_SENSOR...").
        4. Nada bicara: Teknis, Profesional, Cyberpunk.`,
      },
    });
    
    return {
      text: response.text || "INSTRUKSI_DITERIMA.",
      functionCalls: response.functionCalls
    };
  } catch (error) {
    console.error("Assistant Error:", error);
    return { text: "GALAT_SISTEM: ECHO-LINK_OFFLINE.", functionCalls: [] };
  }
};

export const analyzeMovementPattern = async (device: Device, history: MovementHistory[]): Promise<string> => {
  const prompt = `
    Analisis riwayat pergerakan perangkat berikut.
    Perangkat: ${device.name} (${device.type})
    Status: ${device.status}, Baterai: ${device.battery}%
    Data: ${JSON.stringify(history)}
    
    Format Laporan:
    1. Pola Pergerakan: (Rutin/Tidak Biasa)
    2. Tingkat Risiko: (Rendah/Sedang/Tinggi)
    3. Rekomendasi Taktis.
    
    Gunakan gaya bahasa intelijen yang singkat dan rapi.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "Tidak dapat melakukan analisis saat ini.";
  } catch (error) {
    console.error("Kesalahan Analisis Gemini:", error);
    return "Analisis AI tidak tersedia.";
  }
};
