
import React from 'react';
import { ShieldAlert, CheckCircle, Lock, AlertTriangle } from 'lucide-react';

const Compliance: React.FC = () => {
  const protocols = [
    { title: "Izin Geolokasi", status: "AKTIF", desc: "Setiap permintaan lokasi harus melalui persetujuan manual pengguna (Opt-in)." },
    { title: "Enkripsi P2P", status: "AKTIF", desc: "Data dikirim melalui saluran terenkripsi end-to-end menggunakan protokol WebRTC." },
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {protocols.map((p, i) => (
          <div key={i} className="bg-[#0f172a]/40 border border-white/5 rounded-2xl p-6 glass">
            <div className="flex justify-between items-start mb-4">
               <Lock size={18} className="text-cyan-500" />
               <span className="text-[9px] font-black mono text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">{p.status}</span>
            </div>
            <h4 className="text-xs font-black text-white mono mb-2 uppercase tracking-widest italic">{p.title}</h4>
            <p className="text-[10px] text-slate-500 mono leading-relaxed uppercase">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-3xl p-10 overflow-y-auto relative glass">
         <h3 className="text-2xl font-black text-white mb-8 italic tracking-tighter flex items-center gap-4 uppercase">
            <AlertTriangle className="text-amber-500" /> KERANGKA_KEPATUHAN_HUKUM
         </h3>

         <div className="space-y-10">
            <section>
               <h4 className="text-xs font-black text-cyan-400 mono mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <CheckCircle size={14} /> 01. Transparansi & Tujuan
               </h4>
               <p className="text-[11px] text-slate-400 mono leading-relaxed uppercase">
                  Operator wajib menyatakan tujuan pelacakan secara eksplisit. GeoGuard tidak mendukung penggunaan ilegal untuk pengintaian tanpa izin.
               </p>
            </section>
         </div>
      </div>
    </div>
  );
};

export default Compliance;
