// Rise of a Legend — Mecânica de Urgência "RETA FINAL"
// Detecta o concurso mais próximo e ativa bônus condicional:
// • Fase 1 (≤30 dias): +100% XP em essenciais e em sessões de questões
// • Fase 2 (≤15 dias): +100% XP em revisões
// Visual: banner motivacional no topo da aba HOJE (NÃO ansiogênico)

window.ROL_getRetaFinal = function (shared) {
  const concursos = (shared.concursos || []).filter((c) => c.date);
  if (concursos.length === 0) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let closest = null;
  let closestDays = Infinity;
  concursos.forEach((c) => {
    const d = new Date(c.date + 'T00:00:00');
    const days = Math.floor((d.getTime() - today.getTime()) / 86400000);
    if (days >= 0 && days < closestDays) {
      closest = c;
      closestDays = days;
    }
  });
  if (!closest) return null;
  let phase = null;
  let label = '';
  let body = '';
  if (closestDays <= 15) {
    phase = 'fase2';
    label = 'RETA FINAL · INTENSIFICADA';
    body = 'Qualidade > Quantidade. Sono é parte do treinamento. Você já fez muito — confie!';
  } else if (closestDays <= 30) {
    phase = 'fase1';
    label = 'RETA FINAL · ATIVADA';
    body = 'Grande Batalha à vista. Foque em tópicos essenciais e questões.';
  }
  return phase ? {
    phase,
    daysLeft: closestDays,
    examName: closest.name,
    bancaName: closest.banca || null,
    label,
    body,
  } : null;
};

// Multiplicador de XP a aplicar conforme contexto (chamado nos handlers do app)
window.ROL_retaFinalMultiplier = function (shared, ctx = {}) {
  const reta = window.ROL_getRetaFinal(shared);
  if (!reta) return 1;
  // Fase 2 — revisão dobra
  if (reta.phase === 'fase2') {
    const st = (ctx.studyType || '').toLowerCase();
    if (ctx.type === 'revision' || st.includes('revis')) return 2;
  }
  // Fase 1 — essenciais e questões dobram
  if (reta.phase === 'fase1') {
    if (ctx.isEssential) return 2;
    const st = (ctx.studyType || '').toLowerCase();
    if (ctx.type === 'question' || ctx.type === 'questoes' || ctx.type === 'simulado' || st.includes('quest')) return 2;
  }
  return 1;
};

// ─────────────────────────────────────────────────────────────
// Banner visual no topo da aba HOJE
// ─────────────────────────────────────────────────────────────
function RetaFinalBanner({ shared }) {
  const reta = window.ROL_getRetaFinal(shared);
  if (!reta) return null;

  const isFase2 = reta.phase === 'fase2';
  const gradient = isFase2
    ? 'linear-gradient(135deg, rgba(232,93,93,0.10), rgba(245,158,11,0.10))'
    : 'linear-gradient(135deg, rgba(245,158,11,0.10), rgba(0,184,212,0.08))';
  const accent = isFase2 ? '#DC2626' : '#F59E0B';
  const glow = isFase2 ? 'rgba(220,38,38,0.4)' : 'rgba(245,158,11,0.4)';

  return (
    <div className="glass anim-slide-up" style={{
      padding: '14px 18px', marginBottom: 16,
      background: gradient,
      borderLeft: `3px solid ${accent}`,
      boxShadow: `0 0 0 1px ${accent}33, 0 12px 32px -12px ${glow}`,
      display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        display: 'grid', placeItems: 'center',
        background: `radial-gradient(circle, ${accent}33, transparent 75%)`,
        border: `1.5px solid ${accent}66`,
        fontSize: 26,
        filter: `drop-shadow(0 0 8px ${glow})`,
        animation: 'pet-aura-pulse 2.5s ease-in-out infinite',
      }}>{isFase2 ? '🎯' : '🏁'}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.22em', color: accent, fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>
          {reta.label}
        </div>
        <div className="font-display" style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2, lineHeight: 1.2 }}>
          {reta.examName} em <span style={{ color: accent }}>{reta.daysLeft} dia{reta.daysLeft === 1 ? '' : 's'}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.45 }}>
          {reta.body}
        </div>
        <div style={{ fontSize: 10.5, color: accent, marginTop: 5, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}>
          ✨ {isFase2 ? 'REVISÕES VALEM 2x XP' : 'ESSENCIAIS E QUESTÕES VALEM 2x XP'}
        </div>
      </div>
    </div>
  );
}

window.RetaFinalBanner = RetaFinalBanner;
