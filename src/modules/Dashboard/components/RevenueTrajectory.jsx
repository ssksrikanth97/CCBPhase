import React, { useState } from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';
import { rgba } from '../../../styles/utils';

const monthlyData = [28, 26, 24, 23, 22, 25, 30, 32, 34, 36, 35, 37];
const forecastData = [null, null, null, null, null, null, null, null, null, 36, 37, 38];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RevenueTrajectory = () => {
  const { colors, fonts, shadows } = useThemeContext();
  const [timeRange, setTimeRange] = useState('1Y');

  const maxVal = 40;
  const dataPoints = monthlyData.map((val, i) => ({
    x: (i / (monthlyData.length - 1)) * 100,
    y: 100 - (val / maxVal) * 100,
  }));

  const actualLine = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const forecastPoints = forecastData
    .map((val, i) => val !== null ? { x: (i / (monthlyData.length - 1)) * 100, y: 100 - (val / maxVal) * 100 } : null)
    .filter(Boolean);
  const forecastLine = forecastPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const styles = {
    card: {
      backgroundColor: colors.bgSurface, borderRadius: 14, padding: '20px',
      border: `1px solid ${colors.borderLight}`, boxShadow: shadows.sm,
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    titleRow: { display: 'flex', alignItems: 'center', gap: 8 },
    titleIcon: { fontSize: 'var(--text-lg)' },
    title: { fontFamily: fonts.heading, fontSize: 'var(--text-lg)', fontWeight: 700, color: colors.textPrimary },
    badges: { display: 'flex', gap: 8, marginBottom: 16 },
    badge: (color) => ({
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600,
      padding: '3px 10px', borderRadius: 10,
      backgroundColor: rgba(color, 0.1), color: color,
    }),
    timeRangeRow: { display: 'flex', gap: 4 },
    timeBtn: (active) => ({
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 500,
      padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
      backgroundColor: active ? colors.accentPrimary : 'transparent',
      color: active ? '#ffffff' : colors.textMuted,
    }),
    chartArea: { position: 'relative', height: 180, marginBottom: 12 },
    yAxis: {
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 30,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted,
    },
    xAxis: {
      display: 'flex', justifyContent: 'space-between', paddingLeft: 30,
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted,
    },
    metricsBottom: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${colors.borderLight}` },
    metricItem: { textAlign: 'center' },
    metricLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 4 },
    metricValue: (color) => ({ fontFamily: fonts.heading, fontSize: 'var(--text-xl)', fontWeight: 700, color }),
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <span style={styles.titleIcon}>📈</span>
          <span style={styles.title}>Revenue Trajectory & Forecast</span>
        </div>
        <div style={styles.timeRangeRow}>
          {['7D', '30D', '90D', '1Y'].map((range) => (
            <button key={range} style={styles.timeBtn(timeRange === range)} onClick={() => setTimeRange(range)}>
              {range}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.badges}>
        <span style={styles.badge(colors.accentSecondary)}>Exceeding Target by 8.9%</span>
        <span style={styles.badge(colors.textMuted)}>🧠 AI Forecast Active</span>
      </div>

      <div style={styles.chartArea}>
        <div style={styles.yAxis}>
          <span>40</span><span>30</span><span>20</span><span>10</span><span>0</span>
        </div>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ paddingLeft: 30 }}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke={colors.borderLight} strokeWidth="0.3" />
          ))}
          {/* Actual line */}
          <polyline points={`0,100 ${actualLine} 100,100`} fill={rgba(colors.accentSecondary, 0.08)} stroke="none" />
          <polyline points={actualLine} fill="none" stroke={colors.accentSecondary} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          {/* Forecast dashed line */}
          {forecastLine && (
            <polyline points={forecastLine} fill="none" stroke={colors.accentSecondary} strokeWidth="1.5" strokeDasharray="3,2" vectorEffect="non-scaling-stroke" opacity="0.6" />
          )}
        </svg>
      </div>

      <div style={styles.xAxis}>
        {months.filter((_, i) => i % 2 === 0).map((m) => <span key={m}>{m}</span>)}
      </div>

      <div style={styles.metricsBottom}>
        <div style={styles.metricItem}>
          <div style={styles.metricLabel}>Current MRR</div>
          <div style={styles.metricValue(colors.accentSecondaryDark)}>$30.5M</div>
        </div>
        <div style={styles.metricItem}>
          <div style={styles.metricLabel}>Predicted (60d)</div>
          <div style={styles.metricValue(colors.textPrimary)}>$36.2M</div>
        </div>
        <div style={styles.metricItem}>
          <div style={styles.metricLabel}>Growth Rate</div>
          <div style={styles.metricValue(colors.accentSecondaryDark)}>+18.7%</div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTrajectory;
