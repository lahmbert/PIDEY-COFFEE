'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MenuCard from '@/components/MenuCard';
import { MenuItem, OrderItem, loadStock } from '@/lib/orderUtils';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);

  useEffect(() => {
    const stock = loadStock();
    setMenuItems(stock);

    // Load cart from localStorage
    const savedCart = localStorage.getItem('coffee_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = (item: MenuItem) => {
    if (item.stock > 0) {
      setCart(prev => {
        // Check if item already exists in cart
        const existingItem = prev.find(cartItem => cartItem.id === item.id);

        let newCart;
        if (existingItem) {
          // Increase quantity if item already exists
          newCart = prev.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          // Add new item to cart
          const orderItem: OrderItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image
          };
          newCart = [...prev, orderItem];
        }

        // Save to localStorage
        localStorage.setItem('coffee_cart', JSON.stringify(newCart));
        return newCart;
      });

      // Update stock locally
      setMenuItems(prev =>
        prev.map(menuItem =>
          menuItem.id === item.id
            ? { ...menuItem, stock: menuItem.stock - 1 }
            : menuItem
        )
      );
    }
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">☕ Menu Kopi Kami</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih kopi favorit Anda dari berbagai pilihan menu berkualitas tinggi.
            Stok diperbarui secara real-time.
          </p>
        </div>

        {cart.length > 0 && (
          <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <p className="text-amber-800 font-medium">
              ✅ {getTotalCartItems()} item{getTotalCartItems() > 1 ? 's' : ''} ditambahkan ke keranjang
            </p>
            <a
              href="/order"
              className="inline-block mt-2 bg-amber-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-800 transition-colors"
            >
              Lihat Keranjang →
            </a>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {menuItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">☕</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu Sedang Dimuat</h3>
            <p className="text-gray-600">Mohon tunggu sebentar...</p>
          </div>
        )}
      </main>
    </div>
  );
}