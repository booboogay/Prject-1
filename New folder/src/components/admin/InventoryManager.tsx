import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  AlertTriangle, 
  Package, 
  Image as ImageIcon, 
  X, 
  Layers,
  Check
} from 'lucide-react';

export default function InventoryManager() {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Multi-image state
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  useEffect(() => {
    // Note: We'll use 'products' collection for the shop items management
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (editingItem) {
      setMainImage(editingItem.image || '');
      setGalleryImages(editingItem.gallery || []);
    } else {
      setMainImage('');
      setGalleryImages([]);
    }
  }, [editingItem]);

  const addGalleryImage = () => {
    if (!newGalleryUrl) return;
    setGalleryImages([...galleryImages, newGalleryUrl]);
    setNewGalleryUrl('');
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      quantity: Number(formData.get('quantity')),
      price: Number(formData.get('price')),
      image: mainImage,
      gallery: galleryImages,
      badge: formData.get('badge'),
      lastUpdated: serverTimestamp(),
    };

    try {
      if (editingItem) {
        await updateDoc(doc(db, 'products', editingItem.id), data);
        toast.success(`${data.name} updated successfully`);
      } else {
        await addDoc(collection(db, 'products'), data);
        toast.success(`${data.name} added to Shopify collection`);
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredItems = items.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2rem] shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Inventory</h2>
          <p className="text-slate-500 font-bold text-sm">Manage {items.length} products in your medical shop.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search catalog..." 
              className="pl-11 h-12 bg-slate-50 border-none rounded-2xl focus:ring-primary/20 shadow-inner" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingItem(null); }}>
            <DialogTrigger 
              nativeButton={true} 
              className={cn(buttonVariants({ variant: "default" }), "h-12 px-6 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 gap-2 font-black transition-all hover:scale-105 active:scale-95")}
            >
              <Plus size={20} /> Add Product
            </DialogTrigger>
            <DialogContent className="max-w-4xl rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden">
              <DialogHeader className="p-8 bg-slate-900 text-white">
                <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                  <Package className="text-primary" /> {editingItem ? 'Update Collection' : 'Add New Feature Product'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="grid gap-3">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Product Identity</Label>
                      <Input name="name" placeholder="Organic Kibble..." className="h-14 rounded-2xl bg-slate-50 border-none font-bold placeholder:text-slate-300" defaultValue={editingItem?.name} required />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Description</Label>
                      <Textarea name="description" placeholder="Bohat hi zabardast quality ki product..." className="min-h-[120px] rounded-2xl bg-slate-50 border-none font-medium p-4" defaultValue={editingItem?.description} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-3">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Catgeory</Label>
                        <select name="category" className="h-14 rounded-2xl bg-slate-50 border-none font-bold px-4 appearance-none focus:ring-2 focus:ring-primary/20" defaultValue={editingItem?.category || 'food'}>
                          <option value="food">Pet Food</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="accessories">Accessories</option>
                          <option value="toys">Toys</option>
                        </select>
                      </div>
                      <div className="grid gap-3">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Badge</Label>
                        <Input name="badge" placeholder="Premium, New, Sale" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" defaultValue={editingItem?.badge} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-3">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Price (PKR)</Label>
                        <Input name="price" type="number" step="0.01" className="h-14 rounded-2xl bg-slate-50 border-none font-black text-xl" defaultValue={editingItem?.price} required />
                      </div>
                      <div className="grid gap-3">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Stock Level</Label>
                        <Input name="quantity" type="number" className="h-14 rounded-2xl bg-slate-50 border-none font-black text-xl" defaultValue={editingItem?.quantity} required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase text-primary tracking-widest">Main Product Image URL</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={mainImage} 
                          onChange={(e) => setMainImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..." 
                          className="h-14 rounded-2xl bg-slate-50 border-none font-medium flex-1"
                        />
                      </div>
                      {mainImage && (
                        <div className="aspect-square rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner group relative">
                          <img src={mainImage} className="w-full h-full object-cover" alt="Main preview" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white px-4 py-2 rounded-full font-black text-xs text-primary shadow-xl tracking-tighter uppercase">Primary Photo</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase text-primary tracking-widest">Gallery Upload Logic (3-4 Images)</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={newGalleryUrl} 
                          onChange={(e) => setNewGalleryUrl(e.target.value)}
                          placeholder="Paste gallery image URL..." 
                          className="h-14 rounded-2xl bg-slate-50 border-none font-medium flex-1"
                        />
                        <Button 
                          type="button" 
                          onClick={addGalleryImage}
                          className="h-14 px-6 rounded-2xl bg-slate-900 hover:bg-primary transition-all"
                        >
                          <Plus size={20} />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-3">
                        {galleryImages.map((url, idx) => (
                          <div key={idx} className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100 group">
                            <img src={url} className="w-full h-full object-cover" alt={`Gallery ${idx}`} referrerPolicy="no-referrer" />
                            <button 
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 hover:scale-100"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        {[...Array(Math.max(0, 4 - galleryImages.length))].map((_, i) => (
                          <div key={i} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300">
                            <ImageIcon size={20} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="pt-6 border-t border-slate-100">
                  <Button type="submit" className="w-full h-16 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95">
                    {editingItem ? 'Publish Updates' : 'Sync New Product to Store'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,123,255,0.05)] border border-slate-100 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10">
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="px-8 py-5 text-[10px] uppercase font-black text-slate-400 tracking-widest w-[80px]">Image</TableHead>
                <TableHead className="py-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">Product Name</TableHead>
                <TableHead className="py-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">Category</TableHead>
                <TableHead className="py-5 text-[10px] uppercase font-black text-slate-400 tracking-widest text-center">Stock</TableHead>
                <TableHead className="py-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">Price</TableHead>
                <TableHead className="px-8 py-5 text-[10px] uppercase font-black text-slate-400 tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const isLowStock = item.quantity <= 5;
                return (
                  <TableRow key={item.id} className="hover:bg-blue-50/30 transition-colors border-b border-slate-50 last:border-none group">
                    <TableCell className="px-8 py-4">
                      <div className="h-14 w-14 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-100 bg-slate-50">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-black text-slate-900 text-base leading-tight">{item.name}</div>
                      {item.badge && <Badge className="bg-amber-50 text-amber-600 border-none text-[8px] uppercase font-black px-2 mt-1 rounded-full">{item.badge}</Badge>}
                    </TableCell>
                    <TableCell className="py-4">
                       <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] font-black px-3 rounded-full capitalize">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${isLowStock ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>
                        {item.quantity} units
                        {isLowStock && <AlertTriangle size={12} />}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 font-black text-slate-900 text-base">PKR {item.price}</TableCell>
                    <TableCell className="px-8 py-4 text-right">
                       <div className="flex justify-end gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-10 w-10 text-[#007BFF] hover:bg-blue-50 rounded-xl transition-all"
                            onClick={() => { setEditingItem(item); setIsDialogOpen(true); }}
                          >
                            <Edit2 size={18} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-10 w-10 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
