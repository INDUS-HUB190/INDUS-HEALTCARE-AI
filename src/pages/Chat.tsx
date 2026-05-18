import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2, Info, AlertTriangle, Languages } from 'lucide-react';
import { useAuth } from '../App';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const { user, language } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      placeholder: "Ask about medicines, symptoms or medical terms...",
      disclaimer: "INDUS AI is for educational use. Consult a doctor for medical advice.",
      greeting: `Hello ${user?.displayName?.split(' ')[0]}, how can I assist you with your health education today?`
    },
    hi: {
      placeholder: "दवाओं, लक्षणों या चिकित्सा शब्दों के बारे में पूछें...",
      disclaimer: "INDUS एआई केवल शैक्षिक उपयोग के लिए है। चिकित्सा सलाह के लिए डॉक्टर से परामर्श लें।",
      greeting: `नमस्ते ${user?.displayName?.split(' ')[0]}, आज मैं आपकी स्वास्थ्य शिक्षा में कैसे मदद कर सकता हू?`
    }
  }[language];

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: t.greeting }]);
    }
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          language,
          history: messages
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (error: any) {
      toast.error('Failed to get response');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Header Info */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-medical-blue flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-medical-navy">INDUS AI Assistant</h1>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Always Online</span>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-2 rounded-lg flex items-center space-x-2 max-w-xs hidden sm:flex">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-[10px] text-amber-700 font-medium leading-tight">
            {t.disclaimer}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex w-full",
                m.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "flex max-w-[85%] md:max-w-[70%] space-x-3",
                m.role === 'user' ? "flex-row-reverse space-x-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
                  m.role === 'user' ? "bg-medical-navy text-white" : "bg-medical-blue text-white"
                )}>
                  {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "p-4 md:p-6 rounded-2xl shadow-sm",
                  m.role === 'user' 
                    ? "bg-medical-blue text-white rounded-tr-none" 
                    : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                )}>
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-medical-navy prose-strong:text-medical-navy prose-code:text-medical-blue">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center space-x-3 shadow-sm">
              <Loader2 className="w-4 h-4 text-medical-blue animate-spin" />
              <span className="text-sm font-medium text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 md:p-8 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t.placeholder}
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pr-16 focus:outline-none focus:ring-2 focus:ring-medical-blue/20 focus:border-medical-blue transition-all resize-none shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-3 bottom-3 p-3 bg-medical-blue text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
          <Info className="w-3 h-3" />
          <span>INDUS AI v1.0 • Built for Health Literacy</span>
        </p>
      </div>
    </div>
  );
}
