import { motion } from 'motion/react';
import { useAuth } from '../App';
import { Search, MessageSquare, Bookmark, BarChart, Activity, Clock, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, language } = useAuth();

  const labels = {
    en: {
      welcome: `Welcome, ${user?.displayName?.split(' ')[0]}`,
      subtitle: "Your personal health awareness command center.",
      recentActivity: "Recent Activity",
      quickActions: "Quick Actions",
      aiChat: "AI Assistant",
      medSearch: "Medicine Search",
      comparison: "Compare Meds",
      bookmarks: "Saved Items"
    },
    hi: {
      welcome: `नमस्ते, ${user?.displayName?.split(' ')[0]}`,
      subtitle: "आपका व्यक्तिगत स्वास्थ्य जागरूकता कमांड सेंटर।",
      recentActivity: "हाल की गतिविधि",
      quickActions: "त्वरित कार्रवाई",
      aiChat: "एआई सहायक",
      medSearch: "दवा की खोज",
      comparison: "दवाओं की तुलना",
      bookmarks: "सहेजी गई वस्तुएं"
    }
  };

  const t = language === 'hi' ? labels.hi : labels.en;

  return (
    <div className="bg-medical-soft/20 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-display font-bold text-medical-navy mb-2">{t.welcome}</h1>
            <p className="text-gray-500 font-medium">{t.subtitle}</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: t.aiChat, sub: "Chat with INDUS AI", icon: MessageSquare, path: "/chat", color: "bg-blue-600", shadow: "shadow-blue-200" },
                { title: t.medSearch, sub: "Search medicines", icon: Search, path: "/search", color: "bg-cyan-600", shadow: "shadow-cyan-200" },
                { title: t.comparison, sub: "Compare side by side", icon: Activity, path: "/compare", color: "bg-indigo-600", shadow: "shadow-indigo-200" },
                { title: t.bookmarks, sub: "View your library", icon: Bookmark, path: "/dashboard", color: "bg-emerald-600", shadow: "shadow-emerald-200" },
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.path}
                  className="group bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all flex items-start space-x-4"
                >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg", action.color, action.shadow)}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-medical-navy group-hover:text-medical-blue transition-colors">{action.title}</h3>
                    <p className="text-sm text-gray-400 font-medium">{action.sub}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-medical-blue transition-all" />
                </Link>
              ))}
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-medical-navy flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-medical-blue" />
                  <span>{t.recentActivity}</span>
                </h2>
                <button className="text-xs font-bold text-medical-blue uppercase tracking-widest hover:underline">View All</button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-medical-navy">Searched "Paracetamol"</p>
                    <p className="text-xs text-gray-400 font-medium tracking-tight">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-medical-navy">Explained "Type 2 Diabetes"</p>
                    <p className="text-xs text-gray-400 font-medium tracking-tight">Yesterday • 4:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-medical-navy">Compared "Amoxicillin vs Penicillin"</p>
                    <p className="text-xs text-gray-400 font-medium tracking-tight">Yesterday • 11:20 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-medical-navy text-white p-8 rounded-[2rem] relative overflow-hidden group">
              <Zap className="absolute -right-4 -top-4 w-24 h-24 text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4">Wellness Tip</h3>
                <p className="text-medical-cyan/80 text-sm leading-relaxed mb-6 font-medium">
                  {language === 'hi' 
                    ? "क्या आप जानते हैं? पर्याप्त पानी पीना आपके शरीर को दवाओं को बेहतर तरीके से अवशोषित करने में मदद करता है।"
                    : "Did you know? Drinking enough water helps your body absorb medicines more effectively."}
                </p>
                <div className="text-[10px] uppercase font-bold tracking-widest text-white/50">Updated Daily</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100">
              <h3 className="font-bold text-medical-navy mb-6 uppercase tracking-widest text-xs">Community Impact</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-gray-500">Users Helped</span>
                    <span className="text-medical-blue">14,203+</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-medical-blue h-full w-[85%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-gray-500">Meds Cataloged</span>
                    <span className="text-medical-cyan">2,400+</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-medical-cyan h-full w-[60%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
