import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { collection, query, getDocs, limit, orderBy, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Calendar, Users, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    appointmentsCount: 0,
    inventoryCount: 0,
    lowStockCount: 0,
    pendingAppointments: 0,
    ordersCount: 0,
    totalRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    // Real-time listener for appointments
    const unsubAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      const appointments = snapshot.docs.map(doc => doc.data());
      setStats(prev => ({
        ...prev,
        appointmentsCount: snapshot.size,
        pendingAppointments: appointments.filter(a => a.status === 'pending').length
      }));
      
      const recent = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => b.createdAt?.seconds - a.createdAt?.seconds)
        .slice(0, 5);
      setRecentAppointments(recent);
    });

    // Real-time listener for orders
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orders = snapshot.docs.map(doc => doc.data());
      const revenue = orders.reduce((acc, curr: any) => acc + (curr.totalAmount || 0), 0);
      
      setStats(prev => ({
        ...prev,
        ordersCount: snapshot.size,
        totalRevenue: revenue
      }));

      const recentOrdered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => b.createdAt?.seconds - a.createdAt?.seconds)
        .slice(0, 5);
      setRecentOrders(recentOrdered);
    });

    const unsubInventory = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data());
      setStats(prev => ({
        ...prev,
        inventoryCount: snapshot.size,
        lowStockCount: items.filter((i: any) => i.quantity <= 5).length
      }));
    });

    return () => {
      unsubAppointments();
      unsubOrders();
      unsubInventory();
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 rounded-2xl shadow-sm border-slate-100 bg-white">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Appointments Total</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-slate-900">{stats.appointmentsCount}</p>
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-emerald-500 text-[10px] font-bold uppercase tracking-tight">Active Clinical Service</p>
        </Card>

        <Card className="p-6 rounded-2xl shadow-sm border-slate-100 bg-white">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Shop Orders</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-slate-900">{stats.ordersCount}</p>
            <div className="bg-sky-50 text-sky-600 p-2 rounded-lg">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-sky-500 text-[10px] font-bold uppercase tracking-tight">Product Sales Growth</p>
        </Card>

        <Card className="p-6 rounded-2xl shadow-sm border-slate-100 bg-white">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Requests</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-orange-500">{stats.pendingAppointments}</p>
            <div className="bg-orange-50 text-orange-600 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-orange-500 text-[10px] font-bold uppercase tracking-tight">Needs Approval</p>
        </Card>

        <Card className="p-6 rounded-2xl bg-primary shadow-lg shadow-primary/20 text-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Total Revenue</p>
            <TrendingUp className="h-5 w-5 opacity-40" />
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold font-mono tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">PKR {stats.totalRevenue.toLocaleString()}</p>
            <p className="text-[10px] opacity-70 mt-1 uppercase font-bold">Total earnings to date</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-sm border-slate-100 overflow-hidden bg-white">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-slate-900 font-bold">Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                  <tr>
                    <th className="px-6 py-3 text-left">Pet</th>
                    <th className="px-6 py-3 text-left">Service</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/30">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-sm">{app.petName}</p>
                        <p className="text-xs text-slate-400">{app.petType}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        {app.service}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase border-none ${
                          app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                          app.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                          'bg-sky-50 text-sky-600'
                        }`}>
                          {app.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-slate-100 overflow-hidden bg-white">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-slate-900 font-bold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                  <tr>
                    <th className="px-6 py-3 text-left">Customer</th>
                    <th className="px-6 py-3 text-left">Total</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/30">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-sm">{order.customer.fullName}</p>
                        <p className="text-xs text-slate-400">{order.customer.paymentMethod}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-slate-900">
                        PKR {order.totalAmount}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase border-none ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                          order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
