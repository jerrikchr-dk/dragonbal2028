import React, { useEffect, useId, useRef, useState } from 'react';
import { DongSonDrumSvg, FlyingDragonSvg } from './SvgArtworks';

interface DragonLoaderProps {
  onComplete: () => void;
}

const STAGES = [
  'Awakening the Imperial Saigon Dragon...',
  'Lighting Silk Lanterns along the Saigon River...',
  'Raising the IBF Flag above Bitexco & Landmark 81...',
  'Rolling the Five Sacred Balut Dice...',
  'Chào Mừng Đến Sài Gòn • 1st–5th March 2028!',
];

export const DragonLoader: React.FC<DragonLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [diceFaces, setDiceFaces] = useState([6, 6, 6, 6, 6]);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  const skipRef = useRef<(() => void) | null>(null);
  const titleId = useId();
  const statusId = useId();

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (completedRef.current) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const duration = 2200; // Opt-in theatrical ceremony, never a page-loading gate.
    let rafId: number | null = null;
    let exitTimeout: number | null = null;
    let disposed = false;
    let finishing = false;
    let elapsedBeforePause = 0;
    let startedAt = performance.now();

    const cancelPending = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (exitTimeout !== null) window.clearTimeout(exitTimeout);
      rafId = null;
      exitTimeout = null;
    };
    const complete = () => {
      if (disposed || completedRef.current) return;
      completedRef.current = true;
      cancelPending();
      if (dialog.open) dialog.close();
      onCompleteRef.current();
    };
    const exit = (delay: number) => {
      if (disposed || finishing || completedRef.current) return;
      finishing = true;
      cancelPending();
      setExiting(true);
      exitTimeout = window.setTimeout(complete, delay);
    };
    // Skipping also cancels a pending natural-exit timeout before completing.
    skipRef.current = complete;

    const tick = (now: number) => {
      rafId = null;
      if (disposed || finishing || completedRef.current || document.hidden) return;
      const elapsed = elapsedBeforePause + now - startedAt;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 92) {
        setDiceFaces([
          ((Math.floor(elapsed / 90) + 0) % 6) + 1,
          ((Math.floor(elapsed / 85) + 1) % 6) + 1,
          ((Math.floor(elapsed / 95) + 2) % 6) + 1,
          ((Math.floor(elapsed / 80) + 3) % 6) + 1,
          ((Math.floor(elapsed / 100) + 4) % 6) + 1,
        ]);
      } else {
        // Lock into 5 Sixes — BALUT!
        setDiceFaces([6, 6, 6, 6, 6]);
      }

      if (elapsed < duration) {
        rafId = requestAnimationFrame(tick);
      } else {
        exit(480);
      }
    };
    const onVisibilityChange = () => {
      if (disposed || finishing || completedRef.current) return;
      if (document.hidden) {
        elapsedBeforePause += performance.now() - startedAt;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
      } else {
        startedAt = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };
    const onMotionChange = () => {
      if (reducedMotion.matches) complete();
    };

    if (reducedMotion.matches) {
      complete();
    } else {
      dialog.showModal();
      if (!document.hidden) rafId = requestAnimationFrame(tick);
      reducedMotion.addEventListener('change', onMotionChange);
      document.addEventListener('visibilitychange', onVisibilityChange);
    }

    return () => {
      disposed = true;
      cancelPending();
      skipRef.current = null;
      reducedMotion.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (dialog.open) dialog.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  const stageIndex = Math.min(
    STAGES.length - 1,
    Math.floor((progress / 100) * STAGES.length)
  );

  return (
    <dialog
      ref={dialogRef}
      className={`dragon-loader-overlay ${exiting ? 'loader-exit' : ''}`}
      aria-labelledby={titleId}
      aria-describedby={statusId}
      onCancel={(event) => {
        event.preventDefault();
        skipRef.current?.();
      }}
    >
      {/* Rotating Sacred Dong Son Drum Backdrop */}
      <div className="loader-drum-backdrop" aria-hidden="true">
        <DongSonDrumSvg className="spin-slow" />
      </div>

      {/* Orbiting Flying Dragons */}
      <div className="loader-dragon-top" aria-hidden="true">
        <FlyingDragonSvg variant="gold" />
      </div>

      <div className="loader-core">
        {/* Triple Elemental Vortex Rings (Jade, Gold, Crimson from logo) */}
        <div className="vortex-ring-wrapper" aria-hidden="true">
          <svg viewBox="0 0 260 260" className="vortex-svg">
            <circle
              cx="130"
              cy="130"
              r="118"
              fill="none"
              stroke="#109848"
              strokeWidth="6"
              strokeDasharray="160 95"
              strokeLinecap="round"
              className="vortex-ring-jade"
            />
            <circle
              cx="130"
              cy="130"
              r="104"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="5"
              strokeDasharray="130 85"
              strokeLinecap="round"
              className="vortex-ring-gold"
            />
            <circle
              cx="130"
              cy="130"
              r="90"
              fill="none"
              stroke="#E11D48"
              strokeWidth="5"
              strokeDasharray="110 75"
              strokeLinecap="round"
              className="vortex-ring-crimson"
            />
          </svg>
          <img
            src="/assets/dragon-head.png"
            alt="Dragonbal 2028 Mascot"
            className="loader-dragon-mascot"
          />
        </div>

        <div className="loader-badge">IBF WORLD CHAMPIONSHIP • SAIGON</div>
        <h2 id={titleId} className="loader-title">DRAGONBAL 2028</h2>
        <p id={statusId} className="loader-status">{STAGES[stageIndex]}</p>

        {/* 5 Animated Balut Dice Loader Indicator */}
        <div className="loader-dice-strip" aria-hidden="true">
          {diceFaces.map((val, idx) => (
            <div
              key={idx}
              className={`loader-mini-die ${progress >= (idx + 1) * 18 ? 'die-lit' : ''}`}
            >
              <span>{val}</span>
            </div>
          ))}
        </div>

        {/* Dragon Scale Progress Bar */}
        <div className="loader-bar-track">
          <div
            className="loader-bar-fill"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>

        <div className="loader-meta-row">
          <span className="loader-pct">{progress}%</span>
          <button
            type="button"
            onClick={() => skipRef.current?.()}
            autoFocus
            className="loader-skip-btn"
          >
            Enter Saigon Now →
          </button>
        </div>
      </div>
    </dialog>
  );
};
