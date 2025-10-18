import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuthStore from '../lib/authStore';
import useCartStore from '../lib/cartStore';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              E-Store
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/products"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
              >
                Categories
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600">
              <ShoppingCartIcon className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary-600 rounded-full">
                  {items.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600">
                  <UserIcon className="h-6 w-6" />
                  <span className="text-sm">{user?.firstName}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
