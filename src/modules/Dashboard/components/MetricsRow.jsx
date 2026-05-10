import React from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';
import { useBU } from '../../BusinessUnit/store/buContext';
import { rgba } from '../../../styles/utils';
import BorderGlow from '../../../components/BorderGlow/BorderGlow';

// BU-specific metrics
const buMetrics = {
  evphase: [
    { icon: '💲', label: 'Monthly Recurring Revenue', value: '$105M', change: '+18.2%', positive: true, confidence: 92, forecast: '$124M in 60 days' },
    { icon: '👥', label: 'Active Customers', value: '4.39M', change: '+14.8%', positive: true, confidence: 88, forecast: '5.1M by Q3' },
    { icon: '📈', label: 'Average Revenue Per User', value: '$23.92', change: '+3.1%', positive: true, confidence: 85, forecast: '$25.10 next quarter' },
    { icon: '🎯', label: 'Customer Health Score', value: '89%', change: '+4.3%', positive: true, confidence: 90, forecast: '92% by year-end' },
    { icon: '🔄', label: 'Churn Rate', value: '2.8%', change: '-0.5%', positive: true, confidence: 86, forecast: '2.2% with new initiatives' },
    { icon: '📊', label: 'Gross Margin', value: '38%', change: '+3 pts', positive: true, confidence: 83, forecast: '41% after optimizations' },
  ],
  directv: [
    { icon: '💲', label: 'Monthly Recurring Revenue', value: '$268M', change: '+12.4%', positive: true, confidence: 94, forecast: '$298M in 60 days' },
    { icon: '👥', label: 'Active Customers', value: '11.5M', change: '+8.2%', positive: true, confidence: 91, forecast: '12.8M by Q3' },
    { icon: '📈', label: 'Average Revenue Per User', value: '$23.30', change: '+1.8%', positive: true, confidence: 87, forecast: '$24.50 next quarter' },
    { icon: '🎯', label: 'Customer Health Score', value: '87%', change: '+2.1%', positive: true, confidence: 89, forecast: '90% by year-end' },
    { icon: '🔄', label: 'Churn Rate', value: '3.1%', change: '-0.3%', positive: true, confidence: 85, forecast: '2.7% with retention push' },
    { icon: '📊', label: 'Gross Margin', value: '34%', change: '+2 pts', positive: true, confidence: 82, forecast: '36% after cost optimization' },
  ],
  streamco: [
    { icon: '💲', label: 'Monthly Recurring Revenue', value: '$158M', change: '+24.6%', positive: true, confidence: 90, forecast: '$192M in 60 days' },
    { icon: '👥', label: 'Active Customers', value: '8.9M', change: '+22.3%', positive: true, confidence: 88, forecast: '11.2M by Q3' },
    { icon: '📈', label: 'Average Revenue Per User', value: '$17.75', change: '+4.2%', positive: true, confidence: 84, forecast: '$19.20 next quarter' },
    { icon: '🎯', label: 'Customer Health Score', value: '92%', change: '+5.8%', positive: true, confidence: 93, forecast: '94% by year-end' },
    { icon: '🔄', label: 'Churn Rate', value: '2.4%', change: '-0.8%', positive: true, confidence: 88, forecast: '1.9% with content expansion' },
    { icon: '📊', label: 'Gross Margin', value: '42%', change: '+6 pts', positive: true, confidence: 86, forecast: '45% with scale' },
  ],
};

// Theme-based glow colors
const themeGlowConfig = {
  retro: {
    glowColor: '30 90 70',
    colors: ['#ED790C', '#4ecdc4', '#BF650F'],
    backgroundColor: '#ffffff',
  },
  trendy: {
    glowColor: '220 90 65',
    colors: ['#2563eb', '#22d3ee', '#1d4ed8'],
    backgroundColor: '#ffffff',
  },
};

const MetricsRow = () => {
  const { colors, fonts, shadows, activeTheme } = useThemeContext();
  const { activeBU } = useBU();
  const isRetro = activeTheme.id === 'retro';
  const glowConfig = themeGlowConfig[activeTheme.id] || themeGlowConfig.retro;
  const metrics = buMetrics[activeBU.id] || buMetrics.evphase;

  const styles = {
    root: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 28 },
    cardContent: { padding: '16px 18px' },
    topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    iconCircle: {
      width: 32, height: 32, borderRadius: isRetro ? 4 : 8,
      backgroundColor: rgba(colors.accentSecondary, 0.1),
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-md)',
    },
    confidence: {
      display: 'flex', alignItems: 'center', gap: 4,
      fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textMuted,
    },
    value: { fontFamily: fonts.heading, fontSize: 'var(--text-2xl)', fontWeight: 700, color: colors.textPrimary, marginBottom: 2 },
    label: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textMuted, marginBottom: 8 },
    changeBadge: (positive) => ({
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600,
      padding: '2px 8px', borderRadius: 10,
      backgroundColor: positive ? rgba(colors.accentSecondary, 0.1) : rgba(colors.accentPrimary, 0.1),
      color: positive ? colors.accentSecondaryDark : colors.accentPrimary,
    }),
    forecastRow: {
      display: 'flex', alignItems: 'center', gap: 6, marginTop: 12,
      paddingTop: 10, borderTop: `1px solid ${colors.borderLight}`,
    },
    forecastLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted },
    forecastValue: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary, marginTop: 2 },
    forecastArrow: { marginLeft: 'auto', fontSize: 'var(--text-sm)', color: colors.textMuted, cursor: 'pointer' },
  };

  return (
    <div style={styles.root}>
      {metrics.map((m, i) => (
        <BorderGlow
          key={i}
          edgeSensitivity={20}
          glowColor={glowConfig.glowColor}
          backgroundColor={glowConfig.backgroundColor}
          borderRadius={isRetro ? 6 : 14}
          glowRadius={50}
          glowIntensity={1.5}
          coneSpread={35}
          animated={false}
          colors={glowConfig.colors}
          fillOpacity={0.7}
        >
          <div style={styles.cardContent}>
            <div style={styles.topRow}>
              <div style={styles.iconCircle}>{m.icon}</div>
              <div style={styles.confidence}>
                <span>🧠</span>
                {m.confidence}%
              </div>
            </div>
            <div style={styles.value}>{m.value}</div>
            <div style={styles.label}>{m.label}</div>
            <span style={styles.changeBadge(m.positive)}>↗ {m.change}</span>
            <div style={styles.forecastRow}>
              <span style={{ fontSize: 'var(--text-xs)', color: colors.textMuted }}>🤖</span>
              <span style={styles.forecastLabel}>AI Forecast</span>
              <span style={styles.forecastArrow}>›</span>
            </div>
            <div style={styles.forecastValue}>{m.forecast}</div>
          </div>
        </BorderGlow>
      ))}
    </div>
  );
};

export default MetricsRow;
