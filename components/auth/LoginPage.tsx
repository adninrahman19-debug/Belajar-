
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

    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLoginSuccess();
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent)] pointer-events-none"></div>
      
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-white transition-all mono text-[10px] uppercase font-black tracking-widest"
      >
        <ChevronLeft size={16} /> Kembali
      </button>

      <div className={`max-w-md w-full bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 shadow-[0_0_50px_rgba(0,0,0,1)] relative z-10`}>
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 mb-6 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Otentikasi Node</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] mono text-slate-500 font-black uppercase tracking-widest ml-1">Username</label>
            <input 
              type="text" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white mono text-sm focus:outline-none focus:border-cyan-500"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] mono text-slate-500 font-black uppercase tracking-widest ml-1">Kunci_Akses</label>
            <input 
              type="password" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white mono text-sm focus:outline-none focus:border-cyan-500"
              placeholder="admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-cyan-600 text-black font-black mono text-xs uppercase tracking-[0.3em] rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'DEKRIPSI_MASUK'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
