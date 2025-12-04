'use client';

import dynamic from 'next/dynamic';

const SchedulingSimulator = dynamic(() => import('@/components/SchedulingSimulator'), {
  loading: () => <div>Loading...</div>,
});

export default function SchedulerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <SchedulingSimulator />
    </div>
  );
}
