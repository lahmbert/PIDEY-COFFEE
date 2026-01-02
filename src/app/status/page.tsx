'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Order, getOrderBySN } from '@/lib/orderUtils';

function StatusPageContent() {
  const [sn, setSn] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  const checkStatus = useCallback((searchSn: string = sn) => {
    if (!searchSn.trim()) {
      setError('Masukkan Serial Number (SN) pesanan');
      setOrder(null);
      return;
    }

    const foundOrder = getOrderBySN(searchSn);
    if (foundOrder) {
      setOrder(foundOrder);
      setError('');
    } else {
      setOrder(null);
      setError('Pesanan dengan SN tersebut tidak ditemukan');
    }
  }, [sn]);

  useEffect(() => {
    const snParam = searchParams.get('sn');
    if (snParam) {
      setSn(snParam);
      checkStatus(snParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, checkStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROSES': return 'bg-blue-100 text-blue-800';
      case 'SUKSES': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'PROSES': return '🔄';
      case 'SUKSES': return '✅';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-4">📊 Cek Status Pesanan</h1>
            <p className="text-gray-600">
              Masukkan Serial Number (SN) pesanan Anda untuk melihat status terkini
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={sn}
                onChange={(e) => setSn(e.target.value)}
                placeholder="Masukkan SN (contoh: CS-20260102-001)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button
                onClick={() => checkStatus()}
                className="bg-amber-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors"
              >
                🔍 Cek Status
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {order && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detail Pesanan</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Informasi Pesanan</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">SN:</span> {order.sn}</p>
                    <p><span className="font-medium">Tanggal:</span> {new Date(order.createdAt).toLocaleString('id-ID')}</p>
                    <p><span className="font-medium">Total:</span> Rp{order.total.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Status Progress</h3>
                  <div className="space-y-2">
                    <div className={`flex items-center space-x-2 ${order.status === 'PENDING' || order.status === 'PROSES' || order.status === 'SUKSES' ? 'text-green-600' : 'text-gray-400'}`}>
                      <span>📱</span>
                      <span className="text-sm">Pesanan Diterima</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${order.status === 'PROSES' || order.status === 'SUKSES' ? 'text-green-600' : 'text-gray-400'}`}>
                      <span>🔄</span>
                      <span className="text-sm">Sedang Diproses</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${order.status === 'SUKSES' ? 'text-green-600' : 'text-gray-400'}`}>
                      <span>✅</span>
                      <span className="text-sm">Selesai</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Detail Menu</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">☕</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">x{item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {order.status === 'SUKSES' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    🎉 Pesanan Anda telah selesai! Terima kasih telah memesan di Pidey Coffee.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Memuat halaman status...</p>
          </div>
        </main>
      </div>
    }>
      <StatusPageContent />
    </Suspense>
  );
}