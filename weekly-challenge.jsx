// Rise of a Legend — Desafios Semanais Inteligentes
// 1 desafio por semana, auto-gerado, recompensa em XP + item

const FLAGS_OBJ = ['lei', 'doutrina', 'juris', 'questoes', 'revisao'];

function getWeekStart() {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  const dow = d.getDay();                              // 0=dom, 1=seg, ...
  const offset = dow === 0 ? 6 : dow - 1;              // ajusta para começar segunda
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

function pickNeglectedDiscipline(objState) {
  const subjects = (objState.subjects || []).filter((s) => s && s.name && s.topics && s.topics.length > 0);
  if (subjects.length === 0) return null;
  const ranked = subjects.map((s) => {
    let checks = 0;
    s.topics.forEach((t) => FLAGS_OBJ.forEach((f) => { if (t[f]) checks += 1; }));
    const pct = (checks / (s.topics.length * 5)) * 100;
    return { name: s.name, pct, topics: s.topics.length };
  });
  ranked.sort((a, b) => a.pct - b.pct);
  return ranked[0];
}

window.ROL_generateChallenge = function (shared, objState) {
  const weekStart = getWeekStart();
  const existing = shared.weeklyChallenge;
  if (existing && existing.weekStart === weekStart) return existing;

  const neglected = pickNeglectedDiscipline(objState);
  const challenges = [];

  if (neglected) {
    challenges.push({
      type: 'discipline_topics',
      title: `Fortaleça ${neglected.name}`,
      target: Math.min(5, Math.max(2, Math.ceil(neglected.topics / 4))),
      unit: 'tópicos',
      disciplineName: neglected.name,
      rewardXp: 1500,
      rewardItem: 'pocaoFoco',
    });
  }

  challenges.push({
    type: 'hours_week',
    title: 'Maratona da Semana',
    target: 15,
    unit: 'horas',
    rewardXp: 1200,
    rewardItem: 'cafeGotico',
  });
  challenges.push({
    type: 'questions_week',
    title: 'Treino de Combate',
    target: 200,
    unit: 'questões',
    rewardXp: 1300,
    rewardItem: 'pocaoFoco',
  });

  // Escolhe baseado em semana do ano (pseudo-aleatório determinístico)
  const seedDay = Math.floor((new Date(weekStart).getTime()) / 86400000);
  const pick = challenges[seedDay % challenges.length];

  return {
    id: `ch_${weekStart}`,
    weekStart,
    ...pick,
    current: 0,
    completed: false,
    rewardClaimed: false,
  };
};

// Calcula progresso atual do desafio
window.ROL_computeChallengeProgress = function (challenge, shared, objState) {
  if (!challenge) return 0;
  const weekStartDate = new Date(challenge.weekStart + 'T00:00:00');
  const logs = (shared.dailyLogs || []).filter((l) => new Date(l.date + 'T00:00:00') >= weekStartDate);

  if (challenge.type === 'hours_week') {
    return logs.reduce((acc, l) => acc + (l.hours || 0), 0);
  }
  if (challenge.type === 'questions_week') {
    return logs.reduce((acc, l) => acc + (l.questions || 0), 0);
  }
  if (challenge.type === 'discipline_topics') {
    const subj = (objState.subjects || []).find((s) => s.name === challenge.disciplineName);
    if (!subj) return 0;
    let mastered = 0;
    subj.topics.forEach((t) => {
      const c = FLAGS_OBJ.filter((f) => t[f]).length;
      if (c >= 4) mastered += 1;                       // 4 de 5 = "fortalecido"
    });
    return mastered;
  }
  return 0;
};

// ─────────────────────────────────────────────────────────────
// WeeklyChallengeCard
// ─────────────────────────────────────────────────────────────
function WeeklyChallengeCard({ shared, setShared, objState, onToast }) {
  if (!window.ROL_generateChallenge) return null;
  const challenge = window.ROL_generateChallenge(shared, objState);
  const current = window.ROL_computeChallengeProgress(challenge, shared, objState);
  const pct = Math.min(100, (current / challenge.target) * 100);
  const done = current >= challenge.target;
  const claimed = shared.weeklyChallenge?.id === challenge.id && shared.weeklyChallenge?.rewardClaimed;

  // Persiste challenge ao carregar / sincronizar progresso
  React.useEffect(() => {
    setShared((s) => {
      const existing = s.weeklyChallenge;
      if (existing && existing.id === challenge.id) {
        if (existing.current !== current || existing.completed !== done) {
          return { ...s, weeklyChallenge: { ...existing, current, completed: done } };
        }
        return s;
      }
      return { ...s, weeklyChallenge: { ...challenge, current, completed: done } };
    });
  }, [current, done, challenge.id]);

  const daysLeft = (() => {
    const ws = new Date(challenge.weekStart + 'T00:00:00');
    const end = new Date(ws.getTime() + 7 * 86400000);
    return Math.max(0, Math.ceil((end - new Date()) / 86400000));
  })();

  const claim = () => {
    if (!done || claimed) return;
    setShared((s) => {
      let next = {
        ...s,
        xp: (s.xp || 0) + challenge.rewardXp,
        weeklyChallenge: { ...(s.weeklyChallenge || challenge), rewardClaimed: true, completed: true },
      };
      if (challenge.rewardItem && window.ROL_grantItem) next = window.ROL_grantItem(next, challenge.rewardItem);
      return next;
    });
    onToast && onToast('challenge_claimed');
    window.celebrateHighEnergy && window.celebrateHighEnergy();
  };

  const accent = done ? 'var(--esmeralda)' : 'var(--tinta)';
  const glow = done ? 'rgba(0,168,107,0.4)' : 'rgba(91,71,184,0.35)';

  return (
    <div className="glass anim-slide-up" style={{
      padding: '14px 18px',
      borderLeft: `3px solid ${accent}`,
      boxShadow: `0 0 0 1px ${accent}22, 0 8px 24px -16px ${glow}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
        <div style={{ fontSize: 9.5, letterSpacing: '0.22em', color: accent, fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>
          📅 DESAFIO DA SEMANA
        </div>
        <div className="num" style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
          {done && claimed ? '✅ RESGATADO' : done ? '⏳ RESGATAR' : `${daysLeft} DIA${daysLeft === 1 ? '' : 'S'} RESTANTES`}
        </div>
      </div>

      <div className="font-display" style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
        {challenge.title}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.4 }}>
        Complete <strong>{challenge.target} {challenge.unit}</strong>
        {challenge.disciplineName ? ` em ${challenge.disciplineName}` : ' nesta semana'}.
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
          <span>Progresso</span>
          <span className="num">{current.toFixed(challenge.type === 'hours_week' ? 1 : 0)} / {challenge.target} {challenge.unit}</span>
        </div>
        <div style={{ height: 8, background: 'rgba(30,32,48,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: done ? 'linear-gradient(90deg, var(--esmeralda), var(--ciano))' : 'linear-gradient(90deg, var(--tinta), var(--ciano))',
            borderRadius: 4,
            boxShadow: `0 0 8px ${glow}`,
            transition: 'width 600ms ease',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          🎁 Recompensa: <strong style={{ color: accent }}>+{challenge.rewardXp.toLocaleString('pt-BR')} XP</strong>
          {challenge.rewardItem && window.ROL_ITEMS[challenge.rewardItem] && (
            <> · {window.ROL_ITEMS[challenge.rewardItem].icon} {window.ROL_ITEMS[challenge.rewardItem].name}</>
          )}
        </div>
        {done && !claimed && (
          <button onClick={claim} className="btn-neon" style={{ fontSize: 12, padding: '6px 14px' }}>
            🎁 Resgatar recompensa
          </button>
        )}
      </div>
    </div>
  );
}

window.WeeklyChallengeCard = WeeklyChallengeCard;
