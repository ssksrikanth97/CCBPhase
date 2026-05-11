import React from 'react';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewListIcon from '@material-ui/icons/ViewList';
import { useThemeContext } from '../../styles/ThemeContext';
import { rgba } from '../../styles/utils';

const ViewToggle = ({ view, onViewChange }) => {
  const { colors, fonts } = useThemeContext();

  const btnBase = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 34, height: 34, border: 'none', cursor: 'pointer',
    borderRadius: 8, transition: 'all 0.2s',
  };

  const styles = {
    root: {
      display: 'inline-flex', gap: 4, padding: 3,
      backgroundColor: rgba(colors.bgPrimary, 0.6),
      borderRadius: 10, border: `1px solid ${colors.borderLight}`,
    },
    active: {
      ...btnBase,
      backgroundColor: colors.bgSurface,
      color: colors.accentPrimary,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    },
    inactive: {
      ...btnBase,
      backgroundColor: 'transparent',
      color: colors.textMuted,
    },
  };

  return (
    <div style={styles.root} role="group" aria-label="View toggle">
      <button
        style={view === 'card' ? styles.active : styles.inactive}
        onClick={() => onViewChange('card')}
        aria-label="Card view"
        aria-pressed={view === 'card'}
      >
        <ViewModuleIcon style={{ fontSize: 18 }} />
      </button>
      <button
        style={view === 'list' ? styles.active : styles.inactive}
        onClick={() => onViewChange('list')}
        aria-label="List view"
        aria-pressed={view === 'list'}
      >
        <ViewListIcon style={{ fontSize: 18 }} />
      </button>
    </div>
  );
};

export default ViewToggle;
