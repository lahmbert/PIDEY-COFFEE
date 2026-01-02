'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminStockPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to menu page since stock management is part of menu management
    router.replace('/admin/menu');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🔄</div>
        <p className="text-gray-600">Mengalihkan ke halaman Menu...</p>
      </div>
    </div>
  );
}