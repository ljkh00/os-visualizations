'use client';

import dynamic from 'next/dynamic';

const AdvancedScripting = dynamic(() => import('@/components/AdvancedScripting'), {
  loading: () => <div>Loading...</div>,
});

export default function AdvancedScriptingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <AdvancedScripting />
    </div>
  );
}
