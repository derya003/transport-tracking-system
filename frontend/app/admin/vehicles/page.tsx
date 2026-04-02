'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesApi, tripsApi, routesApi } from '@/lib/api';
import { useState } from 'react';
import { Plus, Bus, Route, Play, ArrowRight, Clock, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AdminGuard from '@/components/AdminGuard';
import EtaDisplay from '@/components/EtaDisplay';

export default function AdminVehiclesPage() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState<number | null>(null);
  const [newVehicle, setNewVehicle] = useState({ busNumber: '', type: '' });

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesApi.getAll,
  });

  const { data: routes = [] } = useQuery({
    queryKey: ['routes'],
    queryFn: routesApi.getAll,
  });

  const { data: activeTrips = [] } = useQuery({
    queryKey: ['trips', 'active'],
    queryFn: tripsApi.getActive,
    refetchInterval: 5000,
  });

  const createVehicleMutation = useMutation({
    mutationFn: vehiclesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setShowCreateModal(false);
      setNewVehicle({ busNumber: '', type: '' });
      alert('Araç başarıyla oluşturuldu!');
    },
    onError: (error: any) => {
      alert('Araç oluşturulamadı: ' + (error.response?.data?.message || error.message));
    },
  });

  const assignRouteMutation = useMutation({
    mutationFn: ({ vehicleId, routeId }: { vehicleId: number; routeId: number }) =>
      vehiclesApi.assignRoute(vehicleId, routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setShowAssignModal(null);
    },
  });

  const startTripMutation = useMutation({
    mutationFn: ({ vehicleId, routeId }: { vehicleId: number; routeId: number }) =>
      tripsApi.start(vehicleId, routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      alert('Sefer başarıyla başlatıldı!');
    },
    onError: (error: any) => {
      alert('Sefer başlatılamadı: ' + (error.response?.data?.message || error.message));
    },
  });

  const nextStopMutation = useMutation({
    mutationFn: tripsApi.nextStop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: vehiclesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      alert('Araç başarıyla silindi!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Bilinmeyen bir hata oluştu';
      alert('Araç silinemedi: ' + errorMessage);
    },
  });

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    createVehicleMutation.mutate(newVehicle);
  };

  const handleAssignRoute = (e: React.FormEvent, vehicleId: number) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const routeId = Number(formData.get('routeId'));
    assignRouteMutation.mutate({ vehicleId, routeId });
  };

  const getActiveTrip = (vehicleId: number) => {
    return activeTrips.find((trip) => trip.vehicle.id === vehicleId);
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Araç Yönetimi</h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yeni Araç
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => {
                const activeTrip = getActiveTrip(vehicle.id);
                return (
                  <div
                    key={vehicle.id}
                    className={`bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${
                      activeTrip
                        ? 'ring-4 ring-green-400 shadow-green-200'
                        : 'hover:shadow-xl'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            className={`rounded-lg p-3 ${
                              activeTrip
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                            }`}
                          >
                            <Bus className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-xl font-bold text-gray-900">
                              {vehicle.busNumber}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium">
                              {vehicle.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {activeTrip && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border-2 border-green-400 animate-pulse">
                              ● Aktif
                            </span>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`"${vehicle.busNumber}" aracını silmek istediğinize emin misiniz?`)) {
                                deleteVehicleMutation.mutate(vehicle.id);
                              }
                            }}
                            disabled={deleteVehicleMutation.isPending || activeTrip !== undefined}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            title={activeTrip ? "Aktif seferi olan araç silinemez" : "Araç Sil"}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {vehicle.route ? (
                        <div className="mb-4">
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Route className="h-4 w-4 mr-2" />
                            {vehicle.route.code} - {vehicle.route.name}
                          </div>
                          {activeTrip && (
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Durak Sırası:</span>{' '}
                                {activeTrip.currentStopOrder}
                              </div>
                              <EtaDisplay tripId={activeTrip.id} />
                              <button
                                onClick={() => nextStopMutation.mutate(activeTrip.id)}
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                              >
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Sonraki Durak
                              </button>
                            </div>
                          )}
                          {!activeTrip && (
                            <button
                              onClick={() =>
                                startTripMutation.mutate({
                                  vehicleId: vehicle.id,
                                  routeId: vehicle.route!.id,
                                })
                              }
                              disabled={startTripMutation.isPending}
                              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              {startTripMutation.isPending ? 'Başlatılıyor...' : 'Sefer Başlat'}
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAssignModal(vehicle.id)}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Route className="h-4 w-4 mr-2" />
                          Hat Ata
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Create Vehicle Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Yeni Araç Oluştur
              </h3>
              <form onSubmit={handleCreateVehicle}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Otobüs Numarası
                  </label>
                  <input
                    type="text"
                    value={newVehicle.busNumber}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, busNumber: e.target.value })
                    }
                    placeholder="örn: 34A, 101, K-42"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Otobüs numarasını girin (örn: 34A, 101, K-42)
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tip
                  </label>
                  <select
                    value={newVehicle.type}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Tip Seçin</option>
                    <option value="Otobüs">Otobüs</option>
                    <option value="Minibüs">Minibüs</option>
                    <option value="Tramvay">Tramvay</option>
                    <option value="Metro">Metro</option>
                  </select>
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
                    disabled={createVehicleMutation.isPending}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {createVehicleMutation.isPending ? 'Oluşturuluyor...' : 'Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assign Route Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Hat Ata</h3>
              <form onSubmit={(e) => handleAssignRoute(e, showAssignModal)}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hat
                  </label>
                  <select
                    name="routeId"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Hat Seçin</option>
                    {routes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.code} - {route.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Ata
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
