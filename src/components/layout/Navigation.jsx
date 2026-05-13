import { NavLink } from 'react-router-dom';
import {
  Sun,
  ClipboardList,
  PenLine,
  BarChart3,
  Trophy,
  Settings,
} from 'lucide-react';
import './Navigation.css';

const TABS = [
  { to: '/hoje', label: 'Hoje', icon: Sun },
  { to: '/editais-objetiva', label: 'Objetiva', icon: ClipboardList },
  { to: '/editais-discursiva', label: 'Discursiva', icon: PenLine },
  { to: '/desempenho', label: 'Desempenho', icon: BarChart3 },
  { to: '/conquistas', label: 'Conquistas', icon: Trophy },
  { to: '/ajustes', label: 'Ajustes', icon: Settings },
];

export default function Navigation() {
  return (
    <nav className="rol-nav" aria-label="Navegação principal">
      <div className="rol-nav__inner">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `rol-nav__item ${isActive ? 'rol-nav__item--active' : ''}`
            }
            aria-label={label}
          >
            <Icon size={20} className="rol-nav__icon" />
            <span className="rol-nav__label">{label}</span>
            <span className="rol-nav__indicator" />
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
