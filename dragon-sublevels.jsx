// Rise of a Legend — Sub-níveis do Dragão
// Cada estágio do pet (1-8) é dividido em 5 sub-níveis visuais.
// O sub-nível é calculado pelo progresso XP dentro do estágio atual.

window.ROL_getSubLevel = function (xp) {
  if (!window.DA || !window.DA.getPetStageInfo) return { stage: 1, sub: 0, total: 5 };
  const info = window.DA.getPetStageInfo(xp);
  // progress: 0..1 dentro do estágio atual rumo ao próximo
  const sub = Math.min(4, Math.floor((info.progress || 0) * 5));
  return {
    stage: info.stage,
    sub,
    total: 5,
    label: `${info.stage}.${sub + 1}`,
    progress: info.progress,
  };
};

// Renderiza 5 dots embaixo do pet
function DragonSubLevelDots({ xp, accent = 'var(--ciano)', glow = 'rgba(0,184,212,0.55)' }) {
  const sl = window.ROL_getSubLevel(xp);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 99,
      background: 'rgba(255,255,255,0.6)',
      border: `1px solid ${accent}33`,
      boxShadow: '0 1px 2px rgba(30,32,48,0.04)',
    }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: i <= sl.sub
            ? `linear-gradient(135deg, ${accent}, ${accent}cc)`
            : 'rgba(30,32,48,0.15)',
          boxShadow: i <= sl.sub ? `0 0 6px ${glow}` : 'none',
          transition: 'all 300ms ease',
        }} />
      ))}
      <span className="num" style={{
        fontSize: 9.5, fontWeight: 700, color: accent,
        marginLeft: 4, letterSpacing: '0.05em',
        fontFamily: 'JetBrains Mono, monospace',
      }}>{sl.label}</span>
    </div>
  );
}

window.DragonSubLevelDots = DragonSubLevelDots;
