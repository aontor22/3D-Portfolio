import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Pause, Trophy } from 'lucide-react';
import { playSound } from '../services/audioService';

// Game Constants
const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 80;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
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
    setIsPaused(false);
    setHasStarted(true);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !hasStarted) return;

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
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snakeHighScore', newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
        // Increase speed slightly
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, hasStarted, generateFood, highScore]);

  // Game Loop
  useEffect(() => {
    if (hasStarted && !gameOver && !isPaused) {
        const speed = Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(score / 50) * 10);
        gameLoopRef.current = window.setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, hasStarted, gameOver, isPaused, score]);

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

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
      {/* HUD */}
      <div className="flex justify-between w-full mb-4 px-4">
        <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" size={20} />
            <span className="text-yellow-500 font-bold">HI: {highScore}</span>
        </div>
        <div className="text-2xl font-bold text-cyan-400 font-mono tracking-widest">
            {score.toString().padStart(4, '0')}
        </div>
      </div>

      {/* Game Board */}
      <div className="relative p-1 bg-gray-800 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] border border-cyan-500/30">
        <div 
            className="grid bg-black/80 rounded-md overflow-hidden relative"
            style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                width: 'min(80vw, 400px)',
                height: 'min(80vw, 400px)',
            }}
        >
            {/* Grid Lines (Optional for retro feel) */}
            <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] pointer-events-none opacity-10">
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-cyan-500"></div>
                ))}
            </div>

            {/* Snake & Food */}
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                const x = i % GRID_SIZE;
                const y = Math.floor(i / GRID_SIZE);
                
                const isFood = food.x === x && food.y === y;
                const snakeIndex = snake.findIndex(s => s.x === x && s.y === y);
                const isSnake = snakeIndex !== -1;
                const isHead = snakeIndex === 0;

                return (
                    <div key={i} className="relative w-full h-full">
                        {isSnake && (
                            <motion.div 
                                initial={isHead ? { scale: 1.2 } : { scale: 1 }}
                                animate={{ scale: 1 }}
                                className={`absolute inset-0 m-[1px] rounded-sm ${isHead ? 'bg-white shadow-[0_0_10px_#fff] z-10' : 'bg-cyan-500 shadow-[0_0_5px_#06b6d4]'}`}
                            />
                        )}
                        {isFood && (
                            <motion.div 
                                animate={{ scale: [0.8, 1.1, 0.8] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="absolute inset-0 m-[2px] rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"
                            />
                        )}
                    </div>
                );
            })}
        </div>

        {/* Overlays */}
        <AnimatePresence>
        {(!hasStarted || gameOver || isPaused) && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-lg"
            >
                {!hasStarted && (
                     <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={resetGame}
                        className="flex flex-col items-center gap-2 text-cyan-400"
                    >
                        <Play size={48} className="fill-cyan-400/20" />
                        <span className="font-bold text-xl tracking-widest">START GAME</span>
                    </motion.button>
                )}
                {gameOver && (
                    <div className="text-center">
                        <h3 className="text-red-500 text-3xl font-bold mb-4">GAME OVER</h3>
                        <p className="text-gray-300 mb-6">Score: {score}</p>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={resetGame}
                            className="flex items-center gap-2 px-6 py-3 bg-cyan-600 rounded-full text-white font-bold"
                        >
                            <RotateCcw size={20} /> TRY AGAIN
                        </motion.button>
                    </div>
                )}
                {isPaused && !gameOver && hasStarted && (
                     <div className="flex flex-col items-center gap-2 text-yellow-400">
                        <Pause size={48} className="fill-yellow-400/20" />
                        <span className="font-bold text-xl tracking-widest">PAUSED</span>
                        <button onClick={() => setIsPaused(false)} className="mt-4 px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20">Resume</button>
                    </div>
                )}
            </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Controls (Mobile Friendly) */}
      <div className="mt-6 grid grid-cols-3 gap-2 md:gap-4">
        <div />
        <button 
            className="p-4 bg-white/5 rounded-xl hover:bg-cyan-500/20 active:bg-cyan-500/40 transition-colors"
            onPointerDown={(e) => { e.preventDefault(); if (directionRef.current !== 'DOWN') changeDirection('UP'); }}
        >
            <ChevronUp size={24} />
        </button>
        <div />
        
        <button 
            className="p-4 bg-white/5 rounded-xl hover:bg-cyan-500/20 active:bg-cyan-500/40 transition-colors"
            onPointerDown={(e) => { e.preventDefault(); if (directionRef.current !== 'RIGHT') changeDirection('LEFT'); }}
        >
            <ChevronLeft size={24} />
        </button>
        <button 
             className="p-4 bg-white/5 rounded-xl hover:bg-purple-500/20 active:bg-purple-500/40 transition-colors"
             onClick={() => hasStarted && !gameOver && setIsPaused(p => !p)}
        >
            {isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>
        <button 
            className="p-4 bg-white/5 rounded-xl hover:bg-cyan-500/20 active:bg-cyan-500/40 transition-colors"
            onPointerDown={(e) => { e.preventDefault(); if (directionRef.current !== 'LEFT') changeDirection('RIGHT'); }}
        >
            <ChevronRight size={24} />
        </button>

        <div />
        <button 
            className="p-4 bg-white/5 rounded-xl hover:bg-cyan-500/20 active:bg-cyan-500/40 transition-colors"
            onPointerDown={(e) => { e.preventDefault(); if (directionRef.current !== 'UP') changeDirection('DOWN'); }}
        >
            <ChevronDown size={24} />
        </button>
        <div />
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Use Arrow Keys to move • Space to Pause
      </div>
    </div>
  );
};

export default SnakeGame;