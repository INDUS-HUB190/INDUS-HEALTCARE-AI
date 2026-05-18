import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-display font-bold text-medical-blue mb-4 block">INDUS</span>
            <p className="text-gray-500 max-w-sm mb-4">
              Empowering smarter healthcare awareness in India through premium AI-powered education and medicine information.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span className="capitalize">Founded by Anant Singh</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-medical-navy uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>AI Assistant</li>
              <li>Medicine Lookup</li>
              <li>Symptom Guide</li>
              <li>Comparison Tool</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-medical-navy uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Educational Standards</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Disclaimer</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 space-y-4 md:space-y-0 text-center md:text-left">
          <p>© 2026 INDUS Healthcare. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current" />
            <span>for a healthier India</span>
          </div>
          <div className="p-2 bg-red-50 border border-red-100 rounded-lg max-w-xs text-[10px] leading-tight text-red-600 font-medium">
            IMPORTANT: For educational purposes only. Always consult a qualified healthcare professional.
          </div>
        </div>
      </div>
    </footer>
  );
}
