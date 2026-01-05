
import React from 'react';
import { ShieldAlert, CheckCircle, Info, Lock, Globe, AlertTriangle } from 'lucide-react';

const Compliance: React.FC = () => {
  const protocols = [
    { title: "Izin Geolokasi", status: "AKTIF", desc: "Setiap permintaan lokasi harus melalui persetujuan manual pengguna (Opt-in)." },
    { title: "Enkripsi P2P", status: "AKTIF", desc: "Data dikirim melalui saluran terenkripsi end-to-end menggunakan protokol WebRTC." },
    { title: "Penghapusan Data", status: "SIAGA", desc: "Data target otomatis dihapus setelah sesi berakhir (Ephemeral Data Storage)." },
    { title: "Kepatuhan GDPR", status: "VERIFIKASI", desc: "Memastikan hak subjek data sesuai regulasi Uni Eropa dalam lingkungan simulasi." }
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {protocols.map((p, i) => (
          <div key={i} className="bg-[#0f172a]/40 border border-white/5 rounded-2xl p-6 glass hover:border-cyan-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
                  <Lock size={18} />
               </div>
               <span className="text-[9px] font-black mono text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">{p.status}</span>
            </div>
            <h4 className="text-xs font-black text-white mono mb-2 uppercase tracking-widest italic">{p.title}</h4>
            <p className="text-[10px] text-slate-500 mono leading-relaxed uppercase">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/10 rounded-3xl p-10 overflow-y-auto relative glass">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldAlert size={120} />
           </div>
           
           <h3 className="text-2xl font-black text-white mb-8 italic tracking-tighter flex items-center gap-4 uppercase">
              <AlertTriangle className="text-amber-500" /> KERANGKA_KEPATUHAN_HUKUM
           </h3>

           <div className="space-y-10 relative z-10">
              <section>
                 <h4 className="text-xs font-black text-cyan-400 mono mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                    <CheckCircle size={14} /> 01. Transparansi & Tujuan
                 </h4>
                 <p className="text-[11px] text-slate-400 mono leading-relaxed uppercase">
                    Operator wajib menyatakan tujuan pelacakan secara eksplisit. GeoGuard tidak mendukung penggunaan ilegal untuk pengintaian tanpa izin. Sistem ini dirancang sebagai demonstrasi teknologi keamanan siber (Cybersecurity Education).
                 </p>
              </section>

              <section>
                 <h4 className="text-xs font-black text-cyan-400 mono mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                    <CheckCircle size={14} /> 02. Retensi Data
                 </h4>
                 <p className="text-[11px] text-slate-400 mono leading-relaxed uppercase italic">
                    Data koordinat disimpan dalam cache browser sementara dan akan dihancurkan (Purge) saat sesi administratif ditutup atau saat 'Hancurkan Data' dipicu secara manual oleh operator.
                 </p>
              </section>

              <section>
                 <h4 className="text-xs font-black text-cyan-400 mono mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                    <CheckCircle size={14} /> 03. Integritas Sistem
                 </h4>
                 <p className="text-[11px] text-slate-400 mono leading-relaxed uppercase">
                    Menggunakan teknik Social Engineering Bridge untuk memperoleh akses sensor. Hal ini bertujuan menunjukkan betapa mudahnya izin diberikan oleh pengguna yang tidak waspada terhadap tautan yang mencurigakan.
                 </p>
              </section>
           </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-8 glass flex-1">
              <div className="flex items-center gap-3 mb-6">
                 <Globe size={24} className="text-rose-500" />
                 <h4 className="text-sm font-black text-white mono uppercase italic">Yurisdiksi_Global</h4>
              </div>
              <ul className="space-y-4">
                 <li className="flex gap-3">
                    <Info size={16} className="text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-[10px] text-slate-400 mono leading-relaxed uppercase">Penerapan standar ISO/IEC 27001 dalam manajemen informasi.</span>
                 </li>
                 <li className="flex gap-3">
                    <Info size={16} className="text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-[10px] text-slate-400 mono leading-relaxed uppercase">Kesesuaian dengan Digital Services Act (DSA) di wilayah terdaftar.</span>
                 </li>
              </ul>
              
              <div className="mt-8 p-4 bg-black/40 border border-white/5 rounded-xl">
                 <p className="text-[9px] text-rose-500 mono font-black uppercase mb-1">Status Kepatuhan</p>
                 <p className="text-xl font-black text-white mono tracking-tighter italic">94.2% <span className="text-[10px] text-slate-500">KOMPLAIN</span></p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
