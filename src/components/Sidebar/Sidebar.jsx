import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListIcon from '@material-ui/icons/FormatListBulleted';
import ExploreIcon from '@material-ui/icons/Explore';
import PeopleIcon from '@material-ui/icons/People';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import SettingsIcon from '@material-ui/icons/Settings';
import CategoryIcon from '@material-ui/icons/Category';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useAuth } from '../../modules/Auth/store/authContext';
import { useBU } from '../../modules/BusinessUnit/store/buContext';

const Sidebar = () => {
  const history = useHistory();
  const location = useLocation();
  const { logout } = useAuth();
  const { hasPermission } = useBU();
  const [catalogueOpen, setCatalogueOpen] = useState(true);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => { logout(); history.push('/login'); };

  const navItemStyle = (path) => `sidebar__btn ${isActive(path) ? 'sidebar__btn--active' : ''}`;

  return (
    <aside className="sidebar" aria-label="Sidebar navigation" style={{ width: 180, padding: '14px 8px', alignItems: 'stretch', gap: 2 }}>
      {/* Dashboard */}
      <button className={navItemStyle('/dashboard')} onClick={() => history.push('/dashboard')} style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 10, gap: 8 }}>
        <DashboardIcon style={{ fontSize: 18 }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}>Dashboard</span>
      </button>

      {/* Catalogue section */}
      {hasPermission('catalogue') && (
        <>
          <button
            className="sidebar__btn"
            onClick={() => setCatalogueOpen(!catalogueOpen)}
            style={{ justifyContent: 'space-between', width: '100%', paddingLeft: 10, paddingRight: 8 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CategoryIcon style={{ fontSize: 18 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}>Catalogue</span>
            </span>
            {catalogueOpen ? <ExpandLessIcon style={{ fontSize: 16 }} /> : <ExpandMoreIcon style={{ fontSize: 16 }} />}
          </button>

          {catalogueOpen && (
            <div style={{ paddingLeft: 20 }}>
              {hasPermission('products') && (
                <button className={navItemStyle('/products')} onClick={() => history.push('/products')} style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 10, gap: 8 }}>
                  <ListIcon style={{ fontSize: 16 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)' }}>Products</span>
                </button>
              )}
              {hasPermission('bundles') && (
                <button className={navItemStyle('/bundles')} onClick={() => history.push('/bundles')} style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 10, gap: 8 }}>
                  <ListIcon style={{ fontSize: 16 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)' }}>Bundles</span>
                </button>
              )}
              {hasPermission('promotions') && (
                <button className={navItemStyle('/promotions')} onClick={() => history.push('/promotions')} style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 10, gap: 8 }}>
                  <ListIcon style={{ fontSize: 16 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)' }}>Promotions</span>
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Customer */}
      {hasPermission('customers') && (
        <button className={navItemStyle('/customers')} onClick={() => history.push('/customers')} style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 10, gap: 8 }}>
          <PeopleIcon style={{ fontSize: 18 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}>Customer</span>
        </button>
      )}

      {/* Tickets */}
      {hasPermission('tickets') && (
        <button className={navItemStyle('/tickets')} onClick={() => history.push('/tickets')} style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 10, gap: 8 }}>
          <ConfirmationNumberIcon style={{ fontSize: 18 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}>Tickets</span>
        </button>
      )}

      {/* Explore */}
      {hasPermission('explore') && (
        <button className={navItemStyle('/explore')} onClick={() => history.push('/explore')} style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 10, gap: 8 }}>
          <ExploreIcon style={{ fontSize: 18 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}>Explore</span>
        </button>
      )}

      {/* Configuration */}
      {hasPermission('configuration') && (
        <button className={navItemStyle('/configuration')} onClick={() => history.push('/configuration')} style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 10, gap: 8 }}>
          <SettingsIcon style={{ fontSize: 18 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}>Configuration</span>
        </button>
      )}

      <div className="sidebar__spacer" />

      <button className="sidebar__btn sidebar__btn--logout" onClick={handleLogout} style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 10, gap: 8 }}>
        <ExitToAppIcon style={{ fontSize: 18 }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
