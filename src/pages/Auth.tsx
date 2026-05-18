import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Heart, Shield, Mail, Key, Globe, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await syncUser(user);
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/unauthorized-domain') {
        toast.error('Domain not authorized in Firebase Console.');
      } else {
        toast.error('Google Login failed: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await syncUser(result.user);
      navigate('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        // Try to sign up if user doesn't exist (Simplified for Demo)
        try {
          const result = await createUserWithEmailAndPassword(auth, email, password);
          await syncUser(result.user);
          toast.success('Account created!');
          navigate('/dashboard');
          return;
        } catch (signupErr: any) {
          toast.error(signupErr.message);
        }
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const syncUser = async (user: any) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        photoURL: user.photoURL || '',
        preferredLanguage: 'en',
        createdAt: new Date().toISOString(),
        isAdmin: user.email === 'anantjeet.bly@gmail.com'
      });
    }
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
            <h1 className="text-3xl font-display font-bold text-medical-navy mb-2">Initialize INDUS</h1>
            <p className="text-gray-500 font-medium tracking-tight">Access India's Premium Healthcare AI</p>
          </div>

          <div className="space-y-4">
            {!showEmailForm ? (
              <>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-100 p-4 rounded-2xl hover:bg-gray-50 transition-all font-semibold text-gray-700 disabled:opacity-50"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                  <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
                </button>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-300 bg-white px-2">OR</div>
                </div>
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full flex items-center justify-center space-x-3 bg-gray-50 border-2 border-transparent p-4 rounded-2xl hover:bg-gray-100 transition-all font-semibold text-gray-500"
                >
                  <Mail className="w-5 h-5" />
                  <span>Use Email / Password</span>
                </button>
              </>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-2 tracking-widest">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-medical-blue outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-2 tracking-widest">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-medical-blue outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-medical-blue text-white p-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Login / Register'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="w-full text-center text-xs font-bold text-gray-400 uppercase hover:text-medical-blue transition-colors"
                >
                  Back to Social Login
                </button>
              </form>
            )}

            {/* Support/Instructions section */}
            <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
               <div className="flex items-start space-x-3">
                 <AlertCircle className="w-5 h-5 text-medical-blue shrink-0 mt-0.5" />
                 <div>
                   <p className="text-[10px] font-bold text-medical-blue mb-1 uppercase tracking-widest">Note for Founder</p>
                   <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                     Google Login requires domain authorization. If stuck, use <b>Email Login</b> or visit your <a href="https://console.firebase.google.com/u/0/project/confident-life-05xj8/authentication/providers" target="_blank" className="underline font-bold text-medical-blue">Firebase Console</a>.
                   </p>
                 </div>
               </div>
            </div>
          </div>

          <p className="text-center mt-12 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
            SECURE ACCESS • PROJECT ID: <br />
            <span className="text-medical-navy">confident-life-05xj8</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
