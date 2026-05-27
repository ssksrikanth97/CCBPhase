import React, { useState, useEffect, useRef } from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';
import { useBU } from '../../BusinessUnit/store/buContext';
import { rgba } from '../../../styles/utils';
import { mockCustomers } from '../../Customer/store/mockData';

// Mock data
const mockTickets = [
  { id: 'RVT435', title: 'Playback not working – stuck on black screen', status: 'In-Progress', priority: 'High', category: 'Service Ticket', domain: 'Video', created: '12/09/2025', sla: '40m', assignee: 'You', customer: 'James Anderson', customerId: 'CUS-001', channel: 'Chat' },
  { id: 'RVT436', title: 'Billing discrepancy – charged twice', status: 'Open', priority: 'Medium', category: 'Billing', domain: 'Finance', created: '13/09/2025', sla: '2h', assignee: 'You', customer: 'Sarah Mitchell', customerId: 'CUS-002', channel: 'Email' },
  { id: 'RVT437', title: 'Cannot access Sports channel after upgrade', status: 'In-Progress', priority: 'High', category: 'Service Ticket', domain: 'Channels', created: '13/09/2025', sla: '1h', assignee: 'You', customer: 'Carlos Rodriguez', customerId: 'CUS-005', channel: 'Chat' },
  { id: 'RVT438', title: 'Account locked after password reset', status: 'Open', priority: 'Critical', category: 'Account', domain: 'Auth', created: '14/09/2025', sla: '30m', assignee: 'You', customer: 'Emma Williams', customerId: 'CUS-004', channel: 'Chat' },
  { id: 'RVT439', title: 'Buffering on live sports events', status: 'Open', priority: 'Medium', category: 'Service Ticket', domain: 'Streaming', created: '14/09/2025', sla: '3h', assignee: 'You', customer: 'Michael Chen', customerId: 'CUS-003', channel: 'SMS' },
];

// Active chat sessions (customers currently chatting with agent)
const initialChatSessions = [
  {
    id: 'session-1', customerId: 'CUS-001', customerName: 'James Anderson', ticketId: 'RVT435',
    channel: 'chat', status: 'active', unread: 0, startTime: '8:10 AM',
    messages: [
      { id: 1, from: 'customer', time: '8:10 AM', text: "Hi, my video playback isn't working. I just see a black screen." },
      { id: 2, from: 'agent', time: '8:12 AM', text: "I'm sorry to hear that. Let me check your account. Which device are you using?" },
      { id: 3, from: 'customer', time: '8:13 AM', text: "Samsung Galaxy S24, Android app. Was working fine yesterday." },
      { id: 4, from: 'agent', time: '8:18 AM', text: "I can see there's a CDN issue in your region. I'll restart the service now." },
    ],
  },
  {
    id: 'session-2', customerId: 'CUS-005', customerName: 'Carlos Rodriguez', ticketId: 'RVT437',
    channel: 'chat', status: 'active', unread: 2, startTime: '2:00 PM',
    messages: [
      { id: 1, from: 'customer', time: '2:00 PM', text: "I upgraded to Sports Add-on yesterday but can't see any sports channels." },
      { id: 2, from: 'agent', time: '2:02 PM', text: "Let me check your package activation status." },
      { id: 3, from: 'customer', time: '2:05 PM', text: "I've restarted the box multiple times already." },
      { id: 4, from: 'customer', time: '2:08 PM', text: "Are you still there? This is urgent, there's a match tonight." },
    ],
  },
  {
    id: 'session-3', customerId: 'CUS-004', customerName: 'Emma Williams', ticketId: 'RVT438',
    channel: 'chat', status: 'active', unread: 1, startTime: '9:15 AM',
    messages: [
      { id: 1, from: 'customer', time: '9:15 AM', text: "My account is locked after password reset. Can't log in at all." },
      { id: 2, from: 'customer', time: '9:20 AM', text: "Hello? I need this resolved urgently please." },
    ],
  },
];

