import React from 'react';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const ProductCard = ({ product }) => {
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

  const isPositiveGrowth = product.growth?.startsWith('+');

  const styles = {
    card: {
      backgroundColor: colors.bgSurface, borderRadius: 12, padding: '20px 22px',
      border: `1.5px solid ${colors.borderLight}`, boxShadow: shadows.sm,
      cursor: 'pointer', transition: 'all 0.2s',
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    productName: { fontFamily: fonts.heading, fontSize: 'var(--text-md)', fontWeight: 600, color: colors.textPrimary, lineHeight: 1.3, flex: 1, paddingRight: 8 },
    churnBadge: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, padding: '3px 10px', borderRadius: 4, whiteSpace: 'nowrap', ...getChurnStyle(product.churnColor) },
    aiLabel: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textMuted, marginBottom: 12 },
    metricsRow: { display: 'flex', gap: 32, marginBottom: 14 },
    metricLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 2 },
    metricValue: { fontFamily: fonts.heading, fontSize: 'var(--text-lg)', fontWeight: 700, color: colors.textPrimary },
    growthValue: { fontFamily: fonts.heading, fontSize: 'var(--text-lg)', fontWeight: 700, color: isPositiveGrowth ? colors.accentSecondaryDark : colors.accentPrimary },
    insightBox: { backgroundColor: rgba(colors.accentSecondary, 0.06), borderRadius: 8, padding: '10px 14px', marginBottom: 16, borderLeft: `3px solid ${colors.accentSecondary}` },
    insightHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 },
    insightIcon: { width: 16, height: 16, borderRadius: '50%', backgroundColor: colors.accentSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: '#fff' },
    insightLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textSecondary, fontWeight: 500 },
    insightText: { fontFamily: fonts.body, fontSize: 'var(--text-base)', color: colors.accentSecondaryDark, fontWeight: 500 },
    revenueLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 2 },
    revenueValue: { fontFamily: fonts.heading, fontSize: 'var(--text-xl)', fontWeight: 700, color: colors.textPrimary },
  };

  return (
    <article style={styles.card} role="listitem" tabIndex={0} aria-label={product.name}>
      <div style={styles.header}>
        <span style={styles.productName}>{product.name}</span>
        <span style={styles.churnBadge}>{product.churnLevel}</span>
      </div>
      {product.aiRecommendation && <div style={styles.aiLabel}>AI Recommendation:</div>}
      <div style={styles.metricsRow}>
        <div>
          <div style={styles.metricLabel}>Subscribers</div>
          <div style={styles.metricValue}>{product.subscribers}</div>
        </div>
        <div>
          <div style={styles.metricLabel}>Growth</div>
          <div style={styles.growthValue}>{product.growth}</div>
        </div>
      </div>
      {product.aiInsight && (
        <div style={styles.insightBox}>
          <div style={styles.insightHeader}>
            <div style={styles.insightIcon}>✦</div>
            <span style={styles.insightLabel}>AI Insight</span>
          </div>
          <div style={styles.insightText}>{product.aiInsight}</div>
        </div>
      )}
      <div>
        <div style={styles.revenueLabel}>Monthly Revenue</div>
        <div style={styles.revenueValue}>{product.monthlyRevenue}</div>
      </div>
    </article>
  );
};

export default ProductCard;
