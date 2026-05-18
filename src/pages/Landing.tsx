import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, Globe, MessageCircle, Activity, Search, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { cn } from '../lib/utils';

export default function Landing() {
  const { language } = useAuth();

  const t = {
    en: {
      hero: "Smarter Healthcare Awareness for India's Future",
      sub: "One of India's first premium AI-powered medicine education platforms. Detailed medicine information, symptom guidance, and expert AI assistance at your fingertips.",
      cta: "Experience INDUS AI",
      features: "Features",
      feature1: "Med-Info Database",
      feature1Sub: "Comprehensive details on uses, side effects, and precautions of medicines.",
      feature2: "AI Health Assistant",
      feature2Sub: "Organized, simple explanations for complex medical conditions and terms.",
      feature3: "Indian Innovation",
      feature3Sub: "Built specifically for India with full Hindi support and localized health tips.",
      founder: "Envisioned and founded by Anant Singh."
    },
    hi: {
      hero: "भारत के भविष्य के लिए स्मार्ट स्वास्थ्य जागरूकता",
      sub: "भारत के पहले प्रीमियम एआई-संचालित दवा शिक्षा प्लेटफार्मों में से एक। दवाओं की विस्तृत जानकारी, लक्षणों का मार्गदर्शन, और विशेषज्ञ एआई सहायता आपकी उंगलियों पर।",
      cta: "INDUS AI का अनुभव करें",
      features: "विशेषताएं",
      feature1: "दवा सूचना डेटाबेस",
      feature1Sub: "दवाओं के उपयोग, दुष्प्रभावों और सावधानियों पर व्यापक विवरण।",
      feature2: "एआई स्वास्थ्य सहायक",
      feature2Sub: "जटिल चिकित्सा स्थितियों और शब्दों के लिए व्यवस्थित, सरल स्पष्टीकरण।",
      feature3: "भारतीय नवाचार",
      feature3Sub: "विशेष रूप से भारत के लिए हिंदी समर्थन और स्थानीय स्वास्थ्य सुझावों के साथ निर्मित।",
      founder: "अनंत सिंह द्वारा कल्पित और स्थापित।"
    }
  };

  const content = language === 'hi' ? t.hi : t.en;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 sm:pt-32 sm:pb-40 bg-medical-soft/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-7xl font-display font-bold tracking-tight text-medical-navy mb-8 leading-[1.1]">
                {content.hero}
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed px-4">
                {content.sub}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/auth"
                  className="w-full sm:w-auto bg-medical-blue text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center space-x-2 group"
                >
                  <span>{content.cta}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span>Secure & Private</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-medical-blue/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-medical-cyan/10 rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 space-y-4 md:space-y-0 text-center md:text-left">
            <div className="max-w-xl">
              <h2 className="text-sm font-bold text-medical-blue uppercase tracking-[0.2em] mb-4">Precision Intelligence</h2>
              <p className="text-3xl font-display font-semibold text-medical-navy leading-tight">
                Empowering healthcare literacy with global standard AI.
              </p>
            </div>
            <div className="text-sm text-gray-400 font-medium">SCALABLE • SECURE • SMART</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: content.feature1, sub: content.feature1Sub, color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: MessageCircle, title: content.feature2, sub: content.feature2Sub, color: 'text-cyan-600', bg: 'bg-cyan-50' },
              { icon: Globe, title: content.feature3, sub: content.feature3Sub, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-10 rounded-[2.5rem] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-gray-100 transition-all duration-300"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8", f.bg)}>
                  <f.icon className={cn("w-7 h-7", f.color)} />
                </div>
                <h3 className="text-xl font-bold text-medical-navy mb-4">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{f.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-medical-navy text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-widest mb-8">
                <Award className="w-4 h-4 text-medical-cyan" />
                <span>Modern Indian Healthcare Innovation</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-bold mb-8 leading-tight">
                Designed for the next generation of India.
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                INDUS bridges the gap between complex medical science and common health awareness. We provide clear, simple, and trustworthy education in both English and Hindi.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-bold text-medical-cyan mb-2">99%</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">AI ACCURACY</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-medical-cyan mb-2">24/7</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">AVAILABILITY</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-tr from-medical-blue/20 to-medical-cyan/10 rounded-3xl border border-white/5 flex items-center justify-center group overflow-hidden">
                <div className="p-8 glass rounded-2xl max-w-xs transform group-hover:scale-105 transition-transform duration-500">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-medical-blue flex items-center justify-center text-white font-bold">A</div>
                    <div>
                      <div className="text-sm font-bold text-medical-navy">AI Assistant</div>
                      <div className="text-[10px] text-green-500 uppercase font-bold">Online</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-gray-200 rounded"></div>
                    <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <div className="w-6 h-6 rounded-full bg-medical-cyan animate-pulse"></div>
                  </div>
                </div>
                {/* Floating bubbles */}
                <div className="absolute top-10 right-10 w-20 h-20 bg-medical-blue rounded-full blur-[80px] opacity-40"></div>
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-medical-cyan rounded-full blur-[100px] opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-medical-navy mb-4">Anant Singh</h2>
          <p className="text-lg text-gray-500 italic mb-8">
            "Healthcare awareness shouldn't be a privilege. With INDUS, we're making high-quality medical education accessible to every Indian, in their own language."
          </p>
          <div className="text-sm text-medical-blue font-bold uppercase tracking-widest">Founder, INDUS Healthcare</div>
        </div>
      </section>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
