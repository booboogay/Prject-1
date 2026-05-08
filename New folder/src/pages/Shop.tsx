import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Heart, Search, Filter, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import { products as staticProducts } from '@/data/products';
import { useNavigate } from 'react-router-dom';

export default function Shop() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sync with Firestore
    const q = query(collection(db, 'products'), orderBy('lastUpdated', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // If Firestore is empty, we can show static products as a starting point
      if (fetchedProducts.length === 0) {
        setProducts(staticProducts);
      } else {
        setProducts(fetchedProducts);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setProducts(staticProducts);
      setIsLoading(false);
    });

    return unsub;
  }, []);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'food', label: 'Pet Food' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'toys', label: 'Toys' },
    { id: 'healthcare', label: 'Healthcare' },
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Sub-Navbar: Search & Filter */}
        <section className="sticky top-16 z-40 bg-white border-b border-slate-100 shadow-sm py-4">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Search premium products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-primary/20 transition-all text-sm shadow-inner px-12"
              />
            </div>
          </div>
        </section>

        {/* Shop Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">ProPets Store</h1>
              <p className="text-slate-500 font-bold">Premium medical & wellness products handpicked by our vets.</p>
            </div>
            <div className="text-xs font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-4 py-2 rounded-full">
              Showing {filteredProducts.length} Results
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin text-primary w-10 h-10" />
              <p className="font-bold text-slate-400 animate-pulse">Fetching medical supplies...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="group border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white">
                      <div 
                        className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        {product.badge && (
                          <Badge className="absolute top-6 left-6 bg-primary text-white font-black rounded-lg border-none shadow-lg uppercase text-[10px] tracking-widest px-3 py-1 scale-110">
                            {product.badge}
                          </Badge>
                        )}
                        <button className="absolute top-6 right-6 w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white transition-all shadow-xl scale-90 group-hover:scale-100">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      <CardContent className="p-8 pb-4">
                        <div className="mb-2">
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{product.category}</span>
                        </div>
                        <h3 
                          className="font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2 cursor-pointer text-lg tracking-tight"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-black text-slate-900 tracking-tighter">
                            <span className="text-xs text-slate-400 mr-1 uppercase">PKR</span>
                            {product.price}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="p-8 pt-0">
                        <Button 
                          className="w-full h-14 rounded-2xl bg-black text-white font-black gap-2 hover:bg-primary shadow-xl transition-all active:scale-90"
                          onClick={() => addToCart({ ...product })}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-24">
              <div className="bg-slate-100 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-slate-400 shadow-inner">
                <Search size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Inventory Empty</h2>
              <p className="text-slate-500 font-bold">Try adjusting your filters or checking back later.</p>
              <Button 
                variant="link" 
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="text-primary font-black mt-4 uppercase tracking-widest text-xs"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
