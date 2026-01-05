
import React, { useState } from 'react';
import { Lock, User, ShieldAlert, Zap, Loader2, ChevronLeft } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Simulasi delay jaringan
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLoginSuccess();
      } else {
        setError(true);
        setIsLoading(false);
        // Efek shake pada container akan ditangani oleh CSS class
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent)] pointer-events-none"></div>
      
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-white transition-all mono text-[10px] uppercase font-black tracking-widest"
      >
        <ChevronLeft size={16} /> Kembali
      </button>

      <div className={`max-w-md w-full bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 shadow-[0_0_50px_rgba(0,0,0,1)] relative z-10 ${error ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 mb-6 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Otentikasi Node</h2>
          <p className="text-[10px] mono text-slate-500 font-bold uppercase tracking-[0.3em]">Akses Terbatas: Shadow Operator</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] mono text-slate-500 font-black uppercase tracking-widest ml-1">Username</label>
            <div className="relative group">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-500 transition-colors" />
              <input 
                type="text" 
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white mono text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-white/5"
                placeholder="Identitas Operator"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] mono text-slate-500 font-black uppercase tracking-widest ml-1">Kunci_Akses</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-500 transition-colors" />
              <input 
                type="password" 
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white mono text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-white/5"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500 animate-in fade-in slide-in-from-top-2">
              <ShieldAlert size={18} />
              <p className="text-[10px] mono font-black uppercase">Kredensial Tidak Valid. Akses Ditolak.</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-black font-black mono text-xs uppercase tracking-[0.3em] rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
            {isLoading ? 'MENGOTENTIKASI...' : 'DEKRIPSI_MASUK'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-3">
          <p className="text-[9px] mono text-slate-600 uppercase font-bold tracking-[0.3em]">Otoritas Shadow Net v4.2</p>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <div className="w-2 h-2 rounded-full bg-white/5"></div>
            <div className="w-2 h-2 rounded-full bg-white/5"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
