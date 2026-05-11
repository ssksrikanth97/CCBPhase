import React from 'react';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const statusStyles = {
  Active: { bg: 'accentSecondary', text: 'accentSecondaryDark' },
  Scheduled: { bg: 'accentPrimary', text: 'accentPrimary' },
  Expired: { bg: 'textMuted', text: 'textMuted' },
};

const PromotionCard = ({ promotion }) => {
  const { colors, fonts, shadows } = useThemeContext();

  const statusConfig = statusStyles[promotion.status] || statusStyles.Active;
  const isPositiveGrowth = promotion.growth?.startsWith('+') && promotion.growth !== '+0%';

  const styles = {
    card: {
      backgroundColor: colors.bgSurface, borderRadius: 12, padding: '20px 22px',
      border: `1.5px solid ${colors.borderLight}`, boxShadow: shadows.sm,
      cursor: 'pointer', transition: 'all 0.2s',
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    promoName: { fontFamily: fonts.heading, fontSize: 'var(--text-md)', fontWeight: 600, color: colors.textPrimary, lineHeight: 1.3, flex: 1, paddingRight: 8 },
    statusBadge: {
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600,
      padding: '3px 10px', borderRadius: 4, whiteSpace: 'nowrap',
      backgroundColor: rgba(colors[statusConfig.bg], 0.12),
      color: colors[statusConfig.text],
      border: `1px solid ${rgba(colors[statusConfig.bg], 0.3)}`,
    },
    metaRow: { display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' },
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
    },
    codeChip: {
      fontFamily: 'monospace', fontSize: 'var(--text-xs)', fontWeight: 700,
      padding: '3px 10px', borderRadius: 4, letterSpacing: '0.5px',
      backgroundColor: rgba(colors.textPrimary, 0.06), color: colors.textPrimary,
      border: `1px solid ${colors.borderLight}`,
    },
    dateRow: {
      display: 'flex', gap: 16, marginBottom: 12, padding: '8px 12px', borderRadius: 6,
      backgroundColor: rgba(colors.bgPrimary, 0.5), border: `1px solid ${colors.borderLight}`,
    },
    dateItem: { display: 'flex', flexDirection: 'column' },
    dateLabel: { fontFamily: fonts.body, fontSize: '10px', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' },
    dateValue: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textSecondary },
    metricsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: 14 },
    metricLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 2 },
    metricValue: { fontFamily: fonts.heading, fontSize: 'var(--text-base)', fontWeight: 700, color: colors.textPrimary },
    growthValue: { fontFamily: fonts.heading, fontSize: 'var(--text-base)', fontWeight: 700, color: isPositiveGrowth ? colors.accentSecondaryDark : colors.textMuted },
    progressSection: { marginBottom: 14 },
    progressLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 },
    progressText: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted },
    progressCount: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textSecondary },
    progressBar: { height: 4, borderRadius: 2, backgroundColor: rgba(colors.accentPrimary, 0.12), overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${colors.accentPrimary}, ${colors.accentSecondary})` },
    insightBox: { backgroundColor: rgba(colors.accentSecondary, 0.06), borderRadius: 8, padding: '10px 14px', marginBottom: 14, borderLeft: `3px solid ${colors.accentSecondary}` },
    insightHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 },
    insightIcon: { width: 16, height: 16, borderRadius: '50%', backgroundColor: colors.accentSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: '#fff' },
    insightLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textSecondary, fontWeight: 500 },
    insightText: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.accentSecondaryDark, fontWeight: 500 },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 10, borderTop: `1px solid ${colors.borderLight}` },
    revenueLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 2 },
    revenueValue: { fontFamily: fonts.heading, fontSize: 'var(--text-lg)', fontWeight: 700, color: colors.textPrimary },
    audienceLabel: { fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 2, textAlign: 'right' },
    audienceValue: { fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textSecondary, textAlign: 'right' },
  };

  const usagePercent = promotion.maxUses ? Math.min((parseInt(promotion.redemptions?.replace(/[^0-9.]/g, '') || 0) / promotion.maxUses) * 100, 100) : 0;

  return (
    <article style={styles.card} role="listitem" tabIndex={0} aria-label={promotion.name}>
      <div style={styles.header}>
        <span style={styles.promoName}>{promotion.name}</span>
        <span style={styles.statusBadge}>{promotion.status}</span>
      </div>

      {/* Promo type, discount value, code */}
      <div style={styles.metaRow}>
        <span style={styles.typeChip}>{promotion.type}</span>
        <span style={styles.discountChip}>{promotion.discount}</span>
        <span style={styles.codeChip}>{promotion.code}</span>
      </div>

      {/* Validity dates */}
      <div style={styles.dateRow}>
        <div style={styles.dateItem}>
          <span style={styles.dateLabel}>Start</span>
          <span style={styles.dateValue}>{promotion.startDate}</span>
        </div>
        <div style={styles.dateItem}>
          <span style={styles.dateLabel}>End</span>
          <span style={styles.dateValue}>{promotion.endDate}</span>
        </div>
      </div>

      {/* Key metrics: 3-column */}
      <div style={styles.metricsGrid}>
        <div>
          <div style={styles.metricLabel}>Redemptions</div>
          <div style={styles.metricValue}>{promotion.redemptions}</div>
        </div>
        <div>
          <div style={styles.metricLabel}>Conversion</div>
          <div style={styles.metricValue}>{promotion.conversion}</div>
        </div>
        <div>
          <div style={styles.metricLabel}>Growth</div>
          <div style={styles.growthValue}>{promotion.growth}</div>
        </div>
      </div>

      {/* Usage progress bar */}
      {promotion.maxUses > 0 && (
        <div style={styles.progressSection}>
          <div style={styles.progressLabel}>
            <span style={styles.progressText}>Usage Cap</span>
            <span style={styles.progressCount}>{promotion.redemptions} / {promotion.maxUses.toLocaleString()}</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${usagePercent}%` }} />
          </div>
        </div>
      )}

      {/* AI Insight */}
      {promotion.aiInsight && (
        <div style={styles.insightBox}>
          <div style={styles.insightHeader}>
            <div style={styles.insightIcon}>✦</div>
            <span style={styles.insightLabel}>AI Insight</span>
          </div>
          <div style={styles.insightText}>{promotion.aiInsight}</div>
        </div>
      )}

      {/* Footer: Revenue + Target Audience */}
      <div style={styles.footer}>
        <div>
          <div style={styles.revenueLabel}>Revenue Impact</div>
          <div style={styles.revenueValue}>{promotion.revenue}</div>
        </div>
        <div>
          <div style={styles.audienceLabel}>Audience</div>
          <div style={styles.audienceValue}>{promotion.targetAudience}</div>
        </div>
      </div>
    </article>
  );
};

export default PromotionCard;
