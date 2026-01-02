'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { MenuItem, loadStock, saveStock } from '@/lib/orderUtils';

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const loadMenuData = () => {
    const stock = loadStock();
    setMenuItems(stock);
  };

  useEffect(() => {
    loadMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (item: MenuItem) => {
    setEditingItem({ ...item });
  };

  const handleSave = () => {
    if (!editingItem) return;

    const updatedItems = menuItems.map(item =>
      item.id === editingItem.id ? editingItem : item
    );
    setMenuItems(updatedItems);
    saveStock(updatedItems);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const updateStock = (id: string, newStock: number) => {
    if (editingItem && editingItem.id === id) {
      setEditingItem({ ...editingItem, stock: Math.max(0, newStock) });
    }
  };

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
              <h1 className="text-3xl font-bold text-amber-900">☕ Kelola Menu</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {menuItems.map((item) => (
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
                          {editingItem?.id === item.id ? (
                            <input
                              type="number"
                              value={editingItem.stock}
                              onChange={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                              min="0"
                            />
                          ) : (
                            <span className={`text-sm font-medium ${
                              item.stock > 5 ? 'text-green-600' :
                              item.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {item.stock}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.stock > 0 ? 'Tersedia' : 'Habis'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {editingItem?.id === item.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={handleSave}
                                className="text-green-600 hover:text-green-900"
                              >
                                💾 Simpan
                              </button>
                              <button
                                onClick={handleCancel}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                ❌ Batal
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-amber-600 hover:text-amber-900"
                            >
                              ✏️ Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {menuItems.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-4xl mb-4">☕</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu tidak ditemukan</h3>
                <p className="text-gray-600">Data menu belum tersedia</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}