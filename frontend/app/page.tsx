'use client';

import { useQuery } from '@tanstack/react-query';
import { routesApi, tripsApi } from '@/lib/api';
import { useState } from 'react';
import { Bus, MapPin, Ticket, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import EtaDisplay from '@/components/EtaDisplay';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '@/lib/api';

export default function HomePage() {
  const queryClient = useQueryClient();
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [showTicketModal, setShowTicketModal] = useState<number | null>(null);
  const [ticketType, setTicketType] = useState<'STUDENT' | 'FULL'>('FULL');

  const { data: routes = [] } = useQuery({
    queryKey: ['routes'],
    queryFn: routesApi.getAll,
  });

  const { data: activeTrips = [] } = useQuery({
    queryKey: ['trips', 'active'],
    queryFn: tripsApi.getActive,
    refetchInterval: 5000,
  });

  const buyTicketMutation = useMutation({
    mutationFn: ({ tripId, type }: { tripId: number; type: 'STUDENT' | 'FULL' }) =>
      ticketsApi.buy(tripId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setShowTicketModal(null);
      alert('Bilet başarıyla satın alındı!');
    },
    onError: (error: any) => {
      alert('Bilet satın alınamadı: ' + (error.response?.data?.message || error.message));
    },
  });

  const filteredTrips = selectedRouteId
    ? activeTrips.filter((trip) => trip.route.id === selectedRouteId)
    : activeTrips;

  const handleBuyTicket = (tripId: number) => {
    buyTicketMutation.mutate({ tripId, type: ticketType });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🚌 Toplu Taşıma Takip Sistemi
            </h1>
            <p className="text-gray-600">
              Aktif seferleri görüntüleyin ve bilet satın alın
            </p>
          </div>

          {/* Route Filter */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Hat Seçin (Opsiyonel)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <button
                onClick={() => setSelectedRouteId(null)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedRouteId === null
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-sm font-bold text-gray-900">Tümü</div>
              </button>
              {routes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedRouteId === route.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-sm font-bold text-gray-900">
                    {route.code}
                  </div>
                  <div className="text-xs text-gray-500">{route.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Trips */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                🚌 Aktif Seferler ({filteredTrips.length})
              </h2>
            </div>
            <div className="p-6">
              {filteredTrips.length === 0 ? (
                <div className="text-center py-12">
                  <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {selectedRouteId
                      ? 'Bu hat için aktif sefer bulunmuyor.'
                      : 'Şu anda aktif sefer bulunmuyor.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-400 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-2 mr-3">
                              <Bus className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {trip.vehicle.busNumber} - {trip.vehicle.type}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {trip.route.code} - {trip.route.name}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                              <span className="text-sm">
                                <span className="font-medium">Durak Sırası:</span>{' '}
                                {trip.currentStopOrder}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-5 w-5 mr-2 text-green-600" />
                              <EtaDisplay tripId={trip.id} />
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="text-sm">
                                <span className="font-medium">Başlangıç:</span>{' '}
                                {new Date(trip.startTime).toLocaleTimeString('tr-TR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setShowTicketModal(trip.id)}
                          className="ml-4 inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all"
                        >
                          <Ticket className="h-5 w-5 mr-2" />
                          Bilet Al
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Buy Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              🎫 Bilet Satın Al
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bilet Tipi
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="ticketType"
                    value="FULL"
                    checked={ticketType === 'FULL'}
                    onChange={() => setTicketType('FULL')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="text-lg font-semibold text-gray-900">
                      Tam Bilet
                    </div>
                    <div className="text-sm text-gray-600">₺20.00</div>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="ticketType"
                    value="STUDENT"
                    checked={ticketType === 'STUDENT'}
                    onChange={() => setTicketType('STUDENT')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="text-lg font-semibold text-gray-900">
                      Öğrenci Bileti
                    </div>
                    <div className="text-sm text-gray-600">₺10.00</div>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowTicketModal(null)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => handleBuyTicket(showTicketModal)}
                disabled={buyTicketMutation.isPending}
                className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
              >
                {buyTicketMutation.isPending ? 'İşleniyor...' : 'Satın Al'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
