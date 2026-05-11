import React, { useState, useCallback, useRef, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const suggestions = [
  'Show top bundles by revenue',
  'Suggest a new bundle combination',
  'Which bundles have high churn?',
  'Compare bundle performance',
  'Recommend optimal discount',
  'Show seasonal bundle trends',
  'List bundles expiring soon',
  'Best product pairings',
];

const getAIResponse = (query) => {
  const q = query.toLowerCase();
  if (q.includes('revenue') || q.includes('top')) return '📊 Top bundles by revenue: Family Entertainment Pack ($78M), Premium All-Access ($52M), Sports + Live Events ($45M). Total bundle MRR: $208M.';
  if (q.includes('suggest') || q.includes('new') || q.includes('combination')) return '📦 AI Suggestion: "Weekend Binge Bundle" — OTT Basic + Live Concert + Sports highlights. Price: $19.99/mo (22% discount). Projected: 680K subs in Q1 based on viewing patterns.';
  if (q.includes('churn') || q.includes('high')) return '📉 High churn bundles: Holiday Special Combo (8.2% monthly churn). Root cause: seasonal content expiry. Recommendation: Convert to evergreen with rotating content.';
  if (q.includes('compare') || q.includes('performance')) return '📈 Bundle performance: Family Pack leads in retention (97.2%), Student Starter leads in growth (+34.7%), Premium All-Access leads in ARPU ($58.40/user).';
  if (q.includes('discount') || q.includes('optimal')) return '💰 Optimal discount analysis: 15-20% yields best LTV. Current avg: 26%. Reducing Holiday Combo from 30% to 20% could increase margin by $2.4M/quarter.';
  if (q.includes('seasonal') || q.includes('trend')) return '📅 Seasonal trends: Q4 bundle signups +45% (holiday effect). Sports bundles peak during tournament seasons (+62%). Recommend pre-launch campaigns 3 weeks before events.';
  if (q.includes('expir')) return '⏰ Expiring soon: Holiday Special Combo (expires in 14 days, 450K active subs). Action needed: Send renewal offers or migrate to evergreen bundle.';
  if (q.includes('pair')) return '🔗 Best product pairings (by co-subscription data): OTT Basic + Sports Plus (72% overlap), Live Concert + Premium (58% overlap). Untapped opportunity: News + Sports (only 12% bundled).';
  return '🤖 I can help with bundle analytics, combination suggestions, discount optimization, churn analysis, and performance comparisons. Try asking about specific bundles or metrics!';
};

const BundleVoiceInputBar = () => {
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
    <div style={styles.root} role="region" aria-label="AI Bundle Assistant">
      <div style={styles.chatArea}>
        {chatOpen && chatHistory.length === 0 && (
          <div style={styles.emptyState}>
            🤖 AI Bundle Assistant — ask about bundle performance, combinations, discounts, or get recommendations
          </div>
        )}
        {chatHistory.map((msg, i) => (
          <div key={i} style={msg.role === 'user' ? styles.msgUser : styles.msgAi}>
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.suggestionsRow}>
        {suggestions.map((s, i) => (
          <button key={i} style={styles.chip} onClick={() => handleSend(s)}>{s}</button>
        ))}
      </div>

      <div style={styles.inputRow}>
        <div style={styles.avatar}>✦</div>
        <input
          style={styles.input}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder='Ask AI: "Suggest bundle", "Compare performance", "Optimal discount"...'
          aria-label="Ask AI bundle assistant"
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

export default BundleVoiceInputBar;
