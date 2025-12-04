import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Lock, Unlock, AlertTriangle, CheckCircle } from 'lucide-react';

const ConcurrencySimulator = () => {
  const [scenario, setScenario] = useState('race');
  const [useSynchronization, setUseSynchronization] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [chefAState, setChefAState] = useState({ location: 'idle', action: '', inventory: 0 });
  const [chefBState, setChefBState] = useState({ location: 'idle', action: '', inventory: 0 });
  const [sharedResource, setSharedResource] = useState(10);
  const [lockHolder, setLockHolder] = useState(null);
  const [logs, setLogs] = useState([]);
  const [issueDetected, setIssueDetected] = useState(false);

  const scenarios = {
    race: {
      name: 'Race Condition',
      problem: 'Two chefs updating ingredient inventory simultaneously',
      description: 'Chef A and Chef B both need to take flour from shared pantry and update inventory',
      steps: 8,
      resource: 'Flour bags',
      initial: 10
    },
    critical: {
      name: 'Critical Section Problem',
      problem: 'Only one chef can use the deep fryer at a time',
      description: 'Multiple chefs trying to use limited resource (deep fryer) simultaneously',
      steps: 10,
      resource: 'Deep Fryer',
      initial: 1
    },
    deadlock: {
      name: 'Deadlock',
      problem: 'Chef A needs salt (held by B), Chef B needs pepper (held by A)',
      description: 'Circular dependency where both chefs wait indefinitely',
      steps: 8,
      resource: 'Ingredients',
      initial: 2
    }
  };

  const reset = () => {
    setIsRunning(false);
    setStep(0);
    setChefAState({ location: 'idle', action: '', inventory: 0 });
    setChefBState({ location: 'idle', action: '', inventory: 0 });
    setSharedResource(scenarios[scenario].initial);
    setLockHolder(null);
    setLogs([]);
    setIssueDetected(false);
  };

  useEffect(() => {
    reset();
  }, [scenario, useSynchronization]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      executeStep();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRunning, step]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { time: step, message, type }]);
  };

  const executeStep = () => {
    if (scenario === 'race') {
      executeRaceCondition();
    } else if (scenario === 'critical') {
      executeCriticalSection();
    } else if (scenario === 'deadlock') {
      executeDeadlock();
    }
  };

  const executeRaceCondition = () => {
    switch (step) {
      case 0:
        setChefAState({ location: 'reading', action: 'Reading inventory...', inventory: 0 });
        addLog('Chef A: Reading flour inventory = 10', 'info');
        break;
      case 1:
        setChefBState({ location: 'reading', action: 'Reading inventory...', inventory: 0 });
        addLog('Chef B: Reading flour inventory = 10', 'info');
        setChefAState(prev => ({ ...prev, inventory: sharedResource }));
        break;
      case 2:
        setChefBState(prev => ({ ...prev, inventory: sharedResource }));
        setChefAState({ location: 'computing', action: 'Computing: 10 - 3 = 7', inventory: sharedResource });
        addLog('Chef A: Computing 10 - 3 = 7', 'warning');
        break;
      case 3:
        setChefBState({ location: 'computing', action: 'Computing: 10 - 2 = 8', inventory: sharedResource });
        addLog('Chef B: Computing 10 - 2 = 8', 'warning');
        break;
      case 4:
        if (!useSynchronization) {
          setSharedResource(7);
          setChefAState({ location: 'writing', action: 'Writing inventory = 7', inventory: 7 });
          addLog('Chef A: Writing inventory = 7', 'error');
        } else {
          if (lockHolder === null) {
            setLockHolder('A');
            setChefAState({ location: 'locked', action: 'Acquired lock, computing...', inventory: sharedResource });
            addLog('Chef A: Acquired lock', 'success');
          }
        }
        break;
      case 5:
        if (!useSynchronization) {
          setSharedResource(8);
          setChefBState({ location: 'writing', action: 'Writing inventory = 8', inventory: 8 });
          addLog('Chef B: Writing inventory = 8 (overwrites 7!)', 'error');
          setIssueDetected(true);
        } else {
          if (lockHolder === 'A') {
            setSharedResource(7);
            setChefAState({ location: 'writing', action: 'Writing inventory = 7', inventory: 7 });
            addLog('Chef A: Writing inventory = 7', 'success');
          }
        }
        break;
      case 6:
        if (!useSynchronization) {
          setChefAState({ location: 'done', action: 'Done (lost update!)', inventory: 7 });
          addLog('❌ RACE CONDITION: Chef A\'s update was lost!', 'error');
        } else {
          setLockHolder(null);
          setChefAState({ location: 'done', action: 'Released lock', inventory: 7 });
          addLog('Chef A: Released lock', 'success');
        }
        break;
      case 7:
        if (!useSynchronization) {
          setChefBState({ location: 'done', action: 'Done (incorrect result!)', inventory: 8 });
          addLog('Expected: 5 (10-3-2), Got: 8 (incorrect!)', 'error');
          setIsRunning(false);
        } else {
          setLockHolder('B');
          setChefBState({ location: 'locked', action: 'Acquired lock, reading...', inventory: 7 });
          addLog('Chef B: Acquired lock, reading = 7', 'success');
        }
        break;
      case 8:
        if (useSynchronization) {
          setSharedResource(5);
          setChefBState({ location: 'writing', action: 'Writing inventory = 5', inventory: 5 });
          addLog('Chef B: Writing inventory = 5', 'success');
        }
        break;
      case 9:
        if (useSynchronization) {
          setLockHolder(null);
          setChefBState({ location: 'done', action: 'Released lock', inventory: 5 });
          addLog('✅ SUCCESS: Final inventory = 5 (correct!)', 'success');
          setIsRunning(false);
        }
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const executeCriticalSection = () => {
    switch (step) {
      case 0:
        setChefAState({ location: 'waiting', action: 'Want to use deep fryer', inventory: 0 });
        addLog('Chef A: Wants to use deep fryer', 'info');
        break;
      case 1:
        setChefBState({ location: 'waiting', action: 'Want to use deep fryer', inventory: 0 });
        addLog('Chef B: Wants to use deep fryer', 'info');
        break;
      case 2:
        if (!useSynchronization) {
          setChefAState({ location: 'using', action: 'Using deep fryer!', inventory: 0 });
          setSharedResource(0);
          addLog('Chef A: Started using fryer', 'warning');
        } else {
          setLockHolder('A');
          setChefAState({ location: 'using', action: 'Using deep fryer (locked)', inventory: 0 });
          setSharedResource(0);
          addLog('Chef A: Acquired fryer lock', 'success');
        }
        break;
      case 3:
        if (!useSynchronization) {
          setChefBState({ location: 'using', action: 'Using deep fryer!', inventory: 0 });
          addLog('Chef B: Started using fryer (CONFLICT!)', 'error');
          setIssueDetected(true);
        } else {
          setChefBState({ location: 'blocked', action: 'Blocked, waiting...', inventory: 0 });
          addLog('Chef B: Blocked, waiting for lock', 'warning');
        }
        break;
      case 4:
        if (!useSynchronization) {
          addLog('❌ CRITICAL SECTION VIOLATION: Both using fryer!', 'error');
        }
        break;
      case 5:
        if (!useSynchronization) {
          addLog('Result: Burnt food, safety hazard!', 'error');
          setIsRunning(false);
        }
        break;
      case 6:
        if (useSynchronization) {
          setSharedResource(1);
          setLockHolder(null);
          setChefAState({ location: 'done', action: 'Finished, released fryer', inventory: 0 });
          addLog('Chef A: Released fryer lock', 'success');
        }
        break;
      case 7:
        if (useSynchronization) {
          setLockHolder('B');
          setSharedResource(0);
          setChefBState({ location: 'using', action: 'Using deep fryer (locked)', inventory: 0 });
          addLog('Chef B: Acquired fryer lock', 'success');
        }
        break;
      case 8:
        if (useSynchronization) {
          setSharedResource(1);
          setLockHolder(null);
          setChefBState({ location: 'done', action: 'Finished, released fryer', inventory: 0 });
          addLog('Chef B: Released fryer lock', 'success');
        }
        break;
      case 9:
        if (useSynchronization) {
          addLog('✅ SUCCESS: Both chefs used fryer safely!', 'success');
          setIsRunning(false);
        }
        break;
    }
    setStep(step + 1);
  };

  const executeDeadlock = () => {
    switch (step) {
      case 0:
        setChefAState({ location: 'waiting', action: 'Need salt and pepper', inventory: 0 });
        addLog('Chef A: Needs salt AND pepper', 'info');
        break;
      case 1:
        setChefBState({ location: 'waiting', action: 'Need pepper and salt', inventory: 0 });
        addLog('Chef B: Needs pepper AND salt', 'info');
        break;
      case 2:
        setChefAState({ location: 'holding', action: 'Grabbed salt 🧂', inventory: 1 });
        setSharedResource(1);
        addLog('Chef A: Holding salt, waiting for pepper', 'warning');
        break;
      case 3:
        setChefBState({ location: 'holding', action: 'Grabbed pepper 🌶️', inventory: 1 });
        setSharedResource(0);
        addLog('Chef B: Holding pepper, waiting for salt', 'warning');
        break;
      case 4:
        if (!useSynchronization) {
          addLog('Chef A: Waiting for pepper (held by B)...', 'error');
        } else {
          addLog('Chef A: Trying to get pepper...', 'warning');
        }
        break;
      case 5:
        if (!useSynchronization) {
          addLog('Chef B: Waiting for salt (held by A)...', 'error');
          setIssueDetected(true);
        } else {
          addLog('Deadlock prevention: Chef A releases salt', 'success');
          setChefAState({ location: 'released', action: 'Released salt', inventory: 0 });
        }
        break;
      case 6:
        if (!useSynchronization) {
          addLog('❌ DEADLOCK: Both waiting indefinitely!', 'error');
          addLog('Neither can proceed - circular wait condition', 'error');
          setIsRunning(false);
        } else {
          setChefBState({ location: 'holding', action: 'Got salt! 🧂🌶️', inventory: 2 });
          addLog('Chef B: Acquired salt, can proceed!', 'success');
        }
        break;
      case 7:
        if (useSynchronization) {
          setChefBState({ location: 'done', action: 'Finished cooking!', inventory: 0 });
          addLog('Chef B: Released both ingredients', 'success');
        }
        break;
      case 8:
        if (useSynchronization) {
          setChefAState({ location: 'using', action: 'Now can get both! 🧂🌶️', inventory: 2 });
          addLog('✅ SUCCESS: Deadlock avoided!', 'success');
          setIsRunning(false);
        }
        break;
    }
    setStep(step + 1);
  };

  const getChefColor = (chef, state) => {
    if (state.location === 'done') return 'bg-green-200 border-green-500';
    if (state.location === 'blocked') return 'bg-gray-300 border-gray-500';
    if (issueDetected && !useSynchronization) return 'bg-red-200 border-red-500';
    if (lockHolder === chef) return 'bg-blue-200 border-blue-500';
    return 'bg-yellow-200 border-yellow-500';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔄 Concurrency Problems & Solutions
          </h1>
          <p className="text-gray-600">When multiple chefs (processes) work simultaneously</p>
        </div>

        {/* Scenario Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Select Scenario:</label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              disabled={isRunning}
              className="w-full p-3 border-2 border-gray-300 rounded-lg font-semibold"
            >
              <option value="race">Race Condition</option>
              <option value="critical">Critical Section</option>
              <option value="deadlock">Deadlock</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Synchronization:</label>
            <button
              onClick={() => setUseSynchronization(!useSynchronization)}
              disabled={isRunning}
              className={`w-full p-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                useSynchronization 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}
            >
              {useSynchronization ? (
                <>
                  <Lock className="w-5 h-5" />
                  Protected (Mutex/Semaphore)
                </>
              ) : (
                <>
                  <Unlock className="w-5 h-5" />
                  Unprotected (No Sync)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scenario Info */}
        <div className={`rounded-lg p-4 mb-6 ${
          issueDetected ? 'bg-red-100 border-2 border-red-500' : 'bg-blue-100'
        }`}>
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            {issueDetected && <AlertTriangle className="w-6 h-6 text-red-600" />}
            {scenarios[scenario].name}
          </h3>
          <p className="text-sm mb-1"><strong>Problem:</strong> {scenarios[scenario].problem}</p>
          <p className="text-sm">{scenarios[scenario].description}</p>
        </div>

        {/* Shared Resource */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 text-center">🏪 Shared Resource</h3>
          <div className={`border-4 rounded-lg p-6 text-center ${
            lockHolder ? 'border-blue-500 bg-blue-50' : 'border-purple-500 bg-purple-50'
          }`}>
            <div className="text-2xl font-bold mb-2">
              {scenarios[scenario].resource}: {sharedResource}
            </div>
            {lockHolder && (
              <div className="flex items-center justify-center gap-2 text-blue-700 font-semibold">
                <Lock className="w-5 h-5" />
                Locked by Chef {lockHolder}
              </div>
            )}
          </div>
        </div>

        {/* Chefs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Chef A */}
          <div className={`border-4 rounded-lg p-6 transition-all ${getChefColor('A', chefAState)}`}>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              👨‍🍳 Chef A (Process A)
              {lockHolder === 'A' && <Lock className="w-5 h-5 text-blue-600" />}
            </h3>
            <div className="bg-white rounded-lg p-4 min-h-[100px]">
              <div className="font-semibold mb-2">Status: {chefAState.location}</div>
              <div className="text-sm text-gray-700">{chefAState.action}</div>
              {chefAState.inventory > 0 && (
                <div className="text-sm font-semibold mt-2 text-purple-700">
                  Local value: {chefAState.inventory}
                </div>
              )}
            </div>
          </div>

          {/* Chef B */}
          <div className={`border-4 rounded-lg p-6 transition-all ${getChefColor('B', chefBState)}`}>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              👨‍🍳 Chef B (Process B)
              {lockHolder === 'B' && <Lock className="w-5 h-5 text-blue-600" />}
            </h3>
            <div className="bg-white rounded-lg p-4 min-h-[100px]">
              <div className="font-semibold mb-2">Status: {chefBState.location}</div>
              <div className="text-sm text-gray-700">{chefBState.action}</div>
              {chefBState.inventory > 0 && (
                <div className="text-sm font-semibold mt-2 text-purple-700">
                  Local value: {chefBState.inventory}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Execution Log */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">📜 Execution Log</h3>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No events yet...</div>
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

        {/* Key Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-red-100 p-4 rounded-lg">
            <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Race Condition
            </h4>
            <p className="text-gray-700">
              Multiple processes access shared data concurrently, causing incorrect results. 
              <strong> Solution:</strong> Mutual exclusion (mutex)
            </p>
          </div>
          
          <div className="bg-orange-100 p-4 rounded-lg">
            <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Critical Section
            </h4>
            <p className="text-gray-700">
              Code segment accessing shared resource. Only one process allowed at a time.
              <strong> Solution:</strong> Semaphores or locks
            </p>
          </div>
          
          <div className="bg-purple-100 p-4 rounded-lg">
            <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Deadlock
            </h4>
            <p className="text-gray-700">
              Processes wait for each other indefinitely. Circular dependency.
              <strong> Solution:</strong> Resource ordering, timeouts
            </p>
          </div>
        </div>

        {/* Synchronization Methods */}
        <div className="mt-6 bg-green-100 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-700" />
            Synchronization Mechanisms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-green-900">Mutex (Mutual Exclusion):</strong>
              <p className="text-gray-700">Binary lock. Only one process can hold it.</p>
              <code className="block bg-white p-2 mt-1 rounded">
                mutex.lock()<br/>
                // critical section<br/>
                mutex.unlock()
              </code>
            </div>
            <div>
              <strong className="text-green-900">Semaphore:</strong>
              <p className="text-gray-700">Counter allowing N processes access.</p>
              <code className="block bg-white p-2 mt-1 rounded">
                wait(semaphore)<br/>
                // critical section<br/>
                signal(semaphore)
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcurrencySimulator;