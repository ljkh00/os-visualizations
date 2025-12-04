import React, { useState } from 'react';
import { Info, Zap, Users, Cpu, HardDrive, Network, Shield, Book, ArrowRight, Eye } from 'lucide-react';

const RestaurantOSIntro = () => {
  const [selectedArea, setSelectedArea] = useState('overview');
  const [showFlow, setShowFlow] = useState(false);
  const [flowStep, setFlowStep] = useState(0);

  const areas = {
    overview: {
      title: "🏪 The Restaurant Operating System",
      icon: <Info className="w-6 h-6" />,
      description: "A restaurant is like a complete operating system! Each part has a specific role in serving customers efficiently and safely.",
      details: [
        "Customers = User Applications (your programs)",
        "Dining Area = User Space (where apps run)",
        "Kitchen = Kernel Space (protected, privileged operations)",
        "Waiters = System Calls (controlled interface between spaces)",
        "Chefs = CPU (does the actual work)",
        "Tables = Memory (allocated space for each customer/process)",
        "Storage Rooms = File System (organized data storage)",
        "Equipment = Hardware (physical resources)",
        "Other Branches = Network (communication with external systems)"
      ]
    },
    userspace: {
      title: "🪑 Dining Area (User Space)",
      icon: <Users className="w-6 h-6" />,
      description: "This is where customers (applications) operate. They have LIMITED privileges - can't enter the kitchen directly!",
      details: [
        "Customers place orders but can't cook themselves",
        "Each table is isolated - customers can't steal from other tables",
        "Limited resources per table (memory limits per process)",
        "Must use waiters (system calls) to communicate with kitchen",
        "Safe environment - even if customer misbehaves, kitchen is protected",
        "Multiple customers can dine simultaneously (multitasking)"
      ],
      mapping: {
        restaurant: "Customers at tables with menus",
        os: "User processes in user mode with limited privileges"
      }
    },
    syscalls: {
      title: "🤵 Waiters (System Calls)",
      icon: <ArrowRight className="w-6 h-6" />,
      description: "Waiters are the ONLY way customers communicate with the kitchen. They ensure requests are valid and properly formatted.",
      details: [
        "Customer can't just walk into kitchen (security!)",
        "Waiter validates order (parameter checking)",
        "Waiter translates order to kitchen language (system call interface)",
        "Waiter brings back results (return values)",
        "Examples: read(), write(), open(), fork(), exec()",
        "Context switch: customer → waiter → kitchen → waiter → customer"
      ],
      mapping: {
        restaurant: "Take order, deliver to kitchen, bring back food",
        os: "System call interface between user and kernel mode"
      }
    },
    kernel: {
      title: "👨‍🍳 Kitchen (Kernel Space)",
      icon: <Shield className="w-6 h-6" />,
      description: "The kitchen has FULL privileges. Only trained staff (kernel) allowed. This is where real work happens.",
      details: [
        "Complete access to all equipment (hardware)",
        "Manages all resources (scheduling, memory, I/O)",
        "Enforces security (customers can't mess with kitchen)",
        "Coordinates multiple chefs (CPU scheduling)",
        "Handles equipment directly (device drivers)",
        "Protected mode - kernel bugs can crash entire restaurant!"
      ],
      mapping: {
        restaurant: "Kitchen with chefs, equipment, ingredients",
        os: "Kernel with privileged operations and direct hardware access"
      }
    },
    cpu: {
      title: "👨‍🍳 Chefs (CPU)",
      icon: <Cpu className="w-6 h-6" />,
      description: "Chefs do the actual cooking (computation). Limited number of chefs means orders must be scheduled.",
      details: [
        "Each chef works on one order at a time (single-core CPU)",
        "Multiple chefs = multicore CPU (parallel processing)",
        "Chef can switch between orders (context switching)",
        "Scheduler decides which order chef works on next",
        "Context: Chef's current recipe, ingredients, progress",
        "Fast chefs (GHz) can prepare many dishes quickly"
      ],
      mapping: {
        restaurant: "Chefs cooking multiple orders by switching between them",
        os: "CPU executing multiple processes via time-sharing"
      }
    },
    memory: {
      title: "🪑 Tables & Storage (Memory)",
      icon: <HardDrive className="w-6 h-6" />,
      description: "Tables are like RAM - temporary space allocated to each customer. Storage rooms are like disk - permanent storage.",
      details: [
        "Tables = RAM (fast, temporary, limited)",
        "Each customer gets tables (memory allocation)",
        "Fixed-size tables = Paging (4 seats = 4KB page)",
        "Variable sections = Segmentation (booth vs. banquet)",
        "Waiting lounge = Swap space (on disk)",
        "Pantry/freezer = File system (persistent storage)",
        "No two customers share same table (memory protection)"
      ],
      mapping: {
        restaurant: "Tables for active customers, storage for ingredients",
        os: "RAM for running processes, disk for stored data"
      }
    },
    hardware: {
      title: "🍳 Kitchen Equipment (Hardware)",
      icon: <Zap className="w-6 h-6" />,
      description: "Physical equipment that actually does the work. Managed by chefs (kernel) through device drivers.",
      details: [
        "Stove = CPU (does computation)",
        "Fridge = Storage device (HDD/SSD)",
        "Counter space = RAM (temporary workspace)",
        "Dishwasher = I/O device (input/output operations)",
        "Cash register = Display/output device",
        "Suppliers = Network interface (data in/out)",
        "Each equipment has specific protocols (device drivers)"
      ],
      mapping: {
        restaurant: "Physical kitchen appliances and tools",
        os: "CPU, memory, disk drives, network cards, peripherals"
      }
    },
    io: {
      title: "🍽️ I/O Operations",
      icon: <ArrowRight className="w-6 h-6" />,
      description: "Input/Output devices are slow! Like waiting for oven to beep. CPU doesn't wait - switches to other tasks.",
      details: [
        "Oven timer = I/O device (takes time)",
        "Polling: Chef keeps checking oven (wastes time)",
        "Interrupts: Oven beeps when ready (efficient!)",
        "DMA: Dishwasher works independently (direct memory access)",
        "Buffering: Prep ingredients while cooking (I/O buffering)",
        "Blocked state: Order waits for oven (I/O wait)"
      ],
      mapping: {
        restaurant: "Waiting for equipment to finish (oven, dishwasher)",
        os: "Process waiting for disk read, network response, user input"
      }
    },
    filesystem: {
      title: "📚 Storage Rooms (File System)",
      icon: <Book className="w-6 h-6" />,
      description: "Organized storage for ingredients (data) and recipes (programs). Hierarchical structure with permissions.",
      details: [
        "Pantry = Root directory (/)",
        "Shelves = Subdirectories (/home, /var, /etc)",
        "Ingredients = Files",
        "Recipe books = Executable files",
        "Labels = File names and metadata",
        "Locks on cabinets = File permissions (rwx)",
        "Inventory list = Inode table",
        "Some ingredients in pantry, some in freezer = File system mounting"
      ],
      mapping: {
        restaurant: "Organized storage with labels and access control",
        os: "Hierarchical file system with directories and permissions"
      }
    },
    network: {
      title: "🌐 Network (Other Branches)",
      icon: <Network className="w-6 h-6" />,
      description: "Communication with external systems. Deliveries, catering, franchise sharing recipes.",
      details: [
        "Delivery orders = Network requests",
        "Calling another branch = Client-server communication",
        "Sharing recipes = Data transmission",
        "Delivery driver = Network packets",
        "Address system = IP addresses",
        "Phone protocol = TCP/IP protocols",
        "Menu sharing between franchises = Distributed systems"
      ],
      mapping: {
        restaurant: "Communication with other restaurants and customers",
        os: "Network communication, sockets, protocols, distributed computing"
      }
    },
    security: {
      title: "🔒 Security & Protection",
      icon: <Shield className="w-6 h-6" />,
      description: "Multiple layers of protection to prevent chaos and maintain order.",
      details: [
        "Customers can't enter kitchen (privilege separation)",
        "Each table isolated (process isolation)",
        "Chef can't modify other chef's orders (protection rings)",
        "Manager can fire chef (superuser/root)",
        "Recipe book access control (file permissions)",
        "Security cameras = Audit logs",
        "Health inspector = System monitoring"
      ],
      mapping: {
        restaurant: "Rules, barriers, access control in restaurant",
        os: "User/kernel mode, memory protection, file permissions, authentication"
      }
    }
  };

  const processFlow = [
    {
      step: 1,
      title: "Customer Arrives",
      dining: "Customer enters restaurant",
      kitchen: "",
      os: "Program launch (fork/exec system call)"
    },
    {
      step: 2,
      title: "Get Seated",
      dining: "Host assigns table",
      kitchen: "Manager allocates table space",
      os: "OS allocates memory (pages/frames)"
    },
    {
      step: 3,
      title: "Place Order",
      dining: "Customer tells waiter order",
      kitchen: "",
      os: "Application makes system call"
    },
    {
      step: 4,
      title: "Order Delivered to Kitchen",
      dining: "",
      kitchen: "Waiter brings order ticket to kitchen",
      os: "Transition from user mode to kernel mode"
    },
    {
      step: 5,
      title: "Order Queued",
      dining: "Customer waits",
      kitchen: "Order enters ready queue",
      os: "Process enters READY state"
    },
    {
      step: 6,
      title: "Chef Starts Cooking",
      dining: "",
      kitchen: "Chef picks up order, starts cooking",
      os: "Scheduler assigns CPU, process enters RUNNING state"
    },
    {
      step: 7,
      title: "Wait for Equipment",
      dining: "",
      kitchen: "Order needs 5 min in oven, chef switches to another order",
      os: "Process waits for I/O (WAITING state), context switch"
    },
    {
      step: 8,
      title: "Food Ready",
      dining: "",
      kitchen: "Oven beeps (interrupt!), chef completes dish",
      os: "I/O complete interrupt, process back to READY/RUNNING"
    },
    {
      step: 9,
      title: "Deliver to Customer",
      dining: "Waiter brings food to table",
      kitchen: "",
      os: "Return from system call to user mode"
    },
    {
      step: 10,
      title: "Customer Finishes & Leaves",
      dining: "Customer eats, pays, leaves",
      kitchen: "Table cleared, resources freed",
      os: "Process terminates, memory deallocated"
    }
  ];

  const currentArea = areas[selectedArea];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏪 Restaurant = Operating System
          </h1>
          <p className="text-lg text-gray-600">
            A Complete Introduction to OS Concepts Through Restaurant Analogy
          </p>
        </div>

        {/* Toggle Process Flow View */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => {
              setShowFlow(!showFlow);
              setFlowStep(0);
            }}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
              showFlow 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Eye className="w-5 h-5" />
            {showFlow ? 'View System Components' : 'View Process Flow'}
          </button>
        </div>

        {!showFlow ? (
          <>
            {/* Component Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-6">
              {Object.keys(areas).map((key) => {
                const area = areas[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedArea(key)}
                    className={`p-3 rounded-lg font-semibold transition-all ${
                      selectedArea === key
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white scale-105 shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {area.icon}
                      <div className="text-xs text-center leading-tight">
                        {area.title.replace(/^.+?\s/, '')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Area Details */}
            <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg p-6 mb-6 border-4 border-blue-300">
              <div className="flex items-center gap-3 mb-4">
                {currentArea.icon}
                <h2 className="text-2xl font-bold text-gray-800">{currentArea.title}</h2>
              </div>
              
              <p className="text-lg text-gray-700 mb-4 font-semibold">
                {currentArea.description}
              </p>

              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="font-bold text-lg mb-3 text-purple-900">Key Concepts:</h3>
                <ul className="space-y-2">
                  {currentArea.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {currentArea.mapping && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-100 rounded-lg p-4 border-2 border-orange-300">
                    <h4 className="font-bold text-orange-900 mb-2">🏪 In Restaurant:</h4>
                    <p className="text-gray-700">{currentArea.mapping.restaurant}</p>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-300">
                    <h4 className="font-bold text-blue-900 mb-2">💻 In OS:</h4>
                    <p className="text-gray-700">{currentArea.mapping.os}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Visual Restaurant Layout */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-center">🏪 Restaurant Layout = OS Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Space */}
                <div className="bg-blue-50 border-4 border-blue-500 rounded-lg p-4">
                  <h4 className="font-bold text-xl mb-3 text-blue-900 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Dining Area (User Space)
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white rounded p-3 border-2 border-blue-200">
                      <strong>🪑 Tables:</strong> Memory allocated to processes
                    </div>
                    <div className="bg-white rounded p-3 border-2 border-blue-200">
                      <strong>👥 Customers:</strong> Running applications/processes
                    </div>
                    <div className="bg-white rounded p-3 border-2 border-blue-200">
                      <strong>📋 Menus:</strong> User interfaces/APIs
                    </div>
                    <div className="bg-white rounded p-3 border-2 border-blue-200">
                      <strong>🤵 Waiters:</strong> System call interface
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-blue-700 font-semibold">
                    ⚠️ Limited privileges - Can't access kitchen directly
                  </div>
                </div>

                {/* Kernel Space */}
                <div className="bg-red-50 border-4 border-red-500 rounded-lg p-4">
                  <h4 className="font-bold text-xl mb-3 text-red-900 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Kitchen (Kernel Space)
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white rounded p-3 border-2 border-red-200">
                      <strong>👨‍🍳 Chefs:</strong> CPU executing processes
                    </div>
                    <div className="bg-white rounded p-3 border-2 border-red-200">
                      <strong>🍳 Equipment:</strong> Hardware resources
                    </div>
                    <div className="bg-white rounded p-3 border-2 border-red-200">
                      <strong>📚 Pantry:</strong> File system storage
                    </div>
                    <div className="bg-white rounded p-3 border-2 border-red-200">
                      <strong>⏰ Timers:</strong> Interrupt handlers
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-red-700 font-semibold">
                    🔒 Full privileges - Complete hardware access
                  </div>
                </div>
              </div>

              {/* Connection */}
              <div className="flex justify-center my-4">
                <div className="bg-yellow-400 px-6 py-3 rounded-full font-bold text-gray-900 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  System Calls (Waiters)
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* Additional Components */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3">
                  <h5 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    Storage (File System)
                  </h5>
                  <p className="text-xs text-gray-700">
                    Pantry, freezer = Organized data storage with hierarchy and permissions
                  </p>
                </div>
                <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-3">
                  <h5 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Processing (CPU)
                  </h5>
                  <p className="text-xs text-gray-700">
                    Chefs cooking = CPU executing instructions, scheduling between tasks
                  </p>
                </div>
                <div className="bg-orange-50 border-2 border-orange-500 rounded-lg p-3">
                  <h5 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                    <Network className="w-4 h-4" />
                    Network
                  </h5>
                  <p className="text-xs text-gray-700">
                    Other branches = Communication with external systems via protocols
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Process Flow View */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-center mb-4">
                📋 Complete Process Journey: From Customer Order to Completion
              </h2>
              <p className="text-center text-gray-600 mb-4">
                Follow a customer order through the entire system
              </p>

              {/* Flow Step Selector */}
              <div className="flex justify-center gap-2 mb-6 flex-wrap">
                {processFlow.map((flow, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFlowStep(idx)}
                    className={`px-3 py-2 rounded font-semibold text-sm transition-colors ${
                      flowStep === idx
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {flow.step}
                  </button>
                ))}
              </div>

              {/* Current Step Display */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-4 border-4 border-purple-300">
                <h3 className="text-2xl font-bold mb-4 text-purple-900">
                  Step {processFlow[flowStep].step}: {processFlow[flowStep].title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {processFlow[flowStep].dining && (
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                      <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Dining Area Activity:
                      </h4>
                      <p className="text-gray-700">{processFlow[flowStep].dining}</p>
                    </div>
                  )}
                  {processFlow[flowStep].kitchen && (
                    <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                      <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Kitchen Activity:
                      </h4>
                      <p className="text-gray-700">{processFlow[flowStep].kitchen}</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
                  <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    Operating System Equivalent:
                  </h4>
                  <p className="text-lg text-gray-700 font-semibold">{processFlow[flowStep].os}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setFlowStep(Math.max(0, flowStep - 1))}
                  disabled={flowStep === 0}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
                >
                  ← Previous Step
                </button>
                <button
                  onClick={() => setFlowStep(Math.min(processFlow.length - 1, flowStep + 1))}
                  disabled={flowStep === processFlow.length - 1}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
                >
                  Next Step →
                </button>
              </div>
            </div>

            {/* Process State Diagram */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-center">Process State Journey</h3>
              <div className="flex flex-col items-center gap-3">
                <div className="bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold">
                  NEW - Customer arrives, table assigned
                </div>
                <div className="text-2xl">↓</div>
                <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold">
                  READY - Order in kitchen queue
                </div>
                <div className="text-2xl">↓</div>
                <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
                  RUNNING - Chef actively cooking
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl">↓</div>
                    <div className="bg-orange-400 text-white px-4 py-2 rounded-lg font-semibold text-center">
                      WAITING - Oven timer (I/O)
                    </div>
                    <div className="text-2xl">↓</div>
                    <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold text-center">
                      Back to READY
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-purple-100 border-2 border-purple-400 rounded-lg p-3 text-sm">
                      <strong>Context Switch:</strong> Chef works on another order while waiting
                    </div>
                  </div>
                </div>
                <div className="text-2xl">↓</div>
                <div className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold">
                  TERMINATED - Customer finishes, table freed
                </div>
              </div>
            </div>
          </>
        )}

        {/* Key Takeaways */}
        <div className="mt-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-center">🎯 Key Takeaways</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2">Why Restaurant Analogy?</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Makes abstract concepts concrete and relatable</li>
                <li>Shows relationships between components</li>
                <li>Explains security through physical barriers</li>
                <li>Demonstrates resource management intuitively</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-purple-900 mb-2">Core OS Principles</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Separation of privileges (user vs kernel)</li>
                <li>Resource management and scheduling</li>
                <li>Protection and isolation</li>
                <li>Controlled interfaces (system calls)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-6 bg-yellow-100 rounded-lg p-4 border-2 border-yellow-400">
          <h3 className="font-bold text-lg mb-2">📚 Explore More Detailed Topics:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="bg-white rounded p-2">👨‍🍳 CPU Scheduling</div>
            <div className="bg-white rounded p-2">🪑 Memory Management</div>
            <div className="bg-white rounded p-2">🔒 Synchronization</div>
            <div className="bg-white rounded p-2">📁 File Systems</div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Use the other interactive artifacts to dive deep into each concept!
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOSIntro;