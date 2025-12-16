import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, Minus, ChevronRight } from 'lucide-react';

interface TerminalLine {
  type: 'input' | 'output' | 'system';
  content: string;
}

const TerminalMode: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'system', content: 'Welcome to UdoyOS v2.5.0' },
    { type: 'system', content: 'System Initialized. Access granted.' },
    { type: 'system', content: 'Type "help" to view available commands.' },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [history, isOpen]);

  // Key bind to toggle terminal (Backtick `)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`') {
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    const newHistory = [...history, { type: 'input', content: cmd } as TerminalLine];

    let response = '';
    
    switch (command) {
      case 'help':
        response = `COMMANDS LIST:
  ---------------------------
  > about       Navigate to About section
  > projects    View featured projects
  > skills      Analyze skill matrix
  > contact     Display contact info
  > clear       Clear terminal buffer
  > date        Display server time
  > whoami      Identify current user
  > exit        Close terminal session`;
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'about':
        response = 'Executing navigation protocol: TARGET [ABOUT]...';
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'projects':
        response = 'Retrieving project archives... \n[STATUS: SUCCESS] Displaying featured works.';
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'skills':
        response = 'Scanning neural pathways... \n[RESULT] React.js (Expert) | Java (Advanced) | Testing (Expert)';
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'contact':
        response = 'CONTACT UPLINK ESTABLISHED:\n> Email:  udoychowdhury90413@gmail.com\n> Phone:  +880 1700 978 285\n> GitHub: github.com/aontor22';
        break;
      case 'date':
        response = new Date().toLocaleString();
        break;
      case 'whoami':
        response = 'User: GUEST\nRole: VISITOR\nPermissions: READ_ONLY';
        break;
      case 'exit':
        setIsOpen(false);
        response = 'Session terminated.';
        break;
      case 'sudo':
        response = 'Access Denied: You do not have root privileges in this sector.';
        break;
      case 'ls':
        response = 'about.tsx  projects.json  skills.db  contact.txt  secret_plans.doc';
        break;
      default:
        if (command !== '') {
            response = `Error: Command '${command}' not recognized. Type "help" for assistance.`;
        }
    }

    if (response) {
      newHistory.push({ type: 'output', content: response });
    }
    
    setHistory(newHistory);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  return (
    <>
      {/* Terminal Trigger Button - Desktop Only */}
      {/* Positioned ABOVE the Hire Me button (bottom-28) */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-6 md:bottom-28 md:left-8 z-[70] hidden md:flex items-center gap-3 px-5 py-3 bg-black/80 backdrop-blur-md text-green-500 border border-green-500/30 rounded-full shadow-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:bg-black/90 transition-all group font-mono text-xs md:text-sm"
        title="Open Developer Terminal (Press `)"
      >
        <TerminalIcon size={14} className="group-hover:text-green-400" />
        <span className="font-bold tracking-wider group-hover:text-white transition-colors">
          <span className="text-green-500 mr-1">{'>'}</span>DEV_MODE
        </span>
        
        {/* Blinking Status Light */}
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-full h-[60vh] bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-green-500/50 shadow-2xl z-[100] font-mono text-sm md:text-base overflow-hidden flex flex-col"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#050505] border-b border-green-900/30">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" onClick={() => setIsOpen(false)} />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer" onClick={() => setIsOpen(false)} />
                    <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer" />
                </div>
                <div className="flex items-center gap-2 text-gray-400 ml-4 text-xs md:text-sm">
                  <TerminalIcon size={14} />
                  <span>udoy@portfolio:~/root</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-xs text-gray-600 hidden md:block">v2.5.0 (Stable)</span>
                 <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                    <X size={18} />
                 </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div 
                className="flex-1 p-6 overflow-y-auto scrollbar-hide bg-gradient-to-b from-[#0a0a0a] to-[#050505]"
                onClick={() => inputRef.current?.focus()}
            >
              <div className="max-w-4xl mx-auto">
                  {history.map((line, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i} 
                        className={`mb-2 font-medium ${
                        line.type === 'input' ? 'text-white mt-4 flex items-center gap-2' : 
                        line.type === 'system' ? 'text-blue-400 italic' : 'text-green-400 pl-4 border-l-2 border-green-900'
                        } whitespace-pre-wrap leading-relaxed`}
                    >
                      {line.type === 'input' && <span className="text-pink-500 font-bold">➜</span>}
                      {line.content}
                    </motion.div>
                  ))}
                  
                  <form onSubmit={onSubmit} className="flex items-center gap-2 mt-4 group">
                    <span className="text-pink-500 font-bold">➜</span>
                    <span className="text-cyan-400 font-bold">~</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-white font-bold caret-green-500 placeholder-gray-700"
                      autoFocus
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </form>
                  <div ref={bottomRef} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TerminalMode;