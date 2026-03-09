import axios from 'axios';
import Constants from 'expo-constants';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat API
export const chatAPI = {
  sendMessage: async (sessionId: string, message: string, language: string = 'hindi') => {
    const response = await api.post('/chat', {
      session_id: sessionId,
      message,
      language,
    });
    return response.data;
  },
  
  getHistory: async (sessionId: string) => {
    const response = await api.get(`/chat/history/${sessionId}`);
    return response.data;
  },
  
  clearHistory: async (sessionId: string) => {
    const response = await api.delete(`/chat/history/${sessionId}`);
    return response.data;
  },
};

// Rights API
export const rightsAPI = {
  getCategories: async () => {
    const response = await api.get('/rights/categories');
    return response.data;
  },
  
  getDetail: async (categoryId: string) => {
    const response = await api.get(`/rights/${categoryId}`);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/rights');
    return response.data;
  },
};

export default api;
