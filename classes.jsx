// Rise of a Legend — Sistema de Classes (Mago, Filósofo, Gladiador)
// Auto-detectado pelos últimos 14 dias de logs.

window.ROL_CLASSES = {
  mago: {
    id: 'mago',
    name: 'Mago',
    title: 'Mestre Versátil',
    icon: '🔮',
    description: 'Especialista em versatilidade. Mantém equilíbrio entre teoria e prática.',
    activationRule: '40-60% teoria + 40-60% questões',
    bonuses: ['+10% XP em tudo', 'Pode trocar de classe 1x/semana', 'Imune a penalidades de mudança'],
    color: '#5B47B8',          // tinta
    colorSoft: 'rgba(91,71,184,0.18)',
    colorBg: 'rgba(91,71,184,0.07)',
    glow: 'rgba(123,103,216,0.6)',
    aura: 'radial-gradient(circle, rgba(123,103,216,0.55) 0%, rgba(91,71,184,0.18) 40%, transparent 70%)',
  },
  filosofo: {
    id: 'filosofo',
    name: 'Filósofo',
    title: 'Mestre do Conhecimento',
    icon: '📚',
    description: 'Mestre do conhecimento profundo. Quem busca a teoria, jurisprudência e doutrina.',
    activationRule: '>60% do tempo em leituras/teoria',
    bonuses: ['+20% XP em teoria', 'Tópicos essenciais valem +25%', 'Insight Flash: chance de XP bônus em peso 5'],
    color: '#0B3D5C',          // petroleo
    colorSoft: 'rgba(11,61,92,0.18)',
    colorBg: 'rgba(11,61,92,0.07)',
    glow: 'rgba(0,184,212,0.6)',
    aura: 'radial-gradient(circle, rgba(0,184,212,0.50) 0%, rgba(11,61,92,0.18) 40%, transparent 70%)',
  },
  gladiador: {
    id: 'gladiador',
    name: 'Gladiador',
    title: 'Guerreiro de Batalha',
    icon: '⚔️',
    description: 'Guerreiro do campo de batalha. Treinado em questões e simulados.',
    activationRule: '>60% do tempo em questões/simulados',
    bonuses: ['+20% XP em questões', 'Combo Strike: 3 dias seguidos = +50% no 4º', 'Simulados dão +25% XP extra'],
    color: '#E85D5D',          // coral
    colorSoft: 'rgba(232,93,93,0.18)',
    colorBg: 'rgba(232,93,93,0.07)',
    glow: 'rgba(232,93,93,0.65)',
    aura: 'radial-gradient(circle, rgba(232,93,93,0.55) 0%, rgba(232,93,93,0.18) 40%, transparent 70%)',
  },
};

window.ROL_getClassConfig = function (classId) {
  return window.ROL_CLASSES[classId] || window.ROL_CLASSES.mago;
};

// Detecta classe baseada nas últimas 14 entradas
window.ROL_detectClass = function (shared) {
  const logs = shared.dailyLogs || [];
  if (logs.length === 0) return 'mago';

  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  let theoryH = 0;
  let questionsH = 0;

  logs.forEach((log) => {
    const t = new Date(log.date + 'T00:00:00').getTime();
    if (t < cutoff) return;
    const ents = log.entries && log.entries.length > 0 ? log.entries : [log];
    ents.forEach((e) => {
      const h = e.hours || 0;
      const q = e.questions || 0;
      const type = (e.studyType || '').toLowerCase();
      // Tipo explícito 'questões' ou 'simulado' vai para questionsH
      if (type.includes('questão') || type.includes('questoes') || type.includes('simulado') || type.includes('flash')) {
        questionsH += h;
      } else if (type.includes('revisão') || type.includes('revisao') || type.includes('lei') || type.includes('teoria') || type.includes('doutrina') || type.includes('jurisprud')) {
        theoryH += h;
      } else {
        // Sem tipo explícito: usar questões como proxy gladiador, horas livres como filosofo
        if (q > 0 && h <= 0.25) questionsH += q / 60;  // 60 questões/hora estimadas
        else theoryH += h;
      }
    });
  });

  const total = theoryH + questionsH;
  if (total < 0.5) return shared.dragonClass || 'mago'; // sem dados suficientes mantém

  const theoryPct = (theoryH / total) * 100;
  const questionsPct = (questionsH / total) * 100;

  if (theoryPct > 60) return 'filosofo';
  if (questionsPct > 60) return 'gladiador';
  return 'mago';
};

// Aplica bônus de classe ao XP ganho
window.ROL_applyClassBonus = function (xp, context = {}) {
  if (!xp) return xp;
  const cls = context.dragonClass || 'mago';
  const type = (context.type || '').toLowerCase();
  let multiplier = 1;
  if (cls === 'mago') multiplier = 1.1;
  if (cls === 'filosofo') {
    if (type === 'teoria' || type === 'check' || type === 'master') multiplier = 1.2;
    if (context.isEssential) multiplier = Math.max(multiplier, 1.25);
  }
  if (cls === 'gladiador') {
    if (type === 'question' || type === 'questoes') multiplier = 1.2;
    if (type === 'simulado') multiplier = 1.25;
  }
  return Math.round(xp * multiplier);
};

