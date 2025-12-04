'use client';

import dynamic from 'next/dynamic';

const CodeScaffoldingTool = dynamic(() => import('@/components/CodeScaffoldingTool'), {
  loading: () => <div>Loading...</div>,
});

export default function CodeScaffoldingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <CodeScaffoldingTool />
    </div>
  );
}
