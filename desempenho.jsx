// Rise of a Legend — Aba de Desempenho em Concursos (CRUD + insights)
// Armazena em `shared.examPerformance` (array)

const BANCAS = ['FGV', 'CEBRASPE', 'FCC', 'VUNESP', 'IBFC', 'IADES', 'AOCP', 'Banca Própria', 'Outras'];

function DesempenhoTab({ shared, setShared, onToast }) {
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const exams = shared.examPerformance || [];

  const remove = (id) => {
    if (!confirm('Excluir esse resultado? Esta ação não pode ser desfeita.')) return;
    setShared((s) => ({ ...s, examPerformance: (s.examPerformance || []).filter((e) => e.id !== id) }));
  };

  const save = (record) => {
    setShared((s) => {
      const list = s.examPerformance || [];
      const exists = list.find((e) => e.id === record.id);
      const next = exists ? list.map((e) => (e.id === record.id ? record : e)) : [record, ...list];
      return { ...s, examPerformance: next };
    });
    onToast && onToast('exam_saved');
    setFormOpen(false);
    setEditing(null);
  };

  // Insights automáticos
  const insights = React.useMemo(() => computeExamInsights(exams), [exams]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--petroleo)' }}>
            Desempenho em Concursos
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Registre cada prova realizada e veja seus pontos fortes evoluindo.
          </div>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-neon" style={{ fontSize: 13 }}>
          ➕ Adicionar resultado
        </button>
      </div>

      {insights.length > 0 && (
        <section className="anim-slide-up" style={{ marginBottom: 16, animationDelay: '40ms' }}>
          <div style={{ fontSize: 9.5, letterSpacing: '0.22em', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, marginBottom: 8 }}>
            INSIGHTS AUTOMÁTICOS
          </div>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {insights.map((ins, i) => (
              <div key={i} className="glass" style={{
                padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10,
                borderLeft: `3px solid ${ins.color}`,
              }}>
                <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{ins.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: ins.color, marginBottom: 3 }}>{ins.title}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.4 }}>{ins.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {exams.length === 0 ? (
        <div className="glass" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 44, marginBottom: 10, opacity: 0.7 }}>📊</div>
          <div className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
            Nenhum resultado registrado ainda
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, maxWidth: 380, margin: '0 auto 14px', lineHeight: 1.5 }}>
            Adicione resultados de concursos passados para acompanhar sua evolução,
            identificar pontos fortes e descobrir o que precisa fortalecer.
          </div>
          <button onClick={() => setFormOpen(true)} className="btn-neon" style={{ fontSize: 13 }}>
            ➕ Adicionar primeiro resultado
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {exams.map((ex) => (
            <ExamCard
              key={ex.id}
              exam={ex}
              onEdit={() => { setEditing(ex); setFormOpen(true); }}
              onRemove={() => remove(ex.id)}
            />
          ))}
        </div>
      )}

      <ExamFormModal
        open={formOpen}
        initial={editing}
        onSave={save}
        onClose={() => { setFormOpen(false); setEditing(null); }}
      />
    </div>
  );
}

