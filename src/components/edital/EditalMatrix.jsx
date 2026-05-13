import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronDown, ChevronRight, Edit3 } from 'lucide-react';
import Button from '../common/Button.jsx';
import Badge from '../common/Badge.jsx';
import Card from '../common/Card.jsx';
import EmptyState from '../common/EmptyState.jsx';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import {
  createSubject,
  createTopic,
  editalProgress,
  heatColor,
  progressColor,
  subjectProgress,
} from '../../utils/edital.js';
import { useApp } from '../../contexts/AppContext.jsx';
import { calculateActionXP } from '../../utils/xp-calculator.js';
import './EditalMatrix.css';

export default function EditalMatrix({ kind, edital, setEdital, checks, heatmapLevels = 5 }) {
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const { addXP, sound } = useApp();

  const totalProgress = editalProgress(edital, checks);

  const addSubject = (name) => {
    setEdital((prev) => ({
      ...prev,
      subjects: [...prev.subjects, createSubject({ name })],
    }));
  };

  const removeSubject = (id) => {
    setEdital((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== id),
    }));
  };

  const updateSubject = (id, partial) => {
    setEdital((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    }));
  };

  const addTopic = (subjectId, topicData) => {
    setEdital((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? { ...s, topics: [...s.topics, createTopic({ ...topicData, checks })] }
          : s,
      ),
    }));
  };

  const updateTopic = (subjectId, topicId, partial) => {
    setEdital((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              topics: s.topics.map((t) => (t.id === topicId ? { ...t, ...partial } : t)),
            }
          : s,
      ),
    }));
  };

  const removeTopic = (subjectId, topicId) => {
    setEdital((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? { ...s, topics: s.topics.filter((t) => t.id !== topicId) }
          : s,
      ),
    }));
  };

  const handleToggleCheck = (subjectId, topicId, checkId) => {
    const subject = edital.subjects.find((s) => s.id === subjectId);
    const topic = subject?.topics.find((t) => t.id === topicId);
    if (!topic) return;
    const newValue = !topic[checkId];

    updateTopic(subjectId, topicId, {
      [checkId]: newValue,
      lastStudiedAt: newValue ? new Date().toISOString() : topic.lastStudiedAt,
    });

    if (newValue) {
      sound.play('swordHit');
      const xp = calculateActionXP({
        type: 'checkbox',
        weight: topic.weight,
        isEssential: topic.isEssential,
      });
      addXP(xp, { reason: `${topic.name}` });
    }
  };

  return (
    <div className="edital-matrix">
      <Card variant="purple" className="edital-matrix__progress">
        <div>
          <span className="edital-matrix__progress-label">Progresso global</span>
          <strong className="edital-matrix__progress-value">{totalProgress.toFixed(1)}%</strong>
        </div>
        <div className="edital-matrix__progress-bar">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: progressColor(totalProgress) }}
          />
        </div>
        <Button icon={Plus} onClick={() => setAddSubjectOpen(true)} size="sm">
          Nova disciplina
        </Button>
      </Card>

      {edital.subjects.length === 0 ? (
        <Card>
          <EmptyState
            icon="📚"
            title="Sem disciplinas ainda"
            description={`Crie sua primeira disciplina da matriz ${kind}. Cada tópico ganha ${checks.length} checkboxes para você marcar conforme estuda.`}
            action={
              <Button icon={Plus} onClick={() => setAddSubjectOpen(true)}>
                Adicionar disciplina
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="edital-matrix__subjects">
          {edital.subjects.map((s) => (
            <SubjectAccordion
              key={s.id}
              subject={s}
              checks={checks}
              heatmapLevels={heatmapLevels}
              onToggle={handleToggleCheck}
              onRemove={removeSubject}
              onRename={(name) => updateSubject(s.id, { name })}
              onAddTopic={(data) => addTopic(s.id, data)}
              onEditTopic={(topic) => setEditingTopic({ subjectId: s.id, topic })}
              onRemoveTopic={(topicId) => removeTopic(s.id, topicId)}
            />
          ))}
        </div>
      )}

      <AddSubjectModal
        open={addSubjectOpen}
        onClose={() => setAddSubjectOpen(false)}
        onSubmit={(name) => {
          addSubject(name);
          setAddSubjectOpen(false);
        }}
      />

      <TopicEditModal
        open={!!editingTopic}
        topic={editingTopic?.topic}
        onClose={() => setEditingTopic(null)}
        onSubmit={(partial) => {
          if (!editingTopic) return;
          updateTopic(editingTopic.subjectId, editingTopic.topic.id, partial);
          setEditingTopic(null);
        }}
      />
    </div>
  );
}

