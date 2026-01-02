'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Order, loadOrders, updateOrderStatus } from '@/lib/orderUtils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<string>('ALL');

  const loadAdminData = () => {
    const allOrders = loadOrders();
    setOrders(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  useEffect(() => {
    loadAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = (sn: string, newStatus: Order['status']) => {
    updateOrderStatus(sn, newStatus);
    loadAdminData(); // Reload data
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROSES': return 'bg-blue-100 text-blue-800';
      case 'SUKSES': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'ALL') return true;
    return order.status === filter;
  });

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
              <h1 className="text-3xl font-bold text-amber-900">📋 Kelola Pesanan</h1>
            </div>

            {/* Filter */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex flex-wrap gap-2">
                {['ALL', 'PENDING', 'PROSES', 'SUKSES'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filter === status
                        ? 'bg-amber-900 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status === 'ALL' ? 'Semua' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.sn} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        SN: {order.sn}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(order.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-amber-900">
                          Rp{order.total.toLocaleString('id-ID')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>

                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.sn, e.target.value as Order['status'])}
                        className={`px-3 py-2 rounded-lg font-medium border-0 ${getStatusColor(order.status)}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROSES">PROSES</option>
                        <option value="SUKSES">SUKSES</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">☕</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              x{item.quantity} - Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {filter === 'ALL' ? 'Belum ada pesanan' : `Tidak ada pesanan ${filter.toLowerCase()}`}
                </h3>
                <p className="text-gray-600">
                  {filter === 'ALL' ? 'Pesanan akan muncul di sini' : 'Coba filter lainnya'}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}