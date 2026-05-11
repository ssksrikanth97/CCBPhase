import React from 'react';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const statusColors = { Active: '#10b981', Scheduled: '#3b82f6', Expired: '#6b7280' };
const statusBg = { Active: '#ecfdf5', Scheduled: '#eff6ff', Expired: '#f9fafb' };
const statusDot = { Active: '#10b981', Scheduled: '#3b82f6', Expired: '#6b7280' };

const PromotionListRow = ({ promotion, selected, onSelect }) => {
  const { colors, fonts } = useThemeContext();

  const isPositiveGrowth = promotion.growth?.startsWith('+') && promotion.growth !== '+0%';

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
    promoInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
    nameRow: { display: 'flex', gap: 8, alignItems: 'center' },
    name: { fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.accentPrimary },
    type: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted },
    subtitle: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textSecondary },
    codeBadge: {
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 10px', borderRadius: 6, fontSize: 'var(--text-xs)', fontWeight: 700,
      fontFamily: 'monospace', letterSpacing: '0.5px',
      backgroundColor: rgba(colors.textPrimary, 0.06), color: colors.textPrimary,
      border: `1px solid ${colors.borderLight}`, whiteSpace: 'nowrap',
    },
    statusBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 6, fontSize: 'var(--text-xs)', fontWeight: 600,
      backgroundColor: statusBg[promotion.status] || '#f9fafb',
      color: statusColors[promotion.status] || '#6b7280',
      border: `1px solid ${rgba(statusColors[promotion.status] || '#6b7280', 0.2)}`,
      whiteSpace: 'nowrap',
    },
    dot: {
      width: 6, height: 6, borderRadius: '50%',
      backgroundColor: statusDot[promotion.status] || '#6b7280',
    },
    discountBadge: {
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 10px', borderRadius: 6, fontSize: 'var(--text-xs)', fontWeight: 600,
      backgroundColor: rgba(colors.accentSecondary, 0.12), color: colors.accentSecondaryDark,
      border: `1px solid ${rgba(colors.accentSecondary, 0.25)}`, whiteSpace: 'nowrap',
    },
    metric: { fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 700, color: colors.textPrimary },
    growth: { fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 700, color: isPositiveGrowth ? '#10b981' : colors.textMuted },
    date: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, whiteSpace: 'nowrap' },
    audience: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textSecondary },
  };

  return (
    <tr style={{ cursor: 'pointer', transition: 'background-color 0.15s' }}>
      <td style={styles.tdStickyCheckbox} onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" style={styles.checkbox} checked={selected} onChange={onSelect} aria-label={`Select ${promotion.name}`} />
      </td>
      <td style={styles.tdStickyName}>
        <div style={styles.promoInfo}>
          <div style={styles.nameRow}>
            <span style={styles.name}>{promotion.name}</span>
            <span style={styles.type}>{promotion.type}</span>
          </div>
          <span style={styles.subtitle}>{promotion.startDate} – {promotion.endDate} • {promotion.targetAudience}</span>
        </div>
      </td>
      <td style={styles.td}>
        <span style={styles.codeBadge}>{promotion.code}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.discountBadge}>{promotion.discount}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.statusBadge}>
          <span style={styles.dot} />
          {promotion.status}
        </span>
      </td>
      <td style={styles.td}>
        <span style={styles.metric}>{promotion.redemptions}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.metric}>{promotion.conversion}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.growth}>{promotion.growth}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.metric}>{promotion.revenue}</span>
      </td>
    </tr>
  );
};

export default PromotionListRow;
