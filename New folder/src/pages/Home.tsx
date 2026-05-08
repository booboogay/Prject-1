import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Clock, Users, Activity, Scissors, Syringe, ClipboardCheck, ArrowRight, Stethoscope, Award, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';

export default function Home() {
  const navigate = useNavigate();
  const bestSellers = products.slice(0, 4);

  const testimonials = [
    { name: 'Zoya', role: 'Cat Mom', text: 'The best clinic ever! Bilal doctor ne bohat achay se explain kia. Highly recommended for all pet lovers.', rating: 5 },
    { name: 'Hamza', role: 'Golden Retriever Dad', text: 'Store ka experience was top notch. Items are original and delivery sahi time pe hui. 10/10 from my side!', rating: 5 },
    { name: 'Sana', role: 'Husky Owner', text: 'My Bruno is always happy coming here. Staff bohat friendly hai. Medical treatment bhi perfect hai.', rating: 5 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Shopify-style Split Hero Section */}
        <section className="relative pt-24 pb-12 md:py-0 md:h-[90vh] flex items-center bg-slate-50 overflow-hidden">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="z-10"
            >
              <Badge className="bg-primary/10 hover:bg-primary/10 text-primary font-black mb-6 px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                New Spring Collection
              </Badge>
              <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1] tracking-tight text-slate-900">
                For the love of your <span className="text-primary italic">furry best friend.</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-slate-500 leading-relaxed font-medium max-w-xl">
                Experience premium healthcare and curated essentials designed with medical precision and heart.
              </p>
              <div className="flex flex-wrap gap-5">
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-primary/90 rounded-2xl px-10 h-16 text-lg font-black shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group"
                  onClick={() => navigate('/shop')}
                >
                  Shop Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="text-slate-900 hover:text-primary rounded-2xl px-10 h-16 text-lg font-black transition-all"
                  onClick={() => navigate('/services')}
                >
                  Book a Visit
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative hidden md:block"
            >
              <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1000"
                alt="Happy French Bulldog"
                className="relative z-10 w-full h-[700px] object-cover rounded-[3rem] shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-20 -left-10 z-20 bg-white p-6 rounded-3xl shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Grade</p>
                    <p className="text-lg font-black text-slate-900 leading-none">100% Verified</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us - Medical Icons */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Why Choose ProPets?</h2>
              <p className="text-slate-500 font-bold">Scientific excellence combined with emotional intelligence for your best friends.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 group hover:shadow-xl hover:-translate-y-2 transition-all">
                <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mb-8 border-4 border-white shadow-lg">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Expert Veterinarians</h3>
                <p className="text-slate-500 font-bold leading-relaxed">Bohat hi experienced team hai jo Pakistani pet parents ki zaroorat ko samajhti hai.</p>
              </div>
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 group hover:shadow-xl hover:-translate-y-2 transition-all">
                <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mb-8 border-4 border-white shadow-lg">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Compassionate Care</h3>
                <p className="text-slate-500 font-bold leading-relaxed">It's not just medical treatment; hum aapke pet ko apnay ghar ke fard ki tarah treat kartay hain.</p>
              </div>
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 group hover:shadow-xl hover:-translate-y-2 transition-all">
                <div className="w-16 h-16 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-600 mb-8 border-4 border-white shadow-lg">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Certified Quality</h3>
                <p className="text-slate-500 font-bold leading-relaxed">International standards equipment and original premium products guaranteed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Best Sellers Slider/Grid */}
        <section className="py-24 bg-slate-50 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <Badge className="bg-primary hover:bg-primary text-white font-black mb-4 px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                  Shopify Premium
                </Badge>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900">Current Best Sellers</h2>
              </div>
              <Button 
                variant="outline" 
                className="rounded-2xl border-2 border-slate-200 h-14 px-8 font-black text-slate-900 bg-white hover:bg-white hover:border-primary hover:text-primary transition-all"
                onClick={() => navigate('/shop')}
              >
                View Full Shop
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="group border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      {product.badge && (
                        <div className="absolute top-6 left-6 z-20">
                          <Badge className="bg-white/90 backdrop-blur-md text-primary border-none font-black text-[10px] px-4 py-2 rounded-xl shadow-lg ring-1 ring-black/5">
                            {product.badge}
                          </Badge>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button className="rounded-full w-14 h-14 bg-white text-primary hover:bg-primary hover:text-white shadow-xl transition-all scale-75 group-hover:scale-100">
                          <ShoppingCart size={24} />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <div className="mb-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{product.category}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-3">{product.name}</h3>
                      <p className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pet Parent Testimonials */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Pakistani Pet Parents Love Us</h2>
              <p className="text-slate-500 font-bold">Unfiltered reviews from our amazing community across the country.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <Card key={idx} className="border-none bg-slate-50 rounded-[3rem] p-10 flex flex-col items-center text-center group hover:bg-primary transition-all duration-500">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center font-black text-primary text-2xl shadow-xl mb-8 group-hover:scale-110 transition-transform">
                    {t.name[0]}
                  </div>
                  <div className="flex gap-1 mb-6 text-amber-400 group-hover:text-white transition-colors">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-lg font-bold text-slate-600 mb-8 italic group-hover:text-white/90 transition-colors">"{t.text}"</p>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">{t.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white/60 transition-colors">{t.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-slate-900 py-20 border-y border-white/10 dark">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-white">
              <div>
                <p className="text-5xl font-black tracking-tighter mb-2">15,000+</p>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-80">Treatments Done</p>
              </div>
              <div>
                <p className="text-5xl font-black tracking-tighter mb-2">12</p>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-80">Expert Vets</p>
              </div>
              <div>
                <p className="text-5xl font-black tracking-tighter mb-2">100%</p>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-80">Safe & Reliable</p>
              </div>
              <div>
                <p className="text-5xl font-black text-primary tracking-tighter mb-2">24/7</p>
                <p className="text-[10px] font-black text-white uppercase tracking-widest opacity-80">Emergency Care</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
