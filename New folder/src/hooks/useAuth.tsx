import React, { useState, useEffect, createContext, useContext } from 'react';

interface AuthContextType {
  user: { username: string; role: string } | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCredentials: (newUsername: string, newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_AUTH = { username: 'admin', password: 'admin' };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('vet_clinic_admin');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Initialize master credentials if not exist
    if (!localStorage.getItem('vet_clinic_credentials')) {
      localStorage.setItem('vet_clinic_credentials', JSON.stringify(DEFAULT_AUTH));
    }
    
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const creds = JSON.parse(localStorage.getItem('vet_clinic_credentials') || JSON.stringify(DEFAULT_AUTH));
    
    if (username === creds.username && password === creds.password) {
      const userData = { username, role: 'admin' };
      setUser(userData);
      localStorage.setItem('vet_clinic_admin', JSON.stringify(userData));
      return true;
    } else if (username && password) {
      const userData = { username, role: 'user' };
      setUser(userData);
      localStorage.setItem('vet_clinic_admin', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vet_clinic_admin');
  };

  const updateCredentials = (newUsername: string, newPassword: string) => {
    localStorage.setItem('vet_clinic_credentials', JSON.stringify({
      username: newUsername,
      password: newPassword
    }));
    // Sync current session if logged in
    if (user && user.role === 'admin') {
      const updatedUser = { username: newUsername, role: 'admin' };
      setUser(updatedUser);
      localStorage.setItem('vet_clinic_admin', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateCredentials }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
