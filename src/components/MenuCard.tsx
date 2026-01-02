'use client';

import Image from 'next/image';
import CoffeeIcon from './CoffeeIcon';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const isOutOfStock = item.stock <= 0;

  return (
    <div className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100">
      <div className="relative h-48 md:h-56 bg-gradient-to-br from-amber-200 via-orange-200 to-red-200 overflow-hidden flex items-center justify-center">
        <CoffeeIcon type={item.id} className="w-24 h-24 md:w-32 md:h-32 group-hover:scale-110 transition-transform duration-500" />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-lg md:text-xl bg-red-600 px-3 md:px-4 py-2 rounded-full">Out of Stock</span>
          </div>
        )}
        {!isOutOfStock && item.stock <= 3 && (
          <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Limited!
          </div>
        )}
      </div>

      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-amber-900 mb-2 group-hover:text-orange-700 transition-colors">
          {item.name}
        </h3>
        <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 leading-relaxed">{item.description}</p>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 md:mb-4">
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Rp{item.price.toLocaleString('id-ID')}
          </span>
          <span className={`text-xs md:text-sm font-bold px-2 md:px-3 py-1 rounded-full ${
            item.stock > 5 ? 'bg-green-100 text-green-700' :
            item.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
          }`}>
            Stock: {item.stock}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(item)}
          disabled={isOutOfStock}
          className={`w-full py-2 md:py-3 px-4 md:px-6 rounded-xl font-semibold text-sm md:text-lg transition-all duration-300 transform ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 hover:shadow-lg hover:-translate-y-1 active:translate-y-0'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  );
}