'use client';

import dynamic from 'next/dynamic';

const ProcessConcurrency = dynamic(() => import('@/components/ProcessConcurrency'), {
  loading: () => <div>Loading...</div>,
});

export default function ConcurrencyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <ProcessConcurrency />
    </div>
  );
}
