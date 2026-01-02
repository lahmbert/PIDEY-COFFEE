'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { MenuItem, loadStock, saveStock } from '@/lib/orderUtils';

export default function AdminStockPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'value'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();

  const loadMenuData = async () => {
    const stock = await loadStock();
    setMenuItems(stock);
  };

  useEffect(() => {
    const init = async () => {
      // Check if already authenticated
      const authStatus = localStorage.getItem('admin_authenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
        await loadMenuData();
      } else {
        // Redirect to main admin page for login
        router.push('/admin');
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStock = (id: string, newStock: number) => {
    const updatedItems = menuItems.map(item =>
      item.id === id ? { ...item, stock: Math.max(0, newStock) } : item
    );
    setMenuItems(updatedItems);
    saveStock(updatedItems);
  };

  const filteredItems = menuItems
    .filter(item => {
      // Filter by stock status
      const statusMatch = (() => {
        switch (filter) {
          case 'low':
            return item.stock > 0 && item.stock <= 5;
          case 'out':
            return item.stock === 0;
          default:
            return true;
        }
      })();

      // Filter by search term
      const searchMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && searchMatch;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'value':
          aValue = a.price * a.stock;
          bValue = b.price * b.stock;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Habis', color: 'bg-red-100 text-red-800' };
    if (stock <= 5) return { text: 'Stok Rendah', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Tersedia', color: 'bg-green-100 text-green-800' };
  };

  const totalValue = menuItems.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const lowStockCount = menuItems.filter(item => item.stock > 0 && item.stock <= 5).length;
  const outOfStockCount = menuItems.filter(item => item.stock === 0).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-gray-600">Memverifikasi akses admin...</p>
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
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-amber-900">📦 Pantau Stok</h1>
              <p className="text-gray-600 mt-1">Kelola inventori produk kopi</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-xl font-bold text-gray-900">{menuItems.length}</div>
                <div className="text-sm text-gray-600">Total Produk</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-xl font-bold text-gray-900">Rp{totalValue.toLocaleString('id-ID')}</div>
                <div className="text-sm text-gray-600">Nilai Stok</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl mb-2">⚠️</div>
                <div className="text-xl font-bold text-yellow-600">{lowStockCount}</div>
                <div className="text-sm text-gray-600">Stok Rendah</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl mb-2">❌</div>
                <div className="text-xl font-bold text-red-600">{outOfStockCount}</div>
                <div className="text-sm text-gray-600">Habis</div>
              </div>
            </div>

            {/* Alerts */}
            {outOfStockCount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="text-red-500 mr-3">⚠️</div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      {outOfStockCount} produk habis stok
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      Segera restock produk yang habis untuk menghindari kehilangan penjualan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {lowStockCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="text-yellow-500 mr-3">🔔</div>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">
                      {lowStockCount} produk stok rendah
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Produk dengan stok ≤5 perlu diisi ulang segera.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-amber-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Semua ({menuItems.length})
              </button>
              <button
                onClick={() => setFilter('low')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'low'
                    ? 'bg-amber-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Stok Rendah ({lowStockCount})
              </button>
              <button
                onClick={() => setFilter('out')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'out'
                    ? 'bg-amber-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Habis ({outOfStockCount})
              </button>
            </div>

            {/* Search and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'stock' | 'value')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                >
                  <option value="name">Urutkan: Nama</option>
                  <option value="stock">Urutkan: Stok</option>
                  <option value="value">Urutkan: Nilai</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  title={sortOrder === 'asc' ? 'Urutkan menurun' : 'Urutkan menaik'}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>

            {/* Stock Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const status = getStockStatus(item.stock);
                return (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xl">☕</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.text}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Harga:</span>
                          <span className="font-semibold text-gray-900">Rp{item.price.toLocaleString('id-ID')}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Stok Saat Ini:</span>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={item.stock}
                              onChange={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 text-sm text-center"
                              min="0"
                            />
                            <span className="text-xs text-gray-500">pcs</span>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStock(item.id, item.stock + 10)}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            title="Tambah 10"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => updateStock(item.id, item.stock + 5)}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            title="Tambah 5"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => updateStock(item.id, 0)}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            title="Set ke 0"
                          >
                            0
                          </button>
                        </div>

                        {/* Stock Level Indicator */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Level Stok</span>
                            <span>{item.stock}/20</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                item.stock === 0 ? 'bg-red-500' :
                                item.stock <= 5 ? 'bg-yellow-500' :
                                item.stock <= 10 ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((item.stock / 20) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Update otomatis</span>
                            <span>💾 Tersimpan</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {filter === 'all' ? 'Tidak ada produk' : `Tidak ada produk ${filter === 'low' ? 'stok rendah' : 'habis'}`}
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' ? 'Belum ada produk yang ditambahkan' : 'Semua produk dalam kondisi baik'}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}