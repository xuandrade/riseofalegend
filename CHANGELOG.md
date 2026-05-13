# Changelog

## [Fase 1] — 2026-05-13

### ✨ Adicionado
- Setup completo Vite 5 + React 18 + React Router
- Design system (CSS Variables, animações, tipografia Cinzel + Inter)
- Sistema de armazenamento offline-first com LZ-String
  - 4 chaves: `rise_shared`, `rise_edital_objetiva`, `rise_edital_discursiva`, `rise_exam_performance`
  - Auto-compressão para dados grandes (> 2KB)
- Componentes base: Button, Card, Badge, Modal, Toast, Input, EmptyState
- Componentes do Dragão: Avatar (com aura + sub-níveis), Stats (XP bar), ClassBadge
- Layout: Header com nome editável, Navigation responsiva (bottom bar + sidebar)
- 6 páginas: Hoje (funcional), Editais Objetiva/Discursiva, Desempenho, Conquistas, Ajustes
- Sistema de XP, cálculo de classes, evolução do dragão (7 estágios × 5 sub-níveis)
- Hook `useSound` com Web Audio API (sons sintetizados sem assets)
- 30+ conquistas em 9 categorias
- 6 bancas como bosses míticos (FGV, CEBRASPE, FCC, VUNESP, Banca Própria, Outras)
- Backup / Restauração / Reset via Ajustes
- Favicon + logo SVG do dragão

### 🚧 Próximas fases
- **Fase 2**: Modal de registro de estudo, matrizes Objetiva e Discursiva com checkboxes, heatmap, cinemática de evolução
- **Fase 3**: Bosses ativos, Modo de Ataque (Pomodoro), aba Desempenho com gráficos, drop de itens, Grande Batalha
