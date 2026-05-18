import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Info, Shield, ExternalLink, Bookmark, ChevronRight, Loader2, Star } from 'lucide-react';
import { useAuth } from '../App';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

export default function MedicineSearch() {
  const { language } = useAuth();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const t = {
    en: {
      title: "Medicine Education System",
      sub: "Search any medicine to learn about its uses, side effects, and more.",
      placeholder: "e.g. Paracetamol, Ibuprofen, Amoxicillin...",
      search: "Search Information",
      trending: "Trending Searches",
      disclaimer: "Dosage guidance is for informational purposes only. Consult a doctor for actual prescriptions."
    },
    hi: {
      title: "दवा शिक्षा प्रणाली",
      sub: "दवाओं के उपयोग, दुष्प्रभावों और अन्य जानकारी के बारे में जानें।",
      placeholder: "जैसे: पैरासिटामोल, इबुप्रोफेन, अमोक्सिसिलिन...",
      search: "जानकारी खोजें",
      trending: "लोकप्रिय खोजें",
      disclaimer: "खुराक मार्गदर्शन केवल सूचनात्मक उद्देश्यों के लिए है। वास्तविक नुस्खे के लिए डॉक्टर से परामर्श लें।"
    }
  }[language];

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/medicine-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language }),
      });
      const data = await response.json();
      setResult(data.text);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-medical-navy mb-4">{t.title}</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
              {t.sub}
            </p>
          </motion.div>
        </header>

        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-x-0 -bottom-2 h-full bg-blue-100/50 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] p-2 focus-within:border-medical-blue focus-within:bg-white transition-all shadow-sm">
              <Search className="w-6 h-6 text-gray-400 ml-6 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.placeholder}
                className="w-full bg-transparent px-4 py-4 focus:outline-none font-medium text-medical-navy"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-medical-blue text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 shrink-0"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.search}
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2 py-2">{t.trending}:</span>
            {['Paracetamol', 'Metformin', 'Azithromycin', 'Omeprazole'].map((med) => (
              <button
                key={med}
                onClick={() => { setQuery(med); handleSearch(); }}
                className="text-xs font-bold text-medical-blue bg-medical-soft px-4 py-2 rounded-full hover:bg-medical-blue hover:text-white transition-all border border-medical-blue/10"
              >
                {med}
              </button>
            ))}
          </div>
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
              <p className="text-medical-navy font-bold animate-pulse">Analyzing pharmacology database...</p>
            </motion.div>
          ) : result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-50/50 overflow-hidden">
                <div className="bg-medical-navy p-8 text-white flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-display font-bold mb-1">{query}</h2>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-medical-cyan" />
                      <span className="text-xs font-bold uppercase tracking-widest text-medical-cyan/80">INDUS Verified Resource</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                      <Bookmark className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                      <Star className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
                
                <div className="p-8 md:p-12">
                  <div className="prose prose-blue prose-lg max-w-none prose-headings:text-medical-navy prose-h2:text-2xl prose-h2:font-display prose-h2:mb-4 prose-p:text-gray-600 prose-p:leading-relaxed">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>

                  <div className="mt-12 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm">
                    <div className="flex items-center space-x-3 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 max-w-lg">
                      <Info className="w-5 h-5 shrink-0" />
                      <p className="text-xs font-medium leading-tight">{t.disclaimer}</p>
                    </div>
                    <button className="flex items-center space-x-2 text-medical-blue font-bold group">
                      <span>Source: WHO Essential Meds</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
