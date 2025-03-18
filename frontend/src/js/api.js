import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_URL = 'https://4537api.banunu.dev/10x-dev/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const getNonce = async () => {
  const response = await apiClient.post('/getNonce');
  return response.data.nonce;
};

// encrypt before sending to server
const preparePassword = (password, nonce) => {
  return CryptoJS.AES.encrypt(password, nonce).toString();
};

// user reqs
export const authService = {
  async register(email, username, password) {
    const nonce = await getNonce();
    const encryptedPassword = preparePassword(password, nonce);
    return apiClient.post('/register', {
      email,
      username,
      password: encryptedPassword,
      nonce,
    });
  },
  
  async login(email, password) {
    const nonce = await getNonce();
    const encryptedPassword = preparePassword(password, nonce);
    
    return apiClient.post('/login', {
      email,
      password: encryptedPassword,
      nonce,
    });
  },
  
  async logout() {
    return apiClient.post('/protected/logout');
  },
  
  async requestPasswordReset(email) {
    return apiClient.post('/resetPasswordRequest', { email });
  },
  
  async resetPassword(token, password) {
    const nonce = await getNonce();
    const encryptedPassword = preparePassword(password, nonce);
    
    return apiClient.post('/resetPassword', {
      token,
      password: encryptedPassword,
      nonce,
    });
  },
  
  async getUserInfo(id) {
    return apiClient.get('/protected/userInfo');
  },
};

// openai req
export const chatService = {
  async generateCode(program, language) {
    return apiClient.post('/protected/chat', { program, language });
  },
};

// admin reqs
export const adminService = {
  async getDatabaseEntries() {
    return apiClient.get('/protected/admin/database');
  },
  
  async updateUser(userId, userData) {
    return apiClient.put('/protected/admin/update', {
      userId,
      ...userData,
    });
  },
  
  // Delete user
  async deleteUser(userId) {
    return apiClient.delete('/protected/admin/delete', {
      data: { userId },
    });
  },
};

export default apiClient;