function ExamCard({ exam, onEdit, onRemove }) {
  const pct = exam.totalQuestions > 0 ? (exam.totalCorrect / exam.totalQuestions) * 100 : null;
  const approved = exam.status === 'approved' || (exam.cutoff != null && exam.totalCorrect != null && exam.totalCorrect >= exam.cutoff);
  const dateFmt = exam.date ? new Date(exam.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  return (
    <div className="glass" style={{ padding: 16, borderLeft: `3px solid ${approved ? 'var(--esmeralda)' : 'var(--coral)'}` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span className="num" style={{
              fontSize: 9, padding: '2px 7px', borderRadius: 4,
              background: 'rgba(0,184,212,0.12)', color: 'var(--ciano)',
              fontWeight: 700, letterSpacing: '0.1em',
              border: '1px solid rgba(0,184,212,0.3)',
            }}>{exam.banca || 'OUTROS'}</span>
            <span className="num" style={{
              fontSize: 9, padding: '2px 7px', borderRadius: 4,
              background: approved ? 'rgba(0,168,107,0.12)' : 'rgba(232,93,93,0.12)',
              color: approved ? 'var(--esmeralda)' : 'var(--coral)',
              fontWeight: 700, letterSpacing: '0.1em',
              border: `1px solid ${approved ? 'rgba(0,168,107,0.3)' : 'rgba(232,93,93,0.3)'}`,
            }}>{approved ? '✅ APROVADO' : '❌ NÃO APROVADO'}</span>
          </div>
          <div className="font-display" style={{ fontSize: 17, fontWeight: 700 }}>{exam.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{dateFmt}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="num" style={{ fontSize: 22, fontWeight: 800, color: approved ? 'var(--esmeralda)' : 'var(--petroleo)' }}>
            {exam.totalCorrect != null ? exam.totalCorrect : '—'}
            <span style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}> / {exam.totalQuestions || '—'}</span>
          </div>
          {pct != null && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              {pct.toFixed(1)}% de acerto
            </div>
          )}
          {exam.cutoff != null && (
            <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
              Corte: {exam.cutoff}
            </div>
          )}
        </div>
      </div>

      {exam.disciplines && exam.disciplines.length > 0 && (
        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: 9.5, letterSpacing: '0.18em', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, marginBottom: 6 }}>
            DESEMPENHO POR DISCIPLINA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {exam.disciplines.map((d, i) => {
              const accuracy = d.total > 0 ? (d.correct / d.total) * 100 : 0;
              const color = accuracy >= 80 ? 'var(--esmeralda)' : accuracy >= 60 ? 'var(--ciano)' : accuracy >= 40 ? 'var(--ambar)' : 'var(--coral)';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
                  <span className="num" style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', minWidth: 56, textAlign: 'right' }}>
                    {d.correct}/{d.total}
                  </span>
                  <div style={{ width: 70, height: 4, background: 'rgba(30,32,48,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.max(2, Math.min(100, accuracy))}%`, background: color, borderRadius: 99 }} />
                  </div>
                  <span className="num" style={{ fontSize: 11, color, fontWeight: 700, minWidth: 38, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>
                    {accuracy.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {exam.notes && (
        <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(11,61,92,0.03)', borderRadius: 8, fontSize: 11.5, color: 'var(--text-muted)', fontStyle: 'italic' }}>
          {exam.notes}
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, marginTop: 10, justifyContent: 'flex-end' }}>
        <button onClick={onEdit} className="btn-ghost" style={{ fontSize: 11, padding: '5px 10px' }}>✏️ Editar</button>
        <button onClick={onRemove} className="btn-ghost" style={{ fontSize: 11, padding: '5px 10px', color: 'var(--coral)' }}>🗑 Excluir</button>
      </div>
    </div>
  );
}

function ExamFormModal({ open, initial, onSave, onClose }) {
  const empty = {
    id: '',
    name: '',
    banca: 'CEBRASPE',
    date: new Date().toISOString().slice(0, 10),
    totalCorrect: 0,
    totalQuestions: 0,
    cutoff: null,
    status: 'pending',
    disciplines: [],
    notes: '',
  };
  const [form, setForm] = React.useState(empty);

  React.useEffect(() => {
    if (open) setForm(initial ? { ...empty, ...initial, disciplines: initial.disciplines || [] } : { ...empty, id: 'ex_' + Date.now() });
  }, [open, initial]);

  if (!open) return null;

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const updDiscipline = (i, k, v) => setForm((f) => ({ ...f, disciplines: f.disciplines.map((d, idx) => idx === i ? { ...d, [k]: v } : d) }));
  const addDiscipline = () => setForm((f) => ({ ...f, disciplines: [...f.disciplines, { name: '', correct: 0, total: 0 }] }));
  const removeDiscipline = (i) => setForm((f) => ({ ...f, disciplines: f.disciplines.filter((_, idx) => idx !== i) }));

  const submit = () => {
    if (!form.name.trim()) {
      alert('Informe o nome do concurso');
      return;
    }
    onSave({
      ...form,
      name: form.name.trim(),
      totalCorrect: Number(form.totalCorrect) || 0,
      totalQuestions: Number(form.totalQuestions) || 0,
      cutoff: form.cutoff ? Number(form.cutoff) : null,
      disciplines: (form.disciplines || []).filter((d) => d.name && d.name.trim()).map((d) => ({
        name: d.name.trim(),
        correct: Number(d.correct) || 0,
        total: Number(d.total) || 0,
      })),
    });
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 90,
      background: 'rgba(30,32,48,0.45)', backdropFilter: 'blur(10px)',
      display: 'grid', placeItems: 'center', padding: 20,
      animation: 'fade-in 240ms ease-out',
    }}>
      <div onClick={(e) => e.stopPropagation()} className="glass-strong anim-slide-up" style={{
        width: '100%', maxWidth: 580, padding: 24, borderRadius: 20,
        maxHeight: '90vh', overflowY: 'auto', position: 'relative',
      }}>
        <button onClick={onClose} className="btn-ghost" style={{ position: 'absolute', top: 14, right: 14 }}>✕</button>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9.5, letterSpacing: '0.25em', color: 'var(--tinta)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>
            {initial ? 'EDITAR RESULTADO' : 'NOVO RESULTADO'}
          </div>
          <div className="font-display" style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
            Registrar prova realizada 📊
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FieldText label="Nome do concurso" placeholder="Ex.: DPE-SP 2025" value={form.name} onChange={(v) => upd('name', v)} />

          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
            <FieldSelect label="Banca" value={form.banca} onChange={(v) => upd('banca', v)} options={BANCAS} />
            <FieldDate label="Data da prova" value={form.date} onChange={(v) => upd('date', v)} />
          </div>

          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr 1fr' }}>
            <FieldNumber label="Acertos" value={form.totalCorrect} onChange={(v) => upd('totalCorrect', v)} />
            <FieldNumber label="Total" value={form.totalQuestions} onChange={(v) => upd('totalQuestions', v)} />
            <FieldNumber label="Corte (opcional)" value={form.cutoff ?? ''} onChange={(v) => upd('cutoff', v)} />
          </div>

          <FieldSelect label="Status" value={form.status} onChange={(v) => upd('status', v)}
            options={[{ value: 'approved', label: '✅ Aprovado' }, { value: 'reproved', label: '❌ Reprovado' }, { value: 'pending', label: '⏳ Aguardando resultado' }]} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>Desempenho por disciplina</label>
              <button onClick={addDiscipline} className="btn-ghost" style={{ fontSize: 11, padding: '4px 9px' }}>+ Adicionar</button>
            </div>
            {form.disciplines.length === 0 ? (
              <div style={{ fontSize: 11, color: 'var(--text-dim)', fontStyle: 'italic', padding: '8px 10px', background: 'rgba(30,32,48,0.03)', borderRadius: 8 }}>
                Nenhuma disciplina adicionada — opcional, mas habilita os insights.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {form.disciplines.map((d, i) => (
                  <div key={i} style={{ display: 'grid', gap: 6, gridTemplateColumns: '1fr 60px 60px 30px', alignItems: 'center' }}>
                    <input type="text" placeholder="Disciplina" value={d.name}
                      onChange={(e) => updDiscipline(i, 'name', e.target.value)}
                      style={inputStyle()} />
                    <input type="number" placeholder="✓" value={d.correct}
                      onChange={(e) => updDiscipline(i, 'correct', e.target.value)}
                      style={inputStyle()} />
                    <input type="number" placeholder="Total" value={d.total}
                      onChange={(e) => updDiscipline(i, 'total', e.target.value)}
                      style={inputStyle()} />
                    <button onClick={() => removeDiscipline(i)} className="btn-ghost"
                      style={{ padding: '6px 8px', fontSize: 11, color: 'var(--coral)' }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600, marginBottom: 6, display: 'block' }}>Observações (opcional)</label>
            <textarea value={form.notes} onChange={(e) => upd('notes', e.target.value)}
              rows={2}
              placeholder="Ex.: Errei muito em Penal parte especial"
              style={{ ...inputStyle(), width: '100%', resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-ghost" style={{ fontSize: 13 }}>Cancelar</button>
          <button onClick={submit} className="btn-neon" style={{ fontSize: 13 }}>
            💾 {initial ? 'Salvar alterações' : 'Adicionar resultado'}
          </button>
        </div>
      </div>
    </div>
  );
}

function inputStyle() {
  return {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid rgba(30,32,48,0.12)',
    background: 'white',
    fontSize: 13,
    color: 'var(--text-primary)',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color 200ms',
  };
}

function FieldText({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600, marginBottom: 6, display: 'block' }}>{label}</label>
      <input type="text" value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle(), width: '100%' }} />
    </div>
  );
}

function FieldNumber({ label, value, onChange }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600, marginBottom: 6, display: 'block' }}>{label}</label>
      <input type="number" min="0" value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle(), width: '100%' }} />
    </div>
  );
}

function FieldDate({ label, value, onChange }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600, marginBottom: 6, display: 'block' }}>{label}</label>
      <input type="date" value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle(), width: '100%' }} />
    </div>
  );
}

