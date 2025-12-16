import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Project } from '../types';
import { ArrowRight, Activity, Layers, Github } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative h-[500px] w-full rounded-[24px] p-6 cursor-pointer group shadow-2xl hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.6)] transition-shadow duration-300 overflow-hidden bg-gray-900 border border-white/10`}
    >
      {/* Background Image Layer */}
      {project.imageUrl && (
        <div className="absolute inset-0 z-0">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" 
          />
        </div>
      )}

      {/* Gradient Overlay for Tinting */}
      <div className={`absolute inset-0 z-0 opacity-90 mix-blend-multiply ${project.bgGradient}`} />
      
      {/* Dark Gradient from Bottom for Text Readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/20 to-black/95 opacity-90" />

      {/* Decorative Noise Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="flex flex-col h-full relative z-10 justify-between">
        
        {/* Header: Icon & Actions */}
        <div className="flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:bg-white/20 transition-colors">
                <Layers size={28} className="text-white" />
            </div>
            
            <div className="flex gap-2">
                {project.repoUrl && (
                    <a 
                        href={project.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 border border-white/10 backdrop-blur-md hover:bg-white/20 transition-colors text-white z-20"
                        title="View Source Code"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <Github size={16} />
                    </a>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors group/btn">
                    <span className="text-xs font-semibold text-white/90">View</span>
                    <ArrowRight size={14} className="text-white group-hover/btn:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>

        {/* Middle Content: Title & Subtitle */}
        <div className="mt-auto mb-8 pl-1">
            <motion.h3 style={{ transform: "translateZ(40px)" }} className="text-4xl font-bold text-white mb-3 leading-tight tracking-tight">
                {project.title}
            </motion.h3>
            <motion.p style={{ transform: "translateZ(30px)" }} className="text-gray-200 font-medium text-sm max-w-[95%] leading-relaxed">
                {project.subtitle}
            </motion.p>
        </div>

        {/* Footer: Tags & Metric */}
        <div style={{ transform: "translateZ(30px)" }} className="pt-5 border-t border-white/10 flex items-end justify-between gap-4">
            
            {/* Tags - Pill shape with border */}
            <div className="flex flex-wrap gap-2 flex-1 content-end">
                {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-[11px] font-bold text-gray-200 group-hover:border-white/40 transition-colors tracking-wide">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Metric */}
            <div className="text-right shrink-0 flex flex-col items-end justify-end h-full">
                 <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider flex items-center justify-end gap-1.5 mb-1.5">
                    <Activity size={12} className="text-cyan-400" /> Metric
                 </p>
                 <div className="text-lg font-bold text-white leading-tight max-w-[120px]">
                    {project.metric}
                 </div>
            </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ProjectCard;