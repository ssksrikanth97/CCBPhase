import React, { useState, useCallback, useRef, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const suggestions = [
  'Show VIP customers',
  'Analyse churn risk by segment',
  'Which customers have overdue invoices?',
  'Show top customers by revenue',
  'List suspended accounts',
  'Customer growth by region',
  'Recommend win-back targets',
  'Average subscription per customer',
];

const getAIResponse = (query) => {
  const q = query.toLowerCase();
  if (q.includes('vip')) return '⭐ VIP Customers: James Anderson (NY, $26.98/mo), Carlos Rodriguez (Madrid, $32.97/mo). Total VIP revenue: $59.95/mo. VIP segment has 0% churn rate.';
  if (q.includes('churn') && q.includes('risk')) return '📉 Churn risk analysis:\n• High risk: David Kim (Churned, Seoul) — inactive since Dec 2024\n• Medium risk: Emma Williams (Suspended, London) — payment failed\n• Low risk: All Active customers with auto-reload enabled';
  if (q.includes('overdue') || q.includes('invoice')) return '⚠️ Overdue invoices: Emma Williams (INV-801, $18.99, due Mar 15). Recommend: Send payment reminder + offer payment plan.';
  if (q.includes('top') && q.includes('revenue')) return '💰 Top customers by monthly spend:\n1. Carlos Rodriguez — $32.97/mo (3 plans)\n2. James Anderson — $26.98/mo (2 plans)\n3. Lisa Thompson — $22.98/mo (2 plans)\n4. Priya Sharma — $19.98/mo (2 plans)';
  if (q.includes('suspended')) return '🔒 Suspended accounts: Emma Williams (London) — reason: payment failure on Mar 1, 2025. Last successful payment: Feb 1. Recommendation: Contact for payment method update.';
  if (q.includes('growth') || q.includes('region')) return '📈 Customer growth by region:\n• North America: 3 customers (37.5%)\n• Asia Pacific: 3 customers (37.5%)\n• Europe: 2 customers (25%)\nFastest growing: Asia Pacific (+2 in last 6 months)';
  if (q.includes('win-back') || q.includes('winback')) return '🎯 Win-back targets:\n1. David Kim (Seoul) — churned Dec 2024, was on Basic plan. Suggest: 30% discount + Sports add-on trial\n2. Emma Williams (London) — suspended, payment issue. Suggest: Payment plan + 1 month free';
  if (q.includes('average') || q.includes('subscription')) return '📊 Average subscriptions per customer: 1.75 plans. VIP avg: 2.5 plans, Premium avg: 1.75 plans, Standard avg: 1.33 plans. Upsell opportunity: Standard segment.';
  if (q.includes('segment')) return '👥 Customer segments:\n• VIP: 2 customers (25%) — highest ARPU\n• Premium: 3 customers (37.5%) — growth segment\n• Standard: 3 customers (37.5%) — upsell opportunity';
  if (q.includes('device')) return '📱 Device distribution: Mobile (8), TV (6), Tablet (3), Desktop (2). Avg devices per customer: 2.4. Most popular: iPhone (3 users).';
  if (q.includes('wallet') || q.includes('balance')) return '💳 Wallet overview: Total balance across customers: $93.30. Auto-reload enabled: 4 customers (50%). Avg balance: $11.66.';
  return '🤖 I can help with customer analytics, churn risk, revenue insights, segment analysis, and win-back recommendations. Try asking about VIP customers or churn risk!';
};

const CustomerVoiceInputBar = () => {
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
      whiteSpace: 'pre-line',
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
    <div style={styles.root} role="region" aria-label="AI Customer Assistant">
      {/* Chat history */}
      <div style={styles.chatArea}>
        {chatOpen && chatHistory.length === 0 && (
          <div style={styles.emptyState}>
            🤖 AI Customer Assistant — ask about segments, churn risk, revenue, or get win-back recommendations
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
          placeholder='Ask AI: "Show VIP customers", "Churn risk", "Win-back targets"...'
          aria-label="Ask AI customer assistant"
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

export default CustomerVoiceInputBar;
