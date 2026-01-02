'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { MenuItem, loadStock, saveStock } from '@/lib/orderUtils';

export default function AdminStockPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  const loadMenuData = () => {
    const stock = loadStock();
    setMenuItems(stock);
  };

  useEffect(() => {
    loadMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStock = (id: string, newStock: number) => {
    const updatedItems = menuItems.map(item =>
      item.id === id ? { ...item, stock: Math.max(0, newStock) } : item
    );
    setMenuItems(updatedItems);
    saveStock(updatedItems);
  };

  const filteredItems = menuItems.filter(item => {
    switch (filter) {
      case 'low':
        return item.stock > 0 && item.stock <= 5;
      case 'out':
        return item.stock === 0;
      default:
        return true;
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

            {/* Filter Buttons */}
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

            {/* Stock List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredItems.map((item) => {
                      const status = getStockStatus(item.stock);
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-lg">☕</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Rp{item.price.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={item.stock}
                              onChange={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 text-sm"
                              min="0"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                              {status.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Rp{(item.price * item.stock).toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Auto-save
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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