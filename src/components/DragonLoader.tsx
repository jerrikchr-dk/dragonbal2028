import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const start = performance.now();
    const duration = 2200; // Snappy yet theatrical 2.2s ceremony

    const tick = (now: number) => {
      const elapsed = now - start;
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
        requestAnimationFrame(tick);
      } else {
        setExiting(true);
        setTimeout(onComplete, 480);
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  const stageIndex = Math.min(
    STAGES.length - 1,
    Math.floor((progress / 100) * STAGES.length)
  );

  return (
    <div className={`dragon-loader-overlay ${exiting ? 'loader-exit' : ''}`}>
      {/* Rotating Sacred Dong Son Drum Backdrop */}
      <div className="loader-drum-backdrop">
        <DongSonDrumSvg className="spin-slow" />
      </div>

      {/* Orbiting Flying Dragons */}
      <div className="loader-dragon-top">
        <FlyingDragonSvg variant="gold" />
      </div>

      <div className="loader-core">
        {/* Triple Elemental Vortex Rings (Jade, Gold, Crimson from logo) */}
        <div className="vortex-ring-wrapper">
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
        <h2 className="loader-title">DRAGONBAL 2028</h2>
        <p className="loader-status">{STAGES[stageIndex]}</p>

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
            onClick={() => {
              setExiting(true);
              setTimeout(onComplete, 200);
            }}
            className="loader-skip-btn"
          >
            Enter Saigon Now →
          </button>
        </div>
      </div>
    </div>
  );
};
