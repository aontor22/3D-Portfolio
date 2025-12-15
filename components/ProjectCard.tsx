import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Project } from '../types';
import { Plus, ArrowRight, Activity, Layers } from 'lucide-react';

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
      className={`relative h-[450px] w-full rounded-[30px] p-8 cursor-pointer group shadow-2xl hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.6)] transition-shadow duration-300 overflow-hidden bg-gray-900`}
    >
      {/* Background Image Layer */}
      {project.imageUrl && (
        <div className="absolute inset-0 z-0">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70" 
          />
        </div>
      )}

      {/* Gradient Overlay for Tinting */}
      <div className={`absolute inset-0 z-0 opacity-80 mix-blend-multiply ${project.bgGradient}`} />

      {/* Dark Gradient from Bottom for Text Readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90" />

      {/* Decorative Grid/Noise Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="flex flex-col h-full justify-between relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-white/80 font-mono text-sm tracking-widest uppercase shadow-black drop-shadow-sm">Project</h3>
                <div className="h-0.5 w-8 bg-white/50 mt-1" />
            </div>
            <div className="flex items-center gap-2 text-white/90 font-mono text-sm">
                <span className="drop-shadow-md group-hover:underline decoration-white/50 underline-offset-4 transition-all">View Details</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-colors">
                    <ArrowRight size={14} />
                </div>
            </div>
        </div>

        {/* Abstract Centerpiece */}
        <motion.div 
            style={{ 
                transform: "translateZ(60px)",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center justify-center text-center"
        >
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500">
                <Layers size={40} className="text-white opacity-90" />
            </div>
            <h4 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-lg tracking-tight leading-tight">
                {project.title}
            </h4>
        </motion.div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-auto" style={{ transform: "translateZ(30px)" }}>
            <div className="max-w-[70%]">
                <p className="text-white/90 text-sm font-medium leading-tight drop-shadow-md mb-3">{project.subtitle}</p>
                <div className="flex gap-2 flex-wrap">
                    {project.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white font-semibold border border-white/20 shadow-sm">{tag}</span>
                    ))}
                </div>
            </div>
            <div className="text-right">
                <p className="text-white/80 text-xs mb-1 flex items-center justify-end gap-1 drop-shadow-md">
                    <Activity size={12} /> Metric
                </p>
                <p className="text-xl font-bold text-white drop-shadow-md font-mono">{project.metric}</p>
            </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ProjectCard;