function FieldSelect({ label, value, onChange, options }) {
  const opts = options.map((o) => typeof o === 'string' ? { value: o, label: o } : o);
  return (
    <div>
      <label style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600, marginBottom: 6, display: 'block' }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle(), width: '100%' }}>
        {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// Calcula insights de desempenho cruzando todas as provas
function computeExamInsights(exams) {
  if (!exams || exams.length === 0) return [];
  const byDiscipline = {};

  exams.forEach((ex) => {
    (ex.disciplines || []).forEach((d) => {
      if (!d.name || !d.total) return;
      if (!byDiscipline[d.name]) byDiscipline[d.name] = { correct: 0, total: 0, samples: 0 };
      byDiscipline[d.name].correct += d.correct || 0;
      byDiscipline[d.name].total += d.total || 0;
      byDiscipline[d.name].samples += 1;
    });
  });

  const list = Object.entries(byDiscipline).map(([name, d]) => ({
    name, pct: (d.correct / d.total) * 100, samples: d.samples,
  })).filter((d) => d.samples >= 1);

  if (list.length === 0) return [];

  const insights = [];
  list.sort((a, b) => b.pct - a.pct);
  const top = list.slice(0, 2).filter((d) => d.pct >= 75);
  const bottom = list.slice().reverse().slice(0, 2).filter((d) => d.pct < 70);

  if (top.length > 0) {
    insights.push({
      icon: '📈', color: 'var(--esmeralda)',
      title: 'Pontos fortes',
      body: top.map((d) => `${d.name}: ${d.pct.toFixed(0)}%`).join(' · '),
    });
  }
  if (bottom.length > 0) {
    insights.push({
      icon: '⚠️', color: 'var(--ambar)',
      title: 'Áreas para fortalecer',
      body: bottom.map((d) => `${d.name}: ${d.pct.toFixed(0)}%`).join(' · '),
    });
  }

  // Taxa global
  const overall = exams.reduce((acc, ex) => {
    acc.correct += ex.totalCorrect || 0;
    acc.total += ex.totalQuestions || 0;
    return acc;
  }, { correct: 0, total: 0 });
  if (overall.total > 0) {
    const pct = (overall.correct / overall.total) * 100;
    insights.push({
      icon: '🎯', color: 'var(--tinta)',
      title: `Taxa global: ${pct.toFixed(1)}%`,
      body: `${overall.correct} acertos em ${overall.total} questões totais (${exams.length} prova${exams.length > 1 ? 's' : ''})`,
    });
  }

  // Aprovações
  const approved = exams.filter((e) => e.status === 'approved').length;
  if (approved > 0) {
    insights.push({
      icon: '🏆', color: 'var(--ciano)',
      title: `${approved} aprovação${approved > 1 ? 'ões' : ''} registrada${approved > 1 ? 's' : ''}`,
      body: 'Parabéns! Sua jornada já tem conquistas concretas.',
    });
  }

  return insights;
}

window.DesempenhoTab = DesempenhoTab;
