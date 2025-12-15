import React, { useEffect, useRef } from 'react';

const LightningEffect: React.FC = () => {
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
      if (Math.random() < 0.01) { // 1% chance per frame
        createBolt();
      }

      bolts.forEach((bolt, index) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(100, 200, 255, ${bolt.opacity})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
        
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
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-50 mix-blend-screen"
      style={{ filter: 'blur(0.5px)' }}
    />
  );
};

export default LightningEffect;