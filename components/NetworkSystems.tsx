import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Phone, Globe, Share2, Server, Users, MessageSquare, Lock, CheckCircle, AlertCircle, ArrowRightLeft, Wifi, Database } from 'lucide-react';

const NetworkSystems = () => {
  const [scenario, setScenario] = useState('client-server');
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [connections, setConnections] = useState([]);
  const [stats, setStats] = useState({ 
    requests: 0, 
    responses: 0, 
    latency: 0,
    activeConnections: 0 
  });

  const scenarios = {
    'client-server': {
      name: 'Client-Server Model',
      description: 'Customer calls restaurant for delivery - one provides service, one consumes',
      concept: 'Client requests service from server, server processes and responds',
      steps: 12,
      icon: <Server className="w-5 h-5" />
    },
    'sockets': {
      name: 'Sockets & Connections',
      description: 'Phone line establishment - dedicated communication channel',
      concept: 'Socket = endpoint for network communication (IP + Port)',
      steps: 10,
      icon: <Phone className="w-5 h-5" />
    },
    'protocols': {
      name: 'Network Protocols',
      description: 'Ordering format and language - rules for communication',
      concept: 'Protocol = set of rules for data exchange (TCP, UDP, HTTP)',
      steps: 10,
      icon: <MessageSquare className="w-5 h-5" />
    },
    'nfs': {
      name: 'Network File System',
      description: 'Shared recipe books between branches - remote file access',
      concept: 'NFS allows accessing files on remote server as if local',
      steps: 12,
      icon: <Database className="w-5 h-5" />
    },
    'ipc': {
      name: 'Inter-Process Communication',
      description: 'Chefs communicating within kitchen - local process communication',
      concept: 'IPC mechanisms: pipes, message queues, shared memory',
      steps: 10,
      icon: <ArrowRightLeft className="w-5 h-5" />
    },
    'layers': {
      name: 'Network Layers',
      description: 'Customer → Counter → Kitchen → Supplier chain',
      concept: 'Layered architecture: Application → Transport → Network → Link',
      steps: 10,
      icon: <Globe className="w-5 h-5" />
    }
  };

  const reset = () => {
    setIsRunning(false);
    setStep(0);
    setLogs([]);
    setConnections([]);
    setStats({ requests: 0, responses: 0, latency: 0, activeConnections: 0 });
    addLog('🔄 Network system ready', 'info');
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
    if (scenario === 'client-server') {
      executeClientServer();
    } else if (scenario === 'sockets') {
      executeSockets();
    } else if (scenario === 'protocols') {
      executeProtocols();
    } else if (scenario === 'nfs') {
      executeNFS();
    } else if (scenario === 'ipc') {
      executeIPC();
    } else if (scenario === 'layers') {
      executeLayers();
    }
  };

  const executeClientServer = () => {
    switch (step) {
      case 0:
        addLog('🏠 Customer at home wants dinner (CLIENT)', 'info');
        addLog('🍕 Restaurant provides food service (SERVER)', 'info');
        break;
      case 1:
        addLog('📞 Client calls restaurant: "I want to order"', 'success');
        addLog('💻 OS: Client process initiates connection request', 'info');
        setStats(prev => ({ ...prev, requests: prev.requests + 1 }));
        break;
      case 2:
        addLog('📱 Restaurant answers: "Hello, ready to take order"', 'success');
        addLog('🖥️ OS: Server accepts connection, allocates resources', 'info');
        setConnections([{ id: 1, from: 'Client', to: 'Server', status: 'established' }]);
        setStats(prev => ({ ...prev, activeConnections: 1 }));
        break;
      case 3:
        addLog('📋 Client sends request: "1 burger, 2 fries, 1 drink"', 'success');
        addLog('📦 OS: REQUEST packet sent over network', 'info');
        setStats(prev => ({ ...prev, requests: prev.requests + 1 }));
        break;
      case 4:
        addLog('👨‍🍳 Server processes request (cooking)', 'info');
        addLog('⚙️ OS: Server application processes data', 'info');
        break;
      case 5:
        addLog('✅ Server sends response: "Order ready, total $25"', 'success');
        addLog('📦 OS: RESPONSE packet sent back to client', 'info');
        setStats(prev => ({ ...prev, responses: prev.responses + 1, latency: 45 }));
        break;
      case 6:
        addLog('🚗 Delivery driver brings food to client', 'success');
        addLog('📡 OS: Data delivered through network infrastructure', 'info');
        break;
      case 7:
        addLog('📞 Client: "Received, thank you!" (acknowledgment)', 'success');
        addLog('💻 OS: ACK packet confirms successful delivery', 'info');
        break;
      case 8:
        addLog('👋 Connection closed - both parties done', 'info');
        addLog('🔌 OS: Socket connection terminated, resources freed', 'info');
        setConnections([]);
        setStats(prev => ({ ...prev, activeConnections: 0 }));
        break;
      case 9:
        addLog('📊 CLIENT-SERVER MODEL:', 'success');
        addLog('✓ Client initiates, Server responds', 'success');
        addLog('✓ Server can handle multiple clients simultaneously', 'success');
        addLog('✓ Stateless (HTTP) vs Stateful (FTP) servers', 'success');
        break;
      case 10:
        addLog('💻 OS Implementation:', 'info');
        addLog('• Client: socket() → connect() → send() → recv() → close()', 'info');
        addLog('• Server: socket() → bind() → listen() → accept() → recv() → send() → close()', 'info');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const executeSockets = () => {
    switch (step) {
      case 0:
        addLog('📞 Socket = Phone + Phone Number', 'info');
        addLog('🔌 Endpoint for network communication', 'info');
        break;
      case 1:
        addLog('🏢 Restaurant phone system setup:', 'info');
        addLog('📞 Main line: 555-PIZZA (IP: 192.168.1.10)', 'success');
        addLog('📱 Extension 80 for orders (Port 80)', 'info');
        addLog('💻 OS: Socket = IP Address + Port Number', 'info');
        break;
      case 2:
        addLog('🔧 Server creates socket:', 'success');
        addLog('socket() - Get phone line', 'info');
        addLog('bind(IP:Port) - Assign phone number + extension', 'info');
        addLog('listen() - Start accepting calls', 'info');
        break;
      case 3:
        addLog('📞 Client wants to call restaurant:', 'info');
        addLog('Knows: Restaurant IP (555-PIZZA) + Port (ext 80)', 'info');
        addLog('💻 OS: Client socket created with source port (random)', 'info');
        break;
      case 4:
        addLog('🔗 Connection establishment (3-way handshake):', 'success');
        addLog('1. Client: "Hello, can I order?" (SYN)', 'info');
        addLog('2. Server: "Yes! Ready to take order" (SYN-ACK)', 'info');
        addLog('3. Client: "Great, here\'s my order" (ACK)', 'info');
        setConnections([{ id: 1, from: '192.168.1.100:3456', to: '192.168.1.10:80', status: 'connected' }]);
        break;
      case 5:
        addLog('📡 Active connection:', 'success');
        addLog('Client socket: 192.168.1.100:3456', 'info');
        addLog('Server socket: 192.168.1.10:80', 'info');
        addLog('📞 Like dedicated phone line for this conversation', 'info');
        break;
      case 6:
        addLog('🔢 Port numbers explained:', 'info');
        addLog('Well-known ports (0-1023): HTTP(80), HTTPS(443), SSH(22)', 'info');
        addLog('Registered ports (1024-49151): App-specific', 'info');
        addLog('Dynamic/Private (49152-65535): Client random ports', 'info');
        break;
      case 7:
        addLog('🍽️ Restaurant has multiple phone lines:', 'success');
        addLog('Port 80: Orders (HTTP)', 'info');
        addLog('Port 443: Secure orders (HTTPS)', 'info');
        addLog('Port 22: Admin access (SSH)', 'info');
        addLog('💻 OS: Same IP, different ports = different services', 'info');
        break;
      case 8:
        addLog('✅ Socket benefits:', 'success');
        addLog('• Abstraction: Don\'t worry about network details', 'success');
        addLog('• Multiple connections: Many clients simultaneously', 'success');
        addLog('• Standard interface: Works across different networks', 'success');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const executeProtocols = () => {
    switch (step) {
      case 0:
        addLog('📋 Protocol = Rules for communication', 'info');
        addLog('🗣️ Like language and format for ordering food', 'info');
        break;
      case 1:
        addLog('📞 Phone Protocol (TCP):', 'success');
        addLog('1. Ring ring (connection request)', 'info');
        addLog('2. "Hello?" (acknowledgment)', 'info');
        addLog('3. Conversation (data exchange)', 'info');
        addLog('4. "Goodbye" (connection close)', 'info');
        addLog('💻 OS: Reliable, ordered, connection-oriented', 'info');
        break;
      case 2:
        addLog('✅ TCP guarantees:', 'success');
        addLog('• Delivery confirmation (like registered mail)', 'success');
        addLog('• Correct order (packages numbered)', 'success');
        addLog('• Error checking (damaged packages resent)', 'success');
        addLog('• Flow control (don\'t overwhelm receiver)', 'success');
        break;
      case 3:
        addLog('📮 Postcard Protocol (UDP):', 'info');
        addLog('Just send it - no confirmation needed!', 'info');
        addLog('💻 OS: Fast but unreliable, no connection', 'info');
        break;
      case 4:
        addLog('📮 UDP characteristics:', 'warning');
        addLog('• No handshake (connectionless)', 'warning');
        addLog('• No delivery guarantee', 'warning');
        addLog('• Can arrive out of order', 'warning');
        addLog('• But FAST! Low overhead', 'success');
        addLog('Use case: Video streaming, online gaming', 'info');
        break;
      case 5:
        addLog('🍕 Application Protocol - Menu Format:', 'info');
        addLog('HTTP request: "GET /menu/pizza HTTP/1.1"', 'info');
        addLog('Restaurant understands this format!', 'success');
        addLog('💻 OS: Application-layer protocol', 'info');
        break;
      case 6:
        addLog('📊 Protocol Stack (like nested boxes):', 'success');
        addLog('Application: HTTP/FTP (what to say)', 'info');
        addLog('Transport: TCP/UDP (reliable vs fast)', 'info');
        addLog('Network: IP (addressing, routing)', 'info');
        addLog('Link: Ethernet/WiFi (physical transmission)', 'info');
        break;
      case 7:
        addLog('🏪 Restaurant analogy mapping:', 'success');
        addLog('• HTTP: Menu format (how to order)', 'info');
        addLog('• TCP: Phone system (reliable delivery)', 'info');
        addLog('• IP: Address system (find restaurant)', 'info');
        addLog('• Ethernet: Delivery trucks (physical)', 'info');
        break;
      case 8:
        addLog('✅ Why protocols matter:', 'success');
        addLog('• Standardization (everyone follows same rules)', 'success');
        addLog('• Interoperability (different systems can talk)', 'success');
        addLog('• Reliability (error handling built-in)', 'success');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const executeNFS = () => {
    switch (step) {
      case 0:
        addLog('📚 Problem: Branch A needs recipe from Branch B', 'info');
        addLog('❌ Bad: Copy entire recipe book every time', 'error');
        addLog('✅ Better: Share recipe book over network!', 'success');
        break;
      case 1:
        addLog('🏢 Branch B (File Server):', 'success');
        addLog('Has recipe_book/ directory with 1000 recipes', 'info');
        addLog('💻 OS: NFS Server exports directory', 'info');
        addLog('Command: exportfs -o rw /recipes', 'info');
        break;
      case 2:
        addLog('🏪 Branch A (Client) wants to access recipes:', 'info');
        addLog('Creates mount point: /mnt/shared_recipes', 'info');
        addLog('💻 OS: mount branchB:/recipes /mnt/shared_recipes', 'info');
        break;
      case 3:
        addLog('✨ Magic happens:', 'success');
        addLog('Branch A accesses /mnt/shared_recipes/carbonara.txt', 'info');
        addLog('Feels like local file, but it\'s on Branch B!', 'success');
        addLog('💻 OS: Transparent remote file access', 'info');
        break;
      case 4:
        addLog('📖 Reading remote file (Step by step):', 'info');
        addLog('1. App calls: open("/mnt/shared_recipes/carbonara.txt")', 'info');
        addLog('2. VFS recognizes: This is NFS mount!', 'info');
        addLog('3. NFS client sends: LOOKUP RPC to server', 'info');
        break;
      case 5:
        addLog('4. Server responds: File handle (like ID card)', 'success');
        addLog('5. Client sends: READ RPC with file handle', 'info');
        addLog('6. Server reads disk, sends data back', 'success');
        addLog('7. Client caches data, returns to app', 'info');
        break;
      case 6:
        addLog('🔐 File operations over network:', 'success');
        addLog('• read() → READ RPC', 'info');
        addLog('• write() → WRITE RPC', 'info');
        addLog('• open() → LOOKUP RPC', 'info');
        addLog('• stat() → GETATTR RPC', 'info');
        break;
      case 7:
        addLog('⚡ NFS caching:', 'info');
        addLog('Client caches read data (faster repeat access)', 'success');
        addLog('Problem: What if server file changed?', 'warning');
        addLog('Solution: Check timestamps periodically', 'success');
        break;
      case 8:
        addLog('🔄 Stateless vs Stateful:', 'info');
        addLog('NFS (traditionally stateless):', 'info');
        addLog('• Each request independent', 'info');
        addLog('• Server doesn\'t remember client state', 'info');
        addLog('• More reliable (server crash doesn\'t lose state)', 'success');
        break;
      case 9:
        addLog('🌐 Real-world usage:', 'success');
        addLog('• Home directories on network', 'info');
        addLog('• Shared company documents', 'info');
        addLog('• Centralized backup', 'info');
        addLog('• Multiple servers accessing same data', 'info');
        break;
      case 10:
        addLog('✅ NFS benefits:', 'success');
        addLog('• Centralized storage management', 'success');
        addLog('• Transparent access (feels local)', 'success');
        addLog('• Saves disk space (no duplication)', 'success');
        addLog('• Easy sharing and collaboration', 'success');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const executeIPC = () => {
    switch (step) {
      case 0:
        addLog('🍳 IPC = Chefs communicating within same kitchen', 'info');
        addLog('💻 OS: Processes on same machine exchanging data', 'info');
        break;
      case 1:
        addLog('📣 Method 1: Shouting (Signals)', 'info');
        addLog('Head chef: "STOP!" → All chefs stop', 'success');
        addLog('💻 OS: kill -SIGSTOP <pid>', 'info');
        addLog('Simple notification, no data transfer', 'warning');
        break;
      case 2:
        addLog('🚰 Method 2: Pass ingredients through pipe', 'success');
        addLog('Chef A → [pipe] → Chef B', 'info');
        addLog('💻 OS: Unidirectional data stream', 'info');
        addLog('Example: command1 | command2', 'info');
        break;
      case 3:
        addLog('📝 Pipe characteristics:', 'info');
        addLog('• One-way communication (simplex)', 'info');
        addLog('• FIFO (first in, first out)', 'success');
        addLog('• Buffer size limited', 'warning');
        addLog('• Good for: ls | grep | sort', 'info');
        break;
      case 4:
        addLog('📮 Method 3: Message board (Message Queue)', 'success');
        addLog('Chef posts: "Need 5kg flour" on board', 'info');
        addLog('Supply chef reads message when available', 'info');
        addLog('💻 OS: Asynchronous message passing', 'info');
        break;
      case 5:
        addLog('📋 Message Queue features:', 'success');
        addLog('• Messages have types/priorities', 'info');
        addLog('• Reader can select which messages to read', 'success');
        addLog('• Persists across process lifetimes', 'info');
        addLog('• Multiple readers/writers possible', 'success');
        break;
      case 6:
        addLog('📊 Method 4: Shared prep counter (Shared Memory)', 'success');
        addLog('All chefs can see and modify ingredient list', 'info');
        addLog('💻 OS: Fastest IPC method!', 'success');
        addLog('⚠️ Need synchronization (mutex/semaphore)', 'warning');
        break;
      case 7:
        addLog('🔐 Shared Memory + Synchronization:', 'info');
        addLog('Must lock counter before writing!', 'warning');
        addLog('shmget() - Create shared memory segment', 'info');
        addLog('shmat() - Attach to process address space', 'info');
        addLog('Use mutex to prevent race conditions', 'success');
        break;
      case 8:
        addLog('🔌 Method 5: Internal phone (Unix Sockets)', 'info');
        addLog('Like network socket but within same machine', 'info');
        addLog('💻 OS: Bidirectional, connection-based', 'info');
        addLog('Used by: Docker, X11, database connections', 'info');
        break;
      case 9:
        addLog('📊 IPC Method Comparison:', 'success');
        addLog('Signals: Fast, simple, no data', 'info');
        addLog('Pipes: Simple, stream-based, unidirectional', 'info');
        addLog('Message Queue: Structured, typed messages', 'info');
        addLog('Shared Memory: Fastest, needs sync', 'success');
        addLog('Sockets: Bidirectional, flexible', 'info');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const executeLayers = () => {
    switch (step) {
      case 0:
        addLog('🏢 Network Stack = Restaurant Service Levels', 'info');
        addLog('Each layer adds its own functionality', 'info');
        break;
      case 1:
        addLog('👤 Layer 5: Application (Customer)', 'success');
        addLog('What customer wants: "I want a burger"', 'info');
        addLog('💻 HTTP, FTP, SMTP, DNS', 'info');
        addLog('Concerns: What service to request', 'info');
        break;
      case 2:
        addLog('📞 Layer 4: Transport (Phone System)', 'success');
        addLog('How to deliver message reliably', 'info');
        addLog('💻 TCP (reliable) or UDP (fast)', 'info');
        addLog('Adds: Port numbers, error checking, flow control', 'info');
        break;
      case 3:
        addLog('🗺️ Layer 3: Network (Address System)', 'success');
        addLog('Find correct restaurant branch (routing)', 'info');
        addLog('💻 IP protocol, routers', 'info');
        addLog('Adds: Source/destination IP addresses', 'info');
        break;
      case 4:
        addLog('🚚 Layer 2: Data Link (Delivery Trucks)', 'success');
        addLog('Move data on local network (like delivery zone)', 'info');
        addLog('💻 Ethernet, WiFi, MAC addresses', 'info');
        addLog('Adds: Frame structure, local addressing', 'info');
        break;
      case 5:
        addLog('🔌 Layer 1: Physical (Roads/Cables)', 'info');
        addLog('Actual physical transmission (bits on wire)', 'info');
        addLog('💻 Cables, radio waves, fiber optics', 'info');
        addLog('Concerns: Electrical signals, frequencies', 'info');
        break;
      case 6:
        addLog('📦 Encapsulation (wrapping like nested boxes):', 'success');
        addLog('Data → [TCP header] → [IP header] → [Ethernet frame]', 'info');
        addLog('Each layer adds its own header', 'info');
        addLog('Like: Letter → Envelope → Shipping box → Truck', 'info');
        break;
      case 7:
        addLog('🍕 Full journey example:', 'success');
        addLog('1. App: HTTP GET request for menu', 'info');
        addLog('2. TCP: Add port numbers, ensure delivery', 'info');
        addLog('3. IP: Add source/dest addresses, route it', 'info');
        addLog('4. Ethernet: Add MAC addresses, send on LAN', 'info');
        addLog('5. Physical: Convert to electrical signals', 'info');
        break;
      case 8:
        addLog('🔄 At destination (unwrapping):', 'info');
        addLog('Physical → Link → Network → Transport → App', 'info');
        addLog('Each layer strips its header, processes it', 'info');
        addLog('Finally: App receives original HTTP request', 'success');
        break;
      case 9:
        addLog('✅ Layered architecture benefits:', 'success');
        addLog('• Separation of concerns (modularity)', 'success');
        addLog('• Can change one layer without affecting others', 'success');
        addLog('• Standardized interfaces between layers', 'success');
        addLog('• Easier troubleshooting (check layer by layer)', 'success');
        setIsRunning(false);
        break;
      default:
        setIsRunning(false);
    }
    setStep(step + 1);
  };

  const renderConnections = () => {
    if (connections.length === 0) return null;

    return (
      <div className="space-y-2">
        {connections.map(conn => (
          <div key={conn.id} className="bg-white rounded-lg p-3 border-2 border-green-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold">{conn.from}</span>
              </div>
              <ArrowRightLeft className="w-4 h-4 text-green-600" />
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold">{conn.to}</span>
              </div>
            </div>
            <div className="text-xs text-green-700 mt-1">
              Status: {conn.status}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🌐 Network Systems = Inter-Branch Communication
          </h1>
          <p className="text-gray-600">How do restaurants (computers) communicate with each other?</p>
        </div>

        {/* Scenario Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Select Network Concept:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(scenarios).map(key => (
              <button
                key={key}
                onClick={() => setScenario(key)}
                disabled={isRunning}
                className={`p-3 rounded-lg font-semibold transition-colors text-sm flex items-center gap-2 justify-center ${
                  scenario === key
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {scenarios[key].icon}
                <span className="hidden md:inline">{scenarios[key].name}</span>
                <span className="md:hidden">{scenarios[key].name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scenario Info */}
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            {scenarios[scenario].icon}
            {scenarios[scenario].name}
          </h3>
          <p className="text-sm mb-1"><strong>🍽️ Restaurant:</strong> {scenarios[scenario].description}</p>
          <p className="text-sm"><strong>💻 OS Concept:</strong> {scenarios[scenario].concept}</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-lg text-center">
            <Share2 className="w-6 h-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.requests}</div>
            <div className="text-xs">Requests Sent</div>
          </div>
          <div className="bg-green-600 text-white p-3 rounded-lg text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.responses}</div>
            <div className="text-xs">Responses</div>
          </div>
          <div className="bg-purple-600 text-white p-3 rounded-lg text-center">
            <Wifi className="w-6 h-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.activeConnections}</div>
            <div className="text-xs">Active Connections</div>
          </div>
          <div className="bg-orange-600 text-white p-3 rounded-lg text-center">
            <Globe className="w-6 h-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.latency}ms</div>
            <div className="text-xs">Latency</div>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Active Connections */}
          <div className="border-4 border-green-500 rounded-lg p-4 bg-green-50">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Active Connections
            </h3>
            <div className="bg-white rounded-lg p-4 min-h-32">
              {connections.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  No active connections
                </div>
              ) : (
                renderConnections()
              )}
            </div>
          </div>

          {/* Network Log */}
          <div className="border-4 border-blue-500 rounded-lg p-4 bg-blue-50">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Network Activity Log
            </h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs max-h-64 overflow-y-auto">
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
              <Server className="w-4 h-4" />
              Client-Server Model
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Server:</strong> Provides service (restaurant)</li>
              <li><strong>Client:</strong> Requests service (customer)</li>
              <li><strong>Request-Response:</strong> Client asks, server answers</li>
              <li><strong>Many-to-One:</strong> Multiple clients, one server</li>
              <li><strong>Examples:</strong> Web servers, file servers, DB servers</li>
            </ul>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Sockets & Ports
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Socket:</strong> Endpoint (IP + Port)</li>
              <li><strong>IP Address:</strong> Identifies machine (phone number)</li>
              <li><strong>Port:</strong> Identifies service (extension)</li>
              <li><strong>Connection:</strong> Pair of sockets communicating</li>
              <li><strong>API:</strong> socket(), bind(), listen(), accept(), connect()</li>
            </ul>
          </div>

          <div className="bg-purple-100 p-4 rounded-lg">
            <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Network Protocols
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>TCP:</strong> Reliable, ordered, connection-oriented</li>
              <li><strong>UDP:</strong> Fast, unreliable, connectionless</li>
              <li><strong>HTTP:</strong> Web protocol (request/response)</li>
              <li><strong>IP:</strong> Addressing and routing</li>
              <li><strong>Protocol Stack:</strong> Layered architecture</li>
            </ul>
          </div>

          <div className="bg-orange-100 p-4 rounded-lg">
            <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Network File System
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>NFS:</strong> Access remote files as if local</li>
              <li><strong>Mount:</strong> Attach remote FS to local tree</li>
              <li><strong>RPC:</strong> Remote procedure call mechanism</li>
              <li><strong>Caching:</strong> Store frequently accessed data locally</li>
              <li><strong>Transparent:</strong> App doesn't know it's remote</li>
            </ul>
          </div>

          <div className="bg-cyan-100 p-4 rounded-lg">
            <h4 className="font-bold text-cyan-900 mb-2 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4" />
              Inter-Process Communication
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Signals:</strong> Simple notifications</li>
              <li><strong>Pipes:</strong> Unidirectional data stream</li>
              <li><strong>Message Queue:</strong> Typed, persistent messages</li>
              <li><strong>Shared Memory:</strong> Fastest IPC (needs sync)</li>
              <li><strong>Sockets:</strong> Bidirectional, flexible</li>
            </ul>
          </div>

          <div className="bg-indigo-100 p-4 rounded-lg">
            <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Network Layers
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Application:</strong> User-facing (HTTP, FTP)</li>
              <li><strong>Transport:</strong> Delivery (TCP/UDP)</li>
              <li><strong>Network:</strong> Routing (IP)</li>
              <li><strong>Data Link:</strong> Local transfer (Ethernet)</li>
              <li><strong>Physical:</strong> Bits on wire</li>
            </ul>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-3">💻 Socket Programming Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <strong className="text-gray-900">Server (Restaurant):</strong>
              <pre className="bg-white p-2 mt-1 rounded overflow-x-auto">
{`// Create socket
int server_fd = socket(AF_INET, 
                       SOCK_STREAM, 0);

// Bind to address
bind(server_fd, &address, 
     sizeof(address));

// Listen for connections
listen(server_fd, 5);

// Accept client
int client = accept(server_fd, ...);

// Communicate
recv(client, buffer, size, 0);
send(client, response, len, 0);

close(client);`}
              </pre>
            </div>
            <div>
              <strong className="text-gray-900">Client (Customer):</strong>
              <pre className="bg-white p-2 mt-1 rounded overflow-x-auto">
{`// Create socket
int sock = socket(AF_INET, 
                  SOCK_STREAM, 0);

// Connect to server
connect(sock, &server_addr, 
        sizeof(server_addr));

// Send request
send(sock, request, len, 0);

// Receive response
recv(sock, buffer, size, 0);

// Close connection
close(sock);`}
              </pre>
            </div>
          </div>
        </div>

        {/* NFS Commands */}
        <div className="bg-yellow-100 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-3">🔧 Network File System Commands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-yellow-900">Server Setup (Export):</strong>
              <div className="bg-white p-2 mt-1 rounded space-y-1">
                <div><code className="text-xs">vi /etc/exports</code> - Configure exports</div>
                <div><code className="text-xs">/data *(rw,sync)</code> - Share /data to all</div>
                <div><code className="text-xs">exportfs -a</code> - Apply changes</div>
                <div><code className="text-xs">showmount -e</code> - Show exports</div>
              </div>
            </div>
            <div>
              <strong className="text-yellow-900">Client Setup (Mount):</strong>
              <div className="bg-white p-2 mt-1 rounded space-y-1">
                <div><code className="text-xs">mkdir /mnt/remote</code> - Create mount point</div>
                <div><code className="text-xs">mount server:/data /mnt/remote</code> - Mount</div>
                <div><code className="text-xs">df -h</code> - Check mounted filesystems</div>
                <div><code className="text-xs">umount /mnt/remote</code> - Unmount</div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Mapping Summary */}
        <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-3">🍽️ Complete Restaurant ↔ Network Mapping</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded p-3">
              <div className="font-bold mb-2">🏢 Physical Infrastructure:</div>
              <div className="space-y-1 text-xs">
                <div>• Restaurant = Server/Host</div>
                <div>• Customer location = Client machine</div>
                <div>• Phone system = Network infrastructure</div>
                <div>• Delivery drivers = Network packets</div>
                <div>• Roads = Physical network cables</div>
              </div>
            </div>
            <div className="bg-white rounded p-3">
              <div className="font-bold mb-2">📞 Communication:</div>
              <div className="space-y-1 text-xs">
                <div>• Phone call = Socket connection</div>
                <div>• Phone number = IP address</div>
                <div>• Extension = Port number</div>
                <div>• Order format = Protocol</div>
                <div>• Receipt/confirmation = ACK packet</div>
              </div>
            </div>
            <div className="bg-white rounded p-3">
              <div className="font-bold mb-2">📚 Resource Sharing:</div>
              <div className="space-y-1 text-xs">
                <div>• Shared recipe book = NFS</div>
                <div>• Recipe reference = Network file path</div>
                <div>• Branch-to-branch calls = RPC</div>
                <div>• Franchise network = Distributed system</div>
              </div>
            </div>
            <div className="bg-white rounded p-3">
              <div className="font-bold mb-2">👨‍🍳 Internal Communication:</div>
              <div className="space-y-1 text-xs">
                <div>• Shouting = Signals</div>
                <div>• Ingredient pass = Pipes</div>
                <div>• Message board = Message queue</div>
                <div>• Shared counter = Shared memory</div>
                <div>• Intercom = Unix domain sockets</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-green-100 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-700" />
            Key Takeaways
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li><strong>Client-Server:</strong> Request-response model, server handles multiple clients</li>
            <li><strong>Sockets:</strong> IP + Port = communication endpoint, abstraction for networking</li>
            <li><strong>TCP vs UDP:</strong> Reliable/slow vs Fast/unreliable tradeoff</li>
            <li><strong>Protocols:</strong> Agreed rules for communication, layered architecture</li>
            <li><strong>NFS:</strong> Transparent remote file access, RPC-based, client caching</li>
            <li><strong>IPC:</strong> Multiple mechanisms for local communication (signals, pipes, shared memory)</li>
            <li><strong>Layers:</strong> Separation of concerns, modularity, standardized interfaces</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NetworkSystems;
