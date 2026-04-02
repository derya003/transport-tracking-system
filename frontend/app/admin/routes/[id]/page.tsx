'use client';

import { useQuery } from '@tanstack/react-query';
import { routesApi } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Route, MapPin, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AdminGuard from '@/components/AdminGuard';

export default function AdminRouteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const routeId = Number(params.id);

  const { data: route } = useQuery({
    queryKey: ['routes', routeId],
    queryFn: () => routesApi.getById(routeId),
    enabled: !!routeId,
  });

  const { data: routeStops = [] } = useQuery({
    queryKey: ['routes', routeId, 'stops'],
    queryFn: () => routesApi.getStops(routeId),
    enabled: !!routeId,
  });

  if (!route) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <p className="text-gray-500">Yükleniyor...</p>
            </div>
          </main>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <button
              onClick={() => router.push('/admin/routes')}
              className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </button>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-lg p-3 mr-4">
                    <Route className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {route.code}
                    </h1>
                    <p className="text-blue-100 text-lg">{route.name}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="font-medium">{routeStops.length} Durak</span>
                </div>
              </div>

              {routeStops.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Bu hatta henüz durak eklenmemiş.
                  </p>
                </div>
              ) : (
                <div className="px-6 py-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Duraklar
                  </h2>
                  <div className="space-y-3">
                    {routeStops.map((routeStop, index) => (
                      <div key={routeStop.id} className="relative">
                        <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold shadow-md">
                              {routeStop.stopOrder}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {routeStop.stop.name}
                            </h3>
                            {routeStop.distanceKm && (
                              <div className="mt-1 flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-1 text-blue-600" />
                                <span>
                                  {routeStop.distanceKm.toFixed(2)} km
                                  {index > 0 && routeStops[index - 1].distanceKm && (
                                    <span className="ml-2 text-gray-500">
                                      (Önceki duraktan:{' '}
                                      {(
                                        routeStop.distanceKm -
                                        routeStops[index - 1].distanceKm!
                                      ).toFixed(2)}{' '}
                                      km)
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {index < routeStops.length - 1 && (
                          <div className="absolute left-5 top-12 w-0.5 h-6 bg-blue-300"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
