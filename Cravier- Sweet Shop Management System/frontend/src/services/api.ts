import axios from 'axios';
import type { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/user';
import type { Sweet, CreateSweetData, UpdateSweetData, SweetCategory } from '@/types/sweet';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage
let mockSweets: Sweet[] = [
  {
    id: '1',
    name: 'Belgian Dark Chocolate',
    description: 'Rich and intense dark chocolate made from premium Belgian cocoa',
    category: 'Chocolates',
    price: 12.99,
    quantity: 25,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Strawberry Macarons',
    description: 'Delicate French macarons with fresh strawberry filling',
    category: 'Pastries',
    price: 8.99,
    quantity: 40,
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Butter Cookies',
    description: 'Classic Danish butter cookies with a melt-in-your-mouth texture',
    category: 'Cookies',
    price: 6.99,
    quantity: 0,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Vanilla Bean Cheesecake',
    description: 'Creamy New York style cheesecake with real vanilla beans',
    category: 'Cakes',
    price: 24.99,
    quantity: 8,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Fruit Gummy Bears',
    description: 'Colorful gummy bears made with real fruit juice',
    category: 'Candies',
    price: 4.99,
    quantity: 100,
    image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Salted Caramel Truffles',
    description: 'Handcrafted truffles with a perfect balance of sweet and salty',
    category: 'Chocolates',
    price: 15.99,
    quantity: 20,
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Pistachio Gelato',
    description: 'Authentic Italian gelato made with Sicilian pistachios',
    category: 'Ice Cream',
    price: 7.99,
    quantity: 15,
    image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Gulab Jamun',
    description: 'Traditional Indian sweet dumplings soaked in rose syrup',
    category: 'Traditional',
    price: 9.99,
    quantity: 30,
    image: 'https://images.unsplash.com/photo-1666190077484-ec5ed4906ffc?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Red Velvet Cupcake',
    description: 'Moist red velvet cupcakes with cream cheese frosting',
    category: 'Cakes',
    price: 5.99,
    quantity: 45,
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Almond Biscotti',
    description: 'Crunchy Italian biscotti perfect for dipping in coffee',
    category: 'Cookies',
    price: 8.49,
    quantity: 35,
    image: 'https://images.unsplash.com/photo-1619149651173-a4d8de2ec33a?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'Mango Sticky Rice',
    description: 'Thai dessert with sweet coconut sticky rice and fresh mango',
    category: 'Traditional',
    price: 11.99,
    quantity: 12,
    image: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '12',
    name: 'Lollipop Collection',
    description: 'Artisanal lollipops in assorted fruit flavors',
    category: 'Candies',
    price: 3.99,
    quantity: 80,
    image: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@sweetshop.com',
    name: 'Shop Admin',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(800);
    
    const user = mockUsers.find(u => u.email === credentials.email);
    
    // Hardcoded admin check
    if (credentials.email === 'admin@sweetshop.com' && credentials.password === 'admin123') {
      const adminUser = mockUsers[0];
      return {
        user: adminUser,
        token: 'mock-jwt-token-admin-' + Date.now(),
      };
    }
    
    if (user && credentials.password.length >= 6) {
      return {
        user,
        token: 'mock-jwt-token-user-' + Date.now(),
      };
    }
    
    throw new Error('Invalid email or password');
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    await delay(800);
    
    if (mockUsers.some(u => u.email === credentials.email)) {
      throw new Error('Email already exists');
    }
    
    const newUser: User = {
      id: 'user-' + Date.now(),
      email: credentials.email,
      name: credentials.name,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    
    return {
      user: newUser,
      token: 'mock-jwt-token-user-' + Date.now(),
    };
  },
};

// Sweets API
export const sweetsApi = {
  getAll: async (): Promise<Sweet[]> => {
    await delay(600);
    return [...mockSweets];
  },

  search: async (filters: {
    search?: string;
    category?: SweetCategory | 'all';
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]> => {
    await delay(400);
    
    let filtered = [...mockSweets];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(s => s.category === filters.category);
    }
    
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(s => s.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(s => s.price <= filters.maxPrice!);
    }
    
    return filtered;
  },

  purchase: async (id: string): Promise<Sweet> => {
    await delay(500);
    
    const index = mockSweets.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Sweet not found');
    if (mockSweets[index].quantity === 0) throw new Error('Out of stock');
    
    mockSweets[index] = {
      ...mockSweets[index],
      quantity: mockSweets[index].quantity - 1,
      updatedAt: new Date().toISOString(),
    };
    
    return mockSweets[index];
  },

  create: async (data: CreateSweetData): Promise<Sweet> => {
    await delay(600);
    
    const newSweet: Sweet = {
      ...data,
      id: 'sweet-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockSweets.push(newSweet);
    return newSweet;
  },

  update: async (data: UpdateSweetData): Promise<Sweet> => {
    await delay(500);
    
    const index = mockSweets.findIndex(s => s.id === data.id);
    if (index === -1) throw new Error('Sweet not found');
    
    mockSweets[index] = {
      ...mockSweets[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    return mockSweets[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(400);
    
    const index = mockSweets.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Sweet not found');
    
    mockSweets.splice(index, 1);
  },

  restock: async (id: string, quantity: number): Promise<Sweet> => {
    await delay(400);
    
    const index = mockSweets.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Sweet not found');
    
    mockSweets[index] = {
      ...mockSweets[index],
      quantity: mockSweets[index].quantity + quantity,
      updatedAt: new Date().toISOString(),
    };
    
    return mockSweets[index];
  },
};

// Axios instance for real API (when backend is ready)
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
