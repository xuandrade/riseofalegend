# 🐉 Rise of a Legend

App de estudos gamificado para concursos públicos, construído sobre a base do TOGA.
Transforma sua maratona de concursos em uma jornada épica com sistema de XP,
classes RPG, bosses de bancas e tracking offline-first.

> **Status:** Fase 1 entregue · Fases 2 e 3 em desenvolvimento

## 🚀 Como rodar

Não tem build step. É um SPA com Babel inline + React via CDN — basta servir os arquivos
estáticos por qualquer servidor HTTP local.

```bash
# Opção 1: Python
python3 -m http.server 8000
# acesse http://localhost:8000

# Opção 2: Node (http-server)
npx http-server -p 8000 .

# Opção 3: PHP
php -S localhost:8000
```

Abra `http://localhost:8000` no navegador. Tudo persiste em `localStorage`.

## 📐 Arquitetura

- **React 18** via CDN (UMD)
- **Babel Standalone** transformando JSX inline no browser
- **Zero bundler** — scripts `.jsx` carregados em ordem no `index.html`
- **localStorage** com 4 chaves (`da_v3_shared`, `da_v3_objetiva`, `da_v3_discursiva`, `da_v3_meta`)
- **Backup/restore JSON** manual via Ajustes
- **Fontes:** Space Grotesk + Inter + JetBrains Mono
- **Design:** glass morphism + aurora + dot-grid neon

## 🎮 Features

### Da base TOGA (preservadas 100%)
- 6 abas: Hoje, Edital, Simulados, Estatísticas, Histórico, Ajustes
- Pet dragão de 8 estágios animados (com estado "doente")
- Sistema de XP, constância (streak), shields, conquistas
- Matriz Objetiva (5 checkboxes) e Discursiva (3 checkboxes) com heatmap
- Pomodoro/Blindado, registro de sessão completo, simulados, gráficos, insights automáticos

### Novas mecânicas do Rise of a Legend
- **Sistema de 3 Classes** (Mago/Filósofo/Gladiador) auto-detectado pelos últimos 14 dias
  - Aura colorida em volta do pet
  - ClassBadge clicável no header
  - Bônus de XP automáticos em todas as ações
- **Aba DESEMPENHO** (nova) — CRUD de provas realizadas com insights por disciplina
- Splash + onboarding rebrandeados

## 🗺️ Roadmap

- ✅ **Fase 1:** Base TOGA + Classes + Desempenho
- 🔜 **Fase 2:** Bosses das bancas (FGV/CEBRASPE/FCC/VUNESP) + Modo de Ataque + Inventário de Itens
- 🔜 **Fase 3:** Reta Final + Desafios Semanais + Evolução redesenhada + Horário Padrão + Grande Batalha

## 📁 Estrutura

```
.
├── index.html              # Entry point (carrega tudo em ordem)
├── styles.css              # Design system completo
├── data.jsx                # Modelo de dados, defaults, helpers
├── app.jsx                 # Root component + roteamento por abas
│
├── header.jsx              # Header sticky + ClassBadge
├── splash.jsx              # Splash screen inicial
├── onboarding.jsx          # Tutorial de boas-vindas
├── pet.jsx                 # Dragão SVG + aura de classe + cinemática evolução
│
├── classes.jsx             # 🆕 Sistema de Classes (auto-detecção, bônus, modal)
├── desempenho.jsx          # 🆕 Aba Desempenho em Concursos
│
├── syllabus-matrix.jsx     # Matriz Objetiva
├── syllabus-disc.jsx       # Matriz Discursiva
├── edital-heatmap.jsx      # Heatmap por disciplina
├── heatmaps.jsx            # Heatmaps de estudo
├── session-log.jsx         # Modal de registro de sessão (+ Pomodoro)
├── simulados.jsx           # Aba Simulados
├── stats.jsx               # Aba Estatísticas
├── historico.jsx           # Aba Histórico
├── constancia.jsx          # Tracker de constância 30 dias
├── insights.jsx            # Painel de insights automáticos
├── interactions.jsx        # Confetes, sons, celebrações
│
├── gavel-bar.jsx           # GavelBar "Rumo à Posse"
├── metrics-row.jsx         # Linha de métricas
├── shield-badge.jsx        # Badge de progresso
├── icons.jsx               # Set de ícones SVG
├── backup.jsx              # Export/import/reset
├── tweaks-panel.jsx        # Painel dev/sandbox
└── license-gate.jsx        # Gate de licença
```

## 💾 Storage

Tudo offline em `localStorage`. Schema retrocompatível com o TOGA original:

- `da_v3_shared` — XP, level, classe, streak, logs diários, conquistas, simulados, concursos, examPerformance (novo)
- `da_v3_objetiva` — Matriz objetiva (disciplinas + tópicos + 5 flags)
- `da_v3_discursiva` — Matriz discursiva (3 flags)
- `da_v3_meta` — Preferências (modo ativo)

Backup manual via aba Ajustes → JSON download.
