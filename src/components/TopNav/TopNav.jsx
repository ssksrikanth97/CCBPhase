import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import CategoryIcon from '@material-ui/icons/Category';
import PeopleIcon from '@material-ui/icons/People';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import CodeIcon from '@material-ui/icons/Code';
import StorefrontIcon from '@material-ui/icons/Storefront';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { useAuth } from '../../modules/Auth/store/authContext';
import { useBU } from '../../modules/BusinessUnit/store/buContext';
import { navItems } from './navConfig';
import './TopNav.css';

const iconMap = {
  CategoryIcon: CategoryIcon,
  PeopleIcon: PeopleIcon,
  SupportIcon: HeadsetMicIcon,
  CodeIcon: CodeIcon,
  StorefrontIcon: StorefrontIcon,
  SettingsIcon: SettingsIcon,
};

const TopNav = () => {
  const location = useLocation();
  const history = useHistory();
  const { logout } = useAuth();
  const { activeBU, businessUnits, switchBU, currentRole, hasPermission } = useBU();
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const navRef = useRef(null);

  // Close all dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setClientDropdownOpen(false);
        setOpenDropdown(null);
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname.startsWith(path);
  const isNavActive = (item) => item.children.some((c) => isActive(c.path));

  const navigateTo = (path) => {
    history.push(path);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  };

  return (
    <>
      <nav className="topnav" aria-label="Top navigation" ref={navRef}>
        <div className="topnav__left">
          {/* BU Switcher */}
          <div className="topnav__logo" onClick={() => setClientDropdownOpen(!clientDropdownOpen)} title="Switch Business Unit">
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
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="topnav__nav-desktop">
            {/* Dashboard (standalone) */}
            <button
              className={`mode-btn ${isActive('/dashboard') ? 'mode-btn--active' : ''}`}
              onClick={() => history.push('/dashboard')}
              title="Dashboard"
            >
              <HomeIcon style={{ fontSize: 18 }} />
            </button>

            {/* Dynamic nav items */}
            {navItems.map((item) => {
              if (!hasPermission(item.permission)) return null;
              const Icon = iconMap[item.icon];
              return (
                <div key={item.id} style={{ position: 'relative' }}>
                  <button
                    className={`mode-btn ${isNavActive(item) ? 'mode-btn--active' : ''}`}
                    onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                    title={item.label}
                  >
                    {Icon && <Icon style={{ fontSize: 18 }} />}
                  </button>
                  {openDropdown === item.id && (
                    <div className="dropdown" style={{ left: 0, top: '100%', marginTop: 6, minWidth: 180 }}>
                      <div style={{ padding: '4px 14px 6px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-muted-tan)', opacity: 0.5 }}>
                        {item.label}
                      </div>
                      {item.children.map((child) => (
                        <button key={child.path} className="dropdown__item" onClick={() => navigateTo(child.path)}>
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="topnav__right">
          {/* Role badge with dropdown */}
          <div style={{ position: 'relative' }}>
            <span className="topnav__role-badge" onClick={() => setSettingsOpen(!settingsOpen)} title="Settings & Account">
              {currentRole.name} ▾
            </span>
            {settingsOpen && (
              <div className="dropdown" style={{ right: 0, left: 'auto' }}>
                <button className="dropdown__item" onClick={() => { setSettingsOpen(false); navigateTo('/configuration'); }}>Theme Config</button>
                <button className="dropdown__item" onClick={() => { setSettingsOpen(false); navigateTo('/explore'); }}>Explore</button>
                <div className="dropdown__divider" />
                <button className="dropdown__item" style={{ color: 'var(--accent-primary)' }} onClick={() => { setSettingsOpen(false); logout(); history.push('/login'); }}>↪ Logout</button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="topnav__hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <CloseIcon style={{ fontSize: 22 }} /> : <MenuIcon style={{ fontSize: 22 }} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="topnav__mobile-menu">
          <button className={`topnav__mobile-item ${isActive('/dashboard') ? 'topnav__mobile-item--active' : ''}`} onClick={() => navigateTo('/dashboard')}>
            <HomeIcon style={{ fontSize: 20 }} /> Dashboard
          </button>

          {navItems.map((item) => {
            if (!hasPermission(item.permission)) return null;
            const Icon = iconMap[item.icon];
            const isExpanded = mobileExpanded === item.id;
            return (
              <div key={item.id}>
                <button
                  className={`topnav__mobile-item ${isNavActive(item) ? 'topnav__mobile-item--active' : ''}`}
                  onClick={() => setMobileExpanded(isExpanded ? null : item.id)}
                >
                  {Icon && <Icon style={{ fontSize: 20 }} />} {item.label}
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>{isExpanded ? '▲' : '▼'}</span>
                </button>
                {isExpanded && (
                  <div style={{ paddingLeft: 36 }}>
                    {item.children.map((child) => (
                      <button key={child.path} className="topnav__mobile-item" style={{ fontSize: 'var(--text-sm)' }} onClick={() => navigateTo(child.path)}>
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ height: 1, backgroundColor: 'var(--border-dark)', margin: '8px 0' }} />
          <button className="topnav__mobile-item" onClick={() => navigateTo('/configuration')}>⚙ Theme Config</button>
          <button className="topnav__mobile-item" onClick={() => navigateTo('/explore')}>🧭 Explore</button>
          <button className="topnav__mobile-item" style={{ color: 'var(--accent-primary)' }} onClick={() => { logout(); history.push('/login'); setMobileMenuOpen(false); }}>↪ Logout</button>
        </div>
      )}
    </>
  );
};

export default TopNav;
