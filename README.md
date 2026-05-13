# 🐉 Rise of a Legend

> Transforme sua maratona de concursos em uma aventura épica.
> App de estudos gamificado com dragão evolutivo, classes RPG, bosses de bancas e tracking offline-first.

![status](https://img.shields.io/badge/status-fase%201%20completa-8B5CF6)
![stack](https://img.shields.io/badge/stack-Vite%20%2B%20React%2018-A78BFA)
![offline](https://img.shields.io/badge/offline-first-10B981)

## ✨ Conceito

**Rise of a Legend** transforma o estudo para concursos em uma jornada de evolução épica:

- 🐉 **Dragão Evolutivo** — 7 estágios × 5 sub-níveis (35 marcos visuais)
- ⚔️ **3 Classes RPG** — Mago (mix), Filósofo (teoria), Gladiador (questões)
- 🐲 **Bosses de Bancas** — FGV, CEBRASPE, FCC, VUNESP como criaturas míticas
- 🎯 **Modo de Ataque** — Pomodoro com penalidades reais ao pausar
- 🏆 **60+ Conquistas** — desde "Primeiro Passo" até "Lenda"
- 📊 **Desempenho** — tracking de provas com insights automáticos
- 💾 **100% Offline** — localStorage com compressão LZ-String

## 🚀 Como Rodar

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # build de produção
npm run preview      # servir o build
```

## 🏗️ Stack

- **Build**: Vite 5
- **UI**: React 18 + React Router
- **Animações**: Framer Motion
- **Ícones**: Lucide React
- **Áudio**: Web Audio API (sons sintetizados)
- **Storage**: localStorage + LZ-String para compressão
- **Datas**: date-fns
- **Linguagem**: JavaScript (sem TypeScript para velocidade)

## 📁 Estrutura

```
src/
├── components/
│   ├── common/         # Button, Card, Badge, Modal, Toast, Input, EmptyState
│   ├── dragon/         # DragonAvatar, DragonStats, ClassBadge
│   └── layout/         # Header, Navigation, PageHeader
├── constants/          # colors, classes, bosses, achievements, phrases
├── contexts/           # AppContext (estado global)
├── hooks/              # useLocalStorage, useSound
├── pages/              # Hoje, EditaisObjetiva, EditaisDiscursiva,
│                       # Desempenho, Conquistas, Ajustes
├── styles/             # global.css, animations.css, pages.css
├── utils/              # storage, xp-calculator, dragon-evolution, format
├── App.jsx             # Root com roteamento
└── main.jsx            # Entry point
```

## 💾 Armazenamento

Quatro chaves no localStorage:

- `rise_shared` — Dados do usuário (XP, nível, dragão, classes, achievements, items, streak)
- `rise_edital_objetiva` — Matriz da fase objetiva (disciplinas, tópicos, checkboxes)
- `rise_edital_discursiva` — Matriz da fase discursiva
- `rise_exam_performance` — Histórico de provas e desempenho

Dados grandes são comprimidos automaticamente com LZ-String.

## 🗺️ Roadmap

### ✅ Fase 1: Fundação (esta versão)
- [x] Setup Vite + React 18
- [x] Design system completo (CSS Variables, animações)
- [x] Sistema de localStorage com compressão
- [x] Componentes base (Button, Card, Badge, Modal, Toast, Input, EmptyState)
- [x] Componentes do Dragão (Avatar, Stats, ClassBadge)
- [x] Header + Navigation (mobile bottom bar + desktop sidebar)
- [x] 6 páginas (Hoje funcional, demais com esqueleto)
- [x] Página Hoje com dragão, XP, streak, classes
- [x] Sistema de sons sintetizados
- [x] Backup / Restauração / Reset

### 🔜 Fase 2: Progressão & Editais
- [ ] Animação cinemática de evolução de estágio
- [ ] Modal de registro de estudo
- [ ] Cálculo automático de classe (últimos 14 dias)
- [ ] Matriz Objetiva (disciplinas, tópicos, 5 checkboxes, heatmap)
- [ ] Matriz Discursiva (3 checkboxes, heatmap de 4 níveis)
- [ ] Som de espada ao marcar checkbox

### 🔜 Fase 3: Combate & Conquistas Avançadas
- [ ] Sistema de Bosses por banca (HP, dano, derrota)
- [ ] Modo de Ataque com timer Pomodoro + penalidades
- [ ] Aba Desempenho com gráficos e insights
- [ ] Verificação automática de conquistas
- [ ] Drop de itens (poções, escudos, fragmentos)
- [ ] Horário Padrão de Estudos
- [ ] Grande Batalha (countdown pré-prova)

## 📜 Licença

Projeto pessoal de uma concurseira. Use como inspiração ou base para suas próprias jornadas. 🐉
