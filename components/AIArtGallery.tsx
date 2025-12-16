import React, { useState } from 'react';
import { generateFuturisticImage } from '../services/geminiService';
import { Sparkles, Image as ImageIcon, RefreshCw, Download, Palette, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRESETS = [
  { label: 'Cyberpunk City', prompt: 'A futuristic cyberpunk city with neon lights, flying cars, rain, high detail, 4k' },
  { label: 'Digital Mind', prompt: 'Abstract representation of a digital brain, glowing neural networks, blue and purple particles, 3d render' },
  { label: 'Synthwave Sunset', prompt: 'Retro synthwave landscape, grid floor, giant sun, mountains, pink and cyan color palette' },
  { label: 'Robot Portrait', prompt: 'Portrait of a high-tech android, intricate mechanical details, glowing eyes, studio lighting' }
];

const AIArtGallery: React.FC = () => {
  const [prompt, setPrompt] = useState(PRESETS[0].prompt);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    setImage(null);
    
    try {
      const result = await generateFuturisticImage(prompt);
      if (result) {
        setImage(result);
      } else {
        setError("Failed to generate visual. The neural link is unstable.");
      }
    } catch (err) {
      setError("An unexpected error occurred in the generation matrix.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = `udoy-ai-art-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="grid lg:grid-cols-5 gap-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 overflow-hidden relative shadow-2xl">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -z-10" />

        {/* Controls Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6 relative z-10">
           <div>
             <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
               <Palette className="text-pink-500" />
               Studio Controls
             </h3>
             <p className="text-gray-400 text-sm">Craft your vision or choose a preset style.</p>
           </div>

           <div className="space-y-3">
             <label className="text-sm font-semibold text-gray-300">Quick Presets</label>
             <div className="grid grid-cols-2 gap-2">
               {PRESETS.map((preset) => (
                 <button
                   key={preset.label}
                   onClick={() => setPrompt(preset.prompt)}
                   className="px-3 py-2 text-xs md:text-sm bg-black/20 hover:bg-white/10 border border-white/5 hover:border-cyan-500/50 rounded-lg text-left text-gray-300 transition-all flex items-center gap-2"
                 >
                   <Zap size={12} className="text-cyan-500" />
                   {preset.label}
                 </button>
               ))}
             </div>
           </div>

           <div className="flex-1 flex flex-col gap-2">
             <label className="text-sm font-semibold text-gray-300">Custom Prompt</label>
             <textarea
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none font-mono"
               placeholder="Describe your futuristic vision..."
             />
           </div>

           <button
             onClick={handleGenerate}
             disabled={loading || !prompt}
             className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
           >
             {loading ? <RefreshCw className="animate-spin" /> : <Sparkles />}
             {loading ? 'Generating Visuals...' : 'Generate Artwork'}
           </button>
        </div>

        {/* Display Panel */}
        <div className="lg:col-span-3 flex items-center justify-center relative">
          <div className="w-full aspect-square md:aspect-[4/3] bg-black/40 rounded-2xl border-2 border-white/5 relative overflow-hidden flex items-center justify-center group">
            
            {/* Loading State */}
            <AnimatePresence>
                {loading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
                        <p className="text-cyan-400 font-mono text-sm animate-pulse">Rendering Neural Pixels...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            {image ? (
                <>
                    <img 
                        src={image} 
                        alt="Generated Art" 
                        className="w-full h-full object-cover shadow-inner"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                         <div className="text-white text-sm font-mono truncate max-w-[70%]">
                            {prompt}
                         </div>
                         <button 
                            onClick={handleDownload}
                            className="p-3 bg-white text-black rounded-full hover:bg-cyan-400 hover:text-white transition-colors shadow-lg"
                            title="Download Art"
                         >
                            <Download size={20} />
                         </button>
                    </div>
                </>
            ) : (
                <div className="text-center p-6 opacity-50">
                    <ImageIcon size={64} className="mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400">Ready to visualize.</p>
                    <p className="text-gray-600 text-sm mt-2">Enter a prompt or select a style to begin.</p>
                </div>
            )}
            
            {error && !loading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center">
                    <p className="text-red-400 font-mono">{error}</p>
                 </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIArtGallery;