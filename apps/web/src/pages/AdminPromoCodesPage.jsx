import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus } from 'lucide-react';

const AdminPromoCodesPage = () => {
  const { toast } = useToast();
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: ''
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('promo_codes').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setPromoCodes(records);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await pb.collection('promo_codes').create({
        code: formData.code.toUpperCase(),
        discount_percentage: parseFloat(formData.discount_percentage)
      }, { $autoCancel: false });

      toast({
        title: 'Հաջողություն',
        description: 'Պրոմո կոդը ավելացվել է',
      });

      setIsDialogOpen(false);
      setFormData({ code: '', discount_percentage: '' });
      fetchPromoCodes();
    } catch (error) {
      console.error('Error creating promo code:', error);
      toast({
        title: 'Սխալ',
        description: 'Չհաջողվեց ավելացնել պրոմո կոդը',
        variant: 'destructive',
      });
    }
  };

  const deletePromoCode = async (id) => {
    if (!window.confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս պրոմո կոդը')) {
      return;
    }

    try {
      await pb.collection('promo_codes').delete(id, { $autoCancel: false });
      toast({
        title: 'Հաջողություն',
        description: 'Պրոմո կոդը ջնջվել է',
      });
      fetchPromoCodes();
    } catch (error) {
      console.error('Error deleting promo code:', error);
      toast({
        title: 'Սխալ',
        description: 'Չհաջողվեց ջնջել պրոմո կոդը',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Պրոմո կոդերի կառավարում</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
              <Plus className="w-5 h-5 mr-2" />
              Ավելացնել պրոմո կոդ
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Նոր պրոմո կոդ</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-300 text-sm mb-2">Կոդ</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white uppercase focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="SUMMER2026"
                />
              </div>

              <div>
                <label className="block text-zinc-300 text-sm mb-2">Զեղչ (%)</label>
                <input
                  type="number"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  required
                  min="1"
                  max="100"
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold">
                Ավելացնել
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center text-white py-12">Բեռնվում է...</div>
      ) : promoCodes.length === 0 ? (
        <div className="text-center text-zinc-400 py-12">Պրոմո կոդեր չկան</div>
      ) : (
        <div className="grid gap-4">
          {promoCodes.map((promo) => (
            <div
              key={promo.id}
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 flex items-center justify-between"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{promo.code}</h3>
                <p className="text-zinc-400">Զեղչ: <span className="text-orange-500 font-bold">{promo.discount_percentage}%</span></p>
              </div>

              <button
                onClick={() => deletePromoCode(promo.id)}
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPromoCodesPage;