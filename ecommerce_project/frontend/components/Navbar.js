import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCartIcon, UserIcon, MenuIcon, XIcon } from '@heroicons/react/outline';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount } = useCart();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              E-Shop
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-primary-600">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600">
              <ShoppingCartIcon className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-gray-700 hover:text-primary-600">
                  <UserIcon className="h-6 w-6" />
                </Link>
                <button onClick={logout} className="btn-secondary">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/products" className="block px-3 py-2 text-gray-700">
              Products
            </Link>
            <Link href="/categories" className="block px-3 py-2 text-gray-700">
              Categories
            </Link>
            <Link href="/cart" className="block px-3 py-2 text-gray-700">
              Cart ({getCartItemsCount()})
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="block px-3 py-2 text-gray-700">
                  Profile
                </Link>
                <button onClick={logout} className="block w-full text-left px-3 py-2 text-gray-700">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-gray-700">
                  Login
                </Link>
                <Link href="/register" className="block px-3 py-2 text-gray-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
