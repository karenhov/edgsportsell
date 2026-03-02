import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginAdmin(email, password);
      toast({
        title: 'Հաջողություն',
        description: 'Դուք մուտք եք գործել համակարգ',
      });
      navigate('/admin');
    } catch (error) {
      toast({
        title: 'Սխալ',
        description: 'Սխալ էլ-փոստ կամ գաղտնաբառ',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Ադմինի մուտք - Մեծածախ վաճառք</title>
        <meta name="description" content="Ադմինիստրատորի մուտք համակարգ" />
      </Helmet>
      
      <div className="min-h-screen bg-black">
        <Header />
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-sm mx-auto">
            <div className="bg-zinc-900/80 rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-2xl">
              <h1 className="text-2xl font-bold text-white mb-6 text-center">
                Ադմինի մուտք
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-full text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Էլ-փոստ"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-full text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Գաղտնաբառ"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white text-sm font-bold py-2.5 h-auto rounded-full border-0 mt-2"
                >
                  {loading ? 'Բեռնվում է...' : 'Մուտք'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;