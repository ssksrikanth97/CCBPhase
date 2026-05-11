import React from 'react';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const BundleCard = ({ bundle }) => {
  const { colors, fonts, shadows } = useThemeContext();

  const getChurnStyle = (color) => {
    switch (color) {
      case 'low':
        return { backgroundColor: rgba(colors.accentSecondary, 0.12), color: colors.accentSecondaryDark, border: `1px solid ${rgba(colors.accentSecondary, 0.3)}` };
      case 'medium':
        return { backgroundColor: rgba(colors.accentPrimary, 0.08), color: colors.accentPrimary, border: `1px solid ${rgba(colors.accentPrimary, 0.25)}` };
      case 'high':
        return { backgroundColor: rgba(colors.accentPrimaryHover, 0.1), color: colors.accentPrimaryHover, border: `1px solid ${rgba(colors.accentPrimaryHover, 0.3)}` };
      default:
        return { backgroundColor: rgba(colors.accentSecondary, 0.12), color: colors.accentSecondaryDark, border: `1px solid ${rgba(colors.accentSecondary, 0.3)}` };
    }
  };

  const isPositiveGrowth = bundle.growth?.startsWith('+');

  const styles = {
    card: {
      backgroundColor: colors.bgSurface, borderRadius: 12, padding: '20px 22px',
      border: `1.5px solid ${colors.borderLight}`, boxShadow: shadows.sm,
      cursor: 'pointer', transition: 'all 0.2s',
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    bundleName: { fontFamily: fonts.heading, fontSize: 'var(--text-md)', fontWeight: 600, color: colors.textPrimary, lineHeight: 1.3, flex: 1, paddingRight: 8 },
    churnBadge: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, padding: '3px 10px', borderRadius: 4, whiteSpace: 'nowrap', ...getChurnStyle(bundle.churnColor) },
    typeRow: { display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' },
    typeChip: {
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600,
      padding: '3px 10px', borderRadius: 4,
      backgroundColor: rgba(colors.accentPrimary, 0.1), color: colors.accentPrimary,
      border: `1px solid ${rgba(colors.accentPrimary, 0.2)}`,
    },
    discountChip: {
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600,
      padding: '3px 10px', borderRadius: 4,
      backgroundColor: rgba(colors.accentSecondary, 0.12), color: colors.accentSecondaryDark,
      border: `1px solid ${rgba(colors.accentSecondary, 0.25)}`,
    },
    productsSection: {
      marginBottom: 14, padding: '10px 12px', borderRadius: 8,
      backgroundColor: rgba(colors.bgPrimary, 0.5), border: `1px solid ${colors.borderLight}`,
    },
    productsLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 6, fontWeight: 500 },
    productsList: { display: 'flex', flexWrap: 'wrap', gap: 6 },
    productItem: {
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 500,
      padding: '2px 8px', borderRadius: 12,
      backgroundColor: colors.bgSurface, color: colors.textSecondary,
      border: `1px solid ${colors.borderLight}`,
    },
    metricsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: 14 },
    metricLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 2 },
    metricValue: { fontFamily: fonts.heading, fontSize: 'var(--text-base)', fontWeight: 700, color: colors.textPrimary },
    growthValue: { fontFamily: fonts.heading, fontSize: 'var(--text-base)', fontWeight: 700, color: isPositiveGrowth ? colors.accentSecondaryDark : colors.accentPrimary },
    insightBox: { backgroundColor: rgba(colors.accentSecondary, 0.06), borderRadius: 8, padding: '10px 14px', marginBottom: 14, borderLeft: `3px solid ${colors.accentSecondary}` },
    insightHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 },
    insightIcon: { width: 16, height: 16, borderRadius: '50%', backgroundColor: colors.accentSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: '#fff' },
    insightLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textSecondary, fontWeight: 500 },
    insightText: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.accentSecondaryDark, fontWeight: 500 },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 10, borderTop: `1px solid ${colors.borderLight}` },
    revenueLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 2 },
    revenueValue: { fontFamily: fonts.heading, fontSize: 'var(--text-lg)', fontWeight: 700, color: colors.textPrimary },
    savingsLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 2, textAlign: 'right' },
    savingsValue: { fontFamily: fonts.heading, fontSize: 'var(--text-base)', fontWeight: 600, color: colors.accentSecondaryDark, textAlign: 'right' },
  };

  return (
    <article style={styles.card} role="listitem" tabIndex={0} aria-label={bundle.name}>
      <div style={styles.header}>
        <span style={styles.bundleName}>{bundle.name}</span>
        <span style={styles.churnBadge}>{bundle.churnLevel}</span>
      </div>

      {/* Bundle type + discount */}
      <div style={styles.typeRow}>
        <span style={styles.typeChip}>{bundle.bundleType} Bundle</span>
        <span style={styles.discountChip}>{bundle.discount} Off</span>
      </div>

      {/* Included products */}
      <div style={styles.productsSection}>
        <div style={styles.productsLabel}>Included Products ({bundle.products})</div>
        <div style={styles.productsList}>
          {bundle.includedProducts?.map((p, i) => (
            <span key={i} style={styles.productItem}>{p}</span>
          ))}
        </div>
      </div>

      {/* Key metrics: 3-column */}
      <div style={styles.metricsGrid}>
        <div>
          <div style={styles.metricLabel}>Subscribers</div>
          <div style={styles.metricValue}>{bundle.subscribers}</div>
        </div>
        <div>
          <div style={styles.metricLabel}>Growth</div>
          <div style={styles.growthValue}>{bundle.growth}</div>
        </div>
        <div>
          <div style={styles.metricLabel}>Retention</div>
          <div style={styles.metricValue}>{bundle.retention}</div>
        </div>
      </div>

      {/* AI Insight */}
      {bundle.aiInsight && (
        <div style={styles.insightBox}>
          <div style={styles.insightHeader}>
            <div style={styles.insightIcon}>✦</div>
            <span style={styles.insightLabel}>AI Insight</span>
          </div>
          <div style={styles.insightText}>{bundle.aiInsight}</div>
        </div>
      )}

      {/* Footer: Revenue + Savings */}
      <div style={styles.footer}>
        <div>
          <div style={styles.revenueLabel}>Monthly Revenue</div>
          <div style={styles.revenueValue}>{bundle.monthlyRevenue}</div>
        </div>
        <div>
          <div style={styles.savingsLabel}>Avg Savings</div>
          <div style={styles.savingsValue}>{bundle.avgSavings}/user</div>
        </div>
      </div>
    </article>
  );
};

export default BundleCard;
