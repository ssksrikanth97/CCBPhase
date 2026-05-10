import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useThemeContext } from '../../../styles/ThemeContext';
import CircleWebGL from '../../../components/CircleWebGL/CircleWebGL';
import './ExplorePage.scss';

const modules = [
  { icon: '◈', label: 'Layers', path: '/dashboard' },
  { icon: '◇', label: 'Code', path: '/products' },
  { icon: '✦', label: 'Core', path: '/dashboard' },
  { icon: '⊞', label: 'Grid', path: '/products/create' },
  { icon: '○', label: 'Circle', path: '/configuration' },
  { icon: 'T', label: 'Type', path: '/products' },
  { icon: '♡', label: 'Fav', path: '/dashboard' },
  { icon: '⊛', label: 'Star', path: '/explore' },
];

const infoCards = [
  { icon: '📊', title: 'Dashboard', desc: 'Analytics & real-time metrics', path: '/dashboard' },
  { icon: '📦', title: 'Products', desc: 'Manage product catalogue', path: '/products' },
  { icon: '✚', title: 'Create Product', desc: 'Build new product offerings', path: '/products/create' },
  { icon: '⚙', title: 'Configuration', desc: 'Theme & app settings', path: '/configuration' },
];

const ExplorePage = () => {
  const history = useHistory();
  const { colors } = useThemeContext();

  useEffect(() => {
    document.title = 'EV Phase - Explore';
  }, []);

  return (
    <div className="explore">
      <h1 className="page-title">Explore Modules</h1>
      <p className="page-subtitle">Navigate through all available modules</p>

      <div className="explore__canvas-area">
        <CircleWebGL color={[0.55, 0.45, 0.65]} />

        <div className="explore__nodes">
          <div className="explore__hub">✦</div>
          {modules.map((mod, i) => (
            <div
              key={i}
              className={`explore__node explore__node--${i}`}
              onClick={() => history.push(mod.path)}
            >
              <span>{mod.icon}</span>
              <span className="explore__node-label">{mod.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="explore__info">
        {infoCards.map((card, i) => (
          <div key={i} className="explore__info-card" onClick={() => history.push(card.path)}>
            <div className="explore__info-icon">{card.icon}</div>
            <div className="explore__info-title">{card.title}</div>
            <div className="explore__info-desc">{card.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
