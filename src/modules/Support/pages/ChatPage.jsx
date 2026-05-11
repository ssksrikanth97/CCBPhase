import React, { useState, useEffect, useRef } from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';
import { useBU } from '../../BusinessUnit/store/buContext';
import { rgba } from '../../../styles/utils';
import './ChatPage.css';

// Mock customer scenarios
const mockCustomers = [
  {
    id: 1, name: 'Sarah Johnson', badge: 0, status: 'active',
    tier: 'Gold', custId: 'CUST-001', email: 'sarah.johnson@email.com', phone: '+1 (555) 123-4567', region: 'North America',
    totalValue: '$15,420', memberSince: 'Jan 2024', lastContact: '2 hours ago', openTickets: 2,
    intent: { label: 'Refund Request', tag: 'Billing', confidence: 75 },
    aiSummary: 'Customer reports duplicate subscription charge on their account. Transaction history confirms two identical charges of $14.99 on Jan 15. Customer is Gold tier with clean payment history. Eligible for immediate refund processing. Previous interactions show no pattern of disputes.',
    messages: [
      { role: 'customer', content: 'Hi, I noticed I was charged twice for my subscription this month.', time: '10:23 AM' },
      { role: 'ai-suggestion', content: "I understand you're concerned about an incorrect charge. I've reviewed your account and can see the duplicate transaction. I'll initiate a refund request right away. You should see the credit back to your account within 3-5 business days." },
    ],
    suggestedActions: ['Create Refund Ticket', 'Review Transaction History', 'Send Refund Confirmation Email'],
    resolution: ['Verify duplicate charge in billing system', 'Create refund ticket with priority flag', 'Process immediate refund authorization', 'Send confirmation email with reference number'],
    aiTicket: { title: 'Refund Ticket Suggestion', confidence: 87, reasons: ['Detected billing keywords', 'Found duplicate charge in history', 'Customer has refund eligibility'] },
  },
  {
    id: 2, name: 'Michael Chen', badge: 1, status: 'waiting',
    tier: 'Platinum', custId: 'CUST-042', email: 'michael.chen@corp.com', phone: '+1 (555) 987-6543', region: 'Asia Pacific',
    totalValue: '$42,800', memberSince: 'Mar 2022', lastContact: '15 min ago', openTickets: 1,
    intent: { label: 'Service Upgrade', tag: 'Account', confidence: 82 },
    aiSummary: 'High-value Platinum customer requesting plan upgrade. Currently on Standard plan ($29.99/mo), wants Premium ($49.99/mo). No feature loss during transition — Premium is a superset. Customer has been a member for 2+ years with consistent payments. Prorated billing of $13.33 applies for remaining cycle.',
    messages: [
      { role: 'customer', content: "I'd like to upgrade my plan to the Premium tier. Can you help me with that?", time: '10:45 AM' },
      { role: 'customer', content: "Also, will I lose any of my current features during the transition?", time: '10:46 AM' },
      { role: 'ai-suggestion', content: "Great news! I can help you upgrade to Premium right away. Your current features will remain intact during the transition, and you'll gain access to additional premium content immediately. The prorated difference will be applied to your next billing cycle." },
    ],
    suggestedActions: ['Process Plan Upgrade', 'Compare Plan Features', 'Send Upgrade Confirmation'],
    resolution: ['Confirm current plan details', 'Process upgrade to Premium tier', 'Apply prorated billing adjustment', 'Send confirmation with new features list'],
    aiTicket: { title: 'Upgrade Processing', confidence: 92, reasons: ['Clear upgrade intent', 'Platinum customer - priority handling', 'No outstanding issues'] },
  },
  {
    id: 3, name: 'Emma Wilson', badge: 0, status: 'active',
    tier: 'Silver', custId: 'CUST-118', email: 'emma.w@gmail.com', phone: '+44 (20) 7946-0958', region: 'Europe',
    totalValue: '$3,200', memberSince: 'Sep 2024', lastContact: '5 min ago', openTickets: 0,
    intent: { label: 'Technical Issue', tag: 'Support', confidence: 88 },
    aiSummary: 'Customer experiencing recurring buffering on streaming service. Issue started 3 hours ago. Network diagnostics show normal bandwidth (45 Mbps). CDN monitoring indicates elevated latency in EU-West region affecting ~2,400 customers. Not an account-specific issue — regional infrastructure problem. Temporary fix: switch to backup CDN endpoint.',
    messages: [
      { role: 'customer', content: "My streaming keeps buffering every few minutes. I've tried restarting the app but it's still happening.", time: '11:02 AM' },
      { role: 'ai-suggestion', content: "I'm sorry you're experiencing buffering issues. Let me check your connection quality and account status. Based on our diagnostics, it appears there may be a CDN issue in your region. I'll escalate this to our technical team and provide you with a temporary workaround." },
    ],
    suggestedActions: ['Run Network Diagnostics', 'Check CDN Status', 'Escalate to Tech Team', 'Offer Service Credit'],
    resolution: ['Check customer connection metrics', 'Verify CDN status in EU region', 'Apply temporary CDN routing fix', 'Monitor for 24 hours', 'Follow up with customer'],
    aiTicket: { title: 'Technical Escalation', confidence: 78, reasons: ['Recurring buffering pattern detected', 'CDN issues reported in EU region', 'Multiple customers affected'] },
  },
];

