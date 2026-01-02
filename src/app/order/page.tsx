'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { OrderItem, Order, generateSN, createWhatsAppMessage, loadOrders, saveOrders, loadStock, saveStock, updateStockAfterOrder } from '@/lib/orderUtils';

export default function OrderPage() {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('coffee_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    setCart(prev => {
      const newCart = prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('coffee_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeItem = (id: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== id);
      localStorage.setItem('coffee_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);

    try {
      // Generate SN
      const sn = generateSN();

      // Create order object
      const order: Order = {
        sn,
        items: cart,
        total: getTotal(),
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        whatsappMessage: createWhatsAppMessage({
          sn,
          items: cart,
          total: getTotal(),
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          whatsappMessage: ''
        })
      };

      // Save order
      const orders = loadOrders();
      orders.push(order);
      saveOrders(orders);

      // Update stock
      const currentStock = loadStock();
      const updatedStock = updateStockAfterOrder(currentStock, cart);
      saveStock(updatedStock);

      // Clear cart
      setCart([]);
      localStorage.removeItem('coffee_cart');

      // Redirect to WhatsApp
      const whatsappUrl = `https://wa.me/6285334679379?text=${encodeURIComponent(order.whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      // Show success message and redirect to status page
      alert(`Pesanan berhasil dibuat!\nSN: ${sn}\nSilakan lanjutkan di WhatsApp untuk konfirmasi.`);
      router.push(`/status?sn=${sn}`);

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Keranjang Kosong</h1>
            <p className="text-gray-600 mb-8">
              Belum ada item di keranjang Anda. Mari pilih menu favorit Anda!
            </p>
            <a
              href="/menu"
              className="bg-amber-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors inline-block"
            >
              Lihat Menu
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 mb-8">🛒 Keranjang Pesanan</h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">☕</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-amber-700 font-medium">Rp{item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-amber-900">Rp{getTotal().toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📱 Cara Pemesanan:</h3>
            <ol className="text-blue-800 text-sm space-y-1">
              <li>1. Klik tombol &quot;Pesan via WhatsApp&quot; di bawah</li>
              <li>2. Pesan akan otomatis terkirim ke admin</li>
              <li>3. Admin akan memproses pesanan Anda</li>
              <li>4. Cek status pesanan dengan SN yang diberikan</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/menu"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center"
            >
              ← Tambah Menu Lain
            </a>

            <button
              onClick={placeOrder}
              disabled={isProcessing}
              className={`bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex-1 ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? '🔄 Memproses...' : '📱 Pesan via WhatsApp'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}