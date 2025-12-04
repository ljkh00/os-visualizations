'use client';

import dynamic from 'next/dynamic';

const MasterRestaurantOS = dynamic(() => import('@/components/MasterRestaurantOS'), {
  loading: () => <div>Loading...</div>,
});

export default function MasterOSPage() {
  return (
    <div className="min-h-screen bg-purple-50">
      <MasterRestaurantOS />
    </div>
  );
}
