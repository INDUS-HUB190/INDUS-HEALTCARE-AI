import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRightLeft, X, Loader2, Info, ChevronDown } from 'lucide-react';
import { useAuth } from '../App';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

export default function Comparison() {
  const { language } = useAuth();
  const [med1, setMed1] = useState('');
  const [med2, setMed2] = useState('');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<string | null>(null);

  const t = {
    en: {
      title: "Medicine Comparison",
      sub: "Compare two medicines side-by-side to understand differences in usage and safety.",
      label1: "First Medicine",
      label2: "Second Medicine",
      cta: "Compare Now",
      placeholder: "e.g. Aspirin",
      disclaimer: "Comparison is for educational purposes. Consult a doctor for professional advice."
    },
    hi: {
      title: "दवा की तुलना",
      sub: "उपयोग और सुरक्षा में अंतर को समझने के लिए दो दवाओं की तुलना करें।",
      label1: "पहली दवा",
      label2: "दूसरी दवा",
      cta: "अभी तुलना करें",
      placeholder: "जैसे: एस्पिरिन",
      disclaimer: "तुलना शैक्षिक उद्देश्यों के लिए है। पेशेवर सलाह के लिए डॉक्टर से परामर्श लें।"
    }
  }[language];

  const handleCompare = async () => {
    if (!med1.trim() || !med2.trim()) return;

    setLoading(true);
    setComparison(null);
    try {
      const prompt = `
        Compare ${med1} and ${med2} in a detailed, structured format.
        Use a markdown table if appropriate.
        Include:
        - Primary Uses
        - Common Side Effects
        - Safety Precautions
        - Prescription Status in India
        - Key Differences
        
        Respond in ${language === 'hi' ? 'Hindi' : 'English'}.
      `;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, language }),
      });
      const data = await response.json();
      setComparison(data.text);
    } catch (error) {
      toast.error('Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <ArrowRightLeft className="w-4 h-4 text-medical-blue" />
              <span className="text-xs font-bold text-medical-blue uppercase tracking-widest">{t.title}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-medical-navy mb-4">Precision Comparison</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
              {t.sub}
            </p>
          </motion.div>
        </header>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">{t.label1}</label>
              <div className="relative">
                <input
                  type="text"
                  value={med1}
                  onChange={(e) => setMed1(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-medical-blue focus:bg-white outline-none font-medium"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-12 h-12 bg-medical-soft rounded-full flex items-center justify-center text-medical-blue border border-medical-blue/10">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">{t.label2}</label>
              <div className="relative">
                <input
                  type="text"
                  value={med2}
                  onChange={(e) => setMed2(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-medical-blue focus:bg-white outline-none font-medium"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={loading || !med1.trim() || !med2.trim()}
            className="w-full mt-8 bg-medical-navy text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>{t.cta}</span>}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="w-12 h-12 text-medical-blue animate-spin mb-4" />
              <p className="text-medical-navy font-bold animate-pulse">Running comparative analysis...</p>
            </motion.div>
          ) : comparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto"
            >
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-50/50 p-8 md:p-12 overflow-x-auto">
                <div className="prose prose-blue prose-lg max-w-none prose-table:border-collapse prose-th:bg-gray-50 prose-th:p-4 prose-td:p-4 prose-td:border-b prose-td:border-gray-100 prose-headings:text-medical-navy">
                  <ReactMarkdown>{comparison}</ReactMarkdown>
                </div>
                
                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center space-x-3 text-amber-600 bg-amber-50 px-6 py-4 rounded-2xl">
                  <Info className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-bold leading-tight">{t.disclaimer}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
