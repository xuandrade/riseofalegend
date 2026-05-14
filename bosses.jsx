// ═════════════════════════════════════════════════════════════════════════════
// RISE OF A LEGEND — Boss System V4 (Estilo 3D Realista + Cute)
// Criaturas no estilo do dragão 3D — realistas mas fofas, com brilho e animação
// ═════════════════════════════════════════════════════════════════════════════

window.ROL_BOSSES = window.ROL_BOSSES || {
  fgv: {
    id: 'fgv',
    bancaName: 'FGV',
    creatureName: 'Serpente de Jade',
    emoji: '🐍',
    flavor: 'Sinuosa e elegante, guardiã da lei seca.',
    primary: '#00D48A',
    secondary: '#00A86B',
    glow: 'rgba(0,212,138,0.6)',
    defaultHp: 10000,
  },
  cebraspe: {
    id: 'cebraspe',
    bancaName: 'CEBRASPE',
    creatureName: 'Coruja das Sombras',
    emoji: '🦉',
    flavor: 'Sábia e misteriosa, enxerga além das aparências.',
    primary: '#7C3AED',
    secondary: '#5B21B6',
    glow: 'rgba(124,58,237,0.6)',
    defaultHp: 12000,
  },
  fcc: {
    id: 'fcc',
    bancaName: 'FCC',
    creatureName: 'Leão Dourado',
    emoji: '🦁',
    flavor: 'Majestoso e justo, rei da interpretação literal.',
    primary: '#FFD700',
    secondary: '#FFA500',
    glow: 'rgba(255,215,0,0.6)',
    defaultHp: 10000,
  },
  vunesp: {
    id: 'vunesp',
    bancaName: 'VUNESP',
    creatureName: 'Raposa Celeste',
    emoji: '🦊',
    flavor: 'Astuta e veloz, mestre dos detalhes.',
    primary: '#00D9FF',
    secondary: '#0EA5E9',
    glow: 'rgba(0,217,255,0.6)',
    defaultHp: 9500,
  },
};

// Boss Card 3D com imagem placeholder e efeitos
function Boss3DCard({ boss, onAttack }) {
  const { concursoName, cfg, hp, totalHp, defeated } = boss;
  const hpPct = (hp / totalHp) * 100;

  return (
    <div className="glass hover-lift" style={{
      padding: 24,
      borderLeft: `4px solid ${cfg.primary}`,
      opacity: defeated ? 0.6 : 1,
      transition: 'all 0.3s ease',
    }}>
      
      {/* Avatar do boss 3D */}
      <div style={{
        width: 140,
        height: 140,
        margin: '0 auto 20px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${cfg.glow}, transparent 70%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        animation: defeated ? 'none' : 'boss-hover-float 3s ease-in-out infinite',
        filter: defeated ? 'grayscale(1)' : 'grayscale(0)',
      }}>
        {/* Círculo de brilho */}
        <div style={{
          position: 'absolute',
          inset: -10,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${cfg.primary}22, transparent)`,
          animation: defeated ? 'none' : 'boss-glow-pulse 2s ease-in-out infinite',
        }} />
        
        {/* Emoji grande como placeholder */}
        <div style={{
          fontSize: 80,
          filter: `drop-shadow(0 0 20px ${cfg.glow})`,
          animation: defeated ? 'none' : 'boss-breathe 3s ease-in-out infinite',
        }}>
          {cfg.emoji}
        </div>
        
        {/* Partículas orbitando */}
        {!defeated && [0, 1, 2, 3].map(i => (
          <div key={i} style={{
            position: 'absolute',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: cfg.primary,
            boxShadow: `0 0 10px ${cfg.primary}`,
            animation: `boss-particle-orbit ${3 + i * 0.5}s linear ${i * 0.5}s infinite`,
            '--orbit-radius': '80px',
            '--orbit-angle': `${i * 90}deg`,
          }} />
        ))}
      </div>

      {/* Info */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 9,
          letterSpacing: '0.18em',
          color: cfg.primary,
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 800,
          marginBottom: 6,
        }}>
          {cfg.bancaName}
        </div>
        
        <div className="font-display" style={{
          fontSize: 20,
          fontWeight: 800,
          marginBottom: 6,
          color: defeated ? 'var(--text-muted)' : 'var(--text-primary)',
        }}>
          {cfg.creatureName}
        </div>
        
        <div style={{
          fontSize: 12,
          color: 'var(--text-muted)',
          fontStyle: 'italic',
          marginBottom: 16,
          lineHeight: 1.5,
        }}>
          {cfg.flavor}
        </div>

        {/* Concurso */}
        {concursoName && (
          <div style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            marginBottom: 12,
            padding: '6px 12px',
            background: 'rgba(26,28,46,0.04)',
            borderRadius: 8,
            display: 'inline-block',
          }}>
            📝 {concursoName}
          </div>
        )}

        {/* HP Bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 8,
          }}>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}>
              HP
            </span>
            <span className="num" style={{
              fontSize: 14,
              fontWeight: 800,
              color: defeated ? 'var(--esmeralda)' : cfg.primary,
            }}>
              {hp.toLocaleString('pt-BR')} / {totalHp.toLocaleString('pt-BR')}
            </span>
          </div>
          
          <div className="progress-bar" style={{ height: 12 }}>
            <div 
              className="progress-fill"
              style={{
                width: `${hpPct}%`,
                background: `linear-gradient(90deg, ${cfg.primary}, ${cfg.secondary})`,
                boxShadow: `0 0 12px ${cfg.glow}`,
              }} />
          </div>
        </div>

        {/* Status */}
        {defeated ? (
          <div className="badge badge-green" style={{ fontSize: 11 }}>
            ✓ DERROTADO
          </div>
        ) : (
          <button 
            onClick={onAttack}
            className="btn-neon"
            style={{
              fontSize: 12,
              padding: '10px 20px',
              background: `linear-gradient(135deg, ${cfg.primary}, ${cfg.secondary})`,
              borderColor: cfg.primary,
              boxShadow: `0 0 20px ${cfg.glow}`,
            }}>
            ⚔️ Atacar Boss
          </button>
        )}
      </div>
    </div>
  );
}

// Inject animations
(function injectBoss3DAnimations() {
  if (document.getElementById('boss-3d-animations')) return;
  const style = document.createElement('style');
  style.id = 'boss-3d-animations';
  style.innerHTML = `
    @keyframes boss-hover-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes boss-breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes boss-glow-pulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.15); }
    }
    
    @keyframes boss-particle-orbit {
      0% {
        transform: rotate(var(--orbit-angle)) 
                   translateX(var(--orbit-radius)) 
                   rotate(calc(-1 * var(--orbit-angle)));
        opacity: 0;
      }
      10%, 90% {
        opacity: 1;
      }
      100% {
        transform: rotate(calc(var(--orbit-angle) + 360deg)) 
                   translateX(var(--orbit-radius)) 
                   rotate(calc(-1 * (var(--orbit-angle) + 360deg)));
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
})();

window.Boss3DCard = Boss3DCard;
