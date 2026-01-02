'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
      const currentStock = await loadStock();
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <Navbar />

        <main className="container mx-auto px-4 py-16 md:py-20">
          <div className="text-center max-w-lg mx-auto">
            <div className="text-6xl md:text-8xl mb-6 md:mb-8 animate-bounce">🛒</div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent mb-4 md:mb-6">
              Keranjang Kosong
            </h1>
            <p className="text-lg md:text-xl text-amber-700 mb-8 md:mb-10 leading-relaxed">
              Belum ada item di keranjang Anda. Mari pilih menu favorit Anda!
            </p>
            <a
              href="/menu"
              className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                🍽️ Lihat Menu
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-7xl mb-6">🛒</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-red-700 bg-clip-text text-transparent mb-4">
              Keranjang Pesanan
            </h1>
            <p className="text-xl text-amber-800">Siap untuk checkout? Konfirmasi pesanan Anda di bawah.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 mb-8 border border-amber-100">
            <div className="space-y-4 md:space-y-6">
              {cart.map((item, index) => (
                <div key={item.id} className={`flex flex-col md:flex-row md:items-center md:justify-between border-b border-amber-100 pb-4 md:pb-6 animate-fade-in`} style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-center space-x-4 md:space-x-6 mb-4 md:mb-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-200 to-orange-200 rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/80x80/8B4513/FFFFFF?text=${encodeURIComponent(item.name)}`;
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg md:text-xl text-amber-900 mb-1">{item.name}</h3>
                      <p className="text-lg md:text-2xl font-bold text-orange-600">Rp{item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
                    <div className="flex items-center justify-center md:justify-start space-x-3 bg-amber-50 rounded-xl md:rounded-2xl p-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors shadow-md hover:shadow-lg"
                      >
                        <span className="text-lg md:text-xl font-bold text-amber-700">-</span>
                      </button>
                      <span className="w-10 md:w-12 text-center font-bold text-lg md:text-xl text-amber-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors shadow-md hover:shadow-lg"
                      >
                        <span className="text-lg md:text-xl font-bold text-amber-700">+</span>
                      </button>
                    </div>

                    <div className="text-center md:text-right min-w-[120px]">
                      <p className="font-bold text-xl md:text-2xl text-orange-600">
                        Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-10 h-10 md:w-12 md:h-12 bg-red-100 hover:bg-red-200 rounded-xl md:rounded-2xl flex items-center justify-center transition-colors shadow-md hover:shadow-lg group self-center md:self-auto"
                    >
                      <span className="text-lg md:text-xl group-hover:scale-110 transition-transform">🗑️</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t-2 border-amber-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-50 to-orange-50 p-4 md:p-6 rounded-xl md:rounded-2xl">
                <span className="text-amber-900 mb-2 md:mb-0">Total Pembayaran:</span>
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Rp{getTotal().toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 shadow-lg">
            <h3 className="font-bold text-blue-900 mb-3 md:mb-4 text-lg md:text-xl flex items-center gap-2">
              <span className="text-xl md:text-2xl">📱</span>
              Cara Pemesanan:
            </h3>
            <ol className="text-blue-800 text-sm md:text-base space-y-2">
              <li className="flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold">1</span>
                Klik tombol &quot;Pesan via WhatsApp&quot; di bawah
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold">2</span>
                Pesan akan otomatis terkirim ke admin
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold">3</span>
                Admin akan memproses pesanan Anda
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold">4</span>
                Cek status pesanan dengan SN yang diberikan
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <a
              href="/menu"
              className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg hover:from-gray-300 hover:to-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center flex items-center justify-center gap-2"
            >
              <span>←</span>
              Tambah Menu Lain
            </a>

            <button
              onClick={placeOrder}
              disabled={isProcessing}
              className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex-1 flex items-center justify-center gap-2 md:gap-3 ${
                isProcessing ? 'opacity-50 cursor-not-allowed transform-none' : ''
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin">🔄</span>
                  Memproses...
                </>
              ) : (
                <>
                  <span>📱</span>
                  Pesan via WhatsApp
                  <span className="text-base md:text-lg">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}