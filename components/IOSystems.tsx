import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Zap, AlertCircle, CheckCircle, Timer, TrendingUp } from 'lucide-react';

const IOSystems = () => {
  const [scenario, setScenario] = useState('polling');
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [chefState, setChefState] = useState({ action: 'idle', location: 'prep', wastedTime: 0 });
  const [ovenState, setOvenState] = useState({ cooking: false, timeRemaining: 0, dish: null });
  const [dishwasherState, setDishwasherState] = useState({ running: false, progress: 0 });
  const [completedTasks, setCompletedTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ 
    cpuUtilization: 0, 
    wastedCycles: 0, 
    completedJobs: 0,
    totalTime: 0 
  });

  const scenarios = {
    polling: {
      name: 'Polling (Busy Waiting)',
      problem: 'Chef keeps checking oven every second instead of doing other work',
      description: 'CPU repeatedly checks if I/O device is ready. Simple but wasteful.',
      steps: 15,
      concept: 'Polling - CPU continuously checks device status in a loop'
    },
    interrupt: {
      name: 'Interrupt-Driven I/O',
      problem: 'Oven timer beeps when ready, chef can work on other tasks',
      description: 'Device notifies CPU when ready. Efficient - CPU does useful work.',
      steps: 15,
      concept: 'Interrupts - Device signals CPU when operation completes'
    },
    dma: {
      name: 'DMA (Direct Memory Access)',
      problem: 'Dishwasher works independently, chef only needs to start/stop it',
      description: 'Device transfers data directly to memory without CPU involvement.',
      steps: 15,
      concept: 'DMA - Device controller handles data transfer, CPU only involved at start/end'
    },
    buffering: {
      name: 'Buffering & Spooling',
      problem: 'Prep ingredients while waiting, smooth out timing differences',
      description: 'Buffer manages speed differences between producer and consumer.',
      steps: 15,
      concept: 'Buffering - Temporary storage to handle speed mismatches'
    }
  };

  const reset = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setChefState({ action: 'idle', location: 'prep', wastedTime: 0 });
    setOvenState({ cooking: false, timeRemaining: 0, dish: null });
    setDishwasherState({ running: false, progress: 0 });
    setCompletedTasks([]);
    setLogs([]);
    setStats({ cpuUtilization: 0, wastedCycles: 0, completedJobs: 0, totalTime: 0 });
    addLog('🔄 Kitchen reset - ready for orders', 'info');
  };

  useEffect(() => {
    reset();
  }, [scenario]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      executeStep();
    }, 600);

    return () => clearTimeout(timer);
  }, [isRunning, currentTime]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev.slice(-15), { time: currentTime, message, type }]);
  };

  const executeStep = () => {
    if (scenario === 'polling') {
      executePolling();
    } else if (scenario === 'interrupt') {
      executeInterrupt();
    } else if (scenario === 'dma') {
      executeDMA();
    } else if (scenario === 'buffering') {
      executeBuffering();
    }
  };

  const executePolling = () => {
    switch (currentTime) {
      case 0:
        addLog('📋 New order arrives: Burger needs 5 minutes in oven', 'info');
        setOvenState({ cooking: true, timeRemaining: 5, dish: '🍔 Burger' });
        setChefState({ action: 'starting oven', location: 'oven', wastedTime: 0 });
        break;
      case 1:
        addLog('👨‍🍳 Chef puts burger in oven, starts cooking', 'success');
        setChefState({ action: 'checking oven', location: 'oven', wastedTime: 0 });
        break;
      case 2:
        addLog('⏰ Polling: Chef checks oven... not ready yet', 'warning');
        setOvenState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        setChefState(prev => ({ ...prev, wastedTime: prev.wastedTime + 1 }));
        setStats(prev => ({ ...prev, wastedCycles: prev.wastedCycles + 1 }));
        break;
      case 3:
        addLog('⏰ Polling: Chef checks oven... still cooking', 'warning');
        setOvenState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        setChefState(prev => ({ ...prev, wastedTime: prev.wastedTime + 1 }));
        setStats(prev => ({ ...prev, wastedCycles: prev.wastedCycles + 1 }));
        break;
      case 4:
        addLog('⏰ Polling: Chef checks oven... almost done', 'warning');
        setOvenState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        setChefState(prev => ({ ...prev, wastedTime: prev.wastedTime + 1 }));
        setStats(prev => ({ ...prev, wastedCycles: prev.wastedCycles + 1 }));
        break;
      case 5:
        addLog('⏰ Polling: Chef checks oven... still waiting', 'warning');
        setOvenState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        setChefState(prev => ({ ...prev, wastedTime: prev.wastedTime + 1 }));
        setStats(prev => ({ ...prev, wastedCycles: prev.wastedCycles + 1 }));
        break;
      case 6:
        addLog('⏰ Polling: Chef checks oven... FINALLY READY!', 'success');
        setOvenState({ cooking: false, timeRemaining: 0, dish: '🍔 Burger' });
        setChefState(prev => ({ ...prev, action: 'removing food', wastedTime: prev.wastedTime + 1 }));
        setStats(prev => ({ ...prev, wastedCycles: prev.wastedCycles + 1 }));
        break;
      case 7:
        addLog('✅ Burger completed and served', 'success');
        setCompletedTasks(prev => [...prev, { dish: '🍔 Burger', method: 'Polling', wastedTime: 5 }]);
        setChefState({ action: 'idle', location: 'prep', wastedTime: 5 });
        setStats(prev => ({ 
          ...prev, 
          completedJobs: prev.completedJobs + 1,
          totalTime: currentTime + 1,
          cpuUtilization: ((1 / (currentTime + 1)) * 100).toFixed(0)
        }));
        break;
      case 8:
        addLog('📊 ANALYSIS: Chef wasted 5 time units just checking!', 'error');
        addLog('❌ Problem: CPU could have done useful work instead', 'error');
        break;
      case 9:
        addLog('💡 Solution: Use interrupts instead of polling', 'info');
        setIsRunning(false);
        break;
      default:
        if (currentTime > 9) setIsRunning(false);
    }
    setCurrentTime(currentTime + 1);
  };

  const executeInterrupt = () => {
    switch (currentTime) {
      case 0:
        addLog('📋 New order: Burger (5 min) + Salad prep needed', 'info');
        setOvenState({ cooking: true, timeRemaining: 5, dish: '🍔 Burger' });
        setChefState({ action: 'starting oven', location: 'oven', wastedTime: 0 });
        break;
      case 1:
        addLog('👨‍🍳 Chef puts burger in oven (with timer!)', 'success');
        addLog('🔔 Timer will beep when ready', 'info');
        setChefState({ action: 'preparing salad', location: 'prep', wastedTime: 0 });
        break;
      case 2:
        addLog('✂️ Chef prepares salad (useful work!)', 'success');
        setOvenState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        break;
      case 3:
        addLog('✂️ Chef continues salad prep', 'success');
        setOvenState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        break;
      case 4:
        addLog('✂️ Chef finishing salad', 'success');
        setOvenState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        break;
      case 5:
        addLog('✂️ Salad complete!', 'success');
        setOvenState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        setCompletedTasks(prev => [...prev, { dish: '🥗 Salad', method: 'Prep', wastedTime: 0 }]);
        break;
      case 6:
        addLog('🔔 INTERRUPT! Oven timer beeps!', 'warning');
        setOvenState({ cooking: false, timeRemaining: 0, dish: '🍔 Burger' });
        setChefState({ action: 'handling interrupt', location: 'oven', wastedTime: 0 });
        break;
      case 7:
        addLog('👨‍🍳 Chef removes burger from oven', 'success');
        setChefState({ action: 'plating', location: 'prep', wastedTime: 0 });
        break;
      case 8:
        addLog('✅ Both dishes completed!', 'success');
        setCompletedTasks(prev => [...prev, { dish: '🍔 Burger', method: 'Interrupt', wastedTime: 0 }]);
        setChefState({ action: 'idle', location: 'prep', wastedTime: 0 });
        setStats(prev => ({ 
          ...prev, 
          completedJobs: 2,
          totalTime: currentTime + 1,
          cpuUtilization: ((7 / (currentTime + 1)) * 100).toFixed(0),
          wastedCycles: 0
        }));
        break;
      case 9:
        addLog('📊 ANALYSIS: 0 wasted time! Chef did useful work', 'success');
        addLog('✅ Interrupts are efficient - no busy waiting', 'success');
        setIsRunning(false);
        break;
      default:
        if (currentTime > 9) setIsRunning(false);
    }
    setCurrentTime(currentTime + 1);
  };

  const executeDMA = () => {
    switch (currentTime) {
      case 0:
        addLog('📋 Chef needs to: Cook burger + Wash dishes', 'info');
        addLog('🍽️ Dishwasher available (has built-in controller!)', 'info');
        setChefState({ action: 'loading dishwasher', location: 'dishwasher', wastedTime: 0 });
        break;
      case 1:
        addLog('👨‍🍳 Chef loads dishes into dishwasher', 'success');
        addLog('▶️ Chef presses START (DMA initiated)', 'success');
        setDishwasherState({ running: true, progress: 0 });
        setChefState({ action: 'starting oven', location: 'oven', wastedTime: 0 });
        break;
      case 2:
        addLog('👨‍🍳 Chef puts burger in oven (with timer)', 'success');
        addLog('🔄 Dishwasher working independently (DMA)', 'info');
        setOvenState({ cooking: true, timeRemaining: 4, dish: '🍔 Burger' });
        setDishwasherState(prev => ({ ...prev, progress: 20 }));
        setChefState({ action: 'chopping vegetables', location: 'prep', wastedTime: 0 });
        break;
      case 3:
        addLog('✂️ Chef does other prep work', 'success');
        setOvenState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        setDishwasherState(prev => ({ ...prev, progress: 40 }));
        break;
      case 4:
        addLog('✂️ Chef continues useful work', 'success');
        setOvenState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        setDishwasherState(prev => ({ ...prev, progress: 60 }));
        break;
      case 5:
        addLog('✂️ Chef still working (no interruptions!)', 'success');
        setOvenState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        setDishwasherState(prev => ({ ...prev, progress: 80 }));
        break;
      case 6:
        addLog('🔔 Oven beeps! Chef handles interrupt', 'warning');
        setOvenState({ cooking: false, timeRemaining: 0, dish: '🍔 Burger' });
        setDishwasherState(prev => ({ ...prev, progress: 100 }));
        setChefState({ action: 'removing burger', location: 'oven', wastedTime: 0 });
        break;
      case 7:
        addLog('✅ Burger done!', 'success');
        addLog('🔔 Dishwasher beeps! (DMA complete interrupt)', 'warning');
        setDishwasherState({ running: false, progress: 100 });
        setCompletedTasks(prev => [...prev, { dish: '🍔 Burger', method: 'DMA', wastedTime: 0 }]);
        setChefState({ action: 'unloading dishwasher', location: 'dishwasher', wastedTime: 0 });
        break;
      case 8:
        addLog('👨‍🍳 Chef unloads clean dishes', 'success');
        addLog('✅ Both tasks complete!', 'success');
        setCompletedTasks(prev => [...prev, { dish: '🍽️ Dishes', method: 'DMA', wastedTime: 0 }]);
        setChefState({ action: 'idle', location: 'prep', wastedTime: 0 });
        setStats(prev => ({ 
          ...prev, 
          completedJobs: 2,
          totalTime: currentTime + 1,
          cpuUtilization: ((7 / (currentTime + 1)) * 100).toFixed(0),
          wastedCycles: 0
        }));
        break;
      case 9:
        addLog('📊 ANALYSIS: Chef only involved at start/end', 'success');
        addLog('✅ DMA freed CPU for other work (most efficient!)', 'success');
        setIsRunning(false);
        break;
      default:
        if (currentTime > 9) setIsRunning(false);
    }
    setCurrentTime(currentTime + 1);
  };

  const executeBuffering = () => {
    const bufferSize = 3;
    switch (currentTime) {
      case 0:
        addLog('📋 Orders coming in: need ingredient prep', 'info');
        addLog('🥕 Buffer: Prep ingredients ahead of time', 'info');
        setChefState({ action: 'prepping ingredients', location: 'prep', wastedTime: 0 });
        break;
      case 1:
        addLog('✂️ Prep item 1: Lettuce (buffer: 1/3)', 'success');
        break;
      case 2:
        addLog('✂️ Prep item 2: Tomato (buffer: 2/3)', 'success');
        break;
      case 3:
        addLog('✂️ Prep item 3: Onion (buffer: 3/3 FULL)', 'warning');
        addLog('📦 Buffer full - ready for cooking phase', 'info');
        break;
      case 4:
        addLog('🔥 Start cooking burger - use lettuce from buffer', 'success');
        addLog('✂️ Immediately prep next item (buffer: 2/3)', 'success');
        setOvenState({ cooking: true, timeRemaining: 3, dish: '🍔 Burger' });
        break;
      case 5:
        addLog('🔥 Cooking... use tomato from buffer', 'success');
        addLog('✂️ Prep next item (buffer: 2/3)', 'success');
        setOvenState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        break;
      case 6:
        addLog('🔥 Almost done... use onion from buffer', 'success');
        addLog('✂️ Prep next item (buffer: 2/3)', 'success');
        setOvenState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        break;
      case 7:
        addLog('✅ Burger complete!', 'success');
        setOvenState({ cooking: false, timeRemaining: 0, dish: null });
        setCompletedTasks(prev => [...prev, { dish: '🍔 Burger', method: 'Buffered', wastedTime: 0 }]);
        break;
      case 8:
        addLog('📊 ANALYSIS: No waiting - buffer smoothed workflow', 'success');
        addLog('✅ Buffering handles speed mismatches', 'success');
        setStats(prev => ({ 
          ...prev, 
          completedJobs: 1,
          totalTime: currentTime + 1,
          cpuUtilization: 100,
          wastedCycles: 0
        }));
        setIsRunning(false);
        break;
      default:
        if (currentTime > 8) setIsRunning(false);
    }
    setCurrentTime(currentTime + 1);
  };

  const getChefColor = () => {
    if (chefState.action === 'idle') return 'bg-gray-300';
    if (chefState.action.includes('checking')) return 'bg-red-200';
    return 'bg-green-200';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ⚡ I/O Systems = Kitchen Equipment Management
          </h1>
          <p className="text-gray-600">How does the chef (CPU) work with slow equipment (I/O devices)?</p>
        </div>

        {/* Scenario Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Select I/O Method:</label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {Object.keys(scenarios).map(key => (
              <button
                key={key}
                onClick={() => setScenario(key)}
                disabled={isRunning}
                className={`p-3 rounded-lg font-semibold transition-colors ${
                  scenario === key
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {scenarios[key].name.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario Info */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-2">{scenarios[scenario].name}</h3>
          <p className="text-sm mb-1"><strong>Restaurant:</strong> {scenarios[scenario].problem}</p>
          <p className="text-sm mb-1"><strong>OS Concept:</strong> {scenarios[scenario].concept}</p>
          <p className="text-sm"><strong>Description:</strong> {scenarios[scenario].description}</p>
        </div>

        {/* System Clock & Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-lg text-center">
            <Clock className="w-6 h-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{currentTime}</div>
            <div className="text-xs">Time Units</div>
          </div>
          <div className="bg-green-600 text-white p-3 rounded-lg text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.cpuUtilization}%</div>
            <div className="text-xs">CPU Utilization</div>
          </div>
          <div className="bg-red-600 text-white p-3 rounded-lg text-center">
            <AlertCircle className="w-6 h-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.wastedCycles}</div>
            <div className="text-xs">Wasted Cycles</div>
          </div>
          <div className="bg-purple-600 text-white p-3 rounded-lg text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.completedJobs}</div>
            <div className="text-xs">Jobs Done</div>
          </div>
        </div>

        {/* Main Kitchen View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Chef (CPU) */}
          <div className={`border-4 border-green-500 rounded-lg p-4 transition-all ${getChefColor()}`}>
            <h3 className="font-bold text-lg mb-3">👨‍🍳 Chef (CPU)</h3>
            <div className="bg-white rounded-lg p-3">
              <div className="font-semibold mb-2">Current Action:</div>
              <div className="text-sm text-gray-700">{chefState.action}</div>
              <div className="text-sm text-gray-600 mt-2">
                Location: {chefState.location}
              </div>
              {chefState.wastedTime > 0 && (
                <div className="text-sm text-red-600 font-semibold mt-2">
                  ⚠️ Wasted time: {chefState.wastedTime} cycles
                </div>
              )}
            </div>
          </div>

          {/* Oven (I/O Device) */}
          <div className={`border-4 rounded-lg p-4 ${
            ovenState.cooking ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50'
          }`}>
            <h3 className="font-bold text-lg mb-3">🔥 Oven (I/O Device)</h3>
            <div className="bg-white rounded-lg p-3">
              {ovenState.cooking ? (
                <div>
                  <div className="font-semibold mb-2">Cooking: {ovenState.dish}</div>
                  <div className="text-sm text-orange-600">
                    ⏱️ Time remaining: {ovenState.timeRemaining} min
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-orange-500 h-3 rounded-full transition-all"
                        style={{ width: `${((5 - ovenState.timeRemaining) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center">Idle</div>
              )}
            </div>
          </div>

          {/* Dishwasher (DMA Device) */}
          {scenario === 'dma' && (
            <div className={`border-4 rounded-lg p-4 ${
              dishwasherState.running ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
            }`}>
              <h3 className="font-bold text-lg mb-3">🍽️ Dishwasher (DMA)</h3>
              <div className="bg-white rounded-lg p-3">
                {dishwasherState.running || dishwasherState.progress > 0 ? (
                  <div>
                    <div className="font-semibold mb-2">
                      {dishwasherState.running ? 'Running (DMA)' : 'Complete'}
                    </div>
                    <div className="text-sm text-blue-600">
                      Progress: {dishwasherState.progress}%
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all"
                          style={{ width: `${dishwasherState.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">Not in use</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Execution Log */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">📜 System Log</h3>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs max-h-64 overflow-y-auto">
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

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mb-6 bg-green-100 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Completed Tasks
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {completedTasks.map((task, idx) => (
                <div key={idx} className="bg-white p-2 rounded border">
                  <div className="font-semibold">{task.dish}</div>
                  <div className="text-xs text-gray-600">
                    Method: {task.method}
                  </div>
                  {task.wastedTime > 0 && (
                    <div className="text-xs text-red-600">
                      Waste: {task.wastedTime} cycles
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
          <div className="bg-red-100 p-4 rounded-lg">
            <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Polling (Busy Waiting)
            </h4>
            <p className="text-gray-700 mb-2">
              CPU repeatedly checks device status in a loop.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-xs">
              <li>✅ Simple to implement</li>
              <li>❌ Wastes CPU cycles</li>
              <li>❌ Poor CPU utilization</li>
              <li>Example: while(!device_ready) { /* wait */ }</li>
            </ul>
          </div>
          
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Interrupt-Driven I/O
            </h4>
            <p className="text-gray-700 mb-2">
              Device notifies CPU when operation completes.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-xs">
              <li>✅ CPU does useful work while waiting</li>
              <li>✅ Efficient resource use</li>
              <li>❌ Interrupt overhead (context switch)</li>
              <li>Example: timer_interrupt_handler()</li>
            </ul>
          </div>

          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Timer className="w-4 h-4" />
              DMA (Direct Memory Access)
            </h4>
            <p className="text-gray-700 mb-2">
              Device transfers data directly to/from memory without CPU.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-xs">
              <li>✅ CPU only involved at start/end</li>
              <li>✅ Most efficient for large transfers</li>
              <li>✅ Frees CPU completely</li>
              <li>Example: Disk controller transfers data to RAM</li>
            </ul>
          </div>

          <div className="bg-purple-100 p-4 rounded-lg">
            <h4 className="font-bold text-purple-900 mb-2">📦 Buffering & Spooling</h4>
            <p className="text-gray-700 mb-2">
              Temporary storage manages speed differences.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-xs">
              <li>✅ Smooths workflow</li>
              <li>✅ Handles producer/consumer speed mismatch</li>
              <li>Example: Print spooler, keyboard buffer</li>
              <li>Types: Single, Double, Circular buffers</li>
            </ul>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-3">📊 Method Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Method</th>
                  <th className="border border-gray-300 p-2">CPU Usage</th>
                  <th className="border border-gray-300 p-2">Efficiency</th>
                  <th className="border border-gray-300 p-2">Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Polling</td>
                  <td className="border border-gray-300 p-2">Wastes cycles</td>
                  <td className="border border-gray-300 p-2 text-red-600">❌ Low</td>
                  <td className="border border-gray-300 p-2">Simple devices, real-time systems</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Interrupts</td>
                  <td className="border border-gray-300 p-2">Efficient</td>
                  <td className="border border-gray-300 p-2 text-green-600">✅ Good</td>
                  <td className="border border-gray-300 p-2">Keyboards, timers, network</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">DMA</td>
                  <td className="border border-gray-300 p-2">Minimal</td>
                  <td className="border border-gray-300 p-2 text-green-600">✅ Best</td>
                  <td className="border border-gray-300 p-2">Disk I/O, large data transfers</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Buffering</td>
                  <td className="border border-gray-300 p-2">Moderate</td>
                  <td className="border border-gray-300 p-2 text-green-600">✅ Good</td>
                  <td className="border border-gray-300 p-2">Print queues, network packets</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* OS Code Examples */}
        <div className="mt-6 bg-indigo-100 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-3">💻 Code Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <strong className="text-indigo-900">Polling (Busy Wait):</strong>
              <pre className="bg-white p-2 mt-1 rounded overflow-x-auto">
{`while (!device_ready()) {
  // CPU stuck here!
}
read_data();`}
              </pre>
            </div>
            <div>
              <strong className="text-indigo-900">Interrupt Handler:</strong>
              <pre className="bg-white p-2 mt-1 rounded overflow-x-auto">
{`void timer_interrupt() {
  // Save context
  handle_expired_timers();
  // Restore context
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Device Types */}
        <div className="mt-4 bg-yellow-100 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-3">🔌 Device Types (Restaurant Equipment)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded p-3">
              <strong>Character Devices:</strong>
              <p className="text-xs text-gray-700 mt-1">
                ☕ Coffee maker (one cup at a time)<br/>
                OS: Keyboard, mouse - stream of bytes
              </p>
            </div>
            <div className="bg-white rounded p-3">
              <strong>Block Devices:</strong>
              <p className="text-xs text-gray-700 mt-1">
                🔥 Oven (batch cooking)<br/>
                OS: Disk drives - fixed-size blocks
              </p>
            </div>
            <div className="bg-white rounded p-3">
              <strong>Network Devices:</strong>
              <p className="text-xs text-gray-700 mt-1">
                📞 Phone/delivery (external comms)<br/>
                OS: Network interface cards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IOSystems;
