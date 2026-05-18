import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { auth } from '../../lib/firebase';
import { LogOut, User as UserIcon, MessageSquare, Search, Languages, Menu, X, BarChart2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const { user, language, setLanguage } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const navLinks = user ? [
    { name: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard', path: '/dashboard', icon: UserIcon },
    { name: language === 'hi' ? 'एआई सहायक' : 'AI Assistant', path: '/chat', icon: MessageSquare },
    { name: language === 'hi' ? 'दवा खोज' : 'Medicine Search', path: '/search', icon: Search },
    { name: language === 'hi' ? 'तुलना करें' : 'Compare', path: '/compare', icon: Search },
  ] : [];

  if (user?.email === 'anantjeet.bly@gmail.com') {
    navLinks.push({ name: language === 'hi' ? 'एडमिन' : 'Admin', path: '/admin', icon: BarChart2 });
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-display font-bold text-medical-blue transition-colors group-hover:text-medical-navy">INDUS</span>
            <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-medical-soft text-medical-blue uppercase tracking-wider">AI Healthcare</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-gray-600 hover:text-medical-blue transition-colors flex items-center space-x-1"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}

            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 text-sm font-medium text-medical-blue px-3 py-1 rounded-full border border-medical-blue/20 hover:bg-medical-soft transition-all"
            >
              <Languages className="w-4 h-4" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link
                to="/auth"
                className="bg-medical-blue text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-medical-blue"
            >
              <Languages className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 focus:outline-none"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {user ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="block text-base font-medium text-gray-600 hover:text-medical-blue py-2 flex items-center space-x-3"
                    >
                      <link.icon className="w-5 h-5" />
                      <span>{link.name}</span>
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-base font-medium text-red-500 py-2 flex items-center space-x-3"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-medical-blue text-white text-center py-3 rounded-xl font-medium"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
