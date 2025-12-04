'use client';

import dynamic from 'next/dynamic';

const FileSystemsVisualization = dynamic(() => import('@/components/FileSystemsVisualization'), {
  loading: () => <div>Loading...</div>,
});

export default function FileSystemsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <FileSystemsVisualization />
    </div>
  );
}
