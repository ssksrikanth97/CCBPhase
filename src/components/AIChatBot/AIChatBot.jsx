import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MicIcon from '@material-ui/icons/Mic';
import OpenInFullIcon from '@material-ui/icons/OpenInNew';
import CloseIcon from '@material-ui/icons/Close';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import SendIcon from '@material-ui/icons/Send';
import ChatIcon from '@material-ui/icons/Chat';
import './AIChatBot.css';

const useCaseSuggestions = {
  '/catalogue/products': ['Show top performing products', 'Analyse churn rate', 'Suggest a new bundle'],
  '/dashboard': ['Show revenue forecast', 'Compare monthly users', 'What drives churn?', 'Regional growth'],
  '/configuration': ['Switch theme', 'Reset settings', 'Export config'],
};

const contextPlaceholders = {
  '/catalogue/products': 'Ask AI: "Show revenue", "Analyse churn", "Suggest bundle"...',
  '/dashboard': 'Ask AI: "Forecast revenue", "Growth insights", "Churn drivers"...',
  '/configuration': 'Ask AI: "Change theme", "Reset settings"...',
};

const getAIResponse = (query) => {
  const q = query.toLowerCase();
  if (q.includes('revenue')) return '📊 Total monthly revenue is $127M, up 8.2% from last month.';
  if (q.includes('churn')) return '📉 Current churn rate is 2.4%, down 0.3%. Recommend maintaining current strategy.';
  if (q.includes('subscriber') || q.includes('growth')) return '📈 Total subscribers: 6.8M (+12.4% MoM).';
  if (q.includes('pricing') || q.includes('price')) return '💰 Recommended: $9.99/mo basic, $14.99/mo standard, $19.99/mo premium.';
  if (q.includes('bundle')) return '📦 Suggested: "Sports + Live Events Pack" at $24.99/month.';
  if (q.includes('forecast')) return '🔮 Revenue forecast next quarter: $142M (+11.8%).';
  if (q.includes('theme')) return '🎨 Available: "Retro" and "Trendy". Go to Configuration to switch.';
  return '🤖 I can help with product analytics, pricing, and recommendations. Try asking about revenue or churn.';
};

const AIChatBot = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const chatEndRef = useRef(null);

  const hiddenRoutes = ['/catalogue/products'];
  const isHiddenRoute = hiddenRoutes.includes(location.pathname);

  const placeholder = contextPlaceholders[location.pathname] || 'Ask AI anything...';
  const suggestions = useCaseSuggestions[location.pathname] || useCaseSuggestions['/dashboard'];

  useEffect(() => {
    if (chatEndRef.current && expanded) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, expanded]);

  const handleSend = useCallback((text) => {
    const query = text || message;
    if (!query.trim()) return;
    setChatHistory((prev) => [...prev, { role: 'user', content: query.trim() }, { role: 'ai', content: getAIResponse(query) }]);
    setMessage('');
    setShowSuggestions(false);
    if (!expanded) setExpanded(true);
  }, [message, expanded]);

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  if (isHiddenRoute) return null;

  // FAB only (chat closed)
  if (!open) {
    return (
      <button className="chatbot-fab" onClick={() => setOpen(true)} aria-label="Open AI Assistant">
        <span className="chatbot-fab__icon">✦</span>
        <span className="chatbot-fab__label">EVA</span>
      </button>
    );
  }

  return (
    <>
      <footer className={`chatbot ${expanded ? 'chatbot--expanded' : ''}`} role="region" aria-label="AI Assistant">
        {expanded && (
          <div className="chatbot__chat-area">
            {chatHistory.length === 0 && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-muted-tan)', textAlign: 'center', padding: '8px 0' }}>
                AI-powered assistant — ask about products, analytics, or pricing
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: msg.role === 'user' ? '70%' : '80%',
                backgroundColor: msg.role === 'user' ? 'rgba(78,205,196,0.15)' : 'rgba(255,255,255,0.08)',
                color: 'var(--text-on-dark)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                padding: '8px 14px',
                borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                lineHeight: 1.5,
              }}>
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        {showSuggestions && (
          <div className="chatbot__suggestions">
            {suggestions.map((s, i) => (
              <button key={i} className="chatbot__suggestion-chip" onClick={() => handleSend(s)}>{s}</button>
            ))}
          </div>
        )}

        <div className="chatbot__input-row">
          <div className="chatbot__avatar">✦</div>
          <input
            className="chatbot__input"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            aria-label="Ask AI assistant"
          />
          <div className="chatbot__actions">
            <button className="chatbot__icon-btn" onClick={() => setExpanded(!expanded)}><OpenInFullIcon style={{ fontSize: 18 }} /></button>
            <div className="chatbot__divider" />
            <button className="chatbot__icon-btn" onClick={() => setShowSuggestions(!showSuggestions)}><AutorenewIcon style={{ fontSize: 18 }} /></button>
            <button className="chatbot__icon-btn"><MicIcon style={{ fontSize: 18 }} /></button>
            <div className="chatbot__divider" />
            <button className="chatbot__send-btn" onClick={() => handleSend()} disabled={!message.trim()}>
              <SendIcon style={{ fontSize: 14 }} /> Send
            </button>
            <button className="chatbot__icon-btn" onClick={() => { setOpen(false); setExpanded(false); }}><CloseIcon style={{ fontSize: 18 }} /></button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AIChatBot;
