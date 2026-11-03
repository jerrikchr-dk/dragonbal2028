import React from 'react';

/**
 * Intricate Vietnamese Đông Sơn Bronze Drum (Trống Đồng) Mandala SVG
 * Rotates slowly in the background as a sacred cultural motif.
 */
export const DongSonDrumSvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  const rays = Array.from({ length: 14 });
  const birds = Array.from({ length: 8 });
  const geometricTicks = Array.from({ length: 36 });

  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="drumGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5B700" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#D9381E" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#081C15" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE169" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      <circle cx="300" cy="300" r="290" fill="url(#drumGlow)" />

      {/* Outer concentric rings */}
      {[280, 268, 240, 212, 175, 162, 122, 86, 56].map((r, idx) => (
        <circle
          key={r}
          cx="300"
          cy="300"
          r={r}
          stroke="url(#goldStroke)"
          strokeWidth={idx % 2 === 0 ? '2' : '1'}
          strokeDasharray={idx === 2 || idx === 6 ? '6 6' : undefined}
          opacity={0.45 - idx * 0.02}
        />
      ))}

      {/* Sawtooth geometric ring */}
      <g opacity="0.4">
        {geometricTicks.map((_, i) => {
          const angle = i * 10;
          return (
            <g key={i} transform={`rotate(${angle} 300 300)`}>
              <path
                d="M294 32 L300 20 L306 32 Z"
                stroke="#F5B700"
                strokeWidth="1.2"
                fill="none"
              />
              <circle cx="300" cy="48" r="2.2" fill="#F5B700" />
            </g>
          );
        })}
      </g>

      {/* Flying Lac Birds (Chim Lạc) around the middle band */}
      <g opacity="0.55">
        {birds.map((_, i) => {
          const angle = i * 45;
          return (
            <g key={i} transform={`rotate(${angle} 300 300)`}>
              <path
                d="M275 104 Q292 92 302 103 L326 95 L312 106 L332 110 L304 111 Q295 117 283 122 L292 109 L268 109 Z"
                fill="#F5B700"
              />
              <circle cx="308" cy="101" r="2" fill="#07130F" />
            </g>
          );
        })}
      </g>

      {/* Central 14-pointed Dong Son Sun Star */}
      <g>
        {rays.map((_, i) => {
          const angle = (i * 360) / 14;
          return (
            <polygon
              key={i}
              points="293,300 300,216 307,300"
              fill="#F5B700"
              opacity="0.65"
              transform={`rotate(${angle} 300 300)`}
            />
          );
        })}
        <circle cx="300" cy="300" r="26" fill="#0B221A" stroke="#FFE169" strokeWidth="3" />
        <circle cx="300" cy="300" r="12" fill="#F5B700" />
      </g>
    </svg>
  );
};

/**
 * Sinuous Animated Vietnamese Imperial Dragon (Rồng Sài Gòn)
 * Undulates across sections with glowing scales, golden horns, and a flaming pearl.
 */
