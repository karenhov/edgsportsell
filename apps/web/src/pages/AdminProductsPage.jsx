import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Edit2 } from 'lucide-react';

const AdminProductsPage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    category: 'Սպորտային կոշիկներ',
    product_code: '',
    name: '',
    price: '',
    description: '',
    minimum_quantity: 1,
    image: null
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('products').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setProducts(records);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      category: product.category,
      product_code: product.product_code,
      name: product.name,
      price: product.price,
      description: product.description || '',
      minimum_quantity: product.minimum_quantity || 1,
      image: null // Don't pre-populate file input
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = new FormData();
      data.append('category', formData.category);
      data.append('product_code', formData.product_code);
      data.append('name', formData.name);
      data.append('price', parseFloat(formData.price));
      data.append('description', formData.description);
      data.append('minimum_quantity', parseInt(formData.minimum_quantity, 10));
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingId) {
        await pb.collection('products').update(editingId, data, { $autoCancel: false });
        toast({ title: 'Հաջողություն', description: 'Ապրանքը թարմացվել է' });
      } else {
        await pb.collection('products').create(data, { $autoCancel: false });
        toast({ title: 'Հաջողություն', description: 'Ապրանքը ավելացվել է' });
      }

      setIsDialogOpen(false);
      setFormData(initialFormState);
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Սխալ',
        description: 'Չհաջողվեց պահպանել ապրանքը',
        variant: 'destructive',
      });
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս ապրանքը')) {
      return;
    }

    try {
      await pb.collection('products').delete(id, { $autoCancel: false });
      toast({
        title: 'Հաջողություն',
        description: 'Ապրանքը ջնջվել է',
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Սխալ',
        description: 'Չհաջողվեց ջնջել ապրանքը',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Ապրանքների կառավարում</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={handleOpenCreate} className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white text-xs font-bold rounded-full border-0">
            <Plus className="w-4 h-4 mr-1" />
            Ավելացնել
          </Button>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-white text-lg">
                {editingId ? 'Խմբագրել ապրանքը' : 'Նոր ապրանք'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Սպորտային կոշիկներ">Սպորտային կոշիկներ</option>
                  <option value="Հողաթափեր">Հողաթափեր</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.product_code}
                  onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                  required
                  placeholder="Ապրանքի կոդ"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  value={formData.minimum_quantity}
                  onChange={(e) => setFormData({ ...formData, minimum_quantity: e.target.value })}
                  required
                  min="1"
                  placeholder="Նվազագույն քանակ"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Անվանում"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Գին (֏)"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Նկարագրություն"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-zinc-400 focus:outline-none focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                />
                {editingId && <p className="text-[10px] text-zinc-500 mt-1 ml-2">Թողեք դատարկ, եթե չեք ուզում փոխել նկարը</p>}
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white text-xs font-bold rounded-full border-0 mt-2">
                {editingId ? 'Պահպանել' : 'Ավելացնել'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center text-zinc-500 text-sm py-8">Բեռնվում է...</div>
      ) : (
        <div className="grid gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-zinc-900/80 rounded-2xl p-3 md:p-4 border border-zinc-800/50 flex gap-4 items-center"
            >
              {product.image ? (
                <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-950 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={pb.files.getUrl(product, product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-950 rounded-xl flex-shrink-0 flex items-center justify-center">
                  <span className="text-[8px] text-zinc-600">Նկար չկա</span>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] rounded-full whitespace-nowrap">
                    {product.category}
                  </span>
                  <span className="text-zinc-500 text-[10px] truncate">Կոդ: {product.product_code}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5 truncate">{product.name}</h3>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-orange-400">{product.price.toLocaleString()} ֏</p>
                  <p className="text-[10px] text-blue-400">Նվազ. քանակ: {product.minimum_quantity || 1}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleOpenEdit(product)}
                  className="text-zinc-500 hover:text-blue-400 transition-colors p-1.5 bg-zinc-950 rounded-full"
                  title="Խմբագրել"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-zinc-500 hover:text-red-500 transition-colors p-1.5 bg-zinc-950 rounded-full"
                  title="Ջնջել"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;