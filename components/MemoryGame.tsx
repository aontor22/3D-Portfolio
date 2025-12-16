import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Atom, Database, Server, Cpu, Globe, Wifi, Lock, Code, RefreshCw, CheckCircle2, Trophy } from 'lucide-react';

// Card configuration
const ICONS = [Atom, Database, Server, Cpu, Globe, Wifi, Lock, Code];

interface Card {
  id: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bestScore, setBestScore] = useState<number>(0);

  // Initialize Game & Load Score
  useEffect(() => {
    const savedScore = localStorage.getItem('memoryBestScore');
    if (savedScore) setBestScore(parseInt(savedScore));
    startNewGame();
  }, []);

  // Watch for Win Condition to save Score
  useEffect(() => {
    if (gameWon) {
        if (bestScore === 0 || moves < bestScore) {
            setBestScore(moves);
            localStorage.setItem('memoryBestScore', moves.toString());
        }
    }
  }, [gameWon, moves, bestScore]);

  const startNewGame = () => {
    // Create pairs
    const initialCards: Card[] = [];
    ICONS.forEach((_, index) => {
      initialCards.push({ id: index * 2, iconIndex: index, isFlipped: false, isMatched: false });
      initialCards.push({ id: index * 2 + 1, iconIndex: index, isFlipped: false, isMatched: false });
    });

    // Shuffle
    initialCards.sort(() => Math.random() - 0.5);
    
    setCards(initialCards);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
    setIsProcessing(false);
  };

  const handleCardClick = (id: number) => {
    // Block clicks if processing logic, card already flipped, or card matched
    if (isProcessing || flippedCards.includes(id) || cards.find(c => c.id === id)?.isMatched) return;

    const newCards = [...cards];
    const cardIndex = newCards.findIndex(c => c.id === id);
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsProcessing(true);
      checkForMatch(newFlipped, newCards);
    }
  };

  const checkForMatch = (currentFlipped: number[], currentCards: Card[]) => {
    const card1 = currentCards.find(c => c.id === currentFlipped[0]);
    const card2 = currentCards.find(c => c.id === currentFlipped[1]);

    if (card1 && card2 && card1.iconIndex === card2.iconIndex) {
      // Match found
      setTimeout(() => {
        setCards(prev => prev.map(c => 
          currentFlipped.includes(c.id) ? { ...c, isMatched: true, isFlipped: true } : c
        ));
        setFlippedCards([]);
        setIsProcessing(false);
        
        // Check win condition
        if (currentCards.filter(c => !c.isMatched).length <= 2) { 
             setGameWon(true);
        }
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        setCards(prev => prev.map(c => 
          currentFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
        ));
        setFlippedCards([]);
        setIsProcessing(false);
      }, 1000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">System Restore</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Match the data blocks to restore the system.</p>
        <div className="flex gap-6 mt-2 justify-center font-mono text-sm">
            <div className="text-cyan-600 dark:text-cyan-400 font-semibold">Moves: {moves}</div>
            <div className="text-yellow-600 dark:text-yellow-400 font-bold flex items-center gap-1">
                 <Trophy size={14} /> Best: {bestScore === 0 ? '-' : bestScore}
            </div>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-4 gap-3 md:gap-4 p-4 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
            {cards.map((card) => {
            const Icon = ICONS[card.iconIndex];
            return (
                <div 
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className="w-16 h-16 md:w-20 md:h-20 perspective-1000 cursor-pointer"
                >
                <motion.div
                    className="w-full h-full relative preserve-3d transition-all duration-500"
                    animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                >
                    {/* Front (Hidden) */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-800 to-black rounded-xl border border-white/10 flex items-center justify-center shadow-lg group hover:border-cyan-500/50">
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-600 group-hover:border-cyan-500/50 transition-colors" />
                    </div>

                    {/* Back (Revealed) */}
                    <div 
                        className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl border flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.2)]
                        ${card.isMatched 
                            ? 'bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                            : 'bg-gradient-to-br from-blue-600 to-cyan-600 border-cyan-400 text-white'
                        }`}
                    >
                        <Icon size={32} />
                    </div>
                </motion.div>
                </div>
            );
            })}
        </div>

        {/* Win Overlay */}
        {gameWon && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl"
            >
                <CheckCircle2 size={64} className="text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">System Restored!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Completed in {moves} moves</p>
                <button 
                    onClick={startNewGame}
                    className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-semibold transition-all shadow-lg"
                >
                    <RefreshCw size={18} /> Play Again
                </button>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default MemoryGame;