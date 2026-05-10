import React, { useState, useCallback, useRef, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const suggestions = [
  'Show top products by revenue',
  'Analyse churn for streaming packs',
  'Compare subscriber growth',
  'Suggest a new product bundle',
  'Which product has highest engagement?',
  'Show revenue trends last 6 months',
  'Recommend pricing for a new pack',
  'List products with low churn',
];

const getAIResponse = (query) => {
  const q = query.toLowerCase();
  if (q.includes('revenue')) return '📊 Top by revenue: OTT Streaming Basic ($127M), Exclusive Premier Launch ($95M), Live Concert Pass ($89M). Total MRR: $311M.';
  if (q.includes('churn')) return '📉 Churn analysis: OTT Basic has Low Churn (2.1%), Live Concert has Medium Churn (4.8%). Recommend retention campaign for concert subscribers.';
  if (q.includes('subscriber') || q.includes('growth')) return '📈 Growth leaders: Exclusive Premier +31.2%, OTT Basic +25.4%, Live Concert +18.7%. Total subscribers: 7.44M.';
  if (q.includes('bundle') || q.includes('suggest')) return '📦 AI Suggestion: "Sports + Live Events Bundle" — combine live streaming with on-demand replays. Price: $24.99/mo. Projected: 450K subs in Q1.';
  if (q.includes('engagement') || q.includes('highest')) return '🎯 Highest engagement: OTT Streaming Basic (87% daily active rate). AI Insight: Maintain current strategy.';
  if (q.includes('trend')) return '📈 6-month trend: Revenue up 18.5%, subscribers up 22.3%. Strongest growth in Asia Pacific (+28% QoQ).';
  if (q.includes('pricing') || q.includes('price')) return '💰 Pricing recommendation: Basic $9.99/mo, Standard $14.99/mo, Premium $19.99/mo. Recurring model outperforms one-time by 3.2x LTV.';
  if (q.includes('low churn')) return '✅ Low churn products: OTT Streaming Basic (2.1%), Exclusive Premier Launch (1.8%). Both benefit from strong content libraries.';
  return '🤖 I can help with product analytics, revenue insights, churn analysis, pricing recommendations, and bundle suggestions. Try asking about specific metrics!';
};

const VoiceInputBar = () => {
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
    <div style={styles.root} role="region" aria-label="AI Product Assistant">
      {/* Chat history */}
      <div style={styles.chatArea}>
        {chatOpen && chatHistory.length === 0 && (
          <div style={styles.emptyState}>
            🤖 AI Product Assistant — ask about revenue, churn, pricing, or get recommendations
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
          placeholder='Ask AI: "Show revenue", "Analyse churn", "Suggest bundle"...'
          aria-label="Ask AI product assistant"
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

export default VoiceInputBar;
