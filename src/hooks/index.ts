/**
 * Custom Hooks Library
 * Hooks reutilizables para patrones comunes en la aplicación
 */

import { useState, useCallback, useMemo } from 'react';
import { useAppStore } from '../store/index.js';
import type { Product } from '../types/index.js';

/**
 * useAsync - Manejar operaciones asincrónicas con loading y error
 * @template T - Tipo de datos retornado
 * @param {Function} asyncFunction - Función asincrónica a ejecutar
 * @returns {Object} - Estado y métodos para manejar la operación
 */
export function useAsync<T>(asyncFunction: () => Promise<T>) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setStatus('error');
    }
  }, [asyncFunction]);

  return { status, data, error, execute };
}

/**
 * useShoppingCart - Gestor simplificado del carrito de compras
 */
export function useShoppingCart() {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useAppStore(
    (state) => ({
      cart: state.cart,
      addToCart: state.addToCart,
      removeFromCart: state.removeFromCart,
      updateQuantity: state.updateQuantity,
      clearCart: state.clearCart,
      getCartTotal: state.getCartTotal,
      getCartCount: state.getCartCount,
    })
  );

  return {
    items: cart,
    total: getCartTotal(),
    count: getCartCount(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}

/**
 * useSearch - Manejo de búsqueda y filtros
 */
export function useSearch() {
  const { searchQuery, selectedCategory, priceRange, setSearchQuery, setSelectedCategory, setPriceRange, clearFilters } = useAppStore(
    (state) => ({
      searchQuery: state.searchQuery,
      selectedCategory: state.selectedCategory,
      priceRange: state.priceRange,
      setSearchQuery: state.setSearchQuery,
      setSelectedCategory: state.setSelectedCategory,
      setPriceRange: state.setPriceRange,
      clearFilters: state.clearFilters,
    })
  );

  return {
    filters: { searchQuery, selectedCategory, priceRange },
    search: setSearchQuery,
    filterByCategory: setSelectedCategory,
    filterByPrice: setPriceRange,
    clearFilters,
  };
}

/**
 * useFilteredProducts - Filtrar productos basado en los filtros activos
 */
export function useFilteredProducts(products: Product[]) {
  const { searchQuery, selectedCategory, priceRange } = useAppStore(
    (state) => ({
      searchQuery: state.searchQuery,
      selectedCategory: state.selectedCategory,
      priceRange: state.priceRange,
    })
  );

  return useMemo(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter((product) =>
        product.category?.name?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by price
    if (priceRange) {
      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange.min && product.price <= priceRange.max
      );
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange]);
}

/**
 * useUIState - Manejar estado de modales y UI
 */
export function useUIState() {
  const { isMenuOpen, isProductDetailOpen, isCheckoutMenuOpen, toggleMenu, toggleProductDetail, toggleCheckoutMenu, closeAllModals } = useAppStore(
    (state) => ({
      isMenuOpen: state.isMenuOpen,
      isProductDetailOpen: state.isProductDetailOpen,
      isCheckoutMenuOpen: state.isCheckoutMenuOpen,
      toggleMenu: state.toggleMenu,
      toggleProductDetail: state.toggleProductDetail,
      toggleCheckoutMenu: state.toggleCheckoutMenu,
      closeAllModals: state.closeAllModals,
    })
  );

  return {
    modals: {
      isMenuOpen,
      isProductDetailOpen,
      isCheckoutMenuOpen,
    },
    toggle: {
      menu: toggleMenu,
      productDetail: toggleProductDetail,
      checkout: toggleCheckoutMenu,
    },
    closeAll: closeAllModals,
  };
}

/**
 * useFormValidation - Validación y manejo de formularios
 * @template T - Tipo del objeto de valores del formulario
 */
export function useFormValidation<T extends Record<string, any>>(initialValues: T, onSubmit: (values: T) => void | Promise<void>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await onSubmit(values);
    },
    [values, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  };
}

/**
 * Export todos los hooks como objeto para facilitar imports
 */
export const Hooks = {
  useAsync,
  useShoppingCart,
  useSearch,
  useFilteredProducts,
  useUIState,
  useFormValidation,
};

export default Hooks;
