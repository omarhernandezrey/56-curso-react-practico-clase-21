/**
 * Custom Hooks
 * Hooks reutilizables para la aplicación
 */

import { useCallback, useState } from 'react';
import { useAppStore } from '@store/index';
import type { Product } from '@types/index';

/**
 * Hook para manejar estado de carga y errores en peticiones
 */
export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return { execute, status, data, error };
};

/**
 * Hook para manejar el carrito de compras
 */
export const useShoppingCart = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useAppStore((state) => ({
    cart: state.cart,
    addToCart: state.addToCart,
    removeFromCart: state.removeFromCart,
    updateCartQuantity: state.updateCartQuantity,
    clearCart: state.clearCart,
    getCartTotal: state.getCartTotal,
    getCartCount: state.getCartCount,
  }));

  return {
    items: cart,
    total: getCartTotal(),
    count: getCartCount(),
    addToCart,
    removeFromCart,
    updateQuantity: updateCartQuantity,
    clear: clearCart,
  };
};

/**
 * Hook para manejar la búsqueda y filtros
 */
export const useSearch = () => {
  const { filters, setSearchQuery, setSelectedCategory, setPriceRange, clearFilters } =
    useAppStore((state) => ({
      filters: state.filters,
      setSearchQuery: state.setSearchQuery,
      setSelectedCategory: state.setSelectedCategory,
      setPriceRange: state.setPriceRange,
      clearFilters: state.clearFilters,
    }));

  const search = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery]
  );

  const filterByCategory = useCallback(
    (categoryId: number | null) => {
      setSelectedCategory(categoryId);
    },
    [setSelectedCategory]
  );

  const filterByPrice = useCallback(
    (min: number, max: number) => {
      setPriceRange(min, max);
    },
    [setPriceRange]
  );

  return {
    filters,
    search,
    filterByCategory,
    filterByPrice,
    clearFilters,
  };
};

/**
 * Hook para filtrar productos basado en los filtros activos
 */
export const useFilteredProducts = (products: Product[]) => {
  const { filters } = useAppStore((state) => ({
    filters: state.filters,
  }));

  const filtered = products.filter((product) => {
    // Filtro por búsqueda
    if (
      filters.searchQuery &&
      !product.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filtro por categoría
    if (
      filters.selectedCategory !== null &&
      product.category.id !== filters.selectedCategory
    ) {
      return false;
    }

    // Filtro por precio
    if (
      product.price < filters.priceRange.min ||
      product.price > filters.priceRange.max
    ) {
      return false;
    }

    return true;
  });

  return filtered;
};

/**
 * Hook para manejar modales/UI
 */
export const useUIState = () => {
  const {
    isMenuOpen,
    isProductDetailOpen,
    isCheckoutMenuOpen,
    toggleMenu,
    toggleProductDetail,
    toggleCheckoutMenu,
    closeAllModals,
  } = useAppStore((state) => ({
    isMenuOpen: state.isMenuOpen,
    isProductDetailOpen: state.isProductDetailOpen,
    isCheckoutMenuOpen: state.isCheckoutMenuOpen,
    toggleMenu: state.toggleMenu,
    toggleProductDetail: state.toggleProductDetail,
    toggleCheckoutMenu: state.toggleCheckoutMenu,
    closeAllModals: state.closeAllModals,
  }));

  return {
    modals: {
      menu: isMenuOpen,
      productDetail: isProductDetailOpen,
      checkoutMenu: isCheckoutMenuOpen,
    },
    toggle: {
      menu: toggleMenu,
      productDetail: toggleProductDetail,
      checkoutMenu: toggleCheckoutMenu,
    },
    closeAll: closeAllModals,
  };
};

/**
 * Hook para manejar validación de formularios simple
 */
export const useFormValidation = <T extends Record<string, unknown>>(
  initialValues: T,
  onSubmit: (values: T) => void | Promise<void>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
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
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue: (field: keyof T, value: unknown) =>
      setValues((prev) => ({ ...prev, [field]: value })),
  };
};

export default {
  useAsync,
  useShoppingCart,
  useSearch,
  useFilteredProducts,
  useUIState,
  useFormValidation,
};
