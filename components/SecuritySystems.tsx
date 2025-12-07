'use client';

import React, { useState } from 'react';
import { Shield, Lock, Eye, AlertTriangle, Key, Users, FileCheck, Skull, UserX, Bug, Camera, CheckCircle, XCircle } from 'lucide-react';

export default function SecuritySystems() {
  const [activePhase, setActivePhase] = useState(1);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [showThreat, setShowThreat] = useState<string | null>(null);

  // Phase 1: Restaurant Security Analogy
  const restaurantSecurity = {
    title: "Phase 1: Restaurant Security",
    concepts: [
      {
        id: 'zones',
        name: 'Security Zones',
        icon: Shield,
        restaurant: {
          title: 'Restaurant Areas by Access Level',
          zones: [
            { name: 'Dining Area', level: 'PUBLIC', access: 'Anyone can enter', color: 'bg-green-500' },
            { name: 'Front Counter', level: 'RESTRICTED', access: 'Customers can approach', color: 'bg-yellow-500' },
            { name: 'Kitchen', level: 'EMPLOYEES ONLY', access: 'Staff with kitchen badge', color: 'bg-orange-500' },
            { name: 'Manager Office', level: 'MANAGEMENT', access: 'Manager keycard only', color: 'bg-red-500' },
            { name: 'Vault/Safe', level: 'OWNER ONLY', access: 'Owner biometric + code', color: 'bg-purple-900' }
          ]
        }
      },
      {
        id: 'authentication',
        name: 'Identity Verification',
        icon: Key,
        restaurant: {
          title: 'How We Verify Who You Are',
          methods: [
            { 
              type: 'Employee Badge', 
              desc: 'Staff clock in with photo ID badge',
              security: 'BASIC - can be stolen/borrowed',
              example: '💳 John Smith - Kitchen Staff #4523'
            },
            { 
              type: 'Manager Keycard', 
              desc: 'RFID card for office access',
              security: 'MEDIUM - unique card, can be lost',
              example: '🔑 Sarah Lee - Manager - Keycard #789'
            },
            { 
              type: 'Owner Biometric', 
              desc: 'Fingerprint + PIN for vault',
              security: 'HIGH - cannot be easily stolen',
              example: '👆 Owner Fingerprint + 6-digit PIN'
            }
          ]
        }
      },
      {
        id: 'authorization',
        name: 'Permission Levels',
        icon: Lock,
        restaurant: {
          title: 'What Each Role Can Do',
          permissions: [
            { 
              role: 'Dishwasher',
              can: ['Enter kitchen', 'Use sink area', 'Access dish storage'],
              cannot: ['Cook food', 'Handle money', 'Enter office', 'Change recipes'],
              badge: '🧼 DISH CREW'
            },
            { 
              role: 'Cook',
              can: ['Enter kitchen', 'Use all cooking equipment', 'Read recipes', 'Prepare orders'],
              cannot: ['Change recipes', 'Handle money', 'Enter office', 'Hire staff'],
              badge: '👨‍🍳 KITCHEN STAFF'
            },
            { 
              role: 'Manager',
              can: ['Enter all areas', 'Change recipes', 'View sales', 'Manage schedules', 'Handle refunds'],
              cannot: ['Access vault', 'Change owner settings', 'Fire manager'],
              badge: '👔 MANAGEMENT'
            },
            { 
              role: 'Owner',
              can: ['FULL ACCESS', 'Change all settings', 'Access vault', 'Hire/fire anyone', 'View all logs'],
              cannot: ['Nothing - complete control'],
              badge: '👑 OWNER'
            }
          ]
        }
      },
      {
        id: 'accounting',
        name: 'Audit & Monitoring',
        icon: Camera,
        restaurant: {
          title: 'Tracking Who Did What',
          logs: [
            { time: '09:00', event: 'John clocked in (Kitchen Badge #4523)', type: 'access' },
            { time: '09:15', event: 'Sarah opened manager office (Keycard #789)', type: 'access' },
            { time: '10:30', event: 'Cook #12 attempted vault access - DENIED', type: 'violation' },
            { time: '12:00', event: 'Manager approved $50 refund (Customer #890)', type: 'transaction' },
            { time: '14:00', event: 'Owner accessed vault (Biometric verified)', type: 'critical' },
            { time: '18:00', event: 'Failed login attempt - wrong badge at back door', type: 'security' }
          ]
        }
      }
    ]
  };

  // Phase 2: Restaurant → OS Mapping
  const mappingPhase = {
    title: "Phase 2: Restaurant → OS Translation",
    mappings: [
      {
        restaurant: 'Security Zones (Dining → Kitchen → Office → Vault)',
        os: 'Protection Rings (Ring 3 User Mode → Ring 0 Kernel Mode)',
        details: [
          'Dining Area = User Space (Ring 3) - Regular programs run here',
          'Kitchen = Kernel Space (Ring 0) - OS core operations',
          'Office = Privileged Operations - System calls',
          'Vault = Protected Resources - Critical system data'
        ]
      },
      {
        restaurant: 'Employee Badge Authentication',
        os: 'User Login (Username + Password)',
        details: [
          'Photo ID Badge = Username',
          'PIN/Signature = Password Hash',
          'Clock-in machine = Login System',
          'Failed badge scan = Authentication failure'
        ]
      },
      {
        restaurant: 'Permission Levels (Dishwasher → Cook → Manager → Owner)',
        os: 'User Permissions (Regular User → Sudoer → Root)',
        details: [
          'Dishwasher = Regular user (limited access)',
          'Cook = User with some elevated privileges',
          'Manager = Sudo user (can elevate with password)',
          'Owner = Root user (UID 0, full control)'
        ]
      },
      {
        restaurant: 'Access Control List (Who can enter which door)',
        os: 'File Permissions (rwxrwxrwx) & ACLs',
        details: [
          'Badge permissions = File/directory permissions',
          'Door locks = Access control mechanisms',
          'Permission card = ACL entry',
          'Revoked access = chmod 000'
        ]
      },
      {
        restaurant: 'Security Camera Logs',
        os: 'Audit Logs (/var/log/auth.log, /var/log/secure)',
        details: [
          'Time-stamped footage = syslog entries',
          'Access logs = /var/log/auth.log',
          'Failed attempts = Failed login records',
          'Critical events = Security alerts'
        ]
      }
    ]
  };

  // Phase 3: Common Security Threats
  const threatsPhase = {
    title: "Phase 3: Security Threats & Defenses",
    threats: [
      {
        id: 'overflow',
        name: 'Buffer Overflow',
        icon: Bug,
        restaurant: {
          scenario: 'A cook overfills a pot with soup. It overflows onto the next station, contaminating another dish.',
          problem: 'Overflow from one area affects another area',
          impact: 'Food contamination, health hazard, wrong orders served'
        },
        os: {
          scenario: 'A program writes more data to a buffer than it can hold. Extra data overwrites adjacent memory.',
          problem: 'Memory overflow corrupts other programs or system data',
          impact: 'Crashes, data corruption, allows attacker to inject malicious code',
          defense: 'Stack canaries, ASLR (Address Space Layout Randomization), DEP (Data Execution Prevention)'
        }
      },
      {
        id: 'privilege',
        name: 'Privilege Escalation',
        icon: UserX,
        restaurant: {
          scenario: 'A dishwasher finds a manager\'s keycard and uses it to access the office and safe.',
          problem: 'Lower-level employee gains unauthorized higher-level access',
          impact: 'Can steal money, change recipes, delete records, create fake accounts'
        },
        os: {
          scenario: 'A regular user exploits a vulnerability to gain root/admin privileges.',
          problem: 'Unprivileged user gains privileged access',
          impact: 'Full system control, can install malware, delete files, create backdoors',
          defense: 'Principle of least privilege, proper permission validation, security patches, SELinux/AppArmor'
        }
      },
      {
        id: 'social',
        name: 'Social Engineering',
        icon: Skull,
        restaurant: {
          scenario: 'Someone in a fake delivery uniform convinces staff to let them in the back door, then steals supplies.',
          problem: 'Attacker manipulates people instead of breaking systems',
          impact: 'Theft, data access, planted malware, compromised credentials'
        },
        os: {
          scenario: 'Attacker sends fake IT email asking user to "verify password" or click malicious link.',
          problem: 'Users tricked into giving access or running malware',
          impact: 'Stolen credentials, malware installation, ransomware, data breach',
          defense: 'User training, email filtering, 2FA, verify requests through alternate channels'
        }
      },
      {
        id: 'malware',
        name: 'Malware Injection',
        icon: AlertTriangle,
        restaurant: {
          scenario: 'Contaminated ingredients sneak in and poison multiple dishes throughout the day.',
          problem: 'Bad input spreads through the system',
          impact: 'Customer illness, health dept shutdown, reputation damage'
        },
        os: {
          scenario: 'User downloads infected file or visits compromised website, malware executes.',
          problem: 'Malicious code runs on system',
          impact: 'Data theft, ransomware, keyloggers, system control, botnet participation',
          defense: 'Antivirus, firewalls, code signing, sandboxing, principle of least privilege, regular updates'
        }
      },
      {
        id: 'dos',
        name: 'Denial of Service',
        icon: XCircle,
        restaurant: {
          scenario: 'Fake customers flood the restaurant making fake reservations, preventing real customers from dining.',
          problem: 'System overwhelmed by bogus requests',
          impact: 'Legitimate users cannot access services, revenue loss'
        },
        os: {
          scenario: 'Attacker floods server with requests, exhausting resources (CPU, memory, network).',
          problem: 'System too busy handling attacks to serve legitimate users',
          impact: 'Service unavailable, crashes, network congestion',
          defense: 'Rate limiting, traffic filtering, load balancers, DDoS mitigation services, firewall rules'
        }
      }
    ]
  };

  const renderRestaurantConcept = (concept: any) => {
    if (concept.id === 'zones') {
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-orange-300">{concept.restaurant.title}</h4>
          {concept.restaurant.zones.map((zone: any, idx: number) => (
            <div key={idx} className={`${zone.color} bg-opacity-20 border-l-4 ${zone.color.replace('bg-', 'border-')} p-4 rounded`}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">{zone.name}</div>
                  <div className="text-sm text-gray-300">{zone.level}</div>
                </div>
                <div className="text-sm text-gray-300">{zone.access}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (concept.id === 'authentication') {
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-orange-300">{concept.restaurant.title}</h4>
          {concept.restaurant.methods.map((method: any, idx: number) => (
            <div key={idx} className="bg-gray-700 p-4 rounded border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-white">{method.type}</div>
                <div className={`text-xs px-2 py-1 rounded ${
                  method.security.includes('HIGH') ? 'bg-green-600' :
                  method.security.includes('MEDIUM') ? 'bg-yellow-600' : 'bg-red-600'
                }`}>
                  {method.security.split(' - ')[0]}
                </div>
              </div>
              <div className="text-sm text-gray-300 mb-2">{method.desc}</div>
              <div className="text-xs text-gray-400 italic">{method.security}</div>
              <div className="mt-2 bg-gray-800 p-2 rounded font-mono text-sm text-blue-300">
                {method.example}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (concept.id === 'authorization') {
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-orange-300">{concept.restaurant.title}</h4>
          {concept.restaurant.permissions.map((perm: any, idx: number) => (
            <div key={idx} className="bg-gray-700 p-4 rounded border border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-white text-lg">{perm.role}</div>
                <div className="bg-gray-800 px-3 py-1 rounded font-mono text-sm">{perm.badge}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-green-400 font-semibold mb-2">✓ ALLOWED:</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {perm.can.map((item: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-3 h-3 mr-2 text-green-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs text-red-400 font-semibold mb-2">✗ DENIED:</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {perm.cannot.map((item: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <XCircle className="w-3 h-3 mr-2 text-red-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (concept.id === 'accounting') {
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-orange-300">{concept.restaurant.title}</h4>
          <div className="bg-gray-900 p-4 rounded border border-gray-700 font-mono text-sm">
            <div className="text-blue-300 mb-3">🎥 SECURITY LOG - Restaurant Surveillance System</div>
            {concept.restaurant.logs.map((log: any, idx: number) => (
              <div key={idx} className={`mb-2 p-2 rounded ${
                log.type === 'violation' ? 'bg-red-900 bg-opacity-30 border-l-2 border-red-500' :
                log.type === 'security' ? 'bg-yellow-900 bg-opacity-30 border-l-2 border-yellow-500' :
                log.type === 'critical' ? 'bg-purple-900 bg-opacity-30 border-l-2 border-purple-500' :
                'bg-gray-800'
              }`}>
                <span className="text-gray-500">[{log.time}]</span>{' '}
                <span className="text-gray-300">{log.event}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  const renderThreat = (threat: any) => {
    return (
      <div className="space-y-6">
        <div className="bg-orange-900 bg-opacity-30 border border-orange-500 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="text-4xl mr-4">🍽️</div>
            <div>
              <h4 className="font-bold text-xl text-orange-300 mb-1">Restaurant Scenario</h4>
              <p className="text-gray-300">{threat.restaurant.scenario}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-xs text-yellow-400 font-semibold mb-1">PROBLEM:</div>
              <div className="text-sm text-gray-300">{threat.restaurant.problem}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-xs text-red-400 font-semibold mb-1">IMPACT:</div>
              <div className="text-sm text-gray-300">{threat.restaurant.impact}</div>
            </div>
          </div>
        </div>

        <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="text-4xl mr-4">💻</div>
            <div>
              <h4 className="font-bold text-xl text-red-300 mb-1">OS Security Threat</h4>
              <p className="text-gray-300">{threat.os.scenario}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-xs text-yellow-400 font-semibold mb-1">PROBLEM:</div>
              <div className="text-sm text-gray-300">{threat.os.problem}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-xs text-red-400 font-semibold mb-1">IMPACT:</div>
              <div className="text-sm text-gray-300">{threat.os.impact}</div>
            </div>
          </div>
          <div className="mt-4 bg-green-900 bg-opacity-30 border border-green-500 p-4 rounded">
            <div className="text-xs text-green-400 font-semibold mb-2">🛡️ DEFENSE MECHANISMS:</div>
            <div className="text-sm text-gray-300">{threat.os.defense}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-red-500 mr-4" />
            <h1 className="text-4xl font-bold">Security & Protection</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Understanding OS security through restaurant access control, authentication, and threats
          </p>
        </div>

        {/* Phase Selector */}
        <div className="flex justify-center space-x-4 mb-8">
          {[
            { num: 1, label: 'Restaurant Security', icon: Shield },
            { num: 2, label: 'OS Translation', icon: Lock },
            { num: 3, label: 'Threats & Defense', icon: AlertTriangle }
          ].map(phase => (
            <button
              key={phase.num}
              onClick={() => {
                setActivePhase(phase.num);
                setSelectedConcept(null);
                setShowThreat(null);
              }}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                activePhase === phase.num
                  ? 'bg-red-600 text-white scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <phase.icon className="w-5 h-5 mr-2" />
              Phase {phase.num}: {phase.label}
            </button>
          ))}
        </div>

        {/* Phase 1: Restaurant Security */}
        {activePhase === 1 && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-orange-500">
              <h2 className="text-2xl font-bold text-orange-300 mb-4">
                {restaurantSecurity.title}
              </h2>
              <p className="text-gray-300 mb-6">
                Let's understand security through restaurant access control. Click on each concept to explore.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {restaurantSecurity.concepts.map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => setSelectedConcept(concept.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedConcept === concept.id
                        ? 'bg-orange-600 border-orange-400 scale-105'
                        : 'bg-gray-700 border-gray-600 hover:border-orange-500'
                    }`}
                  >
                    <concept.icon className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-center">{concept.name}</div>
                  </button>
                ))}
              </div>

              {selectedConcept && (
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  {renderRestaurantConcept(
                    restaurantSecurity.concepts.find(c => c.id === selectedConcept)
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phase 2: Mapping */}
        {activePhase === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-blue-500">
              <h2 className="text-2xl font-bold text-blue-300 mb-4">
                {mappingPhase.title}
              </h2>
              <p className="text-gray-300 mb-6">
                See how restaurant security concepts map to actual OS security mechanisms.
              </p>

              <div className="space-y-6">
                {mappingPhase.mappings.map((mapping, idx) => (
                  <div key={idx} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className="bg-orange-900 bg-opacity-30 p-4 rounded border border-orange-500">
                        <div className="text-sm text-orange-300 font-semibold mb-2">🍽️ RESTAURANT:</div>
                        <div className="text-white font-bold">{mapping.restaurant}</div>
                      </div>
                      <div className="bg-blue-900 bg-opacity-30 p-4 rounded border border-blue-500">
                        <div className="text-sm text-blue-300 font-semibold mb-2">💻 OPERATING SYSTEM:</div>
                        <div className="text-white font-bold">{mapping.os}</div>
                      </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded">
                      <div className="text-xs text-gray-400 font-semibold mb-3">DETAILED MAPPING:</div>
                      <ul className="space-y-2">
                        {mapping.details.map((detail, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start">
                            <span className="text-green-400 mr-2">→</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Phase 3: Threats */}
        {activePhase === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-red-500">
              <h2 className="text-2xl font-bold text-red-300 mb-4">
                {threatsPhase.title}
              </h2>
              <p className="text-gray-300 mb-6">
                Learn common security threats through restaurant scenarios, then see OS equivalents and defenses.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {threatsPhase.threats.map(threat => (
                  <button
                    key={threat.id}
                    onClick={() => setShowThreat(threat.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      showThreat === threat.id
                        ? 'bg-red-600 border-red-400 scale-105'
                        : 'bg-gray-700 border-gray-600 hover:border-red-500'
                    }`}
                  >
                    <threat.icon className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-xs font-semibold text-center">{threat.name}</div>
                  </button>
                ))}
              </div>

              {showThreat && (
                <div>
                  {renderThreat(
                    threatsPhase.threats.find(t => t.id === showThreat)
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Key Concepts Summary */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-purple-500">
          <h3 className="text-xl font-bold text-purple-300 mb-4">🎯 Exam Focus: Security Concepts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-green-400 mb-3">Protection Mechanisms</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Protection rings (User vs Kernel mode)</li>
                <li>• Access control (ACLs, permissions)</li>
                <li>• Principle of least privilege</li>
                <li>• Capabilities vs ACLs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-3">AAA Framework</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Authentication (Who are you?)</li>
                <li>• Authorization (What can you do?)</li>
                <li>• Accounting (What did you do?)</li>
                <li>• Audit logs and monitoring</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 mb-3">Common Threats</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Buffer overflow attacks</li>
                <li>• Privilege escalation</li>
                <li>• Social engineering</li>
                <li>• Malware and DoS attacks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Linux Commands Reference */}
        <div className="mt-6 bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-yellow-300 mb-4">🐧 Linux Security Commands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-green-400 mb-2">View permissions:</div>
              <code className="text-gray-300">ls -l /path/to/file</code>
              <div className="text-gray-500 text-xs mt-1">Shows rwxrwxrwx permissions</div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-green-400 mb-2">Change permissions:</div>
              <code className="text-gray-300">chmod 755 script.sh</code>
              <div className="text-gray-500 text-xs mt-1">rwxr-xr-x (owner, group, others)</div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-green-400 mb-2">View auth logs:</div>
              <code className="text-gray-300">sudo tail -f /var/log/auth.log</code>
              <div className="text-gray-500 text-xs mt-1">Monitor login attempts</div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-green-400 mb-2">Check logged-in users:</div>
              <code className="text-gray-300">who</code> or <code className="text-gray-300">w</code>
              <div className="text-gray-500 text-xs mt-1">See active sessions</div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-green-400 mb-2">View sudo privileges:</div>
              <code className="text-gray-300">sudo -l</code>
              <div className="text-gray-500 text-xs mt-1">What commands can you run as root</div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-green-400 mb-2">Change file owner:</div>
              <code className="text-gray-300">sudo chown user:group file</code>
              <div className="text-gray-500 text-xs mt-1">Transfer ownership</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
