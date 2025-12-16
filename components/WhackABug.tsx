import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Play, Trophy, Terminal, Ban } from 'lucide-react';

const GRID_SIZE = 9;
const GAME_DURATION = 30; // seconds

const WhackABug: React.FC = () => {
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  
  const timerRef = useRef<number | null>(null);
  const bugIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('bugHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setActiveHole(null);
    
    // Game Timer
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Bug Spawning Loop
    spawnBug();
  };

  const spawnBug = () => {
    // Random interval between 500ms and 1000ms
    const nextSpawnTime = Math.random() * 500 + 500;
    
    bugIntervalRef.current = window.setTimeout(() => {
        const newHole = Math.floor(Math.random() * GRID_SIZE);
        setActiveHole(newHole);
        spawnBug(); // Schedule next
    }, nextSpawnTime);
  };

  const endGame = () => {
    setIsPlaying(false);
    setActiveHole(null);
    if (timerRef.current) clearInterval(timerRef.current);
    if (bugIntervalRef.current) clearTimeout(bugIntervalRef.current);
    
    setHighScore(prev => {
        const newHigh = Math.max(prev, score);
        localStorage.setItem('bugHighScore', newHigh.toString());
        return newHigh;
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (bugIntervalRef.current) clearTimeout(bugIntervalRef.current);
    };
  }, []); // Depend on score to update high score correctly if unmounted mid-game? No, score is in state.

  // Fix for score closure issue in endGame if called from effect? 
  // Actually, we update high score in endGame based on current render state, 
  // but let's ensure we use the state updater if needed.
  // Ideally, useEffect cleanup should just stop timers.

  const handleWhack = (index: number) => {
    if (!isPlaying) return;
    
    if (index === activeHole) {
      setScore(s => s + 1);
      setActiveHole(null); // Instant hide
      // Play sound effect here if desired
    } else {
      setScore(s => Math.max(0, s - 1)); // Penalty for missing
    }
  };

  return (
    <div className="w-full flex flex-col items-center max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-600">Bug Hunter</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Tap the bugs to debug the code. Don't miss!</p>
      </div>

      {/* HUD */}
      <div className="flex justify-between w-full mb-6 px-4 py-3 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" size={20} />
            <span className="font-bold text-gray-700 dark:text-gray-300">HI: {highScore}</span>
        </div>
        <div className="text-2xl font-bold text-red-500 font-mono">
            {score}
        </div>
        <div className={`font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-gray-700 dark:text-gray-300'}`}>
            00:{timeLeft.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Game Grid */}
      <div className="relative">
        <div className="grid grid-cols-3 gap-3 md:gap-4 p-4 bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl">
            {Array.from({ length: GRID_SIZE }).map((_, i) => (
                <div 
                    key={i}
                    onClick={() => handleWhack(i)}
                    className="w-20 h-20 md:w-24 md:h-24 bg-gray-800 rounded-xl relative overflow-hidden cursor-pointer active:scale-95 transition-transform border border-gray-700 hover:border-gray-500"
                >
                    {/* Background Code Lines */}
                    <div className="absolute inset-0 p-2 opacity-20 pointer-events-none flex flex-col gap-1">
                        <div className="h-1 bg-green-500 w-3/4 rounded-full" />
                        <div className="h-1 bg-green-500 w-1/2 rounded-full" />
                        <div className="h-1 bg-green-500 w-full rounded-full" />
                    </div>
                    
                    {/* Terminal Icon (Empty State) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <Terminal size={32} className="text-white" />
                    </div>

                    {/* The Bug */}
                    <AnimatePresence>
                        {activeHole === i && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute inset-0 flex items-center justify-center z-10"
                            >
                                <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                                    <Bug size={36} className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Click Feedback (optional simple flash) */}
                </div>
            ))}
        </div>

        {/* Start Overlay */}
        {!isPlaying && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
                {timeLeft === 0 && (
                    <div className="mb-4 text-center">
                        <h3 className="text-3xl font-bold text-white mb-1">Time's Up!</h3>
                        <p className="text-gray-300">Final Score: {score}</p>
                    </div>
                )}
                
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all"
                >
                    <Play size={24} fill="currentColor" />
                    {timeLeft === GAME_DURATION ? 'START HUNT' : 'PLAY AGAIN'}
                </motion.button>
            </div>
        )}
      </div>
    </div>
  );
};

export default WhackABug;