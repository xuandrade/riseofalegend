import { BarChart3 } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';

export default function Desempenho() {
  return (
    <div className="page-stack">
      <PageHeader
        icon={BarChart3}
        title="Desempenho em Concursos"
        subtitle="Rastreie cada prova realizada, veja insights por disciplina e descubra onde precisa fortalecer sua armadura."
      />

      <Card>
        <EmptyState
          icon="📊"
          title="Painel de provas chegando"
          description="Aqui você vai cadastrar resultados de concursos, ver gráficos por disciplina e receber insights automáticos sobre pontos fortes e áreas de melhoria."
        />
      </Card>
    </div>
  );
}
