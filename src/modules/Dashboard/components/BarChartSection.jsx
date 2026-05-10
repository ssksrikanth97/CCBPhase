import React from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';

const BarChartSection = ({ title, color, data, small }) => {
  const { colors, fonts, shadows } = useThemeContext();
  const maxVal = Math.max(...data);

  const styles = {
    card: {
      backgroundColor: colors.bgSurface, borderRadius: 12, padding: 20,
      border: `1px solid ${colors.borderLight}`, boxShadow: shadows.sm,
    },
    title: { fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 600, color: colors.textPrimary, marginBottom: 16 },
    chartArea: { display: 'flex', alignItems: 'flex-end', gap: 6, height: small ? 80 : 120, padding: '0 4px' },
    bar: (val) => ({ flex: 1, height: `${(val / maxVal) * 100}%`, backgroundColor: color, borderRadius: '3px 3px 0 0' }),
  };

  return (
    <div style={styles.card}>
      <div style={styles.title}>{title}</div>
      <div style={styles.chartArea}>
        {data.map((val, i) => <div key={i} style={styles.bar(val)} />)}
      </div>
    </div>
  );
};

export default BarChartSection;