// Email threads
const initialEmailThreads = [
  {
    id: 'email-1', customerId: 'CUS-002', customerName: 'Sarah Mitchell', ticketId: 'RVT436',
    subject: 'Billing discrepancy – charged twice', status: 'unread',
    messages: [
      { id: 1, from: 'customer', time: '10:30 AM', text: "I was charged twice for my monthly subscription this month. The duplicate charge appeared on May 3rd. Please refund the extra payment. Attached is my bank statement showing both charges." },
    ],
  },
  {
    id: 'email-2', customerId: 'CUS-003', customerName: 'Michael Chen', ticketId: 'RVT439',
    subject: 'Buffering issues during live sports', status: 'read',
    messages: [
      { id: 1, from: 'customer', time: '3:00 PM', text: "Live sports keep buffering every 30 seconds. Very frustrating. I have a 100Mbps connection so it shouldn't be a bandwidth issue." },
      { id: 2, from: 'agent', time: '3:15 PM', text: "Thank you for reporting this. We're investigating CDN performance in your region. I'll update you within the hour." },
    ],
  },
];

// SMS conversations
const initialSmsThreads = [
  {
    id: 'sms-1', customerId: 'CUS-003', customerName: 'Michael Chen', ticketId: 'RVT439',
    phone: '+65 9123 4567', status: 'active',
    messages: [
      { id: 1, from: 'system', time: '3:20 PM', text: "Hi Michael, we're aware of buffering issues in your area. Our team is working on it." },
      { id: 2, from: 'customer', time: '3:25 PM', text: "Thanks. Any ETA on the fix?" },
    ],
  },
];

// Incoming notifications (pending acceptance)
const initialNotifications = [
  { id: 'notif-1', type: 'chat', customerName: 'New Customer', customerId: 'CUS-003', message: 'Customer requesting live chat support', time: '3:30 PM', ticketId: 'RVT440' },
  { id: 'notif-2', type: 'chat', customerName: 'VIP Customer', customerId: 'CUS-005', message: 'Priority escalation - VIP customer waiting', time: '3:32 PM', ticketId: 'RVT441' },
];

const priorityColors = { Critical: '#ef4444', High: '#f97316', Medium: '#f59e0b', Low: '#6b7280' };
const statusColors = { Open: '#10b981', 'In-Progress': '#f59e0b', Resolved: '#3b82f6', Closed: '#6b7280' };
const typeIcons = { chat: '💬', email: '✉️', phone: '📞', sms: '📱', note: '📝' };
const typeColors = { chat: '#3b82f6', email: '#8b5cf6', phone: '#10b981', sms: '#06b6d4', note: '#f59e0b' };

