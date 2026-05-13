import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useThemeContext } from '../../../styles/ThemeContext';
import { useBU } from '../../BusinessUnit/store/buContext';
import { rgba } from '../../../styles/utils';
import TicketVoiceInputBar from '../components/TicketVoiceInputBar/TicketVoiceInputBar';
import TicketFilterBar from '../components/TicketFilterBar/TicketFilterBar';
import AIInsightsCards from '../../../components/AIInsightsCards/AIInsightsCards';

const mockTickets = [
  { id: 'RVT435-10', title: 'Playback not working, stuck on black screen', status: 'In-Progress', priority: 'Critical', category: 'Trouble Ticket', domain: 'Video', business: 'OTT-POC', created: '05/03/2025', sla: '45m', assignee: 'Abishek', customer: 'Robert', customerId: '232323228383833', channel: 'Email' },
  { id: 'RVT435-10', title: 'Playback not working, stuck on black screen', status: 'In-Progress', priority: 'High', category: 'Trouble Ticket', domain: 'Authentication', business: 'OTT-POC', created: '05/03/2025', sla: '02:45m', assignee: 'Abishek', customer: 'Srikanth', customerId: '232323227371711', channel: 'CCB' },
  { id: 'RVT435-10', title: 'Playback not working, stuck on black screen', status: 'In-Progress', priority: 'High', category: 'Trouble Ticket', domain: 'Streaming', business: 'OTT-POC', created: '05/03/2025', sla: '02:45m', assignee: 'Abishek', customer: 'Williamson', customerId: '232323227371352', channel: 'Email' },
  { id: 'RVT435-10', title: 'Playback not working, stuck on black screen', status: 'Open', priority: 'Medium', category: 'Trouble Ticket', domain: 'Payments', business: 'OTT-POC', created: '05/03/2025', sla: '02:45m', assignee: '--', customer: 'Ameer Khan', customerId: '232323227370980', channel: 'Email' },
  { id: 'RVT435-10', title: 'Playback not working, stuck on black screen', status: 'Open', priority: 'Medium', category: 'Trouble Ticket', domain: 'Subscription', business: 'OTT-POC', created: '05/03/2025', sla: '02:45m', assignee: 'Raghu', customer: 'Rukhmini', customerId: '232323227376464', channel: 'Email' },
  { id: 'RVT435-10', title: 'Playback not working, stuck on black screen', status: 'Open', priority: 'Medium', category: 'Trouble Ticket', domain: 'Mobile App', business: 'OTT-POC', created: '05/03/2025', sla: '02:45m', assignee: 'Abishek', customer: 'Sardhar', customerId: '232323227376521', channel: 'CCB' },
  { id: 'RVT435-10', title: 'Playback not working, stuck on black screen', status: 'Open', priority: 'Low', category: 'Trouble Ticket', domain: 'Video', business: 'OTT-POC', created: '05/03/2025', sla: '24:00m', assignee: '--', customer: 'Michel', customerId: '232323227371711', channel: 'CCB' },
];

const priorityColors = { Critical: '#ef4444', High: '#f97316', Medium: '#f59e0b', Low: '#6b7280' };
const priorityBg = { Critical: '#fef2f2', High: '#fff7ed', Medium: '#fffbeb', Low: '#f9fafb' };
const priorityArrow = { Critical: '↓', High: '↑', Medium: '→', Low: '↓' };
const statusColors = { Open: '#10b981', 'In-Progress': '#f59e0b', Resolved: '#3b82f6', Closed: '#6b7280' };
const statusBg = { Open: '#ecfdf5', 'In-Progress': '#fffbeb', Resolved: '#eff6ff', Closed: '#f9fafb' };
const statusDot = { Open: '#10b981', 'In-Progress': '#f59e0b', Resolved: '#3b82f6', Closed: '#6b7280' };