// ──────────────────────────────────────────────────────────────
// ClassBadge — pílula compacta para o header
// ──────────────────────────────────────────────────────────────
function ClassBadge({ classId = 'mago', size = 'md', onClick }) {
  const cfg = window.ROL_getClassConfig(classId);
  const SIZES = {
    sm: { pad: '5px 10px', icon: 11, text: 11 },
    md: { pad: '7px 13px', icon: 13, text: 12 },
    lg: { pad: '9px 16px', icon: 16, text: 14 },
  };
  const s = SIZES[size] || SIZES.md;
  return (
    <button
      onClick={onClick}
      title={`Classe ativa: ${cfg.name} (${cfg.title})\n${cfg.bonuses.join('\n')}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: s.pad, borderRadius: 10,
        background: cfg.colorBg,
        border: `1px solid ${cfg.colorSoft}`,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.6) inset',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 240ms cubic-bezier(0.16,1,0.3,1)',
      }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.transform = 'translateY(-1px)')}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <span style={{ fontSize: s.icon, filter: `drop-shadow(0 0 4px ${cfg.glow})` }}>{cfg.icon}</span>
      <span className="num" style={{
        fontSize: s.text, fontWeight: 700, color: cfg.color, letterSpacing: '-0.01em',
      }}>{cfg.name.toUpperCase()}</span>
    </button>
  );
}

window.ClassBadge = ClassBadge;

// ──────────────────────────────────────────────────────────────
// ClassesModal — modal de boas-vindas explicando as 3 classes
// ──────────────────────────────────────────────────────────────
function ClassesIntroModal({ open, currentClass, onClose }) {
  if (!open) return null;
  const classes = ['mago', 'filosofo', 'gladiador'].map((id) => window.ROL_getClassConfig(id));

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 95,
      background: 'rgba(30,32,48,0.45)', backdropFilter: 'blur(10px)',
      display: 'grid', placeItems: 'center', padding: 20,
      animation: 'fade-in 240ms ease-out',
    }}>
      <div onClick={(e) => e.stopPropagation()} className="glass-strong anim-slide-up" style={{
        width: '100%', maxWidth: 620, padding: 26, borderRadius: 20, position: 'relative',
      }}>
        <button onClick={onClose} className="btn-ghost" style={{ position: 'absolute', top: 14, right: 14 }}>
          ✕
        </button>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 9.5, letterSpacing: '0.25em', color: 'var(--tinta)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>
            NOVO · CLASSES DO DRAGÃO
          </div>
          <div className="font-display gradient-neon" style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>
            Conheça as 3 classes 🐉
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.55 }}>
            Seu dragão se especializa automaticamente conforme seu padrão de estudo dos últimos 14 dias.
            Cada classe oferece bônus de XP distintos. Não precisa escolher — basta estudar.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {classes.map((c) => {
            const active = c.id === currentClass;
            return (
              <div key={c.id} className="glass" style={{
                padding: '14px 16px',
                borderLeft: `3px solid ${c.color}`,
                background: active ? c.colorBg : 'rgba(255,255,255,0.55)',
                boxShadow: active ? `0 0 0 1px ${c.colorSoft}, 0 8px 24px -12px ${c.glow}` : undefined,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 22, filter: `drop-shadow(0 0 6px ${c.glow})` }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: c.color }}>{c.name}</span>
                      {active && (
                        <span style={{
                          fontSize: 9, padding: '2px 7px', borderRadius: 99,
                          background: c.color, color: 'white',
                          letterSpacing: '0.12em', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
                        }}>ATUAL</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.title}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.45 }}>{c.description}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: 9.5, letterSpacing: '0.18em', color: c.color, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                    BÔNUS ATIVOS
                  </div>
                  {c.bonuses.map((b, i) => (
                    <div key={i} style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 6 }}>
                      <span style={{ color: c.color, fontWeight: 700 }}>›</span>
                      <span>{b}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 10.5, color: 'var(--text-dim)', marginTop: 4, fontStyle: 'italic' }}>
                    ATIVA: {c.activationRule}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={onClose} className="btn-neon" style={{
          width: '100%', justifyContent: 'center', marginTop: 18, padding: '12px 20px', fontSize: 13,
          background: 'linear-gradient(135deg, var(--petroleo), var(--ciano))', color: 'white', borderColor: 'transparent',
        }}>
          ⚔️ Entendi, vamos começar
        </button>
      </div>
    </div>
  );
}

window.ClassesIntroModal = ClassesIntroModal;
