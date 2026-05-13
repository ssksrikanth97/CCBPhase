import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import MicIcon from '@material-ui/icons/Mic';
import OpenInFullIcon from '@material-ui/icons/OpenInNew';
import CloseIcon from '@material-ui/icons/Close';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import SendIcon from '@material-ui/icons/Send';
import ChatIcon from '@material-ui/icons/Chat';
import './AIChatBot.css';

const useCaseSuggestions = {
  '/catalogue/products': ['Create a new product', 'Edit product pricing', 'Show top performing products', 'Suggest product category'],
  '/catalogue/products/create': ['Help me fill product details', 'Suggest a price for streaming', 'What category fits best?', 'Recommend subscription type'],
  '/catalogue/bundles': ['Create a new bundle', 'Edit bundle discount', 'Suggest bundle combinations', 'Show bundle performance'],
  '/catalogue/bundles/create': ['Help me configure this bundle', 'Suggest products to include', 'Recommend a discount strategy', 'What bundle type works best?'],
  '/catalogue/promotions': ['Create a new promotion', 'Edit promo discount', 'Suggest target audience', 'Show promo effectiveness'],
  '/catalogue/promotions/create': ['Help me set up this promo', 'Suggest a promo code', 'Recommend discount percentage', 'Which audience to target?'],
  '/dashboard': ['Show revenue forecast', 'Compare monthly users', 'What drives churn?', 'Regional growth'],
  '/configuration': ['Switch theme', 'Reset settings', 'Export config'],
};

const contextPlaceholders = {
  '/catalogue/products': 'Ask AI: "Create product", "Edit pricing", "Suggest category"...',
  '/catalogue/products/create': 'Ask AI: "Suggest price", "Help with fields", "Recommend type"...',
  '/catalogue/bundles': 'Ask AI: "Create bundle", "Edit discount", "Suggest combo"...',
  '/catalogue/bundles/create': 'Ask AI: "Add products", "Set discount", "Bundle type"...',
  '/catalogue/promotions': 'Ask AI: "Create promo", "Edit discount", "Target audience"...',
  '/catalogue/promotions/create': 'Ask AI: "Promo code", "Set discount", "Choose audience"...',
  '/dashboard': 'Ask AI: "Forecast revenue", "Growth insights", "Churn drivers"...',
  '/configuration': 'Ask AI: "Change theme", "Reset settings"...',
};

