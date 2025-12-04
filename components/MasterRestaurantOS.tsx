import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Info, AlertTriangle, CheckCircle, Lock, Users, Clock } from 'lucide-react';

const MasterRestaurantOS = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1000);
  
  // Configuration
  const [config, setConfig] = useState({
    schedulingAlgorithm: 'RR',
    quantum: 2,
    numChefs: 2,
    numTables: 4,
    useMemoryManagement: true,
    useSynchronization: true
  });

  // System State
  const [orders, setOrders] = useState([]);
  const [readyQueue, setReadyQueue] = useState([]);
  const [chefs, setChefs] = useState([
    { id: 'A', currentOrder: null, timeRemaining: 0, location: 'idle' },
    { id: 'B', currentOrder: null, timeRemaining: 0, location: 'idle' }
  ]);
  const [tables, setTables] = useState([
    { id: 0, size: 4, occupied: null },
    { id: 1, size: 4, occupied: null },
    { id: 2, size: 4, occupied: null },
    { id: 3, size: 4, occupied: null }
  ]);
  const [waitingLounge, setWaitingLounge] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [logs, setLogs] = useState([]);
  const [locks, setLocks] = useState({ deepFryer: null, pantry: null });
  const [stats, setStats] = useState({
    totalOrders: 0,
    completed: 0,
    avgTurnaround: 0,
    contextSwitches: 0,
    pageFaults: 0,
    deadlocks: 0
  });

  // Order templates
  const orderTemplates = [
    { dish: '🍔 Burger', burstTime: 3, memorySize: 4, priority: 2, needsDeepFryer: true },
    { dish: '🍕 Pizza', burstTime: 4, memorySize: 4, priority: 1, needsDeepFryer: false },
    { dish: '🥗 Salad', burstTime: 2, memorySize: 4, priority: 3, needsDeepFryer: false },
    { dish: '🍝 Pasta', burstTime: 3, memorySize: 4, priority: 2, needsDeepFryer: false },
    { dish: '🌮 Taco', burstTime: 2, memorySize: 4, priority: 1, needsDeepFryer: true },
    { dish: '🍗 Chicken', burstTime: 5, memorySize: 8, priority: 2, needsDeepFryer: true },
  ];

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev.slice(-20), { time: currentTime, message, type }]);
  };

  const generateOrder = () => {
    const template = orderTemplates[Math.floor(Math.random() * orderTemplates.length)];
    const order = {
      id: `O${stats.totalOrders + 1}`,
      ...template,
      arrivalTime: currentTime,
      remainingTime: template.burstTime,
      startTime: null,
      completionTime: null,
      state: 'NEW',
      tableId: null,
      lastScheduledTime: null
    };
    
    setStats(prev => ({ ...prev, totalOrders: prev.totalOrders + 1 }));
    return order;
  };

  const reset = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setOrders([]);
    setReadyQueue([]);
    setChefs(chefs.map(c => ({ ...c, currentOrder: null, timeRemaining: 0, location: 'idle' })));
    setTables(tables.map(t => ({ ...t, occupied: null })));
    setWaitingLounge([]);
    setCompletedOrders([]);
    setLogs([]);
    setLocks({ deepFryer: null, pantry: null });
    setStats({
      totalOrders: 0,
      completed: 0,
      avgTurnaround: 0,
      contextSwitches: 0,
      pageFaults: 0,
      deadlocks: 0
    });
    addLog('🔄 System reset - Restaurant ready', 'info');
  };

  // Memory Management
  const allocateTable = (order) => {
    const pagesNeeded = Math.ceil(order.memorySize / 4);
    const availableTables = tables.filter(t => !t.occupied);

    if (availableTables.length >= pagesNeeded) {
      const allocated = availableTables.slice(0, pagesNeeded);
      setTables(tables.map(t => {
        if (allocated.find(at => at.id === t.id)) {
          return { ...t, occupied: order.id };
        }
        return t;
      }));
      return true;
    }
    return false;
  };

  const deallocateTable = (orderId) => {
    setTables(tables.map(t => 
      t.occupied === orderId ? { ...t, occupied: null } : t
    ));
  };

  const swapOut = () => {
    const oldestOrder = orders.find(o => o.state === 'READY' && o.tableId !== null);
    if (oldestOrder) {
      deallocateTable(oldestOrder.id);
      setWaitingLounge(prev => [...prev, oldestOrder.id]);
      setStats(prev => ({ ...prev, pageFaults: prev.pageFaults + 1 }));
      addLog(`💾 Swapped out ${oldestOrder.id} to disk`, 'warning');
      return true;
    }
    return false;
  };

  // Scheduling
  const selectNextOrder = (chef) => {
    if (readyQueue.length === 0) return null;

    let selected = null;
    switch (config.schedulingAlgorithm) {
      case 'FCFS':
        selected = readyQueue[0];
        break;
      case 'SJF':
        selected = readyQueue.reduce((min, o) => 
          o.remainingTime < min.remainingTime ? o : min
        );
        break;
      case 'Priority':
        selected = readyQueue.reduce((max, o) => 
          o.priority < max.priority ? o : max
        );
        break;
      case 'RR':
        selected = readyQueue[0];
        break;
      default:
        selected = readyQueue[0];
    }

    // Check synchronization for deep fryer
    if (config.useSynchronization && selected.needsDeepFryer) {
      if (locks.deepFryer === null) {
        setLocks(prev => ({ ...prev, deepFryer: chef.id }));
        addLog(`🔒 Chef ${chef.id} acquired deep fryer lock`, 'success');
      } else if (locks.deepFryer !== chef.id) {
        addLog(`⏸️ Chef ${chef.id} blocked - waiting for deep fryer`, 'warning');
        return null;
      }
    }

    return selected;
  };

  const processChef = (chef) => {
    // If chef is idle, assign new order
    if (chef.currentOrder === null) {
      const nextOrder = selectNextOrder(chef);
      if (nextOrder) {
        setReadyQueue(readyQueue.filter(o => o.id !== nextOrder.id));
        setChefs(chefs.map(c => 
          c.id === chef.id 
            ? { 
                ...c, 
                currentOrder: nextOrder.id, 
                timeRemaining: config.schedulingAlgorithm === 'RR' ? config.quantum : nextOrder.remainingTime,
                location: 'cooking'
              }
            : c
        ));
        
        // Update order state
        setOrders(orders.map(o => {
          if (o.id === nextOrder.id) {
            return {
              ...o,
              state: 'RUNNING',
              startTime: o.startTime || currentTime,
              lastScheduledTime: currentTime
            };
          }
          return o;
        }));
        
        addLog(`👨‍🍳 Chef ${chef.id} cooking ${nextOrder.dish}`, 'info');
        setStats(prev => ({ ...prev, contextSwitches: prev.contextSwitches + 1 }));
      }
      return;
    }

    // Process current order
    const order = orders.find(o => o.id === chef.currentOrder);
    if (!order) return;

    const newRemainingTime = order.remainingTime - 1;
    const newTimeRemaining = chef.timeRemaining - 1;

    // Order completed
    if (newRemainingTime === 0) {
      const completedOrder = {
        ...order,
        remainingTime: 0,
        completionTime: currentTime + 1,
        turnaroundTime: (currentTime + 1) - order.arrivalTime,
        state: 'TERMINATED'
      };

      setOrders(orders.map(o => o.id === order.id ? completedOrder : o));
      setCompletedOrders(prev => [...prev, completedOrder]);
      
      // Free table
      if (config.useMemoryManagement) {
        deallocateTable(order.id);
      }

      // Release locks
      if (order.needsDeepFryer && locks.deepFryer === chef.id) {
        setLocks(prev => ({ ...prev, deepFryer: null }));
        addLog(`🔓 Chef ${chef.id} released deep fryer`, 'success');
      }

      setChefs(chefs.map(c => 
        c.id === chef.id ? { ...c, currentOrder: null, timeRemaining: 0, location: 'idle' } : c
      ));

      // Update stats
      const allCompleted = completedOrders.concat([completedOrder]);
      const avgTT = allCompleted.reduce((sum, o) => sum + o.turnaroundTime, 0) / allCompleted.length;
      setStats(prev => ({ 
        ...prev, 
        completed: prev.completed + 1,
        avgTurnaround: avgTT.toFixed(2)
      }));

      addLog(`✅ ${order.dish} completed by Chef ${chef.id}`, 'success');
    }
    // Time quantum expired (Round Robin)
    else if (config.schedulingAlgorithm === 'RR' && newTimeRemaining === 0) {
      const preemptedOrder = { ...order, remainingTime: newRemainingTime, state: 'READY' };
      setOrders(orders.map(o => o.id === order.id ? preemptedOrder : o));
      setReadyQueue(prev => [...prev, preemptedOrder]);
      
      setChefs(chefs.map(c => 
        c.id === chef.id ? { ...c, currentOrder: null, timeRemaining: 0, location: 'idle' } : c
      ));

      addLog(`⏰ ${order.dish} preempted (quantum expired)`, 'warning');
    }
    // Continue processing
    else {
      setOrders(orders.map(o => 
        o.id === order.id ? { ...o, remainingTime: newRemainingTime } : o
      ));
      setChefs(chefs.map(c => 
        c.id === chef.id ? { ...c, timeRemaining: newTimeRemaining } : c
      ));
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      // Generate new order occasionally
      if (currentTime % 4 === 0 && Math.random() > 0.3 && stats.totalOrders < 15) {
        const newOrder = generateOrder();
        setOrders(prev => [...prev, newOrder]);
        addLog(`📥 New order: ${newOrder.dish} (${newOrder.id})`, 'info');

        // Allocate table (memory)
        if (config.useMemoryManagement) {
          if (allocateTable(newOrder)) {
            newOrder.state = 'READY';
            newOrder.tableId = 'allocated';
            setReadyQueue(prev => [...prev, newOrder]);
            addLog(`🪑 Table allocated for ${newOrder.id}`, 'success');
          } else {
            // Try swapping
            if (swapOut()) {
              if (allocateTable(newOrder)) {
                newOrder.state = 'READY';
                newOrder.tableId = 'allocated';
                setReadyQueue(prev => [...prev, newOrder]);
                addLog(`🪑 Table allocated for ${newOrder.id} after swap`, 'success');
              } else {
                setWaitingLounge(prev => [...prev, newOrder.id]);
                addLog(`💤 ${newOrder.id} waiting in lounge (no tables)`, 'error');
              }
            } else {
              setWaitingLounge(prev => [...prev, newOrder.id]);
              addLog(`💤 ${newOrder.id} waiting in lounge (no tables)`, 'error');
            }
          }
        } else {
          newOrder.state = 'READY';
          setReadyQueue(prev => [...prev, newOrder]);
        }
      }

      // Process each chef
      chefs.forEach(chef => processChef(chef));

      setCurrentTime(currentTime + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentTime, orders, readyQueue, chefs, tables, config]);

  const getStateColor = (state) => {
    switch (state) {
      case 'NEW': return 'bg-blue-400';
      case 'READY': return 'bg-yellow-400';
      case 'RUNNING': return 'bg-green-500';
      case 'WAITING': return 'bg-orange-400';
      case 'TERMINATED': return 'bg-gray-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏪 Master Restaurant Operating System
          </h1>
          <p className="text-gray-600">Complete simulation: Process Management + Scheduling + Concurrency + Memory</p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-5 h-5" />
            <h3 className="font-bold text-lg">System Configuration</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="block font-semibold mb-1">Scheduling:</label>
              <select
                value={config.schedulingAlgorithm}
                onChange={(e) => setConfig({ ...config, schedulingAlgorithm: e.target.value })}
                disabled={isRunning}
                className="w-full p-2 border rounded"
              >
                <option value="FCFS">FCFS</option>
                <option value="SJF">SJF</option>
                <option value="Priority">Priority</option>
                <option value="RR">Round Robin</option>
              </select>
            </div>
            {config.schedulingAlgorithm === 'RR' && (
              <div>
                <label className="block font-semibold mb-1">Quantum:</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={config.quantum}
                  onChange={(e) => setConfig({ ...config, quantum: parseInt(e.target.value) })}
                  disabled={isRunning}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}
            <div>
              <label className="block font-semibold mb-1">Speed:</label>
              <select
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              >
                <option value="2000">Slow</option>
                <option value="1000">Normal</option>
                <option value="500">Fast</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.useSynchronization}
                  onChange={(e) => setConfig({ ...config, useSynchronization: e.target.checked })}
                  disabled={isRunning}
                  className="w-4 h-4"
                />
                <span className="font-semibold">Use Locks</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={config.useMemoryManagement}
                  onChange={(e) => setConfig({ ...config, useMemoryManagement: e.target.checked })}
                  disabled={isRunning}
                  className="w-4 h-4"
                />
                <span className="font-semibold">Memory Mgmt</span>
              </label>
            </div>
          </div>
        </div>

        {/* System Clock & Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-lg text-center">
            <Clock className="w-6 h-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{currentTime}</div>
            <div className="text-xs">Time Units</div>
          </div>
          <div className="bg-green-600 text-white p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{stats.completed}/{stats.totalOrders}</div>
            <div className="text-xs">Completed</div>
          </div>
          <div className="bg-purple-600 text-white p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{stats.avgTurnaround}</div>
            <div className="text-xs">Avg Turnaround</div>
          </div>
          <div className="bg-orange-600 text-white p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{stats.contextSwitches}</div>
            <div className="text-xs">Context Switches</div>
          </div>
          <div className="bg-red-600 text-white p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{stats.pageFaults}</div>
            <div className="text-xs">Page Faults</div>
          </div>
        </div>

        {/* Main System View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Chefs (CPUs) */}
          <div className="border-4 border-green-500 rounded-lg p-4 bg-green-50">
            <h3 className="font-bold text-lg mb-3">👨‍🍳 Chefs (CPUs)</h3>
            {chefs.map(chef => (
              <div key={chef.id} className="bg-white rounded-lg p-3 mb-2 border-2 border-gray-300">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Chef {chef.id}</div>
                    {chef.currentOrder ? (
                      <div className="text-sm">
                        <div className="text-green-700 font-semibold">
                          Cooking: {orders.find(o => o.id === chef.currentOrder)?.dish}
                        </div>
                        {config.schedulingAlgorithm === 'RR' && (
                          <div className="text-orange-600">Quantum: {chef.timeRemaining}</div>
                        )}
                        {locks.deepFryer === chef.id && (
                          <div className="text-blue-600 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Holding fryer
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Idle</div>
                    )}
                  </div>
                  <div className="text-3xl">
                    {chef.currentOrder ? '🔥' : '😴'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ready Queue */}
          <div className="border-4 border-yellow-500 rounded-lg p-4 bg-yellow-50">
            <h3 className="font-bold text-lg mb-3">📋 Ready Queue</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {readyQueue.length === 0 ? (
                <div className="text-gray-400 text-center py-4">Empty</div>
              ) : (
                readyQueue.map((order, idx) => (
                  <div key={order.id} className={`${getStateColor(order.state)} p-2 rounded text-sm`}>
                    <div className="flex justify-between">
                      <span className="font-semibold">{order.dish} ({order.id})</span>
                      <span>Remaining: {order.remainingTime}t</span>
                    </div>
                    {config.schedulingAlgorithm === 'Priority' && (
                      <div className="text-xs">Priority: {order.priority}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Memory (Tables) & Waiting Lounge */}
        {config.useMemoryManagement && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="border-4 border-blue-500 rounded-lg p-4 bg-blue-50">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Tables (Physical Memory)
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {tables.map(table => (
                  <div key={table.id} className={`p-3 rounded text-center border-2 ${
                    table.occupied 
                      ? 'bg-green-200 border-green-600' 
                      : 'bg-white border-dashed border-gray-300'
                  }`}>
                    <div className="text-xs font-semibold">T{table.id}</div>
                    <div className="text-xs">{table.occupied || 'Free'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-4 border-orange-500 rounded-lg p-4 bg-orange-50">
              <h3 className="font-bold text-lg mb-3">💤 Waiting Lounge (Swap)</h3>
              <div className="flex gap-2 flex-wrap">
                {waitingLounge.length === 0 ? (
                  <div className="text-gray-400">Empty</div>
                ) : (
                  waitingLounge.map(orderId => {
                    const order = orders.find(o => o.id === orderId);
                    return order ? (
                      <div key={orderId} className="bg-orange-200 px-3 py-1 rounded text-sm">
                        {order.dish}
                      </div>
                    ) : null;
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Execution Log */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3">📜 System Log</h3>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs max-h-48 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">System ready...</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className={`mb-1 ${
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'warning' ? 'text-yellow-400' :
                  log.type === 'success' ? 'text-green-400' :
                  'text-gray-300'
                }`}>
                  <span className="text-gray-500">[T{log.time}]</span> {log.message}
                </div>
              ))
            )}
          </div>
        </div>

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
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
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

        {/* Completed Orders Summary */}
        {completedOrders.length > 0 && (
          <div className="bg-green-100 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Completed Orders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              {completedOrders.slice(-6).map(order => (
                <div key={order.id} className="bg-white p-2 rounded border">
                  <div className="font-semibold">{order.dish}</div>
                  <div className="text-xs text-gray-600">
                    Turnaround: {order.turnaroundTime}t | 
                    Wait: {order.turnaroundTime - order.burstTime}t
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            System Concepts Demonstrated
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong>Process States:</strong> NEW → READY → RUNNING → TERMINATED
            </div>
            <div>
              <strong>Scheduling:</strong> FCFS, SJF, Priority, Round Robin
            </div>
            <div>
              <strong>Concurrency:</strong> Multiple chefs, mutex locks (deep fryer)
            </div>
            <div>
              <strong>Memory:</strong> Paging (tables), swapping, page faults
            </div>
            <div>
              <strong>Context Switch:</strong> Count of chef task changes
            </div>
            <div>
              <strong>Turnaround Time:</strong> Completion - Arrival
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterRestaurantOS;