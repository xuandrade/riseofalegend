import { PenLine } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import EditalMatrix from '../components/edital/EditalMatrix.jsx';
import { useApp } from '../contexts/AppContext.jsx';
import { DISCURSIVA_CHECKS } from '../utils/edital.js';

export default function EditaisDiscursiva() {
  const { editalDiscursiva, setEditalDiscursiva } = useApp();

  return (
    <div className="page-stack">
      <PageHeader
        icon={PenLine}
        title="Matriz Discursiva"
        subtitle="Para a fase escrita: Estudado, Grifado e Questões. Heatmap visual em 4 níveis para você ver onde precisa reforçar."
      />

      <EditalMatrix
        kind="discursiva"
        edital={editalDiscursiva}
        setEdital={setEditalDiscursiva}
        checks={DISCURSIVA_CHECKS}
        heatmapLevels={4}
      />
    </div>
  );
}
