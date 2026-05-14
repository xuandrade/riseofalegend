// Rise of a Legend — Modo de Ataque (extensão do Pomodoro/Blindado)
// Mantém o PomodoroModal existente do TOGA mas adiciona:
// • Confirmação ao pausar com penalidade visual
// • Tracking de combos (dias sem pausar)
// • Flash vermelho na tela em caso de pausa confirmada

window.ROL_AttackOverlay = (function () {
  let active = false;
  return {
    flashRed: function () {
      if (active) return;
      active = true;
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: radial-gradient(circle, rgba(220,38,38,0.42), rgba(220,38,38,0.18));
        pointer-events: none;
        animation: rol-attack-flash 1.4s ease-out forwards;
      `;
      document.body.appendChild(overlay);
      setTimeout(() => { overlay.remove(); active = false; }, 1500);
    },
  };
})();

// Inject keyframes para flash red e disappointed dragon (idempotente)
(function injectAttackStyles() {
  if (document.getElementById('rol-attack-styles')) return;
  const s = document.createElement('style');
  s.id = 'rol-attack-styles';
  s.innerHTML = `
    @keyframes rol-attack-flash {
      0%   { opacity: 0; }
      25%  { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes rol-attack-pulse {
      0%, 100% { box-shadow: 0 0 0 1px rgba(220,38,38,0.35), 0 0 18px rgba(220,38,38,0.25); }
      50%       { box-shadow: 0 0 0 2px rgba(220,38,38,0.7), 0 0 32px rgba(220,38,38,0.55); }
    }
    .rol-attack-card {
      animation: rol-attack-pulse 2.5s ease-in-out infinite;
    }
  `;
  document.head.appendChild(s);
})();

// Modal de confirmação ao tentar pausar
function AttackPauseWarningModal({ open, remainingSec, onConfirm, onCancel }) {
  if (!open) return null;
  const min = Math.floor(remainingSec / 60);
  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, zIndex: 95,
      background: 'rgba(30,32,48,0.55)', backdropFilter: 'blur(10px)',
      display: 'grid', placeItems: 'center', padding: 20,
      animation: 'fade-in 200ms ease-out',
    }}>
      <div onClick={(e) => e.stopPropagation()} className="glass-strong anim-slide-up rol-attack-card" style={{
        maxWidth: 440, padding: 24, borderRadius: 20, position: 'relative',
        borderLeft: '3px solid #DC2626',
      }}>
        <div style={{ fontSize: 9.5, letterSpacing: '0.25em', color: '#DC2626', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>
          ⚠️ ABANDONO DE BATALHA
        </div>
        <div className="font-display" style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
          Pausar agora vai custar caro
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.55 }}>
          Faltam <strong style={{ color: '#DC2626' }}>{min} minuto{min === 1 ? '' : 's'}</strong> para a vitória.
        </div>

        <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(220,38,38,0.05)', borderRadius: 12, borderLeft: '3px solid #DC2626' }}>
          <div style={{ fontSize: 10, color: '#DC2626', letterSpacing: '0.15em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, marginBottom: 6 }}>
            CONSEQUÊNCIAS
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.7 }}>
            <li><strong>−50 XP</strong> de penalidade</li>
            <li>Combo de Modo de Ataque <strong>resetado para 0</strong></li>
            <li>Seu dragão fica desapontado 😢</li>
          </ul>
        </div>

        <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(0,184,212,0.05)', borderRadius: 10, fontSize: 12, color: 'var(--ciano)', fontStyle: 'italic' }}>
          💡 Que tal respirar fundo e continuar? Faltam apenas <strong>{min} min</strong>.
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <button onClick={onCancel} className="btn-neon" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
            ⚔️ Voltar ao ataque
          </button>
          <button onClick={onConfirm} className="btn-ghost" style={{ fontSize: 12, color: '#DC2626', borderColor: 'rgba(220,38,38,0.35)' }}>
            ⚠️ Pausar mesmo assim
          </button>
        </div>
      </div>
    </div>
  );
}

window.AttackPauseWarningModal = AttackPauseWarningModal;

// Helper para tocar penalidade ao pausar
window.ROL_applyAttackPenalty = function (setShared, pushToast) {
  window.ROL_AttackOverlay.flashRed();
  setShared((s) => ({
    ...s,
    xp: Math.max(0, (s.xp || 0) - 50),
    attackModeStreak: 0,                         // combo reseta
    petHealth: s.petHealth,                      // não muda saúde aqui — só visual via toast
  }));
  pushToast && pushToast('attack_paused');
  if (window.playSick) window.playSick();
};

// Helper para marcar Modo de Ataque concluído (sem pausar)
window.ROL_completeAttackSession = function (setShared, pushToast, { minutes }) {
  setShared((s) => {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = s.attackModeLastDate;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    let streak = s.attackModeStreak || 0;
    if (lastDate !== today) {
      streak = lastDate === yesterday ? streak + 1 : 1;
    } else if (streak === 0) {
      streak = 1;
    }
    let next = {
      ...s,
      attackModeStreak: streak,
      attackModeBestStreak: Math.max(s.attackModeBestStreak || 0, streak),
      attackModeLastDate: today,
    };
    // Drop chance ao concluir sem pausar
    if (Math.random() < 0.25) {
      const drop = window.ROL_rollDrop && window.ROL_rollDrop('attack_complete');
      if (drop && window.ROL_grantItem) {
        next = window.ROL_grantItem(next, drop);
        pushToast && setTimeout(() => pushToast(`item_${drop}`), 100);
      }
    }
    // Marcos de combo
    if (streak === 3) pushToast && setTimeout(() => pushToast('attack_combo3'), 60);
    if (streak === 7) pushToast && setTimeout(() => pushToast('attack_combo7'), 60);
    if (streak === 14) pushToast && setTimeout(() => pushToast('attack_master14'), 60);
    return next;
  });
};
