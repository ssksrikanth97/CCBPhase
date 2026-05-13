import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { useThemeContext } from '../../../styles/ThemeContext';
import { useBU } from '../../BusinessUnit/store/buContext';
import { rgba } from '../../../styles/utils';

const allTickets = [
  {
    id: 'RVT435', title: 'Playback not working – stuck on black screen',
    description: "Whenever I try to play any video, it just shows a black screen and the loading icon keeps spinning. The audio doesn't start either. I've tried switching networks and even reinstalled...",
    status: 'In-Progress', priority: 'High', category: 'Service Ticket', domain: 'Video', business: 'OTT-POC',
    created: '12/09/2025 8:10:00', sla: '40m', issueType: 'Playback Issue', subCategory: 'Service Down',
    resolution: 'Services Restarted', duration: '2:00 Hrs', channel: 'Email',
    customer: { name: 'Srikanth', phone: '+91 838389333', email: 'srikanth@gmail.com' },
    assignee: 'SupportTeam', tags: ['Video', 'Playback'],
    attachments: [{ type: 'PDF', name: 'error_log.pdf' }, { type: 'PNG', name: 'screenshot.png' }],
    relatedTickets: [{ id: 'RVT435-10', title: "Can't log in after app update...", status: 'Open' }],
    product: 'OTT Streaming – Video Platform',
  },
  {
    id: 'RVT436', title: 'Billing discrepancy – charged twice',
    description: "I was charged twice for my monthly subscription this month. The duplicate charge appeared on May 3rd. Please refund the extra payment.",
    status: 'Open', priority: 'Medium', category: 'Billing', domain: 'Finance', business: 'OTT-POC',
    created: '13/09/2025 10:30:00', sla: '2h', issueType: 'Billing Error', subCategory: 'Duplicate Charge',
    resolution: 'Pending', duration: '—', channel: 'Chat',
    customer: { name: 'James Anderson', phone: '+1 555 234-5678', email: 'james.anderson@email.com' },
    assignee: 'BillingTeam', tags: ['Billing', 'Refund'],
    attachments: [{ type: 'PDF', name: 'bank_statement.pdf' }],
    relatedTickets: [],
    product: 'OTT Streaming – Subscription',
  },
  {
    id: 'RVT437', title: 'Cannot access Sports channel after upgrade',
    description: "I upgraded to the Sports Add-on package yesterday but still can't see any sports channels in my channel list. I've restarted the box multiple times.",
    status: 'In-Progress', priority: 'High', category: 'Service Ticket', domain: 'Channels', business: 'OTT-POC',
    created: '13/09/2025 14:00:00', sla: '1h', issueType: 'Channel Access', subCategory: 'Package Activation',
    resolution: 'Pending', duration: '—', channel: 'Phone',
    customer: { name: 'Carlos Rodriguez', phone: '+34 612 345 678', email: 'carlos.rodriguez@email.com' },
    assignee: 'TechTeam', tags: ['Sports', 'Activation'],
    attachments: [],
    relatedTickets: [{ id: 'RVT430', title: 'Sports pack not showing after payment', status: 'Resolved' }],
    product: 'OTT Streaming – Live TV',
  },
  {
    id: 'RVT438', title: 'Account locked after password reset',
    description: "I tried to reset my password but now my account is completely locked. I can't log in with the new password or the old one.",
    status: 'Open', priority: 'Critical', category: 'Account', domain: 'Auth', business: 'OTT-POC',
    created: '14/09/2025 09:15:00', sla: '30m', issueType: 'Account Lock', subCategory: 'Authentication',
    resolution: 'Pending', duration: '—', channel: 'Chat',
    customer: { name: 'Emma Williams', phone: '+44 7700 900123', email: 'emma.williams@email.com' },
    assignee: 'SecurityTeam', tags: ['Account', 'Security'],
    attachments: [{ type: 'PNG', name: 'lock_screen.png' }],
    relatedTickets: [],
    product: 'OTT Streaming – Account',
  },
];

const ticketData = allTickets[0];

