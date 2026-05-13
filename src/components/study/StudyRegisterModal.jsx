import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Swords, Clock, Hash, BookText, Zap, Sparkles } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Badge from '../common/Badge.jsx';
import { useApp } from '../../contexts/AppContext.jsx';
import { calculateActionXP } from '../../utils/xp-calculator.js';
import { CLASSES } from '../../constants/classes.js';
import { formatNumber } from '../../utils/format.js';
import './StudyRegisterModal.css';

const TYPE_OPTIONS = [
  {
    id: 'teoria',
    name: 'Teoria',
    description: 'Leitura, vídeo-aulas, resumos.',
    icon: BookOpen,
    color: 'var(--class-filosofo)',
  },
  {
    id: 'questoes',
    name: 'Questões',
    description: 'Resolução de questões avulsas.',
    icon: Swords,
    color: 'var(--class-gladiador)',
  },
];

export default function StudyRegisterModal({ open, onClose }) {
  const { user, registrarEstudo, pushToast } = useApp();
  const [type, setType] = useState('teoria');
  const [hours, setHours] = useState('1');
  const [questions, setQuestions] = useState('20');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');

  const durationMin = type === 'teoria' ? Math.max(0, parseFloat(hours) || 0) * 60 : 0;
  const questionsCount = type === 'questoes' ? Math.max(0, parseInt(questions) || 0) : 0;

  const projectedXP = useMemo(
    () =>
      calculateActionXP({
        type,
        durationMin,
        questionsCount,
        dragonClass: user.dragonClass,
      }),
    [type, durationMin, questionsCount, user.dragonClass],
  );

  const classConfig = CLASSES[user.dragonClass];

  const reset = () => {
    setType('teoria');
    setHours('1');
    setQuestions('20');
    setSubject('');
    setNotes('');
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (type === 'teoria' && durationMin <= 0) {
      pushToast({ type: 'info', title: 'Informe o tempo', message: 'Adicione pelo menos alguns minutos de teoria.' });
      return;
    }
    if (type === 'questoes' && questionsCount <= 0) {
      pushToast({ type: 'info', title: 'Informe as questões', message: 'Adicione pelo menos uma questão.' });
      return;
    }

    registrarEstudo({
      type,
      durationMin,
      questionsCount,
      subject: subject.trim() || null,
      notes: notes.trim(),
    });
    reset();
    onClose?.();
  };

  return (
    <Modal open={open} onClose={onClose} title="Registrar estudo" size="md">
      <form onSubmit={handleSubmit} className="study-register">
        <div className="study-register__types">
          {TYPE_OPTIONS.map((opt) => {
            const active = type === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                className={`study-register__type ${active ? 'study-register__type--active' : ''}`}
                onClick={() => setType(opt.id)}
                style={active ? { borderColor: opt.color, color: opt.color } : undefined}
              >
                <Icon size={22} />
                <div>
                  <strong>{opt.name}</strong>
                  <small>{opt.description}</small>
                </div>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {type === 'teoria' ? (
            <motion.div
              key="teoria"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18 }}
              className="study-register__fields"
            >
              <Input
                label="Tempo de teoria (horas)"
                type="number"
                step="0.25"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                icon={Clock}
                suffix="h"
                hint="Frações de hora aceitas. Ex.: 0.5 para 30 min."
              />
            </motion.div>
          ) : (
            <motion.div
              key="questoes"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18 }}
              className="study-register__fields"
            >
              <Input
                label="Quantidade de questões"
                type="number"
                min="0"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                icon={Hash}
                suffix="questões"
                hint="Cada 10 questões valem 50 XP base."
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Input
          label="Matéria (opcional)"
          placeholder="Ex.: Direito Constitucional"
          icon={BookText}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <Input
          label="Observações (opcional)"
          placeholder="Anote algo importante sobre essa sessão"
          multiline
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="study-register__preview">
          <div>
            <span className="study-register__preview-label">
              <Zap size={14} /> XP estimado
            </span>
            <strong>+{formatNumber(projectedXP)}</strong>
          </div>
          <Badge variant={user.dragonClass} icon={Sparkles}>
            Bônus {classConfig.name}
          </Badge>
        </div>

        <div className="study-register__actions">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" icon={Zap}>
            Registrar e ganhar XP
          </Button>
        </div>
      </form>
    </Modal>
  );
}
