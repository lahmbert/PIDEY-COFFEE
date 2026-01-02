'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-lg md:text-2xl font-bold text-white hover:text-amber-100 transition-colors flex items-center gap-2 md:gap-3 group">
              <span className="text-2xl md:text-4xl group-hover:rotate-12 transition-transform duration-300">☕</span>
              <span className="bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent hidden sm:block">
                Pidey Coffee
              </span>
              <span className="bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent sm:hidden">
                Pidey
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 lg:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-amber-100 p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-amber-500/30 mt-2 pt-4 pb-2">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                    pathname === item.href
                      ? 'bg-white text-amber-900 shadow-lg'
                      : 'text-white hover:bg-white/10 hover:text-amber-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}