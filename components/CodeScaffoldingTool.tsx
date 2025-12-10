import React, { useState } from 'react';
import { Check, RotateCcw, ArrowRight, Lightbulb, Code } from 'lucide-react';

type ExerciseKey = 'process' | 'scheduling' | 'mutex';

const CodeScaffoldingTool = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentExercise, setCurrentExercise] = useState<ExerciseKey>('process');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showHints, setShowHints] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const exercises: Record<ExerciseKey, {
    title: string;
    levels: {
      [level: number]: {
        name: string;
        description: string;
        template: string[];
        blanks: string[];
        options: string[];
        correctAnswers: Record<string, string>;
        hint: string;
      };
    };
  }> = {
    process: {
      title: "Process Creation & State Transition",
      levels: {
        1: {
          name: "Restaurant Language",
          description: "Understand the flow using restaurant terms",
          template: [
            "When a customer_order arrives:",
            "  1. Put order in ____ state",
            "  2. Check if ____ is available",
            "  3. If yes: Move to ____ queue",
            "  4. If no: Put in waiting ____"
          ],
          blanks: ["state1", "resource", "queue", "area"],
          options: ["NEW", "table", "READY", "lounge", "RUNNING", "chef", "WAITING"],
          correctAnswers: {
            state1: "NEW",
            resource: "table",
            queue: "READY",
            area: "lounge"
          },
          hint: "Think about the restaurant simulation: orders start NEW, need tables, join READY queue, or wait in lounge"
        },
        2: {
          name: "OS Terminology",
          description: "Translate to operating system concepts",
          template: [
            "When a process arrives:",
            "  1. Set state to ____",
            "  2. Check if ____ is available",
            "  3. If yes: Add to ____ queue",
            "  4. If no: Set state to ____"
          ],
          blanks: ["state1", "resource", "queue", "state2"],
          options: ["NEW", "MEMORY", "READY", "WAITING", "CPU", "RUNNING", "BLOCKED"],
          correctAnswers: {
            state1: "NEW",
            resource: "MEMORY",
            queue: "READY",
            state2: "WAITING"
          },
          hint: "Processes start as NEW, need MEMORY allocation, join READY queue or enter WAITING state"
        },
        3: {
          name: "Pseudocode",
          description: "Structure the logic with pseudo-programming syntax",
          template: [
            "function process_arrival(process):",
            "  process.state = ____",
            "  if ____(process.memory_size):",
            "    ____(process)",
            "    process.state = ____",
            "    add_to_ready_queue(process)",
            "  else:",
            "    process.state = ____",
            "    add_to_waiting_queue(process)"
          ],
          blanks: ["state1", "func1", "func2", "state2", "state3"],
          options: ["NEW", "memory_available", "allocate_memory", "READY", "WAITING", "free_memory", "deallocate", "RUNNING"],
          correctAnswers: {
            state1: "NEW",
            func1: "memory_available",
            func2: "allocate_memory",
            state2: "READY",
            state3: "WAITING"
          },
          hint: "Check if memory_available(), then allocate_memory(), set states correctly"
        },
        4: {
          name: "C-style Code",
          description: "Write actual implementation code",
          template: [
            "void process_arrival(Process* proc) {",
            "  proc->state = ____;",
            "  if (memory_available(____)) {",
            "    allocate_memory(____);",
            "    enqueue_ready(____);",
            "    proc->state = ____;",
            "  } else {",
            "    proc->state = ____;",
            "    enqueue_waiting(____);",
            "  }",
            "}"
          ],
          blanks: ["state1", "param1", "param2", "param3", "state2", "state3", "param4"],
          options: ["NEW", "proc->mem_size", "proc", "&proc", "READY", "WAITING", "proc->id"],
          correctAnswers: {
            state1: "NEW",
            param1: "proc->mem_size",
            param2: "proc",
            param3: "proc",
            state2: "READY",
            state3: "WAITING",
            param4: "proc"
          },
          hint: "Use pointer notation (->), pass proc to functions, set states to enum values"
        }
      }
    },
    scheduling: {
      title: "Round Robin Scheduler",
      levels: {
        1: {
          name: "Restaurant Language",
          description: "Chef takes order for limited time",
          template: [
            "function chef_work():",
            "  Pick first order from ____ queue",
            "  Cook for ____ minutes",
            "  If order not finished:",
            "    Put back in ____ of queue",
            "  Else:",
            "    Mark order as ____"
          ],
          blanks: ["queue", "time", "position", "status"],
          options: ["READY", "time_quantum", "back", "COMPLETE", "front", "unlimited", "DONE"],
          correctAnswers: {
            queue: "READY",
            time: "time_quantum",
            position: "back",
            status: "COMPLETE"
          },
          hint: "Chef takes from READY queue, works for quantum time, puts unfinished orders at back"
        },
        2: {
          name: "OS Terminology",
          description: "CPU scheduler with time quantum",
          template: [
            "function schedule():",
            "  process = dequeue(____)",
            "  run_for(____ time)",
            "  if process.remaining_time > 0:",
            "    enqueue(____, process)",
            "  else:",
            "    process.state = ____"
          ],
          blanks: ["queue", "duration", "queue2", "state"],
          options: ["ready_queue", "quantum", "ready_queue", "TERMINATED", "waiting_queue", "unlimited", "RUNNING"],
          correctAnswers: {
            queue: "ready_queue",
            duration: "quantum",
            queue2: "ready_queue",
            state: "TERMINATED"
          },
          hint: "Dequeue from ready_queue, run for quantum, re-enqueue if not done, else TERMINATED"
        },
        3: {
          name: "Pseudocode",
          description: "Structured scheduling algorithm",
          template: [
            "function round_robin_schedule(quantum):",
            "  while not empty(ready_queue):",
            "    process = ____",
            "    execute_process(process, ____)",
            "    process.remaining_time -= ____",
            "    if process.remaining_time ____ 0:",
            "      enqueue_ready(process)",
            "    else:",
            "      process.state = ____"
          ],
          blanks: ["func1", "param1", "value", "operator", "state"],
          options: ["dequeue_ready()", "quantum", "quantum", ">", "TERMINATED", "peek_ready()", "unlimited", "==", "READY"],
          correctAnswers: {
            func1: "dequeue_ready()",
            param1: "quantum",
            value: "quantum",
            operator: ">",
            state: "TERMINATED"
          },
          hint: "Dequeue process, execute for quantum, check if remaining_time > 0"
        },
        4: {
          name: "C-style Code",
          description: "Implementation with proper syntax",
          template: [
            "void round_robin(int quantum) {",
            "  while (!is_empty(____)) {",
            "    Process* p = dequeue(____);",
            "    p->state = ____;",
            "    execute(p, ____);",
            "    p->remaining_time ____ quantum;",
            "    if (p->remaining_time ____ 0) {",
            "      enqueue(ready_queue, ____);",
            "    } else {",
            "      p->state = ____;",
            "    }",
            "  }",
            "}"
          ],
          blanks: ["queue1", "queue2", "state1", "param", "op1", "op2", "param2", "state2"],
          options: ["ready_queue", "ready_queue", "RUNNING", "quantum", "-=", ">", "p", "TERMINATED", "&ready_queue", "==", "*p"],
          correctAnswers: {
            queue1: "ready_queue",
            queue2: "ready_queue",
            state1: "RUNNING",
            param: "quantum",
            op1: "-=",
            op2: ">",
            param2: "p",
            state2: "TERMINATED"
          },
          hint: "Check queue status, dequeue pointer, set RUNNING, use -= operator, check > 0"
        }
      }
    },
    mutex: {
      title: "Mutex Lock Implementation",
      levels: {
        1: {
          name: "Restaurant Language",
          description: "Only one chef uses deep fryer",
          template: [
            "function use_deep_fryer(chef):",
            "  Wait until ____ is not being used",
            "  Mark ____ as 'in use by chef'",
            "  // Chef uses deep fryer",
            "  Mark ____ as '____'"
          ],
          blanks: ["resource1", "resource2", "resource3", "status"],
          options: ["deep_fryer", "deep_fryer", "deep_fryer", "available", "pantry", "chef", "stove", "busy"],
          correctAnswers: {
            resource1: "deep_fryer",
            resource2: "deep_fryer",
            resource3: "deep_fryer",
            status: "available"
          },
          hint: "Wait for deep_fryer, mark as in use, then mark as available when done"
        },
        2: {
          name: "OS Terminology",
          description: "Critical section protection",
          template: [
            "function critical_section(process):",
            "  Wait until ____ is unlocked",
            "  ____ the lock",
            "  // Critical section code",
            "  ____ the lock"
          ],
          blanks: ["resource", "action1", "action2"],
          options: ["mutex", "acquire", "release", "semaphore", "lock", "unlock", "get", "free"],
          correctAnswers: {
            resource: "mutex",
            action1: "acquire",
            action2: "release"
          },
          hint: "Wait for mutex, acquire it, do work, release it"
        },
        3: {
          name: "Pseudocode",
          description: "Lock/unlock pattern",
          template: [
            "function use_shared_resource():",
            "  while mutex.locked == ____:",
            "    ____()",
            "  mutex.locked = ____",
            "  // Critical section",
            "  mutex.locked = ____"
          ],
          blanks: ["bool1", "func", "bool2", "bool3"],
          options: ["true", "wait", "true", "false", "false", "sleep", "1", "0"],
          correctAnswers: {
            bool1: "true",
            func: "wait",
            bool2: "true",
            bool3: "false"
          },
          hint: "While locked is true, wait. Set to true (lock), do work, set to false (unlock)"
        },
        4: {
          name: "C-style Code",
          description: "pthread mutex implementation",
          template: [
            "pthread_mutex_t mutex;",
            "",
            "void* thread_function(void* arg) {",
            "  ____(____);",
            "  // Critical section",
            "  shared_counter++;",
            "  ____(____);",
            "  return NULL;",
            "}"
          ],
          blanks: ["func1", "param1", "func2", "param2"],
          options: ["pthread_mutex_lock", "&mutex", "pthread_mutex_unlock", "&mutex", "mutex_lock", "mutex", "mutex_unlock", "*mutex"],
          correctAnswers: {
            func1: "pthread_mutex_lock",
            param1: "&mutex",
            func2: "pthread_mutex_unlock",
            param2: "&mutex"
          },
          hint: "Use pthread_mutex_lock and pthread_mutex_unlock with &mutex parameter"
        }
      }
    }
  };

  const exercise = exercises[currentExercise];
  const level = exercise.levels[currentLevel];

  const handleAnswerChange = (blank: string, value: string) => {
    setAnswers({ ...answers, [blank]: value });
  };

  const checkAnswers = () => {
    let correct = 0;
    const total = Object.keys(level.correctAnswers).length;
    
    Object.keys(level.correctAnswers).forEach(blank => {
      if (answers[blank] === level.correctAnswers[blank]) {
        correct++;
      }
    });
    
    return { correct, total, percentage: (correct / total) * 100 };
  };

  const results = checkAnswers();

  const resetAnswers = () => {
    setAnswers({});
  };

  const nextLevel = () => {
    if (currentLevel < 4) {
      setCurrentLevel(currentLevel + 1);
      resetAnswers();
    }
  };

  const prevLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
      resetAnswers();
    }
  };

  const renderLine = (line: unknown, index: number) => {
    if (typeof line !== 'string') return null;
    const parts = line.split('____');
    const blankIndex = level.blanks[Math.floor(index / 2)];
    
    if (parts.length === 1) {
      return <div key={index} className="font-mono text-sm">{line}</div>;
    }

    return (
      <div key={index} className="font-mono text-sm flex items-center flex-wrap">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            <span>{part}</span>
            {i < parts.length - 1 && (
              <select
                value={answers[level.blanks[i]] || ''}
                onChange={(e) => handleAnswerChange(level.blanks[i], e.target.value)}
                className={`mx-1 px-2 py-1 border-2 rounded ${
                  answers[level.blanks[i]] === level.correctAnswers[level.blanks[i]]
                    ? 'border-green-500 bg-green-50'
                    : answers[level.blanks[i]]
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
              >
                <option value="">Select...</option>
                {level.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📚 OS Code Scaffolding Tool
          </h1>
          <p className="text-gray-600">Progressive learning: Restaurant analogy → Real OS code</p>
        </div>

        {/* Exercise Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Select Topic:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(Object.keys(exercises) as ExerciseKey[]).map(key => (
              <button
                key={key}
                onClick={() => {
                  setCurrentExercise(key);
                  setCurrentLevel(1);
                  resetAnswers();
                }}
                className={`p-3 rounded-lg font-semibold transition-colors ${
                  currentExercise === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {exercises[key].title}
              </button>
            ))}
          </div>
        </div>

        {/* Level Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Learning Level:</span>
            <span className="text-sm text-gray-600">Level {currentLevel} of 4</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`flex-1 h-3 rounded ${
                  level <= currentLevel ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-center">
            <div className={currentLevel === 1 ? 'font-bold text-blue-600' : 'text-gray-600'}>
              Restaurant
            </div>
            <div className={currentLevel === 2 ? 'font-bold text-blue-600' : 'text-gray-600'}>
              OS Terms
            </div>
            <div className={currentLevel === 3 ? 'font-bold text-blue-600' : 'text-gray-600'}>
              Pseudocode
            </div>
            <div className={currentLevel === 4 ? 'font-bold text-blue-600' : 'text-gray-600'}>
              Real Code
            </div>
          </div>
        </div>

        {/* Current Level Info */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-1">{level.name}</h3>
          <p className="text-sm text-gray-700">{level.description}</p>
        </div>

        {/* Code Exercise */}
        <div className="bg-gray-900 text-green-400 rounded-lg p-6 mb-6 min-h-64">
          <div className="space-y-2">
            {level.template.map((line, index) => renderLine(line, index))}
          </div>
        </div>

        {/* Hint Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold"
          >
            <Lightbulb className="w-5 h-5" />
            {showHints ? 'Hide Hint' : 'Show Hint'}
          </button>
          {showHints && (
            <div className="mt-2 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 text-sm">
              💡 {level.hint}
            </div>
          )}
        </div>

        {/* Results */}
        <div className={`rounded-lg p-4 mb-6 ${
          results.percentage === 100 ? 'bg-green-100 border-2 border-green-500' :
          results.percentage >= 50 ? 'bg-yellow-100 border-2 border-yellow-500' :
          'bg-red-100 border-2 border-red-500'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-lg">
                Score: {results.correct} / {results.total} ({results.percentage.toFixed(0)}%)
              </div>
              {results.percentage === 100 && (
                <div className="text-sm text-green-700 flex items-center gap-1 mt-1">
                  <Check className="w-4 h-4" />
                  Perfect! Ready for next level!
                </div>
              )}
            </div>
            {results.percentage === 100 && currentLevel < 4 && (
              <button
                onClick={nextLevel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
              >
                Next Level
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={prevLevel}
            disabled={currentLevel === 1}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
          >
            ← Previous Level
          </button>
          <button
            onClick={resetAnswers}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
          <button
            onClick={nextLevel}
            disabled={currentLevel === 4 || results.percentage < 100}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
          >
            Next Level →
          </button>
        </div>

        {/* Learning Tips */}
        <div className="mt-6 bg-blue-100 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Learning Strategy
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><strong>Level 1:</strong> Understand the concept using familiar restaurant terms</li>
            <li><strong>Level 2:</strong> Learn the correct OS terminology</li>
            <li><strong>Level 3:</strong> Practice with structured pseudocode</li>
            <li><strong>Level 4:</strong> Write production-ready code with proper syntax</li>
            <li>Must score 100% before advancing to next level</li>
            <li>Use hints if stuck - learning is more important than speed!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CodeScaffoldingTool;