import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const ProductCategoryPage = () => {
  const { category } = useParams();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(category || 'Սպորտային կոշիկներ');

  const categories = ['Սպորտային կոշիկներ', 'Հողաթափեր'];

  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory]);

  const fetchProducts = async (cat) => {
    setLoading(true);
    try {
      const records = await pb.collection('products').getFullList({
        filter: `category = "${cat}"`,
        sort: '-created',
        $autoCancel: false
      });
      setProducts(records);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Սխալ',
        description: 'Չհաջողվեց բեռնել ապրանքները',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    const minQty = product.minimum_quantity || 1;

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        product_code: product.product_code,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: minQty,
        minimum_quantity: minQty
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));

    toast({
      title: 'Հաջողություն',
      description: `${product.name} ավելացվել է զամբյուղ`,
    });
  };

  return (
    <>
      <Helmet>
        <title>{`${activeCategory} - Մեծածախ վաճառք`}</title>
        <meta name="description" content={`Գնեք ${activeCategory} մեր խանութից`} />
      </Helmet>

      <div className="min-h-screen bg-black">
        <Header />

        <div className="container mx-auto px-3 py-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products/${cat}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center text-zinc-400 text-sm py-12">Բեռնվում է...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-zinc-500 text-sm py-12">
              Այս կատեգորիայում ապրանքներ չկան
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-zinc-900/80 rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-blue-500/30 transition-all flex flex-col"
                >
                  {product.image ? (
                    <div className="aspect-square bg-zinc-950">
                      <img
                        src={pb.files.getUrl(product, product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-zinc-950 flex items-center justify-center">
                      <span className="text-zinc-700 text-xs">Նկար չկա</span>
                    </div>
                  )}
                  
                  <div className="p-3 md:p-4 flex flex-col flex-1">
                    <div className="text-[10px] text-zinc-500 mb-1">
                      Կոդ: {product.product_code}
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-zinc-500 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="text-[10px] text-blue-400 mb-2">
                      Նվազագույն քանակ: {product.minimum_quantity || 1}
                    </div>
                    
                    <div className="mt-auto pt-2 flex flex-col gap-2">
                      <span className="text-base font-bold text-orange-400">
                        {product.price.toLocaleString()} ֏
                      </span>
                      <Button
                        onClick={() => addToCart(product)}
                        className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white text-xs font-bold py-2 h-auto rounded-full border-0"
                      >
                        Ավելացնել
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCategoryPage;