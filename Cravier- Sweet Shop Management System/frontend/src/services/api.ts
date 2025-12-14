import axios from 'axios';
import type { LoginCredentials, RegisterCredentials } from '@/types/user';
import type { CreateSweetData, UpdateSweetData, SweetFilters } from '@/types/sweet';

// 1. Point to your running Backend
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add the Token to every request (for Auth)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to transform MongoDB _id to frontend id
// This handles cases where backend sends _id (raw) or id (formatted)
const mapId = (item: any) => ({ ...item, id: item._id || item.id });

// 3. Export Real API Calls
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (credentials: RegisterCredentials) => {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },
};

export const sweetsApi = {
  getAll: async () => {
    const response = await api.get('/sweets');
    return response.data.map(mapId);
  },
  search: async (filters: SweetFilters) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    
    const response = await api.get(`/sweets/search?${params.toString()}`);
    return response.data.map(mapId);
  },
  create: async (data: CreateSweetData) => {
    const response = await api.post('/sweets', data);
    return mapId(response.data);
  },
  update: async (data: UpdateSweetData) => {
    const response = await api.put(`/sweets/${data.id}`, data);
    return mapId(response.data);
  },
  delete: async (id: string) => {
    await api.delete(`/sweets/${id}`);
  },
  purchase: async (id: string) => {
    const response = await api.post(`/sweets/${id}/purchase`);
    return mapId(response.data);
  },
  restock: async (id: string, quantity: number) => {
    const response = await api.post(`/sweets/${id}/restock`, { amount: quantity });
    return mapId(response.data);
  },
};

export const ordersApi = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data.map(mapId);
  },
  create: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return mapId(response.data);
  }
};