const getAIResponse = (query, pathname) => {
  const q = query.toLowerCase();

  // --- Product create/edit use cases ---
  if (q.includes('create') && q.includes('product')) {
    return '🛒 To create a product, navigate to Catalogue → Products → Create. You\'ll need: Product name, Category (Video/Audio/Sports/News/Entertainment), Subscription type, Service type, Price, and SKU. Want me to take you there?';
  }
  if (q.includes('edit') && q.includes('product')) {
    return '✏️ To edit a product, go to Catalogue → Products, find the product in the list, and click to open it. You can modify name, category, pricing, subscription type, and validity dates.';
  }
  if (q.includes('help') && q.includes('product') && q.includes('detail')) {
    return '📋 Product fields:\n• Product name – descriptive title\n• Category – Video, Audio, Sports, News, Entertainment\n• Subscription – Recurring, One-time, or Trial\n• Service type – Streaming, Live TV, On-demand, PPV\n• Price type – Fixed, Usage-based, Tiered, Freemium\n• Product type – Digital, Physical, Hybrid, Add-on\n• Unit – Per month/year/event/GB/user\n• Pro rate – Daily, Weekly, or None';
  }
  if ((q.includes('suggest') || q.includes('recommend')) && q.includes('price') && (q.includes('stream') || pathname.includes('product'))) {
    return '💰 For streaming products, recommended pricing:\n• Basic (SD): $7.99/mo\n• Standard (HD): $12.99/mo\n• Premium (4K): $18.99/mo\nConsider offering annual plans at 15-20% discount.';
  }
  if (q.includes('suggest') && q.includes('category')) {
    return '📂 Based on current market trends, top categories are:\n1. Entertainment (highest demand)\n2. Sports (growing 18% YoY)\n3. News (steady subscriber base)\n4. Education (emerging segment)\nChoose based on your content library strength.';
  }
  if (q.includes('recommend') && q.includes('subscription')) {
    return '🔄 Subscription recommendations:\n• Recurring – best for ongoing content (movies, series)\n• One-time – ideal for PPV events or single purchases\n• Trial – use 7-14 day trials to convert new users (avg 34% conversion rate)';
  }

  // --- Bundle create/edit use cases ---
  if (q.includes('create') && q.includes('bundle')) {
    return '📦 To create a bundle, navigate to Catalogue → Bundles → Create. You\'ll need: Category, Bundle type (Fixed/Flexible/Seasonal/Custom), Products to include, Discount type, Price, and SKU. Want me to take you there?';
  }
  if (q.includes('edit') && q.includes('bundle')) {
    return '✏️ To edit a bundle, go to Catalogue → Bundles, find the bundle in the list, and click to modify. You can change included products, discount, pricing, and validity dates.';
  }
  if (q.includes('help') && q.includes('bundle') || (q.includes('configure') && q.includes('bundle'))) {
    return '📋 Bundle fields:\n• Category – Entertainment, Sports, News, Education, Lifestyle\n• Bundle type – Fixed, Flexible, Seasonal, Custom\n• Products – select products to include\n• Discount type – Percentage, Flat amount, Tiered\n• Discount – the discount value\n• Price – final bundle price\n• SKU – unique identifier\n• Validity end date – when the bundle expires';
  }
  if ((q.includes('suggest') || q.includes('recommend')) && q.includes('product') && q.includes('include')) {
    return '📦 Recommended bundle combinations:\n1. "Sports + Live Events" – high engagement\n2. "Entertainment + News" – broad appeal\n3. "Video + Audio Premium" – upsell opportunity\n4. "Family Pack" (all categories) – highest ARPU\nTip: Include 3-5 products for optimal perceived value.';
  }
  if (q.includes('discount') && q.includes('strateg')) {
    return '💡 Discount strategy recommendations:\n• Percentage (15-25%) – best for high-value bundles\n• Flat amount ($5-$10 off) – works for mid-tier bundles\n• Tiered – reward longer commitments (10%/15%/20% for 3/6/12 months)\nAvg bundle discount in market: 18%.';
  }
  if (q.includes('bundle type') || (q.includes('what') && q.includes('type') && q.includes('bundle'))) {
    return '📦 Bundle types explained:\n• Fixed – set products, no customization (simple, predictable)\n• Flexible – user picks X of Y products (higher satisfaction)\n• Seasonal – time-limited themed bundles (drives urgency)\n• Custom – fully user-configured (premium segment)\nFixed bundles have highest attach rate (42%).';
  }

  // --- Promotion create/edit use cases ---
  if (q.includes('create') && q.includes('promo')) {
    return '🎯 To create a promotion, navigate to Catalogue → Promotions → Create. You\'ll need: Promo type (Discount/Free Trial/Cashback/Referral/Bundle Offer), Target audience, Discount value, Promo code, and Applicable products. Want me to take you there?';
  }
  if (q.includes('edit') && q.includes('promo')) {
    return '✏️ To edit a promotion, go to Catalogue → Promotions, find the promo in the list, and click to modify. You can change discount, audience, validity, and applicable products.';
  }
  if (q.includes('help') && q.includes('promo') || (q.includes('set up') && q.includes('promo'))) {
    return '📋 Promotion fields:\n• Promo type – Discount, Free Trial, Cashback, Referral, Bundle Offer\n• Discount – percentage or amount off\n• Promo code – unique code for redemption\n• Target audience – All, New, Existing, Churned, VIP\n• Applicable to – All Products, Specific Products, Bundles Only, Premium Tier\n• Min purchase – minimum spend to qualify\n• Max uses – redemption limit\n• End date – promotion expiry';
  }
  if ((q.includes('suggest') || q.includes('recommend')) && q.includes('promo code')) {
    return '🏷️ Promo code suggestions:\n• WELCOME20 – 20% off for new users\n• COMEBACK15 – 15% for churned users\n• BUNDLE10 – $10 off any bundle\n• REFER25 – 25% for referral rewards\n• FLASH50 – 50% limited-time flash sale\nTip: Keep codes short, memorable, and action-oriented.';
  }
  if ((q.includes('suggest') || q.includes('recommend') || q.includes('which')) && q.includes('audience')) {
    return '👥 Target audience recommendations:\n• New Users – Free Trial or 20-30% discount (best for acquisition)\n• Churned Users – Cashback or 25%+ discount (win-back)\n• Existing Users – Referral rewards or bundle upgrades\n• VIP – Exclusive early access or premium perks\n• All Subscribers – seasonal promos only (protect margins)';
  }
  if (q.includes('recommend') && q.includes('discount') && (q.includes('percent') || pathname.includes('promotion'))) {
    return '💸 Discount recommendations by goal:\n• Acquisition: 20-30% (sweet spot for conversion)\n• Retention: 10-15% (maintain perceived value)\n• Win-back: 25-40% (aggressive but effective)\n• Upsell: 15-20% on premium tier\nAvoid >50% – damages brand perception.';
  }

  // --- Navigation helpers ---
  if (q.includes('take me') || q.includes('go to') || q.includes('navigate')) {
    if (q.includes('product') && q.includes('create')) return '__NAV__/catalogue/products/create';
    if (q.includes('product')) return '__NAV__/catalogue/products';
    if (q.includes('bundle') && q.includes('create')) return '__NAV__/catalogue/bundles/create';
    if (q.includes('bundle')) return '__NAV__/catalogue/bundles';
    if (q.includes('promo') && q.includes('create')) return '__NAV__/catalogue/promotions/create';
    if (q.includes('promo')) return '__NAV__/catalogue/promotions';
  }

  // --- General responses ---
  if (q.includes('revenue')) return '📊 Total monthly revenue is $127M, up 8.2% from last month.';
  if (q.includes('churn')) return '📉 Current churn rate is 2.4%, down 0.3%. Recommend maintaining current strategy.';
  if (q.includes('subscriber') || q.includes('growth')) return '📈 Total subscribers: 6.8M (+12.4% MoM).';
  if (q.includes('pricing') || q.includes('price')) return '💰 Recommended: $9.99/mo basic, $14.99/mo standard, $19.99/mo premium.';
  if (q.includes('bundle')) return '📦 Suggested: "Sports + Live Events Pack" at $24.99/month. I can also help you create or edit bundles.';
  if (q.includes('forecast')) return '🔮 Revenue forecast next quarter: $142M (+11.8%).';
  if (q.includes('theme')) return '🎨 Available: "Retro" and "Trendy". Go to Configuration to switch.';
  return '🤖 I can help with creating/editing products, bundles, and promotions, plus analytics and pricing. Try "Create a product" or "Suggest bundle combinations".';
};

