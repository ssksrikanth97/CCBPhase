import React, { useState, useCallback, useRef, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { useThemeContext } from '../../../../styles/ThemeContext';
import { rgba } from '../../../../styles/utils';

const suggestions = [
  'Show active promotions performance',
  'Which promo has best conversion?',
  'Suggest a new promotion',
  'Compare discount vs free trial',
  'Revenue impact of referrals',
  'Expiring promotions this month',
  'Optimal discount percentage',
  'Top promo codes by redemption',
];

const getAIResponse = (query) => {
  const q = query.toLowerCase();
  if (q.includes('active') || q.includes('performance')) return '📊 Active promotions: 4 running. Best performer: New User Welcome (28.1K redemptions, 78% conversion). Total promo-driven revenue: $12M this month.';
  if (q.includes('conversion') || q.includes('best')) return '🎯 Best conversion: WELCOME14 (78% trial-to-paid), REFER2025 (64% referral conversion), SUMMER30 (42% click-to-redeem). Industry avg: 35%.';
  if (q.includes('suggest') || q.includes('new')) return '💡 AI Suggestion: "Win-Back Campaign" — target churned users (90+ days inactive) with 60% off for 3 months. Projected: 12K reactivations, $890K incremental revenue.';
  if (q.includes('compare') || q.includes('vs')) return '📈 Discount vs Free Trial: Free trials yield 2.3x higher LTV ($142 vs $62). Discounts drive 3.1x more volume. Recommendation: Use trials for premium, discounts for basic tier.';
  if (q.includes('referral') || q.includes('revenue impact')) return '🔗 Referral program impact: $3.1M revenue, 15.3K redemptions, viral coefficient 1.4. Each referrer brings 1.4 new users on average. CAC via referral: $8 vs $24 paid acquisition.';
  if (q.includes('expir')) return '⏰ Expiring this month: Student Discount (22.6K active users affected). Recommendation: Auto-renew with 35% discount to retain 80%+ of subscribers.';
  if (q.includes('optimal') || q.includes('percentage')) return '💰 Optimal discount analysis: 20-30% yields best ROI. Below 15%: low uptake. Above 40%: margin erosion. Sweet spot for your audience: 25% with 3-month commitment.';
  if (q.includes('top') || q.includes('code') || q.includes('redemption')) return '🏆 Top codes: WELCOME14 (28.1K), STUDENT40 (22.6K), REFER2025 (15.3K), SUMMER30 (12.4K). Fastest growing: SUMMER30 (+45% week-over-week).';
  return '🤖 I can help with promotion analytics, conversion optimization, campaign suggestions, A/B test insights, and revenue impact analysis. Try asking about specific promotions or metrics!';
};

const PromotionVoiceInputBar = () => {
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
    <div style={styles.root} role="region" aria-label="AI Promotion Assistant">
      <div style={styles.chatArea}>
        {chatOpen && chatHistory.length === 0 && (
          <div style={styles.emptyState}>
            🤖 AI Promotion Assistant — ask about conversion rates, campaign ideas, or revenue impact
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
          placeholder='Ask AI: "Best conversion", "Suggest campaign", "Revenue impact"...'
          aria-label="Ask AI promotion assistant"
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

export default PromotionVoiceInputBar;
