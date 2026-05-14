// Rise of a Legend — Boss System
// Cada banca cadastrada em `shared.concursos` vira um boss visível na aba HOJE.
// Dano em área: estudar aplica HP loss a TODOS os bosses ativos.
// Expiração: boss some quando a data do concurso passa.

window.ROL_BOSSES = {
  fgv: {
    id: 'fgv',
    bancaName: 'FGV',
    creatureName: 'Serpente de Jade',
    emoji: '🐍',
    flavor: 'Movimentos sinuosos e ataques rápidos de lei seca.',
    primary: '#00A86B',      // esmeralda
    secondary: '#0B3D5C',
    glow: 'rgba(0,168,107,0.55)',
    defaultHp: 10000,
  },
  cebraspe: {
    id: 'cebraspe',
    bancaName: 'CEBRASPE',
    creatureName: 'Escorpião de Obsidiana',
    emoji: '🦂',
    flavor: 'Ataques venenosos com questões de certo/errado.',
    primary: '#1E2030',
    secondary: '#5B47B8',
    glow: 'rgba(91,71,184,0.55)',
    defaultHp: 12000,
  },
  fcc: {
    id: 'fcc',
    bancaName: 'FCC',
    creatureName: 'Leão Imperial',
    emoji: '🦁',
    flavor: 'Imponente e focado em letra da lei.',
    primary: '#C9A961',
    secondary: '#F59E0B',
    glow: 'rgba(245,158,11,0.55)',
    defaultHp: 10000,
  },
  vunesp: {
    id: 'vunesp',
    bancaName: 'VUNESP',
    creatureName: 'Morcego Sombrio',
    emoji: '🦇',
    flavor: 'Asas membranosas com brilho neon azul.',
    primary: '#0B3D5C',
    secondary: '#00B8D4',
    glow: 'rgba(0,184,212,0.55)',
    defaultHp: 9500,
  },
  ibfc: {
    id: 'ibfc',
    bancaName: 'IBFC',
    creatureName: 'Lince Veloz',
    emoji: '🐆',
    flavor: 'Rápido e exige reflexo apurado.',
    primary: '#5B47B8',
    secondary: '#0B3D5C',
    glow: 'rgba(91,71,184,0.5)',
    defaultHp: 9000,
  },
  iades: {
    id: 'iades',
    bancaName: 'IADES',
    creatureName: 'Coruja Anciã',
    emoji: '🦉',
    flavor: 'Silenciosa, exige interpretação fina.',
    primary: '#5A6478',
    secondary: '#C9A961',
    glow: 'rgba(201,169,97,0.5)',
    defaultHp: 8500,
  },
  bancaPropria: {
    id: 'bancaPropria',
    bancaName: 'Banca Própria',
    creatureName: 'Harpia de Marfim',
    emoji: '🦅',
    flavor: 'Vigilante com plumagem branca e garras violetas.',
    primary: '#FFFFFF',
    secondary: '#5B47B8',
    glow: 'rgba(91,71,184,0.55)',
    defaultHp: 10000,
  },
  outras: {
    id: 'outras',
    bancaName: 'Outras',
    creatureName: 'Salamandra Ardente',
    emoji: '🦎',
    flavor: 'Adaptável e resistente.',
    primary: '#E85D5D',
    secondary: '#F59E0B',
    glow: 'rgba(232,93,93,0.55)',
    defaultHp: 8000,
  },
};

window.ROL_BANCAS_LIST = Object.values(window.ROL_BOSSES).map((b) => b.bancaName);

// Resolve a banca pela string (case insensitive, trimming)
window.ROL_resolveBanca = function (bancaName) {
  if (!bancaName) return window.ROL_BOSSES.outras;
  const norm = String(bancaName).trim().toLowerCase();
  const found = Object.values(window.ROL_BOSSES).find((b) =>
    b.bancaName.toLowerCase() === norm || b.id.toLowerCase() === norm,
  );
  return found || window.ROL_BOSSES.outras;
};

// Calcula dano por evento de estudo
window.ROL_calculateDamage = function ({ hours = 0, questions = 0, reviews = 0, masteredTopic = false, essentialTopic = false, weight = 3 }) {
  let dmg = 0;
  dmg += hours * 50;          // 50 dmg por hora de estudo
  dmg += questions * 2;       // 2 dmg por questão resolvida
  dmg += reviews * 10;        // 10 dmg por revisão
  if (masteredTopic) dmg += weight <= 3 ? 100 : 200;
  if (essentialTopic) dmg *= 2;
  return Math.round(dmg);
};

