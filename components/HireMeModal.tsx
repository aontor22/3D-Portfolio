import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Mail, Calendar, X, Check, Copy, Briefcase, Download, ChevronRight } from 'lucide-react';

const HireMeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const email = "udoychowdhury90413@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.05, translateY: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[70] group"
      >
        <div className="relative px-6 py-3 md:px-7 md:py-4 bg-gray-900/90 dark:bg-black/90 backdrop-blur-md text-white rounded-full font-bold shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/10 flex items-center gap-3 overflow-hidden">
            
            {/* Gradient Background Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Status Indicator */}
            <div className="relative z-10 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>

            <span className="relative z-10 flex items-center gap-2 font-mono text-sm md:text-base tracking-wide">
              <Briefcase size={18} className="text-gray-300 group-hover:text-white transition-colors" />
              <span>HIRE ME</span>
            </span>
            
            {/* Shine Effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
        </div>
        
        {/* Glow Underneath */}
        <div className="absolute -inset-2 bg-cyan-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full -z-10" />
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
                >
                  <X size={18} />
                </button>
                
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Available for work
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Let's Build Something Great</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Specializing in high-performance frontend interfaces and automated quality assurance.
                    </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 bg-gray-50 dark:bg-[#0a0a0a]">
                
                {/* Resume Action */}
                <a 
                   href="/resume.pdf" 
                   download="Udoy_Chowdhury_Resume.pdf"
                   className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all group cursor-pointer"
                >
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Download Resume</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF Format • 2.4 MB</p>
                      </div>
                   </div>
                   <Download size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </a>

                {/* Email Action */}
                <div 
                   onClick={copyEmail}
                   className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/5 transition-all group cursor-pointer"
                >
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl group-hover:scale-110 transition-transform">
                        <Mail size={24} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Copy Email</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
                      </div>
                   </div>
                   {copied ? <Check size={18} className="text-green-500 scale-125 transition-transform" /> : <Copy size={18} className="text-gray-300 group-hover:text-green-500 transition-colors" />}
                </div>

                {/* Calendar Action */}
                <a 
                   href={`mailto:${email}?subject=Interview Request`}
                   className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5 transition-all group cursor-pointer"
                >
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                        <Calendar size={24} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Schedule Interview</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Direct via Email</p>
                      </div>
                   </div>
                   <ChevronRight size={18} className="text-gray-300 group-hover:text-purple-500 transition-colors" />
                </a>

              </div>
              
              <div className="p-4 bg-gray-100 dark:bg-black text-center border-t border-gray-200 dark:border-white/5">
                <p className="text-xs text-gray-500 font-medium">
                    Typically responds within 12 hours
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HireMeModal;