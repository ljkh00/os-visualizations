import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Users, AlertCircle, CheckCircle, ArrowDownUp } from 'lucide-react';

const MemoryManagement = () => {
  const [scenario, setScenario] = useState('paging');
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [tables, setTables] = useState([]);
  const [waitingLounge, setWaitingLounge] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ allocations: 0, swaps: 0, fragmentation: 0 });

  // Table = Page/Frame, Customer Party = Process
  const initialTables = {
    paging: [
      { id: 0, size: 4, occupied: null, type: 'fixed' },
      { id: 1, size: 4, occupied: null, type: 'fixed' },
      { id: 2, size: 4, occupied: null, type: 'fixed' },
      { id: 3, size: 4, occupied: null, type: 'fixed' },
      { id: 4, size: 4, occupied: null, type: 'fixed' },
      { id: 5, size: 4, occupied: null, type: 'fixed' },
    ],
    segmentation: [
      { id: 0, size: 12, occupied: null, type: 'variable' },
      { id: 1, size: 8, occupied: null, type: 'variable' },
      { id: 2, size: 6, occupied: null, type: 'variable' },
    ],
    fragmentation: [
      { id: 0, size: 6, occupied: null, type: 'variable' },
      { id: 1, size: 4, occupied: null, type: 'variable' },
      { id: 2, size: 8, occupied: null, type: 'variable' },
      { id: 3, size: 5, occupied: null, type: 'variable' },
    ]
  };

  const customerSequences = {
    paging: [
      { id: 'A', name: 'Party A', size: 4, color: 'bg-blue-400', pages: 1 },
      { id: 'B', name: 'Party B', size: 8, color: 'bg-green-400', pages: 2 },
      { id: 'C', name: 'Party C', size: 4, color: 'bg-yellow-400', pages: 1 },
      { id: 'D', name: 'Party D', size: 12, color: 'bg-purple-400', pages: 3 },
      { id: 'E', name: 'Party E', size: 4, color: 'bg-pink-400', pages: 1 },
    ],
    segmentation: [
      { id: 'A', name: 'Party A', size: 8, color: 'bg-blue-400', segment: 'dining' },
      { id: 'B', name: 'Party B', size: 6, color: 'bg-green-400', segment: 'booth' },
      { id: 'C', name: 'Party C', size: 12, color: 'bg-yellow-400', segment: 'banquet' },
    ],
    fragmentation: [
      { id: 'A', name: 'Party A', size: 6, color: 'bg-blue-400' },
      { id: 'B', name: 'Party B', size: 4, color: 'bg-green-400' },
      { id: 'C', name: 'Party C', size: 5, color: 'bg-yellow-400' },
      { id: 'D', name: 'Party D', size: 10, color: 'bg-purple-400' },
    ]
  };

  const scenarios = {
    paging: {
      name: 'Paging',
      description: 'Fixed-size tables (pages). Parties split across multiple tables if needed.',
      concept: 'Physical memory divided into fixed-size frames. Process divided into pages.',
      steps: 8
    },
    segmentation: {
      name: 'Segmentation',
      description: 'Variable-size sections (segments). Each party gets one contiguous area.',
      concept: 'Memory divided into logical segments (code, data, stack).',
      steps: 6
    },
    fragmentation: {
      name: 'Fragmentation',
      description: 'Shows internal and external fragmentation problems.',
      concept: 'Wasted memory space that cannot be allocated efficiently.',
      steps: 10
    }
  };

  const reset = () => {
    setIsRunning(false);
    setStep(0);
    setTables(initialTables[scenario].map(t => ({ ...t, occupied: null })));
    setWaitingLounge([]);
    setLogs([]);
    setStats({ allocations: 0, swaps: 0, fragmentation: 0 });
  };

  useEffect(() => {
    reset();
  }, [scenario]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      executeStep();
    }, 1500);

    return () => clearTimeout(timer);
  }, [isRunning, step]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { step, message, type }]);
  };

  const allocatePaging = (party) => {
    const pagesNeeded = Math.ceil(party.size / 4);
    const availableTables = tables.filter(t => !t.occupied);

    if (availableTables.length >= pagesNeeded) {
      const allocated = availableTables.slice(0, pagesNeeded);
      const newTables = tables.map(t => {
        if (allocated.find(at => at.id === t.id)) {
          return { ...t, occupied: party };
        }
        return t;
      });
      setTables(newTables);
      setStats(prev => ({ ...prev, allocations: prev.allocations + 1 }));
      addLog(`✓ ${party.name} (${party.size} guests) allocated to ${pagesNeeded} tables`, 'success');
      return true;
    } else {
      setWaitingLounge(prev => [...prev, party]);
      addLog(`✗ ${party.name} moved to waiting lounge (insufficient tables)`, 'warning');
      return false;
    }
  };

  const allocateSegmentation = (party) => {
    const suitableTable = tables.find(t => !t.occupied && t.size >= party.size);

    if (suitableTable) {
      const newTables = tables.map(t => 
        t.id === suitableTable.id ? { ...t, occupied: party } : t
      );
      setTables(newTables);
      
      // Calculate internal fragmentation
      const waste = suitableTable.size - party.size;
      if (waste > 0) {
        setStats(prev => ({ 
          ...prev, 
          allocations: prev.allocations + 1,
          fragmentation: prev.fragmentation + waste 
        }));
        addLog(`✓ ${party.name} (${party.size} guests) → Table ${suitableTable.id} (${suitableTable.size} seats). Waste: ${waste} seats`, 'warning');
      } else {
        setStats(prev => ({ ...prev, allocations: prev.allocations + 1 }));
        addLog(`✓ ${party.name} allocated perfectly to Table ${suitableTable.id}`, 'success');
      }
      return true;
    } else {
      setWaitingLounge(prev => [...prev, party]);
      addLog(`✗ ${party.name} (${party.size} guests) - no suitable contiguous table`, 'error');
      return false;
    }
  };

  const swapOut = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (table && table.occupied) {
      setWaitingLounge(prev => [...prev, table.occupied]);
      setTables(tables.map(t => 
        t.id === tableId ? { ...t, occupied: null } : t
      ));
      setStats(prev => ({ ...prev, swaps: prev.swaps + 1 }));
      addLog(`⇄ Swapped out ${table.occupied.name} to lounge (swapping)`, 'info');
      return table.occupied;
    }
    return null;
  };

  const executeStep = () => {
    if (scenario === 'paging') {
      executePagingScenario();
    } else if (scenario === 'segmentation') {
      executeSegmentationScenario();
    } else if (scenario === 'fragmentation') {
      executeFragmentationScenario();
    }
  };

  const executePagingScenario = () => {
    const customers = customerSequences.paging;
    
    switch (step) {
      case 0:
        addLog('🏪 Restaurant opens with 6 tables (4 seats each) = 24 total seats', 'info');
        break;
      case 1:
        allocatePaging(customers[0]);
        break;
      case 2:
        allocatePaging(customers[1]);
        break;
      case 3:
        allocatePaging(customers[2]);
        break;
      case 4:
        allocatePaging(customers[3]);
        addLog('⚠️ Party D needs 3 tables but only 2 available', 'warning');
        break;
      case 5:
        addLog('💡 Solution: Swap out Party A to lounge (page replacement)', 'info');
        swapOut(0);
        break;
      case 6:
        if (waitingLounge.find(p => p.id === 'D')) {
          allocatePaging(customers[3]);
        }
        break;
      case 7:
        addLog('✅ Paging allows flexible allocation by splitting processes', 'success');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const executeSegmentationScenario = () => {
    const customers = customerSequences.segmentation;
    
    switch (step) {
      case 0:
        addLog('🏪 Restaurant has variable-size sections: 12, 8, 6 seats', 'info');
        break;
      case 1:
        allocateSegmentation(customers[0]);
        break;
      case 2:
        allocateSegmentation(customers[1]);
        break;
      case 3:
        allocateSegmentation(customers[2]);
        break;
      case 4:
        addLog(`📊 Total internal fragmentation: ${stats.fragmentation} wasted seats`, 'warning');
        break;
      case 5:
        addLog('✅ Segmentation keeps logical units together but may waste space', 'success');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const executeFragmentationScenario = () => {
    const customers = customerSequences.fragmentation;
    
    switch (step) {
      case 0:
        addLog('🏪 Restaurant opens with sections: 6, 4, 8, 5 seats', 'info');
        break;
      case 1:
        allocateSegmentation(customers[0]);
        break;
      case 2:
        allocateSegmentation(customers[1]);
        break;
      case 3:
        allocateSegmentation(customers[2]);
        break;
      case 4:
        addLog('Party A (6 guests) finishes and leaves', 'info');
        setTables(tables.map(t => t.id === 0 ? { ...t, occupied: null } : t));
        break;
      case 5:
        addLog('Party B (4 guests) finishes and leaves', 'info');
        setTables(tables.map(t => t.id === 1 ? { ...t, occupied: null } : t));
        break;
      case 6:
        addLog('Now we have: 6 + 4 = 10 seats available (scattered)', 'warning');
        break;
      case 7:
        addLog('Party D arrives needing 10 contiguous seats...', 'info');
        allocateSegmentation(customers[3]);
        break;
      case 8:
        addLog('❌ EXTERNAL FRAGMENTATION: 10 seats available but not contiguous!', 'error');
        addLog('💡 Solution: Compaction (move parties to consolidate space)', 'info');
        break;
      case 9:
        addLog('This is why modern OS use paging instead of pure segmentation', 'success');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const getTableDisplay = (table) => {
    if (table.occupied) {
      return (
        <div className={`${table.occupied.color} h-full rounded flex flex-col items-center justify-center p-2 border-2 border-gray-700`}>
          <div className="font-bold text-sm">{table.occupied.name}</div>
          <div className="text-xs">{table.occupied.size} guests</div>
        </div>
      );
    }
    return (
      <div className="bg-white h-full rounded flex items-center justify-center border-2 border-dashed border-gray-300">
        <span className="text-gray-400 text-xs">Empty</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🪑 Memory Management = Table Allocation
          </h1>
          <p className="text-gray-600">How do we seat customers when tables are limited?</p>
        </div>

        {/* Scenario Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Select Memory Management Scheme:</label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            disabled={isRunning}
            className="w-full p-3 border-2 border-gray-300 rounded-lg font-semibold"
          >
            <option value="paging">Paging (Fixed-size Tables)</option>
            <option value="segmentation">Segmentation (Variable-size Sections)</option>
            <option value="fragmentation">Fragmentation Problem</option>
          </select>
        </div>

        {/* Scenario Info */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-2">{scenarios[scenario].name}</h3>
          <p className="text-sm mb-1"><strong>Restaurant:</strong> {scenarios[scenario].description}</p>
          <p className="text-sm"><strong>OS Concept:</strong> {scenarios[scenario].concept}</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-700">{stats.allocations}</div>
            <div className="text-sm text-gray-700">Successful Allocations</div>
          </div>
          <div className="bg-orange-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-700">{stats.swaps}</div>
            <div className="text-sm text-gray-700">Swaps (Page Replacement)</div>
          </div>
          <div className="bg-red-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-700">{stats.fragmentation}</div>
            <div className="text-sm text-gray-700">Wasted Seats (Fragmentation)</div>
          </div>
        </div>

        {/* Dining Area (Physical Memory) */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            🏠 Dining Area (Physical Memory)
          </h3>
          <div className="border-4 border-blue-500 rounded-lg p-4 bg-blue-50">
            <div className={`grid ${
              scenario === 'paging' ? 'grid-cols-6' : 
              scenario === 'segmentation' ? 'grid-cols-3' : 'grid-cols-4'
            } gap-3`}>
              {tables.map(table => (
                <div key={table.id} className="relative">
                  <div className="text-xs font-semibold mb-1 text-center text-gray-600">
                    Table {table.id} ({table.size} seats)
                  </div>
                  <div className="h-24">
                    {getTableDisplay(table)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Waiting Lounge (Swap Space) */}
        {waitingLounge.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              ⏳ Waiting Lounge (Swap Space / Disk)
              <ArrowDownUp className="w-5 h-5 text-orange-600" />
            </h3>
            <div className="border-4 border-orange-500 rounded-lg p-4 bg-orange-50">
              <div className="flex gap-3 flex-wrap">
                {waitingLounge.map(party => (
                  <div key={party.id} className={`${party.color} p-3 rounded-lg shadow-md border-2 border-gray-700`}>
                    <div className="font-semibold">{party.name}</div>
                    <div className="text-xs">{party.size} guests waiting</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Execution Log */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">📜 Allocation Log</h3>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">Waiting to start...</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className={`mb-1 ${
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'warning' ? 'text-yellow-400' :
                  log.type === 'success' ? 'text-green-400' :
                  'text-gray-300'
                }`}>
                  <span className="text-gray-500">[Step {log.step}]</span> {log.message}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              📄 Paging
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Fixed-size frames/pages</strong> (e.g., 4KB)</li>
              <li>Process split across multiple pages</li>
              <li>No external fragmentation</li>
              <li>Small internal fragmentation (last page)</li>
              <li>Page table maps logical → physical addresses</li>
            </ul>
          </div>
          
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
              📦 Segmentation
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Variable-size segments</strong> (code, data, stack)</li>
              <li>Logical units kept together</li>
              <li>Can have external fragmentation</li>
              <li>May waste space in large segments</li>
              <li>Segment table tracks base + limit</li>
            </ul>
          </div>

          <div className="bg-yellow-100 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Internal Fragmentation
            </h4>
            <p className="text-gray-700">
              Wasted space <strong>within</strong> allocated block. 
              Example: Party of 3 gets table for 4 → 1 seat wasted.
            </p>
          </div>

          <div className="bg-red-100 p-4 rounded-lg">
            <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              External Fragmentation
            </h4>
            <p className="text-gray-700">
              Enough total space exists but it's <strong>scattered</strong>. 
              Example: 10 seats available across 3 tables, but party of 10 needs contiguous seating.
            </p>
          </div>
        </div>

        {/* Swapping Explanation */}
        <div className="mt-6 bg-purple-100 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <ArrowDownUp className="w-5 h-5" />
            Swapping (Virtual Memory)
          </h3>
          <p className="text-sm text-gray-700">
            When physical memory (tables) is full, the OS moves inactive processes to disk (waiting lounge). 
            This is called <strong>swapping out</strong>. When needed again, they're <strong>swapped in</strong>. 
            Modern systems use <strong>demand paging</strong> - only loading pages when accessed (page fault).
          </p>
          <div className="mt-2 bg-white p-3 rounded">
            <strong>Page Replacement Algorithms:</strong> FIFO, LRU (Least Recently Used), Optimal
          </div>
        </div>

        {/* Address Translation */}
        <div className="mt-4 bg-indigo-100 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2">🗺️ Address Translation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-indigo-900">Logical Address (Process View):</strong>
              <p className="text-gray-700">Customer says "I'm at Table 2" (what they think)</p>
              <code className="block bg-white p-2 mt-1 rounded text-xs">
                Page Number | Offset<br/>
                Segment Number | Offset
              </code>
            </div>
            <div>
              <strong className="text-indigo-900">Physical Address (Hardware):</strong>
              <p className="text-gray-700">Actually at physical Table 5 (real location)</p>
              <code className="block bg-white p-2 mt-1 rounded text-xs">
                Frame Number | Offset<br/>
                Base Address + Offset
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryManagement;