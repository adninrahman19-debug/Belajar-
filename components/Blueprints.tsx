
import React, { useState } from 'react';
import { TECHNICAL_BLUEPRINTS } from '../constants';
import { FileCode, ChevronRight, Terminal as TerminalIcon, Copy, Check } from 'lucide-react';

const Blueprints: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeDoc = TECHNICAL_BLUEPRINTS[activeIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeDoc.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
      {/* Sidebar Berkas */}
      <div className="w-full lg:w-72 flex flex-col gap-2">
        <h3 className="text-[10px] font-black text-slate-500 mono uppercase tracking-[0.3em] mb-4 px-2">Struktur_Repository</h3>
        {TECHNICAL_BLUEPRINTS.map((doc, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left group ${
              activeIndex === idx 
              ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
              : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'
            }`}
          >
            <FileCode size={18} className={activeIndex === idx ? 'text-cyan-400' : 'text-slate-600'} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black mono truncate uppercase">{doc.title}</p>
              <p className="text-[9px] mono opacity-40 truncate">{doc.language.toUpperCase()}</p>
            </div>
            <ChevronRight size={14} className={`transition-transform ${activeIndex === idx ? 'rotate-90 text-cyan-400' : 'text-slate-800'}`} />
          </button>
        ))}
        
        <div className="mt-auto p-4 bg-cyan-950/20 border border-cyan-500/10 rounded-xl">
           <div className="flex items-center gap-2 mb-2">
              <TerminalIcon size={14} className="text-cyan-500" />
              <span className="text-[9px] font-black text-white mono uppercase">Status_Repo</span>
           </div>
           <p className="text-[9px] text-slate-500 mono leading-relaxed uppercase">Semua muatan data telah dienkripsi menggunakan protokol SHA-256 sebelum penyimpanan cloud.</p>
        </div>
      </div>

      {/* Editor Kode */}
      <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        <div className="p-4 bg-black/40 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="ml-4 text-[10px] mono text-slate-500 font-bold uppercase tracking-widest italic">{activeDoc.title}</span>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-all group"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400 group-hover:text-cyan-400" />}
            <span className="text-[9px] mono font-bold text-slate-400">{copied ? 'TERSALIN' : 'SALIN'}</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs leading-relaxed text-slate-300">
           <div className="mb-6 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg italic text-[11px] text-cyan-200/70">
              // DESKRIPSI: {activeDoc.description}
           </div>
           <pre className="whitespace-pre-wrap selection:bg-cyan-500/30">
              {activeDoc.code.trim()}
           </pre>
        </div>
        
        <div className="px-6 py-2 bg-black border-t border-white/5 flex justify-between items-center">
           <span className="text-[8px] mono text-slate-700 uppercase tracking-widest font-black italic">Shadow_Editor_v2.0</span>
           <span className="text-[8px] mono text-cyan-500/40">UTF-8 | LF | TS</span>
        </div>
      </div>
    </div>
  );
};

export default Blueprints;
