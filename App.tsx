import React, { useState, useEffect } from 'react';
import Scene3D from './components/Scene3D';
import ProjectCard from './components/ProjectCard';
import GameSection from './components/GameSection';
import AIChatbot from './components/AIChatbot';
import SkillsSection from './components/SkillsSection';
import LightningEffect from './components/LightningEffect';
import { Project } from './types';
import { motion } from 'framer-motion';
import { ChevronDown, Code, Palette, Cpu, Terminal, Mail, Linkedin, Github, Moon, Sun } from 'lucide-react';

const projects: Project[] = [
  {
    id: 1,
    title: "MediCraft",
    subtitle: "Full-Stack Medical Store & Prescription System",
    metric: "40% Faster Search",
    tags: ["React.js", "MongoDB", "Firebase"],
    imageUrl: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=1979", 
    bgGradient: "bg-gradient-to-br from-[#021B79] via-[#0575E6] to-[#021B79]"
  },
  {
    id: 2,
    title: "CRM System",
    subtitle: "Java Swing Desktop Application",
    metric: "10k+ Records",
    tags: ["Java", "SQL", "MVC"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070",
    bgGradient: "bg-gradient-to-br from-[#1A2980] via-[#26D0CE] to-[#1A2980]"
  },
  {
    id: 3,
    title: "Food Ordering",
    subtitle: "Full-Stack Restaurant Platform",
    metric: "50% Less Time",
    tags: ["Node.js", "React.js", "DaisyUI"],
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000",
    bgGradient: "bg-gradient-to-br from-[#DD2476] via-[#FF512F] to-[#DD2476]"
  },
  {
    id: 4,
    title: "POS System",
    subtitle: "Retail Point of Sale Interface",
    metric: "Real-time Sync",
    tags: ["React.js", "Tailwind", "Redux"],
    imageUrl: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=2000",
    bgGradient: "bg-gradient-to-br from-[#11998e] via-[#38ef7d] to-[#11998e]"
  }
];

const SectionTitle = ({ children, icon: Icon }: { children?: React.ReactNode, icon: any }) => (
    <div className="flex items-center gap-3 mb-12">
        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
            <Icon className="text-white" size={24} />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{children}</h2>
    </div>
);

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize Theme
  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030014] text-gray-900 dark:text-white transition-colors duration-300 selection:bg-cyan-500/30 selection:text-cyan-800 dark:selection:text-cyan-200">
      
      {/* Lightning Effect - Adapts to theme */}
      <LightningEffect theme={isDarkMode ? 'dark' : 'light'} />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-white/70 dark:bg-black/10 backdrop-blur-md border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
                <Terminal className="text-cyan-600 dark:text-cyan-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-500">
                    UDOY
                </span>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
                <a href="#about" className="hover:text-cyan-600 dark:hover:text-white transition-colors">About</a>
                <a href="#projects" className="hover:text-cyan-600 dark:hover:text-white transition-colors">Projects</a>
                <a href="#skills" className="hover:text-cyan-600 dark:hover:text-white transition-colors">Skills</a>
                <a href="#game" className="hover:text-cyan-600 dark:hover:text-white transition-colors text-cyan-600 dark:text-cyan-400">Playground</a>
            </div>
            <div className="flex gap-4 items-center">
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-yellow-500 dark:text-cyan-300 transition-colors shadow-sm"
                  aria-label="Toggle Theme"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <a href="https://github.com/aontor22" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                    <Github size={20} />
                </a>
                <a href="https://www.linkedin.com/in/udoy-chowdhury-a5434a37a" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white">
                    <Linkedin size={20} />
                </a>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Abstract Background Gradients */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 flex flex-col items-start"
            >
                <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-cyan-700 dark:text-cyan-400 border border-cyan-600/30 dark:border-cyan-400/30 rounded-full bg-cyan-100 dark:bg-cyan-400/10">
                    B.Sc in CSE • Green University
                </div>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-gray-900 dark:text-white">
                    Hello, I'm <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-500">Udoy Chowdhury</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
                    Full-Stack Engineer & QA Specialist. I transform complex problems into sleek, interactive, and high-performance digital experiences.
                </p>
                <div className="flex flex-wrap gap-4">
                    <a href="#projects" className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-cyan-500/30">
                        View Projects
                    </a>
                    <a href="mailto:udoychowdhury90413@gmail.com" className="px-8 py-3 border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white rounded-full font-semibold transition-all flex items-center gap-2">
                        <Mail size={18} /> Contact Me
                    </a>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative h-full"
            >
               <Scene3D />
            </motion.div>
        </div>

        <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 dark:text-gray-500"
        >
            <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 relative bg-white dark:bg-transparent transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
            <SectionTitle icon={Code}>Featured Projects</SectionTitle>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
                A selection of my professional work, ranging from healthcare platforms to high-performance desktop applications.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 bg-gray-50 dark:bg-gradient-to-b dark:from-[#030014] dark:to-[#0a051e] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <SectionTitle icon={Palette}>Technical Expertise</SectionTitle>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                    I combine solid software engineering principles with modern tech stacks. My experience spans full-stack development, automated testing, and machine learning integration.
                </p>
                <div className="space-y-4">
                    {[
                        'Full-Stack Development (React, Node, Mongo)', 
                        'Desktop Applications (Java Swing, SQL)', 
                        'Quality Assurance (Selenium, Postman)', 
                        'AI & Machine Learning (TensorFlow, OpenCV)'
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5 hover:border-cyan-500/50 transition-colors shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                            <span className="font-medium text-gray-800 dark:text-gray-200">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="h-full">
                <SkillsSection />
            </div>
        </div>
      </section>

      {/* Game Section */}
      <section id="game" className="py-24 relative overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center mb-12">
                <div className="p-3 bg-purple-600 rounded-lg shadow-lg mb-4">
                    <Cpu className="text-white" size={24} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">Interactive Zone</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-center max-w-xl">
                    Take a break from the code. Play a game or challenge the AI about my resume.
                </p>
            </div>
            <GameSection />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-black/40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-600 dark:text-gray-500 text-sm">
            <div className="mb-4 md:mb-0">
                <p className="text-gray-900 dark:text-white font-semibold text-lg">Udoy Chowdhury</p>
                <p>Frontend Engineer | QA Specialist</p>
                <p className="mt-2 text-cyan-600 dark:text-cyan-500">+880 1700 978 285</p>
            </div>
            
            <div className="flex gap-6">
                <a href="https://github.com/aontor22" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                    <Github size={16} /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/udoy-chowdhury-a5434a37a" className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-2">
                    <Linkedin size={16} /> LinkedIn
                </a>
                <a href="mailto:udoychowdhury90413@gmail.com" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                    <Mail size={16} /> Email
                </a>
            </div>
        </div>
        <div className="text-center mt-8 text-xs text-gray-500">
             &copy; {new Date().getFullYear()} Udoy Chowdhury. All rights reserved.
        </div>
      </footer>

      {/* Fixed Chatbot */}
      <AIChatbot />
    </div>
  );
};

export default App;