const AgentWorkbenchPage = () => {
  const { colors, fonts } = useThemeContext();
  const { activeBU } = useBU();
  const chatEndRef = useRef(null);

  // State
  const [chatSessions, setChatSessions] = useState(initialChatSessions);
  const [emailThreads, setEmailThreads] = useState(initialEmailThreads);
  const [smsThreads, setSmsThreads] = useState(initialSmsThreads);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeSessionId, setActiveSessionId] = useState('session-1');
  const [activeChannel, setActiveChannel] = useState('chat'); // chat | email | sms
  const [activeEmailId, setActiveEmailId] = useState('email-1');
  const [activeSmsId, setActiveSmsId] = useState('sms-1');
  const [replyText, setReplyText] = useState('');
  const [emailReply, setEmailReply] = useState('');
  const [smsReply, setSmsReply] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(mockTickets[0]);
  const [selectedCustomer, setSelectedCustomer] = useState(mockCustomers[0]);
  const [ticketForm, setTicketForm] = useState({ ...mockTickets[0] });
  const [customerTab, setCustomerTab] = useState('summary');
  const [showNotifPanel, setShowNotifPanel] = useState(true);

  useEffect(() => { document.title = 'EV Phase - Agent Workbench'; }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatSessions, activeSessionId]);

  // Get active session data
  const activeSession = chatSessions.find(s => s.id === activeSessionId);
  const activeEmail = emailThreads.find(e => e.id === activeEmailId);
  const activeSms = smsThreads.find(s => s.id === activeSmsId);

  // Select session and load customer/ticket context
  const handleSelectSession = (session) => {
    setActiveSessionId(session.id);
    // Mark as read
    setChatSessions(prev => prev.map(s => s.id === session.id ? { ...s, unread: 0 } : s));
    // Load customer
    const cust = mockCustomers.find(c => c.id === session.customerId) || mockCustomers[0];
    setSelectedCustomer(cust);
    // Load ticket
    const ticket = mockTickets.find(t => t.id === session.ticketId) || mockTickets[0];
    setSelectedTicket(ticket);
    setTicketForm({ ...ticket });
  };

  // Send chat message
  const handleSendChat = () => {
    if (!replyText.trim() || !activeSession) return;
    const newMsg = { id: Date.now(), from: 'agent', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: replyText };
    setChatSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, newMsg] } : s));
    setReplyText('');
  };

  // Send email reply
  const handleSendEmail = () => {
    if (!emailReply.trim() || !activeEmail) return;
    const newMsg = { id: Date.now(), from: 'agent', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: emailReply };
    setEmailThreads(prev => prev.map(e => e.id === activeEmailId ? { ...e, messages: [...e.messages, newMsg], status: 'replied' } : e));
    setEmailReply('');
  };

  // Send SMS
  const handleSendSms = () => {
    if (!smsReply.trim() || !activeSms) return;
    const newMsg = { id: Date.now(), from: 'agent', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: smsReply };
    setSmsThreads(prev => prev.map(s => s.id === activeSmsId ? { ...s, messages: [...s.messages, newMsg] } : s));
    setSmsReply('');
  };

  // Accept incoming chat notification
  const handleAcceptChat = (notif) => {
    const newSession = {
      id: `session-${Date.now()}`, customerId: notif.customerId, customerName: notif.customerName,
      ticketId: notif.ticketId, channel: 'chat', status: 'active', unread: 1, startTime: notif.time,
      messages: [{ id: 1, from: 'customer', time: notif.time, text: notif.message }],
    };
    setChatSessions(prev => [...prev, newSession]);
    setNotifications(prev => prev.filter(n => n.id !== notif.id));
    setActiveSessionId(newSession.id);
    setActiveChannel('chat');
  };

  // Decline notification
  const handleDeclineChat = (notifId) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  // End chat session
  const handleEndSession = (sessionId) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId && chatSessions.length > 1) {
      const remaining = chatSessions.filter(s => s.id !== sessionId);
      setActiveSessionId(remaining[0]?.id || '');
    }
  };

  // Update ticket
  const handleTicketFieldChange = (field, value) => {
    setTicketForm(prev => ({ ...prev, [field]: value }));
  };

  // Customer action
  const handleCustomerAction = (action) => {
    alert(`Action: ${action} for ${selectedCustomer.firstName} ${selectedCustomer.lastName}`);
  };

  const sectionStyle = {
    backgroundColor: colors.bgSurface,
    border: `1px solid ${colors.borderLight}`,
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  };

  const headerStyle = {
    padding: '10px 14px',
    borderBottom: `1px solid ${colors.borderLight}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: rgba(colors.accentPrimary, 0.03),
  };

  return (
    <div style={{ width: '100%', minHeight: '80vh' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 'var(--text-xl)', fontWeight: 700, color: colors.textPrimary, margin: 0 }}>Agent Workbench</h1>
          <p style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, margin: '4px 0 0' }}>Unified workspace — Live Chat, Email, SMS & Customer 360</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontFamily: fonts.body, color: colors.textMuted }}>Active chats:</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.accentPrimary }}>{chatSessions.length}</span>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={() => setShowNotifPanel(!showNotifPanel)}
              style={{ position: 'relative', padding: '6px 12px', borderRadius: 8, border: `1px solid ${rgba('#ef4444', 0.3)}`, backgroundColor: rgba('#ef4444', 0.06), color: '#ef4444', fontFamily: fonts.body, fontSize: '11px', fontWeight: 600, cursor: 'pointer', animation: 'pulse 2s infinite' }}
            >
              🔔 {notifications.length} Incoming
            </button>
          )}
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span style={{ fontSize: '11px', fontFamily: fonts.body, color: '#10b981', fontWeight: 600 }}>Online</span>
        </div>
      </div>

      {/* Incoming Chat Notifications */}
      {showNotifPanel && notifications.length > 0 && (
        <div style={{ marginBottom: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {notifications.map(notif => (
            <div key={notif.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, backgroundColor: rgba('#ef4444', 0.04), border: `1px solid ${rgba('#ef4444', 0.15)}`, animation: 'slideIn 0.3s ease' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: rgba('#ef4444', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>💬</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 600, color: colors.textPrimary }}>{notif.customerName}</div>
                <div style={{ fontFamily: fonts.body, fontSize: '10px', color: colors.textMuted }}>{notif.message}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => handleAcceptChat(notif)} style={{ padding: '5px 12px', borderRadius: 6, backgroundColor: '#10b981', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: fonts.body }}>Accept</button>
                <button onClick={() => handleDeclineChat(notif.id)} style={{ padding: '5px 12px', borderRadius: 6, backgroundColor: rgba('#ef4444', 0.1), color: '#ef4444', border: `1px solid ${rgba('#ef4444', 0.2)}`, fontSize: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: fonts.body }}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Three-Panel Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: 12, alignItems: 'start' }}>

        {/* LEFT PANEL: Sessions List + Tickets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Channel Tabs */}
          <div style={{ ...sectionStyle }}>
            <div style={{ display: 'flex', borderBottom: `1px solid ${colors.borderLight}` }}>
              {[
                { key: 'chat', label: '💬 Chat', count: chatSessions.length },
                { key: 'email', label: '✉️ Email', count: emailThreads.length },
                { key: 'sms', label: '📱 SMS', count: smsThreads.length },
              ].map(ch => (
                <button
                  key={ch.key}
                  onClick={() => setActiveChannel(ch.key)}
                  style={{
                    flex: 1, padding: '10px 6px', fontFamily: fonts.body, fontSize: '10px', fontWeight: activeChannel === ch.key ? 600 : 400,
                    color: activeChannel === ch.key ? colors.accentPrimary : colors.textMuted,
                    backgroundColor: 'transparent', border: 'none',
                    borderBottom: activeChannel === ch.key ? `2px solid ${colors.accentPrimary}` : '2px solid transparent',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {ch.label} ({ch.count})
                </button>
              ))}
            </div>

            {/* Chat Sessions List */}
            {activeChannel === 'chat' && (
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {chatSessions.map(session => (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    style={{
                      padding: '10px 12px', borderBottom: `1px solid ${colors.borderLight}`, cursor: 'pointer',
                      backgroundColor: activeSessionId === session.id ? rgba(colors.accentPrimary, 0.06) : 'transparent',
                      borderLeft: activeSessionId === session.id ? `3px solid ${colors.accentPrimary}` : '3px solid transparent',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 700 }}>
                          {session.customerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 600, color: colors.textPrimary }}>{session.customerName}</div>
                          <div style={{ fontFamily: fonts.body, fontSize: '9px', color: colors.textMuted }}>#{session.ticketId} · {session.startTime}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {session.unread > 0 && (
                          <span style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#ef4444', color: '#fff', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{session.unread}</span>
                        )}
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981' }} />
                      </div>
                    </div>
                    <div style={{ fontFamily: fonts.body, fontSize: '10px', color: colors.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 36 }}>
                      {session.messages[session.messages.length - 1]?.text}
                    </div>
                  </div>
                ))}
                {chatSessions.length === 0 && (
                  <div style={{ padding: 20, textAlign: 'center', color: colors.textMuted, fontSize: '11px' }}>No active chat sessions</div>
                )}
              </div>
            )}

            {/* Email List */}
            {activeChannel === 'email' && (
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {emailThreads.map(email => (
                  <div
                    key={email.id}
                    onClick={() => { setActiveEmailId(email.id); const cust = mockCustomers.find(c => c.id === email.customerId) || mockCustomers[0]; setSelectedCustomer(cust); const ticket = mockTickets.find(t => t.id === email.ticketId) || mockTickets[0]; setSelectedTicket(ticket); setTicketForm({ ...ticket }); }}
                    style={{
                      padding: '10px 12px', borderBottom: `1px solid ${colors.borderLight}`, cursor: 'pointer',
                      backgroundColor: activeEmailId === email.id ? rgba(colors.accentPrimary, 0.06) : 'transparent',
                      borderLeft: activeEmailId === email.id ? `3px solid ${colors.accentPrimary}` : '3px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: email.status === 'unread' ? '#ef4444' : '#10b981' }} />
                      <span style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 600, color: colors.textPrimary }}>{email.customerName}</span>
                    </div>
                    <div style={{ fontFamily: fonts.body, fontSize: '10px', color: colors.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 14 }}>{email.subject}</div>
                  </div>
                ))}
              </div>
            )}

            {/* SMS List */}
            {activeChannel === 'sms' && (
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {smsThreads.map(sms => (
                  <div
                    key={sms.id}
                    onClick={() => { setActiveSmsId(sms.id); const cust = mockCustomers.find(c => c.id === sms.customerId) || mockCustomers[0]; setSelectedCustomer(cust); const ticket = mockTickets.find(t => t.id === sms.ticketId) || mockTickets[0]; setSelectedTicket(ticket); setTicketForm({ ...ticket }); }}
                    style={{
                      padding: '10px 12px', borderBottom: `1px solid ${colors.borderLight}`, cursor: 'pointer',
                      backgroundColor: activeSmsId === sms.id ? rgba(colors.accentPrimary, 0.06) : 'transparent',
                      borderLeft: activeSmsId === sms.id ? `3px solid ${colors.accentPrimary}` : '3px solid transparent',
                    }}
                  >
                    <div style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 600, color: colors.textPrimary }}>{sms.customerName}</div>
                    <div style={{ fontFamily: fonts.body, fontSize: '9px', color: colors.textMuted }}>{sms.phone}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ticket Queue */}
          <div style={sectionStyle}>
            <div style={headerStyle}>
              <span style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>🎫 My Tickets ({mockTickets.length})</span>
            </div>
            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
              {mockTickets.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => { setSelectedTicket(ticket); setTicketForm({ ...ticket }); const cust = mockCustomers.find(c => c.id === ticket.customerId) || mockCustomers[0]; setSelectedCustomer(cust); }}
                  style={{
                    padding: '8px 12px', borderBottom: `1px solid ${colors.borderLight}`, cursor: 'pointer',
                    backgroundColor: selectedTicket.id === ticket.id ? rgba(colors.accentPrimary, 0.04) : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: fonts.body, fontSize: '10px', fontWeight: 600, color: colors.textPrimary }}>#{ticket.id}</span>
                    <span style={{ fontSize: '8px', padding: '2px 5px', borderRadius: 6, backgroundColor: rgba(priorityColors[ticket.priority], 0.12), color: priorityColors[ticket.priority], fontWeight: 600 }}>{ticket.priority}</span>
                  </div>
                  <div style={{ fontFamily: fonts.body, fontSize: '10px', color: colors.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE PANEL: Conversation Area + Ticket Update */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Conversation Window */}
          <div style={{ ...sectionStyle, display: 'flex', flexDirection: 'column', height: 420 }}>
            {/* Conversation Header */}
            <div style={headerStyle}>
              {activeChannel === 'chat' && activeSession && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 700 }}>
                    {activeSession.customerName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>{activeSession.customerName}</div>
                    <div style={{ fontFamily: fonts.body, fontSize: '9px', color: colors.textMuted }}>Live Chat · #{activeSession.ticketId} · Started {activeSession.startTime}</div>
                  </div>
                  <button onClick={() => handleEndSession(activeSession.id)} style={{ padding: '4px 10px', borderRadius: 6, backgroundColor: rgba('#ef4444', 0.08), color: '#ef4444', border: `1px solid ${rgba('#ef4444', 0.2)}`, fontSize: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: fonts.body }}>End Chat</button>
                </div>
              )}
              {activeChannel === 'email' && activeEmail && (
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>{activeEmail.customerName}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: '9px', color: colors.textMuted }}>Subject: {activeEmail.subject}</div>
                </div>
              )}
              {activeChannel === 'sms' && activeSms && (
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>{activeSms.customerName}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: '9px', color: colors.textMuted }}>SMS · {activeSms.phone}</div>
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
              {activeChannel === 'chat' && activeSession && activeSession.messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'agent' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                  <div style={{
                    maxWidth: '70%', padding: '9px 13px', borderRadius: msg.from === 'agent' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    backgroundColor: msg.from === 'agent' ? rgba(colors.accentPrimary, 0.1) : colors.bgPrimary,
                    border: `1px solid ${msg.from === 'agent' ? rgba(colors.accentPrimary, 0.2) : colors.borderLight}`,
                  }}>
                    <div style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textPrimary, lineHeight: 1.5 }}>{msg.text}</div>
                    <div style={{ fontFamily: fonts.body, fontSize: '9px', color: colors.textMuted, marginTop: 4, textAlign: msg.from === 'agent' ? 'right' : 'left' }}>{msg.time}</div>
                  </div>
                </div>
              ))}
              {activeChannel === 'email' && activeEmail && activeEmail.messages.map(msg => (
                <div key={msg.id} style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 8, backgroundColor: msg.from === 'agent' ? rgba(colors.accentPrimary, 0.04) : colors.bgPrimary, border: `1px solid ${colors.borderLight}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span style={{ fontFamily: fonts.body, fontSize: '10px', fontWeight: 600, color: msg.from === 'agent' ? colors.accentPrimary : colors.textPrimary }}>{msg.from === 'agent' ? 'You' : activeEmail.customerName}</span>
                    <span style={{ fontSize: '9px', color: colors.textMuted }}>{msg.time}</span>
                  </div>
                  <div style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textPrimary, lineHeight: 1.6 }}>{msg.text}</div>
                </div>
              ))}
              {activeChannel === 'sms' && activeSms && activeSms.messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'agent' || msg.from === 'system' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                  <div style={{
                    maxWidth: '75%', padding: '8px 12px', borderRadius: 10,
                    backgroundColor: msg.from !== 'customer' ? rgba('#06b6d4', 0.1) : colors.bgPrimary,
                    border: `1px solid ${msg.from !== 'customer' ? rgba('#06b6d4', 0.2) : colors.borderLight}`,
                  }}>
                    <div style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textPrimary, lineHeight: 1.4 }}>{msg.text}</div>
                    <div style={{ fontFamily: fonts.body, fontSize: '9px', color: colors.textMuted, marginTop: 3 }}>{msg.time}</div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '10px 14px', borderTop: `1px solid ${colors.borderLight}`, display: 'flex', gap: 8, alignItems: 'center' }}>
              {activeChannel === 'chat' && (
                <>
                  <input
                    type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '9px 14px', borderRadius: 20, border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textPrimary, backgroundColor: colors.bgPrimary, outline: 'none' }}
                  />
                  <button onClick={handleSendChat} style={{ padding: '9px 16px', borderRadius: 20, background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}>Send</button>
                </>
              )}
              {activeChannel === 'email' && (
                <>
                  <textarea
                    value={emailReply} onChange={(e) => setEmailReply(e.target.value)}
                    placeholder="Compose email reply..."
                    rows={2}
                    style={{ flex: 1, padding: '9px 14px', borderRadius: 8, border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textPrimary, backgroundColor: colors.bgPrimary, outline: 'none', resize: 'none' }}
                  />
                  <button onClick={handleSendEmail} style={{ padding: '9px 16px', borderRadius: 8, background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-end' }}>Send Email</button>
                </>
              )}
              {activeChannel === 'sms' && (
                <>
                  <input
                    type="text" value={smsReply} onChange={(e) => setSmsReply(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendSms()}
                    placeholder="Type SMS..."
                    maxLength={160}
                    style={{ flex: 1, padding: '9px 14px', borderRadius: 20, border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textPrimary, backgroundColor: colors.bgPrimary, outline: 'none' }}
                  />
                  <span style={{ fontSize: '9px', color: colors.textMuted }}>{160 - smsReply.length}</span>
                  <button onClick={handleSendSms} style={{ padding: '9px 16px', borderRadius: 20, background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}>Send</button>
                </>
              )}
            </div>
          </div>

          {/* Ticket Update Form */}
          <div style={sectionStyle}>
            <div style={headerStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>✏️ #{selectedTicket.id}</span>
                <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: 8, backgroundColor: rgba(statusColors[selectedTicket.status], 0.12), color: statusColors[selectedTicket.status], fontWeight: 600 }}>{selectedTicket.status}</span>
                <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: 8, backgroundColor: rgba(priorityColors[selectedTicket.priority], 0.12), color: priorityColors[selectedTicket.priority], fontWeight: 600 }}>{selectedTicket.priority}</span>
              </div>
              <span style={{ fontSize: '9px', color: colors.textMuted }}>SLA: {selectedTicket.sla}</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: fonts.body, fontSize: '11px', color: colors.textMuted, marginBottom: 10 }}>{selectedTicket.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 10px' }}>
                {[
                  { label: 'Status', field: 'status', options: ['Open', 'In-Progress', 'Resolved', 'Closed'] },
                  { label: 'Priority', field: 'priority', options: ['Critical', 'High', 'Medium', 'Low'] },
                  { label: 'Assignee', field: 'assignee', options: ['You', 'SupportTeam', 'BillingTeam', 'TechTeam'] },
                ].map(f => (
                  <div key={f.field}>
                    <label style={{ display: 'block', fontFamily: fonts.body, fontSize: '9px', fontWeight: 600, color: colors.textMuted, marginBottom: 3, textTransform: 'uppercase' }}>{f.label}</label>
                    <select value={ticketForm[f.field] || ''} onChange={(e) => handleTicketFieldChange(f.field, e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: '11px', color: colors.textPrimary, backgroundColor: colors.bgPrimary, outline: 'none', cursor: 'pointer' }}>
                      {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <button onClick={() => alert(`Ticket #${selectedTicket.id} updated!`)} style={{ padding: '6px 14px', borderRadius: 6, background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                <button onClick={() => alert(`Ticket #${selectedTicket.id} escalated!`)} style={{ padding: '6px 14px', borderRadius: 6, backgroundColor: rgba('#f59e0b', 0.08), color: '#f59e0b', border: `1px solid ${rgba('#f59e0b', 0.2)}`, fontFamily: fonts.body, fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>Escalate</button>
                <button onClick={() => { handleTicketFieldChange('status', 'Resolved'); alert(`Resolved!`); }} style={{ padding: '6px 14px', borderRadius: 6, backgroundColor: rgba('#10b981', 0.08), color: '#10b981', border: `1px solid ${rgba('#10b981', 0.2)}`, fontFamily: fonts.body, fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>Resolve</button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Customer 360 + Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Customer Header */}
          <div style={sectionStyle}>
            <div style={headerStyle}>
              <span style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>👤 Customer 360</span>
              <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: 8, backgroundColor: rgba(colors.accentPrimary, 0.1), color: colors.accentPrimary, fontWeight: 600 }}>{selectedCustomer.segment}</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '12px' }}>
                  {selectedCustomer.firstName[0]}{selectedCustomer.lastName[0]}
                </div>
                <div>
                  <div style={{ fontFamily: fonts.heading, fontSize: '12px', fontWeight: 600, color: colors.textPrimary }}>{selectedCustomer.firstName} {selectedCustomer.lastName}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: '9px', color: colors.textMuted }}>{selectedCustomer.email}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {[
                  { l: 'Phone', v: selectedCustomer.phone },
                  { l: 'Status', v: selectedCustomer.status },
                  { l: 'Account', v: selectedCustomer.accountId },
                  { l: 'Region', v: selectedCustomer.region },
                  { l: 'Tier', v: selectedCustomer.accountDetails?.tier || '—' },
                  { l: 'Points', v: selectedCustomer.accountDetails?.loyaltyPoints || 0 },
                ].map(f => (
                  <div key={f.l}>
                    <div style={{ fontFamily: fonts.body, fontSize: '8px', color: colors.textMuted, textTransform: 'uppercase' }}>{f.l}</div>
                    <div style={{ fontFamily: fonts.body, fontSize: '10px', color: colors.textPrimary, fontWeight: 500 }}>{f.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Detail Tabs */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', borderBottom: `1px solid ${colors.borderLight}` }}>
              {[
                { key: 'summary', label: 'Info' },
                { key: 'billing', label: 'Billing' },
                { key: 'subscriptions', label: 'Plans' },
                { key: 'tickets', label: 'Tickets' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setCustomerTab(tab.key)} style={{ flex: 1, padding: '8px 4px', fontFamily: fonts.body, fontSize: '9px', fontWeight: customerTab === tab.key ? 600 : 400, color: customerTab === tab.key ? colors.accentPrimary : colors.textMuted, backgroundColor: 'transparent', border: 'none', borderBottom: customerTab === tab.key ? `2px solid ${colors.accentPrimary}` : '2px solid transparent', cursor: 'pointer' }}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div style={{ padding: '10px 14px', maxHeight: 200, overflowY: 'auto' }}>
              {customerTab === 'summary' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: '8px', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 2 }}>Address</div>
                    <div style={{ fontSize: '10px', color: colors.textPrimary }}>{selectedCustomer.address}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '8px', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 2 }}>Devices</div>
                    {(selectedCustomer.devices || []).slice(0, 3).map(d => (
                      <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '10px' }}>
                        <span style={{ color: colors.textPrimary }}>{d.name}</span>
                        <span style={{ color: d.status === 'Active' ? '#10b981' : colors.textMuted, fontSize: '9px' }}>{d.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {customerTab === 'billing' && selectedCustomer.billing && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {Object.entries({ 'Balance': selectedCustomer.billing.currentBalance, 'Last Payment': selectedCustomer.billing.lastPaymentAmount, 'Due Date': selectedCustomer.billing.paymentDueDate, 'Ageing': `${selectedCustomer.billing.ageing.days}d — ${selectedCustomer.billing.ageing.status}` }).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${colors.borderLight}` }}>
                      <span style={{ fontSize: '9px', color: colors.textMuted }}>{k}</span>
                      <span style={{ fontSize: '10px', color: colors.textPrimary, fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
              {customerTab === 'subscriptions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(selectedCustomer.subscriptions || []).map(sub => (
                    <div key={sub.id} style={{ padding: '6px 8px', borderRadius: 6, border: `1px solid ${colors.borderLight}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: colors.textPrimary }}>{sub.plan}</span>
                        <span style={{ fontSize: '8px', padding: '1px 5px', borderRadius: 4, backgroundColor: sub.status === 'Active' ? rgba('#10b981', 0.1) : rgba('#ef4444', 0.1), color: sub.status === 'Active' ? '#10b981' : '#ef4444' }}>{sub.status}</span>
                      </div>
                      <div style={{ fontSize: '9px', color: colors.textMuted }}>{sub.price}</div>
                    </div>
                  ))}
                </div>
              )}
              {customerTab === 'tickets' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {(selectedCustomer.troubleTickets || []).map(tt => (
                    <div key={tt.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${colors.borderLight}` }}>
                      <div>
                        <div style={{ fontSize: '10px', color: colors.textPrimary }}>{tt.title}</div>
                        <div style={{ fontSize: '8px', color: colors.textMuted }}>{tt.id}</div>
                      </div>
                      <span style={{ fontSize: '8px', padding: '1px 5px', borderRadius: 4, backgroundColor: rgba('#f59e0b', 0.1), color: '#f59e0b' }}>{tt.status}</span>
                    </div>
                  ))}
                  {(!selectedCustomer.troubleTickets || selectedCustomer.troubleTickets.length === 0) && (
                    <div style={{ textAlign: 'center', padding: 12, color: colors.textMuted, fontSize: '10px' }}>No tickets</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={sectionStyle}>
            <div style={headerStyle}>
              <span style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>⚡ Quick Actions</span>
            </div>
            <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { label: 'Send SMS', icon: '📱', action: 'send_sms' },
                { label: 'Send Email', icon: '✉️', action: 'send_email' },
                { label: 'Add Note', icon: '📝', action: 'add_note' },
                { label: 'Schedule Call', icon: '📞', action: 'schedule_call' },
                { label: 'Issue Refund', icon: '💰', action: 'issue_refund' },
                { label: 'Reset Password', icon: '🔑', action: 'reset_password' },
                { label: 'Upgrade Plan', icon: '⬆️', action: 'upgrade_plan' },
                { label: 'Transfer Chat', icon: '🔄', action: 'transfer_chat' },
              ].map(qa => (
                <button
                  key={qa.action}
                  onClick={() => handleCustomerAction(qa.action)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 8px', borderRadius: 6, border: `1px solid ${colors.borderLight}`, backgroundColor: 'transparent', cursor: 'pointer', fontFamily: fonts.body, fontSize: '9px', color: colors.textPrimary, transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = rgba(colors.accentPrimary, 0.05); e.currentTarget.style.borderColor = colors.accentPrimary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = colors.borderLight; }}
                >
                  <span style={{ fontSize: '12px' }}>{qa.icon}</span>
                  <span>{qa.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AgentWorkbenchPage;
