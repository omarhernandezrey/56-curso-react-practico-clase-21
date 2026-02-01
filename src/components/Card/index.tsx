/**
 * Card Component
 * Componente para mostrar un producto individual en la tienda
 */

import { FC } from 'react';
import { useShoppingCart } from '../../hooks/index.js';
import type { Product } from '../../types/index.js';

interface CardProps {
  data: Product;
  onViewDetails?: (product: Product) => void;
}

/**
 * Card - Product card component
 */
const Card: FC<CardProps> = ({ data, onViewDetails }) => {
  const { addToCart } = useShoppingCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addToCart(data);
  };

  const handleViewDetails = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(data);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleViewDetails}
    >
      {/* Product Image */}
      <div className="relative w-full h-40 mb-3 overflow-hidden rounded-md bg-gray-100">
        {data.images && data.images.length > 0 ? (
          <img
            src={data.images[0]}
            alt={data.name || 'Product'}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-2">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-10">
          {data.name || 'Sin nombre'}
        </h3>

        {/* Category */}
        {data.category && (
          <p className="text-xs text-gray-500">{data.category.name}</p>
        )}

        {/* Price and Button */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold text-blue-600">
            ${data.price?.toFixed(2) || '0.00'}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded transition"
            title="Agregar al carrito"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
