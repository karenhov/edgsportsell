import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'admin_users') {
      setCurrentAdmin(pb.authStore.model);
    }
    setInitialLoading(false);
  }, []);

  const loginAdmin = async (email, password) => {
    const authData = await pb.collection('admin_users').authWithPassword(email, password);
    setCurrentAdmin(authData.record);
    return authData;
  };

  const logoutAdmin = () => {
    pb.authStore.clear();
    setCurrentAdmin(null);
  };

  const changePassword = async (oldPassword, newPassword) => {
    await pb.collection('admin_users').update(currentAdmin.id, {
      oldPassword,
      password: newPassword,
      passwordConfirm: newPassword
    }, { $autoCancel: false });
  };

  const value = {
    currentAdmin,
    loginAdmin,
    logoutAdmin,
    changePassword,
    isAuthenticated: !!currentAdmin,
    initialLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};