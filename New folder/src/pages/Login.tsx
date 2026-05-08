import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, updateCredentials } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      toast.success('Logged in successfully');
      
      // Get current credentials for admin check
      const savedCreds = localStorage.getItem('vet_clinic_credentials');
      const adminCreds = savedCreds ? JSON.parse(savedCreds) : { username: 'admin', password: 'admin' };
      
      if (username === adminCreds.username && password === adminCreds.password) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-primary">
            <Stethoscope size={40} className="stroke-[1.5]" />
            <span className="text-3xl font-serif font-bold italic tracking-tighter">Pro Pets Clinic</span>
          </div>
        </div>

        <Card className="rounded-3xl shadow-2xl border-none overflow-hidden">
          <CardHeader className="space-y-1 bg-slate-900 text-white p-8">
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400">
              Sign in to manage your pet's health records
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-6 p-8">
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-xs font-bold uppercase text-slate-500 tracking-widest ml-1">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 rounded-xl bg-slate-50 border-slate-100"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase text-slate-500 tracking-widest ml-1">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-slate-50 border-slate-100"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0 flex flex-col gap-4">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Sign In
              </Button>
              <div className="text-center">
                <span className="text-sm text-slate-400">Don't have an account? </span>
                <button type="button" className="text-sm font-bold text-primary hover:underline">Sign Up</button>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <p className="mt-8 text-center text-xs text-slate-400 font-medium uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Pro Pets Vet Clinic &middot; Secure Access
        </p>
      </motion.div>
    </div>
  );
}
