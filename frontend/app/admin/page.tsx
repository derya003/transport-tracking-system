'use client';

import { useQuery } from '@tanstack/react-query';
import { routesApi, vehiclesApi, tripsApi } from '@/lib/api';
import { Route, Bus, Activity, Clock, Settings } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AdminGuard from '@/components/AdminGuard';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const { logout } = useAuth();

  const { data: routes = [] } = useQuery({
    queryKey: ['routes'],
    queryFn: routesApi.getAll,
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesApi.getAll,
  });

  const { data: activeTrips = [] } = useQuery({
    queryKey: ['trips', 'active'],
    queryFn: tripsApi.getActive,
    refetchInterval: 5000,
  });

  const stats = [
    {
      name: 'Toplam Hat',
      value: routes.length,
      icon: Route,
      color: 'bg-blue-500',
      href: '/admin/routes',
    },
    {
      name: 'Toplam Araç',
      value: vehicles.length,
      icon: Bus,
      color: 'bg-green-500',
      href: '/admin/vehicles',
    },
    {
      name: 'Aktif Sefer',
      value: activeTrips.length,
      icon: Activity,
      color: 'bg-yellow-500',
      href: '/admin/vehicles',
    },
    {
      name: 'Araçlar Hat Üzerinde',
      value: vehicles.filter((v) => v.route).length,
      icon: Clock,
      color: 'bg-purple-500',
      href: '/admin/vehicles',
    },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Yönetim Paneli
                </h1>
                <p className="text-gray-600">
                  Toplu taşıma sisteminizi yönetin ve izleyin
                </p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Hızlı Erişim
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href="/admin/routes"
                  className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white hover:from-blue-600 hover:to-indigo-700 transition-all"
                >
                  <Route className="h-8 w-8 mr-4" />
                  <div>
                    <div className="font-bold text-lg">Hat Yönetimi</div>
                    <div className="text-sm text-blue-100">
                      Hat ekle, düzenle ve sil
                    </div>
                  </div>
                </Link>
                <Link
                  href="/admin/vehicles"
                  className="flex items-center p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white hover:from-green-600 hover:to-emerald-700 transition-all"
                >
                  <Bus className="h-8 w-8 mr-4" />
                  <div>
                    <div className="font-bold text-lg">Araç Yönetimi</div>
                    <div className="text-sm text-green-100">
                      Araç ekle ve sefer başlat
                    </div>
                  </div>
                </Link>
                <Link
                  href="/admin/stops"
                  className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white hover:from-purple-600 hover:to-pink-700 transition-all"
                >
                  <Settings className="h-8 w-8 mr-4" />
                  <div>
                    <div className="font-bold text-lg">Durak Yönetimi</div>
                    <div className="text-sm text-purple-100">
                      Durak ekle ve düzenle
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Link
                    key={stat.name}
                    href={stat.href}
                    className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className={`${stat.color} rounded-xl p-4 shadow-lg`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-600 truncate">
                              {stat.name}
                            </dt>
                            <dd className="text-4xl font-bold text-gray-900 mt-1">
                              {stat.value}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Active Trips */}
            <div className="bg-white shadow-lg rounded-xl mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                  🚌 Aktif Seferler
                </h2>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {activeTrips.length === 0 ? (
                  <p className="text-gray-500">Şu anda aktif sefer bulunmuyor.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Araç
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hat
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Başlangıç
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durak Sırası
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeTrips.map((trip) => (
                          <tr key={trip.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {trip.vehicle.busNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                {trip.vehicle.type}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {trip.route.code} - {trip.route.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(trip.startTime).toLocaleString('tr-TR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {trip.currentStopOrder}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
