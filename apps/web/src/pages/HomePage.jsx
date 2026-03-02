import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, Truck, Shield } from 'lucide-react';
import Header from '@/components/Header';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Մեծածախ վաճառք - Առցանց խանութ</title>
        <meta name="description" content="Գնեք բարձրորակ սպորտային կոշիկներ և հողաթափեր մեր առցանց խանութից" />
      </Helmet>

      <div className="min-h-screen bg-black">
        <Header />

        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-48 h-48 bg-blue-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-500 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500">
                  Մեծածախ վաճառք
                </span>
              </h1>
              
              <p className="text-sm md:text-base text-zinc-400 mb-8 max-w-xl mx-auto">
                Բարձրորակ ապրանքներ ձեր բիզնեսի համար։ Արագ առաքում և լավագույն գներ։
              </p>

              <Link to="/products/Սպորտային կոշիկներ">
                <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white font-bold text-sm px-8 py-4 rounded-full shadow-lg shadow-blue-500/25 transition-all hover:scale-105 border-0">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Դիտել ապրանքները
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 px-4 bg-gradient-to-b from-black to-zinc-950">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              Ինչու՞ ընտրել մեզ
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/50 hover:border-blue-500/50 transition-all">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Բարձր որակ</h3>
                <p className="text-xs text-zinc-500">
                  Հավաստագրված ապրանքներ
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/50 hover:border-orange-500/50 transition-all">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Արագ առաքում</h3>
                <p className="text-xs text-zinc-500">
                  Ամբողջ Հայաստանով
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/50 hover:border-blue-500/50 transition-all">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Երաշխիք</h3>
                <p className="text-xs text-zinc-500">
                  Ապահով գործարքներ
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/50 hover:border-orange-500/50 transition-all">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mb-3">
                  <ShoppingBag className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Մեծածախ գներ</h3>
                <p className="text-xs text-zinc-500">
                  Շահավետ պայմաններ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 px-4 bg-zinc-950">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              Կատեգորիաներ
            </h2>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <Link
                to="/products/Սպորտային կոշիկներ"
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 hover:scale-[1.02] transition-all shadow-xl hover:shadow-blue-500/20"
              >
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Սպորտային կոշիկներ
                  </h3>
                  <p className="text-xs text-blue-100 mb-4">
                    Լայն տեսականի մեծածախ գնորդների համար
                  </p>
                  <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full">
                    Դիտել →
                  </span>
                </div>
              </Link>

              <Link
                to="/products/Հողաթափեր"
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 p-8 hover:scale-[1.02] transition-all shadow-xl hover:shadow-orange-500/20"
              >
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Հողաթափեր
                  </h3>
                  <p className="text-xs text-orange-100 mb-4">
                    Ամենօրյա և աշխատանքային մոդելներ
                  </p>
                  <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full">
                    Դիտել →
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-zinc-900 py-8 px-4">
          <div className="container mx-auto text-center">
            <p className="text-zinc-500 text-sm mb-2">
              Մեծածախ վաճառք
            </p>
            <p className="text-zinc-700 text-xs">
              © 2026 Բոլոր իրավունքները պաշտպանված են
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;