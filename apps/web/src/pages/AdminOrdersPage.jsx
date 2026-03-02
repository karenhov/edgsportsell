import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

const AdminOrdersPage = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('orders').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setOrders(records);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await pb.collection('orders').update(orderId, {
        status: newStatus
      }, { $autoCancel: false });

      toast({
        title: 'Հաջողություն',
        description: 'Պատվերի կարգավիճակը թարմացվել է',
      });

      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Սխալ',
        description: 'Չհաջողվեց թարմացնել կարգավիճակը',
        variant: 'destructive',
      });
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս ավարտված պատվերը')) {
      return;
    }

    try {
      await pb.collection('orders').delete(orderId, { $autoCancel: false });
      toast({
        title: 'Հաջողություն',
        description: 'Պատվերը ջնջվել է',
      });
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: 'Սխալ',
        description: 'Չհաջողվեց ջնջել պատվերը',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Պատվերների կառավարում</h2>

      {loading ? (
        <div className="text-center text-zinc-500 text-sm py-8">Բեռնվում է...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-zinc-500 text-sm py-8">Պատվերներ չկան</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-zinc-900/80 rounded-2xl p-4 md:p-5 border border-zinc-800/50"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-zinc-800/50">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Պատվեր #{order.id.slice(0, 8)}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {new Date(order.created).toLocaleString('hy-AM')}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  >
                    <option value="pending">Սպասվում է</option>
                    <option value="processing">Մշակվում է</option>
                    <option value="completed">Ավարտված</option>
                    <option value="cancelled">Չեղարկված</option>
                  </select>

                  {order.status === 'completed' && (
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="p-1.5 bg-zinc-950 text-zinc-500 hover:text-red-500 rounded-full transition-colors border border-zinc-800"
                      title="Ջնջել պատվերը"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/30">
                  <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">Հաճախորդ</h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-white font-medium">{order.customer_name}</p>
                    <p className="text-blue-400">{order.customer_phone}</p>
                    <p className="text-zinc-400">{order.customer_address}</p>
                  </div>
                </div>

                <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/30">
                  <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">Վճարում</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Ընդամենը:</span>
                      <span className="font-bold text-orange-400">{order.total_price.toLocaleString()} ֏</span>
                    </div>
                    {order.promo_code_used && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Պրոմո կոդ:</span>
                          <span className="text-white">{order.promo_code_used}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Զեղչ:</span>
                          <span className="text-blue-400">-{order.discount_amount.toLocaleString()} ֏</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">Ապրանքներ ({order.products.length})</h4>
                <div className="space-y-2">
                  {order.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex gap-3 bg-zinc-950/50 rounded-xl p-2 border border-zinc-800/30 items-center"
                    >
                      {product.image ? (
                        <div className="w-10 h-10 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={pb.files.getUrl({ id: product.id, collectionName: 'products' }, product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-zinc-900 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <span className="text-[8px] text-zinc-600">Նկար չկա</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white font-medium truncate">{product.name}</p>
                        <p className="text-[10px] text-zinc-500">Կոդ: {product.product_code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-orange-400 font-bold">{product.price.toLocaleString()} ֏</p>
                        <p className="text-[10px] text-zinc-400">Քանակ: {product.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;