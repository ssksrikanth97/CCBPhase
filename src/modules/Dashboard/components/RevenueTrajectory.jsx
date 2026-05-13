import React, { useState } from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';
import { rgba } from '../../../styles/utils';

const monthlyData = [28, 26, 24, 23, 22, 25, 30, 32, 34, 36, 35, 37];
const forecastData = [null, null, null, null, null, null, null, null, null, 36, 37, 38];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RevenueTrajectory = () => {
  const { colors, fonts, shadows } = useThemeContext();
  const [timeRange, setTimeRange] = useState('1Y');

  const maxVal = 42;
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
      backgroundColor: colors.bgSurface, borderRadius: 16, padding: '20px',
      border: `1.5px solid ${colors.borderLight}`, boxShadow: shadows.sm,
      display: 'flex', flexDirection: 'column',
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    titleRow: { display: 'flex', alignItems: 'center', gap: 10 },
    titleIcon: {
      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: rgba(colors.accentSecondary, 0.12), fontSize: 'var(--text-md)',
    },
    titleGroup: { display: 'flex', flexDirection: 'column' },
    title: { fontFamily: fonts.heading, fontSize: 'var(--text-lg)', fontWeight: 700, color: colors.textPrimary },
    titleSub: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginTop: 2 },
    timeRangeRow: { display: 'flex', gap: 2, backgroundColor: rgba(colors.bgPrimary, 0.6), borderRadius: 8, padding: 3, border: `1px solid ${colors.borderLight}` },
    timeBtn: (active) => ({
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600,
      padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
      backgroundColor: active ? colors.bgSurface : 'transparent',
      color: active ? colors.accentPrimary : colors.textMuted,
      boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
      transition: 'all 0.2s',
    }),
    badges: { display: 'flex', gap: 8, marginBottom: 14, marginTop: 8 },
    badge: (color) => ({
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600,
      padding: '4px 12px', borderRadius: 20,
      backgroundColor: rgba(color, 0.1), color: color,
      border: `1px solid ${rgba(color, 0.2)}`,
    }),
    chartArea: { position: 'relative', flex: 1, minHeight: 140, marginBottom: 6 },
    yAxis: {
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 32,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      fontFamily: fonts.body, fontSize: '10px', color: colors.textMuted,
    },
    svgWrap: { position: 'absolute', left: 36, top: 0, right: 0, bottom: 0 },
    xAxis: {
      display: 'flex', justifyContent: 'space-between', paddingLeft: 36,
      fontFamily: fonts.body, fontSize: '10px', color: colors.textMuted, marginBottom: 16,
    },
    metricsBottom: {
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
      paddingTop: 12, borderTop: `1px solid ${colors.borderLight}`,
    },
    metricItem: { textAlign: 'center' },
    metricLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 4 },
    metricValue: (color) => ({ fontFamily: fonts.heading, fontSize: 'var(--text-lg)', fontWeight: 700, color }),
    metricChange: (positive) => ({
      fontFamily: fonts.body, fontSize: '10px', fontWeight: 600, marginTop: 2,
      color: positive ? colors.accentSecondaryDark : '#ef4444',
    }),
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <div style={styles.titleIcon}>📈</div>
          <div style={styles.titleGroup}>
            <span style={styles.title}>Revenue Trajectory & Forecast</span>
            <span style={styles.titleSub}>Monthly recurring revenue with AI predictions</span>
          </div>
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
        <span style={styles.badge(colors.accentSecondaryDark)}>↑ Exceeding Target by 8.9%</span>
        <span style={styles.badge(colors.accentPrimary)}>🧠 AI Forecast Active</span>
      </div>

      <div style={styles.chartArea}>
        <div style={styles.yAxis}>
          <span>$40M</span><span>$30M</span><span>$20M</span><span>$10M</span><span>$0</span>
        </div>
        <div style={styles.svgWrap}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} stroke={colors.borderLight} strokeWidth="0.3" />
            ))}
            {/* Area fill */}
            <polyline points={`0,100 ${actualLine} 100,100`} fill={rgba(colors.accentSecondary, 0.06)} stroke="none" />
            {/* Actual line */}
            <polyline points={actualLine} fill="none" stroke={colors.accentSecondary} strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            {/* Forecast dashed line */}
            {forecastLine && (
              <polyline points={forecastLine} fill="none" stroke={colors.accentSecondary} strokeWidth="1.8" strokeDasharray="4,3" vectorEffect="non-scaling-stroke" opacity="0.5" strokeLinecap="round" />
            )}
            {/* Data points */}
            {dataPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="1.2" fill={colors.accentSecondary} vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
        </div>
      </div>

      <div style={styles.xAxis}>
        {months.map((m) => <span key={m}>{m}</span>)}
      </div>

      <div style={styles.metricsBottom}>
        <div style={styles.metricItem}>
          <div style={styles.metricLabel}>Current MRR</div>
          <div style={styles.metricValue(colors.accentSecondaryDark)}>$30.5M</div>
          <div style={styles.metricChange(true)}>↑ 12.4% vs last month</div>
        </div>
        <div style={styles.metricItem}>
          <div style={styles.metricLabel}>Predicted (60d)</div>
          <div style={styles.metricValue(colors.textPrimary)}>$36.2M</div>
          <div style={styles.metricChange(true)}>+18.7% trajectory</div>
        </div>
        <div style={styles.metricItem}>
          <div style={styles.metricLabel}>Growth Rate</div>
          <div style={styles.metricValue(colors.accentSecondaryDark)}>+18.7%</div>
          <div style={styles.metricChange(true)}>↑ 3.2% vs target</div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTrajectory;
