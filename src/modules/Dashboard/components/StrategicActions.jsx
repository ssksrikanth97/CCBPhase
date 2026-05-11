import React from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';
import { rgba } from '../../../styles/utils';

const actions = [
  { icon: '🚀', label: 'Launch Growth Initiative', description: 'Target 45K new subscribers in APAC', color: '#10b981', priority: 'High' },
  { icon: '🛡️', label: 'Start Retention Campaign', description: 'Address 12% churn risk in Live Concert', color: '#f59e0b', priority: 'Medium' },
  { icon: '📊', label: 'Deep Dive Analytics', description: 'Revenue anomaly detected in Sports tier', color: '#ef4444', priority: 'Urgent' },
];

const priorityColors = { High: '#10b981', Medium: '#f59e0b', Urgent: '#ef4444' };

const StrategicActions = () => {
  const { colors, fonts, shadows, buttonGradient, activeTheme } = useThemeContext();

  const isRetro = activeTheme.id === 'retro';

  const styles = {
    card: {
      background: isRetro
        ? colors.bgDark
        : (buttonGradient || `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`),
      borderRadius: 16, padding: '22px',
      border: isRetro ? `1.5px solid ${colors.accentPrimary}` : 'none',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    titleRow: { display: 'flex', alignItems: 'center', gap: 8 },
    titleIcon: {
      width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)', fontSize: 'var(--text-sm)',
    },
    title: {
      fontFamily: fonts.heading, fontSize: 'var(--text-md)', fontWeight: 700,
      color: isRetro ? colors.textOnDark : '#ffffff',
    },
    count: {
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600,
      padding: '3px 8px', borderRadius: 10,
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: isRetro ? colors.textOnDark : '#ffffff',
    },
    actionItem: {
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 14px', borderRadius: 10,
      backgroundColor: isRetro ? rgba(colors.accentPrimary, 0.12) : 'rgba(255,255,255,0.12)',
      marginBottom: 8, cursor: 'pointer',
      transition: 'all 0.2s',
      border: isRetro ? `1px solid ${rgba(colors.accentPrimary, 0.25)}` : '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(4px)',
    },
    actionIcon: {
      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 'var(--text-md)',
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
    actionContent: { flex: 1, minWidth: 0 },
    actionLabel: {
      fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600,
      color: isRetro ? colors.textOnDark : '#ffffff',
      marginBottom: 2,
    },
    actionDesc: {
      fontFamily: fonts.body, fontSize: 'var(--text-xs)',
      color: isRetro ? rgba(colors.textOnDark, 0.7) : 'rgba(255,255,255,0.7)',
      lineHeight: 1.4,
    },
    priorityBadge: (priority) => ({
      fontFamily: fonts.body, fontSize: '10px', fontWeight: 700,
      padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 2,
      backgroundColor: rgba(priorityColors[priority] || '#6b7280', 0.2),
      color: priorityColors[priority] || '#6b7280',
    }),
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <div style={styles.titleIcon}>⚡</div>
          <span style={styles.title}>Strategic Actions</span>
        </div>
        <span style={styles.count}>{actions.length} pending</span>
      </div>
      {actions.map((action, i) => (
        <div key={i} style={styles.actionItem}>
          <div style={styles.actionIcon}>{action.icon}</div>
          <div style={styles.actionContent}>
            <div style={styles.actionLabel}>{action.label}</div>
            <div style={styles.actionDesc}>{action.description}</div>
          </div>
          <span style={styles.priorityBadge(action.priority)}>{action.priority}</span>
        </div>
      ))}
    </div>
  );
};

export default StrategicActions;
