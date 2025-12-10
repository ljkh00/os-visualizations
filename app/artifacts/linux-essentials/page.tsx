'use client';

import dynamic from 'next/dynamic';

const LinuxEssentials = dynamic(() => import('@/components/LinuxEssentials'), {
  loading: () => <div>Loading...</div>,
});

export default function LinuxEssentialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-cyan-50 p-6">
      <LinuxEssentials />
    </div>
  );
}
