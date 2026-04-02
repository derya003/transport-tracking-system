'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bus, BarChart3, MapPin, Route, Activity, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const passengerNavigation = [
  { name: 'Ana Sayfa', href: '/', icon: Bus },
  { name: 'İstatistikler', href: '/stats', icon: Activity },
];

const adminNavigation = [
  { name: 'Yönetim Paneli', href: '/admin', icon: BarChart3 },
  { name: 'Hatlar', href: '/admin/routes', icon: Route },
  { name: 'Duraklar', href: '/admin/stops', icon: MapPin },
  { name: 'Araçlar', href: '/admin/vehicles', icon: Bus },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isAdmin, logout } = useAuth();

  // Admin sayfalarında admin navigation göster (login sayfası hariç)
  const isAdminPage = pathname?.startsWith('/admin') && pathname !== '/admin/login';
  const navigation = isAdminPage ? adminNavigation : passengerNavigation;

  return (
    <nav className="bg-white shadow-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-2 mr-3">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Toplu Taşıma Takip
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            {pathname !== '/admin/login' && (
              <>
                {isAdmin && isAdminPage ? (
                  <button
                    onClick={logout}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                  >
                    Çıkış Yap
                  </button>
                ) : (
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Yönetici Girişi
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center pl-3 pr-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
          {pathname !== '/admin/login' && (
            <>
              {isAdmin && isAdminPage ? (
                <button
                  onClick={logout}
                  className="w-full flex items-center pl-3 pr-4 py-2 rounded-lg text-base font-medium text-red-700 hover:bg-red-50"
                >
                  Çıkış Yap
                </button>
              ) : (
                <Link
                  href="/admin/login"
                  className="flex items-center pl-3 pr-4 py-2 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Lock className="h-5 w-5 mr-3" />
                  Yönetici Girişi
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
