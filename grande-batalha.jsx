// Rise of a Legend — Grande Batalha (countdown épico final, <7 dias)
// Aparece como banner especial no topo da aba HOJE quando a prova está MUITO próxima.

window.ROL_getGrandeBatalha = function (shared) {
  const concursos = (shared.concursos || []).filter((c) => c.date);
  if (concursos.length === 0) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let closest = null;
  let closestDays = Infinity;
  concursos.forEach((c) => {
    const d = new Date(c.date + 'T00:00:00');
    const days = Math.floor((d.getTime() - today.getTime()) / 86400000);
    if (days >= 0 && days <= 7 && days < closestDays) {
      closest = c;
      closestDays = days;
    }
  });
  return closest ? { exam: closest, daysLeft: closestDays } : null;
};

function GrandeBatalhaBanner({ shared }) {
  const gb = window.ROL_getGrandeBatalha(shared);
  if (!gb) return null;

  const bancaCfg = window.ROL_resolveBanca && gb.exam.banca ? window.ROL_resolveBanca(gb.exam.banca) : null;
  const isTomorrow = gb.daysLeft <= 1;
  const isToday = gb.daysLeft === 0;

  return (
    <div className="anim-slide-up" style={{
      padding: '18px 20px',
      marginBottom: 16,
      background: isToday
        ? 'linear-gradient(135deg, #1E2030 0%, #4A1F1F 50%, #1E2030 100%)'
        : 'linear-gradient(135deg, #0B3D5C 0%, #1E2030 50%, #5B47B8 100%)',
      borderRadius: 16,
      border: `1.5px solid ${isToday ? 'rgba(220,38,38,0.55)' : 'rgba(245,158,11,0.45)'}`,
      boxShadow: `0 0 0 1px ${isToday ? 'rgba(220,38,38,0.4)' : 'rgba(245,158,11,0.3)'}, 0 24px 64px -16px rgba(0,0,0,0.45)`,
      position: 'relative', overflow: 'hidden',
      color: 'white',
    }}>
      {/* Aurora background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 600px 300px at 20% 0%, ${isToday ? 'rgba(220,38,38,0.35)' : 'rgba(245,158,11,0.25)'}, transparent 60%),
                     radial-gradient(ellipse 500px 280px at 80% 100%, rgba(91,71,184,0.25), transparent 60%)`,
      }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{
          width: 64, height: 64, flexShrink: 0,
          display: 'grid', placeItems: 'center',
          borderRadius: 16,
          background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 75%)',
          border: '1px solid rgba(255,255,255,0.2)',
          fontSize: 36,
          filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))',
          animation: 'pet-aura-pulse 1.5s ease-in-out infinite',
        }}>{isToday ? '⚡' : '🏆'}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, letterSpacing: '0.3em',
            color: isToday ? '#FCA5A5' : '#FDE68A',
            fontFamily: 'JetBrains Mono, monospace', fontWeight: 800,
            textShadow: '0 0 12px currentColor',
          }}>
            {isToday ? '⚔️ HOJE É O DIA' : isTomorrow ? '⚔️ AMANHÃ É O DIA' : '⚔️ GRANDE BATALHA'}
          </div>
          <div className="font-display" style={{
            fontSize: 24, fontWeight: 800, marginTop: 4, letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FDE68A 60%, #C4B5FD 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textShadow: '0 0 24px rgba(167,139,250,0.4)', lineHeight: 1.1,
          }}>
            {gb.exam.name}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6, lineHeight: 1.5 }}>
            {isToday && '🐉 Hoje você prova que tudo isso valeu a pena. Vai com tudo!'}
            {isTomorrow && !isToday && '🌙 Última noite. Durma bem. Você se preparou para isso.'}
            {!isTomorrow && `Faltam ${gb.daysLeft} dias. Foque no essencial e descanse bem.`}
          </div>
          {bancaCfg && (
            <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>{bancaCfg.emoji}</span>
              <span>Boss: <strong style={{ color: 'rgba(255,255,255,0.95)' }}>{bancaCfg.creatureName}</strong> ({bancaCfg.bancaName})</span>
            </div>
          )}
        </div>

        {!isToday && (
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div className="num" style={{
              fontSize: 48, fontWeight: 900, lineHeight: 0.95,
              background: 'linear-gradient(135deg, #FDE68A, #FFFFFF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 14px rgba(245,158,11,0.6))',
            }}>{gb.daysLeft}</div>
            <div style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, marginTop: -2 }}>
              {gb.daysLeft === 1 ? 'DIA' : 'DIAS'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.GrandeBatalhaBanner = GrandeBatalhaBanner;
