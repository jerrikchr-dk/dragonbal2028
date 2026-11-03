import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'ember' | 'orb' | 'burst';
}

const COLORS = ['#FACC15', '#F97316', '#EF4444', '#10B981', '#FDE047'];

export const DragonCanvas: React.FC<{ burstTrigger: number }> = ({ burstTrigger }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Trigger a celebratory burst of dragon fire when burstTrigger increments
  useEffect(() => {
    if (burstTrigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.45;
    for (let i = 0; i < 85; i++) {
      const angle = (Math.PI * 2 * i) / 85 + (Math.random() - 0.5) * 0.3;
      const speed = 2.5 + Math.random() * 8.5;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 3 + Math.random() * 6,
        color: COLORS[i % COLORS.length],
        alpha: 1,
        life: 0,
        maxLife: 50 + Math.random() * 45,
        type: 'burst',
      });
    }
  }, [burstTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Seed ambient Saigon night sky embers & lotus orbs
    const initialCount = Math.min(55, Math.floor(window.innerWidth / 24));
    particlesRef.current = Array.from({ length: initialCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -0.35 - Math.random() * 0.65,
      size: 1.8 + Math.random() * 3.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.25 + Math.random() * 0.55,
      life: Math.random() * 100,
      maxLife: 200 + Math.random() * 200,
      type: Math.random() > 0.7 ? 'orb' : 'ember',
    }));

    const onPointerMove = (e: MouseEvent) => {
      if (particlesRef.current.length > 180) return;
      for (let i = 0; i < 2; i++) {
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 14,
          y: e.clientY + (Math.random() - 0.5) * 14,
          vx: (Math.random() - 0.5) * 1.6,
          vy: -0.8 - Math.random() * 1.4,
          size: 2 + Math.random() * 3.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: 0.85,
          life: 0,
          maxLife: 34 + Math.random() * 24,
          type: 'burst',
        });
      }
    };
    window.addEventListener('mousemove', onPointerMove, { passive: true });

    let rafId = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const list = particlesRef.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;

        if (p.type === 'burst') {
          p.vy += 0.04; // subtle gravity arc after upward dragon breath
          p.vx *= 0.985;
          const progress = p.life / p.maxLife;
          p.alpha = Math.max(0, 1 - progress);
          if (p.life >= p.maxLife) {
            list.splice(i, 1);
            continue;
          }
        } else {
          // Ambient drifting embers
          p.x += Math.sin(p.life * 0.025 + i) * 0.22;
          if (p.y < -20) {
            p.y = canvas.height + 15;
            p.x = Math.random() * canvas.width;
          }
          if (p.x < -20) p.x = canvas.width + 15;
          if (p.x > canvas.width + 20) p.x = -15;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.type === 'orb' ? 14 : 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="dragon-particle-canvas" aria-hidden="true" />;
};
