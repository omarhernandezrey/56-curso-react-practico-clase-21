/**
 * Application Type Definitions
 * Tipos centralizados para la aplicación
 */

// Product types
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    image: string;
  };
  images: string[];
  creationAt: string;
  updatedAt: string;
}

// User types
export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: 'customer' | 'admin';
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Cart item types
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

// Order types
export interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  images: string[];
}

export interface Order {
  id: number;
  date: string;
  totalPrice: number;
  totalProducts: number;
  products: OrderItem[];
}

// UI/Filter types
export interface FilterState {
  searchQuery: string;
  selectedCategory: number | null;
  priceRange: {
    min: number;
    max: number;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
