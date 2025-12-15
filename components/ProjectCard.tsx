import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Project } from '../types';
import { Plus, ArrowRight, Activity } from 'lucide-react';

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
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative h-[500px] w-full rounded-[30px] p-8 cursor-pointer group shadow-2xl transition-colors duration-300 ${project.bgGradient}`}
    >
      {/* Decorative Grid/Noise Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />

      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="flex flex-col h-full justify-between relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-white/80 font-mono text-sm tracking-widest uppercase shadow-black drop-shadow-sm">Software Engineering</h3>
                <div className="h-0.5 w-8 bg-white/50 mt-1" />
            </div>
            <div className="flex items-center gap-2 text-white/90 font-mono text-sm">
                <span className="drop-shadow-md">View Code</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs backdrop-blur-sm">
                    <ArrowRight size={12} />
                </div>
            </div>
        </div>

        {/* Floating Image */}
        <motion.div 
            style={{ 
                transform: "translateZ(60px)",
                filter: "drop-shadow(0px 20px 30px rgba(0,0,0,0.5))"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-auto flex justify-center"
        >
            <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full max-w-[300px] h-[250px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-105 border-4 border-white/10"
            />
        </motion.div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-auto" style={{ transform: "translateZ(30px)" }}>
            <div className="max-w-[70%]">
                <h4 className="text-3xl font-bold text-white leading-none mb-1 shadow-black drop-shadow-md">{project.title}</h4>
                <p className="text-white/80 text-sm font-medium leading-tight drop-shadow-md">{project.subtitle}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                    {project.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-white font-semibold shadow-sm">{tag}</span>
                    ))}
                </div>
            </div>
            <div className="text-right">
                <p className="text-white/80 text-xs mb-1 flex items-center justify-end gap-1 drop-shadow-md">
                    <Activity size={12} /> Impact
                </p>
                <p className="text-xl font-bold text-white drop-shadow-md">{project.metric}</p>
                <button className="mt-2 w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all backdrop-blur-md border border-white/20 ml-auto shadow-lg">
                    <Plus size={20} />
                </button>
            </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ProjectCard;