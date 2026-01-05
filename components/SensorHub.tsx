
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Monitor, Power, Radio, ShieldCheck } from 'lucide-react';

const SensorHub: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeSensor, setActiveSensor] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Listen for AI commands
  useEffect(() => {
    const handleControl = (e: any) => {
      const { type, action } = e.detail;
      if (action === 'start') {
        startSensor(type);
      } else {
        stopSensor();
      }
    };

    window.addEventListener('control-sensor', handleControl);
    return () => window.removeEventListener('control-sensor', handleControl);
  }, [stream]);

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-12 lg:col-span-8 bg-black border border-white/10 rounded-2xl overflow-hidden relative flex flex-col">
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <div className="px-3 py-1 bg-black/60 backdrop-blur rounded border border-cyan-500/30 text-cyan-400 text-[10px] mono font-black flex items-center gap-2">
            <Radio size={12} className="animate-pulse" />
            LIVE_FEED: {activeSensor?.toUpperCase() || 'IDLE'}
          </div>
        </div>

        <div className="flex-1 bg-slate-900/20 relative">
          {stream ? (
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              className="w-full h-full object-cover grayscale brightness-75 contrast-125"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-700">
              <Camera size={64} className="opacity-20" />
              <p className="text-[10px] mono tracking-widest uppercase">Menunggu Inisialisasi Sensor...</p>
            </div>
          )}
          
          {/* Scanning Overlay */}
          <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20">
            <div className="absolute top-4 right-4 text-rose-500 text-[10px] mono font-black animate-pulse uppercase">REC ●</div>
            <div className="absolute bottom-4 left-4 text-cyan-500 text-[10px] mono font-black">ISO_800 | F2.8 | 60FPS</div>
            <div className="absolute inset-0 border border-cyan-500/10 grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => <div key={i} className="border-[0.5px] border-white/5"></div>)}
            </div>
          </div>
        </div>

        <div className="p-6 bg-black/40 border-t border-white/5 flex gap-4 justify-center">
          <button 
            onClick={() => startSensor('camera')}
            className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 w-32 ${activeSensor === 'camera' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
          >
            <Camera size={20} />
            <span className="text-[10px] font-black mono uppercase">Kamera</span>
          </button>
          <button 
            onClick={() => startSensor('screen')}
            className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 w-32 ${activeSensor === 'screen' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
          >
            <Monitor size={20} />
            <span className="text-[10px] font-black mono uppercase">Layar</span>
          </button>
          <button 
            onClick={stopSensor}
            className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex flex-col items-center gap-2 w-32"
          >
            <Power size={20} />
            <span className="text-[10px] font-black mono uppercase">Putus</span>
          </button>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div className="bg-[#0f172a]/40 glass border border-white/5 rounded-2xl p-6 h-full">
           <h3 className="text-xs font-black text-white mono tracking-widest mb-6 uppercase flex items-center gap-2">
             <ShieldCheck size={16} className="text-cyan-500" /> Analisis Sinyal AI
           </h3>
           <div className="space-y-4">
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                 <p className="text-[9px] text-slate-500 mono font-bold uppercase mb-2">Status Mikrofon</p>
                 <div className="flex items-center gap-2">
                    <div className="flex-1 h-8 bg-cyan-500/10 rounded flex items-end gap-0.5 p-1">
                       {[...Array(15)].map((_, i) => (
                         <div key={i} className="flex-1 bg-cyan-500 animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                 <p className="text-[9px] text-slate-500 mono font-bold uppercase mb-2">Deteksi Objek</p>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] mono">
                       <span className="text-slate-400 uppercase">Wajah Manusia</span>
                       <span className="text-cyan-500">98.2%</span>
                    </div>
                    <div className="flex justify-between text-[10px] mono">
                       <span className="text-slate-400 uppercase">Perangkat Mobile</span>
                       <span className="text-cyan-500">84.0%</span>
                    </div>
                 </div>
              </div>
              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                 <p className="text-[10px] text-rose-500 mono font-black uppercase mb-2">Peringatan Privasi</p>
                 <p className="text-[11px] text-slate-400 mono leading-relaxed italic">Catatan Pendidikan: Akses sensor pada browser memerlukan interaksi manual pengguna sesuai protokol keamanan W3C.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SensorHub;
