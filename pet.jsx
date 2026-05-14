// =============================================================================
// PET COMPANION — Raposa CSS Art
// 8 stages of evolution built with pure CSS divs (no SVG paths)
// =============================================================================

function PetSprite({ stage, sick = false, size = 130, ascended = false }) {
  const info = window.DA.PET_STAGES[Math.max(0, Math.min(7, stage - 1))];
  const { accent, glow } = info;
  const s = size / 130;
  const u = n => `${n * s}px`;

  const breathAnim = sick
    ? 'pet-sick-tremble 0.8s ease-in-out infinite'
    : 'pet-breath 2.6s ease-in-out infinite, pet-bob 3.2s ease-in-out infinite';

  // Fox body palette per stage — warm orange spectrum, golden at ascension
  const palettes = [
    null, null,
    { body: '#F5A06A', dark: '#C86830', ear: '#E06840', light: '#FFF0DC' }, // 3
    { body: '#F09050', dark: '#C05A20', ear: '#D86030', light: '#FFF0DC' }, // 4
    { body: '#E87B3A', dark: '#B84E18', ear: '#D05828', light: '#FFF0DC' }, // 5
    { body: '#D97030', dark: '#A44018', ear: '#C04820', light: '#FFFADC' }, // 6
    { body: '#C96820', dark: '#963810', ear: '#B04018', light: '#FFFADC' }, // 7
    { body: '#D4901A', dark: '#A06010', ear: '#C07018', light: '#FFFCE8' }, // 8
  ];
  const pal = sick
    ? { body: '#C8A888', dark: '#907060', ear: '#B09070', light: '#F0E8DC' }
    : (palettes[stage - 1] || palettes[2]);

  // ── EGG STAGES (1-2) ──────────────────────────────────────────────
  if (stage <= 2) {
    const cracked = stage === 2;
    return (
      <div style={{ position: 'relative', width: u(130), height: u(160), overflow: 'visible' }}>
        {/* Ground shadow */}
        <div style={{
          position: 'absolute', bottom: u(2), left: '50%', transform: 'translateX(-50%)',
          width: u(70), height: u(10), borderRadius: '50%',
          background: 'rgba(12,13,18,0.18)',
        }} />

        {/* Energy aura when cracked */}
        {cracked && (
          <div style={{
            position: 'absolute', top: u(15), left: '50%', transform: 'translateX(-50%)',
            width: u(110), height: u(130), borderRadius: '50%',
            background: `radial-gradient(circle, ${glow}55, transparent 65%)`,
            animation: 'pet-glow-pulse 1.4s ease-in-out infinite',
          }} />
        )}

        {/* Egg body */}
        <div style={{
          position: 'absolute', top: u(20), left: '50%', transform: 'translateX(-50%)',
          width: u(86), height: u(105),
          borderRadius: '50% 50% 50% 50% / 38% 38% 62% 62%',
          background: `radial-gradient(ellipse at 38% 32%, #ffffff, ${info.color} 52%, ${accent} 90%)`,
          boxShadow: `0 0 ${cracked ? 20 * s : 10 * s}px ${glow}${cracked ? '88' : '44'}, inset -${4 * s}px -${6 * s}px ${12 * s}px rgba(0,0,0,0.12)`,
          border: `${1.5 * s}px solid ${accent}55`,
          animation: cracked ? 'pet-egg-crack 1.8s ease-in-out infinite' : 'pet-egg-shake 3.6s ease-in-out infinite',
        }}>
          {cracked && (
            <>
              {/* Cracks */}
              <div style={{
                position: 'absolute', top: u(22), left: u(18),
                width: u(2.5), height: u(32), background: `${accent}bb`,
                borderRadius: u(2), transform: 'rotate(-22deg)',
              }} />
              <div style={{
                position: 'absolute', top: u(30), left: u(24),
                width: u(2.5), height: u(18), background: `${accent}99`,
                borderRadius: u(2), transform: 'rotate(28deg)',
              }} />
              <div style={{
                position: 'absolute', top: u(35), right: u(18),
                width: u(2.5), height: u(24), background: `${accent}88`,
                borderRadius: u(2), transform: 'rotate(16deg)',
              }} />
              {/* Peeking eye */}
              <div style={{
                position: 'absolute', top: u(50), left: '50%', transform: 'translateX(-50%)',
                width: u(14), height: u(16), borderRadius: '50%',
                background: 'white', border: `${1.5 * s}px solid ${accent}88`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: u(7), height: u(8), borderRadius: '50%', background: accent }} />
              </div>
            </>
          )}
        </div>

        {/* Stage 1 sparkle dots */}
        {!cracked && [[28, 30], [22, 82], [95, 46], [88, 85], [56, 22]].map(([top, left], i) => (
          <div key={i} style={{
            position: 'absolute', top: u(top), left: u(left),
            width: u(5), height: u(5), borderRadius: '50%',
            background: accent, boxShadow: `0 0 ${6 * s}px ${glow}`,
            animation: `sparkle-twinkle 2.2s ease-in-out ${i * 0.4}s infinite`,
          }} />
        ))}
      </div>
    );
  }

  // ── FOX STAGES (3-8) ──────────────────────────────────────────────
  const showPaws = stage >= 4;
  const showArms = stage >= 5 && stage < 7;
  const showScarf = stage === 5;
  const showToga = stage >= 7;
  const showBook = stage >= 7;
  const showHalo = stage === 8;
  const showAura = stage === 8;
  const showSparkles = stage >= 6 && !sick;

  // Body grows slightly with stage
  const bodyW = 64 + (stage - 3) * 3;
  const bodyH = 50 + (stage - 3) * 2;
  const headW = 78 + (stage - 3) * 2;
  const headH = 72 + (stage - 3) * 2;

  return (
    <div style={{ position: 'relative', width: u(130), height: u(160), overflow: 'visible' }}>

      {/* Aura (stage 8) */}
      {showAura && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: u(165), height: u(165), borderRadius: '50%',
          background: `radial-gradient(circle, ${glow}44, transparent 60%)`,
          animation: 'pet-aura-pulse 3s ease-in-out infinite',
          pointerEvents: 'none', zIndex: 0,
        }} />
      )}

      {/* Ground shadow */}
      <div style={{
        position: 'absolute', bottom: u(2), left: '50%', transform: 'translateX(-50%)',
        width: u(72), height: u(10), borderRadius: '50%',
        background: 'rgba(12,13,18,0.18)', zIndex: 1,
      }} />

      {/* Halo (stage 8) */}
      {showHalo && (
        <div style={{
          position: 'absolute', top: u(6), left: '50%', transform: 'translateX(-50%)',
          width: u(54), height: u(14), borderRadius: '50%',
          border: `${2 * s}px solid ${glow}`,
          boxShadow: `0 0 ${8 * s}px ${glow}, 0 0 ${16 * s}px ${glow}55`,
          animation: 'pet-halo-spin 4s linear infinite', zIndex: 5,
        }} />
      )}

      {/* Animated group (breath + bob) */}
      <div style={{
        animation: breathAnim, transformOrigin: 'center bottom',
        position: 'absolute', inset: 0, zIndex: 2,
      }}>

        {/* ═══ TAIL ═══ */}
        <div style={{
          position: 'absolute', bottom: u(12), right: u(0),
          width: u(55), height: u(66),
          borderRadius: `${u(50)} ${u(28)} ${u(20)} ${u(40)}`,
          background: `radial-gradient(ellipse at 35% 30%, ${pal.body}ee, ${pal.dark})`,
          boxShadow: `inset -${4 * s}px -${5 * s}px ${10 * s}px rgba(0,0,0,0.15)`,
          zIndex: 1,
        }}>
          {/* Fluffy white tip */}
          <div style={{
            position: 'absolute', bottom: u(3), right: u(1),
            width: u(26), height: u(21),
            borderRadius: '60% 60% 50% 50% / 50% 50% 60% 60%',
            background: 'radial-gradient(circle at 45% 40%, white, #f4ede0)',
          }} />
        </div>

        {/* ═══ BODY ═══ */}
        <div style={{
          position: 'absolute', bottom: u(12), left: '50%', transform: 'translateX(-50%)',
          width: u(bodyW), height: u(bodyH),
          borderRadius: `${u(28)} ${u(28)} ${u(22)} ${u(22)}`,
          background: `radial-gradient(ellipse at 38% 28%, ${pal.body}ff, ${pal.dark})`,
          boxShadow: `inset -${3 * s}px -${3 * s}px ${8 * s}px rgba(0,0,0,0.2), 0 ${2 * s}px ${8 * s}px rgba(0,0,0,0.1)`,
          zIndex: 2,
        }}>
          {/* Belly patch */}
          <div style={{
            position: 'absolute', bottom: u(7), left: '50%', transform: 'translateX(-50%)',
            width: u(36), height: u(28), borderRadius: '50%',
            background: `radial-gradient(circle, ${pal.light}, ${pal.light}88)`,
          }} />

          {/* Toga overlay (stage 7+) */}
          {showToga && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 'inherit',
              background: 'linear-gradient(175deg, transparent 20%, rgba(15,8,40,0.88) 55%)',
            }}>
              {/* V-collar */}
              <div style={{
                position: 'absolute', top: u(4), left: '50%', transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: `${10 * s}px solid transparent`,
                borderRight: `${10 * s}px solid transparent`,
                borderTop: `${14 * s}px solid #C9A961`,
              }} />
            </div>
          )}

          {/* Paws */}
          {showPaws && ['left', 'right'].map(side => (
            <div key={side} style={{
              position: 'absolute', bottom: u(-10),
              [side]: u(5),
              width: u(20), height: u(13),
              borderRadius: `${u(6)} ${u(6)} ${u(9)} ${u(9)}`,
              background: `radial-gradient(ellipse at 40% 30%, ${pal.body}, ${pal.dark})`,
              boxShadow: `0 ${2 * s}px ${5 * s}px rgba(0,0,0,0.15)`,
            }}>
              {[6, 11].map(x => (
                <div key={x} style={{
                  position: 'absolute', top: u(4), left: u(x),
                  width: u(1.5), height: u(7),
                  background: `${pal.dark}55`, borderRadius: u(1),
                }} />
              ))}
            </div>
          ))}
        </div>

        {/* ═══ ARMS (stage 5-6) ═══ */}
        {showArms && [
          { left: u(12), rot: '-18deg' },
          { right: u(12), rot: '18deg' },
        ].map((sty, i) => (
          <div key={i} style={{
            position: 'absolute', top: u(92),
            ...(sty.left ? { left: sty.left } : { right: sty.right }),
            width: u(14), height: u(26),
            borderRadius: `${u(7)} ${u(7)} ${u(9)} ${u(9)}`,
            background: `radial-gradient(ellipse at 40% 30%, ${pal.body}, ${pal.dark})`,
            transform: `rotate(${sty.rot})`,
            transformOrigin: 'top center', zIndex: 1,
          }} />
        ))}

        {/* Scarf (stage 5) */}
        {showScarf && (
          <div style={{
            position: 'absolute', top: u(100), left: '50%', transform: 'translateX(-50%)',
            width: u(60), height: u(10), borderRadius: u(5),
            background: `linear-gradient(90deg, ${accent}, ${info.color}cc, ${accent})`,
            boxShadow: `0 0 ${6 * s}px ${glow}66`, zIndex: 3,
          }} />
        )}

        {/* Book (stage 7+) */}
        {showBook && (
          <div style={{
            position: 'absolute', bottom: u(28), right: u(3),
            width: u(26), height: u(20), borderRadius: u(3),
            background: '#C9A961', border: `${1.5 * s}px solid #5a1fa0`,
            zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 ${2 * s}px ${6 * s}px rgba(0,0,0,0.2)`,
          }}>
            <span style={{ fontSize: `${8 * s}px`, color: '#3a1070' }}>⚖</span>
          </div>
        )}

        {/* ═══ HEAD ═══ */}
        <div style={{
          position: 'absolute', top: u(28), left: '50%', transform: 'translateX(-50%)',
          width: u(headW), height: u(headH), borderRadius: '50%',
          background: `radial-gradient(ellipse at 38% 33%, ${pal.body}ff, ${pal.dark})`,
          boxShadow: `inset -${4 * s}px -${4 * s}px ${10 * s}px rgba(0,0,0,0.2), 0 ${4 * s}px ${12 * s}px rgba(0,0,0,0.1)`,
          zIndex: 4,
        }}>

          {/* EARS */}
          {[{ left: u(6) }, { right: u(6) }].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', top: u(-25), ...pos,
              width: u(26), height: u(30),
              clipPath: 'polygon(50% 0%, 2% 100%, 98% 100%)',
              background: `linear-gradient(170deg, ${pal.ear} 40%, ${pal.dark})`,
            }}>
              {/* Inner ear */}
              <div style={{
                position: 'absolute', top: '28%', left: '18%',
                width: '64%', height: '52%',
                clipPath: 'polygon(50% 0%, 5% 100%, 95% 100%)',
                background: sick ? '#c09090' : 'rgba(255,148,148,0.75)',
              }} />
            </div>
          ))}

          {/* Muzzle */}
          <div style={{
            position: 'absolute', bottom: u(10), left: '50%', transform: 'translateX(-50%)',
            width: u(40), height: u(26), borderRadius: '50%',
            background: `radial-gradient(ellipse at 50% 38%, ${pal.light}, ${pal.body}99)`,
          }} />

          {/* EYES */}
          {[{ left: u(10) }, { right: u(10) }].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', top: u(20), ...pos,
              width: u(18), height: sick ? u(14) : u(20),
              borderRadius: '50%', background: 'white',
              border: `${1.2 * s}px solid rgba(80,40,0,0.25)`, overflow: 'hidden',
            }}>
              {/* Pupil */}
              <div style={{
                position: 'absolute',
                top: sick ? u(3) : u(5),
                left: sick ? u(3) : u(4),
                width: sick ? u(9) : u(11),
                height: sick ? u(9) : u(13),
                borderRadius: '50%', background: '#1a0a00',
              }}>
                {!sick && (
                  <div style={{
                    position: 'absolute', top: u(1.5), right: u(1),
                    width: u(3.5), height: u(3.5),
                    borderRadius: '50%', background: 'white',
                  }} />
                )}
              </div>
            </div>
          ))}

          {/* Sad eyebrows (sick) */}
          {sick && ['left', 'right'].map((side, i) => (
            <div key={side} style={{
              position: 'absolute', top: u(12),
              [side]: u(7),
              width: u(18), height: u(2.5),
              background: 'rgba(80,40,0,0.6)', borderRadius: u(2),
              transform: `rotate(${i === 0 ? 14 : -14}deg)`,
              transformOrigin: i === 0 ? 'right center' : 'left center',
            }} />
          ))}

          {/* Nose */}
          <div style={{
            position: 'absolute', bottom: u(19), left: '50%', transform: 'translateX(-50%)',
            width: u(10), height: u(7), borderRadius: '50%',
            background: sick ? '#5a3030' : '#1a0808',
            boxShadow: `0 ${s}px ${3 * s}px rgba(0,0,0,0.4)`,
          }}>
            {/* Nose shine */}
            <div style={{
              position: 'absolute', top: u(1.5), left: u(2),
              width: u(3), height: u(2), borderRadius: '50%',
              background: 'rgba(255,255,255,0.4)',
            }} />
          </div>

          {/* Mouth */}
          {sick ? (
            <div style={{
              position: 'absolute', bottom: u(11), left: '50%', transform: 'translateX(-50%)',
              width: u(16), height: u(7),
              borderTop: `${1.8 * s}px solid rgba(80,40,0,0.65)`,
              borderLeft: `${1.8 * s}px solid rgba(80,40,0,0.65)`,
              borderRight: `${1.8 * s}px solid rgba(80,40,0,0.65)`,
              borderRadius: `${u(8)} ${u(8)} 0 0`,
            }} />
          ) : (
            <div style={{
              position: 'absolute', bottom: u(11), left: '50%', transform: 'translateX(-50%)',
              width: u(16), height: u(7),
              borderBottom: `${1.8 * s}px solid rgba(80,40,0,0.65)`,
              borderLeft: `${1.8 * s}px solid rgba(80,40,0,0.65)`,
              borderRight: `${1.8 * s}px solid rgba(80,40,0,0.65)`,
              borderRadius: `0 0 ${u(8)} ${u(8)}`,
            }} />
          )}

          {/* Cheek blush */}
          {!sick && ['left', 'right'].map(side => (
            <div key={side} style={{
              position: 'absolute', top: u(35),
              [side]: u(4),
              width: u(15), height: u(9), borderRadius: '50%',
              background: 'rgba(232,100,100,0.3)',
            }} />
          ))}
        </div>
      </div>

      {/* Sparkles (stage 6+) */}
      {showSparkles && [[18, 6], [108, 10], [10, 104], [112, 106], [6, 58], [118, 60]].map(([top, left], i) => (
        <div key={i} style={{
          position: 'absolute', top: u(top), left: u(left),
          width: u(7), height: u(7), background: glow,
          clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
          boxShadow: `0 0 ${6 * s}px ${glow}`,
          animation: `sparkle-twinkle 2.4s ease-in-out ${i * 0.4}s infinite`,
          zIndex: 5,
        }} />
      ))}

      {/* Sick effects */}
      {sick && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: u(34), left: u(16),
            fontSize: `${11 * s}px`,
            animation: 'pet-sweat-fall 2s ease-in-out infinite',
          }}>💧</div>
          <div style={{
            position: 'absolute', top: u(26), right: u(10),
            fontSize: `${12 * s}px`, color: '#7ec8e3', fontWeight: 700,
            animation: 'pet-zzz-float 3s ease-in-out infinite',
          }}>z</div>
          <div style={{
            position: 'absolute', top: u(16), right: u(4),
            fontSize: `${10 * s}px`, color: '#7ec8e3', fontWeight: 700,
            animation: 'pet-zzz-float 3s ease-in-out 0.7s infinite',
          }}>z</div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// PET COMPANION CARD — main UI shown on dashboard
// =============================================================================
function PetCompanion({ xp, sick = false, dailyLogs = [], dragonClass = 'mago' }) {
  const info = window.DA.getPetStageInfo(xp);
  const [hoverHelp, setHoverHelp] = React.useState(false);
  const daysOff = window.DA.daysSinceLastStudy(dailyLogs);
  const daysOffText = daysOff === Infinity ? null
    : daysOff === 0 ? 'Estudou hoje 💜'
    : daysOff === 1 ? 'Último estudo: ontem'
    : `${daysOff} dias sem estudar`;
  const classCfg = (window.ROL_getClassConfig && window.ROL_getClassConfig(dragonClass)) || null;

  return (
    <div className="glass" style={{
      padding: 18, display: 'flex', alignItems: 'center', gap: 18,
      position: 'relative', overflow: 'visible',
      borderColor: sick ? 'rgba(245,158,11,0.4)' : classCfg ? classCfg.colorSoft : undefined,
      background: sick
        ? 'linear-gradient(135deg, rgba(255,250,240,0.85), rgba(255,235,210,0.8))'
        : undefined,
      boxShadow: !sick && classCfg ? `0 0 0 1px ${classCfg.colorSoft}, 0 8px 32px -16px ${classCfg.glow}` : undefined,
    }}>
      {/* Pet sprite + class aura */}
      <div style={{ flexShrink: 0, width: 130, height: 130, position: 'relative' }}>
        {!sick && classCfg && (
          <div style={{
            position: 'absolute', inset: -14, borderRadius: '50%',
            background: classCfg.aura, opacity: 0.55, filter: 'blur(8px)',
            animation: 'pet-aura-pulse 4.5s ease-in-out infinite',
            pointerEvents: 'none', zIndex: 0,
          }} />
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <PetSprite stage={info.stage} sick={sick} size={130} />
        </div>
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
            FASE {info.stage} / 8
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
              🤒 DOENTINHA
            </span>
          )}
        </div>
        <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
          {info.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, fontStyle: 'italic', lineHeight: 1.35 }}>
          {sick
            ? 'Sua rapozinha está doentinha. Estude 2 dias seguidos para curá-la 💚'
            : info.desc}
        </div>

        {/* XP progress to next stage */}
        {info.next && (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-dim)', marginBottom: 3, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
              <span>até <span style={{ color: info.next.accent }}>{info.next.name}</span></span>
              <span className="num">{xp.toLocaleString('pt-BR')} / {info.next.minXp.toLocaleString('pt-BR')} XP</span>
            </div>
            <div style={{ height: 6, background: 'rgba(12,13,18,0.06)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${info.progress * 100}%`,
                background: `linear-gradient(90deg, ${info.accent}, ${info.glow})`,
                boxShadow: `0 0 8px ${info.glow}99`,
                transition: 'width 600ms ease',
              }} />
            </div>
          </div>
        )}

        {/* Last study indicator */}
        {daysOffText && (
          <div style={{ marginTop: 8, fontSize: 10.5, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            {daysOffText}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// EVOLUTION MODAL — full-screen celebration when pet evolves
// =============================================================================
function EvolutionModal({ fromStage, toStage, onClose }) {
  const fromInfo = window.DA.PET_STAGES[Math.max(0, fromStage - 1)];
  const toInfo = window.DA.PET_STAGES[Math.max(0, toStage - 1)];
  const [phase, setPhase] = React.useState('reveal');

  React.useEffect(() => {
    const t = setTimeout(() => setPhase('done'), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'radial-gradient(ellipse at center, rgba(91,71,184,0.4), rgba(12,13,18,0.85))',
      backdropFilter: 'blur(12px)',
      display: 'grid', placeItems: 'center', padding: 24,
      animation: 'fade-in 400ms ease-out',
    }}>
      <div style={{
        textAlign: 'center', maxWidth: 480,
        animation: 'slide-up 500ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.4em', color: toInfo.glow, marginBottom: 16,
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          textShadow: `0 0 14px ${toInfo.glow}`,
        }}>
          ✨ EVOLUÇÃO ✨
        </div>

        {/* Big pet sprite with glow halo */}
        <div style={{
          margin: '0 auto 24px', width: 220, height: 220, position: 'relative',
          animation: phase === 'reveal' ? 'pet-evolution-emerge 2.4s ease-out' : 'pet-bob 3s ease-in-out infinite',
        }}>
          {phase === 'reveal' && (
            <div style={{
              position: 'absolute', inset: '-40px', borderRadius: '50%',
              background: `radial-gradient(circle, ${toInfo.glow}aa, transparent 65%)`,
              animation: 'pet-burst 2s ease-out',
            }} />
          )}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <PetSprite stage={toStage} size={220} />
          </div>
        </div>

        <div style={{
          fontSize: 11, color: 'rgba(255,255,255,0.55)',
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.18em', fontWeight: 600,
          marginBottom: 4,
        }}>
          FASE {fromStage} <span style={{ color: toInfo.glow, padding: '0 8px' }}>→</span> FASE {toStage}
        </div>

        <div className="font-display" style={{
          fontSize: 36, fontWeight: 700, color: 'white',
          letterSpacing: '-0.02em', marginBottom: 10,
          textShadow: `0 0 20px ${toInfo.glow}88, 0 4px 20px rgba(0,0,0,0.5)`,
        }}>
          {toInfo.name}
        </div>

        <div style={{
          fontSize: 14, color: 'rgba(255,255,255,0.85)',
          maxWidth: 380, margin: '0 auto 28px', lineHeight: 1.5,
        }}>
          {toInfo.desc}
        </div>

        <button onClick={onClose} style={{
          padding: '14px 36px', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em',
          borderRadius: 12, border: `1.5px solid ${toInfo.glow}`,
          background: `linear-gradient(135deg, ${toInfo.color}, ${toInfo.accent})`,
          color: 'white', cursor: 'pointer',
          boxShadow: `0 6px 30px ${toInfo.glow}99, 0 0 20px ${toInfo.glow}55`,
          fontFamily: 'Space Grotesk, sans-serif',
          textShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}>
          CONTINUAR JORNADA →
        </button>
      </div>
    </div>
  );
}

// Small floating XP gain indicator (used when checks are toggled)
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
