import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Skill } from '../types';

const skills: Skill[] = [
  { name: 'React.js', level: 90, category: 'Frontend' },
  { name: 'Java', level: 85, category: 'Backend' },
  { name: 'Testing', level: 90, category: 'AI' }, // Selenium, Manual
  { name: 'Node.js', level: 80, category: 'Backend' },
  { name: 'Python', level: 85, category: 'AI' },
  { name: 'SQL', level: 80, category: 'Backend' },
];

const SkillsSection: React.FC = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center relative">
       {/* Background circle decoration */}
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-[300px] h-[300px] border border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
           <div className="w-[450px] h-[450px] border border-purple-500/10 rounded-full absolute animate-[spin_15s_linear_infinite_reverse]" />
       </div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skills}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 14, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skills"
            dataKey="level"
            stroke="#06b6d4"
            strokeWidth={3}
            fill="#06b6d4"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsSection;