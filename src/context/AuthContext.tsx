import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('deepali_ayurveda_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('deepali_ayurveda_addresses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('deepali_ayurveda_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('deepali_ayurveda_user');
    }
  }, [user]);

  const login = (userData) => {
    setUser({
      name: userData.name || 'Ayurveda Seeker',
      phone: userData.phone || '9876543210',
      email: userData.email || 'guest@example.com',
      prakriti: userData.prakriti || 'Tridoshic'
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, savedAddresses, setSavedAddresses }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
