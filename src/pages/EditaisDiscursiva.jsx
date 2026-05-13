import { PenLine } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';

export default function EditaisDiscursiva() {
  return (
    <div className="page-stack">
      <PageHeader
        icon={PenLine}
        title="Matriz Discursiva"
        subtitle="Para a fase escrita: Estudado, Grifado e Questões. Heatmap visual em 4 níveis para você ver onde precisa reforçar."
      />

      <Card>
        <EmptyState
          icon="🖋️"
          title="Em construção na Fase 2"
          description="Estrutura espelhada à Objetiva, mas com 3 checkboxes e heatmap de 4 níveis. Pronto para chegar na próxima fase."
        />
      </Card>
    </div>
  );
}