const interactions = [
  { id: 1, type: 'chat', from: 'Customer', time: '8:10 AM', content: "Hi, my video playback isn't working. I just see a black screen with a spinning loader." },
  { id: 2, type: 'chat', from: 'Agent', time: '8:12 AM', content: "I'm sorry to hear that. Let me check your account and streaming status. Can you tell me which device you're using?" },
  { id: 3, type: 'chat', from: 'Customer', time: '8:13 AM', content: "I'm using the Android app on Samsung Galaxy S24. It was working fine yesterday." },
  { id: 4, type: 'email', from: 'System', time: '8:15 AM', subject: 'Ticket Created: #RVT435', content: 'Your support ticket has been created. A team member will assist you shortly.' },
  { id: 5, type: 'chat', from: 'Agent', time: '8:18 AM', content: "I can see there's a CDN issue affecting video playback in your region. I'll restart the service on your account." },
  { id: 6, type: 'sms', from: 'System', time: '8:20 AM', content: 'Hi Srikanth, your streaming service has been restarted. Please try playing a video now.' },
  { id: 7, type: 'chat', from: 'Customer', time: '8:25 AM', content: "It's working now! Thank you so much for the quick help." },
  { id: 8, type: 'email', from: 'Agent', time: '8:30 AM', subject: 'Resolution Summary', content: 'Your playback issue has been resolved by restarting the streaming service. Root cause: CDN routing issue.' },
  { id: 9, type: 'note', from: 'Agent', time: '8:32 AM', content: 'Internal: CDN issue in AP-South region. Escalated to infra team for permanent fix.' },
];

const aiRecommendations = [
  { title: 'Auto-resolve similar tickets', confidence: 92, description: 'Pattern matches 14 resolved tickets with CDN restart fix. Enable auto-resolution for this category.', action: 'Enable' },
  { title: 'Proactive notification', confidence: 87, description: 'Send proactive SMS to 2,400 affected customers in AP-South region before they report issues.', action: 'Send' },
  { title: 'Escalate to Infrastructure', confidence: 78, description: 'Recurring CDN issues suggest infrastructure upgrade needed. Recommend escalation to engineering.', action: 'Escalate' },
];

const lifecycleSteps = ['Created', 'Assigned', 'In-Progress', 'Resolved'];
const currentStep = 2; // In-Progress

const typeIcons = { chat: '💬', email: '✉️', sms: '📱', note: '📝' };
const typeColors = { chat: '#3b82f6', email: '#8b5cf6', sms: '#10b981', note: '#f59e0b' };

