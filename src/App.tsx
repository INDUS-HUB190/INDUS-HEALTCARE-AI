/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Toaster } from 'react-hot-toast';

// Pages & Components (to be created)
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import MedicineSearch from './pages/MedicineSearch';
import Comparison from './pages/Comparison';
import Admin from './pages/Admin';
import Auth from './pages/Auth';

// Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  language: 'en',
  setLanguage: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-medical-soft">
        <div className="animate-pulse text-medical-blue font-display text-2xl font-bold">INDUS</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, language, setLanguage }}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
              <Route path="/chat" element={user ? <Chat /> : <Navigate to="/auth" />} />
              <Route path="/search" element={user ? <MedicineSearch /> : <Navigate to="/auth" />} />
              <Route path="/compare" element={user ? <Comparison /> : <Navigate to="/auth" />} />
              <Route path="/admin" element={user?.email === 'anantjeet.bly@gmail.com' ? <Admin /> : <Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="bottom-right" />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

