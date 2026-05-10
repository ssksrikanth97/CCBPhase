import React from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';
import { rgba } from '../../../styles/utils';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const ChartSection = ({ title, type, color, data }) => {
  const { colors, fonts, shadows } = useThemeContext();
  const maxVal = Math.max(...data);

  const styles = {
    card: {
      backgroundColor: colors.bgSurface, borderRadius: 12, padding: 20,
      border: `1px solid ${colors.borderLight}`, boxShadow: shadows.sm,
    },
    title: { fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 600, color: colors.textPrimary, marginBottom: 16 },
    chartArea: { display: 'flex', alignItems: 'flex-end', gap: 4, height: 120, padding: '0 4px' },
    bar: (val) => ({ flex: 1, height: `${(val / maxVal) * 100}%`, backgroundColor: color, borderRadius: '3px 3px 0 0' }),
    lineChart: { height: 120 },
    labels: { display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted },
  };

  if (type === 'line') {
    const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - (val / maxVal) * 80}`).join(' ');
    return (
      <div style={styles.card}>
        <div style={styles.title}>{title}</div>
        <div style={styles.lineChart}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline points={`0,100 ${points} 100,100`} fill={rgba(color, 0.1)} stroke="none" />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div style={styles.labels}>
          {months.slice(0, data.length).filter((_, i) => i % 3 === 0).map((m) => <span key={m}>{m}</span>)}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.title}>{title}</div>
      <div style={styles.chartArea}>
        {data.map((val, i) => <div key={i} style={styles.bar(val)} />)}
      </div>
      <div style={styles.labels}>
        {months.slice(0, data.length).filter((_, i) => i % 3 === 0).map((m) => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
};

export default ChartSection;
