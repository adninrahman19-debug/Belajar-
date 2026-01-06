
import React from 'react';
import { Cpu, Crosshair, Code2, ShieldAlert, Zap, Database, Eye } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: Cpu, label: 'PUSAT_DATA' },
    { id: 'devices', icon: Crosshair, label: 'INTEL_LOKASI' },
    { id: 'sensors', icon: Eye, label: 'HUB_SENSOR' },
    { id: 'vault', icon: Database, label: 'BRANKAS_DATA' },
    { id: 'blueprints', icon: Code2, label: 'MUATAN_DATA' },
    { id: 'compliance', icon: ShieldAlert, label: 'PROTOKOL' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 bg-cyan-500 rounded flex items-center justify-center font-black text-black">
          <Zap size={24} />
        </div>
        <h1 className="hidden lg:block text-lg font-black tracking-widest text-white italic">SHADOW.OS</h1>
      </div>
      
      <nav className="flex-1 p-3 space-y-1 mt-4 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded transition-all group ${
              activeTab === item.id 
              ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-500 shadow-[inset:10px_0_15px_-10px_rgba(6,182,212,0.3)]' 
              : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={20} />
            <span className="hidden lg:block font-bold text-[10px] tracking-[0.2em] mono uppercase">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 bg-black/40">
        <div className="rounded-lg p-3 border border-white/5">
          <div className="flex items-center justify-between mb-2 text-[10px] mono">
            <span className="text-slate-500 font-bold uppercase">Uplink</span>
            <span className="text-cyan-500 font-bold animate-pulse">AKTIF</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full w-[85%]"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
