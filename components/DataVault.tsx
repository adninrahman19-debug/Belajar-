
import React, { useState, useEffect } from 'react';
import { Mail, FileText, Lock, Search, Download, Trash2, Key } from 'lucide-react';

const MOCK_EMAILS = [
  { id: 1, from: "bank.central@finance.com", subject: "Laporan Bulanan Rekening", date: "Tadi", body: "Saldo akhir Anda pada periode..." },
  { id: 2, from: "personal@gmail.com", subject: "Password Vault Backup", date: "2 jam lalu", body: "Berikut adalah kode cadangan Anda: 8X32-..." },
  { id: 3, from: "office@corp.net", subject: "Dokumen Proyek Rahasia", date: "Kemarin", body: "Harap baca file PDF terlampir mengenai rencana..." },
];

const MOCK_FILES = [
  { name: "scan_ktp.jpg", size: "1.2 MB", type: "IMAGE", date: "15/10/2023" },
  { name: "rahasia_bisnis.pdf", size: "4.5 MB", type: "PDF", date: "02/11/2023" },
  { name: "backdoor_setup.sh", size: "2 KB", type: "SCRIPT", date: "20/11/2023" },
  { name: "selfie_liburan.png", size: "3.8 MB", type: "IMAGE", date: "12/09/2023" },
];

interface DataVaultProps {
  initialCategory?: 'gmail' | 'files';
}

const DataVault: React.FC<DataVaultProps> = ({ initialCategory = 'gmail' }) => {
  const [tab, setTab] = useState<'gmail' | 'files'>(initialCategory);

  useEffect(() => {
    setTab(initialCategory);
  }, [initialCategory]);

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
        <button 
          onClick={() => setTab('gmail')}
          className={`p-6 rounded-2xl border transition-all text-left flex items-center gap-4 ${tab === 'gmail' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-black/40 border-white/5 text-slate-500 hover:border-white/20'}`}
        >
          <Mail size={24} />
          <div>
            <p className="text-xs font-black mono uppercase">Kotak Masuk</p>
            <p className="text-[10px] mono opacity-50 uppercase">Gmail_Service</p>
          </div>
        </button>
        <button 
          onClick={() => setTab('files')}
          className={`p-6 rounded-2xl border transition-all text-left flex items-center gap-4 ${tab === 'files' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-black/40 border-white/5 text-slate-500 hover:border-white/20'}`}
        >
          <FileText size={24} />
          <div>
            <p className="text-xs font-black mono uppercase">Sistem File</p>
            <p className="text-[10px] mono opacity-50 uppercase">Root_Storage</p>
          </div>
        </button>
        
        <div className="mt-auto p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex flex-col gap-3">
           <div className="flex items-center gap-2 text-rose-500">
              <Lock size={16} />
              <span className="text-[10px] font-black mono uppercase">Enkripsi_Data</span>
           </div>
           <p className="text-[10px] text-slate-500 mono leading-relaxed uppercase">Sistem ekstraksi data ini bersifat simulasi untuk mendemonstrasikan risiko kebocoran data pribadi.</p>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-9 bg-black/40 border border-white/5 rounded-3xl overflow-hidden flex flex-col glass">
        <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-cyan-500">
                {tab === 'gmail' ? <Mail size={20} /> : <FileText size={20} />}
             </div>
             <div>
                <h3 className="text-sm font-black text-white mono uppercase italic">{tab === 'gmail' ? 'Ekstraksi_Gmail' : 'Struktur_Berkas'}</h3>
                <p className="text-[10px] text-slate-500 mono font-bold">MODE: BACA_SAJA</p>
             </div>
          </div>
          <div className="relative">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
             <input type="text" placeholder="Cari muatan..." className="bg-black/40 border border-white/10 rounded-full pl-10 pr-4 py-2 text-[10px] mono text-white focus:outline-none focus:border-cyan-500 w-48" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'gmail' ? (
            <div className="space-y-4">
              {MOCK_EMAILS.map(email => (
                <div key={email.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-cyan-500/30 cursor-pointer transition-all group">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-black text-cyan-500 mono">{email.from}</span>
                    <span className="text-[10px] text-slate-500 mono">{email.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2 group-hover:text-cyan-400">{email.subject}</h4>
                  <p className="text-[10px] text-slate-500 truncate mono">{email.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
               {MOCK_FILES.map((file, i) => (
                 <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-500">
                       <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-xs font-bold text-white truncate mono">{file.name}</p>
                       <p className="text-[9px] text-slate-500 mono uppercase">{file.type} | {file.size}</p>
                    </div>
                    <Download size={16} className="text-slate-500 hover:text-cyan-500" />
                 </div>
               ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-black/40 border-t border-white/5 flex items-center gap-4 justify-end">
           <button className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 rounded-lg text-[10px] font-black mono hover:bg-rose-500 hover:text-white transition-all">
              <Trash2 size={14} /> HANCURKAN_DATA
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-black rounded-lg text-[10px] font-black mono hover:bg-cyan-400 transition-all">
              <Key size={14} /> DEKRIPSI_MASSAL
           </button>
        </div>
      </div>
    </div>
  );
};

export default DataVault;
