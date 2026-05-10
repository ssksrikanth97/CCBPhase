import React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const InsightsPanel = () => {
  const { colors, fonts } = useThemeContext();

  const styles = {
    root: { display: 'flex', flexDirection: 'column', gap: 16 },
    aiPrompt: {
      display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px',
      backgroundColor: colors.bgSurface, borderRadius: 12,
      border: `1.5px solid ${colors.borderLight}`, cursor: 'pointer',
    },
    aiIcon: { fontSize: 'var(--text-md)', color: colors.accentPrimary },
    aiText: { fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 500, color: colors.textPrimary },
    setupCard: {
      backgroundColor: colors.bgSurface, borderRadius: 12,
      border: `1.5px solid ${colors.borderLight}`, padding: 16,
      display: 'flex', alignItems: 'flex-start', gap: 12,
    },
    setupIconWrap: {
      width: 36, height: 36, borderRadius: '50%',
      backgroundColor: rgba(colors.accentPrimary, 0.08),
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    setupTitle: { fontFamily: fonts.heading, fontSize: 'var(--text-md)', fontWeight: 600, color: colors.textPrimary, marginBottom: 4 },
    setupDesc: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textMuted, lineHeight: 1.4 },
  };

  return (
    <div style={styles.root}>
      <div style={styles.aiPrompt} role="button" tabIndex={0} aria-label="Ask AI to get more insights">
        <span style={styles.aiIcon}>✦</span>
        <span style={styles.aiText}>Ask AI to get more insights</span>
      </div>
      <div style={styles.setupCard}>
        <div style={styles.setupIconWrap}>
          <SettingsIcon style={{ fontSize: 18, color: colors.accentPrimary }} />
        </div>
        <div>
          <div style={styles.setupTitle}>Setup Business Unit</div>
          <div style={styles.setupDesc}>Configure your first business unit in minutes</div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
