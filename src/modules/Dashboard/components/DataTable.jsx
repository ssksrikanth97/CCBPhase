import React from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';
import { useBU } from '../../BusinessUnit/store/buContext';
import { rgba } from '../../../styles/utils';

const buTableData = {
  evphase: [
    { title: 'EV Streaming Basic', views: '1.8M', engagement: 85, revenue: '$45M', status: 'active' },
    { title: 'EV Broadband Pro', views: '720K', engagement: 78, revenue: '$32M', status: 'active' },
    { title: 'EV Live Sports', views: '1.1M', engagement: 92, revenue: '$28M', status: 'active' },
    { title: 'EV Kids Zone', views: '450K', engagement: 88, revenue: '$12M', status: 'active' },
  ],
  directv: [
    { title: 'DirecTV Premium', views: '5.2M', engagement: 87, revenue: '$127M', status: 'active' },
    { title: 'DirecTV Sports Pass', views: '2.8M', engagement: 94, revenue: '$89M', status: 'active' },
    { title: 'DirecTV Fiber', views: '1.2M', engagement: 72, revenue: '$52M', status: 'active' },
    { title: 'DirecTV News', views: '890K', engagement: 65, revenue: '$18M', status: 'paused' },
  ],
  streamco: [
    { title: 'StreamCo Originals', views: '3.8M', engagement: 91, revenue: '$78M', status: 'active' },
    { title: 'StreamCo Live', views: '2.2M', engagement: 82, revenue: '$56M', status: 'active' },
    { title: 'StreamCo Kids', views: '1.6M', engagement: 95, revenue: '$24M', status: 'active' },
    { title: 'StreamCo Docs', views: '680K', engagement: 74, revenue: '$11M', status: 'active' },
  ],
};

const DataTable = () => {
  const { colors, fonts, shadows } = useThemeContext();
  const { activeBU } = useBU();
  const tableData = buTableData[activeBU.id] || buTableData.evphase;

  const styles = {
    card: {
      backgroundColor: colors.bgSurface, borderRadius: 12,
      border: `1px solid ${colors.borderLight}`, boxShadow: shadows.sm, overflow: 'hidden',
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600,
      color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px',
      padding: '12px 16px', textAlign: 'left',
      borderBottom: `1px solid ${colors.borderLight}`, backgroundColor: colors.bgPrimary,
    },
    td: {
      fontFamily: fonts.body, fontSize: 'var(--text-base)', color: colors.textPrimary,
      padding: '12px 16px', borderBottom: `1px solid ${colors.borderLight}`,
    },
    progressBar: { width: '100%', height: 6, backgroundColor: colors.borderLight, borderRadius: 3, overflow: 'hidden' },
    badge: (status) => ({
      display: 'inline-block', padding: '3px 10px', borderRadius: 6,
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600,
      backgroundColor: status === 'active' ? rgba(colors.accentSecondary, 0.12) : rgba(colors.accentPrimary, 0.1),
      color: status === 'active' ? colors.accentSecondaryDark : colors.accentPrimary,
    }),
  };

  return (
    <div style={styles.card}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Content Package</th>
            <th style={styles.th}>Views</th>
            <th style={styles.th}>Engagement</th>
            <th style={styles.th}>Revenue</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
            <tr key={i}>
              <td style={styles.td}>{row.title}</td>
              <td style={styles.td}>{row.views}</td>
              <td style={styles.td}>
                <div style={styles.progressBar}>
                  <div style={{
                    height: '100%', borderRadius: 3, width: `${row.engagement}%`,
                    backgroundColor: row.engagement > 80 ? colors.accentSecondary : colors.accentPrimary,
                  }} />
                </div>
              </td>
              <td style={styles.td}>{row.revenue}</td>
              <td style={styles.td}><span style={styles.badge(row.status)}>{row.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
