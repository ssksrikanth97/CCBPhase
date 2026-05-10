import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { useThemeContext } from '../../styles/ThemeContext';
import { useAuth } from '../../modules/Auth/store/authContext';
import { useBU } from '../../modules/BusinessUnit/store/buContext';

const routeConfig = {
  '/explore': { breadcrumbs: [{ label: 'Home', path: '/dashboard' }, { label: 'Explore', path: '/explore' }] },
  '/dashboard': { breadcrumbs: [{ label: 'Home', path: '/dashboard' }, { label: 'Dashboard', path: '/dashboard' }] },
  '/products': { breadcrumbs: [{ label: 'Catalogue', path: '/products' }, { label: 'Products', path: '/products' }] },
  '/products/create': { breadcrumbs: [{ label: 'Catalogue', path: '/products' }, { label: 'Products', path: '/products' }, { label: 'Create', path: '/products/create' }] },
  '/bundles': { breadcrumbs: [{ label: 'Catalogue', path: '/products' }, { label: 'Bundles', path: '/bundles' }] },
  '/promotions': { breadcrumbs: [{ label: 'Catalogue', path: '/products' }, { label: 'Promotions', path: '/promotions' }] },
  '/customers': { breadcrumbs: [{ label: 'Home', path: '/dashboard' }, { label: 'Customers', path: '/customers' }] },
  '/tickets': { breadcrumbs: [{ label: 'Home', path: '/dashboard' }, { label: 'Tickets', path: '/tickets' }] },
  '/configuration': { breadcrumbs: [{ label: 'Home', path: '/dashboard' }, { label: 'Configuration', path: '/configuration' }] },
};

const TopNav = () => {
  const location = useLocation();
  const history = useHistory();
  const { logout } = useAuth();
  const { activeBU, businessUnits, switchBU, currentRole, roles, switchRole } = useBU();
  const [expanded, setExpanded] = useState(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const currentRoute = routeConfig[location.pathname] || { breadcrumbs: [{ label: 'Home', path: '/dashboard' }] };
  const { breadcrumbs } = currentRoute;
  const lastCrumb = breadcrumbs[breadcrumbs.length - 1];

  return (
    <nav className="topnav" aria-label="Top navigation">
      <div className="topnav__left">
        <div className="topnav__logo" onClick={() => setClientDropdownOpen(!clientDropdownOpen)}>
          <div className="topnav__logo-icon" />
          <span className="topnav__logo-text">{activeBU.name}</span>
          <span className="topnav__chevron">▾</span>

          {clientDropdownOpen && (
            <div className="dropdown" style={{ left: 0, minWidth: 200 }}>
              <div style={{ padding: '6px 16px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Business Units
              </div>
              {businessUnits.map((bu) => (
                <button
                  key={bu.id}
                  className={`dropdown__item ${bu.id === activeBU.id ? 'dropdown__item--active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); switchBU(bu.id); setClientDropdownOpen(false); }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: bu.id === activeBU.id ? 'var(--accent-primary)' : 'var(--color-muted-tan)' }} />
                  <span>{bu.name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{bu.services.length} services</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="topnav__breadcrumb">
          {expanded ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.label + index}>
                    {index > 0 && <span>/</span>}
                    {isLast ? (
                      <span className="topnav__breadcrumb-active">{crumb.label}</span>
                    ) : (
                      <span className="topnav__breadcrumb-link" onClick={() => { history.push(crumb.path); setExpanded(false); }}>
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </span>
          ) : (
            <>
              <span className="topnav__dots" onClick={() => setExpanded(!expanded)}>···</span>
              <span>/</span>
              <span className="topnav__breadcrumb-active">{lastCrumb.label}</span>
            </>
          )}
        </span>
      </div>

      <div className="topnav__right">
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-muted-tan)', padding: '4px 10px', borderRadius: 12, border: '1px solid var(--border-dark)' }}>
          {currentRole.name}
        </span>
        <button className="mode-btn mode-btn--active">✦ AI mode</button>
        <button className="mode-btn">◉ Live view</button>
        <div style={{ position: 'relative' }}>
          <IconButton size="small" onClick={() => setSettingsOpen(!settingsOpen)} aria-label="Settings menu">
            <SettingsIcon style={{ fontSize: 18, color: 'var(--color-muted-tan)' }} />
          </IconButton>
          {settingsOpen && (
            <div className="dropdown" style={{ right: 0, left: 'auto' }}>
              <button className="dropdown__item" onClick={() => { setSettingsOpen(false); history.push('/configuration'); }}>
                ⚙ Configuration
              </button>
              <div className="dropdown__divider" />
              <button className="dropdown__item" style={{ color: 'var(--accent-primary)' }} onClick={() => { setSettingsOpen(false); logout(); history.push('/login'); }}>
                ↪ Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
