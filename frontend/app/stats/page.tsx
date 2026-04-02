'use client';

import { useQuery } from '@tanstack/react-query';
import { routesApi, tripsApi, statsApi } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { Route, TrendingUp, Users, DollarSign } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function StatsPage() {
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

  const { data: routes = [] } = useQuery({
    queryKey: ['routes'],
    queryFn: routesApi.getAll,
  });

  const { data: activeTrips = [] } = useQuery({
    queryKey: ['trips', 'active'],
    queryFn: tripsApi.getActive,
    refetchInterval: 5000,
  });

  const { data: routeStats } = useQuery({
    queryKey: ['stats', 'route', selectedRouteId],
    queryFn: () => statsApi.getRouteStats(selectedRouteId!),
    enabled: selectedRouteId !== null,
  });

  // Route bazlı sefer sayıları için veri hazırlama
  const routeTripData = routes.map((route) => {
    const tripCount = activeTrips.filter((trip) => trip.route.id === route.id).length;
    return {
      name: route.code,
      seferler: tripCount,
    };
  });

  // Araç tipi dağılımı
  const vehicleTypeData = activeTrips.reduce((acc, trip) => {
    const type = trip.vehicle.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const vehicleTypeChartData = Object.entries(vehicleTypeData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            İstatistikler
          </h1>

          {/* Route Selection */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📊 İstatistikler için Hat Seçin
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {routes.map((route) => (
                <button
                  key={route.id}
                  onClick={() =>
                    setSelectedRouteId(
                      selectedRouteId === route.id ? null : route.id
                    )
                  }
                  className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedRouteId === route.id
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <div
                      className={`rounded-lg p-2 ${
                        selectedRouteId === route.id
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Route
                        className={`h-5 w-5 ${
                          selectedRouteId === route.id
                            ? 'text-white'
                            : 'text-gray-600'
                        }`}
                      />
                    </div>
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      selectedRouteId === route.id
                        ? 'text-blue-900'
                        : 'text-gray-900'
                    }`}
                  >
                    {route.code}
                  </div>
                  <div
                    className={`text-xs ${
                      selectedRouteId === route.id
                        ? 'text-blue-700'
                        : 'text-gray-500'
                    }`}
                  >
                    {route.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Route Stats */}
          {selectedRouteId && routeStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg">
                      <TrendingUp className="h-7 w-7 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-600 truncate">
                          Toplam Sefer
                        </dt>
                        <dd className="text-4xl font-bold text-gray-900 mt-1">
                          {routeStats.tripCount}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 shadow-lg">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-600 truncate">
                          Toplam Bilet
                        </dt>
                        <dd className="text-4xl font-bold text-gray-900 mt-1">
                          {routeStats.ticketCount}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-4 shadow-lg">
                      <DollarSign className="h-7 w-7 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-600 truncate">
                          Toplam Gelir
                        </dt>
                        <dd className="text-4xl font-bold text-gray-900 mt-1">
                          ₺{routeStats.totalRevenue.toFixed(2)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Route Trip Chart */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📈 Hat Bazlı Aktif Seferler
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={routeTripData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="seferler" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Vehicle Type Chart */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🚌 Araç Tipi Dağılımı
              </h2>
              {vehicleTypeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={vehicleTypeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {vehicleTypeChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  Aktif sefer bulunmuyor
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



