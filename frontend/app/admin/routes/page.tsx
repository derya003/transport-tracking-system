'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routesApi, stopsApi } from '@/lib/api';
import { useState } from 'react';
import { Plus, Trash2, MapPin, Route as RouteIcon, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AdminGuard from '@/components/AdminGuard';
import Link from 'next/link';
import type { Route, Stop } from '@/types';

export default function AdminRoutesPage() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddStopModal, setShowAddStopModal] = useState<Route | null>(null);
  const [newRoute, setNewRoute] = useState({ code: '', name: '' });

  const { data: routes = [] } = useQuery({
    queryKey: ['routes'],
    queryFn: routesApi.getAll,
  });

  const { data: stops = [] } = useQuery({
    queryKey: ['stops'],
    queryFn: stopsApi.getAll,
  });

  const createRouteMutation = useMutation({
    mutationFn: routesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setShowCreateModal(false);
      setNewRoute({ code: '', name: '' });
    },
  });

  const deleteRouteMutation = useMutation({
    mutationFn: routesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      alert('Hat başarıyla silindi!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Bilinmeyen bir hata oluştu';
      alert('Hat silinemedi: ' + errorMessage);
    },
  });

  const addStopMutation = useMutation({
    mutationFn: ({
      routeId,
      stopId,
      order,
      distanceKm,
    }: {
      routeId: number;
      stopId: number;
      order: number;
      distanceKm?: number;
    }) => routesApi.addStop(routeId, stopId, order, distanceKm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setShowAddStopModal(null);
    },
  });

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    createRouteMutation.mutate(newRoute);
  };

  const handleAddStop = (e: React.FormEvent, route: Route) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const stopId = Number(formData.get('stopId'));
    const order = Number(formData.get('order'));
    const distanceKm = formData.get('distanceKm')
      ? Number(formData.get('distanceKm'))
      : undefined;

    addStopMutation.mutate({ routeId: route.id, stopId, order, distanceKm });
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Hat Yönetimi</h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yeni Hat
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-3">
                          <RouteIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-xl font-bold text-gray-900">
                            {route.code}
                          </h3>
                          <p className="text-sm text-gray-600">{route.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`"${route.code} - ${route.name}" hatını silmek istediğinize emin misiniz?`)) {
                            deleteRouteMutation.mutate(route.id);
                          }
                        }}
                        disabled={deleteRouteMutation.isPending}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        title="Hat Sil"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/routes/${route.id}`}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Detaylar
                      </Link>
                      <button
                        onClick={() => setShowAddStopModal(route)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Durak Ekle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Create Route Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Yeni Hat Oluştur
              </h3>
              <form onSubmit={handleCreateRoute}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hat Kodu
                  </label>
                  <input
                    type="text"
                    value={newRoute.code}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, code: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hat Adı
                  </label>
                  <input
                    type="text"
                    value={newRoute.name}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Oluştur
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Stop Modal */}
        {showAddStopModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {showAddStopModal.code} - Durak Ekle
              </h3>
              <form onSubmit={(e) => handleAddStop(e, showAddStopModal)}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durak
                  </label>
                  <select
                    name="stopId"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Durak Seçin</option>
                    {stops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sıra
                  </label>
                  <input
                    type="number"
                    name="order"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mesafe (km) - Opsiyonel
                  </label>
                  <input
                    type="number"
                    name="distanceKm"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddStopModal(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Ekle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
