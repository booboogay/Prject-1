import { Link, useNavigate } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { Stethoscope, Menu, Phone, User, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Shop', href: '/shop' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md border-slate-100">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Stethoscope className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ProPets<span className="text-primary italic">Clinic</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-sm font-bold text-slate-500 transition-colors hover:text-primary uppercase tracking-wider"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <Link to="/cart" className="text-slate-500 hover:text-primary transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {itemCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to={user.role === 'admin' ? '/admin' : '/'} className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-xl">
                <User className="w-4 h-4" />
                {user.username}
              </Link>
              <Button variant="ghost" className="text-slate-400 hover:text-destructive" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <Button nativeButton={true} onClick={() => navigate('/login')} className="rounded-xl px-6 font-bold shadow-lg shadow-primary/10">
              Sign In / Sign Up
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger 
              nativeButton={true} 
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-xl")}
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-2xl font-bold text-slate-900"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-4 pt-6 border-t border-slate-100">
                  {user ? (
                    <>
                      <div className="text-slate-500 font-bold mb-2">Logged in as: {user.username}</div>
                      <Button className="justify-start gap-2 h-12" onClick={() => { setIsOpen(false); navigate(user.role === 'admin' ? '/admin' : '/'); }}>
                        Dashboard
                      </Button>
                      <Button variant="outline" className="justify-start gap-2 h-12 text-destructive" onClick={() => { setIsOpen(false); logout(); }}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => { setIsOpen(false); navigate('/login'); }} className="h-14 text-lg font-bold rounded-2xl">
                      Sign In / Sign Up
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
