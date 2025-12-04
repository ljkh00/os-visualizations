'use client';

import dynamic from 'next/dynamic';

const RestaurantOS = dynamic(() => import('@/components/RestaurantOS'), {
  loading: () => <div>Loading...</div>,
});

export default function ProcessJourneyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      <RestaurantOS />
    </div>
  );
}
