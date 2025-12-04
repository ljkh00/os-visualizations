'use client';

import dynamic from 'next/dynamic';

const IOSystems = dynamic(() => import('@/components/IOSystems'), {
  loading: () => <div>Loading...</div>,
});

export default function IOSystemsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <IOSystems />
    </div>
  );
}