export const FlyingDragonSvg: React.FC<{
  className?: string;
  flip?: boolean;
  variant?: 'jade' | 'gold' | 'crimson';
}> = ({ className = '', flip = false, variant = 'jade' }) => {
  const palette = {
    jade: {
      body: '#109848',
      belly: '#FACC15',
      mane: '#E11D48',
      horn: '#F59E0B',
      glow: '#22C55E',
    },
    gold: {
      body: '#F59E0B',
      belly: '#FEF08A',
      mane: '#DC2626',
      horn: '#FFFBEB',
      glow: '#FACC15',
    },
    crimson: {
      body: '#E11D48',
      belly: '#FACC15',
      mane: '#10B981',
      horn: '#FDE047',
      glow: '#F43F5E',
    },
  }[variant];

  const dorsalFins = [
    { x: 140, y: 84, r: -18 },
    { x: 185, y: 65, r: -8 },
    { x: 235, y: 62, r: 10 },
    { x: 285, y: 78, r: 24 },
    { x: 335, y: 104, r: 22 },
    { x: 385, y: 120, r: 5 },
    { x: 435, y: 112, r: -18 },
    { x: 485, y: 88, r: -24 },
    { x: 535, y: 68, r: -8 },
    { x: 585, y: 66, r: 14 },
    { x: 635, y: 84, r: 20 },
    { x: 685, y: 105, r: 8 },
  ];

  return (
    <svg
      viewBox="0 0 820 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <defs>
        <linearGradient id={`dragonBody-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={palette.body} />
          <stop offset="50%" stopColor={palette.belly} />
          <stop offset="100%" stopColor={palette.mane} />
        </linearGradient>
        <filter id={`dragonGlow-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Flaming Pearl of Saigon (Châu Ngọc) */}
      <g className="dragon-pearl-pulse" transform="translate(48, 102)">
        <circle cx="0" cy="0" r="26" fill={palette.mane} opacity="0.25" />
        <circle cx="0" cy="0" r="18" fill={palette.belly} filter={`url(#dragonGlow-${variant})`} />
        <circle cx="-4" cy="-4" r="6" fill="#FFFFFF" opacity="0.9" />
        <path
          d="M-18 -6 Q-28 -26 -8 -24 Q0 -38 12 -22 Q28 -26 18 -4"
          stroke={palette.mane}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Dorsal Flame Spines */}
      {dorsalFins.map((fin, i) => (
        <g key={i} transform={`translate(${fin.x}, ${fin.y}) rotate(${fin.r})`}>
          <path
            d="M-10 12 Q0 -16 12 -6 Q6 6 8 14 Z"
            fill={palette.mane}
            stroke="#081C15"
            strokeWidth="2"
          />
        </g>
      ))}

      {/* Undulating Serpentine Belly & Body */}
      <path
        d="M115 106 C 185 45, 255 55, 335 105 C 415 155, 485 55, 575 72 C 655 88, 705 135, 765 92"
        stroke={palette.belly}
        strokeWidth="26"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M115 100 C 185 39, 255 49, 335 99 C 415 149, 485 49, 575 66 C 655 82, 705 129, 765 86"
        stroke={`url(#dragonBody-${variant})`}
        strokeWidth="19"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M115 100 C 185 39, 255 49, 335 99 C 415 149, 485 49, 575 66 C 655 82, 705 129, 765 86"
        stroke="#06140E"
        strokeWidth="15"
        strokeLinecap="round"
        strokeDasharray="2 16"
        fill="none"
        opacity="0.45"
      />

      {/* Tail Flame */}
      <g transform="translate(765, 86)">
        <path
          d="M-5 0 Q20 -32 45 -18 Q28 0 48 12 Q20 26 -5 6 Z"
          fill={palette.mane}
          stroke="#FACC15"
          strokeWidth="2"
        />
        <path d="M0 0 Q18 -14 32 -8 Q18 2 30 8 Q14 14 0 3 Z" fill={palette.belly} />
      </g>

      {/* Dragon Claws */}
      <g transform="translate(260, 112)">
        <path
          d="M0 -12 L-12 14 L-24 18 M-12 14 L-14 26 M-12 14 L-2 22"
          stroke={palette.belly}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
      <g transform="translate(525, 98)">
        <path
          d="M0 -10 L-10 16 L-22 20 M-10 16 L-12 28 M-10 16 L0 24"
          stroke={palette.belly}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* Dragon Head */}
      <g transform="translate(108, 96)">
        {/* Crimson Mane */}
        <path
          d="M0 -24 Q18 -46 36 -30 Q26 -14 42 -8 Q24 10 34 22 Q10 24 -4 12 Z"
          fill={palette.mane}
          stroke="#06140E"
          strokeWidth="2.5"
        />
        {/* Golden Horns */}
        <path
          d="M4 -20 Q22 -52 44 -44 Q28 -26 14 -14 Z"
          fill={palette.horn}
          stroke="#06140E"
          strokeWidth="2.5"
        />
        {/* Snout & Jaw */}
        <path
          d="M12 -14 Q-16 -22 -32 -6 Q-36 6 -20 10 L6 8 L-14 20 Q-4 28 14 14 Z"
          fill={palette.body}
          stroke="#06140E"
          strokeWidth="2.5"
        />
        {/* Golden Beard & Eyebrow */}
        <path
          d="M-12 -14 Q2 -28 18 -16"
          stroke={palette.belly}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M-24 -4 Q-45 -22 -58 -8"
          stroke={palette.belly}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Eye */}
        <circle cx="-6" cy="-8" r="6" fill="#FFFFFF" stroke="#06140E" strokeWidth="2" />
        <circle cx="-8" cy="-8" r="3" fill="#06140E" />
        <circle cx="-9" cy="-9.5" r="1.2" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

