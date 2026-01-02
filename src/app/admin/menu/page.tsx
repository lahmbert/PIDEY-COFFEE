'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { MenuItem, loadStock, saveStock } from '@/lib/orderUtils';

export default function AdminMenuPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    stock: 0,
    image: '',
    description: ''
  });
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

  const handleAddItem = () => {
    if (!newItem.name || newItem.price <= 0) {
      alert('Nama dan harga harus diisi dengan benar!');
      return;
    }

    const id = newItem.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const item: MenuItem = {
      id,
      name: newItem.name,
      price: newItem.price,
      stock: newItem.stock,
      image: newItem.image || '/images/default-coffee.jpg',
      description: newItem.description
    };

    const updatedItems = [...menuItems, item];
    setMenuItems(updatedItems);
    saveStock(updatedItems);
    setNewItem({ name: '', price: 0, stock: 0, image: '', description: '' });
    setShowAddForm(false);
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
              <h1 className="text-3xl font-bold text-amber-900">☕ Kelola Menu</h1>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors flex items-center gap-2"
              >
                <span>➕</span>
                Tambah Produk
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
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

            {showAddForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tambah Produk Baru</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Contoh: Kopi Susu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                    <input
                      type="number"
                      value={newItem.stock}
                      onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
                    <input
                      type="text"
                      value={newItem.image}
                      onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="/images/nama-produk.jpg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      rows={3}
                      placeholder="Deskripsi produk..."
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800"
                  >
                    Tambah Produk
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-xl">☕</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.stock > 0 ? 'Tersedia' : 'Habis'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Harga:</span>
                        <span className="font-semibold text-gray-900">Rp{item.price.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Stok:</span>
                        {editingItem?.id === item.id ? (
                          <input
                            type="number"
                            value={editingItem.stock}
                            onChange={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-amber-500"
                            min="0"
                          />
                        ) : (
                          <span className={`font-medium ${
                            item.stock > 5 ? 'text-green-600' :
                            item.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {item.stock}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      {editingItem?.id === item.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                          >
                            💾 Simpan
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                          >
                            ❌ Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-amber-600 hover:text-amber-900 text-sm font-medium"
                        >
                          ✏️ Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && menuItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Produk tidak ditemukan</h3>
                <p className="text-gray-600">Coba kata kunci yang berbeda</p>
              </div>
            )}

            {menuItems.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-4xl mb-4">☕</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu tidak ditemukan</h3>
                <p className="text-gray-600">Belum ada produk yang ditambahkan</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}