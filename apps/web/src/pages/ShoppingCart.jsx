import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Minus } from 'lucide-react';
import Header from '@/components/Header';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  };

  const updateQuantity = (productId, delta) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        const minQty = item.minimum_quantity || 1;
        const newQuantity = Math.max(minQty, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const applyPromoCode = async () => {
    try {
      const codes = await pb.collection('promo_codes').getFullList({
        filter: `code = "${promoCode}"`,
        $autoCancel: false
      });

      if (codes.length > 0) {
        setDiscount(codes[0].discount_percentage);
        toast({
          title: 'Հաջողություն',
          description: `Զեղչ ${codes[0].discount_percentage}% կիրառվել է`,
        });
      } else {
        toast({
          title: 'Սխալ',
          description: 'Անվավեր պրոմո կոդ',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const placeOrder = async () => {
    if (!customerName || !customerPhone || !customerAddress) {
      toast({
        title: 'Սխալ',
        description: 'Խնդրում ենք լրացնել բոլոր դաշտերը',
        variant: 'destructive',
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: 'Սխալ',
        description: 'Զամբյուղը դատարկ է',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        products: cart,
        total_price: total,
        promo_code_used: promoCode || '',
        discount_amount: discountAmount,
        status: 'pending'
      };

      await pb.collection('orders').create(orderData, { $autoCancel: false });

      toast({
        title: 'Հաջողություն',
        description: 'Ձեր պատվերը ընդունվել է',
      });

      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Սխալ',
        description: 'Չհաջողվեց տեղադրել պատվերը',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Զամբյուղ - Մեծածախ վաճառք</title>
        <meta name="description" content="Ձեր գնումների զամբյուղ" />
      </Helmet>

      <div className="min-h-screen bg-black">
        <Header />

        <div className="container mx-auto px-3 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Զամբյուղ</h1>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-500 text-sm mb-4">Ձեր զամբյուղը դատարկ է</p>
              <Button
                onClick={() => navigate('/products/Սպորտային կոշիկներ')}
                className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white text-xs font-bold rounded-full px-6 border-0"
              >
                Շարունակել գնումները
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900/80 rounded-2xl p-3 md:p-4 border border-zinc-800/50 flex gap-4 items-center"
                  >
                    {item.image ? (
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-950 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={pb.files.getUrl({ id: item.id, collectionName: 'products' }, item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-950 rounded-xl flex-shrink-0 flex items-center justify-center">
                        <span className="text-[10px] text-zinc-600">Նկար չկա</span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white mb-0.5 truncate">{item.name}</h3>
                      <p className="text-[10px] text-zinc-500 mb-1">Կոդ: {item.product_code}</p>
                      <p className="text-sm font-bold text-orange-400">
                        {item.price.toLocaleString()} ֏
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2 bg-zinc-950 rounded-full px-2 py-1 border border-zinc-800">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-zinc-400 hover:text-blue-400 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white text-xs font-bold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-zinc-400 hover:text-orange-400 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                {/* Promo Code */}
                <div className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800/50">
                  <h3 className="text-sm font-bold text-white mb-3">Պրոմո կոդ</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Մուտքագրեք կոդը"
                      className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    />
                    <Button
                      onClick={applyPromoCode}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-full px-4 h-auto"
                    >
                      Կիրառել
                    </Button>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800/50">
                  <h3 className="text-sm font-bold text-white mb-3">Հաճախորդի տվյալներ</h3>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Անուն"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Հեռախոս"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <textarea
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Հասցե"
                        rows={2}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800/50">
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Ենթագումար</span>
                      <span>{subtotal.toLocaleString()} ֏</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-blue-400">
                        <span>Զեղչ ({discount}%)</span>
                        <span>-{discountAmount.toLocaleString()} ֏</span>
                      </div>
                    )}
                    <div className="border-t border-zinc-800/50 pt-2 flex justify-between text-sm font-bold text-white">
                      <span>Ընդամենը</span>
                      <span className="text-orange-400">{total.toLocaleString()} ֏</span>
                    </div>
                  </div>

                  <Button
                    onClick={placeOrder}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white text-xs font-bold py-2.5 h-auto rounded-full border-0"
                  >
                    {loading ? 'Բեռնվում է...' : 'Պատվեր տեղադրել'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;