const incomingChat = { name: 'Alex Rivera', issue: 'Password reset request' };

const quickActions = [
  { icon: '🎫', label: 'Create Ticket' },
  { icon: '👤', label: 'Update Customer' },
  { icon: '➕', label: 'Add Request' },
  { icon: '✕', label: 'Close Chat', danger: true },
];

const ChatPage = () => {
  const { colors, fonts } = useThemeContext();
  const { activeBU } = useBU();
  const [activeCustomerId, setActiveCustomerId] = useState(1);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState(() => {
    const initial = {};
    mockCustomers.forEach((c) => { initial[c.id] = [...c.messages]; });
    return initial;
  });
  const [profileTab, setProfileTab] = useState('profile');
  const [showIncoming, setShowIncoming] = useState(true);
  const [notifications, setNotifications] = useState({ 2: 1 });
  const [intentExpanded, setIntentExpanded] = useState(true);
  const [profileExpanded, setProfileExpanded] = useState(true);
  const [subTab, setSubTab] = useState('contact'); // contact, billing, settings, activity
  const messagesEndRef = useRef(null);

  const activeCustomer = mockCustomers.find((c) => c.id === activeCustomerId);
  const activeMessages = conversations[activeCustomerId] || [];

  useEffect(() => {
    document.title = 'EV Phase - Support Chat';
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg = { role: 'agent', content: message.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setConversations((prev) => ({ ...prev, [activeCustomerId]: [...(prev[activeCustomerId] || []), newMsg] }));
    setMessage('');

    // Simulate customer reply after 2s
    setTimeout(() => {
      const replies = [
        "Thank you, that's very helpful!",
        "Okay, I'll wait for the update.",
        "Great, please proceed with that.",
        "Can you also check my account settings?",
        "That makes sense. How long will it take?",
      ];
      const reply = { role: 'customer', content: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setConversations((prev) => ({ ...prev, [activeCustomerId]: [...(prev[activeCustomerId] || []), reply] }));
    }, 2000);
  };

  const handleUseResponse = () => {
    const suggestion = activeMessages.find((m) => m.role === 'ai-suggestion');
    if (suggestion) {
      const newMsg = { role: 'agent', content: suggestion.content, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setConversations((prev) => ({ ...prev, [activeCustomerId]: [...(prev[activeCustomerId] || []), newMsg] }));
    }
  };

  const handleAcceptIncoming = () => {
    setShowIncoming(false);
    // Add new customer to conversations
    setConversations((prev) => ({ ...prev, 4: [{ role: 'customer', content: "Hi, I need help resetting my password. I can't log into my account.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] }));
  };

  const handleSwitchCustomer = (id) => {
    setActiveCustomerId(id);
    setNotifications((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header row: title left, incoming requests right */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 16 }}>
        <div>
          <h1 className="page-title">Support Chat</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Real-time customer conversations powered by AI — {activeBU.name}</p>
        </div>

        {showIncoming && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 16px', borderRadius: 'var(--radius-md)',
            backgroundColor: rgba(colors.accentSecondary, 0.08),
            border: `1.5px solid ${rgba(colors.accentSecondary, 0.25)}`,
            flexShrink: 0,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colors.accentSecondary, animation: 'pulse 1.5s infinite' }} />
            <div>
              <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary }}>{incomingChat.name}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{incomingChat.issue}</div>
            </div>
            <button onClick={handleAcceptIncoming} style={{ padding: '5px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}>Accept</button>
            <button onClick={() => setShowIncoming(false)} style={{ padding: '5px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent', color: colors.textMuted, border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)', cursor: 'pointer' }}>✕</button>
          </div>
        )}
      </div>

    <div>
      {/* Top tabs */}
      <div className="chat-page__tabs" style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
        {mockCustomers.map((c) => (
          <button key={c.id} className={`chat-page__tab ${c.id === activeCustomerId ? 'chat-page__tab--active' : ''}`} onClick={() => handleSwitchCustomer(c.id)}>
            {c.name} {(notifications[c.id] || 0) > 0 && <span className="chat-page__tab-badge">{notifications[c.id]}</span>}
          </button>
        ))}
        <span className="chat-page__tab-meta">{mockCustomers.length}/6 active</span>
      </div>

      <div className="chat-page__body">
        {/* Left Panel */}
        <aside className="chat-page__sidebar" style={{ backgroundColor: colors.bgSurface, borderRight: `1px solid ${colors.borderLight}` }}>
          <div className="chat-page__search">
            <input placeholder="Search customers (Press /)" style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', backgroundColor: colors.bgPrimary, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-lg)', padding: '10px 14px', width: '100%', outline: 'none', color: colors.textPrimary }} />
          </div>

          {/* Top tabs: Profile / Tickets / History */}
          <div className="chat-page__profile-tabs" style={{ borderBottom: `1px solid ${colors.borderLight}`, margin: '0 12px' }}>
            {['profile', 'tickets', 'history'].map((tab) => (
              <button key={tab} className={`chat-page__profile-tab ${profileTab === tab ? 'chat-page__profile-tab--active' : ''}`} onClick={() => setProfileTab(tab)}>
                {tab === 'tickets' && '🎫 '}{tab === 'history' && '◷ '}{tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {/* === PROFILE TAB === */}
            {profileTab === 'profile' && (
              <>
                {/* Open tickets alert */}
                {activeCustomer.openTickets > 0 && (
                  <div style={{ backgroundColor: rgba(colors.accentPrimary, 0.06), padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginBottom: 12, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.accentPrimary }}>
                    ⚠ {activeCustomer.openTickets} open tickets
                  </div>
                )}

                {/* Profile card (collapsible) */}
                <div style={{ border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.heading, fontSize: 'var(--text-md)', color: '#fff', fontWeight: 700 }}>
                      {activeCustomer.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-md)', fontWeight: 600, color: colors.textPrimary }}>{activeCustomer.name}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', borderRadius: 4, backgroundColor: rgba(colors.accentPrimary, 0.1), color: colors.accentPrimary, fontFamily: fonts.body }}>{activeCustomer.tier}</span>
                        <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', borderRadius: 4, backgroundColor: rgba(colors.accentSecondary, 0.1), color: colors.accentSecondaryDark, fontFamily: fonts.body }}>{activeCustomer.status}</span>
                      </div>
                    </div>
                    <span style={{ cursor: 'pointer', color: colors.textMuted, fontSize: 'var(--text-sm)' }} onClick={() => setProfileExpanded(!profileExpanded)}>{profileExpanded ? '▲' : '▼'}</span>
                  </div>
                  {profileExpanded && (
                    <>
                      <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 4 }}>ID: {activeCustomer.custId}</div>
                      <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, lineHeight: 2, borderTop: `1px solid ${colors.borderLight}`, paddingTop: 8, marginTop: 8 }}>
                        ✉ {activeCustomer.email}<br/>☎ {activeCustomer.phone}<br/>◉ {activeCustomer.region}
                      </div>
                    </>
                  )}
                </div>

                {/* Show/Hide Full Profile toggle */}
                <button onClick={() => setProfileExpanded(!profileExpanded)} style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, backgroundColor: 'transparent', fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textPrimary, cursor: 'pointer', marginBottom: 12 }}>
                  {profileExpanded ? 'Hide Full Profile' : 'Show Full Profile'}
                </button>

                {/* Summary stats */}
                <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>Total Value</span><span style={{ color: colors.textPrimary, fontWeight: 600 }}>{activeCustomer.totalValue}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>Member Since</span><span style={{ color: colors.textPrimary }}>{activeCustomer.memberSince}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Last Contact</span><span style={{ color: colors.textPrimary }}>{activeCustomer.lastContact}</span></div>
                </div>

                {/* Sub-tabs: Contact / Billing / Settings / Activity */}
                <div style={{ display: 'flex', backgroundColor: colors.bgPrimary, borderRadius: 'var(--radius-lg)', padding: 3, marginBottom: 16 }}>
                  {[{ id: 'contact', icon: '👤' }, { id: 'billing', icon: '💳' }, { id: 'settings', icon: '⚙' }, { id: 'activity', icon: '◷' }].map((t) => (
                    <button key={t.id} onClick={() => setSubTab(t.id)} style={{ flex: 1, padding: '8px 0', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: subTab === t.id ? colors.bgSurface : 'transparent', boxShadow: subTab === t.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', fontSize: 'var(--text-md)' }}>
                      {t.icon}
                    </button>
                  ))}
                </div>

                {/* Sub-tab content */}
                {subTab === 'contact' && (
                  <div style={{ borderTop: `1px solid ${colors.borderLight}`, paddingTop: 12 }}>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary, marginBottom: 10 }}>👤 Contact Information</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, lineHeight: 2.2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Email</span><span style={{ color: colors.textPrimary }}>{activeCustomer.email}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Phone</span><span style={{ color: colors.textPrimary }}>{activeCustomer.phone}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Region</span><span style={{ color: colors.textPrimary }}>{activeCustomer.region}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Address</span><span style={{ color: colors.textPrimary }}>123 Main St, New York</span></div>
                    </div>
                  </div>
                )}

                {subTab === 'billing' && (
                  <div style={{ borderTop: `1px solid ${colors.borderLight}`, paddingTop: 12 }}>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary, marginBottom: 10 }}>💳 Payment Methods</div>
                    <div style={{ border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textPrimary }}>🔵 •••• 4242</span>
                        <span style={{ fontSize: 'var(--text-xs)', padding: '2px 6px', borderRadius: 4, backgroundColor: rgba(colors.accentSecondary, 0.1), color: colors.accentSecondaryDark, fontFamily: fonts.body }}>Primary</span>
                      </div>
                      <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginTop: 4 }}>Expires 12/2026</div>
                    </div>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>Recent Transactions</div>
                    {[{ desc: 'Monthly Sub', date: 'Nov 1', amount: '$299', status: 'Completed' }, { desc: 'Monthly Sub', date: 'Oct 1', amount: '$299', status: 'Completed' }, { desc: 'Add-on', date: 'Sep 15', amount: '$49', status: 'Completed' }].map((tx, i) => (
                      <div key={i} style={{ border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-sm)', padding: '8px 12px', marginBottom: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textPrimary }}><span>{tx.desc}</span><span>{tx.amount}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginTop: 2 }}><span>{tx.date}</span><span style={{ color: colors.accentSecondaryDark }}>{tx.status}</span></div>
                      </div>
                    ))}
                    <div style={{ borderTop: `1px solid ${colors.borderLight}`, paddingTop: 10, marginTop: 10, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>Total Spent</span><span style={{ color: colors.textPrimary, fontWeight: 600 }}>{activeCustomer.totalValue}</span></div>
                    </div>
                  </div>
                )}

                {subTab === 'settings' && (
                  <div style={{ borderTop: `1px solid ${colors.borderLight}`, paddingTop: 12 }}>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary, marginBottom: 10 }}>🔔 Communication</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, lineHeight: 2.4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Email</span><span style={{ color: colors.accentSecondaryDark, fontWeight: 500 }}>On</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SMS</span><span style={{ color: colors.accentSecondaryDark, fontWeight: 500 }}>On</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Marketing</span><span style={{ color: colors.textMuted }}>Off</span></div>
                    </div>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary, marginTop: 14, marginBottom: 8 }}>Preferences</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, lineHeight: 2.4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Channel</span><span style={{ color: colors.textPrimary }}>Email</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Time</span><span style={{ color: colors.textPrimary }}>9AM-5PM</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Language</span><span style={{ color: colors.textPrimary }}>English</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Timezone</span><span style={{ color: colors.textPrimary }}>EST</span></div>
                    </div>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary, marginTop: 14, marginBottom: 8 }}>🔒 Security</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, lineHeight: 2.4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>2FA</span><span style={{ color: colors.accentSecondaryDark, fontWeight: 500 }}>On</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Data Sharing</span><span style={{ color: colors.textMuted }}>Off</span></div>
                    </div>
                  </div>
                )}

                {subTab === 'activity' && (
                  <div style={{ borderTop: `1px solid ${colors.borderLight}`, paddingTop: 12 }}>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary, marginBottom: 10 }}>◷ Recent Activity</div>
                    {[{ title: 'Chat started', detail: 'Billing inquiry', time: '2h ago' }, { title: 'Ticket resolved', detail: '#TKT-1234', time: '2d ago' }, { title: 'Email sent', detail: 'Upgrade request', time: '5d ago' }, { title: 'Payment', detail: '$299', time: '1w ago' }, { title: 'Profile updated', detail: 'Email changed', time: '2w ago' }].map((a, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: colors.accentPrimary, marginTop: 5, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary }}>{a.title}</span>
                            <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{a.time}</span>
                          </div>
                          <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{a.detail}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ borderTop: `1px solid ${colors.borderLight}`, paddingTop: 10, marginTop: 8, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>Interactions</span><span style={{ color: colors.textPrimary, fontWeight: 600 }}>47</span></div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* === TICKETS TAB === */}
            {profileTab === 'tickets' && (
              <div>
                {[{ title: 'Refund request for subscription', id: 'TKT-1001', status: 'Open', priority: 'High', category: 'Billing', date: '01/11/2025' }, { title: 'Service disconnection issue', id: 'TKT-1002', status: 'Pending', priority: 'Critical', category: 'Technical', date: '30/10/2025' }].map((ticket, i) => (
                  <div key={i} style={{ border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>{ticket.title}</span>
                      <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', borderRadius: 4, backgroundColor: ticket.priority === 'Critical' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: ticket.priority === 'Critical' ? '#ef4444' : '#d97706', fontFamily: fonts.body }}>{ticket.priority}</span>
                    </div>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.accentPrimary }}>{ticket.id} • <span style={{ color: colors.textPrimary, fontWeight: 500 }}>{ticket.status}</span></div>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginTop: 4 }}>{ticket.category} • {ticket.date}</div>
                  </div>
                ))}
              </div>
            )}

            {/* === HISTORY TAB === */}
            {profileTab === 'history' && (
              <div>
                {[{ title: 'Previous chat session', detail: 'Resolved billing inquiry • 2 days ago' }, { title: 'Email received', detail: 'Account upgrade request • 5 days ago' }, { title: 'Phone call', detail: 'Technical support • 1 week ago' }, { title: 'Ticket closed', detail: 'Refund processed #TKT-789 • 2 weeks ago' }].map((item, i) => (
                  <div key={i} style={{ border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: 10 }}>
                    <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{item.detail}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Center - Chat */}
        <main className="chat-page__chat" style={{ backgroundColor: colors.bgPrimary }}>
          <div className="chat-page__chat-header" style={{ borderBottom: `1px solid ${colors.borderLight}`, backgroundColor: colors.bgSurface }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: fonts.heading, fontSize: 'var(--text-md)', fontWeight: 600, color: colors.textPrimary }}>{activeCustomer.name}</span>
                <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginLeft: 8 }}>◉ Active</span>
              </div>
              <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>● Available</span>
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginTop: 2 }}>{activeCustomer.intent.label} — {activeBU.name}</div>
          </div>

          <div className="chat-page__messages">
            {/* AI Intent + Summary (collapsible) */}
            <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', marginBottom: 16, overflow: 'hidden' }}>
              <div
                onClick={() => setIntentExpanded(!intentExpanded)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.accentPrimary }}>AI Intent Detected</span>
                  <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', borderRadius: 4, backgroundColor: rgba(colors.accentPrimary, 0.1), color: colors.accentPrimary, fontFamily: fonts.body }}>{activeCustomer.intent.tag}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{activeCustomer.intent.label} • {activeCustomer.intent.confidence}%</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: colors.textMuted, transition: 'transform 0.2s', transform: intentExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </div>
              </div>
              {intentExpanded && (
                <div style={{ padding: '0 16px 14px', borderTop: `1px solid ${colors.borderLight}` }}>
                  <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginTop: 12, marginBottom: 8, fontWeight: 600 }}>AI Summary</div>
                  <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary, lineHeight: 1.7, backgroundColor: rgba(colors.accentSecondary, 0.04), padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${rgba(colors.accentSecondary, 0.1)}` }}>
                    {activeCustomer.aiSummary}
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            {activeMessages.map((msg, i) => {
              if (msg.role === 'ai-suggestion') {
                return (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 6 }}>Suggested Response</div>
                    <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '14px 16px', fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary, lineHeight: 1.6 }}>
                      {msg.content}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={handleUseResponse} style={{ padding: '6px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}>Use Response</button>
                      <button onClick={() => navigator.clipboard?.writeText(msg.content)} style={{ padding: '6px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: colors.bgSurface, color: colors.textPrimary, border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)', cursor: 'pointer' }}>📋 Copy</button>
                    </div>
                  </div>
                );
              }
              if (msg.role === 'customer') {
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: rgba(colors.textMuted, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>👤</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '10px 14px', fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary, display: 'inline-block' }}>
                        {msg.content}
                      </div>
                      {msg.time && <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginTop: 4 }}>{msg.time}</div>}
                    </div>
                  </div>
                );
              }
              if (msg.role === 'agent') {
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                    <div style={{ maxWidth: '75%' }}>
                      <div style={{ backgroundColor: rgba(colors.accentPrimary, 0.1), border: `1px solid ${rgba(colors.accentPrimary, 0.2)}`, borderRadius: 'var(--radius-md)', padding: '10px 14px', fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary }}>
                        {msg.content}
                      </div>
                      {msg.time && <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginTop: 4, textAlign: 'right' }}>{msg.time} ✓</div>}
                    </div>
                  </div>
                );
              }
              return null;
            })}

            {/* Suggested Actions */}
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 8 }}>Suggested Actions</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {activeCustomer.suggestedActions.map((a) => (
                  <button key={a} style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textPrimary, cursor: 'pointer' }}>{a}</button>
                ))}
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-page__input-area" style={{ borderTop: `1px solid ${colors.borderLight}`, backgroundColor: colors.bgSurface }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Press / for AI Assistant)"
              style={{ flex: 1, border: 'none', outline: 'none', fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary, backgroundColor: 'transparent', padding: '12px 0' }}
            />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer', fontSize: 18 }}>📎</button>
              <button style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer', fontSize: 18 }}>🎤</button>
              <button onClick={handleSend} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--button-gradient)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: message.trim() ? 1 : 0.5 }}>➤</button>
            </div>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="chat-page__actions-panel" style={{ backgroundColor: colors.bgSurface, borderLeft: `1px solid ${colors.borderLight}` }}>
          <div style={{ padding: 16, borderBottom: `1px solid ${colors.borderLight}` }}>
            <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-md)', fontWeight: 600, color: colors.textPrimary, marginBottom: 12 }}>Quick Actions</div>
            {quickActions.map((a) => (
              <button key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', marginBottom: 4, borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, backgroundColor: 'transparent', fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: a.danger ? colors.accentPrimary : colors.textPrimary, cursor: 'pointer', textAlign: 'left' }}>
                {a.icon} {a.label}
              </button>
            ))}
          </div>

          <div style={{ padding: 16, borderBottom: `1px solid ${colors.borderLight}` }}>
            <div style={{ backgroundColor: rgba(colors.accentPrimary, 0.06), border: `1px solid ${rgba(colors.accentPrimary, 0.15)}`, borderRadius: 'var(--radius-md)', padding: 14 }}>
              <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.accentPrimary, marginBottom: 4 }}>🎫 {activeCustomer.aiTicket.title}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 8 }}>Confidence: <strong>{activeCustomer.aiTicket.confidence}%</strong></div>
              <ul style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, paddingLeft: 16, lineHeight: 1.8, marginBottom: 12 }}>
                {activeCustomer.aiTicket.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, padding: 8, borderRadius: 'var(--radius-sm)', background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}>Create Ticket</button>
                <button style={{ flex: 1, padding: 8, borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent', color: colors.textPrimary, border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)', cursor: 'pointer' }}>Dismiss</button>
              </div>
            </div>
          </div>

          <div style={{ padding: 16 }}>
            <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>Resolution Steps</div>
            <ol style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, paddingLeft: 16, lineHeight: 2 }}>
              {activeCustomer.resolution.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        </aside>
      </div>
    </div>
    </div>
  );
};

export default ChatPage;
