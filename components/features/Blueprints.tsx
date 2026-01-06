
import React, { useState } from 'react';
import { TECHNICAL_BLUEPRINTS } from '../../config/constants';
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
      <div className="w-full lg:w-72 flex flex-col gap-2">
        <h3 className="text-[10px] font-black text-slate-500 mono uppercase tracking-[0.3em] mb-4 px-2">Struktur_Repository</h3>
        {TECHNICAL_BLUEPRINTS.map((doc, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
              activeIndex === idx 
              ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' 
              : 'bg-white/5 border-white/5 text-slate-500'
            }`}
          >
            <FileCode size={18} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black mono truncate uppercase">{doc.title}</p>
            </div>
            <ChevronRight size={14} className={activeIndex === idx ? 'rotate-90' : ''} />
          </button>
        ))}
      </div>

      <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        <div className="p-4 bg-black/40 border-b border-white/5 flex items-center justify-between">
          <span className="text-[10px] mono text-slate-500 font-bold uppercase italic">{activeDoc.title}</span>
          <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-md">
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />}
            <span className="text-[9px] mono font-bold text-slate-400 uppercase">{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs leading-relaxed text-slate-300">
           <pre className="whitespace-pre-wrap">{activeDoc.code.trim()}</pre>
        </div>
      </div>
    </div>
  );
};

export default Blueprints;
