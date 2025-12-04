'use client';

import dynamic from 'next/dynamic';

const RestaurantOSIntro = dynamic(() => import('@/components/RestaurantOSIntro'), {
  loading: () => <div>Loading...</div>,
});

export default function IntroductionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-6">
      <RestaurantOSIntro />
    </div>
  );
}
