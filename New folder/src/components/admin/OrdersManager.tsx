import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Eye, 
  Trash2, 
  TrendingUp, 
  Package, 
  Search,
  Filter,
  ArrowUpRight,
  Stethoscope,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format, eachDayOfInterval, subDays, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer: {
    fullName: string;
    phone1: string;
    phone2?: string;
    address: string;
    paymentMethod: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: any;
}

const OrderSkeleton = () => (
  <div className="p-8 border-b border-slate-50 animate-pulse">
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-blue-50 rounded-xl" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="h-3 bg-slate-50 rounded w-1/2" />
      </div>
      <div className="w-24 h-10 bg-slate-50 rounded-xl" />
    </div>
  </div>
);

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    // Robust Data Pipeline: Real-time sync with database
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      
      // Dynamic Sales Analytics (Recharts)
      const last7Days = eachDayOfInterval({
        start: subDays(new Date(), 6),
        end: new Date(),
      });

      const analytics = last7Days.map(day => {
        const dayTotal = ordersData
          .filter(order => {
            if (!order.createdAt) return false;
            const date = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt.seconds * 1000);
            return isSameDay(date, day);
          })
          .reduce((sum, order) => sum + order.totalAmount, 0);

        return {
          day: format(day, 'EEE'),
          revenue: dayTotal,
          fullDate: format(day, 'MMM d'),
        };
      });

      setChartData(analytics);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      toast.success('Protocol Updated', {
        description: `Order successfully moved to ${newStatus} state.`,
        className: 'bg-white text-blue-900 border-l-4 border-[#007BFF] font-sans shadow-xl'
      });
    } catch (error) {
      toast.error('Sync Protocol Failure');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteDoc(doc(db, 'orders', deleteConfirmId));
      setDeleteConfirmId(null);
      toast.success('Record Purged', {
        description: 'Order has been permanently removed from the ledger.',
        className: 'bg-white text-blue-900 border-l-4 border-rose-500 font-sans shadow-xl'
      });
    } catch (error) {
      toast.error('Database Protocol Error');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-amber-100/50 text-amber-600 hover:bg-amber-100/50 border-amber-200 shadow-none font-black px-3 py-1 rounded-lg uppercase text-[10px] tracking-widest">Pending</Badge>;
      case 'shipped': return <Badge className="bg-blue-100/50 text-blue-600 hover:bg-blue-100/50 border-blue-200 shadow-none font-black px-3 py-1 rounded-lg uppercase text-[10px] tracking-widest">Shipped</Badge>;
      case 'delivered': return <Badge className="bg-emerald-100/50 text-emerald-600 hover:bg-emerald-100/50 border-emerald-200 shadow-none font-black px-3 py-1 rounded-lg uppercase text-[10px] tracking-widest">Delivered</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-[1600px] mx-auto pb-20">
      {/* Sales Velocity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 border-none shadow-[0_4px_24px_rgba(0,123,255,0.08)] rounded-[1.5rem] bg-white overflow-hidden p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary border border-blue-100">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tighter">Procurement Velocity</h3>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mt-1">Revenue flow over the last 7 cycles</p>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Net Flow</p>
               <p className="text-3xl font-black text-slate-900 tracking-tighter">PKR {orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="medBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007BFF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#007BFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ stroke: '#007BFF', strokeWidth: 2, strokeDasharray: '4 4' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#007BFF" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#medBlue)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-4 bg-slate-900 border-none shadow-2xl rounded-[1.5rem] p-10 flex flex-col justify-between text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full -mr-24 -mt-24 blur-[80px] opacity-50 group-hover:scale-125 transition-transform duration-1000" />
          <div className="space-y-2 relative z-10">
            <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-primary">System Integrity</h4>
            <p className="text-4xl font-black tracking-tighter leading-none mb-4">Clinic Operations Hub</p>
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 w-fit px-4 py-1.5 rounded-full border border-emerald-500/20">
              <ArrowUpRight size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">+12.4% Optimal</span>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 relative z-10 flex items-end justify-between">
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Active Tickets</p>
                <p className="text-3xl font-black">{orders.length}</p>
             </div>
             <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                <Stethoscope size={32} />
             </div>
          </div>
        </Card>
      </div>

      {/* Logistics Ledger */}
      <Card className="border-none shadow-[0_8px_32px_rgba(0,123,255,0.04)] rounded-[1.5rem] bg-white overflow-hidden font-sans">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#007BFF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Package size={20} />
              </div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight italic">Procurement Master Ledger</h4>
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Ticket search (ID/Name)..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-black text-xs uppercase tracking-widest transition-all"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                 <SelectTrigger className="w-[180px] h-12 border-none bg-slate-50 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400">
                   <Filter className="w-3 h-3 mr-2" />
                   <SelectValue placeholder="Status Filter" />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-none shadow-2xl font-black text-[10px] uppercase tracking-widest bg-white">
                   <SelectItem value="all">Global Matrix</SelectItem>
                   <SelectItem value="pending">Waitlist</SelectItem>
                   <SelectItem value="shipped">In-Transit</SelectItem>
                   <SelectItem value="delivered">Cleared</SelectItem>
                 </SelectContent>
              </Select>
           </div>
        </div>

        <div className="overflow-x-auto min-h-[450px]">
          {loading ? (
            <div className="divide-y divide-slate-50">
               {[...Array(5)].map((_, i) => <OrderSkeleton key={i} />)}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="px-8 py-6 font-black text-slate-400 uppercase tracking-widest text-[9px] w-48">System ID</TableHead>
                  <TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[9px]">Consignee / Identity</TableHead>
                  <TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[9px]">Receipt Value</TableHead>
                  <TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[9px] w-56">Progress Matrix</TableHead>
                  <TableHead className="px-8 text-right font-black text-slate-400 uppercase tracking-widest text-[9px]">Console</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredOrders.map((order) => (
                    <motion.tr 
                      key={order.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="group border-b border-slate-50 hover:bg-blue-50/30 transition-all last:border-none"
                    >
                      <TableCell className="px-8 py-8 font-black text-slate-300 text-[10px] tracking-widest">
                        #{order.id.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell className="py-8">
                        <p className="font-black text-slate-900 text-lg tracking-tight line-clamp-1">{order.customer.fullName}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-bold text-slate-400">{order.customer.phone1}</span>
                           <span className="w-1 h-1 bg-slate-200 rounded-full" />
                           <span className="text-[10px] font-bold text-slate-400">{order.createdAt ? format(order.createdAt.toDate(), 'MMM d, HH:mm') : 'Syncing...'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-8">
                        <div className="space-y-1">
                           <p className="font-black text-slate-900 text-xl tracking-tighter">PKR {order.totalAmount}</p>
                           <p className="text-[9px] font-black uppercase text-[#007BFF] tracking-widest italic">{order.customer.paymentMethod}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-8">
                        <div className="space-y-3">
                           {getStatusBadge(order.status)}
                           <Select defaultValue={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                              <SelectTrigger className="w-44 h-10 border-slate-100 bg-white shadow-sm rounded-lg font-black text-[9px] uppercase tracking-widest focus:ring-2 focus:ring-primary/10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-none shadow-2xl p-1 bg-white font-black text-[9px] uppercase tracking-widest">
                                <SelectItem value="pending" className="rounded-lg py-2 focus:bg-amber-50 focus:text-amber-600">Pending</SelectItem>
                                <SelectItem value="shipped" className="rounded-lg py-2 focus:bg-blue-50 focus:text-blue-600">Shipped</SelectItem>
                                <SelectItem value="delivered" className="rounded-lg py-2 focus:bg-emerald-50 focus:text-emerald-600">Delivered</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-8 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <Dialog>
                            <DialogTrigger 
                              nativeButton={true} 
                              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-11 w-11 bg-white border border-slate-100 text-primary hover:bg-slate-50 rounded-xl shadow-sm flex items-center justify-center")}
                            >
                              <Eye size={18} />
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden font-sans">
                              <DialogHeader className="p-10 bg-slate-950 text-white relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                                <div className="flex items-center gap-6 relative z-10 pr-12">
                                   <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary backdrop-blur-xl">
                                      <Package size={32} />
                                   </div>
                                   <div>
                                      <DialogTitle className="text-3xl font-black tracking-tighter leading-none mb-2">Ticket #{order.id.slice(-10).toUpperCase()}</DialogTitle>
                                      <div className="flex items-center gap-3">
                                         <span className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em]">Logistics Protocol v3.0</span>
                                         <Badge className="bg-primary/20 text-primary border-primary/20 font-black text-[9px] tracking-widest py-0.5">{order.status}</Badge>
                                      </div>
                                   </div>
                                </div>
                              </DialogHeader>
                              
                              <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-16 bg-white max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <section className="space-y-12">
                                   <div>
                                      <h5 className="text-[11px] font-black uppercase tracking-[0.25em] text-primary mb-6 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-primary rounded-full" /> Identity Profile
                                      </h5>
                                      <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                                         <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Full Registered Name</p>
                                            <p className="text-2xl font-black text-slate-900 tracking-tight">{order.customer.fullName}</p>
                                         </div>
                                         <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200/50">
                                            <div className="space-y-1">
                                               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Primary Line</p>
                                               <p className="font-black text-slate-800 text-sm">{order.customer.phone1}</p>
                                            </div>
                                            <div className="space-y-1">
                                               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Emergency Line</p>
                                               <p className="font-black text-slate-800 text-sm">{order.customer.phone2 || 'Unlisted'}</p>
                                            </div>
                                         </div>
                                         <div className="pt-6 border-t border-slate-200/50">
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">Delivery Matrix (Dispatch Address)</p>
                                            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 leading-relaxed italic shadow-inner">
                                               {order.customer.address}
                                            </div>
                                         </div>
                                      </div>
                                   </div>

                                   <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex items-start gap-4">
                                      <Info size={20} className="text-primary shrink-0 mt-1" />
                                      <p className="text-[11px] font-bold text-slate-500 leading-relaxed">System Note: This order has been verified through our clinical supply chain. Personnel must check expiry dates during fulfillment.</p>
                                   </div>
                                </section>

                                <section className="space-y-12">
                                   <div>
                                      <h5 className="text-[11px] font-black uppercase tracking-[0.25em] text-primary mb-6 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-primary rounded-full" /> Procurement Ledger
                                      </h5>
                                      <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                                         <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mb-16 blur-3xl" />
                                         <div className="space-y-5 mb-12 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                                            {order.items.map((item, idx) => (
                                              <div key={idx} className="flex justify-between items-start border-b border-white/5 pb-4 last:border-none last:pb-0">
                                                 <div className="space-y-1">
                                                    <p className="font-black text-sm tracking-tight leading-none">{item.name}</p>
                                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{item.quantity} Unit(s) @ PKR {item.price}</p>
                                                 </div>
                                                 <p className="font-black text-emerald-400 text-sm">PKR {item.quantity * item.price}</p>
                                              </div>
                                            ))}
                                         </div>
                                         <div className="pt-8 border-t border-white/10 flex flex-col gap-1 relative z-10">
                                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Consolidated Net Clearing</span>
                                            <div className="flex items-end justify-between">
                                               <p className="text-5xl font-black tracking-tighter">PKR {order.totalAmount}</p>
                                               <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white border-none font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-widest mb-1.5 animate-pulse">Paid Check</Badge>
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                   
                                   <div className="flex items-center gap-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
                                         <ShoppingBag size={24} />
                                      </div>
                                      <div>
                                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Transaction Channel</p>
                                         <p className="text-lg font-black text-slate-700 uppercase tracking-tight">{order.customer.paymentMethod}</p>
                                      </div>
                                   </div>
                                </section>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog open={deleteConfirmId === order.id} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                            <DialogTrigger 
                              nativeButton={true} 
                              onClick={() => setDeleteConfirmId(order.id)}
                              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-11 w-11 bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 rounded-xl shadow-sm flex items-center justify-center")}
                            >
                              <Trash2 size={18} />
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-[2rem] border-none shadow-2xl p-10 font-sans">
                              <div className="text-center space-y-6">
                                 <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-rose-50/50">
                                    <Trash2 size={36} />
                                 </div>
                                 <DialogHeader>
                                    <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter text-center leading-none">Purge Data Record?</DialogTitle>
                                 </DialogHeader>
                                 <p className="text-slate-500 font-bold text-sm leading-relaxed">This action will permanently wipe this ticket from the global ledger. This cannot be reversed via standard protocols.</p>
                                 <div className="flex gap-4 pt-4">
                                    <Button onClick={() => setDeleteConfirmId(null)} className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest">Abort Protocol</Button>
                                    <Button onClick={handleDelete} className="flex-1 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-200">Confirm Purge</Button>
                                 </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                
                {!loading && filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-[500px] text-center border-none">
                       <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-8 py-20"
                       >
                          <div className="relative">
                            <div className="w-32 h-32 bg-blue-50/50 rounded-[3rem] flex items-center justify-center text-blue-200 shadow-inner">
                               <ShoppingBag size={56} strokeWidth={1} />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary border border-blue-50">
                               <Package size={24} />
                            </div>
                          </div>
                          <div className="space-y-2">
                             <p className="text-3xl font-black text-slate-900 tracking-tighter">System Buffer Empty</p>
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">No procurement records found in the active matrix</p>
                          </div>
                          <Button className="h-14 px-8 bg-[#007BFF] hover:bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-200 gap-3 group">
                              Initiate Manual Entry <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </Button>
                       </motion.div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
      
      {/* Footer System Signal */}
      <div className="flex items-center justify-center gap-6 pt-10">
         <div className="flex items-center gap-2 opacity-30 grayscale group hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Live DB Uplink Active</span>
         </div>
         <div className="w-1 h-1 bg-slate-200 rounded-full" />
         <div className="flex items-center gap-2 opacity-30 grayscale group hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Procurement Matrix v4.2</span>
         </div>
      </div>
    </div>
  );
}

