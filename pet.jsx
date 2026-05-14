// ═════════════════════════════════════════════════════════════════════════════
// RISE OF A LEGEND — Pet Dragon V2 (3D Realista + Cute, estilo Bosses)
// Dragão roxo Pixar que evolui em 6 fases distintas, com brilho, partículas e
// animações no mesmo estilo de design dos bosses (boss-3d).
// ═════════════════════════════════════════════════════════════════════════════

// ── Animações injetadas (estilo boss-3d) ─────────────────────────────────────
(function injectPet3DAnimations() {
  if (document.getElementById('pet-3d-animations')) return;
  const style = document.createElement('style');
  style.id = 'pet-3d-animations';
  style.innerHTML = `
    @keyframes pet3d-hover-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes pet3d-breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }
    @keyframes pet3d-glow-pulse {
      0%, 100% { opacity: 0.35; transform: scale(1); }
      50% { opacity: 0.75; transform: scale(1.18); }
    }
    @keyframes pet3d-particle-orbit {
      0% {
        transform: rotate(var(--orbit-angle))
                   translateX(var(--orbit-radius))
                   rotate(calc(-1 * var(--orbit-angle)));
        opacity: 0;
      }
      10%, 90% { opacity: 1; }
      100% {
        transform: rotate(calc(var(--orbit-angle) + 360deg))
                   translateX(var(--orbit-radius))
                   rotate(calc(-1 * (var(--orbit-angle) + 360deg)));
        opacity: 0;
      }
    }
    @keyframes pet3d-twinkle {
      0%, 100% { opacity: 0; transform: scale(0.4) rotate(0deg); }
      50%      { opacity: 1; transform: scale(1.2) rotate(180deg); }
    }
    @keyframes pet3d-star-bob {
      0%, 100% { transform: translateY(0) scale(1); }
      50%      { transform: translateY(-4px) scale(1.1); }
    }
    @keyframes pet3d-crystal-spin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pet3d-zzz {
      0%   { transform: translate(0,0)    scale(0.6); opacity: 0; }
      30%  { opacity: 1; }
      100% { transform: translate(10px,-18px) scale(1.1); opacity: 0; }
    }
    @keyframes pet3d-cape-sway {
      0%, 100% { transform: skewX(0deg); }
      50%      { transform: skewX(2deg);  }
    }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────────────────────────────────────────
// DRAGON SVG — Renders the actual dragon at a given stage (1..6).
// All stages share a base palette + cute Pixar-style head/body.
// Each stage layers stage-specific accessories (egg shell, glasses, cape, etc.)
// ─────────────────────────────────────────────────────────────────────────────
function DragonSvg({ stage, sick, primary, accent, glow, shellColor }) {
  const dimBody  = sick ? '#c8c0d4' : primary;
  const dimAcc   = sick ? '#9c94a8' : accent;
  const fillBelly = sick ? '#ece6f0' : '#FBEFFB';
  const gid = `pet${stage}${sick ? 's' : ''}`;

  // ════════════════════════════════════════════════════════════════════════════
  // STAGE 1 — Filhote no Ovo (sleeping baby in cracked shell)
  // ════════════════════════════════════════════════════════════════════════════
  if (stage === 1) {
    return (
      <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id={`${gid}-shell`} cx="0.4" cy="0.4">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor={shellColor || '#FFF5E8'} />
            <stop offset="100%" stopColor="#E8D5B8" />
          </radialGradient>
          <radialGradient id={`${gid}-body`} cx="0.4" cy="0.3">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="40%" stopColor={dimBody} />
            <stop offset="100%" stopColor={dimAcc} />
          </radialGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="100" cy="184" rx="56" ry="6" fill="rgba(12,13,18,0.18)" />

        {/* Bottom half of egg shell — cradle */}
        <path d="M 50 130 Q 45 175, 90 188 L 110 188 Q 155 175, 150 130 Q 145 155, 100 158 Q 55 155, 50 130 Z"
          fill={`url(#${gid}-shell)`} stroke="#C9A961" strokeWidth="1.5"
          style={{ filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.15))` }} />

        {/* Crack edges on top of bottom shell */}
        <path d="M 50 130 L 60 125 L 70 132 L 80 124 L 92 130 L 102 122 L 112 130 L 124 124 L 134 130 L 144 125 L 150 130"
          fill="none" stroke="#C9A961" strokeWidth="1.8" strokeLinejoin="round" />

        {/* Floating top egg pieces (just hatched) */}
        <path d="M 45 100 Q 55 92, 68 96 L 60 110 Z" fill={`url(#${gid}-shell)`} stroke="#C9A961" strokeWidth="1.2"
          style={{ filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.2))`, transformOrigin: '55px 100px',
                   animation: 'pet3d-hover-float 3.5s ease-in-out infinite' }} />
        <path d="M 132 95 Q 145 90, 155 100 L 142 108 Z" fill={`url(#${gid}-shell)`} stroke="#C9A961" strokeWidth="1.2"
          style={{ filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.2))`, transformOrigin: '143px 100px',
                   animation: 'pet3d-hover-float 3.2s ease-in-out 0.4s infinite' }} />

        {/* Baby dragon nested inside, sleeping curled up */}
        <g style={{ animation: sick ? 'none' : 'pet3d-breathe 3s ease-in-out infinite', transformOrigin: '100px 145px' }}>
          {/* Tiny tail curled */}
          <path d="M 130 158 Q 145 160, 145 148 Q 142 142, 134 144" fill="none"
            stroke={dimAcc} strokeWidth="7" strokeLinecap="round" opacity="0.95" />
          {/* Body chubby */}
          <ellipse cx="100" cy="150" rx="32" ry="22" fill={`url(#${gid}-body)`} stroke={dimAcc} strokeWidth="1.4" />
          {/* Belly */}
          <ellipse cx="100" cy="156" rx="20" ry="13" fill={fillBelly} opacity="0.85" />
          {/* Head curled forward */}
          <ellipse cx="100" cy="132" rx="26" ry="22" fill={`url(#${gid}-body)`} stroke={dimAcc} strokeWidth="1.4" />
          {/* Snout */}
          <ellipse cx="100" cy="142" rx="11" ry="6.5" fill={fillBelly} opacity="0.9" />
          {/* Cheek blush */}
          {!sick && <>
            <ellipse cx="82" cy="139" rx="4.5" ry="3" fill="rgba(232,93,93,0.4)" />
            <ellipse cx="118" cy="139" rx="4.5" ry="3" fill="rgba(232,93,93,0.4)" />
          </>}
          {/* Closed sleeping eyes */}
          <path d="M 86 128 Q 90 132, 94 128" fill="none" stroke="#1a0a3a" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 106 128 Q 110 132, 114 128" fill="none" stroke="#1a0a3a" strokeWidth="1.8" strokeLinecap="round" />
          {/* Tiny content smile */}
          <path d="M 95 146 Q 100 149, 105 146" fill="none" stroke="#1a0a3a" strokeWidth="1.4" strokeLinecap="round" />
          {/* Tiny ear-fins */}
          <path d="M 74 125 Q 66 123, 68 132 Q 73 130, 76 128 Z" fill={dimAcc} opacity="0.85" />
          <path d="M 126 125 Q 134 123, 132 132 Q 127 130, 124 128 Z" fill={dimAcc} opacity="0.85" />
        </g>

        {/* Floating Z's (sleeping) */}
        {!sick && [0,1,2].map(i => (
          <text key={i} x={135 + i*7} y={85 - i*14} fontSize={12 + i*2}
            fill={accent} fontWeight="800" fontFamily="Space Grotesk, sans-serif"
            style={{ animation: `pet3d-zzz 3s ease-in-out ${i*0.7}s infinite`, opacity: 0 }}>
            z
          </text>
        ))}

        {/* Twinkle sparkles around */}
        {!sick && [[40,55],[160,60],[35,140],[170,135]].map(([cx,cy],i) => (
          <g key={`sp${i}`} transform={`translate(${cx} ${cy})`}
            style={{ animation: `pet3d-twinkle 2.2s ease-in-out ${i*0.5}s infinite` }}>
            <path d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z"
              fill={glow} style={{ filter: `drop-shadow(0 0 4px ${glow})` }} />
          </g>
        ))}
      </svg>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // STAGES 2..6 — Full dragon with stage-specific accessories
  // ════════════════════════════════════════════════════════════════════════════
  const showGlasses    = stage === 3 || stage === 4;
  const showAbcBlocks  = stage === 2;
  const showSmallBook  = stage === 3;
  const showBigBook    = stage === 4;
  const showCape       = stage >= 5;
  const showGavel      = stage === 5;
  const showScroll     = stage === 5;
  const showStar       = stage === 5;
  const showCrystal    = stage === 6;
  const showThrone     = stage === 6;
  const showAura       = stage === 6;
  const showHalo       = stage === 6;
  const showWings      = stage >= 3;
  const showHorns      = stage >= 3;
  const showFangs      = stage >= 3;
  const showArms       = stage >= 2;

  // Size progression — older dragons stand taller/more confident
  const bodyScale = stage === 2 ? 0.86 : stage === 3 ? 0.94 : stage === 4 ? 1.00 : stage === 5 ? 1.06 : 1.12;
  const wingSize  = stage === 3 ? 18  : stage === 4 ? 26  : stage === 5 ? 34  : 42;
  const hornSize  = stage === 3 ? 5   : stage === 4 ? 8   : stage === 5 ? 11  : 16;

  const bodyAnim = sick
    ? 'pet3d-breathe 1.6s ease-in-out infinite'
    : 'pet3d-breathe 3s ease-in-out infinite';

  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`${gid}-body`} cx="0.4" cy="0.3">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="40%" stopColor={dimBody} />
          <stop offset="100%" stopColor={dimAcc} />
        </radialGradient>
        <radialGradient id={`${gid}-belly`} cx="0.5" cy="0.4">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={fillBelly} />
        </radialGradient>
        <linearGradient id={`${gid}-wing`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={primary} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.65" />
        </linearGradient>
        <radialGradient id={`${gid}-crystal`} cx="0.4" cy="0.35">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#D9C5FF" />
          <stop offset="75%" stopColor="#7B67D8" />
          <stop offset="100%" stopColor="#3A2780" />
        </radialGradient>
        <radialGradient id={`${gid}-aura`} cx="0.5" cy="0.5">
          <stop offset="0%" stopColor={glow} stopOpacity="0.45" />
          <stop offset="55%" stopColor={glow} stopOpacity="0.12" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer magical aura — only legendary */}
      {showAura && !sick && (
        <circle cx="100" cy="115" r="96" fill={`url(#${gid}-aura)`}
          style={{ animation: 'pet3d-glow-pulse 3.5s ease-in-out infinite' }} />
      )}

      {/* Halo above head — legendary */}
      {showHalo && !sick && (
        <ellipse cx="100" cy="42" rx="34" ry="6.5" fill="none" stroke={glow} strokeWidth="2.8"
          opacity="0.88" style={{ filter: `drop-shadow(0 0 8px ${glow})` }} />
      )}

      {/* Throne of floating books (legendary) — behind dragon */}
      {showThrone && (
        <g style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))' }}>
          {/* Big stacked books at base */}
          <rect x="34" y="170" width="46" height="10" rx="1" fill="#8B5A2B" stroke="#5C3A1F" strokeWidth="1" />
          <rect x="36" y="165" width="42" height="6"  rx="1" fill="#D4B896" stroke="#8B5A2B" strokeWidth="0.6" />
          <rect x="120" y="170" width="46" height="10" rx="1" fill="#7D2B2B" stroke="#5A1F1F" strokeWidth="1" />
          <rect x="122" y="165" width="42" height="6"  rx="1" fill="#D4B896" stroke="#7D2B2B" strokeWidth="0.6" />
          <rect x="44" y="158" width="40" height="9"  rx="1" fill="#3A5F2A" stroke="#1F3A14" strokeWidth="1" />
          <rect x="125" y="158" width="38" height="9" rx="1" fill="#2A3A6A" stroke="#1A2440" strokeWidth="1" />
        </g>
      )}

      {/* Ground shadow */}
      <ellipse cx="100" cy={182} rx={42 * bodyScale} ry="5" fill="rgba(12,13,18,0.20)" />

      {/* Wings — behind body */}
      {showWings && (
        <g style={{
          animation: sick ? 'none' : 'pet3d-breathe 1.6s ease-in-out infinite',
          transformOrigin: '100px 110px',
          opacity: stage === 3 ? 0.85 : 1,
        }}>
          {/* Left wing */}
          <path d={`M 76 110
            Q ${76 - wingSize * 0.9} ${100 - wingSize * 0.7}
            ${72 - wingSize}        ${112 - wingSize * 0.25}
            Q ${74 - wingSize * 0.5} ${118 + wingSize * 0.1}
            ${78 - wingSize * 0.2}  ${118}
            Q 79 116, 80 110 Z`}
            fill={`url(#${gid}-wing)`} stroke={accent} strokeWidth="1.2" />
          {/* Right wing */}
          <path d={`M 124 110
            Q ${124 + wingSize * 0.9} ${100 - wingSize * 0.7}
            ${128 + wingSize}        ${112 - wingSize * 0.25}
            Q ${126 + wingSize * 0.5} ${118 + wingSize * 0.1}
            ${122 + wingSize * 0.2}  ${118}
            Q 121 116, 120 110 Z`}
            fill={`url(#${gid}-wing)`} stroke={accent} strokeWidth="1.2" />
          {/* Wing membrane lines (stage 5+) */}
          {stage >= 5 && (<>
            <path d={`M 76 110 L ${74 - wingSize * 0.4} ${108 - wingSize * 0.35}`}
              stroke={accent} strokeWidth="0.9" opacity="0.5" />
            <path d={`M 124 110 L ${126 + wingSize * 0.4} ${108 - wingSize * 0.35}`}
              stroke={accent} strokeWidth="0.9" opacity="0.5" />
          </>)}
        </g>
      )}

      {/* === Dragon main body group with breathing animation === */}
      <g style={{ animation: bodyAnim, transformOrigin: 'center 130px' }}>

        {/* Tail */}
        <g transform={`translate(${stage >= 4 ? 132 : 124} ${stage >= 4 ? 148 : 152})`}>
          <path d={stage <= 3
            ? "M0 0 Q 20 -2, 24 -18 Q 26 -26, 20 -28"
            : "M0 0 Q 28 -5, 32 -24 Q 35 -36, 27 -40 Q 20 -40, 18 -32"}
            fill="none" stroke={dimAcc}
            strokeWidth={stage <= 3 ? 8 : stage <= 4 ? 9 : 11}
            strokeLinecap="round" opacity="0.95" />
          {/* Diamond tail spike */}
          <path d={stage <= 3
            ? "M 15 -32 L 22 -24 L 15 -16 L 8 -24 Z"
            : "M 22 -46 L 30 -36 L 22 -26 L 14 -36 Z"}
            fill={dimAcc} stroke={accent} strokeWidth="1.2" />
        </g>

        {/* Body — chubby */}
        <ellipse cx="100" cy="132" rx={42 * bodyScale} ry={40 * bodyScale}
          fill={`url(#${gid}-body)`} stroke={accent} strokeWidth="1.6" />

        {/* Belly */}
        <ellipse cx="100" cy="142" rx={26 * bodyScale} ry={22 * bodyScale}
          fill={`url(#${gid}-belly)`} opacity="0.9" />

        {/* Belly scale dots (stage 5+) */}
        {stage >= 5 && [[88,124,1.8],[112,124,1.8],[80,138,1.6],[120,138,1.6],[100,128,1.4]].map(([cx,cy,r],i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={accent} opacity="0.32" />
        ))}

        {/* Cape (mentor + legendary) — flowing dark robe with gold trim */}
        {showCape && (
          <g style={{ animation: sick ? 'none' : 'pet3d-cape-sway 4s ease-in-out infinite',
                      transformOrigin: '100px 140px' }}>
            {/* Robe body */}
            <path d="M 68 138 Q 60 175, 50 192 L 150 192 Q 140 175, 132 138 L 130 142 Q 100 152, 70 142 Z"
              fill="#1a0a3a" stroke="#5A2FA0" strokeWidth="1.2" opacity="0.94"
              style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))' }} />
            {/* Gold trim left */}
            <path d="M 68 138 Q 60 175, 50 192" fill="none" stroke="#FFC107" strokeWidth="1.8" />
            {/* Gold trim right */}
            <path d="M 132 138 Q 140 175, 150 192" fill="none" stroke="#FFC107" strokeWidth="1.8" />
            {/* Collar */}
            <path d="M 78 140 L 100 152 L 122 140 Z" fill="#FFC107" opacity="0.92" />
            {/* Stitched line down center */}
            <line x1="100" y1="152" x2="100" y2="190" stroke="#FFC107" strokeWidth="0.8" opacity="0.55" strokeDasharray="2 2" />
          </g>
        )}

        {/* Head */}
        <ellipse cx="100" cy="98" rx={34 * bodyScale} ry={32 * bodyScale}
          fill={`url(#${gid}-body)`} stroke={accent} strokeWidth="1.6" />

        {/* Snout */}
        <ellipse cx="100" cy="110" rx={14 * bodyScale} ry={9 * bodyScale}
          fill={`url(#${gid}-belly)`} opacity="0.92" />

        {/* Nostrils */}
        <circle cx="95" cy="110" r="1.1" fill={accent} opacity="0.7" />
        <circle cx="105" cy="110" r="1.1" fill={accent} opacity="0.7" />

        {/* Horns */}
        {showHorns && (
          <g>
            {/* Left horn — curves up and slightly back */}
            <path d={stage === 6
              ? `M 80 78 Q 70 ${78 - hornSize * 1.4} 78 ${74 - hornSize * 1.8} Q 86 ${72 - hornSize * 0.8} 86 ${78}`
              : `M 84 ${82} Q 80 ${82 - hornSize} 86 ${78 - hornSize}`}
              fill={dimAcc} stroke={accent} strokeWidth="1.4" strokeLinejoin="round" />
            {/* Right horn */}
            <path d={stage === 6
              ? `M 120 78 Q 130 ${78 - hornSize * 1.4} 122 ${74 - hornSize * 1.8} Q 114 ${72 - hornSize * 0.8} 114 ${78}`
              : `M 116 ${82} Q 120 ${82 - hornSize} 114 ${78 - hornSize}`}
              fill={dimAcc} stroke={accent} strokeWidth="1.4" strokeLinejoin="round" />
            {/* Highlight on horns (stage 5+) */}
            {stage >= 5 && (<>
              <path d={`M 81 ${80} Q 79 ${80 - hornSize * 0.8} 82 ${76 - hornSize}`}
                fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <path d={`M 119 ${80} Q 121 ${80 - hornSize * 0.8} 118 ${76 - hornSize}`}
                fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            </>)}
          </g>
        )}

        {/* Ear-fins on sides of head */}
        <path d="M 68 92 Q 58 89, 60 103 Q 67 100, 71 98 Z" fill={dimAcc} opacity="0.88" />
        <path d="M 132 92 Q 142 89, 140 103 Q 133 100, 129 98 Z" fill={dimAcc} opacity="0.88" />

        {/* Star above head (mentor) */}
        {showStar && !sick && (
          <g transform="translate(100 38)"
             style={{ animation: 'pet3d-star-bob 2.4s ease-in-out infinite', transformOrigin: '100px 38px' }}>
            <path d="M 0 -10 L 3 -3 L 10 -2 L 4.5 3 L 6 10 L 0 6 L -6 10 L -4.5 3 L -10 -2 L -3 -3 Z"
              fill="#FFD700" stroke="#FFA500" strokeWidth="1.2"
              style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.85))' }} />
          </g>
        )}

        {/* Eyes — big & expressive */}
        <g>
          {/* Whites */}
          <ellipse cx="86" cy="96" rx="8" ry={sick ? 5 : 9} fill="#FFFFFF" stroke={accent} strokeWidth="1.1" />
          <ellipse cx="114" cy="96" rx="8" ry={sick ? 5 : 9} fill="#FFFFFF" stroke={accent} strokeWidth="1.1" />
          {/* Pupils (large for cuteness) */}
          <circle cx={sick ? 85 : 87} cy={sick ? 98 : 98} r={sick ? 2.8 : 5} fill="#1a0a3a" />
          <circle cx={sick ? 113 : 115} cy={sick ? 98 : 98} r={sick ? 2.8 : 5} fill="#1a0a3a" />
          {/* Pupil highlights */}
          {!sick && (<>
            <circle cx="89" cy="95" r="1.8" fill="#FFFFFF" />
            <circle cx="117" cy="95" r="1.8" fill="#FFFFFF" />
            <circle cx="86" cy="100" r="0.9" fill="#FFFFFF" opacity="0.7" />
            <circle cx="114" cy="100" r="0.9" fill="#FFFFFF" opacity="0.7" />
          </>)}
        </g>

        {/* Glasses (pupil + teen) — round lenses */}
        {showGlasses && (
          <g>
            <circle cx="86" cy="97" r="11" fill="none" stroke="#3a2a4a" strokeWidth="2" />
            <circle cx="114" cy="97" r="11" fill="none" stroke="#3a2a4a" strokeWidth="2" />
            <line x1="97" y1="97" x2="103" y2="97" stroke="#3a2a4a" strokeWidth="2" />
            {/* Reflective glint */}
            <path d="M 80 93 Q 82 90, 84 92" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.9" />
            <path d="M 108 93 Q 110 90, 112 92" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.9" />
          </g>
        )}

        {/* Sad eyebrows when sick */}
        {sick && (<>
          <path d="M 80 86 Q 86 89, 92 86" fill="none" stroke="#1a0a3a" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 108 86 Q 114 89, 120 86" fill="none" stroke="#1a0a3a" strokeWidth="1.6" strokeLinecap="round" />
        </>)}

        {/* Cheeks */}
        {!sick && (<>
          <ellipse cx="78" cy="108" rx="5.5" ry="3" fill="rgba(232,93,93,0.40)" />
          <ellipse cx="122" cy="108" rx="5.5" ry="3" fill="rgba(232,93,93,0.40)" />
        </>)}

        {/* Mouth */}
        {sick
          ? <path d="M 92 118 Q 100 114, 108 118" fill="none" stroke="#1a0a3a" strokeWidth="1.8" strokeLinecap="round" />
          : <path d="M 92 115 Q 100 121, 108 115" fill="none" stroke="#1a0a3a" strokeWidth="1.8" strokeLinecap="round" />}

        {/* Tiny fang */}
        {showFangs && !sick && (
          <path d="M 95 118 L 96.5 122 L 98 118 Z" fill="#FFFFFF" stroke="#1a0a3a" strokeWidth="0.5" />
        )}

        {/* Tiny arms / hands (visible when no cape) */}
        {showArms && !showCape && (<>
          <path d={`M 72 ${134} Q 62 ${140}, 62 ${150}`} fill="none" stroke={dimAcc} strokeWidth="6.5" strokeLinecap="round" />
          <path d={`M 128 ${134} Q 138 ${140}, 138 ${150}`} fill="none" stroke={dimAcc} strokeWidth="6.5" strokeLinecap="round" />
          {/* Tiny claws */}
          <circle cx="62" cy="150" r="4" fill={dimAcc} stroke={accent} strokeWidth="1" />
          <circle cx="138" cy="150" r="4" fill={dimAcc} stroke={accent} strokeWidth="1" />
        </>)}

        {/* Sleeves visible from cape */}
        {showCape && (<>
          <path d="M 72 138 Q 62 148, 64 162" fill="none" stroke="#1a0a3a" strokeWidth="9" strokeLinecap="round" />
          <path d="M 128 138 Q 138 148, 136 162" fill="none" stroke="#1a0a3a" strokeWidth="9" strokeLinecap="round" />
          {/* Gold cuffs */}
          <path d="M 60 158 L 68 165" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
          <path d="M 140 158 L 132 165" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
        </>)}

      </g>
      {/* ── end body group ── */}

      {/* ABC blocks (child dragon) */}
      {showAbcBlocks && (
        <g style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))' }}>
          {[['A','#E85D5D',38,162],['B','#FFD700',62,168],['C','#5B47B8',26,172]].map(([letter,col,x,y],i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <rect x="-9" y="-9" width="18" height="18" rx="2.5" fill={col} stroke="#1a0a3a" strokeWidth="1.2" />
              <text x="0" y="4" fontSize="13" fill="white" fontWeight="800" textAnchor="middle"
                fontFamily="Space Grotesk, sans-serif">{letter}</text>
            </g>
          ))}
        </g>
      )}

      {/* Small open book at the feet (curious pupil) */}
      {showSmallBook && (
        <g transform="translate(140 168)" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))' }}>
          <path d="M -15 0 L 0 -3 L 15 0 L 15 8 L 0 5 L -15 8 Z" fill="#FBEFFB" stroke={accent} strokeWidth="1.2" />
          <line x1="0" y1="-3" x2="0" y2="5" stroke={accent} strokeWidth="0.8" />
          <line x1="-12" y1="1" x2="-3" y2="-0.5" stroke={accent} strokeWidth="0.5" opacity="0.5" />
          <line x1="-12" y1="3" x2="-3" y2="1.5" stroke={accent} strokeWidth="0.5" opacity="0.5" />
          <line x1="3" y1="-0.5" x2="12" y2="1" stroke={accent} strokeWidth="0.5" opacity="0.5" />
          <line x1="3" y1="1.5" x2="12" y2="3" stroke={accent} strokeWidth="0.5" opacity="0.5" />
        </g>
      )}

      {/* Bigger book held in hands (teen dragon) */}
      {showBigBook && (
        <g transform="translate(100 156)" style={{ filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.22))' }}>
          <path d="M -22 -3 L 0 -8 L 22 -3 L 22 14 L 0 10 L -22 14 Z" fill="#FBEFFB" stroke="#3a2a4a" strokeWidth="1.5" />
          <line x1="0" y1="-8" x2="0" y2="10" stroke="#3a2a4a" strokeWidth="1" />
          {/* Text lines */}
          {[-1,2,5,8].map((y,i) => (
            <React.Fragment key={i}>
              <line x1="-18" y1={y} x2="-4" y2={y - 0.5} stroke={accent} strokeWidth="0.6" opacity="0.6" />
              <line x1="4" y1={y - 0.5} x2="18" y2={y} stroke={accent} strokeWidth="0.6" opacity="0.6" />
            </React.Fragment>
          ))}
          {/* Glasses-shaped decoration on the book */}
          <text x="0" y="-12" fontSize="6" fill={accent} textAnchor="middle" fontWeight="700"
            fontFamily="serif">⚖ LEX ⚖</text>
        </g>
      )}

      {/* Gavel (mentor) — held in right hand area */}
      {showGavel && (
        <g transform="translate(150 145) rotate(20)" style={{ filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.30))' }}>
          {/* Handle */}
          <rect x="-2" y="0" width="4" height="22" rx="1.5" fill="#8B5A2B" stroke="#5C3A1F" strokeWidth="0.8" />
          {/* Head */}
          <rect x="-9" y="-8" width="18" height="11" rx="2" fill="#A87445" stroke="#5C3A1F" strokeWidth="1" />
          {/* Gold band */}
          <rect x="-9" y="-3" width="18" height="2" fill="#FFD700" />
          {/* Highlight */}
          <rect x="-7" y="-7" width="14" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
        </g>
      )}

      {/* DPE-SP scroll (mentor) — to the left */}
      {showScroll && (
        <g transform="translate(36 158)" style={{ filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.25))' }}>
          {/* Scroll body */}
          <path d="M -14 -10 L 14 -10 L 14 12 L -14 12 Z" fill="#FBE9C6" stroke="#8B5A2B" strokeWidth="1.3" />
          {/* Top roll */}
          <ellipse cx="0" cy="-10" rx="14" ry="3" fill="#E8C97A" stroke="#8B5A2B" strokeWidth="1" />
          {/* Bottom roll */}
          <ellipse cx="0" cy="12" rx="14" ry="3" fill="#E8C97A" stroke="#8B5A2B" strokeWidth="1" />
          {/* DPE-SP text */}
          <text x="0" y="-1" fontSize="6.5" fill="#5A1FA0" fontWeight="800" textAnchor="middle"
            fontFamily="Space Grotesk, sans-serif">DPE-SP</text>
          <text x="0" y="7" fontSize="3.5" fill="#8B5A2B" textAnchor="middle"
            fontFamily="serif" fontStyle="italic">Legislação</text>
        </g>
      )}

      {/* Crystal ball + staff (legendary) */}
      {showCrystal && (
        <g style={{ filter: 'drop-shadow(0 4px 10px rgba(123,103,216,0.5))' }}>
          {/* Staff */}
          <line x1="158" y1="80" x2="148" y2="175" stroke="#8B5A2B" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="158" y1="80" x2="148" y2="175" stroke="#5C3A1F" strokeWidth="1" strokeDasharray="2 4" />
          {/* Holder claws */}
          <path d="M 152 70 Q 148 78, 156 80 Q 164 78, 160 70" fill={accent} stroke="#3a2a4a" strokeWidth="1" />
          {/* Crystal ball */}
          <circle cx="158" cy="62" r="13" fill={`url(#${gid}-crystal)`} stroke={accent} strokeWidth="1.5"
            style={{ animation: 'pet3d-glow-pulse 2.5s ease-in-out infinite' }} />
          {/* Inner light */}
          <circle cx="154" cy="58" r="4" fill="#FFFFFF" opacity="0.85" />
          <circle cx="161" cy="64" r="2" fill="#FFFFFF" opacity="0.5" />
          {/* Sparkles around crystal */}
          {[0,1,2,3].map(i => (
            <circle key={i} cx={158 + Math.cos(i * Math.PI / 2) * 20}
              cy={62 + Math.sin(i * Math.PI / 2) * 20} r="1.4" fill={glow}
              style={{ animation: `pet3d-twinkle 1.8s ease-in-out ${i * 0.4}s infinite` }} />
          ))}
        </g>
      )}

      {/* Background sparkles (stage 3+, healthy) */}
      {!sick && stage >= 3 && [[42,58],[160,58],[36,142],[170,142],[28,98],[178,98]].slice(0, stage - 1).map(([cx,cy],i) => (
        <g key={`bgs${i}`} transform={`translate(${cx} ${cy})`}
          style={{ animation: `pet3d-twinkle 2.4s ease-in-out ${i*0.4}s infinite` }}>
          <path d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z"
            fill={glow} style={{ filter: `drop-shadow(0 0 4px ${glow})` }} />
        </g>
      ))}

      {/* Sick effects */}
      {sick && (
        <g>
          <path d="M 75 75 Q 73 80, 75 84 Q 77 80, 75 75 Z" fill="#7ec8e3" stroke="#3a8eb8" strokeWidth="0.8" />
          <path d="M 125 78 Q 123 83, 125 87 Q 127 83, 125 78 Z" fill="#7ec8e3" stroke="#3a8eb8" strokeWidth="0.8" />
          <text x="155" y="55" fontSize="14" fill="#7ec8e3" fontWeight="700">z</text>
          <text x="165" y="40" fontSize="11" fill="#7ec8e3" fontWeight="700">z</text>
        </g>
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PET SPRITE — 3D boss-style avatar wrapper: circular glow + particles + dragon
// Backwards-compatible signature: stage, sick, size, ascended (ignored).
// ─────────────────────────────────────────────────────────────────────────────
function PetSprite({ stage, sick = false, size = 160 }) {
  const safeStage = Math.max(1, Math.min(6, stage));
  const info = window.DA.PET_STAGES[safeStage - 1];
  const primary  = info.color;
  const accent   = info.accent;
  const glow     = info.glow;
  const shellColor = info.shellColor;

  const orbitRadius = Math.round(size * 0.42);

  return (
    <div style={{
      width: size, height: size,
      position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      filter: sick ? 'grayscale(0.7) brightness(0.95)' : 'none',
      animation: sick ? 'pet-sick-tremble 0.8s ease-in-out infinite'
                      : 'pet3d-hover-float 3.6s ease-in-out infinite',
    }}>
      {/* Outer radial glow backdrop */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: `radial-gradient(circle, ${glow}, transparent 70%)`,
        zIndex: 0,
      }} />

      {/* Pulsing inner aura */}
      {!sick && (
        <div style={{
          position: 'absolute', inset: '-6%', borderRadius: '50%',
          background: `radial-gradient(circle, ${primary}33, transparent 60%)`,
          animation: 'pet3d-glow-pulse 2.6s ease-in-out infinite',
          zIndex: 0,
        }} />
      )}

      {/* SVG dragon — drop-shadow gives the 3D pop */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '88%', height: '88%',
        filter: sick ? `drop-shadow(0 4px 10px rgba(0,0,0,0.25))`
                     : `drop-shadow(0 8px 18px ${glow}) drop-shadow(0 0 16px ${glow})`,
      }}>
        <DragonSvg stage={safeStage} sick={sick} primary={primary} accent={accent}
          glow={glow} shellColor={shellColor} />
      </div>

      {/* Orbiting particles — 4 around the avatar */}
      {!sick && [0, 1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: Math.max(4, size * 0.04), height: Math.max(4, size * 0.04),
          marginTop: -3, marginLeft: -3,
          borderRadius: '50%',
          background: accent,
          boxShadow: `0 0 10px ${glow}, 0 0 4px ${accent}`,
          animation: `pet3d-particle-orbit ${3 + i * 0.5}s linear ${i * 0.5}s infinite`,
          ['--orbit-radius']: `${orbitRadius}px`,
          ['--orbit-angle']: `${i * 90}deg`,
          zIndex: 3,
        }} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PET COMPANION — Dashboard card (3D boss-style)
// ─────────────────────────────────────────────────────────────────────────────
function PetCompanion({ xp, sick = false, dailyLogs = [], dragonClass = 'mago' }) {
  const info = window.DA.getPetStageInfo(xp);
  const daysOff = window.DA.daysSinceLastStudy(dailyLogs);
  const daysOffText = daysOff === Infinity ? null
    : daysOff === 0 ? 'Estudou hoje 💜'
    : daysOff === 1 ? 'Último estudo: ontem'
    : `${daysOff} dias sem estudar`;
  const classCfg = (window.ROL_getClassConfig && window.ROL_getClassConfig(dragonClass)) || null;
  const totalStages = window.DA.PET_STAGES.length;

  return (
    <div className="glass" style={{
      padding: 20, display: 'flex', alignItems: 'center', gap: 22,
      position: 'relative', overflow: 'visible',
      borderColor: sick ? 'rgba(245,158,11,0.4)' : classCfg ? classCfg.colorSoft : undefined,
      background: sick
        ? 'linear-gradient(135deg, rgba(255,250,240,0.85), rgba(255,235,210,0.8))'
        : undefined,
      boxShadow: !sick && classCfg ? `0 0 0 1px ${classCfg.colorSoft}, 0 8px 32px -16px ${classCfg.glow}` : undefined,
    }}>
      {/* Pet 3D avatar with class aura halo behind */}
      <div style={{ flexShrink: 0, width: 160, height: 160, position: 'relative' }}>
        {!sick && classCfg && (
          <div style={{
            position: 'absolute', inset: -12, borderRadius: '50%',
            background: classCfg.aura, opacity: 0.55, filter: 'blur(10px)',
            animation: 'pet-aura-pulse 4.5s ease-in-out infinite',
            pointerEvents: 'none', zIndex: 0,
          }} />
        )}
        <PetSprite stage={info.stage} sick={sick} size={160} />
      </div>

      {/* Info / progress */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <span className="num" style={{
            fontSize: 9, padding: '2px 7px', borderRadius: 4,
            background: `${info.accent}22`, color: info.accent,
            fontWeight: 700, letterSpacing: '0.1em',
            border: `1px solid ${info.accent}55`,
          }}>
            FASE {info.stage} / {totalStages}
          </span>
          {classCfg && !sick && (
            <span className="num" style={{
              fontSize: 9, padding: '2px 7px', borderRadius: 4,
              background: classCfg.colorBg, color: classCfg.color,
              fontWeight: 700, letterSpacing: '0.1em',
              border: `1px solid ${classCfg.colorSoft}`,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ fontSize: 10, filter: `drop-shadow(0 0 3px ${classCfg.glow})` }}>{classCfg.icon}</span>
              {classCfg.name.toUpperCase()}
            </span>
          )}
          {window.DragonSubLevelDots && !sick && (
            <DragonSubLevelDots xp={xp} accent={info.accent} glow={info.glow} />
          )}
          {sick && (
            <span className="num" style={{
              fontSize: 9, padding: '2px 7px', borderRadius: 4,
              background: 'rgba(245,158,11,0.18)', color: '#a14e0c',
              fontWeight: 700, letterSpacing: '0.1em',
              border: '1px solid rgba(245,158,11,0.5)',
              animation: 'amber-pulse 2s ease-in-out infinite',
            }}>
              🤒 DOENTINHO
            </span>
          )}
        </div>

        <div className="font-display" style={{ fontSize: 19, fontWeight: 800, color: 'var(--text-primary)' }}>
          {info.name}
        </div>

        {info.flavor && !sick && (
          <div style={{ fontSize: 11.5, color: info.accent, fontStyle: 'italic', marginTop: 2, fontWeight: 600 }}>
            {info.flavor}
          </div>
        )}

        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
          {sick
            ? 'Sua dragãzinha está doentinha. Estude 2 dias seguidos para curá-la 💚'
            : info.desc}
        </div>

        {/* XP progress to next stage */}
        {info.next && (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10,
              color: 'var(--text-dim)', marginBottom: 3,
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
              <span>até <span style={{ color: info.next.accent }}>{info.next.name}</span></span>
              <span className="num">{xp.toLocaleString('pt-BR')} / {info.next.minXp.toLocaleString('pt-BR')} XP</span>
            </div>
            <div style={{ height: 7, background: 'rgba(12,13,18,0.06)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${info.progress * 100}%`,
                background: `linear-gradient(90deg, ${info.accent}, ${info.next.accent})`,
                boxShadow: `0 0 8px ${info.glow}`,
                transition: 'width 600ms ease',
              }} />
            </div>
          </div>
        )}

        {daysOffText && (
          <div style={{ marginTop: 8, fontSize: 10.5, color: 'var(--text-dim)',
            fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            {daysOffText}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVOLUTION MODAL — full-screen celebration when pet evolves
// ─────────────────────────────────────────────────────────────────────────────
function EvolutionModal({ fromStage, toStage, onClose }) {
  const toInfo = window.DA.PET_STAGES[Math.max(0, toStage - 1)];
  const [phase, setPhase] = React.useState('reveal');

  React.useEffect(() => {
    const t = setTimeout(() => setPhase('done'), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: `radial-gradient(ellipse at center, ${toInfo.glow}, rgba(12,13,18,0.92))`,
      backdropFilter: 'blur(12px)',
      display: 'grid', placeItems: 'center', padding: 24,
      animation: 'fade-in 400ms ease-out',
    }}>
      <div style={{
        textAlign: 'center', maxWidth: 500,
        animation: 'slide-up 500ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.4em', color: '#fff', marginBottom: 16,
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          textShadow: `0 0 14px ${toInfo.glow}`,
        }}>
          ✨ EVOLUÇÃO ✨
        </div>

        {/* Big pet sprite with glow burst */}
        <div style={{
          margin: '0 auto 24px', width: 260, height: 260, position: 'relative',
          animation: phase === 'reveal'
            ? 'pet-evolution-emerge 2.4s ease-out'
            : 'pet3d-hover-float 3.2s ease-in-out infinite',
        }}>
          {phase === 'reveal' && (
            <div style={{
              position: 'absolute', inset: '-50px', borderRadius: '50%',
              background: `radial-gradient(circle, ${toInfo.glow}, transparent 65%)`,
              animation: 'pet-burst 2s ease-out',
            }} />
          )}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <PetSprite stage={toStage} size={260} />
          </div>
        </div>

        <div style={{
          fontSize: 11, color: 'rgba(255,255,255,0.6)',
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.18em', fontWeight: 600,
          marginBottom: 4,
        }}>
          FASE {fromStage} <span style={{ color: '#fff', padding: '0 8px' }}>→</span> FASE {toStage}
        </div>

        <div className="font-display" style={{
          fontSize: 38, fontWeight: 800, color: 'white',
          letterSpacing: '-0.02em', marginBottom: 10,
          textShadow: `0 0 22px ${toInfo.glow}, 0 4px 20px rgba(0,0,0,0.5)`,
        }}>
          {toInfo.name}
        </div>

        {toInfo.flavor && (
          <div style={{
            fontSize: 14, color: '#fff', fontStyle: 'italic',
            marginBottom: 8, textShadow: `0 0 10px ${toInfo.glow}`,
            opacity: 0.95,
          }}>
            {toInfo.flavor}
          </div>
        )}

        <div style={{
          fontSize: 14, color: 'rgba(255,255,255,0.85)',
          maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.55,
        }}>
          {toInfo.desc}
        </div>

        <button onClick={onClose} style={{
          padding: '14px 36px', fontSize: 14, fontWeight: 800, letterSpacing: '0.12em',
          borderRadius: 12, border: `1.5px solid ${toInfo.glow}`,
          background: `linear-gradient(135deg, ${toInfo.color}, ${toInfo.accent})`,
          color: 'white', cursor: 'pointer',
          boxShadow: `0 6px 30px ${toInfo.glow}, 0 0 24px ${toInfo.glow}`,
          fontFamily: 'Space Grotesk, sans-serif',
          textShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}>
          CONTINUAR JORNADA →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// XP FLOATER — tiny floating XP gain indicator
// ─────────────────────────────────────────────────────────────────────────────
function XpFloater({ amount, onDone, x = '50%', y = '50%' }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 1100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: 'fixed', left: x, top: y, zIndex: 70,
      pointerEvents: 'none',
      fontSize: 16, fontWeight: 700,
      color: amount > 0 ? 'var(--esmeralda)' : 'var(--coral)',
      textShadow: amount > 0 ? '0 0 10px rgba(0,168,107,0.7)' : '0 0 10px rgba(232,93,93,0.7)',
      fontFamily: 'JetBrains Mono, monospace',
      animation: 'xp-float 1.1s ease-out forwards',
    }}>
      {amount > 0 ? '+' : ''}{amount} XP
    </div>
  );
}

window.PetSprite = PetSprite;
window.PetCompanion = PetCompanion;
window.EvolutionModal = EvolutionModal;
window.XpFloater = XpFloater;
window.DragonSvg = DragonSvg;
