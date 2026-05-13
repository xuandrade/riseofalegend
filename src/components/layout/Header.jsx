import { useState } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useApp } from '../../contexts/AppContext.jsx';
import ClassBadge from '../dragon/ClassBadge.jsx';
import './Header.css';

export default function Header() {
  const { user, updateUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.playerName);

  const saveName = () => {
    const clean = name.trim() || 'Estudante';
    updateUser({ playerName: clean });
    setName(clean);
    setEditing(false);
  };

  return (
    <header className="rol-header">
      <div className="rol-header__inner">
        <a href="/hoje" className="rol-header__brand" aria-label="Rise of a Legend">
          <span className="rol-header__logo">
            <img src="/dragon-logo.svg" alt="Logo Rise of a Legend" />
          </span>
          <div className="rol-header__brand-text">
            <strong>Rise of a Legend</strong>
            <small>Forje sua lenda</small>
          </div>
        </a>

        <div className="rol-header__player">
          <ClassBadge dragonClass={user.dragonClass} size="sm" showTitle={false} />
          <div className="rol-header__name">
            {editing ? (
              <div className="rol-header__name-edit">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  onBlur={saveName}
                  maxLength={28}
                />
                <button type="button" onClick={saveName} aria-label="Salvar nome">
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="rol-header__name-btn"
                onClick={() => setEditing(true)}
                title="Editar nome"
              >
                <span>{user.playerName}</span>
                <Pencil size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
