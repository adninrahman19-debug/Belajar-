
import React, { useEffect, useState, useRef } from 'react';

const LOG_MESSAGES = [
  "MENGINISIALISASI PROTOKOL_BAYANGAN...",
  "MENDEKRIPSI PAKET GSM...",
  "TRIANGULASI MENARA_SELULER...",
  "KOORDINAT DIPEROLEH: AKURASI 4.2m",
  "UPLINK STABIL.",
  "HEARTBEAT_ACK DITERIMA",
  "AKSES ROOT DIPEROLEH"
];

const Terminal: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      setLogs(prev => [...prev.slice(-12), `[${new Date().toLocaleTimeString()}] ${randomMsg}`]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="bg-black/80 border border-white/10 rounded-xl p-4 h-full overflow-hidden flex flex-col mono">
      <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
        </div>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">KONSOL_LOG_SISTEM</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 text-[11px] scrollbar-hide">
        {logs.map((log, i) => (
          <div key={i} className={`${log.includes('DIPEROLEH') ? 'text-cyan-400' : 'text-slate-400'}`}>
            <span className="text-white/20 mr-2">$</span>{log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terminal;
