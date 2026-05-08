import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { CreditCard, Truck, CheckCircle2, ChevronLeft, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [formData, setFormData] = useState({
    fullName: '',
    phone1: '',
    phone2: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Validation
    if (!formData.phone1 || isNaN(Number(formData.phone1))) {
      toast.error('Invalid phone number', { description: 'Phone Number 1 must be numeric.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        customer: {
          ...formData,
          paymentMethod
        },
        items: cart,
        totalAmount: totalPrice,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      toast.success('Order placed successfully!', {
        description: 'Thank you for choosing our professional medical clinic.'
      });
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Your cart is empty</h2>
            <Button onClick={() => navigate('/shop')} className="rounded-xl px-10 h-14 font-black">Go to Shop</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-12">
          <button 
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-black text-xs uppercase tracking-widest mb-10 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-12">
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-2">Secure Checkout</h1>
                <p className="text-slate-500 font-bold">Please provide your shipping and contact details below.</p>
              </div>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-12 bg-white p-10 rounded-[3rem] shadow-sm">
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <CheckCircle2 size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Personal Details</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Identity Name</Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        placeholder="e.g. Mohammad Ali" 
                        required 
                        value={formData.fullName} 
                        onChange={handleChange}
                        className="h-14 rounded-2xl border-none shadow-inner bg-slate-50 focus:bg-white transition-all text-lg font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone1" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number (Required)</Label>
                        <Input 
                          id="phone1" 
                          name="phone1" 
                          placeholder="03XX XXXXXXX" 
                          required 
                          type="tel"
                          value={formData.phone1} 
                          onChange={handleChange}
                          className="h-14 rounded-2xl border-none shadow-inner bg-slate-50 focus:bg-white transition-all text-lg font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone2" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Alternate Contact</Label>
                        <Input 
                          id="phone2" 
                          name="phone2" 
                          type="tel"
                          placeholder="03XX XXXXXXX" 
                          value={formData.phone2} 
                          onChange={handleChange}
                          className="h-14 rounded-2xl border-none shadow-inner bg-slate-50 focus:bg-white transition-all text-lg font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Truck size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Delivery Hub</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Shipping Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      placeholder="House #, Street Name, City, Pakistan" 
                      required 
                      value={formData.address} 
                      onChange={handleChange}
                      className="h-14 rounded-2xl border-none shadow-inner bg-slate-50 focus:bg-white transition-all text-lg font-bold"
                    />
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <CreditCard size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Transaction Method</h3>
                  </div>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`relative flex items-center p-6 rounded-3xl cursor-pointer transition-all border-2 ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                      <RadioGroupItem value="cod" id="cod" className="sr-only" />
                      <Label htmlFor="cod" className="flex flex-col gap-1 cursor-pointer w-full">
                        <span className="font-black text-slate-900 text-lg">Cash On Delivery</span>
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest">Post-Delivery Payment</span>
                      </Label>
                    </div>
                    <div className={`relative flex items-center p-6 rounded-3xl cursor-pointer transition-all border-2 ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-slate-200 opacity-60 cursor-not-allowed'}`}>
                      <RadioGroupItem value="online" id="online" disabled className="sr-only" />
                      <Label htmlFor="online" className="flex flex-col gap-1 cursor-pointer w-full">
                        <span className="font-black text-slate-900 text-lg flex items-center gap-2">Online Banking <ShieldAlert size={14} className="text-amber-500" /></span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Temporarily Offline</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </section>
              </form>
            </motion.div>

            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="lg:sticky lg:top-36 space-y-6">
                {/* Premium Payment Card */}
                <Card className="border-2 border-primary/10 shadow-2xl rounded-[3.5rem] bg-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                  <CardContent className="p-12 relative z-10">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Order Summary</h3>
                      <ShieldCheck className="text-primary" size={24} />
                    </div>
                    
                    <div className="space-y-8 mb-12 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden shrink-0 shadow-sm border border-slate-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="font-black text-slate-900 text-sm line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-black text-slate-900 text-sm">PKR {item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 mb-12 pt-8 border-t border-slate-100">
                      <div className="flex justify-between text-slate-400 font-black uppercase text-[10px] tracking-widest">
                        <span>Net Value</span>
                        <span className="text-slate-900">PKR {totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 font-black uppercase text-[10px] tracking-widest">
                        <span>Medical Handling</span>
                        <span className="text-emerald-500">Free</span>
                      </div>
                      <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                        <span className="text-xl font-black text-slate-900 tracking-tight">Total Amount</span>
                        <div className="text-right">
                          <p className="text-4xl font-black text-primary tracking-tighter">PKR {totalPrice}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Includes all taxes</p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      form="checkout-form"
                      className="w-full h-20 rounded-[2rem] bg-slate-900 hover:bg-primary text-white font-black text-xl transition-all shadow-xl disabled:opacity-50 group hover:scale-[1.02] active:scale-95"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                           <Loader2 size={24} className="animate-spin" />
                           <span className="uppercase tracking-widest text-sm">Processing...</span>
                        </div>
                      ) : (
                        <span className="flex items-center gap-2">
                           PLACE ORDER <CheckCircle2 className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                    
                    <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Safe & Secure Medical Checkout</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Guarantee Card */}
                <div className="p-8 rounded-[2.5rem] bg-indigo-50/30 border border-indigo-100">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Our Promise</p>
                  <p className="text-xs text-indigo-600 font-bold leading-relaxed">Every item is double-checked by our veterinary staff before dispatch. Quality and hygiene is our priority.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
