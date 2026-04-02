'use client';

import { useQuery } from '@tanstack/react-query';
import { tripsApi } from '@/lib/api';
import { Clock } from 'lucide-react';

interface EtaDisplayProps {
  tripId: number;
}

export default function EtaDisplay({ tripId }: EtaDisplayProps) {
  const { data: eta } = useQuery({
    queryKey: ['trips', tripId, 'eta'],
    queryFn: () => tripsApi.getEta(tripId),
    refetchInterval: 10000, // Her 10 saniyede bir güncelle
  });

  if (eta === undefined) {
    return (
      <div className="text-sm text-gray-500 flex items-center">
        <Clock className="h-4 w-4 mr-1" />
        Hesaplanıyor...
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-600 flex items-center">
      <Clock className="h-4 w-4 mr-1 text-primary-600" />
      <span className="font-medium">Tahmini Varış:</span>{' '}
      <span className="ml-1 text-primary-600 font-semibold">
        {eta} dakika
      </span>
    </div>
  );
}











