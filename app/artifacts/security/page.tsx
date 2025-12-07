'use client';

import dynamic from 'next/dynamic';

const SecuritySystems = dynamic(() => import('@/components/SecuritySystems'), {
  loading: () => <div>Loading...</div>,
});

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6">
      <SecuritySystems />
    </div>
  );
}
