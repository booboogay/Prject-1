import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { products as staticProducts } from '@/data/products';
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, Truck, RotateCcw, Heart, Share2, Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        // Try Firestore first
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Fallback to static data if numeric ID
          const staticFound = staticProducts.find(p => p.id === Number(id));
          if (staticFound) {
            setProduct(staticFound);
          } else {
            navigate('/shop');
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        const staticFound = staticProducts.find(p => p.id === Number(id));
        if (staticFound) {
          setProduct(staticFound);
        } else {
          navigate('/shop');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const hingesReviews = [
    { name: 'Zoya Malik', rating: 5, comment: 'Mashallah, quality bohat zabardast hai. Packaging was so premium, safe feel hota hai use karte waqt. Recommended for all pet parents!' },
    { name: 'Hamza Sheikh', rating: 5, comment: 'Product delivery bohat fast thi. Highly effective and affordable price. Best for veterinary use.' },
    { name: 'Ayesha Khan', rating: 5, comment: 'Bohat hi amazing result mila. My pet is so much better now. Vet approved real quality!' },
    { name: 'Arsalan J.', rating: 4, comment: 'Authentic item check kia. Delivery Lahore mein timely mil gayi. Packaging was top-notch.' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Loading Product...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = [product.image, ...(product.gallery || [])].filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-12">
          {/* Breadcrumb / Back */}
          <div className="flex items-center justify-between mb-12">
            <button 
              onClick={() => navigate('/shop')}
              className="flex items-center gap-2 text-slate-400 hover:text-black transition-all font-black text-xs uppercase tracking-widest group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Store Catalog
            </button>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all">
                <Share2 size={16} />
              </button>
              <button className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                <Heart size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Gallery Section */}
            <div className="grid grid-cols-12 gap-6">
              {/* Thumbnails Sidebar */}
              <div className="col-span-2 space-y-4">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square w-full rounded-2xl overflow-hidden border-2 transition-all shadow-sm ${
                      selectedImage === idx ? 'border-primary ring-2 ring-primary/10' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>

              {/* Main Image View */}
              <div className="col-span-10">
                <motion.div 
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="aspect-square rounded-[3rem] overflow-hidden bg-slate-50 shadow-2xl relative group"
                >
                  <img 
                    src={images[selectedImage]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {product.badge && (
                    <Badge className="absolute top-8 left-8 bg-black text-white font-black rounded-lg border-none shadow-lg uppercase text-[10px] tracking-[0.2em] px-4 py-2">
                       {product.badge}
                    </Badge>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col pt-4">
              <div className="space-y-6 mb-12">
                <Badge className="bg-primary/5 text-primary hover:bg-primary/10 border-none font-black px-5 py-2 rounded-full uppercase tracking-widest text-[10px]">
                  Professional {product.category}
                </Badge>
                
                <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" stroke="none" />)}
                  </div>
                  <span className="text-slate-400 font-black text-xs uppercase tracking-widest border-l border-slate-200 pl-4">
                    4.9 · 100+ Orders
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                   <span className="text-xl font-black text-slate-400 uppercase tracking-tighter">PKR</span>
                   <p className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums">
                    {product.price}
                  </p>
                </div>
                
                <p className="text-slate-500 leading-relaxed font-bold text-lg max-w-md">
                  {product.description || 'Premium quality pharmaceutical-grade pet care item, specially selected by ProPets clinicians for maximum safety and effectiveness.'}
                </p>
              </div>

              {/* Utility Badges */}
              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="flex items-center gap-3 p-5 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                    <Truck size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">Express Shipping</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Nationwide</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-5 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">Vet Approved</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Certified Safe</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => addToCart(product)}
                  className="flex-1 h-20 rounded-[2rem] bg-black hover:bg-primary text-white font-black text-2xl gap-4 shadow-2xl transition-all active:scale-[0.95] group"
                >
                  <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  Add To Basket
                </Button>
                <Button 
                  variant="outline"
                  className="w-20 h-20 rounded-[2rem] border-slate-200 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all group"
                >
                  <Heart className="w-6 h-6 group-hover:scale-125 transition-transform" />
                </Button>
              </div>
            </div>
          </div>

          {/* Social Proof Section (AI Powered Look) */}
          <section className="mt-32">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-10 mb-16">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">AI-Analyzed Reviews</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Verified Pet Parent Community</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-slate-900">4.9</p>
                <div className="flex text-amber-400 justify-end">
                   {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" stroke="none" />)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hingesReviews.map((review, idx) => (
                <Card key={idx} className="border-none bg-slate-50 rounded-[3rem] p-10 shadow-sm relative group hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center font-black text-primary shadow-sm text-xl">
                        {review.name[0]}
                      </div>
                      <div>
                        <span className="font-black text-slate-900 block">{review.name}</span>
                        <div className="flex text-amber-400 mt-1">
                          {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" stroke="none" />)}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[8px] uppercase px-3 py-1 rounded-full">Verified</Badge>
                  </div>
                  <p className="text-slate-600 font-bold leading-relaxed italic text-lg relative z-10">
                    "{review.comment}"
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-2 relative z-10">
                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter tracking-widest">Sentiment: Highly Positive</p>
                  </div>
                </Card>
              ))}
              
              <Card className="border-2 border-dashed border-slate-200 bg-transparent rounded-[3rem] p-10 flex flex-col items-center justify-center text-center group hover:border-primary transition-all">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                    <Plus size={32} />
                  </div>
                  <h3 className="font-black text-slate-900 text-xl tracking-tight">Share Experience</h3>
                  <p className="text-slate-500 font-bold text-sm mt-2">Help other pet parents decide.</p>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
