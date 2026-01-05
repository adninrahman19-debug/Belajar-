
import React, { useEffect, useState, useRef } from 'react';

const LOG_MESSAGES = [
  "MENGINISIALISASI PROTOKOL_BAYANGAN v4.2...",
  "MEMBANGUN HUBUNGAN AMAN DENGAN SERVER_REMOT",
  "MENDEKRIPSI PAKET GSM_LAYER_7...",
  "KEKUATAN SINYAL: -64dBm (OPTIMAL)",
  "TRIANGULASI MENARA_SELULER_B21...",
  "MENEMBUS SANDBOX_OPERATOR...",
  "KOORDINAT DIPEROLEH: AKURASI 4.2m",
  "UPLINK STABIL. MENGIRIM TELEMETRI...",
  "PENILAIAN_ANCAMAN: TIDAK ADA ANOMALI",
  "MENGENKRIPSI MUATAN DATA (AES-256)...",
  "HEARTBEAT_ACK DITERIMA DARI NODE_TARGET",
  "AKSES ROOT DIPEROLEH PADA SUBSISTEM_GPS"
];

const Terminal: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      setLogs(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${randomMsg}`]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black/80 border border-white/10 rounded-xl p-4 h-full overflow-hidden flex flex-col mono">
      <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
        </div>
        <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">KONSOL_LOG_SISTEM</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 text-[11px]">
        {logs.map((log, i) => (
          <div key={i} className={`${log.includes('DIPEROLEH') ? 'text-cyan-400' : 'text-slate-400'} font-medium`}>
            <span className="text-white/20 mr-2">$</span>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terminal;
