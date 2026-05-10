import React from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';
import { rgba } from '../../../styles/utils';

const insights = [
  {
    icon: '🎯',
    title: 'Revenue Growth Opportunity',
    confidence: 94,
    description: 'OTT streaming shows 18.5% growth. Increase marketing budget by 15% to capture additional 45K subscribers worth $2.8M annually.',
    impact: 'High Impact',
    action: 'Review Strategy',
  },
  {
    icon: '⚠️',
    title: 'Churn Risk Alert',
    confidence: 89,
    description: 'Live Concert Streaming Pass shows early churn signals. 12% of subscribers reduced usage by 40% in the last 2 weeks.',
    impact: 'Medium Impact',
    action: 'View Details',
  },
];

const AIInsights = () => {
  const { colors, fonts, shadows } = useThemeContext();

  const styles = {
    card: {
      backgroundColor: colors.bgSurface, borderRadius: 14, padding: '20px',
      border: `1px solid ${colors.borderLight}`, boxShadow: shadows.sm,
    },
    header: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
    headerIcon: { fontSize: 'var(--text-xl)' },
    title: { fontFamily: fonts.heading, fontSize: 'var(--text-lg)', fontWeight: 700, color: colors.textPrimary },
    subtitle: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textMuted, marginBottom: 16 },
    insightCard: {
      backgroundColor: rgba(colors.borderLight, 0.5), borderRadius: 10, padding: '14px',
      marginBottom: 12, border: `1px solid ${colors.borderLight}`,
    },
    insightHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
    insightIcon: (color) => ({
      width: 28, height: 28, borderRadius: 8,
      backgroundColor: rgba(color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 'var(--text-base)',
    }),
    insightTitle: { fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 600, color: colors.textPrimary },
    insightConfidence: { marginLeft: 'auto', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textMuted },
    insightDesc: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textMuted, lineHeight: 1.5, marginBottom: 10 },
    insightFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    impactBadge: {
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600,
      padding: '3px 8px', borderRadius: 6,
      backgroundColor: rgba(colors.accentSecondary, 0.12), color: colors.accentSecondaryDark,
    },
    actionLink: {
      fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 500,
      color: colors.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.headerIcon}>🧠</span>
        <span style={styles.title}>AI-Powered Insights</span>
      </div>
      <div style={styles.subtitle}>Real-time intelligence from our AI engine</div>

      {insights.map((insight, i) => (
        <div key={i} style={styles.insightCard}>
          <div style={styles.insightHeader}>
            <div style={styles.insightIcon(colors.accentPrimary)}>{insight.icon}</div>
            <span style={styles.insightTitle}>{insight.title}</span>
            <span style={styles.insightConfidence}>{insight.confidence}%</span>
          </div>
          <div style={styles.insightDesc}>{insight.description}</div>
          <div style={styles.insightFooter}>
            <span style={styles.impactBadge}>{insight.impact}</span>
            <span style={styles.actionLink}>{insight.action} →</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIInsights;
