//Manages the list of products in memory. Handles filtering so the customer sees results instantly without waiting.

//Inventory updates are reflected immediately in the UI, with backend sync happening in the background.

//Includes functions to purchase, create, update, delete, and restock sweets.


import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Sweet, CreateSweetData, UpdateSweetData, SweetFilters, SweetCategory } from '@/types/sweet';
import { sweetsApi } from '@/services/api';

interface SweetContextType {
  sweets: Sweet[];
  filteredSweets: Sweet[];
  isLoading: boolean;
  filters: SweetFilters;
  categories: SweetCategory[];
  setFilters: (filters: Partial<SweetFilters>) => void;
  resetFilters: () => void;
  purchase: (id: string) => Promise<void>;
  create: (data: CreateSweetData) => Promise<void>;
  update: (data: UpdateSweetData) => Promise<void>;
  remove: (id: string) => Promise<void>;
  restock: (id: string, quantity: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const defaultFilters: SweetFilters = {
  search: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 100,
};

const categories: SweetCategory[] = [
  'Chocolates',
  'Candies',
  'Cakes',
  'Cookies',
  'Pastries',
  'Ice Cream',
  'Traditional',
];
// Create Context
const SweetContext = createContext<SweetContextType | undefined>(undefined);
// Provider Component
export function SweetProvider({ children }: { children: React.ReactNode }) {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFiltersState] = useState<SweetFilters>(defaultFilters);
  // Fetch Sweets
  const fetchSweets = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await sweetsApi.getAll();
      setSweets(data);
      setFilteredSweets(data);
    } catch (error) {
      console.error('Failed to fetch sweets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);
// Apply Filters
  useEffect(() => {
    const applyFilters = async () => {
      const filtered = await sweetsApi.search({
        search: filters.search || undefined,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      });
      setFilteredSweets(filtered);
    };
    
    applyFilters();
  }, [filters]);
// Set Filters
  const setFilters = useCallback((newFilters: Partial<SweetFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  const purchase = useCallback(async (id: string) => {
    // Optimistic update
    setSweets(prev => prev.map(s => 
      s.id === id ? { ...s, quantity: Math.max(0, s.quantity - 1) } : s
    ));
    setFilteredSweets(prev => prev.map(s => 
      s.id === id ? { ...s, quantity: Math.max(0, s.quantity - 1) } : s
    ));
    
    try {
      await sweetsApi.purchase(id);
    } catch (error) {
      // Revert on error
      await fetchSweets();
      throw error;
    }
  }, [fetchSweets]);
// Create Sweet
  const create = useCallback(async (data: CreateSweetData) => {
    const newSweet = await sweetsApi.create(data);
    setSweets(prev => [...prev, newSweet]);
    setFilteredSweets(prev => [...prev, newSweet]);
  }, []);
// Update Sweet
  const update = useCallback(async (data: UpdateSweetData) => {
    const updated = await sweetsApi.update(data);
    setSweets(prev => prev.map(s => s.id === data.id ? updated : s));
    setFilteredSweets(prev => prev.map(s => s.id === data.id ? updated : s));
  }, []);
//  Delete Sweet
  const remove = useCallback(async (id: string) => {
    await sweetsApi.delete(id);
    setSweets(prev => prev.filter(s => s.id !== id));
    setFilteredSweets(prev => prev.filter(s => s.id !== id));
  }, []);
//  Restock Sweet
  const restock = useCallback(async (id: string, quantity: number) => {
    const updated = await sweetsApi.restock(id, quantity);
    setSweets(prev => prev.map(s => s.id === id ? updated : s));
    setFilteredSweets(prev => prev.map(s => s.id === id ? updated : s));
  }, []);

  const value: SweetContextType = {
    sweets,
    filteredSweets,
    isLoading,
    filters,
    categories,
    setFilters,
    resetFilters,
    purchase,
    create,
    update,
    remove,
    restock,
    refresh: fetchSweets,
  };

  return <SweetContext.Provider value={value}>{children}</SweetContext.Provider>;
}

export function useSweets() {
  const context = useContext(SweetContext);
  if (context === undefined) {
    throw new Error('useSweets must be used within a SweetProvider');
  }
  return context;
}
