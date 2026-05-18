import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Heart, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user record
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          preferredLanguage: 'en',
          createdAt: new Date().toISOString(),
          isAdmin: user.email === 'anantjeet.bly@gmail.com'
        });
      }
      
      toast.success('Welcome to INDUS!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error('Login failed: ' + error.message);
    } finally {
      setLoading(false);
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
            <p className="text-gray-500 font-medium">Connect securely to start your healthcare journey.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-100 p-4 rounded-2xl hover:bg-gray-50 transition-all font-semibold text-gray-700 disabled:opacity-50"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              <span>{loading ? 'Processing...' : 'Continue with Google'}</span>
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-gray-400 bg-white px-2">
                Trusted in India
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="text-medical-blue font-bold text-lg mb-1">Encrypted</div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Storage</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="text-medical-blue font-bold text-lg mb-1">Anonymous</div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Browsing</div>
              </div>
            </div>
          </div>

          <p className="text-center mt-12 text-xs text-gray-400 font-medium leading-relaxed">
            By continuing, you agree to INDUS Healthcare's <br />
            <span className="text-medical-blue hover:underline cursor-pointer">Terms of Service</span> and <span className="text-medical-blue hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
