import React, { useState, useCallback, useRef, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const suggestions = [
  'Show critical tickets',
  'SLA breaches today',
  'Assign unassigned tickets',
  'Escalation needed',
  'Average resolution time',
];

const getAIResponse = (query) => {
  const q = query.toLowerCase();
  if (q.includes('critical')) return '🚨 3 Critical tickets open: RVT436 (Login failure), RVT440 (App crash iOS 18), RVT442 (Payment gateway down). Average age: 2.4 hours. Recommend immediate escalation for RVT442.';
  if (q.includes('sla') || q.includes('breach')) return '⏱ SLA Breaches Today: 2 tickets breached — RVT435 (exceeded by 12m), RVT440 (exceeded by 5m). 4 tickets at risk within next 30 minutes. Suggest reassigning to available agents.';
  if (q.includes('unassigned') || q.includes('assign')) return '👤 5 unassigned tickets found: RVT443, RVT444, RVT445, RVT446, RVT447. Categories: 2 Billing, 2 Technical, 1 Account. AI Recommendation: Auto-assign based on agent expertise and current load.';
  if (q.includes('escalat')) return '🔺 Escalation needed for 3 tickets: RVT436 (Critical, no response 45m), RVT440 (Critical, SLA breached), RVT437 (High priority billing, customer VIP). Suggested escalation path: L2 Support → Engineering Lead.';
  if (q.includes('resolution') || q.includes('average')) return '📊 Average Resolution Time: Critical — 1.8h, High — 4.2h, Medium — 8.5h. This week vs last: Critical improved 22%, High improved 8%, Medium unchanged. Top performer: Tech Team (1.2h avg).';
  if (q.includes('open')) return '📋 12 Open tickets: 3 Critical, 4 High, 5 Medium. Oldest open ticket: RVT431 (3 days). Most common category: Technical (5 tickets). Recommend triaging RVT431 immediately.';
  if (q.includes('trend') || q.includes('volume')) return '📈 Ticket volume trend: Today 18 new (+12% vs yesterday). Peak hour: 10-11 AM. Top category: Technical (38%). Predicted volume next hour: 4-6 tickets.';
  if (q.includes('customer') || q.includes('repeat')) return '🔄 Repeat customers: 4 customers with 3+ tickets this month. Top: Srikanth (5 tickets), Sarah Johnson (4 tickets). Recommend proactive outreach for retention.';
  return '🤖 I can help with ticket analytics, SLA monitoring, assignment suggestions, escalation alerts, and resolution metrics. Try asking about specific ticket statuses or performance!';
};

const TicketVoiceInputBar = () => {
  const { colors, fonts, shadows, buttonGradient } = useThemeContext();
  const [message, setMessage] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current && chatOpen) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatOpen]);

  const handleSend = useCallback((text) => {
    const query = text || message;
    if (!query.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      { role: 'user', content: query.trim() },
      { role: 'ai', content: getAIResponse(query) },
    ]);
    setMessage('');
    setShowSuggestions(false);
    if (!chatOpen) setChatOpen(true);
  }, [message, chatOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const styles = {
    root: {
      backgroundColor: colors.bgSurface, borderRadius: 16,
      marginBottom: 28, border: `1.5px solid ${colors.borderLight}`, boxShadow: shadows.sm,
      overflow: 'hidden', transition: 'all 0.3s ease',
    },
    chatArea: {
      maxHeight: chatOpen ? 280 : 0, overflowY: 'auto',
      padding: chatOpen ? '16px 20px' : '0 20px',
      display: 'flex', flexDirection: 'column', gap: 10,
      transition: 'all 0.3s ease',
      borderBottom: chatOpen ? `1px solid ${colors.borderLight}` : 'none',
    },
    msgUser: {
      alignSelf: 'flex-end', maxWidth: '75%',
      backgroundColor: rgba(colors.accentPrimary, 0.1),
      color: colors.textPrimary, fontFamily: fonts.body, fontSize: 'var(--text-sm)',
      padding: '8px 14px', borderRadius: '12px 12px 4px 12px', lineHeight: 1.5,
    },
    msgAi: {
      alignSelf: 'flex-start', maxWidth: '85%',
      backgroundColor: rgba(colors.accentSecondary, 0.08),
      color: colors.textPrimary, fontFamily: fonts.body, fontSize: 'var(--text-sm)',
      padding: '8px 14px', borderRadius: '12px 12px 12px 4px', lineHeight: 1.5,
    },
    suggestionsRow: {
      display: showSuggestions ? 'flex' : 'none',
      gap: 8, padding: '10px 20px', overflowX: 'auto',
      borderBottom: `1px solid ${colors.borderLight}`,
    },
    chip: {
      flexShrink: 0, padding: '6px 12px', borderRadius: 14,
      backgroundColor: rgba(colors.accentSecondary, 0.08),
      color: colors.accentSecondaryDark, fontFamily: fonts.body, fontSize: 'var(--text-xs)',
      border: `1px solid ${rgba(colors.accentSecondary, 0.2)}`,
      cursor: 'pointer', whiteSpace: 'nowrap',
    },
    inputRow: {
      display: 'flex', alignItems: 'center', padding: '12px 20px', gap: 12,
    },
    avatar: {
      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#ffffff', fontSize: 'var(--text-md)', fontWeight: 700,
    },
    input: {
      flex: 1, border: 'none', outline: 'none',
      fontFamily: fonts.body, fontSize: 'var(--text-base)',
      color: colors.textPrimary, backgroundColor: 'transparent', padding: '8px 0',
    },
    sendBtn: {
      width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
      background: buttonGradient || colors.accentPrimary,
      color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: message.trim() ? 1 : 0.5,
    },
    micBtn: {
      width: 36, height: 36, borderRadius: 10,
      backgroundColor: colors.bgPrimary, color: colors.textSecondary,
      border: `1.5px solid ${colors.borderLight}`,
    },
    closeBtn: {
      width: 32, height: 32, color: colors.textMuted, borderRadius: 8,
    },
    emptyState: {
      fontFamily: fonts.body, fontSize: 'var(--text-sm)', color: colors.textMuted,
      textAlign: 'center', padding: '12px 0',
    },
  };

  return (
    <div style={styles.root} role="region" aria-label="AI Ticket Assistant">
      {/* Chat history */}
      <div style={styles.chatArea}>
        {chatOpen && chatHistory.length === 0 && (
          <div style={styles.emptyState}>
            🤖 AI Ticket Assistant — ask about SLA breaches, escalations, assignments, or resolution metrics
          </div>
        )}
        {chatHistory.map((msg, i) => (
          <div key={i} style={msg.role === 'user' ? styles.msgUser : styles.msgAi}>
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      <div style={styles.suggestionsRow}>
        {suggestions.map((s, i) => (
          <button key={i} style={styles.chip} onClick={() => handleSend(s)}>{s}</button>
        ))}
      </div>

      {/* Input row */}
      <div style={styles.inputRow}>
        <div style={styles.avatar}>✦</div>
        <input
          style={styles.input}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder='Ask AI: "Show critical tickets", "SLA breaches", "Escalation needed"...'
          aria-label="Ask AI ticket assistant"
        />
        <IconButton style={styles.micBtn} size="small" aria-label="Voice input">
          <MicIcon style={{ fontSize: 18 }} />
        </IconButton>
        <button style={styles.sendBtn} onClick={() => handleSend()} disabled={!message.trim()} aria-label="Send">
          <SendIcon style={{ fontSize: 18 }} />
        </button>
        {chatOpen && (
          <IconButton style={styles.closeBtn} size="small" onClick={() => { setChatOpen(false); setChatHistory([]); }} aria-label="Close chat">
            <CloseIcon style={{ fontSize: 18 }} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default TicketVoiceInputBar;
