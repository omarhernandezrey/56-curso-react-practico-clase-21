/**
 * Main Zustand Store
 * Centraliza todo el estado global de la aplicación
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { CartItem, Product, User, Order, FilterState } from '@types/index';

interface AppStore {
  // Auth state
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;

  // Cart state
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Orders state
  orders: Order[];
  addOrder: (order: Order) => void;
  setOrders: (orders: Order[]) => void;

  // UI state
  isMenuOpen: boolean;
  isProductDetailOpen: boolean;
  isCheckoutMenuOpen: boolean;
  toggleMenu: () => void;
  toggleProductDetail: () => void;
  toggleCheckoutMenu: () => void;
  closeAllModals: () => void;

  // Filter state
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: number | null) => void;
  setPriceRange: (min: number, max: number) => void;
  clearFilters: () => void;

  // Selected product state
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Auth state
        user: null,
        token: localStorage.getItem('token'),
        isAuthenticated: !!localStorage.getItem('token'),
        
        setUser: (user) => set({ user }, false, 'setUser'),
        
        setToken: (token) => {
          if (token) {
            localStorage.setItem('token', token);
          } else {
            localStorage.removeItem('token');
          }
          set({ token, isAuthenticated: !!token }, false, 'setToken');
        },
        
        logout: () => {
          localStorage.removeItem('token');
          set(
            {
              user: null,
              token: null,
              isAuthenticated: false,
              cart: [],
            },
            false,
            'logout'
          );
        },

        // Cart state
        cart: [],
        
        addToCart: (product, quantity) => {
          const state = get();
          const existingItem = state.cart.find((item) => item.product.id === product.id);

          if (existingItem) {
            set(
              {
                cart: state.cart.map((item) =>
                  item.product.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
              },
              false,
              'addToCart'
            );
          } else {
            set(
              {
                cart: [
                  ...state.cart,
                  {
                    id: Date.now(),
                    product,
                    quantity,
                  },
                ],
              },
              false,
              'addToCart'
            );
          }
        },

        removeFromCart: (productId) => {
          const state = get();
          set(
            {
              cart: state.cart.filter((item) => item.product.id !== productId),
            },
            false,
            'removeFromCart'
          );
        },

        updateCartQuantity: (productId, quantity) => {
          const state = get();
          if (quantity <= 0) {
            state.removeFromCart(productId);
            return;
          }
          set(
            {
              cart: state.cart.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
              ),
            },
            false,
            'updateCartQuantity'
          );
        },

        clearCart: () => set({ cart: [] }, false, 'clearCart'),

        getCartTotal: () => {
          const state = get();
          return state.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
        },

        getCartCount: () => {
          const state = get();
          return state.cart.reduce((count, item) => count + item.quantity, 0);
        },

        // Orders state
        orders: [],
        
        addOrder: (order) => {
          const state = get();
          set({ orders: [...state.orders, order] }, false, 'addOrder');
        },

        setOrders: (orders) => set({ orders }, false, 'setOrders'),

        // UI state
        isMenuOpen: false,
        isProductDetailOpen: false,
        isCheckoutMenuOpen: false,

        toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen }), false, 'toggleMenu'),

        toggleProductDetail: () =>
          set(
            (state) => ({ isProductDetailOpen: !state.isProductDetailOpen }),
            false,
            'toggleProductDetail'
          ),

        toggleCheckoutMenu: () =>
          set(
            (state) => ({ isCheckoutMenuOpen: !state.isCheckoutMenuOpen }),
            false,
            'toggleCheckoutMenu'
          ),

        closeAllModals: () =>
          set(
            {
              isMenuOpen: false,
              isProductDetailOpen: false,
              isCheckoutMenuOpen: false,
            },
            false,
            'closeAllModals'
          ),

        // Filter state
        filters: {
          searchQuery: '',
          selectedCategory: null,
          priceRange: { min: 0, max: 1000 },
        },

        setSearchQuery: (query) =>
          set(
            (state) => ({
              filters: { ...state.filters, searchQuery: query },
            }),
            false,
            'setSearchQuery'
          ),

        setSelectedCategory: (categoryId) =>
          set(
            (state) => ({
              filters: { ...state.filters, selectedCategory: categoryId },
            }),
            false,
            'setSelectedCategory'
          ),

        setPriceRange: (min, max) =>
          set(
            (state) => ({
              filters: { ...state.filters, priceRange: { min, max } },
            }),
            false,
            'setPriceRange'
          ),

        clearFilters: () =>
          set(
            {
              filters: {
                searchQuery: '',
                selectedCategory: null,
                priceRange: { min: 0, max: 1000 },
              },
            },
            false,
            'clearFilters'
          ),

        // Selected product state
        selectedProduct: null,

        setSelectedProduct: (product) => set({ selectedProduct: product }, false, 'setSelectedProduct'),
      }),
      {
        name: 'app-store', // nombre de la key en localStorage
        partialize: (state) => ({
          cart: state.cart,
          orders: state.orders,
          token: state.token,
          user: state.user,
        }), // solo persistir estos valores
      }
    ),
    {
      name: 'AppStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// Hooks personalizados para seleccionar partes del estado
export const useAuth = () => {
  return useAppStore((state) => ({
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    setUser: state.setUser,
    setToken: state.setToken,
    logout: state.logout,
  }));
};

export const useCart = () => {
  return useAppStore((state) => ({
    cart: state.cart,
    addToCart: state.addToCart,
    removeFromCart: state.removeFromCart,
    updateCartQuantity: state.updateCartQuantity,
    clearCart: state.clearCart,
    getCartTotal: state.getCartTotal,
    getCartCount: state.getCartCount,
  }));
};

export const useUI = () => {
  return useAppStore((state) => ({
    isMenuOpen: state.isMenuOpen,
    isProductDetailOpen: state.isProductDetailOpen,
    isCheckoutMenuOpen: state.isCheckoutMenuOpen,
    toggleMenu: state.toggleMenu,
    toggleProductDetail: state.toggleProductDetail,
    toggleCheckoutMenu: state.toggleCheckoutMenu,
    closeAllModals: state.closeAllModals,
  }));
};

export const useFilters = () => {
  return useAppStore((state) => ({
    filters: state.filters,
    setSearchQuery: state.setSearchQuery,
    setSelectedCategory: state.setSelectedCategory,
    setPriceRange: state.setPriceRange,
    clearFilters: state.clearFilters,
  }));
};
