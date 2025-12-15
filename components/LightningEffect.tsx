import React, { useEffect, useRef } from 'react';

interface LightningEffectProps {
  theme: 'dark' | 'light';
}

const LightningEffect: React.FC<LightningEffectProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    interface Bolt {
      segments: {x: number, y: number}[];
      opacity: number;
    }

    let bolts: Bolt[] = [];

    const createBolt = () => {
      const startX = Math.random() * w;
      const startY = 0;
      let x = startX;
      let y = startY;
      const segments = [{x, y}];
      
      while (y < h) {
        x += (Math.random() - 0.5) * 50; // Zigzag amount
        y += Math.random() * 20 + 10;
        segments.push({x, y});
      }
      
      bolts.push({ segments, opacity: 1 });
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      // Random chance to spawn a bolt
      if (Math.random() < 0.015) { // 1.5% chance per frame
        createBolt();
      }

      bolts.forEach((bolt) => {
        ctx.beginPath();
        // Adjust color based on theme
        if (theme === 'dark') {
            ctx.strokeStyle = `rgba(100, 200, 255, ${bolt.opacity})`;
            ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
            ctx.shadowBlur = 15;
        } else {
            // Darker bolts for light mode
            ctx.strokeStyle = `rgba(100, 50, 255, ${bolt.opacity})`; 
            ctx.shadowColor = 'rgba(140, 0, 255, 0.5)';
            ctx.shadowBlur = 10;
        }
        
        ctx.lineWidth = 2;
        
        ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
        for (let i = 1; i < bolt.segments.length; i++) {
          ctx.lineTo(bolt.segments[i].x, bolt.segments[i].y);
        }
        ctx.stroke();

        bolt.opacity -= 0.05; // Fade out
      });

      // Remove faded bolts
      bolts = bolts.filter(b => b.opacity > 0);

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [theme]); // Re-run effect when theme changes

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-50"
      // Use normal blend mode for visibility in both themes, specific blending handled by colors
      style={{ filter: 'blur(0.5px)' }}
    />
  );
};

export default LightningEffect;