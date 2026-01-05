
import React, { useState, useEffect, useRef } from 'react';
import { streamLocation } from '../services/realtime';
import { MapPin, AlertCircle, PlayCircle, Activity, Terminal as TerminalIcon, Lock, Unlock } from 'lucide-react';

interface TrackerClientProps {
  sessionId: string;
}

const TrackerClient: React.FC<TrackerClientProps> = ({ sessionId }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [loadingText, setLoadingText] = useState('OTENTIKASI_SISTEM...');
  const simInterval = useRef<any>(null);

  useEffect(() => {
    if (isTracking) {
      const texts = ["MENGENKRIPSI_TUNNEL...", "MENEMBUS_VPN...", "MENGIRIM_DATA...", "UPLINK_STABIL"];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[i % texts.length]);
        i++;
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("GEOLOKASI_TIDAK_DIDUKUNG");
      return;
    }

    setIsTracking(true);
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed, accuracy } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        streamLocation({
          sessionId,
          lat: latitude,
          lng: longitude,
          speed,
          accuracy,
          timestamp: position.timestamp
        });
      },
      (err) => {
        setError("IZIN_DITOLAK: GAGAL_MENGAKSES_LOKASI");
        setIsTracking(false);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  };

  const toggleSimulation = () => {
    if (isSimulating) {
      clearInterval(simInterval.current);
      setIsSimulating(false);
    } else {
      setIsSimulating(true);
      setIsTracking(true);
      let lat = -6.2000;
      let lng = 106.8166;
      
      simInterval.current = setInterval(() => {
        lat += (Math.random() - 0.5) * 0.001;
        lng += (Math.random() - 0.5) * 0.001;
        setCoords({ lat, lng });
        streamLocation({
          sessionId,
          lat,
          lng,
          speed: 5 + Math.random() * 2,
          accuracy: 5,
          timestamp: Date.now()
        });
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white mono overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      
      <div className="max-w-md w-full bg-[#0a0a0a] rounded-2xl p-10 border border-white/5 shadow-[0_0_50px_rgba(0,0,0,1)] text-center relative z-10">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        
        <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative group">
          <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-ping"></div>
          {isTracking ? <Unlock size={36} className="text-cyan-400" /> : <Lock size={36} className="text-cyan-400" />}
        </div>
        
        <h1 className="text-xl font-black mb-4 tracking-[0.3em] uppercase italic">Node_Bayangan_0x71</h1>
        <p className="text-slate-500 text-[11px] mb-10 leading-relaxed uppercase tracking-widest font-bold">
          MEMBANGUN TEROWONGAN P2P AMAN UNTUK PROTOKOL PELACAKAN OSINT.
        </p>

        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-4 text-rose-400 text-left animate-in shake">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-[10px] font-black tracking-widest uppercase">{error}</p>
          </div>
        )}

        {!isTracking ? (
          <div className="space-y-6">
            <button
              onClick={startTracking}
              className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-black font-black transition-all transform active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3 text-sm tracking-widest uppercase"
            >
              <MapPin size={18} /> Aktifkan_Uplink
            </button>
            <div className="flex items-center gap-4">
                <div className="h-[1px] bg-white/5 flex-1"></div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SIMULASI_OSINT</span>
                <div className="h-[1px] bg-white/5 flex-1"></div>
            </div>
            <button
              onClick={toggleSimulation}
              className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl font-black transition-all flex items-center justify-center gap-3 text-[10px] text-slate-400 border border-white/10 uppercase tracking-[0.2em]"
            >
              <PlayCircle size={16} /> Jalankan_Sim_Payload
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-2 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-cyan-500">
                    <TerminalIcon size={20} />
                </div>
              </div>
              <p className="text-cyan-400 font-black text-xs uppercase tracking-[0.4em] animate-pulse italic">{loadingText}</p>
            </div>

            {coords && (
              <div className="bg-black border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                <p className="text-[9px] text-slate-500 uppercase font-black mb-3 tracking-[0.2em] relative z-10">Data_Aliran_Langsung</p>
                <div className="flex items-center justify-center gap-4 relative z-10">
                   <div className="text-lg font-black text-white italic">
                      {coords.lat.toFixed(6)}
                   </div>
                   <div className="w-[1px] h-6 bg-white/10"></div>
                   <div className="text-lg font-black text-white italic">
                      {coords.lng.toFixed(6)}
                   </div>
                </div>
              </div>
            )}

            <button
              onClick={isSimulating ? toggleSimulation : () => window.location.reload()}
              className="text-[10px] text-rose-500 font-black uppercase tracking-[0.2em] hover:text-rose-400 transition-all border border-rose-500/20 px-4 py-2 rounded-lg"
            >
              Hentikan_Proses
            </button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-2">
          <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.3em]">GeoGuard_Shadow_Net_v4.2</p>
          <div className="flex gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_#00d4ff]"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/30"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackerClient;