const TicketsPage = () => {
  const { colors, fonts } = useThemeContext();
  const { activeBU } = useBU();
  const history = useHistory();
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);

  useEffect(() => { document.title = 'EV Phase - Tickets'; }, []);

  const handleAddFilter = (filter) => {
    setActiveFilters((prev) => [...prev, filter]);
  };

  const handleRemoveFilter = (filter) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  const toggleSelectAll = () => {
    if (selectedTickets.length === filtered.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filtered.map((_, i) => i));
    }
  };

  const toggleSelect = (index) => {
    setSelectedTickets((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filtered = activeFilters.length === 0
    ? mockTickets
    : mockTickets.filter((ticket) => {
        return activeFilters.some((f) => {
          const fl = f.toLowerCase();
          if (ticket.status.toLowerCase() === fl) return true;
          if (ticket.priority.toLowerCase() === fl) return true;
          if (ticket.category.toLowerCase() === fl) return true;
          return false;
        });
      });

  const styles = {
    table: {
      width: '100%', borderCollapse: 'separate', borderSpacing: '0 0',
      fontFamily: fonts.body, fontSize: 'var(--text-sm)',
    },
    thead: {
      position: 'sticky', top: 0, zIndex: 2,
    },
    th: {
      padding: '12px 14px', textAlign: 'left', fontWeight: 600,
      fontSize: 'var(--text-xs)', color: colors.textMuted,
      borderBottom: `1px solid ${colors.borderLight}`,
      backgroundColor: colors.bgPrimary, whiteSpace: 'nowrap',
    },
    thSortable: {
      cursor: 'pointer', userSelect: 'none',
    },
    tr: {
      cursor: 'pointer', transition: 'background-color 0.15s',
      borderBottom: `1px solid ${colors.borderLight}`,
    },
    td: {
      padding: '14px 14px', verticalAlign: 'middle',
      borderBottom: `1px solid ${colors.borderLight}`,
    },
    checkbox: {
      width: 16, height: 16, borderRadius: 3, cursor: 'pointer',
      accentColor: colors.accentPrimary,
    },
    ticketInfo: {
      display: 'flex', flexDirection: 'column', gap: 2,
    },
    ticketIdRow: {
      display: 'flex', gap: 8, alignItems: 'center',
    },
    ticketId: {
      fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600,
      color: colors.accentPrimary,
    },
    ticketDate: {
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted,
    },
    ticketTitle: {
      fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textSecondary,
      lineHeight: 1.4,
    },
    customerName: {
      fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600,
      color: colors.textPrimary,
    },
    category: {
      fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textSecondary,
    },
    priorityBadge: (priority) => ({
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 6, fontSize: 'var(--text-xs)', fontWeight: 600,
      backgroundColor: priorityBg[priority] || '#f9fafb',
      color: priorityColors[priority] || '#6b7280',
      border: `1px solid ${rgba(priorityColors[priority] || '#6b7280', 0.2)}`,
      whiteSpace: 'nowrap',
    }),
    customerId: {
      fontFamily: 'monospace', fontSize: 'var(--text-xs)', fontWeight: 500,
      color: colors.accentPrimary,
    },
    statusBadge: (status) => ({
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 6, fontSize: 'var(--text-xs)', fontWeight: 600,
      backgroundColor: statusBg[status] || '#f9fafb',
      color: statusColors[status] || '#6b7280',
      border: `1px solid ${rgba(statusColors[status] || '#6b7280', 0.2)}`,
      whiteSpace: 'nowrap',
    }),
    statusDot: (status) => ({
      width: 6, height: 6, borderRadius: '50%',
      backgroundColor: statusDot[status] || '#6b7280',
    }),
    assignee: {
      fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary,
    },
    channel: {
      fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textSecondary,
    },
    sla: {
      display: 'flex', alignItems: 'center', gap: 4,
      fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600,
      whiteSpace: 'nowrap',
    },
    slaWarning: { color: '#ef4444' },
    slaOk: { color: colors.textMuted },
  };

  const isSlaWarning = (sla) => {
    const num = parseInt(sla);
    return num <= 45;
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 className="page-title">Tickets</h1>
        <button style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', cursor: 'pointer' }}>New Ticket</button>
      </div>
      <p className="page-subtitle">Support tickets and issue tracking — {activeBU.name}</p>

      {/* AI Chat Input */}
      <TicketVoiceInputBar />
      <AIInsightsCards />

      {/* Filter Chips */}
      <TicketFilterBar
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onAddFilter={handleAddFilter}
      />

      {/* Ticket Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: colors.textSecondary, fontFamily: fonts.body }}>
          No tickets match the selected filters
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid ${colors.borderLight}`, backgroundColor: colors.bgSurface }}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={{ ...styles.th, width: 40 }}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={selectedTickets.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    aria-label="Select all tickets"
                  />
                </th>
                <th style={styles.th}>Ticket ID, Created On, Title &amp; Customer Name</th>
                <th style={styles.th}>Category</th>
                <th style={{ ...styles.th, ...styles.thSortable }}>Priority ↕</th>
                <th style={styles.th}>CP Customer ID</th>
                <th style={{ ...styles.th, ...styles.thSortable }}>Status ↕</th>
                <th style={{ ...styles.th, ...styles.thSortable }}>Assigned User</th>
                <th style={{ ...styles.th, ...styles.thSortable }}>Channel ↕</th>
                <th style={{ ...styles.th, ...styles.thSortable }}>SLA ↕</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ticket, index) => (
                <tr
                  key={index}
                  style={styles.tr}
                  onClick={() => history.push(`/support/tickets/${ticket.id}`)}
                >
                  <td style={styles.td} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={selectedTickets.includes(index)}
                      onChange={() => toggleSelect(index)}
                      aria-label={`Select ticket ${ticket.id}`}
                    />
                  </td>
                  <td style={styles.td}>
                    <div style={styles.ticketInfo}>
                      <div style={styles.ticketIdRow}>
                        <span style={styles.ticketId}>{ticket.id}</span>
                        <span style={styles.ticketDate}>{ticket.created}</span>
                      </div>
                      <span style={styles.ticketTitle}>
                        {ticket.title}  <span style={styles.customerName}>@{ticket.customer}</span>
                      </span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.category}>{ticket.category}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.priorityBadge(ticket.priority)}>
                      {priorityArrow[ticket.priority]} {ticket.priority}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.customerId}>{ticket.customerId}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(ticket.status)}>
                      <span style={styles.statusDot(ticket.status)} />
                      {ticket.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.assignee}>{ticket.assignee}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.channel}>{ticket.channel}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.sla, ...(isSlaWarning(ticket.sla) ? styles.slaWarning : styles.slaOk) }}>
                      {isSlaWarning(ticket.sla) && '⚠'} SLA: {ticket.sla}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