// Gera lista de bosses ativos (com expiração)
window.ROL_getActiveBosses = function (shared) {
  const concursos = shared.concursos || [];
  const bossesState = shared.bossesState || {};       // { concursoId: { hpLost: 0, defeated: false } }
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return concursos
    .filter((c) => {
      if (!c.date) return true;                       // sem data → não expira
      const d = new Date(c.date + 'T00:00:00');
      return d.getTime() >= today.getTime();
    })
    .map((c) => {
      const cfg = window.ROL_resolveBanca(c.banca);
      const state = bossesState[c.id] || { hpLost: 0, defeated: false };
      const totalHp = c.bossHp || cfg.defaultHp;
      const hp = Math.max(0, totalHp - (state.hpLost || 0));
      return {
        concursoId: c.id,
        concursoName: c.name,
        date: c.date,
        cfg,
        totalHp,
        hp,
        hpLost: state.hpLost || 0,
        defeated: hp === 0,
        priorExam: c.priorExam || null,                // { name, accuracyPct } se existir confronto anterior
      };
    });
};

// Aplica dano a todos bosses ativos (multi-target). Retorna lista de derrotados.
window.ROL_applyDamageToAllBosses = function (shared, damage) {
  const active = window.ROL_getActiveBosses(shared);
  if (active.length === 0 || damage <= 0) return { bossesState: shared.bossesState || {}, defeated: [] };
  const next = { ...(shared.bossesState || {}) };
  const newlyDefeated = [];
  active.forEach((b) => {
    if (b.defeated) return;
    const prev = next[b.concursoId] || { hpLost: 0, defeated: false };
    const newHpLost = Math.min(b.totalHp, (prev.hpLost || 0) + damage);
    const wasDefeated = prev.defeated;
    const isDefeated = newHpLost >= b.totalHp;
    next[b.concursoId] = { hpLost: newHpLost, defeated: isDefeated };
    if (!wasDefeated && isDefeated) newlyDefeated.push({ ...b, hpLost: newHpLost, defeated: true });
  });
  return { bossesState: next, defeated: newlyDefeated };
};

// ─────────────────────────────────────────────────────────────
// SVG das criaturas das bancas
// ─────────────────────────────────────────────────────────────
function BossSprite({ banca, size = 80, defeated = false }) {
  const cfg = typeof banca === 'string' ? window.ROL_resolveBanca(banca) : banca;
  const filter = defeated ? 'grayscale(80%) opacity(0.35)' : `drop-shadow(0 0 8px ${cfg.glow})`;
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      display: 'grid', placeItems: 'center',
      filter,
      animation: defeated ? 'none' : 'pet-bob 3.5s ease-in-out infinite',
    }}>
      <div style={{
        position: 'absolute', inset: '-8%', borderRadius: '50%',
        background: `radial-gradient(circle, ${cfg.glow}, transparent 70%)`,
        opacity: defeated ? 0.15 : 0.7,
        animation: 'pet-aura-pulse 4s ease-in-out infinite',
      }} />
      <div style={{
        fontSize: size * 0.6, lineHeight: 1, position: 'relative', zIndex: 2,
        textShadow: defeated ? 'none' : `0 0 14px ${cfg.glow}`,
      }}>
        {cfg.emoji}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BossCard — exibe boss individual com HP bar + ações
