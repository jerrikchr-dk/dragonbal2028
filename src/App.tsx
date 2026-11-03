import React, { useEffect, useRef, useState } from 'react';
import {
  Flame,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Calendar,
  MapPin,
  Dices,
  RotateCcw,
  Share2,
  Check,
  Compass,
  Trophy,
  Film,
} from 'lucide-react';
import { DragonCanvas } from './components/DragonCanvas';
import { DragonLoader } from './components/DragonLoader';
import {
  BalutDieSvg,
  DongSonDrumSvg,
  FlyingDragonSvg,
  SaigonSkylineSvg,
  SilkLanternSvg,
} from './components/SvgArtworks';

// Target: 1st March 2028, 09:00:00 Saigon Time (UTC+7)
const EVENT_START_MS = new Date('2028-03-01T09:00:00+07:00').getTime();

interface VideoChapter {
  id: string;
  title: string;
  vietnamese: string;
  timeSec: number;
  timeLabel: string;
  thumb: string;
  desc: string;
}

const VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 'skyline',
    title: 'Mekong & Landmark 81',
    vietnamese: 'Toàn Cảnh Sài Gòn',
    timeSec: 4,
    timeLabel: '0:04',
    thumb: '/assets/scene-skyline.jpg',
    desc: 'Soaring above the Saigon River toward towering Landmark 81.',
  },
  {
    id: 'heritage',
    title: 'Notre-Dame & Scooters',
    vietnamese: 'Nhà Thờ Đức Bà',
    timeSec: 17,
    timeLabel: '0:17',
    thumb: '/assets/scene-heritage.jpg',
    desc: 'Iconic red-brick cathedral spires and the electric pulse of Saigon.',
  },
  {
    id: 'streetfood',
    title: 'Saigon Street Feast',
    vietnamese: 'Ẩm Thực Đường Phố',
    timeSec: 35,
    timeLabel: '0:35',
    thumb: '/assets/scene-streetfood.jpg',
    desc: 'Steaming Bánh Cuốn, Gỏi Cuốn, and night-market culinary magic.',
  },
  {
    id: 'fellowship',
    title: 'IBF Brotherhood',
    vietnamese: 'Hội Ngộ Quốc Tế',
    timeSec: 50,
    timeLabel: '0:50',
    thumb: '/assets/scene-fellowship.jpg',
    desc: 'Cold brews, cà phê sữa đá, and camaraderie on Saigon avenues.',
  },
  {
    id: 'nightcruise',
    title: 'Saigon River Gala Cruise',
    vietnamese: 'Du Thuyền Sông Sài Gòn',
    timeSec: 67,
    timeLabel: '1:07',
    thumb: '/assets/scene-nightcruise.jpg',
    desc: 'Gliding across neon-lit waters under the glittering skyline.',
  },
  {
    id: 'welcome',
    title: 'Grand Championship Welcome',
    vietnamese: 'Chào Mừng Quý Khách',
    timeSec: 84,
    timeLabel: '1:24',
    thumb: '/assets/scene-welcome.jpg',
    desc: 'Five-star Vietnamese hospitality awaiting every qualifier in 2028.',
  },
];

function evaluateBalutHand(dice: number[]): { rank: string; subtitle: string; isJackpot: boolean } {
  const counts: Record<number, number> = {};
  let sum = 0;
  for (const d of dice) {
    counts[d] = (counts[d] || 0) + 1;
    sum += d;
  }
  const freq = Object.values(counts).sort((a, b) => b - a);
  const uniqueSorted = Object.keys(counts)
    .map(Number)
    .sort((a, b) => a - b)
    .join('');

  if (freq[0] === 5) {
    return {
      rank: `🐉 DRAGONBAL! FIVE ${dice[0]}s (${sum} pts)`,
      subtitle: 'Supreme Imperial Roll — 5 of a Kind!',
      isJackpot: true,
    };
  }
  if (uniqueSorted === '12345' || uniqueSorted === '23456') {
    return {
      rank: `🔥 LARGE STRAIGHT (${sum} pts)`,
      subtitle: 'Five sequential dice along the Mekong!',
      isJackpot: true,
    };
  }
  if (freq[0] === 4) {
    return {
      rank: `⚡ FOUR OF A KIND (${sum} pts)`,
      subtitle: 'Championship caliber roll!',
      isJackpot: true,
    };
  }
  if (freq[0] === 3 && freq[1] === 2) {
    return {
      rank: `🏮 SAIGON FULL HOUSE (${sum} pts)`,
      subtitle: 'Three of a kind + a pair!',
      isJackpot: true,
    };
  }
  if (freq[0] === 3) {
    return {
      rank: `🎲 THREE OF A KIND (${sum} pts)`,
      subtitle: 'Lock the trip and roll for Balut!',
      isJackpot: false,
    };
  }
  if (freq[0] === 2 && freq[1] === 2) {
    return {
      rank: `✨ TWO PAIR (${sum} pts)`,
      subtitle: 'One die away from a Full House!',
      isJackpot: false,
    };
  }
  return {
    rank: `🎲 CHOICE HAND • ${sum} POINTS`,
    subtitle: 'Click any die to LOCK it, then roll again!',
    isJackpot: false,
  };
}

export function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [burstCount, setBurstCount] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = Math.max(0, EVENT_START_MS - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  });

  // Video player state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(94.8);
  const [activeChapter, setActiveChapter] = useState<string>('skyline');

  // 3D Tilt on Hero Medallion
  const [medallionTilt, setMedallionTilt] = useState({ rx: 0, ry: 0 });

  // Balut 5-Dice mini-game state (starts with the logo's iconic 2-3-4-5-6 straight!)
  const [dice, setDice] = useState<number[]>([2, 3, 4, 5, 6]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [isRolling, setIsRolling] = useState(false);
  const [rollsLeft, setRollsLeft] = useState(3);

  // Update countdown every second
  useEffect(() => {
    const id = setInterval(() => {
      const diff = Math.max(0, EVENT_START_MS - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const triggerDragonFire = () => {
    setBurstCount((c) => c + 1);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
      triggerDragonFire();
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const jumpToChapter = (chapter: VideoChapter) => {
    const v = videoRef.current;
    setActiveChapter(chapter.id);
    if (!v) return;
    v.currentTime = chapter.timeSec;
    v.play();
    setIsPlaying(true);
  };

  const openFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) {
      v.requestFullscreen();
    }
  };

  const handleRollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    const nextRollsLeft = rollsLeft <= 1 ? 3 : rollsLeft - 1;
    const resetHolds = rollsLeft <= 1;

    let ticks = 0;
    const interval = setInterval(() => {
      ticks++;
      setDice((prev) =>
        prev.map((val, idx) =>
          !resetHolds && held[idx] ? val : Math.floor(Math.random() * 6) + 1
        )
      );
      if (ticks >= 7) {
        clearInterval(interval);
        const finalDice = dice.map((val, idx) =>
          !resetHolds && held[idx] ? val : Math.floor(Math.random() * 6) + 1
        );
        setDice(finalDice);
        if (resetHolds) {
          setHeld([false, false, false, false, false]);
        }
        setRollsLeft(nextRollsLeft);
        setIsRolling(false);
        const result = evaluateBalutHand(finalDice);
        if (result.isJackpot) {
          triggerDragonFire();
        }
      }
    }, 65);
  };

  const handleLuckyBalut = () => {
    if (isRolling) return;
    setIsRolling(true);
    setTimeout(() => {
      setDice([6, 6, 6, 6, 6]);
      setHeld([true, true, true, true, true]);
      setIsRolling(false);
      triggerDragonFire();
    }, 320);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    triggerDragonFire();
    setTimeout(() => setCopiedLink(false), 2400);
  };

  const handEvaluation = evaluateBalutHand(dice);

  return (
    <div className="saigon-page-shell">
      {/* Ceremony Preloader */}
      {showLoader && <DragonLoader onComplete={() => setShowLoader(false)} />}

      {/* Interactive Dragon Embers & Firework Canvas */}
      <DragonCanvas burstTrigger={burstCount} />

      {/* Hanging Vietnamese Silk Lanterns Canopy */}
      <div className="lantern-canopy" aria-hidden="true">
        <div className="lantern-item lantern-sway-1">
          <SilkLanternSvg color="crimson" size={58} />
        </div>
        <div className="lantern-item lantern-sway-2">
          <SilkLanternSvg color="gold" size={48} />
        </div>
        <div className="lantern-item lantern-sway-3 hide-mobile">
          <SilkLanternSvg color="jade" size={52} />
        </div>
        <div className="lantern-item lantern-sway-2 hide-mobile">
          <SilkLanternSvg color="crimson" size={46} />
        </div>
        <div className="lantern-item lantern-sway-1">
          <SilkLanternSvg color="gold" size={56} />
        </div>
        <div className="lantern-item lantern-sway-3">
          <SilkLanternSvg color="crimson" size={50} />
        </div>
      </div>

      {/* Top Navigation Bar */}
      <header className="top-nav">
        <div className="nav-brand">
          <img
            src="/assets/dragon-head.png"
            alt="Dragonbal Mascot"
            className="nav-dragon-icon"
          />
          <div>
            <span className="nav-title">DRAGONBAL 2028</span>
            <span className="nav-subtitle">SAIGON ★ VIETNAM • IBF VM</span>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#promo-video" className="nav-link">
            <Film size={15} /> Official Video
          </a>
          <a href="#balut-roller" className="nav-link">
            <Dices size={15} /> Roll Balut
          </a>
          <a href="#saigon-2028" className="nav-link">
            <Compass size={15} /> Saigon 2028
          </a>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            onClick={() => setShowLoader(true)}
            className="btn-ghost-gold"
            title="Replay the Dragon Awakening Loader Ceremony"
          >
            <Sparkles size={15} />
            <span>Replay Intro</span>
          </button>
          <button
            type="button"
            onClick={triggerDragonFire}
            className="btn-dragon-fire"
          >
            <Flame size={16} />
            <span>Dragon Fire!</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main>
        <section className="hero-section">
          {/* Background Rotating Dong Son Bronze Drum */}
          <div className="hero-drum-bg" aria-hidden="true">
            <DongSonDrumSvg className="spin-ultra-slow" />
          </div>

          {/* Gliding Dragons Left & Right */}
          <div className="hero-flying-dragon dragon-left" aria-hidden="true">
            <FlyingDragonSvg variant="jade" />
          </div>
          <div className="hero-flying-dragon dragon-right" aria-hidden="true">
            <FlyingDragonSvg variant="gold" flip />
          </div>

          <div className="hero-grid">
            {/* Left/Center Column: Official Emblem Medallion with Orbiting Rings */}
            <div className="hero-emblem-stage">
              <div
                className="emblem-orbit-container"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const nx = (e.clientX - rect.left) / rect.width - 0.5;
                  const ny = (e.clientY - rect.top) / rect.height - 0.5;
                  setMedallionTilt({ rx: -ny * 14, ry: nx * 14 });
                }}
                onMouseLeave={() => setMedallionTilt({ rx: 0, ry: 0 })}
                onClick={triggerDragonFire}
              >
                {/* Animated SVG Elemental Dragon Rings around Emblem */}
                <svg viewBox="0 0 500 500" className="emblem-energy-rings" aria-hidden="true">
                  <circle
                    cx="250"
                    cy="250"
                    r="238"
                    fill="none"
                    stroke="#109848"
                    strokeWidth="5"
                    strokeDasharray="190 120"
                    strokeLinecap="round"
                    className="orbit-cw"
                  />
                  <circle
                    cx="250"
                    cy="250"
                    r="224"
                    fill="none"
                    stroke="#FACC15"
                    strokeWidth="4"
                    strokeDasharray="140 90"
                    strokeLinecap="round"
                    className="orbit-ccw"
                  />
                  <circle
                    cx="250"
                    cy="250"
                    r="210"
                    fill="none"
                    stroke="#E11D48"
                    strokeWidth="4.5"
                    strokeDasharray="110 85"
                    strokeLinecap="round"
                    className="orbit-cw-fast"
                  />
                </svg>

                <div
                  className="emblem-3d-card"
                  style={{
                    transform: `perspective(900px) rotateX(${medallionTilt.rx}deg) rotateY(${medallionTilt.ry}deg)`,
                  }}
                >
                  <img
                    src="/assets/emblem-medallion.png"
                    alt="Dragonbal 2028 Saigon Vietnam Official Emblem"
                    className="hero-emblem-img"
                  />
                </div>

                <div className="emblem-date-plaque">
                  <Calendar size={18} className="plaque-icon" />
                  <span>1st – 5th March 2028</span>
                </div>
              </div>
            </div>

            {/* Right Column: Event Title, Vietnamese Art Typography, CTAs & Live Countdown */}
            <div className="hero-copy-col">
              <div className="eyebrow-pill">
                <span className="pulse-dot" />
                <span>IBF WORLD CHAMPIONSHIP • VM I BALUT</span>
              </div>

              <h1 className="hero-headline">
                <span className="headline-dragon">DRAGONBAL</span>
                <span className="headline-year">2028 • SAIGON</span>
              </h1>

              <p className="hero-lead">
                Where five sacred dice meet the electric soul of{' '}
                <strong>Ho Chi Minh City (Saigon), Vietnam</strong>. Five unforgettable days
                of championship Balut, emerald dragons, rooftop skylines, river cruises, and
                legendary fellowship from <strong>1st to 5th March 2028</strong>.
              </p>

              {/* Action CTA Row */}
              <div className="hero-cta-row">
                <a
                  href="#promo-video"
                  className="btn-primary-saigon"
                  onClick={() => {
                    const v = videoRef.current;
                    if (v && v.paused) {
                      setTimeout(() => {
                        v.play();
                        setIsPlaying(true);
                      }, 300);
                    }
                  }}
                >
                  <Play size={18} fill="currentColor" />
                  <span>Watch Saigon Promo Video</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="btn-secondary-saigon"
                >
                  {copiedLink ? <Check size={17} /> : <Share2 size={17} />}
                  <span>{copiedLink ? 'Link Copied for Tri!' : 'Share dragonbal2028.com'}</span>
                </button>
              </div>

              {/* Live Countdown to 1st March 2028 */}
              <div className="countdown-panel">
                <div className="countdown-header">
                  <span className="countdown-label">
                    <MapPin size={14} /> COUNTDOWN TO FIRST ROLL IN SAIGON (UTC+7)
                  </span>
                  <span className="countdown-target">01.03.2028</span>
                </div>

                <div className="countdown-grid">
                  <div className="countdown-cell">
                    <span className="countdown-num">{timeLeft.days}</span>
                    <span className="countdown-unit">Days</span>
                  </div>
                  <div className="countdown-cell">
                    <span className="countdown-num">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="countdown-unit">Hours</span>
                  </div>
                  <div className="countdown-cell">
                    <span className="countdown-num">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="countdown-unit">Minutes</span>
                  </div>
                  <div className="countdown-cell">
                    <span className="countdown-num countdown-sec">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="countdown-unit">Seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ANIMATED TICKER RIBBON */}
        <div className="dragon-marquee" aria-hidden="true">
          <div className="dragon-marquee-track">
            {Array.from({ length: 2 }).map((_, loopIdx) => (
              <div key={loopIdx} className="dragon-marquee-group">
                <span>🐉 DRAGONBAL 2028</span>
                <span>★ SAIGON • VIETNAM ★</span>
                <span>🎲 1ST – 5TH MARCH 2028</span>
                <span>🏮 IBF WORLD CHAMPIONSHIP</span>
                <span>🥂 CHÀO MỪNG ĐẾN SÀI GÒN</span>
                <span>🔥 FIVE DICE • ONE DRAGON CROWN</span>
              </div>
            ))}
          </div>
        </div>

        {/* OFFICIAL SAIGON PROMO VIDEO SHOWCASE */}
        <section id="promo-video" className="video-showcase-section">
          <div className="section-header">
            <div className="section-tag">OFFICIAL TEASER FILM • IBF SAIGON BRANCH</div>
            <h2 className="section-title">Experience the Magic of Saigon 2028</h2>
            <p className="section-desc">
              Press play to tour our host city — from Notre-Dame Cathedral and bustling street
              food stalls to sunset cocktails and the Saigon River gala cruise.
            </p>
          </div>

          <div className="video-theater-frame">
            {/* Decorative Dragon Corner Crests */}
            <div className="theater-glow-ring" aria-hidden="true" />

            <div className="video-stage-wrapper">
              <video
                ref={videoRef}
                src="/assets/saigon-2028.mp4"
                poster="/assets/poster-main.jpg"
                playsInline
                preload="metadata"
                className="saigon-video-element"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) => {
                  const t = e.currentTarget.currentTime;
                  setCurrentTime(t);
                  const currentChap = [...VIDEO_CHAPTERS]
                    .reverse()
                    .find((c) => t >= c.timeSec);
                  if (currentChap) setActiveChapter(currentChap.id);
                }}
                onLoadedMetadata={(e) => {
                  if (e.currentTarget.duration) {
                    setDuration(e.currentTarget.duration);
                  }
                }}
              />

              {/* Big Play Overlay when Paused */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="video-big-play-overlay"
                  aria-label="Play Official Dragonbal 2028 Saigon Promo Video"
                >
                  <div className="big-play-ring">
                    <Play size={38} fill="currentColor" />
                  </div>
                  <span className="big-play-caption">
                    Play Official Saigon 2028 Film (1:35)
                  </span>
                </button>
              )}

              {/* Custom Control Bar */}
              <div className="video-controls-bar">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="v-ctrl-btn"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                </button>

                <div
                  className="v-progress-track"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = Math.max(
                      0,
                      Math.min(1, (e.clientX - rect.left) / rect.width)
                    );
                    if (videoRef.current) {
                      videoRef.current.currentTime = ratio * duration;
                    }
                  }}
                >
                  <div
                    className="v-progress-fill"
                    style={{
                      transform: `scaleX(${Math.min(1, currentTime / (duration || 1))})`,
                    }}
                  />
                </div>

                <span className="v-time-readout">
                  {Math.floor(currentTime / 60)}:
                  {String(Math.floor(currentTime % 60)).padStart(2, '0')} /{' '}
                  {Math.floor(duration / 60)}:
                  {String(Math.floor(duration % 60)).padStart(2, '0')}
                </span>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="v-ctrl-btn"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <button
                  type="button"
                  onClick={openFullscreen}
                  className="v-ctrl-btn"
                  aria-label="Fullscreen"
                >
                  <Maximize2 size={17} />
                </button>
              </div>
            </div>

            {/* Interactive Scene Chapters */}
            <div className="video-chapters-grid">
              {VIDEO_CHAPTERS.map((chap) => {
                const isActive = activeChapter === chap.id;
                return (
                  <button
                    key={chap.id}
                    type="button"
                    onClick={() => jumpToChapter(chap)}
                    className={`chapter-card ${isActive ? 'chapter-active' : ''}`}
                  >
                    <div className="chapter-thumb-wrap">
                      <img src={chap.thumb} alt={chap.title} className="chapter-thumb" />
                      <span className="chapter-time-badge">{chap.timeLabel}</span>
                    </div>
                    <div className="chapter-meta">
                      <span className="chapter-vn">{chap.vietnamese}</span>
                      <strong className="chapter-title">{chap.title}</strong>
                      <p className="chapter-desc">{chap.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* INTERACTIVE 5-DICE BALUT ROLLER LOUNGE */}
        <section id="balut-roller" className="balut-lounge-section">
          <div className="balut-lounge-card">
            <div className="balut-lounge-header">
              <div>
                <div className="section-tag">WARM UP YOUR WRIST FOR MARCH 2028</div>
                <h2 className="section-title">The 5 Sacred Dice of Dragonbal</h2>
                <p className="section-desc">
                  Notice the 5 dice in the official Dragonbal 2028 emblem? Click any die to{' '}
                  <strong>LOCK</strong> it and roll for a Saigon Full House, Straight, or 5-of-a-Kind{' '}
                  <strong>DRAGONBAL</strong>!
                </p>
              </div>

              <div className="balut-Dragon-badge">
                <img
                  src="/assets/dragon-head.png"
                  alt="Dragon Mascot"
                  className="balut-mascot-mini"
                />
                <span>Rolls left in turn: {rollsLeft} / 3</span>
              </div>
            </div>

            {/* 5 Interactive Dice */}
            <div className="balut-dice-tray">
              {dice.map((val, idx) => (
                <BalutDieSvg
                  key={idx}
                  value={val}
                  rolling={isRolling && !held[idx]}
                  held={held[idx]}
                  onClick={() => {
                    setHeld((prev) => prev.map((h, i) => (i === idx ? !h : h)));
                  }}
                />
              ))}
            </div>

            {/* Score Banner & Action Buttons */}
            <div className="balut-controls-row">
              <div className="balut-score-readout">
                <div className="balut-rank-title">{handEvaluation.rank}</div>
                <div className="balut-rank-sub">{handEvaluation.subtitle}</div>
              </div>

              <div className="balut-btn-group">
                <button
                  type="button"
                  onClick={handleRollDice}
                  className="btn-primary-saigon"
                  disabled={isRolling}
                >
                  <Dices size={19} />
                  <span>{rollsLeft === 3 ? 'Roll All 5 Dice' : `Roll Dice (${rollsLeft} left)`}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLuckyBalut}
                  className="btn-ghost-gold"
                  title="Summon the Dragon's 5-of-a-Kind Jackpot!"
                >
                  <Trophy size={16} />
                  <span>Summon 5 Sixes!</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHeld([false, false, false, false, false]);
                    setRollsLeft(3);
                    setDice([2, 3, 4, 5, 6]);
                  }}
                  className="btn-icon-only"
                  title="Reset Hand"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ANIMATED SAIGON SKYLINE & 2028 HIGHLIGHTS */}
        <section id="saigon-2028" className="skyline-panorama-section">
          <div className="section-header">
            <div className="section-tag">1ST – 5TH MARCH 2028 • HO CHI MINH CITY</div>
            <h2 className="section-title">The Icons Inside Our Emblem</h2>
            <p className="section-desc">
              Every silhouette in the Dragonbal 2028 crest tells a piece of the Saigon story awaiting
              us in March 2028.
            </p>
          </div>

          {/* Vector Recreated Saigon Skyline + Animated Scooters */}
          <div className="skyline-art-stage">
            <div className="skyline-dragon-overflight" aria-hidden="true">
              <FlyingDragonSvg variant="crimson" />
            </div>
            <SaigonSkylineSvg className="saigon-skyline-vector" />

            {/* Animated Saigon Scooters Zipping Across Street Level */}
            <div className="scooter-lane" aria-hidden="true">
              <div className="scooter-rider scooter-1">🛵💨</div>
              <div className="scooter-rider scooter-2">🛵✨</div>
              <div className="scooter-rider scooter-3">🛵🏮</div>
            </div>
          </div>

          {/* 4 Pillar Cards matching the Skyline & Video */}
          <div className="saigon-pillars-grid">
            <article className="pillar-card">
              <span className="pillar-num">01 • THE ARENA</span>
              <h3>IBF Flag Over Saigon</h3>
              <p>
                Five days of world-class tournament play, crisp scorecards, and electric championship
                rounds under the Dragonbal 2028 banner.
              </p>
            </article>

            <article className="pillar-card">
              <span className="pillar-num">02 • THE SKYLINE</span>
              <h3>Landmark 81 & Bitexco</h3>
              <p>
                From colonial Notre-Dame Cathedral and Bến Thành Market to the sky-high lotus helipad
                of Bitexco and Landmark 81.
              </p>
            </article>

            <article className="pillar-card">
              <span className="pillar-num">03 • THE FLAVORS</span>
              <h3>Street Food & Night Cruise</h3>
              <p>
                Savor steaming street-side delicacies, sidewalk cà phê, and an unforgettable gala
                dinner cruise along the glowing Saigon River.
              </p>
            </article>

            <article className="pillar-card">
              <span className="pillar-num">04 • THE DATES</span>
              <h3>1st – 5th March 2028</h3>
              <p>
                Dry-season golden sunshine in Southern Vietnam — mark your calendars now and prepare
                for the ultimate VM in Saigon.
              </p>
            </article>
          </div>
        </section>
      </main>

      {/* FOOTER WITH FULL POSTER PREVIEW */}
      <footer className="saigon-footer">
        <div className="footer-inner">
          <div className="footer-brand-col">
            <img
              src="/assets/logo-full.jpg"
              alt="Dragonbal 2028 Official Poster with Date"
              className="footer-poster-card"
            />
            <div>
              <div className="footer-badge">OFFICIAL EVENT DOMAIN • DRAGONBAL2028.COM</div>
              <h3 className="footer-heading">DRAGONBAL 2028 • SAIGON, VIETNAM</h3>
              <p className="footer-copy">
                1st – 5th March 2028 • International Balut Federation (IBF) World Championship.
                Full registration, hotel packages, and tournament program launching soon.
              </p>
            </div>
          </div>

          <div className="footer-links-col">
            <a href="#promo-video" className="btn-ghost-gold">
              <Play size={15} /> Watch Video
            </a>
            <button type="button" onClick={triggerDragonFire} className="btn-dragon-fire">
              <Flame size={15} /> Breathe Fire
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
