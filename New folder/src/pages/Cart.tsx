import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Your Shopping Cart</h1>
              <p className="text-slate-500">You have {itemCount} items in your pawsome collection.</p>
            </div>
            <Button 
                variant="outline" 
                onClick={() => navigate('/shop')}
                className="rounded-xl font-bold border-slate-200"
            >
                Back to Shop
            </Button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-sm">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <ShoppingBag size={48} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
              <p className="text-slate-500 mb-8">Looks like you haven't added anything yet.</p>
              <Button 
                onClick={() => navigate('/shop')}
                className="h-14 px-10 rounded-2xl bg-primary font-bold text-lg"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <h3 className="font-black text-slate-900 truncate tracking-tight text-lg">{item.name}</h3>
                          <p className="text-primary font-black text-base uppercase tracking-tighter">PKR {item.price}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100 shadow-inner">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-400 hover:text-primary"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-black text-slate-900 w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-400 hover:text-primary"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="font-black text-slate-900 text-lg sm:text-2xl w-32 text-right tracking-tighter">
                          PKR {item.price * item.quantity}
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-slate-300 hover:text-destructive transition-colors ml-2"
                        >
                          <Trash2 size={20} />
                        </button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-6">
                <Card className="border border-[#E0E0E0] shadow-[0_8px_30px_rgb(0,123,255,0.1)] rounded-[1.5rem] bg-white p-8">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-[#212529] tracking-tight">
                    Order Summary
                  </h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-slate-500 font-bold">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>PKR {totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-bold">
                      <span>Shipping Fee</span>
                      <span className="text-emerald-500 font-black uppercase text-[10px] tracking-widest bg-emerald-50 px-2 py-0.5 rounded">Free</span>
                    </div>
                    <div className="h-px bg-slate-100 my-4" />
                    <div className="flex justify-between text-2xl font-black text-[#212529]">
                      <span className="tracking-tighter">Grand Total</span>
                      <span>PKR {totalPrice}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full h-14 rounded-[8px] bg-[#007BFF] hover:bg-[#0069d9] text-white font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Card>
                
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex gap-4">
                  <div className="w-10 h-10 bg-[#007BFF] rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-[#212529] text-sm uppercase tracking-tight">Secure Payment</h4>
                    <p className="text-slate-500 text-xs font-bold leading-tight mt-1">Encrypted pharmaceutical procurement system active.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
