import { Settings, Download, Upload, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import { useApp } from '../contexts/AppContext.jsx';
import { exportAllData, importAllData, resetAllData } from '../utils/storage.js';
import './Ajustes.css';

export default function Ajustes() {
  const { settings, updateSettings, pushToast } = useApp();
  const [resetOpen, setResetOpen] = useState(false);
  const fileRef = useRef(null);

  const onExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rise-of-a-legend-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast({ type: 'success', title: 'Backup exportado', message: 'Arquivo salvo no seu computador.' });
  };

  const onImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const ok = importAllData(data);
        if (ok) {
          pushToast({
            type: 'success',
            title: 'Backup importado',
            message: 'Recarregando o app...',
          });
          setTimeout(() => window.location.reload(), 1200);
        }
      } catch (err) {
        pushToast({ type: 'info', title: 'Arquivo inválido', message: 'Não foi possível ler o backup.' });
      }
    };
    reader.readAsText(file);
  };

  const onReset = () => {
    resetAllData();
    window.location.reload();
  };

  return (
    <div className="page-stack">
      <PageHeader icon={Settings} title="Ajustes" subtitle="Personalize sua aventura como preferir." />

      <Card>
        <h3 className="ajustes__section-title">Preferências</h3>
        <div className="ajustes__option">
          <div>
            <strong>Sons do app</strong>
            <p>Espadas, level ups, hits de boss e mais.</p>
          </div>
          <Button
            variant={settings.soundsEnabled ? 'primary' : 'secondary'}
            icon={settings.soundsEnabled ? Volume2 : VolumeX}
            size="sm"
            onClick={() => updateSettings({ soundsEnabled: !settings.soundsEnabled })}
          >
            {settings.soundsEnabled ? 'Ativos' : 'Mudos'}
          </Button>
        </div>
        <div className="ajustes__option">
          <div>
            <strong>Animações</strong>
            <p>Cinemáticas de evolução e efeitos visuais.</p>
          </div>
          <Button
            variant={settings.animationsEnabled ? 'primary' : 'secondary'}
            icon={Sparkles}
            size="sm"
            onClick={() => updateSettings({ animationsEnabled: !settings.animationsEnabled })}
          >
            {settings.animationsEnabled ? 'Ativadas' : 'Reduzidas'}
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="ajustes__section-title">Backup &amp; Restauração</h3>
        <p className="ajustes__hint">
          Exporte seus dados regularmente para não perder sua jornada. O app é 100% offline.
        </p>
        <div className="ajustes__actions">
          <Button icon={Download} onClick={onExport}>
            Exportar backup
          </Button>
          <Button variant="secondary" icon={Upload} onClick={() => fileRef.current?.click()}>
            Importar backup
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={onImport}
          />
        </div>
      </Card>

      <Card>
        <h3 className="ajustes__section-title ajustes__section-title--danger">Zona de Perigo</h3>
        <p className="ajustes__hint">
          Resetar apaga todo seu progresso: dragão, XP, conquistas, editais e desempenho. Isso
          não pode ser desfeito.
        </p>
        <Button variant="danger" icon={RotateCcw} onClick={() => setResetOpen(true)}>
          Resetar todo o progresso
        </Button>
      </Card>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Tem certeza absoluta?"
        size="sm"
      >
        <p>
          Esta ação não pode ser desfeita. Todo o XP, conquistas, dragão, editais e desempenho
          serão apagados permanentemente.
        </p>
        <div className="ajustes__modal-actions">
          <Button variant="secondary" onClick={() => setResetOpen(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onReset}>
            Sim, apagar tudo
          </Button>
        </div>
      </Modal>
    </div>
  );
}
