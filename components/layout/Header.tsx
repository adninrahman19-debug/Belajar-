
import React from 'react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onLogout }) => {
  const titles: Record<string, string> = {
    dashboard: 'PUSAT_KENDALI_UTAMA',
    devices: 'SURVEILANS_LOKASI',
    sensors: 'HUB_SENSOR_AKTIF',
    vault: 'EKSTRAKSI_DATA',
    blueprints: 'ARSIP_TEKNIS',
    compliance: 'PROTOKOL_KEPATUHAN'
  };

  return (
    <header className="px-8 py-4 bg-black/40 border-b border-white/5 flex justify-between items-center z-40 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="h-10 w-[2px] bg-cyan-500 shadow-[0_0_10px_#00d4ff]"></div>
        <div>
          <h2 className="text-sm mono font-black text-white tracking-[0.3em] uppercase italic">
            {titles[activeTab] || 'SHADOW_NET'}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase mono">Status: ADMIN</span>
            <span className="text-[10px] text-emerald-500 mono font-black animate-pulse uppercase">● Aman</span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onLogout}
        className="p-2 bg-rose-500/10 border border-rose-500/20 rounded text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
      >
        <LogOut size={18} />
        <span className="text-[10px] font-black mono hidden lg:block uppercase">Logout</span>
      </button>
    </header>
  );
};

export default Header;
