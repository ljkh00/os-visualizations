'use client';

import dynamic from 'next/dynamic';

const MemoryManagement = dynamic(() => import('@/components/MemoryManagement'), {
  loading: () => <div>Loading...</div>,
});

export default function MemoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <MemoryManagement />
    </div>
  );
}
