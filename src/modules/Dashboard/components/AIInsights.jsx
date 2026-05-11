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
    impactColor: '#10b981',
    action: 'Review Strategy',
    timeAgo: '2h ago',
  },
  {
    icon: '⚠️',
    title: 'Churn Risk Alert',
    confidence: 89,
    description: 'Live Concert Streaming Pass shows early churn signals. 12% of subscribers reduced usage by 40% in the last 2 weeks.',
    impact: 'Medium Impact',
    impactColor: '#f59e0b',
    action: 'View Details',
    timeAgo: '4h ago',
  },
];

const AIInsights = () => {
  const { colors, fonts, shadows } = useThemeContext();

  const styles = {
    card: {
      backgroundColor: colors.bgSurface, borderRadius: 16, padding: '22px',
      border: `1.5px solid ${colors.borderLight}`, boxShadow: shadows.sm,
    },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    titleRow: { display: 'flex', alignItems: 'center', gap: 10 },
    titleIcon: {
      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(135deg, ${rgba(colors.accentPrimary, 0.15)}, ${rgba(colors.accentSecondary, 0.15)})`,
      fontSize: 'var(--text-md)',
    },
    title: { fontFamily: fonts.heading, fontSize: 'var(--text-md)', fontWeight: 700, color: colors.textPrimary },
    liveIndicator: {
      display: 'flex', alignItems: 'center', gap: 5,
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: '#10b981',
    },
    liveDot: {
      width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981',
      animation: 'pulse 2s infinite',
    },
    subtitle: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 16, marginLeft: 42 },
    insightCard: {
      borderRadius: 12, padding: '16px',
      marginBottom: 10, border: `1px solid ${colors.borderLight}`,
      backgroundColor: rgba(colors.bgPrimary, 0.4),
      transition: 'all 0.2s',
    },
    insightHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
    insightIcon: {
      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
      backgroundColor: rgba(colors.accentPrimary, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 'var(--text-sm)',
    },
    insightTitleGroup: { flex: 1, minWidth: 0 },
    insightTitle: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary },
    insightTime: { fontFamily: fonts.body, fontSize: '10px', color: colors.textMuted, marginTop: 1 },
    confidenceBar: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 },
    confidenceLabel: { fontFamily: fonts.body, fontSize: '10px', color: colors.textMuted },
    confidenceTrack: { width: 40, height: 4, borderRadius: 2, backgroundColor: rgba(colors.accentPrimary, 0.12), overflow: 'hidden' },
    confidenceFill: (pct) => ({ width: `${pct}%`, height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${colors.accentPrimary}, ${colors.accentSecondary})` }),
    insightDesc: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, lineHeight: 1.5, marginBottom: 12 },
    insightFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    impactBadge: (color) => ({
      fontFamily: fonts.body, fontSize: '10px', fontWeight: 700,
      padding: '3px 8px', borderRadius: 6,
      backgroundColor: rgba(color, 0.1), color: color,
      border: `1px solid ${rgba(color, 0.2)}`,
    }),
    actionBtn: {
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600,
      color: colors.accentPrimary, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 6, border: 'none', backgroundColor: rgba(colors.accentPrimary, 0.08),
      transition: 'all 0.2s',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <div style={styles.titleIcon}>🧠</div>
          <span style={styles.title}>AI-Powered Insights</span>
        </div>
        <div style={styles.liveIndicator}>
          <span style={styles.liveDot} />
          Live
        </div>
      </div>
      <div style={styles.subtitle}>Real-time intelligence from our AI engine</div>

      {insights.map((insight, i) => (
        <div key={i} style={styles.insightCard}>
          <div style={styles.insightHeader}>
            <div style={styles.insightIcon}>{insight.icon}</div>
            <div style={styles.insightTitleGroup}>
              <div style={styles.insightTitle}>{insight.title}</div>
              <div style={styles.insightTime}>{insight.timeAgo}</div>
            </div>
            <div style={styles.confidenceBar}>
              <span style={styles.confidenceLabel}>{insight.confidence}%</span>
              <div style={styles.confidenceTrack}>
                <div style={styles.confidenceFill(insight.confidence)} />
              </div>
            </div>
          </div>
          <div style={styles.insightDesc}>{insight.description}</div>
          <div style={styles.insightFooter}>
            <span style={styles.impactBadge(insight.impactColor)}>{insight.impact}</span>
            <button style={styles.actionBtn}>{insight.action} →</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIInsights;