const AIChatBot = () => {
  const location = useLocation();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const chatEndRef = useRef(null);

  const hiddenRoutes = [];
  const isHiddenRoute = hiddenRoutes.includes(location.pathname);

  const placeholder = contextPlaceholders[location.pathname] || 'Ask AI: "Create product", "New bundle", "Set up promo"...';
  const suggestions = useCaseSuggestions[location.pathname] || useCaseSuggestions['/dashboard'];

  useEffect(() => {
    if (chatEndRef.current && expanded) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, expanded]);

  const handleSend = useCallback((text) => {
    const query = text || message;
    if (!query.trim()) return;
    const response = getAIResponse(query, location.pathname);
    if (response.startsWith('__NAV__')) {
      const path = response.replace('__NAV__', '');
      setChatHistory((prev) => [...prev, { role: 'user', content: query.trim() }, { role: 'ai', content: `🚀 Navigating to ${path}...` }]);
      history.push(path);
    } else {
      setChatHistory((prev) => [...prev, { role: 'user', content: query.trim() }, { role: 'ai', content: response }]);
    }
    setMessage('');
    setShowSuggestions(false);
    if (!expanded) setExpanded(true);
  }, [message, expanded, location.pathname, history]);

  // AI Insights data based on current route context
  const getInsights = () => {
    const path = location.pathname;
    if (path.includes('/catalogue/products')) return [
      { icon: '📊', label: 'Top Product', value: 'OTT Streaming Basic', detail: '$127M revenue, 2.1% churn' },
      { icon: '📈', label: 'Growth Leader', value: 'Exclusive Premier', detail: '+31.2% subscribers MoM' },
      { icon: '⚠️', label: 'Needs Attention', value: 'Live Concert Pass', detail: '4.8% churn — recommend retention campaign' },
    ];
    if (path.includes('/catalogue/promotions')) return [
      { icon: '🎯', label: 'Best Performing', value: 'WELCOME20', detail: '34% conversion rate, 2.4K redemptions' },
      { icon: '💸', label: 'Highest ROI', value: 'Referral Program', detail: '5.2x return on spend' },
      { icon: '⏰', label: 'Expiring Soon', value: 'FLASH50', detail: 'Ends in 3 days — 890 uses remaining' },
    ];
    if (path.includes('/catalogue/bundles')) return [
      { icon: '📦', label: 'Top Bundle', value: 'Sports + Live Events', detail: '$24.99/mo, 42% attach rate' },
      { icon: '💡', label: 'Suggested', value: 'Entertainment + News', detail: 'Predicted 18% uptake in Q2' },
      { icon: '📉', label: 'Underperforming', value: 'Education Pack', detail: 'Only 2.1K subscribers — consider repricing' },
    ];
    if (path.includes('/support/tickets')) return [
      { icon: '🎫', label: 'Open Tickets', value: '24', detail: '6 critical, 12 high priority' },
      { icon: '⏱️', label: 'Avg Resolution', value: '2.4 hrs', detail: 'Down 18% from last week' },
      { icon: '🤖', label: 'Auto-resolved', value: '38%', detail: '14 tickets resolved by AI this week' },
    ];
    return [
      { icon: '📊', label: 'Revenue', value: '$127M', detail: '+8.2% MoM' },
      { icon: '👥', label: 'Subscribers', value: '6.8M', detail: '+12.4% growth' },
      { icon: '📉', label: 'Churn Rate', value: '2.4%', detail: 'Down 0.3% — healthy' },
    ];
  };

  const insights = getInsights();

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
              <>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-muted-tan)', textAlign: 'center', padding: '8px 0' }}>
                  AI-powered assistant — ask about products, analytics, or pricing
                </div>
                {/* AI Insights Panel */}
                <div style={{ padding: '8px 0' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-muted-tan)', marginBottom: 8 }}>✦ AI Insights</div>
                  {insights.map((insight, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '16px' }}>{insight.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted-tan)', fontFamily: 'var(--font-body)' }}>{insight.label}</span>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-on-dark)', fontFamily: 'var(--font-body)' }}>{insight.value}</span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-muted-tan)', fontFamily: 'var(--font-body)', marginTop: 2 }}>{insight.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
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
