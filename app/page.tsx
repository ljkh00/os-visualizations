import Link from 'next/link';

export default function Home() {
  const artifacts = [
    {
      title: '🗺️ OS Introduction',
      description: 'Complete system overview: explore all OS components and see a full process journey from start to finish.',
      path: '/artifacts/introduction',
      emoji: '🗺️',
      color: 'from-orange-500 to-red-500',
      recommended: 'START HERE'
    },
    {
      title: 'Process Journey',
      description: 'Follow a process through its lifecycle: NEW → READY → RUNNING → WAITING → TERMINATED.',
      path: '/artifacts/process-journey',
      emoji: '🍽️',
      color: 'from-yellow-500 to-orange-500',
      recommended: 'BEGINNER'
    },
    {
      title: 'Process Concurrency',
      description: 'Understand race conditions, mutexes, semaphores, and deadlocks through interactive scenarios.',
      path: '/artifacts/concurrency',
      emoji: '🔐',
      color: 'from-purple-500 to-pink-500',
      recommended: 'FOR EXAMS'
    },
    {
      title: 'CPU Scheduling',
      description: 'Compare FCFS, SJF, Priority, and Round Robin algorithms using restaurant order processing.',
      path: '/artifacts/scheduler',
      emoji: '👨‍🍳',
      color: 'from-blue-500 to-purple-500',
      recommended: 'FOR EXMAS'
    },
    {
      title: 'Memory Management',
      description: 'Understand paging, segmentation, and fragmentation through table allocation scenarios.',
      path: '/artifacts/memory',
      emoji: '🪑',
      color: 'from-green-500 to-blue-500',
      recommended: 'FOR EXAMS'
    },
    {
      title: 'File Systems',
      description: 'Explore directory hierarchy, inodes, permissions, and file operations through pantry organization.',
      path: '/artifacts/file-systems',
      emoji: '📁',
      color: 'from-indigo-500 to-blue-500',
      recommended: 'FOR EXAMS'
    },
    {
      title: 'Security & Protection',
      description: 'Understand AAA (Authentication, Authorization, Accounting), protection rings, and common threats.',
      path: '/artifacts/security',
      emoji: 'ðŸ›¡ï¸',
      color: 'from-red-500 to-pink-500',
      recommended: 'FOR EXAMS'
    },
    {
      title: 'Network Systems',
      description: 'Learn client-server, sockets, protocols, NFS, and IPC through inter-branch communication.',
      path: '/artifacts/network',
      emoji: '🌐',
      color: 'from-cyan-500 to-blue-500',
      recommended: 'FOR EXAMS'
    },
    {
      title: 'I/O Systems',
      description: 'Compare polling, interrupts, and DMA - how CPU works with slow kitchen equipment.',
      path: '/artifacts/io-systems',
      emoji: '⚡',
      color: 'from-yellow-500 to-red-500',
      recommended: 'FOR EXAMS'
    },
    {
      title: 'Code Scaffolding',
      description: 'Progress from restaurant language → OS terms → pseudocode → real C-style code.',
      path: '/artifacts/code-scaffolding',
      emoji: '📚',
      color: 'from-indigo-500 to-purple-500',
      recommended: 'FOR CODING'
    },
    {
      title: 'Master OS Simulation',
      description: 'Live simulation combining scheduling, memory, concurrency, and I/O operations.',
      path: '/artifacts/master-os',
      emoji: '🏪',
      color: 'from-pink-500 to-purple-500',
      recommended: 'ADVANCED'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">🖥️ Operating Systems Learning Portal</h1>
          <p className="text-xl text-gray-100">Interactive visualizations using restaurant analogies</p>
          <p className="text-sm text-gray-200 mt-2">
            For students experiencing Linux and OS concepts for the first time
          </p>
        </div>
      </div>

      {/* Learning Path Note */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-yellow-500 text-gray-900 rounded-lg p-4 mb-6">
          <h2 className="font-bold text-lg mb-2">📖 Recommended Learning Path:</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li><strong>Start with OS Introduction</strong> - get the complete map of concepts</li>
            <li><strong>Then Process Journey</strong> - understand process states deeply</li>
            <li><strong>Next Concurrency</strong> - grasp synchronization and deadlocks</li>
            <li><strong>Explore CPU Scheduling & Memory</strong> - dive into resource management</li>
            <li><strong>Study File Systems</strong> - understand directory hierarchy and permissions</li>
            <li><strong>Learn I/O Systems</strong> - compare polling, interrupts, and DMA</li>
            <li><strong>Use Code Scaffolding</strong> - when you need to write/analyze code</li>
            <li><strong>Try Master OS Simulation</strong> - see everything working together</li>
          </ol>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artifacts.map((artifact, index) => (
            <Link key={index} href={artifact.path}>
              <div className="h-full bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer group border border-gray-700">
                <div className={`bg-gradient-to-br ${artifact.color} h-24 flex items-center justify-center relative`}>
                  <span className="text-5xl">{artifact.emoji}</span>
                  {artifact.recommended && (
                    <span className="absolute top-2 right-2 bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded">
                      {artifact.recommended}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {artifact.title}
                  </h2>
                  <p className="text-gray-400 text-sm">{artifact.description}</p>
                  <div className="mt-4 text-blue-400 font-semibold text-sm">
                    Explore →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* About Section */}
        <div className="mt-16 bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use These Visualizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="font-bold text-white mb-2">For First-Time Learners:</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Start with the <strong className="text-orange-400">OS Introduction</strong> to see the big picture</li>
                <li>✓ Use <strong className="text-yellow-400">Process Journey</strong> to understand states</li>
                <li>✓ Everything uses restaurant analogies - from customers to chefs to tables</li>
                <li>✓ Click through step-by-step, don't rush</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">For Exam Preparation:</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Use <strong className="text-indigo-400">Code Scaffolding</strong> to practice code analysis</li>
                <li>✓ Review scheduling algorithms in the <strong className="text-blue-400">CPU Scheduler</strong></li>
                <li>✓ Understand deadlocks and race conditions in <strong className="text-pink-400">Concurrency</strong></li>
                <li>✓ Master file permissions and paths in <strong className="text-indigo-400">File Systems</strong></li>
                <li>✓ Master I/O concepts like <strong className="text-yellow-400">polling vs interrupts</strong></li>
                <li>✓ Test your memory management knowledge with paging scenarios</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Assessment Focus */}
        <div className="mt-8 bg-blue-900 rounded-lg p-6 border border-blue-700">
          <h2 className="text-xl font-bold text-white mb-3">📝 What You'll Be Assessed On:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-200">
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">Concept Understanding</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Process states</li>
                <li>Scheduling algorithms</li>
                <li>Memory management</li>
                <li>Synchronization</li>
                <li>I/O operations</li>
                <li>File system structure</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">Code Analysis</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Recognize deadlocks</li>
                <li>Identify race conditions</li>
                <li>Analyze bash scripts</li>
                <li>Debug multithreading</li>
                <li>I/O polling vs interrupts</li>
                <li>File permissions (rwx)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">Practical Skills</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Build Linux services</li>
                <li>System monitoring</li>
                <li>Bash scripting</li>
                <li>Server management</li>
                <li>File system navigation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Operating Systems Learning Portal | Built for CS/SE Students</p>
          <p className="mt-1">Restaurant Analogy Framework by Hensem</p>
        </div>
      </div>
    </div>
  );
}
