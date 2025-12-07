'use client';

import dynamic from 'next/dynamic';

const NetworkSystems = dynamic(() => import('@/components/NetworkSystems'), {
  loading: () => <div>Loading...</div>,
});

export default function NetworkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
      <NetworkSystems />
    </div>
  );
}