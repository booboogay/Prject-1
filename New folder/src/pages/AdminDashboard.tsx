import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Calendar, ClipboardList, LogOut, Stethoscope, ChevronRight, Settings, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import DashboardOverview from '@/components/admin/DashboardOverview';
import AppointmentsManager from '@/components/admin/AppointmentsManager';
import InventoryManager from '@/components/admin/InventoryManager';
import OrdersManager from '@/components/admin/OrdersManager';
import SettingsManager from '@/components/admin/SettingsManager';

import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <Link to="/" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Stethoscope className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            ProPets<span className="text-primary">Clinic</span>
          </span>
        </Link>
        
        <nav className="flex-1 px-4 mt-6 space-y-1">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 h-12 rounded-lg transition-all ${
              activeTab === 'overview' 
                ? 'bg-sky-50 text-primary font-bold shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 h-12 rounded-lg transition-all ${
              activeTab === 'appointments' 
                ? 'bg-sky-50 text-primary font-bold shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar className="h-4 w-4" />
            Appointments
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 h-12 rounded-lg transition-all ${
              activeTab === 'orders' 
                ? 'bg-sky-50 text-sky-600 font-bold shadow-sm border-r-2 border-sky-500' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag className="h-4 w-4" />
            Orders
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 h-12 rounded-lg transition-all ${
              activeTab === 'inventory' 
                ? 'bg-sky-50 text-primary font-bold shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab('inventory')}
          >
            <ClipboardList className="h-4 w-4" />
            Inventory
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 h-12 rounded-lg transition-all ${
              activeTab === 'settings' 
                ? 'bg-sky-50 text-primary font-bold shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4">
            <div className="h-10 w-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
              {user?.username[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-slate-900">{user?.username || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">Clinic Manager</p>
            </div>
          </div>
          <Button variant="outline" className="w-full gap-2 border-slate-200 text-slate-600 hover:text-destructive hover:bg-destructive/5 rounded-xl h-11" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-20">
          <h2 className="text-xl font-bold text-slate-900 capitalize flex-grow">
            {activeTab} Overview
          </h2>
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
               <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
               />
               <LayoutDashboard className="w-4 h-4 text-slate-400 absolute left-4 top-2.5" />
             </div>
          </div>
        </header>

        <div className="p-8 overflow-y-auto flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <DashboardOverview />}
            {activeTab === 'appointments' && <AppointmentsManager />}
            {activeTab === 'orders' && <OrdersManager />}
            {activeTab === 'inventory' && <InventoryManager />}
            {activeTab === 'settings' && <SettingsManager />}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
