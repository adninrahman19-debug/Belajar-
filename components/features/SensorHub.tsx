
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Monitor, Power, Radio, ShieldCheck } from 'lucide-react';

const SensorHub: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeSensor, setActiveSensor] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startSensor = async (type: 'camera' | 'screen') => {
    try {
      let mediaStream: MediaStream;
      if (type === 'camera') {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } else {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      }
      setStream(mediaStream);
      setActiveSensor(type);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Gagal mengakses sensor:", err);
    }
  };

  const stopSensor = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setActiveSensor(null);
    }
  };

  useEffect(() => {
    const handleControl = (e: any) => {
      const { type, action } = e.detail;
      if (action === 'start') startSensor(type);
      else stopSensor();
    };

    window.addEventListener('control-sensor', handleControl);
    return () => window.removeEventListener('control-sensor', handleControl);
  }, [stream]);

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-12 lg:col-span-8 bg-black border border-white/10 rounded-2xl overflow-hidden relative flex flex-col">
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <div className="px-3 py-1 bg-black/60 rounded border border-cyan-500/30 text-cyan-400 text-[10px] mono font-black flex items-center gap-2">
            <Radio size={12} className="animate-pulse" />
            LIVE_FEED: {activeSensor?.toUpperCase() || 'IDLE'}
          </div>
        </div>

        <div className="flex-1 bg-slate-900/20 relative">
          {stream ? (
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover grayscale brightness-75 contrast-125" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-700">
              <Camera size={64} className="opacity-20" />
              <p className="text-[10px] mono tracking-widest uppercase">Menunggu Inisialisasi Sensor...</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-black/40 border-t border-white/5 flex gap-4 justify-center">
          <button onClick={() => startSensor('camera')} className={`p-4 rounded-xl border transition-all ${activeSensor === 'camera' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>Kamera</button>
          <button onClick={() => startSensor('screen')} className={`p-4 rounded-xl border transition-all ${activeSensor === 'screen' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>Layar</button>
          <button onClick={stopSensor} className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500">Putus</button>
        </div>
      </div>
      
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div className="bg-[#0f172a]/40 glass border border-white/5 rounded-2xl p-6 h-full">
           <h3 className="text-xs font-black text-white mono tracking-widest mb-6 uppercase flex items-center gap-2">
             <ShieldCheck size={16} className="text-cyan-500" /> Analisis Sinyal AI
           </h3>
           <div className="space-y-4">
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                 <p className="text-[9px] text-slate-500 mono font-bold uppercase mb-2">Deteksi Objek</p>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] mono">
                       <span className="text-slate-400">Wajah Manusia</span>
                       <span className="text-cyan-500">98.2%</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SensorHub;