// ─────────────────────────────────────────────────────────────
function BossCard({ boss, examPerformance = [] }) {
  const days = window.DA.daysUntil(boss.date);
  const urgent = days !== null && days < 30 && days >= 0;
  const pct = boss.totalHp > 0 ? (boss.hp / boss.totalHp) * 100 : 0;

  // HP bar: ouro (cheio) → âmbar → coral conforme dano
  const hpColor = pct > 70 ? '#C9A961' : pct > 40 ? '#F59E0B' : pct > 0 ? '#E85D5D' : '#5A6478';
  const hpColorEnd = pct > 70 ? '#F59E0B' : pct > 40 ? '#E85D5D' : pct > 0 ? '#7A1F1F' : '#3A3F4D';

  // Confrontos anteriores (mesma banca em examPerformance)
  const priorMatches = (examPerformance || []).filter((ex) =>
    ex.banca && ex.banca.toLowerCase().includes(boss.cfg.bancaName.toLowerCase().split(' ')[0]),
  );

  return (
    <div className={`glass ${urgent && !boss.defeated ? 'pulse-amber' : ''}`} style={{
      padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start',
      borderLeft: `3px solid ${boss.defeated ? 'var(--esmeralda)' : boss.cfg.primary}`,
      opacity: boss.defeated ? 0.85 : 1,
    }}>
      <BossSprite banca={boss.cfg} size={68} defeated={boss.defeated} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <span className="num" style={{
            fontSize: 9, padding: '2px 7px', borderRadius: 4,
            background: `${boss.cfg.primary}22`, color: boss.cfg.primary,
            border: `1px solid ${boss.cfg.primary}44`,
            fontWeight: 700, letterSpacing: '0.1em',
          }}>{boss.cfg.bancaName.toUpperCase()}</span>
          {boss.defeated && (
            <span className="num" style={{
              fontSize: 9, padding: '2px 7px', borderRadius: 4,
              background: 'rgba(0,168,107,0.18)', color: 'var(--esmeralda)',
              border: '1px solid rgba(0,168,107,0.45)',
              fontWeight: 700, letterSpacing: '0.1em',
            }}>🏆 DERROTADO</span>
          )}
          {urgent && !boss.defeated && (
            <span style={{ fontSize: 10, color: 'var(--ambar)', fontWeight: 700, letterSpacing: '0.1em' }}>
              {days}D RESTANTES
            </span>
          )}
        </div>

        <div className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.15 }}>
          {boss.cfg.creatureName}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          {boss.concursoName}
        </div>

        {/* HP bar */}
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-dim)', marginBottom: 3, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            <span>HP {boss.defeated ? '0' : boss.hp.toLocaleString('pt-BR')} / {boss.totalHp.toLocaleString('pt-BR')}</span>
            <span className="num">{pct.toFixed(1)}%</span>
          </div>
          <div style={{ height: 8, background: 'rgba(30,32,48,0.08)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${hpColor}, ${hpColorEnd})`,
              borderRadius: 4,
              boxShadow: `0 0 8px ${hpColor}88`,
              transition: 'width 600ms ease',
            }} />
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 5, fontStyle: 'italic', lineHeight: 1.35 }}>
            {boss.cfg.flavor}
          </div>
        </div>

        {/* Confrontos anteriores */}
        {priorMatches.length > 0 && (
          <div style={{ marginTop: 8, padding: '8px 10px', background: `${boss.cfg.primary}08`, borderRadius: 8, borderLeft: `2px solid ${boss.cfg.primary}55` }}>
            <div style={{ fontSize: 9, letterSpacing: '0.18em', color: boss.cfg.primary, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, marginBottom: 3 }}>
              ⚔️ CONFRONTOS ANTERIORES
            </div>
            {priorMatches.slice(0, 2).map((ex, i) => {
              const pct = ex.totalQuestions > 0 ? (ex.totalCorrect / ex.totalQuestions) * 100 : 0;
              return (
                <div key={i} style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.name}</span>
                  <span className="num" style={{ fontWeight: 700, color: pct >= 75 ? 'var(--esmeralda)' : pct >= 50 ? 'var(--ciano)' : 'var(--coral)' }}>
                    {pct.toFixed(0)}%
                  </span>
                </div>
              );
            })}
            <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4, fontStyle: 'italic' }}>
              Agora é a hora de superar! 💪
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BossList — wrapper que renderiza todos os bosses ativos
// ─────────────────────────────────────────────────────────────
function BossList({ shared }) {
  const bosses = window.ROL_getActiveBosses(shared);
  if (bosses.length === 0) return null;

  return (
    <div className="anim-slide-up" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            ⚔️ Bosses Ativos
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            Cada hora de estudo causa dano em <strong>todos</strong> os bosses simultaneamente.
          </div>
        </div>
        <div className="num" style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: '0.12em' }}>
          {bosses.filter((b) => !b.defeated).length} ATIVOS · {bosses.filter((b) => b.defeated).length} DERROTADOS
        </div>
      </div>

      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {bosses.map((b) => (
          <BossCard key={b.concursoId} boss={b} examPerformance={shared.examPerformance || []} />
        ))}
      </div>
    </div>
  );
}

window.BossSprite = BossSprite;
window.BossCard = BossCard;
window.BossList = BossList;
