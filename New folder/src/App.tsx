/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Home from './pages/Home';
import Services from './pages/Services';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { useAuth } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster 
            position="bottom-right" 
            richColors 
            toastOptions={{
              className: 'rounded-2xl border-l-4 border-[#007BFF] shadow-2xl font-black bg-white text-slate-900',
            }}
          />
        </div>
      </Router>
    </CartProvider>
  );
}
