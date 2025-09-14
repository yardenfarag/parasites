import axios from 'axios';
import type { Parasite } from '../types/parasite';

const API_BASE_URL = 'http://localhost:3002';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const parasiteApi = {
  searchParasites: async (query: string, category?: string): Promise<Parasite[]> => {
    const response = await api.get('/parasites/search', {
      params: { q: query, category }
    });
    return response.data;
  },

  getParasiteById: async (id: string): Promise<Parasite | null> => {
    const response = await api.get(`/parasites/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/parasites/categories');
    return response.data;
  },

  getAllParasites: async (category?: string): Promise<Parasite[]> => {
    const response = await api.get('/parasites', {
      params: { category }
    });
    return response.data;
  },
};

export default api;