/**
 * Recreated & Animated Saigon Skyline SVG matching the Dragonbal 2028 Logo
 * Includes: Ben Thanh Market Clock Tower, Saigon Notre-Dame Cathedral,
 * Landmark 81, Bitexco Financial Tower + Helipad, and waving IBF Flag!
 */
export const SaigonSkylineSvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 900 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="skylineOrange" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF9F1C" />
          <stop offset="55%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="riverReflection" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
          <stop offset="30%" stopColor="#F59E0B" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#EF4444" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Subtle Night Stars & Lotus Lanterns in Sky */}
      {[
        { cx: 95, cy: 58, r: 2.5 },
        { cx: 215, cy: 42, r: 3 },
        { cx: 345, cy: 36, r: 2 },
        { cx: 470, cy: 48, r: 3.2 },
        { cx: 640, cy: 32, r: 2.5 },
        { cx: 810, cy: 62, r: 3 },
      ].map((star, idx) => (
        <circle
          key={idx}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="#FDE047"
          className="twinkle-star"
          style={{ animationDelay: `${idx * 0.4}s` }}
        />
      ))}

      {/* 1. Left Highrise Building (District 1 Modern Block) */}
      <g stroke="url(#skylineOrange)" strokeWidth="3.5" fill="rgba(249, 115, 22, 0.08)">
        <rect x="110" y="138" width="68" height="132" rx="2" />
        <rect x="118" y="128" width="52" height="10" />
        {/* Window grid */}
        {[152, 170, 188, 206, 224, 242].map((y) =>
          [122, 138, 154].map((x) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="10"
              height="11"
              strokeWidth="2"
              fill={(x + y) % 3 === 0 ? 'rgba(253, 224, 71, 0.35)' : 'none'}
            />
          ))
        )}
      </g>

      {/* 2. Bến Thành Market (Chợ Bến Thành) with Iconic Clock Tower */}
      <g stroke="url(#skylineOrange)" strokeWidth="3.5" fill="rgba(249, 115, 22, 0.08)">
        {/* Side wings */}
        <polygon points="168,215 215,186 215,270 168,270" />
        <polygon points="285,186 332,215 332,270 285,270" />
        {/* Central Hall & Clock Tower */}
        <rect x="215" y="182" width="70" height="88" />
        <polygon points="202,182 250,152 298,182" fill="rgba(234, 88, 12, 0.2)" />
        <rect x="225" y="148" width="50" height="34" />
        <polygon points="215,148 250,126 285,148" fill="rgba(234, 88, 12, 0.28)" />
        {/* Clock face */}
        <circle cx="250" cy="165" r="10" fill="#071710" stroke="#FDE047" strokeWidth="2.5" />
        <path d="M250 159 L250 165 L255 167" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
        {/* Market Archways */}
        <path d="M235 270 L235 225 A15 15 0 0 1 265 225 L265 270 Z" fill="rgba(253, 224, 71, 0.18)" />
        <path d="M184 270 L184 238 A10 10 0 0 1 204 238 L204 270 Z" />
        <path d="M296 270 L296 238 A10 10 0 0 1 316 238 L316 270 Z" />
      </g>

      {/* 3. Saigon Notre-Dame Cathedral (Nhà thờ Đức Bà Sài Gòn) */}
      <g stroke="url(#skylineOrange)" strokeWidth="3.5" fill="rgba(249, 115, 22, 0.08)">
        {/* Left Spire */}
        <rect x="346" y="148" width="34" height="122" />
        <polygon points="343,148 363,86 383,148" fill="rgba(249, 115, 22, 0.22)" />
        <path d="M363 72 L363 86 M357 78 L369 78" stroke="#FDE047" strokeWidth="2.5" />
        {/* Right Spire */}
        <rect x="428" y="148" width="34" height="122" />
        <polygon points="425,148 445,86 465,148" fill="rgba(249, 115, 22, 0.22)" />
        <path d="M445 72 L445 86 M439 78 L451 78" stroke="#FDE047" strokeWidth="2.5" />
        {/* Central Nave & Rose Window */}
        <polygon points="380,192 404,162 428,192 428,270 380,270" />
        <circle cx="404" cy="206" r="12" fill="#071710" stroke="#FDE047" strokeWidth="2.5" />
        <circle cx="404" cy="206" r="5" fill="#F97316" />
        {/* Cathedral Arches */}
        <path d="M393 270 L393 236 A11 11 0 0 1 415 236 L415 270 Z" fill="rgba(253, 224, 71, 0.2)" />
        <rect x="356" y="164" width="14" height="22" rx="7" />
        <rect x="438" y="164" width="14" height="22" rx="7" />
      </g>

      {/* 4. Landmark 81 (Supertall Stepped Skyscraper) */}
      <g stroke="url(#skylineOrange)" strokeWidth="3.5" fill="rgba(249, 115, 22, 0.1)">
        <rect x="482" y="210" width="20" height="60" />
        <rect x="502" y="160" width="18" height="110" />
        <rect x="520" y="96" width="18" height="174" />
        <rect x="538" y="48" width="16" height="222" fill="rgba(253, 224, 71, 0.14)" />
        <line x1="546" y1="18" x2="546" y2="48" stroke="#FDE047" strokeWidth="3" />
        <circle cx="546" cy="16" r="4" fill="#EF4444" className="beacon-pulse" />
        <rect x="554" y="118" width="18" height="152" />
        <rect x="572" y="176" width="18" height="94" />
      </g>

      {/* 5. Central Pyramid Spire + Waving IBF Flag (From the Dragonbal Logo!) */}
      <g>
        {/* Flagpole */}
        <line x1="635" y1="26" x2="635" y2="112" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="635" cy="24" r="5" fill="#FDE047" />
        {/* Animated Waving Red IBF Flag */}
        <g transform="translate(637, 28)">
          <g className="ibf-flag-wave">
          <path
            d="M0 0 C 28 -6, 52 8, 82 2 L 82 54 C 52 60, 28 46, 0 52 Z"
            fill="#DC2626"
            stroke="#7F1D1D"
            strokeWidth="2.5"
          />
          <text
            x="14"
            y="24"
            fill="#FFFFFF"
            fontFamily="Georgia, serif"
            fontWeight="900"
            fontStyle="italic"
            fontSize="22"
          >
            I
          </text>
          <text
            x="27"
            y="29"
            fill="#FFFFFF"
            fontFamily="Georgia, serif"
            fontWeight="900"
            fontStyle="italic"
            fontSize="20"
          >
            B
          </text>
          <text
            x="32"
            y="47"
            fill="#FFFFFF"
            fontFamily="Georgia, serif"
            fontWeight="900"
            fontStyle="italic"
            fontSize="22"
          >
            F
          </text>
          </g>
        </g>

        {/* Pyramid Tower Base */}
        <polygon
          points="598,270 635,108 672,270"
          stroke="url(#skylineOrange)"
          strokeWidth="3.5"
          fill="rgba(249, 115, 22, 0.14)"
        />
        <rect
          x="672"
          y="168"
          width="32"
          height="102"
          stroke="url(#skylineOrange)"
          strokeWidth="3.5"
          fill="rgba(249, 115, 22, 0.08)"
        />
      </g>

      {/* 6. Bitexco Financial Tower with Iconic Lotus Helipad */}
      <g stroke="url(#skylineOrange)" strokeWidth="3.5" fill="rgba(249, 115, 22, 0.12)">
        {/* Helipad sticking out to the left */}
        <ellipse
          cx="724"
          cy="118"
          rx="22"
          ry="5.5"
          fill="#F97316"
          stroke="#FDE047"
          strokeWidth="2.5"
        />
        <path d="M718 123 L742 138" stroke="#F97316" strokeWidth="4" />
        {/* Curved Lotus Tower */}
        <path d="M716 270 Q732 140 755 64 Q772 56 776 74 L788 270 Z" />
        {/* Horizontal glass ribs */}
        {[88, 106, 124, 142, 160, 178, 196, 214, 232, 250].map((y, idx) => (
          <line
            key={y}
            x1={748 - idx * 2.8}
            y1={y}
            x2={776 + idx * 1.1}
            y2={y}
            stroke="#FB923C"
            strokeWidth="2.2"
          />
        ))}
      </g>

      {/* Ground Baseline & Saigon River Shimmer */}
      <line x1="60" y1="270" x2="840" y2="270" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
      <path
        d="M80 284 Q 260 276, 450 284 T 820 284"
        stroke="url(#riverReflection)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M140 298 Q 320 290, 510 298 T 770 298"
        stroke="url(#riverReflection)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

