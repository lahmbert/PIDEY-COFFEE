'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/order', label: 'Order' },
    { href: '/status', label: 'Status' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <nav className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-amber-100 transition-colors flex items-center gap-3 group">
              <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">☕</span>
              <span className="bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                Pidey Coffee
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                  pathname === item.href
                    ? 'bg-white text-amber-900 shadow-lg'
                    : 'text-white hover:bg-white/10 hover:text-amber-100 hover:shadow-lg'
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-900 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}