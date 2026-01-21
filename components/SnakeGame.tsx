import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Pause, Trophy, Zap } from 'lucide-react';
import { playSound } from '../services/audioService';

// Game Constants
const GRID_SIZE = 20;
const BASE_SPEED = 160;
const SPEED_STEP = 5;
const MAX_LEVEL = 20;
const POINTS_PER_LEVEL = 50;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  const directionRef = useRef<Direction>('UP');
  const gameLoopRef = useRef<number | null>(null);

  // Initialize high score from local storage
  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOnSnake;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (isOnSnake);
    return newFood;
  }, []);

  const resetGame = () => {
    playSound('start');
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setFood(generateFood([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]));
    setDirection('UP');
    directionRef.current = 'UP';
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setIsPaused(false);
    setHasStarted(true);
    setShowLevelUp(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !hasStarted || showLevelUp) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };

      switch (directionRef.current) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collision with walls
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        playSound('gameover');
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        playSound('gameover');
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        playSound('score');
        const nextScore = score + 10;
        setScore(nextScore);
        
        if (nextScore > highScore) {
          setHighScore(nextScore);
          localStorage.setItem('snakeHighScore', nextScore.toString());
        }

        // Check for Level Up
        const nextLevel = Math.floor(nextScore / POINTS_PER_LEVEL) + 1;
        if (nextLevel > level && nextLevel <= MAX_LEVEL) {
            setLevel(nextLevel);
            setShowLevelUp(true);
            playSound('win');
            setTimeout(() => setShowLevelUp(false), 1500);
        }

        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, hasStarted, generateFood, highScore, score, level, showLevelUp]);

  // Game Loop
  useEffect(() => {
    if (hasStarted && !gameOver && !isPaused && !showLevelUp) {
        const speed = Math.max(50, BASE_SPEED - (level - 1) * SPEED_STEP);
        gameLoopRef.current = window.setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, hasStarted, gameOver, isPaused, level, showLevelUp]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') changeDirection('UP');
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') changeDirection('LEFT');
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') changeDirection('RIGHT');
          break;
        case ' ':
            e.preventDefault();
            setIsPaused(prev => !prev);
            break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted]);

  const changeDirection = (newDir: Direction) => {
    setDirection(newDir);
    directionRef.current = newDir;
  };

  const progressToNextLevel = (score % POINTS_PER_LEVEL) / POINTS_PER_LEVEL;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
      {/* HUD Enhanced for Levels */}
      <div className="w-full mb-4 px-4 space-y-2">
        <div className="flex justify-between items-end">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-tighter">
                    <Trophy size={14} className="text-yellow-500" /> High Score
                </div>
                <div className="text-xl font-bold text-yellow-500 font-mono">{highScore.toString().padStart(4, '0')}</div>
            </div>
            
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-1">
                    <Zap size={12} className="text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-cyan-400 tracking-widest">LEVEL {level.toString().padStart(2, '0')}</span>
                </div>
                <div className="text-3xl font-bold text-white font-mono leading-none tracking-tighter">
                    {score.toString().padStart(4, '0')}
                </div>
            </div>

            <div className="flex flex-col items-end">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Progression</div>
                <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden border border-white/5 mt-1">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToNextLevel * 100}%` }}
                        className="h-full bg-gradient-to-r from-cyan-600 to-purple-500"
                    />
                </div>
            </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative p-1 bg-gray-800 rounded-lg shadow-[0_0_40px_rgba(6,182,212,0.2)] border border-white/10">
        <div 
            className="grid bg-black/95 rounded-md overflow-hidden relative"
            style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                width: 'min(85vw, 400px)',
                height: 'min(85vw, 400px)',
            }}
        >
            {/* Smooth Grid Background */}
            <div 
                className="absolute inset-0 pointer-events-none transition-all duration-700 overflow-hidden"
                style={{ 
                  backgroundImage: `
                    linear-gradient(to right, rgba(6, 182, 212, ${0.05 + level * 0.01}) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(6, 182, 212, ${0.05 + level * 0.01}) 1px, transparent 1px)
                  `,
                  backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`,
                }}
            >
                {/* Subtle scanning glow effect */}
                <motion.div 
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none"
                />
            </div>

            {/* Snake & Food Rendering */}
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                const x = i % GRID_SIZE;
                const y = Math.floor(i / GRID_SIZE);
                
                const isFood = food.x === x && food.y === y;
                const snakeIndex = snake.findIndex(s => s.x === x && s.y === y);
                const isSnake = snakeIndex !== -1;
                const isHead = snakeIndex === 0;

                if (!isSnake && !isFood) return <div key={i} />;

                return (
                    <div key={i} className="relative w-full h-full">
                        {isSnake && (
                            <motion.div 
                                initial={isHead ? { scale: 1.2 } : { scale: 1 }}
                                animate={{ scale: 1 }}
                                className={`absolute inset-0 m-[1px] rounded-sm shadow-sm transition-colors duration-500 ${isHead ? 'bg-white shadow-[0_0_12px_#fff] z-10' : level > 10 ? 'bg-purple-500 shadow-[0_0_8px_#a855f7]' : 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]'}`}
                            />
                        )}
                        {isFood && (
                            <motion.div 
                                animate={{ 
                                    scale: [0.8, 1.2, 0.8],
                                    rotate: [0, 90, 0]
                                }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute inset-0 m-[2px] rounded-full bg-pink-500 shadow-[0_0_15px_#ec4899]"
                            />
                        )}
                    </div>
                );
            })}
        </div>

        {/* Overlays with AnimatePresence */}
        <AnimatePresence>
        {(!hasStarted || gameOver || isPaused || showLevelUp) && (
            <motion.div 
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20 rounded-lg overflow-hidden"
            >
                {showLevelUp && (
                    <motion.div
                        initial={{ scale: 0.5, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="text-center"
                    >
                        <motion.div 
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            className="text-6xl mb-4"
                        >
                            🚀
                        </motion.div>
                        <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">LEVEL UP</h3>
                        <p className="text-white font-mono text-xl">Entering Sector {level.toString().padStart(2, '0')}</p>
                    </motion.div>
                )}

                {!hasStarted && !showLevelUp && (
                     <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={resetGame}
                        className="flex flex-col items-center gap-4 text-cyan-400"
                    >
                        <div className="w-20 h-20 rounded-full border-4 border-cyan-500/30 flex items-center justify-center bg-cyan-500/10">
                            <Play size={40} className="fill-cyan-400/20 translate-x-1" />
                        </div>
                        <span className="font-black text-2xl tracking-[0.2em]">INITIALIZE</span>
                    </motion.button>
                )}

                {gameOver && !showLevelUp && (
                    <div className="text-center p-8 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-xl">
                        <h3 className="text-red-500 text-4xl font-black mb-2 italic">GAME OVER</h3>
                        <div className="space-y-1 mb-8">
                            <p className="text-gray-400 uppercase text-[10px] tracking-widest font-bold">Final Data Log</p>
                            <div className="flex justify-center gap-8">
                                <div>
                                    <div className="text-gray-500 text-xs">Score</div>
                                    <div className="text-2xl font-bold text-white font-mono">{score}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-xs">Level</div>
                                    <div className="text-2xl font-bold text-cyan-400 font-mono">{level}</div>
                                </div>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetGame}
                            className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-black text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors"
                        >
                            <RotateCcw size={18} /> REBOOT SYSTEM
                        </motion.button>
                    </div>
                )}

                {isPaused && !gameOver && hasStarted && !showLevelUp && (
                     <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="flex gap-2">
                             <div className="w-3 h-10 bg-yellow-500 rounded-full animate-pulse" />
                             <div className="w-3 h-10 bg-yellow-500 rounded-full animate-pulse [animation-delay:0.2s]" />
                        </div>
                        <span className="font-black text-2xl text-yellow-400 tracking-[0.3em]">HALTED</span>
                        <button 
                            onClick={() => setIsPaused(false)} 
                            className="px-8 py-2 border-2 border-yellow-400/50 text-yellow-400 rounded-full font-bold hover:bg-yellow-400 hover:text-black transition-all"
                        >
                            RESUME
                        </button>
                    </motion.div>
                )}
            </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Controls (Mobile Friendly) */}
      <div className="mt-8 grid grid-cols-3 gap-3 md:gap-4 max-w-[280px]">
        <div />
        <button 
            className="p-5 bg-white/5 rounded-2xl hover:bg-cyan-500/20 active:bg-cyan-500/40 transition-colors border border-white/5"
            onPointerDown={(e) => { e.preventDefault(); if (directionRef.current !== 'DOWN') changeDirection('UP'); }}
        >
            <ChevronUp size={28} />
        </button>
        <div />
        
        <button 
            className="p-5 bg-white/5 rounded-2xl hover:bg-cyan-500/20 active:bg-cyan-500/40 transition-colors border border-white/5"
            onPointerDown={(e) => { e.preventDefault(); if (directionRef.current !== 'RIGHT') changeDirection('LEFT'); }}
        >
            <ChevronLeft size={28} />
        </button>
        <button 
             className="p-5 bg-white/5 rounded-2xl hover:bg-purple-500/20 active:bg-purple-500/40 transition-colors border border-white/5 flex items-center justify-center"
             onClick={() => hasStarted && !gameOver && setIsPaused(p => !p)}
        >
            {isPaused ? <Play size={24} className="fill-current" /> : <Pause size={24} className="fill-current" />}
        </button>
        <button 
            className="p-5 bg-white/5 rounded-2xl hover:bg-cyan-500/20 active:bg-cyan-500/40 transition-colors border border-white/5"
            onPointerDown={(e) => { e.preventDefault(); if (directionRef.current !== 'LEFT') changeDirection('RIGHT'); }}
        >
            <ChevronRight size={28} />
        </button>

        <div />
        <button 
            className="p-5 bg-white/5 rounded-2xl hover:bg-cyan-500/20 active:bg-cyan-500/40 transition-colors border border-white/5"
            onPointerDown={(e) => { e.preventDefault(); if (directionRef.current !== 'UP') changeDirection('DOWN'); }}
        >
            <ChevronDown size={28} />
        </button>
        <div />
      </div>

      <div className="mt-6 flex gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        <span>Arrow Keys to move</span>
        <span className="w-1 h-1 rounded-full bg-gray-700 self-center" />
        <span>Space to Pause</span>
      </div>
    </div>
  );
};

export default SnakeGame;