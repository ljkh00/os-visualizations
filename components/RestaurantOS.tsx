import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

const RestaurantOS = () => {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stages = [
    {
      title: "Initial State: System Ready",
      description: "Restaurant is open and ready to serve. The dining area (User Space) and kitchen (Kernel Space) are separate but connected.",
      userAction: null,
      kernelAction: null,
      processState: "IDLE"
    },
    {
      title: "Process Creation: NEW",
      description: "Customer places order via app/waiter. A new process (Order #42) is created.",
      userAction: "Customer submits order:\n- Burger\n- Fries\n- Drink",
      kernelAction: "Order ticket generated\nPCB created (Order #42)",
      processState: "NEW",
      highlight: "user"
    },
    {
      title: "Process State: READY",
      description: "Order enters the kitchen queue, waiting for a chef (CPU) to become available.",
      userAction: "Customer waits at table\nTracking order status",
      kernelAction: "Order #42 in ready queue\nWaiting for chef assignment",
      processState: "READY",
      highlight: "transition"
    },
    {
      title: "Process State: RUNNING",
      description: "Chef begins preparing the order. The process is now executing.",
      userAction: "Status: 'Being prepared'\nCustomer may browse phone",
      kernelAction: "Chef A cooking burger\nChef B preparing fries\nBartender making drink",
      processState: "RUNNING",
      highlight: "kernel"
    },
    {
      title: "Process State: WAITING (I/O)",
      description: "Burger needs 5 minutes to cook. Process must wait for I/O (timer/grill) to complete.",
      userAction: "Status: 'Cooking in progress'\nEstimated time: 5 min",
      kernelAction: "Order #42 blocked\nWaiting for grill timer\nChef switches to Order #43",
      processState: "WAITING",
      highlight: "kernel"
    },
    {
      title: "Back to READY",
      description: "Grill timer rings (I/O complete). Order returns to ready queue.",
      userAction: "Status update received\n'Almost ready'",
      kernelAction: "Interrupt received\nOrder #42 → ready queue\nChef will resume cooking",
      processState: "READY",
      highlight: "transition"
    },
    {
      title: "RUNNING Again: Final Assembly",
      description: "Chef completes the order, plates the food, and hands it to the server.",
      userAction: "Server approaches table\nFood arrives!",
      kernelAction: "Chef completes plating\nQuality check passed\nReady for delivery",
      processState: "RUNNING",
      highlight: "kernel"
    },
    {
      title: "Process State: TERMINATED",
      description: "Order delivered and consumed. Process completes, resources are freed.",
      userAction: "Customer eating\nOrder completed\nPayment processed",
      kernelAction: "Order #42 terminated\nTable cleanup scheduled\nResources freed",
      processState: "TERMINATED",
      highlight: "user"
    }
  ];

  const processColors = {
    IDLE: "bg-gray-300 text-gray-700",
    NEW: "bg-blue-400 text-white",
    READY: "bg-yellow-400 text-gray-900",
    RUNNING: "bg-green-500 text-white",
    WAITING: "bg-orange-400 text-white",
    TERMINATED: "bg-gray-600 text-white"
  };

  const nextStage = () => {
    if (stage < stages.length - 1) {
      setStage(stage + 1);
    }
  };

  const prevStage = () => {
    if (stage > 0) {
      setStage(stage - 1);
    }
  };

  const reset = () => {
    setStage(0);
    setIsPlaying(false);
  };

  const currentStage = stages[stage];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🍽️ Restaurant = Operating System
          </h1>
          <p className="text-gray-600">Understanding Process Lifecycle & User/Kernel Space</p>
        </div>

        {/* Process State Badge */}
        <div className="flex justify-center mb-6">
          <div className={`px-6 py-3 rounded-full font-bold text-lg ${processColors[currentStage.processState]}`}>
            Process State: {currentStage.processState}
          </div>
        </div>

        {/* Main Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* User Space */}
          <div className={`border-4 rounded-lg p-6 transition-all ${
            currentStage.highlight === 'user' ? 'border-blue-500 bg-blue-50' : 'border-blue-300 bg-blue-50'
          }`}>
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold">
                USER SPACE
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-blue-900">🪑 Dining Area</h3>
            <p className="text-sm text-gray-600 mb-4">Where customers interact with the system</p>
            
            <div className="bg-white rounded-lg p-4 min-h-[120px] border-2 border-blue-200">
              {currentStage.userAction ? (
                <div>
                  <div className="font-semibold text-blue-900 mb-2">Customer Activity:</div>
                  <pre className="text-sm whitespace-pre-wrap text-gray-700">
                    {currentStage.userAction}
                  </pre>
                </div>
              ) : (
                <div className="text-gray-400 italic">No customer activity</div>
              )}
            </div>
          </div>

          {/* Kernel Space */}
          <div className={`border-4 rounded-lg p-6 transition-all ${
            currentStage.highlight === 'kernel' ? 'border-red-500 bg-red-50' : 'border-red-300 bg-red-50'
          }`}>
            <div className="flex items-center mb-4">
              <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                KERNEL SPACE
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-900">👨‍🍳 Kitchen</h3>
            <p className="text-sm text-gray-600 mb-4">Where actual work happens (protected area)</p>
            
            <div className="bg-white rounded-lg p-4 min-h-[120px] border-2 border-red-200">
              {currentStage.kernelAction ? (
                <div>
                  <div className="font-semibold text-red-900 mb-2">Kitchen Operations:</div>
                  <pre className="text-sm whitespace-pre-wrap text-gray-700">
                    {currentStage.kernelAction}
                  </pre>
                </div>
              ) : (
                <div className="text-gray-400 italic">Kitchen idle</div>
              )}
            </div>
          </div>
        </div>

        {/* Transition Arrow */}
        {currentStage.highlight === 'transition' && (
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
              <ChevronRight className="w-5 h-5" />
              System Call / Context Switch
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* Stage Description */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Stage {stage + 1}/{stages.length}: {currentStage.title}
          </h3>
          <p className="text-gray-700">{currentStage.description}</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={reset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
          <button
            onClick={prevStage}
            disabled={stage === 0}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={nextStage}
            disabled={stage === stages.length - 1}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            {stages.map((s, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 mx-1 rounded transition-all ${
                  idx <= stage ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Key Concepts */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">🔵 User Space Concepts:</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Limited privileges</li>
              <li>Cannot directly access hardware</li>
              <li>Makes system calls to kernel</li>
              <li>Where applications run</li>
            </ul>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <h4 className="font-bold text-red-900 mb-2">🔴 Kernel Space Concepts:</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Full system privileges</li>
              <li>Manages hardware resources</li>
              <li>Handles process scheduling</li>
              <li>Protected from user programs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOS;