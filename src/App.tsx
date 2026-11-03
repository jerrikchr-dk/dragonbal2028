import React, { useCallback, useEffect, useState } from 'react';
import {
  Flame,
  Play,
  Sparkles,
  Calendar,
  MapPin,
  Dices,
  RotateCcw,
  Share2,
  Compass,
  Trophy,
  Film,
} from 'lucide-react';
import { DragonCanvas } from './components/DragonCanvas';
import { DragonLoader } from './components/DragonLoader';
import { SaigonFilm } from './components/SaigonFilm';
import {
  BalutDieSvg,
  DongSonDrumSvg,
  FlyingDragonSvg,
  SaigonSkylineSvg,
  SilkLanternSvg,
} from './components/SvgArtworks';

// Target: 1st March 2028, 09:00:00 Saigon Time (UTC+7)
const EVENT_START_MS = new Date('2028-03-01T09:00:00+07:00').getTime();


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
  const [showLoader, setShowLoader] = useState(false);
  const [burstCount, setBurstCount] = useState(0);
  const [shareFeedback, setShareFeedback] = useState('');
  const closeIntro = useCallback(() => setShowLoader(false), []);

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

  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleShareEvent = async () => {
    setShareFeedback('');
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Dragonbal 2028 · Saigon, Vietnam',
          text: 'IBF World Championship · 1–5 March 2028. See you in Saigon!',
          url: window.location.href.split('#')[0],
        });
      } else {
        await navigator.clipboard.writeText(window.location.href.split('#')[0]);
        setShareFeedback('Event link copied. Send it to your fellow players!');
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setShareFeedback('To share the event, copy this page’s address from your browser.');
      }
    }
  };

  const handEvaluation = evaluateBalutHand(dice);

  return (
    <div className={`saigon-page-shell${isPlaying ? ' film-is-playing' : ''}`}>
      {/* Keep the ceremony available without blocking a visitor’s first step. */}
      {showLoader && <DragonLoader onComplete={closeIntro} />}

      <DragonCanvas burstTrigger={burstCount} paused={isPlaying || showLoader} />

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
        <a href="#welcome" className="nav-brand" aria-label="Dragonbal 2028 · Back to welcome">
          <img
            src="/assets/dragon-head.png"
            alt="Dragonbal Mascot"
            className="nav-dragon-icon"
          />
          <div>
            <span className="nav-title">DRAGONBAL 2028</span>
            <span className="nav-subtitle">SAIGON ★ VIETNAM • IBF VM</span>
          </div>
        </a>

        <nav className="nav-links" aria-label="Explore Dragonbal 2028">
          <a href="#promo-video" className="nav-link nav-watch">
            <Film size={16} /> Watch film
          </a>
          <a href="#saigon-2028" className="nav-link">
            <Compass size={16} /> Discover Saigon
          </a>
          <a href="#balut-roller" className="nav-link">
            <Dices size={16} /> Roll for fun
          </a>
        </nav>

        <button
          type="button"
          onClick={handleShareEvent}
          className="nav-mobile-share"
          aria-label="Share Dragonbal 2028"
        >
          <Share2 size={15} />
          <span>Share</span>
        </button>

        <div className="nav-actions">
          <button
            type="button"
            onClick={() => setShowLoader(true)}
            disabled={isPlaying}
            className="btn-ghost-gold"
            title="Replay the Dragon Awakening Loader Ceremony"
          >
            <Sparkles size={15} />
            <span>Play intro</span>
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
        <section id="welcome" className="hero-section" aria-labelledby="event-title">
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
            {/* Event essentials and the next action come before decorative artwork. */}
            <div className="hero-copy-col">
              <div className="eyebrow-pill">
                <span className="pulse-dot" />
                <span>IBF WORLD CHAMPIONSHIP</span>
              </div>

              <h1 id="event-title" className="hero-headline">
                <span className="headline-dragon">DRAGONBAL</span>
                <span className="headline-year">2028 • SAIGON</span>
              </h1>

              <div className="event-essentials">
                <p>
                  <Calendar size={17} aria-hidden="true" /> <strong>1–5 March 2028</strong>
                  <span className="essentials-sep" aria-hidden="true">•</span>
                  <MapPin size={17} aria-hidden="true" /> <span>Saigon, Vietnam</span>
                </p>
              </div>

              <p className="hero-lead">
                Five sacred dice in the heart of Ho Chi Minh City. Save the dates — registration
                and programme details coming soon.
              </p>

              <div className="hero-cta-row">
                <button
                  type="button"
                  onClick={handleShareEvent}
                  className="btn-secondary-saigon"
                >
                  <Share2 size={17} />
                  <span>Share the event</span>
                </button>
              </div>
              <p className="share-feedback" role="status">{shareFeedback}</p>
            </div>
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

          </div>
        </section>

        {/* OFFICIAL SAIGON PROMO VIDEO DIRECTLY BELOW HERO */}
        <section
          id="promo-video"
          className="video-showcase-section"
          aria-label="Official Saigon 2028 welcome film"
        >
          <SaigonFilm onPlaybackChange={setIsPlaying} />
          <div className="film-followup">
            <a href="#saigon-2028" className="section-next-link">
              Next: discover Saigon <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="event-countdown">
              {/* Live Countdown to 1st March 2028 */}
              <div className="countdown-panel">
                <div className="countdown-header">
                  <span className="countdown-label">
                    <MapPin size={14} /> COUNTDOWN TO MARCH 2028
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
        {/* ANIMATED SAIGON SKYLINE & 2028 HIGHLIGHTS */}
        <section id="saigon-2028" className="skyline-panorama-section" aria-labelledby="saigon-title">
          <div className="section-header">
            <div className="section-tag">02 · DISCOVER SAIGON</div>
            <h2 id="saigon-title" className="section-title">Meet your host city</h2>
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
                The world of Balut meets in Saigon on 1–5 March 2028. Registration and
                the full tournament programme are coming soon.
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
              <h3>A Taste of Saigon</h3>
              <p>
                Discover street-side delicacies, sidewalk cà phê and the glowing Saigon River
                in our welcome film. The event programme is still to come.
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
          <div className="section-followup">
            <a href="#balut-roller" className="section-next-link">
              Feeling lucky? Try the five dice <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
        {/* INTERACTIVE 5-DICE BALUT ROLLER LOUNGE */}
        <section id="balut-roller" className="balut-lounge-section" aria-labelledby="dice-title">
          <div className="balut-lounge-card">
            <div className="balut-lounge-header">
              <div>
                <div className="section-tag">03 · A LITTLE FUN WHILE YOU WAIT</div>
                <h2 id="dice-title" className="section-title">Roll with the dragon</h2>
                <p className="section-desc">
                  Warm up with the five dice from our emblem. Tap any die to{' '}
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
                Registration, hotel information, and the tournament programme are coming soon.
              </p>
            </div>
          </div>

          <div className="footer-links-col">
            <a href="#promo-video" className="btn-ghost-gold">
              <Play size={15} /> Watch film
            </a>
            <button
              type="button"
              onClick={() => setShowLoader(true)}
              className="btn-ghost-gold"
              disabled={isPlaying}
            >
              <Sparkles size={15} /> Play dragon intro
            </button>
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
