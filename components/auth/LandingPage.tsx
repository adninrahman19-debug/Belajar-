
import React from 'react';
import { Shield, Zap, Target, Fingerprint, Lock, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(6,182,212,0.15),transparent)] pointer-events-none"></div>
      
      <nav className="px-8 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded flex items-center justify-center text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Zap size={24} />
          </div>
          <h1 className="text-xl font-black tracking-[0.3em] mono italic uppercase">GeoGuard OS</h1>
        </div>
        <button 
          onClick={onEnter}
          className="px-6 py-2 border border-cyan-500/50 text-cyan-400 font-black mono text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all rounded"
        >
          Masuk Terminal
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className="text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8">
            <Shield size={14} className="text-cyan-500" />
            <span className="text-[10px] mono font-bold uppercase tracking-widest text-slate-400">v4.2 Shadow Edition | Status: Operasional</span>
          </div>
          
          <h2 className="text-6xl lg:text-8xl font-black italic tracking-tighter mb-6 uppercase leading-none">
            Pantau. <span className="text-cyan-500">Lacak.</span><br />Infiltrasi.
          </h2>
          
          <p className="text-lg text-slate-400 mono max-w-2xl mx-auto mb-12 uppercase leading-relaxed tracking-tight">
            Sistem intelijen lokasi tercanggih untuk pemantauan aset real-time dan ekstraksi data berbasis AI dalam satu antarmuka terenkripsi.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={onEnter}
              className="px-10 py-5 bg-cyan-500 text-black font-black mono text-sm uppercase tracking-[0.2em] rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center gap-3 group"
            >
              Mulai Operasi <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
