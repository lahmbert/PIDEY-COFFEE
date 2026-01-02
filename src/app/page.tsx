import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-amber-900 mb-6">
            ☕ Pidey Coffee
          </h1>
          <p className="text-xl md:text-2xl text-amber-800 mb-8 font-light">
            Nikmati cita rasa kopi terbaik dengan pengalaman pemesanan yang modern
          </p>
          <p className="text-lg text-amber-700 mb-12 max-w-2xl mx-auto">
            Kami menyajikan berbagai jenis kopi berkualitas tinggi dengan sistem pemesanan
            langsung ke WhatsApp. Stok real-time, pelayanan cepat, dan pengalaman yang tak terlupakan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="bg-amber-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-800 transition-colors shadow-lg"
            >
              🍽️ Lihat Menu
            </Link>
            <Link
              href="/order"
              className="bg-white text-amber-900 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-amber-900 hover:bg-amber-50 transition-colors shadow-lg"
            >
              🛒 Order Sekarang
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-3">Order via WhatsApp</h3>
            <p className="text-gray-600">
              Pesan dengan mudah melalui WhatsApp. Sistem otomatis akan mengirim detail pesanan Anda.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-3">Stok Real-time</h3>
            <p className="text-gray-600">
              Pantau ketersediaan menu secara real-time. Stok diperbarui otomatis setiap ada pesanan.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">👨‍💼</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-3">Admin Panel</h3>
            <p className="text-gray-600">
              Sistem manajemen lengkap untuk mengelola pesanan, stok, dan status pengiriman.
            </p>
          </div>
        </div>

        {/* Coffee Types Preview */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-amber-900 mb-8">Menu Unggulan Kami</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Cappuccino', price: 'Rp 25.000', desc: 'Kopi klasik dengan foam susu' },
              { name: 'Espresso', price: 'Rp 20.000', desc: 'Kopi pekat ala Italia' },
              { name: 'Latte', price: 'Rp 28.000', desc: 'Kopi dengan susu steamed' },
            ].map((coffee, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-full h-32 bg-gradient-to-br from-amber-200 to-amber-400 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">☕</span>
                </div>
                <h3 className="font-semibold text-lg text-amber-900">{coffee.name}</h3>
                <p className="text-amber-700 font-bold mb-2">{coffee.price}</p>
                <p className="text-gray-600 text-sm">{coffee.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/menu"
            className="inline-block mt-8 bg-amber-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors"
          >
            Lihat Semua Menu →
          </Link>
        </div>
      </main>
    </div>
  );
}
