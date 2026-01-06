
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Cpu, Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { getAIAssistantResponse } from '../../services/ai.service';

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
      content: 'UPLINK_DITERIMA.\n\nUnit dukungan taktis **ECHO-LINK** aktif.',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const result = await getAIAssistantResponse(input, []);

    if (result.functionCalls) {
      result.functionCalls.forEach((call: any) => {
        switch (call.name) {
          case 'pindah_halaman': onNavigate(call.args.target); break;
          case 'mulai_pelacakan': onTrack(call.args.nomorTelepon); break;
          case 'kontrol_sensor': onSensor(call.args.tipe, call.args.status); break;
          case 'buka_arsip_data': onVault(call.args.kategori); break;
        }
      });
    }

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: result.text, timestamp: new Date() }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] border-2 ${
          isOpen ? 'bg-rose-600 border-rose-400 rotate-90 scale-90' : 'bg-cyan-600 border-cyan-400 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="text-white" size={24} /> : <Sparkles className="text-black animate-pulse" size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-[#0a0a0a] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 glass">
          <div className="p-4 bg-cyan-950/40 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu size={18} className="text-cyan-400 animate-spin-slow" />
              <h3 className="text-xs font-black text-white mono uppercase italic">ECHO-LINK TACTICAL</h3>
            </div>
            <TerminalIcon size={16} className="text-slate-600" />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02),transparent)]">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl border text-[11px] mono leading-relaxed ${
                  m.role === 'user' ? 'bg-cyan-500/10 border-cyan-500/20 text-white' : 'bg-white/5 border-white/5 text-slate-300 italic'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-black/40 border-t border-white/5">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Perintah taktis..."
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3 px-4 text-xs mono text-white focus:outline-none focus:border-cyan-500"
              />
              <button onClick={handleSend} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500 hover:text-cyan-400">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
