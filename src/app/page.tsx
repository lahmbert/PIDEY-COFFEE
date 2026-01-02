import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navbar />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Coffee Cup Animation */}
          <div className="mb-6 md:mb-8 animate-bounce">
            <span className="text-6xl md:text-8xl lg:text-9xl">☕</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-red-700 bg-clip-text text-transparent mb-4 md:mb-6 animate-fade-in px-2">
            Pidey Coffee
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-amber-800 mb-6 md:mb-8 font-light leading-relaxed px-2">
            Nikmati cita rasa kopi terbaik dengan pengalaman pemesanan yang modern
          </p>
          <p className="text-base sm:text-lg text-amber-700 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Kami menyajikan berbagai jenis kopi berkualitas tinggi dengan sistem pemesanan
            langsung ke WhatsApp. Stok real-time, pelayanan cepat, dan pengalaman yang tak terlupakan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4">
            <Link
              href="/menu"
              className="group bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 md:px-10 py-4 md:py-5 rounded-2xl font-semibold text-base md:text-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                🍽️ Lihat Menu
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
            <Link
              href="/order"
              className="group bg-white text-amber-900 px-6 md:px-10 py-4 md:py-5 rounded-2xl font-semibold text-base md:text-lg border-2 border-amber-600 hover:bg-amber-50 hover:border-amber-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                🛒 Order Sekarang
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
          <div className="group bg-white p-6 md:p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100">
            <div className="text-4xl md:text-6xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">📱</div>
            <h3 className="text-lg md:text-xl font-bold text-amber-900 mb-3 md:mb-4">Order via WhatsApp</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Pesan dengan mudah melalui WhatsApp. Sistem otomatis akan mengirim detail pesanan Anda.
            </p>
          </div>

          <div className="group bg-white p-6 md:p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100">
            <div className="text-4xl md:text-6xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">⚡</div>
            <h3 className="text-lg md:text-xl font-bold text-amber-900 mb-3 md:mb-4">Stok Real-time</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Pantau ketersediaan menu secara real-time. Stok diperbarui otomatis setiap ada pesanan.
            </p>
          </div>

          <div className="group bg-white p-6 md:p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100 sm:col-span-2 lg:col-span-1">
            <div className="text-4xl md:text-6xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">👨‍💼</div>
            <h3 className="text-lg md:text-xl font-bold text-amber-900 mb-3 md:mb-4">Admin Panel</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Sistem manajemen lengkap untuk mengelola pesanan, stok, dan status pengiriman.
            </p>
          </div>
        </div>

        {/* Coffee Types Preview */}
        <div className="mt-16 md:mt-24 text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent mb-8 md:mb-12">
            Menu Unggulan Kami
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Cappuccino', price: 'Rp 25.000', desc: 'Kopi klasik dengan foam susu', icon: '☕' },
              { name: 'Espresso', price: 'Rp 20.000', desc: 'Kopi pekat ala Italia', icon: '⚡' },
              { name: 'Latte', price: 'Rp 28.000', desc: 'Kopi dengan susu steamed', icon: '🥛' },
            ].map((coffee, index) => (
              <div key={index} className="group bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-amber-100">
                <div className="w-full h-32 md:h-40 bg-gradient-to-br from-amber-200 via-orange-200 to-red-200 rounded-2xl mb-4 md:mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <span className="text-5xl md:text-6xl group-hover:rotate-12 transition-transform duration-300">{coffee.icon}</span>
                </div>
                <h3 className="font-bold text-lg md:text-xl text-amber-900 mb-2">{coffee.name}</h3>
                <p className="text-xl md:text-2xl font-bold text-orange-600 mb-2 md:mb-3">{coffee.price}</p>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{coffee.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/menu"
            className="inline-block mt-8 md:mt-12 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold text-base md:text-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Lihat Semua Menu →
          </Link>
        </div>
      </main>
    </div>
  );
}
