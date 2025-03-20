import axios from 'axios';
import { config } from '@/lib/config.js';

const API_URL = config.API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const register = async (userData) => {
  return api.post('/register', userData);
};

export const login = async (credentials) => {
  return api.post('/login', credentials);
};

export const logout = async () => {
  return api.post('/protected/logout');
};

export const resetPasswordRequest = async (email) => {
  return api.post('/resetPasswordRequest', { email: email });
};

export const resetPasswordHandle = async (token, password) => {
  return api.post('/resetPasswordHandle', { token, password });
};

export const getUserInfo = async () => {
  return api.get('/protected/userInfo');
};

export const generateCode = async (program, language) => {
  return api.post('/protected/chat', { program, language });
};

export const getDatabase = async () => {
  return api.get('/admin/database');
};

export const updateUser = async (userData) => {
  return api.put('/admin/update', userData);
};

export const deleteUser = async (id) => {
  return api.delete('/admin/delete', { data: { id } });
};

export default api;
