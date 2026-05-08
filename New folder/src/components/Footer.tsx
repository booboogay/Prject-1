import { Link } from 'react-router-dom';
import { Stethoscope, Mail, Phone, MapPin, Share2, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white py-20 border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Stethoscope className="h-6 w-6" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">ProPets<span className="text-primary">Clinic</span></span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Your pet's health and happiness are our top priorities. Professional veterinary care delivered with love.
            </p>
          </div>

          <div>
            <h3 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Navigation</h3>
            <ul className="space-y-4 text-sm text-slate-500 font-bold">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/shop" className="hover:text-primary transition-colors">Pet Shop</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Support</h3>
            <ul className="space-y-4 text-sm text-slate-500 font-bold">
              <li><Link to="/cart" className="hover:text-primary transition-colors">My Cart</Link></li>
              <li><Link to="/admin/login" className="hover:text-primary transition-colors opacity-40">Admin Access</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Reach Us</h3>
            <div className="space-y-4 text-sm text-slate-500 font-bold">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) PAW-SERVICE</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>care@propets-clinic.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-slate-50 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} ProPets Veterinary Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
