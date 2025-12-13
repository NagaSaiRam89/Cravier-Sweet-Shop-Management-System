export type SweetCategory = 
  | 'Chocolates' 
  | 'Candies' 
  | 'Cakes' 
  | 'Cookies' 
  | 'Pastries' 
  | 'Ice Cream'
  | 'Traditional';

export interface Sweet {
  id: string;
  name: string;
  description: string;
  category: SweetCategory;
  price: number;
  quantity: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSweetData {
  name: string;
  description: string;
  category: SweetCategory;
  price: number;
  quantity: number;
  image: string;
}

export interface UpdateSweetData extends Partial<CreateSweetData> {
  id: string;
}

export interface SweetFilters {
  search: string;
  category: SweetCategory | 'all';
  minPrice: number;
  maxPrice: number;
}
