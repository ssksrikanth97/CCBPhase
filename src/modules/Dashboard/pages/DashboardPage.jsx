import React, { useEffect } from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';
import { useBU } from '../../BusinessUnit/store/buContext';
import MetricsRow from '../components/MetricsRow';
import RevenueTrajectory from '../components/RevenueTrajectory';
import StrategicActions from '../components/StrategicActions';
import AIInsights from '../components/AIInsights';
import DataTable from '../components/DataTable';

const DashboardPage = () => {
  const { colors, fonts } = useThemeContext();
  const { activeBU } = useBU();

  useEffect(() => {
    document.title = `EV Phase - ${activeBU.name} Dashboard`;
  }, [activeBU]);

  const styles = {
    root: { width: '100%' },
    pageTitle: {
      fontFamily: fonts.heading, fontSize: 'var(--text-3xl)', fontWeight: 700,
      color: colors.textPrimary, marginBottom: 4,
    },
    pageSubtitle: {
      fontFamily: fonts.body, fontSize: 'var(--text-base)',
      color: colors.textMuted, marginBottom: 28,
    },
    section: { marginBottom: 28 },
    sectionTitle: {
      fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600,
      color: colors.textPrimary, marginBottom: 16,
      textTransform: 'uppercase', letterSpacing: '0.5px',
    },
    mainGrid: {
      display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 28,
      alignItems: 'stretch',
    },
    rightColumn: {
      display: 'flex', flexDirection: 'column', gap: 16,
    },
  };

  return (
    <div style={styles.root}>
      <h1 style={styles.pageTitle}>{activeBU.name} — Analytics</h1>
      <p style={styles.pageSubtitle}>Real-time performance overview • {activeBU.services.join(' • ')}</p>

      <MetricsRow />

      <div style={styles.mainGrid} className="dashboard-main-grid">
        <RevenueTrajectory />
        <div style={styles.rightColumn}>
          <StrategicActions />
          <AIInsights />
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Content Performance</h2>
        <DataTable />
      </div>
    </div>
  );
};

export default DashboardPage;
