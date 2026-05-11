import React from 'react';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const churnColors = { 'Low Churn': '#10b981', 'Medium Churn': '#f59e0b', 'High Churn': '#ef4444' };
const churnBg = { 'Low Churn': '#ecfdf5', 'Medium Churn': '#fffbeb', 'High Churn': '#fef2f2' };
const churnArrow = { 'Low Churn': '↓', 'Medium Churn': '→', 'High Churn': '↑' };

const BundleListRow = ({ bundle, selected, onSelect }) => {
  const { colors, fonts } = useThemeContext();

  const isPositiveGrowth = bundle.growth?.startsWith('+');

  const styles = {
    td: {
      padding: '14px 14px', verticalAlign: 'middle',
      borderBottom: `1px solid ${colors.borderLight}`,
      fontFamily: fonts.body, fontSize: 'var(--text-sm)',
    },
    tdStickyCheckbox: {
      padding: '14px 12px', verticalAlign: 'middle',
      borderBottom: `1px solid ${colors.borderLight}`,
      fontFamily: fonts.body, fontSize: 'var(--text-sm)',
      position: 'sticky', left: 0, zIndex: 1,
      backgroundColor: colors.bgSurface, width: 36,
    },
    tdStickyName: {
      padding: '14px 12px', verticalAlign: 'middle',
      borderBottom: `1px solid ${colors.borderLight}`,
      fontFamily: fonts.body, fontSize: 'var(--text-sm)',
      position: 'sticky', left: 36, zIndex: 1,
      backgroundColor: colors.bgSurface, minWidth: 220,
      borderRight: `1px solid ${colors.borderLight}`,
    },
    checkbox: {
      width: 16, height: 16, borderRadius: 3, cursor: 'pointer',
      accentColor: colors.accentPrimary,
    },
    bundleInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
    nameRow: { display: 'flex', gap: 8, alignItems: 'center' },
    name: { fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.accentPrimary },
    type: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted },
    subtitle: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textSecondary },
    discountBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 6, fontSize: 'var(--text-xs)', fontWeight: 600,
      backgroundColor: rgba(colors.accentSecondary, 0.12), color: colors.accentSecondaryDark,
      border: `1px solid ${rgba(colors.accentSecondary, 0.25)}`, whiteSpace: 'nowrap',
    },
    churnBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 6, fontSize: 'var(--text-xs)', fontWeight: 600,
      backgroundColor: churnBg[bundle.churnLevel] || '#f9fafb',
      color: churnColors[bundle.churnLevel] || '#6b7280',
      border: `1px solid ${rgba(churnColors[bundle.churnLevel] || '#6b7280', 0.2)}`,
      whiteSpace: 'nowrap',
    },
    metric: { fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 700, color: colors.textPrimary },
    growth: { fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 700, color: isPositiveGrowth ? '#10b981' : '#ef4444' },
    products: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textSecondary },
  };

  return (
    <tr style={{ cursor: 'pointer', transition: 'background-color 0.15s' }}>
      <td style={styles.tdStickyCheckbox} onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" style={styles.checkbox} checked={selected} onChange={onSelect} aria-label={`Select ${bundle.name}`} />
      </td>
      <td style={styles.tdStickyName}>
        <div style={styles.bundleInfo}>
          <div style={styles.nameRow}>
            <span style={styles.name}>{bundle.name}</span>
            <span style={styles.type}>{bundle.bundleType}</span>
          </div>
          <span style={styles.subtitle}>{bundle.products} Products • {bundle.avgSavings}/user savings</span>
        </div>
      </td>
      <td style={styles.td}>
        <span style={styles.discountBadge}>{bundle.discount} Off</span>
      </td>
      <td style={styles.td}>
        <span style={styles.churnBadge}>{churnArrow[bundle.churnLevel]} {bundle.churnLevel}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.metric}>{bundle.subscribers}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.growth}>{bundle.growth}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.metric}>{bundle.retention}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.products}>{bundle.includedProducts?.slice(0, 3).join(', ')}{bundle.includedProducts?.length > 3 ? '...' : ''}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.metric}>{bundle.monthlyRevenue}</span>
      </td>
    </tr>
  );
};

export default BundleListRow;
