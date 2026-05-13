import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ForumIcon from '@material-ui/icons/Forum';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import TuneIcon from '@material-ui/icons/Tune';
import SecurityIcon from '@material-ui/icons/Security';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useThemeContext } from '../../../styles/ThemeContext';
import { mockCustomers } from '../store/mockData';

// Dark left nav config with expandable sections
const navItems = [
  { id: 'overview', label: 'Summary', icon: 'schedule' },
  { id: 'interactions', label: 'Interactions', icon: 'forum' },
  { id: 'customer-management', label: 'Customer Management', icon: 'people', expandable: true, children: ['History', 'Profiles', 'Account Status', 'Addresses', 'Payment Methods', 'Contract Thresholds', 'Parent Child Details'] },
  { id: 'order-management', label: 'Order Management', icon: 'assignment', expandable: true, children: ['Products/ Packages', 'Orders', 'Coupons', 'Service History', 'Devices', 'Referrals', 'Equipment', 'Suspension History', 'Shipment Devices', 'Installment Details'] },
  { id: 'billing-finance', label: 'Billing and Finance', icon: 'account_balance', expandable: true, children: ['Wallet', 'Running Balance', 'Invoices', 'Payments', 'Adjustments', 'Refunds'] },
  { id: 'credits', label: 'Credits', icon: 'credit_card' },
  { id: 'support', label: 'Tickets', icon: 'ticket' },
  { id: 'advanced', label: 'Advanced Attributes', icon: 'tune' },
  { id: 'security', label: 'Security Q&A', icon: 'security' },
  { id: 'external', label: 'External Info', icon: 'open_in_new', expandable: true, children: ['API Logs', 'Third Party Data'] },
  { id: 'workflows', label: 'Workflows', icon: 'account_tree' },
];

const getIcon = (icon, size = 20) => {
  const p = { style: { fontSize: size } };
  switch (icon) {
    case 'schedule': return <ScheduleIcon {...p} />;
    case 'forum': return <ForumIcon {...p} />;
    case 'people': return <PeopleIcon {...p} />;
    case 'assignment': return <AssignmentTurnedInIcon {...p} />;
    case 'account_balance': return <AccountBalanceIcon {...p} />;
    case 'credit_card': return <CreditCardIcon {...p} />;
    case 'ticket': return <ConfirmationNumberIcon {...p} />;
    case 'tune': return <TuneIcon {...p} />;
    case 'security': return <SecurityIcon {...p} />;
    case 'open_in_new': return <OpenInNewIcon {...p} />;
    case 'account_tree': return <AccountTreeIcon {...p} />;
    default: return <ScheduleIcon {...p} />;
  }
};

