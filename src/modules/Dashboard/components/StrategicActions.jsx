import React from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';
import { rgba } from '../../../styles/utils';

const actions = [
  { icon: '✓', label: 'Launch Growth Initiative', color: '#10b981' },
  { icon: '●', label: 'Start Retention Campaign', color: '#f59e0b' },
  { icon: '📊', label: 'Deep Dive Analytics', color: '#ef4444' },
];

const StrategicActions = () => {
  const { colors, fonts, shadows, buttonGradient, activeTheme } = useThemeContext();

  const isRetro = activeTheme.id === 'retro';

  const styles = {
    card: {
      background: isRetro
        ? colors.bgDark
        : (buttonGradient || `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`),
      borderRadius: 14,
      padding: '20px',
      border: isRetro ? `1.5px solid ${colors.accentPrimary}` : 'none',
    },
    title: {
      fontFamily: fonts.heading, fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 14,
      color: isRetro ? colors.textOnDark : '#ffffff',
    },
    actionItem: {
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', borderRadius: 8,
      backgroundColor: isRetro ? rgba(colors.accentPrimary, 0.12) : 'rgba(255,255,255,0.15)',
      marginBottom: 8, cursor: 'pointer',
      transition: 'background-color 0.2s',
      border: isRetro ? `1px solid ${rgba(colors.accentPrimary, 0.25)}` : 'none',
    },
    actionIcon: (color) => ({
      width: 24, height: 24, borderRadius: 6,
      backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 700,
    }),
    actionLabel: {
      fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 500,
      color: isRetro ? colors.textOnDark : '#ffffff',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.title}>Strategic Actions</div>
      {actions.map((action, i) => (
        <div key={i} style={styles.actionItem}>
          <div style={styles.actionIcon(action.color)}>{action.icon}</div>
          <span style={styles.actionLabel}>{action.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StrategicActions;
