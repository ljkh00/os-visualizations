import React, { useState } from 'react';
import { Terminal, Folder, File, Lock, Eye, Play, Book, CheckCircle, XCircle } from 'lucide-react';

const LinuxEssentials = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('/home/student');
  const [commandInput, setCommandInput] = useState('');
  const [practiceScore, setPracticeScore] = useState({ correct: 0, total: 0 });

  // File system structure for simulation
  const fileSystem = {
    '/': {
      'home': {
        'student': {
          'documents': { 'report.txt': 'file', 'notes.md': 'file' },
          'projects': { 'web': {}, 'scripts': { 'backup.sh': 'file' } },
          'downloads': {}
        },
        'admin': {}
      },
      'etc': { 'config.conf': 'file', 'hosts': 'file' },
      'var': { 'log': { 'system.log': 'file' } },
      'tmp': {}
    }
  };

  const sections = [
    { id: 'intro', name: '1. Introduction', icon: Book },
    { id: 'shell', name: '2. Shell Basics', icon: Terminal },
    { id: 'navigation', name: '3. Navigation', icon: Folder },
    { id: 'files', name: '4. File Operations', icon: File },
    { id: 'permissions', name: '5. Permissions', icon: Lock },
    { id: 'viewing', name: '6. Viewing Files', icon: Eye },
    { id: 'scripting', name: '7. Basic Scripting', icon: Play }
  ];

  const shellCommands = [
    { cmd: 'pwd', desc: 'Print Working Directory - shows where you are', example: 'pwd → /home/student' },
    { cmd: 'ls', desc: 'List directory contents', example: 'ls -la → shows all files with details' },
    { cmd: 'cd', desc: 'Change Directory', example: 'cd documents → move to documents folder' },
    { cmd: 'mkdir', desc: 'Make Directory', example: 'mkdir backup → create backup folder' },
    { cmd: 'touch', desc: 'Create empty file or update timestamp', example: 'touch newfile.txt' },
    { cmd: 'cp', desc: 'Copy files or directories', example: 'cp file.txt backup/' },
    { cmd: 'mv', desc: 'Move or rename files', example: 'mv old.txt new.txt' },
    { cmd: 'rm', desc: 'Remove files or directories', example: 'rm file.txt (careful!)' },
    { cmd: 'cat', desc: 'Concatenate and display file contents', example: 'cat report.txt' },
    { cmd: 'grep', desc: 'Search text patterns', example: 'grep "error" system.log' },
    { cmd: 'chmod', desc: 'Change file permissions', example: 'chmod 755 script.sh' },
    { cmd: 'man', desc: 'Manual pages - get help', example: 'man ls → show ls documentation' }
  ];

  const permissionExamples = [
    {
      notation: '-rw-r--r--',
      octal: '644',
      meaning: 'Owner: read+write, Group: read, Others: read',
      typical: 'Regular files (documents, config files)'
    },
    {
      notation: '-rwxr-xr-x',
      octal: '755',
      meaning: 'Owner: read+write+execute, Group: read+execute, Others: read+execute',
      typical: 'Executable scripts and programs'
    },
    {
      notation: '-rw-------',
      octal: '600',
      meaning: 'Owner: read+write, Group: none, Others: none',
      typical: 'Private files (SSH keys, passwords)'
    },
    {
      notation: 'drwxr-xr-x',
      octal: '755',
      meaning: 'Directory: Owner full access, others can enter and list',
      typical: 'Standard directories'
    }
  ];

  const specialParameters = [
    { param: '$0', desc: 'Script name', example: 'echo $0 → ./backup.sh' },
    { param: '$1, $2...', desc: 'Positional parameters (arguments)', example: '$1 → first argument' },
    { param: '$#', desc: 'Number of arguments', example: 'if [ $# -eq 0 ]; then echo "No args"; fi' },
    { param: '$@', desc: 'All arguments as separate words', example: 'for arg in "$@"; do echo $arg; done' },
    { param: '$*', desc: 'All arguments as single string', example: 'echo "Args: $*"' },
    { param: '$?', desc: 'Exit status of last command', example: 'if [ $? -eq 0 ]; then echo "Success"; fi' },
    { param: '$$', desc: 'Current process ID', example: 'echo "Running as PID: $$"' },
    { param: '$!', desc: 'PID of last background process', example: 'sleep 60 & echo "Background PID: $!"' }
  ];

  const scriptTemplate = `#!/bin/bash
# Basic Script Template

# Variables
name="value"
count=0

# Check arguments
if [ $# -eq 0 ]; then
    echo "Usage: $0 <argument>"
    exit 1
fi

# Simple condition
if [ -f "file.txt" ]; then
    echo "File exists"
else
    echo "File not found"
fi

# Loop through arguments
for arg in "$@"; do
    echo "Processing: $arg"
done

# Exit with success
exit 0`;

  const practiceQuestions = [
    {
      question: 'Which command shows your current directory?',
      options: ['ls', 'pwd', 'cd', 'mkdir'],
      correct: 'pwd',
      section: 'navigation'
    },
    {
      question: 'What does "chmod 755 script.sh" do?',
      options: [
        'Make file readable by everyone',
        'Make file executable by owner, readable by others',
        'Owner: rwx, Group: r-x, Others: r-x',
        'Delete the file'
      ],
      correct: 'Owner: rwx, Group: r-x, Others: r-x',
      section: 'permissions'
    },
    {
      question: 'What does "$?" represent in bash?',
      options: [
        'Current process ID',
        'Script name',
        'Exit status of last command',
        'Number of arguments'
      ],
      correct: 'Exit status of last command',
      section: 'scripting'
    },
    {
      question: 'Which command creates a new directory?',
      options: ['touch', 'mkdir', 'create', 'md'],
      correct: 'mkdir',
      section: 'files'
    }
  ];

  const simulateCommand = (cmd: string) => {
    const output: string[] = [];
    const parts = cmd.trim().split(' ');
    const baseCmd = parts[0];

    switch (baseCmd) {
      case 'pwd':
        output.push(`$ ${cmd}`);
        output.push(currentPath);
        break;
      case 'ls':
        output.push(`$ ${cmd}`);
        output.push('documents  projects  downloads');
        break;
      case 'whoami':
        output.push(`$ ${cmd}`);
        output.push('student');
        break;
      case 'echo':
        output.push(`$ ${cmd}`);
        output.push(parts.slice(1).join(' '));
        break;
      case 'man':
        output.push(`$ ${cmd}`);
        output.push(`Manual page for ${parts[1] || 'command'}`);
        output.push('Use arrow keys to navigate, q to quit');
        break;
      default:
        output.push(`$ ${cmd}`);
        output.push(`bash: ${baseCmd}: command not found`);
    }

    setTerminalOutput([...terminalOutput, ...output]);
  };

  const handlePracticeAnswer = (question: any, answer: string) => {
    const isCorrect = answer === question.correct;
    setPracticeScore({
      correct: practiceScore.correct + (isCorrect ? 1 : 0),
      total: practiceScore.total + 1
    });
  };

  const renderIntro = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">🐧 Welcome to Linux Essentials</h2>
        <p className="text-lg">Your foundation for working with Linux systems</p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <h3 className="font-bold text-yellow-800 mb-2">⚠️ Why This Matters</h3>
        <p className="text-yellow-700">
          Most of you are experiencing Linux for the first time. This module gives you the
          practical commands you'll need for your assignments - building services on Linux servers.
          <strong> No restaurant analogies here - this is hands-on terminal work!</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Terminal className="text-blue-500" /> What is a Shell?
          </h3>
          <p className="text-gray-700 mb-3">
            A shell is a command-line interface that lets you communicate with the operating system.
            Think of it as a text-based way to control your computer.
          </p>
          <div className="bg-gray-100 p-3 rounded font-mono text-sm">
            <div className="text-green-600">student@linux:~$</div>
            <div className="text-gray-600">← This is your prompt</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Book className="text-purple-500" /> Common Shells
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={16} />
              <span><strong>bash</strong> - Bourne Again Shell (most common, what we'll use)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={16} />
              <span><strong>sh</strong> - Original Bourne Shell</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={16} />
              <span><strong>zsh</strong> - Z Shell (modern alternative)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-bold text-lg mb-3">📋 What You'll Learn</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Basic Commands</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Navigation (cd, pwd, ls)</li>
              <li>• File operations (cp, mv, rm)</li>
              <li>• Getting help (man, --help)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">File System</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Directory structure</li>
              <li>• Permissions (rwx)</li>
              <li>• Ownership concepts</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Basic Scripting</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Variables & parameters</li>
              <li>• Simple conditions</li>
              <li>• Basic loops</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderShell = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Shell Basics & Command Structure</h2>

      <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
        <h3 className="font-bold text-lg mb-4">Command Structure</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm mb-4">
          <div className="mb-2">command [options] [arguments]</div>
          <div className="text-gray-500">
            <div>├─ command:   what to do (e.g., ls, cd, grep)</div>
            <div>├─ options:   how to do it (e.g., -l, -a, --help)</div>
            <div>└─ arguments: what to do it to (e.g., filename, directory)</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Example 1: Simple</h4>
            <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
              ls
            </div>
            <p className="text-sm text-gray-600 mt-2">Just the command - lists current directory</p>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Example 2: With Options</h4>
            <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
              ls -la
            </div>
            <p className="text-sm text-gray-600 mt-2">-l (long format), -a (show all including hidden)</p>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Example 3: With Arguments</h4>
            <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
              ls /home
            </div>
            <p className="text-sm text-gray-600 mt-2">List contents of /home directory</p>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Example 4: Combined</h4>
            <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
              ls -la /home
            </div>
            <p className="text-sm text-gray-600 mt-2">Options + argument together</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Getting Help</h3>
        <div className="space-y-3">
          {[
            { cmd: 'man ls', desc: 'Full manual page for ls command', detail: 'Most comprehensive' },
            { cmd: 'ls --help', desc: 'Quick help for ls', detail: 'Faster, less detailed' },
            { cmd: 'info ls', desc: 'Info documentation for ls', detail: 'Alternative to man' },
            { cmd: 'which ls', desc: 'Shows location of ls program', detail: 'Where is the command?' }
          ].map((help, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-gray-50 p-3 rounded">
              <div className="bg-blue-500 text-white px-3 py-1 rounded font-mono text-sm flex-shrink-0">
                {help.cmd}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{help.desc}</div>
                <div className="text-sm text-gray-600">{help.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Essential Commands Quick Reference</h3>
        <div className="grid grid-cols-1 gap-2">
          {shellCommands.map((cmd, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded hover:bg-blue-50 transition">
              <div className="bg-green-600 text-white px-3 py-1 rounded font-mono text-sm font-bold min-w-[80px] text-center">
                {cmd.cmd}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{cmd.desc}</div>
                <div className="text-sm text-gray-600 font-mono">{cmd.example}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <h3 className="font-bold text-yellow-800 mb-2">💡 Pro Tips</h3>
        <ul className="space-y-1 text-yellow-700">
          <li>• Press <kbd className="bg-white px-2 py-1 rounded border">Tab</kbd> to autocomplete commands and filenames</li>
          <li>• Press <kbd className="bg-white px-2 py-1 rounded border">↑</kbd> to recall previous commands</li>
          <li>• Use <kbd className="bg-white px-2 py-1 rounded border">Ctrl+C</kbd> to cancel a running command</li>
          <li>• Type <code className="bg-white px-2 py-1 rounded font-mono">clear</code> to clear the terminal screen</li>
        </ul>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">File System Navigation</h2>

      <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
        <h3 className="font-bold text-lg mb-4">Linux Directory Structure</h3>
        <div className="bg-gray-900 text-green-400 p-6 rounded font-mono text-sm">
          <div className="space-y-1">
            <div>/                    <span className="text-gray-500">← Root (top level)</span></div>
            <div>├── home/            <span className="text-gray-500">← User home directories</span></div>
            <div>│   ├── student/     <span className="text-yellow-400">← Your home directory</span></div>
            <div>│   └── admin/</div>
            <div>├── etc/             <span className="text-gray-500">← Configuration files</span></div>
            <div>├── var/             <span className="text-gray-500">← Variable data (logs)</span></div>
            <div>│   └── log/</div>
            <div>├── usr/             <span className="text-gray-500">← User programs</span></div>
            <div>├── tmp/             <span className="text-gray-500">← Temporary files</span></div>
            <div>└── bin/             <span className="text-gray-500">← Essential commands</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Absolute vs Relative Paths</h3>
          
          <div className="mb-4">
            <h4 className="font-semibold text-blue-600 mb-2">Absolute Path</h4>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-2">
              /home/student/documents/report.txt
            </div>
            <p className="text-sm text-gray-600">Starts from root (/). Works from anywhere.</p>
          </div>

          <div>
            <h4 className="font-semibold text-green-600 mb-2">Relative Path</h4>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-2">
              documents/report.txt
            </div>
            <p className="text-sm text-gray-600">Relative to current location.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Special Directories</h3>
          <div className="space-y-3">
            {[
              { symbol: '.', meaning: 'Current directory', example: 'cp file.txt .' },
              { symbol: '..', meaning: 'Parent directory', example: 'cd ..' },
              { symbol: '~', meaning: 'Home directory', example: 'cd ~' },
              { symbol: '/', meaning: 'Root directory', example: 'cd /' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="bg-purple-500 text-white px-3 py-1 rounded font-mono text-lg font-bold min-w-[50px] text-center">
                  {item.symbol}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.meaning}</div>
                  <div className="text-sm text-gray-600 font-mono">{item.example}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Navigation Commands in Action</h3>
        <div className="space-y-4">
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
            <div className="text-blue-400"># Show current directory</div>
            <div>$ pwd</div>
            <div className="text-gray-400">/home/student</div>
            <div className="mt-3 text-blue-400"># List contents</div>
            <div>$ ls</div>
            <div className="text-gray-400">documents  projects  downloads</div>
            <div className="mt-3 text-blue-400"># Change to documents</div>
            <div>$ cd documents</div>
            <div>$ pwd</div>
            <div className="text-gray-400">/home/student/documents</div>
            <div className="mt-3 text-blue-400"># Go back to parent</div>
            <div>$ cd ..</div>
            <div>$ pwd</div>
            <div className="text-gray-400">/home/student</div>
            <div className="mt-3 text-blue-400"># Go to home directly</div>
            <div>$ cd ~</div>
            <div className="text-gray-400"># or just: cd</div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <h3 className="font-bold text-green-800 mb-2">✅ Quick Tips</h3>
        <ul className="space-y-1 text-green-700 text-sm">
          <li>• <code className="bg-white px-2 py-1 rounded font-mono">cd -</code> goes back to previous directory</li>
          <li>• <code className="bg-white px-2 py-1 rounded font-mono">ls -lh</code> shows file sizes in human-readable format (KB, MB)</li>
          <li>• <code className="bg-white px-2 py-1 rounded font-mono">ls -R</code> lists directories recursively</li>
          <li>• <code className="bg-white px-2 py-1 rounded font-mono">pwd</code> always shows where you are - use it often!</li>
        </ul>
      </div>
    </div>
  );

  const renderFiles = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">File Operations</h2>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
        <h3 className="font-bold text-red-800 mb-2">⚠️ DANGER ZONE</h3>
        <p className="text-red-700">
          <strong>rm</strong> (remove) is permanent! There's no "Recycle Bin" in Linux.
          Deleted files are GONE FOREVER. Always double-check before deleting!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <File className="text-blue-500" /> Creating Files & Directories
          </h3>
          <div className="space-y-4">
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ touch report.txt
              </div>
              <p className="text-sm text-gray-600">Create empty file or update timestamp</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ mkdir projects
              </div>
              <p className="text-sm text-gray-600">Create new directory</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ mkdir -p path/to/nested/dir
              </div>
              <p className="text-sm text-gray-600">Create nested directories (-p = parents)</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Folder className="text-green-500" /> Copying Files
          </h3>
          <div className="space-y-4">
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ cp file.txt backup.txt
              </div>
              <p className="text-sm text-gray-600">Copy file to new name</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ cp file.txt /backup/
              </div>
              <p className="text-sm text-gray-600">Copy file to directory</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ cp -r folder/ backup/
              </div>
              <p className="text-sm text-gray-600">Copy directory recursively (-r)</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Moving & Renaming</h3>
          <div className="space-y-4">
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ mv old.txt new.txt
              </div>
              <p className="text-sm text-gray-600">Rename file (same directory)</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ mv file.txt /backup/
              </div>
              <p className="text-sm text-gray-600">Move file to different directory</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ mv *.txt documents/
              </div>
              <p className="text-sm text-gray-600">Move all .txt files (* = wildcard)</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-red-300">
          <h3 className="font-bold text-lg mb-4 text-red-600">⚠️ Deleting Files</h3>
          <div className="space-y-4">
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ rm file.txt
              </div>
              <p className="text-sm text-gray-600">Delete file (PERMANENT!)</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ rm -i file.txt
              </div>
              <p className="text-sm text-gray-600">Ask for confirmation first (-i = interactive)</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ rm -r folder/
              </div>
              <p className="text-sm text-gray-600">Delete directory and contents (-r = recursive)</p>
            </div>
            <div>
              <div className="bg-gray-900 text-red-400 p-3 rounded font-mono text-sm mb-2">
                $ rm -rf /
              </div>
              <p className="text-sm text-red-600 font-bold">NEVER RUN THIS! Deletes everything!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Wildcards & Pattern Matching</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { pattern: '*.txt', meaning: 'All files ending in .txt', example: 'rm *.txt' },
            { pattern: 'file??.txt', meaning: 'file + 2 chars + .txt', example: 'ls file??.txt → file01.txt, file02.txt' },
            { pattern: '[abc]*', meaning: 'Files starting with a, b, or c', example: 'ls [abc]*' },
            { pattern: '*.{jpg,png}', meaning: 'Files ending in .jpg or .png', example: 'cp *.{jpg,png} images/' }
          ].map((item, idx) => (
            <div key={idx} className="bg-blue-50 p-4 rounded">
              <div className="font-mono text-lg font-bold text-blue-600 mb-2">{item.pattern}</div>
              <div className="text-sm text-gray-700 mb-1">{item.meaning}</div>
              <div className="text-xs text-gray-500 font-mono">{item.example}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPermissions = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">File Permissions</h2>

      <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
        <h3 className="font-bold text-lg mb-4">Understanding Permission Notation</h3>
        <div className="bg-gray-900 text-green-400 p-6 rounded font-mono">
          <div className="text-xl mb-4">-rwxr-xr--</div>
          <div className="space-y-2 text-sm">
            <div className="flex gap-4">
              <span className="text-red-400">-</span>
              <span className="text-gray-400">File type (- = file, d = directory, l = link)</span>
            </div>
            <div className="flex gap-4">
              <span className="text-yellow-400">rwx</span>
              <span className="text-gray-400">Owner permissions (read, write, execute)</span>
            </div>
            <div className="flex gap-4">
              <span className="text-blue-400">r-x</span>
              <span className="text-gray-400">Group permissions (read, no write, execute)</span>
            </div>
            <div className="flex gap-4">
              <span className="text-purple-400">r--</span>
              <span className="text-gray-400">Others permissions (read only)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Permission Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">r</div>
            <div className="font-semibold mb-1">Read = 4</div>
            <div className="text-sm text-gray-600">View file contents or list directory</div>
          </div>
          <div className="bg-blue-50 p-4 rounded text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">w</div>
            <div className="font-semibold mb-1">Write = 2</div>
            <div className="text-sm text-gray-600">Modify file or add/remove in directory</div>
          </div>
          <div className="bg-purple-50 p-4 rounded text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">x</div>
            <div className="font-semibold mb-1">Execute = 1</div>
            <div className="text-sm text-gray-600">Run file as program or enter directory</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Common Permission Examples</h3>
        <div className="space-y-4">
          {permissionExamples.map((perm, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono font-bold">
                  {perm.notation}
                </div>
                <div className="bg-blue-600 text-white px-4 py-2 rounded font-mono font-bold">
                  {perm.octal}
                </div>
              </div>
              <div className="font-semibold text-gray-800 mb-1">{perm.meaning}</div>
              <div className="text-sm text-gray-600">Typical use: {perm.typical}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Changing Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-600 mb-3">Numeric Method (Octal)</h4>
            <div className="space-y-3">
              <div>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                  $ chmod 755 script.sh
                </div>
                <p className="text-sm text-gray-600">Owner: rwx (7), Group: r-x (5), Others: r-x (5)</p>
              </div>
              <div>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                  $ chmod 644 document.txt
                </div>
                <p className="text-sm text-gray-600">Owner: rw- (6), Group: r-- (4), Others: r-- (4)</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-green-600 mb-3">Symbolic Method</h4>
            <div className="space-y-3">
              <div>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                  $ chmod +x script.sh
                </div>
                <p className="text-sm text-gray-600">Add execute permission for everyone</p>
              </div>
              <div>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                  $ chmod u+w,g-w file.txt
                </div>
                <p className="text-sm text-gray-600">User adds write, group removes write</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <h3 className="font-bold text-yellow-800 mb-2">🔐 Security Best Practices</h3>
        <ul className="space-y-1 text-yellow-700 text-sm">
          <li>• Never use 777 (rwxrwxrwx) - gives everyone full access!</li>
          <li>• Scripts: 755 (owner can modify, others can only execute)</li>
          <li>• Private files: 600 (only owner can read/write)</li>
          <li>• Shared files: 644 (owner can modify, others can read)</li>
        </ul>
      </div>
    </div>
  );

  const renderViewing = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Viewing & Processing Files</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Display File Contents</h3>
          <div className="space-y-4">
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ cat file.txt
              </div>
              <p className="text-sm text-gray-600">Display entire file at once</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ less file.txt
              </div>
              <p className="text-sm text-gray-600">View file page by page (q to quit, arrows to navigate)</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ head -n 10 file.txt
              </div>
              <p className="text-sm text-gray-600">Show first 10 lines</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ tail -n 20 file.txt
              </div>
              <p className="text-sm text-gray-600">Show last 20 lines</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ tail -f system.log
              </div>
              <p className="text-sm text-gray-600">Follow file in real-time (useful for logs!)</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Search & Filter</h3>
          <div className="space-y-4">
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ grep "error" system.log
              </div>
              <p className="text-sm text-gray-600">Find lines containing "error"</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ grep -i "error" system.log
              </div>
              <p className="text-sm text-gray-600">Case-insensitive search (-i)</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ grep -r "function" *.py
              </div>
              <p className="text-sm text-gray-600">Search recursively in all .py files</p>
            </div>
            <div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                $ grep -c "error" system.log
              </div>
              <p className="text-sm text-gray-600">Count matching lines (-c)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Text Processing Commands</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
              $ wc file.txt
            </div>
            <p className="text-sm text-gray-600 mb-1">Word count (lines, words, bytes)</p>
            <div className="text-xs text-gray-500 font-mono">Output: 45 230 1456 file.txt</div>
          </div>

          <div>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
              $ wc -l file.txt
            </div>
            <p className="text-sm text-gray-600 mb-1">Count lines only</p>
            <div className="text-xs text-gray-500 font-mono">Output: 45 file.txt</div>
          </div>

          <div>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
              $ sort file.txt
            </div>
            <p className="text-sm text-gray-600">Sort lines alphabetically</p>
          </div>

          <div>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
              $ sort file.txt | uniq
            </div>
            <p className="text-sm text-gray-600">Remove duplicate lines</p>
          </div>

          <div>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
              $ cut -d',' -f1,3 data.csv
            </div>
            <p className="text-sm text-gray-600">Extract columns 1 and 3 (comma-separated)</p>
          </div>

          <div>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
              $ awk '{'{print $1}'}' file.txt
            </div>
            <p className="text-sm text-gray-600">Print first column of each line</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
        <h3 className="font-bold text-lg mb-4">Pipes & Redirection</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Pipe (|) - Chain Commands</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
              $ cat file.txt | grep "error" | wc -l
            </div>
            <p className="text-sm text-gray-600">Display file → find errors → count lines</p>
          </div>

          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Output Redirection (&gt;)</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
              $ ls -la &gt; files.txt
            </div>
            <p className="text-sm text-gray-600">Save output to file (overwrites existing)</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Append (&gt;&gt;)</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
              $ echo "new line" &gt;&gt; file.txt
            </div>
            <p className="text-sm text-gray-600">Append to file (doesn't overwrite)</p>
          </div>

          <div className="bg-purple-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Complex Example</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
              $ grep -i "error" *.log | sort | uniq &gt; errors.txt
            </div>
            <p className="text-sm text-gray-600">Find errors → sort → remove duplicates → save</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScripting = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Basic Bash Scripting</h2>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-bold text-blue-800 mb-2">📝 What is a Shell Script?</h3>
        <p className="text-blue-700">
          A shell script is a text file containing a series of commands that the shell can execute.
          It's like writing a recipe for the computer to follow automatically!
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Script Template</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm whitespace-pre">
          {scriptTemplate}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Special Parameters Reference</h3>
        <div className="space-y-3">
          {specialParameters.map((param, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-gray-50 p-4 rounded">
              <div className="bg-purple-600 text-white px-4 py-2 rounded font-mono font-bold text-lg min-w-[100px] text-center">
                {param.param}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-1">{param.desc}</div>
                <div className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">{param.example}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Variables</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm mb-4">
            <div className="text-blue-400"># Declare variables (no spaces!)</div>
            <div>name="John"</div>
            <div>count=10</div>
            <div className="mt-2 text-blue-400"># Use variables with $</div>
            <div>echo "Hello, $name"</div>
            <div>echo "Count: $count"</div>
            <div className="mt-2 text-blue-400"># Command substitution</div>
            <div>today=$(date +%Y-%m-%d)</div>
            <div>files=$(ls | wc -l)</div>
          </div>
          <div className="text-sm text-gray-600">
            <strong>Note:</strong> No spaces around = sign!
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Conditionals</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
            <div className="text-blue-400"># File tests</div>
            <div>if [ -f "file.txt" ]; then</div>
            <div>  echo "File exists"</div>
            <div>fi</div>
            <div className="mt-2 text-blue-400"># Number comparison</div>
            <div>if [ $count -gt 5 ]; then</div>
            <div>  echo "Greater than 5"</div>
            <div>fi</div>
            <div className="mt-2 text-blue-400"># String comparison</div>
            <div>if [ "$name" = "John" ]; then</div>
            <div>  echo "Hello John!"</div>
            <div>fi</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Comparison Operators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-600 mb-3">Numeric Comparisons</h4>
            <div className="space-y-2 text-sm font-mono">
              <div className="bg-gray-100 p-2 rounded">-eq (equal)</div>
              <div className="bg-gray-100 p-2 rounded">-ne (not equal)</div>
              <div className="bg-gray-100 p-2 rounded">-gt (greater than)</div>
              <div className="bg-gray-100 p-2 rounded">-lt (less than)</div>
              <div className="bg-gray-100 p-2 rounded">-ge (greater or equal)</div>
              <div className="bg-gray-100 p-2 rounded">-le (less or equal)</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-green-600 mb-3">File Tests</h4>
            <div className="space-y-2 text-sm font-mono">
              <div className="bg-gray-100 p-2 rounded">-f file (is regular file)</div>
              <div className="bg-gray-100 p-2 rounded">-d dir (is directory)</div>
              <div className="bg-gray-100 p-2 rounded">-e path (exists)</div>
              <div className="bg-gray-100 p-2 rounded">-r file (readable)</div>
              <div className="bg-gray-100 p-2 rounded">-w file (writable)</div>
              <div className="bg-gray-100 p-2 rounded">-x file (executable)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Loops - For</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
            <div className="text-blue-400"># Loop over list</div>
            <div>for file in *.txt; do</div>
            <div>  echo "Processing $file"</div>
            <div>done</div>
            <div className="mt-3 text-blue-400"># Loop over arguments</div>
            <div>for arg in "$@"; do</div>
            <div>  echo "Arg: $arg"</div>
            <div>done</div>
            <div className="mt-3 text-blue-400"># Numeric loop</div>
            <div>for i in {'{1..5}'}; do</div>
            <div>  echo "Number $i"</div>
            <div>done</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Loops - While</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
            <div className="text-blue-400"># Read file line by line</div>
            <div>while read line; do</div>
            <div>  echo "Line: $line"</div>
            <div>done &lt; file.txt</div>
            <div className="mt-3 text-blue-400"># Counter loop</div>
            <div>count=0</div>
            <div>while [ $count -lt 5 ]; do</div>
            <div>  echo "Count: $count"</div>
            <div>  count=$((count + 1))</div>
            <div>done</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Functions</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
          <div className="text-blue-400"># Define function</div>
          <div>backup_file() {'{'}</div>
          <div>  local file=$1</div>
          <div>  local backup_dir=$2</div>
          <div>  </div>
          <div>  if [ -f "$file" ]; then</div>
          <div>    cp "$file" "$backup_dir/"</div>
          <div>    echo "Backed up: $file"</div>
          <div>    return 0</div>
          <div>  else</div>
          <div>    echo "Error: $file not found"</div>
          <div>    return 1</div>
          <div>  fi</div>
          <div>{'}'}</div>
          <div className="mt-3 text-blue-400"># Call function</div>
          <div>backup_file "report.txt" "/backup"</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
        <h3 className="font-bold text-lg mb-4">Complete Example: Backup Script</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
          <div>#!/bin/bash</div>
          <div className="text-blue-400"># Simple backup script</div>
          <div></div>
          <div className="text-blue-400"># Check arguments</div>
          <div>if [ $# -ne 2 ]; then</div>
          <div>  echo "Usage: $0 &lt;source_dir&gt; &lt;backup_dir&gt;"</div>
          <div>  exit 1</div>
          <div>fi</div>
          <div></div>
          <div>SOURCE=$1</div>
          <div>BACKUP=$2</div>
          <div>DATE=$(date +%Y%m%d)</div>
          <div></div>
          <div className="text-blue-400"># Create backup directory</div>
          <div>mkdir -p "$BACKUP"</div>
          <div></div>
          <div className="text-blue-400"># Backup files</div>
          <div>echo "Backing up $SOURCE to $BACKUP..."</div>
          <div>for file in "$SOURCE"/*.txt; do</div>
          <div>  if [ -f "$file" ]; then</div>
          <div>    cp "$file" "$BACKUP/$(basename $file).$DATE"</div>
          <div>    echo "Copied: $(basename $file)"</div>
          <div>  fi</div>
          <div>done</div>
          <div></div>
          <div>echo "Backup complete!"</div>
          <div>exit 0</div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <h3 className="font-bold text-green-800 mb-2">✅ Making Scripts Executable</h3>
        <div className="space-y-2 text-green-700">
          <div className="bg-white p-2 rounded font-mono text-sm">chmod +x script.sh</div>
          <div className="bg-white p-2 rounded font-mono text-sm">./script.sh arg1 arg2</div>
          <p className="text-sm">First make it executable, then run with ./</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-8 mb-6">
          <h1 className="text-4xl font-bold mb-2">💻 Linux Essentials</h1>
          <p className="text-xl text-blue-100">Essential Commands & Basic Scripting for First-Time Linux Users</p>
          <p className="text-sm text-blue-200 mt-2">
            Build your foundation: Navigate, manage files, and write simple bash scripts
          </p>
        </div>

        {/* Navigation */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeSection === 'intro' && renderIntro()}
          {activeSection === 'shell' && renderShell()}
          {activeSection === 'navigation' && renderNavigation()}
          {activeSection === 'files' && renderFiles()}
          {activeSection === 'permissions' && renderPermissions()}
          {activeSection === 'viewing' && renderViewing()}
          {activeSection === 'scripting' && renderScripting()}
        </div>

        {/* Practice Section */}
        {activeSection !== 'intro' && (
          <div className="bg-gray-800 rounded-lg p-6 mt-6">
            <h3 className="text-xl font-bold mb-4">🎯 Quick Practice</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {practiceQuestions
                .filter(q => q.section === activeSection)
                .map((question, idx) => (
                  <div key={idx} className="bg-gray-700 p-4 rounded">
                    <p className="font-medium mb-3">{question.question}</p>
                    <div className="space-y-2">
                      {question.options.map((option, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handlePracticeAnswer(question, option)}
                          className="w-full text-left px-4 py-2 bg-gray-600 hover:bg-blue-600 rounded transition text-sm"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
            {practiceScore.total > 0 && (
              <div className="mt-4 text-center">
                <p className="text-lg">
                  Score: {practiceScore.correct} / {practiceScore.total}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-6 flex justify-between items-center bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">
            {activeSection === 'intro' && 'Start here to understand Linux basics'}
            {activeSection === 'scripting' && 'Advanced Scripting coming in Module 9!'}
          </div>
          <div className="text-sm text-blue-400">
            Position #3 in Learning Path
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinuxEssentials;
