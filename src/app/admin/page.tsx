'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { Order, loadOrders } from '@/lib/orderUtils';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadAdminData = () => {
    const allOrders = loadOrders();
    setOrders(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadAdminData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (in production, use proper authentication)
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      loadAdminData();
    } else {
      alert('Password salah!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROSES': return 'bg-blue-100 text-blue-800';
      case 'SUKSES': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-amber-900 mb-2">🔐 Admin Login</h1>
            <p className="text-gray-600">Masukkan password untuk mengakses panel admin</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-900 text-white py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors"
            >
              Masuk
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Password default: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 lg:ml-0">
          {/* Mobile menu button */}
          <div className="lg:hidden bg-amber-900 text-white p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:text-amber-200"
            >
              ☰ Menu
            </button>
          </div>

          <main className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-amber-900">📊 Dashboard Admin</h1>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link href="/admin/orders" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">📋</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Kelola Pesanan</h3>
                    <p className="text-gray-600">Lihat dan update status pesanan</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/menu" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">☕</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Kelola Menu</h3>
                    <p className="text-gray-600">Tambah, edit produk dan stok</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/stock" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">📦</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Pantau Stok</h3>
                    <p className="text-gray-600">Monitor inventori produk</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
              <div className="bg-white p-3 md:p-6 rounded-lg shadow-md">
                <div className="text-lg md:text-2xl mb-1 md:mb-2">📋</div>
                <div className="text-xl md:text-3xl font-bold text-gray-900">{orders.length}</div>
                <div className="text-xs md:text-sm text-gray-600">Total Pesanan</div>
              </div>

              <div className="bg-white p-3 md:p-6 rounded-lg shadow-md">
                <div className="text-lg md:text-2xl mb-1 md:mb-2">⏳</div>
                <div className="text-xl md:text-3xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'PENDING').length}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Pending</div>
              </div>

              <div className="bg-white p-3 md:p-6 rounded-lg shadow-md">
                <div className="text-lg md:text-2xl mb-1 md:mb-2">🔄</div>
                <div className="text-xl md:text-3xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'PROSES').length}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Diproses</div>
              </div>

              <div className="bg-white p-3 md:p-6 rounded-lg shadow-md">
                <div className="text-lg md:text-2xl mb-1 md:mb-2">✅</div>
                <div className="text-xl md:text-3xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'SUKSES').length}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Selesai</div>
              </div>
            </div>

            {/* Recent Orders Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Pesanan Terbaru</h2>
                <Link href="/admin/orders" className="text-amber-600 hover:text-amber-800 text-sm font-medium">
                  Lihat Semua →
                </Link>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.sn} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-900">{order.sn}</div>
                        <div className="text-sm text-gray-500">{order.items.length} item</div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        Rp{order.total.toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-3xl mb-3">📋</div>
                  <p className="text-gray-500">Belum ada pesanan</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}