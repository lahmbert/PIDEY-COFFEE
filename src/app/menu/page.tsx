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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="text-7xl animate-bounce">☕</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-red-700 bg-clip-text text-transparent mb-6">
            Menu Kopi Kami
          </h1>
          <p className="text-xl text-amber-800 max-w-3xl mx-auto leading-relaxed">
            Pilih kopi favorit Anda dari berbagai pilihan menu berkualitas tinggi.
            Stok diperbarui secara real-time untuk pengalaman terbaik.
          </p>
        </div>

        {cart.length > 0 && (
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 rounded-2xl p-6 mb-12 max-w-3xl mx-auto shadow-xl animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🛒</span>
                <div>
                  <p className="text-amber-900 font-bold text-lg">
                    {getTotalCartItems()} item{getTotalCartItems() > 1 ? 's' : ''} ditambahkan ke keranjang
                  </p>
                  <p className="text-amber-700 text-sm">Siap untuk checkout!</p>
                </div>
              </div>
              <a
                href="/order"
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Lihat Keranjang →
              </a>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {menuItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-spin">☕</div>
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Menu Sedang Dimuat</h3>
            <p className="text-amber-700 text-lg">Mohon tunggu sebentar...</p>
          </div>
        )}
      </main>
    </div>
  );
}