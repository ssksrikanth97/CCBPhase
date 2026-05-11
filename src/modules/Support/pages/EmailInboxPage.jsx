import React, { useState, useEffect } from 'react';
import { useThemeContext } from '../../../styles/ThemeContext';
import { useBU } from '../../BusinessUnit/store/buContext';
import { rgba } from '../../../styles/utils';

const mockEmails = [
  { id: 1, from: 'sarah.johnson@email.com', name: 'Sarah Johnson', subject: 'Refund request for duplicate charge', preview: 'Hi, I noticed I was charged twice for my subscription this month...', time: '10:23 AM', read: false, starred: true, ticketId: 'RVT437', labels: ['Billing', 'Priority'], thread: [
    { id: 't1', from: 'sarah.johnson@email.com', name: 'Sarah Johnson', time: '10:23 AM', content: 'Hi, I noticed I was charged twice for my subscription this month. My card ending in 4242 shows two charges of $14.99 on Jan 15. Can you please look into this and process a refund?' },
    { id: 't2', from: 'support@evphase.com', name: 'Agent (You)', time: '10:45 AM', content: 'Hi Sarah, thank you for reaching out. I can confirm there was a duplicate charge on your account. I have initiated a refund for $14.99 which should reflect in 3-5 business days. Reference: #RVT437' },
    { id: 't3', from: 'sarah.johnson@email.com', name: 'Sarah Johnson', time: '11:02 AM', content: 'Thank you for the quick response! I appreciate it.' },
  ]},
  { id: 2, from: 'michael.chen@corp.com', name: 'Michael Chen', subject: 'Plan upgrade inquiry - Premium tier', preview: "I'd like to upgrade my plan to Premium. Can you confirm the features...", time: '9:45 AM', read: false, starred: false, ticketId: null, labels: ['Account'], thread: [
    { id: 't1', from: 'michael.chen@corp.com', name: 'Michael Chen', time: '9:45 AM', content: "I'd like to upgrade my plan to Premium tier. Can you confirm what additional features I'll get and whether there's any downtime during the transition? Also, how will the billing work for the remaining days of my current cycle?" },
  ]},
  { id: 3, from: 'noreply@system.evphase.com', name: 'System', subject: 'Ticket Resolved: #RVT435 - Playback issue', preview: 'Ticket #RVT435 has been marked as resolved. Customer confirmed...', time: 'Yesterday', read: true, starred: false, ticketId: 'RVT435', labels: ['System', 'Resolved'], thread: [
    { id: 't1', from: 'noreply@system.evphase.com', name: 'System', time: 'Yesterday 8:32 AM', content: 'Ticket #RVT435 has been marked as resolved.\n\nTitle: Playback not working – stuck on black screen\nResolution: Services Restarted\nDuration: 2:00 Hrs\nCustomer: Srikanth\n\nCustomer confirmed the issue is resolved.' },
  ]},
  { id: 4, from: 'emma.w@gmail.com', name: 'Emma Wilson', subject: 'Still experiencing buffering issues', preview: 'Hi, the buffering issue came back again today. It happens every...', time: 'Yesterday', read: true, starred: true, ticketId: 'RVT441', labels: ['Technical', 'Follow-up'], thread: [
    { id: 't1', from: 'emma.w@gmail.com', name: 'Emma Wilson', time: 'Yesterday 2:15 PM', content: 'Hi, the buffering issue came back again today. It happens every few minutes during peak hours (7-10 PM). I thought this was fixed last week?' },
    { id: 't2', from: 'support@evphase.com', name: 'Agent (You)', time: 'Yesterday 2:30 PM', content: 'Hi Emma, sorry to hear the issue returned. We identified that the CDN fix from last week only partially resolved the problem. Our infrastructure team is deploying a permanent fix tonight. You should see improvement by tomorrow morning.' },
    { id: 't3', from: 'emma.w@gmail.com', name: 'Emma Wilson', time: 'Yesterday 2:35 PM', content: "Okay, I'll check tomorrow. Thanks for the update." },
    { id: 't4', from: 'support@evphase.com', name: 'Agent (You)', time: 'Today 9:00 AM', content: 'Hi Emma, the CDN upgrade was completed overnight. Could you please test your streaming and let us know if the buffering has stopped? We\'re monitoring your region closely.' },
  ]},
  { id: 5, from: 'alex.r@email.com', name: 'Alex Rivera', subject: 'Password reset not working', preview: "I've tried resetting my password 3 times but the email never arrives...", time: '2 days ago', read: true, starred: false, ticketId: null, labels: ['Authentication'], thread: [
    { id: 't1', from: 'alex.r@email.com', name: 'Alex Rivera', time: '2 days ago', content: "I've tried resetting my password 3 times but the reset email never arrives. I've checked spam folder too. My email is alex.r@email.com. Please help, I can't access my account." },
  ]},
];

