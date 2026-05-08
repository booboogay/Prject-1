import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Clock, Users, Activity, Scissors, Syringe, ClipboardCheck } from 'lucide-react';

export default function Services() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await addDoc(collection(db, 'appointments'), {
        petName: formData.get('petName'),
        ownerName: formData.get('ownerName'),
        ownerEmail: formData.get('ownerEmail'),
        petType: formData.get('petType'),
        date: formData.get('date'),
        service: formData.get('service'),
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      toast.success('Appointment requested! We will contact you soon.');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    { title: 'General Checkup', icon: Activity, description: 'Comprehensive physical exams for your pets.' },
    { title: 'Vaccinations', icon: Syringe, description: 'Essential immunizations to prevent diseases.' },
    { title: 'Surgery', icon: Heart, description: 'Soft tissue and orthopedic surgical procedures.' },
    { title: 'Dental Care', icon: ShieldCheck, description: 'Professional cleaning and oral health treatments.' },
    { title: 'Grooming', icon: Scissors, description: 'Keep your pets clean, happy, and looking their best.' },
    { title: 'Emergency', icon: Clock, description: '24/7 emergency care for critical pet health issues.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Header Section */}
        <section className="bg-white border-b border-slate-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-primary hover:bg-primary text-white font-bold mb-4 px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">Expertise</Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">Our Medical Services</h1>
              <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-light">
                Professional veterinary care tailored to your pet's unique needs. We combine clinical precision with genuine compassion.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Side-by-Side Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              {/* Left Column: Services List */}
              <div className="flex-1 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="h-full border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white rounded-3xl p-6 group">
                        <div className="mb-4 p-3 bg-slate-50 text-slate-400 rounded-2xl w-fit group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <service.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-slate-900 uppercase tracking-tight">{service.title}</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{service.description}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                {/* Extra Trust Banner */}
                <div className="bg-slate-900 text-white p-8 rounded-[2rem] relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-3 italic">Why Choose Us?</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      Our clinic uses the latest diagnostic tools and we maintain a 1:3 staff-to-patient ratio for intensive care situations.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Vet" />
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-primary">Award-winning team, 2024</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sticky Form */}
              <div className="w-full lg:w-[450px] lg:sticky lg:top-36">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white border-2 border-slate-50 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-10">
                      <div className="mb-8">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Book a Visit</h3>
                        <p className="text-slate-500 text-sm font-medium">Quick scheduling for premium care.</p>
                      </div>
                      
                      <form onSubmit={handleBooking} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="petName" className="text-slate-400 font-bold uppercase text-[9px] tracking-widest ml-1">Pet Name</Label>
                            <Input id="petName" name="petName" placeholder="Buddy" className="rounded-xl h-12 bg-slate-50 border-transparent focus:bg-white" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="petType" className="text-slate-400 font-bold uppercase text-[9px] tracking-widest ml-1">Pet Type</Label>
                            <Select name="petType" required>
                              <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-transparent focus:bg-white">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="dog">Dog</SelectItem>
                                <SelectItem value="cat">Cat</SelectItem>
                                <SelectItem value="bird">Bird</SelectItem>
                                <SelectItem value="rabbit">Rabbit</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="ownerName" className="text-slate-400 font-bold uppercase text-[9px] tracking-widest ml-1">Owner Name</Label>
                          <Input id="ownerName" name="ownerName" placeholder="John Doe" className="rounded-xl h-12 bg-slate-50 border-transparent focus:bg-white" required />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="ownerEmail" className="text-slate-400 font-bold uppercase text-[9px] tracking-widest ml-1">Email Address</Label>
                          <Input id="ownerEmail" name="ownerEmail" type="email" placeholder="john@example.com" className="rounded-xl h-12 bg-slate-50 border-transparent focus:bg-white" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="date" className="text-slate-400 font-bold uppercase text-[9px] tracking-widest ml-1">Desired Date</Label>
                            <Input id="date" name="date" type="datetime-local" className="rounded-xl h-12 bg-slate-50 border-transparent focus:bg-white" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="service" className="text-slate-400 font-bold uppercase text-[9px] tracking-widest ml-1">Service Needed</Label>
                            <Select name="service" required>
                              <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-transparent focus:bg-white">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="checkup">Checkup</SelectItem>
                                <SelectItem value="vaccination">Vaccination</SelectItem>
                                <SelectItem value="surgery">Surgery</SelectItem>
                                <SelectItem value="grooming">Grooming</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" disabled={isSubmitting}>
                          {isSubmitting ? 'Processing...' : 'Confirm Appointment'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
