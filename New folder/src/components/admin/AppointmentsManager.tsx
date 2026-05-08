import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X, Trash2, Calendar, Mail, User, Dog, Edit2, RotateCw, Eye } from 'lucide-react';

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [viewingApt, setViewingApt] = useState<any | null>(null);
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status: newStatus });
      toast.success(`Appointment marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleReschedule = async () => {
    if (!reschedulingId || !newDate) return;
    try {
      await updateDoc(doc(db, 'appointments', reschedulingId), { 
        date: newDate,
        status: 'pending' // Reset to pending when rescheduled
      });
      toast.success('Appointment rescheduled successfully');
      setReschedulingId(null);
      setNewDate('');
    } catch (error) {
      toast.error('Failed to reschedule');
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await deleteDoc(doc(db, 'appointments', id));
      toast.success('Appointment deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="py-12 text-center">Loading appointments...</div>;

  return (
    <Card className="rounded-2xl shadow-sm border-slate-100 bg-white overflow-hidden">
      <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-slate-900 font-bold">Appointment Management</CardTitle>
          <p className="text-xs text-slate-400 mt-1">Review and manage clinic bookings</p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none">
                <TableHead className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest h-auto">Pet / Owner</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest h-auto">Service</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest h-auto">Date/Time</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest h-auto">Status</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest h-auto text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <TableRow key={apt.id} className="hover:bg-slate-50/30 transition-colors border-none group">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                          {apt.petName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{apt.petName} <span className="text-[10px] font-normal text-slate-400">({apt.petType})</span></div>
                          <div className="text-[11px] text-slate-400">{apt.ownerName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="outline" className="rounded-md border-slate-200 text-slate-600 bg-slate-50 text-[10px] h-5 font-medium uppercase tracking-tight">
                        {apt.service}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-700">{apt.date ? format(new Date(apt.date), 'MMM d, yyyy') : 'N/A'}</div>
                      <div className="text-[11px] text-slate-400">{apt.date ? format(new Date(apt.date), 'p') : ''}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                        apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                        apt.status === 'pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                        apt.status === 'completed' ? 'bg-sky-100 text-sky-700 hover:bg-sky-100' :
                        'bg-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}>
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog open={!!viewingApt} onOpenChange={(open) => !open && setViewingApt(null)}>
                          <DialogTrigger 
                            nativeButton={true} 
                            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg flex items-center justify-center")}
                            onClick={() => setViewingApt(apt)}
                          >
                            <Eye className="h-4 w-4" />
                          </DialogTrigger>
                          <DialogContent className="rounded-3xl border-none shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-black">Appointment Details</DialogTitle>
                            </DialogHeader>
                            {viewingApt && (
                              <div className="space-y-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-slate-50 p-4 rounded-2xl">
                                    <Label className="text-[10px] font-black uppercase text-slate-400">Pet Name</Label>
                                    <p className="font-bold text-slate-900">{viewingApt.petName}</p>
                                  </div>
                                  <div className="bg-slate-50 p-4 rounded-2xl">
                                    <Label className="text-[10px] font-black uppercase text-slate-400">Pet Type</Label>
                                    <p className="font-bold text-slate-900 capitalize">{viewingApt.petType}</p>
                                  </div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                  <Label className="text-[10px] font-black uppercase text-slate-400">Owner Name</Label>
                                  <p className="font-bold text-slate-900">{viewingApt.ownerName}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                  <Label className="text-[10px] font-black uppercase text-slate-400">Owner Email</Label>
                                  <p className="font-bold text-slate-900">{viewingApt.ownerEmail}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                  <Label className="text-[10px] font-black uppercase text-slate-400">Service</Label>
                                  <p className="font-bold text-primary">{viewingApt.service}</p>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button onClick={() => setViewingApt(null)} className="rounded-xl font-bold bg-slate-900 text-white">Close</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={reschedulingId === apt.id} onOpenChange={(open) => !open && setReschedulingId(null)}>
                          <DialogTrigger 
                            nativeButton={true} 
                            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-primary hover:text-primary hover:bg-primary/5 rounded-lg flex items-center justify-center")}
                            onClick={() => {
                              setReschedulingId(apt.id);
                              setNewDate(apt.date || '');
                            }}
                          >
                            <RotateCw className="h-4 w-4" />
                          </DialogTrigger>
                          <DialogContent className="rounded-3xl border-none shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-black">Reschedule Appointment</DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Date: {apt.date ? format(new Date(apt.date), 'PPpp') : 'N/A'}</Label>
                                <Input 
                                  type="datetime-local" 
                                  value={newDate} 
                                  onChange={(e) => setNewDate(e.target.value)}
                                  className="h-12 rounded-xl bg-slate-50 border-none shadow-inner"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="ghost" onClick={() => setReschedulingId(null)} className="rounded-xl font-bold">Cancel</Button>
                              <Button onClick={handleReschedule} className="rounded-xl font-bold bg-primary text-white">Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {apt.status === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                            onClick={() => updateStatus(apt.id, 'confirmed')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {apt.status === 'confirmed' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-sky-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg"
                            onClick={() => updateStatus(apt.id, 'completed')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-lg"
                          onClick={() => deleteAppointment(apt.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-none">
                  <TableCell colSpan={5} className="px-6 py-16 text-center text-slate-400 italic text-sm italic">
                    No appointments found to display
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
