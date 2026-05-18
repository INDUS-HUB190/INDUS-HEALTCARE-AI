import { useState } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network latency
    setTimeout(() => {
      const userData = {
        uid: Math.random().toString(36).substr(2, 9),
        email: email,
        displayName: email.split('@')[0],
        isAdmin: email === 'anantjeet.bly@gmail.com'
      };

      login(userData);
      toast.success(mode === 'login' ? 'Welcome back to INDUS!' : 'Account created successfully!');
      navigate('/dashboard');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-medical-soft/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-medical-blue rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
              <Shield className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-display font-bold text-medical-navy mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-500 font-medium tracking-tight">Access INDUS Healthcare AI</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-2 tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl focus:border-medical-blue outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-2 tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl focus:border-medical-blue outline-none transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-medical-blue text-white p-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  <span>{mode === 'login' ? 'Secure Login' : 'Start Education'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="w-full text-center text-xs font-bold text-gray-400 uppercase hover:text-medical-blue transition-colors py-2"
            >
              {mode === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </form>

          <div className="mt-8 p-4 bg-medical-soft/50 rounded-2xl border border-blue-50/50">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 text-medical-blue shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                INDUS provides educational health insights. No medical data is stored on external servers in this mode.
              </p>
            </div>
          </div>

          <p className="text-center mt-12 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            TRUSTED INDIAN INNOVATION
          </p>
        </div>
      </motion.div>
    </div>
  );
}
