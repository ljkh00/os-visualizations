import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, AlertCircle } from 'lucide-react';

const SchedulingSimulator = () => {
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [quantum, setQuantum] = useState(2);
  const [quantumRemaining, setQuantumRemaining] = useState(2);

  // Order structure: {id, dish, arrivalTime, burstTime, remainingTime, priority, startTime, completionTime}
  const initialOrders = [
    { id: 1, dish: '🍔 Burger', arrivalTime: 0, burstTime: 5, remainingTime: 5, priority: 2, color: 'bg-red-400' },
    { id: 2, dish: '🍕 Pizza', arrivalTime: 1, burstTime: 3, remainingTime: 3, priority: 1, color: 'bg-yellow-400' },
    { id: 3, dish: '🥗 Salad', arrivalTime: 2, burstTime: 2, remainingTime: 2, priority: 3, color: 'bg-green-400' },
    { id: 4, dish: '🍝 Pasta', arrivalTime: 3, burstTime: 4, remainingTime: 4, priority: 1, color: 'bg-orange-400' },
    { id: 5, dish: '🌮 Taco', arrivalTime: 4, burstTime: 1, remainingTime: 1, priority: 2, color: 'bg-purple-400' },
  ];

  const [orders, setOrders] = useState([...initialOrders]);
  const [readyQueue, setReadyQueue] = useState([]);

  const reset = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setCurrentOrder(null);
    setCompletedOrders([]);
    setOrders(initialOrders.map(o => ({ ...o, remainingTime: o.burstTime, startTime: null, completionTime: null })));
    setReadyQueue([]);
    setQuantumRemaining(quantum);
  };

  useEffect(() => {
    reset();
  }, [algorithm, quantum]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      simulateStep();
    }, 800);

    return () => clearTimeout(timer);
  }, [isRunning, currentTime, currentOrder, readyQueue]);

  const getReadyOrders = () => {
    return orders.filter(o => o.arrivalTime <= currentTime && o.remainingTime > 0);
  };

  const selectNextOrder = (availableOrders) => {
    if (availableOrders.length === 0) return null;

    switch (algorithm) {
      case 'FCFS':
        return availableOrders.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      
      case 'SJF':
        return availableOrders.sort((a, b) => a.remainingTime - b.remainingTime)[0];
      
      case 'Priority':
        return availableOrders.sort((a, b) => a.priority - b.priority)[0];
      
      case 'RR':
        // Round Robin: pick from queue in order
        return availableOrders[0];
      
      default:
        return availableOrders[0];
    }
  };

  const simulateStep = () => {
    // Add newly arrived orders to ready queue
    const newlyArrived = orders.filter(o => 
      o.arrivalTime === currentTime && o.remainingTime > 0
    );
    
    let updatedQueue = [...readyQueue];
    newlyArrived.forEach(order => {
      if (!updatedQueue.find(o => o.id === order.id) && 
          (!currentOrder || currentOrder.id !== order.id)) {
        updatedQueue.push(order);
      }
    });

    // If no current order, select next one
    if (!currentOrder) {
      const availableOrders = algorithm === 'RR' ? updatedQueue : getReadyOrders();
      const nextOrder = selectNextOrder(availableOrders);
      
      if (nextOrder) {
        setCurrentOrder({ ...nextOrder });
        if (nextOrder.startTime === null) {
          setOrders(orders.map(o => 
            o.id === nextOrder.id ? { ...o, startTime: currentTime } : o
          ));
        }
        if (algorithm === 'RR') {
          updatedQueue = updatedQueue.filter(o => o.id !== nextOrder.id);
          setQuantumRemaining(quantum);
        }
      } else {
        // No orders available, just advance time
        setCurrentTime(currentTime + 1);
        return;
      }
    }

    // Process current order
    if (currentOrder) {
      const newRemainingTime = currentOrder.remainingTime - 1;
      const newQuantumRemaining = algorithm === 'RR' ? quantumRemaining - 1 : quantum;

      if (newRemainingTime === 0) {
        // Order completed
        const completedOrder = {
          ...currentOrder,
          remainingTime: 0,
          completionTime: currentTime + 1,
          turnaroundTime: (currentTime + 1) - currentOrder.arrivalTime,
          waitingTime: (currentTime + 1) - currentOrder.arrivalTime - currentOrder.burstTime
        };
        
        setCompletedOrders([...completedOrders, completedOrder]);
        setOrders(orders.map(o => 
          o.id === currentOrder.id ? completedOrder : o
        ));
        setCurrentOrder(null);
        setQuantumRemaining(quantum);
      } else if (algorithm === 'RR' && newQuantumRemaining === 0) {
        // Time quantum expired for Round Robin
        const preemptedOrder = { ...currentOrder, remainingTime: newRemainingTime };
        setOrders(orders.map(o => 
          o.id === currentOrder.id ? preemptedOrder : o
        ));
        updatedQueue.push(preemptedOrder); // Back to queue
        setCurrentOrder(null);
        setQuantumRemaining(quantum);
      } else {
        // Continue processing
        setCurrentOrder({ ...currentOrder, remainingTime: newRemainingTime });
        setOrders(orders.map(o => 
          o.id === currentOrder.id ? { ...o, remainingTime: newRemainingTime } : o
        ));
        setQuantumRemaining(newQuantumRemaining);
      }
    }

    setReadyQueue(updatedQueue);
    setCurrentTime(currentTime + 1);

    // Stop if all orders completed
    if (orders.every(o => o.remainingTime === 0 || o.completionTime !== null)) {
      setIsRunning(false);
    }
  };

  const calculateMetrics = () => {
    if (completedOrders.length === 0) return null;
    
    const avgTurnaround = completedOrders.reduce((sum, o) => sum + o.turnaroundTime, 0) / completedOrders.length;
    const avgWaiting = completedOrders.reduce((sum, o) => sum + o.waitingTime, 0) / completedOrders.length;
    
    return {
      avgTurnaround: avgTurnaround.toFixed(2),
      avgWaiting: avgWaiting.toFixed(2)
    };
  };

  const metrics = calculateMetrics();

  const algorithmInfo = {
    FCFS: {
      name: 'First-Come, First-Served',
      description: 'Orders are processed in the order they arrive. Simple but can cause long waits.',
      pros: 'Fair, simple, no starvation',
      cons: 'Convoy effect (short orders wait for long ones)'
    },
    SJF: {
      name: 'Shortest Job First',
      description: 'Chef always picks the fastest order to complete next.',
      pros: 'Minimizes average waiting time',
      cons: 'Long orders may starve, requires knowing cooking time'
    },
    Priority: {
      name: 'Priority Scheduling',
      description: 'VIP customers (priority 1) get served first, then priority 2, then priority 3.',
      pros: 'Important orders processed first',
      cons: 'Low priority orders may starve'
    },
    RR: {
      name: 'Round Robin',
      description: `Each order gets ${quantum} minutes of chef time, then goes to back of queue.`,
      pros: 'Fair, responsive, no starvation',
      cons: 'Context switching overhead, higher average turnaround'
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            👨‍🍳 CPU Scheduling = Order Processing
          </h1>
          <p className="text-gray-600">Which order should the chef work on next?</p>
        </div>

        {/* Algorithm Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Select Scheduling Algorithm:</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={isRunning}
              className="w-full p-3 border-2 border-gray-300 rounded-lg font-semibold"
            >
              <option value="FCFS">FCFS - First Come First Served</option>
              <option value="SJF">SJF - Shortest Job First</option>
              <option value="Priority">Priority Scheduling</option>
              <option value="RR">RR - Round Robin</option>
            </select>
          </div>
          
          {algorithm === 'RR' && (
            <div>
              <label className="block text-sm font-semibold mb-2">Time Quantum (minutes):</label>
              <input
                type="number"
                min="1"
                max="5"
                value={quantum}
                onChange={(e) => setQuantum(parseInt(e.target.value))}
                disabled={isRunning}
                className="w-full p-3 border-2 border-gray-300 rounded-lg font-semibold"
              />
            </div>
          )}
        </div>

        {/* Algorithm Info */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-2">{algorithmInfo[algorithm].name}</h3>
          <p className="text-sm mb-2">{algorithmInfo[algorithm].description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-green-700">✓ Pros:</span> {algorithmInfo[algorithm].pros}
            </div>
            <div>
              <span className="font-semibold text-red-700">✗ Cons:</span> {algorithmInfo[algorithm].cons}
            </div>
          </div>
        </div>

        {/* Current Time */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold text-xl flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Time: {currentTime} minutes
          </div>
        </div>

        {/* Chef Station (Current Order) */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 text-center">👨‍🍳 Chef Station (CPU)</h3>
          <div className="border-4 border-green-500 rounded-lg p-6 bg-green-50 min-h-[120px]">
            {currentOrder ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl mb-2">{currentOrder.dish}</div>
                  <div className="text-sm text-gray-700">
                    <div>Order #{currentOrder.id} | Priority: {currentOrder.priority}</div>
                    <div>Remaining time: {currentOrder.remainingTime} min</div>
                    {algorithm === 'RR' && (
                      <div className="font-semibold text-orange-600">
                        Time quantum left: {quantumRemaining} min
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-6xl animate-pulse">🔥</div>
              </div>
            ) : (
              <div className="text-center text-gray-400 text-xl">Chef is idle</div>
            )}
          </div>
        </div>

        {/* Ready Queue */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 text-center">📋 Ready Queue (Waiting Orders)</h3>
          <div className="border-4 border-yellow-500 rounded-lg p-4 bg-yellow-50 min-h-[100px]">
            {readyQueue.length > 0 ? (
              <div className="flex gap-3 flex-wrap">
                {readyQueue.map((order, idx) => (
                  <div key={order.id} className={`${order.color} p-3 rounded-lg shadow-md`}>
                    <div className="font-semibold">{order.dish}</div>
                    <div className="text-xs">#{order.id} | {order.remainingTime}min | P{order.priority}</div>
                    {algorithm === 'FCFS' && <div className="text-xs font-bold">Position: {idx + 1}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400">No orders waiting</div>
            )}
          </div>
        </div>

        {/* Not Yet Arrived */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 text-center">⏰ Not Yet Arrived</h3>
          <div className="border-4 border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[80px]">
            <div className="flex gap-3 flex-wrap">
              {orders.filter(o => o.arrivalTime > currentTime).map(order => (
                <div key={order.id} className={`${order.color} opacity-50 p-3 rounded-lg shadow-md`}>
                  <div className="font-semibold">{order.dish}</div>
                  <div className="text-xs">Arrives at: {order.arrivalTime}min</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        {completedOrders.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3 text-center">✅ Completed Orders</h3>
            <div className="border-4 border-blue-500 rounded-lg p-4 bg-blue-50">
              <div className="flex gap-3 flex-wrap">
                {completedOrders.map(order => (
                  <div key={order.id} className={`${order.color} p-3 rounded-lg shadow-md`}>
                    <div className="font-semibold">{order.dish}</div>
                    <div className="text-xs">
                      <div>Completed: {order.completionTime}min</div>
                      <div>Turnaround: {order.turnaroundTime}min</div>
                      <div>Waiting: {order.waitingTime}min</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Metrics */}
        {metrics && (
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-lg mb-2 text-center">📊 Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-700">{metrics.avgTurnaround} min</div>
                <div className="text-sm">Avg Turnaround Time</div>
                <div className="text-xs text-gray-600">(Completion - Arrival)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">{metrics.avgWaiting} min</div>
                <div className="text-sm">Avg Waiting Time</div>
                <div className="text-xs text-gray-600">(Turnaround - Burst)</div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={reset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={orders.every(o => o.completionTime !== null)}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start
              </>
            )}
          </button>
        </div>

        {/* Order Information Table */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-3">📑 Order Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 p-2">Order</th>
                  <th className="border border-gray-300 p-2">Dish</th>
                  <th className="border border-gray-300 p-2">Arrival</th>
                  <th className="border border-gray-300 p-2">Burst</th>
                  <th className="border border-gray-300 p-2">Priority</th>
                  <th className="border border-gray-300 p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {initialOrders.map(order => {
                  const currentOrderData = orders.find(o => o.id === order.id);
                  const completed = completedOrders.find(o => o.id === order.id);
                  return (
                    <tr key={order.id} className={completed ? 'bg-green-100' : ''}>
                      <td className="border border-gray-300 p-2 text-center">#{order.id}</td>
                      <td className="border border-gray-300 p-2">{order.dish}</td>
                      <td className="border border-gray-300 p-2 text-center">{order.arrivalTime} min</td>
                      <td className="border border-gray-300 p-2 text-center">{order.burstTime} min</td>
                      <td className="border border-gray-300 p-2 text-center">{order.priority}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        {completed ? '✅ Done' : 
                         currentOrder?.id === order.id ? '🔥 Cooking' :
                         currentOrderData?.arrivalTime > currentTime ? '⏰ Waiting' :
                         '📋 Ready'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="mt-6 bg-purple-100 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Key Concepts
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><strong>Turnaround Time:</strong> Total time from order arrival to completion</li>
            <li><strong>Waiting Time:</strong> Time spent in ready queue (not being cooked)</li>
            <li><strong>Burst Time:</strong> Actual cooking time required</li>
            <li><strong>Preemption:</strong> Round Robin can interrupt cooking and queue order again</li>
            <li><strong>Starvation:</strong> Some algorithms may delay low-priority orders indefinitely</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SchedulingSimulator;