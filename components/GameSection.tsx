import React, { useState } from 'react';
import { generateTriviaQuestion, checkTriviaAnswer } from '../services/geminiService';
import { Brain, Sparkles, Send, RefreshCw, Loader2, Gamepad2, Grid3X3, Bug } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SnakeGame from './SnakeGame';
import MemoryGame from './MemoryGame';
import WhackABug from './WhackABug';
import { playSound } from '../services/audioService';

const GameSection: React.FC = () => {
  const [gameMode, setGameMode] = useState<'trivia' | 'snake' | 'memory' | 'whack'>('snake');
  
  // Trivia State
  const [question, setQuestion] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; feedback: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('Web Development');

  const topics = ['React', 'JavaScript', 'CSS', 'AI History', 'Video Games'];

  const tabs = [
    { id: 'snake', icon: Gamepad2, label: 'Snake', color: 'bg-cyan-600 shadow-[0_0_15px_rgba(8,145,178,0.5)]' },
    { id: 'memory', icon: Grid3X3, label: 'Memory', color: 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' },
    { id: 'whack', icon: Bug, label: 'Bug Hunter', color: 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]' },
    { id: 'trivia', icon: Brain, label: 'Trivia', color: 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]' },
  ] as const;

  const startGame = async () => {
    setLoading(true);
    setFeedback(null);
    setUserAnswer('');
    playSound('start');
    const q = await generateTriviaQuestion(topic);
    setQuestion(q);
    setLoading(false);
  };

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !userAnswer) return;
    setLoading(true);
    const result = await checkTriviaAnswer(question, userAnswer);
    setFeedback(result);
    setLoading(false);
    
    if (result.correct) {
      playSound('win');
    } else {
      playSound('wrong');
    }
  };

  const renderGame = () => {
    switch (gameMode) {
        case 'snake':
            return <SnakeGame />;
        case 'memory':
            return <MemoryGame />;
        case 'whack':
            return <WhackABug />;
        case 'trivia':
            return (
                <div className="w-full flex-1 flex flex-col">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600">Neural Trivia</h2>
                        <p className="text-gray-600 dark:text-gray-400">Test your knowledge against the AI.</p>
                    </div>

                    {!question ? (
                    <div className="flex flex-col items-center gap-4 my-auto">
                        <label className="text-sm text-gray-500 dark:text-gray-300">Choose a topic:</label>
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {topics.map((t) => (
                            <button
                            key={t}
                            onClick={() => setTopic(t)}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${
                                topic === t
                                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
                            }`}
                            >
                            {t}
                            </button>
                        ))}
                        </div>
                        <button
                        onClick={startGame}
                        disabled={loading}
                        className="group px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full font-bold text-white shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-105"
                        >
                        {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                        Start Challenge
                        </button>
                    </div>
                    ) : (
                    <div className="w-full max-w-lg mx-auto my-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-6 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10"
                        >
                        <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-300 mb-2">Question:</h3>
                        <p className="text-lg text-gray-800 dark:text-white">{question}</p>
                        </motion.div>

                        {!feedback ? (
                        <form onSubmit={submitAnswer} className="relative">
                            <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Type your answer..."
                            className="w-full px-6 py-4 rounded-full bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all pr-12"
                            autoFocus
                            />
                            <button
                            type="submit"
                            disabled={loading || !userAnswer.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-500 disabled:opacity-50 transition-colors"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                            </button>
                        </form>
                        ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`p-6 rounded-xl border ${
                            feedback.correct ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                            }`}
                        >
                            <div className={`text-2xl font-bold mb-2 ${feedback.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {feedback.correct ? 'Correct!' : 'Incorrect'}
                            </div>
                            <p className="text-gray-700 dark:text-gray-200 mb-6">{feedback.feedback}</p>
                            <button
                            onClick={startGame}
                            className="px-6 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-lg text-gray-800 dark:text-white transition-colors flex items-center gap-2 mx-auto"
                            >
                            <RefreshCw size={16} /> Play Again
                            </button>
                        </motion.div>
                        )}
                    </div>
                    )}
                </div>
            );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-1 rounded-3xl bg-gradient-to-b from-purple-500/20 to-blue-600/10 backdrop-blur-md border border-white/10 dark:border-white/10 border-gray-200 relative overflow-hidden shadow-xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 bg-white/80 dark:bg-[#0a0a0a]/80 rounded-[22px] p-6 md:p-8 min-h-[600px] flex flex-col transition-colors duration-300">
            
            {/* Game Switcher - Animated Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 bg-black/5 dark:bg-black/40 p-2 rounded-2xl w-full md:w-fit mx-auto border border-black/5 dark:border-white/10">
                {tabs.map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setGameMode(tab.id as any)}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 outline-none ${
                            gameMode === tab.id ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        {gameMode === tab.id && (
                            <motion.div
                                layoutId="activeGameTab"
                                className={`absolute inset-0 rounded-xl ${tab.color}`}
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <tab.icon size={16} /> 
                            <span className="hidden md:inline">{tab.label}</span>
                        </span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={gameMode}
                    initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex-1 flex flex-col items-center justify-center"
                >
                    {renderGame()}
                </motion.div>
            </AnimatePresence>
      </div>
    </div>
  );
};

export default GameSection;