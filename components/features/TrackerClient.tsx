
import React, { useState, useEffect, useRef } from 'react';
import { streamLocation } from '../../services/realtime.service';
import { MapPin, AlertCircle, PlayCircle, Lock, Unlock, Terminal as TerminalIcon } from 'lucide-react';

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
      <div className="max-w-md w-full bg-[#0a0a0a] rounded-2xl p-10 border border-white/5 shadow-2xl text-center relative z-10">
        <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/20">
          {isTracking ? <Unlock size={36} className="text-cyan-400" /> : <Lock size={36} className="text-cyan-400" />}
        </div>
        
        <h1 className="text-xl font-black mb-4 tracking-[0.3em] uppercase italic">Node_Bayangan_0x71</h1>

        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-4 text-rose-400 text-left">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-[10px] font-black uppercase">{error}</p>
          </div>
        )}

        {!isTracking ? (
          <div className="space-y-6">
            <button onClick={startTracking} className="w-full py-5 bg-cyan-600 text-black font-black uppercase tracking-widest">
              Aktifkan_Uplink
            </button>
            <button onClick={toggleSimulation} className="w-full py-4 bg-white/5 text-slate-400 border border-white/10 uppercase tracking-widest">
              Simulasi_OSINT
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <p className="text-cyan-400 font-black text-xs uppercase tracking-[0.4em] animate-pulse italic">{loadingText}</p>
            {coords && (
              <div className="bg-black border border-white/5 p-6 rounded-xl">
                <div className="flex items-center justify-center gap-4">
                   <div className="text-lg font-black text-white italic">{coords.lat.toFixed(6)}</div>
                   <div className="text-lg font-black text-white italic">{coords.lng.toFixed(6)}</div>
                </div>
              </div>
            )}
            <button onClick={() => window.location.reload()} className="text-[10px] text-rose-500 font-black uppercase">
              Hentikan_Proses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackerClient;