const statusBadge = (status) => {
  const map = {
    'In Progress': { bg: 'rgba(59,130,246,0.12)', color: '#2563eb' },
    'Pending': { bg: 'rgba(245,158,11,0.12)', color: '#d97706' },
    'Open': { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
    'Completed': { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
    'Resolved': { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
    'Ongoing': { bg: 'rgba(245,158,11,0.12)', color: '#d97706' },
    'Overdue': { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
    'Clear': { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
    'Installed': { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
    'Suspended': { bg: 'rgba(245,158,11,0.12)', color: '#d97706' },
    'Inactive': { bg: 'rgba(100,116,139,0.12)', color: '#64748b' },
    'Active': { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
    'Paid': { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
    'Failed': { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
  };
  return map[status] || { bg: 'rgba(100,116,139,0.08)', color: '#64748b' };
};

const CustomerDetailPage = () => {
  const { colors, fonts, shadows } = useThemeContext();
  const { id } = useParams();
  const history = useHistory();
  const [activeNav, setActiveNav] = useState('overview');
  const [expandedNavs, setExpandedNavs] = useState({});
  const [openTabs, setOpenTabs] = useState([id]);
  const [activeTab, setActiveTab] = useState(id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Responsive breakpoints
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isSmallScreen = isMobile || isTablet;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When URL id changes, add to tabs if not already open
  useEffect(() => {
    if (id && !openTabs.includes(id)) {
      setOpenTabs((prev) => [...prev, id]);
    }
    setActiveTab(id);
  }, [id]);

  const customer = mockCustomers.find((c) => c.id === activeTab);

  const handleCloseTab = (tabId, e) => {
    e.stopPropagation();
    const remaining = openTabs.filter((t) => t !== tabId);
    if (remaining.length === 0) {
      history.push('/customers/view');
      return;
    }
    setOpenTabs(remaining);
    if (activeTab === tabId) {
      const newActive = remaining[remaining.length - 1];
      setActiveTab(newActive);
      history.push(`/customers/${newActive}`);
    }
  };

  const handleSwitchTab = (tabId) => {
    setActiveTab(tabId);
    history.push(`/customers/${tabId}`);
  };

  if (!customer && openTabs.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: colors.textMuted, fontFamily: fonts.body }}>
        No customer selected.{' '}
        <button onClick={() => history.push('/customers/view')} style={{ color: colors.accentPrimary, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Go to list</button>
      </div>
    );
  }

  // Shared styles
  const bdg = (status) => { const c = statusBadge(status); return { display: 'inline-block', padding: '2px 8px', borderRadius: 10, fontSize: 'var(--text-xs)', fontWeight: 500, backgroundColor: c.bg, color: c.color }; };
  const fl = { fontSize: 'var(--text-xs)', color: colors.textMuted, fontFamily: fonts.body, marginBottom: 2 };
  const fv = { fontSize: 'var(--text-sm)', color: colors.textPrimary, fontFamily: fonts.body, fontWeight: 500 };
  const fr = { marginBottom: 12 };
  const cardBase = { backgroundColor: colors.bgSurface, borderRadius: 10, padding: '20px 24px', border: `1px solid ${colors.borderLight}`, boxShadow: shadows.sm, marginBottom: 20 };
  const sectionTitle = { fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textMuted, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' };
  const tagStyle = (bg) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: '10px', fontWeight: 600, backgroundColor: bg, color: '#fff', marginRight: 4, marginTop: 4 });

  // Table styles (like Product list page)
  const tableWrap = { overflowX: 'auto', borderRadius: 10, border: `1px solid ${colors.borderLight}`, backgroundColor: colors.bgSurface, boxShadow: shadows.sm };
  const table = { width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: fonts.body, fontSize: 'var(--text-sm)' };
  const th = { padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: 'var(--text-xs)', color: colors.textMuted, borderBottom: `1px solid ${colors.borderLight}`, backgroundColor: colors.bgPrimary, whiteSpace: 'nowrap' };
  const td = { padding: '14px 14px', borderBottom: `1px solid ${colors.borderLight}`, verticalAlign: 'middle' };

  // ===== OVERVIEW — Complete 360 information =====
  const renderOverview = () => (
    <>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Balance', value: customer.billing.currentBalance },
          { label: 'Plans', value: customer.subscriptions.filter(s => s.status === 'Active').length },
          { label: 'Equipments', value: customer.equipments.length },
          { label: 'Payments', value: customer.payments.length },
          { label: 'Tickets', value: customer.troubleTickets.length },
        ].map((s, i) => (
          <div key={i} style={{ ...cardBase, marginBottom: 0, padding: '14px 18px' }}>
            <div style={fl}>{s.label}</div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Personal + Account */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={cardBase}>
          <div style={sectionTitle}>Personal Details</div>
          <div style={fr}><div style={fl}>Full Name</div><div style={fv}>{customer.firstName} {customer.lastName}</div></div>
          <div style={fr}><div style={fl}>Email</div><div style={fv}>{customer.email}</div></div>
          <div style={fr}><div style={fl}>Phone</div><div style={fv}>{customer.phone}</div></div>
          <div style={fr}><div style={fl}>Mobile</div><div style={fv}>{customer.mobileNumber}</div></div>
          <div style={fr}><div style={fl}>Identity</div><div style={fv}>{customer.identityType}: {customer.identityValue}</div></div>
          <div style={fr}><div style={fl}>Address</div><div style={fv}>{customer.addresses.serviceAddress}</div></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            {customer.addresses.serviceableInfo.map((t, i) => <span key={i} style={tagStyle(i === 0 ? '#2563eb' : i === 1 ? colors.accentPrimary : '#374151')}>{t}</span>)}
          </div>
        </div>
        <div style={cardBase}>
          <div style={sectionTitle}>Account Details</div>
          <div style={fr}><div style={fl}>Account Number</div><div style={{ ...fv, fontFamily: 'monospace' }}>{customer.accountNumber}</div></div>
          <div style={fr}><div style={fl}>Account Type</div><div style={fv}>{customer.accountDetails.accountType}</div></div>
          <div style={fr}><div style={fl}>Sub Type</div><div style={fv}>{customer.accountDetails.accountSubType}</div></div>
          <div style={fr}><div style={fl}>Credit Class</div><div style={fv}>{customer.accountDetails.creditClass}</div></div>
          <div style={fr}><div style={fl}>Tier</div><div style={fv}>{customer.accountDetails.tier}</div></div>
          <div style={fr}><div style={fl}>Loyalty Points</div><div style={{ ...fv, fontWeight: 700, color: colors.accentPrimary }}>{customer.accountDetails.loyaltyPoints.toLocaleString()}</div></div>
          <div style={fr}><div style={fl}>Referral Code</div><div style={{ ...fv, fontFamily: 'monospace' }}>{customer.accountDetails.referralCode}</div></div>
          <div style={fr}><div style={fl}>2FA</div><div style={fv}>{customer.accountDetails.twoFactor ? '✓ Enabled' : '✗ Disabled'}</div></div>
        </div>
        <div style={cardBase}>
          <div style={sectionTitle}>Billing & Finance</div>
          <div style={fr}><div style={fl}>Billing Cycle</div><div style={fv}>{customer.billing.billingCycle}</div></div>
          <div style={fr}><div style={fl}>Billing Mode</div><div style={fv}>{customer.billing.billingMode}</div></div>
          <div style={fr}><div style={fl}>Current Balance</div><div style={{ ...fv, fontWeight: 700 }}>{customer.billing.currentBalance}</div></div>
          <div style={fr}><div style={fl}>Last Payment</div><div style={fv}>{customer.billing.lastPaymentAmount} on {customer.billing.lastPaymentDate}</div></div>
          <div style={fr}><div style={fl}>Due Date</div><div style={fv}>{customer.billing.paymentDueDate}</div></div>
          <div style={fr}><div style={fl}>Next Bill</div><div style={fv}>{customer.billing.nextBillDate}</div></div>
          <div style={fr}><div style={fl}>Ageing</div><div style={fv}>{customer.billing.ageing.days} Days — <span style={bdg(customer.billing.ageing.status)}>{customer.billing.ageing.status}</span></div></div>
          <div style={fr}><div style={fl}>Collection Policy</div><div style={fv}>{customer.collectionRules.appliedPolicy}</div></div>
        </div>
      </div>

      {/* Payment Methods + Equipments */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: 20, marginBottom: 20 }}>
        <div style={cardBase}>
          <div style={sectionTitle}>Payment Methods</div>
          {customer.paymentMethods.map((pm, i) => (
            <div key={i} style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.borderLight}`, backgroundColor: colors.bgPrimary, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ ...fv, fontWeight: 600 }}>{pm.brand}</span><span style={{ fontSize: '10px', color: colors.textMuted }}>{pm.expiry}</span></div>
              <div style={{ fontSize: 'var(--text-xs)', color: colors.textSecondary, marginTop: 2 }}>{pm.name}</div>
              <div style={{ fontSize: '10px', color: colors.textMuted, fontFamily: 'monospace', marginTop: 2 }}>{pm.number}</div>
            </div>
          ))}
        </div>
        <div style={cardBase}>
          <div style={sectionTitle}>Equipments</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {customer.equipments.map((eq, i) => (
              <div key={i} style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${colors.borderLight}`, backgroundColor: colors.bgPrimary, borderTop: `3px solid ${eq.status === 'Installed' ? '#16a34a' : '#d97706'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', fontWeight: 700 }}>{eq.smcNumber}</span><span style={bdg(eq.status)}>{eq.status}</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <div><div style={fl}>Plan</div><div style={{ ...fv, fontWeight: 600 }}>{eq.primaryPlan}</div></div>
                  <div><div style={fl}>Charges</div><div style={{ ...fv, color: colors.accentPrimary, fontWeight: 700 }}>{eq.recurringCharges}</div></div>
                  <div><div style={fl}>Device</div><div style={fv}>{eq.deviceType}</div></div>
                  <div><div style={fl}>ISP</div><div style={fv}>{eq.isp}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscriptions table */}
      <div style={{ ...cardBase }}>
        <div style={sectionTitle}>Subscriptions</div>
        <div style={tableWrap}>
          <table style={table}><thead><tr>
            <th style={th}>Plan</th><th style={th}>Status</th><th style={th}>Price</th><th style={th}>Start Date</th><th style={th}>Renewal</th><th style={th}>ID</th>
          </tr></thead><tbody>
            {customer.subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td style={{ ...td, fontWeight: 600, color: colors.textPrimary }}>{sub.plan}</td>
                <td style={td}><span style={bdg(sub.status)}>{sub.status}</span></td>
                <td style={td}>{sub.price}</td><td style={{ ...td, color: colors.textMuted }}>{sub.startDate}</td>
                <td style={{ ...td, color: colors.textMuted }}>{sub.renewalDate}</td>
                <td style={{ ...td, fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: colors.textMuted }}>{sub.id}</td>
              </tr>
            ))}
          </tbody></table>
        </div>
      </div>

      {/* Interactions + Tickets + Service Requests */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr', gap: 20 }}>
        <div style={cardBase}>
          <div style={sectionTitle}>Interactions</div>
          {customer.interactions.map((item, i) => (
            <div key={i} style={{ padding: '8px 10px', borderRadius: 6, border: `1px solid ${colors.borderLight}`, marginBottom: 6, backgroundColor: colors.bgPrimary }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>{item.title}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: colors.textMuted, marginTop: 2 }}>{item.createdOn}</div>
            </div>
          ))}
        </div>
        <div style={cardBase}>
          <div style={sectionTitle}>Service Requests</div>
          {customer.serviceRequests.map((sr, i) => (
            <div key={i} style={{ padding: '8px 10px', borderRadius: 6, border: `1px solid ${colors.borderLight}`, marginBottom: 6, backgroundColor: colors.bgPrimary }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>{sr.title}</span><span style={bdg(sr.status)}>{sr.status}</span></div>
              <div style={{ fontSize: 'var(--text-xs)', color: colors.textMuted, marginTop: 2 }}>{sr.id} · {sr.createdOn}</div>
            </div>
          ))}
        </div>
        <div style={cardBase}>
          <div style={sectionTitle}>Trouble Tickets</div>
          {customer.troubleTickets.map((tt, i) => (
            <div key={i} style={{ padding: '8px 10px', borderRadius: 6, border: `1px solid ${colors.borderLight}`, marginBottom: 6, backgroundColor: colors.bgPrimary }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>{tt.title}</span><span style={bdg(tt.status)}>{tt.status}</span></div>
              <div style={{ fontSize: 'var(--text-xs)', color: colors.textMuted, marginTop: 2 }}>{tt.id} · {tt.createdOn}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // ===== CUSTOMER MANAGEMENT — List view =====
  const renderCustomerManagement = () => {
    const rows = [
      { type: 'Profile', name: `${customer.firstName} ${customer.lastName}`, detail: customer.email, status: customer.status, date: customer.joinDate },
      { type: 'Account', name: customer.accountId, detail: `${customer.accountDetails.accountType} / ${customer.accountDetails.accountSubType}`, status: 'Active', date: customer.joinDate },
      { type: 'Address', name: 'Service Address', detail: customer.addresses.serviceAddress, status: 'Active', date: '—' },
      ...customer.paymentMethods.map((pm) => ({ type: 'Payment Method', name: pm.brand, detail: pm.number, status: 'Active', date: pm.expiry })),
    ];
    return (
      <div>
        <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-xl)', fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>Customer Management</div>
        <div style={{ fontSize: 'var(--text-sm)', color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 20 }}>Profiles, account status, addresses, and payment methods.</div>
        <div style={tableWrap}>
          <table style={table}>
            <thead><tr>
              <th style={th}>Type</th><th style={th}>Name / ID</th><th style={th}>Details</th><th style={th}>Status</th><th style={th}>Date</th>
            </tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(78,205,196,0.04)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ ...td, fontWeight: 600, color: colors.textPrimary }}>{row.type}</td>
                  <td style={{ ...td, fontWeight: 500, color: colors.textPrimary }}>{row.name}</td>
                  <td style={{ ...td, color: colors.textSecondary, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.detail}</td>
                  <td style={td}><span style={bdg(row.status)}>{row.status}</span></td>
                  <td style={{ ...td, color: colors.textMuted }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ===== ORDER MANAGEMENT — List view =====
  const renderOrderManagement = () => {
    const rows = [
      ...customer.subscriptions.map((sub) => ({ type: 'Subscription', name: sub.plan, detail: sub.price, status: sub.status, date: sub.startDate, id: sub.id })),
      ...customer.equipments.map((eq) => ({ type: 'Equipment', name: eq.primaryPlan, detail: `${eq.deviceType} — ${eq.smcNumber}`, status: eq.status, date: eq.activationDate, id: eq.smcNumber })),
      ...customer.devices.map((dev) => ({ type: 'Device', name: dev.name, detail: `${dev.type} — ${dev.os}`, status: dev.status, date: dev.lastUsed, id: dev.id })),
    ];
    return (
      <div>
        <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-xl)', fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>Order Management</div>
        <div style={{ fontSize: 'var(--text-sm)', color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 20 }}>Products, packages, equipment, devices, and service history.</div>
        <div style={tableWrap}>
          <table style={table}>
            <thead><tr>
              <th style={th}>Type</th><th style={th}>Name</th><th style={th}>Details</th><th style={th}>Status</th><th style={th}>Date</th><th style={th}>ID</th>
            </tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(78,205,196,0.04)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ ...td, fontWeight: 600, color: colors.textPrimary }}>{row.type}</td>
                  <td style={{ ...td, fontWeight: 500, color: colors.textPrimary }}>{row.name}</td>
                  <td style={{ ...td, color: colors.textSecondary }}>{row.detail}</td>
                  <td style={td}><span style={bdg(row.status)}>{row.status}</span></td>
                  <td style={{ ...td, color: colors.textMuted }}>{row.date}</td>
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: colors.textMuted }}>{row.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ===== BILLING AND FINANCE — List view =====
  const renderBillingFinance = () => {
    const rows = [
      ...customer.payments.map((pay) => ({ type: 'Payment', name: pay.amount, detail: pay.method, status: pay.status, date: pay.date, id: pay.id })),
      ...customer.invoices.map((inv) => ({ type: 'Invoice', name: inv.amount, detail: `Due: ${inv.dueDate}`, status: inv.status, date: inv.date, id: inv.id })),
      { type: 'Collection', name: customer.collectionRules.appliedPolicy, detail: customer.collectionRules.activityObject, status: customer.collectionRules.status, date: customer.collectionRules.executionDateTime, id: '—' },
    ];
    return (
      <div>
        <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-xl)', fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>Billing and Finance</div>
        <div style={{ fontSize: 'var(--text-sm)', color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 20 }}>Payments, invoices, adjustments, and collection rules.</div>
        <div style={tableWrap}>
          <table style={table}>
            <thead><tr>
              <th style={th}>Type</th><th style={th}>Amount / Policy</th><th style={th}>Details</th><th style={th}>Status</th><th style={th}>Date</th><th style={th}>ID</th>
            </tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(78,205,196,0.04)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ ...td, fontWeight: 600, color: colors.textPrimary }}>{row.type}</td>
                  <td style={{ ...td, fontWeight: 600, color: colors.textPrimary }}>{row.name}</td>
                  <td style={{ ...td, color: colors.textSecondary }}>{row.detail}</td>
                  <td style={td}><span style={bdg(row.status)}>{row.status}</span></td>
                  <td style={{ ...td, color: colors.textMuted }}>{row.date}</td>
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: colors.textMuted }}>{row.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ===== SUPPORT — List view =====
  const renderSupport = () => {
    const rows = [
      ...customer.interactions.map((item) => ({ type: 'Interaction', name: item.title, detail: '—', status: '—', date: item.createdOn, id: '—' })),
      ...customer.serviceRequests.map((sr) => ({ type: 'Service Request', name: sr.title, detail: sr.id, status: sr.status, date: sr.createdOn, id: sr.id })),
      ...customer.troubleTickets.map((tt) => ({ type: 'Trouble Ticket', name: tt.title, detail: tt.id, status: tt.status, date: tt.createdOn, id: tt.id })),
    ];
    return (
      <div>
        <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-xl)', fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>Support</div>
        <div style={{ fontSize: 'var(--text-sm)', color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 20 }}>Interactions, service requests, and trouble tickets.</div>
        <div style={tableWrap}>
          <table style={table}>
            <thead><tr>
              <th style={th}>Type</th><th style={th}>Title</th><th style={th}>Reference</th><th style={th}>Status</th><th style={th}>Created On</th>
            </tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(78,205,196,0.04)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ ...td, fontWeight: 600, color: colors.textPrimary }}>{row.type}</td>
                  <td style={{ ...td, fontWeight: 500, color: colors.textPrimary }}>{row.name}</td>
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: colors.textMuted }}>{row.detail}</td>
                  <td style={td}>{row.status !== '—' ? <span style={bdg(row.status)}>{row.status}</span> : <span style={{ color: colors.textMuted }}>—</span>}</td>
                  <td style={{ ...td, color: colors.textMuted }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const contentMap = {
    'overview': renderOverview,
    'interactions': renderSupport,
    'customer-management': renderCustomerManagement,
    'order-management': renderOrderManagement,
    'billing-finance': renderBillingFinance,
    'credits': () => <div style={{ ...cardBase, textAlign: 'center', padding: 60 }}><div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: colors.textMuted, fontFamily: fonts.heading }}>Credits</div><div style={{ fontSize: 'var(--text-sm)', color: colors.textMuted, marginTop: 8 }}>This section will be available soon</div></div>,
    'support': renderSupport,
    'advanced': () => <div style={{ ...cardBase, textAlign: 'center', padding: 60 }}><div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: colors.textMuted, fontFamily: fonts.heading }}>Advanced Attributes</div><div style={{ fontSize: 'var(--text-sm)', color: colors.textMuted, marginTop: 8 }}>This section will be available soon</div></div>,
    'security': () => <div style={{ ...cardBase, textAlign: 'center', padding: 60 }}><div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: colors.textMuted, fontFamily: fonts.heading }}>Security Q&A</div><div style={{ fontSize: 'var(--text-sm)', color: colors.textMuted, marginTop: 8 }}>This section will be available soon</div></div>,
    'external': () => <div style={{ ...cardBase, textAlign: 'center', padding: 60 }}><div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: colors.textMuted, fontFamily: fonts.heading }}>External Info</div><div style={{ fontSize: 'var(--text-sm)', color: colors.textMuted, marginTop: 8 }}>This section will be available soon</div></div>,
    'workflows': () => <div style={{ ...cardBase, textAlign: 'center', padding: 60 }}><div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: colors.textMuted, fontFamily: fonts.heading }}>Workflows</div><div style={{ fontSize: 'var(--text-sm)', color: colors.textMuted, marginTop: 8 }}>This section will be available soon</div></div>,
  };

  const renderContent = () => {
    const renderer = contentMap[activeNav];
    return renderer ? renderer() : renderOverview();
  };

  // ===== LEFT NAVIGATION (dark, expandable, cyan active) =====
  const toggleExpand = (navId) => setExpandedNavs((prev) => ({ ...prev, [navId]: !prev[navId] }));

  const renderNav = () => (
    <nav style={{ width: 240, flexShrink: 0, backgroundColor: colors.bgDark, borderRadius: 12, padding: '8px 0', overflowY: 'auto', maxHeight: 'calc(100vh - 180px)', position: 'sticky', top: 20, border: `1px solid ${colors.borderDark}` }}>
      {navItems.map((item) => {
        const isActive = activeNav === item.id;
        const isExpanded = expandedNavs[item.id];
        return (
          <div key={item.id}>
            <button
              onClick={() => { setActiveNav(item.id); if (item.expandable) toggleExpand(item.id); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                padding: '12px 18px', border: 'none', cursor: 'pointer',
                backgroundColor: isActive ? '#00bcd4' : 'transparent',
                color: isActive ? '#fff' : colors.textOnDark,
                fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: isActive ? 600 : 400,
                textAlign: 'left', transition: 'all 0.15s', borderRadius: 0,
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{getIcon(item.icon, 20)}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.expandable && (isExpanded ? <ExpandLessIcon style={{ fontSize: 16 }} /> : <ExpandMoreIcon style={{ fontSize: 16 }} />)}
            </button>
            {item.expandable && isExpanded && item.children && (
              <div style={{ paddingLeft: 28, borderLeft: '2px solid #00bcd4', marginLeft: 28 }}>
                {item.children.map((child, ci) => (
                  <button
                    key={ci}
                    onClick={() => setActiveNav(item.id)}
                    style={{
                      display: 'block', width: '100%', padding: '8px 14px',
                      border: 'none', cursor: 'pointer', backgroundColor: 'transparent',
                      color: colors.mutedTan || 'rgba(255,255,255,0.65)', fontFamily: fonts.body,
                      fontSize: 'var(--text-xs)', textAlign: 'left', transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = colors.mutedTan || 'rgba(255,255,255,0.65)'}
                  >
                    {child}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div style={{ width: '100%' }}>
      {/* Customer Tabs — browser-style tab bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: isMobile ? 10 : 16, borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: 0, flexWrap: 'wrap' }}>
        {openTabs.map((tabId) => {
          const tabCustomer = mockCustomers.find((c) => c.id === tabId);
          const isActive = activeTab === tabId;
          return (
            <div
              key={tabId}
              onClick={() => handleSwitchTab(tabId)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                cursor: 'pointer', borderRadius: '8px 8px 0 0', marginRight: 2,
                backgroundColor: isActive ? colors.bgSurface : 'transparent',
                borderBottom: isActive ? `2px solid ${colors.accentPrimary}` : '2px solid transparent',
                border: isActive ? `1px solid ${colors.borderLight}` : '1px solid transparent',
                borderBottomColor: isActive ? colors.bgSurface : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isActive ? colors.accentPrimary : colors.borderLight, color: isActive ? '#fff' : colors.textMuted, fontSize: '10px', fontWeight: 700 }}>
                {tabCustomer ? `${tabCustomer.firstName[0]}${tabCustomer.lastName[0]}` : '?'}
              </div>
              <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: isActive ? 600 : 400, color: isActive ? colors.textPrimary : colors.textMuted, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {tabCustomer ? `${tabCustomer.firstName} ${tabCustomer.lastName}` : tabId}
              </span>
              <button
                onClick={(e) => handleCloseTab(tabId, e)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, padding: 0, display: 'flex', borderRadius: 4 }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}
              >
                <CloseIcon style={{ fontSize: 14 }} />
              </button>
            </div>
          );
        })}
        {/* Open search popover button */}
        <div style={{ position: 'relative', marginLeft: 4, zIndex: 1001 }}>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', background: 'none', border: `1px dashed ${searchOpen ? colors.accentPrimary : colors.borderLight}`, borderRadius: '8px 8px 0 0', cursor: 'pointer', color: searchOpen ? colors.accentPrimary : colors.textMuted, fontFamily: fonts.body, fontSize: 'var(--text-xs)', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accentPrimary; e.currentTarget.style.color = colors.accentPrimary; }}
            onMouseLeave={(e) => { if (!searchOpen) { e.currentTarget.style.borderColor = colors.borderLight; e.currentTarget.style.color = colors.textMuted; } }}
          >
            <AddIcon style={{ fontSize: 14 }} /> Open
          </button>

          {/* Search Popover */}
          {searchOpen && (
            <>
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, width: 340, backgroundColor: colors.bgSurface, borderRadius: 12, border: `1px solid ${colors.borderLight}`, boxShadow: '0 12px 40px rgba(0,0,0,0.15)', zIndex: 1001, overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.borderLight}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>✦</div>
                  <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>Find Customer</span>
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, fontSize: 'var(--text-sm)' }}>✕</button>
                </div>
                {/* Search input */}
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.borderLight}` }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or ID..."
                    autoFocus
                    style={{ width: '100%', border: `1px solid ${colors.borderLight}`, borderRadius: 8, padding: '8px 12px', fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary, backgroundColor: colors.bgPrimary, outline: 'none' }}
                  />
                </div>
                {/* Results */}
                <div style={{ maxHeight: 240, overflowY: 'auto', padding: '6px 0' }}>
                  {mockCustomers
                    .filter((c) => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return `${c.firstName} ${c.lastName} ${c.email} ${c.id}`.toLowerCase().includes(q);
                    })
                    .filter((c) => !openTabs.includes(c.id))
                    .map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setOpenTabs((prev) => [...prev, c.id]);
                          setActiveTab(c.id);
                          setSearchOpen(false);
                          setSearchQuery('');
                          history.push(`/customers/${c.id}`);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', textAlign: 'left', transition: 'background 0.1s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.accentPrimary}08`}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(78,205,196,0.15)', color: colors.accentSecondary, fontWeight: 600, fontSize: '11px' }}>{c.firstName[0]}{c.lastName[0]}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{c.firstName} {c.lastName}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: colors.textMuted, fontFamily: fonts.body }}>{c.email} · {c.id}</div>
                        </div>
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: 8, backgroundColor: c.status === 'Active' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: c.status === 'Active' ? '#16a34a' : '#d97706' }}>{c.status}</span>
                      </button>
                    ))}
                  {mockCustomers.filter((c) => !openTabs.includes(c.id)).length === 0 && (
                    <div style={{ padding: '16px', textAlign: 'center', fontSize: 'var(--text-xs)', color: colors.textMuted, fontFamily: fonts.body }}>All customers are already open</div>
                  )}
                </div>
                {/* Footer */}
                <div style={{ padding: '10px 16px', borderTop: `1px solid ${colors.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: colors.textMuted, fontFamily: fonts.body }}>AI-powered search</span>
                  <button onClick={() => { setSearchOpen(false); history.push('/customers/view'); }} style={{ fontSize: 'var(--text-xs)', color: colors.accentPrimary, background: 'none', border: 'none', cursor: 'pointer', fontFamily: fonts.body, fontWeight: 600 }}>View All →</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Header */}
      {customer && (
        <>
          {/* Responsive header — compact on mobile */}
          <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 16, padding: isMobile ? '12px 16px' : '14px 24px', backgroundColor: colors.bgSurface, borderRadius: 12, marginBottom: isSmallScreen ? 12 : 20, border: `1px solid ${colors.borderLight}`, boxShadow: shadows.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: isMobile ? '100%' : 'auto' }}>
              <div style={{ width: isMobile ? 36 : 42, height: isMobile ? 36 : 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accentPrimary, color: '#fff', fontWeight: 700, fontSize: isMobile ? '11px' : 'var(--text-sm)', flexShrink: 0 }}>{customer.firstName[0]}{customer.lastName[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.heading, fontSize: isMobile ? 'var(--text-base)' : 'var(--text-lg)', fontWeight: 700, color: colors.textPrimary }}>{customer.firstName} {customer.lastName}</div>
                {isMobile && <div style={{ fontSize: 'var(--text-xs)', color: colors.textMuted }}>{customer.email}</div>}
              </div>
              <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: '10px', fontWeight: 700, backgroundColor: colors.accentPrimary, color: '#fff' }}>{customer.segment}</div>
            </div>
            {!isMobile && (
              <div style={{ display: 'grid', gridTemplateColumns: isTablet ? 'repeat(2, auto)' : 'repeat(4, auto)', gap: isTablet ? '4px 16px' : '0 20px', flex: 1, marginLeft: isTablet ? 0 : 16 }}>
                <div><div style={fl}>Account Number</div><div style={{ ...fv, fontWeight: 600 }}>{customer.accountNumber}</div></div>
                <div><div style={fl}>Email</div><div style={{ ...fv, fontWeight: 600 }}>{customer.email}</div></div>
                <div><div style={fl}>Identity Type</div><div style={{ ...fv, fontWeight: 600 }}>{customer.identityType}</div></div>
                <div><div style={fl}>Account Type</div><div style={{ ...fv, fontWeight: 600 }}>{customer.accountType}</div></div>
                {!isTablet && <div><div style={fl}>Home Number</div><div style={{ ...fv, fontWeight: 600 }}>{customer.homeNumber}</div></div>}
                {!isTablet && <div><div style={fl}>Work Phone</div><div style={{ ...fv, fontWeight: 600 }}>{customer.workPhone}</div></div>}
                {!isTablet && <div><div style={fl}>Mobile</div><div style={{ ...fv, fontWeight: 600 }}>{customer.mobileNumber}</div></div>}
                {!isTablet && <div><div style={fl}>Region</div><div style={{ ...fv, fontWeight: 600 }}>{customer.region}</div></div>}
              </div>
            )}
          </div>

          {/* Breadcrumb nav for mobile/tablet */}
          {isSmallScreen && (
            <div style={{ marginBottom: 16, position: 'relative' }}>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '10px 16px', backgroundColor: colors.bgDark, color: colors.textOnDark,
                  border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: fonts.body,
                  fontSize: 'var(--text-sm)', fontWeight: 500,
                }}
              >
                <span style={{ flex: 1, textAlign: 'left' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: colors.mutedTan }}>Section: </span>
                  {navItems.find((n) => n.id === activeNav)?.label || 'Summary'}
                </span>
                {mobileMenuOpen ? <ExpandLessIcon style={{ fontSize: 18 }} /> : <ExpandMoreIcon style={{ fontSize: 18 }} />}
              </button>
              {mobileMenuOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, backgroundColor: colors.bgDark, borderRadius: 10, border: `1px solid ${colors.borderDark}`, boxShadow: '0 12px 40px rgba(0,0,0,0.2)', zIndex: 100, maxHeight: 360, overflowY: 'auto', padding: '6px 0' }}>
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveNav(item.id); setMobileMenuOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '10px 16px', border: 'none', cursor: 'pointer',
                        backgroundColor: activeNav === item.id ? '#00bcd4' : 'transparent',
                        color: activeNav === item.id ? '#fff' : colors.textOnDark,
                        fontFamily: fonts.body, fontSize: 'var(--text-sm)',
                        fontWeight: activeNav === item.id ? 600 : 400, textAlign: 'left',
                      }}
                    >
                      <span style={{ opacity: activeNav === item.id ? 1 : 0.7 }}>{getIcon(item.icon, 18)}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
              {mobileMenuOpen && <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />}
            </div>
          )}

          {/* Nav + Content — hide nav on small screens */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            {!isSmallScreen && renderNav()}
            <div style={{ flex: 1, minWidth: 0 }}>
              {renderContent()}
            </div>
          </div>
        </>
      )}

      {!customer && (
        <div style={{ padding: 40, textAlign: 'center', color: colors.textMuted, fontFamily: fonts.body }}>
          Customer not found. Select a tab or open a new customer.
        </div>
      )}
    </div>
  );
};

export default CustomerDetailPage;
