/**
 * Card Component - TypeScript version
 * Componente para mostrar un producto
 */

import { FC } from 'react';
import { useShoppingCart } from '@hooks/index';
import type { Product } from '@types/index';

interface CardProps {
  data: Product;
  onViewDetails?: (product: Product) => void;
}

const Card: FC<CardProps> = ({ data, onViewDetails }) => {
  const { addToCart } = useShoppingCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    addToCart(data, 1);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(data);
    }
  };

  return (
    <div
      className="bg-white cursor-pointer w-56 h-60 rounded-lg"
      onClick={handleViewDetails}
    >
      <figure className="relative mb-2 w-full h-4/5 overflow-hidden rounded-lg">
        <img
          src={data.images?.[0] || 'https://via.placeholder.com/400'}
          alt={data.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div
          className="absolute top-0 right-0 flex justify-center items-center bg-white w-8 h-8 rounded-full m-2 p-1 cursor-pointer hover:bg-gray-100"
          onClick={handleAddToCart}
        >
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      </figure>
      <p className="flex justify-between items-start px-4 pb-4">
        <span className="text-sm font-light truncate">{data.title}</span>
        <span className="text-lg font-medium">${data.price}</span>
      </p>
    </div>
  );
};

export default Card;
