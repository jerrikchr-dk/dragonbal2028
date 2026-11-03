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

export const DragonCanvas: React.FC<{ burstTrigger: number; paused?: boolean }> = ({
  burstTrigger,
  paused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const burstRef = useRef<(() => void) | null>(null);
  const lastBurstRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let rafId: number | null = null;
    let active = false;
    let disposed = false;
    let trackingPointer = false;

    const canAnimate = () => !disposed && !paused && !reducedMotion.matches && !document.hidden;
    const isPhone = () => canvas.width <= 640;
    const clear = () => {
      particlesRef.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    const seed = () => {
      const initialCount = Math.min(isPhone() ? 10 : 55, Math.floor(canvas.width / (isPhone() ? 48 : 24)));
      particlesRef.current = Array.from({ length: initialCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.35 - Math.random() * 0.65,
        size: 1.8 + Math.random() * 3.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.25 + Math.random() * 0.55,
        life: Math.random() * 100,
        maxLife: 200 + Math.random() * 200,
        type: Math.random() > 0.7 ? 'orb' : 'ember',
      }));
    };
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (active) seed();
    };
    resize();

    const onPointerMove = (event: PointerEvent) => {
      if (!canAnimate() || !finePointer.matches || event.pointerType !== 'mouse') return;
      if (particlesRef.current.length > (isPhone() ? 80 : 180)) return;
      for (let i = 0; i < 2; i++) {
        particlesRef.current.push({
          x: event.clientX + (Math.random() - 0.5) * 14,
          y: event.clientY + (Math.random() - 0.5) * 14,
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
    const syncPointer = () => {
      const shouldTrack = active && canAnimate() && finePointer.matches;
      if (shouldTrack === trackingPointer) return;
      trackingPointer = shouldTrack;
      if (shouldTrack) {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
      } else {
        window.removeEventListener('pointermove', onPointerMove);
      }
    };
    const stop = () => {
      active = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      syncPointer();
      clear();
    };

    const render = () => {
      rafId = null;
      if (!canAnimate()) {
        stop();
        return;
      }
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
    const syncAnimation = () => {
      if (!canAnimate()) {
        stop();
        return;
      }
      if (!active) {
        active = true;
        seed();
        rafId = requestAnimationFrame(render);
      }
      syncPointer();
    };

    burstRef.current = () => {
      if (!canAnimate() || !active) return;
      const count = isPhone() ? 36 : 85;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = 2.5 + Math.random() * 8.5;
        particlesRef.current.push({
          x: canvas.width / 2,
          y: canvas.height * 0.45,
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
    };

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', syncAnimation);
    reducedMotion.addEventListener('change', syncAnimation);
    finePointer.addEventListener('change', syncPointer);
    syncAnimation();

    return () => {
      disposed = true;
      stop();
      burstRef.current = null;
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', syncAnimation);
      reducedMotion.removeEventListener('change', syncAnimation);
      finePointer.removeEventListener('change', syncPointer);
    };
  }, [paused]);

  useEffect(() => {
    if (burstTrigger === lastBurstRef.current) return;
    lastBurstRef.current = burstTrigger;
    if (burstTrigger !== 0) burstRef.current?.();
  }, [burstTrigger]);

  return <canvas ref={canvasRef} className="dragon-particle-canvas" aria-hidden="true" />;
};
