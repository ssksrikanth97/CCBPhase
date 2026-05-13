import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import { useThemeContext } from '../../../styles/ThemeContext';
import { mockCustomers } from '../store/mockData';
import CustomerVoiceInputBar from '../components/CustomerVoiceInputBar/CustomerVoiceInputBar';
import CustomerFilterBar from '../components/CustomerFilterBar/CustomerFilterBar';
import AIInsightsCards from '../../../components/AIInsightsCards/AIInsightsCards';
import ViewToggle from '../../../components/ViewToggle/ViewToggle';

const statusColor = (status) => {
  switch (status) {
    case 'Active': return { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' };
    case 'Suspended': return { bg: 'rgba(245,158,11,0.12)', color: '#d97706' };
    case 'Churned': return { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' };
    default: return { bg: 'rgba(100,116,139,0.12)', color: '#64748b' };
  }
};

const segmentColor = (segment) => {
  switch (segment) {
    case 'VIP': return { bg: 'rgba(168,85,247,0.12)', color: '#9333ea' };
    case 'Premium': return { bg: 'rgba(59,130,246,0.12)', color: '#2563eb' };
    case 'Standard': return { bg: 'rgba(100,116,139,0.12)', color: '#64748b' };
    default: return { bg: 'rgba(100,116,139,0.08)', color: '#94a3b8' };
  }
};

const CustomerListPage = () => {
  const { colors, fonts, buttonGradient, shadows } = useThemeContext();
  const history = useHistory();
  const [activeFilters, setActiveFilters] = useState(['Active']);
  const [view, setView] = useState('list');
  const [selectedItems, setSelectedItems] = useState([]);

  const handleAddFilter = (filter) => setActiveFilters((prev) => [...prev, filter]);
  const handleRemoveFilter = (filter) => setActiveFilters((prev) => prev.filter((f) => f !== filter));

  const filtered = mockCustomers.filter((c) => {
    if (activeFilters.length === 0) return true;
    return activeFilters.some((f) =>
      c.status === f || c.segment === f || c.region === f
    );
  });

  const toggleSelectAll = () => {
    if (selectedItems.length === filtered.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filtered.map((_, i) => i));
    }
  };

  const toggleSelect = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const styles = {
    root: { width: '100%' },
    headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    headerLeft: { display: 'flex', alignItems: 'center', gap: 16 },
    heading: { fontFamily: fonts.heading, fontSize: 'var(--text-3xl)', fontWeight: 700, color: colors.textPrimary },
    subtitle: { fontFamily: fonts.body, fontSize: 'var(--text-base)', color: colors.textSecondary, marginBottom: 24 },
    addBtn: {
      display: 'flex', alignItems: 'center', gap: 6,
      background: buttonGradient || colors.accentPrimary,
      color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)',
      padding: '10px 20px', fontFamily: fonts.body, fontSize: 'var(--text-base)',
      fontWeight: 600, cursor: 'pointer',
    },
    tableWrap: {
      overflowX: 'auto', borderRadius: 10, border: `1px solid ${colors.borderLight}`,
      backgroundColor: colors.bgSurface, boxShadow: shadows.sm, position: 'relative',
    },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: fonts.body, fontSize: 'var(--text-sm)', minWidth: 1100 },
    th: {
      padding: '12px 14px', textAlign: 'left', fontWeight: 600,
      fontSize: 'var(--text-xs)', color: colors.textMuted,
      borderBottom: `1px solid ${colors.borderLight}`, backgroundColor: colors.bgPrimary, whiteSpace: 'nowrap',
    },
    thSticky: {
      padding: '12px 14px', textAlign: 'left', fontWeight: 600,
      fontSize: 'var(--text-xs)', color: colors.textMuted,
      borderBottom: `1px solid ${colors.borderLight}`, backgroundColor: colors.bgPrimary, whiteSpace: 'nowrap',
      position: 'sticky', zIndex: 2,
    },
    td: { padding: '14px 14px', borderBottom: `1px solid ${colors.borderLight}`, verticalAlign: 'middle' },
    nameCell: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
    avatar: {
      width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(78,205,196,0.15)', color: colors.accentSecondary, fontWeight: 600, fontSize: 'var(--text-xs)',
    },
    badge: (bg, color) => ({
      display: 'inline-block', padding: '3px 10px', borderRadius: 12,
      fontSize: 'var(--text-xs)', fontWeight: 500, backgroundColor: bg, color,
    }),
    row: { transition: 'background 0.15s', cursor: 'pointer' },
    checkbox: { width: 16, height: 16, borderRadius: 3, cursor: 'pointer', accentColor: colors.accentPrimary },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
    card: {
      backgroundColor: colors.bgSurface, borderRadius: 12, padding: '20px 22px',
      border: `1px solid ${colors.borderLight}`, boxShadow: shadows.sm,
      cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s',
    },
    cardHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
    cardAvatar: {
      width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(78,205,196,0.15)', color: colors.accentSecondary, fontWeight: 700, fontSize: 'var(--text-sm)',
    },
    cardName: { fontFamily: fonts.heading, fontSize: 'var(--text-base)', fontWeight: 600, color: colors.textPrimary },
    cardEmail: { fontSize: 'var(--text-xs)', color: colors.textMuted, fontFamily: fonts.body },
    cardMeta: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 },
    cardMetaItem: { fontSize: 'var(--text-xs)', color: colors.textMuted, fontFamily: fonts.body },
    cardMetaValue: { fontSize: 'var(--text-sm)', color: colors.textSecondary, fontFamily: fonts.body, fontWeight: 500 },
    emptyState: { textAlign: 'center', padding: '60px 0', color: colors.textSecondary, fontFamily: fonts.body },
  };

  const renderCardView = () => (
    <div style={styles.grid} role="list" aria-label="Customer list">
      {filtered.map((customer) => {
        const sc = statusColor(customer.status);
        const sg = segmentColor(customer.segment);
        return (
          <div
            key={customer.id}
            style={styles.card}
            role="listitem"
            onClick={() => history.push(`/customers/${customer.id}`)}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = shadows.md; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = shadows.sm; e.currentTarget.style.transform = 'none'; }}
          >
            <div style={styles.cardHeader}>
              <div style={styles.cardAvatar}>{customer.firstName[0]}{customer.lastName[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.cardName}>{customer.firstName} {customer.lastName}</div>
                <div style={styles.cardEmail}>{customer.email}</div>
              </div>
              <span style={styles.badge(sc.bg, sc.color)}>{customer.status}</span>
            </div>
            <div style={styles.cardMeta}>
              <div><div style={styles.cardMetaItem}>Segment</div><div style={styles.cardMetaValue}><span style={styles.badge(sg.bg, sg.color)}>{customer.segment}</span></div></div>
              <div><div style={styles.cardMetaItem}>Region</div><div style={styles.cardMetaValue}>{customer.region}</div></div>
              <div><div style={styles.cardMetaItem}>Subscriptions</div><div style={styles.cardMetaValue}>{customer.subscriptions.length} plan{customer.subscriptions.length !== 1 ? 's' : ''}</div></div>
              <div><div style={styles.cardMetaItem}>Member Since</div><div style={styles.cardMetaValue}>{customer.joinDate}</div></div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thSticky, width: 36, left: 0 }}>
              <input type="checkbox" style={styles.checkbox} checked={selectedItems.length === filtered.length && filtered.length > 0} onChange={toggleSelectAll} aria-label="Select all" />
            </th>
            <th style={{ ...styles.thSticky, left: 36, minWidth: 220, borderRight: `1px solid ${colors.borderLight}` }}>Customer</th>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Segment</th>
            <th style={styles.th}>Region</th>
            <th style={styles.th}>Subscriptions</th>
            <th style={styles.th}>Monthly Spend</th>
            <th style={styles.th}>Loyalty Points</th>
            <th style={styles.th}>Devices</th>
            <th style={styles.th}>Join Date</th>
            <th style={styles.th}>Last Activity</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((customer, index) => {
            const sc = statusColor(customer.status);
            const sg = segmentColor(customer.segment);
            const monthlySpend = customer.payments.length > 0 ? customer.payments[0].amount : '—';
            return (
              <tr
                key={customer.id}
                style={styles.row}
                onClick={() => history.push(`/customers/${customer.id}`)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(78,205,196,0.04)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ ...styles.td, position: 'sticky', left: 0, backgroundColor: colors.bgSurface, zIndex: 1 }}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={selectedItems.includes(index)}
                    onChange={(e) => { e.stopPropagation(); toggleSelect(index); }}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${customer.firstName} ${customer.lastName}`}
                  />
                </td>
                <td style={{ ...styles.td, position: 'sticky', left: 36, backgroundColor: colors.bgSurface, zIndex: 1, borderRight: `1px solid ${colors.borderLight}` }}>
                  <div style={styles.nameCell}>
                    <div style={styles.avatar}>{customer.firstName[0]}{customer.lastName[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: colors.textPrimary }}>{customer.firstName} {customer.lastName}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: colors.textMuted }}>{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ ...styles.td, color: colors.textMuted, fontFamily: 'monospace', fontSize: 'var(--text-xs)' }}>{customer.id}</td>
                <td style={styles.td}><span style={styles.badge(sc.bg, sc.color)}>{customer.status}</span></td>
                <td style={styles.td}><span style={styles.badge(sg.bg, sg.color)}>{customer.segment}</span></td>
                <td style={{ ...styles.td, color: colors.textSecondary }}>{customer.region}</td>
                <td style={{ ...styles.td, color: colors.textSecondary }}>{customer.subscriptions.length} plan{customer.subscriptions.length !== 1 ? 's' : ''}</td>
                <td style={{ ...styles.td, fontWeight: 600, color: colors.textPrimary }}>{monthlySpend}</td>
                <td style={{ ...styles.td, color: colors.textSecondary }}>{customer.accountDetails.loyaltyPoints.toLocaleString()}</td>
                <td style={{ ...styles.td, color: colors.textSecondary }}>{customer.devices.length}</td>
                <td style={{ ...styles.td, color: colors.textMuted }}>{customer.joinDate}</td>
                <td style={{ ...styles.td, color: colors.textMuted }}>{customer.lastActivity}</td>
              </tr>
            );
          })}
          {filtered.length === 0 && (
            <tr><td colSpan={12} style={{ ...styles.td, textAlign: 'center', padding: 40, color: colors.textMuted }}>No customers found for the selected filters</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={styles.root}>
      <div style={styles.headerRow}>
        <div style={styles.headerLeft}>
          <h1 style={styles.heading}>Customers</h1>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
        <button style={styles.addBtn} onClick={() => history.push('/customers/add')}>
          <AddIcon style={{ fontSize: 18 }} /> Add Customer
        </button>
      </div>
      <p style={styles.subtitle}>
        Manage and view all customer accounts — subscriptions, payments, and engagement insights.
      </p>

      <CustomerVoiceInputBar />
      <AIInsightsCards />
      <CustomerFilterBar activeFilters={activeFilters} onRemoveFilter={handleRemoveFilter} onAddFilter={handleAddFilter} />

      {filtered.length === 0 ? (
        <div style={styles.emptyState}>No customers found for the selected filters</div>
      ) : view === 'card' ? renderCardView() : renderListView()}
    </div>
  );
};

export default CustomerListPage;
