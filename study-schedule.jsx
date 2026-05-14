// Rise of a Legend — Horário Padrão de Estudos
// Define janelas por dia da semana. Detecta cumprimento ao registrar sessão.
// Reward semanal por 70%+ de aderência.

const WEEKDAYS = [
  { id: 'monday',    label: 'Segunda', short: 'SEG' },
  { id: 'tuesday',   label: 'Terça',   short: 'TER' },
  { id: 'wednesday', label: 'Quarta',  short: 'QUA' },
  { id: 'thursday',  label: 'Quinta',  short: 'QUI' },
  { id: 'friday',    label: 'Sexta',   short: 'SEX' },
  { id: 'saturday',  label: 'Sábado',  short: 'SÁB' },
  { id: 'sunday',    label: 'Domingo', short: 'DOM' },
];

window.ROL_WEEKDAYS = WEEKDAYS;

function getCurrentWeekdayId() {
  const dow = new Date().getDay();
  return WEEKDAYS[(dow + 6) % 7].id;                    // mapeia 0=dom para final
}

window.ROL_isWithinSchedule = function (shared, date = new Date()) {
  const schedule = shared.studySchedule || {};
  const dow = date.getDay();
  const dayId = WEEKDAYS[(dow + 6) % 7].id;
  const windows = schedule[dayId] || [];
  if (windows.length === 0) return false;
  const minutes = date.getHours() * 60 + date.getMinutes();
  return windows.some((w) => {
    const [sh, sm] = (w.start || '00:00').split(':').map(Number);
    const [eh, em] = (w.end || '23:59').split(':').map(Number);
    return minutes >= sh * 60 + sm && minutes <= eh * 60 + em;
  });
};

function StudyScheduleEditor({ shared, setShared }) {
  const schedule = shared.studySchedule || {};

  const addWindow = (dayId) => {
    setShared((s) => {
      const sc = { ...(s.studySchedule || {}) };
      sc[dayId] = [...(sc[dayId] || []), { start: '08:00', end: '12:00' }];
      return { ...s, studySchedule: sc };
    });
  };

  const updateWindow = (dayId, idx, key, val) => {
    setShared((s) => {
      const sc = { ...(s.studySchedule || {}) };
      sc[dayId] = (sc[dayId] || []).map((w, i) => i === idx ? { ...w, [key]: val } : w);
      return { ...s, studySchedule: sc };
    });
  };

  const removeWindow = (dayId, idx) => {
    setShared((s) => {
      const sc = { ...(s.studySchedule || {}) };
      sc[dayId] = (sc[dayId] || []).filter((_, i) => i !== idx);
      return { ...s, studySchedule: sc };
    });
  };

  const totalDays = WEEKDAYS.filter((d) => (schedule[d.id] || []).length > 0).length;

  return (
    <div className="glass" style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 9.5, letterSpacing: '0.22em', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
            HORÁRIO PADRÃO
          </div>
          <div className="font-display" style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
            Defina suas janelas de estudo
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4, maxWidth: 460, lineHeight: 1.45 }}>
            Cumpra <strong>70%+ das suas janelas semanais</strong> e ganhe XP bônus + chance de drop de item.
            Janelas opcionais por dia.
          </div>
        </div>
        <div className="num" style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>
          {totalDays} DIA{totalDays === 1 ? '' : 'S'} CONFIGURADO{totalDays === 1 ? '' : 'S'}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
        {WEEKDAYS.map((d) => {
          const wins = schedule[d.id] || [];
          return (
            <div key={d.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div className="num" style={{
                width: 56, fontSize: 11, fontWeight: 700, color: wins.length > 0 ? 'var(--tinta)' : 'var(--text-dim)',
                fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em', paddingTop: 8,
              }}>{d.short}</div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {wins.length === 0 ? (
                  <button onClick={() => addWindow(d.id)} className="btn-ghost" style={{
                    fontSize: 11, padding: '6px 10px', alignSelf: 'flex-start',
                    color: 'var(--text-dim)', borderStyle: 'dashed',
                  }}>
                    + Adicionar janela
                  </button>
                ) : (
                  <>
                    {wins.map((w, i) => (
                      <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input type="time" className="input-base" value={w.start}
                          onChange={(e) => updateWindow(d.id, i, 'start', e.target.value)}
                          style={{ width: 100 }} />
                        <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>até</span>
                        <input type="time" className="input-base" value={w.end}
                          onChange={(e) => updateWindow(d.id, i, 'end', e.target.value)}
                          style={{ width: 100 }} />
                        <button onClick={() => removeWindow(d.id, i)} className="btn-ghost"
                          style={{ padding: '6px 8px', fontSize: 11, color: 'var(--coral)' }}>✕</button>
                      </div>
                    ))}
                    <button onClick={() => addWindow(d.id)} className="btn-ghost" style={{
                      fontSize: 10.5, padding: '4px 8px', alignSelf: 'flex-start', color: 'var(--text-muted)',
                    }}>
                      + Mais uma
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(91,71,184,0.05)', borderRadius: 10, fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', borderLeft: '2px solid var(--tinta)' }}>
        💡 Hoje é {WEEKDAYS.find((d) => d.id === getCurrentWeekdayId())?.label}.
        {window.ROL_isWithinSchedule(shared) ? ' Você está DENTRO da janela 💜' : ' Fora da janela atualmente.'}
      </div>
    </div>
  );
}

window.StudyScheduleEditor = StudyScheduleEditor;
