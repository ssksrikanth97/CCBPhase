import React from 'react';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const churnColors = { 'Low Churn': '#10b981', 'Medium Churn': '#f59e0b', 'High Churn': '#ef4444' };
const churnBg = { 'Low Churn': '#ecfdf5', 'Medium Churn': '#fffbeb', 'High Churn': '#fef2f2' };
const churnArrow = { 'Low Churn': '↓', 'Medium Churn': '→', 'High Churn': '↑' };
const statusColors = { Active: '#10b981', Draft: '#6b7280', Inactive: '#ef4444' };
const statusBg = { Active: '#ecfdf5', Draft: '#f9fafb', Inactive: '#fef2f2' };

const ProductListRow = ({ product, selected, onSelect }) => {
  const { colors, fonts } = useThemeContext();

  const isPositiveGrowth = product.growth?.startsWith('+');

  const styles = {
    td: {
      padding: '12px 12px', verticalAlign: 'middle',
      borderBottom: `1px solid ${colors.borderLight}`,
      fontFamily: fonts.body, fontSize: 'var(--text-sm)',
    },
    tdStickyCheckbox: {
      padding: '12px 12px', verticalAlign: 'middle',
      borderBottom: `1px solid ${colors.borderLight}`,
      fontFamily: fonts.body, fontSize: 'var(--text-sm)',
      position: 'sticky', left: 0, zIndex: 1,
      backgroundColor: colors.bgSurface,
      width: 36,
    },
    tdStickyName: {
      padding: '12px 12px', verticalAlign: 'middle',
      borderBottom: `1px solid ${colors.borderLight}`,
      fontFamily: fonts.body, fontSize: 'var(--text-sm)',
      position: 'sticky', left: 36, zIndex: 1,
      backgroundColor: colors.bgSurface,
      minWidth: 220,
      borderRight: `1px solid ${colors.borderLight}`,
    },
    checkbox: {
      width: 16, height: 16, borderRadius: 3, cursor: 'pointer',
      accentColor: colors.accentPrimary,
    },
    productInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
    nameRow: { display: 'flex', gap: 8, alignItems: 'center' },
    name: { fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.accentPrimary },
    subtitle: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textSecondary },
    statusBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 6, fontSize: 'var(--text-xs)', fontWeight: 600,
      backgroundColor: statusBg[product.status] || '#f9fafb',
      color: statusColors[product.status] || '#6b7280',
      border: `1px solid ${rgba(statusColors[product.status] || '#6b7280', 0.2)}`,
      whiteSpace: 'nowrap',
    },
    statusDot: {
      width: 6, height: 6, borderRadius: '50%',
      backgroundColor: statusColors[product.status] || '#6b7280',
    },
    categoryChip: {
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 500,
      padding: '2px 8px', borderRadius: 4,
      backgroundColor: rgba(colors.accentPrimary, 0.08), color: colors.accentPrimary,
      whiteSpace: 'nowrap',
    },
    subscriptionBadge: {
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 8px', borderRadius: 6, fontSize: 'var(--text-xs)', fontWeight: 600,
      backgroundColor: rgba(colors.accentSecondary, 0.1), color: colors.accentSecondaryDark,
      border: `1px solid ${rgba(colors.accentSecondary, 0.2)}`, whiteSpace: 'nowrap',
    },
    churnBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '3px 8px', borderRadius: 6, fontSize: 'var(--text-xs)', fontWeight: 600,
      backgroundColor: churnBg[product.churnLevel] || '#f9fafb',
      color: churnColors[product.churnLevel] || '#6b7280',
      border: `1px solid ${rgba(churnColors[product.churnLevel] || '#6b7280', 0.2)}`,
      whiteSpace: 'nowrap',
    },
    metric: { fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 700, color: colors.textPrimary, whiteSpace: 'nowrap' },
    growth: { fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 700, color: isPositiveGrowth ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' },
    muted: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, whiteSpace: 'nowrap' },
    region: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textSecondary, whiteSpace: 'nowrap' },
  };

  return (
    <tr style={{ cursor: 'pointer', transition: 'background-color 0.15s' }}>
      <td style={styles.tdStickyCheckbox} onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" style={styles.checkbox} checked={selected} onChange={onSelect} aria-label={`Select ${product.name}`} />
      </td>
      <td style={styles.tdStickyName}>
        <div style={styles.productInfo}>
          <div style={styles.nameRow}>
            <span style={styles.name}>{product.name}</span>
          </div>
          <span style={styles.subtitle}>{product.sku} • {product.price}/mo</span>
        </div>
      </td>
      <td style={styles.td}>
        <span style={styles.statusBadge}>
          <span style={styles.statusDot} />
          {product.status}
        </span>
      </td>
      <td style={styles.td}>
        <span style={styles.categoryChip}>{product.category}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.subscriptionBadge}>{product.subscriptionModel}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.muted}>{product.serviceType}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.churnBadge}>{churnArrow[product.churnLevel]} {product.churnRate}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.metric}>{product.subscribers}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.growth}>{product.growth}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.metric}>{product.arpu}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.metric}>{product.ltv}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.metric}>{product.engagement}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.region}>{product.region}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.metric}>{product.monthlyRevenue}</span>
      </td>
    </tr>
  );
};

export default ProductListRow;
