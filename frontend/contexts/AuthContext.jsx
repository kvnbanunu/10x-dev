'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as api from '@/lib/api.js';
import { toast } from 'react-hot-toast';

const AuthContext = createContext({});

const successMsg = {
  login: 'Login successful',
  register: 'Registration successful, please login',
  logout: 'Logout successful',
};

const errMsg = {
  login: 'Login failed',
  register: 'Registration failed',
  logout: 'Logout failed',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestCount, setRequestCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await api.getUserInfo();
        setUser(data.user);
        setRequestCount(data.request_count || 0);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await api.login(credentials);
      setUser(data.user);

      const userInfoResponse = await api.getUserInfo();
      setRequestCount(userInfoResponse.data.request_count || 0);

      toast.success(successMsg.login);
      router.push('/');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || errMsg.login);
      return false;
    } finally {
      setLoading(false);
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true);
      await api.register(userData);
      toast.success(successMsg.register);
      router.push('/login');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || errMsg.register);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.logout();
      setUser(null);
      setRequestCount(0);
      toast.success(successMsg.logout);
      router.push('/login');
    } catch (error) {
      toast.error(errMsg.logout);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestCount = (count) => {
    setRequestCount(count);
  };

  const value = {
    user,
    loading,
    requestCount,
    login,
    register,
    logout,
    updateRequestCount,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin === 1
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
