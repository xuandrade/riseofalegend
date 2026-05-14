// Rise of a Legend — Inventário de Itens (sem loja, só drops)
// Items podem ter efeitos passivos/cooldown e ficam em shared.items: [{ id, slug, gainedAt, used }]

window.ROL_ITEMS = {
  pocaoFoco: {
    slug: 'pocaoFoco',
    name: 'Poção de Foco',
    icon: '🧪',
    tier: 'common',
    effect: 'Próxima sessão de Modo de Ataque: +50% XP',
    duration: '1 uso',
    dropChance: 0.18,
    obtainedBy: 'Completar Modo de Ataque sem pausar',
  },
  cafeGotico: {
    slug: 'cafeGotico',
    name: 'Café Gótico',
    icon: '☕',
    tier: 'common',
    effect: '+25% XP por 2 horas após uso',
    duration: '2h',
    dropChance: 0.12,
    obtainedBy: 'Constância de 7 dias',
  },
  escudoConstancia: {
    slug: 'escudoConstancia',
    name: 'Escudo da Constância',
    icon: '🛡️',
    tier: 'uncommon',
    effect: 'Protege de 1 dia sem estudo (constância não quebra)',
    duration: '1 uso',
    dropChance: 0.08,
    obtainedBy: '14 dias de constância',
  },
  elixirFlow: {
    slug: 'elixirFlow',
    name: 'Elixir do Flow',
    icon: '🌊',
    tier: 'rare',
    effect: 'Próximo Modo de Ataque dobra o XP',
    duration: '24h',
    dropChance: 0.04,
    obtainedBy: 'Manter combo de 7 ataques sem pausar',
  },
  fragmentoDraconiano: {
    slug: 'fragmentoDraconiano',
    name: 'Fragmento Draconiano',
    icon: '💎',
    tier: 'epic',
    effect: '10 fragmentos = 1 evolução instantânea do dragão',
    duration: 'Permanente',
    dropChance: 0.02,
    obtainedBy: 'Derrotar um boss de banca',
  },
};

const TIER_STYLE = {
  common:    { color: '#5A6478', glow: 'rgba(90,100,120,0.4)',  label: 'Comum' },
  uncommon:  { color: '#00A86B', glow: 'rgba(0,168,107,0.45)',  label: 'Incomum' },
  rare:      { color: '#00B8D4', glow: 'rgba(0,184,212,0.5)',   label: 'Raro' },
  epic:      { color: '#5B47B8', glow: 'rgba(91,71,184,0.55)',  label: 'Épico' },
  legendary: { color: '#F59E0B', glow: 'rgba(245,158,11,0.6)',  label: 'Lendário' },
};

window.ROL_TIER_STYLE = TIER_STYLE;

// Random drop: chance individual por item. Retorna slug do item ou null.
window.ROL_rollDrop = function (sourceContext = 'generic') {
  const items = Object.values(window.ROL_ITEMS);
  for (const it of items) {
    if (Math.random() < it.dropChance) return it.slug;
  }
  return null;
};

window.ROL_grantItem = function (shared, slug) {
  if (!window.ROL_ITEMS[slug]) return shared;
  const items = shared.items || [];
  return {
    ...shared,
    items: [
      ...items,
      { id: `it_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, slug, gainedAt: new Date().toISOString(), used: false },
    ],
  };
};

// ─────────────────────────────────────────────────────────────
// ItemCard — célula do inventário
// ─────────────────────────────────────────────────────────────
function ItemCard({ entry, count = 1, onUse }) {
  const cfg = window.ROL_ITEMS[entry.slug] || {};
  const tier = TIER_STYLE[cfg.tier] || TIER_STYLE.common;
  return (
    <div className="glass" style={{
      padding: '12px 13px', display: 'flex', gap: 12, alignItems: 'center',
      borderLeft: `3px solid ${tier.color}`,
      boxShadow: `0 0 0 1px ${tier.color}33, 0 8px 24px -16px ${tier.glow}`,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: `radial-gradient(circle, ${tier.color}22, transparent 75%)`,
        border: `1px solid ${tier.color}55`,
        display: 'grid', placeItems: 'center',
        fontSize: 22, filter: `drop-shadow(0 0 6px ${tier.glow})`,
      }}>{cfg.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span className="font-display" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            {cfg.name || entry.slug}
          </span>
          <span className="num" style={{
            fontSize: 9, padding: '1px 6px', borderRadius: 4,
            background: `${tier.color}1A`, color: tier.color,
            fontWeight: 700, letterSpacing: '0.1em',
            border: `1px solid ${tier.color}44`,
          }}>{tier.label.toUpperCase()}</span>
          {count > 1 && (
            <span className="num" style={{
              fontSize: 10, fontWeight: 700, color: 'var(--tinta)',
              padding: '1px 6px', borderRadius: 4,
              background: 'rgba(91,71,184,0.1)',
            }}>×{count}</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>
          {cfg.effect}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2, fontStyle: 'italic' }}>
          Como obter: {cfg.obtainedBy}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// InventoryPanel — agrupa itens por slug e exibe contagem
// ─────────────────────────────────────────────────────────────
function InventoryPanel({ shared }) {
  const items = (shared.items || []).filter((it) => !it.used);
  const grouped = {};
  items.forEach((it) => {
    if (!grouped[it.slug]) grouped[it.slug] = { entry: it, count: 0 };
    grouped[it.slug].count += 1;
  });
  const list = Object.values(grouped);

  return (
    <div className="glass" style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 9.5, letterSpacing: '0.22em', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
            INVENTÁRIO MÁGICO
          </div>
          <div className="font-display" style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
            Itens raros que você conquistou
          </div>
        </div>
        <div className="num" style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: '0.1em' }}>
          {items.length} ITEM{items.length === 1 ? '' : 'S'}
        </div>
      </div>

      {list.length === 0 ? (
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 6, opacity: 0.55 }}>📦</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 360, margin: '0 auto', lineHeight: 1.5 }}>
            Seu inventário está vazio. Itens caem automaticamente ao concluir Modos de Ataque sem pausar, manter constância e derrotar bosses.
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {list.map(({ entry, count }) => (
            <ItemCard key={entry.slug} entry={entry} count={count} />
          ))}
        </div>
      )}

      <details style={{ marginTop: 14 }}>
        <summary style={{ fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
          VER CATÁLOGO COMPLETO
        </summary>
        <div style={{ display: 'grid', gap: 8, marginTop: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {Object.values(window.ROL_ITEMS).map((it) => {
            const tier = TIER_STYLE[it.tier] || TIER_STYLE.common;
            const has = grouped[it.slug]?.count || 0;
            return (
              <div key={it.slug} style={{
                padding: '10px 12px', borderRadius: 10, display: 'flex', gap: 10,
                background: has > 0 ? 'rgba(255,255,255,0.55)' : 'rgba(30,32,48,0.025)',
                border: `1px solid ${has > 0 ? tier.color + '44' : 'rgba(30,32,48,0.06)'}`,
                opacity: has > 0 ? 1 : 0.65,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: `${tier.color}1A`, border: `1px solid ${tier.color}44`,
                  display: 'grid', placeItems: 'center', fontSize: 18,
                  filter: has > 0 ? `drop-shadow(0 0 4px ${tier.glow})` : 'grayscale(0.5)',
                }}>{it.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{it.name}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)', lineHeight: 1.4 }}>{it.effect}</div>
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}

window.ItemCard = ItemCard;
window.InventoryPanel = InventoryPanel;