function SubjectAccordion({
  subject,
  checks,
  heatmapLevels,
  onToggle,
  onRemove,
  onRename,
  onAddTopic,
  onEditTopic,
  onRemoveTopic,
}) {
  const [open, setOpen] = useState(true);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(subject.name);
  const [addTopicOpen, setAddTopicOpen] = useState(false);
  const percent = subjectProgress(subject, checks);

  return (
    <Card className="subject-accordion">
      <div className="subject-accordion__header">
        <button
          type="button"
          className="subject-accordion__toggle"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <div className="subject-accordion__title">
          {renaming ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                setRenaming(false);
                onRename(name.trim() || subject.name);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur();
              }}
            />
          ) : (
            <strong onDoubleClick={() => setRenaming(true)}>{subject.name}</strong>
          )}
          <span style={{ color: progressColor(percent) }}>{percent.toFixed(0)}%</span>
        </div>
        <div className="subject-accordion__actions">
          <button
            type="button"
            className="subject-accordion__icon-btn"
            onClick={() => setRenaming(true)}
            title="Renomear"
          >
            <Edit3 size={14} />
          </button>
          <button
            type="button"
            className="subject-accordion__icon-btn subject-accordion__icon-btn--danger"
            onClick={() => {
              if (confirm(`Excluir a disciplina "${subject.name}" e todos os seus tópicos?`)) {
                onRemove(subject.id);
              }
            }}
            title="Excluir"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="subject-accordion__bar">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6 }}
          style={{ background: heatColor(percent, heatmapLevels) }}
        />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="subject-accordion__content"
          >
            <div className="subject-accordion__topics-head">
              <span>Tópicos ({subject.topics.length})</span>
              <Button icon={Plus} size="sm" variant="ghost" onClick={() => setAddTopicOpen(true)}>
                Adicionar tópico
              </Button>
            </div>

            {subject.topics.length === 0 ? (
              <p className="subject-accordion__empty">
                Nenhum tópico ainda. Adicione o primeiro para começar a marcar.
              </p>
            ) : (
              <ul className="subject-accordion__topics">
                {subject.topics.map((topic) => (
                  <TopicItem
                    key={topic.id}
                    topic={topic}
                    checks={checks}
                    heatmapLevels={heatmapLevels}
                    onToggle={(checkId) => onToggle(subject.id, topic.id, checkId)}
                    onEdit={() => onEditTopic(topic)}
                    onRemove={() => onRemoveTopic(topic.id)}
                  />
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AddTopicModal
        open={addTopicOpen}
        onClose={() => setAddTopicOpen(false)}
        onSubmit={(data) => {
          onAddTopic(data);
          setAddTopicOpen(false);
        }}
      />
    </Card>
  );
}

function TopicItem({ topic, checks, heatmapLevels, onToggle, onEdit, onRemove }) {
  const done = checks.filter((c) => topic[c.id]).length;
  const percent = (done / checks.length) * 100;

  return (
    <li
      className="topic-item"
      style={{
        background: percent > 0 ? heatColor(percent, heatmapLevels) : undefined,
      }}
    >
      <div className="topic-item__main">
        <div className="topic-item__header">
          <strong>{topic.name}</strong>
          <div className="topic-item__meta">
            {topic.isEssential && <Badge variant="essential" size="sm">ESSENCIAL</Badge>}
            <Badge variant="purple" size="sm">
              Peso {topic.weight}/5
            </Badge>
          </div>
        </div>

        <div className="topic-item__checks">
          {checks.map((c) => {
            const checked = topic[c.id];
            return (
              <button
                key={c.id}
                type="button"
                className={`topic-item__check ${checked ? 'topic-item__check--done' : ''}`}
                onClick={() => onToggle(c.id)}
                title={c.label}
              >
                <span className="topic-item__check-box">
                  {checked ? '✓' : c.shortLabel}
                </span>
                <span className="topic-item__check-label">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="topic-item__actions">
        <button type="button" onClick={onEdit} className="topic-item__icon-btn" title="Editar">
          <Edit3 size={14} />
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm(`Excluir tópico "${topic.name}"?`)) onRemove();
          }}
          className="topic-item__icon-btn topic-item__icon-btn--danger"
          title="Excluir"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </li>
  );
}

function AddSubjectModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState('');
  return (
    <Modal open={open} onClose={onClose} title="Nova disciplina" size="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          onSubmit(name.trim());
          setName('');
        }}
        className="add-subject-form"
      >
        <Input
          label="Nome da disciplina"
          placeholder="Ex.: Direito Constitucional"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div className="add-subject-form__actions">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!name.trim()}>
            Adicionar
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function AddTopicModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(3);
  const [isEssential, setIsEssential] = useState(false);

  const reset = () => {
    setName('');
    setWeight(3);
    setIsEssential(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Novo tópico"
      size="sm"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          onSubmit({ name: name.trim(), weight, isEssential });
          reset();
        }}
        className="add-topic-form"
      >
        <Input
          label="Nome do tópico"
          placeholder="Ex.: Direitos Fundamentais"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div>
          <label className="add-topic-form__label">Peso ({weight}/5)</label>
          <input
            type="range"
            min="1"
            max="5"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value, 10))}
            className="add-topic-form__range"
          />
        </div>
        <label className="add-topic-form__checkbox">
          <input
            type="checkbox"
            checked={isEssential}
            onChange={(e) => setIsEssential(e.target.checked)}
          />
          <span>Marcar como tópico essencial (XP +2x)</span>
        </label>
        <div className="add-topic-form__actions">
          <Button
            variant="ghost"
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={!name.trim()}>
            Adicionar tópico
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function TopicEditModal({ open, topic, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(3);
  const [isEssential, setIsEssential] = useState(false);

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setWeight(topic.weight);
      setIsEssential(topic.isEssential);
    }
  }, [topic?.id]);

  if (!topic) return null;

  return (
    <Modal open={open} onClose={onClose} title="Editar tópico" size="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            name: name.trim() || topic.name,
            weight,
            isEssential,
          });
        }}
        className="add-topic-form"
      >
        <Input
          label="Nome do tópico"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div>
          <label className="add-topic-form__label">Peso ({weight}/5)</label>
          <input
            type="range"
            min="1"
            max="5"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value, 10))}
            className="add-topic-form__range"
          />
        </div>
        <label className="add-topic-form__checkbox">
          <input
            type="checkbox"
            checked={isEssential}
            onChange={(e) => setIsEssential(e.target.checked)}
          />
          <span>Marcar como tópico essencial (XP +2x)</span>
        </label>
        <div className="add-topic-form__actions">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
