import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Settings } from 'lucide-react';
import Header from '@/components/Header';
import AdminProductsPage from './AdminProductsPage';
import AdminPromoCodesPage from './AdminPromoCodesPage';
import AdminOrdersPage from './AdminOrdersPage';

const AdminDashboard = () => {
  const { currentAdmin, changePassword } = useAuth();
  const { toast } = useToast();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Սխալ',
        description: 'Նոր գաղտնաբառերը չեն համընկնում',
        variant: 'destructive',
      });
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      toast({
        title: 'Հաջողություն',
        description: 'Գաղտնաբառը փոխվել է',
      });
      setIsPasswordDialogOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'Սխալ',
        description: 'Չհաջողվեց փոխել գաղտնաբառը',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Ադմինի վահանակ - Սպորտային կոշիկներ և Հողաթափեր</title>
        <meta name="description" content="Ադմինիստրատորի վահանակ" />
      </Helmet>

      <div className="min-h-screen bg-black">
        <Header />

        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Ադմինի վահանակ</h1>
              <p className="text-zinc-400">Բարի գալուստ, {currentAdmin?.email}</p>
            </div>

            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">
                  <Settings className="w-5 h-5 mr-2" />
                  Կարգավորումներ
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Փոխել գաղտնաբառը</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-zinc-300 text-sm mb-2">Հին գաղտնաբառ</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 text-sm mb-2">Նոր գաղտնաբառ</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 text-sm mb-2">Հաստատել նոր գաղտնաբառը</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold">
                    Փոխել գաղտնաբառը
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="bg-zinc-900 border border-zinc-800 mb-8">
              <TabsTrigger value="products" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Ապրանքներ
              </TabsTrigger>
              <TabsTrigger value="promo" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Պրոմո կոդեր
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Պատվերներ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <AdminProductsPage />
            </TabsContent>

            <TabsContent value="promo">
              <AdminPromoCodesPage />
            </TabsContent>

            <TabsContent value="orders">
              <AdminOrdersPage />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;