/**
 * Traditional Vietnamese Silk Lantern (Đèn Lồng Hội An / Sài Gòn)
 */
export const SilkLanternSvg: React.FC<{
  color?: 'crimson' | 'gold' | 'jade';
  size?: number;
  className?: string;
}> = ({ color = 'crimson', size = 64, className = '' }) => {
  const fills = {
    crimson: { main: '#E11D48', rib: '#FACC15', glow: '#FB7185' },
    gold: { main: '#F59E0B', rib: '#FEF08A', glow: '#FDE047' },
    jade: { main: '#059669', rib: '#FACC15', glow: '#34D399' },
  }[color];

  return (
    <svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 80 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hanging Cord */}
      <line x1="40" y1="0" x2="40" y2="18" stroke="#FACC15" strokeWidth="2.5" />
      {/* Top Crown */}
      <rect x="26" y="16" width="28" height="6" rx="2" fill="#78350F" stroke="#FACC15" strokeWidth="1.5" />
      {/* Lantern Silk Body */}
      <ellipse cx="40" cy="48" rx="30" ry="26" fill={fills.main} stroke={fills.rib} strokeWidth="2" />
      <ellipse cx="40" cy="48" rx="20" ry="26" stroke={fills.rib} strokeWidth="1.5" opacity="0.75" />
      <ellipse cx="40" cy="48" rx="9" ry="26" stroke={fills.rib} strokeWidth="1.5" opacity="0.75" />
      {/* Inner Warm Candle Glow */}
      <circle cx="40" cy="48" r="11" fill={fills.glow} opacity="0.65" />
      {/* Bottom Base */}
      <rect x="28" y="72" width="24" height="6" rx="2" fill="#78350F" stroke="#FACC15" strokeWidth="1.5" />
      {/* Swaying Silk Tassel */}
      <circle cx="40" cy="84" r="3.5" fill="#FACC15" />
      <path
        d="M40 87 L34 122 M40 87 L40 125 M40 87 L46 122"
        stroke={fills.rib}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Custom Vector Balut Die with Traditional Asian Red 1 & 4 Pips
 */
export const BalutDieSvg: React.FC<{
  value: number;
  rolling?: boolean;
  held?: boolean;
  onClick?: () => void;
}> = ({ value, rolling = false, held = false, onClick }) => {
  const pipPositions: Record<number, Array<[number, number]>> = {
    1: [[50, 50]],
    2: [
      [28, 28],
      [72, 72],
    ],
    3: [
      [26, 26],
      [50, 50],
      [74, 74],
    ],
    4: [
      [28, 28],
      [72, 28],
      [28, 72],
      [72, 72],
    ],
    5: [
      [26, 26],
      [74, 26],
      [50, 50],
      [26, 74],
      [74, 74],
    ],
    6: [
      [28, 24],
      [72, 24],
      [28, 50],
      [72, 50],
      [28, 76],
      [72, 76],
    ],
  };

  const isRedPip = value === 1 || value === 4;
  const pips = pipPositions[value] || pipPositions[6];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`die-button ${rolling ? 'die-rolling' : ''} ${held ? 'die-held' : ''}`}
      title={held ? 'Held (click to release)' : 'Click to hold/lock this die'}
    >
      <svg viewBox="0 0 100 100" className="die-svg">
        <defs>
          <linearGradient id="dieSurface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="20"
          fill="url(#dieSurface)"
          stroke={held ? '#F59E0B' : '#CBD5E1'}
          strokeWidth={held ? '5' : '3'}
        />
        {/* Inner beveled recess */}
        <rect
          x="14"
          y="14"
          width="72"
          height="72"
          rx="14"
          fill="none"
          stroke="rgba(15, 23, 42, 0.06)"
          strokeWidth="2"
        />
        {pips.map(([cx, cy], idx) => (
          <circle
            key={idx}
            cx={cx}
            cy={cy}
            r={value === 1 ? 13 : 8.5}
            fill={isRedPip ? '#DC2626' : '#0F172A'}
          />
        ))}
      </svg>
      {held && <span className="die-held-badge">LOCKED</span>}
    </button>
  );
};
