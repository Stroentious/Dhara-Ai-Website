import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('dharaai_token');
    const userJson = localStorage.getItem('dharaai_user');
    if (token && userJson) {
      try {
        setCurrentUser(JSON.parse(userJson));
      } catch {
        // Fallback mock user if backend was unavailable
        setCurrentUser({ id: 1, name: 'Demo User', email: 'demo@dhara.ai' });
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Try real API
      const res = await authAPI.login(email, password);
      const { access_token } = res.data;
      const user = { id: 1, name: email.split('@')[0], email };
      localStorage.setItem('dharaai_token', access_token);
      localStorage.setItem('dharaai_user', JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    } catch (apiError) {
      // Fallback: mock login so UI works without backend
      const mockToken = 'mock-token-' + Date.now();
      const mockUser = { id: 1, name: email.split('@')[0] || 'Demo User', email };
      localStorage.setItem('dharaai_token', mockToken);
      localStorage.setItem('dharaai_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return { success: true, mock: true };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, fullName) => {
    setIsLoading(true);
    try {
      const res = await authAPI.register({ email, password, full_name: fullName });
      const { access_token } = res.data;
      const user = { id: 1, name: fullName, email };
      localStorage.setItem('dharaai_token', access_token);
      localStorage.setItem('dharaai_user', JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    } catch (apiError) {
      // Fallback mock registration
      const mockUser = { id: 1, name: fullName || email.split('@')[0], email };
      localStorage.setItem('dharaai_token', 'mock-token-' + Date.now());
      localStorage.setItem('dharaai_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return { success: true, mock: true };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('dharaai_token');
    localStorage.removeItem('dharaai_user');
    setCurrentUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
