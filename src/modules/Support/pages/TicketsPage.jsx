import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useThemeContext } from '../../../styles/ThemeContext';
import { useBU } from '../../BusinessUnit/store/buContext';
import { rgba } from '../../../styles/utils';

const mockTickets = [
  { id: 'RVT435', title: 'Playback not working – stuck on black screen', status: 'In-Progress', priority: 'High', category: 'Service Ticket', domain: 'Video', business: 'OTT-POC', created: '12/09/2025 8:10:00', sla: '40m', assignee: 'Support Team', customer: 'Srikanth', phone: '+91 838389333', email: 'srikanth@gmail.com' },
  { id: 'RVT436', title: 'Unable to login after password reset', status: 'Open', priority: 'Critical', category: 'Technical', domain: 'Authentication', business: 'OTT-POC', created: '12/09/2025 9:22:00', sla: '15m', assignee: 'Tech Team', customer: 'Sarah Johnson', phone: '+1 555-123-4567', email: 'sarah.j@email.com' },
  { id: 'RVT437', title: 'Billing discrepancy – double charged', status: 'Open', priority: 'High', category: 'Billing', domain: 'Payments', business: 'OTT-POC', created: '12/09/2025 10:05:00', sla: '1h', assignee: 'Billing Team', customer: 'Michael Chen', phone: '+1 555-987-6543', email: 'michael.c@corp.com' },
  { id: 'RVT438', title: 'Content not available in region', status: 'Resolved', priority: 'Medium', category: 'Content', domain: 'Streaming', business: 'OTT-POC', created: '11/09/2025 14:30:00', sla: '2h', assignee: 'Content Team', customer: 'Emma Wilson', phone: '+44 20 7946-0958', email: 'emma.w@gmail.com' },
  { id: 'RVT439', title: 'Subscription upgrade not reflecting', status: 'In-Progress', priority: 'Medium', category: 'Account', domain: 'Subscription', business: 'OTT-POC', created: '11/09/2025 16:45:00', sla: '3h', assignee: 'Account Team', customer: 'Alex Rivera', phone: '+1 555-246-8135', email: 'alex.r@email.com' },
  { id: 'RVT440', title: 'App crashes on launch – iOS 18', status: 'Open', priority: 'Critical', category: 'Technical', domain: 'Mobile App', business: 'OTT-POC', created: '12/09/2025 11:00:00', sla: '30m', assignee: 'Mobile Team', customer: 'David Park', phone: '+82 10-1234-5678', email: 'david.p@email.com' },
];

const priorityColors = { Critical: '#ef4444', High: '#f59e0b', Medium: '#3b82f6', Low: '#6b7280' };
const statusColors = { Open: '#ef4444', 'In-Progress': '#f59e0b', Resolved: '#10b981', Closed: '#6b7280' };

const TicketsPage = () => {
  const { colors, fonts } = useThemeContext();
  const { activeBU } = useBU();
  const history = useHistory();
  const [filter, setFilter] = useState('all');

  useEffect(() => { document.title = 'EV Phase - Tickets'; }, []);

  const filtered = filter === 'all' ? mockTickets : mockTickets.filter((t) => t.status.toLowerCase().replace('-', '') === filter);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 className="page-title">Tickets</h1>
        <button style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight:'var(--weight-bold)', cursor: 'pointer' }}>New Ticket</button>
      </div>
      <p className="page-subtitle">Support tickets and issue tracking — {activeBU.name}</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'open', 'inprogress', 'resolved'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: filter === f ? 'none' : `1px solid ${colors.borderLight}`, background: filter === f ? 'var(--button-gradient)' : 'transparent', color: filter === f ? '#fff' : colors.textMuted, fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize' }}>
            {f === 'inprogress' ? 'In Progress' : f}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((ticket) => (
          <div key={ticket.id} onClick={() => history.push(`/support/tickets/${ticket.id}`)} style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '16px 20px', cursor: 'pointer', transition: 'all 0.2s', borderLeft: `4px solid ${priorityColors[ticket.priority]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-md)', fontWeight: 600, color: colors.textPrimary, marginBottom: 4 }}>{ticket.title}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.accentPrimary }}>#{ticket.id}</span>
                  <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>•</span>
                  <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{ticket.customer}</span>
                  <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>•</span>
                  <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{ticket.category}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 'var(--text-xs)', padding: '3px 10px', borderRadius: 12, backgroundColor: rgba(statusColors[ticket.status], 0.1), color: statusColors[ticket.status], fontFamily: fonts.body, fontWeight: 600 }}>{ticket.status}</span>
                <span style={{ fontSize: 'var(--text-xs)', padding: '3px 10px', borderRadius: 12, backgroundColor: rgba(priorityColors[ticket.priority], 0.1), color: priorityColors[ticket.priority], fontFamily: fonts.body, fontWeight: 600 }}>{ticket.priority}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>
              <span>📅 {ticket.created}</span>
              <span>⏱ SLA: {ticket.sla}</span>
              <span>👤 {ticket.assignee}</span>
              <span>🏢 {ticket.domain}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketsPage;
