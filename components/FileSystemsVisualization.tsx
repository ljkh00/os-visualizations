import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FolderOpen, File, Link as LinkIcon, Lock, Unlock, Users, HardDrive, AlertCircle, CheckCircle, Eye, Edit, Terminal } from 'lucide-react';

const FileSystemsVisualization = () => {
  const [scenario, setScenario] = useState('hierarchy');
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [logs, setLogs] = useState([]);
  const [currentUser, setCurrentUser] = useState('chef');
  const [fileSystem, setFileSystem] = useState({
    '/': {
      type: 'directory',
      name: 'pantry',
      owner: 'head_chef',
      permissions: 'rwxr-xr-x',
      children: {
        'recipes': { type: 'directory', name: 'recipe_books', owner: 'head_chef', permissions: 'rwxr-xr-x' },
        'ingredients': { type: 'directory', name: 'ingredients', owner: 'head_chef', permissions: 'rwxrwxr-x' },
        'equipment': { type: 'directory', name: 'equipment_logs', owner: 'head_chef', permissions: 'rwxr-xr-x' },
        'staff': { type: 'directory', name: 'staff_lockers', owner: 'head_chef', permissions: 'rwxr-xr-x' }
      }
    }
  });

  const scenarios = {
    hierarchy: {
      name: 'Directory Hierarchy',
      description: 'Organized pantry system - main storage with sections and subsections',
      concept: 'Tree structure starting from root (/) with nested subdirectories',
      steps: 10
    },
    inodes: {
      name: 'Inodes & Metadata',
      description: 'Inventory labels on each container - who owns it, when added, permissions',
      concept: 'Data structure storing file metadata (owner, permissions, timestamps, size, location)',
      steps: 8
    },
    permissions: {
      name: 'File Permissions',
      description: 'Access control - who can view, modify, or use each item',
      concept: 'User/Group/Others with Read/Write/Execute permissions',
      steps: 12
    },
    links: {
      name: 'Links & Shortcuts',
      description: 'Recipe references - pointing to actual recipe location vs copying entire recipe',
      concept: 'Symbolic links (pointers) vs Hard links (multiple names for same file)',
      steps: 10
    },
    mounting: {
      name: 'Mounting File Systems',
      description: 'Connecting walk-in freezer to main pantry - attaching external storage',
      concept: 'Mounting external file systems to directory tree',
      steps: 8
    },
    operations: {
      name: 'File Operations',
      description: 'Taking items from shelf, checking contents, adding new items, returning to shelf',
      concept: 'open(), read(), write(), close(), create(), delete() system calls',
      steps: 10
    }
  };

  const reset = () => {
    setIsRunning(false);
    setStep(0);
    setSelectedNode(null);
    setLogs([]);
    addLog('🔄 Pantry management system ready', 'info');
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
    setLogs(prev => [...prev.slice(-12), { step, message, type }]);
  };

  const executeStep = () => {
    if (scenario === 'hierarchy') {
      executeHierarchy();
    } else if (scenario === 'inodes') {
      executeInodes();
    } else if (scenario === 'permissions') {
      executePermissions();
    } else if (scenario === 'links') {
      executeLinks();
    } else if (scenario === 'mounting') {
      executeMounting();
    } else if (scenario === 'operations') {
      executeOperations();
    }
  };

  const executeHierarchy = () => {
    switch (step) {
      case 0:
        addLog('🏪 Welcome to restaurant pantry organization', 'info');
        addLog('📁 Root directory (/) = Main pantry entrance', 'info');
        break;
      case 1:
        addLog('📂 Creating /recipes - for recipe books', 'success');
        addLog('🍳 Like: /recipes/italian/carbonara.txt', 'info');
        break;
      case 2:
        addLog('📂 Creating /ingredients - for raw materials', 'success');
        addLog('🥕 Like: /ingredients/vegetables/carrots.bin', 'info');
        break;
      case 3:
        addLog('📂 Creating /equipment - for equipment logs', 'success');
        addLog('🔧 Like: /equipment/oven_maintenance.log', 'info');
        break;
      case 4:
        addLog('📂 Creating /staff - for personal staff areas', 'success');
        addLog('👤 Like: /staff/chef_mario/notes.txt', 'info');
        break;
      case 5:
        addLog('🗂️ Absolute path: /recipes/italian/carbonara.txt', 'info');
        addLog('📍 From pantry entrance: "Go to recipes section, Italian shelf, carbonara file"', 'info');
        break;
      case 6:
        addLog('🔄 Relative path: ../vegetables/carrots.bin', 'info');
        addLog('📍 From current location: "Go up one level, then to vegetables"', 'info');
        break;
      case 7:
        addLog('🌳 OS Equivalent: Tree structure from /', 'success');
        addLog('💻 /home/user/documents/report.pdf', 'info');
        break;
      case 8:
        addLog('✅ Directory hierarchy provides organization', 'success');
        addLog('✅ Paths provide unique location for each file', 'success');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const executeInodes = () => {
    switch (step) {
      case 0:
        addLog('🏷️ Every container has an inventory label (inode)', 'info');
        addLog('📋 Label contains: owner, size, date, location, permissions', 'info');
        break;
      case 1:
        addLog('📦 Container: flour_bag (inode #12345)', 'success');
        addLog('👤 Owner: head_chef', 'info');
        addLog('📏 Size: 5kg', 'info');
        addLog('📅 Added: 2024-01-15', 'info');
        break;
      case 2:
        addLog('🗄️ Container location: Shelf 3, Position B', 'info');
        addLog('💾 OS: Inode points to disk blocks where data is stored', 'info');
        break;
      case 3:
        addLog('🔢 Inode number = Unique container ID', 'success');
        addLog('📛 Filename = Human-readable label', 'info');
        addLog('➡️ Directory entry: "flour" → inode #12345', 'info');
        break;
      case 4:
        addLog('🔗 Multiple labels can point to same container', 'info');
        addLog('📝 "flour" and "all_purpose_flour" → same inode', 'info');
        addLog('💻 OS: Hard links - multiple names for same file', 'info');
        break;
      case 5:
        addLog('📊 Inode table = Master inventory list', 'success');
        addLog('🗃️ Maps all container IDs to their metadata', 'info');
        break;
      case 6:
        addLog('✅ Inodes separate metadata from actual data', 'success');
        addLog('✅ Enables efficient file management', 'success');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const executePermissions = () => {
    switch (step) {
      case 0:
        addLog('🔐 Access control: Who can do what with each item?', 'info');
        addLog('👥 Three categories: Owner, Group, Others', 'info');
        break;
      case 1:
        addLog('📋 Permission types:', 'info');
        addLog('👁️ READ (r): Can view/check contents', 'info');
        addLog('✏️ WRITE (w): Can modify/add contents', 'info');
        addLog('🏃 EXECUTE (x): Can use/prepare (for recipes)', 'info');
        break;
      case 2:
        addLog('📦 Example: carbonara_recipe.txt', 'success');
        addLog('👤 Owner (head_chef): rwx = can read, edit, execute', 'info');
        addLog('👥 Group (kitchen_staff): r-x = can read, execute only', 'info');
        addLog('🌍 Others (waiters): r-- = can only read', 'info');
        break;
      case 3:
        addLog('🔢 Numeric notation: rwxr-xr-- = 754', 'info');
        addLog('7 (rwx) = 4+2+1, 5 (r-x) = 4+0+1, 4 (r--) = 4+0+0', 'info');
        break;
      case 4:
        addLog('🧪 Test: Waiter tries to modify recipe', 'warning');
        addLog('❌ DENIED: Only has read permission', 'error');
        addLog('🔒 Protection: Prevents unauthorized changes', 'success');
        break;
      case 5:
        addLog('📂 Directory permissions work differently:', 'info');
        addLog('r: Can list contents (see what\'s inside)', 'info');
        addLog('w: Can add/remove items', 'info');
        addLog('x: Can enter/access directory', 'info');
        break;
      case 6:
        addLog('👑 Special permissions:', 'info');
        addLog('setuid: Run as owner (head_chef authority)', 'info');
        addLog('setgid: Inherit group (team permissions)', 'info');
        addLog('sticky bit: Only owner can delete', 'info');
        break;
      case 7:
        addLog('💻 OS commands:', 'info');
        addLog('chmod 755 recipe.txt (change mode)', 'info');
        addLog('chown head_chef recipe.txt (change owner)', 'info');
        addLog('chgrp kitchen_staff recipe.txt (change group)', 'info');
        break;
      case 8:
        addLog('✅ Permissions enforce access control', 'success');
        addLog('✅ Protect sensitive data and system files', 'success');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const executeLinks = () => {
    switch (step) {
      case 0:
        addLog('🔗 Two ways to reference recipes:', 'info');
        addLog('1️⃣ Symbolic link (shortcut/pointer)', 'info');
        addLog('2️⃣ Hard link (additional label)', 'info');
        break;
      case 1:
        addLog('📝 Original recipe: /recipes/italian/carbonara.txt', 'success');
        addLog('📄 Contains: Full recipe instructions (5KB)', 'info');
        break;
      case 2:
        addLog('🔗 Create symbolic link:', 'info');
        addLog('today_special → /recipes/italian/carbonara.txt', 'success');
        addLog('📎 Just a pointer, not a copy!', 'info');
        break;
      case 3:
        addLog('👁️ Following symbolic link:', 'info');
        addLog('Staff reads "today_special" → redirected to carbonara', 'success');
        addLog('💡 Like a signpost pointing to actual location', 'info');
        break;
      case 4:
        addLog('❌ What if original is deleted?', 'warning');
        addLog('Symbolic link becomes broken! 🔗💔', 'error');
        addLog('Points to nothing (dangling pointer)', 'error');
        break;
      case 5:
        addLog('🔧 Create hard link instead:', 'info');
        addLog('pasta_special (hard link to carbonara inode)', 'success');
        addLog('📦 Both names point to SAME container', 'info');
        break;
      case 6:
        addLog('✅ Hard link advantages:', 'success');
        addLog('Even if "carbonara" deleted, "pasta_special" still works!', 'success');
        addLog('📊 File only deleted when ALL hard links removed', 'info');
        break;
      case 7:
        addLog('📊 Link count (reference count):', 'info');
        addLog('carbonara.txt: 2 links', 'info');
        addLog('When count reaches 0 → file actually deleted', 'info');
        break;
      case 8:
        addLog('💻 OS commands:', 'info');
        addLog('ln -s target link_name (symbolic)', 'info');
        addLog('ln target link_name (hard)', 'info');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const executeMounting = () => {
    switch (step) {
      case 0:
        addLog('🏪 Main pantry = Root file system (/)', 'info');
        addLog('❄️ Walk-in freezer = External storage', 'info');
        addLog('🔌 Need to CONNECT freezer to pantry', 'info');
        break;
      case 1:
        addLog('📂 Create connection point: /mnt/freezer', 'success');
        addLog('🚪 This is a "mount point" - the doorway', 'info');
        break;
      case 2:
        addLog('🔧 Mount command:', 'info');
        addLog('mount /dev/sdb1 /mnt/freezer', 'success');
        addLog('Connect freezer device to pantry structure', 'info');
        break;
      case 3:
        addLog('✅ Freezer now accessible via /mnt/freezer', 'success');
        addLog('🥶 Access: /mnt/freezer/ice_cream.bin', 'info');
        addLog('Appears as part of single directory tree!', 'info');
        break;
      case 4:
        addLog('📋 Multiple file systems, one hierarchy:', 'success');
        addLog('/ (main pantry) on /dev/sda1', 'info');
        addLog('/mnt/freezer on /dev/sdb1', 'info');
        addLog('/mnt/delivery on /dev/sdc1', 'info');
        break;
      case 5:
        addLog('⚠️ Unmount in use?', 'warning');
        addLog('umount /mnt/freezer (while chef accessing)', 'error');
        addLog('❌ ERROR: Device busy! Close access first', 'error');
        break;
      case 6:
        addLog('💻 OS examples:', 'info');
        addLog('🪟 Windows: C:, D:, E: (separate drive letters)', 'info');
        addLog('🐧 Linux: Everything under / (unified tree)', 'info');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const executeOperations = () => {
    switch (step) {
      case 0:
        addLog('🍳 Chef needs flour for recipe', 'info');
        addLog('📋 File operation sequence begins', 'info');
        break;
      case 1:
        addLog('1️⃣ open("/ingredients/flour", READ)', 'success');
        addLog('🔍 Locate container on shelf', 'info');
        addLog('📖 Create file descriptor (handle) = FD #3', 'info');
        break;
      case 2:
        addLog('✅ File descriptor table entry:', 'success');
        addLog('FD #3 → inode #12345 (flour container)', 'info');
        addLog('Position: 0 (start of file)', 'info');
        addLog('Mode: READ', 'info');
        break;
      case 3:
        addLog('2️⃣ read(FD #3, buffer, 1024 bytes)', 'success');
        addLog('📦 Take 1KB of flour from container', 'info');
        addLog('➡️ Copy to chef\'s bowl (buffer in memory)', 'info');
        break;
      case 4:
        addLog('📊 File pointer advances:', 'info');
        addLog('Position: 0 → 1024 bytes', 'info');
        addLog('Next read() continues from position 1024', 'info');
        break;
      case 5:
        addLog('3️⃣ write(FD #4, buffer, 512 bytes)', 'info');
        addLog('✏️ Adding ingredient to recipe_log.txt', 'success');
        addLog('Append "Used 1kg flour" to log', 'info');
        break;
      case 6:
        addLog('4️⃣ close(FD #3)', 'success');
        addLog('🚪 Return flour container to shelf', 'info');
        addLog('🗑️ Release file descriptor', 'info');
        addLog('💾 Flush any buffered data to disk', 'info');
        break;
      case 7:
        addLog('📋 Other operations:', 'info');
        addLog('create() - Add new container to pantry', 'info');
        addLog('unlink() - Remove label (delete if last link)', 'info');
        addLog('rename() - Change label name', 'info');
        addLog('stat() - Read inode metadata', 'info');
        break;
      case 8:
        addLog('✅ File operations provide abstraction', 'success');
        addLog('✅ Kernel manages actual disk I/O', 'success');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const permissionCheck = (file, user, operation) => {
    // Simplified permission checking
    const perms = file.permissions;
    const ownerPerms = perms.slice(0, 3);
    const groupPerms = perms.slice(3, 6);
    const otherPerms = perms.slice(6, 9);

    if (user === file.owner) {
      return ownerPerms.includes(operation);
    }
    return otherPerms.includes(operation);
  };

  const renderFileTree = () => {
    const tree = {
      name: '/ (pantry)',
      icon: <FolderOpen className="w-4 h-4" />,
      children: [
        {
          name: 'recipes (recipe_books)',
          icon: <FolderOpen className="w-4 h-4" />,
          children: [
            { name: 'carbonara.txt', icon: <File className="w-4 h-4" />, type: 'file' },
            { name: 'tiramisu.txt', icon: <File className="w-4 h-4" />, type: 'file' }
          ]
        },
        {
          name: 'ingredients',
          icon: <FolderOpen className="w-4 h-4" />,
          children: [
            { name: 'flour.bin', icon: <File className="w-4 h-4" />, type: 'file' },
            { name: 'vegetables/', icon: <FolderOpen className="w-4 h-4" /> }
          ]
        },
        {
          name: 'equipment',
          icon: <FolderOpen className="w-4 h-4" />,
          children: [
            { name: 'oven.log', icon: <File className="w-4 h-4" />, type: 'file' }
          ]
        },
        {
          name: 'staff',
          icon: <FolderOpen className="w-4 h-4" />,
          children: [
            { name: 'chef_mario/', icon: <FolderOpen className="w-4 h-4" /> }
          ]
        }
      ]
    };

    const renderNode = (node, level = 0) => (
      <div key={node.name} style={{ marginLeft: `${level * 20}px` }} className="my-1">
        <div className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded cursor-pointer">
          {node.icon}
          <span className="text-sm font-mono">{node.name}</span>
        </div>
        {node.children && node.children.map(child => renderNode(child, level + 1))}
      </div>
    );

    return renderNode(tree);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📁 File Systems = Pantry Organization
          </h1>
          <p className="text-gray-600">How does the restaurant organize and access ingredients, recipes, and equipment?</p>
        </div>

        {/* Scenario Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Select File System Concept:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(scenarios).map(key => (
              <button
                key={key}
                onClick={() => setScenario(key)}
                disabled={isRunning}
                className={`p-3 rounded-lg font-semibold transition-colors text-sm ${
                  scenario === key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {scenarios[key].name}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario Info */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-2">{scenarios[scenario].name}</h3>
          <p className="text-sm mb-1"><strong>🏪 Restaurant:</strong> {scenarios[scenario].description}</p>
          <p className="text-sm"><strong>💻 OS Concept:</strong> {scenarios[scenario].concept}</p>
        </div>

        {/* Main Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* File System Tree */}
          <div className="border-4 border-indigo-500 rounded-lg p-4 bg-indigo-50">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Pantry Structure (Directory Tree)
            </h3>
            <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
              {renderFileTree()}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              📍 Root (/) = Main pantry entrance<br/>
              📂 Directories = Storage sections<br/>
              📄 Files = Actual items/data
            </div>
          </div>

          {/* Current Operation */}
          <div className="border-4 border-purple-500 rounded-lg p-4 bg-purple-50">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Current Operation
            </h3>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm min-h-64 max-h-96 overflow-y-auto">
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
                    <span className="text-gray-500">[{log.step}]</span> {log.message}
                  </div>
                ))
              )}
            </div>
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

        {/* Key Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Directory Structure
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Root (/):</strong> Top of hierarchy, main entrance</li>
              <li><strong>Subdirectories:</strong> Organized sections within</li>
              <li><strong>Absolute path:</strong> From root (/recipes/italian/pasta)</li>
              <li><strong>Relative path:</strong> From current location (../vegetables)</li>
              <li><strong>Tree structure:</strong> Parent-child relationships</li>
            </ul>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Inodes & Storage
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Inode:</strong> Data structure with file metadata</li>
              <li><strong>Inode #:</strong> Unique identifier for each file</li>
              <li><strong>Metadata:</strong> Size, owner, permissions, timestamps</li>
              <li><strong>Data blocks:</strong> Actual file content location</li>
              <li><strong>Directory entry:</strong> Filename → inode mapping</li>
            </ul>
          </div>

          <div className="bg-purple-100 p-4 rounded-lg">
            <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Permissions (rwx)
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>r (read):</strong> View contents (4)</li>
              <li><strong>w (write):</strong> Modify contents (2)</li>
              <li><strong>x (execute):</strong> Run/enter (1)</li>
              <li><strong>Owner:</strong> User who created file</li>
              <li><strong>Group:</strong> Team with shared access</li>
              <li><strong>Others:</strong> Everyone else</li>
            </ul>
            <div className="mt-2 bg-white p-2 rounded text-xs">
              <code>rwxr-xr--</code> = 754<br/>
              Owner: rwx (7), Group: r-x (5), Others: r-- (4)
            </div>
          </div>

          <div className="bg-orange-100 p-4 rounded-lg">
            <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Links & References
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Symbolic link:</strong> Pointer/shortcut to file</li>
              <li><strong>Hard link:</strong> Additional name for same inode</li>
              <li><strong>Link count:</strong> Number of names referencing inode</li>
              <li><strong>Dangling link:</strong> Symlink to deleted file</li>
              <li><strong>Cross-filesystem:</strong> Symlinks can, hard links cannot</li>
            </ul>
          </div>
        </div>

        {/* File Operations Table */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-3">🔧 Common File Operations</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Operation</th>
                  <th className="border border-gray-300 p-2">Restaurant Analogy</th>
                  <th className="border border-gray-300 p-2">OS System Call</th>
                  <th className="border border-gray-300 p-2">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">open()</td>
                  <td className="border border-gray-300 p-2">Take container from shelf</td>
                  <td className="border border-gray-300 p-2"><code>fd = open(path, flags)</code></td>
                  <td className="border border-gray-300 p-2">Get file descriptor</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">read()</td>
                  <td className="border border-gray-300 p-2">Take ingredients from container</td>
                  <td className="border border-gray-300 p-2"><code>read(fd, buffer, size)</code></td>
                  <td className="border border-gray-300 p-2">Read data from file</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">write()</td>
                  <td className="border border-gray-300 p-2">Add ingredients to container</td>
                  <td className="border border-gray-300 p-2"><code>write(fd, buffer, size)</code></td>
                  <td className="border border-gray-300 p-2">Write data to file</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">close()</td>
                  <td className="border border-gray-300 p-2">Return container to shelf</td>
                  <td className="border border-gray-300 p-2"><code>close(fd)</code></td>
                  <td className="border border-gray-300 p-2">Release file descriptor</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">create()</td>
                  <td className="border border-gray-300 p-2">Add new container to pantry</td>
                  <td className="border border-gray-300 p-2"><code>creat(path, mode)</code></td>
                  <td className="border border-gray-300 p-2">Create new file</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">unlink()</td>
                  <td className="border border-gray-300 p-2">Remove label from container</td>
                  <td className="border border-gray-300 p-2"><code>unlink(path)</code></td>
                  <td className="border border-gray-300 p-2">Delete file (decrease link count)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">stat()</td>
                  <td className="border border-gray-300 p-2">Read inventory label</td>
                  <td className="border border-gray-300 p-2"><code>stat(path, buf)</code></td>
                  <td className="border border-gray-300 p-2">Get file metadata (inode info)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">chmod()</td>
                  <td className="border border-gray-300 p-2">Change access rules</td>
                  <td className="border border-gray-300 p-2"><code>chmod(path, mode)</code></td>
                  <td className="border border-gray-300 p-2">Modify permissions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Linux Commands Reference */}
        <div className="bg-indigo-100 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-3">💻 Essential Linux/UNIX Commands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-indigo-900">Navigation & Viewing:</strong>
              <div className="bg-white p-2 mt-1 rounded space-y-1">
                <div><code className="text-xs">ls -l</code> - List files with details</div>
                <div><code className="text-xs">cd /path</code> - Change directory</div>
                <div><code className="text-xs">pwd</code> - Print working directory</div>
                <div><code className="text-xs">cat file.txt</code> - Display file contents</div>
                <div><code className="text-xs">tree</code> - Show directory tree</div>
              </div>
            </div>
            <div>
              <strong className="text-indigo-900">File Operations:</strong>
              <div className="bg-white p-2 mt-1 rounded space-y-1">
                <div><code className="text-xs">cp src dest</code> - Copy file</div>
                <div><code className="text-xs">mv src dest</code> - Move/rename file</div>
                <div><code className="text-xs">rm file</code> - Remove file</div>
                <div><code className="text-xs">mkdir dir</code> - Create directory</div>
                <div><code className="text-xs">touch file</code> - Create empty file</div>
              </div>
            </div>
            <div>
              <strong className="text-indigo-900">Permissions:</strong>
              <div className="bg-white p-2 mt-1 rounded space-y-1">
                <div><code className="text-xs">chmod 755 file</code> - Change mode</div>
                <div><code className="text-xs">chown user file</code> - Change owner</div>
                <div><code className="text-xs">chgrp group file</code> - Change group</div>
                <div><code className="text-xs">umask 022</code> - Set default permissions</div>
              </div>
            </div>
            <div>
              <strong className="text-indigo-900">Links & Mounting:</strong>
              <div className="bg-white p-2 mt-1 rounded space-y-1">
                <div><code className="text-xs">ln -s target link</code> - Symbolic link</div>
                <div><code className="text-xs">ln target link</code> - Hard link</div>
                <div><code className="text-xs">mount /dev/sdb1 /mnt</code> - Mount FS</div>
                <div><code className="text-xs">umount /mnt</code> - Unmount FS</div>
                <div><code className="text-xs">df -h</code> - Show disk usage</div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-World File System Examples */}
        <div className="bg-yellow-100 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-3">🌍 Common Directory Structure (Linux/UNIX)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded p-3">
              <div className="font-bold mb-2">System Directories:</div>
              <div className="space-y-1 text-xs">
                <div><code>/</code> - Root of entire filesystem</div>
                <div><code>/bin</code> - Essential user commands</div>
                <div><code>/etc</code> - Configuration files (recipes)</div>
                <div><code>/var</code> - Variable data (logs, temp files)</div>
                <div><code>/tmp</code> - Temporary files (prep area)</div>
                <div><code>/usr</code> - User programs and data</div>
                <div><code>/home</code> - User home directories (lockers)</div>
              </div>
            </div>
            <div className="bg-white rounded p-3">
              <div className="font-bold mb-2">Restaurant Mapping:</div>
              <div className="space-y-1 text-xs">
                <div>📁 <code>/</code> = Main pantry entrance</div>
                <div>🔧 <code>/bin</code> = Essential tools shelf</div>
                <div>📋 <code>/etc</code> = Recipe books & rules</div>
                <div>📝 <code>/var</code> = Daily logs & changing items</div>
                <div>🗑️ <code>/tmp</code> = Prep counter (cleared nightly)</div>
                <div>👥 <code>/home</code> = Staff personal lockers</div>
                <div>🍴 <code>/usr</code> = Shared equipment & supplies</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="mt-6 bg-green-100 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-700" />
            Key Takeaways
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li><strong>Hierarchy:</strong> Tree structure from root (/) provides organization</li>
            <li><strong>Inodes:</strong> Separate metadata from data, enable hard links</li>
            <li><strong>Permissions:</strong> rwx for owner/group/others controls access</li>
            <li><strong>Links:</strong> Symbolic (pointer) vs Hard (additional name)</li>
            <li><strong>Mounting:</strong> Attach external filesystems to directory tree</li>
            <li><strong>Operations:</strong> open/read/write/close abstract disk I/O</li>
            <li><strong>Paths:</strong> Absolute from root, relative from current location</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileSystemsVisualization;
