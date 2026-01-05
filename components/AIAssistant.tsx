
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Cpu, Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { getAIAssistantResponse } from '../services/geminiService';

interface AIAssistantProps {
  onNavigate: (tab: string) => void;
  onTrack: (num: string) => void;
  onSensor: (type: 'camera' | 'screen', action: 'start' | 'stop') => void;
  onVault: (cat: 'gmail' | 'files') => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onNavigate, onTrack, onSensor, onVault }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'assistant',
      content: 'UPLINK_DITERIMA.\n\nUnit dukungan taktis **ECHO-LINK** aktif.\nSiap mengeksekusi instruksi operasional Anda.',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const result = await getAIAssistantResponse(input, history);

    // Proses Tool Calls jika ada
    if (result.functionCalls) {
      result.functionCalls.forEach((call: any) => {
        console.log("Executing Tool Call:", call.name, call.args);
        switch (call.name) {
          case 'pindah_halaman':
            onNavigate(call.args.target);
            break;
          case 'mulai_pelacakan':
            onTrack(call.args.nomorTelepon);
            break;
          case 'kontrol_sensor':
            onSensor(call.args.tipe, call.args.status);
            break;
          case 'buka_arsip_data':
            onVault(call.args.kategori);
            break;
        }
      });
    }

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: result.text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <b key={i} className="text-cyan-400 font-black">{part.slice(2, -2)}</b>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] border-2 ${
          isOpen ? 'bg-rose-600 border-rose-400 rotate-90 scale-90' : 'bg-cyan-600 border-cyan-400 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="text-white" size={24} /> : <div className="relative"><Sparkles className="text-black animate-pulse" size={24} /></div>}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-[#0a0a0a] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 glass">
          <div className="p-4 bg-cyan-950/40 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                <Cpu size={18} className="animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white mono uppercase tracking-widest italic">ECHO-LINK TACTICAL</h3>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[9px] text-emerald-500 mono font-bold uppercase tracking-widest">Sistem: Terintegrasi</span>
                </div>
              </div>
            </div>
            <TerminalIcon size={16} className="text-slate-600" />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02),transparent)]">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl border text-[11px] mono leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user' 
                  ? 'bg-cyan-500/10 border-cyan-500/20 text-white rounded-br-none' 
                  : 'bg-white/5 border-white/5 text-slate-300 rounded-bl-none italic'
                }`}>
                  {m.role === 'assistant' && (
                    <div className="text-[9px] font-black text-cyan-500/60 mb-1 uppercase tracking-tighter">AI_COMMAND_NODE</div>
                  )}
                  {formatText(m.content)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl rounded-bl-none flex gap-1">
                  <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-black/40 border-t border-white/5">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Perintahkan AI (Contoh: Lacak 0812...)"
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs mono text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-white/20"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-cyan-400 disabled:opacity-20 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
          
          <div className="px-4 py-2 bg-cyan-950/20 flex justify-between items-center">
             <span className="text-[8px] mono text-slate-600 uppercase font-black tracking-widest">Akses: FULL_CONTROL</span>
             <span className="text-[8px] mono text-cyan-500/40 italic">Unit_01</span>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
