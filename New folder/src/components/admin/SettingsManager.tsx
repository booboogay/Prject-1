import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { ShieldCheck, User, Lock, Save } from 'lucide-react';

export default function SettingsManager() {
  const { user, updateCredentials } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Username and password are required');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      updateCredentials(username, password);
      toast.success('Admin credentials updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Failed to update credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <Card className="rounded-3xl shadow-sm border-slate-100 bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">Security Settings</CardTitle>
              <CardDescription className="text-slate-500">Manage your administrative access credentials</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Admin Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="pass" className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="pass" 
                      type="password"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm" className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="confirm" 
                      type="password"
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100/50 flex gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs text-sky-800 leading-relaxed font-medium">
                Changing your credentials will update the login requirements for the next session. 
                Keep these credentials secure as they provide full control over clinic data.
              </p>
            </div>
          </CardContent>

          <CardFooter className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-12 px-8 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-bold"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Updating...' : 'Save Credentials'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
