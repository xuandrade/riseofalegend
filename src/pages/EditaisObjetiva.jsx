import { ClipboardList } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';

export default function EditaisObjetiva() {
  return (
    <div className="page-stack">
      <PageHeader
        icon={ClipboardList}
        title="Matriz Objetiva"
        subtitle="Mapeie cada tópico do edital e marque suas conquistas com 5 checkboxes: Lei, Doutrina, Jurisprudência, Questões e Revisão."
      />

      <Card>
        <EmptyState
          icon="📜"
          title="Matriz pronta na Fase 2"
          description="A árvore de disciplinas com tópicos, checkboxes e heatmap será adicionada na próxima fase. O esqueleto já está preparado para receber a matriz completa."
        />
      </Card>
    </div>
  );
}
