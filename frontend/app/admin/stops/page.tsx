'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stopsApi } from '@/lib/api';
import { useState } from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AdminGuard from '@/components/AdminGuard';

export default function AdminStopsPage() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStop, setNewStop] = useState({
    name: '',
  });

  const { data: stops = [] } = useQuery({
    queryKey: ['stops'],
    queryFn: stopsApi.getAll,
  });

  const createStopMutation = useMutation({
    mutationFn: stopsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stops'] });
      setShowCreateModal(false);
      setNewStop({ name: '' });
    },
  });

  const deleteStopMutation = useMutation({
    mutationFn: stopsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stops'] });
      alert('Durak başarıyla silindi!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Bilinmeyen bir hata oluştu';
      alert('Durak silinemedi: ' + errorMessage);
    },
  });

  const handleCreateStop = (e: React.FormEvent) => {
    e.preventDefault();
    createStopMutation.mutate({
      name: newStop.name,
    });
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Durak Yönetimi</h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yeni Durak
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stops.map((stop) => (
                <div
                  key={stop.id}
                  className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-3">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-xl font-bold text-gray-900">
                            {stop.name}
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`"${stop.name}" durağını silmek istediğinize emin misiniz?`)) {
                            deleteStopMutation.mutate(stop.id);
                          }
                        }}
                        disabled={deleteStopMutation.isPending}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        title="Durak Sil"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Create Stop Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Yeni Durak Oluştur
              </h3>
              <form onSubmit={handleCreateStop}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durak Adı
                  </label>
                  <input
                    type="text"
                    value={newStop.name}
                    onChange={(e) =>
                      setNewStop({ ...newStop, name: e.target.value })
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
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Oluştur
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