const EmailInboxPage = () => {
  const { colors, fonts } = useThemeContext();
  const { activeBU } = useBU();
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });
  const [smsData, setSmsData] = useState({ to: '', message: '' });
  const [filter, setFilter] = useState('all');

  useEffect(() => { document.title = 'EV Phase - Email Inbox'; }, []);

  const activeEmail = mockEmails.find((e) => e.id === selectedEmail);
  const filtered = filter === 'all' ? mockEmails : filter === 'unread' ? mockEmails.filter((e) => !e.read) : mockEmails.filter((e) => e.starred);

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 className="page-title">Email Inbox</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setSmsOpen(true)} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${colors.accentPrimary}`, backgroundColor: 'transparent', fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight:'var(--weight-bold)', color: colors.accentPrimary, cursor: 'pointer' }}>Send SMS</button>
          <button onClick={() => setComposeOpen(true)} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight:'var(--weight-bold)', fontWeight: 600, cursor: 'pointer' }}>Compose</button>
        </div>
      </div>
      <p className="page-subtitle">Customer email threads and communications — {activeBU.name}</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['all', 'unread', 'starred'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 12px', borderRadius: 'var(--radius-pill)', border: filter === f ? 'none' : `1px solid ${colors.borderLight}`, background: filter === f ? 'var(--button-gradient)' : 'transparent', color: filter === f ? '#fff' : colors.textMuted, fontFamily: fonts.body, fontSize: 'var(--text-xs)', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {/* Two-column: list + detail */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedEmail ? '360px 1fr' : '1fr', gap: 16, minHeight: 500 }}>
        {/* Email list */}
        <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {filtered.map((email) => (
            <div key={email.id} onClick={() => setSelectedEmail(email.id)} style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.borderLight}`, cursor: 'pointer', backgroundColor: selectedEmail === email.id ? rgba(colors.accentPrimary, 0.04) : 'transparent', borderLeft: !email.read ? `3px solid ${colors.accentPrimary}` : '3px solid transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: email.read ? 400 : 600, color: colors.textPrimary }}>{email.name}</span>
                <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{email.time}</span>
              </div>
              <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: email.read ? 400 : 600, color: colors.textPrimary, marginBottom: 4 }}>{email.subject}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email.preview}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                {email.ticketId && <span style={{ fontSize: 'var(--text-xs)', padding: '1px 6px', borderRadius: 4, backgroundColor: rgba(colors.accentSecondary, 0.1), color: colors.accentSecondaryDark, fontFamily: fonts.body }}>🎫 #{email.ticketId}</span>}
                {email.labels.map((l) => <span key={l} style={{ fontSize: 'var(--text-xs)', padding: '1px 6px', borderRadius: 4, backgroundColor: rgba(colors.borderLight, 0.8), color: colors.textMuted, fontFamily: fonts.body }}>{l}</span>)}
                {email.starred && <span>⭐</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Email detail / thread */}
        {activeEmail && (
          <div style={{ backgroundColor: colors.bgSurface, border: `1px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontFamily: fonts.heading, fontSize: 'var(--text-lg)', fontWeight: 700, color: colors.textPrimary, margin: 0, marginBottom: 6 }}>{activeEmail.subject}</h2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {activeEmail.ticketId && <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', borderRadius: 4, backgroundColor: rgba(colors.accentSecondary, 0.1), color: colors.accentSecondaryDark, fontFamily: fonts.body, cursor: 'pointer' }}>🎫 Ticket #{activeEmail.ticketId}</span>}
                  <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{activeEmail.thread.length} messages in thread</span>
                </div>
              </div>
              <button onClick={() => setSelectedEmail(null)} style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer', fontSize: 'var(--text-lg)' }}>✕</button>
            </div>

            {/* Thread */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
              {activeEmail.thread.map((msg) => (
                <div key={msg.id} style={{ marginBottom: 16, padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: msg.from.includes('evphase') || msg.from.includes('system') ? rgba(colors.accentPrimary, 0.04) : colors.bgPrimary, border: `1px solid ${colors.borderLight}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', fontWeight: 600, color: colors.textPrimary }}>{msg.name}</span>
                      <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginLeft: 8 }}>&lt;{msg.from}&gt;</span>
                    </div>
                    <span style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted }}>{msg.time}</span>
                  </div>
                  <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                </div>
              ))}
            </div>

            {/* Reply */}
            <div style={{ borderTop: `1px solid ${colors.borderLight}`, paddingTop: 12 }}>
              <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply..." rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textPrimary, backgroundColor: colors.bgPrimary, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, backgroundColor: 'transparent', fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, cursor: 'pointer' }}>📎 Attach</button>
                  <button style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${colors.borderLight}`, backgroundColor: 'transparent', fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, cursor: 'pointer' }}>🎫 Link Ticket</button>
                </div>
                <button style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}>Send Reply</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {composeOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setComposeOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: colors.bgSurface, borderRadius: 'var(--radius-lg)', padding: '24px', width: '100%', maxWidth: 520, boxShadow: '0 16px 48px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: fonts.heading, fontSize: 'var(--text-lg)', fontWeight: 700, color: colors.textPrimary, margin: 0 }}>Compose Email</h3>
              <button onClick={() => setComposeOpen(false)} style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer', fontSize: 'var(--text-lg)' }}>✕</button>
            </div>
            <input value={composeData.to} onChange={(e) => setComposeData({ ...composeData, to: e.target.value })} placeholder="To: email@example.com" style={{ width: '100%', padding: '10px 14px', marginBottom: 10, borderRadius: 'var(--radius-md)', border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-sm)', outline: 'none', color: colors.textPrimary, boxSizing: 'border-box' }} />
            <input value={composeData.subject} onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })} placeholder="Subject" style={{ width: '100%', padding: '10px 14px', marginBottom: 10, borderRadius: 'var(--radius-md)', border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-sm)', outline: 'none', color: colors.textPrimary, boxSizing: 'border-box' }} />
            <textarea value={composeData.body} onChange={(e) => setComposeData({ ...composeData, body: e.target.value })} placeholder="Write your message..." rows={6} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-sm)', outline: 'none', color: colors.textPrimary, resize: 'vertical', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button onClick={() => setComposeOpen(false)} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${colors.borderLight}`, backgroundColor: 'transparent', fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, cursor: 'pointer' }}>Cancel</button>
              <button style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}>Send Email</button>
            </div>
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {smsOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSmsOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: colors.bgSurface, borderRadius: 'var(--radius-lg)', padding: '24px', width: '100%', maxWidth: 400, boxShadow: '0 16px 48px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: fonts.heading, fontSize: 'var(--text-lg)', fontWeight: 700, color: colors.textPrimary, margin: 0 }}>Send SMS</h3>
              <button onClick={() => setSmsOpen(false)} style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer', fontSize: 'var(--text-lg)' }}>✕</button>
            </div>
            <input value={smsData.to} onChange={(e) => setSmsData({ ...smsData, to: e.target.value })} placeholder="Phone number: +1 555-123-4567" style={{ width: '100%', padding: '10px 14px', marginBottom: 10, borderRadius: 'var(--radius-md)', border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-sm)', outline: 'none', color: colors.textPrimary, boxSizing: 'border-box' }} />
            <textarea value={smsData.message} onChange={(e) => setSmsData({ ...smsData, message: e.target.value })} placeholder="Message (160 chars max)" rows={3} maxLength={160} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${colors.borderLight}`, fontFamily: fonts.body, fontSize: 'var(--text-sm)', outline: 'none', color: colors.textPrimary, resize: 'none', boxSizing: 'border-box' }} />
            <div style={{ fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, marginTop: 4, textAlign: 'right' }}>{smsData.message.length}/160</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button onClick={() => setSmsOpen(false)} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${colors.borderLight}`, backgroundColor: 'transparent', fontFamily: fonts.body, fontSize: 'var(--text-xs)', color: colors.textMuted, cursor: 'pointer' }}>Cancel</button>
              <button style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: 'var(--button-gradient)', color: '#fff', border: 'none', fontFamily: fonts.body, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}>Send SMS</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailInboxPage;
