import { ClipboardList } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import EditalMatrix from '../components/edital/EditalMatrix.jsx';
import { useApp } from '../contexts/AppContext.jsx';
import { OBJETIVA_CHECKS } from '../utils/edital.js';

export default function EditaisObjetiva() {
  const { editalObjetiva, setEditalObjetiva } = useApp();

  return (
    <div className="page-stack">
      <PageHeader
        icon={ClipboardList}
        title="Matriz Objetiva"
        subtitle="Mapeie cada tópico do edital e marque suas conquistas com 5 checkboxes: Lei, Doutrina, Jurisprudência, Questões e Revisão."
      />

      <EditalMatrix
        kind="objetiva"
        edital={editalObjetiva}
        setEdital={setEditalObjetiva}
        checks={OBJETIVA_CHECKS}
        heatmapLevels={5}
      />
    </div>
  );
}
