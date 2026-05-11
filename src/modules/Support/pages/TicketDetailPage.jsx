import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useThemeContext } from '../../../styles/ThemeContext';
import { useBU } from '../../BusinessUnit/store/buContext';
import { rgba } from '../../../styles/utils';

const ticketData = {
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
};

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
  const [activeTab, setActiveTab] = useState('timeline');
  const [ticketStatus, setTicketStatus] = useState(ticketData.status);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  useEffect(() => { document.title = `EV Phase - Ticket #${ticketData.id}`; }, []);

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav.push('/support/tickets')} style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer', fontSize: 'var(--text-xl)' }}>←</button>
          <span style={{ fontFamily: fonts.heading, fontSize: 'var(--text-xl)', fontWeight: 700, color: colors.textPrimary }}>{ticketData.title}</span>
          <span style={{ fontSize: 'var(--text-xs)', padding: '4px 12px', borderRadius: 12, backgroundColor: rgba(colors.accentSecondary, 0.1), color: colors.accentSecondaryDark, fontFamily: fonts.body }}>#{ticketData.id}</span>
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
          <span style={{ fontSize: 'var(--text-sm)', padding: '6px 16px', borderRadius: 'var(--radius-pill)', backgroundColor: rgba(colors.accentPrimary, 0.08), color: colors.accentPrimary, fontFamily: fonts.body, fontWeight: 600, border: `1.5px solid ${rgba(colors.accentPrimary, 0.2)}` }}>{ticketData.priority}</span>
          {/* Actions */}
          <button style={{ padding: '6px 16px', borderRadius: 'var(--radius-pill)', border: `1.5px solid ${colors.borderLight}`, backgroundColor: colors.bgSurface, fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary, cursor: 'pointer' }}>Add Comment</button>
        </div>
      </div>

      

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Left: Ticket content */}
        <div>
          {/* Ticket info card */}
          <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: 16 }}>
            <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textMuted, lineHeight: 1.7, marginBottom: 14 }}>
              {ticketData.description}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[{ l: 'Business', v: ticketData.business }, { l: 'Category', v: ticketData.category }, { l: 'Domain', v: ticketData.domain }, { l: 'Channel', v: ticketData.channel }].map((f) => (
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
                  {[{ l: 'Issue Type', v: ticketData.issueType }, { l: 'Sub-Category', v: ticketData.subCategory }, { l: 'Resolution', v: ticketData.resolution }, { l: 'Duration', v: ticketData.duration }, { l: 'Assignee', v: ticketData.assignee }, { l: 'Product', v: ticketData.product }].map((f) => (
                    <div key={f.l} style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}` }}>
                      <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{f.l}</div>
                      <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary, fontWeight: 500, marginTop: 2 }}>{f.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>Customer Contact</div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <span style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)' }}>{ticketData.customer.name}</span>
                  <span style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)' }}>{ticketData.customer.phone}</span>
                  <span style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-xs)' }}>{ticketData.customer.email}</span>
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>Attachments</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {ticketData.attachments.map((a) => (
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

        {/* Right: AI Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* AI Recommendations */}
          <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-md)', fontWeight: 600, color: colors.textPrimary, marginBottom: 4 }}>🤖 AI Recommendations</div>
            <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginBottom: 14 }}>Based on ticket analysis and historical data</div>

            {aiRecommendations.map((rec, i) => (
              <div key={i} style={{ backgroundColor: rgba(colors.accentPrimary, 0.04), border: `1px solid ${rgba(colors.accentPrimary, 0.1)}`, borderRadius: 'var(--radius-sm)', padding: '12px', marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>{rec.title}</span>
                  <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.accentPrimary }}>{rec.confidence}%</span>
                </div>
                {/* Confidence bar */}
                <div style={{ width: '100%', height: 4, backgroundColor: colors.borderLight, borderRadius: 2, marginBottom: 8 }}>
                  <div style={{ width: `${rec.confidence}%`, height: '100%', borderRadius: 2, background: 'var(--button-gradient)' }} />
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, lineHeight: 1.5, marginBottom: 8 }}>{rec.description}</div>
                <button style={{ padding: '5px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}>{rec.action}</button>
              </div>
            ))}
          </div>

          {/* Quick Info */}
          <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary, marginBottom: 12 }}>Ticket Summary</div>
            <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, lineHeight: 2.2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Created</span><span style={{ color: colors.textPrimary }}>{ticketData.created}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SLA</span><span style={{ color: '#ef4444', fontWeight: 600 }}>{ticketData.sla}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Assignee</span><span style={{ color: colors.textPrimary }}>{ticketData.assignee}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Customer</span><span style={{ color: colors.textPrimary }}>{ticketData.customer.name}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Interactions</span><span style={{ color: colors.textPrimary }}>{interactions.length}</span></div>
            </div>
          </div>

          {/* Related */}
          <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <div style={{ fontFamily: fonts.heading, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary, marginBottom: 10 }}>Related Tickets</div>
            {ticketData.relatedTickets.map((rt) => (
              <div key={rt.id} style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.accentPrimary, fontWeight: 500 }}>{rt.id} ↗</span>
                  <span style={{ fontSize: 'var(--text-xs)', padding: '2px 6px', borderRadius: 4, backgroundColor: rgba('#10b981', 0.1), color: '#10b981', fontFamily: fonts.body }}>{rt.status}</span>
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginTop: 4 }}>{rt.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