const TicketDetailPage = () => {
  const { colors, fonts } = useThemeContext();
  const nav = useHistory();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('timeline');
  const [ticketStatus, setTicketStatus] = useState(allTickets[0].status);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [openTicketTabs, setOpenTicketTabs] = useState([allTickets[0].id]);
  const [activeTicketTab, setActiveTicketTab] = useState(allTickets[0].id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toggleSummary, setToggleSummary] = useState(true);
  const [toggleAI, setToggleAI] = useState(true);
  const [toggleRelated, setToggleRelated] = useState(false);
  const [toggleCanned, setToggleCanned] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isSmallScreen = isMobile || isTablet;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [ticketForm, setTicketForm] = useState({
    status: allTickets[0].status,
    priority: allTickets[0].priority,
    category: allTickets[0].category,
    domain: allTickets[0].domain,
    issueType: allTickets[0].issueType,
    subCategory: allTickets[0].subCategory,
    assignee: allTickets[0].assignee,
    channel: allTickets[0].channel,
    product: allTickets[0].product,
    resolution: allTickets[0].resolution,
    duration: allTickets[0].duration,
    customerName: allTickets[0].customer.name,
    customerEmail: allTickets[0].customer.email,
    customerPhone: allTickets[0].customer.phone,
  });

  const currentTicket = allTickets.find((t) => t.id === activeTicketTab) || ticketData;

  useEffect(() => { document.title = `EV Phase - Ticket #${currentTicket.id}`; }, [currentTicket.id]);

  const handleCloseTicketTab = (tabId, e) => {
    e.stopPropagation();
    const remaining = openTicketTabs.filter((t) => t !== tabId);
    if (remaining.length === 0) { nav.push('/support/tickets'); return; }
    setOpenTicketTabs(remaining);
    if (activeTicketTab === tabId) setActiveTicketTab(remaining[remaining.length - 1]);
  };

  const handleSwitchTicketTab = (tabId) => {
    setActiveTicketTab(tabId);
    const ticket = allTickets.find((t) => t.id === tabId);
    if (ticket) {
      setTicketStatus(ticket.status);
      setTicketForm({
        status: ticket.status, priority: ticket.priority, category: ticket.category,
        domain: ticket.domain, issueType: ticket.issueType, subCategory: ticket.subCategory,
        assignee: ticket.assignee, channel: ticket.channel, product: ticket.product,
        resolution: ticket.resolution, duration: ticket.duration,
        customerName: ticket.customer.name, customerEmail: ticket.customer.email, customerPhone: ticket.customer.phone,
      });
    }
  };

  const handleOpenTicket = (ticketId) => {
    if (!openTicketTabs.includes(ticketId)) setOpenTicketTabs((prev) => [...prev, ticketId]);
    setActiveTicketTab(ticketId);
    const ticket = allTickets.find((t) => t.id === ticketId);
    if (ticket) setTicketStatus(ticket.status);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const priorityColor = (p) => {
    switch (p) { case 'Critical': return '#dc2626'; case 'High': return '#f59e0b'; case 'Medium': return '#3b82f6'; default: return '#64748b'; }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Ticket Tabs — browser-style */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 14, borderBottom: `1px solid ${colors.borderLight}` }}>
        {openTicketTabs.map((tabId) => {
          const t = allTickets.find((tk) => tk.id === tabId);
          const isActive = activeTicketTab === tabId;
          return (
            <div
              key={tabId}
              onClick={() => handleSwitchTicketTab(tabId)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                cursor: 'pointer', borderRadius: '8px 8px 0 0', marginRight: 2, flexShrink: 0,
                backgroundColor: isActive ? colors.bgSurface : 'transparent',
                borderBottom: isActive ? `2px solid ${colors.accentPrimary}` : '2px solid transparent',
                border: isActive ? `1px solid ${colors.borderLight}` : '1px solid transparent',
                borderBottomColor: isActive ? colors.bgSurface : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: t ? priorityColor(t.priority) : colors.textMuted, flexShrink: 0 }} />
              <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: isActive ? 600 : 400, color: isActive ? colors.textPrimary : colors.textMuted, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                #{tabId}
              </span>
              <button
                onClick={(e) => handleCloseTicketTab(tabId, e)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, padding: 0, display: 'flex', borderRadius: 4 }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}
              >
                <CloseIcon style={{ fontSize: 14 }} />
              </button>
            </div>
          );
        })}
        {/* Open search */}
        <div style={{ position: 'relative', marginLeft: 4, flexShrink: 0, zIndex: 1001 }}>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', background: 'none', border: `1px dashed ${searchOpen ? colors.accentPrimary : colors.borderLight}`, borderRadius: '8px 8px 0 0', cursor: 'pointer', color: searchOpen ? colors.accentPrimary : colors.textMuted, fontFamily: fonts.body, fontSize: 'var(--text-xs)', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accentPrimary; e.currentTarget.style.color = colors.accentPrimary; }}
            onMouseLeave={(e) => { if (!searchOpen) { e.currentTarget.style.borderColor = colors.borderLight; e.currentTarget.style.color = colors.textMuted; } }}
          >
            <AddIcon style={{ fontSize: 14 }} /> Open
          </button>
          {searchOpen && (
            <>
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, width: 360, backgroundColor: colors.bgSurface, borderRadius: 12, border: `1px solid ${colors.borderLight}`, boxShadow: '0 12px 40px rgba(0,0,0,0.15)', zIndex: 1001, overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.borderLight}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>✦</div>
                  <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>Find Ticket</span>
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, fontSize: 'var(--text-sm)' }}>✕</button>
                </div>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.borderLight}` }}>
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by ID, title, or customer..." autoFocus style={{ width: '100%', border: `1px solid ${colors.borderLight}`, borderRadius: 8, padding: '8px 12px', fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary, backgroundColor: colors.bgPrimary, outline: 'none' }} />
                </div>
                <div style={{ maxHeight: 240, overflowY: 'auto', padding: '6px 0' }}>
                  {allTickets
                    .filter((t) => { if (!searchQuery.trim()) return true; const q = searchQuery.toLowerCase(); return `${t.id} ${t.title} ${t.customer.name}`.toLowerCase().includes(q); })
                    .filter((t) => !openTicketTabs.includes(t.id))
                    .map((t) => (
                      <button key={t.id} onClick={() => handleOpenTicket(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', textAlign: 'left', transition: 'background 0.1s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.accentPrimary}08`} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: priorityColor(t.priority), flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>#{t.id}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: colors.textMuted, fontFamily: fonts.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                        </div>
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: 8, backgroundColor: rgba(priorityColor(t.priority), 0.12), color: priorityColor(t.priority), fontWeight: 600 }}>{t.priority}</span>
                      </button>
                    ))}
                  {allTickets.filter((t) => !openTicketTabs.includes(t.id)).length === 0 && (
                    <div style={{ padding: '16px', textAlign: 'center', fontSize: 'var(--text-xs)', color: colors.textMuted }}>All tickets are already open</div>
                  )}
                </div>
                <div style={{ padding: '10px 16px', borderTop: `1px solid ${colors.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: colors.textMuted, fontFamily: fonts.body }}>AI-powered search</span>
                  <button onClick={() => { setSearchOpen(false); nav.push('/support/tickets'); }} style={{ fontSize: 'var(--text-xs)', color: colors.accentPrimary, background: 'none', border: 'none', cursor: 'pointer', fontFamily: fonts.body, fontWeight: 600 }}>View All →</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 10 : 0, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: fonts.heading, fontSize: isMobile ? 'var(--text-base)' : 'var(--text-xl)', fontWeight: 700, color: colors.textPrimary }}>{currentTicket.title}</span>
          <span style={{ fontSize: 'var(--text-xs)', padding: '4px 12px', borderRadius: 12, backgroundColor: rgba(colors.accentSecondary, 0.1), color: colors.accentSecondaryDark, fontFamily: fonts.body }}>#{currentTicket.id}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Status dropdown */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setStatusDropdownOpen(!statusDropdownOpen)} style={{ fontSize: 'var(--text-sm)', padding: '6px 16px', borderRadius: 'var(--radius-pill)', backgroundColor: rgba(colors.accentPrimary, 0.08), color: colors.accentPrimary, fontFamily: fonts.body, fontWeight: 600, border: `1.5px solid ${rgba(colors.accentPrimary, 0.2)}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              {ticketStatus} ▾
            </button>
            {statusDropdownOpen && (
              <div className="dropdown" style={{ right: 0, left: 'auto', top: '100%', marginTop: 6, minWidth: 140 }}>
                {['Open', 'In-Progress', 'Resolved', 'Closed'].map((s) => (
                  <button key={s} className={`dropdown__item ${s === ticketStatus ? 'dropdown__item--active' : ''}`} onClick={() => { setTicketStatus(s); setStatusDropdownOpen(false); }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Priority badge */}
          <span style={{ fontSize: 'var(--text-sm)', padding: '6px 16px', borderRadius: 'var(--radius-pill)', backgroundColor: rgba(colors.accentPrimary, 0.08), color: colors.accentPrimary, fontFamily: fonts.body, fontWeight: 600, border: `1.5px solid ${rgba(colors.accentPrimary, 0.2)}` }}>{currentTicket.priority}</span>
          {/* Actions */}
          <button style={{ padding: '6px 16px', borderRadius: 'var(--radius-pill)', border: `1.5px solid ${colors.borderLight}`, backgroundColor: colors.bgSurface, fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary, cursor: 'pointer' }}>Add Comment</button>
        </div>
      </div>

      

      {/* Three-column layout: Form | Content | Sidebar + Quick Actions */}
      <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : isTablet ? '1fr' : (showPanel ? '520px 1fr auto' : '520px 1fr auto'), gap: 16 }}>
        {/* Left: Ticket Form Fields — two columns */}
        {(!isSmallScreen || showForm) && (
        <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '16px', height: 'fit-content', position: isSmallScreen ? 'relative' : 'sticky', top: isSmallScreen ? undefined : 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>Ticket Properties</div>
            {isSmallScreen && <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, fontSize: 'var(--text-sm)' }}>✕</button>}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 12px' }}>
          {[
            { label: 'Status', field: 'status', type: 'select', options: ['Open', 'In-Progress', 'Resolved', 'Closed'] },
            { label: 'Priority', field: 'priority', type: 'select', options: ['Critical', 'High', 'Medium', 'Low'] },
            { label: 'Category', field: 'category', type: 'select', options: ['Service Ticket', 'Billing', 'Account', 'Technical'] },
            { label: 'Domain', field: 'domain', type: 'select', options: ['Video', 'Audio', 'Channels', 'Auth', 'Finance'] },
            { label: 'Issue Type', field: 'issueType', type: 'text' },
            { label: 'Sub-Category', field: 'subCategory', type: 'text' },
            { label: 'Assignee', field: 'assignee', type: 'select', options: ['SupportTeam', 'BillingTeam', 'TechTeam', 'SecurityTeam', 'Unassigned'] },
            { label: 'Channel', field: 'channel', type: 'select', options: ['Email', 'Chat', 'Phone', 'SMS', 'Portal'] },
            { label: 'Product', field: 'product', type: 'text' },
            { label: 'Resolution', field: 'resolution', type: 'text' },
            { label: 'Duration', field: 'duration', type: 'text' },
          ].map((f) => (
            <div key={f.field}>
              <label style={{ display: 'block', fontFamily: fonts.body, fontSize: '10px', fontWeight: 600, color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{f.label}</label>
              {f.type === 'select' ? (
                <select
                  value={ticketForm[f.field] || ''}
                  onChange={(e) => setTicketForm({ ...ticketForm, [f.field]: e.target.value })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textPrimary, backgroundColor: colors.bgPrimary, outline: 'none', cursor: 'pointer' }}
                >
                  {f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  value={ticketForm[f.field] || ''}
                  onChange={(e) => setTicketForm({ ...ticketForm, [f.field]: e.target.value })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textPrimary, backgroundColor: colors.bgPrimary, outline: 'none' }}
                />
              )}
            </div>
          ))}
          </div>

          <div style={{ borderTop: `1px solid ${colors.borderLight}`, paddingTop: 12, marginTop: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 12px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: fonts.body, fontSize: '10px', fontWeight: 600, color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>Customer</label>
                <input value={ticketForm.customerName || ''} onChange={(e) => setTicketForm({ ...ticketForm, customerName: e.target.value })} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textPrimary, backgroundColor: colors.bgPrimary, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: fonts.body, fontSize: '10px', fontWeight: 600, color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>Email</label>
                <input value={ticketForm.customerEmail || ''} onChange={(e) => setTicketForm({ ...ticketForm, customerEmail: e.target.value })} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textPrimary, backgroundColor: colors.bgPrimary, outline: 'none' }} />
              </div>
              
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 12px' }}>
            <div>
                <label style={{ display: 'block', fontFamily: fonts.body, fontSize: '10px', fontWeight: 600, color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>Phone</label>
                <input value={ticketForm.customerPhone || ''} onChange={(e) => setTicketForm({ ...ticketForm, customerPhone: e.target.value })} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textPrimary, backgroundColor: colors.bgPrimary, outline: 'none' }} />
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Ticket updated successfully!')}
            style={{ width: '100%', padding: '9px', marginTop: 14, borderRadius: 6, background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}
          >
            Update Ticket
          </button>
        </div>
        )}

        {/* Mobile: Show form toggle button */}
        {isSmallScreen && !showForm && (
          <button onClick={() => setShowForm(true)} style={{ width: '100%', padding: '10px', marginBottom: 12, borderRadius: 8, border: `1px dashed ${colors.borderLight}`, backgroundColor: 'transparent', fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.accentPrimary, cursor: 'pointer', fontWeight: 600 }}>
            ☰ Show Ticket Properties
          </button>
        )}

        {/* Middle: Ticket content */}
        <div>
          {/* Ticket info card */}
          <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: 16 }}>
            <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textMuted, lineHeight: 1.7, marginBottom: 14 }}>
              <h2>Ticket Description</h2>
              {currentTicket.description}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12 }}>
              {[{ l: 'Business', v: currentTicket.business }, { l: 'Category', v: currentTicket.category }, { l: 'Domain', v: currentTicket.domain }, { l: 'Channel', v: currentTicket.channel }].map((f) => (
                <div key={f.l}>
                  <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{f.l}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary, fontWeight: 500, marginTop: 2 }}>{f.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: `1px solid ${colors.borderLight}` }}>
            {[{ key: 'timeline', label: 'Timeline' }, { key: 'details', label: 'Details' }, { key: 'comments', label: 'Comments' }].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '10px 18px', fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: activeTab === tab.key ? 600 : 400, color: activeTab === tab.key ? colors.accentPrimary : colors.textMuted, backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === tab.key ? `2px solid ${colors.accentPrimary}` : '2px solid transparent', cursor: 'pointer' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '20px' }}>
            {/* TIMELINE */}
            {activeTab === 'timeline' && (
              <div>
                {interactions.map((msg, i) => (
                  <div key={msg.id} style={{ display: 'flex', gap: 14, marginBottom: i < interactions.length - 1 ? 0 : 0 }}>
                    {/* Timeline connector */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: rgba(typeColors[msg.type], 0.12), border: `2px solid ${rgba(typeColors[msg.type], 0.3)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>{typeIcons[msg.type]}</div>
                      {i < interactions.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 20, backgroundColor: colors.borderLight }} />}
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, paddingBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>{msg.from}</span>
                          <span style={{ fontSize: 'var(--text-xs)', padding: '1px 8px', borderRadius: 10, backgroundColor: rgba(typeColors[msg.type], 0.08), color: typeColors[msg.type], fontFamily: fonts.body, fontWeight: 500 }}>{msg.type}</span>
                        </div>
                        <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{msg.time}</span>
                      </div>
                      {msg.subject && <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.accentPrimary, marginBottom: 4, fontWeight: 500 }}>{msg.subject}</div>}
                      <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textMuted, lineHeight: 1.6, backgroundColor: rgba(typeColors[msg.type], 0.03), padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: `1px solid ${rgba(typeColors[msg.type], 0.08)}` }}>
                        {msg.content}
                      </div>
                      {/* Inline actions */}
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button style={{ padding: '3px 10px', borderRadius: 10, border: `1px solid ${colors.borderLight}`, backgroundColor: 'transparent', fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, cursor: 'pointer' }}>↩ Reply</button>
                        {msg.type === 'chat' && <button style={{ padding: '3px 10px', borderRadius: 10, border: `1px solid ${colors.borderLight}`, backgroundColor: 'transparent', fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, cursor: 'pointer' }}>📋 Copy</button>}
                        {msg.from === 'Customer' && <button style={{ padding: '3px 10px', borderRadius: 10, border: `1px solid ${colors.borderLight}`, backgroundColor: 'transparent', fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, cursor: 'pointer' }}>🎫 Create Ticket</button>}
                        {msg.type === 'note' && <button style={{ padding: '3px 10px', borderRadius: 10, border: `1px solid ${colors.borderLight}`, backgroundColor: 'transparent', fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, cursor: 'pointer' }}>✏️ Edit</button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DETAILS */}
            {activeTab === 'details' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                  {[{ l: 'Issue Type', v: currentTicket.issueType }, { l: 'Sub-Category', v: currentTicket.subCategory }, { l: 'Resolution', v: currentTicket.resolution }, { l: 'Duration', v: currentTicket.duration }, { l: 'Assignee', v: currentTicket.assignee }, { l: 'Product', v: currentTicket.product }].map((f) => (
                    <div key={f.l} style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}` }}>
                      <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{f.l}</div>
                      <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary, fontWeight: 500, marginTop: 2 }}>{f.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>Customer Contact</div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <span style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)' }}>{currentTicket.customer.name}</span>
                  <span style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)' }}>{currentTicket.customer.phone}</span>
                  <span style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)' }}>{currentTicket.customer.email}</span>
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>Attachments</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {currentTicket.attachments.map((a) => (
                    <div key={a.name} style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ padding: '2px 6px', borderRadius: 4, backgroundColor: a.type === 'PDF' ? rgba('#ef4444', 0.1) : rgba('#3b82f6', 0.1), color: a.type === 'PDF' ? '#ef4444' : '#3b82f6', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600 }}>{a.type}</span>
                      <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMMENTS */}
            {activeTab === 'comments' && (
              <div>
                {[
                  { author: 'Agent (You)', time: '8:18 AM', content: 'Restarted streaming service. CDN issue confirmed in AP-South region.' },
                  { author: 'Tech Lead', time: '8:45 AM', content: 'CDN fix deployed for AP-South. Monitoring for next 24h.' },
                  { author: 'QA', time: '9:00 AM', content: 'Verified playback working across all test devices in affected region.' },
                ].map((c, i) => (
                  <div key={i} style={{ borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: 12, marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>{c.author}</span>
                      <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{c.time}</span>
                    </div>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textMuted, lineHeight: 1.6 }}>{c.content}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <input placeholder="Add a comment..." style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-sm)', outline: 'none', color: colors.textPrimary, backgroundColor: colors.bgPrimary }} />
                  <button style={{ padding: '10px 18px', borderRadius: 'var(--radius-md)', background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}>Post</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Sidebar with toggleable sections — hidden on mobile/tablet */}
        {!isSmallScreen && (
        <div style={{ display: 'flex', gap: 0 }}>
          {/* Collapsible panels — hidden when showPanel is false */}
          {showPanel && (
          <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Ticket Summary — toggle */}
            <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', marginBottom: 8, overflow: 'hidden' }}>
              <button onClick={() => setToggleSummary(!toggleSummary)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>
                <span>📋 Ticket Summary</span>
                <span style={{ fontSize: 'var(--text-xs)', color: colors.textMuted }}>{toggleSummary ? '▲' : '▼'}</span>
              </button>
              {toggleSummary && (
                <div style={{ padding: '0 16px 14px', fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, lineHeight: 2.2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Created</span><span style={{ color: colors.textPrimary }}>{currentTicket.created}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SLA</span><span style={{ color: '#ef4444', fontWeight: 600 }}>{currentTicket.sla}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Assignee</span><span style={{ color: colors.textPrimary }}>{currentTicket.assignee}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Customer</span><span style={{ color: colors.textPrimary }}>{currentTicket.customer.name}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Priority</span><span style={{ color: colors.textPrimary }}>{currentTicket.priority}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Interactions</span><span style={{ color: colors.textPrimary }}>{interactions.length}</span></div>
                </div>
              )}
            </div>

            {/* AI Recommendations — toggle */}
            <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', marginBottom: 8, overflow: 'hidden' }}>
              <button onClick={() => setToggleAI(!toggleAI)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>
                <span>🤖 AI Recommendations</span>
                <span style={{ fontSize: 'var(--text-xs)', color: colors.textMuted }}>{toggleAI ? '▲' : '▼'}</span>
              </button>
              {toggleAI && (
                <div style={{ padding: '0 16px 14px' }}>
                  <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 10 }}>Based on ticket analysis and historical data</div>
                  {aiRecommendations.map((rec, i) => (
                    <div key={i} style={{ backgroundColor: rgba(colors.accentPrimary, 0.04), border: `1px solid ${rgba(colors.accentPrimary, 0.1)}`, borderRadius: 'var(--radius-sm)', padding: '10px', marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary }}>{rec.title}</span>
                        <span style={{ fontFamily: fonts.body, fontSize: '10px', fontWeight: 600, color: colors.accentPrimary }}>{rec.confidence}%</span>
                      </div>
                      <div style={{ width: '100%', height: 3, backgroundColor: colors.borderLight, borderRadius: 2, marginBottom: 6 }}><div style={{ width: `${rec.confidence}%`, height: '100%', borderRadius: 2, background: 'var(--button-gradient)' }} /></div>
                      <div style={{ fontFamily: fonts.body, fontSize: '10px', color: colors.textMuted, lineHeight: 1.4, marginBottom: 6 }}>{rec.description}</div>
                      <button style={{ padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>{rec.action}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Related Tickets — toggle */}
            <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', marginBottom: 8, overflow: 'hidden' }}>
              <button onClick={() => setToggleRelated(!toggleRelated)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>
                <span>🔗 Related Tickets</span>
                <span style={{ fontSize: 'var(--text-xs)', color: colors.textMuted }}>{toggleRelated ? '▲' : '▼'}</span>
              </button>
              {toggleRelated && (
                <div style={{ padding: '0 16px 14px' }}>
                  {currentTicket.relatedTickets.length === 0 && <div style={{ fontSize: 'var(--text-xs)', color: colors.textMuted }}>No related tickets</div>}
                  {currentTicket.relatedTickets.map((rt) => (
                    <div key={rt.id} style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, marginBottom: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.accentPrimary, fontWeight: 500 }}>{rt.id} ↗</span>
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: 4, backgroundColor: rgba('#10b981', 0.1), color: '#10b981' }}>{rt.status}</span>
                      </div>
                      <div style={{ fontFamily: fonts.body, fontSize: '10px', color: colors.textMuted, marginTop: 3 }}>{rt.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Canned Responses — toggle */}
            <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', marginBottom: 8, overflow: 'hidden' }}>
              <button onClick={() => setToggleCanned(!toggleCanned)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>
                <span>💬 Canned Responses</span>
                <span style={{ fontSize: 'var(--text-xs)', color: colors.textMuted }}>{toggleCanned ? '▲' : '▼'}</span>
              </button>
              {toggleCanned && (
                <div style={{ padding: '0 16px 14px' }}>
                  {[
                    { title: 'Greeting', text: 'Hi! Thank you for reaching out. How can I help you today?' },
                    { title: 'Escalation', text: 'I\'m escalating this to our specialist team. They\'ll follow up within 2 hours.' },
                    { title: 'Resolution', text: 'The issue has been resolved. Please try again and let us know if it works.' },
                    { title: 'Follow-up', text: 'Just checking in — is everything working well now? Let us know if you need further help.' },
                    { title: 'Closing', text: 'Glad we could help! I\'m closing this ticket. Feel free to reopen if needed.' },
                  ].map((resp, i) => (
                    <div key={i} style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, marginBottom: 6, cursor: 'pointer', transition: 'background 0.1s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rgba(colors.accentPrimary, 0.04)} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary, marginBottom: 2 }}>{resp.title}</div>
                      <div style={{ fontFamily: fonts.body, fontSize: '10px', color: colors.textMuted, lineHeight: 1.4 }}>{resp.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Quick Actions — vertical icon bar, each toggles a panel */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingLeft: 10, paddingTop: 4 }}>
            {[
              { icon: '📋', label: 'Ticket Summary', panel: 'summary' },
              { icon: '🤖', label: 'AI Recommendations', panel: 'ai' },
              { icon: '🔗', label: 'Related Tickets', panel: 'related' },
              { icon: '💬', label: 'Canned Responses', panel: 'canned' },
              { icon: showPanel ? '◀' : '▶', label: showPanel ? 'Hide Panel' : 'Show Panel', panel: 'toggle' },
            ].map((action, i) => {
              const isActive = action.panel === 'toggle' ? showPanel
                : action.panel === 'summary' ? toggleSummary
                : action.panel === 'ai' ? toggleAI
                : action.panel === 'related' ? toggleRelated
                : action.panel === 'canned' ? toggleCanned
                : false;
              return (
                <button
                  key={i}
                  title={action.label}
                  onClick={() => {
                    if (action.panel === 'toggle') { setShowPanel(!showPanel); }
                    else if (action.panel === 'summary') { if (!showPanel) setShowPanel(true); setToggleSummary(!toggleSummary); }
                    else if (action.panel === 'ai') { if (!showPanel) setShowPanel(true); setToggleAI(!toggleAI); }
                    else if (action.panel === 'related') { if (!showPanel) setShowPanel(true); setToggleRelated(!toggleRelated); }
                    else if (action.panel === 'canned') { if (!showPanel) setShowPanel(true); setToggleCanned(!toggleCanned); }
                  }}
                  style={{
                    width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: isActive ? `2px solid ${colors.accentPrimary}` : `1px solid ${colors.borderLight}`,
                    backgroundColor: isActive ? rgba(colors.accentPrimary, 0.08) : colors.bgSurface,
                    cursor: 'pointer', fontSize: '14px', transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accentPrimary; e.currentTarget.style.backgroundColor = rgba(colors.accentPrimary, 0.06); }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = colors.borderLight; e.currentTarget.style.backgroundColor = colors.bgSurface; } }}
                >
                  {action.icon}
                </button>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailPage;
